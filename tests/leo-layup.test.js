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
const atlas = './public/assets/animation/leo-layup-right.webp';
const rawSource = '../tools/generate-art/sources/j110-leo-layup-generated-raw.png';
const height = [.95, .8, 2.0, 2.6, 2.35, 1.8, .95, .6];
const forward = [5, 3, 5, 4.5, 14, 11, 7, 5];
const clip = animationAssetManifest.characters[athleteId].directions.right.layup;
const { PNG } = createRequire(import.meta.url)('pngjs');

test('J.110 Leo layup registers eight distinct poses and separate ball provenance', () => {
  assert.ok(clip);
  assert.equal(clip.reviewed, true);
  assert.equal(clip.src, atlas);
  assert.equal(clip.columns, 4);
  assert.equal(clip.rows, 2);
  assert.equal(clip.frames.length, 8);
  assert.equal(new Set(clip.frames.map(frame => frame.hash)).size, 8);
  assert.equal(clip.provenance.issue, 'J.110');
  assert.equal(clip.provenance.generationId, 'exec-ed078327-ebab-4bd1-b390-ef2fde79cbce');
  assert.equal(clip.provenance.review.status, 'accepted');
  assert.equal(clip.provenance.ballTrack.status, 'accepted-native-review');
  assert.deepEqual(clip.provenance.ballTrack.height, height);
  assert.deepEqual(clip.provenance.ballTrack.forward, forward);
  assert.deepEqual(animationClips.layup.frames.map(frame => frame.duration), [2, 3, 3, 2, 1, 3, 4, 4]);
  assert.equal(anchorTick('layup', 'takeoff'), 2);
  assert.equal(anchorTick('layup', 'release'), 10);
  assert.equal(anchorTick('layup', 'peak'), 10);
  assert.equal(anchorTick('layup', 'finish'), 18);
  assert.equal(sampleAnimation('layup', 10).frame, 4);
  const raw = readFileSync(new URL(rawSource, import.meta.url));
  const webp = readFileSync(new URL('../public/assets/animation/leo-layup-right.webp', import.meta.url));
  assert.equal(createHash('sha256').update(raw).digest('hex'), clip.provenance.sourceSha256);
  assert.equal(createHash('sha256').update(webp).digest('hex'), clip.sha256);
  const png = PNG.sync.read(raw);
  assert.deepEqual([png.width, png.height], [1536, 1024]);
  for (const facing of [1, -1]) {
    const sprite = selectProductionSprite({ id: athleteId, facing, animation: { clip: 'layup', tick: 10 } }, {
      manifest: animationAssetManifest,
      images: new Map([[atlas, { complete: true, naturalWidth: 320, naturalHeight: 192, file: atlas }]])
    });
    assert.equal(sprite?.atlas.file, atlas);
    assert.equal(sprite?.frame, 4);
    assert.equal(sprite?.flip, facing < 0);
  }
});

test('Leo keeps the ball through frame4, releases once at tick10, and follows the separate track in both facings', () => {
  const home = teams.find(team => team.roster.some(player => player.id === athleteId));
  const away = teams.find(team => team !== home);
  for (const facing of [1, -1]) {
    const match = createMatch({ quarterSeconds: 60, seed: 110, home, away, homePartnerId: athleteId });
    const leo = match.players.find(player => player.id === athleteId);
    const duplicate = match.players.find(player => player !== leo && player.id === athleteId);
    duplicate.id = 'leo-layup-partner';
    for (const player of match.players) {
      player.hasBall = false;
      player.vx = player.vy = player.vz = 0;
      if (player.team !== leo.team) { player.x = 20; player.y = 0; }
      else if (player !== leo) { player.x = 120; player.y = 80; }
    }
    leo.x = 182; leo.y = 50; leo.facing = facing; leo.hasBall = true;
    match.phase = 'playing'; match.pause = false;
    Object.assign(match.ball, { x: leo.x, y: leo.y, z: 0, mode: 'carried', ownerId: leo.id, targetId: null, lastTouch: leo.id, aerialTargetId: null, vx: 0, vy: 0, vz: 0 });
    const neutral = () => match.players.map(player => createInput(player.id));
    stepMatch(match, neutral().map(input => input.playerId === leo.id ? createInput(leo.id, { shootPressed: true, layupVariant: 'normal' }) : input));
    assert.equal(leo.animation.clip, 'layup');
    assert.equal(leo.animation.tick, 0);
    while (leo.animation.tick < 10) {
      assert.equal(leo.hasBall, true);
      assert.equal(match.ball.mode, 'carried');
      assert.equal(match.ball.ownerId, leo.id);
      stepMatch(match, neutral());
    }
    assert.equal(anchorTick('layup', 'release'), 10);
    assert.equal(sampleAnimation('layup', leo.animation.tick).frame, 4);
    assert.equal(leo.fga, 1);
    assert.equal(leo.hasBall, false);
    assert.equal(match.ball.mode, 'shot');
    assert.equal(match.ball.ownerId, null);
    assert.equal(sampleBallHeight('layup', 10, athleteId), 2.35);
    assert.equal(sampleBallForward('layup', 10, athleteId), 14);
    assert.ok(Math.abs(match.ball.x - match.ball.vx - leo.x - facing * 14) < 1e-9);
    const releaseZ = match.ball.z - (match.ball.vz + .026);
    const renderedRelease = releaseZ <= 3 ? releaseZ * 28 : 84 + (releaseZ - 3) * 3;
    assert.ok(Math.abs(renderedRelease - (leo.z * 7 + sampleBallHeight('layup', 10, athleteId) * 28)) < 1e-9);
    while (leo.animation.tick < anchorTick('layup', 'finish')) stepMatch(match, neutral());
    assert.equal(leo.fga, 1);
    assert.equal(match.ball.ownerId, null);
  }
});
