import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, anchorTick, athleteBallTrackSource, sampleAnimation, sampleBallForward, sampleBallHeight } from '../src/core/animation.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';
import { decodeImage } from '../tools/animation-assets.mjs';

test('J.128 Krios rebound has five reviewed poses, athlete-specific catch track, and registered gameplay evidence', async () => {
  const character = animationAssetManifest.characters.krios;
  const clip = character.directions.right.rebound;
  const path = fileURLToPath(new URL(`../${clip.src.slice(2)}`, import.meta.url));
  assert.equal(character.mirrorSafe, true);
  assert.equal(character.mirrorReview.status, 'reviewed');
  assert.equal(clip.reviewed, true);
  assert.equal(clip.frames.length, 5);
  assert.equal(new Set(clip.frames.map(frame => frame.hash)).size, 5);
  assert.equal(clip.sha256, createHash('sha256').update(readFileSync(path)).digest('hex'));
  const decoded = await decodeImage(path);
  assert.deepEqual([decoded.width, decoded.height], [640, 96]);
  assert.deepEqual(animationClips.rebound.frames.map(frame => frame.duration), [2,2,1,2,4]);
  assert.equal(anchorTick('rebound', 'grab'), 5);
  assert.equal(sampleAnimation('rebound', 5).frame, 3);
  assert.equal(athleteBallTrackSource('krios', 'rebound', 'height'), 'krios');
  assert.equal(athleteBallTrackSource('krios', 'rebound', 'forward'), 'krios');
  assert.deepEqual([0,1,2,3,4].map(i => sampleBallHeight('rebound', [0,2,4,5,7][i], 'krios')), [1.1,1.7,2.0,2.1,1.3]);
  assert.deepEqual([0,1,2,3,4].map(i => sampleBallForward('rebound', [0,2,4,5,7][i], 'krios')), [4,3,1,.5,1]);
  const images = new Map([[clip.src, { complete: true, naturalWidth: 640, naturalHeight: 96, file: clip.src }]]);
  for (const [frame,tick] of [[0,0],[1,2],[2,4],[3,5],[4,7]]) for (const [facing,flip] of [[1,false],[-1,true]]) {
    const selected = selectProductionSprite({id:'krios',facing,animation:{clip:'rebound',tick}}, {manifest:animationAssetManifest,images});
    assert.equal(selected?.src,clip.src); assert.equal(selected?.frame,frame); assert.equal(selected?.flip,flip);
  }
  const report = JSON.parse(readFileSync(new URL('../tools/generate-art/previews/j128-krios-rebound-candidate/attempt-03/track-06/registered-runtime/report.json', import.meta.url), 'utf8'));
  assert.equal(report.runtimeIntegration,true); assert.equal(report.candidateAtlasInjected,false); assert.equal(report.captureCount,20);
  assert.deepEqual(report.uncaughtBrowserErrors,[]);
  for (const run of report.runs) {
    assert.equal(run.captures.length,5);
    assert.deepEqual(run.captures.map(c => c.selectedFrame),[0,1,2,3,4]);
    assert.deepEqual(run.captures.map(c => c.hasBall),[false,false,false,true,true]);
    assert.ok(run.captures.every(c => c.selectedSrc===clip.src && c.flip===(run.facing<0)));
  }
});
