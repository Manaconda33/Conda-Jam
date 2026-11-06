import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, anchorTick, sampleAnimation, sampleBallHeight, sampleBallForward } from '../src/core/animation.js';
import { createInput, createMatch, stepMatch } from '../src/core/simulation.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';
import { decodeImage, inspectAtlas } from '../tools/animation-assets.mjs';

const athleteId = 'krios';
const clipName = 'pass-behind';
const height = [1.05, 1.3, 1.2, 1.25, 1.25, 1.2];
const forward = [5, 2, -3, -9, -12, -8];
const clip = animationAssetManifest.characters[athleteId].directions.right[clipName];
const atlasPath = fileURLToPath(new URL(`../${clip.src.slice(2)}`, import.meta.url));

test('J.128 Krios behind-pass atlas has six distinct reviewed poses and accepted provenance', async () => {
  assert.equal(clip.reviewed, true);
  assert.equal(clip.provenance.generationId, 'exec-bacc1e68-e632-48c3-a10e-626382c9a505');
  assert.equal(clip.provenance.sourceReview.status, 'accepted');
  assert.equal(clip.provenance.ballTrackReview.status, 'accepted');
  assert.deepEqual(clip.provenance.runtimeBallTrack, { height, forward, reviewed: true });
  assert.equal(clip.frames.length, 6);
  assert.equal(new Set(clip.frames.map(frame => frame.hash)).size, 6);
  assert.equal(clip.sha256, createHash('sha256').update(readFileSync(atlasPath)).digest('hex'));

  const decoded = await decodeImage(atlasPath);
  assert.deepEqual([decoded.width, decoded.height], [520, 192]);
  const inspected = await inspectAtlas(atlasPath, clip.frames);
  assert.equal(inspected.frames.length, 6);
  assert.ok(inspected.frames.every(frame => frame.visiblePixels > 0 && !frame.error));
  const report = JSON.parse(readFileSync(new URL('../tools/generate-art/previews/j128-krios-pass-behind-track-candidate/attempt-05/native/report.json', import.meta.url), 'utf8'));
  assert.equal(report.captureCount, 64);
  assert.equal(report.candidateTrack.height.length, 6);
  assert.deepEqual(report.candidateTrack, { height, forward });
});

test('J.128 Krios tracks the separate ball through tick6 and releases to Flint at tick7 in both facings', () => {
  assert.deepEqual(animationClips[clipName].frames.map(frame => frame.duration), [2, 2, 3, 1, 2, 3]);
  assert.equal(anchorTick(clipName, 'release'), 7);
  assert.equal(sampleAnimation(clipName, 7).frame, 3);
  let elapsed = 0;
  for (let frame = 0; frame < 6; frame++) {
    assert.equal(sampleBallHeight(clipName, elapsed, athleteId), height[frame]);
    assert.equal(sampleBallForward(clipName, elapsed, athleteId), forward[frame]);
    elapsed += animationClips[clipName].frames[frame].duration;
  }

  for (const facing of [1, -1]) {
    const match = createMatch({ quarterSeconds: 60, seed: 128, home: { roster: [{ id: athleteId }, { id: 'partner' }] } });
    const passer = match.players.find(player => player.id === athleteId);
    const receiver = match.players.find(player => player.team === passer.team && player.id !== passer.id);
    assert.ok(receiver, 'Krios has a teammate receiver');
    passer.x = facing > 0 ? 82 : 118;
    passer.y = 50;
    passer.facing = facing;
    receiver.x = passer.x + facing * 24;
    receiver.y = 50;
    receiver.facing = -facing;
    for (const defender of match.players.filter(player => player.team !== passer.team)) {
      defender.x = facing > 0 ? 15 : 185;
      defender.y = 10;
      defender.stun = 999;
    }
    passer.hasBall = true;
    receiver.hasBall = false;
    match.phase = 'playing';
    match.pause = false;
    match.possession = passer.team;
    Object.assign(match.ball, { mode: 'carried', ownerId: passer.id, targetId: null, aerialTargetId: null,
      lastTouch: passer.id, attemptId: null, x: passer.x + facing * forward[0], y: passer.y,
      z: height[0], vx: 0, vy: 0, vz: 0 });
    const neutral = () => match.players.map(player => createInput(player.id));
    stepMatch(match, neutral().map(input => input.playerId === passer.id
      ? createInput(passer.id, { passPressed: true, passVariant: clipName }) : input));
    assert.equal(passer.animation.clip, clipName);
    while (passer.animation.tick < 6) stepMatch(match, neutral());
    assert.equal(passer.animation.tick, 6);
    assert.equal(passer.hasBall, true);
    assert.equal(match.ball.mode, 'carried');
    assert.equal(match.ball.ownerId, passer.id);
    assert.ok(Math.abs(match.ball.x - (passer.x + facing * sampleBallForward(clipName, 6, athleteId))) < 1e-8);

    stepMatch(match, neutral());
    assert.equal(passer.animation.tick, 7);
    assert.equal(passer.hasBall, false);
    assert.equal(match.ball.mode, 'pass');
    assert.equal(match.ball.ownerId, null);
    assert.equal(match.ball.targetId, receiver.id);
    assert.equal(match.players.filter(player => player.hasBall).length, 0, 'release never duplicates possession');
    for (let tick = 0; tick < 48 && !receiver.hasBall; tick++) stepMatch(match, neutral());
    assert.equal(receiver.hasBall, true, `Flint receives the separate ball with facing ${facing}`);
    assert.equal(match.ball.ownerId, receiver.id);
  }
});

test('J.128 Krios behind-pass production selector mirrors the accepted six-frame atlas safely', () => {
  const image = { complete: true, naturalWidth: 520, naturalHeight: 192, file: clip.src };
  const images = new Map([[clip.src, image]]);
  let tick = 0;
  for (let frame = 0; frame < clip.frames.length; frame++) {
    assert.equal(sampleAnimation(clipName, tick).frame, frame);
    for (const [facing, flip] of [[1, false], [-1, true]]) {
      const selected = selectProductionSprite({ id: athleteId, facing, animation: { clip: clipName, tick } }, { manifest: animationAssetManifest, images });
      assert.equal(selected?.atlas.file, clip.src);
      assert.equal(selected?.frame, frame);
      assert.equal(selected?.flip, flip);
    }
    tick += animationClips[clipName].frames[frame].duration;
  }
});
