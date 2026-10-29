import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, anchorTick, sampleAnimation, sampleBallForward, sampleBallHeight } from '../src/core/animation.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';
import { createInput, createMatch, stepMatch } from '../src/core/simulation.js';
import { teams } from '../src/content/teams.js';

const athleteId = 'leo';
const atlas = './public/assets/animation/leo-pickup-right.webp';
const source = '../tools/generate-art/sources/j109-leo-pickup-generated-raw.png';
const height = [.95, .65, .1, 0, 1.1];
const forward = [6, 9, 12, 11.5, 8];
const clip = animationAssetManifest.characters[athleteId].directions.right.pickup;
const { PNG } = createRequire(import.meta.url)('pngjs');

test('J.109 Leo pickup registers five reviewed poses and separate ball provenance', () => {
  assert.ok(clip);
  assert.equal(clip.reviewed, true);
  assert.equal(clip.src, atlas);
  assert.equal(clip.columns, 3);
  assert.equal(clip.rows, 2);
  assert.equal(clip.frames.length, 5);
  assert.equal(new Set(clip.frames.map(frame => frame.hash)).size, 5);
  assert.equal(clip.provenance.issue, 'J.109');
  assert.equal(clip.provenance.generationId, 'exec-3367d441-68b5-4b6a-8591-5dfbbe77ace3');
  assert.equal(clip.provenance.review.status, 'accepted');
  assert.equal(clip.provenance.ballTrack.status, 'accepted-native-review');
  assert.deepEqual(clip.provenance.ballTrack.height, height);
  assert.deepEqual(clip.provenance.ballTrack.forward, forward);
  assert.deepEqual(animationClips.pickup.frames.map(frame => frame.duration), [2, 3, 2, 1, 4]);
  assert.equal(anchorTick('pickup', 'grab'), 7);
  assert.equal(sampleAnimation('pickup', 7).frame, 3);
  const webp = readFileSync(new URL('../public/assets/animation/leo-pickup-right.webp', import.meta.url));
  const raw = readFileSync(new URL(source, import.meta.url));
  assert.equal(createHash('sha256').update(webp).digest('hex'), clip.sha256);
  assert.equal(createHash('sha256').update(raw).digest('hex'), clip.provenance.sourceSha256);
  const png = PNG.sync.read(raw);
  assert.deepEqual([png.width, png.height], [1536, 1024]);
  for (const facing of [1, -1]) {
    const sprite = selectProductionSprite({ id: athleteId, facing, animation: { clip: 'pickup', tick: 7 } }, {
      manifest: animationAssetManifest,
      images: new Map([[atlas, { complete: true, naturalWidth: 336, naturalHeight: 192, file: atlas }]])
    });
    assert.equal(sprite?.atlas.file, atlas);
    assert.equal(sprite?.frame, 3);
    assert.equal(sprite?.flip, facing < 0);
  }
});

test('Leo picks up the loose ball at tick7 and carries through recovery in both facings', () => {
  const home = teams.find(team => team.roster.some(player => player.id === athleteId));
  const away = teams.find(team => team !== home);
  for (const facing of [1, -1]) {
    const match = createMatch({ quarterSeconds: 60, seed: 109, home, away, homePartnerId: athleteId });
    const leo = match.players.find(player => player.id === athleteId);
    const duplicate = match.players.find(player => player !== leo && player.id === athleteId);
    duplicate.id = 'leo-pickup-partner';
    for (const player of match.players) {
      player.hasBall = false;
      player.vx = player.vy = player.vz = player.z = 0;
      if (player.team !== leo.team) { player.x = 15; player.y = 0; }
      else if (player !== leo) { player.x = facing > 0 ? 45 : 155; player.y = 80; }
    }
    leo.x = 100; leo.y = 50; leo.facing = facing;
    match.phase = 'playing'; match.pause = false;
    Object.assign(match.ball, { mode: 'loose', ownerId: null, targetId: null, lastTouch: match.players.find(player => player.team !== leo.team).id, x: leo.x, y: leo.y, z: 0, vx: 0, vy: 0, vz: 0 });
    const neutral = () => match.players.map(player => createInput(player.id));
    stepMatch(match, neutral());
    assert.equal(leo.animation.clip, 'pickup');
    for (let tick = 0; tick < 7; tick++) {
      assert.equal(leo.hasBall, false);
      assert.equal(match.ball.mode, 'loose');
      stepMatch(match, neutral());
    }
    assert.equal(leo.animation.tick, 7);
    assert.equal(sampleAnimation('pickup', 7).frame, 3);
    assert.equal(leo.hasBall, true);
    assert.equal(match.ball.mode, 'carried');
    assert.equal(match.ball.ownerId, athleteId);
    assert.equal(match.ball.x, leo.x + facing * sampleBallForward('pickup', 7, athleteId));
    assert.equal(match.ball.z, leo.z + sampleBallHeight('pickup', 7, athleteId));
    assert.equal(sampleBallHeight('pickup', 7, athleteId), 0);
    stepMatch(match, neutral());
    assert.equal(leo.animation.tick, 8);
    assert.equal(leo.hasBall, true);
    assert.equal(match.ball.ownerId, athleteId);
    assert.equal(match.ball.x, leo.x + facing * sampleBallForward('pickup', 8, athleteId));
    assert.equal(match.ball.z, leo.z + sampleBallHeight('pickup', 8, athleteId));
  }
});
