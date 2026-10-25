import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, anchorTick, sampleAnimation, sampleBallHeight, sampleBallForward } from '../src/core/animation.js';
import { decodeImage, inspectAtlas } from '../tools/animation-assets.mjs';
import { selectProductionSprite } from '../src/render/animation-sprites.js';

const athlete = 'marco-vellum';
const clip = animationAssetManifest.characters[athlete].directions.right.receive;
const layout = JSON.parse(readFileSync(new URL('../tools/generate-art/marco-vellum-receive4-layouts.json', import.meta.url), 'utf8'))[0];
const provenance = JSON.parse(readFileSync(new URL('../tools/generate-art/marco-vellum-receive-attempt6-provenance.json', import.meta.url), 'utf8'));
const tracks = JSON.parse(readFileSync(new URL('../tools/generate-art/marco-vellum-runtime-ball-tracks.json', import.meta.url), 'utf8'));
const atlasPath = fileURLToPath(new URL('../' + clip.src.slice(2), import.meta.url));
const hash = value => createHash('sha256').update(value).digest('hex');

test('Marco receive registers four unique reviewed poses with safe atlas margins', async () => {
  assert.equal(clip.reviewed, true);
  assert.equal(clip.frames.length, 4);
  assert.equal(clip.columns, 2);
  assert.equal(clip.rows, 2);
  assert.equal(clip.sha256, hash(readFileSync(atlasPath)));
  assert.equal(layout.provenance.sourceSha256, provenance.sourceSha256);
  assert.equal(layout.provenance.eligibleForPacking, true);
  assert.equal(layout.provenance.status, 'accepted-and-runtime-integrated');
  assert.deepEqual(clip.provenance.runtimeBallTrack, { height: tracks.tracks.receive.height, forward: tracks.tracks.receive.forward });

  const decoded = await decodeImage(atlasPath);
  assert.deepEqual([decoded.width, decoded.height], [192, 192]);
  const inspected = await inspectAtlas(atlasPath, clip.frames);
  assert.equal(inspected.frames.length, 4);
  assert.ok(inspected.frames.every(frame => frame.visiblePixels > 0 && !frame.error));
  assert.equal(new Set(inspected.frames.map(frame => frame.hash)).size, 4);
  for (const frame of clip.frames) {
    let left = frame.w, right = -1, top = frame.h, bottom = -1;
    for (let y = 0; y < frame.h; y++) for (let x = 0; x < frame.w; x++) {
      const alpha = decoded.pixels[((frame.y + y) * decoded.width + frame.x + x) * 4 + 3];
      if (!alpha) continue;
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
    assert.ok(left >= 1 && frame.w - right - 1 >= 1 && top >= 1 && frame.h - bottom - 1 >= 1,
      'atlas cells must retain a transparent safety pixel: ' + [left, frame.w-right-1, top, frame.h-bottom-1].join(','));
  }
});

test('Marco receive preserves attempt6 provenance and four-cell prompt margins', () => {
  assert.equal(provenance.status, 'accepted-and-runtime-integrated');
  assert.equal(provenance.generationId, 'exec-bc08a0f3-9a4c-4e2b-9bcd-3f0659587499');
  assert.equal(hash(readFileSync(new URL('../tools/generate-art/sources/marco-vellum-receive-attempt6-generated-raw.png', import.meta.url))), provenance.rawSourceSha256);
  assert.equal(hash(readFileSync(new URL('../tools/generate-art/sources/marco-vellum-receive-attempt6-clean-candidate.png', import.meta.url))), provenance.sourceSha256);
  assert.equal(provenance.generationHistory.find(item => item.attempt === 5).status, 'rejected');
  assert.equal(provenance.generationHistory.find(item => item.attempt === 5).reason, 'Dark ball-like object visible in catch and settle poses.');
  const margins = JSON.parse(readFileSync(new URL('../tools/generate-art/marco-vellum-receive-attempt6-layouts.json', import.meta.url), 'utf8')).frames;
  assert.equal(margins.length, 4);
  for (const frame of margins) {
    const [left, right, top, bottom] = frame.outputMargins;
    assert.ok(left >= 90 && right >= 90 && top >= 90 && bottom >= 90);
  }
});

test('Marco catches the separate ball at frame2/tick4 and carries it into frame3', () => {
  const track = tracks.tracks.receive;
  assert.equal(track.status, 'accepted after native contact review at 100% and 120%');
  assert.deepEqual(track.height, [1.3, 1.35, 1.2, .95]);
  assert.deepEqual(track.forward, [22, 13, 4, 3]);
  assert.equal(anchorTick('receive', 'grab'), 4);
  assert.equal(sampleAnimation('receive', 4).frame, 2);
  assert.deepEqual(track.nativeReview.zooms, [100, 120]);
  assert.deepEqual(track.nativeReview.facings, ['right', 'left']);
  let tick = 0;
  for (let frame = 0; frame < track.height.length; frame++) {
    assert.equal(sampleAnimation('receive', tick).frame, frame);
    assert.equal(sampleBallHeight('receive', tick, athlete), track.height[frame]);
    assert.equal(sampleBallForward('receive', tick, athlete), track.forward[frame]);
    tick += animationClips.receive.frames[frame].duration;
  }
});

test('Marco receive native previews select production poses in both facings and zooms', () => {
  const image = { complete: true, naturalWidth: 192, naturalHeight: 192, file: clip.src };
  const images = new Map([[clip.src, image]]);
  let tick = 0;
  for (let frame = 0; frame < clip.frames.length; frame++) {
    for (const [facing, flip] of [[1, false], [-1, true]]) {
      const selected = selectProductionSprite({ id: athlete, facing, animation: { clip: 'receive', tick } }, { manifest: animationAssetManifest, images });
      assert.equal(selected?.atlas.file, clip.src);
      assert.equal(selected?.frame, frame);
      assert.equal(selected?.flip, flip);
    }
    tick += animationClips.receive.frames[frame].duration;
  }
  for (const zoom of [100, 120]) {
    const report = JSON.parse(readFileSync(new URL('../tools/generate-art/previews/marco-vellum-receive/native-' + zoom + '/report.json', import.meta.url), 'utf8'));
    assert.equal(report.cameraZoom, zoom);
    assert.equal(report.actionFramePreviews.length, 8);
    assert.ok(report.actionFramePreviews.every((frame, index) => frame.production && frame.source === clip.src && frame.selectedFrame === index % 4));
  }
});
