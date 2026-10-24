import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, anchorTick, sampleAnimation, sampleBallHeight, sampleBallForward } from '../src/core/animation.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';
import { inspectAtlas } from '../tools/animation-assets.mjs';

const id = 'marco-vellum';
const clip = animationAssetManifest.characters[id].directions.right.pickup;
const trackRecord = JSON.parse(readFileSync(new URL('../tools/generate-art/marco-vellum-runtime-ball-tracks.json', import.meta.url), 'utf8'));
const layout = JSON.parse(readFileSync(new URL('../tools/generate-art/marco-vellum-pickup5-layouts.json', import.meta.url), 'utf8'))[0];

test('Marco pickup registers five reviewed unique poses with transparent empty sixth cell', async () => {
  assert.equal(clip.reviewed, true);
  assert.equal(clip.provenance.status, 'accepted after native contact review at 100% and 120%');
  assert.equal(clip.frames.length, 5);
  assert.equal(clip.columns, 3);
  assert.equal(clip.rows, 2);
  assert.equal(clip.sha256, createHash('sha256').update(readFileSync(new URL(`../${clip.src.slice(2)}`, import.meta.url))).digest('hex'));
  assert.equal(layout.provenance.sourceSha256, createHash('sha256').update(readFileSync(new URL('../tools/generate-art/sources/marco-vellum-pickup5.png', import.meta.url))).digest('hex'));
  const decoded = await inspectAtlas(new URL(`../${clip.src.slice(2)}`, import.meta.url).pathname, clip.frames);
  assert.equal(decoded.frames.length, 5);
  assert.ok(decoded.frames.every(frame => frame.visiblePixels > 0 && !frame.error));
  assert.equal(new Set(decoded.frames.map(frame => frame.hash)).size, 5);
  assert.equal(decoded.sha256, clip.sha256);
  assert.equal(clip.provenance.separateBall, true);
});

test('Marco pickup poses select production art in both facings with reviewed timing', () => {
  const images = new Map([[clip.src, { complete: true, naturalWidth: 336, naturalHeight: 192, file: clip.src }]]);
  let tick = 0;
  for (let frame = 0; frame < clip.frames.length; frame++) {
    assert.equal(sampleAnimation('pickup', tick).frame, frame);
    for (const [facing, flip] of [[1, false], [-1, true]]) {
      const sprite = selectProductionSprite({ id, facing, animation: { clip: 'pickup', tick } }, { manifest: animationAssetManifest, images });
      assert.equal(sprite?.atlas.file, clip.src);
      assert.equal(sprite?.frame, frame);
      assert.equal(sprite?.flip, flip);
    }
    tick += animationClips.pickup.frames[frame].duration;
  }
  assert.equal(anchorTick('pickup', 'grab'), 7);
  assert.equal(sampleAnimation('pickup', 5).frame, 2, 'loose-ball fingertip contact is pose2');
  assert.equal(sampleAnimation('pickup', 7).frame, 3, 'grab begins at pose3');
  assert.equal(sampleAnimation('pickup', 8).frame, 4, 'recovery follows to pose4');
});

test('Marco pickup ball remains separate and matches reviewed runtime calibration', () => {
  const track = trackRecord.tracks.pickup;
  assert.equal(trackRecord.status, 'accepted');
  assert.deepEqual(clip.provenance.runtimeBallTrack, { height: track.height, forward: track.forward });
  assert.equal(trackRecord.athlete, id);
  assert.deepEqual(track.height, [0, 0, 0, .25, .9]);
  assert.deepEqual(track.forward, [8, 8, 9, .5, -9]);
  let tick = 0;
  for (let frame = 0; frame < 5; frame++) {
    assert.equal(sampleBallHeight('pickup', tick, id), track.height[frame]);
    assert.equal(sampleBallForward('pickup', tick, id), track.forward[frame]);
    tick += animationClips.pickup.frames[frame].duration;
  }
  assert.deepEqual(clip.provenance.integrationReview.zooms, [100, 120]);
  assert.equal(clip.provenance.integrationReview.status, 'passed');
  assert.equal(clip.provenance.integrationReview.clipSummariesPerZoom, 2);
  assert.equal(clip.provenance.integrationReview.actionFrameCapturesPerZoom, 10);
});
