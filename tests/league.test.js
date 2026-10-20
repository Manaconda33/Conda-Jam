import test from 'node:test';
import assert from 'node:assert/strict';
import { teams } from '../src/content/teams.js';
import { createLeagueTable, recordLeagueResult, rankLeague } from '../src/core/league.js';

test('league records score every franchise and rank by winning percentage then point differential',()=>{
  let table=createLeagueTable(teams);
  table=recordLeagueResult(table,teams[0].id,teams[1].id,[20,10]);
  table=recordLeagueResult(table,teams[0].id,teams[2].id,[5,10]);
  table=recordLeagueResult(table,teams[1].id,teams[2].id,[10,5]);
  assert.deepEqual(table[teams[0].id],{played:2,wins:1,losses:1,pointsFor:25,pointsAgainst:20});
  const ranked=rankLeague(table,teams);
  assert.equal(ranked.length,35);
  assert.equal(ranked[0].teamId,teams[0].id);
});

test('invalid and tied results do not mutate local standings',()=>{
  const table=createLeagueTable(teams);
  assert.equal(recordLeagueResult(table,teams[0].id,teams[0].id,[10,9]),table);
  assert.equal(recordLeagueResult(table,teams[0].id,teams[1].id,[9,9]),table);
  assert.equal(recordLeagueResult(table,teams[0].id,'unknown',[9,4]),table);
  assert.equal(table[teams[0].id].played,0);
});
