import { createHash } from 'node:crypto';
import { lstat, readFile } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { decodeImage, inspectFrames } from '../animation-assets.mjs';
import { canonicalJson } from './canonical-json.mjs';
import { computeArtworkDigest, computePackageDigest, computeTrackDigest, canonicalFileInventory, validateRelativePath } from './package-hash.mjs';
import { verifyReviewApproval } from './review-requests.mjs';

const SHA256 = /^[a-f0-9]{64}$/;
const COMMIT = /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/;
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REQUIRED_EVIDENCE = ['anatomy-identity', 'ball-track', 'full-set', 'layout-transparency', 'normal-loader', 'source-art', 'timing-anchors'];
const ROOT_FIELDS = ['schemaVersion', 'packageId', 'captainId', 'baseCommit', 'createdAt', 'producer', 'expectedCaptainStateSha256', 'mirrorPolicyHash', 'updates', 'trials', 'acceptance', 'dependencies', 'artworkInventory', 'trackInventory', 'artworkDigest', 'trackDigest', 'reviewRecord', 'files'];

function issue(code, path = '') { return { code, ...(path ? { path } : {}) }; }
function validText(value) { return typeof value === 'string' && value.trim().length > 0; }
function sortIssues(issues) { return [...issues].sort((a, b) => a.code.localeCompare(b.code) || (a.path ?? '').localeCompare(b.path ?? '')); }
function sortAssignments(values) {
  return [...values].map(value => ({ clip: value.clip, direction: value.direction })).sort((a, b) => `${a.clip}\0${a.direction}`.localeCompare(`${b.clip}\0${b.direction}`));
}
function keyOf(value) { return `${value.clip}\0${value.direction}`; }
function hash(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
function isObject(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function hasRejectedPromptGap(trial) {
  return trial?.disposition === 'rejected'
    && trial.promptAvailability === 'unavailable'
    && !('promptPath' in trial)
    && !('promptSha256' in trial);
}

async function noSymlinkFile(root, file) {
  validateRelativePath(file);
  const target = resolve(root, file);
  const rel = relative(resolve(root), target);
  if (!rel || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) throw Object.assign(new Error('PATH_OUTSIDE_ROOT'), { code: 'PATH_OUTSIDE_ROOT' });
  let current = resolve(root);
  const parts = rel.split(sep);
  for (let index = 0; index < parts.length; index++) {
    current = resolve(current, parts[index]);
    const info = await lstat(current);
    if (info.isSymbolicLink()) throw Object.assign(new Error('SYMLINK_REJECTED'), { code: 'SYMLINK_REJECTED' });
    if (index < parts.length - 1 && !info.isDirectory()) throw Object.assign(new Error('INVALID_PATH_COMPONENT'), { code: 'INVALID_PATH_COMPONENT' });
    if (index === parts.length - 1 && !info.isFile()) throw Object.assign(new Error('INVALID_FILE_TYPE'), { code: 'INVALID_FILE_TYPE' });
  }
  return { target, bytes: await readFile(target) };
}

function scopePath(file, captainId) {
  const studio = `tools/generate-art/studio/${captainId}/`;
  const runtime = `public/assets/animation/${captainId}-`;
  if (file.startsWith(runtime)) return /\.(png|webp)$/.test(file);
  if (!file.startsWith(studio)) return false;
  const tail = file.slice(studio.length).split('/');
  const allowed = new Set(['prompts', 'sources', 'layouts', 'tracks', 'reviews', 'previews', 'rejected']);
  return tail.length >= 2 && allowed.has(tail[0]);
}

/**
 * Read-only validation of one full missing-clip package against a pinned base.
 * The caller must provide coordinator-owned review-request/dispatch ledgers in
 * `baseline`; package-local metadata cannot authorize its own review.
 */
export async function validatePackage({ packageRoot, baseRoot, baseCommit, baseline, manifestRoot = packageRoot, manifestRelativePath }) {
  const errors = [], updates = [];
  let manifest;
  try {
    if (typeof packageRoot !== 'string' || typeof manifestRoot !== 'string' || typeof baseRoot !== 'string' || !COMMIT.test(baseCommit ?? '')) {
      return { ok: false, packageId: null, captainId: null, baseCommit: baseCommit ?? null, updates, errors: [issue('INVALID_VALIDATION_INPUT')] };
    }
    const packagePath = resolve(packageRoot), manifestPathRoot = resolve(manifestRoot), basePath = resolve(baseRoot);
    const packageStat = await lstat(packagePath), manifestRootStat = await lstat(manifestPathRoot), baseStat = await lstat(basePath);
    if (packageStat.isSymbolicLink() || !packageStat.isDirectory() || manifestRootStat.isSymbolicLink() || !manifestRootStat.isDirectory() || baseStat.isSymbolicLink() || !baseStat.isDirectory()) {
      return { ok: false, packageId: null, captainId: null, baseCommit, updates, errors: [issue('INVALID_REPOSITORY_ROOT')] };
    }
    // The captain ID is not trusted until read from the manifest, so validate the
    // manifest path's generic safety before deriving its captain namespace.
    const manifestNamespace = 'tools/generate-art/studio';
    const manifests = [];
    if (manifestRelativePath !== undefined) {
      const candidate = validateRelativePath(manifestRelativePath);
      manifests.push(candidate);
    } else {
      const packageDirectory = resolve(packagePath, manifestNamespace);
      const manifestStat = await lstat(packageDirectory);
      if (manifestStat.isSymbolicLink() || !manifestStat.isDirectory()) throw Object.assign(new Error('SYMLINK_REJECTED'), { code: 'SYMLINK_REJECTED' });
      const captainDirs = await (await import('node:fs/promises')).readdir(packageDirectory, { withFileTypes: true });
      for (const dir of captainDirs) {
        if (dir.isSymbolicLink()) { errors.push(issue('SYMLINK_REJECTED', `${manifestNamespace}/${dir.name}`)); continue; }
        if (!dir.isDirectory()) continue;
        const candidate = `${manifestNamespace}/${dir.name}/package.json`;
        try { await noSymlinkFile(packagePath, candidate); manifests.push(candidate); }
        catch (error) { if (error.code !== 'ENOENT') errors.push(issue(error.code || 'PACKAGE_READ_FAILED', candidate)); }
      }
    }
    if (manifests.length !== 1) errors.push(issue(manifests.length > 1 ? 'MULTIPLE_CAPTAINS' : 'PACKAGE_MANIFEST_MISSING'));
    if (errors.length) return { ok: false, packageId: null, captainId: null, baseCommit, updates, errors: sortIssues(errors) };
    const loaded = await noSymlinkFile(manifestRelativePath === undefined ? packagePath : manifestPathRoot, manifests[0]);
    try { manifest = JSON.parse(loaded.bytes.toString('utf8')); }
    catch { errors.push(issue('MALFORMED_PACKAGE_JSON', manifests[0])); }
    if (!isObject(manifest)) errors.push(issue('INVALID_PACKAGE_MANIFEST'));
  } catch (error) {
    errors.push(issue(error.code || 'PACKAGE_READ_FAILED'));
    return { ok: false, packageId: null, captainId: null, baseCommit: baseCommit ?? null, updates, errors: sortIssues(errors) };
  }

  const captainId = manifest?.captainId ?? null, packageId = manifest?.packageId ?? null;
  if (Object.keys(manifest).some(key => !ROOT_FIELDS.includes(key))) errors.push(issue('UNKNOWN_MANIFEST_FIELD'));
  for (const field of ROOT_FIELDS) if (!(field in manifest)) errors.push(issue('REQUIRED_FIELD_MISSING', field));
  if (manifest.schemaVersion !== 1) errors.push(issue('SCHEMA_VERSION_UNSUPPORTED'));
  if (!ID.test(captainId ?? '')) errors.push(issue('INVALID_CAPTAIN_ID'));
  if (!SHA256.test(packageId ?? '')) errors.push(issue('PACKAGE_DIGEST_INVALID'));
  if (manifest.baseCommit !== baseCommit || baseline?.baseCommit !== baseCommit) errors.push(issue('STALE_BASE'));
  if (!/^[0-9a-f]{64}$/.test(manifest.expectedCaptainStateSha256 ?? '') || manifest.expectedCaptainStateSha256 !== baseline?.captains?.[captainId]?.stateSha256) errors.push(issue('CAPTAIN_STATE_MISMATCH'));
  if (manifest.mirrorPolicyHash !== baseline?.mirrorPolicyHash) errors.push(issue('MIRROR_POLICY_MISMATCH'));
  if (!validText(manifest.createdAt) || !Number.isFinite(Date.parse(manifest.createdAt)) || !isObject(manifest.producer) || !Object.keys(manifest.producer).length) errors.push(issue('PRODUCER_METADATA_INVALID'));
  if (!Array.isArray(manifest.updates) || !Array.isArray(manifest.trials) || !Array.isArray(manifest.dependencies) || !Array.isArray(manifest.files)) errors.push(issue('PACKAGE_COLLECTION_INVALID'));
  if (!isObject(manifest.acceptance) || !['accepted', 'quarantined', 'rejected'].includes(manifest.acceptance.state)) errors.push(issue('PACKAGE_STATE_INVALID'));
  else if (manifest.acceptance.state !== 'accepted') errors.push(issue(manifest.acceptance.state === 'quarantined' ? 'PACKAGE_QUARANTINED' : 'PACKAGE_NOT_ACCEPTED'));
  if (!isObject(manifest.reviewRecord)) errors.push(issue('REVIEW_RECORD_MISSING'));

  const captainBase = baseline?.captains?.[captainId];
  const expectedMissing = Array.isArray(captainBase?.missing) ? sortAssignments(captainBase.missing) : [];
  const updateAssignments = Array.isArray(manifest.updates) ? manifest.updates.map(({ clip, direction }) => ({ clip, direction })) : [];
  const updateKeys = new Set();
  for (const update of manifest.updates ?? []) {
    if (!isObject(update) || !ID.test(update.clip ?? '') || !['left', 'right'].includes(update.direction)) { errors.push(issue('ASSIGNMENT_INVALID')); continue; }
    const key = keyOf(update);
    if (updateKeys.has(key)) errors.push(issue('DUPLICATE_ASSIGNMENT', key.replace('\0', ':')));
    updateKeys.add(key);
    if (!expectedMissing.some(item => keyOf(item) === key)) errors.push(issue('UNASSIGNED_CLIP', key.replace('\0', ':')));
  }
  if (updateKeys.size !== expectedMissing.length || expectedMissing.some(item => !updateKeys.has(keyOf(item)))) errors.push(issue('ASSIGNMENT_SET_MISMATCH'));
  const acceptedPaths = new Set(captainBase?.acceptedAssetPaths ?? []);

  const fileRows = [];
  try {
    const canonical = canonicalFileInventory(manifest.files ?? []);
    if (canonical.length !== (manifest.files ?? []).length) errors.push(issue('FILE_INVENTORY_INVALID'));
    for (const record of manifest.files ?? []) {
      if (!isObject(record) || Object.keys(record).sort().join('\0') !== 'path\0sha256' || !scopePath(record.path, captainId)) {
        errors.push(issue('PACKAGE_PATH_SCOPE_INVALID', record?.path ?? ''));
        continue;
      }
      const found = await noSymlinkFile(packageRoot, record.path);
      const actual = hash(found.bytes);
      if (actual !== record.sha256) errors.push(issue('FILE_HASH_MISMATCH', record.path));
      fileRows.push({ path: record.path, sha256: actual, bytes: found.bytes, size: found.bytes.length, file: found.target });
    }
  } catch (error) { errors.push(issue(error.code || 'FILE_INVENTORY_INVALID', error.path ?? '')); }
  const byPath = new Map(fileRows.map(row => [row.path, row]));
  const referenced = new Set();
  const requireFile = (file, digest, code = 'REFERENCED_FILE_MISSING') => {
    try { validateRelativePath(file); } catch { errors.push(issue('UNSAFE_PATH', String(file ?? ''))); return null; }
    if (!scopePath(file, captainId)) { errors.push(issue('PACKAGE_PATH_SCOPE_INVALID', file)); return null; }
    const row = byPath.get(file);
    if (!row) { errors.push(issue(code, file)); return null; }
    referenced.add(file);
    if (!SHA256.test(digest ?? '') || digest !== row.sha256) errors.push(issue('REFERENCED_HASH_MISMATCH', file));
    return row;
  };

  const assetPaths = new Set();
  for (const update of manifest.updates ?? []) {
    if (!isObject(update)) continue;
    const { clip, direction, assetPath, assetSha256, sourcePath, sourceSha256, layoutPath, layoutSha256, trackPath, trackSha256 } = update;
    if (typeof clip !== 'string' || !['left', 'right'].includes(direction)) continue;
    const acceptedPrompt = (manifest.trials ?? []).find(item => keyOf(item) === keyOf(update) && item.disposition === 'accepted');
    if (!acceptedPrompt || update.promptPath !== acceptedPrompt.promptPath || update.promptSha256 !== acceptedPrompt.promptSha256) errors.push(issue('PROMPT_LINEAGE_MISMATCH', `${clip}:${direction}`));
    requireFile(update.promptPath, update.promptSha256);
    const expectedAsset = `public/assets/animation/${captainId}-${clip}-${direction}.${String(assetPath).endsWith('.png') ? 'png' : 'webp'}`;
    if (assetPath !== expectedAsset || acceptedPaths.has(assetPath)) errors.push(issue('ACCEPTED_OR_INVALID_ASSET_PATH', assetPath ?? ''));
    if (assetPaths.has(assetPath)) errors.push(issue('DUPLICATE_ASSET_PATH', assetPath));
    assetPaths.add(assetPath);
    try {
      validateRelativePath(assetPath);
      const target = resolve(baseRoot, assetPath), rel = relative(resolve(baseRoot), target);
      if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) throw new Error('unsafe');
      await noSymlinkFile(baseRoot, assetPath);
      errors.push(issue('BASE_ASSET_EXISTS', assetPath));
    } catch (error) {
      if (error.code !== 'ENOENT') errors.push(issue(error.code === 'SYMLINK_REJECTED' ? error.code : error.message === 'unsafe' ? 'UNSAFE_PATH' : 'BASE_PATH_INVALID', assetPath));
    }
    const atlas = requireFile(assetPath, assetSha256);
    const source = requireFile(sourcePath, sourceSha256);
    requireFile(layoutPath, layoutSha256);
    const trackRow = requireFile(trackPath, trackSha256);
    if (atlas && isObject(update.atlasGeometry) && Array.isArray(update.cells)) {
      try {
        const decoded = await decodeImage(atlas.file);
        if (decoded.width !== update.atlasGeometry.width || decoded.height !== update.atlasGeometry.height) errors.push(issue('ATLAS_GEOMETRY_MISMATCH', assetPath));
        const frames = inspectFrames(decoded, update.cells);
        if (frames.some(frame => frame.error || !frame.visiblePixels)) errors.push(issue('INVALID_FRAME_GEOMETRY', assetPath));
        const unique = new Set(frames.filter(frame => !frame.error && frame.visiblePixels).map(frame => frame.hash));
        if (unique.size < update.minimumUniqueFrames) errors.push(issue('UNIQUE_FRAME_SHORTFALL', assetPath));
        if (!Number.isInteger(update.minimumUniqueFrames) || update.minimumUniqueFrames < 1) errors.push(issue('FRAME_MINIMUM_INVALID', assetPath));
      } catch { errors.push(issue('ATLAS_DECODE_FAILED', assetPath)); }
      if (!Number.isFinite(update.baselineY) || update.baselineY < 0 || update.baselineY > update.atlasGeometry.height) errors.push(issue('BASELINE_INVALID', assetPath));
      if (!Array.isArray(update.cells) || update.cells.length === 0) errors.push(issue('FRAME_GEOMETRY_MISSING', assetPath));
    } else errors.push(issue('ATLAS_GEOMETRY_MISSING', assetPath ?? ''));
    const timing = update.timing;
    if (!isObject(timing) || !Array.isArray(timing.frameDurations) || !Number.isInteger(timing.durationTicks) || timing.durationTicks <= 0 || timing.frameDurations.some(value => !Number.isInteger(value) || value <= 0) || timing.frameDurations.reduce((sum, value) => sum + value, 0) !== timing.durationTicks || typeof timing.loop !== 'boolean' || !isObject(timing.anchors)) errors.push(issue('TIMING_INVALID', `${clip}:${direction}`));
    else for (const [anchor, frame] of Object.entries(update.frameAnchors ?? {})) if (!Number.isInteger(frame) || frame < 0 || frame >= timing.frameDurations.length || timing.anchors[anchor] !== frame) errors.push(issue('ACTION_ANCHOR_INVALID', `${clip}:${direction}:${anchor}`));
    if (source && !['.png', '.webp'].includes(source.file.slice(source.file.lastIndexOf('.')))) errors.push(issue('RAW_SOURCE_TYPE_INVALID', sourcePath));
    if (source) {
      try { await decodeImage(source.file); }
      catch { errors.push(issue('RAW_SOURCE_DECODE_FAILED', sourcePath)); }
    }
    if (trackRow) {
      try {
        const track = JSON.parse(trackRow.bytes.toString('utf8'));
        const inventoryTrack = manifest.trackInventory?.assignments?.find(item => item.clip === clip && item.direction === direction);
        if (!inventoryTrack || canonicalJson(inventoryTrack.track) !== canonicalJson(track)) errors.push(issue('TRACK_INVENTORY_MISMATCH', trackPath));
        if (!Array.isArray(track.height) || !Array.isArray(track.forward) || track.height.length !== track.forward.length || track.height.some(value => !Number.isFinite(value)) || track.forward.some(value => !Number.isFinite(value)) || track.height.length !== update.timing?.frameDurations?.length) errors.push(issue('TRACK_DATA_INVALID', trackPath));
        updates.push({ clip, direction, assetPath, assetSha256, manifestEntry: update, trackPath, trackSha256, track });
      } catch { errors.push(issue('TRACK_JSON_INVALID', trackPath)); }
    }
  }

  const trialKeys = new Set();
  const warnings = [];
  for (const trial of manifest.trials ?? []) {
    if (!isObject(trial) || !ID.test(trial.clip ?? '') || !['left', 'right'].includes(trial.direction)) { errors.push(issue('TRIAL_INVALID')); continue; }
    const key = keyOf(trial); trialKeys.add(key);
    const rejectedPromptGap = hasRejectedPromptGap(trial);
    if (trial.promptAvailability === 'unavailable' && !rejectedPromptGap) errors.push(issue('PROMPT_METADATA_INVALID', key.replace('\0', ':')));
    const prompt = rejectedPromptGap ? null : (typeof trial.promptPath === 'string' ? requireFile(trial.promptPath, trial.promptSha256) : null);
    if (!rejectedPromptGap && (!validText(trial.promptPath) || !SHA256.test(trial.promptSha256 ?? ''))) errors.push(issue('PROMPT_METADATA_INVALID', key.replace('\0', ':')));
    if (rejectedPromptGap) warnings.push(issue('REJECTED_PROMPT_UNAVAILABLE', key.replace('\0', ':')));
    const raw = requireFile(trial.rawSourcePath, trial.rawSourceSha256);
    if (!validText(trial.generationId)) {
      errors.push(issue('GENERATION_ID_MISSING', key.replace('\0', ':')));
      if (!trial.toolResponsePath || !trial.toolResponseSha256 || !validText(trial.generatedAt)) errors.push(issue('GENERATION_FAILURE_LINEAGE_MISSING', key.replace('\0', ':')));
      else requireFile(trial.toolResponsePath, trial.toolResponseSha256, 'GENERATION_TOOL_RESPONSE_MISSING');
    }
    if (!validText(trial.generatedAt) || !Number.isFinite(Date.parse(trial.generatedAt))) errors.push(issue('TRIAL_TIMESTAMP_INVALID', key.replace('\0', ':')));
    if (!validText(trial.reviewer)) errors.push(issue('TRIAL_REVIEWER_MISSING', key.replace('\0', ':')));
    if (!Array.isArray(trial.cleanupLineage) || (trial.disposition === 'accepted' && trial.cleanupLineage.length === 0)) errors.push(issue('CLEANUP_LINEAGE_MISSING', key.replace('\0', ':')));
    const update = (manifest.updates ?? []).find(item => keyOf(item) === key);
    for (const lineage of trial.cleanupLineage ?? []) {
      if (!isObject(lineage)) { errors.push(issue('CLEANUP_LINEAGE_INVALID', key.replace('\0', ':'))); continue; }
      requireFile(lineage.sourcePath, lineage.sourceSha256, 'LINEAGE_SOURCE_MISSING');
      requireFile(lineage.packedPath, lineage.packedSha256, 'LINEAGE_PACKED_MISSING');
      if (trial.disposition === 'accepted' && update && (lineage.sourcePath !== update.sourcePath || lineage.packedPath !== update.assetPath)) errors.push(issue('CLEANUP_LINEAGE_MISMATCH', key.replace('\0', ':')));
    }
    if (trial.disposition === 'rejected') {
      if (!validText(trial.rejectionReason)) errors.push(issue('REJECTION_REASON_MISSING', key.replace('\0', ':')));
      if (!validText(trial.rejectionEvidencePath)) errors.push(issue('REJECTION_EVIDENCE_MISSING', key.replace('\0', ':')));
      else requireFile(trial.rejectionEvidencePath, trial.rejectionEvidenceSha256, 'REJECTION_EVIDENCE_MISSING');
    }
    if (trial.disposition === 'accepted' && (!validText(trial.generationId) || !prompt || !raw)) errors.push(issue('ACCEPTED_TRIAL_INCOMPLETE', key.replace('\0', ':')));
    if (!expectedMissing.some(item => keyOf(item) === key)) errors.push(issue('UNASSIGNED_TRIAL', key.replace('\0', ':')));
  }
  // A rejected trial with unavailable prompt text can remain in provenance,
  // but its image must not feed accepted artwork (including byte-identical
  // aliases at another path). Otherwise the exception would describe an
  // accepted drawing whose complete source prompt is unknowable.
  const checkedRejectedSources = new Set();
  for (const rejected of (manifest.trials ?? []).filter(hasRejectedPromptGap)) {
    const identity = `${rejected.rawSourcePath}\0${rejected.rawSourceSha256}`;
    if (checkedRejectedSources.has(identity)) continue;
    checkedRejectedSources.add(identity);
    const dependsOnRejectedSource = (file, digest) => file === rejected.rawSourcePath || digest === rejected.rawSourceSha256;
    const dependencyPath = (file, digest) => {
      if (dependsOnRejectedSource(file, digest)) errors.push(issue('REJECTED_PROMPT_SOURCE_ACCEPTED_DEPENDENCY', file ?? rejected.rawSourcePath));
    };
    for (const update of manifest.updates ?? []) {
      dependencyPath(update.sourcePath, update.sourceSha256);
      dependencyPath(update.assetPath, update.assetSha256);
      dependencyPath(update.layoutPath, update.layoutSha256);
    }
    for (const acceptedTrial of (manifest.trials ?? []).filter(item => item?.disposition === 'accepted')) {
      dependencyPath(acceptedTrial.rawSourcePath, acceptedTrial.rawSourceSha256);
      for (const lineage of acceptedTrial.cleanupLineage ?? []) {
        dependencyPath(lineage?.sourcePath, lineage?.sourceSha256);
        dependencyPath(lineage?.packedPath, lineage?.packedSha256);
      }
    }
    for (const file of manifest.artworkInventory?.files ?? []) dependencyPath(file?.path, file?.sha256);
    for (const lineage of manifest.artworkInventory?.lineage ?? []) {
      dependencyPath(lineage?.sourcePath, lineage?.sourceSha256);
      dependencyPath(lineage?.packedPath, lineage?.packedSha256);
    }
  }
  for (const item of expectedMissing) if (!trialKeys.has(keyOf(item))) errors.push(issue('TRIAL_MISSING', keyOf(item).replace('\0', ':')));
  for (const item of expectedMissing) if (!(manifest.trials ?? []).some(trial => keyOf(trial) === keyOf(item) && trial.disposition === 'accepted')) errors.push(issue('ACCEPTED_TRIAL_MISSING', keyOf(item).replace('\0', ':')));

  const evidenceTypes = new Set();
  if (!Array.isArray(manifest.acceptance?.evidence)) errors.push(issue('ACCEPTANCE_EVIDENCE_MISSING'));
  for (const evidence of manifest.acceptance?.evidence ?? []) {
    if (!isObject(evidence) || !validText(evidence.type)) { errors.push(issue('EVIDENCE_RECORD_INVALID')); continue; }
    evidenceTypes.add(evidence.type);
    requireFile(evidence.path, evidence.sha256, 'EVIDENCE_FILE_MISSING');
  }
  for (const type of REQUIRED_EVIDENCE) if (!evidenceTypes.has(type)) errors.push(issue(type === 'full-set' ? 'FULL_SET_REVIEW_MISSING' : 'REVIEW_EVIDENCE_MISSING', type));
  const review = manifest.reviewRecord;
  if (isObject(review)) {
    if (!validText(review.workerSessionId) || !validText(review.author) || !validText(review.owner) || !validText(review.reviewerIdentity)) errors.push(issue('REVIEW_IDENTITY_MISSING'));
    for (const [field, scope, digest] of [['artworkApproval', 'artwork', manifest.artworkDigest], ['trackApproval', 'track-gameplay', manifest.trackDigest]]) {
      const approval = review[field];
      if (!isObject(approval)) { errors.push(issue('INDEPENDENT_REVIEW_MISSING', field)); continue; }
      if (approval.scope !== scope || approval.artworkDigest !== manifest.artworkDigest || approval.trackDigest !== manifest.trackDigest || approval.reviewerSessionId === review.workerSessionId) errors.push(issue('REVIEW_DIGEST_OR_SESSION_MISMATCH', field));
      const verified = verifyReviewApproval({
        approval, issuedRequests: baseline?.issuedRequests, dispatchRecords: baseline?.dispatchRecords, usedNonces: baseline?.usedNonces,
      });
      if (!verified.ok) errors.push(...verified.errors.map(code => issue(`REVIEW_${code}`, field)));
      for (const evidence of approval.evidence ?? []) requireFile(evidence.path, evidence.sha256, 'REVIEW_EVIDENCE_FILE_MISSING');
      if (digest !== (scope === 'artwork' ? manifest.artworkDigest : manifest.trackDigest)) errors.push(issue('REVIEW_DIGEST_MISMATCH', field));
    }
  }

  for (const dependency of manifest.dependencies ?? []) {
    const known = baseline?.dependencies?.find(item => (typeof item === 'string' ? item : item.id) === dependency.id);
    if (!known || typeof known !== 'object' || known.sha256 !== dependency.sha256) errors.push(issue('DEPENDENCY_MISSING', dependency.id ?? ''));
  }

  try {
    if (canonicalJson(sortAssignments(manifest.artworkInventory?.assignments ?? [])) !== canonicalJson(sortAssignments(updateAssignments))) errors.push(issue('ARTWORK_ASSIGNMENT_MISMATCH'));
    const expectedArtFiles = [];
    for (const update of manifest.updates ?? []) for (const [file, digest] of [[update.sourcePath, update.sourceSha256], [update.layoutPath, update.layoutSha256], [update.assetPath, update.assetSha256]]) expectedArtFiles.push({ path: file, sha256: digest });
    if (canonicalJson(canonicalFileInventory(manifest.artworkInventory?.files ?? [])) !== canonicalJson(canonicalFileInventory(expectedArtFiles))) errors.push(issue('ARTWORK_FILE_INVENTORY_MISMATCH'));
    for (const update of manifest.updates ?? []) {
      const lineage = manifest.artworkInventory?.lineage?.find(item => item.sourcePath === update.sourcePath && item.packedPath === update.assetPath);
      const geometry = manifest.artworkInventory?.geometry?.find(item => item.layoutPath === update.layoutPath && item.width === update.atlasGeometry?.width && item.height === update.atlasGeometry?.height && canonicalJson(item.cells) === canonicalJson(update.cells));
      if (!lineage) errors.push(issue('SOURCE_PACKED_LINEAGE_MISMATCH', `${update.clip}:${update.direction}`));
      if (!geometry) errors.push(issue('ARTWORK_GEOMETRY_MISMATCH', `${update.clip}:${update.direction}`));
    }
    const computed = computeArtworkDigest({ artworkInventory: manifest.artworkInventory });
    if (computed !== manifest.artworkDigest) errors.push(issue('ARTWORK_DIGEST_MISMATCH'));
  } catch { errors.push(issue('ARTWORK_INVENTORY_INVALID')); }
  try {
    const trackEntries = manifest.trackInventory?.assignments;
    if (!Array.isArray(trackEntries) || canonicalJson(sortAssignments(trackEntries)) !== canonicalJson(sortAssignments(updateAssignments))) errors.push(issue('TRACK_ASSIGNMENT_MISMATCH'));
    const computed = computeTrackDigest({ trackInventory: manifest.trackInventory });
    if (computed !== manifest.trackDigest) errors.push(issue('TRACK_DIGEST_MISMATCH'));
  } catch { errors.push(issue('TRACK_INVENTORY_INVALID')); }

  const inventoryPaths = new Set((manifest.files ?? []).map(file => file.path));
  for (const file of inventoryPaths) if (!referenced.has(file)) errors.push(issue('UNREFERENCED_PACKAGE_FILE', file));
  for (const file of referenced) if (!inventoryPaths.has(file)) errors.push(issue('FILE_INVENTORY_MISSING_REFERENCE', file));
  if (errors.length === 0) {
    try {
      const computed = computePackageDigest({ manifest, files: manifest.files });
      if (computed !== packageId) errors.push(issue('PACKAGE_DIGEST_MISMATCH'));
    } catch { errors.push(issue('PACKAGE_DIGEST_INVALID')); }
  }
  return {
    ok: errors.length === 0,
    packageId,
    captainId,
    baseCommit: manifest.baseCommit,
    updates: errors.length === 0 ? updates : [],
    totalBytes: fileRows.reduce((sum, row) => sum + row.size, 0),
    errors: sortIssues(errors),
    warnings: sortIssues(warnings),
  };
}
