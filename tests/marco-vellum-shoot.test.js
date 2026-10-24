import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, anchorTick, sampleAnimation, sampleBallHeight, sampleBallForward } from '../src/core/animation.js';
import { decodeImage, inspectAtlas } from '../tools/animation-assets.mjs';
import { selectProductionSprite } from '../src/render/animation-sprites.js';

const athlete = 'marco-vellum';
const clip = animationAssetManifest.characters[athlete].directions.right.shoot;
const layout = JSON.parse(readFileSync(new URL('../tools/generate-art/marco-vellum-shoot10-layouts.json', import.meta.url), 'utf8'))[0];
const tracks = JSON.parse(readFileSync(new URL('../tools/generate-art/marco-vellum-runtime-ball-tracks.json', import.meta.url), 'utf8'));
const cleanup = JSON.parse(readFileSync(new URL('../tools/generate-art/marco-vellum-shoot-attempt7-cleanup-v2.json', import.meta.url), 'utf8'));
const atlasPath = fileURLToPath(new URL(`../${clip.src.slice(2)}`, import.meta.url));

test('Marco shoot registers ten unique reviewed poses with five-pixel atlas gutters', async () => {
  assert.equal(clip.reviewed, true);
  assert.equal(clip.frames.length, 10);
  assert.equal(clip.columns, 5);
  assert.equal(clip.rows, 2);
  assert.equal(clip.sha256, createHash('sha256').update(readFileSync(atlasPath)).digest('hex'));
  assert.equal(layout.provenance.sourceSha256, cleanup.outputSha256);
  assert.equal(layout.provenance.separateBall, true);

  const decoded = await decodeImage(atlasPath);
  assert.deepEqual([decoded.width, decoded.height], [320, 192]);
  const checked = await inspectAtlas(atlasPath, clip.frames);
  assert.equal(checked.frames.length, 10);
  assert.ok(checked.frames.every(frame => frame.visiblePixels > 0 && !frame.error));
  assert.equal(new Set(checked.frames.map(frame => frame.hash)).size, 10);

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

test('Marco shoot source cleanup preserves exact pose provenance and prompt margins', () => {
  const sourcePath = fileURLToPath(new URL(`../tools/generate-art/${cleanup.output}`, import.meta.url));
  const source = readFileSync(sourcePath);
  assert.equal(createHash('sha256').update(source).digest('hex'), layout.provenance.sourceSha256);
  assert.equal(cleanup.outputSha256, layout.provenance.sourceSha256);
  assert.equal(cleanup.poses.length, 10);
  for (const pose of cleanup.poses) {
    const [left, right, top, bottom] = pose.outputMarginsLeftRightTopBottom;
    assert.ok(pose.outputSize[0] <= 225 && pose.outputSize[1] <= 300);
    assert.ok(left >= 41 && right >= 41 && top >= 106 && bottom >= 106);
  }
  assert.equal(layout.provenance.rawSourceSha256, cleanup.sourceSha256);
});

test('Marco shoot ball remains separate through tick12 and releases on frame5 at tick13', () => {
  const track = tracks.tracks.shoot;
  assert.equal(tracks.status, 'accepted');
  assert.equal(track.status, 'accepted after native contact review at 100% and 120%');
  assert.deepEqual(clip.provenance.runtimeBallTrack, { height: track.height, forward: track.forward });
  assert.deepEqual(track.height, [.8, 1, 1.25, 1.5, 1.35, 1.6, 2.1, 2.6, 2.3, 1.2]);
  assert.deepEqual(track.forward, [3, 4, 5, 5, 5, 6, 9, 14, 18, 22]);
  assert.equal(anchorTick('shoot', 'release'), 13);
  assert.equal(sampleAnimation('shoot', 13).frame, 5);
  assert.equal(track.nativeReview.actionFrameCapturesPerZoom, 20);
  assert.deepEqual(track.nativeReview.zooms, [100, 120]);
  assert.deepEqual(track.nativeReview.facings, ['right', 'left']);

  const images = new Map([[clip.src, { complete: true, naturalWidth: 320, naturalHeight: 192, file: clip.src }]]);
  let tick = 0;
  for (let frame = 0; frame < 10; frame++) {
    assert.equal(sampleAnimation('shoot', tick).frame, frame);
    assert.equal(sampleBallHeight('shoot', tick, athlete), track.height[frame]);
    assert.equal(sampleBallForward('shoot', tick, athlete), track.forward[frame]);
    for (const [facing, flipped] of [[1, false], [-1, true]]) {
      const sprite = selectProductionSprite({ id: athlete, animation: { clip: 'shoot', tick }, facing }, { manifest: animationAssetManifest, images });
      assert.ok(sprite, `frame${frame} facing${facing} must select production art`);
      assert.equal(sprite.flip, flipped);
    }
    tick += animationClips.shoot.frames[frame].duration;
  }

  for (const zoom of [100, 120]) {
    const report = JSON.parse(readFileSync(new URL(`../tools/generate-art/previews/marco-vellum-shoot/native-${zoom}/report.json`, import.meta.url), 'utf8'));
    assert.equal(report.actionFramePreviews.length, 20);
    assert.ok(report.actionFramePreviews.every(frame => frame.production && frame.source === clip.src));
  }
});
