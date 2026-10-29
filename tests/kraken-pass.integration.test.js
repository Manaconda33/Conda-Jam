import test from 'node:test';
import assert from 'node:assert/strict';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { anchorTick, sampleAnimation, sampleBallHeight, sampleBallForward, sampleBallReleaseVz } from '../src/core/animation.js';
import { createMatch, createInput, stepMatch } from '../src/core/simulation.js';

test('J.07 Kraken pass reaches Marin’s receive track without a floor bounce or catch snap', () => {
  const entry = animationAssetManifest.characters.kraken.directions.right.pass;
  assert.equal(entry.reviewed, true);
  assert.equal(entry.source, 'imagegen');
  assert.equal(entry.provenance.generationId, 'exec-29a4da42-994e-4a1f-82eb-0fe919e3a283');
  const height = [1.25, 1.25, 1.3, 1.5, 1.35, 1.05];
  const forward = [2, 4, 5, 6, 12, 8];
  assert.deepEqual(entry.provenance.runtimeBallTrack, { height, forward, releaseVz: .2, reviewed: true });
  assert.equal(entry.frames.length, 6);
  assert.equal(new Set(entry.frames.map(frame => frame.hash)).size, 6);
  assert.equal(anchorTick('pass', 'release'), 5);
  assert.equal(sampleBallReleaseVz('pass', 'kraken'), .2);
  assert.equal(sampleBallReleaseVz('pass', 'krios'), null, 'other passers retain the existing default flight');

  for (const facing of [1, -1]) {
    const match = createMatch({ quarterSeconds: 60, seed: 707, home: { roster: [{ id: 'kraken' }, { id: 'mate' }] } });
    const passer = match.players.find(player => player.id === 'kraken');
    const receiver = match.players.find(player => player.id === 'mate');
    passer.x = 100;
    passer.y = 50;
    passer.facing = facing;
    receiver.x = 100 + facing * 26;
    receiver.y = 50;
    receiver.facing = -facing;
    for (const opponent of match.players.filter(player => player.team !== passer.team)) {
      opponent.x = 10;
      opponent.y = 0;
    }
    const inputs = action => match.players.map(player => createInput(player.id, player === passer ? action : {}));
    stepMatch(match, inputs({ passPressed: true, passVariant: 'pass' }));
    assert.equal(passer.animation.clip, 'pass');
    assert.equal(passer.animation.tick, 0);

    while (passer.animation.tick < anchorTick('pass', 'release')) {
      assert.equal(match.ball.ownerId, passer.id, 'Kraken retains the ball through the final gather');
      stepMatch(match, inputs({}));
    }
    assert.equal(match.ball.mode, 'pass');
    assert.equal(match.ball.ownerId, null);
    assert.equal(match.ball.lastTouch, passer.id);
    assert.ok(Math.abs(match.ball.vz - (.2 - .026)) < 1e-9);

    let previous = { x: match.ball.x, z: match.ball.z };
    let catchDelta = null;
    for (let tick = 0; tick < 24 && match.ball.ownerId !== receiver.id; tick++) {
      stepMatch(match, inputs({}));
      if (match.ball.ownerId === receiver.id) catchDelta = { x: match.ball.x - previous.x, z: match.ball.z - previous.z };
      else {
        assert.equal(match.ball.mode, 'pass');
        assert.ok(match.ball.z > 0, `ball stays airborne before Marin catches it (facing ${facing})`);
        previous = { x: match.ball.x, z: match.ball.z };
      }
    }
    assert.equal(match.ball.ownerId, receiver.id, 'Marin receives the pass in both directions');
    assert.ok(Math.abs(catchDelta.x) < 1, `horizontal catch correction stays small: ${catchDelta.x}`);
    assert.ok(Math.abs(catchDelta.z) < .6, `vertical catch correction stays small: ${catchDelta.z}`);
    assert.equal(receiver.animation.clip, 'receive');
    assert.equal(sampleAnimation('receive', receiver.animation.tick).frame, 2);
    assert.ok(Math.abs(match.ball.z - receiver.z - sampleBallHeight('receive', receiver.animation.tick, receiver.id)) < .2);
    assert.ok(Math.abs(match.ball.x - receiver.x - receiver.facing * sampleBallForward('receive', receiver.animation.tick, receiver.id)) < .6);
    assert.equal(match.score[0] + match.score[1], 0);
  }
  assert.equal(anchorTick('pass', 'release'), 5);
});
