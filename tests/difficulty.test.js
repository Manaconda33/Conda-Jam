import test from 'node:test';
import assert from 'node:assert/strict';
import { createMatch, cpuProfileFor } from '../src/core/simulation.js';

test('CPU difficulty presets progressively change shooting and defensive challenge', () => {
  const rookie = cpuProfileFor('Rookie');
  const pro = cpuProfileFor('Pro');
  const legend = cpuProfileFor('Legend');
  for (const key of ['accuracy','shotDistance','openShotChance','passChance','stealChance','blockChance']) {
    assert.ok(rookie[key] < pro[key], `Rookie ${key} should be below Pro`);
    assert.ok(pro[key] < legend[key], `Pro ${key} should be below Legend`);
  }
  assert.equal(createMatch({difficulty:'Rookie'}).difficulty,'Rookie');
  assert.equal(createMatch({difficulty:'Legend'}).difficulty,'Legend');
  assert.equal(createMatch({difficulty:'unknown'}).difficulty,'Pro');
});
