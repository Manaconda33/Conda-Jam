import test from 'node:test';
import assert from 'node:assert/strict';
import { teams } from '../src/content/teams.js';
import { supportingAnimationLibraries, supportingLibrarySummary } from '../src/content/supporting-animation-libraries.js';
import { paletteVariantFor } from '../src/render/uniform-palette.js';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';

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
      assert.equal(donor.rig, player.rig);
      assert.equal(donor.height, player.height);
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
