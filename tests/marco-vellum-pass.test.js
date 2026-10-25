import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, anchorTick, sampleAnimation, sampleBallHeight, sampleBallForward } from '../src/core/animation.js';
import { decodeImage, inspectAtlas } from '../tools/animation-assets.mjs';
import { selectProductionSprite } from '../src/render/animation-sprites.js';

const id = 'marco-vellum';
const clip = animationAssetManifest.characters[id].directions.right.pass;
const layout = JSON.parse(readFileSync(new URL('../tools/generate-art/marco-vellum-pass6-layouts.json', import.meta.url), 'utf8'))[0];
const cleanup = JSON.parse(readFileSync(new URL('../tools/generate-art/marco-vellum-pass-attempt4-cleanup.json', import.meta.url), 'utf8'));
const trackRecord = JSON.parse(readFileSync(new URL('../tools/generate-art/marco-vellum-runtime-ball-tracks.json', import.meta.url), 'utf8'));
const atlasPath = fileURLToPath(new URL(`../${clip.src.slice(2)}`, import.meta.url));

test('Marco pass registers six unique reviewed poses with five-pixel atlas margins', async () => {
  assert.equal(clip.reviewed, true);
  assert.equal(clip.frames.length, 6);
  assert.equal(clip.columns, 3);
  assert.equal(clip.rows, 2);
  assert.equal(clip.sha256, createHash('sha256').update(readFileSync(atlasPath)).digest('hex'));
  assert.equal(layout.provenance.sourceSha256, cleanup.outputSha256);
  assert.equal(layout.provenance.separateBall, true);

  const decoded = await decodeImage(atlasPath);
  assert.deepEqual([decoded.width, decoded.height], [288, 192]);
  const inspected = await inspectAtlas(atlasPath, clip.frames);
  assert.equal(inspected.frames.length, 6);
  assert.ok(inspected.frames.every(frame => frame.visiblePixels > 0 && !frame.error));
  assert.equal(new Set(inspected.frames.map(frame => frame.hash)).size, 6);
  for (const frame of clip.frames) {
    let left = frame.w, right = -1, top = frame.h, bottom = -1;
    for (let y = 0; y < frame.h; y++) for (let x = 0; x < frame.w; x++) {
      const alpha = decoded.pixels[((frame.y + y) * decoded.width + frame.x + x) * 4 + 3];
      if (!alpha) continue;
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
    assert.ok(left >= 5 && frame.w - right - 1 >= 5 && top >= 5 && frame.h - bottom - 1 >= 5,
      `atlas margins must be at least5px: ${left},${frame.w-right-1},${top},${frame.h-bottom-1}`);
  }
});

test('Marco pass keeps an athlete-specific separate ball and releases on pose3 at tick5', () => {
  const track = trackRecord.tracks.pass;
  assert.equal(trackRecord.athlete, id);
  assert.equal(track.status, 'accepted after native contact review at 100% and 120%');
  assert.deepEqual(track.height, [1, 1.05, 1.3, 1.5, 1.6, 1.7]);
  assert.deepEqual(track.forward, [5, 6, 8, 13, 15, 22]);
  assert.deepEqual(clip.provenance.runtimeBallTrack, { height: track.height, forward: track.forward });
  assert.equal(anchorTick('pass', 'release'), 5);
  assert.equal(sampleAnimation('pass', 5).frame, 3);
  let tick = 0;
  for (let frame = 0; frame < track.height.length; frame++) {
    assert.equal(sampleBallHeight('pass', tick, id), track.height[frame]);
    assert.equal(sampleBallForward('pass', tick, id), track.forward[frame]);
    tick += animationClips.pass.frames[frame].duration;
  }
  assert.deepEqual(track.nativeReview.zooms, [100, 120]);
  assert.deepEqual(track.nativeReview.facings, ['right', 'left']);
});

test('Marco pass production captures select all poses in both facings at standard and zoom120', () => {
  const image = { complete: true, naturalWidth: 288, naturalHeight: 192, file: clip.src };
  const images = new Map([[clip.src, image]]);
  let tick = 0;
  for (let frame = 0; frame < clip.frames.length; frame++) {
    for (const [facing, flip] of [[1, false], [-1, true]]) {
      const selected = selectProductionSprite({ id, facing, animation: { clip: 'pass', tick } }, { manifest: animationAssetManifest, images });
      assert.equal(selected?.atlas.file, clip.src);
      assert.equal(selected?.frame, frame);
      assert.equal(selected?.flip, flip);
    }
    tick += animationClips.pass.frames[frame].duration;
  }
  for (const zoom of [100, 120]) {
    const report = JSON.parse(readFileSync(new URL(`../tools/generate-art/previews/marco-vellum-pass/native-${zoom}/report.json`, import.meta.url), 'utf8'));
    assert.equal(report.cameraZoom, zoom);
    assert.equal(report.actionFramePreviews.length, 12);
    assert.ok(report.actionFramePreviews.every((frame, index) => frame.production && frame.source === clip.src && frame.selectedFrame === index % 6));
  }
});
