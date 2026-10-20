import test from 'node:test';
import assert from 'node:assert/strict';
import { teams } from '../src/content/teams.js';
import { createCareerRecords, recordCareerMatch, rankCareerLeaders } from '../src/core/career.js';

test('career totals aggregate completed games across substitutions and rank top scorers',()=>{
  const ids=teams[0].roster.map(player=>player.id);
  const table=createCareerRecords(teams);
  const match={phase:'final',score:[8,4],playerBox:[{id:ids[1],points:2,fgm:1,fga:2,threeMakes:0,threeAttempts:1,assists:2,rebounds:1,steals:0,blocks:0,turnovers:1}],players:[{id:ids[0],points:6,fgm:3,fga:4,threeMakes:0,threeAttempts:0,assists:1,rebounds:2,steals:1,blocks:1,turnovers:0},{id:'unknown',points:99}]};
  const next=recordCareerMatch(table,match);
  assert.equal(next[ids[0]].games,1);
  assert.equal(next[ids[0]].points,6);
  assert.equal(next[ids[1]].assists,2);
  assert.equal(next[ids[2]].games,0);
  assert.deepEqual(rankCareerLeaders(next,teams,1).map(row=>row.athleteId),[ids[0]]);
  assert.equal(table[ids[0]].games,0);
});

test('career stats ignore nonfinal matches and unknown player IDs',()=>{
  const table=createCareerRecords(teams),before=table;
  assert.equal(recordCareerMatch(table,{phase:'playing',score:[0,0],players:[{id:'fake',points:99}]}),before);
  assert.equal(table['juniper-vale'].games,0);
});
