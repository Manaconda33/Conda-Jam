import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreValue, commitScore, createMatch, stepMatch, createInput, substitutePlayer, resetPracticeBall, court } from '../src/core/simulation.js';
import { teams } from '../src/content/teams.js';
import { anchorTick, animationDuration } from '../src/core/animation.js';
const neutralInputs=match=>match.players.map(p=>createInput(p.id));
function advanceToAnchor(match,player,anchor){const tick=anchorTick(player.animation.clip,anchor);assert.notEqual(tick,null);while(player.animation.tick<tick)stepMatch(match,neutralInputs(match));}
function prepareBlock(match,defender){stepMatch(match,[...neutralInputs(match).filter(i=>i.playerId!==defender.id),createInput(defender.id,{blockPressed:true})]);while(defender.animation.tick<anchorTick('block','apex')-1)stepMatch(match,neutralInputs(match));}


test('shot value is locked to its release location in either direction', () => {
  assert.equal(scoreValue({ x: 170, team: 0 }, 0), 2);
  assert.equal(scoreValue({ x: 130, team: 0 }, 0), 3);
  assert.equal(scoreValue({ x: 30, team: 1 }, 1), 2);
  assert.equal(scoreValue({ x: 70, team: 1 }, 1), 3);
  assert.equal(scoreValue({ x: 140, y: 20 }, 0), 3);
  assert.equal(scoreValue({ x: 60, y: 80 }, 1), 3);
});

test('practice mode keeps both clocks running free and restores controlled possession on reset',()=>{
  const match=createMatch({quarterSeconds:60,home:teams[0],away:teams[1],seed:4});match.practice=true;match.clock=9999;
  const player=match.players[0];match.ball.mode='loose';match.ball.ownerId=null;for(const athlete of match.players)athlete.hasBall=false;
  for(let i=0;i<1800;i++)stepMatch(match,[]);
  assert.equal(match.clock,9999);
  assert.equal(match.shotClock,24);
  assert.equal(match.phase,'playing');
  const scoreBeforeReset=[...match.score];
  assert.equal(resetPracticeBall(match,player.id),true);
  assert.equal(match.ball.mode,'carried');assert.equal(match.ball.ownerId,player.id);assert.equal(player.hasBall,true);
  assert.deepEqual(match.score,scoreBeforeReset);
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
  assert.equal(scorer.anim,'celebrate');
  assert.equal(scorer.poseFrames,animationDuration('celebrate'));
  assert.equal(match.assistCandidateId,null);
});

test('possession is exclusive and a pass changes ball mode without duplicating ownership', () => {
  const match = createMatch({ quarterSeconds: 60, seed: 5 });
  const holder = match.players.find(p => p.team === 0);
  const target = match.players.find(p => p.team === 0 && p.id !== holder.id);
  target.x += 20;
  assert.equal(match.players.filter(p => p.hasBall).length, 1);
  stepMatch(match, [createInput(holder.id, { passPressed: true })]);
  assert.equal(match.ball.mode,'carried','anticipation keeps ownership');
  advanceToAnchor(match,holder,'release');
  assert.equal(match.ball.mode, 'pass');
  assert.equal(match.ball.ownerId, null);
  assert.equal(match.players.filter(p => p.hasBall).length, 0);
  assert.equal(holder.anim,'pass');
  assert.equal(holder.poseFrames,animationDuration('pass')-anchorTick('pass','release'));
  assert.ok(match.ball.targetId === target.id);
  for(let tick=0;tick<12;tick++)stepMatch(match,[createInput(holder.id)]);
  assert.equal(holder.anim,'idle');
  assert.equal(holder.poseFrames,0);
});

test('an opponent intercepting a pass records a steal and a turnover',()=>{
  const match=createMatch({quarterSeconds:60,seed:18});
  const passer=match.players.find(p=>p.team===0&&p.hasBall),target=match.players.find(p=>p.team===0&&!p.hasBall),defender=match.players.find(p=>p.team===1),other=match.players.find(p=>p.team===1&&p!==defender);
  passer.x=80;passer.y=50;target.x=140;target.y=50;defender.x=100;defender.y=50;other.x=150;other.y=5;
  const neutral=()=>match.players.map(p=>createInput(p.id));
  stepMatch(match,[createInput(passer.id,{passPressed:true}),...neutral().filter(f=>f.playerId!==passer.id)]);
  advanceToAnchor(match,passer,'release');
  defender.x=match.ball.x+1;defender.y=match.ball.y;
  stepMatch(match,neutral());
  assert.equal(defender.hasBall,false,'interception waits for the grab');
  advanceToAnchor(match,defender,'grab');
  assert.equal(defender.hasBall,true);
  assert.equal(defender.steals,1);
  assert.equal(passer.turnovers,1);
  assert.equal(match.ball.mode,'carried');
});

test('match setup honors the selected second starter for both franchises', () => {
  const home=teams[0],away=teams[1];
  const match=createMatch({quarterSeconds:60,seed:14,home,away,homePartnerId:home.roster[2].id,awayPartnerId:away.roster[2].id});
  assert.deepEqual(match.players.filter(p=>p.team===0).map(p=>p.id),[home.roster[0].id,home.roster[2].id]);
  assert.deepEqual(match.players.filter(p=>p.team===1).map(p=>p.id),[away.roster[0].id,away.roster[2].id]);
});

test('quarter-break substitutions rotate the roster and preserve each athlete box score', () => {
  const home=teams[0],match=createMatch({quarterSeconds:60,seed:15,home});
  const partner=match.players.find(p=>p.team===0&&!p.hasBall),bench=home.roster[2];
  partner.points=4;partner.fgm=2;
  assert.equal(substitutePlayer(match,0),false,'substitution is unavailable during live play');
  match.phase='break';match.ball.mode='dead';for(const p of match.players)p.hasBall=false;
  assert.equal(substitutePlayer(match,0),true);
  assert.equal(match.players.some(p=>p.id===bench.id),true);
  assert.equal(match.playerBox.find(p=>p.id===partner.id).points,4);
  const activeBench=match.players.find(p=>p.id===bench.id);activeBench.points=3;activeBench.fgm=1;
  assert.equal(substitutePlayer(match,0),true);
  assert.equal(match.players.find(p=>p.id===partner.id).points,4,'returning starter keeps recorded stats');
  assert.equal(match.playerBox.find(p=>p.id===bench.id).points,3,'bench stats are stored while out');
  assert.equal(match.players.filter(p=>p.team===0).length,2);
  assert.equal(match.players.filter(p=>p.hasBall).length,0,'a dead break ball remains unowned');
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
  assert.equal(receiver.anim,'receive');
  assert.ok(receiver.poseFrames>0);
  assert.equal(match.assistCandidateId,passer.id);
  receiver.x=170;receiver.y=50;receiver.shoot=99;
  stepMatch(match,[neutral[0],createInput(receiver.id,{shootPressed:true})]);
  if(receiver.animation.action)advanceToAnchor(match,receiver,'release');
  const attemptId=match.ball.attemptId;
  for(let tick=0;tick<120&&!match.scoredAttempts?.includes(attemptId);tick++)stepMatch(match,neutral);
  assert.ok(match.scoredAttempts?.includes(attemptId));
  assert.equal(passer.assists,1);
});

test('steal attempts and recovered loose balls use short reach and rebound poses',()=>{
  const match=createMatch({quarterSeconds:60,seed:17});
  const defender=match.players.find(player=>player.team===1),holder=match.players.find(player=>player.hasBall);
  defender.x=holder.x-2;defender.y=holder.y;defender.steal=100;
  stepMatch(match,[createInput(defender.id,{stealPressed:true})]);
  assert.equal(defender.anim,'steal');assert.ok(defender.poseFrames>0);
  const reboundMatch=createMatch({quarterSeconds:60,seed:17});
  const rebounder=reboundMatch.players.find(player=>player.team===1);reboundMatch.ball.mode='loose';reboundMatch.ball.ownerId=null;for(const p of reboundMatch.players)p.hasBall=false;reboundMatch.ball.x=rebounder.x;reboundMatch.ball.y=rebounder.y;reboundMatch.ball.z=1;reboundMatch.ball.vx=0;reboundMatch.ball.vy=0;reboundMatch.ball.vz=0;
  stepMatch(reboundMatch,neutralInputs(reboundMatch));
  advanceToAnchor(reboundMatch,rebounder,'grab');
  assert.equal(rebounder.hasBall,true);assert.equal(rebounder.anim,'rebound');assert.ok(rebounder.poseFrames>0);
});

test('a slow ground-level loose ball uses the pickup pose',()=>{
  const match=createMatch({quarterSeconds:60,seed:19}),player=match.players.find(p=>p.team===0&&!p.hasBall);
  match.ball.mode='loose';match.ball.ownerId=null;for(const athlete of match.players)athlete.hasBall=false;
  match.ball.x=player.x;match.ball.y=player.y;match.ball.z=.6;match.ball.vx=0;match.ball.vy=0;match.ball.vz=0;
  stepMatch(match,[]);
  assert.equal(player.hasBall,false);
  advanceToAnchor(match,player,'grab');
  assert.equal(player.hasBall,true);
  assert.equal(player.anim,'pickup');
  assert.ok(player.poseFrames>0);
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

test('moving athletes enter the run pose and return to idle when they stop', () => {
  const match=createMatch({quarterSeconds:60,seed:23});
  const player=match.players.find(p=>p.team===0&&!p.hasBall);
  stepMatch(match,[createInput(player.id,{x:1})]);
  assert.equal(player.anim,'run');
  for(let tick=0;tick<60;tick++)stepMatch(match,[createInput(player.id)]);
  assert.equal(player.anim,'idle');
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
  assert.equal(a.fireGoals,0,'the four-basket fire timer starts at ignition');
});

test('fire duration advances only on made field goals, not on shot attempts',()=>{
  const match=createMatch({quarterSeconds:60,seed:24});
  const shooter=match.players.find(p=>p.hasBall);shooter.x=100;
  for(let make=0;make<3;make++)commitScore(match,{id:`ignite-${make}`,team:0,playerId:shooter.id,points:2});
  assert.equal(shooter.onFire,true);
  assert.equal(shooter.fireGoals,0);
  stepMatch(match,[createInput(shooter.id,{shootPressed:true})]);
  assert.equal(shooter.fireGoals,0);
  assert.equal(shooter.onFire,true);
  assert.equal(shooter.highestStreak,3);
  for(let make=0;make<3;make++)commitScore(match,{id:`fire-${make}`,team:0,playerId:shooter.id,points:2});
  assert.equal(shooter.fireGoals,3);
  assert.equal(shooter.onFire,true);
  commitScore(match,{id:'fire-fourth',team:0,playerId:shooter.id,points:2});
  assert.equal(shooter.onFire,false);
  assert.equal(shooter.fireGoals,0);
  assert.equal(shooter.madeRun,0,'a cooled player needs a new three-basket run to ignite again');
  for(let make=0;make<2;make++)commitScore(match,{id:`restart-${make}`,team:0,playerId:shooter.id,points:2});
  assert.equal(shooter.onFire,false);
  commitScore(match,{id:'restart-third',team:0,playerId:shooter.id,points:2});
  assert.equal(shooter.onFire,true);
  assert.equal(shooter.highestStreak,7);
});

test('box score tracks dunks and unique best made-basket streak',()=>{
  const match=createMatch({quarterSeconds:60,seed:56}),scorer=match.players[0];
  commitScore(match,{id:'dunk-test-1',team:0,playerId:scorer.id,points:2});
  commitScore(match,{id:'dunk-test-2',team:0,playerId:scorer.id,points:2});
  commitScore(match,{id:'dunk-test-3',team:0,playerId:scorer.id,points:3});
  assert.equal(scorer.dunks,3);assert.equal(scorer.highestStreak,3);
});

test('a shot is a released ball with a locked value and no attached owner', () => {
  const match=createMatch({quarterSeconds:60,seed:7});
  const shooter=match.players.find(p=>p.hasBall);
  shooter.x=170;shooter.y=50;
  stepMatch(match,[createInput(shooter.id,{shootPressed:true})]);
  assert.equal(match.ball.mode,'carried');
  advanceToAnchor(match,shooter,'release');
  assert.ok(['shot','loose','carried'].includes(match.ball.mode));
  assert.equal(match.ball.ownerId,null);
  assert.equal(match.players.some(p=>p.hasBall),false);
  assert.equal(match.ball.value,2);
  assert.ok(match.ball.attemptId);
});

test('a held shoot input charges in place and releases one shot when the button comes up', () => {
  const match=createMatch({quarterSeconds:60,seed:17});
  const shooter=match.players.find(p=>p.hasBall);shooter.x=170;shooter.y=50;
  const neutral=()=>match.players.filter(p=>p.id!==shooter.id).map(p=>createInput(p.id));
  stepMatch(match,[createInput(shooter.id,{shootPressed:true,shootHeld:true})]);
  assert.equal(match.ball.mode,'carried');
  assert.equal(shooter.charge,1);
  for(let tick=0;tick<12;tick++)stepMatch(match,[createInput(shooter.id,{shootHeld:true})]);
  assert.equal(match.ball.mode,'carried','the ball stays held until release');
  assert.equal(shooter.charge,13);
  stepMatch(match,[createInput(shooter.id),...neutral()]);
  assert.equal(match.ball.mode,'carried');
  advanceToAnchor(match,shooter,'release');
  assert.equal(match.ball.mode,'shot');
  assert.equal(shooter.charge,0);
  assert.equal(shooter.fga,1,'a charge release attempts exactly one field goal');
});

test('a made shot travels to the descending hoop plane before committing one score', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  const shooter=match.players.find(p=>p.hasBall);shooter.x=170;shooter.y=50;shooter.shoot=99;
  for(const defender of match.players.filter(p=>p.team!==shooter.team)) { defender.x=20;defender.y=defender===match.players[2]?0:100; }
  stepMatch(match,[createInput(shooter.id,{shootPressed:true})]);
  advanceToAnchor(match,shooter,'release');
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
  assert.equal(match.ball.mode,'carried');
  advanceToAnchor(match,dunker,'release');
  assert.equal(match.ball.mode,'dunk');
  assert.deepEqual(match.score,[0,0]);
  for(let tick=0;tick<40;tick++)stepMatch(match,[]);
  assert.deepEqual(match.score,[2,0]);
  assert.equal(dunker.points,2);
  assert.equal(match.scoredAttempts.length,1);
});

test('a dunk requires approach distance to the hoop in both court axes', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  const shooter=match.players.find(p=>p.hasBall);
  shooter.x=186;shooter.y=0;shooter.vx=.2;shooter.dunk=99;
  stepMatch(match,[createInput(shooter.id,{x:1,turbo:true,shootPressed:true})]);
  advanceToAnchor(match,shooter,'release');
  assert.equal(match.ball.mode,'shot');
});

test('a close angled dunk curves toward the center of the rim', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  const dunker=match.players.find(p=>p.hasBall);
  dunker.x=186;dunker.y=44;dunker.vx=.2;dunker.dunk=99;
  stepMatch(match,[createInput(dunker.id,{x:1,turbo:true,shootPressed:true})]);
  assert.equal(match.ball.mode,'carried');
  advanceToAnchor(match,dunker,'release');
  assert.equal(match.ball.mode,'dunk');
  const attemptId=match.ball.attemptId;
  for(let tick=0;tick<40&&!match.scoredAttempts?.includes(attemptId);tick++)stepMatch(match,[]);
  assert.ok(match.scoredAttempts?.includes(attemptId));
  assert.deepEqual(match.score,[2,0]);
});

test('dunk release reaches the rim from the full close-range trigger window', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  const dunker=match.players.find(p=>p.hasBall);
  dunker.x=175;dunker.y=50;dunker.vx=.2;dunker.dunk=99;
  stepMatch(match,[createInput(dunker.id,{x:1,turbo:true,shootPressed:true})]);
  assert.equal(match.ball.mode,'carried');
  advanceToAnchor(match,dunker,'release');
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
  assert.equal(match.possession,1);
  for(let tick=0;tick<31;tick++)stepMatch(match,[]);
  assert.equal(match.players.find(p=>p.hasBall).team,1);
});

test('a 24-second violation awards one inbound to the defense and resets the shot clock', () => {
  const match=createMatch({quarterSeconds:60,seed:10});
  const holder=match.players.find(p=>p.hasBall);
  match.shotClock=1/60;
  stepMatch(match,[createInput(holder.id)]);
  assert.equal(match.possession,1);
  assert.equal(match.pendingInboundTeam,1);
  assert.equal(match.shotClock,24);
  assert.equal(match.events.filter(e=>e.text==='24-second violation').length,1);
  assert.equal(holder.turnovers,1);
  for(let tick=0;tick<31;tick++)stepMatch(match,[]);
  assert.equal(match.players.find(p=>p.hasBall).team,1);
});

test('a pass still in flight at 24 seconds gives the defense one inbound', () => {
  const match=createMatch({quarterSeconds:60,seed:11});
  const passer=match.players.find(p=>p.hasBall);
  match.ball.mode='pass';
  match.ball.ownerId=null;
  match.ball.targetId=match.players.find(p=>p.team===0&&p.id!==passer.id).id;
  match.ball.x=100;match.ball.y=50;match.ball.z=10;
  match.ball.vx=0;match.ball.vy=0;match.ball.vz=0;
  match.ball.lastTouch=passer.id;
  match.shotClock=1/60;

  stepMatch(match,[createInput(passer.id)]);

  assert.equal(match.possession,1);
  assert.equal(match.pendingInboundTeam,1);
  assert.equal(match.shotClock,24);
  assert.equal(match.ball.mode,'dead');
  assert.equal(match.events.filter(e=>e.text==='24-second violation').length,1);
  assert.equal(passer.turnovers,1);
  for(let tick=0;tick<31;tick++)stepMatch(match,[]);
  assert.equal(match.players.find(p=>p.hasBall).team,1);
  assert.equal(passer.turnovers,1);
  assert.equal(match.events.filter(e=>e.text==='24-second violation').length,1);
});

test('a timed defender jump can block shot flight into a loose rebound', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  match.possession=1;
  const defender=match.players.find(p=>p.team===0),shooter=match.players.find(p=>p.team===1);
  defender.block=100;defender.x=52;defender.y=50;shooter.x=160;shooter.y=50;
  prepareBlock(match,defender);
  match.ball.mode='shot';match.ball.ownerId=null;match.ball.lastTouch=shooter.id;match.ball.attemptId='blockable-shot';match.ball.made=true;match.ball.value=2;match.ball.x=53;match.ball.y=50;match.ball.z=5;match.ball.vx=.2;match.ball.vy=0;match.ball.vz=.2;match.ball.targetX=8;match.ball.targetY=50;match.ball.targetZ=2.6;
  stepMatch(match,neutralInputs(match));
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
  prepareBlock(match,defender);
  match.ball.mode='dunk';match.ball.ownerId=null;match.ball.lastTouch=dunker.id;match.ball.attemptId='blockable-dunk';match.ball.made=true;match.ball.value=2;match.ball.x=53;match.ball.y=50;match.ball.z=3;match.ball.vx=.2;match.ball.vy=0;match.ball.vz=.1;match.ball.targetX=192;match.ball.targetY=50;match.ball.targetZ=2.3;
  stepMatch(match,neutralInputs(match));
  assert.equal(match.ball.mode,'loose');
  assert.equal(match.ball.attemptId,null);
  assert.equal(defender.blocks,1);
  assert.match(match.lastEvent,/blocks/i);
});

test('a close defensive steal transfers the ball once to the defender', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  const holder=match.players.find(p=>p.team===0&&p.hasBall),defender=match.players.find(p=>p.team===1);
  const teammate=match.players.find(p=>p.team===0&&!p.hasBall),otherDefender=match.players.find(p=>p.team===1&&p.id!==defender.id);
  holder.x=100;holder.y=50;defender.x=100;defender.y=50;defender.steal=99;teammate.x=30;teammate.y=10;otherDefender.x=180;otherDefender.y=90;
  stepMatch(match,neutralInputs(match).map(input=>input.playerId===defender.id?createInput(defender.id,{stealPressed:true}):input));
  assert.equal(defender.steals,0);assert.equal(holder.stun,0);assert.equal(holder.hasBall,true);
  for(let tick=1;tick<anchorTick('steal','grab');tick++){stepMatch(match,neutralInputs(match));assert.equal(defender.steals,0);assert.equal(holder.hasBall,true);}
  stepMatch(match,neutralInputs(match));assert.equal(defender.steals,1);assert.equal(holder.hasBall,false);assert.equal(defender.hasBall,false);assert.equal(match.ball.mode,'loose');
  // Contact starts a separate recovery animation; possession changes at its grab.
  assert.equal(defender.animation.action?.kind,'catch');assert.equal(defender.animation.tick,0);
  for(let tick=1;tick<anchorTick('steal','grab');tick++){stepMatch(match,neutralInputs(match));assert.equal(defender.hasBall,false);}
  stepMatch(match,neutralInputs(match));
  assert.equal(defender.steals,1);assert.equal(defender.hasBall,true);
  assert.equal(match.possession,1);
  assert.equal(match.players.filter(p=>p.hasBall).length,1);
  assert.equal(match.ball.ownerId,defender.id);
});

test('a steal input outside reach does not jar the carrier loose', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  const holder=match.players.find(p=>p.team===0&&p.hasBall),defender=match.players.find(p=>p.team===1);
  holder.x=100;holder.y=50;defender.x=10;defender.y=5;
  stepMatch(match,[createInput(defender.id,{stealPressed:true})]);
  assert.equal(holder.hasBall,true);
  assert.equal(defender.steals,0);
  assert.equal(match.possession,0);
});

test('a close turbo body check knocks down an off-ball opponent', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  const defender=match.players.find(p=>p.team===1),target=match.players.find(p=>p.team===0&&!p.hasBall);
  defender.x=100;defender.y=50;defender.strength=99;target.x=100;target.y=50;
  stepMatch(match,[createInput(defender.id,{shovePressed:true})]);
  assert.equal(target.stun,0,'push anticipation has no immediate contact');
  advanceToAnchor(match,defender,'contact');
  assert.ok(target.stun>0);
  assert.equal(target.anim,'knockdown');
  assert.ok(Number.isFinite(target.vx)&&Number.isFinite(target.vy),'an exactly overlapping shove still needs finite knockback');
  assert.ok(Math.hypot(target.vx,target.vy)>.2,'an exactly overlapping shove must choose a deterministic knockback direction');
  assert.equal(defender.knockdowns,1);
  assert.match(match.lastEvent,/knock/i);
  const neutral=match.players.map(p=>createInput(p.id));
  for(let tick=0;tick<50;tick++)stepMatch(match,neutral);
  assert.equal(target.stun,0);
  assert.notEqual(target.anim,'knockdown');
});

test('a close turbo body check can jar the ball loose from the carrier', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  const defender=match.players.find(p=>p.team===1),holder=match.players.find(p=>p.team===0&&p.hasBall);
  defender.x=95;defender.y=50;defender.strength=99;holder.x=100;holder.y=50;holder.facing=1;
  match.rng=1;
  stepMatch(match,neutralInputs(match).map(input=>input.playerId===defender.id?createInput(defender.id,{shovePressed:true}):input));
  advanceToAnchor(match,defender,'contact');
  assert.equal(holder.hasBall,false);
  assert.equal(match.ball.mode,'loose');
  assert.equal(match.ball.ownerId,null);
  assert.equal(match.ball.lastTouch,defender.id);
  assert.ok(holder.stun>0);
  assert.equal(defender.knockdowns,1);
});

test('a defender contacting a descending shot above the rim is called for goaltending', () => {
  const match=createMatch({quarterSeconds:60,seed:1});
  match.possession=1;
  const defender=match.players.find(p=>p.team===0),shooter=match.players.find(p=>p.team===1);
  defender.block=100;defender.x=10;defender.y=50;shooter.x=160;shooter.y=50;
  prepareBlock(match,defender);
  match.ball.mode='shot';match.ball.ownerId=null;match.ball.lastTouch=shooter.id;match.ball.attemptId='goalie-shot';match.ball.made=true;match.ball.value=3;match.ball.x=10;match.ball.y=50;match.ball.z=3.5;match.ball.vx=-.1;match.ball.vy=0;match.ball.vz=-.2;match.ball.targetX=8;match.ball.targetY=50;match.ball.targetZ=2.6;match.ball.rim=false;
  stepMatch(match,neutralInputs(match));
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
  prepareBlock(match,defender);
  match.ball.mode='shot';match.ball.ownerId=null;match.ball.lastTouch=shooter.id;match.ball.attemptId='rim-shot';match.ball.made=true;match.ball.value=2;match.ball.x=10;match.ball.y=50;match.ball.z=3.5;match.ball.vx=-.1;match.ball.vy=0;match.ball.vz=-.2;match.ball.targetX=8;match.ball.targetY=50;match.ball.targetZ=2.6;match.ball.rim=true;
  stepMatch(match,neutralInputs(match));
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

test('a shot already in flight gets to resolve after the period clock reaches zero', () => {
  const match=createMatch({quarterSeconds:1,seed:27});
  match.clock=1/60;
  Object.assign(match.ball,{mode:'shot',x:80,y:20,z:30,vx:.1,vy:0,vz:0,made:false,targetX:130,targetY:50,targetZ:2.6,attemptId:'buzzer-shot'});
  stepMatch(match,[]);
  assert.equal(match.phase,'playing');
  assert.equal(match.clock,0);
  assert.equal(match.ball.mode,'shot');
  match.ball.mode='loose';
  stepMatch(match,[]);
  assert.equal(match.phase,'break');
});

test('three-point scoring follows the regulation elliptical arc and corner segments in both directions',()=>{
  const cornerOffset=court.arcX*Math.sqrt(1-((50-court.cornerY)/court.arcY)**2);
  for(const team of [0,1]){
    const hoop=team===0?court.hoops[1]:court.hoops[0],dir=team===0?-1:1;
    assert.equal(scoreValue({x:hoop+dir*court.arcX,y:50},team),2,'a foot on the arc is two');
    assert.equal(scoreValue({x:hoop+dir*(court.arcX+.01),y:50},team),3);
    assert.equal(scoreValue({x:hoop+dir*42,y:50},team),2,'old shortened arc is inside');
    for(const y of [0,court.cornerY,100-court.cornerY,100]){
      assert.equal(scoreValue({x:hoop+dir*(cornerOffset-.01),y},team),2,'inside the straight corner line is two');
      assert.equal(scoreValue({x:hoop+dir*(cornerOffset+.01),y},team),3,'past the straight corner line is three');
    }
  }
});
test('a genuine above-arc three stays in flight and can score its locked value',()=>{
  const m=createMatch({quarterSeconds:60,seed:1}),p=m.players[0];p.x=130;p.y=50;p.shoot=99;
  for(const defender of m.players.filter(d=>d.team!==p.team)){defender.x=20;defender.y=0;}
  stepMatch(m,[...neutralInputs(m).filter(i=>i.playerId!==p.id),createInput(p.id,{shootPressed:true})]);
  advanceToAnchor(m,p,'release');assert.equal(m.ball.mode,'shot');assert.equal(m.ball.value,3);assert.equal(p.threeAttempts,1);const attempt=m.ball.attemptId;
  for(let tick=0;tick<180&&!m.scoredAttempts?.includes(attempt);tick++)stepMatch(m,neutralInputs(m));
  assert.ok(m.scoredAttempts?.includes(attempt));assert.deepEqual(m.score,[3,0]);assert.equal(p.threeMakes,1);
});
