import test from 'node:test';
import assert from 'node:assert/strict';
import { teams } from '../src/content/teams.js';
import { createSeason, seasonOpponent, recordSeasonResult, seasonLength } from '../src/core/season.js';

test('season route visits eight distinct opponents and never schedules the selected franchise', () => {
  let season=createSeason(teams[4].id);
  const opponents=[];
  for(let i=0;i<seasonLength;i++) {
    const opponent=seasonOpponent(season,teams);
    opponents.push(opponent.id);
    season=recordSeasonResult(season,true);
  }
  assert.equal(new Set(opponents).size,seasonLength);
  assert.ok(opponents.every(id=>id!==teams[4].id));
  assert.equal(season.complete,true);
  assert.equal(season.wins,seasonLength);
  assert.equal(seasonOpponent(season,teams),null);
  assert.equal(recordSeasonResult(season,true),season);
});

test('season loss ends the run and does not award a win', () => {
  const start=createSeason(teams[0].id);
  const next=recordSeasonResult(start,false);
  assert.equal(next.round,1);
  assert.equal(next.wins,0);
  assert.equal(next.losses,1);
  assert.equal(next.lastResult,'loss');
  assert.equal(next.complete,true);
  assert.equal(seasonOpponent(next,teams),null);
  assert.equal(start.round,0);
});
