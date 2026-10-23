import test from 'node:test';
import assert from 'node:assert/strict';
import { animationClips, sampleAnimation, anchorTick, animationDuration, sampleBallHeight, sampleBallForward, flightHeightFromHand } from '../src/core/animation.js';
import { createMatch,createInput,stepMatch } from '../src/core/simulation.js';
const neutral=m=>m.players.map(p=>createInput(p.id));
function setup(){const m=createMatch({quarterSeconds:60,seed:1});for(const p of m.players){p.x=p.team?20:(p===m.players[0]?150:120);p.y=p.team?0:50;}return m;}
test('Paprika starts with the ball at her authored paw without a first-tick snap',()=>{
 const m=createMatch({home:{roster:[{id:'paprika'},{id:'partner'}]}}),p=m.players[0];
 const point={x:m.ball.x,y:m.ball.y,z:m.ball.z};assert.equal(point.x-p.x,7);assert.equal(point.z,.55);
 stepMatch(m,neutral(m));assert.ok(Math.abs(m.ball.x-point.x)<.1);assert.ok(Math.abs(m.ball.z-point.z)<.01);
 assert.equal(m.ball.z,sampleBallHeight('idle-ball',p.animation.tick,p.id));
});
test('Paprika power dunk carries the separate ball at her forward forepaw through the jump',()=>{
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:54,home:{roster:[{id:'paprika'},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'power'}):i));
  assert.equal(p.animation.clip,'dunk-power');
  while(p.animation.tick<14)stepMatch(m,neutral(m));
  assert.equal(sampleBallHeight('dunk-power',p.animation.tick,p.id),1.65);
  assert.equal(sampleBallForward('dunk-power',p.animation.tick,p.id),16);
  assert.ok(Math.abs(m.ball.x-p.x-facing*16)<1e-9,'ball stays ahead of the fox in either facing');
  assert.ok(Math.abs(m.ball.z-p.z-1.65)<1e-9,'ball stays attached at the authored forepaw height');
 }
});
test('Paprika windmill dunk carries the separate ball through a fox-sized paw circle',()=>{
 const frameTick=index=>animationClips['dunk-windmill'].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.55,7],[3,.8,-6],[4,.25,-8],[5,.15,-3],[7,.75,8],[9,1.5,10]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:55,home:{roster:[{id:'paprika'},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'windmill'}):i));
  assert.equal(p.animation.clip,'dunk-windmill');
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.equal(sampleBallHeight('dunk-windmill',p.animation.tick,p.id),height,'fox-sized vertical paw track at frame'+frame);
   assert.equal(sampleBallForward('dunk-windmill',p.animation.tick,p.id),forward,'circular paw path at frame'+frame);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<1e-9,'ball stays on the near-paw lane facing '+facing);
   assert.ok(Math.abs(m.ball.z-p.z-height)<1e-9,'ball stays at the authored fox-relative height facing '+facing);
  }
  const release=anchorTick('dunk-windmill','release');
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);
  assert.equal(sampleBallHeight('dunk-windmill',release,p.id),1.45);assert.equal(sampleBallForward('dunk-windmill',release,p.id),12);
 }
});
test('Reed windmill dunk follows his hand circle and releases cleanly in either facing',()=>{
 const frameTick=index=>animationClips['dunk-windmill'].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.9,2.193],[2,1.216,-10.6],[3,1.302,-13.89],[4,.671,-10.23],[5,.929,-14.25],[7,2.221,-11.7],[8,2.278,-16.08],[9,2.364,16.08]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:65,home:{roster:[{id:'reed-ashcroft'},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'windmill'}):i));
  assert.equal(p.animation.clip,'dunk-windmill');
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.equal(sampleBallHeight('dunk-windmill',p.animation.tick,p.id),height,'Reed hand height at frame '+frame);
   assert.equal(sampleBallForward('dunk-windmill',p.animation.tick,p.id),forward,'Reed hand circle at frame '+frame);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<1e-9,'ball stays on Reed’s hand lane facing '+facing);
   assert.ok(Math.abs(m.ball.z-p.z-height)<1e-9,'ball stays at Reed’s hand height facing '+facing);
  }
  const release=anchorTick('dunk-windmill','release');assert.equal(release,21);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);
  for(let i=release+1;i<anchorTick('dunk-windmill','finish');i++){stepMatch(m,neutral(m));assert.equal(m.score[0],0);}
  stepMatch(m,neutral(m));assert.equal(m.score[0],2,'the marked finish scores in either facing');
 }
});
test('Reed reverse dunk carries the ball behind his head and scores at its marked finish',()=>{
 const frameTick=index=>animationClips['dunk-reverse'].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,1,4.4],[1,.9,6.6],[2,1.45,2.9],[3,1.75,-3.65],[4,2.2,-4],[5,2.25,-2.2],[6,2.34,3.3],[7,2.4,8.8],[8,2.35,-10.2],[9,2.4,-9.5]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:66,home:{roster:[{id:'reed-ashcroft'},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'reverse'}):i));
  assert.equal(p.animation.clip,'dunk-reverse');
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.equal(sampleBallHeight('dunk-reverse',p.animation.tick,p.id),height,'Reed hand height at frame '+frame);
   assert.equal(sampleBallForward('dunk-reverse',p.animation.tick,p.id),forward,'reverse ball path at frame '+frame);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<1e-9,'ball follows the mirrored hand lane at frame '+frame);
   assert.ok(Math.abs(m.ball.z-p.z-height)<1e-9,'ball follows Reed’s hand height at frame '+frame);
  }
  const release=anchorTick('dunk-reverse','release');assert.equal(release,21);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);
  for(let i=release+1;i<anchorTick('dunk-reverse','finish');i++){stepMatch(m,neutral(m));assert.equal(m.score[0],0);}
  stepMatch(m,neutral(m));assert.equal(m.score[0],2,'the reverse finish scores in either facing');
 }
});
test('Reed 360 dunk carries the separate ball through a full rotation and releases at the shared markers',()=>{
 const clip='dunk-360',frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,1,5],[1,.9,1],[2,1.2,2],[4,1.45,0],[5,1.35,-1],[6,1.25,-3],[7,2.8,4],[8,2.5,-6],[9,2.9,7]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:67,home:{roster:[{id:'reed-ashcroft'},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'360'}):i));
  assert.equal(p.animation.clip,clip);
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.equal(sampleBallHeight(clip,p.animation.tick,p.id),height,`Reed hand height at frame ${frame}`);
   assert.equal(sampleBallForward(clip,p.animation.tick,p.id),forward,`Reed hand lane at frame ${frame}`);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06,`separate ball follows the rotating hand facing ${facing}`);
   assert.ok(Math.abs(m.ball.z-p.z-height)<.02,`separate ball follows the hand height facing ${facing}`);
  }
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish'),land=anchorTick(clip,'land');
  assert.equal(anchorTick(clip,'takeoff'),4);assert.equal(anchorTick(clip,'grab'),10);assert.equal(anchorTick(clip,'peak'),14);
  assert.equal(release,21);assert.equal(finish,23);assert.equal(land,30);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);assert.equal(p.fga,0);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);assert.equal(p.fga,1);
  while(p.animation.tick<finish-1)stepMatch(m,neutral(m));assert.deepEqual(m.score,[0,0]);
  stepMatch(m,neutral(m));assert.equal(p.dunks,1);assert.deepEqual(m.score,[2,0]);
  while(p.animation.tick<land)stepMatch(m,neutral(m));
  assert.equal(sampleAnimation(clip,p.animation.tick).frame,14,'final authored pose marks the two-foot landing');
 }
});
test('Reed tomahawk carries the separate ball behind his head and releases from the right hand',()=>{
 const clip='dunk-tomahawk',frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.95,8],[1,1.05,2],[2,2.1,1],[5,1.9,-8],[7,2,-7],[9,2.2,13]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:68,home:{roster:[{id:'reed-ashcroft'},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'tomahawk'}):i));
  assert.equal(p.animation.clip,clip);
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.equal(sampleBallHeight(clip,p.animation.tick,p.id),height,`Reed tomahawk hand height at frame ${frame}`);
   assert.equal(sampleBallForward(clip,p.animation.tick,p.id),forward,`Reed tomahawk hand lane at frame ${frame}`);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06,`the separate ball follows Reed's hand facing ${facing}`);
   assert.ok(Math.abs(m.ball.z-p.z-height)<.02,`the ball tracks Reed's hand height facing ${facing}`);
  }
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish'),land=anchorTick(clip,'land');
  assert.equal(anchorTick(clip,'takeoff'),4);assert.equal(anchorTick(clip,'grab'),10);assert.equal(anchorTick(clip,'peak'),14);
  assert.equal(release,21);assert.equal(finish,23);assert.equal(land,30);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);assert.equal(p.fga,0);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);assert.equal(p.fga,1);
  while(p.animation.tick<finish-1)stepMatch(m,neutral(m));assert.deepEqual(m.score,[0,0]);
  stepMatch(m,neutral(m));assert.equal(p.dunks,1);assert.deepEqual(m.score,[2,0]);
  while(p.animation.tick<land)stepMatch(m,neutral(m));
  assert.equal(sampleAnimation(clip,p.animation.tick).frame,14,'final authored pose marks the two-foot landing');
 }
});
test('Reed double dunk carries through both pumps, releases at tick21, and scores at tick23',()=>{
 const clip='dunk-double',frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.95,7],[2,1.65,3],[4,3.7,-8],[5,1.55,-1],[6,1.25,2],[8,2.35,4.5],[9,2.9,12.5]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:69,home:{roster:[{id:'reed-ashcroft'},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'double'}):i));
  assert.equal(p.animation.clip,clip);
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.equal(sampleBallHeight(clip,p.animation.tick,p.id),height,`Reed double-pump hand height at frame ${frame}`);
   assert.equal(sampleBallForward(clip,p.animation.tick,p.id),forward,`Reed double-pump hand lane at frame ${frame}`);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06,`separate ball follows Reed’s hand facing ${facing}`);
   assert.ok(Math.abs(m.ball.z-p.z-height)<.02,`separate ball follows Reed’s hand height facing ${facing}`);
  }
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish'),land=anchorTick(clip,'land');
  assert.equal(anchorTick(clip,'takeoff'),4);assert.equal(anchorTick(clip,'grab'),10);assert.equal(anchorTick(clip,'peak'),14);
  assert.equal(release,21);assert.equal(finish,23);assert.equal(land,30);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);assert.equal(p.fga,0);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);assert.equal(p.fga,1);
  while(p.animation.tick<finish-1)stepMatch(m,neutral(m));assert.deepEqual(m.score,[0,0]);
  stepMatch(m,neutral(m));assert.equal(p.dunks,1);assert.deepEqual(m.score,[2,0]);
  while(p.animation.tick<land)stepMatch(m,neutral(m));
  assert.equal(sampleAnimation(clip,p.animation.tick).frame,14,'final authored pose marks Reed’s two-foot landing');
 }
});
test('Reed clutch dunk protects the chest hold, transfers to one release, and lands on tick30',()=>{
 const clip='dunk-clutch',frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.95,7],[1,1.05,6],[5,.9,3],[7,.95,3],[8,1,4],[9,1.7,10]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:70,home:{roster:[{id:'reed-ashcroft'},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'clutch'}):i));
  assert.equal(p.animation.clip,clip);
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.equal(sampleAnimation(clip,p.animation.tick).frame,frame,'runtime maps Reed clutch pose '+frame);
   assert.equal(sampleBallHeight(clip,p.animation.tick,p.id),height,'Reed clutch hand height at frame '+frame);
   assert.equal(sampleBallForward(clip,p.animation.tick,p.id),forward,'Reed clutch hand lane at frame '+frame);
   if(p.animation.tick<anchorTick(clip,'release')){
    assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06,'separate ball follows Reed’s hands facing '+facing);
    assert.ok(Math.abs(m.ball.z-p.z-height)<.02,'separate ball follows Reed’s chest height facing '+facing);
   }
  }
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish'),land=anchorTick(clip,'land');
  assert.equal(anchorTick(clip,'takeoff'),4);assert.equal(anchorTick(clip,'grab'),10);assert.equal(anchorTick(clip,'peak'),14);
  assert.equal(release,21);assert.equal(finish,23);assert.equal(land,30);
  assert.equal(sampleBallHeight(clip,release,p.id),1.8);assert.equal(sampleBallForward(clip,release,p.id),13);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);assert.equal(p.fga,0);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);assert.equal(p.fga,1);
  while(p.animation.tick<finish-1)stepMatch(m,neutral(m));assert.deepEqual(m.score,[0,0]);
  stepMatch(m,neutral(m));assert.equal(p.dunks,1);assert.deepEqual(m.score,[2,0]);
  while(p.animation.tick<land)stepMatch(m,neutral(m));
  assert.equal(sampleAnimation(clip,p.animation.tick).frame,14,'last authored pose marks Reed’s balanced landing');
 }
});
test('Reed scythe dunk carries one low-to-high ball sweep and lands at tick30',()=>{
 const clip='dunk-scythe',frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.9,7],[1,.8,6],[5,.45,-7],[7,1.15,0],[8,1.65,-2],[9,2.35,10]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:71,home:{roster:[{id:'reed-ashcroft'},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'scythe'}):i));
  assert.equal(p.animation.clip,clip);
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.equal(sampleAnimation(clip,p.animation.tick).frame,frame,'runtime maps Reed scythe pose '+frame);
   assert.equal(sampleBallHeight(clip,p.animation.tick,p.id),height,'Reed scythe hand height at frame '+frame);
   assert.equal(sampleBallForward(clip,p.animation.tick,p.id),forward,'Reed scythe hand lane at frame '+frame);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06,'separate ball follows Reed’s sweeping hand facing '+facing);
   assert.ok(Math.abs(m.ball.z-p.z-height)<.02,'separate ball follows Reed’s sweep height facing '+facing);
  }
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish'),land=anchorTick(clip,'land');
  assert.equal(anchorTick(clip,'takeoff'),4);assert.equal(anchorTick(clip,'grab'),10);assert.equal(anchorTick(clip,'peak'),14);
  assert.equal(release,21);assert.equal(finish,23);assert.equal(land,30);
  assert.equal(sampleBallHeight(clip,release,p.id),2.3);assert.equal(sampleBallForward(clip,release,p.id),13);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);assert.equal(p.fga,0);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);assert.equal(p.fga,1);
  while(p.animation.tick<finish-1)stepMatch(m,neutral(m));assert.deepEqual(m.score,[0,0]);
  stepMatch(m,neutral(m));assert.equal(p.dunks,1);assert.deepEqual(m.score,[2,0]);
  while(p.animation.tick<land)stepMatch(m,neutral(m));
  assert.equal(sampleAnimation(clip,p.animation.tick).frame,14,'last authored pose marks Reed’s landing');
 }
});
test('Paprika reverse dunk carries the separate ball behind her turned shoulder',()=>{
 const frameTick=index=>animationClips['dunk-reverse'].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.55,7],[2,.7,4],[5,2.2,-3],[7,2.8,-5],[9,2.5,-4]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:56,home:{roster:[{id:'paprika'},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'reverse'}):i));
  assert.equal(p.animation.clip,'dunk-reverse');
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.equal(sampleBallHeight('dunk-reverse',p.animation.tick,p.id),height,'fox-sized reverse track height at frame'+frame);
   assert.equal(sampleBallForward('dunk-reverse',p.animation.tick,p.id),forward,'ball crosses behind Paprika at frame'+frame);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<1e-9,'ball stays on the turned paw lane facing '+facing);
   assert.ok(Math.abs(m.ball.z-p.z-height)<1e-9,'ball follows the fox-relative height facing '+facing);
  }
  const release=anchorTick('dunk-reverse','release');
  assert.equal(release,21);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);
  assert.equal(sampleBallHeight('dunk-reverse',release,p.id),2.3);assert.equal(sampleBallForward('dunk-reverse',release,p.id),-4);
 }
});
test('Paprika 360 dunk carries the separate ball through her full body rotation',()=>{
 const frameTick=index=>animationClips['dunk-360'].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.55,7],[2,.7,4],[5,2.2,-3],[6,2.6,-4],[7,2.8,-2],[8,2.6,1],[9,2.5,5]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:57,home:{roster:[{id:'paprika'},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'360'}):i));
  assert.equal(p.animation.clip,'dunk-360');
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.equal(sampleBallHeight('dunk-360',p.animation.tick,p.id),height,'fox-sized 360 track height at frame'+frame);
   assert.equal(sampleBallForward('dunk-360',p.animation.tick,p.id),forward,'ball rotates with Paprika at frame'+frame);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<1e-9,'ball stays on the spinning paw lane facing '+facing);
   assert.ok(Math.abs(m.ball.z-p.z-height)<1e-9,'ball follows the fox-relative height facing '+facing);
  }
  const release=anchorTick('dunk-360','release');
  assert.equal(release,21);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);
  assert.equal(sampleBallHeight('dunk-360',release,p.id),2.3);assert.equal(sampleBallForward('dunk-360',release,p.id),7);
 }
});
test('Paprika tomahawk dunk follows the overhead-to-downward paw arc with its separate ball',()=>{
 const frameTick=index=>animationClips['dunk-tomahawk'].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.55,7],[2,.7,4],[4,1.4,-2],[5,1.7,-4],[7,2.1,-5],[8,1.8,-3],[9,1.4,2]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:58,home:{roster:[{id:'paprika'},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'tomahawk'}):i));
  assert.equal(p.animation.clip,'dunk-tomahawk');
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.equal(sampleBallHeight('dunk-tomahawk',p.animation.tick,p.id),height,'fox-sized tomahawk track height at frame'+frame);
   assert.equal(sampleBallForward('dunk-tomahawk',p.animation.tick,p.id),forward,'ball follows the overhead strike at frame'+frame);
   if(frame<10){
    assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<1e-9,'ball stays on the paw lane facing '+facing);
    assert.ok(Math.abs(m.ball.z-p.z-height)<1e-9,'ball follows the fox-relative height facing '+facing);
   }
  }
  const release=anchorTick('dunk-tomahawk','release');
  assert.equal(release,21);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);
  assert.equal(sampleBallHeight('dunk-tomahawk',release,p.id),2.3);assert.equal(sampleBallForward('dunk-tomahawk',release,p.id),8);
 }
});
test('Paprika double dunk carries the separate ball through two clear paw pumps',()=>{
 const frameTick=index=>animationClips['dunk-double'].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.55,7],[2,.7,4],[4,2.2,7],[5,1,3],[6,.8,1],[7,1.7,4],[8,2.6,6],[9,2.3,9]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:59,home:{roster:[{id:'paprika'},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'double'}):i));
  assert.equal(p.animation.clip,'dunk-double');
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.equal(sampleBallHeight('dunk-double',p.animation.tick,p.id),height,'fox-sized double-pump height at frame'+frame);
   assert.equal(sampleBallForward('dunk-double',p.animation.tick,p.id),forward,'ball follows pump sequence at frame'+frame);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<1e-9,'ball stays on the near-paw lane facing '+facing);
   assert.ok(Math.abs(m.ball.z-p.z-height)<1e-9,'ball follows Paprika-relative height facing '+facing);
  }
  assert.ok(sampleBallHeight('dunk-double',frameTick(4),p.id)>sampleBallHeight('dunk-double',frameTick(6),p.id));
  assert.ok(sampleBallHeight('dunk-double',frameTick(8),p.id)>sampleBallHeight('dunk-double',frameTick(6),p.id));
  const release=anchorTick('dunk-double','release');
  assert.equal(release,21);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);
  assert.equal(sampleBallHeight('dunk-double',release,p.id),2.3);assert.equal(sampleBallForward('dunk-double',release,p.id),10);
 }
});
test('Paprika clutch dunk keeps the separate ball tight to her muzzle and chest before release',()=>{
 const frameTick=index=>animationClips['dunk-clutch'].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.55,7],[2,.7,4],[3,1,0],[4,1.3,-3],[5,1.5,-5],[6,1.4,-5],[7,1.5,-4],[8,1.7,0],[9,2.1,5]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:60,home:{roster:[{id:'paprika'},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'clutch'}):i));
  assert.equal(p.animation.clip,'dunk-clutch');
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.equal(sampleBallHeight('dunk-clutch',p.animation.tick,p.id),height,'fox-sized clutch height at frame'+frame);
   assert.equal(sampleBallForward('dunk-clutch',p.animation.tick,p.id),forward,'ball stays tucked near the muzzle at frame'+frame);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<1e-9,'clutched ball follows Paprika facing '+facing);
   assert.ok(Math.abs(m.ball.z-p.z-height)<1e-9,'clutched ball stays at her body height facing '+facing);
  }
  const release=anchorTick('dunk-clutch','release');
  assert.equal(release,21);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);
  assert.equal(sampleBallHeight('dunk-clutch',release,p.id),2.3);assert.equal(sampleBallForward('dunk-clutch',release,p.id),8);
 }
});
test('Paprika scythe dunk carries the separate ball through a diagonal half-circle paw sweep',()=>{
 const frameTick=index=>animationClips['dunk-scythe'].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.55,7],[2,.7,4],[4,1.2,-4],[5,.8,-6],[6,1.5,-3],[7,2,0],[8,2.5,6],[9,2.1,9]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:61,home:{roster:[{id:'paprika'},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'scythe'}):i));
  assert.equal(p.animation.clip,'dunk-scythe');
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.equal(sampleBallHeight('dunk-scythe',p.animation.tick,p.id),height,'fox-sized scythe height at frame'+frame);
   assert.equal(sampleBallForward('dunk-scythe',p.animation.tick,p.id),forward,'ball follows the diagonal paw arc at frame'+frame);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<1e-9,'ball stays on Paprika paw lane facing '+facing);
   assert.ok(Math.abs(m.ball.z-p.z-height)<1e-9,'ball follows Paprika body height facing '+facing);
  }
  const release=anchorTick('dunk-scythe','release');
  assert.equal(release,21);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);
  assert.equal(sampleBallHeight('dunk-scythe',release,p.id),2.3);assert.equal(sampleBallForward('dunk-scythe',release,p.id),8);
 }
});
test('Dorian Mycel and Luca Velori keep possession at their forward hands on corrected locomotion',()=>{
 for(const id of ['dorian-mycel','luca-velori'])for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:41,home:{roster:[{id},{id:'partner'}]}}),p=m.players.find(player=>player.id===id);
  p.x=100;p.facing=facing;p.hasBall=true;m.ball.ownerId=p.id;m.ball.mode='carried';
  stepMatch(m,neutral(m));
  assert.ok(sampleBallForward('idle-ball',p.animation.tick,id)>=8,id+' idle-ball reaches forward');
  for(const [turbo,key] of [[false,'dribble'],[true,'dribble-run']]){
   p.x=100;p.y=50;p.facing=facing;p.hasBall=true;p.stun=0;
   const input=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:facing,turbo}):i);
   stepMatch(m,input());assert.equal(p.animation.clip,key,id+' '+key);
   assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward(key,p.animation.tick,id))<1e-9,id+' '+key+' hand x');
   assert.ok(sampleBallForward(key,p.animation.tick,id)>5,id+' '+key+' hand is outside the torso');
   assert.equal(sampleBallHeight(key,anchorTick(key,'bounce'),id),0,id+' '+key+' court bounce');
  }
 }
});
test('reviewed supporting athletes keep the separate game ball at their lead hand',()=>{
 for(const id of ['sera-bellini','moxie-capwell','sable-regent','marco-vellum','flint-rooker','ash-harth','marin-dusk','cove-knell','pixel-o-keeffe','fern-tempo','mira-wavelength','azul-voss','roxie-coil','vanta-slate','sylvie-shutter','noelle-pinstripe','cade-brixton','fenn-static','ember-rivet','bronze-calder','violet-lorne','cassian-quill','sol-meridian','mist-halo','wren-bravado','eden-north','raven-lux','thorn-sable','kai-suncrest','talia-kestrel','detective-halftone','trace-noire','jett-byte','cass-pixel','riff-voltage','fret-nova','thorn-script','nyx-steel','moss-quarry','digger-finch','willow-root','rowan-bark','moth-vale','owl-argent','auric-scale','cinder-royal','nox-striker','viper-veil','moss-granite','thump-alder','camden-union','poppy-stitch'])for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:51,home:{roster:[{id},{id:'partner'}]}}),p=m.players.find(player=>player.id===id);
  assert.ok(sampleBallForward('idle-ball',p.animation.tick,id)>=8,id+' idle-ball hand reach');
  p.x=100;p.y=50;p.facing=facing;p.hasBall=true;m.ball.ownerId=p.id;m.ball.mode='carried';
  for(const [turbo,key] of [[false,'dribble'],[true,'dribble-run']]){
   const input=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:facing,turbo}):i);
   stepMatch(m,input());assert.equal(p.animation.clip,key,id+' '+key);
   assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward(key,p.animation.tick,id))<1e-9,id+' '+key+' hand x');
   assert.ok(sampleBallForward(key,p.animation.tick,id)>5,id+' '+key+' ball stays ahead of the torso');
   assert.equal(sampleBallHeight(key,anchorTick(key,'bounce'),id),0,id+' '+key+' court bounce');
  }
 }
});
test('Draya Staffwind and Kael Rune keep the ball at their own hand tracks in both facings',()=>{
 for(const [id,minimumReach] of [['draya-staffwind',8],['kael-rune',9]])for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:52,home:{roster:[{id},{id:'partner'}]}}),p=m.players.find(player=>player.id===id);
  assert.equal(m.ball.x-p.x,p.facing*sampleBallForward('idle-ball',p.animation.tick,id),id+' carried hand x');
  assert.ok(sampleBallForward('idle-ball',p.animation.tick,id)>=minimumReach,id+' ball-ready hand reach');
  p.x=100;p.y=50;p.facing=facing;p.hasBall=true;m.ball.ownerId=p.id;m.ball.mode='carried';
  for(const [turbo,key] of [[false,'dribble'],[true,'dribble-run']]){
   const input=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:facing,turbo}):i);
   stepMatch(m,input());assert.equal(p.animation.clip,key,id+' '+key);
   assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward(key,p.animation.tick,id))<1e-9,id+' '+key+' hand x');
   assert.ok(sampleBallForward(key,p.animation.tick,id)>5,id+' '+key+' ball stays beyond the torso');
   assert.equal(m.ball.z-p.z,sampleBallHeight(key,p.animation.tick,id),id+' '+key+' hand height');
   assert.equal(sampleBallHeight(key,anchorTick(key,'bounce'),id),0,id+' '+key+' court bounce');
  }
  assert.ok(sampleBallForward('dribble-run',0,id)>sampleBallForward('idle-ball',0,id),id+' run hand leads farther');
 }
});
test('Lilt Smile and Violet Wink keep the separate ball at their own lead hands in both facings',()=>{
 for(const [id,minimumReach] of [['lilt-smile',8],['violet-wink',9]])for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:53,home:{roster:[{id},{id:'partner'}]}}),p=m.players.find(player=>player.id===id);
  assert.equal(m.ball.x-p.x,p.facing*sampleBallForward('idle-ball',p.animation.tick,id),id+' carried ball hand x');
  assert.ok(sampleBallForward('idle-ball',p.animation.tick,id)>=minimumReach,id+' ball-ready hand reach');
  p.x=100;p.y=50;p.facing=facing;p.hasBall=true;m.ball.ownerId=p.id;m.ball.mode='carried';
  for(const [turbo,key] of [[false,'dribble'],[true,'dribble-run']]){
   const input=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:facing,turbo}):i);
   stepMatch(m,input());assert.equal(p.animation.clip,key,id+' '+key);
   assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward(key,p.animation.tick,id))<1e-9,id+' '+key+' hand x');
   assert.ok(sampleBallForward(key,p.animation.tick,id)>5,id+' '+key+' ball clears torso');
   assert.equal(m.ball.z-p.z,sampleBallHeight(key,p.animation.tick,id),id+' '+key+' hand height');
   assert.equal(sampleBallHeight(key,anchorTick(key,'bounce'),id),0,id+' '+key+' court bounce');
  }
  assert.ok(sampleBallForward('dribble-run',0,id)>sampleBallForward('idle-ball',0,id),id+' dribble-run hand reach');
 }
});
test('Fern Howl and Koa Vale keep the separate ball at their own lead hands in both facings',()=>{
 for(const [id,minimumReach] of [['fern-howl',8],['koa-vale',9]])for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:67,home:{roster:[{id},{id:'partner'}]}}),p=m.players.find(player=>player.id===id);
  assert.equal(m.ball.x-p.x,p.facing*sampleBallForward('idle-ball',p.animation.tick,id),id+' carried ball hand x');
  assert.ok(sampleBallForward('idle-ball',p.animation.tick,id)>=minimumReach,id+' ball-ready hand reach');
  p.x=100;p.y=50;p.facing=facing;p.hasBall=true;m.ball.ownerId=p.id;m.ball.mode='carried';
  for(const [turbo,key] of [[false,'dribble'],[true,'dribble-run']]){
   const input=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:facing,turbo}):i);
   stepMatch(m,input());assert.equal(p.animation.clip,key,id+' '+key);
   assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward(key,p.animation.tick,id))<1e-9,id+' '+key+' hand x');
   assert.ok(sampleBallForward(key,p.animation.tick,id)>5,id+' '+key+' ball clears torso');
   assert.equal(m.ball.z-p.z,sampleBallHeight(key,p.animation.tick,id),id+' '+key+' hand height');
   assert.equal(sampleBallHeight(key,anchorTick(key,'bounce'),id),0,id+' '+key+' court bounce');
  }
  assert.ok(sampleBallForward('dribble-run',0,id)>sampleBallForward('idle-ball',0,id),id+' dribble-run hand reach');
 }
});
test('Scribble Turner and Palette Spry keep the ball on their own right-hand tracks',()=>{
 for(const [id,minimumReach] of [['scribble-turner',9],['palette-spry',8]])for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:68,home:{roster:[{id},{id:'partner'}]}}),p=m.players.find(player=>player.id===id);
  assert.equal(m.ball.x-p.x,p.facing*sampleBallForward('idle-ball',p.animation.tick,id),id+' carried hand x');
  assert.ok(sampleBallForward('idle-ball',0,id)>=minimumReach,id+' ball-ready hand reach');
  p.x=100;p.y=50;p.facing=facing;p.hasBall=true;m.ball.ownerId=p.id;m.ball.mode='carried';
  for(const [turbo,key] of [[false,'dribble'],[true,'dribble-run']]){
   const input=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:facing,turbo}):i);
   stepMatch(m,input());assert.equal(p.animation.clip,key,id+' '+key);
   assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward(key,p.animation.tick,id))<1e-9,id+' '+key+' hand x');
   assert.ok(sampleBallForward(key,p.animation.tick,id)>5,id+' '+key+' ball clears torso');
   assert.equal(m.ball.z-p.z,sampleBallHeight(key,p.animation.tick,id),id+' '+key+' hand height');
   assert.equal(sampleBallHeight(key,anchorTick(key,'bounce'),id),0,id+' '+key+' court bounce');
  }
  assert.ok(sampleBallForward('dribble-run',0,id)>sampleBallForward('idle-ball',0,id),id+' dribble-run hand reach');
 }
});
test('Sage Fletch and Hazel Bloom keep separate balls on their own hand tracks',()=>{
 for(const [id,minimumReach] of [['sage-fletch',9],['hazel-bloom',8]])for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:69,home:{roster:[{id},{id:'partner'}]}}),p=m.players.find(player=>player.id===id);
  assert.equal(m.ball.x-p.x,p.facing*sampleBallForward('idle-ball',p.animation.tick,id),id+' carried ball hand x');
  assert.ok(sampleBallForward('idle-ball',0,id)>=minimumReach,id+' ball-ready hand reach');
  p.x=100;p.y=50;p.facing=facing;p.hasBall=true;m.ball.ownerId=p.id;m.ball.mode='carried';
  for(const [turbo,key] of [[false,'dribble'],[true,'dribble-run']]){
   const input=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:facing,turbo}):i);
   stepMatch(m,input());assert.equal(p.animation.clip,key,id+' '+key);
   assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward(key,p.animation.tick,id))<1e-9,id+' '+key+' hand x');
   assert.ok(sampleBallForward(key,p.animation.tick,id)>5,id+' '+key+' ball clears torso');
   assert.equal(m.ball.z-p.z,sampleBallHeight(key,p.animation.tick,id),id+' '+key+' hand height');
   assert.equal(sampleBallHeight(key,anchorTick(key,'bounce'),id),0,id+' '+key+' court bounce');
  }
  assert.ok(sampleBallForward('dribble-run',0,id)>sampleBallForward('idle-ball',0,id),id+' running hand reach');
 }
});
test('Dragon Queen carries and dribbles at her muzzle and forepaw in both facings',()=>{
 const m=createMatch({quarterSeconds:60,seed:8,home:{roster:[{id:'dragon-queen'},{id:'partner'}]}}),p=m.players[0];
 assert.equal(m.ball.x-p.x,23);assert.equal(m.ball.z-p.z,1.35);
 p.x=100;p.facing=-1;
 const input=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:-1}):i);
 stepMatch(m,input());assert.equal(p.animation.clip,'dribble');
 assert.ok(Math.abs(m.ball.x-p.x-p.facing*sampleBallForward('dribble',p.animation.tick,p.id))<1e-9);
 assert.equal(m.ball.z-p.z,sampleBallHeight('dribble',p.animation.tick,p.id));
 assert.equal(sampleBallHeight('dribble',anchorTick('dribble','bounce'),'dragon-queen'),0);
 assert.equal(sampleBallHeight('dribble-run',anchorTick('dribble-run','bounce'),'dragon-queen'),0);
 assert.equal(sampleBallForward('idle-ball',0,'dragon-queen'),23);
});
test('GB Design keeps the carried ball forward and reaches the court on its dribble bounce',()=>{
 const m=createMatch({quarterSeconds:60,seed:9,home:{roster:[{id:'gb-design'},{id:'partner'}]}}),p=m.players[0];
 assert.equal(m.ball.x-p.x,9);assert.equal(m.ball.z-p.z,1.1);
 assert.equal(sampleBallHeight('dribble',15,p.id),0);assert.equal(sampleBallForward('dribble',15,p.id),12);
 for(const facing of [1,-1]){
  p.x=100;p.facing=facing;
  const input=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:facing}):i);
  stepMatch(m,input());assert.equal(p.animation.clip,'dribble');
  assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward('dribble',p.animation.tick,p.id))<1e-9);
  assert.equal(m.ball.z-p.z,sampleBallHeight('dribble',p.animation.tick,p.id));
 }
});
test('6foot10 keeps the ball at his forward hands and hits the court on both dribble bounces',()=>{
 const m=createMatch({quarterSeconds:60,seed:10,home:{roster:[{id:'6foot10'},{id:'partner'}]}}),p=m.players.find(player=>player.id==='6foot10');
 assert.equal(m.ball.x-p.x,12);assert.equal(m.ball.z-p.z,1.25);
 for(const [turbo,clip] of [[false,'dribble'],[true,'dribble-run']])for(const facing of [1,-1]){
  p.x=100;p.facing=facing;
  const input=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:facing,turbo}):i);
  stepMatch(m,input());assert.equal(p.animation.clip,clip);
  assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward(clip,p.animation.tick,p.id))<1e-9);
  assert.equal(m.ball.z-p.z,sampleBallHeight(clip,p.animation.tick,p.id));
  assert.equal(sampleBallHeight(clip,anchorTick(clip,'bounce'),p.id),0);
 }
 assert.ok(sampleBallForward('dribble-run',0,'6foot10')>sampleBallForward('dribble',0,'6foot10'));
});
test('Avek controls the ball at his armored hands with a looped low-court bounce',()=>{
 const m=createMatch({quarterSeconds:60,seed:11,home:{roster:[{id:'avek'},{id:'partner'}]}}),p=m.players.find(player=>player.id==='avek');
 assert.equal(m.ball.x-p.x,13);assert.equal(m.ball.z-p.z,1.2);
 for(const [turbo,clip] of [[false,'dribble'],[true,'dribble-run']])for(const facing of [1,-1]){
  p.x=100;p.facing=facing;
  const input=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:facing,turbo}):i);
  stepMatch(m,input());assert.equal(p.animation.clip,clip);
  assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward(clip,p.animation.tick,p.id))<1e-9);
  assert.equal(m.ball.z-p.z,sampleBallHeight(clip,p.animation.tick,p.id));
  assert.equal(sampleBallHeight(clip,anchorTick(clip,'bounce'),p.id),0);
 }
 assert.ok(sampleBallForward('dribble-run',0,'avek')>sampleBallForward('idle-ball',0,'avek'));
});
test('Jragena keeps the ball on the forward hands below her folded wings',()=>{
 const m=createMatch({quarterSeconds:60,seed:12,home:{roster:[{id:'jragena'},{id:'partner'}]}}),p=m.players.find(player=>player.id==='jragena');
 assert.equal(m.ball.x-p.x,7);
 for(const [turbo,clip] of [[false,'dribble'],[true,'dribble-run']])for(const facing of [1,-1]){
  p.x=100;p.facing=facing;
  const input=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:facing,turbo}):i);
  stepMatch(m,input());assert.equal(p.animation.clip,clip);
  assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward(clip,p.animation.tick,p.id))<1e-9);
  assert.equal(m.ball.z-p.z,sampleBallHeight(clip,p.animation.tick,p.id));
  assert.equal(sampleBallHeight(clip,anchorTick(clip,'bounce'),p.id),0);
 }
 assert.ok(sampleBallForward('dribble-run',0,'jragena')>sampleBallForward('idle-ball',0,'jragena'));
});
test('Pack Mama carries and dribbles with her forward hand in both facings',()=>{
 const m=createMatch({quarterSeconds:60,seed:33,home:{roster:[{id:'pack-mama'},{id:'partner'}]}}),p=m.players.find(player=>player.id==='pack-mama');
 assert.equal(m.ball.x-p.x,10);assert.equal(m.ball.z-p.z,1.15);
 for(const [turbo,clip] of [[false,'dribble'],[true,'dribble-run']])for(const facing of [1,-1]){
  p.x=100;p.facing=facing;
  const input=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:facing,turbo}):i);
  stepMatch(m,input());assert.equal(p.animation.clip,clip);
  assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward(clip,p.animation.tick,p.id))<1e-9);
  assert.equal(m.ball.z-p.z,sampleBallHeight(clip,p.animation.tick,p.id));
  assert.equal(sampleBallHeight(clip,anchorTick(clip,'bounce'),p.id),0);
 }
 assert.ok(sampleBallForward('dribble-run',0,'pack-mama')>sampleBallForward('idle-ball',0,'pack-mama'));
});
test('Quirky keeps the ball at his elongated animal hands and reaches the court on both bounces',()=>{
 const m=createMatch({quarterSeconds:60,seed:34,home:{roster:[{id:'quirky'},{id:'partner'}]}}),p=m.players.find(player=>player.id==='quirky');
 assert.equal(m.ball.x-p.x,11);assert.equal(m.ball.z-p.z,1.2);
 for(const [turbo,clip] of [[false,'dribble'],[true,'dribble-run']])for(const facing of [1,-1]){
  p.x=100;p.facing=facing;
  const input=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:facing,turbo}):i);
  stepMatch(m,input());assert.equal(p.animation.clip,clip);
  assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward(clip,p.animation.tick,p.id))<1e-9);
  assert.equal(m.ball.z-p.z,sampleBallHeight(clip,p.animation.tick,p.id));
  assert.equal(sampleBallHeight(clip,anchorTick(clip,'bounce'),p.id),0);
 }
 assert.ok(sampleBallForward('dribble-run',0,'quirky')>sampleBallForward('idle-ball',0,'quirky'));
});
test('Suga controls the ball with his forward coil and keeps the cobra bounce low in both facings',()=>{
 const m=createMatch({quarterSeconds:60,seed:19,home:{roster:[{id:'suga'},{id:'partner'}]}}),p=m.players.find(player=>player.id==='suga');
 assert.equal(m.ball.x-p.x,16);assert.equal(m.ball.z-p.z,.7);
 for(const facing of [1,-1]){
  p.x=100;p.facing=facing;
  const input=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:facing,turbo:true}):i);
  stepMatch(m,input());assert.equal(p.animation.clip,'dribble-run');
  assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward('dribble-run',p.animation.tick,p.id))<1e-9);
  assert.equal(m.ball.z-p.z,sampleBallHeight('dribble-run',p.animation.tick,p.id));
 }
 assert.equal(sampleBallHeight('dribble',anchorTick('dribble','bounce'),'suga'),0);
 assert.equal(sampleBallHeight('dribble-run',anchorTick('dribble-run','bounce'),'suga'),0);
 assert.ok(sampleBallForward('dribble-run',0,'suga')>sampleBallForward('idle-ball',0,'suga'));
});
test('inbound ownership immediately samples the receiving athlete track',()=>{
 const m=setup(),p=m.players[0];p.id='paprika';for(const a of m.players)a.hasBall=false;
 Object.assign(m.ball,{mode:'dead',ownerId:null,lastTouch:m.players[2].id});m.scorePause=1;m.pendingInboundTeam=0;
 stepMatch(m,neutral(m));assert.equal(m.ball.ownerId,p.id);
 assert.equal(m.ball.x-p.x,sampleBallForward(p.animation.clip,p.animation.tick,p.id));
 assert.equal(m.ball.z-p.z,sampleBallHeight(p.animation.clip,p.animation.tick,p.id));
});
for(const clip of ['receive','pickup'])test(`Paprika ${clip} waits for grab and attaches at her paw height`,()=>{
 const m=setup(),p=m.players[0];p.id='paprika';for(const a of m.players)a.hasBall=false;
 Object.assign(m.ball,{mode:clip==='receive'?'pass':'loose',ownerId:null,targetId:p.id,lastTouch:m.players[1].id,x:p.x,y:p.y,z:.5,vx:0,vy:0,vz:0});
 stepMatch(m,neutral(m));assert.equal(p.animation.clip,clip);assert.equal(p.hasBall,false);
 while(p.animation.tick<anchorTick(clip,'grab')-1){stepMatch(m,neutral(m));assert.equal(p.hasBall,false);}
 stepMatch(m,neutral(m));assert.equal(p.hasBall,true);
 assert.ok(Math.abs(m.ball.x-p.x-p.facing*sampleBallForward(clip,p.animation.tick,p.id))<1e-9);
 assert.equal(m.ball.z-p.z,clip==='pickup'?0:.5);
});
for(const turbo of [false,true])for(const facing of [1,-1])test(`Paprika uses paw-height dribble and mirrored nose offsets (${turbo}, ${facing})`,()=>{
 const m=setup(),p=m.players[0];const previousId=p.id;p.id='paprika';m.ball.ownerId=p.id;m.ball.lastTouch=p.id;
 assert.notEqual(previousId,p.id);p.x=100;p.facing=facing;
 const input=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:facing,turbo}):i);
 stepMatch(m,input());const clip=turbo?'dribble-run':'dribble';assert.equal(p.animation.clip,clip);
 const low=anchorTick(clip,'bounce');while(p.animation.tick<low){assert.ok(m.ball.z>=0&&m.ball.z<=.55);assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward(clip,p.animation.tick,p.id))<1e-9);stepMatch(m,input());}
 assert.equal(m.ball.z,0);assert.equal(sampleBallHeight('idle-ball',0,'paprika'),.55);assert.equal(sampleBallHeight('idle-ball',0,'manaconda'),1.1);
});
test('clips contain the requested unique frames and 22 tick running cycle',()=>{assert.equal(Object.keys(animationClips).length,29);assert.equal(animationClips.run.frames.length,11);assert.equal(animationDuration('run'),22);assert.deepEqual(sampleAnimation('run',22),{frame:0,done:false});assert.equal(sampleAnimation('shoot',999).done,true);});
for(const clip of ['shoot','pass','pass-overhead','pass-behind'])test(`${clip} releases only at its marked frame`,()=>{const m=setup(),p=m.players[0];const inp=clip==='shoot'?{shootPressed:true}:{passPressed:true,passVariant:clip};stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,inp)]);assert.equal(m.ball.mode,'carried');for(let i=1;i<anchorTick(clip,'release');i++){stepMatch(m,neutral(m));assert.equal(m.ball.mode,'carried');}stepMatch(m,neutral(m));assert.equal(m.ball.mode,clip==='shoot'?'shot':'pass');assert.equal(p.animation.tick,anchorTick(clip,'release'));});
for(const [clip,releaseHeight,releaseForward]of [['pass-overhead',1.1,15],['pass-behind',.85,-12]])test(`Paprika's ${clip} uses the authored muzzle as its separate release point`,()=>{
 const release=anchorTick(clip,'release');assert.equal(release,7);assert.equal(sampleAnimation(clip,release).frame,3);
 assert.equal(sampleBallHeight(clip,release,'paprika'),releaseHeight);assert.equal(sampleBallForward(clip,release,'paprika'),releaseForward);
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:47,home:{roster:[{id:'paprika'},{id:'partner'}]}}),p=m.players.find(player=>player.id==='paprika');
  p.x=100;p.facing=facing;
  const inputs=()=>neutral(m).map(input=>input.playerId===p.id?createInput(p.id,{passPressed:true,passVariant:clip}):input);
  stepMatch(m,inputs());assert.equal(p.animation.clip,clip);assert.equal(m.ball.mode,'carried');
  while(p.animation.tick<release-1){stepMatch(m,neutral(m));assert.equal(m.ball.mode,'carried');}
  assert.equal(p.animation.tick,release-1);assert.equal(m.ball.mode,'carried');
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'pass');
 }
});
test('Pack Mama releases her shot from the raised human hand',()=>{
 const m=createMatch({quarterSeconds:60,seed:35,home:{roster:[{id:'pack-mama'},{id:'partner'}]}}),p=m.players.find(player=>player.id==='pack-mama');
 const release=anchorTick('shoot','release');p.x=100;
 stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{shootPressed:true})]);
 assert.equal(p.animation.clip,'shoot');assert.ok(sampleBallForward('shoot',release,p.id)>sampleBallForward('shoot',0,p.id));
 for(let i=1;i<release;i++){stepMatch(m,neutral(m));assert.equal(m.ball.mode,'carried');}
 stepMatch(m,neutral(m));assert.equal(m.ball.mode,'shot');assert.equal(p.animation.tick,release);
 // The simulation advances the new projectile once on its release tick.
 assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-p.facing*sampleBallForward('shoot',release,p.id))<1e-9);
 assert.ok(Math.abs(m.ball.z-m.ball.vz-.026-flightHeightFromHand(sampleBallHeight('shoot',release,p.id),p.z))<1e-9);
});
for(const facing of [1,-1])test(`Keeg's separate ball tracks his empty-hand shot through the witch hat clear-release facing ${facing}`,()=>{
 const m=createMatch({quarterSeconds:60,seed:184,home:{roster:[{id:'keeg'},{id:'partner'}]}}),p=m.players.find(player=>player.id==='keeg');
 const release=anchorTick('shoot','release');p.x=100;p.facing=facing;
 assert.equal(release,13);assert.deepEqual([sampleBallHeight('shoot',0,p.id),sampleBallHeight('shoot',release,p.id)],[.95,2.05]);
 assert.deepEqual([sampleBallForward('shoot',0,p.id),sampleBallForward('shoot',release,p.id)],[6,11]);
 stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{shootPressed:true})]);
 for(let i=1;i<release;i++){stepMatch(m,neutral(m));assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);}
 stepMatch(m,neutral(m));assert.equal(m.ball.mode,'shot');assert.equal(p.animation.tick,release);assert.equal(p.hasBall,false);
 assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-facing*sampleBallForward('shoot',release,p.id))<1e-9);
 assert.ok(Math.abs(m.ball.z-m.ball.vz-.026-flightHeightFromHand(sampleBallHeight('shoot',release,p.id),p.z))<1e-9);
 assert.equal(sampleAnimation('shoot',release).frame,5,'frame5 releases above the hat at tick13');
});
for(const facing of [1,-1])test(`Keeg's chest pass follows his hands and releases once at tick5 facing ${facing}`,()=>{
 const m=createMatch({quarterSeconds:60,seed:185,home:{roster:[{id:'keeg'},{id:'partner'}]}}),p=m.players.find(player=>player.id==='keeg');
 const release=anchorTick('pass','release');p.x=100;p.facing=facing;
 assert.equal(release,5);assert.deepEqual([sampleBallHeight('pass',0,p.id),sampleBallHeight('pass',release,p.id)],[1,1.55]);
 assert.deepEqual([sampleBallForward('pass',0,p.id),sampleBallForward('pass',release,p.id)],[5,13]);
 stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{passPressed:true,passVariant:'pass'})]);
 for(let i=1;i<release;i++){stepMatch(m,neutral(m));assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);}
 stepMatch(m,neutral(m));assert.equal(m.ball.mode,'pass');assert.equal(p.animation.tick,release);assert.equal(p.hasBall,false);
 assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-facing*sampleBallForward('pass',release,p.id))<1e-9);
 assert.ok(Math.abs(m.ball.z-m.ball.vz-.026-flightHeightFromHand(sampleBallHeight('pass',release,p.id),p.z))<1e-9);
});
for(const facing of [1,-1])test(`Keeg's overhead pass clears his hat and releases at tick7 facing ${facing}`,()=>{
 const m=createMatch({quarterSeconds:60,seed:186,home:{roster:[{id:'keeg'},{id:'partner'}]}}),p=m.players.find(player=>player.id==='keeg');
 const clip='pass-overhead',release=anchorTick(clip,'release');p.x=100;p.facing=facing;
 assert.equal(release,7);assert.deepEqual([sampleBallHeight(clip,0,p.id),sampleBallHeight(clip,release,p.id)],[1.2,2.55]);
 assert.deepEqual([sampleBallForward(clip,0,p.id),sampleBallForward(clip,release,p.id)],[6,10]);
 stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{passPressed:true,passVariant:clip})]);
 for(let i=1;i<release;i++){stepMatch(m,neutral(m));assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);}
 stepMatch(m,neutral(m));assert.equal(m.ball.mode,'pass');assert.equal(p.animation.tick,release);assert.equal(p.hasBall,false);
 assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-facing*sampleBallForward(clip,release,p.id))<1e-9);
 assert.ok(Math.abs(m.ball.z-m.ball.vz-.026-flightHeightFromHand(sampleBallHeight(clip,release,p.id),p.z))<1e-9);
});
for(const facing of [1,-1])test(`Quirky releases from his extended striped orangutan paw facing ${facing}`,()=>{
 const m=createMatch({quarterSeconds:60,seed:36,home:{roster:[{id:'quirky'},{id:'partner'}]}}),p=m.players.find(player=>player.id==='quirky');
 const release=anchorTick('shoot','release');p.x=100;p.facing=facing;
 assert.ok(sampleBallForward('shoot',release,p.id)>sampleBallForward('shoot',0,p.id));
 stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{shootPressed:true})]);
 for(let i=1;i<=release;i++)stepMatch(m,neutral(m));
 assert.equal(m.ball.mode,'shot');assert.equal(p.animation.tick,release);
 assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-facing*sampleBallForward('shoot',release,p.id))<1e-9);
 assert.ok(Math.abs(m.ball.z-m.ball.vz-.026-flightHeightFromHand(sampleBallHeight('shoot',release,p.id),p.z))<1e-9);
});
for(const [id,label] of [['dragon-queen','quadruped forepaw'],['dea','raised human hand']])for(const facing of [1,-1])test(`${id} releases her shot from the ${label} facing ${facing}`,()=>{
 const m=createMatch({quarterSeconds:60,seed:37,home:{roster:[{id},{id:'partner'}]}}),p=m.players.find(player=>player.id===id);
 const release=anchorTick('shoot','release');p.x=100;p.facing=facing;
 assert.ok(sampleBallForward('shoot',release,p.id)>sampleBallForward('shoot',0,p.id));
 stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{shootPressed:true})]);
 for(let i=1;i<=release;i++)stepMatch(m,neutral(m));
 assert.equal(m.ball.mode,'shot');assert.equal(p.animation.tick,release);
 assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-facing*sampleBallForward('shoot',release,p.id))<1e-9);
 assert.ok(Math.abs(m.ball.z-m.ball.vz-.026-flightHeightFromHand(sampleBallHeight('shoot',release,p.id),p.z))<1e-9);
});
for(const [id,label] of [['lula','elf hand'],['avek','armored hand']])for(const facing of [1,-1])test(`${id} releases the shot from the ${label} facing ${facing}`,()=>{
 const m=createMatch({quarterSeconds:60,seed:38,home:{roster:[{id},{id:'partner'}]}}),p=m.players.find(player=>player.id===id);
 const release=anchorTick('shoot','release');p.x=100;p.facing=facing;
 assert.ok(sampleBallForward('shoot',release,p.id)>sampleBallForward('shoot',0,p.id));
 stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{shootPressed:true})]);
 for(let i=1;i<=release;i++)stepMatch(m,neutral(m));
 assert.equal(m.ball.mode,'shot');assert.equal(p.animation.tick,release);
 assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-facing*sampleBallForward('shoot',release,p.id))<1e-9);
 assert.ok(Math.abs(m.ball.z-m.ball.vz-.026-flightHeightFromHand(sampleBallHeight('shoot',release,p.id),p.z))<1e-9);
});
for(const [id,label] of [['suga','cobra muzzle'],['jragena','winged athlete hand']])for(const facing of [1,-1])test(`${id} releases the shot from the ${label} facing ${facing}`,()=>{
 const m=createMatch({quarterSeconds:60,seed:39,home:{roster:[{id},{id:'partner'}]}}),p=m.players.find(player=>player.id===id);
 const release=anchorTick('shoot','release');p.x=100;p.facing=facing;
 assert.ok(sampleBallForward('shoot',release,p.id)>sampleBallForward('shoot',0,p.id));
 stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{shootPressed:true})]);
 for(let i=1;i<=release;i++)stepMatch(m,neutral(m));
 assert.equal(m.ball.mode,'shot');assert.equal(p.animation.tick,release);
 assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-facing*sampleBallForward('shoot',release,p.id))<1e-9);
 assert.ok(Math.abs(m.ball.z-m.ball.vz-.026-flightHeightFromHand(sampleBallHeight('shoot',release,p.id),p.z))<1e-9);
});
test('paused animation cannot release, lost ownership cancels a queued shot',()=>{const m=setup(),p=m.players[0];stepMatch(m,[createInput(p.id,{shootPressed:true})]);m.pause=true;const tick=p.animation.tick;for(let i=0;i<30;i++)stepMatch(m,neutral(m));assert.equal(p.animation.tick,tick);m.pause=false;p.hasBall=false;m.ball.ownerId=null;m.ball.mode='loose';m.ball.x=180;for(let i=0;i<30;i++)stepMatch(m,neutral(m));assert.equal(p.fga,0);});
for(const key of ['power','windmill','reverse','360','tomahawk','double','clutch','scythe','alley-oop-power','alley-oop-reverse'])test(`${key} finishes at its marked dunk frame exactly once`,()=>{const m=setup(),p=m.players[0];p.x=182;p.y=50;p.vx=.2;p.dunk=99;stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{shootPressed:true,turbo:true,x:1,dunkVariant:key})]);const clip=key.startsWith('alley-')?key:`dunk-${key}`;assert.equal(p.animation.clip,clip);for(let i=1;i<anchorTick(clip,'finish');i++){stepMatch(m,neutral(m));assert.equal(m.score[0],0);}stepMatch(m,neutral(m));assert.equal(m.score[0],2);for(let i=0;i<90;i++)stepMatch(m,neutral(m));assert.equal(p.dunks,1);});

test('pickup stays loose until the grab frame',()=>{const m=setup(),p=m.players[1];for(const a of m.players)a.hasBall=false;Object.assign(m.ball,{mode:'loose',ownerId:null,x:p.x,y:p.y,z:.5,vx:0,vy:0,vz:0});stepMatch(m,neutral(m));assert.equal(p.animation.clip,'pickup');assert.equal(p.hasBall,false);for(let i=1;i<anchorTick('pickup','grab');i++){stepMatch(m,neutral(m));assert.equal(p.hasBall,false);}stepMatch(m,neutral(m));assert.equal(p.hasBall,true);});
test('blocking is limited to the marked apex frame',()=>{const m=setup(),p=m.players[2];p.x=150;p.y=50;p.block=100;for(const a of m.players)a.hasBall=false;Object.assign(m.ball,{mode:'shot',ownerId:null,lastTouch:m.players[0].id,attemptId:'test-block',x:150,y:50,z:5,vx:0,vy:0,vz:0,made:false,targetX:192,targetY:50,targetZ:2.6});stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{blockPressed:true})]);assert.equal(p.blocks,0);for(let i=1;i<anchorTick('block','apex');i++){stepMatch(m,neutral(m));assert.equal(p.blocks,0);}stepMatch(m,neutral(m));assert.equal(p.blocks,1);});
for(const variant of ['normal','reverse'])test(`layup ${variant} uses its own release frame`,()=>{const m=setup(),p=m.players[0];p.x=181;stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{shootPressed:true,layupVariant:variant})]);const clip=variant==='reverse'?'layup-reverse':'layup';assert.equal(p.animation.clip,clip);for(let i=1;i<anchorTick(clip,'release');i++){stepMatch(m,neutral(m));assert.equal(p.fga,0);}stepMatch(m,neutral(m));assert.equal(p.fga,1);});
test('a match with CPU inputs reaches a decided final',()=>{const m=createMatch({quarterSeconds:12,seed:31});m.overtimeSeconds=12;let ticks=0;while(m.phase!=='final'&&ticks++<60000)stepMatch(m,[]);assert.equal(m.phase,'final');assert.notEqual(m.score[0],m.score[1]);});
test('dunk separates the ball at release and can be interrupted before finish',()=>{const m=setup(),p=m.players[0];p.x=182;p.vx=.2;p.dunk=99;stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{shootPressed:true,turbo:true,x:1})]);const clip=p.animation.clip;for(let i=0;i<anchorTick(clip,'release');i++)stepMatch(m,neutral(m));assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);m.ball.mode='loose';m.ball.attemptId=null;for(let i=0;i<10;i++)stepMatch(m,neutral(m));assert.equal(m.score[0],0);});
test('a turbo pass near the hoop produces a playable alley oop finish',()=>{const m=setup(),p=m.players[0],r=m.players[1];p.x=170;r.x=186;stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{passPressed:true,turbo:true})]);let sawOop=false;for(let i=0;i<90;i++){stepMatch(m,neutral(m));sawOop ||= r.animation.clip.startsWith('alley-oop-');}assert.equal(sawOop,true);assert.equal(r.dunks,1);assert.equal(p.assists,1);});
test('celebration plays for 70 ticks before the opposing inbound',()=>{const m=setup(),p=m.players[0];p.x=182;p.vx=.2;p.dunk=99;stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{shootPressed:true,turbo:true,x:1})]);const finish=anchorTick(p.animation.clip,'finish');for(let i=0;i<finish;i++)stepMatch(m,neutral(m));assert.equal(p.animation.clip,'celebrate');assert.equal(m.scorePause,70);const clock=m.clock;for(let i=0;i<69;i++){stepMatch(m,neutral(m));assert.equal(m.ball.mode,'dead');}assert.equal(p.animation.tick,69);assert.equal(m.clock,clock);stepMatch(m,neutral(m));assert.equal(m.ball.mode,'carried');assert.equal(m.players.find(p=>p.hasBall).team,1);});
test('metadata has nonuniform action timing and the full unique frame contract',()=>{const counts=[6,4,10,11,11,10,6,6,6,4,5,8,8,4,8,11,5,10,10,...Array(10).fill(15)];assert.deepEqual(Object.values(animationClips).map(c=>c.frames.length),counts);for(const [key,c] of Object.entries(animationClips)){assert.ok(c.frames.every(f=>Number.isInteger(f.duration)&&f.duration>0));if(!c.loop)assert.ok(new Set(c.frames.map(f=>f.duration)).size>1,key);for(const anchor of Object.keys(c.anchors))assert.equal(sampleAnimation(key,anchorTick(key,anchor)).frame,c.anchors[anchor]);}});
test('dunk height follows takeoff, peak and finish anchors',()=>{const m=setup(),p=m.players[0];p.x=182;p.vx=.2;p.dunk=99;stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{shootPressed:true,turbo:true,x:1})]);const clip=p.animation.clip;while(p.animation.tick<anchorTick(clip,'takeoff')){stepMatch(m,neutral(m));assert.equal(p.z,0);}while(p.animation.tick<anchorTick(clip,'peak'))stepMatch(m,neutral(m));assert.equal(p.z,5);});
test('directional passes and lower court reverse layups are reachable through regular controls',()=>{for(const [y,clip] of [[1,'pass-behind'],[-1,'pass-overhead']]){const m=setup(),p=m.players[0];stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{passPressed:true,y})]);assert.equal(p.animation.clip,clip);}const m=setup(),p=m.players[0];p.x=182;p.y=55;stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{shootPressed:true})]);assert.equal(p.animation.clip,'layup-reverse');});
test('push impact waits for its contact frame',()=>{const m=setup(),p=m.players[2],target=m.players[1];p.x=target.x;p.y=target.y;p.strength=99;stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{shovePressed:true})]);assert.equal(target.stun,0);while(p.animation.tick<anchorTick('push','contact')-1){stepMatch(m,neutral(m));assert.equal(target.stun,0);}stepMatch(m,neutral(m));assert.ok(target.stun>0);assert.equal(target.animation.clip,'fall');});
test('fall/get-up exposes ten authored poses and finishes in the recovered stance',()=>{
 const clip=animationClips.fall;assert.equal(clip.frames.length,10);assert.equal(animationDuration('fall'),40);
 let tick=0;for(let frame=0;frame<clip.frames.length;frame++){
  assert.equal(sampleAnimation('fall',tick).frame,frame,'fall frame '+frame);
  tick+=clip.frames[frame].duration;
 }
 assert.equal(anchorTick('fall','finish'),33);assert.equal(sampleAnimation('fall',33).frame,9);
 assert.deepEqual(sampleAnimation('fall',39),{frame:9,done:false});
 assert.deepEqual(sampleAnimation('fall',40),{frame:9,done:true});
});
test('celebration exposes ten authored poses and ends at its finish anchor',()=>{
 const clip=animationClips.celebrate;assert.equal(clip.frames.length,10);assert.equal(animationDuration('celebrate'),70);
 let tick=0;for(let frame=0;frame<clip.frames.length;frame++){
  assert.equal(sampleAnimation('celebrate',tick).frame,frame,'celebrate frame '+frame);
  tick+=clip.frames[frame].duration;
 }
 assert.equal(anchorTick('celebrate','finish'),65);assert.equal(sampleAnimation('celebrate',65).frame,9);
 assert.deepEqual(sampleAnimation('celebrate',70),{frame:9,done:true});
});
test('live movement selects and advances the visible locomotion clip, including pause and stop',()=>{
  const m=createMatch({quarterSeconds:60,seed:23}),holder=m.players[0],runner=m.players[1];
  assert.equal(holder.animation.clip,'idle-ball');
  const move=turbo=>neutral(m).map(i=>i.playerId===holder.id?createInput(i.playerId,{x:1,turbo}):i.playerId===runner.id?createInput(i.playerId,{x:1}):i);
  stepMatch(m,move(false));assert.equal(holder.animation.clip,'dribble');assert.equal(runner.animation.clip,'run');
  for(let i=0;i<5;i++)stepMatch(m,move(false));
  assert.ok(holder.animation.tick>0);assert.ok(runner.animation.tick>0);
  assert.notEqual(sampleAnimation(runner.animation.clip,runner.animation.tick).frame,0);
  stepMatch(m,move(true));assert.equal(holder.animation.clip,'dribble-run');
  stepMatch(m,move(true));const snapshot=structuredClone(m.players.map(p=>p.animation));
  stepMatch(m,[createInput(holder.id,{pausePressed:true})]);for(let i=0;i<8;i++)stepMatch(m,move(true));
  assert.deepEqual(m.players.map(p=>p.animation),snapshot);
  stepMatch(m,[createInput(holder.id,{pausePressed:true})]);stepMatch(m,neutral(m));
  assert.equal(holder.animation.clip,'idle-ball');assert.equal(runner.animation.clip,'idle');
});
test('an unassisted AI match drives to the rim and rotates all eight dunk clips',()=>{
  const roster=team=>({roster:[0,1].map(n=>({id:`dunker-${team}-${n}`,name:`Dunker ${team}-${n}`,stats:{speed:99,dunk:99,three:70,block:75,steal:75,strength:75}}))});
  const m=createMatch({quarterSeconds:180,seed:31,home:roster(0),away:roster(1)}),seen=new Set();let ticks=0;
  while(m.phase!=='final'&&ticks++<100000){stepMatch(m,[]);for(const p of m.players)if(p.animation.clip.startsWith('dunk-'))seen.add(p.animation.clip);}
  assert.equal(m.phase,'final');assert.ok(m.players.reduce((sum,p)=>sum+p.dunks,0)>0,'AI must finish a real dunk');
  assert.deepEqual([...seen].sort(),['power','windmill','reverse','360','tomahawk','double','clutch','scythe'].map(v=>`dunk-${v}`).sort());
});
for(const turbo of [false,true])test(`${turbo?'running':'walking'} dribble ball touches the floor in its low hand phase`,()=>{
  const m=createMatch({quarterSeconds:60}),p=m.players[0],clip=turbo?'dribble-run':'dribble';
  const inputs=()=>neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{x:1,turbo}):i);
  stepMatch(m,inputs());const high=m.ball.z;const lowTick=animationClips[clip].frames.slice(0,5).reduce((n,f)=>n+f.duration,0);
  while(p.animation.tick<lowTick)stepMatch(m,inputs());
  assert.equal(sampleAnimation(clip,p.animation.tick).frame,5);assert.equal(m.ball.z,0);assert.ok(high>1);
  while(p.animation.tick<animationDuration(clip))stepMatch(m,inputs());assert.equal(m.ball.z,high);
});
test('carried height follows animation phase and player elevation independently of the match clock',()=>{
  const a=createMatch({quarterSeconds:60}),b=createMatch({quarterSeconds:60});b.clock=30;
  for(const m of [a,b]){const p=m.players[0];for(let i=0;i<8;i++)stepMatch(m,neutral(m).map(f=>f.playerId===p.id?createInput(p.id,{x:1}):f));}
  assert.equal(a.players[0].animation.tick,b.players[0].animation.tick);assert.equal(a.ball.z,b.ball.z);
  const idle=createMatch({quarterSeconds:60}),p=idle.players[0];stepMatch(idle,neutral(idle));const waist=idle.ball.z;
  for(let i=0;i<7;i++){stepMatch(idle,neutral(idle));assert.equal(idle.ball.z,waist);}
  p.z=2;p.vz=0;stepMatch(idle,neutral(idle));assert.equal(idle.ball.z,p.z+waist);
});
for(const input of [{shootPressed:true},{passPressed:true}])test(`${input.shootPressed?'shot':'pass'} anticipation lifts the held ball toward release`,()=>{
  const m=setup(),p=m.players[0];stepMatch(m,[...neutral(m).filter(f=>f.playerId!==p.id),createInput(p.id,input)]);const initial=m.ball.z;
  while(p.animation.tick<anchorTick(p.animation.clip,'release')-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.ok(m.ball.z>initial);const releaseTick=anchorTick(p.animation.clip,'release'),releaseHeight=input.shootPressed?3:1.6;assert.ok(Math.abs(m.ball.z-p.z-(1.1+(releaseHeight-1.1)*(releaseTick-1)/releaseTick))<1e-10);
});

test('power hand height follows its calibrated gather until ball release',()=>{
  const m=setup(),p=m.players[0];p.x=182;p.vx=.2;p.dunk=99;
  stepMatch(m,[...neutral(m).filter(i=>i.playerId!==p.id),createInput(p.id,{shootPressed:true,turbo:true,x:1})]);
  const clip=p.animation.clip;assert.equal(m.ball.z-p.z,sampleBallHeight(clip,0));
  while(p.animation.tick<anchorTick(clip,'peak'))stepMatch(m,neutral(m));
  assert.ok(Math.abs(m.ball.z-p.z-sampleBallHeight(clip,p.animation.tick))<1e-10);
  while(p.animation.tick<anchorTick(clip,'release')-1)stepMatch(m,neutral(m));
  assert.ok(Math.abs(m.ball.z-p.z-sampleBallHeight(clip,p.animation.tick))<1e-10);
  stepMatch(m,neutral(m));assert.equal(m.ball.mode,'dunk');assert.equal(m.ball.z,3,'release keeps its physics height');
});
for(const variant of ['power','reverse'])test(`alley oop ${variant} catches the travelling pass in the air exactly at grab`,()=>{
  const m=setup(),passer=m.players[0],receiver=m.players[1];passer.x=170;receiver.x=184;receiver.y=46;
  stepMatch(m,[...neutral(m).filter(i=>i.playerId!==passer.id),createInput(passer.id,{passPressed:true,turbo:true,alleyOop:variant})]);
  while(passer.animation.tick<anchorTick(passer.animation.clip,'release'))stepMatch(m,neutral(m));
  const clip=`alley-oop-${variant}`;assert.equal(receiver.animation.clip,clip);assert.equal(receiver.animation.tick,0);assert.equal(receiver.hasBall,false);assert.equal(m.ball.mode,'pass');assert.equal(m.score[0],0);assert.equal(passer.assists,0);
  const grab=anchorTick(clip,'grab');
  for(let i=1;i<=grab;i++){
    const old={x:m.ball.x,y:m.ball.y,z:m.ball.z,vx:m.ball.vx,vy:m.ball.vy,vz:m.ball.vz};
    stepMatch(m,neutral(m));
    assert.ok(Math.abs(m.ball.x-old.x-old.vx)<1e-8,'ball travels to the catch without teleporting');
    assert.ok(Math.abs(m.ball.y-old.y-old.vy)<1e-8);assert.ok(Math.abs(m.ball.z-old.z-old.vz)<1e-8);
    if(i<grab){assert.equal(receiver.hasBall,false);assert.equal(m.ball.mode,'pass');}
  }
  assert.equal(receiver.animation.tick,grab);assert.ok(receiver.z>0);assert.equal(receiver.hasBall,true);assert.equal(m.ball.mode,'carried');assert.equal(m.ball.ownerId,receiver.id);assert.equal(receiver.animation.clip,clip);assert.equal(passer.assists,0);
  while(receiver.animation.tick<anchorTick(clip,'release'))stepMatch(m,neutral(m));assert.equal(m.ball.mode,'dunk');assert.equal(receiver.hasBall,false);assert.equal(m.score[0],0);
  while(receiver.animation.clip===clip&&receiver.animation.tick<anchorTick(clip,'finish'))stepMatch(m,neutral(m));assert.equal(m.score[0],2);assert.equal(passer.assists,1);
});
test('Paprika catches and releases a power alley oop on her muzzle and near forepaw track',()=>{
  const m=setup(),passer=m.players[0],receiver=m.players[1];receiver.id='paprika';receiver.name='Paprika';passer.x=170;receiver.x=184;receiver.y=46;
  stepMatch(m,[...neutral(m).filter(i=>i.playerId!==passer.id),createInput(passer.id,{passPressed:true,turbo:true,alleyOop:'power'})]);
  while(passer.animation.tick<anchorTick(passer.animation.clip,'release'))stepMatch(m,neutral(m));
  const clip='alley-oop-power',grab=anchorTick(clip,'grab'),release=anchorTick(clip,'release');
  assert.equal(receiver.animation.clip,clip);assert.equal(receiver.hasBall,false);assert.equal(m.ball.mode,'pass');
  while(receiver.animation.tick<grab)stepMatch(m,neutral(m));
  assert.equal(receiver.animation.tick,grab);assert.equal(receiver.hasBall,true);assert.equal(m.ball.ownerId,receiver.id);assert.equal(m.ball.mode,'carried');
  assert.ok(Math.abs(m.ball.x-receiver.x-receiver.facing*sampleBallForward(clip,grab,receiver.id))<1e-9);
  assert.ok(Math.abs(m.ball.z-receiver.z-sampleBallHeight(clip,grab,receiver.id))<1e-9);
  while(receiver.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(m.ball.ownerId,receiver.id);
  assert.ok(Math.abs(m.ball.x-receiver.x-receiver.facing*sampleBallForward(clip,receiver.animation.tick,receiver.id))<1e-9);
  stepMatch(m,neutral(m));assert.equal(receiver.animation.tick,release);assert.equal(receiver.hasBall,false);assert.equal(m.ball.mode,'dunk');assert.equal(m.ball.ownerId,null);
  while(receiver.animation.clip===clip&&receiver.animation.tick<anchorTick(clip,'finish'))stepMatch(m,neutral(m));
  assert.equal(m.score[0],2);assert.equal(passer.assists,1);assert.equal(receiver.dunks,1);
});
test('Reed catches the lob at his high right hand and carries it through the power finish',()=>{
 const m=setup(),passer=m.players[0],receiver=m.players[1];receiver.id='reed-ashcroft';receiver.name='Reed Ashcroft';passer.x=170;receiver.x=184;receiver.y=46;
 stepMatch(m,[...neutral(m).filter(i=>i.playerId!==passer.id),createInput(passer.id,{passPressed:true,turbo:true,alleyOop:'power'})]);
 while(passer.animation.tick<anchorTick(passer.animation.clip,'release'))stepMatch(m,neutral(m));
 const clip='alley-oop-power',grab=anchorTick(clip,'grab'),release=anchorTick(clip,'release');
 assert.equal(receiver.animation.clip,clip);assert.equal(receiver.hasBall,false);assert.equal(m.ball.mode,'pass');
 while(receiver.animation.tick<grab)stepMatch(m,neutral(m));
 assert.equal(receiver.animation.tick,grab);assert.equal(receiver.hasBall,true);assert.equal(m.ball.ownerId,receiver.id);assert.equal(m.ball.mode,'carried');
 assert.ok(Math.abs(m.ball.x-receiver.x-receiver.facing*sampleBallForward(clip,grab,receiver.id))<1e-9);
 assert.ok(Math.abs(m.ball.z-receiver.z-sampleBallHeight(clip,grab,receiver.id))<1e-9);
 while(receiver.animation.tick<release-1)stepMatch(m,neutral(m));
 assert.equal(m.ball.mode,'carried');assert.equal(m.ball.ownerId,receiver.id);
 assert.ok(Math.abs(m.ball.x-receiver.x-receiver.facing*sampleBallForward(clip,receiver.animation.tick,receiver.id))<1e-9);
 assert.ok(Math.abs(m.ball.z-receiver.z-sampleBallHeight(clip,receiver.animation.tick,receiver.id))<1e-9);
 stepMatch(m,neutral(m));assert.equal(receiver.animation.tick,release);assert.equal(receiver.hasBall,false);assert.equal(m.ball.mode,'dunk');assert.equal(m.ball.ownerId,null);
 while(receiver.animation.clip===clip&&receiver.animation.tick<anchorTick(clip,'finish'))stepMatch(m,neutral(m));
 assert.equal(m.score[0],2);assert.equal(passer.assists,1);assert.equal(receiver.dunks,1);
});
test('Paprika turns into the reverse alley-oop with her separate paw and crown track',()=>{
  const m=setup(),passer=m.players[0],receiver=m.players[1];receiver.id='paprika';receiver.name='Paprika';passer.x=170;receiver.x=184;receiver.y=46;
  stepMatch(m,[...neutral(m).filter(i=>i.playerId!==passer.id),createInput(passer.id,{passPressed:true,turbo:true,alleyOop:'reverse'})]);
  while(passer.animation.tick<anchorTick(passer.animation.clip,'release'))stepMatch(m,neutral(m));
  const clip='alley-oop-reverse',grab=anchorTick(clip,'grab'),release=anchorTick(clip,'release');
  assert.equal(receiver.animation.clip,clip);assert.equal(receiver.hasBall,false);assert.equal(m.ball.mode,'pass');
  while(receiver.animation.tick<grab)stepMatch(m,neutral(m));
  assert.equal(receiver.animation.tick,grab);assert.equal(receiver.hasBall,true);assert.equal(m.ball.ownerId,receiver.id);assert.equal(m.ball.mode,'carried');
  assert.ok(Math.abs(m.ball.x-receiver.x-receiver.facing*sampleBallForward(clip,grab,receiver.id))<1e-9);
  assert.ok(Math.abs(m.ball.z-receiver.z-sampleBallHeight(clip,grab,receiver.id))<1e-9);
  while(receiver.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.ok(sampleBallForward(clip,receiver.animation.tick,receiver.id)<0,'reverse turn carries the separate ball behind Paprika');
  assert.equal(m.ball.mode,'carried');assert.equal(m.ball.ownerId,receiver.id);
  stepMatch(m,neutral(m));assert.equal(receiver.animation.tick,release);assert.equal(receiver.hasBall,false);assert.equal(m.ball.mode,'dunk');assert.equal(m.ball.ownerId,null);
  while(receiver.animation.clip===clip&&receiver.animation.tick<anchorTick(clip,'finish'))stepMatch(m,neutral(m));
  assert.equal(m.score[0],2);assert.equal(passer.assists,1);assert.equal(receiver.dunks,1);
});
test('a disrupted aerial lob cancels the awaiting catch and cannot award a free score',()=>{
  const m=setup(),passer=m.players[0],receiver=m.players[1];passer.x=170;receiver.x=184;
  stepMatch(m,[...neutral(m).filter(i=>i.playerId!==passer.id),createInput(passer.id,{passPressed:true,turbo:true})]);
  while(passer.animation.tick<anchorTick(passer.animation.clip,'release'))stepMatch(m,neutral(m));
  assert.ok(receiver.animation.action?.awaitingCatch);for(let i=0;i<4;i++)stepMatch(m,neutral(m));
  m.ball.mode='loose';m.ball.lastTouch=m.players[2].id;m.ball.x=20;m.ball.y=0;
  for(let i=0;i<40;i++)stepMatch(m,neutral(m));assert.equal(receiver.hasBall,false);assert.equal(receiver.dunks,0);assert.equal(passer.assists,0);assert.deepEqual(m.score,[0,0]);
});

for(const [x,variant,clip] of [[150,undefined,'shoot'],[182,'normal','layup'],[182,'reverse','layup-reverse']])test(`${clip} rises at takeoff, reaches its peak and lands at finish`,()=>{
  const m=setup(),p=m.players[0];p.x=x;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,layupVariant:variant}):i));
  const takeoff=anchorTick(clip,'takeoff'),peak=anchorTick(clip,'peak'),finish=anchorTick(clip,'finish');
  while(p.animation.tick<takeoff)stepMatch(m,neutral(m));assert.equal(p.z,0);
  stepMatch(m,neutral(m));assert.ok(p.z>0,'must rise before release');
  while(p.animation.tick<peak)stepMatch(m,neutral(m));assert.equal(p.z,2);
  const peakZ=p.z;
  while(p.animation.tick<finish)stepMatch(m,neutral(m));assert.equal(p.z,0);assert.ok(peakZ>p.z);
});
for(const [x,variant,clip] of [[150,undefined,'shoot'],[182,'normal','layup'],[182,'reverse','layup-reverse']])test(`${clip} release preserves the elevated hand position in render coordinates`,()=>{
  const m=setup(),p=m.players[0];p.x=x;stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,layupVariant:variant}):i));
  while(p.animation.tick<anchorTick(clip,'release'))stepMatch(m,neutral(m));
  const releaseZ=m.ball.z-(m.ball.vz+.026);
  const renderedRelease=releaseZ<=3?releaseZ*28:84+(releaseZ-3)*3;
  assert.ok(p.z>0);assert.ok(Math.abs(renderedRelease-(p.z*7+sampleBallHeight(clip,p.animation.tick)*28))<1e-9);
  assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-p.facing*sampleBallForward(clip,p.animation.tick))<1e-9,'horizontal release also starts at the hand');
});
for(const [id,forward,height]of [['reed-ashcroft',7.676,2.135],['juniper-vale',5.3,2.03]])test(`${id} layup releases from the authored high hand on frame4`,()=>{
 const m=createMatch({quarterSeconds:60,seed:83,home:{roster:[{id},{id:`${id}-reserve`}]}}),p=m.players.find(player=>player.id===id);
 p.x=182;p.y=50;
 stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,layupVariant:'normal'}):i));
 assert.equal(p.animation.clip,'layup');
 while(p.animation.tick<anchorTick('layup','release'))stepMatch(m,neutral(m));
 assert.equal(anchorTick('layup','release'),10);assert.equal(p.animation.tick,10);
 assert.equal(p.fga,1);assert.equal(m.ball.mode,'shot');
 assert.equal(sampleBallForward('layup',10,id),forward);
 assert.equal(sampleBallHeight('layup',10,id),height);
 assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-p.facing*forward)<1e-9);
});
test('Paprika layup releases from her high muzzle/forepaw anchor on frame4 in both facings',()=>{
 const clip='layup',release=anchorTick(clip,'release');
 assert.equal(release,10);assert.equal(sampleAnimation(clip,release).frame,4);
 assert.equal(sampleBallForward(clip,release,'paprika'),10);
 assert.equal(sampleBallHeight(clip,release,'paprika'),1.0);
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:85,home:{roster:[{id:'paprika'},{id:'paprika-reserve'}]}}),p=m.players.find(player=>player.id==='paprika');
  p.x=182;p.y=50;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,layupVariant:'normal'}):i));
  assert.equal(p.animation.clip,'layup');
  while(p.animation.tick<release)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'shot');assert.equal(p.fga,1);
  assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-facing*10)<1e-9,'separate ball starts at the fox muzzle in either direction');
  assert.ok(p.z>0&&m.ball.z>p.z,'released shot clears the airborne fox at the marked frame');
 }
});
test('Paprika reverse layup twists to the muzzle/forepaw release on frame5 at tick12',()=>{
 const clip='layup-reverse',release=anchorTick(clip,'release');
 assert.equal(release,12);assert.equal(sampleAnimation(clip,release).frame,5);
 assert.equal(sampleBallForward(clip,release,'paprika'),10);
 assert.equal(sampleBallHeight(clip,release,'paprika'),1.0);
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:86,home:{roster:[{id:'paprika'},{id:'paprika-reserve'}]}}),p=m.players.find(player=>player.id==='paprika');
  p.x=182;p.y=55;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,layupVariant:'reverse'}):i));
  assert.equal(p.animation.clip,clip);
  while(p.animation.tick<release)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'shot');assert.equal(p.fga,1);
  assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-facing*10)<1e-9,'unowned shot starts at the reverse muzzle/paw lane');
  assert.ok(p.z>0&&m.ball.z>p.z,'released shot clears the airborne fox at the marked frame');
 }
});
for(const [id,forward,height]of [['reed-ashcroft',7.676,2.135],['juniper-vale',5.3,2.03]])test(`${id} reverse layup releases from the authored high hand on frame5`,()=>{
 const m=createMatch({quarterSeconds:60,seed:84,home:{roster:[{id},{id:`${id}-reserve`}]}}),p=m.players.find(player=>player.id===id);
 p.x=182;p.y=55;
 stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true}):i));
 assert.equal(p.animation.clip,'layup-reverse');
 while(p.animation.tick<anchorTick('layup-reverse','release'))stepMatch(m,neutral(m));
 assert.equal(anchorTick('layup-reverse','release'),12);assert.equal(p.animation.tick,12);
 assert.equal(p.fga,1);assert.equal(m.ball.mode,'shot');
 assert.equal(sampleBallForward('layup-reverse',12,id),forward);
 assert.equal(sampleBallHeight('layup-reverse',12,id),height);
 assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-p.facing*forward)<1e-9);
});
function stealSetup(){const m=setup(),holder=m.players[0],defender=m.players[2];holder.x=defender.x=100;holder.y=defender.y=50;defender.steal=99;return {m,holder,defender};}
function startSteal(m,defender){stepMatch(m,neutral(m).map(i=>i.playerId===defender.id?createInput(i.playerId,{stealPressed:true}):i));}
test('steal contact waits until grab',()=>{
  const {m,holder,defender}=stealSetup();startSteal(m,defender);assert.equal(holder.stun,0);assert.equal(defender.steals,0);assert.equal(m.ball.mode,'carried');
  while(defender.animation.tick<anchorTick('steal','grab')-1){stepMatch(m,neutral(m));assert.equal(holder.stun,0);assert.equal(defender.steals,0);}
  stepMatch(m,neutral(m));assert.equal(defender.steals,1);assert.ok(holder.stun>0);assert.equal(m.ball.mode,'loose');
});
test('Reed and Juniper steals use the authored contact frame and distinct hand lanes',()=>{
 const expected=[['reed-ashcroft',14,1.35],['juniper-vale',12,1.25]];
 for(const [id,forward,height] of expected){
  const m=createMatch({quarterSeconds:60,seed:61,away:{roster:[{id},{id:`${id}-reserve`}]}}),holder=m.players[0],defender=m.players[2];
  holder.x=defender.x=100;holder.y=defender.y=50;defender.steal=99;
  startSteal(m,defender);assert.equal(defender.animation.clip,'steal',id+' action selection');
  while(defender.animation.tick<anchorTick('steal','grab')-1)stepMatch(m,neutral(m));
  stepMatch(m,neutral(m));assert.equal(defender.steals,1,id+' steal resolves at frame3');
  assert.equal(m.ball.mode,'loose',id+' ball remains separate after contact');
  assert.equal(sampleBallForward('steal',anchorTick('steal','grab'),id),forward,id+' forward contact track');
  assert.equal(sampleBallHeight('steal',anchorTick('steal','grab'),id),height,id+' vertical contact track');
 }
});
for(const disruption of ['range','ownership','stun','target-stun'])test(`steal rechecks ${disruption} at grab`,()=>{
  const {m,holder,defender}=stealSetup();startSteal(m,defender);
  if(disruption==='range')holder.x=150;
  if(disruption==='ownership'){holder.hasBall=false;m.ball.mode='pass';m.ball.ownerId=null;m.ball.x=150;m.ball.y=0;}
  if(disruption==='stun')defender.stun=20;
  if(disruption==='target-stun')holder.stun=20;
  for(let i=0;i<anchorTick('steal','grab');i++)stepMatch(m,neutral(m));
  assert.equal(defender.steals,0);assert.equal(holder.stun,disruption==='target-stun'?15:0);
});

for(const facing of [1,-1])test(`windmill ball follows the authored backward and low sweep facing ${facing}`,()=>{
  const m=setup(),p=m.players[0];p.x=182;p.vx=.2;p.dunk=99;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:1,dunkVariant:'windmill'}):i));p.facing=facing;
  const clip=p.animation.clip,frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,f)=>n+f.duration,0);
  while(p.animation.tick<frameTick(3))stepMatch(m,neutral(m));
  assert.equal(sampleBallForward(clip,p.animation.tick),-7);assert.equal(m.ball.x-p.x,-7*facing);
  const frozen=structuredClone(m.ball);m.pause=true;stepMatch(m,neutral(m));assert.deepEqual(m.ball,frozen);m.pause=false;
  while(p.animation.tick<frameTick(5))stepMatch(m,neutral(m));
  assert.equal(m.ball.x-p.x,4*facing);assert.ok(Math.abs(m.ball.z-p.z-.5)<1e-9);
  while(p.animation.tick<anchorTick(clip,'peak'))stepMatch(m,neutral(m));
  assert.equal(sampleBallHeight(clip,p.animation.tick),1.2);assert.equal(m.ball.x-p.x,10*facing);
  while(p.animation.clip===clip&&p.animation.tick<anchorTick(clip,'finish'))stepMatch(m,neutral(m));
  assert.equal(p.dunks,1);assert.deepEqual(m.score,[2,0]);
});
for(const key of ['dunk-clutch','dunk-scythe','alley-oop-power','alley-oop-reverse'])test(`${key} has a finite authored hand track and preserves release anchors`,()=>{
  const c=animationClips[key];
  assert.equal(c.frames.length,15);assert.equal(c.anchors.grab,5);assert.equal(c.anchors.release,10);assert.equal(c.anchors.finish,11);
  let tick=0;
  for(const f of c.frames){assert.ok(Number.isFinite(f.ballForward));assert.ok(Number.isFinite(f.ballHeight));assert.equal(sampleBallForward(key,tick),f.ballForward);assert.equal(sampleBallHeight(key,tick),f.ballHeight);tick+=f.duration;}
  assert.notEqual(c.frames[5].ballForward,c.frames[9].ballForward,'gather must travel to the finishing hand');
  if(key==='dunk-clutch')assert.ok(c.frames[7].ballHeight<1,'protected hip tuck');
  if(key==='dunk-scythe')assert.ok(c.frames[7].ballForward>10,'diagonal sweep extends clear of torso');
  if(key.startsWith('alley-oop'))assert.ok(c.frames[5].ballHeight>1.8,'catch stays above forehead');
});
for(const clip of ['shoot','pass'])for(const facing of [1,-1])test(`Paprika ${clip} leaves the nose without a release jump facing ${facing}`,()=>{
 const m=setup(),p=m.players[0];p.id='paprika';m.ball.ownerId=p.id;m.ball.lastTouch=p.id;p.facing=facing;
 stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,clip==='shoot'?{shootPressed:true}:{passPressed:true}):i));
 const release=anchorTick(clip,'release');while(p.animation.tick<release)stepMatch(m,neutral(m));
 assert.equal(m.ball.mode,clip==='shoot'?'shot':'pass');
 assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-facing*sampleBallForward(clip,release,p.id))<1e-9);
 const initialZ=m.ball.z-(m.ball.vz+.026),hand=sampleBallHeight(clip,release,p.id);
 assert.ok(Math.abs(initialZ-(clip==='shoot'?flightHeightFromHand(hand,p.z):p.z+hand))<1e-9);
 assert.ok(hand<1.1,'release uses the fox muzzle, not a human overhead hand');
});
for(const clip of ['pass','pass-overhead','pass-behind'])for(const facing of [1,-1])test(`${clip} releases from its actual hand facing ${facing}`,()=>{
  const m=setup(),p=m.players[0];p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{passPressed:true,passVariant:clip}):i));
  const release=anchorTick(clip,'release');while(p.animation.tick<release)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'pass');
  assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-facing*sampleBallForward(clip,release))<1e-9,'first flight step starts at held hand');
  assert.ok(Math.abs(m.ball.z-.02-p.z-sampleBallHeight(clip,release))<1e-9,'release preserves hand height');
  if(clip==='pass-behind')assert.ok(sampleBallForward(clip,release)<0,'behind-back release exits behind torso');
  if(clip==='pass-overhead')assert.ok(sampleBallHeight(clip,anchorTick(clip,'release')-2)>2,'gather goes above head');
});
test('Reed Ashcroft and Juniper Vale standard passes follow their authored hand poses in both facings',()=>{
 const releases=[['reed-ashcroft',18],['juniper-vale',15]];
 for(const [id,releaseForward] of releases)for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:712,home:{roster:[{id},{id:'partner'}]}}),p=m.players.find(player=>player.id===id);
  p.x=100;p.y=50;p.facing=facing;m.ball.ownerId=p.id;m.ball.lastTouch=p.id;m.ball.mode='carried';
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{passPressed:true}):i));
  const release=anchorTick('pass','release');
  while(p.animation.tick<release)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'pass',id+' releases on the marked frame');
  assert.equal(sampleBallForward('pass',release,id),releaseForward,id+' release reaches the open hands');
  assert.equal(sampleBallHeight('pass',release,id),1.5,id+' release stays at chest height');
  assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-facing*releaseForward)<1e-9,id+' flight starts at the athlete hand in facing '+facing);
  assert.ok(Math.abs(m.ball.z-.02-p.z-sampleBallHeight('pass',release,id))<1e-9,id+' release preserves hand height in facing '+facing);
 }
});
test('Reed Ashcroft and Juniper Vale overhead passes carry the ball to their raised hands in both facings',()=>{
 const releases=[['reed-ashcroft',12.5],['juniper-vale',10.5]];
 for(const [id,releaseForward] of releases)for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:713,home:{roster:[{id},{id:'partner'}]}}),p=m.players.find(player=>player.id===id);
  p.x=100;p.y=50;p.facing=facing;m.ball.ownerId=p.id;m.ball.lastTouch=p.id;m.ball.mode='carried';
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{passPressed:true,passVariant:'pass-overhead'}):i));
  const release=anchorTick('pass-overhead','release');
  while(p.animation.tick<release)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'pass',id+' releases on the marked overhead frame');
  assert.equal(sampleBallForward('pass-overhead',release,id),releaseForward,id+' release reaches the raised hands');
  assert.equal(sampleBallHeight('pass-overhead',release,id),2.15,id+' release stays overhead');
  assert.ok(sampleBallHeight('pass-overhead',release-2,id)>2,id+' gather reaches above the head');
  assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-facing*releaseForward)<1e-9,id+' release is at the hand in facing '+facing);
  assert.ok(Math.abs(m.ball.z-.02-p.z-2.15)<1e-9,id+' release preserves hand height in facing '+facing);
 }
});
test('Reed Ashcroft and Juniper Vale behind-the-back passes carry the ball to the rear hand in both facings',()=>{
 const releases=[['reed-ashcroft',-14.5],['juniper-vale',-14]];
 for(const [id,releaseForward] of releases)for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:714,home:{roster:[{id},{id:'partner'}]}}),p=m.players.find(player=>player.id===id);
  p.x=100;p.y=50;p.facing=facing;m.ball.ownerId=p.id;m.ball.lastTouch=p.id;m.ball.mode='carried';
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{passPressed:true,passVariant:'pass-behind'}):i));
  const release=anchorTick('pass-behind','release');
  while(p.animation.tick<release)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'pass',id+' releases on the marked frame');
  assert.equal(sampleBallForward('pass-behind',release,id),releaseForward,id+' release reaches the rear hand');
  assert.equal(sampleBallHeight('pass-behind',release,id),1.25,id+' release stays at hip height');
  assert.ok(sampleBallForward('pass-behind',release,id)<0,id+' releases behind the torso');
  assert.ok(Math.abs(m.ball.x-m.ball.vx-p.x-facing*releaseForward)<1e-9,id+' flight begins at the rear hand in facing '+facing);
  assert.ok(Math.abs(m.ball.z-.02-p.z-1.25)<1e-9,id+' release preserves hand height in facing '+facing);
 }
});
test('Reed Ashcroft and Juniper Vale catch with their own separate-ball tracks in both facings',()=>{
 const catchHand=[['reed-ashcroft',15],['juniper-vale',13]];
 for(const [id,forward] of catchHand)for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:715,home:{roster:[{id},{id:'partner'}]}}),p=m.players.find(player=>player.id===id);
  const passer=m.players.find(player=>player.team===p.team&&player.id!==p.id);
  p.x=100;p.y=50;p.facing=facing;p.hasBall=false;
  Object.assign(m.ball,{mode:'pass',ownerId:null,targetId:p.id,lastTouch:passer.id,x:p.x,y:p.y,z:.5,vx:0,vy:0,vz:0});
  stepMatch(m,neutral(m));assert.equal(p.animation.clip,'receive',id+' selects receive');
  const grab=anchorTick('receive','grab');
  while(p.animation.tick<grab)stepMatch(m,neutral(m));
  assert.equal(p.animation.tick,grab,id+' catches at the marked frame');
  assert.equal(p.hasBall,true,id+' gains possession at catch');
  assert.equal(m.ball.mode,'carried',id+' ball becomes carried');
  assert.equal(sampleBallForward('receive',grab,id),forward,id+' forward track meets the hands');
  assert.equal(sampleBallHeight('receive',grab,id),1.5,id+' height track meets the hands');
  assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<1e-9,id+' held ball follows hand in facing '+facing);
  assert.ok(Math.abs(m.ball.z-p.z-1.5)<1e-9,id+' held ball follows hand height in facing '+facing);
 }
});
test('Reed Ashcroft and Juniper Vale pick up loose balls at the authored floor-contact hand in both facings',()=>{
 const pickupHand=[['reed-ashcroft',18],['juniper-vale',16]];
 for(const [id,forward] of pickupHand)for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:716,home:{roster:[{id},{id:'partner'}]}}),p=m.players.find(player=>player.id===id);
  for(const player of m.players)player.hasBall=false;
  p.x=100;p.y=50;p.facing=facing;
  Object.assign(m.ball,{mode:'loose',ownerId:null,targetId:null,lastTouch:m.players.find(player=>player.team!==p.team).id,x:p.x,y:p.y,z:0,vx:0,vy:0,vz:0});
  stepMatch(m,neutral(m));assert.equal(p.animation.clip,'pickup',id+' selects pickup');
  const grab=anchorTick('pickup','grab');
  while(p.animation.tick<grab)stepMatch(m,neutral(m));
  assert.equal(p.animation.tick,grab,id+' grabs at the marked frame');
  assert.equal(p.hasBall,true,id+' gains possession');assert.equal(m.ball.mode,'carried',id+' carries the ball');
  assert.equal(sampleBallForward('pickup',grab,id),forward,id+' track meets the low hand');
  assert.equal(sampleBallHeight('pickup',grab,id),0,id+' track reaches the court plane');
  assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<1e-9,id+' held ball follows hand in facing '+facing);
  assert.equal(m.ball.z,p.z,id+' held ball touches court at contact');
 }
});
test('a receiver exactly at the releasing hand cannot create nonfinite pass velocities',()=>{
  const m=setup(),p=m.players[0],receiver=m.players[1];p.facing=1;
  receiver.x=p.x+sampleBallForward('pass',anchorTick('pass','release'));receiver.y=p.y;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{passPressed:true}):i));
  while(p.animation.tick<anchorTick('pass','release'))stepMatch(m,neutral(m));
  for(const property of ['x','y','z','vx','vy','vz'])assert.ok(Number.isFinite(m.ball[property]),property);
});
test('ordinary carried-ball clips retain their forward offset',()=>{
  for(const clip of ['idle-ball','dribble','dribble-run','shoot','pass'])
    for(const tick of [0,1,7,22,100])assert.equal(sampleBallForward(clip,tick),1.5);
});

const authoredDunkPhases={
  reverse:{high:5,highHeight:2.4,peakHeight:2.1,peakBehind:true},
  tomahawk:{high:3,highHeight:2.6,peakHeight:1.7,peakBehind:true},
  double:{high:4,highHeight:2.6,peakHeight:.6}
};
for(const [variant,phases] of Object.entries(authoredDunkPhases))for(const facing of [1,-1])test(`${variant} tracks authored hand phases facing ${facing} and keeps release/finish timing`,()=>{
  const m=setup(),p=m.players[0];p.x=182;p.vx=.2;p.dunk=99;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:1,dunkVariant:variant}):i));p.facing=facing;
  const clip=`dunk-${variant}`,frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,f)=>n+f.duration,0);
  const at=index=>{while(p.animation.tick<frameTick(index))stepMatch(m,neutral(m));};
  at(phases.high);assert.equal(sampleBallHeight(clip,p.animation.tick),phases.highHeight,'measured first gather height');
  if(variant==='reverse')assert.ok(sampleBallForward(clip,p.animation.tick)<0,'reverse gather is behind the body');
  if(variant==='tomahawk')for(let frame=4;frame<=8;frame++)assert.equal(sampleBallHeight(clip,frameTick(frame)),1.7,'cocked hand stays at measured head height');
  at(7);
  assert.equal(sampleBallHeight(clip,p.animation.tick),phases.peakHeight,'measured held hand height at peak');
  if(phases.peakBehind){assert.ok(sampleBallForward(clip,p.animation.tick)<0);}
  else {assert.ok(sampleBallHeight(clip,p.animation.tick)<1,'double pump lowers to knees at peak');assert.ok(sampleBallForward(clip,p.animation.tick)>0);}
  assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward(clip,p.animation.tick))<1e-9);
  assert.ok(Math.abs(m.ball.z-p.z-sampleBallHeight(clip,p.animation.tick))<1e-9);
  at(9);assert.ok(sampleBallForward(clip,p.animation.tick)>0,'arm extends forward before release');
  assert.ok(sampleBallHeight(clip,p.animation.tick)>=2.4,'final gather returns overhead');
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish');
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));assert.equal(m.ball.mode,'carried');assert.equal(p.fga,0);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.fga,1);assert.deepEqual(m.score,[0,0]);
  while(p.animation.tick<finish-1)stepMatch(m,neutral(m));assert.deepEqual(m.score,[0,0]);
  stepMatch(m,neutral(m));assert.equal(p.animation.clip,'celebrate');assert.equal(p.dunks,1);assert.deepEqual(m.score,[2,0]);
});

for(const facing of [1,-1])test(`power ball stays at the packed white-sleeved hand facing ${facing}`,()=>{
  const m=setup(),p=m.players[0];p.x=182;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:1,dunkVariant:'power'}):i));
  const clip='dunk-power',frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,f)=>n+f.duration,0);
  // Hand centers estimated from the actual112x96 packed cells at court y50.
  for(const [index,handX,handY] of [[0,57,58],[1,27,55],[3,47,16],[7,38,14],[8,23,54],[9,91,12]]){
    while(p.animation.tick<frameTick(index))stepMatch(m,neutral(m));
    const forward=(handX-56)*.804/2.2,height=(70.22-handY*.804)/28;
    assert.ok(Math.abs(sampleBallForward(clip,p.animation.tick)-forward)<.06,`frame${index} horizontal hand target`);
    assert.ok(Math.abs(sampleBallHeight(clip,p.animation.tick)-height)<.02,`frame${index} vertical hand target`);
    assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06);assert.ok(Math.abs(m.ball.z-p.z-height)<.02);
  }
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish');
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));assert.equal(m.ball.mode,'carried');assert.equal(p.fga,0);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.fga,1);assert.deepEqual(m.score,[0,0]);
  while(p.animation.tick<finish-1)stepMatch(m,neutral(m));assert.deepEqual(m.score,[0,0]);
  stepMatch(m,neutral(m));assert.equal(p.dunks,1);assert.equal(p.animation.clip,'celebrate');assert.deepEqual(m.score,[2,0]);
});

test('Reed power dunk keeps the separate ball at his raised hand and releases at the shared anchor in both facings',()=>{
 const clip='dunk-power',frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,f)=>n+f.duration,0);
 const measured=[[0,.9,5.116],[1,.929,9.502],[3,1.216,11.329],[5,2.336,10.964],[7,2.163,8.04],[8,2.278,7.309],[9,2.336,13.156]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:64,home:{roster:[{id:'reed-ashcroft'},{id:'reed-partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'power'}):i));
  assert.equal(p.animation.clip,clip);
  for(const [frame,height,forward] of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.ok(Math.abs(sampleBallHeight(clip,p.animation.tick,p.id)-height)<.001,`frame${frame} follows Reed's hand height`);
   assert.ok(Math.abs(sampleBallForward(clip,p.animation.tick,p.id)-forward)<.001,`frame${frame} follows Reed's hand reach`);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06,`frame${frame} ball stays on Reed's hand lane facing ${facing}`);
   assert.ok(Math.abs(m.ball.z-p.z-height)<.02,`frame${frame} ball stays at Reed's hand height facing ${facing}`);
  }
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish');
  assert.equal(release,21);assert.equal(finish,23);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);assert.equal(p.fga,0);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);assert.equal(p.fga,1);
  while(p.animation.tick<finish-1)stepMatch(m,neutral(m));assert.deepEqual(m.score,[0,0]);
  stepMatch(m,neutral(m));assert.equal(p.dunks,1);assert.equal(p.animation.clip,'celebrate');assert.deepEqual(m.score,[2,0]);
 }
});
test('Reed catches the reverse lob, carries behind his crown and finishes backward',()=>{
 const m=setup(),passer=m.players[0],receiver=m.players[1];receiver.id='reed-ashcroft';receiver.name='Reed Ashcroft';passer.x=170;receiver.x=184;receiver.y=46;
 stepMatch(m,[...neutral(m).filter(i=>i.playerId!==passer.id),createInput(passer.id,{passPressed:true,turbo:true,alleyOop:'reverse'})]);
 while(passer.animation.tick<anchorTick(passer.animation.clip,'release'))stepMatch(m,neutral(m));
 const clip='alley-oop-reverse',grab=anchorTick(clip,'grab'),release=anchorTick(clip,'release');
 assert.equal(receiver.animation.clip,clip);assert.equal(receiver.hasBall,false);assert.equal(m.ball.mode,'pass');
 while(receiver.animation.tick<grab)stepMatch(m,neutral(m));
 assert.equal(receiver.animation.tick,grab);assert.equal(receiver.hasBall,true);assert.equal(m.ball.ownerId,receiver.id);assert.equal(m.ball.mode,'carried');
 assert.ok(Math.abs(m.ball.x-receiver.x-receiver.facing*sampleBallForward(clip,grab,receiver.id))<1e-9);
 assert.ok(Math.abs(m.ball.z-receiver.z-sampleBallHeight(clip,grab,receiver.id))<1e-9);
 while(receiver.animation.tick<release-1)stepMatch(m,neutral(m));
 assert.ok(sampleBallForward(clip,receiver.animation.tick,receiver.id)>0,'the reverse carry follows Reed’s hand around his turning body');
 assert.equal(m.ball.mode,'carried');assert.equal(m.ball.ownerId,receiver.id);
 assert.ok(Math.abs(m.ball.x-receiver.x-receiver.facing*sampleBallForward(clip,receiver.animation.tick,receiver.id))<1e-9);
 stepMatch(m,neutral(m));assert.equal(receiver.animation.tick,release);assert.equal(receiver.hasBall,false);assert.equal(m.ball.mode,'dunk');assert.equal(m.ball.ownerId,null);
 while(receiver.animation.clip===clip&&receiver.animation.tick<anchorTick(clip,'finish'))stepMatch(m,neutral(m));
 assert.equal(m.score[0],2);assert.equal(passer.assists,1);assert.equal(receiver.dunks,1);
});

test('Juniper power dunk keeps the separate ball on her compact hand path until the tick-21 release in both facings',()=>{
 const id='juniper-vale',clip='dunk-power';
 const measured=[[0,.95,4],[2,1.25,8],[4,1.8,10],[7,1.9,0],[9,2,9]];
 const frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,f)=>n+f.duration,0);
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:74,home:{roster:[{id},{id:'juniper-partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'power'}):i));
  assert.equal(p.animation.clip,clip);
  for(const [frame,height,forward] of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.ok(Math.abs(sampleBallHeight(clip,p.animation.tick,id)-height)<.001,`frame${frame} Juniper hand height`);
   assert.ok(Math.abs(sampleBallForward(clip,p.animation.tick,id)-forward)<.001,`frame${frame} Juniper hand reach`);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06,`frame${frame} ball lane facing ${facing}`);
   assert.ok(Math.abs(m.ball.z-p.z-height)<.02,`frame${frame} ball height facing ${facing}`);
  }
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish');
  assert.equal(release,21);assert.equal(finish,23);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);assert.equal(p.fga,0);
  stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);assert.equal(p.fga,1);
  while(p.animation.tick<finish)stepMatch(m,neutral(m));
  assert.equal(p.dunks,1);assert.deepEqual(m.score,[2,0]);
 }
});

test('Juniper windmill dunk keeps the separate ball on her low circular hand path until release in both facings',()=>{
 const id='juniper-vale',clip='dunk-windmill';
 const measured=[[0,.9,4],[3,.8,5],[5,1.3,4],[7,.8,5],[9,1.7,-2]];
 const frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,f)=>n+f.duration,0);
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:75,home:{roster:[{id},{id:'juniper-partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'windmill'}):i));
  assert.equal(p.animation.clip,clip);
  for(const [frame,height,forward] of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.ok(Math.abs(sampleBallHeight(clip,p.animation.tick,id)-height)<.001,`frame${frame} Juniper windmill hand height`);
   assert.ok(Math.abs(sampleBallForward(clip,p.animation.tick,id)-forward)<.001,`frame${frame} Juniper windmill hand reach`);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06,`frame${frame} ball lane facing ${facing}`);
   assert.ok(Math.abs(m.ball.z-p.z-height)<.02,`frame${frame} ball height facing ${facing}`);
  }
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish');
  assert.equal(release,21);assert.equal(finish,23);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);assert.equal(p.fga,0);
  stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);assert.equal(p.fga,1);
  while(p.animation.tick<finish)stepMatch(m,neutral(m));
  assert.equal(p.dunks,1);assert.deepEqual(m.score,[2,0]);
 }
});

test('Juniper reverse dunk keeps the separate ball on her hand through the behind-the-crown release in both facings',()=>{
 const id='juniper-vale',clip='dunk-reverse';
 const measured=[[0,.9,4],[3,1.6,-2],[7,2.1,5],[8,2,-5],[9,1.9,-5]];
 const frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,f)=>n+f.duration,0);
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:76,home:{roster:[{id},{id:'juniper-partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'reverse'}):i));
  assert.equal(p.animation.clip,clip);
  for(const [frame,height,forward] of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.ok(Math.abs(sampleBallHeight(clip,p.animation.tick,id)-height)<.001,`frame${frame} Juniper reverse hand height`);
   assert.ok(Math.abs(sampleBallForward(clip,p.animation.tick,id)-forward)<.001,`frame${frame} Juniper reverse hand reach`);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06,`frame${frame} reverse lane facing ${facing}`);
   assert.ok(Math.abs(m.ball.z-p.z-height)<.02,`frame${frame} reverse height facing ${facing}`);
  }
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish');
  assert.equal(release,21);assert.equal(finish,23);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.ok(Math.abs(m.ball.x-p.x-facing*sampleBallForward(clip,p.animation.tick,id))<.06);
  assert.ok(Math.abs(m.ball.z-p.z-sampleBallHeight(clip,p.animation.tick,id))<.02);
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);assert.equal(p.fga,0);
  assert.equal(sampleBallForward(clip,release,id),10,'the reverse-release hand crosses behind Juniper’s turned body');
  assert.equal(sampleBallHeight(clip,release,id),1.1,'the reverse-release hand stays close to her shoulder height');
  stepMatch(m,neutral(m));assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);assert.equal(p.fga,1);
  while(p.animation.tick<finish)stepMatch(m,neutral(m));
  assert.equal(p.dunks,1);assert.deepEqual(m.score,[2,0]);
 }
});

test('Juniper 360 dunk tracks the separate ball through her complete spin and releases on the tick-21 marker',()=>{
 const clip='dunk-360',id='juniper-vale',frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.85,4],[3,1.25,0],[5,1.35,-1],[7,1.15,10],[8,2,8],[9,.85,6]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:77,home:{roster:[{id},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'360'}):i));
  assert.equal(p.animation.clip,clip);
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.ok(Math.abs(sampleBallHeight(clip,p.animation.tick,id)-height)<.001,`Juniper hand height frame ${frame}`);
   assert.ok(Math.abs(sampleBallForward(clip,p.animation.tick,id)-forward)<.001,`Juniper hand reach frame ${frame}`);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06,`separate ball follows Juniper through rotation facing ${facing}`);
   assert.ok(Math.abs(m.ball.z-p.z-height)<.02,`separate ball follows Juniper's hand height facing ${facing}`);
  }
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish'),land=anchorTick(clip,'land');
  assert.equal(anchorTick(clip,'takeoff'),4);assert.equal(anchorTick(clip,'grab'),10);assert.equal(anchorTick(clip,'peak'),14);
  assert.equal(release,21);assert.equal(finish,23);assert.equal(land,30);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(sampleBallHeight(clip,p.animation.tick,id),.85,'the last carried pose keeps the ball at her wrist height');
  assert.equal(sampleBallForward(clip,p.animation.tick,id),7,'the last carried pose reaches her right hand');
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);assert.equal(p.fga,0);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);assert.equal(p.fga,1);
  while(p.animation.tick<finish)stepMatch(m,neutral(m));assert.equal(p.dunks,1);assert.deepEqual(m.score,[2,0]);
  while(p.animation.tick<land)stepMatch(m,neutral(m));assert.equal(sampleAnimation(clip,p.animation.tick).frame,14);
 }
});

test('Juniper tomahawk dunk carries her separate ball behind the crown and chops down for one release',()=>{
 const clip='dunk-tomahawk',id='juniper-vale',frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.9,4],[3,1,0],[5,1,-1],[7,1.3,0],[8,1,-2],[9,1.4,7]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:78,home:{roster:[{id},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'tomahawk'}):i));
  assert.equal(p.animation.clip,clip);
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.ok(Math.abs(sampleBallHeight(clip,p.animation.tick,id)-height)<.001,`Juniper tomahawk hand height frame ${frame}`);
   assert.ok(Math.abs(sampleBallForward(clip,p.animation.tick,id)-forward)<.001,`Juniper tomahawk reach frame ${frame}`);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06,`separate ball follows Juniper's cocked hand facing ${facing}`);
   assert.ok(Math.abs(m.ball.z-p.z-height)<.02,`separate ball follows Juniper's hand height facing ${facing}`);
  }
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish'),land=anchorTick(clip,'land');
  assert.equal(anchorTick(clip,'takeoff'),4);assert.equal(anchorTick(clip,'grab'),10);assert.equal(anchorTick(clip,'peak'),14);
  assert.equal(release,21);assert.equal(finish,23);assert.equal(land,30);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(sampleBallHeight(clip,p.animation.tick,id),1.4,'the final carried pose reaches Juniper’s raised wrist');
  assert.equal(sampleBallForward(clip,p.animation.tick,id),7.5,'the final carried pose stays on her tomahawk hand');
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);assert.equal(p.fga,0);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);assert.equal(p.fga,1);
  while(p.animation.tick<finish)stepMatch(m,neutral(m));assert.equal(p.dunks,1);assert.deepEqual(m.score,[2,0]);
  while(p.animation.tick<land)stepMatch(m,neutral(m));assert.equal(sampleAnimation(clip,p.animation.tick).frame,14);
 }
});

test('Juniper double dunk tracks two separate ball pumps and releases exactly once',()=>{
 const clip='dunk-double',id='juniper-vale',frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.95,4],[3,2.5,7],[4,1.9,2],[5,1.2,0],[6,.95,-1],[7,.95,0],[8,1.8,3],[9,2.5,7]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:79,home:{roster:[{id},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'double'}):i));
  assert.equal(p.animation.clip,clip);
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.ok(Math.abs(sampleBallHeight(clip,p.animation.tick,id)-height)<.001,`Juniper double hand height frame ${frame}`);
   assert.ok(Math.abs(sampleBallForward(clip,p.animation.tick,id)-forward)<.001,`Juniper double reach frame ${frame}`);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06,`separate ball follows both hands facing ${facing} frame ${frame}`);
   assert.ok(Math.abs(m.ball.z-p.z-height)<.02,`separate ball stays on hand height facing ${facing} frame ${frame}`);
  }
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish'),land=anchorTick(clip,'land');
  assert.equal(anchorTick(clip,'takeoff'),4);assert.equal(anchorTick(clip,'grab'),10);assert.equal(anchorTick(clip,'peak'),14);
  assert.equal(release,21);assert.equal(finish,23);assert.equal(land,30);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);assert.equal(p.fga,0);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);assert.equal(p.fga,1);
  while(p.animation.tick<finish)stepMatch(m,neutral(m));assert.equal(p.dunks,1);assert.deepEqual(m.score,[2,0]);
  while(p.animation.tick<land)stepMatch(m,neutral(m));assert.equal(sampleAnimation(clip,p.animation.tick).frame,14);
 }
});

test('Juniper clutch dunk follows the under-body carry to one diagonal release',()=>{
 const clip='dunk-clutch',id='juniper-vale',frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.9,4],[3,1,1],[4,.75,0],[5,.75,-1],[6,.45,-2],[7,.95,-1],[8,1.5,2],[9,2.15,6]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:80,home:{roster:[{id},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'clutch'}):i));
  assert.equal(p.animation.clip,clip);
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.ok(Math.abs(sampleBallHeight(clip,p.animation.tick,id)-height)<.001,`Juniper clutch hand height frame ${frame}`);
   assert.ok(Math.abs(sampleBallForward(clip,p.animation.tick,id)-forward)<.001,`Juniper clutch reach frame ${frame}`);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06,`separate ball follows Juniper's under-body carry facing ${facing}`);
   assert.ok(Math.abs(m.ball.z-p.z-height)<.02,`separate ball stays at Juniper's hand height facing ${facing}`);
  }
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish'),land=anchorTick(clip,'land');
  assert.equal(anchorTick(clip,'takeoff'),4);assert.equal(anchorTick(clip,'grab'),10);assert.equal(anchorTick(clip,'peak'),14);
  assert.equal(release,21);assert.equal(finish,23);assert.equal(land,30);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);assert.equal(p.fga,0);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);assert.equal(p.fga,1);
  while(p.animation.tick<finish)stepMatch(m,neutral(m));assert.equal(p.dunks,1);assert.deepEqual(m.score,[2,0]);
  while(p.animation.tick<land)stepMatch(m,neutral(m));assert.equal(sampleAnimation(clip,p.animation.tick).frame,14);
 }
});

test('Juniper scythe dunk sweeps the separate ball low-to-high and releases once',()=>{
 const clip='dunk-scythe',id='juniper-vale',frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.9,4],[2,1.2,-6],[3,1.3,-2],[4,1.8,2],[5,1.6,5],[6,.3,11],[7,.8,11],[8,.4,10],[9,2.1,10]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:81,home:{roster:[{id},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'scythe'}):i));
  assert.equal(p.animation.clip,clip);
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.ok(Math.abs(sampleBallHeight(clip,p.animation.tick,id)-height)<.001,`Juniper scythe hand height frame ${frame}`);
   assert.ok(Math.abs(sampleBallForward(clip,p.animation.tick,id)-forward)<.001,`Juniper scythe reach frame ${frame}`);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06,`separate ball follows Juniper's scythe sweep facing ${facing}`);
   assert.ok(Math.abs(m.ball.z-p.z-height)<.02,`separate ball stays at Juniper's hand height facing ${facing}`);
  }
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish'),land=anchorTick(clip,'land');
  assert.equal(anchorTick(clip,'takeoff'),4);assert.equal(anchorTick(clip,'grab'),10);assert.equal(anchorTick(clip,'peak'),14);
  assert.equal(release,21);assert.equal(finish,23);assert.equal(land,30);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);assert.equal(p.fga,0);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);assert.equal(p.fga,1);
  while(p.animation.tick<finish)stepMatch(m,neutral(m));assert.equal(p.dunks,1);assert.deepEqual(m.score,[2,0]);
  while(p.animation.tick<land)stepMatch(m,neutral(m));assert.equal(sampleAnimation(clip,p.animation.tick).frame,14);
 }
});

test('Juniper alley-oop power catches the lob overhead and carries her separate ball through one finish',()=>{
 const clip='alley-oop-power',id='juniper-vale',frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.8,4],[2,1.1,1],[4,1.8,2],[5,1.9,1],[6,1.8,2],[7,1.9,3.5],[8,1.6,.5],[9,1.5,1]];
 for(const facing of [1,-1]){
  const m=createMatch({quarterSeconds:60,seed:82,home:{roster:[{id},{id:'partner'}]}}),p=m.players[0];
  p.x=182;p.y=50;p.vx=.2;p.dunk=99;p.facing=facing;
  stepMatch(m,neutral(m).map(i=>i.playerId===p.id?createInput(p.id,{shootPressed:true,turbo:true,x:facing,dunkVariant:'alley-oop-power'}):i));
  assert.equal(p.animation.clip,clip);
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.ok(Math.abs(sampleBallHeight(clip,p.animation.tick,id)-height)<.001,'Juniper alley-oop hand height frame '+frame);
   assert.ok(Math.abs(sampleBallForward(clip,p.animation.tick,id)-forward)<.001,'Juniper alley-oop hand reach frame '+frame);
   assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06,'separate ball follows Juniper facing '+facing+' at frame '+frame);
   assert.ok(Math.abs(m.ball.z-p.z-height)<.02,'separate ball stays at Juniper hand height at frame '+frame);
  }
  const release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish'),land=anchorTick(clip,'land');
  assert.equal(anchorTick(clip,'takeoff'),4);assert.equal(anchorTick(clip,'grab'),10);assert.equal(anchorTick(clip,'peak'),14);
  assert.equal(release,21);assert.equal(finish,23);assert.equal(land,30);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(p.animation.tick,20);assert.equal(m.ball.mode,'carried');assert.equal(p.hasBall,true);assert.equal(p.fga,0);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);assert.equal(p.fga,1);
  while(p.animation.tick<finish)stepMatch(m,neutral(m));assert.equal(p.dunks,1);assert.deepEqual(m.score,[2,0]);
  while(p.animation.tick<land)stepMatch(m,neutral(m));assert.equal(sampleAnimation(clip,p.animation.tick).frame,14);
 }
});

test('Juniper receives the reverse lob, carries it behind her crown and releases once in either facing',()=>{
 const clip='alley-oop-reverse',frameTick=index=>animationClips[clip].frames.slice(0,index).reduce((n,frame)=>n+frame.duration,0);
 const measured=[[0,.9,6],[2,1.3,8],[4,1.6,2],[5,1.7,0],[6,1,1],[7,1,2],[8,1.35,-6],[9,1.5,-9]];
 for(const facing of [1,-1]){
  const m=setup(),passer=m.players[0],p=m.players[1];p.id='juniper-vale';p.name='Juniper Vale';passer.x=170;p.x=184;p.y=46;p.facing=facing;
  stepMatch(m,[...neutral(m).filter(i=>i.playerId!==passer.id),createInput(passer.id,{passPressed:true,turbo:true,alleyOop:'reverse'})]);
  while(passer.animation.tick<anchorTick(passer.animation.clip,'release'))stepMatch(m,neutral(m));
  assert.equal(p.animation.clip,clip);assert.equal(m.ball.mode,'pass');
  for(const [frame,height,forward]of measured){
   while(p.animation.tick<frameTick(frame))stepMatch(m,neutral(m));
   assert.ok(Math.abs(sampleBallHeight(clip,p.animation.tick,p.id)-height)<.001,'Juniper reverse hand height frame '+frame);
   assert.ok(Math.abs(sampleBallForward(clip,p.animation.tick,p.id)-forward)<.001,'Juniper reverse reach frame '+frame);
   if(p.animation.tick>=anchorTick(clip,'grab')){
    assert.ok(Math.abs(m.ball.x-p.x-facing*forward)<.06,'Juniper carries her separate ball facing '+facing+' frame '+frame);
    assert.ok(Math.abs(m.ball.z-p.z-height)<.02,'Juniper ball tracks her hand height frame '+frame);
   }else assert.equal(m.ball.mode,'pass','the incoming lob remains separate until Juniper catches it');
  }
  const grab=anchorTick(clip,'grab'),release=anchorTick(clip,'release'),finish=anchorTick(clip,'finish'),land=anchorTick(clip,'land');
  assert.equal(grab,10);assert.equal(release,21);assert.equal(finish,23);assert.equal(land,30);
  assert.equal(p.hasBall,true);assert.equal(m.ball.ownerId,p.id);
  while(p.animation.tick<release-1)stepMatch(m,neutral(m));
  assert.equal(p.animation.tick,20);assert.ok(sampleBallForward(clip,20,p.id)<0,'the reverse gather carries behind Juniper’s turning crown');
  assert.equal(m.ball.mode,'carried');assert.equal(m.ball.ownerId,p.id);
  stepMatch(m,neutral(m));assert.equal(p.animation.tick,release);assert.equal(m.ball.mode,'dunk');assert.equal(p.hasBall,false);
  while(p.animation.tick<finish)stepMatch(m,neutral(m));assert.equal(m.score[0],2);assert.equal(p.dunks,1);assert.equal(passer.assists,1);
  while(p.animation.tick<land)stepMatch(m,neutral(m));assert.equal(sampleAnimation(clip,p.animation.tick).frame,14);
 }
});
