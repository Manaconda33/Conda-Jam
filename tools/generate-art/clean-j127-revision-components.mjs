import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(new URL('../..', import.meta.url).pathname);
const revisions = [[2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 2], [8, 1]];
const reports = [];
for (const [pose, attempt] of revisions) {
  const id = String(pose).padStart(2, '0');
  const raw = `tools/generate-art/sources/j127-leo-alley-oop-reverse-pose${id}-revision-attempt${String(attempt).padStart(2, '0')}-generated-raw.png`;
  const cleaned = `tools/generate-art/sources/j127-leo-alley-oop-reverse-pose${id}-revision-attempt${String(attempt).padStart(2, '0')}-cleaned.png`;
  const sourcePath = path.join(root, raw), [width, height] = [1254, 1254];
  let decoded;
  try { decoded = spawnSync('convert', [sourcePath, '-alpha', 'on', '-depth', '8', 'rgba:-'], { maxBuffer: width * height * 4 + 1024 }).stdout; }
  catch (error) { decoded = error.stdout; }
  const pixels = Buffer.from(decoded);
  if (pixels.length !== width * height * 4) throw new Error(`RGBA decode mismatch: ${raw}`);
  const seen = new Uint8Array(width * height), components = [];
  for (let i = 0; i < width * height; i++) {
    if (seen[i] || !pixels[i * 4 + 3]) { seen[i] = 1; continue; }
    const queue = [i], component = []; seen[i] = 1;
    while (queue.length) {
      const at = queue.pop(); component.push(at); const x = at % width, y = (at - x) / width;
      for (let yy = Math.max(0, y - 1); yy <= Math.min(height - 1, y + 1); yy++) for (let xx = Math.max(0, x - 1); xx <= Math.min(width - 1, x + 1); xx++) {
        const next = yy * width + xx;
        if (!seen[next] && pixels[next * 4 + 3]) { seen[next] = 1; queue.push(next); }
        else if (!seen[next]) seen[next] = 1;
      }
    }
    components.push(component);
  }
  components.sort((a, b) => b.length - a.length);
  const keep = new Uint8Array(width * height); for (const at of components[0]) keep[at] = 1;
  let removed = 0; for (let i = 0; i < width * height; i++) if (!keep[i] && pixels[i * 4 + 3]) { pixels.fill(0, i * 4, i * 4 + 4); removed++; }
  const tempRgba = `/tmp/j127-pose${id}-revision-attempt${String(attempt).padStart(2, '0')}-cleaned.rgba`;  await writeFile(tempRgba, pixels);
  reports.push({ poseIndex: pose, attempt, rawSource: raw, cleanedSource: cleaned, sourceSha256: createHash('sha256').update(await readFile(sourcePath)).digest('hex'), dimensions: [width, height], rule: 'retain largest 8-connected nonzero-alpha silhouette; remove detached components only; preserve raw', componentCount: components.length, retainedComponentPixels: components[0].length, removedDetachedPixels: removed, removedComponentPixels: components.slice(1).map(x => x.length), tempRgba });
  console.log(`pose${id} attempt${attempt}: ${components.length} components; removed ${removed} detached pixels`);
}
await writeFile(path.join(root, 'tools/generate-art/j127-revision-cleanup-reports.json'), JSON.stringify(reports, null, 2) + '\n');
