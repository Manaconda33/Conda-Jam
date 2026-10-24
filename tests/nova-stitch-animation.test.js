import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, sampleAnimation, sampleBallHeight, sampleBallForward } from '../src/core/animation.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';

const nova = animationAssetManifest.characters['nova-stitch'];
const tracks = JSON.parse(readFileSync(new URL('../tools/generate-art/nova-stitch-runtime-ball-tracks.json', import.meta.url), 'utf8')).tracks;

test('Nova Stitch registers all 29 reviewed clips with her canon-approved mirror policy', () => {
  assert.equal(nova.mirrorSafe, true);
  assert.equal(nova.mirrorReview.status, 'reviewed');
  const clips = nova.directions.right;
  assert.equal(Object.keys(clips).length, 29);
  assert.deepEqual(Object.keys(clips).sort(), Object.keys(animationClips).sort());
  for (const [key, asset] of Object.entries(clips)) {
    assert.equal(asset.reviewed, true, `${key} must be accepted production art`);
    assert.ok(existsSync(new URL(`../${asset.src.slice(2)}`, import.meta.url)), `${key} atlas exists`);
    assert.equal(asset.frames.length, animationClips[key].frames.length, `${key} authored frame count`);
    assert.equal(new Set(asset.frames.map(frame => frame.hash)).size, asset.frames.length, `${key} unique authored cells`);
  }
});

test('Nova production atlases select every authored pose in both facings', () => {
  const images = new Map();
  for (const asset of Object.values(nova.directions.right)) {
    images.set(asset.src, {
      complete: true,
      naturalWidth: asset.columns * asset.frames[0].w,
      naturalHeight: asset.rows * asset.frames[0].h,
      file: asset.src
    });
  }
  for (const [key, asset] of Object.entries(nova.directions.right)) {
    let tick = 0;
    for (let frame = 0; frame < asset.frames.length; frame++) {
      assert.equal(sampleAnimation(key, tick).frame, frame, `${key} frame ${frame} timing`);
      for (const [facing, flip] of [[1, false], [-1, true]]) {
        const selected = selectProductionSprite({ id: 'nova-stitch', facing, animation: { clip: key, tick } }, { manifest: animationAssetManifest, images });
        assert.ok(selected?.production, `${key} frame ${frame} facing ${facing} uses production art`);
        assert.equal(selected.atlas.file, asset.src);
        assert.equal(selected.frame, frame);
        assert.equal(selected.flip, flip);
      }
      tick += animationClips[key].frames[frame].duration;
    }
  }
});

test('Nova carries a separate athlete-specific ball track for each of her 23 ball-bearing clips', () => {
  assert.equal(Object.keys(tracks).length, 23);
  for (const [key, track] of Object.entries(tracks)) {
    const assetTrack = nova.directions.right[key]?.provenance?.runtimeBallTrack;
    assert.ok(assetTrack, `${key} records its runtime ball track in provenance`);
    assert.deepEqual(assetTrack, track, `${key} runtime and provenance tracks agree`);
    assert.equal(track.height.length, animationClips[key].frames.length, `${key} height samples`);
    assert.equal(track.forward.length, animationClips[key].frames.length, `${key} forward samples`);
    let tick = 0;
    for (let frame = 0; frame < animationClips[key].frames.length; frame++) {
      assert.equal(sampleBallHeight(key, tick, 'nova-stitch'), track.height[frame], `${key} frame ${frame} hand height`);
      assert.equal(sampleBallForward(key, tick, 'nova-stitch'), track.forward[frame], `${key} frame ${frame} hand position`);
      tick += animationClips[key].frames[frame].duration;
    }
  }
});
