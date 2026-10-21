import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { packRosterAnimation, sourceCell } from '../tools/pack-roster-animation.mjs';
import { decodeImage } from '../tools/animation-assets.mjs';
const exec = promisify(execFile);
async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'roster-pack-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const jobs = [];
  // Two genuine fixture drawings per athlete, with a non-divisible 15x8 sheet.
  for (let frame = 0; frame < 2; frame++) {
    const filename = path.join(root, `source-${frame}.png`);
    await exec('convert', ['-size', '15x8', 'canvas:none', '-fill', 'red', '-draw', `rectangle ${frame},1 ${frame+2},6`, '-fill', 'blue', '-draw', `rectangle ${9+frame},2 ${11+frame},6`, filename]);
    jobs.push({ group: 'fixture', clip: 'run', frame, path: filename, prompt: `test-only drawing ${frame}`, generatedAt: '2026-10-21T00:00:00Z' });
  }
  const options = { root, jobs, groups: { fixture: { columns: 2, rows: 1, athletes: ['first', 'second'] } }, clips: { run: 2 } };
  return { root, jobs, options, pack: () => packRosterAnimation(options) };
}
test('source crops use floor edges for non-square and non-divisible images', () => {
  assert.deepEqual(sourceCell(15, 8, 2, 1, 0), { x: 0, y: 0, w: 7, h: 8 });
  assert.deepEqual(sourceCell(15, 8, 2, 1, 1), { x: 7, y: 0, w: 8, h: 8 });
});
test('packs two athletes with stable 64x96 cells, provenance and border warnings; no registration', async t => {
  const f = await fixture(t), report = await f.pack();
  assert.equal(report.packed.length, 2); assert.equal(report.skipped.length, 0);
  assert.ok(report.warnings.some(warning => warning.code === 'source-cell-border-contact' && warning.athlete === 'first' && warning.frame === 0));
  const layouts = JSON.parse(await readFile(report.layouts[0].path, 'utf8'));
  assert.equal(layouts.length, 2);
  for (const layout of layouts) {
    assert.equal(layout.reviewed, false); assert.equal(layout.frames.length, 2);
    assert.notEqual(layout.frames[0].hash, layout.frames[1].hash);
    assert.equal(layout.provenance.sourceFrames.length, 2);
    assert.ok(layout.provenance.sourceFrames.every(frame => frame.sha256.length === 64 && frame.cropHash.length === 64));
    const image = await decodeImage(path.resolve(f.root, layout.src));
    assert.equal(image.width, 128); assert.equal(image.height, 96);
    for (let y = 94; y < 96; y++) for (let x = 0; x < image.width; x++) assert.equal(image.pixels[(y * image.width + x) * 4 + 3], 0, 'two bottom rows remain transparent');
  }
  await assert.rejects(readFile(path.join(f.root, 'public/assets/animation/manifest.json')), { code: 'ENOENT' });
});
test('existing output is skipped by default and explicit overwrite regenerates it', async t => {
  const f = await fixture(t); await f.pack();
  const before = await readFile(path.join(f.root, 'public/assets/animation/first-run-right.webp'));
  const skipped = await f.pack(); assert.equal(skipped.skipped.length, 2); assert.equal(skipped.packed.length, 0);
  assert.deepEqual(await readFile(path.join(f.root, 'public/assets/animation/first-run-right.webp')), before);
  const overwritten = await packRosterAnimation({ ...f.options, overwrite: true }); assert.equal(overwritten.packed.length, 2);
  assert.equal(JSON.parse(await readFile(overwritten.layouts[0].path, 'utf8')).length, 2);
});
test('rejects incomplete or duplicate source frame indices before writing assets', async t => {
  const f = await fixture(t);
  await assert.rejects(packRosterAnimation({ ...f.options, jobs: f.jobs.slice(0, 1) }), /no holes or duplicates/);
  await assert.rejects(packRosterAnimation({ ...f.options, jobs: [f.jobs[0], f.jobs[0]] }), /no holes or duplicates/);
});
test('refuses source jobs explicitly rejected during visual review', async t => {
  const f = await fixture(t);
  await assert.rejects(packRosterAnimation({ ...f.options, jobs: f.jobs.map(job=>({...job,eligibleForPacking:false})) }), /rejected.*review/i);
});
test('rejects blank cells, wrong roster grid size, and mismatched sheet dimensions', async t => {
  const f = await fixture(t);
  await assert.rejects(packRosterAnimation({ ...f.options, groups: { fixture: { columns: 2, rows: 1, athletes: ['first'] } } }), /exactly fill/);
  await exec('convert', ['-size', '15x8', 'canvas:none', f.jobs[1].path]);
  await assert.rejects(f.pack(), /blank or invalid source cell/);
  await exec('convert', ['-size', '16x8', 'canvas:red', f.jobs[1].path]);
  await assert.rejects(f.pack(), /share dimensions/);
});
test('rejects identical decoded source drawings rather than inventing missing poses', async t => {
  const f = await fixture(t);
  const report = await packRosterAnimation({ ...f.options, jobs: [f.jobs[0], { ...f.jobs[0], frame: 1 }] });
  assert.equal(report.ok, false); assert.equal(report.packed.length, 0); assert.equal(report.rejected.length, 2);
  assert.deepEqual(report.rejected[0].duplicateFrameGroups, [[0,1]]);
});
test('accepts source dimension variation up to 1% and retains actual per-source dimensions', async t => {
  const f = await fixture(t);
  await exec('convert', [f.jobs[0].path, '-resize', '200x100!', f.jobs[0].path]);
  await exec('convert', [f.jobs[1].path, '-resize', '201x101!', f.jobs[1].path]);
  const report = await f.pack();
  assert.equal(report.packed.length, 2);
  assert.ok(report.warnings.some(warning => warning.code === 'source-grid-dimension-variation'));
  const layouts = JSON.parse(await readFile(report.layouts[0].path, 'utf8'));
  assert.deepEqual(layouts[0].provenance.sourceFrames.map(source => [source.width, source.height]), [[200,100],[201,101]]);
  assert.equal(layouts[0].provenance.transform.sharedSourceWidth, 101);
  assert.equal(layouts[0].provenance.transform.sharedSourceHeight, 101);
});
test('every frame crops with explicit top-left gravity, preserving the intended athlete', async t => {
  const f = await fixture(t), report = await f.pack();
  const layouts = JSON.parse(await readFile(report.layouts[0].path, 'utf8'));
  for (const layout of layouts) {
    const image = await decodeImage(path.resolve(f.root, layout.src));
    for (const frame of layout.frames) {
      let red = 0, blue = 0;
      for (let y = frame.y; y < frame.y + frame.h; y++) for (let x = frame.x; x < frame.x + frame.w; x++) {
        const offset = (y * image.width + x) * 4;
        if (image.pixels[offset + 3]) { red += image.pixels[offset]; blue += image.pixels[offset + 2]; }
      }
      assert.ok(layout.athlete === 'first' ? red > blue * 3 : blue > red * 3, `${layout.athlete} frame at ${frame.x} preserves its source cell identity`);
    }
  }
});
test('keeps valid athletes and their layouts while reporting exact rejected frame groups', async t => {
  const f = await fixture(t);
  await exec('convert', ['-size', '15x8', 'canvas:none', '-fill', 'red', '-draw', 'rectangle 1,1 3,6', '-fill', 'blue', '-draw', 'rectangle 9,2 11,6', f.jobs[1].path]);
  const report = await f.pack();
  assert.equal(report.ok, false); assert.equal(report.packed.length, 1); assert.equal(report.rejected.length, 1);
  assert.equal(report.rejected[0].athlete, 'second'); assert.deepEqual(report.rejected[0].duplicateFrameGroups, [[0,1]]);
  const layouts = JSON.parse(await readFile(report.layouts[0].path, 'utf8'));
  assert.deepEqual(layouts.map(layout => layout.athlete), ['first']);
  await assert.rejects(readFile(path.join(f.root, 'public/assets/animation/second-run-right.webp')), { code: 'ENOENT' });
});
