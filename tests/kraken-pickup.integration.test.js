import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { anchorTick, sampleAnimation, sampleBallForward, sampleBallHeight } from '../src/core/animation.js';
import { createInput, createMatch, stepMatch } from '../src/core/simulation.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';
import { teams } from '../src/content/teams.js';

const athleteId = 'kraken';
const atlas = './public/assets/animation/kraken-pickup-right.webp';
const height = [0.65, 0.45, 0.2, 0.2, 0.68];
const forward = [3.5, 4.5, 5.5, 4.5, 2.5];
const clip = animationAssetManifest.characters[athleteId].directions.right.pickup;

test('J.07 Kraken pickup registers five reviewed poses with a separate track', () => {
  assert.equal(clip.reviewed, true);
  assert.equal(clip.src, atlas);
  assert.equal(clip.columns, 5);
  assert.equal(clip.rows, 1);
  assert.equal(clip.frames.length, 5);
  assert.equal(new Set(clip.frames.map(frame => frame.hash)).size, 5);
  assert.equal(clip.source, 'imagegen');
  assert.equal(clip.provenance.classification, 'bespoke-source-composite');
  assert.equal(clip.provenance.review.status, 'accepted');
  assert.equal(clip.provenance.generationId, 'not exposed by the image-generation tool response');
  assert.equal(anchorTick('pickup', 'grab'), 7);
  assert.equal(sampleAnimation('pickup', 7).frame, 3);
  assert.deepEqual(clip.provenance.runtimeBallTrack, {
    height, forward, reviewed: true, status: 'accepted-normal-loader-review',
    review: 'tools/generate-art/previews/kraken-pickup5-attempt05/track-candidate/attempt-08/INDEPENDENT_GAMEPLAY_REVIEW_2026-10-29.md'
  });
  const bytes = readFileSync(new URL('../public/assets/animation/kraken-pickup-right.webp', import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), clip.sha256);
  for (const facing of [1, -1]) {
    const sprite = selectProductionSprite({ id: athleteId, facing, animation: { clip: 'pickup', tick: 7 } }, {
      manifest: animationAssetManifest,
      images: new Map([[atlas, { complete: true, naturalWidth: 400, naturalHeight: 96, file: atlas }]])
    });
    assert.equal(sprite?.atlas.file, atlas);
    assert.equal(sprite?.frame, 3);
    assert.equal(sprite?.flip, facing < 0);
  }
});

test('Kraken grabs the loose ball on tick7 and holds it in both facings', () => {
  const home = teams.find(team => team.roster.some(player => player.id === athleteId));
  const away = teams.find(team => team !== home);
  for (const facing of [1, -1]) {
    const match = createMatch({ quarterSeconds: 60, seed: 907, home, away, homePartnerId: athleteId });
    const kraken = match.players.find(player => player.id === athleteId);
    const duplicate = match.players.find(player => player !== kraken && player.id === athleteId);
    duplicate.id = 'kraken-pickup-partner';
    for (const player of match.players) {
      player.hasBall = false;
      player.vx = player.vy = player.vz = player.z = 0;
      if (player.team !== kraken.team) { player.x = 15; player.y = 0; player.stun = 999; }
      else if (player !== kraken) { player.x = facing > 0 ? 45 : 155; player.y = 80; player.stun = 999; }
    }
    kraken.x = 100; kraken.y = 75; kraken.facing = facing;
    match.phase = 'playing'; match.pause = false;
    Object.assign(match.ball, {
      mode: 'loose', ownerId: null, targetId: null, lastTouch: 'opponent',
      x: kraken.x + facing * 2.5, y: kraken.y + 1.5, z: 0.2,
      vx: facing * 0.09, vy: 0, vz: 0
    });
    const neutral = () => match.players.map(player => createInput(player.id));
    stepMatch(match, neutral());
    assert.equal(kraken.animation.clip, 'pickup');
    for (let tick = 0; tick < anchorTick('pickup', 'grab'); tick++) {
      assert.equal(kraken.hasBall, false);
      assert.equal(match.ball.mode, 'loose');
      stepMatch(match, neutral());
    }
    assert.equal(kraken.animation.tick, 7);
    assert.equal(sampleAnimation('pickup', 7).frame, 3);
    assert.equal(kraken.hasBall, true);
    assert.equal(match.ball.mode, 'carried');
    assert.equal(match.ball.ownerId, athleteId);
    assert.ok(match.events.some(event => event.text === 'Kraken grabs the ball'));
    assert.equal(sampleBallHeight('pickup', 7, athleteId), 0.2);
    assert.equal(match.ball.x, kraken.x + facing * sampleBallForward('pickup', 7, athleteId));
    assert.equal(match.ball.z, kraken.z + sampleBallHeight('pickup', 7, athleteId));
    stepMatch(match, neutral());
    assert.equal(kraken.animation.tick, 8);
    assert.equal(match.ball.ownerId, athleteId);
    assert.equal(sampleBallHeight('pickup', 8, athleteId), 0.68);
    assert.equal(sampleBallForward('pickup', 8, athleteId), 2.5);
    assert.equal(match.ball.x, kraken.x + facing * 2.5);
    assert.equal(match.ball.z, kraken.z + 0.68);
    stepMatch(match, neutral());
    stepMatch(match, neutral());
    assert.equal(match.ball.ownerId, athleteId);
    assert.equal(kraken.animation.tick, 10);
    assert.equal(match.ball.x, kraken.x + facing * 2.5);
    assert.equal(match.ball.z, kraken.z + 0.68);
  }
});
