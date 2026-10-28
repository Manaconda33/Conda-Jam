import test from 'node:test';
import assert from 'node:assert/strict';
import { teams } from '../src/content/teams.js';
import { animationClips } from '../src/core/animation.js';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { assignSupportingDonors, supportingDonorIds, originalSupportingDonors } from '../src/content/supporting-donor-assignment.js';
import { supportingDonorMap, supportingDonorCounts, supportingDonorSeed } from '../src/content/supporting-donor-map.js';
import { supportingAnimationLibraries } from '../src/content/supporting-animation-libraries.js';

const supporters = teams.flatMap(team => team.roster.filter(player => !player.captain).map(player => ({ team, player })));
const playerById = new Map(supporters.map(({ player }) => [player.id, player]));

test('the committed map is deterministic, balanced, team-distinct and noncaptain-only', () => {
  assert.equal(Object.keys(supportingDonorMap).length, 70);
  assert.deepEqual(assignSupportingDonors(teams), supportingDonorMap);
  const reversed = [...teams].reverse().map(team => ({ ...team, roster: [...team.roster].reverse() }));
  assert.deepEqual(assignSupportingDonors(reversed), supportingDonorMap, 'roster order cannot reshuffle donor assignments');
  assert.equal(supportingDonorSeed, 'jamverse96-support-donors-issue7-v1');
  assert.deepEqual(Object.keys(supportingAnimationLibraries).sort(), supporters.map(({ player }) => player.id).sort());

  const counts = Object.fromEntries(supportingDonorIds.map(id => [id, 0]));
  for (const { team, player } of supporters) {
    const donorId = supportingDonorMap[player.id];
    assert.ok(supportingDonorIds.includes(donorId), `${player.id} has an approved donor`);
    assert.equal(playerById.get(donorId)?.captain, false, `${player.id} does not map to a captain`);
    assert.equal(supportingAnimationLibraries[player.id].donorId, donorId);
    if (originalSupportingDonors.has(player.id)) assert.equal(donorId, player.id, `${player.id} keeps its original library`);
    else counts[donorId]++;
  }
  assert.deepEqual(counts, Object.fromEntries(supportingDonorIds.map(id => [id, 9])));
  assert.deepEqual(counts, supportingDonorCounts);
  for (const { team } of supporters) {
    const ids = team.roster.filter(player => !player.captain).map(player => supportingDonorMap[player.id]);
    assert.equal(new Set(ids).size, ids.length, `${team.id} has visually distinct supporting donors`);
  }
});

test('all seven source libraries are complete, reviewed and safely mirrorable', () => {
  assert.equal(supportingDonorIds.length, 7);
  for (const donorId of supportingDonorIds) {
    const donor = animationAssetManifest.characters[donorId];
    assert.ok(donor, `${donorId} exists in the manifest`);
    const right = donor.directions.right;
    assert.equal(Object.keys(right).length, 29, `${donorId} has all required actions`);
    for (const [clip, definition] of Object.entries(animationClips)) {
      const source = right[clip];
      assert.ok(source?.reviewed, `${donorId} ${clip} is reviewed`);
      assert.ok(source.frames.length >= definition.frames.length, `${donorId} ${clip} meets the runtime frame count`);
    }
    assert.equal(donor.mirrorSafe, true, `${donorId} can mirror its reviewed right-facing art`);
    assert.equal(donor.mirrorReview?.status, 'reviewed');
  }
});
