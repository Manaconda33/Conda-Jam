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
const clipName='pass';
const atlas='./public/assets/animation/briar-foxglove-pass-right.webp';
const source='../tools/generate-art/sources/j125-briar-foxglove-pass-generated-raw.png';
const height=[1.0,1.15,1.4,1.55,1.5,1.05];
const forward=[7.5,8,12,19,18,9];
const productionClip=animationAssetManifest.characters[athleteId].directions.right[clipName];
const {PNG}=createRequire(import.meta.url)('pngjs');

test('J.125 Briar chest-pass atlas uses six accepted athlete-only cells and a separate track',()=>{
 assert.ok(productionClip,'Briar J.125 production atlas is registered');
 assert.equal(productionClip.reviewed,true);
 assert.equal(productionClip.provenance.candidateOnly,false);
 assert.equal(productionClip.provenance.issue,'J.125');
 assert.equal(productionClip.provenance.nativeReview.status,'accepted');
 assert.equal(productionClip.provenance.ballTrack.status,'accepted-native-review');
 assert.equal(animationAssetManifest.characters[athleteId].mirrorSafe,true);
 assert.equal(productionClip.src,atlas);assert.equal(productionClip.columns,3);assert.equal(productionClip.rows,2);
 assert.equal(productionClip.frames.length,6);
 assert.equal(new Set(productionClip.frames.map(frame=>frame.hash)).size,6,'all six authored frames are distinct');
 assert.deepEqual(animationClips[clipName].frames.map(frame=>frame.duration),[2,2,1,1,2,3]);
 assert.equal(anchorTick(clipName,'release'),5);
 assert.deepEqual(sampleBallHeight(clipName,4,athleteId),height[2]);
 assert.deepEqual(sampleBallForward(clipName,4,athleteId),forward[2]);
 assert.equal(sampleBallHeight(clipName,5,athleteId),height[3]);
 assert.equal(sampleBallForward(clipName,5,athleteId),forward[3]);
 const sourceBuffer=readFileSync(new URL(source,import.meta.url));
 const webp=readFileSync(new URL('../public/assets/animation/briar-foxglove-pass-right.webp',import.meta.url));
 assert.equal(createHash('sha256').update(webp).digest('hex'),productionClip.sha256);
 assert.equal(createHash('sha256').update(sourceBuffer).digest('hex'),productionClip.provenance.sourceSha256);
 const png=PNG.sync.read(sourceBuffer);assert.equal(png.width,1536);assert.equal(png.height,1024);
 for(const [x,y] of [[0,0],[1535,0],[0,1023],[1535,1023]])assert.equal(png.data[(y*png.width+x)*4+3],0,'source edge stays transparent');
 const image={complete:true,naturalWidth:336,naturalHeight:192,file:atlas};const images=new Map([[atlas,image]]);
 let tick=0;
 for(let frame=0;frame<6;frame++){
  assert.equal(sampleAnimation(clipName,tick).frame,frame);
  for(const [facing,flip] of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:athleteId,facing,animation:{clip:clipName,tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips[clipName].frames[frame].duration;
 }
 assert.equal(tick,11,'the pass follows its full six-pose timing');
});

test('Briar J.125 chest pass carries through tick4 and releases once at tick5 in both facings',()=>{
 const home=teams.find(team=>team.roster.some(athlete=>athlete.id===athleteId));
 const away=teams.find(team=>team!==home);
 for(const facing of [1,-1]){
  const match=createMatch({quarterSeconds:60,seed:125,home,away,homePartnerId:athleteId});
  const briar=match.players.find(player=>player.id===athleteId);
  assert.ok(briar,'Briar is present in the real roster match');
  const target=match.players.find(player=>player.team===briar.team&&player.id!==briar.id);
  assert.ok(target,'Briar has a real teammate target');
  for(const player of match.players){
   player.hasBall=false;
   if(player.team!==briar.team)player.x=facing>0?15:185;
   else if(player!==target){player.x=facing>0?45:155;player.y=80;}
  }
  briar.x=facing>0?82:118;briar.y=50;briar.facing=facing;briar.hasBall=true;
  target.x=briar.x+facing*24;target.y=50;target.hasBall=false;
  match.phase='playing';match.pause=false;match.possession=briar.team;match.clock=60;match.shotClock=24;
  Object.assign(match.ball,{mode:'carried',ownerId:athleteId,targetId:null,aerialTargetId:null,lastTouch:athleteId,x:briar.x+facing*sampleBallForward(clipName,0,athleteId),y:briar.y,z:sampleBallHeight(clipName,0,athleteId)});
  const neutral=()=>match.players.map(player=>createInput(player.id));
  stepMatch(match,[...neutral().filter(input=>input.playerId!==athleteId),createInput(athleteId,{passPressed:true})]);
  assert.equal(briar.anim,clipName);
  while(briar.animation.tick<4)stepMatch(match,neutral());
  assert.equal(briar.animation.tick,4);assert.equal(briar.hasBall,true);assert.equal(match.ball.mode,'carried');assert.equal(match.ball.ownerId,athleteId);
  assert.ok(Math.abs(match.ball.x-(briar.x+facing*sampleBallForward(clipName,4,athleteId)))<1e-8,'last carried ball point follows Briar’s separate track');
  assert.ok(Math.abs(match.ball.z-(briar.z+sampleBallHeight(clipName,4,athleteId)))<1e-8);
  stepMatch(match,neutral());
  assert.equal(briar.animation.tick,5);assert.equal(briar.hasBall,false);assert.equal(match.ball.mode,'pass');assert.equal(match.ball.ownerId,null);
  assert.equal(match.players.filter(player=>player.hasBall).length,0,'release does not duplicate possession');
  assert.equal(match.ball.targetId,target.id,'the pass targets Briar’s teammate');
 }
});
