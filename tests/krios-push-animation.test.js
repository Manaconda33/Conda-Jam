import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, anchorTick, athleteBallTrackSource, sampleAnimation } from '../src/core/animation.js';
import { createInput, createMatch, stepMatch } from '../src/core/simulation.js';
import { teams } from '../src/content/teams.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';
import { decodeImage, inspectAtlas } from '../tools/animation-assets.mjs';

const id = 'krios';

test('J.128 Krios push has eleven reviewed ball-free poses with contact at tick8', async () => {
  const character = animationAssetManifest.characters[id];
  const clip = character.directions.right.push;
  const path = fileURLToPath(new URL(`../${clip.src.slice(2)}`, import.meta.url));
  assert.equal(character.mirrorSafe, true);
  assert.equal(character.mirrorReview.status, 'reviewed');
  assert.equal(clip.reviewed, true);
  assert.equal(clip.frames.length, 11);
  assert.equal(new Set(clip.frames.map(frame => frame.hash)).size, 11);
  assert.equal(clip.sha256, createHash('sha256').update(readFileSync(path)).digest('hex'));
  const decoded = await decodeImage(path);
  assert.deepEqual([decoded.width, decoded.height], [1408, 96]);
  const atlas = await inspectAtlas(path, clip.frames);
  assert.equal(atlas.frames.length, 11);
  assert.ok(atlas.frames.every(frame => frame.visiblePixels > 0 && !frame.error));

  assert.deepEqual(animationClips.push.frames.map(frame => frame.duration), [2,2,2,1,1,2,2,3,3,3,3]);
  assert.equal(anchorTick('push', 'contact'), 8);
  assert.equal(sampleAnimation('push', 8).frame, 5);
  const starts = [0,2,4,6,7,8,10,12,15,18,21];
  const images = new Map([[clip.src, { complete: true, naturalWidth: 1408, naturalHeight: 96, file: clip.src }]]);
  for (const [frame, tick] of starts.entries()) {
    assert.equal(sampleAnimation('push', tick).frame, frame);
    for (const [facing, flip] of [[1,false],[-1,true]]) {
      const selected = selectProductionSprite({ id, facing, animation: { clip: 'push', tick } }, { manifest: animationAssetManifest, images });
      assert.equal(selected?.src, clip.src);
      assert.equal(selected?.frame, frame);
      assert.equal(selected?.flip, flip);
    }
  }
  assert.equal(clip.height, undefined);
  assert.equal(clip.forward, undefined);
  assert.equal(athleteBallTrackSource(id, 'push', 'height'), null);
  assert.equal(athleteBallTrackSource(id, 'push', 'forward'), null);
  assert.match(clip.provenance.ballPolicy, /no ball artwork or ball track/i);

  const runtime = JSON.parse(readFileSync(new URL('../tools/generate-art/previews/j128-krios-push-candidate/attempt-02/registered-runtime/report.json', import.meta.url), 'utf8'));
  assert.equal(runtime.runtimeIntegration, true);
  assert.equal(runtime.candidateAtlasInjected, false);
  assert.equal(runtime.atlas, clip.src);
  assert.equal(runtime.candidateAtlasSha256, clip.sha256);
  assert.equal(runtime.courtY, 90);
  assert.equal(runtime.captureCount, 48);
  assert.deepEqual(runtime.uncaughtBrowserErrors, []);
  const showcases = runtime.runs.filter(run => run.mode === 'all-frame-showcase-failed-contact-roll');
  assert.equal(showcases.length, 4);
  for (const run of showcases) {
    assert.equal(run.captures.length, 11);
    assert.deepEqual(run.captures.map(capture => capture.frame), starts.map((_, index) => index));
    assert.ok(run.captures.every(capture => capture.src === clip.src && capture.flip === (run.facing < 0)));
    assert.ok(run.captures.every(capture => capture.ball.mode === 'dead' && capture.ball.ownerId === null));
  }
  const contacts = runtime.runs.filter(run => run.mode === 'successful-noncarrier-contact');
  assert.equal(contacts.length, 4);
  for (const contact of contacts) {
    assert.equal(contact.tick, 8);
    assert.equal(contact.frame, 5);
    assert.equal(contact.knockdowns, 1);
    assert.equal(contact.target.clip, 'fall');
    assert.ok(contact.target.stun > 0);
    assert.deepEqual(contact.ball, { mode: 'dead', ownerId: null });
  }
});

test('Krios push contact knocks down a close off-ball opponent without changing ball ownership', () => {
  const home = teams.find(team => team.id === 'scoria-rams');
  const away = teams.find(team => team.id === 'blackthorn-court-kings');
  for (const facing of [1, -1]) {
    const match = createMatch({ quarterSeconds: 180, seed: 2654435761, home, away });
    const player = match.players.find(value => value.id === id);
    const target = match.players.find(value => value.team !== player.team && !value.captain);
    match.players = [player, target];
    match.possession = target.team;
    Object.assign(player, { x: 100, y: 93, vx: 0, vy: 0, vz: 0, z: 0, facing, hasBall: false, stun: 0, knockdowns: 0, animation: { clip: 'idle', tick: 0 } });
    Object.assign(target, { x: 100 + facing * 4.7, y: 90, vx: 0, vy: 0, vz: 0, z: 0, facing: -facing, hasBall: false, stun: 0, animation: { clip: 'idle', tick: 0 } });
    Object.assign(match.ball, { mode: 'dead', ownerId: null, targetId: null, attemptId: null, scored: false, vx: 0, vy: 0, vz: 0, x: 100, y: 90, z: 0 });
    match.rng = 2654435761;
    stepMatch(match, [createInput(player.id, { shovePressed: true }), createInput(target.id)]);
    assert.equal(player.animation.clip, 'push');
    while (player.animation.tick < 7) {
      assert.equal(target.stun, 0, 'no knockdown before contact tick8');
      stepMatch(match, [createInput(player.id), createInput(target.id)]);
    }
    assert.equal(player.animation.tick, 7);
    stepMatch(match, [createInput(player.id), createInput(target.id)]);
    assert.equal(player.animation.tick, 8);
    assert.equal(sampleAnimation('push', player.animation.tick).frame, 5);
    assert.equal(player.knockdowns, 1);
    assert.ok(target.stun > 0);
    assert.equal(target.animation.clip, 'fall');
    assert.equal(target.hasBall, false);
    assert.equal(match.ball.mode, 'dead');
    assert.equal(match.ball.ownerId, null);
  }
});
