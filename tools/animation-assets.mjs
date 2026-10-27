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
export async function auditManifest({ manifest, root, athletes, clips, libraries = {} }) {
  const errors = [], results = [], targetShortfalls = [], decoded = new Map();
  const issue = (code, detail) => errors.push({ code, ...detail });
  if (manifest?.version !== 1 || !manifest?.characters || typeof manifest.characters !== 'object') {
    issue('manifest-schema', { message: 'Expected version:1 and characters object' });
  }
  const athleteById = new Map(athletes.filter(value => typeof value === 'object').map(value => [value.id, value]));
  for (const [id, library] of Object.entries(libraries)) {
    const athlete = athleteById.get(id), donor = athleteById.get(library?.donorId);
    if (!athlete) { issue('library-athlete-unknown', { athlete: id }); continue; }
    if (athlete.captain && library?.mode !== 'original') issue('captain-library-protected', { athlete: id, mode: library?.mode });
    if (!athlete.captain && !['original', 'shared'].includes(library?.mode)) issue('invalid-library-mode', { athlete: id, mode: library?.mode });
    if (library?.mode === 'shared') {
      if (library.review !== 'accepted') issue('palette-review-required', { athlete: id, donor: library.donorId, status: library.review ?? 'unset' });
      if (!donor || donor.captain) issue('invalid-shared-donor', { athlete: id, donor: library.donorId });
      const humanRigs = new Set(['human', 'athletic-variant']);
      if (donor && athlete && !(donor.rig === athlete.rig || humanRigs.has(donor.rig) && humanRigs.has(athlete.rig))) issue('incompatible-shared-donor', { athlete: id, donor: donor.id, donorRig: donor.rig, rig: athlete.rig, donorHeight: donor.height, height: athlete.height });
      if (!Array.isArray(library.sourcePalette) || library.sourcePalette.length !== 2 || !Array.isArray(library.targetPalette) || library.targetPalette.length !== 2) issue('shared-palette-required', { athlete: id });
    }
  }
  for (const athlete of athletes) {
    if (typeof athlete === 'object' && !athlete.captain && !libraries[athlete.id]) issue('support-library-missing', { athlete: athlete.id });
  }
  for (const athlete of athletes) {
    const id = typeof athlete === 'string' ? athlete : athlete.id;
    const library = libraries[id];
    const effectiveId = library?.mode === 'shared' && library.review === 'accepted' && !(typeof athlete === 'object' && athlete.captain) ? library.donorId : id;
    const character = manifest?.characters?.[effectiveId];
    if (!character) { issue('missing-character', { athlete: id }); continue; }
    if (typeof character.mirrorSafe !== 'boolean') issue('mirror-safe-unset', { athlete: id });
    if (character.mirrorReview?.status !== 'reviewed' || (typeof character.mirrorReview?.notes !== 'string' || !character.mirrorReview.notes.trim())) {
      issue('mirror-review-required', { athlete: id });
    }
    for (const direction of character.mirrorSafe === true ? ['right'] : ['right', 'left']) {
      for (const [clipKey, definition] of Object.entries(clips)) {
        const required = minimumFrameCount(definition), target = targetFrameCount(definition);
        const clip = character.directions?.[direction]?.[clipKey];
        const context = { athlete: id, direction, clip: clipKey, ...(effectiveId !== id ? { donor: effectiveId, lineage: 'shared-source', classification: 'derived-palette' } : { classification: 'original-authored' }) };
        if (!clip) { issue('missing-clip', context); continue; }
        if (clip.reviewed !== true) context.classification = 'unreviewed';
        if (clip.reviewed !== true) issue('clip-review-required', context);
        if (clip.source !== 'imagegen' || (typeof clip.provenance?.prompt !== 'string' || !clip.provenance.prompt.trim()) || !clip.provenance?.generatedAt || !Number.isFinite(Date.parse(clip.provenance.generatedAt))) {
          issue('provenance-required', context);
        }
        if (clip.provenance?.promptVerbatim === false) issue('prompt-not-verbatim', context);
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
  const sourceLibraryIds = [...new Set(results.map(row => row.donor ?? row.athlete))];
  const uniqueSourceAtlases = new Set(results.map(row => row.src)).size;
  const uniqueSourceDrawings = new Set(results.flatMap(row => row.frames.map(frame => frame.hash).filter(Boolean))).size;
  const coverageByPlayer = Object.fromEntries(athletes.map(athlete => {
    const id = typeof athlete === 'string' ? athlete : athlete.id;
    const playerResults = results.filter(row => row.athlete === id);
    const shared = libraries[id]?.mode === 'shared', accepted = shared && libraries[id].review === 'accepted';
    return [id, { clips: playerResults.length, missingClips: Object.keys(clips).length - playerResults.length, classification: playerResults.length === Object.keys(clips).length ? accepted ? 'derived-palette' : 'original-authored' : 'incomplete', assignmentStatus: shared ? libraries[id].review ?? 'unreviewed' : 'original-authored', lineage: shared ? 'shared-source' : null, sourceLibrary: accepted ? libraries[id].donorId : id }];
  }));
  const classifications = results.reduce((counts, row) => { const key = row.classification; counts[key] = (counts[key] ?? 0) + 1; return counts; }, {});
  const assignmentClassifications = Object.values(libraries).reduce((counts, library) => { const key = library.mode === 'shared' ? library.review === 'accepted' ? 'derived-palette' : library.review === 'rejected' ? 'rejected' : 'unreviewed' : library.mode === 'original' ? 'original-authored' : 'missing'; counts[key] = (counts[key] ?? 0) + 1; return counts; }, {});
  assignmentClassifications.missing ??= athletes.filter(athlete => typeof athlete === 'object' && !athlete.captain && !libraries[athlete.id]).length;
  assignmentClassifications.rejected ??= 0;
  const missingClipCount = errors.filter(error => error.code === 'missing-clip').length;
  return { targetFramesTotal: athletes.length * targetFrames, targetShortfalls, requiredClipsMinimum: athletes.length * Object.keys(clips).length, requiredFramesMinimum: athletes.length * requiredFrames, version: 2, generatedAt: new Date().toISOString(), ok: errors.length === 0, athletes: athletes.length, clipDefinitions: Object.keys(clips).length, inspectedClips: results.length, missingClipCount, uniqueSourceLibraries: sourceLibraryIds.length, uniqueSourceAtlases, uniqueSourceDrawings, classifications, assignmentClassifications, coverageByPlayer, errors, results };
}
