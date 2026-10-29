import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalJson } from '../tools/captain-studio/canonical-json.mjs';
import { computeArtworkDigest, computeTrackDigest, computePackageDigest } from '../tools/captain-studio/package-hash.mjs';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { issueReviewRequest, reviewRequestHash } from '../tools/captain-studio/review-requests.mjs';
import { validatePackage } from '../tools/captain-studio/validate-package.mjs';
import { deflateSync } from 'node:zlib';

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const commit = 'a'.repeat(40);
const baseCommit = commit;
const captainId = 'reef-captain';
const assignment = { clip: 'alley-oop-power', direction: 'right' };

const crcTable = Array.from({ length: 256 }, (_, value) => {
  let c = value;
  for (let bit = 0; bit < 8; bit++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function pngChunk(type, data) {
  const name = Buffer.from(type), payload = Buffer.concat([name, data]);
  let crc = 0xffffffff;
  for (const byte of payload) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  const output = Buffer.alloc(12 + data.length);
  output.writeUInt32BE(data.length, 0); name.copy(output, 4); data.copy(output, 8); output.writeUInt32BE((crc ^ 0xffffffff) >>> 0, 8 + data.length);
  return output;
}
function makePng(width, height, color) {
  const header = Buffer.alloc(13); header.writeUInt32BE(width, 0); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6;
  const rows = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const offset = y * (1 + width * 4) + 1 + x * 4;
    rows[offset] = color; rows[offset + 1] = 80; rows[offset + 2] = 100; rows[offset + 3] = 255;
  }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), pngChunk('IHDR', header), pngChunk('IDAT', deflateSync(rows)), pngChunk('IEND', Buffer.alloc(0))]);
}

async function validPackage(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'captain-package-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const packageRoot = path.join(root, 'worker');
  const baseRoot = path.join(root, 'base');
  await mkdir(packageRoot, { recursive: true });
  await mkdir(baseRoot, { recursive: true });
  const contents = new Map();
  const put = async (file, value) => {
    const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value);
    const target = path.join(packageRoot, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, bytes);
    contents.set(file, bytes);
    return { path: file, sha256: sha(bytes) };
  };
  const prefix = `tools/generate-art/studio/${captainId}`;
  const runtime = `public/assets/animation/${captainId}-${assignment.clip}-${assignment.direction}.webp`;
  const raw = await put(`${prefix}/sources/attempt-01.png`, makePng(32, 32, 110));
  const prompt = await put(`${prefix}/prompts/${assignment.clip}.md`, 'exact prompt');
  const layout = await put(`${prefix}/layouts/${assignment.clip}.json`, '{"width":32,"height":32}');
  const trackValue = { height: [1.2, 1.7, 1.4], forward: [2, 4, 3], anchors: { grab: 1 } };
  const track = await put(`${prefix}/tracks/${assignment.clip}.json`, JSON.stringify(trackValue));
  const atlas = await put(runtime, makePng(32, 32, 120));
  const evidence = [];
  for (const type of ['source-art', 'anatomy-identity', 'layout-transparency', 'timing-anchors', 'ball-track', 'normal-loader', 'full-set']) {
    evidence.push({ type, ...(await put(`${prefix}/reviews/${type}.md`, `${type} accepted`)) });
  }
  const files = [...contents.keys()].sort().map(file => ({ path: file, sha256: sha(contents.get(file)) }));
  const artworkInventory = {
    assignments: [assignment],
    files: [raw, layout, atlas],
    lineage: [{ sourcePath: raw.path, packedPath: atlas.path }],
    geometry: [{ layoutPath: layout.path, width: 32, height: 32, cells: [{ x: 0, y: 0, w: 32, h: 32 }] }],
  };
  const trackInventory = { assignments: [{ ...assignment, track: trackValue, anchors: trackValue.anchors }] };
  const artworkDigest = computeArtworkDigest({ artworkInventory });
  const trackDigest = computeTrackDigest({ trackInventory });
  const request = scope => issueReviewRequest({
    captainId, artworkDigest, trackDigest, scope,
    workerSessionId: 'worker-session-1', reviewerSessionId: `${scope}-review-session`,
    dispatchId: `${scope}-dispatch`,
  });
  const artRequest = request('artwork');
  const trackRequest = request('track-gameplay');
  const issuedRequests = [artRequest, trackRequest];
  const dispatchRecords = issuedRequests.map(row => ({
    id: row.dispatchId, requestHash: reviewRequestHash(row), captainId,
    workerSessionId: row.workerSessionId, reviewerSessionId: row.reviewerSessionId,
  }));
  const reviewEvidence = row => [{ path: `${prefix}/reviews/${row.scope === 'artwork' ? 'source-art' : 'ball-track'}.md`, sha256: files.find(item => item.path.endsWith(`${row.scope === 'artwork' ? 'source-art' : 'ball-track'}.md`)).sha256 }];
  const approval = row => ({
    nonce: row.nonce, captainId, artworkDigest, trackDigest, scope: row.scope,
    reviewerSessionId: row.reviewerSessionId, result: 'accepted', evidence: reviewEvidence(row),
  });
  const manifest = {
    schemaVersion: 1, packageId: '', captainId, baseCommit: commit,
    createdAt: '2026-10-29T00:00:00.000Z', producer: { tool: 'ImageGen', version: 'verified' },
    expectedCaptainStateSha256: 'b'.repeat(64), mirrorPolicyHash: 'c'.repeat(64),
    updates: [{
      ...assignment, assetPath: atlas.path, assetSha256: atlas.sha256,
      sourcePath: raw.path, sourceSha256: raw.sha256, promptPath: prompt.path, promptSha256: prompt.sha256, layoutPath: layout.path, layoutSha256: layout.sha256,
      trackPath: track.path, trackSha256: track.sha256,
      atlasGeometry: { width: 32, height: 32 }, cells: [{ x: 0, y: 0, w: 32, h: 32 }],
      baselineY: 30, minimumUniqueFrames: 1, frameAnchors: { grab: 1 },
      timing: { durationTicks: 3, frameDurations: [1, 1, 1], loop: false, anchors: { grab: 1 } },
    }],
    trials: [{
      ...assignment, promptPath: prompt.path, promptSha256: prompt.sha256,
      generationId: 'gen-123', generatedAt: '2026-10-28T23:00:00.000Z',
      rawSourcePath: raw.path, rawSourceSha256: raw.sha256,
      reviewer: 'reviewer-user',
      cleanupLineage: [{ sourcePath: raw.path, sourceSha256: raw.sha256, packedPath: atlas.path, packedSha256: atlas.sha256 }],
      disposition: 'accepted',
    }],
    acceptance: { state: 'accepted', evidence },
    dependencies: [], artworkInventory, trackInventory,
    artworkDigest, trackDigest,
    reviewRecord: {
      workerSessionId: artRequest.workerSessionId, author: 'worker', owner: 'captain-owner', reviewerIdentity: 'reviewer-user',
      artworkApproval: approval(artRequest), trackApproval: approval(trackRequest),
    },
    files,
  };
  manifest.packageId = computePackageDigest({ manifest, files });
  const manifestPath = `${prefix}/package.json`;
  await put(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  const baseline = {
    baseCommit,
    mirrorPolicyHash: 'c'.repeat(64),
    captains: { [captainId]: { stateSha256: 'b'.repeat(64), missing: [assignment], accepted: [] } },
    dependencies: [], issuedRequests, dispatchRecords, usedNonces: [],
  };
  return { root, packageRoot, baseRoot, baseline, manifestPath, manifest, files, contents, put };
}

test('validator accepts one complete captain package after frozen artwork/track reviews', async t => {
  const fixture = await validPackage(t);
  const before = await readTree(fixture.baseRoot);
  const result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.captainId, captainId);
  assert.equal(result.packageId, fixture.manifest.packageId);
  assert.deepEqual(result.updates.map(({ clip, direction }) => ({ clip, direction })), [assignment]);
  assert.deepEqual(await readTree(fixture.baseRoot), before);
});

test('validator accepts a rejected-only trial with an unavailable exact prompt and explicit summary', async t => {
  const fixture = await validPackage(t);
  const prefix = `tools/generate-art/studio/${captainId}`;
  const rawSource = `${prefix}/sources/rejected-edit-output.png`;
  const rejectionEvidence = `${prefix}/rejected/rejected-edit-output.md`;
  const raw = await fixture.put(rawSource, makePng(32, 32, 99));
  const rejection = await fixture.put(rejectionEvidence, 'Exact prompt unavailable. Non-verbatim summary: asked to remove the ball.');
  fixture.manifest.files.push(raw, rejection);
  fixture.manifest.trials.push({
    ...assignment,
    promptAvailability: 'unavailable',
    promptSummary: 'Asked to remove the ball.',
    promptSummaryVerbatim: false,
    generationId: 'exec-rejected-without-prompt',
    generatedAt: '2026-10-29T21:37:46.915Z',
    rawSourcePath: rawSource,
    rawSourceSha256: raw.sha256,
    reviewer: 'producer-record',
    cleanupLineage: [],
    disposition: 'rejected',
    rejectionReason: 'The edit output retained the unwanted ball.',
    rejectionEvidencePath: rejectionEvidence,
    rejectionEvidenceSha256: rejection.sha256,
  });
  fixture.manifest.packageId = computePackageDigest({ manifest: fixture.manifest, files: fixture.manifest.files });
  await writeFile(path.join(fixture.packageRoot, fixture.manifestPath), JSON.stringify(fixture.manifest));
  const result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
});

test('validator rejects an unavailable-prompt summary without an explicit non-verbatim marker', async t => {
  const fixture = await validPackage(t);
  const prefix = `tools/generate-art/studio/${captainId}`;
  const rawSource = `${prefix}/sources/rejected-edit-output.png`;
  const rejectionEvidence = `${prefix}/rejected/rejected-edit-output.md`;
  const raw = await fixture.put(rawSource, makePng(32, 32, 99));
  const rejection = await fixture.put(rejectionEvidence, 'Exact prompt unavailable; summary is not verbatim.');
  fixture.manifest.files.push(raw, rejection);
  fixture.manifest.trials.push({
    ...assignment,
    promptAvailability: 'unavailable',
    promptSummary: 'Asked to remove the ball.',
    generationId: 'exec-rejected-without-prompt',
    generatedAt: '2026-10-29T21:37:46.915Z',
    rawSourcePath: rawSource,
    rawSourceSha256: raw.sha256,
    reviewer: 'producer-record',
    cleanupLineage: [],
    disposition: 'rejected',
    rejectionReason: 'The edit output retained the unwanted ball.',
    rejectionEvidencePath: rejectionEvidence,
    rejectionEvidenceSha256: rejection.sha256,
  });
  fixture.manifest.packageId = computePackageDigest({ manifest: fixture.manifest, files: fixture.manifest.files });
  await writeFile(path.join(fixture.packageRoot, fixture.manifestPath), JSON.stringify(fixture.manifest));
  const result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.ok(result.errors.some(issue => issue.code === 'PROMPT_METADATA_INVALID'));
});

test('validator limits unavailable-prompt exception to rejected output with no cleanup lineage', async t => {
  const fixture = await validPackage(t);
  const accepted = fixture.manifest.trials[0];
  fixture.manifest.trials.push({
    ...assignment,
    promptAvailability: 'unavailable',
    promptSummary: 'Asked to remove the ball.',
    promptSummaryVerbatim: false,
    generationId: 'exec-rejected-without-prompt',
    generatedAt: '2026-10-29T21:37:46.915Z',
    rawSourcePath: accepted.rawSourcePath,
    rawSourceSha256: accepted.rawSourceSha256,
    reviewer: 'producer-record',
    cleanupLineage: [{
      sourcePath: accepted.rawSourcePath,
      sourceSha256: accepted.rawSourceSha256,
      packedPath: fixture.manifest.updates[0].assetPath,
      packedSha256: fixture.manifest.updates[0].assetSha256,
    }],
    disposition: 'rejected',
    rejectionReason: 'Rejected candidate must not become accepted artwork.',
    rejectionEvidencePath: accepted.promptPath,
    rejectionEvidenceSha256: accepted.promptSha256,
  });
  fixture.manifest.packageId = computePackageDigest({ manifest: fixture.manifest, files: fixture.manifest.files });
  await writeFile(path.join(fixture.packageRoot, fixture.manifestPath), JSON.stringify(fixture.manifest));
  const result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.ok(result.errors.some(issue => issue.code === 'PROMPT_METADATA_INVALID'));
});

test('validator never permits unavailable prompt metadata on accepted artwork', async t => {
  const fixture = await validPackage(t);
  const accepted = fixture.manifest.trials[0];
  delete accepted.promptPath;
  delete accepted.promptSha256;
  accepted.promptAvailability = 'unavailable';
  accepted.promptSummary = 'Asked to remove the ball.';
  fixture.manifest.packageId = computePackageDigest({ manifest: fixture.manifest, files: fixture.manifest.files });
  await writeFile(path.join(fixture.packageRoot, fixture.manifestPath), JSON.stringify(fixture.manifest));
  const result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.ok(result.errors.some(issue => issue.code === 'PROMPT_METADATA_INVALID'));
  assert.ok(result.errors.some(issue => issue.code === 'ACCEPTED_TRIAL_INCOMPLETE'));
});

test('package schema limits empty cleanup lineage to rejected trials with unavailable prompts', async () => {
  const schema = JSON.parse(await readFile(new URL('../tools/captain-studio/package-schema.json', import.meta.url), 'utf8'));
  const trial = schema.properties.trials.items;
  const unavailable = trial.allOf.find(branch => branch.if?.properties?.promptAvailability?.const === 'unavailable');
  assert.ok(unavailable);
  assert.equal(unavailable.then.properties.disposition.const, 'rejected');
  assert.equal(unavailable.then.properties.cleanupLineage.maxItems, 0);
  assert.ok(unavailable.then.required.includes('promptSummaryVerbatim'));
  assert.equal(unavailable.then.properties.promptSummaryVerbatim.const, false);
  assert.equal(unavailable.else.properties.cleanupLineage.minItems, 1);
});

test('validator accepts an exported manifest separated from its immutable worker content root', async t => {
  const fixture = await validPackage(t);
  const manifestRoot = path.join(fixture.root, 'exported-package');
  await mkdir(manifestRoot, { recursive: true });
  await writeFile(path.join(manifestRoot, 'package.json'), JSON.stringify(fixture.manifest));
  const result = await validatePackage({
    packageRoot: fixture.packageRoot, manifestRoot, manifestRelativePath: 'package.json',
    baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline,
  });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.packageId, fixture.manifest.packageId);
});

test('validator rejects stale bases and duplicate clip assignments', async t => {
  const fixture = await validPackage(t);
  const stale = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit: 'd'.repeat(40), baseline: fixture.baseline });
  assert.ok(stale.errors.some(issue => issue.code === 'STALE_BASE'));

  fixture.manifest.updates.push({ ...fixture.manifest.updates[0] });
  await writeFile(path.join(fixture.packageRoot, fixture.manifestPath), JSON.stringify(fixture.manifest));
  const duplicate = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.ok(duplicate.errors.some(issue => issue.code === 'DUPLICATE_ASSIGNMENT'));
});

test('validator binds each update prompt to its accepted trial prompt', async t => {
  const fixture = await validPackage(t);
  fixture.manifest.updates[0].promptSha256 = 'd'.repeat(64);
  fixture.manifest.packageId = computePackageDigest({ manifest: fixture.manifest, files: fixture.files });
  await writeFile(path.join(fixture.packageRoot, fixture.manifestPath), JSON.stringify(fixture.manifest));
  const result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.ok(result.errors.some(issue => issue.code === 'PROMPT_LINEAGE_MISMATCH'));
});

test('validator rejects a package folder with multiple captain manifests and missing full-set review', async t => {
  const fixture = await validPackage(t);
  const other = `tools/generate-art/studio/another-captain/package.json`;
  await fixture.put(other, '{}');
  let result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.ok(result.errors.some(issue => issue.code === 'MULTIPLE_CAPTAINS'));

  await rm(path.join(fixture.packageRoot, other));
  fixture.manifest.acceptance.evidence = fixture.manifest.acceptance.evidence.filter(item => item.type !== 'full-set');
  fixture.manifest.packageId = computePackageDigest({ manifest: fixture.manifest, files: fixture.files });
  await writeFile(path.join(fixture.packageRoot, fixture.manifestPath), JSON.stringify(fixture.manifest));
  result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.ok(result.errors.some(issue => issue.code === 'FULL_SET_REVIEW_MISSING'));
});

test('validator quarantines new artwork without a generation ID and rejects changed file bytes', async t => {
  const fixture = await validPackage(t);
  fixture.manifest.trials[0].generationId = '';
  fixture.manifest.packageId = computePackageDigest({ manifest: fixture.manifest, files: fixture.files });
  await writeFile(path.join(fixture.packageRoot, fixture.manifestPath), JSON.stringify(fixture.manifest));
  let result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.ok(result.errors.some(issue => issue.code === 'GENERATION_ID_MISSING'));
  await fixture.put(fixture.manifest.updates[0].assetPath, 'tampered packed atlas');
  result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.ok(result.errors.some(issue => issue.code === 'FILE_HASH_MISMATCH'));
});

test('validator permits the same login with distinct dispatch evidence but rejects a shared session', async t => {
  const fixture = await validPackage(t);
  fixture.manifest.reviewRecord.reviewerIdentity = fixture.manifest.reviewRecord.owner;
  fixture.manifest.packageId = computePackageDigest({ manifest: fixture.manifest, files: fixture.files });
  await writeFile(path.join(fixture.packageRoot, fixture.manifestPath), JSON.stringify(fixture.manifest));
  let result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.equal(result.ok, true, JSON.stringify(result.errors));

  fixture.manifest.reviewRecord.workerSessionId = fixture.manifest.reviewRecord.artworkApproval.reviewerSessionId;
  fixture.manifest.packageId = computePackageDigest({ manifest: fixture.manifest, files: fixture.files });
  await writeFile(path.join(fixture.packageRoot, fixture.manifestPath), JSON.stringify(fixture.manifest));
  result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.ok(result.errors.some(issue => issue.code === 'REVIEW_DIGEST_OR_SESSION_MISMATCH'));
});

test('validator rejects missing dependencies and tampered final package hashes', async t => {
  const fixture = await validPackage(t);
  let result;

  fixture.manifest.dependencies = [{ id: 'unavailable-engine', sha256: 'd'.repeat(64) }];
  fixture.manifest.packageId = computePackageDigest({ manifest: fixture.manifest, files: fixture.files });
  await writeFile(path.join(fixture.packageRoot, fixture.manifestPath), JSON.stringify(fixture.manifest));
  result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.ok(result.errors.some(issue => issue.code === 'DEPENDENCY_MISSING'));

  fixture.manifest.dependencies = [];
  fixture.manifest.producer.version = 'tampered';
  await writeFile(path.join(fixture.packageRoot, fixture.manifestPath), JSON.stringify(fixture.manifest));
  result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.ok(result.errors.some(issue => issue.code === 'PACKAGE_DIGEST_MISMATCH'));
});

test('validator rejects artwork changes after digest-bound approval and occupied baseline atlas paths', async t => {
  const fixture = await validPackage(t);
  fixture.manifest.artworkInventory.files[0].sha256 = 'f'.repeat(64);
  fixture.manifest.artworkDigest = computeArtworkDigest({ artworkInventory: fixture.manifest.artworkInventory });
  fixture.manifest.packageId = computePackageDigest({ manifest: fixture.manifest, files: fixture.files });
  await writeFile(path.join(fixture.packageRoot, fixture.manifestPath), JSON.stringify(fixture.manifest));
  let result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.ok(result.errors.some(issue => issue.code === 'ARTWORK_FILE_INVENTORY_MISMATCH'));
  assert.ok(result.errors.some(issue => issue.code === 'REVIEW_DIGEST_OR_SESSION_MISMATCH'));

  const occupiedPath = path.join(fixture.baseRoot, fixture.manifest.updates[0].assetPath);
  await mkdir(path.dirname(occupiedPath), { recursive: true });
  await writeFile(occupiedPath, 'already accepted');
  result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.ok(result.errors.some(issue => issue.code === 'BASE_ASSET_EXISTS'));
});

test('validator rejects unsafe, symlinked, or undeclared package paths', async t => {
  const fixture = await validPackage(t);
  const target = `${path.dirname(fixture.manifestPath)}/sources/link.png`;
  await mkdir(path.dirname(path.join(fixture.packageRoot, target)), { recursive: true });
  await symlink('attempt-01.png', path.join(fixture.packageRoot, target));
  fixture.manifest.files.push({ path: target, sha256: 'e'.repeat(64) });
  fixture.manifest.packageId = computePackageDigest({ manifest: fixture.manifest, files: fixture.manifest.files });
  await writeFile(path.join(fixture.packageRoot, fixture.manifestPath), JSON.stringify(fixture.manifest));
  const result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.ok(result.errors.some(issue => issue.code === 'SYMLINK_REJECTED'));
});

test('validator rejects captain-package files outside the collector allowlist', async t => {
  const fixture = await validPackage(t);
  fixture.manifest.files.push({ path: `tools/generate-art/studio/${captainId}/misc/hidden.bin`, sha256: 'e'.repeat(64) });
  await writeFile(path.join(fixture.packageRoot, fixture.manifestPath), JSON.stringify(fixture.manifest));
  const result = await validatePackage({ packageRoot: fixture.packageRoot, baseRoot: fixture.baseRoot, baseCommit, baseline: fixture.baseline });
  assert.ok(result.errors.some(issue => issue.code === 'PACKAGE_PATH_SCOPE_INVALID'));
});

async function readTree(root) {
  const result = {};
  async function visit(directory, relative = '') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isDirectory()) await visit(path.join(directory, entry.name), name);
      else result[name] = sha(await readFile(path.join(directory, entry.name)));
    }
  }
  await visit(root);
  return result;
}
test('canonical serialization orders keys, preserves arrays and rejects non JSON inputs', () => {
  assert.equal(canonicalJson({z:[2,1],a:{y:2,x:1}}),'{"a":{"x":1,"y":2},"z":[2,1]}');
  for(const value of [undefined,NaN,Infinity,()=>{},new Date(),{a:undefined}]) assert.throws(()=>canonicalJson(value));
  const cycle={};cycle.self=cycle;assert.throws(()=>canonicalJson(cycle));
  assert.throws(()=>canonicalJson({a:1n}));
});
test('approval is downstream of fixed artwork and track digests', () => {
  const artworkInventory={assignments:[{clip:'idle',direction:'right'}],files:[{path:'a.png',sha256:'a'.repeat(64)}]};
  const artworkDigest=computeArtworkDigest({artworkInventory});
  const trackDigest=computeTrackDigest({trackInventory:{idle:{height:[1,2]}}});
  const manifest={artworkDigest,trackDigest,reviewRecord:{artworkDigest,approval:'accepted'}};
  const files=[{path:'review.json',sha256:'b'.repeat(64)}];
  const initial=computePackageDigest({manifest,files});
  assert.equal(computePackageDigest({manifest:{...manifest,packageId:initial},files}),initial);
  assert.notEqual(computePackageDigest({manifest,files:[{...files[0],sha256:'c'.repeat(64)}]}),initial);
  assert.equal(computeArtworkDigest({artworkInventory}),artworkDigest);
  assert.notEqual(computeArtworkDigest({artworkInventory:{...artworkInventory,files:[{path:'a.png',sha256:'d'.repeat(64)}]}}),artworkDigest);
});
test('package hashing is path ordered and rejects aliases and malformed file inventories', () => {
 const manifest={artworkDigest:'a'.repeat(64)};
 const files=[{path:'z.png',sha256:'b'.repeat(64)},{path:'a.png',sha256:'c'.repeat(64)}];
 assert.equal(computePackageDigest({manifest,files}),computePackageDigest({manifest,files:[...files].reverse()}));
 for(const path of ['../a','/a','a/../b','a\\b','a//b']) assert.throws(()=>computePackageDigest({manifest,files:[{path,sha256:'a'.repeat(64)}]}));
 assert.throws(()=>computePackageDigest({manifest,files:[files[0],files[0]]}));
 assert.throws(()=>computePackageDigest({manifest,files:[{path:'A.png',sha256:'a'.repeat(64)},{path:'a.png',sha256:'b'.repeat(64)}]}));
});
test('canonical JSON rejects accessor array entries before evaluating them',()=>{
 const values=[];let invoked=0;Object.defineProperty(values,'0',{enumerable:true,get(){invoked++;return invoked;}});values.length=1;
 assert.throws(()=>canonicalJson(values));assert.equal(invoked,0);
});
test('artwork digest sorts file and assignment sets and rejects collisions',()=>{
 const artworkInventory={files:[{path:'z.png',sha256:'a'.repeat(64)},{path:'a.png',sha256:'b'.repeat(64)}],assignments:[{clip:'run',direction:'right'},{clip:'idle',direction:'left'}]};
 assert.equal(computeArtworkDigest({artworkInventory}),computeArtworkDigest({artworkInventory:{files:[...artworkInventory.files].reverse(),assignments:[...artworkInventory.assignments].reverse()}}));
 assert.throws(()=>computeArtworkDigest({artworkInventory:{...artworkInventory,files:[artworkInventory.files[0],artworkInventory.files[0]]}}));
});
test('track digests sort clip and facing records independent of caller enumeration', () => {
  const trackInventory = { assignments: [
    { clip: 'pass-overhead', direction: 'right', track: { height: [1, 2] }, anchors: { release: 1 } },
    { clip: 'alley-oop-power', direction: 'left', track: { height: [3, 4] }, anchors: { grab: 0 } },
  ] };
  assert.equal(
    computeTrackDigest({ trackInventory }),
    computeTrackDigest({ trackInventory: { assignments: [...trackInventory.assignments].reverse() } }),
  );
  assert.throws(() => computeTrackDigest({ trackInventory: { assignments: [trackInventory.assignments[0], trackInventory.assignments[0]] } }));
});
