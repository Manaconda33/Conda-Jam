import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {animationAssetManifest} from '../src/content/animation-assets.js';
import {animationClips,anchorTick,athleteBallTrackSource,sampleAnimation,sampleBallForward,sampleBallHeight} from '../src/core/animation.js';
import {createInput,createMatch,stepMatch} from '../src/core/simulation.js';
import {teams} from '../src/content/teams.js';
import {selectProductionSprite} from '../src/render/animation-sprites.js';
import {decodeImage,inspectAtlas} from '../tools/animation-assets.mjs';

test('J.128 Krios steal has eight reviewed poses and its own tick5 contact track',async()=>{
 const clip=animationAssetManifest.characters.krios.directions.right.steal;
 const path=fileURLToPath(new URL(`../${clip.src.slice(2)}`,import.meta.url));
 assert.equal(clip.reviewed,true);assert.equal(clip.mirrorSafe,true);
 assert.equal(clip.provenance.sourceReview.status,'accepted-for-cleanup-trials');
 assert.equal(clip.provenance.cleanupReview.status,'accepted-for-gameplay-trials');
 assert.equal(clip.provenance.candidateRuntimeReview.status,'accepted-for-registration');
 assert.equal(clip.provenance.ballTrackReview.status,'accepted-for-registration');
 assert.equal(clip.provenance.registeredRuntimeReview.status,'accepted');
 assert.equal(clip.frames.length,8);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,8);
 assert.equal(clip.sha256,createHash('sha256').update(readFileSync(path)).digest('hex'));
 const decoded=await decodeImage(path);assert.deepEqual([decoded.width,decoded.height],[1024,96]);
 const atlas=await inspectAtlas(path,clip.frames);assert.equal(atlas.frames.length,8);
 assert.ok(atlas.frames.every(frame=>frame.visiblePixels>0&&!frame.error));
 assert.deepEqual(animationClips.steal.frames.map(frame=>frame.duration),[2,2,1,1,2,2,3,3]);
 assert.equal(anchorTick('steal','grab'),5);
 const starts=[0,2,4,5,6,8,10,13];
 for(const [frame,tick] of starts.entries()){
  assert.equal(sampleAnimation('steal',tick).frame,frame);
  for(const [facing,flip] of [[1,false],[-1,true]]){
   const selected=selectProductionSprite({id:'krios',facing,animation:{clip:'steal',tick}},{manifest:animationAssetManifest,images:new Map([[clip.src,{complete:true,naturalWidth:1024,naturalHeight:96,file:clip.src}]])});
   assert.equal(selected?.src,clip.src);assert.equal(selected?.frame,frame);assert.equal(selected?.flip,flip);
  }
 }
 assert.equal(athleteBallTrackSource('krios','steal','height'),'krios');
 assert.equal(athleteBallTrackSource('krios','steal','forward'),'krios');
 assert.equal(sampleBallHeight('steal',anchorTick('steal','grab'),'krios'),.5);
 assert.equal(sampleBallForward('steal',anchorTick('steal','grab'),'krios'),8);

 const scoria=teams.find(team=>team.id==='scoria-rams'),blackthorn=teams.find(team=>team.id==='blackthorn-court-kings');
 for(const facing of [1,-1]){
  const match=createMatch({quarterSeconds:180,seed:1,home:facing>0?scoria:blackthorn,away:facing>0?blackthorn:scoria});
  const player=match.players.find(value=>value.id==='krios');
  const holder=match.players.find(value=>value.team!==player.team);
  match.players=[player,holder];match.possession=holder.team;match.rng=1;
  Object.assign(player,{x:100,y:90,vx:0,vy:0,vz:0,z:0,facing,hasBall:false,stun:0,animation:{clip:'idle',tick:0}});
  Object.assign(holder,{x:100+facing*4,y:84,vx:0,vy:0,vz:0,z:0,facing:-facing,hasBall:true,stun:0,animation:{clip:'idle-ball',tick:0}});
  Object.assign(match.ball,{mode:'carried',ownerId:holder.id,targetId:null,lastTouch:holder.id,attemptId:null,scored:false,vx:0,vy:0,vz:0,x:holder.x+holder.facing*6,y:holder.y,z:1});
  stepMatch(match,[createInput(player.id,{stealPressed:true}),createInput(holder.id)]);
  while(player.animation.tick<anchorTick('steal','grab'))stepMatch(match,[createInput(player.id),createInput(holder.id)]);
  assert.equal(player.steals,1);assert.equal(holder.stun,29);
  assert.equal(player.hasBall,false);assert.equal(holder.hasBall,false);
  assert.equal(match.ball.mode,'loose');assert.equal(match.ball.ownerId,null);assert.equal(match.ball.lastTouch,player.id);
  assert.ok(Math.abs(match.ball.x-(player.x+facing*8.42))<1e-9);
  assert.ok(Math.abs(match.ball.z-.62)<1e-9);
 }

 const runtime=JSON.parse(readFileSync(new URL('../tools/generate-art/previews/j128-krios-steal-track-candidate/attempt-01/registered-runtime/report.json',import.meta.url),'utf8'));
 assert.equal(runtime.runtimeIntegration,true);assert.equal(runtime.candidateAtlasInjected,false);assert.equal(runtime.candidateTrackInjected,false);
 assert.equal(runtime.captureCount,36);assert.deepEqual(runtime.uncaughtBrowserErrors,[]);
 const poses=runtime.runs.filter(run=>run.mode==='full-pose-sequence');assert.equal(poses.length,4);
 for(const run of poses){assert.equal(run.captures.length,8);for(const [frame,capture] of run.captures.entries()){
  assert.equal(capture.frame,frame);assert.equal(capture.src,clip.src);assert.equal(capture.flip,run.facing<0);
  assert.equal(capture.hasBall,false);assert.equal(capture.steals,0);
 }}
 const contacts=runtime.runs.filter(run=>run.mode==='successful-contact');assert.equal(contacts.length,4);
 for(const contact of contacts){assert.equal(contact.tick,5);assert.equal(contact.frame,3);assert.equal(contact.steals,1);
  assert.equal(contact.playerHasBall,false);assert.equal(contact.holderHasBall,false);assert.equal(contact.ball.mode,'loose');assert.equal(contact.ball.ownerId,null);
 }
});
