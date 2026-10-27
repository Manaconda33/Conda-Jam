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
const clipName='pass-behind';
const atlas='./public/assets/animation/leo-pass-behind-right.webp';
const source='../tools/generate-art/sources/j107-leo-pass-behind-generated-raw.png';
const height=[1.6,1.05,1.2,1.6,1.1,1];
const forward=[4,2,-6,-10,-10,3];
const productionClip=animationAssetManifest.characters[athleteId].directions.right[clipName];
const {PNG}=createRequire(import.meta.url)('pngjs');

test('J.107 Leo behind-pass atlas has six original empty-hand poses and separate-track lineage',()=>{
 assert.ok(productionClip,'Leo J.107 source atlas is registered');
 assert.equal(productionClip.reviewed,true);
 assert.equal(productionClip.provenance.generationId,'exec-2ff99ab9-fa21-4f68-882c-76c419637383');
 assert.equal(productionClip.provenance.rawSourceSha256,'18914b89eb98624ee30dbf57d94a85bfdfb69a7a5a24ab853f7189e586474370');
 assert.equal(productionClip.src,atlas);assert.equal(productionClip.columns,3);assert.equal(productionClip.rows,2);
 assert.equal(productionClip.frames.length,6);
 assert.equal(new Set(productionClip.frames.map(frame=>frame.hash)).size,6,'all six authored frames are distinct');
 assert.deepEqual(animationClips[clipName].frames.map(frame=>frame.duration),[2,2,3,1,2,3]);
 assert.equal(anchorTick(clipName,'release'),7);
 assert.deepEqual(height.map((_,i)=>sampleBallHeight(clipName,[0,2,4,7,8,10][i],athleteId)),height);
 assert.deepEqual(forward.map((_,i)=>sampleBallForward(clipName,[0,2,4,7,8,10][i],athleteId)),forward);
 const sourceBuffer=readFileSync(new URL(source,import.meta.url));
 const webp=readFileSync(new URL('../public/assets/animation/leo-pass-behind-right.webp',import.meta.url));
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
 assert.equal(tick,13,'pass-overhead preserves the complete six-pose timing');
});

test('J.107 Leo behind pass carries through tick6 and releases once at tick7 in both facings',()=>{
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
  stepMatch(match,[...neutral().filter(input=>input.playerId!==athleteId),createInput(athleteId,{passPressed:true,passVariant:'pass-behind'})]);
  assert.equal(leo.anim,clipName);
  while(leo.animation.tick<6)stepMatch(match,neutral());
  assert.equal(leo.animation.tick,6);assert.equal(leo.hasBall,true);assert.equal(match.ball.mode,'carried');assert.equal(match.ball.ownerId,athleteId);
  assert.ok(Math.abs(match.ball.x-(leo.x+facing*sampleBallForward(clipName,6,athleteId)))<1e-8,'carried ball follows Leo through the last pre-release frame');
  assert.ok(Math.abs(match.ball.z-(leo.z+sampleBallHeight(clipName,6,athleteId)))<1e-8);
  const releaseBase={x:leo.x,y:leo.y,z:leo.z};
  stepMatch(match,neutral());
  assert.equal(leo.animation.tick,7);assert.equal(leo.hasBall,false);assert.equal(match.ball.mode,'pass');assert.equal(match.ball.ownerId,null);
  assert.equal(match.players.filter(player=>player.hasBall).length,0,'release does not duplicate possession');
  assert.equal(match.ball.targetId,target.id,'the pass targets Leo’s teammate');
  const releaseExpectedX=releaseBase.x+facing*sampleBallForward(clipName,7,athleteId);
  assert.ok(Math.abs(match.ball.x-match.ball.vx-releaseExpectedX)<1e-8,'the ball advances from Leo’s frame3 hand point during the release tick');
  assert.ok(Math.abs(match.ball.z-(releaseBase.z+sampleBallHeight(clipName,7,athleteId)+.02))<1e-8,'the first free-flight step starts at Leo’s frame3 ball height');
  const released={x:match.ball.x,y:match.ball.y,z:match.ball.z};stepMatch(match,neutral());
  assert.equal(match.ball.mode,'pass');assert.equal(match.ball.ownerId,null);
  assert.notDeepEqual({x:match.ball.x,y:match.ball.y,z:match.ball.z},released,'free ball advances after the tick7 release');
 }
});
