import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { decodeImage } from '../tools/animation-assets.mjs';
const names=['captain-gameplay-sprites','captain-portrait-atlas','captain-run-sprites-2','captain-run-sprites-3','captain-run-sprites','supporting-player-gameplay-sprites','supporting-player-portrait-atlas','supporting-player-run-sprites-2','supporting-player-run-sprites-3','supporting-player-run-sprites','team-crest-atlas'];
const root=new URL('../',import.meta.url),hash=bytes=>createHash('sha256').update(bytes).digest('hex');
for(const name of names)test(`${name} lossless derivative preserves every RGBA byte and reduces payload`,async()=>{
  const original=new URL(`public/assets/${name}.png`,root),derived=new URL(`public/assets/${name}-lossless.webp`,root);
  const [png,webp]=await Promise.all([decodeImage(original.pathname),decodeImage(derived.pathname)]);
  assert.equal(webp.width,png.width);assert.equal(webp.height,png.height);
  assert.deepEqual(webp.pixels,png.pixels,'including partially and fully transparent pixels');
  const report=JSON.parse(await readFile(new URL('docs/LOSSLESS_ATLAS_PROVENANCE.json',root),'utf8'));
  const entry=report.assets.find(asset=>asset.name===name);assert.ok(entry,'derivative has reproducible provenance');
  assert.equal(png.sha256,entry.originalSha256);assert.equal(webp.sha256,entry.derivativeSha256);assert.equal(hash(webp.pixels),entry.rgbaSha256);
  assert.ok((await readFile(derived)).length<(await readFile(original)).length);
});
test('browser runtime and offline build both select committed lossless derivatives',async()=>{
  const [main,build]=await Promise.all(['src/main.js','tools/build.mjs'].map(file=>readFile(new URL(file,root),'utf8')));
  for(const name of names){assert.ok(main.includes(`./public/assets/${name}-lossless.webp`),`runtime loads ${name}`);assert.ok(build.includes(`${name}-lossless.webp`),`build embeds ${name}`);assert.ok(!main.includes(`./public/assets/${name}.png`));}
  assert.doesNotMatch(build,/execFile|spawn|convert|ImageMagick/,'deployment build needs no image encoder');
});
