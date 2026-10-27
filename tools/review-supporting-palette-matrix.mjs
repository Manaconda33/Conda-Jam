import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { teams } from '../src/content/teams.js';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips } from '../src/core/animation.js';
import { decodeImage } from './animation-assets.mjs';
import { clearPaletteVariantCache, paletteVariantFor } from '../src/render/uniform-palette.js';

const { PNG } = createRequire(import.meta.url)('pngjs');

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = path.resolve(root, process.argv[2] ?? 'docs/animation-production/palette-mask-reviews/preview-matrix');
const donorId = 'echo-catwalk', donor = animationAssetManifest.characters[donorId];
const clipKeys = Object.keys(animationClips), tileWidth = 80, tileHeight = 96;
const sources = new Map();
for (const clipKey of clipKeys) {
  const clip = donor.directions.right[clipKey];
  if (!clip) throw new Error(`Echo donor is missing ${clipKey}`);
  if (!sources.has(clip.src)) {
    const image = await decodeImage(path.resolve(root, clip.src));
    sources.set(clip.src, { naturalWidth: image.width, naturalHeight: image.height, pixels: new Uint8ClampedArray(image.pixels) });
  }
}

const boardWidth = clipKeys.length * tileWidth, boardHeight = teams.length * tileHeight;
const board = new Uint8ClampedArray(boardWidth * boardHeight * 4);
const rows = [];
for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
  const team = teams[teamIndex], palette = team.colors.slice(0, 2), frames = [];
  for (let clipIndex = 0; clipIndex < clipKeys.length; clipIndex++) {
    const clipKey = clipKeys[clipIndex], clip = donor.directions.right[clipKey], source = sources.get(clip.src);
    globalThis.document = {
      createElement() {
        const canvas = { width: 0, height: 0 }, contextPixels = { value: null };
        const context = {
          drawImage(image) { contextPixels.value = new Uint8ClampedArray(image.pixels); },
          getImageData() { return { data: contextPixels.value }; },
          putImageData(image) { contextPixels.value = new Uint8ClampedArray(image.data); },
        };
        canvas.getContext = () => context;
        canvas.getPixels = () => contextPixels.value;
        return canvas;
      },
    };
    const variant = paletteVariantFor(source, clip.src, ['#159d9b', '#773ec2'], palette, clip.frames, { secondary: 'violet-cyan-shorts' });
    const pixels = variant.getPixels?.() ?? variant.pixels;
    const frameIndex = Math.floor((clip.frames.length - 1) / 2), frame = clip.frames[frameIndex];
    for (let y = 0; y < frame.h; y++) {
    const scale = Math.min((tileWidth - 8) / frame.w, (tileHeight - 8) / frame.h, 1);
    const drawWidth = Math.max(1, Math.round(frame.w * scale));
    const drawHeight = Math.max(1, Math.round(frame.h * scale));
    const drawX = clipIndex * tileWidth + Math.floor((tileWidth - drawWidth) / 2);
    const drawY = teamIndex * tileHeight + Math.floor((tileHeight - drawHeight) / 2);
    for (let dy = 0; dy < drawHeight; dy++) for (let dx = 0; dx < drawWidth; dx++) {
      const sx = frame.x + Math.min(frame.w - 1, Math.floor(dx / scale));
      const sy = frame.y + Math.min(frame.h - 1, Math.floor(dy / scale));
      const sourceStart = (sy * source.naturalWidth + sx) * 4;
      const destinationStart = ((drawY + dy) * boardWidth + drawX + dx) * 4;
      board.set(pixels.subarray(sourceStart, sourceStart + 4), destinationStart);
    }
    }
    frames.push({ clip: clipKey, frame: frameIndex, src: clip.src, sourceSha256: clip.sha256 });
  }
  rows.push({ teamId: team.id, teamName: team.name, palette, frames });
  clearPaletteVariantCache();
}

await mkdir(output, { recursive: true });
for (const [tone, color] of [['light', [199, 212, 224]], ['dark', [23, 21, 28]]]) {
  const image = new PNG({ width: boardWidth, height: boardHeight });
  for (let i = 0; i < board.length; i += 4) {
    const alpha = board[i + 3] / 255;
    image.data[i] = Math.round(board[i] * alpha + color[0] * (1 - alpha));
    image.data[i + 1] = Math.round(board[i + 1] * alpha + color[1] * (1 - alpha));
    image.data[i + 2] = Math.round(board[i + 2] * alpha + color[2] * (1 - alpha));
    image.data[i + 3] = 255;
  }
  await writeFile(path.join(output, `${tone}-35-team-29-clip-matrix.png`), PNG.sync.write(image));
}
await writeFile(path.join(output, 'matrix.json'), `${JSON.stringify({ donorId, transform: 'frame-hsv-garment-mask-v7', clipColumns: clipKeys, rows }, null, 2)}\n`);
console.log(`Wrote ${teams.length} palettes × ${clipKeys.length} clip samples from ${donorId} to ${output}`);
