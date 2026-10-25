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
const atlas='./public/assets/animation/piper-quickstep-dunk-clutch-right.webp';
const trackHeight=[.871142857142857,.9285714285714283,1.3305714285714285,1.273142857142857,1.1295714285714287,1.1295714285714287,.7849999999999999,.8424285714285712,1.45,3,1.1869999999999998,.6414285714285712,.469142857142857,.41171428571428564,.6988571428571427];
const trackForward=[2.9236363636363634,-7.674545454545454,5.116363636363636,5.116363636363636,3.6545454545454548,2.558181818181818,-1.0963636363636362,-1.0963636363636362,-4.5,10.598181818181818,5.847272727272727,1.8272727272727274,.7309090909090908,0,-1.4618181818181817];

test('Piper J.121 selects all reviewed clutch-dunk poses with her separate ball track',()=>{
 const character=animationAssetManifest.characters[athleteId];
 const clip=character?.directions?.right?.['dunk-clutch'];
 const mirror=animationMirrorPolicy[athleteId];
 assert.ok(clip,'registered Piper clutch-dunk atlas');
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(mirror.mirrorSafe,true);assert.equal(mirror.mirrorReview.status,'reviewed');
 assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.match(clip.sha256,/^[a-f0-9]{64}$/);
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.sourceReview.status,'accepted');
 assert.equal(clip.provenance.nativeReview.status,'accepted');
 assert.deepEqual(clip.provenance.ballTrack.height,trackHeight);
 assert.deepEqual(clip.provenance.ballTrack.forward,trackForward);
 assert.equal(clip.provenance.ballTrack.releaseFrame,10);
 assert.equal(clip.provenance.ballTrack.releaseTick,21);
 assert.match(clip.provenance.ballTrack.knownLimitation,/120%/);
 assert.equal(anchorTick('dunk-clutch','takeoff'),4);
 assert.equal(anchorTick('dunk-clutch','grab'),10);
 assert.equal(anchorTick('dunk-clutch','peak'),14);
 assert.equal(anchorTick('dunk-clutch','release'),21);
 assert.equal(anchorTick('dunk-clutch','finish'),23);
 assert.equal(anchorTick('dunk-clutch','land'),30);
 const bytes=readFileSync(new URL('../public/assets/animation/piper-quickstep-dunk-clutch-right.webp',import.meta.url));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),clip.sha256,'production atlas bytes match manifest hash');
 const atlasWidth=Math.max(...clip.frames.map(frame=>frame.x+frame.w));
 const atlasHeight=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:atlasWidth,naturalHeight:atlasHeight,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-clutch',tick).frame,frame,'runtime maps the authored Piper pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:athleteId,facing,animation:{clip:'dunk-clutch',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-clutch'].frames[frame].duration;
 }
 assert.ok(Math.abs(sampleBallHeight('dunk-clutch',20,athleteId)-2.0935)<1e-9);
 assert.ok(Math.abs(sampleBallForward('dunk-clutch',20,athleteId)-8.222727272727273)<1e-9);
});

test('Piper J.121 holds the clutch-dunk ball through tick20, releases once, and scores a two-point dunk',()=>{
 const home=teams.find(team=>team.roster.some(athlete=>athlete.id===athleteId));
 const away=teams.find(team=>team!==home);
 const match=createMatch({quarterSeconds:60,seed:121,home,away,homePartnerId:athleteId});
 const piper=match.players.find(player=>player.id===athleteId);
 assert.ok(piper,'Piper is in the active home lineup');
 for(const player of match.players)player.hasBall=false;
 piper.hasBall=true;piper.x=186;piper.y=50;piper.vx=.2;piper.dunk=99;piper.facing=1;
 piper.animation={clip:'idle-ball',tick:0};piper.anim='idle-ball';
 Object.assign(match.ball,{mode:'carried',ownerId:athleteId,lastTouch:athleteId,x:piper.x+sampleBallForward('idle-ball',0,athleteId),y:piper.y,z:sampleBallHeight('idle-ball',0,athleteId),vx:0,vy:0,vz:0,scored:false});
 match.possession=piper.team;
 const neutral=()=>match.players.map(player=>createInput(player.id));
 const inputs=neutral().map(input=>input.playerId===athleteId?createInput(athleteId,{x:1,turbo:true,shootPressed:true,dunkVariant:'clutch'}):input);
 stepMatch(match,inputs);
 assert.equal(piper.animation.clip,'dunk-clutch');
 while(piper.animation.tick<20)stepMatch(match,neutral());
 assert.equal(piper.animation.tick,20);assert.equal(piper.hasBall,true);
 assert.equal(match.ball.ownerId,athleteId);assert.equal(match.ball.mode,'carried');
 stepMatch(match,neutral());
 const attemptId=match.ball.attemptId;
 assert.equal(piper.animation.tick,21);assert.equal(match.ball.mode,'dunk');
 assert.equal(match.ball.ownerId,null);assert.equal(piper.hasBall,false);
 assert.equal(match.score[0],0);assert.ok(attemptId?.startsWith('dunk-'));
 for(let tick=0;tick<4&&!match.scoredAttempts?.includes(attemptId);tick++)stepMatch(match,neutral());
 assert.deepEqual(match.scoredAttempts,[attemptId]);assert.deepEqual(match.score,[2,0]);
 assert.equal(piper.points,2);assert.equal(piper.dunks,1);
 assert.equal(match.ball.mode,'dead');assert.equal(match.ball.ownerId,null);
});
