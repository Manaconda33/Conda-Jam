import test from 'node:test';
import assert from 'node:assert/strict';
import { createMatch, stepMatch } from '../../src/core/simulation.js';
import { teams } from '../../src/content/teams.js';

test('short full AI match completes all four quarters with real simulated scoring', () => {
  const match=createMatch({quarterSeconds:10,seed:3,home:teams[0],away:teams[26]});
  match.teamNames=[teams[0].name,teams[26].name];
  for(let tick=0;tick<10000&&match.phase!=='final';tick++)stepMatch(match,[]);
  assert.equal(match.phase,'final');
  assert.ok(match.period>=4,'a tied regulation match may enter overtime before its final winner');
  assert.notDeepEqual(match.score,[0,0]);
  assert.equal(match.players.reduce((sum,p)=>sum+p.points,0),match.score[0]+match.score[1]);
  for(const p of match.players){
    assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y)&&Math.abs(p.x)<300&&Math.abs(p.y)<300);
    assert.ok(p.fgm<=p.fga&&p.threeMakes<=p.threeAttempts);
    assert.equal(p.points,(p.fgm-p.threeMakes)*2+p.threeMakes*3);
  }
});

test('default three-minute quarters complete a regulation-length AI match', () => {
  const match=createMatch({quarterSeconds:180,seed:96,home:teams[3],away:teams[8]});
  let ticks=0;
  for(;ticks<100000&&match.phase!=='final';ticks++)stepMatch(match,[]);
  assert.equal(match.phase,'final',`match did not finish after ${ticks} simulation frames`);
  assert.ok(match.period>=4);
  assert.ok(match.score[0]+match.score[1]>0);
  assert.equal(match.players.reduce((sum,p)=>sum+p.points,0),match.score[0]+match.score[1]);
});
