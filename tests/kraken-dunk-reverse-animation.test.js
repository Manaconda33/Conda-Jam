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

const atlas='./public/assets/animation/kraken-dunk-reverse-right.webp';
const heights=[1,.9,1.2,1.6,1.55,1.65,1.6,1.75,-1.4,-.1,2.1,1.2,1,.8,.7];
const forwards=[5,4,3,1,-1,-2,-3,-4,3.5,1.5,12,10,8,6,4];

test('Kraken reverse dunk uses reviewed derived art, separate ball tracking, and registered gameplay coverage',async()=>{
 const character=animationAssetManifest.characters.kraken,clip=character.directions.right['dunk-reverse'];
 assert.equal(clip.src,atlas);assert.equal(clip.reviewed,true);assert.equal(clip.source,'imagegen');
 assert.equal(clip.provenance.assetClassification,'derived-cleanup-from-imagegen-source');
 assert.equal(clip.baselineY,92);assert.equal(clip.columns,5);assert.equal(clip.rows,3);
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.generationId,'exec-e2e2b1c9-30e1-4975-ac29-fcc18d9fee93');
 assert.ok(clip.provenance.normalLoaderReview.endsWith('/INDEPENDENT_NORMAL_LOADER_REVIEW.md'));
 const bytes=readFileSync(new URL('../public/assets/animation/kraken-dunk-reverse-right.webp',import.meta.url));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),clip.sha256);
 const decoded=await decodeImage(fileURLToPath(new URL('../public/assets/animation/kraken-dunk-reverse-right.webp',import.meta.url)));
 assert.deepEqual([decoded.width,decoded.height],[400,288]);
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(animationMirrorPolicy.kraken.mirrorSafe,true);assert.equal(animationMirrorPolicy.kraken.mirrorReview.status,'reviewed');
 assert.equal(athleteBallTrackSource('kraken','dunk-reverse','height'),'kraken');
 assert.equal(athleteBallTrackSource('kraken','dunk-reverse','forward'),'kraken');
 const starts=[];let tick=0;for(let frame=0;frame<15;frame++){starts.push([frame,tick]);tick+=animationClips['dunk-reverse'].frames[frame].duration;}
 assert.deepEqual(starts.map(([,at])=>sampleAnimation('dunk-reverse',at).frame),Array.from({length:15},(_,i)=>i));
 assert.deepEqual(['takeoff','grab','peak','release','finish','land'].map(name=>anchorTick('dunk-reverse',name)),[4,10,14,21,23,30]);
 assert.deepEqual(starts.map(([,at])=>sampleBallHeight('dunk-reverse',at,'kraken')),heights);
 assert.deepEqual(starts.map(([,at])=>sampleBallForward('dunk-reverse',at,'kraken')),forwards);
 const images=new Map([[atlas,{complete:true,naturalWidth:400,naturalHeight:288,file:atlas}]]);
 for(const [frame,at] of starts)for(const [facing,flip] of [[1,false],[-1,true]]){
  const sprite=selectProductionSprite({id:'kraken',facing,animation:{clip:'dunk-reverse',tick:at}},{manifest:animationAssetManifest,images});
  assert.equal(sprite?.src,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
 }
 const report=JSON.parse(readFileSync(new URL('../tools/generate-art/previews/kraken-dunk-reverse-attempt04/normal-loader-runtime/report.json',import.meta.url),'utf8'));
 assert.equal(report.runtimeIntegration,true);assert.equal(report.candidateAtlasInjected,false);assert.equal(report.candidateBallTrackInjected,false);assert.equal(report.captureCount,60);assert.deepEqual(report.uncaughtBrowserErrors,[]);
 for(const run of report.runs){
  assert.equal(run.captures.length,15);assert.deepEqual(run.captures.map(c=>c.selectedFrame),Array.from({length:15},(_,i)=>i));
  assert.ok(run.captures.every(c=>c.selectedSrc===atlas&&c.flip===(run.facing<0)));
  assert.equal(run.captures.find(c=>c.tick===17).ball.owner,'kraken');assert.equal(run.captures.find(c=>c.tick===19).ball.owner,'kraken');
  const release=run.captures.find(c=>c.tick===21);assert.equal(release.ball.mode,'dunk');assert.equal(release.ball.owner,null);
  const score=run.captures.find(c=>c.tick===23);assert.equal(score.score[run.facing===1?0:1],2);assert.equal(score.ball.mode,'dead');
  assert.equal(run.captures.find(c=>c.tick===30).clip,'dunk-reverse');
 }
});
