import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { access, mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { teams } from '../src/content/teams.js';
import { animationClips } from '../src/core/animation.js';
import { decodeImage, inspectAtlas, inspectFrames, targetFrameCount } from './animation-assets.mjs';

const exec = promisify(execFile);
export const rosterAnimationGroups = {
  captains: { columns: 7, rows: 5, athletes: teams.map(team => team.roster[0]) },
  supporting: { columns: 10, rows: 7, athletes: teams.flatMap(team => team.roster.slice(1)) },
};
export function sourceCell(width, height, columns, rows, index) {
  const col = index % columns, row = Math.floor(index / columns);
  const x = Math.floor(col * width / columns), y = Math.floor(row * height / rows);
  return { x, y, w: Math.floor((col + 1) * width / columns) - x, h: Math.floor((row + 1) * height / rows) - y };
}
function touchesBorder(image, cell) {
  const alpha = (x, y) => image.pixels[((cell.y + y) * image.width + cell.x + x) * 4 + 3];
  for (let x = 0; x < cell.w; x++) if (alpha(x, 0) || alpha(x, cell.h - 1)) return true;
  for (let y = 0; y < cell.h; y++) if (alpha(0, y) || alpha(cell.w - 1, y)) return true;
  return false;
}
async function exists(filename) { try { await access(filename); return true; } catch (error) { if (error.code === 'ENOENT') return false; throw error; } }

/** Packs only existing authored drawings. Never registers or approves output. */
export async function packRosterAnimation({ jobs, root, groups = rosterAnimationGroups, clips = animationClips, overwrite = false }) {
  if (!Array.isArray(jobs) || jobs.length === 0) throw new Error('Expected a nonempty source jobs array');
  const batches = new Map();
  for (const job of jobs) {
    if(job.eligibleForPacking===false||job.review?.status==='rejected')throw new Error('Source job rejected during visual review cannot be packed');
    if (!groups[job.group] || !clips[job.clip] || !Number.isInteger(job.frame) || job.frame < 0 || typeof job.path !== 'string' || (typeof job.prompt !== 'string' || !job.prompt.trim()) || !Number.isFinite(Date.parse(job.generatedAt))) throw new Error('Invalid source job metadata');
    const key = `${job.group}/${job.clip}`;
    if (!batches.has(key)) batches.set(key, []);
    batches.get(key).push(job);
  }
  // Reject incomplete batches before producing any output.
  for (const [key, entries] of batches) {
    entries.sort((a, b) => a.frame - b.frame);
    const required = targetFrameCount(clips[entries[0].clip]);
    if (entries.length !== required || entries.some((job, index) => job.frame !== index)) throw new Error(`${key}: expected exactly source frames 0..${required - 1}, with no holes or duplicates`);
  }
  const report = { version: 1, generatedAt: new Date().toISOString(), packed: [], skipped: [], rejected: [], warnings: [], layouts: [] };
  const temp = await mkdtemp(path.join(root, '.roster-pack-'));
  try {
    for (const [key, entries] of batches) {
      const { group, clip } = entries[0], grid = groups[group];
      if (!Number.isInteger(grid.columns) || !Number.isInteger(grid.rows) || grid.columns < 1 || grid.rows < 1 || !Array.isArray(grid.athletes) || grid.athletes.length !== grid.columns * grid.rows) throw new Error(`${key}: roster length must exactly fill the source grid`);
      const sources = [];
      for (const job of entries) {
        const filename = path.resolve(root, job.path), image = await decodeImage(filename);
        if (image.width < grid.columns || image.height < grid.rows) throw new Error(`${key}: image is smaller than source grid`);
        if (sources.length) {
          for (const axis of ['width', 'height']) {
            const values = [...sources.map(source => source.image[axis]), image[axis]], minimum = Math.min(...values), maximum = Math.max(...values);
            if (maximum - minimum > minimum * .01 + Number.EPSILON) throw new Error(`${key}: source sheets must share dimensions within 1% to preserve frame scale`);
          }
          if (image.width !== sources[0].image.width || image.height !== sources[0].image.height) report.warnings.push({ code: 'source-grid-dimension-variation', group, clip, frame: job.frame, width: image.width, height: image.height, referenceWidth: sources[0].image.width, referenceHeight: sources[0].image.height });
        }
        const cells = grid.athletes.map((_, index) => sourceCell(image.width, image.height, grid.columns, grid.rows, index));
        const inspected = inspectFrames(image, cells);
        for (const [index, actual] of inspected.entries()) {
          const athlete = typeof grid.athletes[index] === 'string' ? grid.athletes[index] : grid.athletes[index].id;
          if (actual.error || !actual.visiblePixels) throw new Error(`${key}: blank or invalid source cell ${index} (${athlete}), frame ${job.frame}`);
          if (touchesBorder(image, cells[index])) report.warnings.push({ code: 'source-cell-border-contact', group, clip, athlete, frame: job.frame, source: job.path });
          if (actual.visiblePixels === cells[index].w * cells[index].h) report.warnings.push({ code: 'source-cell-no-transparent-padding', group, clip, athlete, frame: job.frame, source: job.path });
        }
        sources.push({ job, filename, image, cells, inspected });
      }
      const sharedW = Math.max(...sources.map(source => Math.ceil(source.image.width / grid.columns))), sharedH = Math.max(...sources.map(source => Math.ceil(source.image.height / grid.rows)));
      const columns = Math.ceil(Math.sqrt(entries.length)), rows = Math.ceil(entries.length / columns);
      const frames = entries.map((_, index) => ({ x: (index % columns) * 64, y: Math.floor(index / columns) * 96, w: 64, h: 96 }));
      const layouts = [];
      for (const [index, athleteDef] of grid.athletes.entries()) {
        const athlete = typeof athleteDef === 'string' ? athleteDef : athleteDef.id;
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(athlete)) throw new Error('Unsafe athlete ID');
        const src = `./public/assets/animation/${athlete}-${clip}-right.webp`, output = path.resolve(root, src);
        if (!overwrite && await exists(output)) { report.skipped.push({ athlete, clip, src, reason: 'existing-output; use --overwrite explicitly' }); continue; }
        const sourceHashGroups = new Map();
        for (const [frameIndex, source] of sources.entries()) {
          const hash = source.inspected[index].hash;
          if (!sourceHashGroups.has(hash)) sourceHashGroups.set(hash, []);
          sourceHashGroups.get(hash).push(frameIndex);
        }
        const duplicateSources = [...sourceHashGroups.values()].filter(indices => indices.length > 1);
        if (duplicateSources.length) { report.rejected.push({ athlete, clip, reason: 'duplicate decoded source drawings', duplicateFrameGroups: duplicateSources }); continue; }
        try {
        const args = [];
        for (const [frameIndex, source] of sources.entries()) {
          const cell = source.cells[index];
          args.push('(', source.filename, '-gravity', 'NorthWest', '-crop', `${cell.w}x${cell.h}+${cell.x}+${cell.y}`, '+repage', '-background', 'none', '-gravity', 'NorthWest', '-extent', `${sharedW}x${sharedH}`, '-resize', '64x88', '-gravity', 'South', '-extent', '64x94', '-gravity', 'North', '-extent', '64x96', ')', '-write', `mpr:f${frameIndex}`, '+delete');
        }
        args.push('-size', `${columns * 64}x${rows * 96}`, 'canvas:none');
        for (const [frameIndex, frame] of frames.entries()) args.push(`mpr:f${frameIndex}`, '-gravity', 'NorthWest', '-geometry', `+${frame.x}+${frame.y}`, '-composite');
        const staging = path.join(temp, `${athlete}-${clip}.webp`);
        args.push('-quality', '82', '-define', 'webp:lossless=false', staging);
        await exec('convert', args, { maxBuffer: 1024 * 1024 });
        const actual = await inspectAtlas(staging, frames);
        const blankFrames = actual.frames.filter(frame => frame.error || !frame.visiblePixels).map(frame => frame.index), outputHashGroups = new Map();
        for (const frame of actual.frames) { if (!outputHashGroups.has(frame.hash)) outputHashGroups.set(frame.hash, []); outputHashGroups.get(frame.hash).push(frame.index); }
        const duplicateFrameGroups = [...outputHashGroups.values()].filter(indices => indices.length > 1);
        if (blankFrames.length || duplicateFrameGroups.length) { report.rejected.push({ athlete, clip, reason: 'encoded output has blank or duplicate frames', blankFrames, duplicateFrameGroups }); continue; }
        await mkdir(path.dirname(output), { recursive: true });
        await rename(staging, output);
        const provenance = { prompt: entries.map(job => `frame ${job.frame}: ${job.prompt}`).join('\n'), generatedAt: entries[0].generatedAt, packer: 'tools/pack-roster-animation.mjs', transform: { cellWidth: 64, cellHeight: 96, fitWidth: 64, fitHeight: 88, baseline: 94, sharedSourceWidth: sharedW, sharedSourceHeight: sharedH, maxSourceDimensionVariation: .01 }, sourceFrames: sources.map(source => ({ frame: source.job.frame, path: source.job.path, sha256: source.image.sha256, width: source.image.width, height: source.image.height, crop: source.cells[index], cropHash: source.inspected[index].hash, prompt: source.job.prompt, generatedAt: source.job.generatedAt })) };
        const layout = { athlete, direction: 'right', clip, src, columns, rows, frames: actual.frames.map(({ index: frameIndex, visiblePixels, ...frame }) => frame), sha256: actual.sha256, provenance, reviewed: false };
        layouts.push(layout); report.packed.push({ athlete, clip, src, frames: entries.length });
        } catch (error) { report.rejected.push({ athlete, clip, reason: 'character-pack-failed', message: error.message }); }
      }
      const layoutFile = path.resolve(root, `tools/generate-art/layouts-${group}-${clip}.json`);
      if (layouts.length) {
        await mkdir(path.dirname(layoutFile), { recursive: true });
        let prior = [];
        if (await exists(layoutFile)) { prior = JSON.parse(await readFile(layoutFile, 'utf8')); if (!Array.isArray(prior)) throw new Error(`Invalid existing layout array: ${layoutFile}`); }
        const changed = new Set(layouts.map(layout => layout.athlete));
        await writeFile(layoutFile, `${JSON.stringify([...prior.filter(layout => !changed.has(layout.athlete)), ...layouts], null, 2)}\n`);
      }
      report.layouts.push({ group, clip, path: layoutFile, written: layouts.length });
    }
  } finally { await rm(temp, { recursive: true, force: true }); }
  report.ok = report.rejected.length === 0;
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), jobsFile = args.find(arg => !arg.startsWith('--'));
  if (!jobsFile) throw new Error('Usage: node tools/pack-roster-animation.mjs jobs.json [--overwrite]');
  const root = fileURLToPath(new URL('..', import.meta.url));
  const jobs = JSON.parse(await readFile(path.resolve(jobsFile), 'utf8'));
  const report = await packRosterAnimation({ jobs, root, overwrite: args.includes('--overwrite') });
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
}
