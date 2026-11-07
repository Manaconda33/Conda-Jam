import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile, readdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { exportCaptainPackage } from '../tools/captain-studio/export-package.mjs';
import { computeArtworkDigest, computeTrackDigest } from '../tools/captain-studio/package-hash.mjs';
import { issueReviewRequest, reviewRequestHash } from '../tools/captain-studio/review-requests.mjs';
import { validatePackage } from '../tools/captain-studio/validate-package.mjs';
import { integrateCaptainBatch } from '../tools/captain-studio/integrate-batch.mjs';
import { deflateSync } from 'node:zlib';
import { exportCaptainPackage as cliExportCaptainPackage } from '../tools/export-captain-package.mjs';

const sha = value => createHash('sha256').update(value).digest('hex');
const crcTable = Array.from({length:256},(_,value)=>{let c=value;for(let bit=0;bit<8;bit++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
function pngChunk(type,data){const name=Buffer.from(type),payload=Buffer.concat([name,data]);let crc=0xffffffff;for(const byte of payload)crc=crcTable[(crc^byte)&255]^(crc>>>8);const out=Buffer.alloc(12+data.length);out.writeUInt32BE(data.length,0);name.copy(out,4);data.copy(out,8);out.writeUInt32BE((crc^0xffffffff)>>>0,8+data.length);return out;}
function tinyPng(color){const width=32,height=48,header=Buffer.alloc(13);header.writeUInt32BE(width,0);header.writeUInt32BE(height,4);header[8]=8;header[9]=6;const rows=Buffer.alloc(height*(1+width*4));for(let y=0;y<height;y++)for(let x=0;x<width;x++){const offset=y*(1+width*4)+1+x*4;rows[offset]=color;rows[offset+1]=80;rows[offset+2]=100;rows[offset+3]=255;}return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),pngChunk('IHDR',header),pngChunk('IDAT',deflateSync(rows)),pngChunk('IEND',Buffer.alloc(0))]);}

async function fixture(t, { generationId = 'imggen-reef-001', includeUndeclared = false, manifestCaptainId = 'reef-captain', badToolResponseHash = false, missingRejectedPrompt = false, discardRejectedArtifacts = false } = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'captain-export-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  git('init', '-q');
  git('config', 'user.name', 'Exporter Fixture');
  git('config', 'user.email', 'exporter@example.invalid');
  const put = async (file, text) => {
    const target = path.join(root, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, text);
  };
  const commit = message => {
    git('add', '-A');
    git('commit', '-qm', message);
    return git('rev-parse', 'HEAD');
  };
  await put('README.md', 'pinned baseline');
  // A minimal but real tracked runtime base makes it possible to exercise the
  // complete integration path, rather than replacing package validation with a stub.
  const baseManifest = { version: 1, characters: { 'reef-captain': { directions: { right: {} } } } };
  await put('package.json', JSON.stringify({ type: 'module' }) + '\n');
  await put('public/assets/animation/manifest.json', JSON.stringify(baseManifest) + '\n');
  await put('src/content/animation-assets.js', `export const animationAssetManifest = ${JSON.stringify(baseManifest)};\n`);
  await put('src/content/animation-ball-tracks.js', 'export const athleteBallTracks = {};\nexport const athleteBallTrackProvenance = {};\n');
  const baseCommit = commit('baseline');

  const prefix = 'tools/generate-art/studio/reef-captain';
  const assigned = [
    `${prefix}/prompts/pass.md`, `${prefix}/sources/pass-raw.png`,
    `${prefix}/sources/pass-attempt-01-raw.png`, `${prefix}/rejected/pass-attempt-01.md`, `${prefix}/layouts/pass-layout.json`,
    `${prefix}/tracks/pass.json`,
    ...['source-art', 'anatomy-identity', 'layout-transparency', 'timing-anchors', 'ball-track', 'normal-loader', 'full-set']
      .map(type => `${prefix}/reviews/${type}.md`),
    'public/assets/animation/reef-captain-pass-right.png',
  ];
  const trackData = { height: [1.2], forward: [2], anchors: { release: 0 } };
  const trackText = JSON.stringify(trackData);
  const layoutText = JSON.stringify({ width: 32, height: 48, frames: [{ x: 0, y: 0, w: 32, h: 48 }] });
  const contents = new Map(assigned.map(file => [file, `fixture:${file}`]));
  contents.set(`${prefix}/sources/pass-raw.png`, tinyPng(110));
  contents.set('public/assets/animation/reef-captain-pass-right.png', tinyPng(120));
  contents.set(`${prefix}/tracks/pass.json`, trackText);
  contents.set(`${prefix}/layouts/pass-layout.json`, layoutText);
  if (discardRejectedArtifacts) {
    contents.delete(`${prefix}/sources/pass-attempt-01-raw.png`);
    contents.delete(`${prefix}/rejected/pass-attempt-01.md`);
  }
  const files = assigned.filter(file => contents.has(file)).map(file => ({ path: file, sha256: sha(contents.get(file)) }));
  const artworkFiles = [
    { path: `${prefix}/sources/pass-raw.png`, sha256: sha(contents.get(`${prefix}/sources/pass-raw.png`)) },
    { path: 'public/assets/animation/reef-captain-pass-right.png', sha256: sha(contents.get('public/assets/animation/reef-captain-pass-right.png')) },
    { path: `${prefix}/layouts/pass-layout.json`, sha256: sha(layoutText) },
  ];
  const update = {
    clip: 'pass', direction: 'right',
    assetPath: 'public/assets/animation/reef-captain-pass-right.png',
    assetSha256: sha(contents.get('public/assets/animation/reef-captain-pass-right.png')),
    sourcePath: `${prefix}/sources/pass-raw.png`,
    sourceSha256: sha(contents.get(`${prefix}/sources/pass-raw.png`)),
    promptPath: `${prefix}/prompts/pass.md`,
    promptSha256: sha(contents.get(`${prefix}/prompts/pass.md`)),
    layoutPath: `${prefix}/layouts/pass-layout.json`,
    layoutSha256: sha(contents.get(`${prefix}/layouts/pass-layout.json`)),
    trackPath: `${prefix}/tracks/pass.json`,
    trackSha256: sha(contents.get(`${prefix}/tracks/pass.json`)),
    reviewPaths: files.filter(file => file.path.includes('/reviews/')).map(file => file.path),
    cells: [{ x: 0, y: 0, w: 32, h: 48 }],
    minimumUniqueFrames: 1,
    atlasGeometry: { width: 32, height: 48 },
    baselineY: 47,
    frameAnchors: { release: 0 },
    timing: { durationTicks: 1, frameDurations: [1], loop: false, anchors: { release: 0 } },
  };
  const trial = {
    clip: 'pass', direction: 'right',
    promptPath: update.promptPath, promptSha256: update.promptSha256,
    generationId, generatedAt: '2026-10-29T10:00:00.000Z',
    rawSourcePath: update.sourcePath, rawSourceSha256: update.sourceSha256,
    reviewer: 'reviewer', disposition: 'accepted', cleanupLineage: [{ sourcePath: update.sourcePath, sourceSha256: update.sourceSha256, packedPath: update.assetPath, packedSha256: update.assetSha256 }],
  };
  const rejectedPath = `${prefix}/sources/pass-attempt-01-raw.png`;
  const rejectedTrial = {
    clip: 'pass', direction: 'right', promptPath: update.promptPath, promptSha256: update.promptSha256,
    generationId: 'imggen-reef-rejected-001', generatedAt: '2026-10-29T09:00:00.000Z',
    rawSourcePath: rejectedPath, rawSourceSha256: sha(`fixture:${rejectedPath}`),
    reviewer: 'reviewer', disposition: 'rejected', rejectionReason: 'duplicate pose', cleanupLineage: [],
    rejectionEvidencePath: `${prefix}/rejected/pass-attempt-01.md`,
    rejectionEvidenceSha256: sha(`fixture:${prefix}/rejected/pass-attempt-01.md`),
  };
  if (discardRejectedArtifacts) {
    delete rejectedTrial.promptPath;
    delete rejectedTrial.promptSha256;
    delete rejectedTrial.rawSourcePath;
    delete rejectedTrial.rejectionEvidencePath;
    delete rejectedTrial.rejectionEvidenceSha256;
    delete rejectedTrial.generationId;
    delete rejectedTrial.generatedAt;
    delete rejectedTrial.reviewer;
    delete rejectedTrial.cleanupLineage;
    rejectedTrial.promptAvailability = 'unavailable';
    rejectedTrial.promptSummary = 'Non-verbatim summary of the rejected attempt.';
  }
  if (missingRejectedPrompt) {
    delete rejectedTrial.promptPath;
    delete rejectedTrial.promptSha256;
    rejectedTrial.promptAvailability = 'unavailable';
    rejectedTrial.promptSummary = 'Non-verbatim summary: the edit requested a visual correction.';
  }
  const artworkInventory = {
    assignments: [{ clip: 'pass', direction: 'right' }], files: artworkFiles,
    lineage: [{ clip: 'pass', direction: 'right', sourcePath: update.sourcePath, sourceSha256: update.sourceSha256, packedPath: update.assetPath, packedSha256: update.assetSha256 }],
    geometry: [{ layoutPath: update.layoutPath, width: update.atlasGeometry.width, height: update.atlasGeometry.height, cells: update.cells }],
  };
  const trackInventory = { assignments: [{ clip: 'pass', direction: 'right', track: trackData, anchors: trackData.anchors }] };
  const artworkDigest = computeArtworkDigest({ artworkInventory });
  const trackDigest = computeTrackDigest({ trackInventory });
  const reviewerRequests = ['artwork', 'track-gameplay'].map(scope => issueReviewRequest({
    captainId: 'reef-captain', artworkDigest, trackDigest, scope,
    workerSessionId: 'worker-session', reviewerSessionId: `${scope}-session`, dispatchId: `${scope}-dispatch`,
  }));
  const dispatchRecords = reviewerRequests.map(row => ({ id: row.dispatchId, requestHash: reviewRequestHash(row), captainId: row.captainId, workerSessionId: row.workerSessionId, reviewerSessionId: row.reviewerSessionId }));
  const approval = request => ({ nonce: request.nonce, captainId: request.captainId, artworkDigest, trackDigest, scope: request.scope, reviewerSessionId: request.reviewerSessionId, result: 'accepted', evidence: [{ path: `${prefix}/reviews/${request.scope === 'artwork' ? 'source-art' : 'ball-track'}.md`, sha256: sha(contents.get(`${prefix}/reviews/${request.scope === 'artwork' ? 'source-art' : 'ball-track'}.md`)) }] });
  const workerManifest = {
    schemaVersion: 1,
    captainId: manifestCaptainId,
    baseCommit,
    createdAt: '2026-10-29T10:10:00.000Z',
    producer: { tool: 'fixture-generator', version: '1' },
    expectedCaptainStateSha256: 'a'.repeat(64), mirrorPolicyHash: 'b'.repeat(64),
    assignments: [{ clip: 'pass', direction: 'right' }],
    files,
    updates: [update],
    trials: [rejectedTrial, trial],
    acceptance: { state: 'accepted', evidence: ['source-art', 'anatomy-identity', 'layout-transparency', 'timing-anchors', 'ball-track', 'normal-loader', 'full-set'].map(type => ({ type, path: `${prefix}/reviews/${type}.md`, sha256: sha(contents.get(`${prefix}/reviews/${type}.md`)) })) },
    dependencies: [],
    artworkInventory, trackInventory, artworkDigest, trackDigest,
    reviewRecord: { workerSessionId: 'worker-session', author: 'worker', owner: 'owner', reviewerIdentity: 'reviewer', artworkApproval: approval(reviewerRequests[0]), trackApproval: approval(reviewerRequests[1]) },
  };
  if (generationId === null) { trial.toolResponsePath = `${prefix}/sources/pass-response.json`; trial.retryHistory = ['first ID-less response retained']; contents.set(trial.toolResponsePath, '{\"error\":\"ID unavailable\"}'); trial.toolResponseSha256 = badToolResponseHash ? '0'.repeat(64) : sha(contents.get(trial.toolResponsePath)); files.push({ path: trial.toolResponsePath, sha256: sha(contents.get(trial.toolResponsePath)) }); }
  if (includeUndeclared) { contents.set(`${prefix}/previews/hidden.png`, 'unlisted'); await put(`${prefix}/previews/hidden.png`, 'unlisted'); }
  for (const [file, text] of contents) await put(file, text);
  await put(`${prefix}/tracks/pass.json`, trackText);
  await put(`${prefix}/layouts/pass-layout.json`, layoutText);
  await put(`${prefix}/package.json`, JSON.stringify(workerManifest));
  const workerCommit = commit('captain contribution');
  const baseRoot = await mkdtemp(path.join(os.tmpdir(), 'captain-export-base-'));
  const outputRoot = await mkdtemp(path.join(os.tmpdir(), 'captain-export-output-'));
  t.after(() => rm(baseRoot, { recursive: true, force: true }));
  t.after(() => rm(outputRoot, { recursive: true, force: true }));
  execFileSync('git', ['worktree', 'add', '--detach', baseRoot, baseCommit], { cwd: root, stdio: 'ignore' });
  const baseline = { baseCommit, mirrorPolicyHash: 'b'.repeat(64), captains: { 'reef-captain': { stateSha256: 'a'.repeat(64), missing: [{ clip: 'pass', direction: 'right' }], acceptedAssetPaths: [] } }, dependencies: [], issuedRequests: reviewerRequests, dispatchRecords, usedNonces: [] };
  return { root, baseRoot, outputRoot, baseCommit, workerCommit, workerManifest, baseline, assignment: { missing: [{ clip: 'pass', direction: 'right' }] } };
}

test('exporter emits a reproducible one-captain package that references rather than copies runtime atlases', async t => {
  assert.equal(cliExportCaptainPackage, exportCaptainPackage);
  const f = await fixture(t), outputRoot = f.outputRoot;
  const result = await exportCaptainPackage({
    baseRoot: f.baseRoot, contributionRoot: f.root, captainId: 'reef-captain',
    baseCommit: f.baseCommit, workerCommit: f.workerCommit, assignment: f.assignment, outputRoot,
  });
  assert.equal(result.state, 'accepted');
  assert.equal(result.captainId, 'reef-captain');
  assert.equal(result.updates.length, 1);
  assert.equal(result.updates[0].assetPath, 'public/assets/animation/reef-captain-pass-right.png');
  assert.equal(result.trials.length, 2);
  assert.ok(result.trials.some(trial => trial.disposition === 'rejected' && trial.rejectionReason));
  assert.equal(result.packageId.length, 64);
  const manifestPath = path.join(outputRoot, 'reef-captain', 'package.json');
  const exported = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(exported.packageId, result.packageId);
  assert.deepEqual(exported.updates, f.workerManifest.updates);
  assert.equal(exported.workerCommit, undefined);
  assert.equal(exported.state, undefined);
  assert.equal(exported.reasonCodes, undefined);
  assert.equal(exported.reviewRecord.workerCommit, f.workerCommit);
  assert.ok(!(await readdir(path.join(outputRoot, 'reef-captain'))).includes('public'));
  const validation = await validatePackage({ packageRoot: f.root, manifestRoot: path.join(outputRoot, 'reef-captain'), manifestRelativePath: 'package.json', baseRoot: f.baseRoot, baseCommit: f.baseCommit, baseline: f.baseline });
  assert.equal(validation.ok, true, JSON.stringify(validation.errors));
  assert.equal(validation.packageId, result.packageId);
  assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: f.root, encoding: 'utf8' }).trim(), f.workerCommit);
  assert.equal(execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], { cwd: f.root, encoding: 'utf8' }).trim(), '');

  const second = await exportCaptainPackage({
    baseRoot: f.baseRoot, contributionRoot: f.root, captainId: 'reef-captain',
    baseCommit: f.baseCommit, workerCommit: f.workerCommit, assignment: f.assignment,
    outputRoot: path.join(f.outputRoot, 'again'),
  });
  assert.equal(second.packageId, result.packageId);
});

test('exporter preserves rejected-only missing prompt metadata without weakening accepted prompt lineage', async t => {
  const f = await fixture(t, { missingRejectedPrompt: true });
  const result = await exportCaptainPackage({
    baseRoot: f.baseRoot, contributionRoot: f.root, captainId: 'reef-captain',
    baseCommit: f.baseCommit, workerCommit: f.workerCommit, assignment: f.assignment,
    outputRoot: f.outputRoot,
  });
  assert.equal(result.state, 'accepted');
  const rejected = result.trials.find(trial => trial.disposition === 'rejected');
  assert.equal(rejected.promptAvailability, 'unavailable');
  assert.equal(rejected.promptSummary, 'Non-verbatim summary: the edit requested a visual correction.');
  assert.ok(result.warnings.some(warning => warning.code === 'REJECTED_PROMPT_UNAVAILABLE'));
  assert.equal(rejected.promptPath, undefined);
  const accepted = result.trials.find(trial => trial.disposition === 'accepted');
  assert.equal(accepted.promptPath, `${f.workerManifest.updates[0].promptPath}`);
});

test('exporter accepts omitted rejected-only raw, prompt and evidence files with a summary warning', async t => {
  const f = await fixture(t, { discardRejectedArtifacts: true });
  const result = await exportCaptainPackage({
    baseRoot: f.baseRoot, contributionRoot: f.root, captainId: 'reef-captain',
    baseCommit: f.baseCommit, workerCommit: f.workerCommit, assignment: f.assignment,
    outputRoot: f.outputRoot,
  });
  assert.equal(result.state, 'accepted');
  assert.ok(result.warnings.some(warning => warning.code === 'REJECTED_ARTIFACTS_OMITTED'));
  const exported = JSON.parse(await readFile(path.join(f.outputRoot, 'reef-captain', 'package.json'), 'utf8'));
  const rejected = exported.trials.find(trial => trial.disposition === 'rejected');
  assert.equal(rejected.rawSourcePath, undefined);
  assert.equal(rejected.promptPath, undefined);
  assert.equal(rejected.rejectionEvidencePath, undefined);
  const validation = await validatePackage({ packageRoot: f.root, manifestRoot: path.join(f.outputRoot, 'reef-captain'), manifestRelativePath: 'package.json', baseRoot: f.baseRoot, baseCommit: f.baseCommit, baseline: f.baseline });
  assert.equal(validation.ok, true, JSON.stringify(validation.errors));
});

test('exporter quarantines a missing generation ID without inventing one', async t => {
  const f = await fixture(t, { generationId: null });
  const result = await exportCaptainPackage({
    baseRoot: f.baseRoot, contributionRoot: f.root, captainId: 'reef-captain',
    baseCommit: f.baseCommit, workerCommit: f.workerCommit, assignment: f.assignment,
    outputRoot: f.outputRoot,
  });
  assert.equal(result.state, 'quarantined');
  assert.ok(result.reasonCodes.includes('GENERATION_ID_MISSING'));
  assert.equal(result.trials.find(trial => trial.disposition === 'accepted').generationId, null);
});

test('exporter rejects an ID-less trial whose tool response digest is false', async t => {
  const f = await fixture(t, { generationId: null, badToolResponseHash: true });
  await assert.rejects(() => exportCaptainPackage({
    baseRoot: f.baseRoot, contributionRoot: f.root, captainId: 'reef-captain',
    baseCommit: f.baseCommit, workerCommit: f.workerCommit, assignment: f.assignment, outputRoot: f.outputRoot,
  }), error => error.code === 'DECLARED_HASH_MISMATCH');
});

test('exporter rejects undeclared changed files and package namespace mismatches', async t => {
  const f = await fixture(t, { includeUndeclared: true });
  await assert.rejects(() => exportCaptainPackage({
    baseRoot: f.baseRoot, contributionRoot: f.root, captainId: 'reef-captain',
    baseCommit: f.baseCommit, workerCommit: f.workerCommit, assignment: f.assignment,
    outputRoot: f.outputRoot,
  }), error => error.code === 'UNDECLARED_CONTRIBUTION_FILE');

  const mismatched = await fixture(t, { manifestCaptainId: 'other-captain' });
  await assert.rejects(() => exportCaptainPackage({
    baseRoot: mismatched.baseRoot, contributionRoot: mismatched.root, captainId: 'reef-captain',
    baseCommit: mismatched.baseCommit, workerCommit: mismatched.workerCommit, assignment: mismatched.assignment,
    outputRoot: mismatched.outputRoot,
  }), error => error.code === 'PACKAGE_IDENTITY_MISMATCH');
});

const syntheticAuditBefore = {
  generatedAt: '2026-11-07T00:00:00Z',
  missingClipCount: 1,
  errors: [{ code: 'missing-clip', athlete: 'reef-captain', direction: 'right', clip: 'pass', classification: 'original-authored' }],
  targetShortfalls: [],
};
const syntheticAuditAfter = {
  ...syntheticAuditBefore,
  generatedAt: '2026-11-07T01:00:00Z',
  missingClipCount: 0,
  errors: [],
};
const integrationConfig = {
  integratorVersion: '1', schemaVersion: 1, registryGeneratorVersion: '1',
  strictAuditConfig: { mode: 'strict' },
  baselineFindingSetHashes: { audit: 'f'.repeat(64) },
  mirrorPolicyHash: 'b'.repeat(64), resourcePolicyHash: 'c'.repeat(64),
  resourceLimits: {
    maxBatchPackages: 8,
    maxPackageFiles: 64,
    maxDecodedPixelsPerImage: 64_000_000,
    maxInputFileBytes: 64 * 1024 * 1024,
    maxPackageBytes: 2 * 1024 * 1024,
    maxBatchBytes: 8 * 1024 * 1024,
  },
};
async function exportedIntegrationFixture(t) {
  const f = await fixture(t);
  const exported = await exportCaptainPackage({
    baseRoot: f.baseRoot, contributionRoot: f.root, captainId: 'reef-captain',
    baseCommit: f.baseCommit, workerCommit: f.workerCommit,
    assignment: f.assignment, outputRoot: f.outputRoot,
  });
  assert.equal(exported.state, 'accepted');
  const manifestRoot = path.join(f.outputRoot, 'reef-captain');
  const manifestPath = path.join(manifestRoot, 'package.json');
  const outputRoot = await mkdtemp(path.join(os.tmpdir(), 'captain-real-e2e-integration-'));
  t.after(() => rm(outputRoot, { recursive: true, force: true }));
  const baseline = { ...f.baseline, audit: syntheticAuditBefore };
  const packageRoots = [{ packageRoot: f.root, manifestRoot, manifestRelativePath: 'package.json' }];
  const options = { baseRoot: f.baseRoot, baseCommit: f.baseCommit, packageRoots, outputRoot, baseline, ...integrationConfig };
  return { ...f, exported, manifestRoot, manifestPath, integrationOutputRoot: outputRoot, options };
}

test('real exporter, collector, default validator and integrator yield identical staged trees without ref promotion', async t => {
  const f = await exportedIntegrationFixture(t);
  const baseManifestFile = path.join(f.baseRoot, 'public/assets/animation/manifest.json');
  const baseManifestBefore = await readFile(baseManifestFile);
  const baseHead = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: f.baseRoot, encoding: 'utf8' }).trim();
  const run = async timestamp => integrateCaptainBatch({
    ...f.options,
    auditRunner: async ({ root, acceptedPackages }) => {
      assert.deepEqual(acceptedPackages.map(row => row.captainId), ['reef-captain']);
      const staged = JSON.parse(await readFile(path.join(root, 'public/assets/animation/manifest.json'), 'utf8'));
      assert.ok(staged.characters['reef-captain'].directions.right.pass, 'the real integration must register the intended atlas before audit');
      return { ...syntheticAuditAfter, generatedAt: timestamp };
    },
  });
  const first = await run('2026-11-07T01:00:00Z');
  assert.equal(first.ok, true, JSON.stringify(first.errors ?? first.rejectedPackages));
  assert.equal(first.acceptedPackages.length, 1);
  assert.equal(first.acceptedPackages[0].packageId, f.exported.packageId);
  assert.match(first.treeSha, /^[a-f0-9]{40}$/);
  const mergedManifest = JSON.parse(await readFile(path.join(first.stagingRoot, 'public/assets/animation/manifest.json'), 'utf8'));
  const registered = mergedManifest.characters['reef-captain'].directions.right.pass;
  assert.equal(registered.reviewed, true);
  assert.equal(registered.provenance.packageId, f.exported.packageId);
  assert.equal(registered.provenance.generationId, 'imggen-reef-001');
  assert.equal(registered.provenance.prompt, 'fixture:tools/generate-art/studio/reef-captain/prompts/pass.md');
  assert.deepEqual(registered.frames, [{ x: 0, y: 0, w: 32, h: 48 }]);
  const stageTrackFile = await readFile(path.join(first.stagingRoot, 'src/content/animation-ball-tracks.js'), 'utf8');
  assert.match(stageTrackFile, /reef-captain/);
  assert.match(stageTrackFile, /pass/);
  assert.deepEqual(await readFile(baseManifestFile), baseManifestBefore, 'base manifest bytes are immutable');
  assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: f.baseRoot, encoding: 'utf8' }).trim(), baseHead, 'no branch or ref promotion');
  assert.equal(execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], { cwd: f.baseRoot, encoding: 'utf8' }).trim(), '', 'base worktree remains clean');
  const second = await run('2030-01-01T00:00:00Z');
  assert.equal(second.ok, true, JSON.stringify(second.errors ?? second.rejectedPackages));
  assert.equal(second.treeSha, first.treeSha, 'audit clock changes must not change the output Git tree');
  assert.equal(second.reportBytes, first.reportBytes);
});

test('real integration rejects an exported package with a forged worker-as-reviewer approval', async t => {
  const f = await exportedIntegrationFixture(t);
  const manifest = JSON.parse(await readFile(f.manifestPath, 'utf8'));
  manifest.reviewRecord.artworkApproval.reviewerSessionId = manifest.reviewRecord.workerSessionId;
  await writeFile(f.manifestPath, JSON.stringify(manifest) + '\n');
  const result = await integrateCaptainBatch({
    ...f.options,
    auditRunner: async () => { throw Error('A rejected review must not reach the integration audit'); },
  });
  assert.equal(result.ok, false);
  assert.equal(result.treeSha, null);
  assert.equal(result.stagingRoot, null);
  assert.equal(result.acceptedPackages.length, 0);
  assert.ok(result.rejectedPackages.some(row => row.reasonCodes.includes('REVIEW_DIGEST_OR_SESSION_MISMATCH')),
    JSON.stringify(result.rejectedPackages));
});

test('real validated package is held when the new strict audit adds a finding', async t => {
  const f = await exportedIntegrationFixture(t);
  const result = await integrateCaptainBatch({
    ...f.options,
    auditRunner: async () => ({
      ...syntheticAuditAfter,
      errors: [{ code: 'atlas-opacity-regression', athlete: 'reef-captain' }],
    }),
  });
  assert.equal(result.ok, false);
  assert.equal(result.treeSha, null, 'must not emit a promotable tree from a failing audit');
  assert.ok(result.rejectionCodes.includes('NEW_AUDIT_FINDING'), JSON.stringify(result.rejectionCodes));
  assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: f.baseRoot, encoding: 'utf8' }).trim(), f.baseCommit);
});
