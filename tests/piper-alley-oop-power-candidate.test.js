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
const atlas='./public/assets/animation/piper-quickstep-alley-oop-power-right.webp';
const height=[2.4,2.2,2,1.9,1.95,1.991,1.732571,1.847429,1.962286,2.278143,2.306857,1.8,1.2,.8,.65];
const forward=[16,13,10,7,5,2.192727,2.558182,3.289091,2.192727,5.847273,6.212727,6.212727,3,1,1];
const productionClip=animationAssetManifest.characters[athleteId].directions.right['alley-oop-power'];
const {PNG}=createRequire(import.meta.url)('pngjs');
const candidateManifest=structuredClone(animationAssetManifest);
candidateManifest.characters[athleteId].directions.right['alley-oop-power'].reviewed=true;
const framePath=(i)=>({x:(i%4)*128,y:Math.floor(i/4)*96,w:128,h:96});

test('Piper J.123 accepted atlas maps 15 distinct ball-free cells in both facings',()=>{
 assert.ok(productionClip,'accepted production atlas is registered');
 assert.equal(productionClip.reviewed,true,'source and native review are accepted');
 assert.equal(productionClip.provenance.nativeReview.status,'accepted');
 assert.equal(productionClip.provenance.ballTrack.ballFreeArt,true,'source artwork remains separate from the live ball object');
 assert.deepEqual(productionClip.provenance.ballTrack.height,height);
 assert.deepEqual(productionClip.provenance.ballTrack.forward,forward);
 assert.equal(productionClip.src,atlas);assert.equal(productionClip.columns,4);assert.equal(productionClip.rows,4);
 assert.equal(productionClip.frames.length,15);
 assert.equal(new Set(productionClip.frames.map(frame=>frame.hash)).size,15,'all authored cells are unique');
 const png=readFileSync(new URL('../tools/generate-art/sources/piper-quickstep-alley-oop-power15.png',import.meta.url));
 const webp=readFileSync(new URL('../public/assets/animation/piper-quickstep-alley-oop-power-right.webp',import.meta.url));
 assert.equal(createHash('sha256').update(webp).digest('hex'),productionClip.sha256,'runtime WebP matches candidate registration');
 assert.equal(createHash('sha256').update(png).digest('hex'),productionClip.provenance.sourceSha256,'copied source PNG matches candidate');
 const image={complete:true,naturalWidth:512,naturalHeight:384,file:atlas};
 const images=new Map([[atlas,image]]);
 const candidate=candidateManifest.characters[athleteId].directions.right['alley-oop-power'];
 assert.equal(candidate.reviewed,true,'checked-in production manifest is reviewed');
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('alley-oop-power',tick).frame,frame,`runtime maps authored pose ${frame}`);
  for(const [facing,flip] of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:athleteId,facing,animation:{clip:'alley-oop-power',tick}},{manifest:candidateManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
   const productionSprite=selectProductionSprite({id:athleteId,facing,animation:{clip:'alley-oop-power',tick}},{manifest:animationAssetManifest,images});
   assert.equal(productionSprite?.atlas.file,atlas,'production selector consumes the accepted atlas');
  }
  tick+=animationClips['alley-oop-power'].frames[frame].duration;
 }
 assert.equal(tick,33,'authored sequence includes the landing/recovery hold beyond tick30');
 assert.equal(anchorTick('alley-oop-power','grab'),10);
 assert.equal(anchorTick('alley-oop-power','release'),21);
 assert.equal(anchorTick('alley-oop-power','finish'),23);
 assert.equal(anchorTick('alley-oop-power','land'),30);
 // Incoming positions are only for an unowned lob; Piper takes possession at pose05/tick10.
 assert.equal(sampleBallForward('alley-oop-power',10,athleteId),forward[5]);
 assert.equal(sampleBallHeight('alley-oop-power',10,athleteId),height[5]);
 const finalCarryForward=(forward[9]+forward[10])/2;
 const finalCarryHeight=(height[9]+height[10])/2;
 assert.equal(sampleBallForward('alley-oop-power',20,athleteId),finalCarryForward);
 assert.equal(sampleBallHeight('alley-oop-power',20,athleteId),finalCarryHeight);
 // Candidate source atlas has fifteen frame cells and a fully transparent unused 16th cell.
 const decoded=PNG.sync.read(png);
 let unusedCellAlpha=0;
 for(let y=288;y<384;y++)for(let x=384;x<512;x++)unusedCellAlpha=Math.max(unusedCellAlpha,decoded.data[(y*decoded.width+x)*4+3]);
 assert.equal(unusedCellAlpha,0,'unused cell is transparent; ball is supplied as a separate runtime object');
});

test('Piper receives the incoming lob at tick10, carries through20, releases21, scores once23 and lands30 in both facings',()=>{
 const home=teams.find(team=>team.roster.some(athlete=>athlete.id===athleteId));
 const away=teams.find(team=>team!==home);
 for(const facing of [1,-1]){
  const match=createMatch({quarterSeconds:60,seed:123,home,away,homePartnerId:athleteId});
  const piper=match.players.find(player=>player.id===athleteId);
  const passer=match.players.find(player=>player.team===piper.team&&player.id!==piper.id);
  assert.ok(piper&&passer,'real roster teammate and Piper are in the match');
  for(const player of match.players){if(player.team!==piper.team)player.x=20;}
  passer.x=170;passer.y=50;piper.x=184;piper.y=46;piper.facing=facing;
  const neutral=()=>match.players.map(player=>createInput(player.id));
  stepMatch(match,[...neutral().filter(input=>input.playerId!==passer.id),createInput(passer.id,{passPressed:true,turbo:true,alleyOop:'power'})]);
  while(passer.animation.tick<anchorTick(passer.animation.clip,'release'))stepMatch(match,neutral());
  assert.equal(piper.animation.clip,'alley-oop-power');assert.equal(piper.animation.tick,0);
  assert.equal(piper.hasBall,false);assert.equal(match.ball.mode,'pass');
  while(piper.animation.tick<10){
   stepMatch(match,neutral());
   if(piper.animation.tick<10){assert.equal(piper.hasBall,false);assert.equal(match.ball.mode,'pass','ball remains an incoming lob before tick10');}
  }
  assert.equal(piper.animation.tick,10);assert.equal(piper.hasBall,true);assert.equal(match.ball.mode,'carried');assert.equal(match.ball.ownerId,athleteId);
  assert.ok(Math.abs(match.ball.x-(piper.x+facing*sampleBallForward('alley-oop-power',10,athleteId)))<1e-8,'separate ball reaches the hand at catch');
  assert.ok(Math.abs(match.ball.z-(piper.z+sampleBallHeight('alley-oop-power',10,athleteId)))<1e-8,'lob transfers at the measured contact height');
  while(piper.animation.tick<20){
   stepMatch(match,neutral());
   assert.equal(match.ball.mode,'carried');assert.equal(match.ball.ownerId,athleteId);
   assert.ok(Math.abs(match.ball.x-(piper.x+facing*sampleBallForward('alley-oop-power',piper.animation.tick,athleteId)))<1e-8);
   assert.ok(Math.abs(match.ball.z-(piper.z+sampleBallHeight('alley-oop-power',piper.animation.tick,athleteId)))<1e-8);
  }
  assert.equal(piper.animation.tick,20);assert.equal(piper.hasBall,true);assert.equal(match.score[0],0);
  stepMatch(match,neutral());
  assert.equal(piper.animation.tick,21);assert.equal(piper.hasBall,false);assert.equal(match.ball.mode,'dunk');assert.equal(match.ball.ownerId,null);assert.equal(match.score[0],0);
  const attemptId=match.ball.attemptId;
  while(piper.animation.tick<23)stepMatch(match,neutral());
  assert.deepEqual(match.scoredAttempts,[attemptId]);assert.deepEqual(match.score,[2,0]);assert.equal(piper.dunks,1);
  while(piper.animation.tick<30)stepMatch(match,neutral());
  assert.equal(piper.animation.tick,30);assert.equal(sampleAnimation('alley-oop-power',30).frame,14);
  for(let i=0;i<4;i++)stepMatch(match,neutral());
  assert.deepEqual(match.scoredAttempts,[attemptId],'one alley-oop score is recorded');assert.deepEqual(match.score,[2,0]);
 }
});
