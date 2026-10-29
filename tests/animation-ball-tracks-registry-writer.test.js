import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  renderBallTrackRegistry,
  writeBallTrackRegistry,
} from '../tools/register-animation-ball-tracks.mjs';

const sample = {
  athleteBallTracks: {
    zed: { run: { height: [1, 2], forward: [3, 4] } },
    alba: { pass: { height: [5], forward: [6] } },
  },
  athleteBallTrackProvenance: {
    zed: { run: { source: 'legacy' } },
    alba: { pass: { source: 'reviewed' } },
  },
};

test('registry writer emits canonical stable module text and atomically writes it', async t => {
  const expected = renderBallTrackRegistry(sample);
  assert.equal(renderBallTrackRegistry(sample), expected);
  assert.ok(expected.endsWith('\n'));
  assert.ok(expected.indexOf('"alba"') < expected.indexOf('"zed"'));
  assert.ok(expected.indexOf('export const athleteBallTracks') < expected.indexOf('export const athleteBallTrackProvenance'));

  const root = await mkdtemp(path.join(os.tmpdir(), 'ball-track-registry-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const target = path.join(root, 'animation-ball-tracks.js');
  await writeBallTrackRegistry(sample, target);
  assert.equal(await readFile(target, 'utf8'), expected);
});
