import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {animationAssetManifest} from '../src/content/animation-assets.js';
import {animationClips,anchorTick,sampleAnimation} from '../src/core/animation.js';
import {selectProductionSprite} from '../src/render/animation-sprites.js';
import {decodeImage,inspectAtlas} from '../tools/animation-assets.mjs';

test('J.128 Krios block uses four reviewed ball-free poses in registered Jam Stage runtime',async()=>{
 const clip=animationAssetManifest.characters.krios.directions.right.block;
 const atlasPath=fileURLToPath(new URL(`../${clip.src.slice(2)}`,import.meta.url));
 assert.equal(clip.reviewed,true);
 assert.equal(clip.provenance.sourceReview.status,'accepted');
 assert.equal(clip.provenance.cleanupReview.status,'accepted');
 assert.equal(clip.provenance.ballTrackReview.status,'not-applicable');
 assert.match(clip.provenance.ballPolicy,/no basketball/i);
 assert.equal(clip.frames.length,4);
 assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,4);
 assert.equal(clip.sha256,createHash('sha256').update(readFileSync(atlasPath)).digest('hex'));
 const decoded=await decodeImage(atlasPath);
 assert.deepEqual([decoded.width,decoded.height],[512,96]);
 const inspected=await inspectAtlas(atlasPath,clip.frames);
 assert.equal(inspected.frames.length,4);
 assert.ok(inspected.frames.every(frame=>frame.visiblePixels>0&&!frame.error));
 assert.deepEqual(animationClips.block.frames.map(frame=>frame.duration),[2,3,3,4]);
 assert.equal(anchorTick('block','takeoff'),2);
 assert.equal(anchorTick('block','apex'),5);
 assert.equal(anchorTick('block','finish'),8);
 const image={complete:true,naturalWidth:512,naturalHeight:96,file:clip.src};
 for(const [tick,frame] of [[0,0],[2,1],[5,2],[8,3]]){
  assert.equal(sampleAnimation('block',tick).frame,frame);
  for(const [facing,flip] of [[1,false],[-1,true]]){
   const selected=selectProductionSprite({id:'krios',facing,animation:{clip:'block',tick}},{manifest:animationAssetManifest,images:new Map([[clip.src,image]])});
   assert.equal(selected?.atlas.file,clip.src);
   assert.equal(selected?.frame,frame);
   assert.equal(selected?.flip,flip);
  }
 }
 const gameplay=JSON.parse(readFileSync(new URL('../tools/generate-art/previews/j128-krios-block-candidate/attempt-07/registered-runtime/report.json',import.meta.url),'utf8'));
 assert.equal(gameplay.runtimeIntegration,true);
 assert.equal(gameplay.candidateAtlasInjected,false);
 assert.match(gameplay.captureMethod,/normal loadProductionSprites path/);
 assert.equal(gameplay.courtY,90);
 assert.equal(gameplay.captureCount,16);
 assert.deepEqual(gameplay.uncaughtBrowserErrors,[]);
 for(const run of gameplay.runs){
  assert.ok([100,120].includes(run.zoom));
  assert.equal(run.captures.length,4);
  for(const [index,capture] of run.captures.entries()){
   assert.equal(capture.frame,index);
   assert.equal(capture.src,clip.src);
   assert.equal(capture.flip,run.facing<0);
   assert.equal(capture.hasBall,false);
   assert.equal(capture.ballMode,'dead');
   assert.equal(capture.ballOwner,null);
   assert.equal(capture.productionImageReady,true);
  }
  assert.deepEqual(run.captures.map(capture=>capture.tick),[1,2,5,8]);
 }
});
