import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, sampleAnimation, sampleBallHeight, sampleBallForward } from '../src/core/animation.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';

const echo = animationAssetManifest.characters['echo-catwalk'];
const record = JSON.parse(readFileSync(new URL('../tools/generate-art/echo-catwalk-runtime-ball-tracks.json', import.meta.url), 'utf8'));
const tracks = record.tracks;

test('Echo Catwalk registers all 29 reviewed clips with safe mirroring', () => {
  assert.equal(echo.mirrorSafe, true);
  assert.equal(echo.mirrorReview.status, 'reviewed');
  const clips = echo.directions.right;
  assert.equal(Object.keys(clips).length, 29);
  assert.deepEqual(Object.keys(clips).sort(), Object.keys(animationClips).sort());
  for (const [key, asset] of Object.entries(clips)) {
    assert.equal(asset.reviewed, true, `${key} must be accepted production art`);
    assert.ok(existsSync(new URL(`../${asset.src.slice(2)}`, import.meta.url)), `${key} atlas exists`);
    assert.equal(asset.frames.length, animationClips[key].frames.length, `${key} authored frame count`);
    if (key.startsWith('idle') || ['dribble', 'run', 'dribble-run', 'shoot'].includes(key)) continue;
    assert.equal(asset.provenance.integrationReview.status, 'passed', `${key} native integration review`);
  }
});

test('Echo production atlases select every authored pose in both facings', () => {
  const images = new Map();
  for (const asset of Object.values(echo.directions.right)) {
    images.set(asset.src, {
      complete: true,
      naturalWidth: asset.columns * asset.frames[0].w,
      naturalHeight: asset.rows * asset.frames[0].h,
      file: asset.src
    });
  }
  for (const [key, asset] of Object.entries(echo.directions.right)) {
    let tick = 0;
    for (let frame = 0; frame < asset.frames.length; frame++) {
      assert.equal(sampleAnimation(key, tick).frame, frame, `${key} frame ${frame} timing`);
      for (const [facing, flip] of [[1, false], [-1, true]]) {
        const selected = selectProductionSprite({ id: 'echo-catwalk', facing, animation: { clip: key, tick } }, { manifest: animationAssetManifest, images });
        assert.ok(selected?.production, `${key} frame ${frame} facing ${facing} uses production art`);
        assert.equal(selected.atlas.file, asset.src);
        assert.equal(selected.frame, frame);
        assert.equal(selected.flip, flip);
      }
      tick += animationClips[key].frames[frame].duration;
    }
  }
});

test('Echo has 23 separate athlete-specific tracks with reviewed frame calibration', () => {
  assert.equal(record.status, 'accepted after native visual contact review');
  assert.equal(Object.keys(tracks).length, 23);
  for (const [key, track] of Object.entries(tracks)) {
    const assetTrack = echo.directions.right[key]?.provenance?.runtimeBallTrack;
    assert.ok(assetTrack, `${key} records its runtime ball track in provenance`);
    assert.deepEqual(assetTrack, track, `${key} runtime and provenance tracks agree`);
    assert.equal(echo.directions.right[key].provenance.separateBall, true, `${key} ball is a separate layer`);
    assert.equal(track.height.length, animationClips[key].frames.length, `${key} height samples`);
    assert.equal(track.forward.length, animationClips[key].frames.length, `${key} forward samples`);
    let tick = 0;
    for (let frame = 0; frame < animationClips[key].frames.length; frame++) {
      assert.equal(sampleBallHeight(key, tick, 'echo-catwalk'), track.height[frame], `${key} frame ${frame} hand height`);
      assert.equal(sampleBallForward(key, tick, 'echo-catwalk'), track.forward[frame], `${key} frame ${frame} hand position`);
      tick += animationClips[key].frames[frame].duration;
    }
  }
});
