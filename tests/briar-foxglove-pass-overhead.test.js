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
const clipName='pass-overhead';
const atlas='./public/assets/animation/briar-foxglove-pass-overhead-right.webp';
const source='../tools/generate-art/sources/j126-briar-foxglove-pass-overhead-attempt3-raw.png';
const height=[1.0,1.2,1.9,1.9,2.35,1.75];
const forward=[3.5,4,1,1,12,17];
const productionClip=animationAssetManifest.characters[athleteId].directions.right[clipName];
const {PNG}=createRequire(import.meta.url)('pngjs');

test('J.126 Briar overhead-pass atlas maps six reviewed empty-hand cells and its separate track',()=>{
 assert.ok(productionClip,'Briar J.126 atlas is registered');
 assert.equal(productionClip.reviewed,true);
 assert.equal(productionClip.provenance.candidateOnly,false);
 assert.equal(productionClip.provenance.issue,'J.126');
 assert.equal(productionClip.provenance.nativeReview.status,'accepted');
 assert.equal(productionClip.provenance.ballTrack.status,'accepted-native-review');
 assert.equal(animationAssetManifest.characters[athleteId].mirrorSafe,true);
 assert.equal(productionClip.src,atlas);assert.equal(productionClip.columns,3);assert.equal(productionClip.rows,2);
 assert.equal(productionClip.frames.length,6);
 assert.equal(new Set(productionClip.frames.map(frame=>frame.hash)).size,6,'all six authored frames are distinct');
 assert.deepEqual(animationClips[clipName].frames.map(frame=>frame.duration),[2,3,2,1,2,3]);
 assert.equal(anchorTick(clipName,'release'),7);
 assert.equal(sampleBallHeight(clipName,6,athleteId),height[2]);
 assert.equal(sampleBallForward(clipName,6,athleteId),forward[2]);
 const sourceBuffer=readFileSync(new URL(source,import.meta.url));
 const webp=readFileSync(new URL('../public/assets/animation/briar-foxglove-pass-overhead-right.webp',import.meta.url));
 assert.equal(createHash('sha256').update(webp).digest('hex'),productionClip.sha256);
 assert.equal(createHash('sha256').update(sourceBuffer).digest('hex'),productionClip.provenance.sourceSha256);
 const png=PNG.sync.read(sourceBuffer);assert.equal(png.width,1536);assert.equal(png.height,1024);
 for(const [x,y] of [[0,0],[1535,0],[0,1023],[1535,1023]])assert.equal(png.data[(y*png.width+x)*4+3],0,'source edge stays transparent');
 const image={complete:true,naturalWidth:192,naturalHeight:192,file:atlas};const images=new Map([[atlas,image]]);
 let tick=0;
 for(let frame=0;frame<6;frame++){
  assert.equal(sampleAnimation(clipName,tick).frame,frame);
  for(const [facing,flip] of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:athleteId,facing,animation:{clip:clipName,tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips[clipName].frames[frame].duration;
 }
 assert.equal(tick,13);
 for(const zoom of [100,120]){
  const report=JSON.parse(readFileSync(new URL(`../tools/generate-art/previews/j126-briar-foxglove-pass-overhead/native-${zoom}/report.json`,import.meta.url),'utf8'));
  assert.equal(report.passContactCaptures.length,2);
  assert.ok(report.passContactCaptures.every(capture=>capture.production&&capture.tick===6&&capture.ballMode==='carried'&&capture.ballOwnerId===athleteId));
  const releases=report.actionFramePreviews.filter(capture=>capture.tick===7);
  assert.equal(releases.length,2);assert.ok(releases.every(capture=>capture.production&&capture.ballMode==='pass'&&capture.ballOwnerId===null));
 }
});

test('Briar J.126 overhead pass carries through tick6 and releases at tick7 without duplicate possession',()=>{
 const home=teams.find(team=>team.roster.some(athlete=>athlete.id===athleteId));
 const away=teams.find(team=>team!==home);
 for(const facing of [1,-1]){
  const match=createMatch({quarterSeconds:60,seed:126,home,away,homePartnerId:athleteId});
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
  stepMatch(match,[...neutral().filter(input=>input.playerId!==athleteId),createInput(athleteId,{passPressed:true,turbo:true})]);
  assert.equal(briar.anim,clipName);
  while(briar.animation.tick<6)stepMatch(match,neutral());
  assert.equal(briar.animation.tick,6);assert.equal(briar.hasBall,true);assert.equal(match.ball.mode,'carried');assert.equal(match.ball.ownerId,athleteId);
  assert.ok(Math.abs(match.ball.x-(briar.x+facing*sampleBallForward(clipName,6,athleteId)))<1e-8,'last carried ball point follows Briar’s overhead hand track');
  assert.ok(Math.abs(match.ball.z-(briar.z+sampleBallHeight(clipName,6,athleteId)))<1e-8);
  stepMatch(match,neutral());
  assert.equal(briar.animation.tick,7);assert.equal(briar.hasBall,false);assert.equal(match.ball.mode,'pass');assert.equal(match.ball.ownerId,null);
  assert.equal(match.players.filter(player=>player.hasBall).length,0,'release does not duplicate possession');
  assert.equal(match.ball.targetId,target.id,'pass targets Briar’s teammate');
 }
});
