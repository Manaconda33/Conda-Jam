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

const atlas='./public/assets/animation/kraken-alley-oop-power-right.webp';
const heights=[1.37,1.71,2.22,2.16,1.96,.55,1.55,1.8,1.75,1.52,.70,.64,.39,.37,.65];
const forwards=[9.50,10.23,7.67,5.12,8.40,8.2,6,6,5.5,6.8,5.12,1.10,-2.19,-1.10,-2.92];

test('Kraken alley-oop power uses reviewed derived art, a separate hand track, and registered gameplay coverage',async()=>{
 const character=animationAssetManifest.characters.kraken;
 const clip=character.directions.right['alley-oop-power'];
 assert.equal(clip.src,atlas);assert.equal(clip.reviewed,true);assert.equal(clip.source,'imagegen');
 assert.equal(clip.provenance.assetClassification,'derived-cleanup-from-imagegen-source');
 assert.equal(clip.baselineY,92);assert.equal(clip.columns,5);assert.equal(clip.rows,3);
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.generationId,'exec-acc4c354-79ac-4caa-a8ff-b08eeedf16b0');
 assert.ok(clip.provenance.normalLoaderReview.endsWith('/INDEPENDENT_NORMAL_LOADER_REVIEW.md'));
 const bytes=readFileSync(new URL('../public/assets/animation/kraken-alley-oop-power-right.webp',import.meta.url));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),clip.sha256);
 const decoded=await decodeImage(fileURLToPath(new URL('../public/assets/animation/kraken-alley-oop-power-right.webp',import.meta.url)));
 assert.deepEqual([decoded.width,decoded.height],[400,288]);
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(animationMirrorPolicy.kraken.mirrorSafe,true);assert.equal(animationMirrorPolicy.kraken.mirrorReview.status,'reviewed');
 assert.equal(athleteBallTrackSource('kraken','alley-oop-power','height'),'kraken');
 assert.equal(athleteBallTrackSource('kraken','alley-oop-power','forward'),'kraken');
 const starts=[];let tick=0;
 for(let frame=0;frame<15;frame++){starts.push([frame,tick]);tick+=animationClips['alley-oop-power'].frames[frame].duration;}
 assert.deepEqual(starts.map(([,at])=>sampleAnimation('alley-oop-power',at).frame),Array.from({length:15},(_,i)=>i));
 assert.deepEqual(['takeoff','grab','peak','release','finish','land'].map(name=>anchorTick('alley-oop-power',name)),[4,10,14,21,23,30]);
 assert.deepEqual(starts.map(([,at])=>sampleBallHeight('alley-oop-power',at,'kraken')),heights);
 assert.deepEqual(starts.map(([,at])=>sampleBallForward('alley-oop-power',at,'kraken')),forwards);
 const images=new Map([[atlas,{complete:true,naturalWidth:400,naturalHeight:288,file:atlas}]]);
 for(const [frame,at] of starts){
  for(const [facing,flip] of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'kraken',facing,animation:{clip:'alley-oop-power',tick:at}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.src,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
 }
 const report=JSON.parse(readFileSync(new URL('../tools/generate-art/previews/kraken-alley-oop-power-attempt09/normal-loader-runtime/report.json',import.meta.url),'utf8'));
 assert.equal(report.runtimeIntegration,true);assert.equal(report.candidateAtlasInjected,false);assert.equal(report.candidateBallTrackInjected,false);
 assert.equal(report.captureCount,60);assert.deepEqual(report.uncaughtBrowserErrors,[]);
 for(const run of report.runs){
  assert.equal(run.captures.length,15);
  assert.deepEqual(run.captures.map(c=>c.selectedFrame),Array.from({length:15},(_,i)=>i));
  assert.ok(run.captures.every(c=>c.selectedSrc===atlas&&c.flip===(run.facing<0)));
  const caught=run.captures.find(c=>c.tick===10);assert.equal(caught.ball.mode,'carried');assert.equal(caught.ball.owner,'kraken');
  const released=run.captures.find(c=>c.tick===21);assert.equal(released.ball.mode,'dunk');assert.equal(released.ball.owner,null);assert.equal(released.action.released,true);
  const scored=run.captures.find(c=>c.tick===23);assert.equal(scored.score[run.facing===1?0:1],2);assert.equal(scored.ball.mode,'dead');
  assert.equal(run.captures.at(-1).clip,'alley-oop-power');
 }
});
