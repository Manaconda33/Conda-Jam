import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(new URL('../..', import.meta.url).pathname);
const cases = [
  ['block', 'leo-block-right.webp', 'leo-block4-layouts.json'],
  ['push', 'leo-push-right.webp', 'leo-push11-layouts.json'],
  ['fall', 'leo-fall-right.webp', 'leo-fall10-layouts.json'],
  ['celebrate', 'leo-celebrate-right.webp', 'leo-celebrate10-layouts.json'],
];
const componentLimit = 6;
const report = { athlete: 'leo', sourceClassification: 'original-authored', operation: 'remove detached alpha components, exterior haze, and isolated non-canon chromatic edge pixels from copied atlas cells', componentLimit, clips: [] };

for (const [clip, filename, layoutFile] of cases) {
  const sourcePath = `public/assets/animation/${filename}`;
  const outputPath = `public/assets/animation/leo-${clip}-captain-reviewed-right.webp`;
  const layoutPath = `tools/generate-art/${layoutFile}`;
  const layout = JSON.parse(await readFile(path.join(root, layoutPath), 'utf8'))[0];
  const info = execFileSync('identify', ['-format', '%w %h', path.join(root, sourcePath)], { encoding: 'utf8' }).trim().split(/\s+/).map(Number);
  const [width, height] = info;
  const rgba = execFileSync('convert', [path.join(root, sourcePath), '-alpha', 'on', '-depth', '8', 'rgba:-'], { maxBuffer: width * height * 4 + 1024 });
  if (rgba.length !== width * height * 4) throw new Error(`RGBA decode size mismatch for ${clip}`);
  const pixels = Buffer.from(rgba);
  const clipReport = { clip, source: sourcePath, output: outputPath, width, height, sourceFrames: layout.frames.length, removed: [] };
  clipReport.sourceSha256 = createHash('sha256').update(await readFile(path.join(root, sourcePath))).digest('hex');

  for (let frameIndex = 0; frameIndex < layout.frames.length; frameIndex++) {
    const frame = layout.frames[frameIndex];
    const seen = new Uint8Array(frame.w * frame.h);
    const solid = new Uint8Array(frame.w * frame.h);
    let fringeRemoved = 0;
    let chromaRemoved = 0;
    for (let y = 0; y < frame.h; y++) for (let x = 0; x < frame.w; x++) {
      const offset = ((frame.y + y) * width + frame.x + x) * 4;
      solid[y * frame.w + x] = pixels[offset + 3] >= 224 ? 1 : 0;
    }
    // Preserve the crisp opaque sprite and a one-pixel antialias edge. Generated
    // sheets also contain detached colored flecks joined to silhouettes by haze.
    // Keep partial-alpha pixels only when they touch the solid silhouette;
    // remove all exterior haze/flecks beyond that one-pixel boundary. Source
    // images remain untouched for recovery and provenance.
    for (let y = 0; y < frame.h; y++) for (let x = 0; x < frame.w; x++) {
      const local = y * frame.w + x;
      const offset = ((frame.y + y) * width + frame.x + x) * 4;
      const alpha = pixels[offset + 3];
      if (alpha === 0 || solid[local]) continue;
      let nearSolid = false;
      for (let ny = Math.max(0, y - 1); ny <= Math.min(frame.h - 1, y + 1) && !nearSolid; ny++) {
        for (let nx = Math.max(0, x - 1); nx <= Math.min(frame.w - 1, x + 1); nx++) {
          if (solid[ny * frame.w + nx]) { nearSolid = true; break; }
        }
      }
      if (!nearSolid) { pixels.fill(0, offset, offset + 4); fringeRemoved++; }
    }
    // Leo's canon palette contains pale skin, black hair/kit, crimson accents,
    // and neutral highlights. Generated isolated cyan/green/magenta/yellow
    // edge pixels are contamination; retain a chromatic mark only when it is
    // part of a local cluster, avoiding changes to isolated antialias pixels.
    const chroma = (offset) => {
      const r = pixels[offset], g = pixels[offset + 1], b = pixels[offset + 2], a = pixels[offset + 3];
      if (a < 128) return false;
      return (g > r * 1.25 && g > b * 1.15 && g > 90) ||
        (b > r * 1.15 && b > g * 1.15 && b > 100) ||
        (r > 150 && b > 105 && g < 105 && b - g > 30) ||
        (r > 200 && g > 155 && b < 75);
    };
    const marked = new Uint8Array(frame.w * frame.h);
    for (let y = 0; y < frame.h; y++) for (let x = 0; x < frame.w; x++) {
      const local = y * frame.w + x;
      if (chroma(((frame.y + y) * width + frame.x + x) * 4)) marked[local] = 1;
    }
    for (let y = 0; y < frame.h; y++) for (let x = 0; x < frame.w; x++) {
      const local = y * frame.w + x;
      if (!marked[local]) continue;
      let neighbors = 0;
      for (let ny = Math.max(0, y - 1); ny <= Math.min(frame.h - 1, y + 1); ny++) for (let nx = Math.max(0, x - 1); nx <= Math.min(frame.w - 1, x + 1); nx++) if ((nx !== x || ny !== y) && marked[ny * frame.w + nx]) neighbors++;
      if (neighbors < 2) {
        const offset = ((frame.y + y) * width + frame.x + x) * 4;
        pixels.fill(0, offset, offset + 4);
        chromaRemoved++;
      }
    }
    const small = [];
    for (let y = 0; y < frame.h; y++) for (let x = 0; x < frame.w; x++) {
      const start = y * frame.w + x;
      if (seen[start]) continue;
      const global = ((frame.y + y) * width + frame.x + x) * 4;
      if (pixels[global + 3] === 0) { seen[start] = 1; continue; }
      const queue = [start], component = [];
      seen[start] = 1;
      while (queue.length) {
        const local = queue.pop();
        component.push(local);
        const cx = local % frame.w, cy = (local - cx) / frame.w;
        for (let ny = Math.max(0, cy - 1); ny <= Math.min(frame.h - 1, cy + 1); ny++) {
          for (let nx = Math.max(0, cx - 1); nx <= Math.min(frame.w - 1, cx + 1); nx++) {
            const next = ny * frame.w + nx;
            if (seen[next]) continue;
            const offset = ((frame.y + ny) * width + frame.x + nx) * 4;
            if (pixels[offset + 3] > 0) { seen[next] = 1; queue.push(next); }
            else seen[next] = 1;
          }
        }
      }
      if (component.length <= componentLimit) small.push(...component);
    }
    if (small.length) {
      for (const local of small) {
        const x = local % frame.w, y = (local - x) / frame.w;
        const offset = ((frame.y + y) * width + frame.x + x) * 4;
        pixels.fill(0, offset, offset + 4);
      }
      clipReport.removed.push({ frame: frameIndex, pixels: small.length });
    }
    if (fringeRemoved) clipReport.fringeRemoved ??= [];
    if (fringeRemoved) clipReport.fringeRemoved.push({ frame: frameIndex, pixels: fringeRemoved });
    if (chromaRemoved) clipReport.chromaRemoved ??= [];
    if (chromaRemoved) clipReport.chromaRemoved.push({ frame: frameIndex, pixels: chromaRemoved });
  }

  execFileSync('convert', ['-size', `${width}x${height}`, '-depth', '8', 'rgba:-', '-define', 'webp:lossless=true', path.join(root, outputPath)], { input: pixels, maxBuffer: width * height * 8 + 1024 });
  clipReport.outputSha256 = execFileSync('sha256sum', [path.join(root, outputPath)], { encoding: 'utf8' }).trim().split(/\s+/)[0];
  report.clips.push(clipReport);
}

await writeFile(path.join(root, 'tools/generate-art/leo-captain-cleanup-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
