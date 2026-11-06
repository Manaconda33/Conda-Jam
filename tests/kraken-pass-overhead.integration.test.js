import test from 'node:test';
import assert from 'node:assert/strict';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { anchorTick, sampleAnimation, sampleBallHeight, sampleBallForward } from '../src/core/animation.js';
import { createMatch, createInput, stepMatch } from '../src/core/simulation.js';

test('J.07 Kraken overhead pass uses its reviewed atlas and reaches Marin in both facings', () => {
  const character = animationAssetManifest.characters.kraken;
  const entry = character.directions.right['pass-overhead'];
  assert.equal(entry.reviewed, true);
  assert.equal(entry.source, 'imagegen');
  assert.equal(entry.provenance.generationId, 'exec-c4431957-32b5-428e-b129-7dfdf0f745b4');
  assert.equal(entry.provenance.runtimeBallTrack.reviewed, true);
  assert.equal(entry.provenance.runtimeBallTrack.releaseVz, .232);
  assert.equal(entry.frames.length, 6);
  assert.equal(new Set(entry.frames.map(frame => frame.hash)).size, 6);
  assert.equal(entry.columns, 3);
  assert.equal(entry.rows, 2);
  assert.equal(character.mirrorSafe, true);
  assert.equal(character.mirrorReview.status, 'reviewed');
  assert.equal(anchorTick('pass-overhead', 'release'), 7);
  assert.deepEqual(entry.provenance.runtimeBallTrack.height, [1.05, 1.85, 1.75, 1.9, 2.1, 1.2]);
  assert.deepEqual(entry.provenance.runtimeBallTrack.forward, [2.5, 3, 2, 6, 10, 14]);
  assert.equal(sampleBallHeight('pass-overhead', 0, 'kraken'), 1.05);
  assert.equal(sampleBallForward('pass-overhead', 7, 'kraken'), 6);

  for (const facing of [1, -1]) {
    const match = createMatch({ quarterSeconds: 60, seed: 729, home: { roster: [{ id: 'kraken' }, { id: 'marin-dusk' }] } });
    const passer = match.players.find(player => player.id === 'kraken');
    const receiver = match.players.find(player => player.id === 'marin-dusk');
    passer.x = facing > 0 ? 80 : 120;
    passer.y = 75;
    passer.facing = facing;
    receiver.x = passer.x + facing * 30;
    receiver.y = 75;
    receiver.facing = -facing;
    for (const opponent of match.players.filter(player => player.team !== passer.team)) {
      opponent.x = facing > 0 ? 180 : 20;
      opponent.y = 15;
    }
    match.phase = 'playing';
    match.practice = true;
    match.clock = 180;
    match.shotClock = 24;
    match.possession = passer.team;
    Object.assign(match.ball, {
      mode: 'carried', ownerId: passer.id, targetId: null, aerialTargetId: null, lastTouch: passer.id,
      x: passer.x + facing * sampleBallForward('pass-overhead', 0, passer.id), y: passer.y,
      z: sampleBallHeight('pass-overhead', 0, passer.id), vx: 0, vy: 0, vz: 0,
    });
    const inputs = action => match.players.map(player => createInput(player.id, player === passer ? action : {}));
    stepMatch(match, inputs({ passPressed: true, passVariant: 'pass-overhead' }));
    assert.equal(passer.animation.clip, 'pass-overhead');
    assert.equal(passer.animation.tick, 0);

    while (passer.animation.tick < anchorTick('pass-overhead', 'release')) {
      assert.equal(match.ball.ownerId, passer.id, 'Kraken carries the ball through the final overhead gather');
      stepMatch(match, inputs({}));
    }
    assert.equal(passer.animation.tick, 7);
    assert.equal(match.ball.mode, 'pass');
    assert.equal(match.ball.ownerId, null);
    assert.equal(match.ball.lastTouch, passer.id);
    assert.ok(Math.abs(match.ball.vz - (.232 - .026)) < 1e-9, 'the overhead pass uses its calibrated release arc');

    let previous = { x: match.ball.x, z: match.ball.z };
    let catchDelta = null;
    for (let tick = 0; tick < 36 && match.ball.ownerId !== receiver.id; tick++) {
      stepMatch(match, inputs({}));
      if (match.ball.ownerId === receiver.id) catchDelta = { x: match.ball.x - previous.x, z: match.ball.z - previous.z };
      else {
        assert.equal(match.ball.mode, 'pass');
        assert.ok(match.ball.z > 0, `ball remains airborne before Marin's catch (facing ${facing})`);
        previous = { x: match.ball.x, z: match.ball.z };
      }
    }
    assert.equal(match.ball.ownerId, receiver.id);
    assert.ok(Math.abs(catchDelta.x) < 1, `horizontal catch correction stays small: ${catchDelta.x}`);
    assert.ok(Math.abs(catchDelta.z) < .6, `vertical catch correction stays small: ${catchDelta.z}`);
    assert.equal(receiver.animation.clip, 'receive');
    const receiveFrame = sampleAnimation('receive', receiver.animation.tick).frame;
    assert.ok(Math.abs(match.ball.z - receiver.z - sampleBallHeight('receive', receiver.animation.tick, receiver.id)) < .2);
    assert.ok(Math.abs(match.ball.x - receiver.x - receiver.facing * sampleBallForward('receive', receiver.animation.tick, receiver.id)) < .6);
    assert.ok(receiveFrame >= 0);
    assert.equal(match.score[0] + match.score[1], 0);
  }
});
