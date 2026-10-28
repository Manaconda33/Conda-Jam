import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, anchorTick, sampleAnimation, sampleBallHeight, sampleBallForward, sampleBallReleaseVz } from '../src/core/animation.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';
import { decodeImage, inspectAtlas } from '../tools/animation-assets.mjs';

const report = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));

test('J.104 Leo shoot uses its reviewed ten-pose atlas and athlete-specific release profile', async () => {
  const clip = animationAssetManifest.characters.leo.directions.right.shoot;
  const height = [.95,1.1,2.1,2.1,2.2,2.5,2.3,2.7,2.1,1.05];
  const forward = [6,7,6.5,4,3,4,4,4,6.5,5.5];
  const atlasPath = fileURLToPath(new URL(`../${clip.src.slice(2)}`, import.meta.url));
  assert.equal(clip.reviewed, true);
  assert.equal(clip.provenance.sourceReview.status, 'accepted');
  assert.equal(clip.provenance.ballTrackReview.status, 'accepted');
  assert.deepEqual(clip.provenance.runtimeBallTrack, { height, forward, releaseVz:.65, reviewed:true });
  assert.equal(sampleBallReleaseVz('shoot', 'leo'), .65);
  assert.equal(anchorTick('shoot', 'release'), 13);
  assert.equal(sampleAnimation('shoot', 13).frame, 5);
  assert.deepEqual([sampleBallHeight('shoot', 13, 'leo'), sampleBallForward('shoot', 13, 'leo')], [2.5, 4]);
  assert.equal(clip.frames.length, 10);
  assert.equal(new Set(clip.frames.map(frame => frame.hash)).size, 10);
  assert.equal(clip.sha256, createHash('sha256').update(readFileSync(atlasPath)).digest('hex'));
  const decoded = await decodeImage(atlasPath);
  assert.deepEqual([decoded.width, decoded.height], [320,192]);
  const inspected = await inspectAtlas(atlasPath, clip.frames);
  assert.equal(inspected.frames.length, 10);
  assert.ok(inspected.frames.every(frame => frame.visiblePixels > 0 && !frame.error));
  const image={complete:true,naturalWidth:320,naturalHeight:192,file:clip.src};
  for (const [facing,flip] of [[1,false],[-1,true]]) {
    const selected=selectProductionSprite({id:'leo',facing,animation:{clip:'shoot',tick:13}},{manifest:animationAssetManifest,images:new Map([[clip.src,image]])});
    assert.equal(selected?.atlas.file,clip.src);
    assert.equal(selected?.frame,5);
    assert.equal(selected?.flip,flip);
  }
  const gameplay=report('tools/generate-art/previews/j104-leo-shoot-track-candidate/attempt-16/gameplay/rendered-production-courty95/report.json');
  assert.equal(gameplay.productionReleaseVz,.65);
  assert.equal(gameplay.captureCount,24);
  assert.deepEqual(gameplay.facings.map(row=>row.scoreComplete.score),[[3,0],[3,0]]);
  assert.ok(gameplay.facings.every(row=>row.release.tick===13&&row.release.ownerId===null&&row.release.makeShotFacts.clip==='shoot'));
  assert.deepEqual(gameplay.uncaughtBrowserErrors,[]);
});

test('J.128 Krios receive uses its reviewed atlas and separate caught-ball track', async () => {
  const clip=animationAssetManifest.characters.krios.directions.right.receive;
  const height=[1.1,2,2.1,1.2],forward=[5,9,9,5];
  const atlasPath=fileURLToPath(new URL(`../${clip.src.slice(2)}`,import.meta.url));
  assert.equal(clip.reviewed,true);
  assert.equal(clip.provenance.sourceReview.status,'accepted');
  assert.equal(clip.provenance.ballTrackReview.status,'accepted');
  assert.deepEqual(clip.provenance.runtimeBallTrack,{height,forward,reviewed:true});
  assert.equal(clip.frames.length,4);
  assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,4);
  assert.equal(clip.sha256,createHash('sha256').update(readFileSync(atlasPath)).digest('hex'));
  const decoded=await decodeImage(atlasPath);
  assert.deepEqual([decoded.width,decoded.height],[520,96]);
  const inspected=await inspectAtlas(atlasPath,clip.frames);
  assert.equal(inspected.frames.length,4);
  assert.ok(inspected.frames.every(frame=>frame.visiblePixels>0&&!frame.error));
  assert.deepEqual(animationClips.receive.frames.map(frame=>frame.duration),[2,2,1,3]);
  assert.equal(anchorTick('receive','grab'),4);
  for (let frame=0,tick=0;frame<4;frame++) {
    assert.equal(sampleAnimation('receive',tick).frame,frame);
    assert.equal(sampleBallHeight('receive',tick,'krios'),height[frame]);
    assert.equal(sampleBallForward('receive',tick,'krios'),forward[frame]);
    tick+=animationClips.receive.frames[frame].duration;
  }
  const image={complete:true,naturalWidth:520,naturalHeight:96,file:clip.src};
  for (const [facing,flip] of [[1,false],[-1,true]]) {
    const selected=selectProductionSprite({id:'krios',facing,animation:{clip:'receive',tick:4}},{manifest:animationAssetManifest,images:new Map([[clip.src,image]])});
    assert.equal(selected?.atlas.file,clip.src);
    assert.equal(selected?.frame,2);
    assert.equal(selected?.flip,flip);
  }
  const gameplay=report('tools/generate-art/previews/j128-krios-receive-track-candidate/attempt-02/native/report.json');
  assert.equal(gameplay.captureCount,20);
  assert.equal(gameplay.gameplayRuns.length,4);
  assert.ok(gameplay.gameplayRuns.every(row=>row.finalState.owner==='krios'&&row.finalState.hasBall&&row.finalState.events.some(event=>event.tick===row.receiveStartStep+4&&event.text==='Krios catches it')));
  assert.deepEqual(gameplay.uncaughtBrowserErrors,[]);
});
