import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { teams } from '../src/content/teams.js';
import { athleteBallTracks, athleteBallTrackProvenance } from '../src/content/animation-ball-tracks.js';
import { canonicalJson } from '../tools/captain-studio/canonical-json.mjs';
import {
  animationClips,
  animationDuration,
  athleteBallTrackSource,
  sampleBallForward,
  sampleBallHeight,
  sampleBallReleaseVz,
} from '../src/core/animation.js';

const baseline = JSON.parse(readFileSync(new URL('./fixtures/animation/tracked-action-runtime-baseline.json', import.meta.url), 'utf8'));

test('runtime ball tracks preserve exact per-athlete source, timing, anchors, and samples', () => {
  const athletes = teams.flatMap(team => team.roster);
  assert.equal(athletes.length, 105);
  const observed = {};
  let clipCount = 0;

  for (const athlete of athletes) {
    const observedClips = observed[athlete.id] = {};
    const provenance = athleteBallTrackProvenance[athlete.id];
    const registryTracks = athleteBallTracks[athlete.id] ?? {};
    if (Object.keys(registryTracks).length) {
      assert.equal(provenance?.classification, 'migrated-existing-track', `${athlete.id} provenance`);
      assert.equal(provenance?.source, 'src/core/animation.js (pre-registry migration)', `${athlete.id} source`);
    }
    for (const [clip, track] of Object.entries(registryTracks)) {
      assert.ok(track && typeof track === 'object', `${athlete.id}/${clip} registry entry`);
      assert.ok(provenance.trackKeys.includes(clip), `${athlete.id}/${clip} provenance`);
    }
    assert.equal(Object.keys(animationClips).length, 29);
    for (const [clip, definition] of Object.entries(animationClips)) {
      clipCount++;
      const duration = animationDuration(clip);
      observedClips[clip] = [
        athleteBallTrackSource(athlete.id, clip, 'height'),
        athleteBallTrackSource(athlete.id, clip, 'forward'),
        sampleBallReleaseVz(clip, athlete.id),
        duration,
        Boolean(definition.loop),
        definition.frames.map(frame => frame.duration),
        definition.anchors,
        Array.from({ length: duration + 2 }, (_, tick) => [
          sampleBallHeight(clip, tick, athlete.id),
          sampleBallForward(clip, tick, athlete.id),
        ]),
      ];
    }
  }
  assert.equal(clipCount, baseline.clips);
  const digest = createHash('sha256').update(canonicalJson(observed), 'utf8').digest('hex');
  assert.equal(digest, baseline.sha256, 'every pre-migration track source, anchor, timing and sample is unchanged');
});
