import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, anchorTick, sampleAnimation, sampleBallHeight, sampleBallForward, sampleBallReleaseVz } from '../src/core/animation.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';
import { decodeImage, inspectAtlas } from '../tools/animation-assets.mjs';

test('J.07 Kraken shoot is registered with ten reviewed poses and its reviewed separate ball track', async () => {
  const clip = animationAssetManifest.characters.kraken.directions.right.shoot;
  const height = [1.1, .95, 1.25, 1.6, 2, 2.25, 2.15, 1.9, 1.15, 1.05];
  const forward = [4, 5, 4, 3, 1, 4, 5.5, 4.5, 5, 5];
  const starts = [0, 3, 6, 8, 10, 13, 14, 16, 19, 23];
  const durations = [3, 3, 2, 2, 3, 1, 2, 3, 4, 4];
  const atlasPath = fileURLToPath(new URL(`../${clip.src.slice(2)}`, import.meta.url));
  assert.equal(clip.reviewed, true);
  assert.equal(clip.source, 'imagegen');
  assert.equal(clip.provenance.generationId, 'exec-20014507-d570-42f5-9ad7-6c2f9e4c6b03');
  assert.equal(clip.provenance.ballTrackReview.status, 'accepted');
  assert.deepEqual(clip.provenance.runtimeBallTrack, { height, forward, releaseVz: .46, reviewed: true });
  assert.equal(createHash('sha256').update(readFileSync(atlasPath)).digest('hex'), clip.sha256);
  assert.equal(anchorTick('shoot', 'release'), 13);
  assert.equal(sampleBallReleaseVz('shoot', 'kraken'), .46);
  assert.equal(clip.frames.length, 10);
  assert.equal(new Set(clip.frames.map(frame => frame.hash)).size, 10);
  assert.deepEqual(animationClips.shoot.frames.map(frame => frame.duration), durations);
  const decoded = await decodeImage(atlasPath);
  assert.deepEqual([decoded.width, decoded.height], [400, 192]);
  const inspected = await inspectAtlas(atlasPath, clip.frames);
  assert.ok(inspected.frames.every(frame => frame.visiblePixels > 0 && !frame.error));

  const image = { complete: true, naturalWidth: 400, naturalHeight: 192, file: clip.src };
  for (const [frame, tick] of starts.entries()) {
    assert.equal(sampleAnimation('shoot', tick).frame, frame);
    assert.equal(sampleBallHeight('shoot', tick, 'kraken'), height[frame]);
    assert.equal(sampleBallForward('shoot', tick, 'kraken'), forward[frame]);
  }
  assert.deepEqual([sampleBallHeight('shoot', 13, 'kraken'), sampleBallForward('shoot', 13, 'kraken')], [2.25, 4]);
  for (const [facing, flip] of [[1, false], [-1, true]]) {
    const selected = selectProductionSprite({ id: 'kraken', facing, animation: { clip: 'shoot', tick: 13 } }, {
      manifest: animationAssetManifest,
      images: new Map([[clip.src, image]])
    });
    assert.equal(selected?.atlas.file, clip.src);
    assert.equal(selected?.flip, flip);
    assert.equal(selected?.frame, 5);
  }
});
