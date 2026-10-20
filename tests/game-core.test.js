import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreValue, commitScore, createMatch, stepMatch, createInput } from '../src/core/simulation.js';

test('shot value is locked to its release location in either direction', () => {
  assert.equal(scoreValue({ x: 170, team: 0 }, 0), 2);
  assert.equal(scoreValue({ x: 150, team: 0 }, 0), 3);
  assert.equal(scoreValue({ x: 30, team: 1 }, 1), 2);
  assert.equal(scoreValue({ x: 50, team: 1 }, 1), 3);
});

test('a successful attempt can commit its score only once', () => {
  const match = createMatch({ quarterSeconds: 60, seed: 4 });
  const attempt = { id: 'shot-1', team: 0, playerId: 'condas-manaconda', points: 3 };
  assert.equal(commitScore(match, attempt), true);
  assert.equal(commitScore(match, attempt), false);
  assert.deepEqual(match.score, [3, 0]);
});

test('a scored basket credits the passer once and records field-goal totals', () => {
  const match=createMatch({quarterSeconds:60,seed:8});
  const [scorer,assister]=match.players.filter(p=>p.team===0);
  scorer.fga=1;scorer.threeAttempts=1;match.assistCandidateId=assister.id;
  assert.equal(commitScore(match,{id:'assist-shot',team:0,playerId:scorer.id,points:3}),true);
  assert.equal(assister.assists,1);
  assert.equal(scorer.fgm,1);
  assert.equal(scorer.threeMakes,1);
  assert.equal(match.assistCandidateId,null);
});

test('possession is exclusive and a pass changes ball mode without duplicating ownership', () => {
  const match = createMatch({ quarterSeconds: 60, seed: 5 });
  const holder = match.players.find(p => p.team === 0);
  const target = match.players.find(p => p.team === 0 && p.id !== holder.id);
  target.x += 20;
  assert.equal(match.players.filter(p => p.hasBall).length, 1);
  stepMatch(match, [createInput(holder.id, { passPressed: true })]);
  assert.equal(match.ball.mode, 'pass');
  assert.equal(match.ball.ownerId, null);
  assert.equal(match.players.filter(p => p.hasBall).length, 0);
  assert.ok(match.ball.targetId === target.id);
});

test('a caught pass becomes an assist when its receiver scores', () => {
  const match=createMatch({quarterSeconds:60,seed:5});
  const passer=match.players.find(p=>p.team===0&&p.hasBall),receiver=match.players.find(p=>p.team===0&&!p.hasBall);
  passer.x=80;passer.y=50;receiver.x=100;receiver.y=50;
  for(const defender of match.players.filter(p=>p.team===1)){defender.x=20;defender.y=defender===match.players[2]?0:100;}
  const neutral=[createInput(passer.id),createInput(receiver.id)];
  stepMatch(match,[createInput(passer.id,{passPressed:true}),neutral[1]]);
  for(let tick=0;tick<30&&!receiver.hasBall;tick++)stepMatch(match,neutral);
  assert.equal(receiver.hasBall,true);
  assert.equal(match.assistCandidateId,passer.id);
  receiver.x=170;receiver.y=50;receiver.shoot=99;
  stepMatch(match,[neutral[0],createInput(receiver.id,{shootPressed:true})]);
  const attemptId=match.ball.attemptId;
  for(let tick=0;tick<120&&!match.scoredAttempts?.includes(attemptId);tick++)stepMatch(match,neutral);
  assert.ok(match.scoredAttempts?.includes(attemptId));
  assert.equal(passer.assists,1);
});

test('same seed and input tape produce the same simulation state', () => {
  const one = createMatch({ quarterSeconds: 60, seed: 99 });
  const two = createMatch({ quarterSeconds: 60, seed: 99 });
  const holder = one.players.find(p => p.team === 0);
  for (let i = 0; i < 120; i++) {
    const frame = createInput(holder.id, { x: i < 60 ? 1 : 0, y: i < 60 ? -1 : 0, shootPressed: i === 40 });
    stepMatch(one, [frame]); stepMatch(two, [frame]);
  }
  assert.deepEqual(one, two);
});

test('three consecutive baskets by one athlete trigger fire and a teammate basket resets that run', () => {
  const match=createMatch({quarterSeconds:60,seed:22});
  const [a,b]=match.players.filter(p=>p.team===0);
  commitScore(match,{id:'a1',team:0,playerId:a.id,points:2});
  commitScore(match,{id:'a2',team:0,playerId:a.id,points:2});
  commitScore(match,{id:'b1',team:0,playerId:b.id,points:2});
  commitScore(match,{id:'a3',team:0,playerId:a.id,points:2});
  assert.equal(a.onFire,false);
  commitScore(match,{id:'a4',team:0,playerId:a.id,points:2});
  commitScore(match,{id:'a5',team:0,playerId:a.id,points:2});
  assert.equal(a.onFire,true);
});

test('a shot is a released ball with a locked value and no attached owner', () => {
  const match=createMatch({quarterSeconds:60,seed:7});
  const shooter=match.players.find(p=>p.hasBall);
  shooter.x=170;shooter.y=50;
  stepMatch(match,[createInput(shooter.id,{shootPressed:true})]);
  assert.ok(['shot','loose','carried'].includes(match.ball.mode));
  assert.equal(match.ball.ownerId,null);
  assert.equal(match.players.some(p=>p.hasBall),false);
  assert.equal(match.ball.value,2);
  assert.ok(match.ball.attemptId);
});

test('a made shot travels to the descending hoop plane before committing one score', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  const shooter=match.players.find(p=>p.hasBall);shooter.x=170;shooter.y=50;shooter.shoot=99;
  for(const defender of match.players.filter(p=>p.team!==shooter.team)) { defender.x=20;defender.y=defender===match.players[2]?0:100; }
  stepMatch(match,[createInput(shooter.id,{shootPressed:true})]);
  assert.equal(match.ball.made,true);
  assert.deepEqual(match.score,[0,0]);
  for(let tick=0;tick<120;tick++)stepMatch(match,[]);
  assert.deepEqual(match.score,[2,0]);
  assert.equal(match.scoredAttempts.length,1);
});

test('a miss that clips the rim deflects into a rebound instead of ghosting through', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  match.possession=0;
  for(const p of match.players)p.hasBall=false;
  match.ball.mode='shot';match.ball.ownerId=null;match.ball.lastTouch=match.players[0].id;match.ball.attemptId='rim-miss';match.ball.made=false;match.ball.value=2;match.ball.x=9;match.ball.y=50;match.ball.z=2.8;match.ball.vx=-.2;match.ball.vy=0;match.ball.vz=-.15;match.ball.targetX=8;match.ball.targetY=50;match.ball.targetZ=2.6;
  stepMatch(match,[]);
  assert.equal(match.ball.rim,true);
  assert.ok(match.ball.vx>0,'the rim should reverse the ball toward the court');
  assert.match(match.lastEvent,/rim/i);
  assert.deepEqual(match.score,[0,0]);
});

test('a clean bank off the backboard can fall through for the locked basket value', () => {
  for(const [team,targetX,x,vx] of [[0,192,195.5,.3],[1,8,4.5,-.3]]){
    const match=createMatch({quarterSeconds:60,seed:1});
    match.possession=team;
    for(const p of match.players)p.hasBall=false;
    const shooter=match.players.find(p=>p.team===team);
    match.ball.mode='shot';match.ball.ownerId=null;match.ball.lastTouch=shooter.id;match.ball.attemptId='bank-shot';match.ball.made=true;match.ball.value=2;match.ball.x=x;match.ball.y=50;match.ball.z=4.5;match.ball.vx=vx;match.ball.vy=0;match.ball.vz=0;match.ball.targetX=targetX;match.ball.targetY=50;match.ball.targetZ=2.6;
    stepMatch(match,[]);
    assert.equal(match.ball.backboard,true);
    assert.equal(Math.sign(match.ball.vx),-Math.sign(vx));
    assert.deepEqual(match.score,[0,0]);
    for(let tick=0;tick<40&&match.score[team]===0;tick++)stepMatch(match,[]);
    assert.equal(match.score[team],2);
    assert.deepEqual(match.scoredAttempts,['bank-shot']);
  }
});

test('a close turbo drive triggers a dunk and sends the ball through the hoop', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  const dunker=match.players.find(p=>p.hasBall);
  dunker.x=186;dunker.y=50;dunker.vx=.2;dunker.dunk=99;
  stepMatch(match,[createInput(dunker.id,{x:1,turbo:true,shootPressed:true})]);
  assert.equal(match.ball.mode,'dunk');
  assert.deepEqual(match.score,[0,0]);
  for(let tick=0;tick<40;tick++)stepMatch(match,[]);
  assert.deepEqual(match.score,[2,0]);
  assert.equal(dunker.points,2);
  assert.equal(match.scoredAttempts.length,1);
});

test('dunk release reaches the rim from the full close-range trigger window', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  const dunker=match.players.find(p=>p.hasBall);
  dunker.x=175;dunker.y=50;dunker.vx=.2;dunker.dunk=99;
  stepMatch(match,[createInput(dunker.id,{x:1,turbo:true,shootPressed:true})]);
  assert.equal(match.ball.mode,'dunk');
  const attemptId=match.ball.attemptId;
  for(let tick=0;tick<80&&!match.scoredAttempts?.includes(attemptId);tick++)stepMatch(match,[]);
  assert.ok(match.scoredAttempts?.includes(attemptId),'the original dunk release should score');
  assert.deepEqual(match.score,[2,0]);
});

test('ball out of bounds awards a quick inbound to the opponent of the last touch', () => {
  const match=createMatch({quarterSeconds:60,seed:4});
  const lastTouch=match.players.find(p=>p.team===0);
  match.ball.mode='loose';match.ball.ownerId=null;match.ball.x=206;match.ball.y=50;match.ball.z=0;match.ball.vx=0;match.ball.vy=0;match.ball.vz=0;match.ball.lastTouch=lastTouch.id;
  stepMatch(match,[]);
  assert.equal(match.scorePause>0,true);
  assert.equal(match.ball.mode,'dead');
  assert.equal(match.possession,0);
  for(let tick=0;tick<31;tick++)stepMatch(match,[]);
  assert.equal(match.players.find(p=>p.hasBall).team,1);
});

test('a timed defender jump can block shot flight into a loose rebound', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  match.possession=1;
  const defender=match.players.find(p=>p.team===0),shooter=match.players.find(p=>p.team===1);
  defender.block=100;defender.x=52;defender.y=50;shooter.x=160;shooter.y=50;
  match.ball.mode='shot';match.ball.ownerId=null;match.ball.lastTouch=shooter.id;match.ball.attemptId='blockable-shot';match.ball.made=true;match.ball.value=2;match.ball.x=53;match.ball.y=50;match.ball.z=5;match.ball.vx=.2;match.ball.vy=0;match.ball.vz=.2;match.ball.targetX=8;match.ball.targetY=50;match.ball.targetZ=2.6;
  stepMatch(match,[createInput(defender.id,{blockPressed:true})]);
  assert.equal(match.ball.mode,'loose');
  assert.equal(match.ball.attemptId,null);
  assert.equal(defender.blocks,1);
  assert.match(match.lastEvent,/blocks/i);
});

test('a defender can block a dunk release before it reaches the hoop', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  match.possession=0;
  const defender=match.players.find(p=>p.team===1),dunker=match.players.find(p=>p.team===0);
  defender.block=100;defender.x=53;defender.y=50;dunker.x=160;dunker.y=50;
  for(const p of match.players)p.hasBall=false;
  match.ball.mode='dunk';match.ball.ownerId=null;match.ball.lastTouch=dunker.id;match.ball.attemptId='blockable-dunk';match.ball.made=true;match.ball.value=2;match.ball.x=53;match.ball.y=50;match.ball.z=3;match.ball.vx=.2;match.ball.vy=0;match.ball.vz=.1;match.ball.targetX=192;match.ball.targetY=50;match.ball.targetZ=2.3;
  stepMatch(match,[createInput(defender.id,{blockPressed:true})]);
  assert.equal(match.ball.mode,'loose');
  assert.equal(match.ball.attemptId,null);
  assert.equal(defender.blocks,1);
  assert.match(match.lastEvent,/blocks/i);
});

test('a defender contacting a descending shot above the rim is called for goaltending', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  match.possession=1;
  const defender=match.players.find(p=>p.team===0),shooter=match.players.find(p=>p.team===1);
  defender.block=100;defender.x=10;defender.y=50;shooter.x=160;shooter.y=50;
  match.ball.mode='shot';match.ball.ownerId=null;match.ball.lastTouch=shooter.id;match.ball.attemptId='goalie-shot';match.ball.made=true;match.ball.value=3;match.ball.x=10;match.ball.y=50;match.ball.z=3.5;match.ball.vx=-.1;match.ball.vy=0;match.ball.vz=-.2;match.ball.targetX=8;match.ball.targetY=50;match.ball.targetZ=2.6;match.ball.rim=false;
  stepMatch(match,[createInput(defender.id,{blockPressed:true})]);
  assert.deepEqual(match.score,[0,3]);
  assert.equal(shooter.points,3);
  assert.equal(defender.blocks,0);
  assert.match(match.lastEvent,/goaltend/i);
  assert.equal(match.ball.mode,'dead');
});

test('a defender cannot goaltend after the shot has touched the rim', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  match.possession=1;
  const defender=match.players.find(p=>p.team===0),shooter=match.players.find(p=>p.team===1);
  defender.block=100;defender.x=10;defender.y=50;shooter.x=160;shooter.y=50;
  match.ball.mode='shot';match.ball.ownerId=null;match.ball.lastTouch=shooter.id;match.ball.attemptId='rim-shot';match.ball.made=true;match.ball.value=2;match.ball.x=10;match.ball.y=50;match.ball.z=3.5;match.ball.vx=-.1;match.ball.vy=0;match.ball.vz=-.2;match.ball.targetX=8;match.ball.targetY=50;match.ball.targetZ=2.6;match.ball.rim=true;
  stepMatch(match,[createInput(defender.id,{blockPressed:true})]);
  assert.deepEqual(match.score,[0,0]);
  assert.equal(match.ball.mode,'loose');
  assert.equal(defender.blocks,1);
});

test('regulation transitions into overtime on a tie and only finishes after a decided overtime', () => {
  const match = createMatch({ quarterSeconds: 1, seed: 3 });
  match.score = [4, 4]; match.period = 4; match.clock = 1 / 60;
  stepMatch(match, []);
  assert.equal(match.phase, 'break');
  assert.equal(match.period, 5);
  match.overtimeSeconds=1;
  for (let i=0;i<101;i++) stepMatch(match, []);
  assert.equal(match.phase, 'overtime');
  match.score = [6, 4]; match.clock = 1 / 60;
  stepMatch(match, []);
  assert.equal(match.phase, 'final');
});
