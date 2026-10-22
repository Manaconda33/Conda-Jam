import test from 'node:test';
import assert from 'node:assert/strict';
import { teams } from '../src/content/teams.js';
import { createTournament, cpuWinProbability, recordTournamentResult, validTournament } from '../src/core/tournament.js';

test('seeded cup has a stable eight-team field and a valid three-round path',()=>{
  const one=createTournament(teams[0].id,teams,742);
  const two=createTournament(teams[0].id,teams,742);
  assert.deepEqual(one,two);
  assert.equal(one.field.length,8);
  assert.equal(one.field[0],teams[0].id);
  assert.equal(new Set(one.field).size,8);
  assert.equal(one.opponents.length,3);
  assert.ok(one.opponents.every(id=>one.field.includes(id)&&id!==one.teamId));
  assert.deepEqual(validTournament(one,teams),one);
});

test('three wins crown the player and one loss ends the saved bracket',()=>{
  let cup=createTournament(teams[3].id,teams,91);
  for(let round=1;round<=3;round++){
    cup=recordTournamentResult(cup,true);
    assert.equal(cup.round,round);
    assert.equal(cup.complete,round===3);
  }
  assert.equal(cup.champion,cup.teamId);
  assert.equal(validTournament(cup,teams).champion,cup.teamId);
  const eliminated=recordTournamentResult(createTournament(teams[2].id,teams,12),false);
  assert.equal(eliminated.complete,true);
  assert.equal(eliminated.champion,null);
  assert.equal(recordTournamentResult(eliminated,true),eliminated);
});

test('saved cup data rejects bad teams and inconsistent result histories',()=>{
  const cup=createTournament(teams[0].id,teams,9);
  assert.equal(validTournament({...cup,field:[...cup.field.slice(0,7),'not-a-franchise']},teams),null);
  assert.equal(validTournament({...cup,round:1},teams),null);
  assert.equal(validTournament({...cup,opponents:[cup.teamId,...cup.opponents.slice(1)]},teams),null);
});

test('off-court CPU results give stronger teams a measured edge with room for upsets',()=>{
 assert.equal(cpuWinProbability(75,75),.5);
 assert.equal(cpuWinProbability(99,69),.8);
 assert.equal(cpuWinProbability(69,99),.2);
});

test('seeded CPU bracket opponents stay reproducible and respond to team ratings',()=>{
 const evenTeams=Array.from({length:8},(_,index)=>({id:`team-${index}`,roster:[{ovr:75},{ovr:75},{ovr:75}]}));
 const ratedTeams=evenTeams.map(team=>({...team,roster:team.roster.map(player=>({...player,ovr:team.id==='team-1'?99:team.id==='team-2'?50:75}))}));
 let changedOutcome=false;
 for(let seed=1;seed<=40;seed++){
  const even=createTournament('team-0',evenTeams,seed),rated=createTournament('team-0',ratedTeams,seed);
  assert.deepEqual(rated.field,even.field,'ratings must not change the seeded tournament field');
  if(JSON.stringify(rated.opponents)!==JSON.stringify(even.opponents))changedOutcome=true;
 }
 assert.ok(changedOutcome,'CPU match winners should respond to roster ratings for at least one fixed seed');
});
