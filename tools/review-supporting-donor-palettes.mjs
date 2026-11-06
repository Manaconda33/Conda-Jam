import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { teams } from '../src/content/teams.js';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips } from '../src/core/animation.js';
import { supportingDonorMap } from '../src/content/supporting-donor-map.js';
import { supportingUniformProfiles } from '../src/content/supporting-uniform-profiles.js';
import { clearPaletteVariantCache, paletteVariantFor } from '../src/render/uniform-palette.js';
import { decodeImage } from './animation-assets.mjs';

const { PNG } = createRequire(import.meta.url)('pngjs');
const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = path.resolve(root, process.argv[2] ?? 'docs/animation-production/supporting-donor-palette-reviews');
const donorIds = Object.keys(supportingUniformProfiles).sort();
const supporters = teams.flatMap(team => team.roster.filter(player => !player.captain).map(player => ({ player, team })));
const clipKeys = Object.keys(animationClips), tileWidth = 96, tileHeight = 96;
const tileForFrame = (pixels, atlasWidth, frame, board, boardWidth, x, y) => {
  const scale = Math.min((tileWidth - 10) / frame.w, (tileHeight - 10) / frame.h, 1);
  const drawWidth = Math.max(1, Math.round(frame.w * scale)), drawHeight = Math.max(1, Math.round(frame.h * scale));
  const drawX = x + Math.floor((tileWidth - drawWidth) / 2), drawY = y + Math.floor((tileHeight - drawHeight) / 2);
  for (let dy = 0; dy < drawHeight; dy++) for (let dx = 0; dx < drawWidth; dx++) {
    const sx = frame.x + Math.min(frame.w - 1, Math.floor(dx / scale));
    const sy = frame.y + Math.min(frame.h - 1, Math.floor(dy / scale));
    const si = (sy * atlasWidth + sx) * 4, di = ((drawY + dy) * boardWidth + drawX + dx) * 4;
    board.set(pixels.subarray(si, si + 4), di);
  }
};
globalThis.document = {
  createElement() {
    const canvas = { width: 0, height: 0, pixels: null };
    const context = {
      drawImage(image) { canvas.pixels = new Uint8ClampedArray(image.pixels); },
      getImageData() { return { data: canvas.pixels }; },
      putImageData(image) { canvas.pixels = new Uint8ClampedArray(image.data); },
    };
    canvas.getContext = () => context;
    return canvas;
  },
};

await mkdir(output, { recursive: true });
for (const donorId of donorIds) {
  const donor = animationAssetManifest.characters[donorId];
  const profile = Object.freeze({ ...supportingUniformProfiles[donorId], status: 'accepted' });
  const targetRows = supporters.filter(({ player }) => player.id !== donorId && supportingDonorMap[player.id] === donorId)
    .sort((a, b) => a.team.id.localeCompare(b.team.id) || a.player.id.localeCompare(b.player.id));
  if (targetRows.length !== 9) throw new Error(`${donorId} has ${targetRows.length} derived recipients, expected 9`);
  const boardWidth = clipKeys.length * tileWidth, boardHeight = targetRows.length * tileHeight;
  const board = new Uint8Array(boardWidth * boardHeight * 4), imageCache = new Map();
  const rows = [];
  for (let rowIndex = 0; rowIndex < targetRows.length; rowIndex++) {
    const { player, team } = targetRows[rowIndex], palette = team.colors.slice(0, 2), frameReviews = [];
    for (let col = 0; col < clipKeys.length; col++) {
      const clipKey = clipKeys[col], clip = donor.directions.right[clipKey];
      if (!clip?.reviewed) throw new Error(`${donorId} ${clipKey} is not reviewed`);
      let source = imageCache.get(clip.src);
      if (!source) {
        const image = await decodeImage(path.resolve(root, clip.src));
        source = { naturalWidth: image.width, naturalHeight: image.height, pixels: new Uint8ClampedArray(image.pixels) };
        imageCache.set(clip.src, source);
      }
      const donorPalette = supporters.find(({ player }) => player.id === donorId).player.palette;
      const variant = paletteVariantFor(source, clip.src, donorPalette, palette, clip.frames, profile, clipKey);
      const pixels = variant.pixels ?? variant.getPixels?.();
      const frameIndex = Math.floor((clip.frames.length - 1) / 2), frame = clip.frames[frameIndex];
      tileForFrame(pixels, source.naturalWidth, frame, board, boardWidth, col * tileWidth, rowIndex * tileHeight);
      let alphaMismatchPixels = 0, changedPixels = 0;
      for (const sourceFrame of clip.frames) for (let y = sourceFrame.y; y < sourceFrame.y + sourceFrame.h; y++) for (let x = sourceFrame.x; x < sourceFrame.x + sourceFrame.w; x++) {
        const i = (y * source.naturalWidth + x) * 4;
        if (source.pixels[i + 3] !== pixels[i + 3]) alphaMismatchPixels++;
        if (source.pixels[i] !== pixels[i] || source.pixels[i + 1] !== pixels[i + 1] || source.pixels[i + 2] !== pixels[i + 2]) changedPixels++;
      }
      frameReviews.push({ clip: clipKey, source: clip.src, sourceSha256: clip.sha256, frameIndex, frameHash: frame.hash, alphaMismatchPixels, changedPixels });
    }
    rows.push({ row: rowIndex, teamId: team.id, teamName: team.name, playerId: player.id, palette, frames: frameReviews });
    clearPaletteVariantCache();
  }
  const donorDir = path.join(output, donorId);
  await mkdir(donorDir, { recursive: true });
  for (const [tone, color] of [['light', [224, 231, 237]], ['dark', [22, 20, 28]]]) {
    const image = new PNG({ width: boardWidth, height: boardHeight });
    for (let i = 0; i < board.length; i += 4) {
      const alpha = board[i + 3] / 255;
      image.data[i] = Math.round(board[i] * alpha + color[0] * (1 - alpha));
      image.data[i + 1] = Math.round(board[i + 1] * alpha + color[1] * (1 - alpha));
      image.data[i + 2] = Math.round(board[i + 2] * alpha + color[2] * (1 - alpha));
      image.data[i + 3] = 255;
    }
    await writeFile(path.join(donorDir, `${tone}-mapped-palettes-9x29.png`), PNG.sync.write(image));
  }
  await writeFile(path.join(donorDir, 'matrix.json'), `${JSON.stringify({ donorId, profile: profile.id, maskProfile: profile, clipColumns: clipKeys, rows }, null, 2)}\n`);
  console.log(`${donorId}: ${rows.length} recipient palettes × ${clipKeys.length} action types`);
}
console.log(`Wrote donor review matrices under ${path.relative(root, output)}`);
