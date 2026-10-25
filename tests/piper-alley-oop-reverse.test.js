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

const athleteId='piper-quickstep';
const clipName='alley-oop-reverse';
const atlas='./public/assets/animation/piper-quickstep-alley-oop-reverse-right.webp';
const height=[1.05,1.2,1.6,1.85,2.1,1.8,1.45,2.0,1.75,1.95,2.1,1.8,1.2,.75,.6];
const forward=[5,7,8,7,4,4,1,-3,-5,-7,-7,-5,-2,1,3];
const productionClip=animationAssetManifest.characters[athleteId].directions.right[clipName];
const {PNG}=createRequire(import.meta.url)('pngjs');


test('Piper J.124 accepted production atlas maps 15 distinct ball-free cells for both facings',()=>{
 assert.ok(productionClip,'accepted J.124 production atlas is registered');
 assert.equal(productionClip.reviewed,true,'source and native ball-track review are accepted');
 assert.equal(productionClip.provenance.candidateOnly,false,'registered source is production art');
 assert.equal(productionClip.provenance.issue,'J.124');
 assert.equal(productionClip.provenance.nativeReview.status,'accepted');
 assert.equal(productionClip.provenance.ballTrack.status,'accepted-native-review');
 assert.equal(productionClip.src,atlas);assert.equal(productionClip.columns,4);assert.equal(productionClip.rows,4);
 assert.equal(productionClip.frames.length,15);
 assert.equal(new Set(productionClip.frames.map(frame=>frame.hash)).size,15,'all athlete-only authored cells are distinct');
 assert.deepEqual(sampleBallHeight(clipName,10,athleteId),height[5]);
 assert.deepEqual(sampleBallForward(clipName,10,athleteId),forward[5]);
 assert.equal(sampleBallHeight(clipName,20,athleteId),(height[9]+height[10])/2);
 assert.equal(sampleBallForward(clipName,20,athleteId),(forward[9]+forward[10])/2);
 const png=readFileSync(new URL('../tools/generate-art/sources/piper-quickstep-alley-oop-reverse15.png',import.meta.url));
 const webp=readFileSync(new URL('../public/assets/animation/piper-quickstep-alley-oop-reverse-right.webp',import.meta.url));
 assert.equal(createHash('sha256').update(webp).digest('hex'),productionClip.sha256,'production WebP matches the manifest hash');
 assert.equal(createHash('sha256').update(png).digest('hex'),productionClip.provenance.sourceSha256,'production source PNG matches provenance');
 const image={complete:true,naturalWidth:512,naturalHeight:384,file:atlas};
 const images=new Map([[atlas,image]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation(clipName,tick).frame,frame,`runtime maps authored pose ${frame}`);
  for(const [facing,flip] of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:athleteId,facing,animation:{clip:clipName,tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips[clipName].frames[frame].duration;
 }
 assert.equal(tick,33,'authored sequence includes the landing/recovery hold beyond tick30');
 assert.equal(anchorTick(clipName,'takeoff'),4);
 assert.equal(anchorTick(clipName,'grab'),10);
 assert.equal(anchorTick(clipName,'peak'),14);
 assert.equal(anchorTick(clipName,'release'),21);
 assert.equal(anchorTick(clipName,'finish'),23);
 assert.equal(anchorTick(clipName,'land'),30);
 // The athlete sheet is the ball-free layer; the game supplies its separate ball object.
 const decoded=PNG.sync.read(png);
 let unusedCellAlpha=0;
 for(let y=288;y<384;y++)for(let x=384;x<512;x++)unusedCellAlpha=Math.max(unusedCellAlpha,decoded.data[(y*decoded.width+x)*4+3]);
 assert.equal(unusedCellAlpha,0,'the unused cell is transparent and cannot hide a baked basketball');
});

test('Piper J.124 accepted teammate lob catches10, carries20, releases21, scores23, lands30 in both facings',()=>{
 const home=teams.find(team=>team.roster.some(athlete=>athlete.id===athleteId));
 const away=teams.find(team=>team!==home);
 for(const facing of [1,-1]){
  const match=createMatch({quarterSeconds:60,seed:124,home,away,homePartnerId:athleteId});
  const piper=match.players.find(player=>player.id===athleteId);
  const passer=match.players.find(player=>player.team===piper.team&&player.id!==piper.id);
  assert.ok(piper&&passer,'real roster teammate and Piper are in the match');
  for(const player of match.players)if(player.team!==piper.team)player.x=20;
  passer.x=170;passer.y=50;piper.x=184;piper.y=46;piper.facing=facing;
  const neutral=()=>match.players.map(player=>createInput(player.id));
  stepMatch(match,[...neutral().filter(input=>input.playerId!==passer.id),createInput(passer.id,{passPressed:true,turbo:true,alleyOop:'reverse'})]);
  while(passer.animation.tick<anchorTick(passer.animation.clip,'release'))stepMatch(match,neutral());
  assert.equal(piper.animation.clip,clipName);assert.equal(piper.animation.tick,0);
  assert.equal(piper.hasBall,false);assert.equal(match.ball.mode,'pass');
  while(piper.animation.tick<10){
   stepMatch(match,neutral());
   if(piper.animation.tick<10){assert.equal(piper.hasBall,false);assert.equal(match.ball.mode,'pass','ball remains an incoming unowned lob before catch tick10');}
  }
  assert.equal(piper.animation.tick,10);assert.equal(piper.hasBall,true);assert.equal(match.ball.mode,'carried');assert.equal(match.ball.ownerId,athleteId);
  assert.ok(Math.abs(match.ball.x-(piper.x+facing*sampleBallForward(clipName,10,athleteId)))<1e-8,'separate ball reaches the candidate catch point');
  assert.ok(Math.abs(match.ball.z-(piper.z+sampleBallHeight(clipName,10,athleteId)))<1e-8,'lob transfers at the candidate contact height');
  while(piper.animation.tick<20){
   stepMatch(match,neutral());
   assert.equal(match.ball.mode,'carried');assert.equal(match.ball.ownerId,athleteId);
   assert.ok(Math.abs(match.ball.x-(piper.x+facing*sampleBallForward(clipName,piper.animation.tick,athleteId)))<1e-8);
   assert.ok(Math.abs(match.ball.z-(piper.z+sampleBallHeight(clipName,piper.animation.tick,athleteId)))<1e-8);
  }
  assert.equal(piper.animation.tick,20);assert.equal(piper.hasBall,true);assert.equal(match.score[0],0);
  stepMatch(match,neutral());
  assert.equal(piper.animation.tick,21);assert.equal(piper.hasBall,false);assert.equal(match.ball.mode,'dunk');assert.equal(match.ball.ownerId,null);assert.equal(match.score[0],0);
  const attemptId=match.ball.attemptId;
  while(piper.animation.tick<23)stepMatch(match,neutral());
  assert.deepEqual(match.scoredAttempts,[attemptId]);assert.deepEqual(match.score,[2,0]);assert.equal(piper.dunks,1);
  while(piper.animation.tick<30)stepMatch(match,neutral());
  assert.equal(piper.animation.tick,30);assert.equal(sampleAnimation(clipName,30).frame,14);
  for(let i=0;i<4;i++)stepMatch(match,neutral());
  assert.deepEqual(match.scoredAttempts,[attemptId],'candidate reverse alley-oop scores only once');assert.deepEqual(match.score,[2,0]);
 }
});
