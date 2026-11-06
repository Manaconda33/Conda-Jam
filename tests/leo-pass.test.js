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

const athleteId='leo';
const clipName='pass';
const atlas='./public/assets/animation/leo-pass-right.webp';
const source='../tools/generate-art/sources/j105-leo-pass-generated-raw.png';
const height=[1.65,1.9,1.9,2.05,2.0,1.05];
const forward=[3.75,4.75,8.5,9.75,9,7];
const productionClip=animationAssetManifest.characters[athleteId].directions.right[clipName];
const {PNG}=createRequire(import.meta.url)('pngjs');

test('J.105 Leo chest-pass atlas has six original empty-hand poses and separate-track lineage',()=>{
 assert.ok(productionClip,'Leo J.105 source atlas is registered');
 assert.equal(productionClip.reviewed,true);
 assert.equal(productionClip.provenance.generationId,'exec-89d2bf88-8242-466a-8c1a-429d0e79abef');
 assert.equal(productionClip.provenance.rawSourceSha256,'4e63db8875624152a65d47fa80eb8fb0da4b85165a705d7f0c9492a1c8af74c4');
 assert.equal(productionClip.src,atlas);assert.equal(productionClip.columns,3);assert.equal(productionClip.rows,2);
 assert.equal(productionClip.frames.length,6);
 assert.equal(new Set(productionClip.frames.map(frame=>frame.hash)).size,6,'all six authored frames are distinct');
 assert.deepEqual(animationClips[clipName].frames.map(frame=>frame.duration),[2,2,1,1,2,3]);
 assert.equal(anchorTick(clipName,'release'),5);
 assert.deepEqual(height.map((_,i)=>sampleBallHeight(clipName,[0,2,4,5,6,8][i],athleteId)),height);
 assert.deepEqual(forward.map((_,i)=>sampleBallForward(clipName,[0,2,4,5,6,8][i],athleteId)),forward);
 const sourceBuffer=readFileSync(new URL(source,import.meta.url));
 const webp=readFileSync(new URL('../public/assets/animation/leo-pass-right.webp',import.meta.url));
 assert.equal(createHash('sha256').update(webp).digest('hex'),productionClip.sha256);
 assert.equal(createHash('sha256').update(sourceBuffer).digest('hex'),productionClip.provenance.rawSourceSha256);
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
 assert.equal(tick,11,'pass preserves the complete six-pose timing');
});

test('J.105 Leo chest pass carries through tick4 and releases once at tick5 in both facings',()=>{
 const sourceHome=teams.find(team=>team.roster.some(athlete=>athlete.id===athleteId));
 const home={...sourceHome,roster:[...sourceHome.roster]};
 // Simulation lineup slots are captain then partner; swap these test slots so
 // Leo appears once as the passer instead of selecting the captain twice.
 [home.roster[0],home.roster[1]]=[home.roster[1],home.roster[0]];
 const away=teams.find(team=>team!==home);
 for(const facing of [1,-1]){
  const match=createMatch({quarterSeconds:60,seed:105,home,away,homePartnerId:athleteId});
  const leo=match.players.find(player=>player.id===athleteId);
  const target=match.players.find(player=>player.team===leo.team&&player.id!==leo.id);
  assert.ok(target,'Leo has a real teammate target');
  for(const player of match.players){player.hasBall=false;if(player.team!==leo.team)player.x=facing>0?15:185;else if(player!==target){player.x=facing>0?45:155;player.y=80;}}
  leo.x=facing>0?82:118;leo.y=50;leo.facing=facing;leo.hasBall=true;
  target.x=leo.x+facing*24;target.y=50;target.hasBall=false;
  match.phase='playing';match.pause=false;match.possession=leo.team;match.clock=60;match.shotClock=24;
  Object.assign(match.ball,{mode:'carried',ownerId:athleteId,targetId:null,aerialTargetId:null,lastTouch:athleteId,x:leo.x+facing*sampleBallForward(clipName,0,athleteId),y:leo.y,z:sampleBallHeight(clipName,0,athleteId)});
  const neutral=()=>match.players.map(player=>createInput(player.id));
  stepMatch(match,[...neutral().filter(input=>input.playerId!==athleteId),createInput(athleteId,{passPressed:true})]);
  assert.equal(leo.anim,clipName);
  while(leo.animation.tick<4)stepMatch(match,neutral());
  assert.equal(leo.animation.tick,4);assert.equal(leo.hasBall,true);assert.equal(match.ball.mode,'carried');assert.equal(match.ball.ownerId,athleteId);
  assert.ok(Math.abs(match.ball.x-(leo.x+facing*sampleBallForward(clipName,4,athleteId)))<1e-8,'carried ball follows Leo through the last pre-release frame');
  assert.ok(Math.abs(match.ball.z-(leo.z+sampleBallHeight(clipName,4,athleteId)))<1e-8);
  const releaseBase={x:leo.x,y:leo.y,z:leo.z};
  stepMatch(match,neutral());
  assert.equal(leo.animation.tick,5);assert.equal(leo.hasBall,false);assert.equal(match.ball.mode,'pass');assert.equal(match.ball.ownerId,null);
  assert.equal(match.players.filter(player=>player.hasBall).length,0,'release does not duplicate possession');
  assert.equal(match.ball.targetId,target.id,'the pass targets Leo’s teammate');
  const releaseExpectedX=releaseBase.x+facing*sampleBallForward(clipName,5,athleteId);
  assert.ok(Math.abs(match.ball.x-match.ball.vx-releaseExpectedX)<1e-8,'the ball advances from Leo’s frame3 hand point during the release tick');
  assert.ok(Math.abs(match.ball.z-(releaseBase.z+sampleBallHeight(clipName,5,athleteId)+.02))<1e-8,'the first free-flight step starts at Leo’s frame3 ball height');
  const released={x:match.ball.x,y:match.ball.y,z:match.ball.z};stepMatch(match,neutral());
  assert.equal(match.ball.mode,'pass');assert.equal(match.ball.ownerId,null);
  assert.notDeepEqual({x:match.ball.x,y:match.ball.y,z:match.ball.z},released,'free ball advances after the tick5 release');
 }
});
