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
function stealSetup(){const m=setup(),holder=m.players[0],defender=m.players[2];holder.x=defender.x=100;holder.y=defender.y=50;defender.steal=99;return {m,holder,defender};}
function startSteal(m,defender){stepMatch(m,neutral(m).map(i=>i.playerId===defender.id?createInput(i.playerId,{stealPressed:true}):i));}
test('steal contact waits until grab',()=>{
  const {m,holder,defender}=stealSetup();startSteal(m,defender);assert.equal(holder.stun,0);assert.equal(defender.steals,0);assert.equal(m.ball.mode,'carried');
  while(defender.animation.tick<anchorTick('steal','grab')-1){stepMatch(m,neutral(m));assert.equal(holder.stun,0);assert.equal(defender.steals,0);}
  stepMatch(m,neutral(m));assert.equal(defender.steals,1);assert.ok(holder.stun>0);assert.equal(m.ball.mode,'loose');
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
