import test from 'node:test';
import assert from 'node:assert/strict';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, anchorTick, sampleAnimation, sampleBallForward, sampleBallHeight } from '../src/core/animation.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';
import { createInput, createMatch, stepMatch } from '../src/core/simulation.js';
import { teams } from '../src/content/teams.js';

const athleteId = 'leo';
const atlas = './public/assets/animation/leo-receive-right.webp';
const clip = animationAssetManifest.characters[athleteId].directions.right.receive;
const height = [1.15, 2.0, 1.9, 1.45];
const forward = [8, 13, 8, 3];

test('J.108 Leo receive registers four reviewed poses and a separate athlete-specific track', () => {
  assert.ok(clip);
  assert.equal(clip.reviewed, true);
  assert.equal(clip.src, atlas);
  assert.equal(clip.frames.length, 4);
  assert.equal(new Set(clip.frames.map(frame => frame.hash)).size, 4);
  assert.equal(clip.provenance.issue, 'J.108');
  assert.equal(clip.provenance.review.status, 'accepted');
  assert.equal(clip.provenance.ballTrack.status, 'accepted-native-review');
  assert.deepEqual(clip.provenance.ballTrack.height, height);
  assert.deepEqual(clip.provenance.ballTrack.forward, forward);
  assert.deepEqual(animationClips.receive.frames.map(frame => frame.duration), [2, 2, 1, 3]);
  assert.equal(anchorTick('receive', 'grab'), 4);
  assert.equal(sampleAnimation('receive', 4).frame, 2);
  for (const facing of [1, -1]) {
    const sprite = selectProductionSprite({ id: athleteId, facing, animation: { clip: 'receive', tick: 4 } }, {
      manifest: animationAssetManifest,
      images: new Map([[atlas, { complete: true, naturalWidth: 192, naturalHeight: 192, file: atlas }]])
    });
    assert.equal(sprite?.atlas.file, atlas);
    assert.equal(sprite?.frame, 2);
    assert.equal(sprite?.flip, facing < 0);
  }
});

test('Leo catches at tick4 and carries through recovery in both facings', () => {
  const home = teams.find(team => team.roster.some(player => player.id === athleteId));
  const away = teams.find(team => team !== home);
  for (const facing of [1, -1]) {
    const match = createMatch({ quarterSeconds: 60, seed: 108, home, away, homePartnerId: athleteId });
    const leo = match.players.find(player => player.id === athleteId);
    const duplicate = match.players.find(player => player !== leo && player.id === athleteId);
    duplicate.id = 'leo-pass-partner';
    const passer = match.players.find(player => player.team === leo.team && player !== leo);
    for (const player of match.players) {
      player.hasBall = false;
      player.vx = player.vy = player.vz = player.z = 0;
      if (player.team !== leo.team) { player.x = 15; player.y = 0; }
      else if (player !== passer) { player.x = facing > 0 ? 45 : 155; player.y = 80; }
    }
    leo.x = 100; leo.y = 50; leo.facing = facing; passer.x = 70; passer.y = 50;
    match.phase = 'playing'; match.pause = false;
    Object.assign(match.ball, { mode: 'pass', ownerId: null, targetId: leo.id, aerialTargetId: null, lastTouch: passer.id, x: leo.x, y: leo.y, z: 0.5, vx: 0, vy: 0, vz: 0 });
    const neutral = () => match.players.map(player => createInput(player.id));
    stepMatch(match, neutral());
    assert.equal(leo.animation.clip, 'receive');
    for (let tick = 0; tick < 4; tick++) {
      assert.equal(leo.hasBall, false);
      assert.equal(match.ball.mode, 'pass');
      stepMatch(match, neutral());
    }
    assert.equal(leo.animation.tick, 4);
    assert.equal(sampleAnimation('receive', 4).frame, 2);
    assert.equal(leo.hasBall, true);
    assert.equal(match.ball.mode, 'carried');
    assert.equal(match.ball.ownerId, athleteId);
    assert.equal(match.ball.x, leo.x + facing * sampleBallForward('receive', 4, athleteId));
    assert.equal(match.ball.z, leo.z + sampleBallHeight('receive', 4, athleteId));
    stepMatch(match, neutral());
    assert.equal(leo.animation.tick, 5);
    assert.equal(leo.hasBall, true);
    assert.equal(match.ball.ownerId, athleteId);
  }
});
