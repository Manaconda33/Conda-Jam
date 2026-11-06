import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {animationAssetManifest} from '../src/content/animation-assets.js';
import {animationMirrorPolicy} from '../src/content/animation-mirror-policy.js';
import {anchorTick,athleteBallTrackSource,sampleAnimation,sampleBallHeight,sampleBallForward,animationClips} from '../src/core/animation.js';
import {selectProductionSprite} from '../src/render/animation-sprites.js';
import {decodeImage} from '../tools/animation-assets.mjs';

const atlas='./public/assets/animation/kraken-dunk-360-right.webp';
const heights=[1,1.15,1.4,1.65,1.85,1.4,1,.5,.9,.95,1.5,1.3,1,.75,.65];
const forwards=[6,8,10,12,13,10,-6,8.5,4,8,4,12,10,7,6];

test('Kraken 360 dunk uses reviewed derived art, separate hand tracking, and registered gameplay coverage',async()=>{
 const character=animationAssetManifest.characters.kraken,clip=character.directions.right['dunk-360'];
 assert.equal(clip.src,atlas);assert.equal(clip.reviewed,true);assert.equal(clip.source,'imagegen');
 assert.equal(clip.provenance.assetClassification,'derived-cleanup-from-imagegen-source');
 assert.equal(clip.baselineY,94);assert.equal(clip.columns,5);assert.equal(clip.rows,3);
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.generationId,'exec-4e862262-065e-43dd-82b6-43202cea5cee');
 assert.ok(clip.provenance.normalLoaderReview.endsWith('/PRODUCTION_LOADER_REVIEW.md'));
 const bytes=readFileSync(new URL('../public/assets/animation/kraken-dunk-360-right.webp',import.meta.url));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),clip.sha256);
 const decoded=await decodeImage(fileURLToPath(new URL('../public/assets/animation/kraken-dunk-360-right.webp',import.meta.url)));
 assert.deepEqual([decoded.width,decoded.height],[440,288]);
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(animationMirrorPolicy.kraken.mirrorSafe,true);assert.equal(animationMirrorPolicy.kraken.mirrorReview.status,'reviewed');
 assert.equal(athleteBallTrackSource('kraken','dunk-360','height'),'kraken');
 assert.equal(athleteBallTrackSource('kraken','dunk-360','forward'),'kraken');
 const starts=[];let tick=0;for(let frame=0;frame<15;frame++){starts.push([frame,tick]);tick+=animationClips['dunk-360'].frames[frame].duration;}
 assert.deepEqual(starts.map(([,at])=>sampleAnimation('dunk-360',at).frame),Array.from({length:15},(_,i)=>i));
 assert.deepEqual(['takeoff','grab','peak','release','finish','land'].map(name=>anchorTick('dunk-360',name)),[4,10,14,21,23,30]);
 assert.deepEqual(starts.map(([,at])=>sampleBallHeight('dunk-360',at,'kraken')),heights);
 assert.deepEqual(starts.map(([,at])=>sampleBallForward('dunk-360',at,'kraken')),forwards);
 const images=new Map([[atlas,{complete:true,naturalWidth:440,naturalHeight:288,file:atlas}]]);
 for(const [frame,at] of starts)for(const [facing,flip] of [[1,false],[-1,true]]){
  const sprite=selectProductionSprite({id:'kraken',facing,animation:{clip:'dunk-360',tick:at}},{manifest:animationAssetManifest,images});
  assert.equal(sprite?.src,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
 }
 const report=JSON.parse(readFileSync(new URL('../tools/generate-art/previews/kraken-dunk-360-attempt05/normal-loader-runtime/report.json',import.meta.url),'utf8'));
 assert.equal(report.runtimeIntegration,true);assert.equal(report.candidateAtlasInjected,false);assert.equal(report.candidateBallTrackInjected,false);assert.equal(report.captureCount,60);assert.deepEqual(report.uncaughtBrowserErrors,[]);
 for(const run of report.runs){
  assert.equal(run.captures.length,15);assert.deepEqual(run.captures.map(c=>c.selectedFrame),Array.from({length:15},(_,i)=>i));
  assert.ok(run.captures.every(c=>c.selectedSrc===atlas&&c.flip===(run.facing<0)));
  for(const tick of [12,14,17,19])assert.equal(run.captures.find(c=>c.tick===tick).ball.owner,'kraken');
  for(const capture of run.captures.filter(c=>c.tick>=12&&c.tick<=20))assert.deepEqual(capture.carriedDelta,{x:0,z:0});
  const release=run.captures.find(c=>c.tick===21);assert.equal(release.ball.mode,'dunk');assert.equal(release.ball.owner,null);
  const score=run.captures.find(c=>c.tick===23);assert.equal(score.score[run.facing===1?0:1],2);assert.equal(score.ball.mode,'dead');
  assert.equal(run.captures.find(c=>c.tick===30).clip,'dunk-360');
 }
});
