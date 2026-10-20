import test from 'node:test';
import assert from 'node:assert/strict';
import { teams, validateLeague } from '../src/content/teams.js';

test('league contains every canonical captain in exactly one three-player franchise', () => {
  const result = validateLeague(teams);
  assert.deepEqual(result, { teams: 35, athletes: 105, captains: 35, errors: [] });
  assert.equal(teams.some(t => t.roster.some(p => /cleo/i.test(p.name))), false);
});

test('special anatomy tags stay attached to their canonical players', () => {
  const required = {
    'paprika': 'quadruped-fox', 'dragon-queen': 'dragon', 'suga': 'cobra',
    'quirky': 'orangutan-zebra', 'steeb': 'wombat', 'gb-design': 'jaguar',
    'kraken': 'elf', 'alexithymia': 'blank-screen-android'
  };
  for (const [id, rig] of Object.entries(required)) {
    const player = teams.flatMap(t => t.roster).find(p => p.id === id);
    assert.ok(player, `${id} is present`);
    assert.equal(player.rig, rig);
  }
});

test('content validator rejects missing identity, presentation and render requirements', () => {
  const league=structuredClone(teams);
  league[0].roster[2].name=league[0].roster[1].name;
  league[0].roster[2].number=league[0].roster[1].number;
  league[1].roster[0].rig='unrenderable';
  league[1].roster[0].visualSeed=undefined;
  league[2].roster[0].visualSeed=league[3].roster[0].visualSeed;
  league[1].slogan='';
  const errors=validateLeague(league).errors.join('\n');
  assert.match(errors,/duplicate roster name/i);
  assert.match(errors,/duplicate uniform number/i);
  assert.match(errors,/unsupported sprite rig/i);
  assert.match(errors,/visual seed/i);
  assert.match(errors,/duplicate visual seed/i);
  assert.match(errors,/missing presentation/i);
});
