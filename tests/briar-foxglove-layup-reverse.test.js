import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {animationAssetManifest} from '../src/content/animation-assets.js';
import {animationClips,anchorTick,sampleAnimation,sampleBallHeight,sampleBallForward} from '../src/core/animation.js';
import {selectProductionSprite} from '../src/render/animation-sprites.js';
import {createInput,createMatch,stepMatch} from '../src/core/simulation.js';
import {teams} from '../src/content/teams.js';

const athleteId='briar-foxglove';
const clipName='layup-reverse';
const atlas='./public/assets/animation/briar-foxglove-layup-reverse-right.png';
const source='../public/assets/animation/briar-foxglove-layup-reverse-right.png';
const expectedHeightTicks=[1.0,1.05,1.35,1.4,1.45,1.35,1.3,1.45,1.25,1.25,1.0,1.0,2.15];
const expectedForwardTicks=[3.8,4.0,6.2,5.4,5.0,4.5,4.8,4.0,3.6,3.7,5.4,3.9,4.0];
const clip=animationAssetManifest.characters[athleteId].directions.right[clipName];
const {PNG}=createRequire(import.meta.url)('pngjs');

test('J.131 Briar reverse-layup atlas is reviewed, distinct, transparent, and mirrored safely',()=>{
 const character=animationAssetManifest.characters[athleteId];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(clip.reviewed,true);assert.equal(clip.provenance.issue,'J.131');
 assert.equal(clip.provenance.candidateOnly,false);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.ballTrack.status,'accepted-native-review');
 assert.equal(clip.src,atlas);assert.equal(clip.columns,4);assert.equal(clip.rows,2);assert.equal(clip.frames.length,8);
 assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,8);
 assert.equal(clip.provenance.candidateOnly,false);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.ballTrack.status,'accepted-native-review');
 assert.equal(clip.provenance.rawSourceSha256,'1fdf920acbb11e465244745d6dade28f30874da1784499942d236f0759122698');
 const sourceBuffer=readFileSync(new URL(source,import.meta.url));
 assert.equal(createHash('sha256').update(sourceBuffer).digest('hex'),clip.sha256);
 const png=PNG.sync.read(sourceBuffer);assert.equal(png.width,288);assert.equal(png.height,190);
 for(let frame=0;frame<8;frame++){
  const x=(frame%4)*72,y=Math.floor(frame/4)*95,alpha=[];
  for(let py=y;py<y+95;py++)for(let px=x;px<x+72;px++)if(png.data[(py*png.width+px)*4+3]>=16)alpha.push([px-x,py-y]);
  assert.ok(alpha.length>0,`pose ${frame} has visible pixels`);
  assert.ok(Math.min(...alpha.map(([px])=>px))>=6,`pose ${frame} has a left margin`);
  assert.ok(Math.min(...alpha.map(([,py])=>py))>=6,`pose ${frame} has a top margin`);
  assert.ok(Math.max(...alpha.map(([px])=>px))<66,`pose ${frame} has a right margin`);
  assert.ok(Math.max(...alpha.map(([,py])=>py))<89,`pose ${frame} aligns on baseline y=89`);
 }
 const images=new Map([[atlas,{complete:true,naturalWidth:288,naturalHeight:190,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<8;frame++){
  assert.equal(sampleAnimation(clipName,tick).frame,frame,`runtime maps pose ${frame}`);
  for(const [facing,flip] of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:athleteId,facing,animation:{clip:clipName,tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips[clipName].frames[frame].duration;
 }
 assert.equal(tick,21);assert.deepEqual(animationClips[clipName].frames.map(frame=>frame.duration),[2,3,2,3,2,1,4,4]);
});

test('J.131 Briar tick track holds the peak hand through tick11 and releases at tick12',()=>{
 assert.equal(anchorTick(clipName,'takeoff'),2);assert.equal(anchorTick(clipName,'peak'),10);
 assert.equal(anchorTick(clipName,'release'),12);assert.equal(anchorTick(clipName,'finish'),17);
 assert.deepEqual(expectedHeightTicks,[1.0,1.05,1.35,1.4,1.45,1.35,1.3,1.45,1.25,1.25,1.0,1.0,2.15]);
 for(let tick=0;tick<expectedHeightTicks.length;tick++){
  assert.equal(sampleBallHeight(clipName,tick,athleteId),expectedHeightTicks[tick]);
  assert.equal(sampleBallForward(clipName,tick,athleteId),expectedForwardTicks[tick]);
 }
 assert.equal(sampleBallHeight(clipName,11.5,athleteId),(1.0+2.15)/2);
 assert.equal(sampleBallForward(clipName,11.5,athleteId),(3.9+4.0)/2);
 assert.equal(sampleBallHeight(clipName,13,athleteId),2.15);
 assert.equal(sampleBallForward(clipName,13,athleteId),4.0);
});

test('J.131 Briar carries through tick11 then releases an ownerless shot from her hand in both facings',()=>{
 const home=teams.find(team=>team.roster.some(player=>player.id===athleteId));
 const away=teams.find(team=>team!==home);
 for(const facing of [1,-1]){
  const match=createMatch({quarterSeconds:60,seed:131,home,away,homePartnerId:athleteId});
  const briar=match.players.find(player=>player.id===athleteId);assert.ok(briar);
  briar.x=182;briar.y=55;briar.facing=facing;briar.hasBall=true;
  match.phase='playing';match.pause=false;match.possession=briar.team;match.clock=60;match.shotClock=24;
  Object.assign(match.ball,{mode:'carried',ownerId:athleteId,lastTouch:athleteId,x:briar.x+facing*sampleBallForward(clipName,0,athleteId),y:briar.y,z:sampleBallHeight(clipName,0,athleteId)});
  const neutral=()=>match.players.map(player=>createInput(player.id));
  stepMatch(match,neutral().map(input=>input.playerId===athleteId?createInput(athleteId,{shootPressed:true,layupVariant:'reverse'}):input));
  assert.equal(briar.animation.clip,clipName);
  while(briar.animation.tick<11)stepMatch(match,neutral());
  assert.equal(briar.animation.tick,11);assert.equal(briar.hasBall,true);
  assert.equal(match.ball.mode,'carried');assert.equal(match.ball.ownerId,athleteId);
  assert.ok(Math.abs(match.ball.x-(briar.x+facing*sampleBallForward(clipName,11,athleteId)))<1e-9);
  assert.ok(Math.abs(match.ball.z-(briar.z+sampleBallHeight(clipName,11,athleteId)))<1e-9);
  stepMatch(match,neutral());
  assert.equal(briar.animation.tick,12);assert.equal(briar.hasBall,false);
  assert.equal(briar.fga,1);assert.equal(match.ball.mode,'shot');assert.equal(match.ball.ownerId,null);
  assert.ok(Math.abs(match.ball.x-match.ball.vx-briar.x-facing*sampleBallForward(clipName,12,athleteId))<1e-9);
 }
});
