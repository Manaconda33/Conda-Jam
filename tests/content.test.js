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
