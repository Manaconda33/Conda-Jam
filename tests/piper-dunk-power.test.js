import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {animationAssetManifest} from '../src/content/animation-assets.js';
import {animationMirrorPolicy} from '../src/content/animation-mirror-policy.js';
import {animationClips,anchorTick,sampleAnimation,sampleBallHeight,sampleBallForward} from '../src/core/animation.js';
import {selectProductionSprite} from '../src/render/animation-sprites.js';
import {createInput,createMatch,stepMatch} from '../src/core/simulation.js';
import {teams} from '../src/content/teams.js';

const athleteId='piper-quickstep';
const trackHeight=[.95,1.1,1.25,1.4,1.8,2.25,1.65,2.4,2,2.2,2.2,1.5,1.1,.8,.6];
const trackForward=[4,6,8,9,10,-8,1,-6,4,12,12,7,5,4,3];
const atlas='./public/assets/animation/piper-quickstep-dunk-power-right.webp';

test('Piper J.115 selects all reviewed power-dunk poses with her accepted separate ball track',()=>{
 const character=animationAssetManifest.characters[athleteId];
 const clip=character?.directions?.right?.['dunk-power'];
 const mirror=animationMirrorPolicy[athleteId];
 assert.ok(clip,'registered Piper power-dunk atlas');
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(mirror.mirrorSafe,true);assert.equal(mirror.mirrorReview.status,'reviewed');
 assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);assert.equal(clip.sha256,'a4360dc4da767a755dc1bbe149f401c3cdb5fc83ee373c75a8b40d6f31c2a6af');
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.generationId,'exec-c0d2f99c-dc9a-4b6a-a5f2-1a6bda852b7f');
 assert.equal(clip.provenance.promptVerbatim,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.deepEqual(clip.provenance.ballTrack.height,trackHeight);assert.deepEqual(clip.provenance.ballTrack.forward,trackForward);
 assert.equal(clip.provenance.nativeReview.status,'accepted');
 const bytes=readFileSync(new URL('../public/assets/animation/piper-quickstep-dunk-power-right.webp',import.meta.url));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),clip.sha256,'production atlas bytes match manifest hash');
 const images=new Map([[atlas,{complete:true,naturalWidth:clip.columns*96,naturalHeight:clip.rows*96,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-power',tick).frame,frame,'runtime maps the authored Piper pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:athleteId,facing,animation:{clip:'dunk-power',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-power'].frames[frame].duration;
 }
 assert.equal(anchorTick('dunk-power','takeoff'),4);assert.equal(anchorTick('dunk-power','grab'),10);
 assert.equal(anchorTick('dunk-power','peak'),14);assert.equal(anchorTick('dunk-power','release'),21);
 assert.equal(anchorTick('dunk-power','finish'),23);assert.equal(anchorTick('dunk-power','land'),30);
 assert.equal(sampleBallHeight('dunk-power',10,athleteId),trackHeight[5]);
 assert.equal(sampleBallForward('dunk-power',10,athleteId),trackForward[5]);
});

test('Piper J.115 keeps possession through tick20, releases once at21, and scores at23',()=>{
 const home=teams.find(team=>team.roster.some(player=>player.id===athleteId));
 const away=teams.find(team=>team!==home);
 const match=createMatch({quarterSeconds:60,seed:115,home,away,homePartnerId:athleteId});
 const piper=match.players.find(player=>player.id===athleteId);
 assert.ok(piper,'Piper is in the active home lineup');
 for(const player of match.players)player.hasBall=false;
 piper.hasBall=true;piper.x=186;piper.y=50;piper.vx=.2;piper.dunk=99;piper.facing=1;
 piper.animation={clip:'idle-ball',tick:0};piper.anim='idle-ball';
 Object.assign(match.ball,{mode:'carried',ownerId:athleteId,lastTouch:athleteId,x:piper.x+sampleBallForward('idle-ball',0,athleteId),y:piper.y,z:sampleBallHeight('idle-ball',0,athleteId),vx:0,vy:0,vz:0,scored:false});
 match.possession=piper.team;
 const neutral=()=>match.players.map(player=>createInput(player.id));
 stepMatch(match,neutral().map(input=>input.playerId===athleteId?createInput(athleteId,{x:1,turbo:true,shootPressed:true,dunkVariant:'power'}):input));
 assert.equal(piper.animation.clip,'dunk-power');
 while(piper.animation.tick<20)stepMatch(match,neutral());
 assert.equal(piper.animation.tick,20);assert.equal(piper.hasBall,true);assert.equal(match.ball.ownerId,athleteId);assert.equal(match.ball.mode,'carried');
 stepMatch(match,neutral());
 const attemptId=match.ball.attemptId;
 assert.equal(piper.animation.tick,21);assert.equal(match.ball.mode,'dunk');assert.equal(match.ball.ownerId,null);assert.equal(piper.hasBall,false);
 assert.equal(match.score[0],0);assert.ok(attemptId?.startsWith('dunk-'));
 for(let tick=0;tick<4&&!match.scoredAttempts?.includes(attemptId);tick++)stepMatch(match,neutral());
 assert.deepEqual(match.scoredAttempts,[attemptId]);assert.deepEqual(match.score,[2,0]);
 assert.equal(piper.points,2);assert.equal(piper.dunks,1);assert.equal(match.ball.mode,'dead');assert.equal(match.ball.ownerId,null);
 assert.equal(piper.animation.clip,'dunk-power','the authored finish and landing frames remain visible after the score commits');
 assert.equal(piper.animation.tick,23);
 while(piper.animation.clip==='dunk-power')stepMatch(match,neutral());
 assert.equal(piper.animation.clip,'celebrate','celebration follows the authored landing instead of replacing it');
 assert.equal(piper.animation.tick,0);
});
