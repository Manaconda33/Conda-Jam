import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(new URL('../..', import.meta.url).pathname);
const candidates = [
  ['00', 'attempt01-generated-raw'], ['01', 'attempt02-generated-raw'],
  ['02', 'attempt01-generated-raw'], ['03', 'attempt01-generated-raw'],
  ['04', 'attempt01-generated-raw'], ['06', 'attempt01-generated-raw'],
  ['07', 'attempt01-generated-raw'], ['09', 'attempt01-generated-raw'],
  ['10', 'attempt01-generated-raw'], ['12', 'attempt01-generated-raw'],
  ['13', 'attempt01-generated-raw'], ['14', 'attempt01-generated-raw'],
];
const result = [];
for (const [pose, suffix] of candidates) {
  const stem = `j127-leo-alley-oop-reverse-pose${pose}-${suffix}`;
  const source = `tools/generate-art/sources/${stem}.png`;
  const output = `tools/generate-art/sources/j127-leo-alley-oop-reverse-pose${pose}-selected-cleaned.png`;
  const sourcePath = path.join(root, source);
  const infoResult = spawnSync('identify', ['-format', '%w %h', sourcePath], { encoding: 'utf8' });
  const [width, height] = infoResult.stdout.trim().split(/\s+/).map(Number);
  let decoded;
  try {
    decoded = spawnSync('convert', [sourcePath, '-alpha', 'on', '-depth', '8', 'rgba:-'], { maxBuffer: width * height * 4 + 1024 }).stdout;
  } catch (error) {
    decoded = error.stdout;
  }
  const pixels = Buffer.from(decoded);
  if (pixels.length !== width * height * 4) throw new Error(`RGBA decode mismatch for pose ${pose}`);
  const seen = new Uint8Array(width * height), components = [];
  for (let i = 0; i < width * height; i++) {
    if (seen[i] || pixels[i * 4 + 3] === 0) { seen[i] = 1; continue; }
    const queue = [i], component = []; seen[i] = 1;
    while (queue.length) {
      const at = queue.pop(); component.push(at);
      const x = at % width, y = (at - x) / width;
      for (let yy = Math.max(0, y - 1); yy <= Math.min(height - 1, y + 1); yy++) for (let xx = Math.max(0, x - 1); xx <= Math.min(width - 1, x + 1); xx++) {
        const next = yy * width + xx;
        if (!seen[next] && pixels[next * 4 + 3] > 0) { seen[next] = 1; queue.push(next); }
        else if (!seen[next]) seen[next] = 1;
      }
    }
    components.push(component);
  }
  components.sort((a, b) => b.length - a.length);
  const keep = new Uint8Array(width * height);
  for (const at of components[0]) keep[at] = 1;
  let removed = 0;
  for (let i = 0; i < width * height; i++) if (!keep[i] && pixels[i * 4 + 3]) { pixels.fill(0, i * 4, i * 4 + 4); removed++; }
  const tempRgba = `/tmp/${path.basename(output)}.rgba`;
  await writeFile(tempRgba, pixels);
  const report = {
    poseIndex: Number(pose), rawSource: source, cleanedSource: output,
    sourceSha256: createHash('sha256').update(await readFile(sourcePath)).digest('hex'),
    width, height, rule: 'retain largest 8-connected nonzero-alpha silhouette component; remove all detached components; preserve raw source',
    componentCount: components.length, retainedComponentPixels: components[0].length,
    removedDetachedPixels: removed, removedComponentPixels: components.slice(1).map(component => component.length),
    tempRgba
  };
  result.push(report);
}
await writeFile(path.join(root, 'tools/generate-art/j127-selected-pose-cleanup-reports.json'), JSON.stringify(result, null, 2) + '\n');
for (const report of result) console.log(`${report.poseIndex}: ${report.componentCount} components; removed ${report.removedDetachedPixels} detached pixels; retained ${report.retainedComponentPixels}`);
