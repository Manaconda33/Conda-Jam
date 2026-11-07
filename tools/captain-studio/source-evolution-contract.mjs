// Captain Studio source-evolution policy v1, proposed November 7, 2026.
// A frozen accepted snapshot is evidence, not an assertion that future HEAD bytes
// must equal its historical code. This policy permits only named, byte-pinned
// changesets. CI passage never substitutes for independent review/owner approval.
export const ACCEPTED_SNAPSHOT_MERGE = '2654be8c094900200dd03910a99552b6cf1c2c07';
export const V1_BOOTSTRAP_REVIEW_BASE = 'd18a65f1eee7f00ee9fa4d5946f3859e9108d5f1';

export const IMMUTABLE_SNAPSHOT_FILES = Object.freeze([
  'docs/animation-production/CAPTAIN_STUDIO_BASELINE.json',
  'docs/animation-production/CAPTAIN_STUDIO_BASELINE_2026-11-06.md',
  'docs/animation-production/CAPTAIN_GAP_MATRIX.csv',
  'tools/captain-studio/baseline-contract.mjs',
  'tests/captain-studio-baseline-contract.test.js'
]);

// These five files describe this v1 verifier migration itself. Their bytes are
// reviewable in its own PR; they are not a blanket runtime/artwork exception.
export const V1_VERIFIER_FILES = Object.freeze([
  '.github/workflows/captain-studio-baseline-verify.yml',
  'docs/animation-production/CAPTAIN_STUDIO_SOURCE_EVOLUTION_V1.md',
  'tools/captain-studio/source-evolution-contract.mjs',
  'tools/captain-studio/verify-baseline.mjs',
  'tests/captain-studio-source-evolution.test.js'
]);

// Exact future/source variants are approved only for the *verification scope*.
// This map does NOT authorize merging PR #22, producing art, or changing refs.
// All entries are Git blob SHA-1, not filesystem content hashes.
export const REVIEWED_SOURCE_VARIANTS_V1 = Object.freeze({
  // Already merged via independently reviewed test-only PR #21.
  'tests/captain-studio-export.test.js': '3d9a9079dc0c17908f7f0f617e4bb285899c47b5',
  // Candidate PR #22: proposed resource guard, not yet merge-approved.
  'tools/captain-studio/integrate-batch.mjs': '87627b0702ce037f8268848003bac20b585a0357',
  'tests/captain-studio-integration.test.js': '6ef46fbbdc2877e8d15f38489d6a6e3cf7555380'
});

const fail = (ok, message) => {
  if (!ok) throw Error('Captain Studio evolution v1 contract failed: ' + message);
};
const sha = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);

/**
 * changedPaths MUST be the complete Git tree diff from accepted PR #20 merge
 * to HEAD, not a subset furnished by the candidate or its package metadata.
 * headBlobIds is independently collected from the actual HEAD Git tree.
 */
export function assertVersionedSourceEvolution(changedPaths, headBlobIds) {
  fail(Array.isArray(changedPaths) && changedPaths.length > 0, 'missing changed-path inventory');
  fail(headBlobIds && typeof headBlobIds === 'object' && !Array.isArray(headBlobIds), 'HEAD Git blob inventory');
  const immutable = new Set(IMMUTABLE_SNAPSHOT_FILES);
  const verifier = new Set(V1_VERIFIER_FILES);
  const recorded = REVIEWED_SOURCE_VARIANTS_V1;
  const seen = new Set();
  for (const path of changedPaths) {
    fail(typeof path === 'string' && path.length > 0 && !path.includes(String.fromCharCode(0)) && !seen.has(path), 'malformed or duplicate change path');
    seen.add(path);
    fail(!immutable.has(path), 'historical snapshot must be immutable: ' + path);
    fail(verifier.has(path) || Object.hasOwn(recorded, path), 'unapproved source-evolution path: ' + path);
    fail(sha(headBlobIds[path]), 'missing or deleted HEAD Git blob: ' + path);
    if (Object.hasOwn(recorded, path)) fail(headBlobIds[path] === recorded[path], 'unreviewed blob variant: ' + path);
  }
  fail(Object.keys(headBlobIds).length === seen.size &&
    Object.keys(headBlobIds).every(path => seen.has(path)), 'HEAD inventory differs from complete Git diff');
  return {policyVersion:1,changedPaths:changedPaths.length,sourceVariants:changedPaths.filter(path=>Object.hasOwn(recorded,path)).length};
}

/** A current source pin may remain original or match one explicitly reviewed v1 variant. */
export function assertCurrentPinnedSource(path, originalGitBlob, headGitBlob) {
  fail(sha(originalGitBlob) && sha(headGitBlob), 'malformed source-pin object ID: ' + path);
  fail(headGitBlob === originalGitBlob ||
    (Object.hasOwn(REVIEWED_SOURCE_VARIANTS_V1, path) &&
      headGitBlob === REVIEWED_SOURCE_VARIANTS_V1[path]),
    'unreviewed current source-pin drift: ' + path);
}

/**
 * PR-level review boundary, independently derived from GitHub's trusted PR base
 * SHA and the full Git tree diff from that base to the candidate merge HEAD.
 * Future PRs cannot silently edit the verifier itself under v1.
 */
export function assertPullRequestEvolutionScope(baseCommit, pullRequestChanges, headBlobIds) {
  fail(sha(baseCommit) && Array.isArray(pullRequestChanges) && pullRequestChanges.length > 0,
    'missing PR base or changed paths');
  fail(headBlobIds && typeof headBlobIds === 'object' && !Array.isArray(headBlobIds),
    'missing PR HEAD blobs');
  const unique = new Set(pullRequestChanges);
  fail(unique.size === pullRequestChanges.length, 'duplicate PR changed paths');
  fail(Object.keys(headBlobIds).length === unique.size &&
    Object.keys(headBlobIds).every(path => unique.has(path)), 'PR blob inventory mismatch');
  const verifier = new Set(V1_VERIFIER_FILES);
  const touchesVerifier = pullRequestChanges.some(path => verifier.has(path));
  if (touchesVerifier) {
    // This explicit bootstrap is a single proposed verifier migration against
    // the previously merged test-only main. A later verifier rewrite needs v2.
    fail(baseCommit === V1_BOOTSTRAP_REVIEW_BASE, 'verifier change requires next version and separate review');
    fail(pullRequestChanges.length === verifier.size &&
      V1_VERIFIER_FILES.every(path => unique.has(path)), 'v1 migration scope mismatch');
  } else {
    for (const path of pullRequestChanges) {
      fail(Object.hasOwn(REVIEWED_SOURCE_VARIANTS_V1, path), 'unapproved PR source path: ' + path);
      fail(headBlobIds[path] === REVIEWED_SOURCE_VARIANTS_V1[path], 'unreviewed PR source blob: ' + path);
    }
  }
  for (const path of pullRequestChanges) fail(sha(headBlobIds[path]), 'missing PR Git blob: ' + path);
  return {policyVersion:1,prChangedFiles:pullRequestChanges.length,verifierMigration:touchesVerifier};
}
