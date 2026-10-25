import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, anchorTick, sampleAnimation, sampleBallHeight, sampleBallForward } from '../src/core/animation.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';
import { createInput, createMatch, stepMatch } from '../src/core/simulation.js';
import { teams } from '../src/content/teams.js';

const athleteId='briar-foxglove';
const clipName='receive';
const atlas='./public/assets/animation/briar-foxglove-receive-right.webp';
const source='../tools/generate-art/sources/j128-briar-foxglove-receive-generated-raw.png';
const height=[1.35,1.55,1.2,1.2];
const forward=[9,14,8,8];
const productionClip=animationAssetManifest.characters[athleteId].directions.right[clipName];
const provenance=productionClip.provenance;
const {PNG}=createRequire(import.meta.url)('pngjs');

 test('J.128 Briar receive atlas preserves four reviewed cells, exact source and separate track',()=>{
  assert.ok(productionClip);
  assert.equal(productionClip.reviewed,true);
  assert.equal(provenance.candidateOnly,false);
  assert.equal(provenance.issue,'J.128');
  assert.equal(provenance.review.status,'accepted');
  assert.equal(provenance.nativeReview.status,'accepted');
  assert.equal(provenance.ballTrack.status,'accepted-native-review');
  assert.equal(provenance.promptFile,'tools/generate-art/j128-briar-foxglove-receive-prompt-attempt1.md');
  assert.ok(provenance.prompt.includes('cell10 catch anchor at tick4'));
  assert.equal(provenance.generationId,'exec-d2811147-b61e-47df-a83a-951d43c4dc9b');
  assert.equal(animationAssetManifest.characters[athleteId].mirrorSafe,true);
  assert.equal(productionClip.src,atlas);
  assert.equal(productionClip.columns,2);assert.equal(productionClip.rows,2);assert.equal(productionClip.frames.length,4);
  assert.equal(new Set(productionClip.frames.map(frame=>frame.hash)).size,4);
  assert.deepEqual(animationClips[clipName].frames.map(frame=>frame.duration),[2,2,1,3]);
  assert.equal(anchorTick(clipName,'grab'),4);
  assert.deepEqual(provenance.ballTrack.height,height);assert.deepEqual(provenance.ballTrack.forward,forward);
  assert.deepEqual(provenance.sourceCellReview.map(pose=>Math.min(...pose.marginsLTRB)),[78,77,100,105]);
  const raw=readFileSync(new URL(source,import.meta.url));
  const webp=readFileSync(new URL('../public/assets/animation/briar-foxglove-receive-right.webp',import.meta.url));
  assert.equal(createHash('sha256').update(raw).digest('hex'),provenance.sourceSha256);
  assert.equal(createHash('sha256').update(webp).digest('hex'),productionClip.sha256);
  const png=PNG.sync.read(raw);assert.deepEqual([png.width,png.height],[1254,1254]);
  for(const [x,y] of [[0,0],[1253,0],[0,1253],[1253,1253]])assert.equal(png.data[(y*png.width+x)*4+3],0);
  let tick=0;
  for(let frame=0;frame<4;frame++){
   assert.equal(sampleAnimation(clipName,tick).frame,frame);
   for(const [facing,flip] of [[1,false],[-1,true]]){
    const sprite=selectProductionSprite({id:athleteId,facing,animation:{clip:clipName,tick}},{manifest:animationAssetManifest,images:new Map([[atlas,{complete:true,naturalWidth:192,naturalHeight:192,file:atlas}]])});
    assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
   }
   tick+=animationClips[clipName].frames[frame].duration;
  }
  assert.equal(tick,8);
  for(const zoom of [100,120]){
   const report=JSON.parse(readFileSync(new URL(`../tools/generate-art/previews/j128-briar-foxglove-receive/native-${zoom}/report.json`,import.meta.url),'utf8'));
   assert.equal(report.cameraZoom,zoom);assert.equal(report.actionFramePreviews.length,8);
   assert.ok(report.actionFramePreviews.every(capture=>capture.production&&capture.source===atlas&&capture.ballMode==='carried'&&capture.ballOwnerId===athleteId));
   assert.ok(report.actionFramePreviews.some(capture=>capture.tick===4&&capture.selectedFrame===2));
   assert.ok(report.actionFramePreviews.some(capture=>capture.tick===5&&capture.selectedFrame===3));
  }
 });

test('Briar receives the separate pass at frame2/tick4 and carries through frame3 in both facings',()=>{
 const home=teams.find(team=>team.roster.some(athlete=>athlete.id===athleteId));
 const away=teams.find(team=>team!==home);
 for(const facing of [1,-1]){
  const match=createMatch({quarterSeconds:60,seed:128,home,away,homePartnerId:athleteId});
  const briar=match.players.find(player=>player.id===athleteId);
  const passer=match.players.find(player=>player.team===briar.team&&player.id!==briar.id);
  assert.ok(briar&&passer);
  for(const player of match.players){
   player.hasBall=false;player.vx=player.vy=player.vz=player.z=0;
   if(player.team!==briar.team){player.x=15;player.y=0;}
   else if(player!==passer){player.x=facing>0?45:155;player.y=80;}
  }
  briar.x=100;briar.y=50;briar.facing=facing;passer.x=70;passer.y=50;
  match.phase='playing';match.pause=false;
  Object.assign(match.ball,{mode:'pass',ownerId:null,targetId:briar.id,aerialTargetId:null,lastTouch:passer.id,x:briar.x,y:briar.y,z:1.2,vx:0,vy:0,vz:0});
  const neutral=()=>match.players.map(player=>createInput(player.id));
  stepMatch(match,neutral());assert.equal(briar.animation.clip,clipName);assert.equal(briar.hasBall,false);
  while(briar.animation.tick<4){stepMatch(match,neutral());if(briar.animation.tick<4)assert.equal(briar.hasBall,false);}
  assert.equal(briar.animation.tick,4);assert.equal(sampleAnimation(clipName,4).frame,2);
  assert.equal(briar.hasBall,true);assert.equal(match.ball.mode,'carried');assert.equal(match.ball.ownerId,athleteId);
  assert.ok(Math.abs(match.ball.x-(briar.x+facing*sampleBallForward(clipName,4,athleteId)))<1e-8);
  assert.ok(Math.abs(match.ball.z-(briar.z+sampleBallHeight(clipName,4,athleteId)))<1e-8);
  stepMatch(match,neutral());assert.equal(briar.animation.tick,5);assert.equal(briar.hasBall,true);
  assert.equal(match.ball.ownerId,athleteId);
 }
});
