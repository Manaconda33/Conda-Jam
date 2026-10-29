import test from 'node:test';
import assert from 'node:assert/strict';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { anchorTick, sampleAnimation, sampleBallHeight, sampleBallForward } from '../src/core/animation.js';
import { createMatch, createInput, stepMatch } from '../src/core/simulation.js';

test("J.07 Kraken pass-behind uses its reviewed atlas and reaches Marin's incoming-facing hands in both facings", () => {
  const character = animationAssetManifest.characters.kraken;
  const entry = character.directions.right['pass-behind'];
  assert.equal(entry.reviewed, true);
  assert.equal(entry.source, 'imagegen');
  assert.equal(entry.provenance.generationId, 'exec-fd0b1354-ad58-4283-b43b-bf6eb19f0234');
  assert.equal(entry.provenance.runtimeBallTrack.reviewed, true);
  assert.equal(entry.provenance.runtimeBallTrack.releaseVz, .294);
  assert.equal(entry.frames.length, 6);
  assert.equal(new Set(entry.frames.map(frame => frame.hash)).size, 6);
  assert.equal(entry.columns, 3);
  assert.equal(entry.rows, 2);
  assert.equal(character.mirrorSafe, true);
  assert.equal(character.mirrorReview.status, 'reviewed');
  assert.equal(anchorTick('pass-behind', 'release'), 7);
  assert.deepEqual(entry.provenance.runtimeBallTrack.height, [1.0, 1.1, 1.2, 1.25, 1.2, 1.0]);
  assert.deepEqual(entry.provenance.runtimeBallTrack.forward, [5, 2, -5, -7, -9, 4]);
  assert.equal(sampleBallHeight('pass-behind', 0, 'kraken'), 1.0);
  assert.equal(sampleBallForward('pass-behind', 7, 'kraken'), -7);

  for (const facing of [1, -1]) {
    const match = createMatch({ quarterSeconds: 60, seed: 729, home: { roster: [{ id: 'kraken' }, { id: 'marin-dusk' }] } });
    const passer = match.players.find(player => player.id === 'kraken');
    const receiver = match.players.find(player => player.id === 'marin-dusk');
    passer.x = facing > 0 ? 80 : 120;
    passer.y = 75;
    passer.facing = facing;
    receiver.x = facing > 0 ? 99.2 : 100.8;
    receiver.y = 79;
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
      x: passer.x + facing * sampleBallForward('pass-behind', 0, passer.id), y: passer.y,
      z: sampleBallHeight('pass-behind', 0, passer.id), vx: 0, vy: 0, vz: 0,
    });
    const inputs = action => match.players.map(player => createInput(player.id, player === passer ? action : {}));
    stepMatch(match, inputs({ passPressed: true, passVariant: 'pass-behind' }));
    assert.equal(passer.animation.clip, 'pass-behind');
    assert.equal(passer.animation.tick, 0);

    while (passer.animation.tick < anchorTick('pass-behind', 'release')) {
      assert.equal(match.ball.ownerId, passer.id, 'Kraken carries the ball through the final behind-back gather');
      stepMatch(match, inputs({}));
    }
    assert.equal(passer.animation.tick, 7);
    assert.equal(match.ball.mode, 'pass');
    assert.equal(match.ball.ownerId, null);
    assert.equal(match.ball.lastTouch, passer.id);
    assert.ok(Math.abs(match.ball.vz - (.294 - .026)) < 1e-9, 'the behind-back pass uses its calibrated release arc');

    let previous = { x: match.ball.x, y: match.ball.y, z: match.ball.z };
    let catchDelta = null;
    for (let tick = 0; tick < 36 && match.ball.ownerId !== receiver.id; tick++) {
      stepMatch(match, inputs({}));
      if (match.ball.ownerId === receiver.id) catchDelta = { x: match.ball.x - previous.x, y: match.ball.y - previous.y, z: match.ball.z - previous.z };
      else {
        assert.equal(match.ball.mode, 'pass');
        assert.ok(match.ball.z > 0, `ball remains airborne before Marin's catch (facing ${facing})`);
        previous = { x: match.ball.x, y: match.ball.y, z: match.ball.z };
      }
    }
    assert.equal(match.ball.ownerId, receiver.id);
    assert.ok(Math.hypot(catchDelta.x, catchDelta.y, catchDelta.z) < 1.3, `total one-frame correction stays below 1.3 units: ${JSON.stringify(catchDelta)}`);
    assert.ok(Math.abs(catchDelta.x) < 1.1, `horizontal catch correction stays small: ${catchDelta.x}`);
    assert.ok(Math.abs(catchDelta.z) < .3, `vertical catch correction stays small: ${catchDelta.z}`);
    assert.equal(receiver.animation.clip, 'receive');
    const receiveFrame = sampleAnimation('receive', receiver.animation.tick).frame;
    assert.ok(Math.abs(match.ball.z - receiver.z - sampleBallHeight('receive', receiver.animation.tick, receiver.id)) < .2);
    assert.ok(Math.abs(match.ball.x - receiver.x - receiver.facing * sampleBallForward('receive', receiver.animation.tick, receiver.id)) < .6);
    assert.ok(receiveFrame >= 0);
    assert.equal(match.score[0] + match.score[1], 0);
  }
});
