import test from 'node:test';
import assert from 'node:assert/strict';
import { teams } from '../src/content/teams.js';
import { supportingAnimationLibraries } from '../src/content/supporting-animation-libraries.js';
import { supportingUniformProfiles } from '../src/content/supporting-uniform-profiles.js';
import { paletteVariantFor, clearPaletteVariantCache } from '../src/render/uniform-palette.js';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';
import { animationClips, athleteBallTrackSource, sampleBallForward, sampleBallHeight } from '../src/core/animation.js';

const players = teams.flatMap(team => team.roster);
const supporters = players.filter(player => !player.captain);

function mockCanvasDocument(created = []) {
  globalThis.document = { createElement() {
    const canvas = { width: 0, height: 0, pixels: null };
    const context = {
      drawImage(source) { canvas.pixels = new Uint8ClampedArray(source.pixels); },
      getImageData() { return { data: canvas.pixels }; },
      putImageData(image) { canvas.pixels = new Uint8ClampedArray(image.data); },
    };
    canvas.getContext = () => context;
    created.push(canvas);
    return canvas;
  }};
}

function coord(region, frame, fraction = .5) {
  return Math.min(frame - 1, Math.max(0, Math.floor((region[0] + (region[1] - region[0]) * fraction) * frame)));
}

test('all supporters select their locked donor while original owners retain their own libraries', () => {
  assert.equal(supporters.length, 70);
  for (const player of supporters) {
    const assignment = supportingAnimationLibraries[player.id];
    assert.ok(assignment?.donorId);
    assert.equal(assignment.targetPalette?.[0] ?? player.palette[0], player.palette[0]);
    assert.equal(assignment.targetPalette?.[1] ?? player.palette[1], player.palette[1]);
    if (assignment.mode === 'original') {
      assert.equal(assignment.donorId, player.id);
      assert.equal(assignment.ballTrackSource, player.id);
      assert.equal(assignment.ballTrackScale, 1);
    } else {
      assert.ok(supportingUniformProfiles[assignment.donorId]);
      assert.equal(assignment.classification, 'derived-palette');
      assert.equal(assignment.lineage, 'shared-source');
      assert.equal(assignment.maskProfile.id, supportingUniformProfiles[assignment.donorId].id);
      assert.equal(assignment.ballTrackSource, assignment.donorId);
    }
  }
  assert.equal(players.filter(player => player.captain).some(player => supportingAnimationLibraries[player.id]), false);
});

test('donor-specific garment masks preserve alpha and every nonuniform test pixel', () => {
  const previousDocument = globalThis.document;
  try {
    for (const [donorId, pending] of Object.entries(supportingUniformProfiles)) {
      const profile = { ...pending, status: 'accepted' }, frame = { x: 0, y: 0, w: 10, h: 10 };
      const pixels = new Uint8ClampedArray(10 * 10 * 4), write = (x, y, color) => pixels.set([...color, 255], (y * 10 + x) * 4);
      const jerseyXY = [coord(profile.jersey.region.x, 10), coord(profile.jersey.region.y, 10)];
      const shortsXY = [coord(profile.shorts.region.x, 10), coord(profile.shorts.region.y, 10)];
      const jerseyColor = profile.jersey.sourceColor.slice(1).match(/../g).map(v => parseInt(v, 16));
      const shortsColor = profile.shorts.sourceColor.slice(1).match(/../g).map(v => parseInt(v, 16));
      const targetJersey = [228, 87, 46], targetShorts = [241, 196, 15];
      write(...jerseyXY, jerseyColor); write(...shortsXY, shortsColor);
      write(0, 0, jerseyColor); // head/hair region
      write(9, 9, jerseyColor); // shoe region
      write(8, 5, [240, 185, 145]); // unrelated skin/accessory pixel
      const source = { naturalWidth: 10, naturalHeight: 10, pixels };
      const created = []; mockCanvasDocument(created);
      clearPaletteVariantCache();
      const variant = paletteVariantFor(source, `test-${donorId}`, ['#159d9b', '#773ec2'], ['#e4572e', '#f1c40f'], [frame], profile);
      const changed = (x, y) => variant.pixels.slice((y * 10 + x) * 4, (y * 10 + x) * 4 + 4);
      assert.notDeepEqual([...changed(...jerseyXY).slice(0, 3)], jerseyColor, `${donorId} jersey mask transforms garment color`);
      assert.notDeepEqual([...changed(...shortsXY).slice(0, 3)], shortsColor, `${donorId} shorts mask transforms garment color`);
      assert.deepEqual([...changed(0, 0)], [...jerseyColor, 255], `${donorId} hair/head is unchanged`);
      assert.deepEqual([...changed(9, 9)], [...jerseyColor, 255], `${donorId} shoes are unchanged`);
      assert.deepEqual([...changed(8, 5)], [240, 185, 145, 255], `${donorId} unrelated skin is unchanged`);
      assert.equal(created.length, 1);
    }
  } finally {
    globalThis.document = previousDocument;
    clearPaletteVariantCache();
  }
});

test('clip-specific fall masks keep overlapping hair pixels untouched and preserve transparency', () => {
  const previousDocument = globalThis.document;
  try {
    const profile = { ...supportingUniformProfiles['dorian-mycel'], status: 'accepted' };
    const frame = { x: 0, y: 0, w: 10, h: 10 };
    const pixels = new Uint8ClampedArray(10 * 10 * 4), violet = [116, 62, 181];
    pixels.set([...violet, 255], (8 * 10 + 7) * 4); // safe garment zone in the fall polygon
    pixels.set([...violet, 255], (3 * 10 + 5) * 4); // hair zone outside the polygon
    pixels.set([99, 44, 130, 0], (0 * 10 + 0) * 4); // transparent cell margin
    const source = { naturalWidth: 10, naturalHeight: 10, pixels };
    mockCanvasDocument(); clearPaletteVariantCache();
    const variant = paletteVariantFor(source, 'dorian-fall-mask', ['#743eb5', '#c5c6e8'], ['#bd5a2f', '#eee6d5'], [frame], profile, 'fall');
    const rgba = (x, y) => [...variant.pixels.slice((y * 10 + x) * 4, (y * 10 + x) * 4 + 4)];
    assert.notDeepEqual(rgba(7, 8).slice(0, 3), violet, 'fall garment candidate is mapped');
    assert.deepEqual(rgba(5, 3), [...violet, 255], 'hair remains source-identical');
    assert.deepEqual(rgba(0, 0), [99, 44, 130, 0], 'transparent source pixel is byte-identical');
  } finally {
    globalThis.document = previousDocument;
    clearPaletteVariantCache();
  }
});

test('palette cache is isolated by profile and bounded per source atlas', () => {
  const previousDocument = globalThis.document, created = [];
  try {
    mockCanvasDocument(created);
    const profile = { ...supportingUniformProfiles['echo-catwalk'], status: 'accepted' };
    const source = { naturalWidth: 1, naturalHeight: 1, pixels: new Uint8ClampedArray([0, 100, 115, 255]) }, frames = [{ x: 0, y: 0, w: 1, h: 1 }];
    const colors = ['#e4572e', '#f1c40f', '#238ae6', '#28a745', '#bd34c9'];
    for (const color of colors) paletteVariantFor(source, 'lru-atlas', ['#159d9b', '#773ec2'], [color, '#111111'], frames, profile);
    assert.equal(created.length, 5);
    const recent = paletteVariantFor(source, 'lru-atlas', ['#159d9b', '#773ec2'], [colors.at(-1), '#111111'], frames, profile);
    assert.equal(created.length, 5);
    assert.ok(recent);
    paletteVariantFor(source, 'lru-atlas', ['#159d9b', '#773ec2'], [colors[0], '#111111'], frames, profile);
    assert.equal(created.length, 6, 'oldest cached palette was evicted');
    const reedProfile = { ...supportingUniformProfiles['reed-ashcroft'], status: 'accepted' };
    paletteVariantFor(source, 'lru-atlas', ['#159d9b', '#773ec2'], [colors[0], '#111111'], frames, reedProfile);
    assert.equal(created.length, 7, 'profile-specific masks cannot reuse a different donor variant');
  } finally {
    globalThis.document = previousDocument;
    clearPaletteVariantCache();
  }
});

test('all 70 supporters resolve 29 clips in both facings through their assigned source', () => {
  const previousDocument = globalThis.document;
  try {
    mockCanvasDocument();
    const libraries = Object.fromEntries(Object.entries(supportingAnimationLibraries).map(([id, assignment]) => [id, assignment.mode === 'shared'
      ? { ...assignment, review: 'accepted', maskProfile: { ...assignment.maskProfile, status: 'accepted' } }
      : assignment]));
    for (const player of supporters) {
      const assignment = libraries[player.id], donorId = assignment.donorId, character = animationAssetManifest.characters[donorId], images = new Map();
      for (const direction of Object.values(character.directions)) for (const clip of Object.values(direction)) {
        if (images.has(clip.src)) continue;
        const width = Math.max(...clip.frames.map(frame => frame.x + frame.w));
        const height = Math.max(...clip.frames.map(frame => frame.y + frame.h));
        images.set(clip.src, { complete: true, naturalWidth: width, naturalHeight: height, pixels: new Uint8ClampedArray(width * height * 4) });
      }
      for (const facing of [1, -1]) for (const clip of Object.keys(animationClips)) {
        const sprite = selectProductionSprite({ ...player, facing, captain: false, animation: { clip, tick: 0 } }, { manifest: animationAssetManifest, images, libraries });
        assert.ok(sprite, `${player.id} ${clip} facing ${facing} selects a sprite`);
        assert.equal(sprite.clip, clip);
        assert.equal(sprite.libraryId, donorId);
        assert.equal(sprite.flip, facing < 0);
        assert.equal(sprite.classification, assignment.mode === 'shared' ? 'derived-palette' : 'original-authored');
      }
    }
  } finally {
    globalThis.document = previousDocument;
    clearPaletteVariantCache();
  }
});

test('ball tracks prefer the recipient and then its exact assigned donor, per property', () => {
  for (const player of supporters) for (const clip of Object.keys(animationClips)) for (const property of ['height', 'forward']) {
    const assignment = supportingAnimationLibraries[player.id];
    const sourceId = athleteBallTrackSource(player.id, clip, property);
    assert.ok(sourceId === null || sourceId === player.id || sourceId === assignment.ballTrackSource, `${player.id} ${clip} ${property} never leaks another donor track`);
    const sample = property === 'height' ? sampleBallHeight(clip, 7, player.id) : sampleBallForward(clip, 7, player.id);
    assert.ok(Number.isFinite(sample), `${player.id} ${clip} ${property} sample is finite`);
    if (sourceId && sourceId !== player.id && assignment.mode === 'shared') assert.equal(sourceId, assignment.donorId);
  }
  assert.equal(athleteBallTrackSource('briar-foxglove', 'shoot', 'height'), 'briar-foxglove', 'recipient calibration wins over donor fallback');
  assert.equal(athleteBallTrackSource('sable-regent', 'shoot', 'height'), 'moxie-capwell', 'shared player uses the newly assigned donor');
  assert.equal(athleteBallTrackSource('reed-ashcroft', 'shoot', 'forward'), 'reed-ashcroft', 'original donor keeps its own track');
  assert.equal(athleteBallTrackSource('reed-ashcroft', 'shoot', 'height'), null, 'missing original track does not silently resolve to Echo');
  assert.equal(athleteBallTrackSource('juniper-vale', 'shoot', 'height'), null, 'missing original track stays an explicit frame-metadata fallback');
});
