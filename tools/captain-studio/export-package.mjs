import { createHash, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { lstat, mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { collectCaptainContribution } from './collect-worker-diff.mjs';
import { canonicalJson } from './canonical-json.mjs';
import { computeArtworkDigest, computePackageDigest, computeTrackDigest, validateRelativePath } from './package-hash.mjs';

const HASH = /^[a-f0-9]{64}$/;
const CLIP = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EVIDENCE_TYPES = new Set(['source-art', 'anatomy-identity', 'layout-transparency', 'timing-anchors', 'ball-track', 'normal-loader', 'full-set']);

export class CaptainPackageExportError extends Error {
  constructor(code, detail = '') {
    super(detail ? `${code}: ${detail}` : code);
    this.name = 'CaptainPackageExportError';
    this.code = code;
    this.detail = detail || undefined;
  }
}

function fail(code, detail) { throw new CaptainPackageExportError(code, detail); }
function sha256(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
function git(root, args) {
  try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
  catch { fail('GIT_BASE_ERROR', args.join(' ')); }
}
function gitBytes(root, args) {
  try { return execFileSync('git', args, { cwd: root, encoding: 'buffer', stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch { fail('GIT_BASE_ERROR', args.join(' ')); }
}
function isRecord(value) { return value !== null && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype; }
function assignmentKey(item) { return `${item.clip}\0${item.direction}`; }
function hasRejectedPromptGap(trial) {
  return trial?.disposition === 'rejected'
    && trial.promptAvailability === 'unavailable'
    && !('promptPath' in trial)
    && !('promptSha256' in trial);
}
function sortedAssignments(rows) {
  if (!Array.isArray(rows) || !rows.length) fail('INVALID_ASSIGNMENT');
  const seen = new Set();
  return rows.map(row => {
    if (!isRecord(row) || typeof row.clip !== 'string' || !CLIP.test(row.clip) || !['left', 'right'].includes(row.direction)) fail('INVALID_ASSIGNMENT');
    const key = assignmentKey(row);
    if (seen.has(key)) fail('DUPLICATE_ASSIGNMENT');
    seen.add(key);
    return { clip: row.clip, direction: row.direction };
  }).sort((a, b) => assignmentKey(a) < assignmentKey(b) ? -1 : assignmentKey(a) > assignmentKey(b) ? 1 : 0);
}
function assertPath(file, captainId, directory = null) {
  try { validateRelativePath(file); } catch { fail('UNSAFE_PACKAGE_PATH', String(file)); }
  const packageRoot = `tools/generate-art/studio/${captainId}/`;
  const runtimeRoot = `public/assets/animation/${captainId}-`;
  if (!file.startsWith(packageRoot) && !file.startsWith(runtimeRoot)) fail('PACKAGE_PATH_SCOPE', file);
  if (directory && !file.startsWith(`${packageRoot}${directory}/`)) fail('PACKAGE_PATH_SCOPE', file);
}
function exactFileMap(files) {
  const map = new Map();
  for (const file of files) map.set(file.path, file);
  return map;
}
function requireFile(map, path, digest, captainId, directory = null) {
  assertPath(path, captainId, directory);
  const file = map.get(path);
  if (!file) fail('DECLARED_FILE_MISSING', path);
  if (digest !== undefined && file.sha256 !== digest) fail('DECLARED_HASH_MISMATCH', path);
  return file;
}
function parseJsonBytes(bytes, code, path) {
  try { return JSON.parse(bytes.toString('utf8')); }
  catch { fail(code, path); }
}
function verifyDeclaredInventory(workerManifest, collected) {
  if (!Array.isArray(workerManifest.files)) fail('MANIFEST_FILE_INVENTORY_MISSING');
  const expected = new Map();
  for (const file of workerManifest.files) {
    if (!isRecord(file) || typeof file.path !== 'string' || !HASH.test(file.sha256) || expected.has(file.path)) fail('INVALID_DECLARED_FILE_INVENTORY');
    expected.set(file.path, file.sha256);
  }
  const actual = collected.files.filter(file => file.disposition.kind !== 'package-manifest');
  if (expected.size !== actual.length) fail('UNDECLARED_CONTRIBUTION_FILE');
  for (const file of actual) if (expected.get(file.path) !== file.sha256) fail('CONTRIBUTION_INVENTORY_MISMATCH', file.path);
  for (const path of expected.keys()) if (!actual.some(file => file.path === path)) fail('DECLARED_FILE_NOT_COLLECTED', path);
  return actual.map(({ path, sha256: digest }) => ({ path, sha256: digest }));
}
function verifyReferencedInventory(manifest, files, captainId) {
  const referenced = new Set();
  const add = file => { if (typeof file === 'string') { assertPath(file, captainId); referenced.add(file); } };
  for (const update of manifest.updates ?? []) {
    for (const key of ['assetPath', 'sourcePath', 'promptPath', 'layoutPath', 'trackPath']) add(update[key]);
    for (const file of update.reviewPaths ?? []) add(file);
  }
  for (const trial of manifest.trials ?? []) {
    for (const key of ['promptPath', 'rawSourcePath', 'toolResponsePath', 'rejectionEvidencePath']) add(trial[key]);
    for (const row of trial.cleanupLineage ?? []) { add(row?.sourcePath); add(row?.packedPath); }
  }
  for (const row of manifest.acceptance?.evidence ?? []) add(row?.path);
  for (const field of ['artworkApproval', 'trackApproval']) for (const row of manifest.reviewRecord?.[field]?.evidence ?? []) add(row?.path);
  const inventory = new Set(files.keys());
  for (const file of inventory) if (!referenced.has(file)) fail('UNREFERENCED_PACKAGE_FILE', file);
  for (const file of referenced) if (!inventory.has(file)) fail('REFERENCED_FILE_MISSING', file);
}
function verifyUpdates(manifest, assignment, files, contents, captainId) {
  if (!Array.isArray(manifest.updates)) fail('UPDATES_MISSING');
  const expected = new Map(assignment.map(item => [assignmentKey(item), item]));
  const seen = new Set();
  const updates = [];
  for (const update of manifest.updates) {
    if (!isRecord(update) || !CLIP.test(update.clip ?? '') || !['left', 'right'].includes(update.direction)) fail('INVALID_UPDATE');
    const key = assignmentKey(update), assigned = expected.get(key);
    if (!assigned) fail('UNASSIGNED_UPDATE', `${update.clip}:${update.direction}`);
    if (seen.has(key)) fail('DUPLICATE_UPDATE', `${update.clip}:${update.direction}`);
    seen.add(key);
    const runtime = `public/assets/animation/${captainId}-${update.clip}-${update.direction}.`;
    if (!update.assetPath?.startsWith(runtime) || !/\.(png|webp)$/.test(update.assetPath)) fail('RUNTIME_ATLAS_PATH_MISMATCH', update.assetPath);
    requireFile(files, update.assetPath, update.assetSha256, captainId);
    requireFile(files, update.sourcePath, update.sourceSha256, captainId, 'sources');
    requireFile(files, update.promptPath, update.promptSha256, captainId, 'prompts');
    requireFile(files, update.layoutPath, update.layoutSha256, captainId, 'layouts');
    requireFile(files, update.trackPath, update.trackSha256, captainId, 'tracks');
    if (!Array.isArray(update.reviewPaths)) fail('REVIEW_EVIDENCE_MISSING', key);
    const reviewPaths = new Set();
    for (const reviewPath of update.reviewPaths) {
      const reviewFile = requireFile(files, reviewPath, undefined, captainId, 'reviews');
      const namedType = reviewPath.slice(reviewPath.lastIndexOf('/') + 1, reviewPath.lastIndexOf('.'));
      if (!EVIDENCE_TYPES.has(namedType)) fail('UNKNOWN_REVIEW_EVIDENCE', reviewPath);
      reviewPaths.add(namedType);
      if (!reviewFile.blob.length) fail('EMPTY_REVIEW_EVIDENCE', reviewPath);
    }
    for (const type of EVIDENCE_TYPES) if (!reviewPaths.has(type)) fail('REVIEW_EVIDENCE_MISSING', `${key}:${type}`);
    if (!Array.isArray(update.cells) || !update.cells.length || !Number.isInteger(update.minimumUniqueFrames) || update.minimumUniqueFrames < 1 || update.minimumUniqueFrames > update.cells.length) fail('INVALID_FRAME_LAYOUT', key);
    const geometry = update.atlasGeometry;
    if (!isRecord(geometry) || !Number.isInteger(geometry.width) || !Number.isInteger(geometry.height) || geometry.width <= 0 || geometry.height <= 0) fail('INVALID_ATLAS_GEOMETRY', key);
    for (const frame of update.cells) {
      if (!isRecord(frame) || !['x', 'y', 'w', 'h'].every(field => Number.isInteger(frame[field])) || frame.x < 0 || frame.y < 0 || frame.w <= 0 || frame.h <= 0 || frame.x + frame.w > geometry.width || frame.y + frame.h > geometry.height) fail('INVALID_FRAME_GEOMETRY', key);
    }
    if (!Number.isFinite(update.baselineY) || update.baselineY < 0 || update.baselineY > geometry.height || !isRecord(update.frameAnchors) || !isRecord(update.timing) || !Array.isArray(update.timing.frameDurations) || !update.timing.frameDurations.length || !update.timing.frameDurations.every(duration => Number.isInteger(duration) && duration > 0) || !Number.isInteger(update.timing.durationTicks) || update.timing.frameDurations.reduce((sum, duration) => sum + duration, 0) !== update.timing.durationTicks || typeof update.timing.loop !== 'boolean' || !isRecord(update.timing.anchors)) fail('TIMING_OR_ANCHOR_INVALID', key);
    updates.push(update);
  }
  if (seen.size !== expected.size) fail('ASSIGNED_UPDATE_MISSING');
  const trials = manifest.trials;
  if (!Array.isArray(trials) || !trials.length) fail('TRIAL_LINEAGE_MISSING');
  let missingGenerationId = false;
  const trialPaths = new Set();
  for (const trial of trials) {
    if (!isRecord(trial) || !expected.has(assignmentKey(trial)) || !['accepted', 'rejected', 'quarantined'].includes(trial.disposition)) fail('INVALID_TRIAL_RECORD');
    if (typeof trial.generatedAt !== 'string' || !Number.isFinite(Date.parse(trial.generatedAt))) fail('TRIAL_TIMESTAMP_MISSING');
    if (trial.promptAvailability === 'unavailable' && !hasRejectedPromptGap(trial)) fail('PROMPT_METADATA_INVALID');
    if (!hasRejectedPromptGap(trial)) requireFile(files, trial.promptPath, trial.promptSha256, captainId, 'prompts');
    requireFile(files, trial.rawSourcePath, trial.rawSourceSha256, captainId, 'sources');
    if (trial.disposition === 'rejected') {
      if (typeof trial.rejectionReason !== 'string' || !trial.rejectionReason.trim()) fail('REJECTION_REASON_MISSING');
      requireFile(files, trial.rejectionEvidencePath, trial.rejectionEvidenceSha256, captainId, 'rejected');
    }
    trialPaths.add(trial.rawSourcePath);
    if (typeof trial.generationId !== 'string' || !trial.generationId.trim()) {
      missingGenerationId = true;
      if (typeof trial.toolResponsePath !== 'string' || !HASH.test(trial.toolResponseSha256 ?? '') || !Array.isArray(trial.retryHistory) || !trial.retryHistory.length) fail('IDLESS_TRIAL_EVIDENCE_INCOMPLETE');
      requireFile(files, trial.toolResponsePath, trial.toolResponseSha256, captainId, 'sources');
    }
  }
  for (const update of updates) if (!trialPaths.has(update.sourcePath)) fail('UPDATE_SOURCE_WITHOUT_TRIAL', assignmentKey(update));
  return { updates, trials, missingGenerationId };
}
function validateDestination(outputRoot, captainId) {
  if (typeof outputRoot !== 'string' || !outputRoot) fail('OUTPUT_ROOT_REQUIRED');
  const root = resolve(outputRoot), target = resolve(root, captainId);
  if (!target.startsWith(root + sep)) fail('UNSAFE_OUTPUT_PATH');
  return { root, target };
}
async function ensureNoSymlinkPath(root) {
  const absolute = resolve(root), parts = absolute.split(sep).filter(Boolean);
  let cursor = absolute.startsWith(sep) ? sep : '';
  for (const part of parts) {
    cursor = cursor === sep ? `${cursor}${part}` : cursor ? `${cursor}${sep}${part}` : part;
    try { const info = await lstat(cursor); if (info.isSymbolicLink()) fail('UNSAFE_OUTPUT_PATH', cursor); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
}
async function writeExport({ root, target, manifest, summary }) {
  await ensureNoSymlinkPath(root);
  await mkdir(root, { recursive: true });
  await ensureNoSymlinkPath(root);
  try { await lstat(target); fail('EXPORT_DESTINATION_EXISTS', target); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const temporary = `${target}.${process.pid}.${randomUUID()}.tmp`;
  await mkdir(temporary, { recursive: false });
  try {
    await writeFile(resolve(temporary, 'package.json'), `${canonicalJson(manifest)}\n`, { flag: 'wx', mode: 0o644 });
    await writeFile(resolve(temporary, 'package-summary.json'), `${canonicalJson(summary)}\n`, { flag: 'wx', mode: 0o644 });
    await rename(temporary, target);
  } catch (error) {
    await rm(temporary, { recursive: true, force: true });
    throw error;
  }
}

/**
 * Export one immutable captain package from a clean, coordinator-assigned worker
 * commit. Runtime atlases remain in the Git worker tree; exported JSON records
 * their hashes and paths without duplicating their bytes.
 */
export async function exportCaptainPackage({ baseRoot, contributionRoot, captainId, baseCommit, workerCommit, assignment, outputRoot }) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(captainId ?? '')) fail('INVALID_CAPTAIN_ID');
  if (typeof baseRoot !== 'string' || typeof contributionRoot !== 'string') fail('INVALID_REPOSITORY_ROOT');
  const { root, target } = validateDestination(outputRoot, captainId);
  const resolvedBase = resolve(baseRoot), resolvedContribution = resolve(contributionRoot);
  if (git(resolvedBase, ['rev-parse', '--verify', `${baseCommit}^{commit}`]) !== baseCommit) fail('BASE_COMMIT_MISMATCH');
  if (git(resolvedBase, ['rev-parse', 'HEAD']) !== baseCommit) fail('BASE_WORKTREE_NOT_PINNED');
  const assigned = sortedAssignments(assignment?.missing);
  const collected = await collectCaptainContribution({ repositoryRoot: resolvedContribution, baseCommit, workerCommit, captainId, assignment: { missing: assigned } });
  const manifests = collected.files.filter(file => file.disposition.kind === 'package-manifest');
  if (manifests.length !== 1 || manifests[0].path !== `tools/generate-art/studio/${captainId}/package.json`) fail('PACKAGE_MANIFEST_MISSING_OR_AMBIGUOUS');
  const sourceManifest = parseJsonBytes(manifests[0].blob, 'INVALID_PACKAGE_JSON', manifests[0].path);
  if (!isRecord(sourceManifest) || sourceManifest.schemaVersion !== 1 || sourceManifest.captainId !== captainId || sourceManifest.baseCommit !== baseCommit) fail('PACKAGE_IDENTITY_MISMATCH');
  if (!HASH.test(sourceManifest.expectedCaptainStateSha256 ?? '') || typeof sourceManifest.createdAt !== 'string' || !Number.isFinite(Date.parse(sourceManifest.createdAt)) || !isRecord(sourceManifest.producer)) fail('PACKAGE_METADATA_MISSING');
  if (canonicalJson(sortedAssignments(sourceManifest.assignments)) !== canonicalJson(assigned)) fail('MANIFEST_ASSIGNMENT_MISMATCH');
  if ('packageId' in sourceManifest || 'workerCommit' in sourceManifest) fail('WORKER_SUPPLIED_COORDINATOR_FIELD');
  const declaredFiles = verifyDeclaredInventory(sourceManifest, collected);
  const filesByPath = exactFileMap(collected.files);
  for (const file of collected.files) {
    if (file.disposition.kind === 'package-manifest') continue;
    assertPath(file.path, captainId);
    if (!HASH.test(file.sha256)) fail('INVALID_FILE_HASH', file.path);
    const actual = sha256(file.blob);
    if (actual !== file.sha256) fail('FILE_HASH_MISMATCH', file.path);
  }
  const { updates, trials, missingGenerationId } = verifyUpdates(sourceManifest, assigned, filesByPath, collected.files, captainId);
  verifyReferencedInventory(sourceManifest, new Map(declaredFiles.map(file => [file.path, file])), captainId);
  if (!Array.isArray(sourceManifest.dependencies)) fail('INVALID_DEPENDENCY_DECLARATION');
  for (const dependency of sourceManifest.dependencies) {
    if (!isRecord(dependency) || typeof dependency.id !== 'string' || !HASH.test(dependency.sha256) || typeof dependency.path !== 'string') fail('INVALID_DEPENDENCY_DECLARATION');
    let dependencyPath; try { dependencyPath = validateRelativePath(dependency.path); } catch { fail('INVALID_DEPENDENCY_DECLARATION'); }
    const baselineBytes = gitBytes(resolvedBase, ['show', `${baseCommit}:${dependencyPath}`]);
    if (sha256(baselineBytes) !== dependency.sha256) fail('DEPENDENCY_NOT_IN_BASELINE', dependency.path);
  }
  if (!isRecord(sourceManifest.artworkInventory) || !isRecord(sourceManifest.trackInventory) || !Array.isArray(sourceManifest.trackInventory.assignments)) fail('ARTWORK_OR_TRACK_INVENTORY_MISSING');
  const artworkAssignments = sortedAssignments(sourceManifest.artworkInventory.assignments);
  if (canonicalJson(artworkAssignments) !== canonicalJson(assigned)) fail('ARTWORK_ASSIGNMENT_MISMATCH');
  const expectedArtworkPaths = new Map();
  for (const update of updates) {
    for (const [path, digest] of [[update.sourcePath, update.sourceSha256], [update.assetPath, update.assetSha256], [update.layoutPath, update.layoutSha256]]) expectedArtworkPaths.set(path, digest);
    const trackBytes = filesByPath.get(update.trackPath).blob;
    const decodedTrack = parseJsonBytes(trackBytes, 'INVALID_TRACK_JSON', update.trackPath);
    const trackAssignment = sourceManifest.trackInventory.assignments.find(row => row.clip === update.clip && row.direction === update.direction);
    if (!trackAssignment || canonicalJson(decodedTrack) !== canonicalJson(trackAssignment.track) || canonicalJson(trackAssignment.anchors) !== canonicalJson(decodedTrack.anchors ?? {})) fail('TRACK_INVENTORY_MISMATCH', update.trackPath);
  }
  if (sourceManifest.trackInventory.assignments.length !== updates.length || sourceManifest.trackInventory.assignments.some(row => !updates.some(update => update.clip === row.clip && update.direction === row.direction))) fail('TRACK_ASSIGNMENT_MISMATCH');
  if (!Array.isArray(sourceManifest.artworkInventory.files)) fail('ARTWORK_FILE_INVENTORY_MISSING');
  const artworkFiles = sourceManifest.artworkInventory.files;
  if (artworkFiles.length !== expectedArtworkPaths.size) fail('ARTWORK_FILE_INVENTORY_MISMATCH');
  for (const file of artworkFiles) if (expectedArtworkPaths.get(file.path) !== file.sha256) fail('ARTWORK_FILE_INVENTORY_MISMATCH', file.path);
  const expectedLineage = updates.map(update => ({ clip: update.clip, direction: update.direction, sourcePath: update.sourcePath, sourceSha256: update.sourceSha256, packedPath: update.assetPath, packedSha256: update.assetSha256 }));
  if (canonicalJson(sourceManifest.artworkInventory.lineage) !== canonicalJson(expectedLineage)) fail('ARTWORK_LINEAGE_MISMATCH');
  const artworkDigest = computeArtworkDigest({ artworkInventory: sourceManifest.artworkInventory });
  if (sourceManifest.artworkDigest && sourceManifest.artworkDigest !== artworkDigest) fail('ARTWORK_DIGEST_MISMATCH');
  const trackDigest = computeTrackDigest({ trackInventory: sourceManifest.trackInventory });
  if (sourceManifest.trackDigest && sourceManifest.trackDigest !== trackDigest) fail('TRACK_DIGEST_MISMATCH');
  const evidencePaths = new Set(updates.flatMap(update => update.reviewPaths));
  for (const path of evidencePaths) requireFile(filesByPath, path, undefined, captainId, 'reviews');
  const state = missingGenerationId ? 'quarantined' : 'accepted';
  const reasonCodes = missingGenerationId ? ['GENERATION_ID_MISSING'] : [];
  const { assignments: workerAssignments, state: workerState, reasonCodes: workerReasonCodes, ...packageFields } = sourceManifest;
  const manifest = {
    ...packageFields,
    baseCommit,
    captainId,
    reviewRecord: { ...(sourceManifest.reviewRecord ?? {}), workerCommit },
    files: declaredFiles,
    updates,
    trials,
    artworkDigest,
    trackDigest,
  };
  if (state === 'quarantined') manifest.acceptance = { ...sourceManifest.acceptance, state: 'quarantined', reasonCodes };
  const packageId = computePackageDigest({ manifest, files: declaredFiles });
  manifest.packageId = packageId;
  const summary = {
    schemaVersion: 1,
    packageId,
    captainId,
    baseCommit,
    workerCommit,
    state,
    reasonCodes,
    warnings: trials.filter(hasRejectedPromptGap).map(trial => ({ code: 'REJECTED_PROMPT_UNAVAILABLE', clip: trial.clip, direction: trial.direction })).sort((a, b) => `${a.clip}\0${a.direction}`.localeCompare(`${b.clip}\0${b.direction}`)),
    updateCount: updates.length,
    trialCount: trials.length,
    fileCount: declaredFiles.length,
    runtimeAtlasPaths: updates.map(update => update.assetPath).sort(),
    artworkDigest,
    trackDigest,
  };
  await writeExport({ root, target, manifest, summary });
  return { ...summary, updates, trials, outputPath: target };
}

export { computePackageDigest };
