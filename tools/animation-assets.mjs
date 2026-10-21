import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const exec = promisify(execFile);
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export const targetFrameCount = definition => typeof definition === 'number' ? definition : Array.isArray(definition.frames) ? definition.frames.length : definition.frames;
export const minimumFrameCount = definition => typeof definition === 'number' ? definition : definition.minimumUniqueFrames ?? targetFrameCount(definition);

/** Decode the actual file; JSON hashes never establish image identity. Requires ImageMagick. */
export async function decodeImage(filename) {
  const bytes = await readFile(filename);
  const { stdout: dimensions } = await exec('identify', ['-ping', '-format', '%w %h %n', filename]);
  const [width, height, count] = dimensions.trim().split(/\s+/).map(Number);
  if (!Number.isInteger(width) || !Number.isInteger(height) || count !== 1 || width * height > 64_000_000) {
    throw new Error('Expected one static image of at most 64 million pixels');
  }
  const { stdout: pixels } = await exec('convert', [filename, '-alpha', 'on', '-depth', '8', 'rgba:-'], {
    encoding: 'buffer', maxBuffer: width * height * 4 + 1024,
  });
  if (pixels.length !== width * height * 4) throw new Error('Decoded RGBA size mismatch');
  return { width, height, pixels, sha256: sha256(bytes) };
}

/** Hash dimensions + row-major RGBA, with invisible RGB normalized to zero. */
export function inspectFrames(image, frames) {
  return frames.map((frame, index) => {
    const { x, y, w, h } = frame || {};
    if (![x, y, w, h].every(Number.isInteger) || x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > image.width || y + h > image.height) {
      return { index, error: 'frame-bounds' };
    }
    const crop = Buffer.alloc(w * h * 4);
    let visiblePixels = 0;
    for (let row = 0; row < h; row++) {
      image.pixels.copy(crop, row * w * 4, ((y + row) * image.width + x) * 4, ((y + row) * image.width + x + w) * 4);
    }
    for (let offset = 0; offset < crop.length; offset += 4) {
      if (crop[offset + 3]) visiblePixels++;
      else crop.fill(0, offset, offset + 3);
    }
    return { index, x, y, w, h, hash: sha256(Buffer.concat([Buffer.from(`${w}x${h}:`), crop])), visiblePixels };
  });
}

export async function inspectAtlas(filename, frames) {
  const image = await decodeImage(filename);
  return { width: image.width, height: image.height, sha256: image.sha256, frames: inspectFrames(image, frames) };
}

/** Roster and clips are supplied explicitly so fixtures do not require production art. */
export async function auditManifest({ manifest, root, athletes, clips }) {
  const errors = [], results = [], targetShortfalls = [], decoded = new Map();
  const issue = (code, detail) => errors.push({ code, ...detail });
  if (manifest?.version !== 1 || !manifest?.characters || typeof manifest.characters !== 'object') {
    issue('manifest-schema', { message: 'Expected version:1 and characters object' });
  }
  for (const athlete of athletes) {
    const id = typeof athlete === 'string' ? athlete : athlete.id;
    const character = manifest?.characters?.[id];
    if (!character) { issue('missing-character', { athlete: id }); continue; }
    if (typeof character.mirrorSafe !== 'boolean') issue('mirror-safe-unset', { athlete: id });
    if (character.mirrorReview?.status !== 'reviewed' || (typeof character.mirrorReview?.notes !== 'string' || !character.mirrorReview.notes.trim())) {
      issue('mirror-review-required', { athlete: id });
    }
    for (const direction of character.mirrorSafe === true ? ['right'] : ['right', 'left']) {
      for (const [clipKey, definition] of Object.entries(clips)) {
        const required = minimumFrameCount(definition), target = targetFrameCount(definition);
        const clip = character.directions?.[direction]?.[clipKey];
        const context = { athlete: id, direction, clip: clipKey };
        if (!clip) { issue('missing-clip', context); continue; }
        if (clip.reviewed !== true) issue('clip-review-required', context);
        if (clip.source !== 'imagegen' || (typeof clip.provenance?.prompt !== 'string' || !clip.provenance.prompt.trim()) || !clip.provenance?.generatedAt || !Number.isFinite(Date.parse(clip.provenance.generatedAt))) {
          issue('provenance-required', context);
        }
        if (!Number.isInteger(clip.columns) || clip.columns < 1 || !Number.isInteger(clip.rows) || clip.rows < 1) issue('invalid-grid', context);
        const frames = Array.isArray(clip.frames) ? clip.frames : [];
        if (frames.length < required) issue('insufficient-frames', { ...context, required, actual: frames.length });
        if (clip.columns * clip.rows < frames.length) issue('grid-capacity', context);
        if (typeof clip.src !== 'string' || !clip.src.startsWith('./public/assets/animation/')) { issue('invalid-source-path', context); continue; }
        const filename = path.resolve(root, clip.src);
        const assetRoot = path.resolve(root, 'public/assets/animation') + path.sep;
        if (!filename.startsWith(assetRoot)) { issue('invalid-source-path', context); continue; }
        if (!decoded.has(filename)) decoded.set(filename, decodeImage(filename).catch(error => ({ error: error.code || error.message })));
        const image = await decoded.get(filename);
        if (image.error) { issue('image-unreadable', { ...context, src: clip.src, message: image.error }); continue; }
        if (clip.sha256 !== image.sha256) issue('source-hash-mismatch', context);
        const actual = inspectFrames(image, frames);
        const hashes = new Set();
        for (const frame of actual) {
          if (frame.error) { issue(frame.error, { ...context, frame: frame.index }); continue; }
          if (!frame.visiblePixels) issue('blank-frame', { ...context, frame: frame.index });
          if (frames[frame.index].hash !== frame.hash) issue('frame-hash-mismatch', { ...context, frame: frame.index });
          if (hashes.has(frame.hash)) issue('duplicate-frame', { ...context, frame: frame.index });
          hashes.add(frame.hash);
        }
        if (hashes.size < required) issue('insufficient-distinct-frames', { ...context, required, actual: hashes.size });
        if (hashes.size < target) targetShortfalls.push({ ...context, target, minimum: required, actual: hashes.size });
        results.push({ ...context, src: clip.src, width: image.width, height: image.height, sha256: image.sha256, required, target, targetReached: hashes.size >= target, actualFrames: frames.length, distinctFrames: hashes.size, frames: actual });
      }
    }
  }
  const requiredFrames = Object.values(clips).reduce((sum, definition) => sum + minimumFrameCount(definition), 0);
  const targetFrames = Object.values(clips).reduce((sum, definition) => sum + targetFrameCount(definition), 0);
  return { targetFramesTotal: athletes.length * targetFrames, targetShortfalls, requiredClipsMinimum: athletes.length * Object.keys(clips).length, requiredFramesMinimum: athletes.length * requiredFrames, version: 1, generatedAt: new Date().toISOString(), ok: errors.length === 0, athletes: athletes.length, clipDefinitions: Object.keys(clips).length, inspectedClips: results.length, errors, results };
}
