import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, sampleAnimation } from '../src/core/animation.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';

const athlete = 'briar-foxglove';
const atlas = './public/assets/animation/briar-foxglove-fall-right.png';
const clip = animationAssetManifest.characters[athlete].directions.right.fall;
const require = createRequire(import.meta.url);
const { PNG } = require('pngjs');

test('Briar fall atlas has ten reviewed distinct poses, aligned at the court, and no ball track', () => {
  assert.equal(clip.src, atlas);
  assert.equal(clip.reviewed, true);
  assert.equal(clip.provenance.issue, 'J.135');
  assert.equal(clip.provenance.review.status, 'accepted');
  assert.match(clip.provenance.ballTrack, /no carry track/);
  assert.equal(clip.columns, 5);
  assert.equal(clip.rows, 2);
  assert.equal(clip.frames.length, 10);
  assert.equal(new Set(clip.frames.map(frame => frame.hash)).size, 10);

  const bytes = readFileSync(new URL('../public/assets/animation/briar-foxglove-fall-right.png', import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), clip.sha256);
  const png = PNG.sync.read(bytes);
  assert.equal(png.width, 560);
  assert.equal(png.height, 192);

  for (let index = 0; index < 10; index++) {
    const x = (index % 5) * 112;
    const y = Math.floor(index / 5) * 96;
    const visible = [];
    for (let py = y; py < y + 96; py++) {
      for (let px = x; px < x + 112; px++) {
        if (png.data[(py * png.width + px) * 4 + 3] >= 16) visible.push([px - x, py - y]);
      }
    }
    assert.ok(visible.length > 0, `frame ${index} is visible`);
    assert.ok(Math.min(...visible.map(point => point[0])) >= 6, `frame ${index} left margin`);
    assert.ok(Math.min(...visible.map(point => point[1])) >= 2, `frame ${index} top margin`);
    assert.ok(Math.max(...visible.map(point => point[0])) < 106, `frame ${index} right margin`);
    assert.ok(Math.max(...visible.map(point => point[1])) < 94, `frame ${index} shares baseline y=94`);
  }

  const images = new Map([[atlas, { complete: true, naturalWidth: 560, naturalHeight: 192, file: atlas }]]);
  const startTicks = [0, 2, 4, 6, 9, 12, 16, 21, 27, 33];
  for (let index = 0; index < 10; index++) {
    assert.equal(sampleAnimation('fall', startTicks[index]).frame, index);
    for (const [facing, flip] of [[1, false], [-1, true]]) {
      const sprite = selectProductionSprite({ id: athlete, facing, animation: { clip: 'fall', tick: startTicks[index] } }, { manifest: animationAssetManifest, images });
      assert.equal(sprite?.atlas.file, atlas);
      assert.equal(sprite?.frame, index);
      assert.equal(sprite?.flip, flip);
    }
  }
  assert.deepEqual(animationClips.fall.frames.map(frame => frame.duration), [2, 2, 2, 3, 3, 4, 5, 6, 6, 7]);
  assert.equal(animationClips.fall.frames.reduce((ticks, frame) => ticks + frame.duration, 0), 40);
  assert.equal(animationClips.fall.anchors.finish, 9);
  assert.equal(clip.height, undefined);
  assert.equal(clip.forward, undefined);

  for (const zoom of ['100', '120']) {
    const report = JSON.parse(readFileSync(new URL(`../tools/generate-art/previews/j135-briar-foxglove-fall/attempt-03/native-${zoom}/report.json`, import.meta.url)));
    assert.equal(report.previewCourtY, 75);
    assert.equal(report.cameraZoom, Number(zoom));
    const captures = report.actionFramePreviews.filter(preview => preview.athlete === athlete && preview.clip === 'fall');
    assert.equal(captures.length, 20);
    assert.ok(captures.every(preview => preview.production && preview.selectedFrame === preview.frame && !preview.hasBall && preview.ballOwnerId === null && preview.ballMode === 'dead'));
    for (const facing of [-1, 1]) assert.equal(captures.filter(preview => preview.facing === facing).length, 10);
  }
});
