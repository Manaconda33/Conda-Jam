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
const atlas='./public/assets/animation/piper-quickstep-dunk-360-right.webp';
const trackHeight=[.95,1.1,.55,1.3,1.45,1.25,1.2,2,1,1.8,3.2,2.4,1.5,.7,.55];
const trackForward=[6,6,4,5,0,-4,12,-8,10,-4,3,8,8,5,5];

test('Piper J.118 selects all reviewed 360-dunk poses with her accepted separate ball track',()=>{
 const character=animationAssetManifest.characters[athleteId];
 const clip=character?.directions?.right?.['dunk-360'];
 const mirror=animationMirrorPolicy[athleteId];
 assert.ok(clip,'registered Piper 360-dunk atlas');
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(mirror.mirrorSafe,true);assert.equal(mirror.mirrorReview.status,'reviewed');
 assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.match(clip.sha256,/^[a-f0-9]{64}$/);
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.sourceReview.status,'accepted');
 assert.equal(clip.provenance.nativeReview.status,'accepted');
 assert.deepEqual(clip.provenance.ballTrack.height,trackHeight);
 assert.deepEqual(clip.provenance.ballTrack.forward,trackForward);
 assert.equal(clip.provenance.ballTrack.releaseTick,21);
 assert.equal(clip.provenance.nativeReview.status,'accepted');
 const bytes=readFileSync(new URL('../public/assets/animation/piper-quickstep-dunk-360-right.webp',import.meta.url));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),clip.sha256,'production atlas bytes match manifest hash');
 const atlasWidth=Math.max(...clip.frames.map(frame=>frame.x+frame.w));
 const atlasHeight=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:atlasWidth,naturalHeight:atlasHeight,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-360',tick).frame,frame,'runtime maps the authored Piper pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:athleteId,facing,animation:{clip:'dunk-360',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-360'].frames[frame].duration;
 }
 assert.equal(anchorTick('dunk-360','takeoff'),4);assert.equal(anchorTick('dunk-360','grab'),10);
 assert.equal(anchorTick('dunk-360','peak'),14);assert.equal(anchorTick('dunk-360','release'),21);
 assert.equal(anchorTick('dunk-360','finish'),23);assert.equal(anchorTick('dunk-360','land'),30);
 assert.equal(sampleBallHeight('dunk-360',20,athleteId),2.5);
 assert.equal(sampleBallForward('dunk-360',20,athleteId),-.5);
});

test('Piper J.118 keeps the ball through tick20, releases once, and scores a two-point 360 dunk',()=>{
 const home=teams.find(team=>team.roster.some(athlete=>athlete.id===athleteId));
 const away=teams.find(team=>team!==home);
 const match=createMatch({quarterSeconds:60,seed:118,home,away,homePartnerId:athleteId});
 const piper=match.players.find(player=>player.id===athleteId);
 assert.ok(piper,'Piper is in the active home lineup');
 for(const player of match.players)player.hasBall=false;
 piper.hasBall=true;piper.x=186;piper.y=50;piper.vx=.2;piper.dunk=99;piper.facing=1;
 piper.animation={clip:'idle-ball',tick:0};piper.anim='idle-ball';
 Object.assign(match.ball,{mode:'carried',ownerId:athleteId,lastTouch:athleteId,x:piper.x+sampleBallForward('idle-ball',0,athleteId),y:piper.y,z:sampleBallHeight('idle-ball',0,athleteId),vx:0,vy:0,vz:0,scored:false});
 match.possession=piper.team;
 const neutral=()=>match.players.map(player=>createInput(player.id));
 stepMatch(match,neutral().map(input=>input.playerId===athleteId?createInput(athleteId,{x:1,turbo:true,shootPressed:true,dunkVariant:'360'}):input));
 assert.equal(piper.animation.clip,'dunk-360');
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
