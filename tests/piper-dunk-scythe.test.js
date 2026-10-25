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
const atlas='./public/assets/animation/piper-quickstep-dunk-scythe-right.webp';
const height=[1.014714,1.072143,1.072143,1.072143,1.014714,0.928571,2.220714,1.330571,2.278143,2.278143,2.278143,1.933571,0.928571,0.871143,0.928571];
const forward=[-3.289091,-2.923636,-6.578182,-8.770909,-9.501818,-8.405455,-5.847273,2.192727,8.770909,8.04,8.04,12.425455,-5.116364,-5.116364,-3.289091];

test('Piper J.122 dunk-scythe registers all 15 ball-free frames and its own track',()=>{
 const character=animationAssetManifest.characters[athleteId];
 const clip=character?.directions?.right?.['dunk-scythe'];
 const mirror=animationMirrorPolicy[athleteId];

 assert.ok(clip,'registered Piper dunk-scythe candidate atlas');
 assert.equal(clip.reviewed,true,'source and candidate3 native reviews accepted');
 assert.equal(clip.provenance.sourceReview.status,'accepted');
 assert.equal(clip.provenance.nativeReview.status,'accepted');
 assert.equal(clip.provenance.ballTrackStatus,'accepted-native-review');
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(mirror.mirrorSafe,true);assert.equal(mirror.mirrorReview.status,'reviewed');
 assert.equal(clip.src,atlas);assert.equal(clip.columns,4);assert.equal(clip.rows,4);
 assert.match(clip.sha256,/^[a-f0-9]{64}$/);
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.deepEqual(clip.provenance.ballTrack.height,height);
 assert.deepEqual(clip.provenance.ballTrack.forward,forward);
 assert.equal(clip.provenance.ballTrack.releaseFrame,10);
 assert.equal(clip.provenance.ballTrack.releaseTick,21);
 assert.equal(clip.provenance.ballTrack.ownerThroughTick,20);
 assert.deepEqual(clip.provenance.sourceRecords.map(record=>record.pose),Array.from({length:15},(_,i)=>i));
 const bytes=readFileSync(new URL('../public/assets/animation/piper-quickstep-dunk-scythe-right.webp',import.meta.url));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),clip.sha256,'production WebP bytes match candidate manifest hash');
 const atlasWidth=Math.max(...clip.frames.map(frame=>frame.x+frame.w));
 const atlasHeight=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:atlasWidth,naturalHeight:atlasHeight,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-scythe',tick).frame,frame,'runtime maps Piper pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:athleteId,facing,animation:{clip:'dunk-scythe',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-scythe'].frames[frame].duration;
 }
 assert.equal(anchorTick('dunk-scythe','takeoff'),4);
 assert.equal(anchorTick('dunk-scythe','grab'),10);
 assert.equal(anchorTick('dunk-scythe','peak'),14);
 assert.equal(anchorTick('dunk-scythe','release'),21);
 assert.equal(anchorTick('dunk-scythe','finish'),23);
 assert.equal(anchorTick('dunk-scythe','land'),30);
 assert.equal(sampleBallHeight('dunk-scythe',20,athleteId),height[9]);
 assert.equal(sampleBallForward('dunk-scythe',20,athleteId),forward[9]);
});

test('Piper J.122 carries scythe through tick20, releases at21, and scores once at23',()=>{
 const home=teams.find(team=>team.roster.some(athlete=>athlete.id===athleteId));
 const away=teams.find(team=>team!==home);
 const match=createMatch({quarterSeconds:60,seed:122,home,away,homePartnerId:athleteId});
 const piper=match.players.find(player=>player.id===athleteId);
 assert.ok(piper,'Piper is in the active home lineup');
 for(const player of match.players)player.hasBall=false;
 piper.hasBall=true;piper.x=186;piper.y=50;piper.vx=.2;piper.dunk=99;piper.facing=1;
 piper.animation={clip:'idle-ball',tick:0};piper.anim='idle-ball';
 Object.assign(match.ball,{mode:'carried',ownerId:athleteId,lastTouch:athleteId,x:piper.x+sampleBallForward('idle-ball',0,athleteId),y:piper.y,z:sampleBallHeight('idle-ball',0,athleteId),vx:0,vy:0,vz:0,scored:false});
 match.possession=piper.team;
 const neutral=()=>match.players.map(player=>createInput(player.id));
 const inputs=neutral().map(input=>input.playerId===athleteId?createInput(athleteId,{x:1,turbo:true,shootPressed:true,dunkVariant:'scythe'}):input);
 stepMatch(match,inputs);
 assert.equal(piper.animation.clip,'dunk-scythe');
 while(piper.animation.tick<20)stepMatch(match,neutral());
 assert.equal(piper.animation.tick,20);assert.equal(piper.hasBall,true);
 assert.equal(match.ball.ownerId,athleteId);assert.equal(match.ball.mode,'carried');
 assert.ok(Math.abs(match.ball.x-(piper.x+sampleBallForward('dunk-scythe',20,athleteId)))<1e-9);
 assert.ok(Math.abs(match.ball.z-(piper.z+sampleBallHeight('dunk-scythe',20,athleteId)))<1e-9);
 stepMatch(match,neutral());
 const attemptId=match.ball.attemptId;
 assert.equal(piper.animation.tick,21);assert.equal(match.ball.mode,'dunk');
 assert.equal(match.ball.ownerId,null);assert.equal(piper.hasBall,false);
 assert.equal(match.score[0],0);assert.ok(attemptId?.startsWith('dunk-'));
 while(piper.animation.tick<23)stepMatch(match,neutral());
 assert.deepEqual(match.scoredAttempts,[attemptId]);assert.deepEqual(match.score,[2,0]);
 assert.equal(piper.points,2);assert.equal(piper.dunks,1);
 while(piper.animation.tick<30)stepMatch(match,neutral());
 assert.equal(piper.animation.tick,30);
 assert.equal(sampleAnimation('dunk-scythe',30).frame,14,'landing/recovery pose is selected at tick30');
 for(let i=0;i<4;i++)stepMatch(match,neutral());
 assert.deepEqual(match.scoredAttempts,[attemptId],'the attempt scores only once');
 assert.deepEqual(match.score,[2,0]);
});
