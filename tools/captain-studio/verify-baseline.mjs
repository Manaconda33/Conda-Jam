import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { assertBaselineContract } from './baseline-contract.mjs';
import {
  ACCEPTED_SNAPSHOT_MERGE,
  IMMUTABLE_SNAPSHOT_FILES,
  assertCurrentPinnedSource,
  assertPullRequestEvolutionScope,
  assertVersionedSourceEvolution,
  FROZEN_V1_VERIFIER_FILES,
  V2_POLICY_REVIEW_BASE,
} from './source-evolution-contract-v2.mjs';
import {
  FROZEN_V2_VERIFIER_FILES,
  V3_POLICY_REVIEW_BASE,
} from './source-evolution-contract-v3.mjs';
import {
  assertVersionedSourceEvolution as assertV4VersionedSourceEvolution,
  assertPullRequestEvolutionScope as assertV4PullRequestEvolutionScope,
  FROZEN_V3_VERIFIER_FILES,
  V4_POLICY_REVIEW_BASE,
} from './source-evolution-contract-v4.mjs';

const baseline = JSON.parse(readFileSync('docs/animation-production/CAPTAIN_STUDIO_BASELINE.json', 'utf8'));
const signatures = JSON.parse(readFileSync(baseline.strictAudit.expectedFindingSignatures, 'utf8'));
const auditFile = process.argv[2];
if (!auditFile) throw Error('Usage: node tools/captain-studio/verify-baseline.mjs freshly-generated-audit.json');
const audit = JSON.parse(readFileSync(resolve(auditFile), 'utf8'));

const fail = (ok, message) => { if (!ok) throw Error('Captain Studio baseline verification failed: ' + message); };
// The old PR #20 source snapshot remains immutable. Read the exact Git tree
// object at its historical commit, rather than assuming HEAD cannot evolve.
const gitBlob = (rev, path) => {
  const sha = execFileSync('git', ['rev-parse', '--verify', rev + ':' + path], { encoding: 'utf8' }).trim();
  fail(/^[a-f0-9]{40}$/.test(sha), 'Git object missing at ' + rev + ':' + path);
  return sha;
};
assertBaselineContract(baseline);
execFileSync('git', ['merge-base', '--is-ancestor', ACCEPTED_SNAPSHOT_MERGE, 'HEAD']);
for (const path of IMMUTABLE_SNAPSHOT_FILES) {
  fail(gitBlob('HEAD', path) === gitBlob(ACCEPTED_SNAPSHOT_MERGE, path),
    'accepted PR20 historical snapshot mutated: ' + path);
}
// Preserve the accepted PR23 v1 verifier history; the five v2 migration
// paths may change only under their separately constrained bootstrap.
execFileSync('git', ['merge-base', '--is-ancestor', V2_POLICY_REVIEW_BASE, 'HEAD']);
for (const path of FROZEN_V1_VERIFIER_FILES) {
  fail(gitBlob('HEAD', path) === gitBlob(V2_POLICY_REVIEW_BASE, path),
    'accepted v1 verification record mutated: ' + path);
}
// Freeze every v1/v2 verifier artifact not explicitly revised by the v3 bootstrap.
execFileSync('git', ['merge-base', '--is-ancestor', V3_POLICY_REVIEW_BASE, 'HEAD']);
for (const path of FROZEN_V2_VERIFIER_FILES) {
  fail(gitBlob('HEAD', path) === gitBlob(V3_POLICY_REVIEW_BASE, path),
    'accepted v1/v2 verifier evidence mutated: ' + path);
}
// Freeze every v1/v2/v3 verifier artifact not explicitly revised by the v4 bootstrap.
execFileSync('git', ['merge-base', '--is-ancestor', V4_POLICY_REVIEW_BASE, 'HEAD']);
for (const path of FROZEN_V3_VERIFIER_FILES) {
  fail(gitBlob('HEAD', path) === gitBlob(V4_POLICY_REVIEW_BASE, path),
    'accepted v1/v2/v3 verifier evidence mutated: ' + path);
}
// Complete committed diff from original PR20 snapshot, never a partial manifest.
const changedPaths = execFileSync('git', ['diff', '--name-only', '--no-renames', ACCEPTED_SNAPSHOT_MERGE, 'HEAD'], { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean);
const changedBlobIds = Object.fromEntries(changedPaths.map(path => [path, gitBlob('HEAD', path)]));
const evolution = assertV4VersionedSourceEvolution(changedPaths, changedBlobIds);
// On PR runs, enforce the trusted base and full PR diff. The v2 migration
// v3 and v4 bootstraps alone may alter verifier files; later gameplay PRs are path-scoped.
let pullRequestScope = null;
if (process.env.CAPTAIN_STUDIO_PR_BASE) {
  const prBase = process.env.CAPTAIN_STUDIO_PR_BASE;
  fail(/^[a-f0-9]{40}$/.test(prBase), 'invalid trusted pull request base SHA');
  execFileSync('git', ['merge-base', '--is-ancestor', prBase, 'HEAD']);
  const prChanges = execFileSync('git', ['diff', '--name-only', '--no-renames', prBase, 'HEAD'], { encoding: 'utf8' })
    .trim().split('\n').filter(Boolean);
  const prBlobs = Object.fromEntries(prChanges.map(path => [path, gitBlob('HEAD', path)]));
  pullRequestScope = assertV4PullRequestEvolutionScope(prBase, prChanges, prBlobs);
}

fail(baseline.schemaVersion === 1, 'schema version');
fail(baseline.status === 'candidate_requires_fresh_read_only_strict_audit_and_owner_acceptance', 'review status must remain explicit');
fail(baseline.source.ref === 'main', 'source ref');
fail(/^[a-f0-9]{40}$/.test(baseline.source.commit), 'pinned source SHA');
const tree = execFileSync('git', ['rev-parse', baseline.source.commit + '^{tree}'], { encoding: 'utf8' }).trim();
fail(tree === baseline.source.tree, 'pinned main source tree does not match');
execFileSync('git', ['merge-base', '--is-ancestor', baseline.source.commit, 'HEAD']);
for (const [path, expectedSha] of Object.entries(baseline.source.blobIds)) {
  fail(gitBlob(baseline.source.commit, path) === expectedSha,
    'historical source pin drift at ' + path);
  // Only the corrected, byte-pinned PR22 variant may differ from the
  // original pinned source; any additional drift needs a new policy.
  assertCurrentPinnedSource(path, expectedSha, gitBlob('HEAD', path));
}
fail(baseline.strictAudit.referenceReportBlob === baseline.source.blobIds[baseline.strictAudit.referenceReport], 'tracked audit blob pin');
fail(signatures.version === 1 && signatures.signatures.length === 746, 'identity baseline length');
fail(JSON.stringify(signatures.signatureFields) === JSON.stringify(['code', 'athlete', 'direction', 'clip', 'classification']), 'signature schema');
fail(signatures.signatures.length === new Set(signatures.signatures).size, 'duplicate expected signatures');

const expectation = baseline.strictAudit.expectations;
const facts = {
  athletes: audit.athletes,
  actionsPerAthlete: audit.clipDefinitions,
  inspectedClips: audit.inspectedClips,
  originalAuthoredClips: audit.classifications?.['original-authored'],
  derivedPaletteClips: audit.classifications?.['derived-palette'],
  uniqueSourceLibraries: audit.uniqueSourceLibraries,
  uniqueSourceAtlases: audit.uniqueSourceAtlases,
  uniqueSourceDrawings: audit.uniqueSourceDrawings,
  missingClipAssignments: audit.missingClipCount,
  nonVerbatimPrompts: audit.errors?.filter(e => e.code === 'prompt-not-verbatim').length,
  totalFindings: audit.errors?.length,
  targetShortfalls: audit.targetShortfalls?.length,
  strictOk: audit.ok,
};
for (const [name, value] of Object.entries(facts)) fail(expectation[name] === value, 'audit drift ' + name + ': ' + value + ' != ' + expectation[name]);
fail(expectation.captains === 35 && expectation.supportAthletes === 70, 'roster classification contract');
fail(audit.assignmentClassifications?.['original-authored'] === 7 && audit.assignmentClassifications?.['derived-palette'] === 63, 'support source assignments drift');

const makeSignature = finding => signatures.signatureFields.map(key => {
  const part = finding?.[key];
  fail(typeof part === 'string' && part.length > 0 && !part.includes('|'), 'invalid audit finding field ' + key);
  return part;
}).join('|');
const actual = audit.errors.map(makeSignature);
const expected = signatures.signatures;
const actualSet = new Set(actual), expectedSet = new Set(expected);
fail(actualSet.size === 746, 'actual audit duplicate identities');
fail(expected.every(value => actualSet.has(value)), 'expected audit identity disappeared');
fail(actual.every(value => expectedSet.has(value)), 'new unexpected audit identity appeared');
fail(audit.errors.filter(e => e.code === 'missing-clip').length === 706, 'directional gap total');
fail(signatures.expectedCounts['missing-clip'] === 706 && signatures.expectedCounts['prompt-not-verbatim'] === 40, 'reference counts');

const matrix = readFileSync(baseline.gapMatrix.path, 'utf8').trimEnd().split('\n');
fail(matrix.shift() === 'captainId,direction,clip,classification,signature', 'matrix CSV schema');
fail(matrix.length === baseline.gapMatrix.rows && matrix.length === 706, 'matrix row total');
const matrixSet = new Set(), directions = { left: 0, right: 0 }, captains = new Set();
for (const row of matrix) {
  const parts = row.split(',');
  fail(parts.length === 5, 'matrix row fields');
  const [captain, direction, clip, classification, signature] = parts;
  fail(signature === ['missing-clip', captain, direction, clip, classification].join('|'), 'matrix signature structure');
  fail(expectedSet.has(signature) && signature.startsWith('missing-clip|'), 'unrecognized matrix finding');
  fail(!matrixSet.has(signature), 'duplicate matrix row');
  matrixSet.add(signature);
  fail(direction === 'left' || direction === 'right', 'matrix direction');
  directions[direction]++;
  captains.add(captain);
}
const expectedMissing = expected.filter(value => value.startsWith('missing-clip|'));
fail(expectedMissing.every(value => matrixSet.has(value)), 'directional gap omitted');
fail(captains.size === baseline.gapMatrix.incompleteCaptains, 'incomplete captain count');
fail(directions.left === baseline.gapMatrix.directionCounts.left && directions.right === baseline.gapMatrix.directionCounts.right, 'direction counts');
fail(expectedMissing.filter(x => x.split('|')[1] === 'myth').length === baseline.gapMatrix.mythMissing, 'Myth gap count');
fail(expectedMissing.every(x => x.split('|')[1] !== 'kraken'), 'Kraken gap unexpected');

const retirement = baseline.branchRetirement;
fail(retirement.remoteBranchesDeleted === false && retirement.localWorktreeDependenciesVerified === false, 'remote/worktree status misrepresented');
fail(baseline.gates.studioPilotAuthorized === false && baseline.gates.additionalCaptainLanesAuthorized === false, 'pilot not authorized');
fail(baseline.gates.newArtAcceptedByThisSnapshot === false, 'no artwork approval');
fail(baseline.gates.resourceLimitsMeasuredFromAcceptedBundles === false, 'unmeasured resource caps');

console.log(JSON.stringify({
  passed: true,
  exactSourceCommit: baseline.source.commit,
  acceptedSnapshotMerge: ACCEPTED_SNAPSHOT_MERGE,
  sourceEvolutionPolicyVersion: evolution.policyVersion,
  changedPathsSinceSnapshot: evolution.changedPaths,
  explicitlyPinnedNewSourceVariants: evolution.sourceVariants,
  pullRequestScope,
  sourceBlobPins: Object.keys(baseline.source.blobIds).length,
  inspectedClips: audit.inspectedClips,
  exactFindings: actualSet.size,
  missingAssignments: matrixSet.size,
  incompleteCaptains: captains.size,
  directions,
  promptDisclosures: facts.nonVerbatimPrompts,
  strictArtAccepted: audit.ok,
  productionAuthorized: false,
}, null, 2));
