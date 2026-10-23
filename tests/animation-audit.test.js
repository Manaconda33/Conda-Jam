import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { deflateSync } from 'node:zlib';
import { auditManifest, inspectAtlas, inspectFrames } from '../tools/animation-assets.mjs';

// A minimal fixture PNG encoder avoids relying on source art or JSON supplied hashes.
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) { crc ^= byte; for (let n = 0; n < 8; n++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1)); }
  return (crc ^ 0xffffffff) >>> 0;
}
function png(width, height, pixels) {
  const chunk = (type, data) => {
    const body = Buffer.concat([Buffer.from(type), data]), size = Buffer.alloc(4), crc = Buffer.alloc(4);
    size.writeUInt32BE(data.length); crc.writeUInt32BE(crc32(body));
    return Buffer.concat([size, body, crc]);
  };
  const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6;
  const rows = Array.from({ length: height }, (_, y) => Buffer.concat([Buffer.from([0]), pixels.subarray(y * width * 4, (y + 1) * width * 4)]));
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', header), chunk('IDAT', deflateSync(Buffer.concat(rows))), chunk('IEND', Buffer.alloc(0))]);
}
const frames = [{ x: 0, y: 0, w: 2, h: 2 }, { x: 2, y: 0, w: 2, h: 2 }];
async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'animation-audit-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'public/assets/animation'), { recursive: true });
  const pixels = Buffer.alloc(4 * 2 * 4);
  for (let y = 0; y < 2; y++) for (let x = 0; x < 4; x++) pixels.set([x < 2 ? 255 : 0, x < 2 ? 0 : 255, 0, 255], (y * 4 + x) * 4);
  const src = './public/assets/animation/fixture.png';
  await writeFile(path.resolve(root, src), png(4, 2, pixels));
  const actual = await inspectAtlas(path.resolve(root, src), frames);
  const clip = { src, columns: 2, rows: 1, frames: actual.frames.map(({ index, visiblePixels, ...frame }) => frame), sha256: actual.sha256, source: 'imagegen', reviewed: true, provenance: { prompt: 'fixture only', generatedAt: '2026-10-21T00:00:00Z' } };
  const manifest = { version: 1, characters: { fixture: { mirrorSafe: true, mirrorReview: { status: 'reviewed', notes: 'Fixture has no asymmetric markings.' }, directions: { right: { run: clip } } } } };
  return { root, manifest, clip, actual, audit: () => auditManifest({ root, manifest, athletes: ['fixture'], clips: { run: { frames: [{ duration: 50 }, { duration: 50 }] } } }) };
}

test('audit decodes a non-square image, crops rows correctly and accepts complete distinct frames', async t => {
  const f = await fixture(t), report = await f.audit();
  assert.equal(report.ok, true, JSON.stringify(report.errors));
  assert.equal(f.actual.width, 4); assert.equal(f.actual.height, 2);
  assert.notEqual(f.actual.frames[0].hash, f.actual.frames[1].hash);
});
test('duplicate crops cannot be disguised using fabricated frame hashes', async t => {
  const f = await fixture(t); f.clip.frames[1] = { ...f.clip.frames[0], hash: 'fake' };
  const codes = (await f.audit()).errors.map(error => error.code);
  assert.ok(codes.includes('duplicate-frame')); assert.ok(codes.includes('frame-hash-mismatch')); assert.ok(codes.includes('insufficient-distinct-frames'));
});
test('blank crops and out-of-bounds integer or fractional crops are rejected', () => {
  const image = { width: 4, height: 2, pixels: Buffer.alloc(32, 0) };
  const actual = inspectFrames(image, [...frames, { x: 3, y: 0, w: 2, h: 2 }, { x: .5, y: 0, w: 1, h: 1 }]);
  assert.equal(actual[0].visiblePixels, 0); assert.equal(actual[2].error, 'frame-bounds'); assert.equal(actual[3].error, 'frame-bounds');
});
test('audit rejects transparent crops in decoded files', async t => {
  const f = await fixture(t);
  await writeFile(path.resolve(f.root, f.clip.src), png(4, 2, Buffer.alloc(32)));
  const codes = (await f.audit()).errors.map(error => error.code);
  assert.ok(codes.includes('blank-frame')); assert.ok(codes.includes('source-hash-mismatch'));
});
test('missing files and frame count deficits are reported', async t => {
  const f = await fixture(t); f.clip.src = './public/assets/animation/missing.webp'; f.clip.frames.pop();
  const codes = (await f.audit()).errors.map(error => error.code);
  assert.ok(codes.includes('image-unreadable')); assert.ok(codes.includes('insufficient-frames'));
});
test('pending mirror reviews fail and unsafe mirroring requires left direction', async t => {
  const f = await fixture(t), character = f.manifest.characters.fixture;
  character.mirrorReview.status = 'pending'; character.mirrorSafe = false;
  const codes = (await f.audit()).errors.map(error => error.code);
  assert.ok(codes.includes('mirror-review-required')); assert.ok(codes.includes('missing-clip'));
});
test('alpha-zero RGB does not manufacture distinct visible drawings', () => {
  const pixels = Buffer.from([255, 0, 0, 0, 0, 255, 0, 0]);
  const actual = inspectFrames({ width: 2, height: 1, pixels }, [{ x: 0, y: 0, w: 1, h: 1 }, { x: 1, y: 0, w: 1, h: 1 }]);
  assert.equal(actual[0].hash, actual[1].hash);
});
test('invalid manifest and missing athletes produce explicit findings', async () => {
  const report = await auditManifest({ root: '/tmp', manifest: undefined, athletes: ['fixture'], clips: { run: 2 } });
  assert.equal(report.ok, false);
  assert.deepEqual(report.errors.map(error => error.code), ['manifest-schema', 'missing-character']);
  assert.equal(report.requiredFramesMinimum, 2);
});
test('source approval, provenance, grid and malformed frame metadata cannot pass', async t => {
  const f = await fixture(t); f.clip.reviewed = false; f.clip.provenance.prompt = 1; f.clip.rows = 0; f.clip.frames[0] = null;
  const codes = (await f.audit()).errors.map(error => error.code);
  for (const code of ['clip-review-required', 'provenance-required', 'invalid-grid', 'frame-bounds']) assert.ok(codes.includes(code), code);
});
test('strict audit flags a reconstructed rather than verbatim source prompt', async t => {
  const f = await fixture(t); f.clip.provenance.promptVerbatim = false;
  const codes = (await f.audit()).errors.map(error => error.code);
  assert.ok(codes.includes('prompt-not-verbatim'));
});
test('minimum-approved clips pass with an explicit higher-target shortfall', async t => {
  const f = await fixture(t);
  const report = await auditManifest({ root: f.root, manifest: f.manifest, athletes: ['fixture'], clips: { run: { minimumUniqueFrames: 2, frames: [{ duration: 2 }, { duration: 2 }, { duration: 2 }] } } });
  assert.equal(report.ok, true, JSON.stringify(report.errors));
  assert.equal(report.requiredFramesMinimum, 2); assert.equal(report.targetFramesTotal, 3);
  assert.equal(report.results[0].targetReached, false); assert.equal(report.targetShortfalls.length, 1);
});
