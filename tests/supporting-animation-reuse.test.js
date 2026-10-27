import test from 'node:test';
import assert from 'node:assert/strict';
import { teams } from '../src/content/teams.js';
import { supportingAnimationLibraries, supportingLibrarySummary } from '../src/content/supporting-animation-libraries.js';
import { paletteVariantFor } from '../src/render/uniform-palette.js';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';
import { animationClips, athleteBallTrackSource, sampleBallForward, sampleBallHeight } from '../src/core/animation.js';

test('support reuse maps all 70 noncaptains and preserves completed libraries', () => {
  const players = teams.flatMap(team => team.roster);
  const supporters = players.filter(player => !player.captain);
  assert.equal(supportingLibrarySummary.supportingPlayers, 70);
  assert.equal(Object.keys(supportingAnimationLibraries).length, 70);
  assert.equal(supporters.filter(player => supportingAnimationLibraries[player.id].mode === 'shared').length, 63);
  assert.equal(supporters.filter(player => supportingAnimationLibraries[player.id].mode === 'original').length, 7);
  assert.equal(players.filter(player => player.captain).some(player => supportingAnimationLibraries[player.id]), false);
  for (const player of supporters) {
    const assignment = supportingAnimationLibraries[player.id];
    assert.ok(assignment.donorId);
    if (assignment.mode === 'shared') {
      const donor = supporters.find(candidate => candidate.id === assignment.donorId);
      assert.ok(['human', 'athletic-variant'].includes(donor.rig) && ['human', 'athletic-variant'].includes(player.rig));
      assert.notEqual(donor.captain, true);
      assert.deepEqual(assignment.targetPalette, player.palette);
    }
  }
});

test('palette derivation changes matching uniform colors, preserves nonmatches and alpha', () => {
  const originalDocument = globalThis.document;
  const created = [];
  globalThis.document = { createElement() {
    const canvas = { width: 0, height: 0 };
    const image = new Uint8ClampedArray(12);
    const context = {
      drawImage(source) { image.set(source.pixels); },
      getImageData() { return { data: image }; },
      putImageData(value) { image.set(value.data); },
    };
    canvas.getContext = () => context;
    canvas.snapshot = () => [...image];
    created.push(canvas);
    return canvas;
  }};
  try {
    const src = { naturalWidth: 1, naturalHeight: 3, pixels: new Uint8ClampedArray([230,80,60,255, 21,157,155,255, 20,45,63,180]) };
    const result = paletteVariantFor(src, 'test-atlas', ['#159d9b','#773ec2'], ['#e4572e','#f1c40f'], [{ x: 0, y: 0, w: 1, h: 3 }], { secondary: 'cool-dark-shorts' });
    const pixels = result.snapshot();
    assert.deepEqual(pixels.slice(0,4), [230,80,60,255]);
    assert.notDeepEqual(pixels.slice(4,7), [21,157,155]);
    assert.equal(pixels[7], 255);
    assert.notDeepEqual(pixels.slice(8,11), [20,45,63]);
    assert.equal(pixels[11], 180);
    assert.equal(paletteVariantFor(src, 'test-atlas', ['#159d9b','#773ec2'], ['#e4572e','#f1c40f'], [{ x: 0, y: 0, w: 1, h: 3 }], { secondary: 'cool-dark-shorts' }), result);
    assert.equal(created.length, 1);
  } finally { globalThis.document = originalDocument; }
});

test('palette cache bounds derived atlases and refreshes recent variants', () => {
  const originalDocument = globalThis.document, created = [];
  globalThis.document = { createElement() {
    const canvas = { width: 0, height: 0 }, pixels = new Uint8ClampedArray(4);
    const context = { drawImage(source) { pixels.set(source.pixels); }, getImageData() { return { data: pixels }; }, putImageData() {} };
    canvas.getContext = () => context; created.push(canvas); return canvas;
  }};
  try {
    const source = { naturalWidth: 1, naturalHeight: 1, pixels: new Uint8ClampedArray(4) }, frames = [{ x: 0, y: 0, w: 1, h: 1 }];
    const colors = ['#e4572e', '#f1c40f', '#238ae6', '#28a745', '#bd34c9'];
    for (const color of colors) paletteVariantFor(source, 'lru-atlas', ['#159d9b', '#773ec2'], [color, '#111111'], frames, {});
    assert.equal(created.length, 5);
    const recent = paletteVariantFor(source, 'lru-atlas', ['#159d9b', '#773ec2'], [colors.at(-1), '#111111'], frames, {});
    assert.equal(created.length, 5);
    assert.ok(recent);
    paletteVariantFor(source, 'lru-atlas', ['#159d9b', '#773ec2'], [colors[0], '#111111'], frames, {});
    assert.equal(created.length, 6, 'oldest cached variant was evicted');
  } finally { globalThis.document = originalDocument; }
});

test('incomplete support resolves every action from its compatible donor and keeps recipient track metadata', () => {
  const id = 'briar-foxglove', donor = supportingAnimationLibraries[id].donorId;
  const clip = animationAssetManifest.characters[donor].directions.right.shoot, src = clip.src;
  const donorIdle = animationAssetManifest.characters[donor].directions.right['idle-ball'];
  const images = new Map([[src, { complete: true, naturalWidth: clip.columns * clip.frames[0].w, naturalHeight: clip.rows * clip.frames[0].h }], [donorIdle.src, { complete: true, naturalWidth: 160, naturalHeight: 192 }]]);
  const reviewedAssignment = { ...supportingAnimationLibraries[id], review: 'accepted' };
  const sprite = selectProductionSprite({ id, captain: false, palette: ['#b64d27','#f2d6aa'], facing: 1, animation: { clip: 'shoot', tick: 0 } }, { manifest: animationAssetManifest, images, libraries: { [id]: reviewedAssignment } });
  assert.ok(sprite);
  assert.equal(sprite.src, src);
  assert.equal(sprite.atlas, images.get(src));
  assert.equal(sprite.clip, 'shoot');
  assert.equal(sprite.frame, 0);
});

test('every supporting player resolves all 29 clips in both facings with derived canvas dimensions', () => {
  const originalDocument = globalThis.document;
  globalThis.document = { createElement() {
    const canvas = { width: 0, height: 0, pixels: null };
    const context = {
      drawImage(source) { canvas.pixels = new Uint8ClampedArray(source.pixels); },
      getImageData() { return { data: canvas.pixels }; },
      putImageData(image) { canvas.pixels = new Uint8ClampedArray(image.data); },
    };
    canvas.getContext = () => context;
    return canvas;
  }};
  try {
    const players = teams.flatMap(team => team.roster).filter(player => !player.captain);
    for (const player of players) {
      const assignment = supportingAnimationLibraries[player.id], libraryId = assignment.donorId;
      const character = animationAssetManifest.characters[libraryId], images = new Map();
      for (const direction of Object.values(character.directions)) for (const clip of Object.values(direction)) {
        if (images.has(clip.src)) continue;
        const width = Math.max(...clip.frames.map(frame => frame.x + frame.w));
        const height = Math.max(...clip.frames.map(frame => frame.y + frame.h));
        images.set(clip.src, { complete: true, naturalWidth: width, naturalHeight: height, pixels: new Uint8ClampedArray(width * height * 4) });
      }
      for (const facing of [1, -1]) for (const clip of Object.keys(animationClips)) {
        const sprite = selectProductionSprite({ ...player, facing, animation: { clip, tick: 0 } }, { manifest: animationAssetManifest, images });
        assert.ok(sprite, `${player.id} ${clip} facing ${facing} selects a sprite`);
        assert.equal(sprite.clip, clip);
        assert.equal(sprite.libraryId, libraryId);
        assert.equal(sprite.classification, assignment.mode === 'shared' ? 'derived-palette' : 'original-authored');
      }
    }
  } finally { globalThis.document = originalDocument; }
});

test('every supporting player has a recipient or assigned donor ball track for every clip property', () => {
  const players = teams.flatMap(team => team.roster).filter(player => !player.captain);
  const ballFreeClips = new Set(['idle', 'run', 'block', 'push', 'fall', 'celebrate']);
  for (const player of players) for (const clip of Object.keys(animationClips)) for (const property of ['height', 'forward']) {
    const sourceId = athleteBallTrackSource(player.id, clip, property);
    assert.ok(sourceId || ballFreeClips.has(clip), `${player.id} ${clip} ${property} has a track or is ball-free`);
    if (sourceId && supportingAnimationLibraries[player.id].mode === 'shared' && sourceId !== player.id)
      assert.equal(sourceId, supportingAnimationLibraries[player.id].ballTrackSource);
    if (sourceId && sourceId !== player.id) {
      const scale = supportingAnimationLibraries[player.id].ballTrackScale;
      const sampled = property === 'height' ? sampleBallHeight(clip, 7, player.id) : sampleBallForward(clip, 7, player.id);
      const donor = property === 'height' ? sampleBallHeight(clip, 7, sourceId) : sampleBallForward(clip, 7, sourceId);
      assert.ok(Math.abs(sampled - donor * scale) < 1e-9, `${player.id} ${clip} ${property} uses scaled donor track`);
    }
  }
});
