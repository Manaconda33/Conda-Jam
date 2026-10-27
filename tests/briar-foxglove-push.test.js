import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, sampleAnimation } from '../src/core/animation.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';

const athlete = 'briar-foxglove';
const atlas = './public/assets/animation/briar-foxglove-push-right.png';
const clip = animationAssetManifest.characters[athlete].directions.right.push;
const require = createRequire(import.meta.url);
const { PNG } = require('pngjs');

test('Briar push atlas has eleven reviewed, distinct ball-free poses', () => {
  assert.equal(clip.src, atlas);
  assert.equal(clip.reviewed, true);
  assert.equal(clip.provenance.issue, 'J.134');
  assert.equal(clip.provenance.review.status, 'accepted');
  assert.match(clip.provenance.ballTrack, /ball-free/);
  assert.equal(clip.columns, 4);
  assert.equal(clip.rows, 3);
  assert.equal(clip.frames.length, 11);
  assert.equal(new Set(clip.frames.map(frame => frame.hash)).size, 11);

  const bytes = readFileSync(new URL('../public/assets/animation/briar-foxglove-push-right.png', import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), clip.sha256);
  const png = PNG.sync.read(bytes);
  assert.equal(png.width, 448);
  assert.equal(png.height, 288);

  for (let index = 0; index < 11; index++) {
    const x = (index % 4) * 112;
    const y = Math.floor(index / 4) * 96;
    const visible = [];
    for (let py = y; py < y + 96; py++) {
      for (let px = x; px < x + 112; px++) {
        if (png.data[(py * png.width + px) * 4 + 3] >= 16) visible.push([px - x, py - y]);
      }
    }
    assert.ok(visible.length > 0, `frame ${index} is visible`);
    assert.ok(Math.min(...visible.map(point => point[0])) >= 7, `frame ${index} left margin`);
    assert.ok(Math.min(...visible.map(point => point[1])) >= 7, `frame ${index} top margin`);
    assert.ok(Math.max(...visible.map(point => point[0])) < 105, `frame ${index} right margin`);
    assert.ok(Math.max(...visible.map(point => point[1])) < 89, `frame ${index} baseline margin`);
  }
  const empty = png.data;
  for (let y = 192; y < 288; y++) {
    for (let x = 336; x < 448; x++) assert.equal(empty[(y * png.width + x) * 4 + 3], 0, 'cell 12 stays transparent');
  }

  const images = new Map([[atlas, { complete: true, naturalWidth: 448, naturalHeight: 288, file: atlas }]]);
  const startTicks = [0, 2, 4, 6, 7, 8, 10, 12, 15, 18, 21];
  for (let index = 0; index < 11; index++) {
    assert.equal(sampleAnimation('push', startTicks[index]).frame, index);
    for (const [facing, flip] of [[1, false], [-1, true]]) {
      const sprite = selectProductionSprite({ id: athlete, facing, animation: { clip: 'push', tick: startTicks[index] } }, { manifest: animationAssetManifest, images });
      assert.equal(sprite?.atlas.file, atlas);
      assert.equal(sprite?.frame, index);
      assert.equal(sprite?.flip, flip);
    }
  }
  assert.deepEqual(animationClips.push.frames.map(frame => frame.duration), [2, 2, 2, 1, 1, 2, 2, 3, 3, 3, 3]);
  assert.equal(animationClips.push.frames.slice(0, 5).reduce((ticks, frame) => ticks + frame.duration, 0), 8);
  assert.equal(animationClips.push.anchors.contact, 5);
  assert.equal(clip.height, undefined);
  assert.equal(clip.forward, undefined);

  for (const zoom of ['100', '120']) {
    const report = JSON.parse(readFileSync(new URL(`../tools/generate-art/previews/j134-briar-foxglove-push/native-${zoom}/report.json`, import.meta.url)));
    assert.equal(report.previewCourtY, 75);
    assert.equal(report.cameraZoom, Number(zoom));
    const captures = report.actionFramePreviews.filter(preview => preview.athlete === athlete && preview.clip === 'push');
    assert.equal(captures.length, 22);
    assert.ok(captures.every(preview => preview.production && preview.selectedFrame === preview.frame && !preview.hasBall && preview.ballOwnerId === null && preview.ballMode === 'dead'));
    for (const facing of [-1, 1]) assert.equal(captures.filter(preview => preview.facing === facing).length, 11);
  }
});
