// Captain Studio source-evolution policy v3: narrowly scoped gameplay coordination.
// This is verification eligibility only. It cannot authorize art, production or merges.
import {
  ACCEPTED_SNAPSHOT_MERGE,
  IMMUTABLE_SNAPSHOT_FILES,
  FROZEN_V1_VERIFIER_FILES,
  V2_VERIFIER_FILES,
  REVIEWED_SOURCE_VARIANTS_V2,
  assertCurrentPinnedSource,
} from './source-evolution-contract-v2.mjs';

export { ACCEPTED_SNAPSHOT_MERGE, IMMUTABLE_SNAPSHOT_FILES, assertCurrentPinnedSource };
export const V3_POLICY_REVIEW_BASE = '7d96e1bbb5e966a48f7748e87127f1008b1c25e8';

// Bootstrap must be its own independently reviewed five-file PR against the
// exact post-PR22 main commit. Later PRs may NOT edit any verifier file.
export const V3_VERIFIER_FILES = Object.freeze([
  '.github/workflows/captain-studio-baseline-verify.yml',
  'docs/animation-production/CAPTAIN_STUDIO_SOURCE_EVOLUTION_V3.md',
  'tools/captain-studio/source-evolution-contract-v3.mjs',
  'tools/captain-studio/verify-baseline.mjs',
  'tests/captain-studio-source-evolution-v3.test.js',
]);

// v1 and v2 records outside the two shared verifier files stay byte-identical.
export const FROZEN_V2_VERIFIER_FILES = Object.freeze([
  ...new Set([...FROZEN_V1_VERIFIER_FILES, ...V2_VERIFIER_FILES]
    .filter(path => !V3_VERIFIER_FILES.includes(path))),
].sort());

// Characterization-only bootstrap. Runtime edits, browser harness edits,
// or new resolver implementation need a separate reviewed source policy (v4).
export const V3_MATCH_CONTROL_PATHS = Object.freeze([
  'tests/match-control-characterization.test.js',
  'docs/architecture/BASELINE_CHARACTERIZATION.md',
  'docs/architecture/MATCH_CONTROL_TRANSITIONS.md',
]);

const sha = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
const fail = (condition, message) => {
  if (!condition) throw Error('Captain Studio evolution v3 contract failed: ' + message);
};
const frozen = new Set(IMMUTABLE_SNAPSHOT_FILES);
const inheritedVerifier = new Set(FROZEN_V2_VERIFIER_FILES);
const v3Verifier = new Set(V3_VERIFIER_FILES);
const gameplay = new Set(V3_MATCH_CONTROL_PATHS);

// HEAD must be checked against the COMPLETE diff from accepted PR20 to HEAD.
// The historical v2 source variants remain pinned to reviewed Git blob hashes.
export function assertVersionedSourceEvolution(changedPaths, headBlobIds) {
  fail(Array.isArray(changedPaths) && changedPaths.length > 0, 'missing changed-path inventory');
  fail(headBlobIds && typeof headBlobIds === 'object' && !Array.isArray(headBlobIds), 'missing HEAD blobs');
  const seen = new Set();
  for (const path of changedPaths) {
    fail(typeof path === 'string' && path.length > 0 &&
      !path.includes(String.fromCharCode(0)) && !seen.has(path), 'malformed/duplicate changed path');
    seen.add(path);
    fail(!frozen.has(path), 'historical snapshot must be immutable: ' + path);
    fail(inheritedVerifier.has(path) || v3Verifier.has(path) ||
      Object.hasOwn(REVIEWED_SOURCE_VARIANTS_V2, path) || gameplay.has(path),
      'unapproved cumulative source-evolution path: ' + path);
    fail(sha(headBlobIds[path]), 'missing/deleted HEAD Git blob: ' + path);
    if (Object.hasOwn(REVIEWED_SOURCE_VARIANTS_V2, path)) {
      fail(headBlobIds[path] === REVIEWED_SOURCE_VARIANTS_V2[path],
        'unreviewed historical v2 source variant: ' + path);
    }
  }
  fail(Object.keys(headBlobIds).length === seen.size &&
    Object.keys(headBlobIds).every(path => seen.has(path)), 'HEAD inventory mismatch');
  return {
    policyVersion: 3,
    changedPaths: seen.size,
    preservedReviewedVariants: changedPaths.filter(path =>
      Object.hasOwn(REVIEWED_SOURCE_VARIANTS_V2, path)).length,
    scopedGameplayPaths: changedPaths.filter(path => gameplay.has(path)).length,
  };
}

// On PRs, GitHub supplies the trusted base SHA; never accept a worker's declared
// base or a partial file list. No policy/verifier edits in ordinary gameplay PRs.
export function assertPullRequestEvolutionScope(baseCommit, pullRequestChanges, headBlobIds) {
  fail(sha(baseCommit) && Array.isArray(pullRequestChanges) && pullRequestChanges.length > 0,
    'missing trusted PR base or full change list');
  fail(headBlobIds && typeof headBlobIds === 'object' && !Array.isArray(headBlobIds),
    'missing trusted PR HEAD blobs');
  const paths = new Set(pullRequestChanges);
  fail(paths.size === pullRequestChanges.length, 'duplicate PR changed path');
  fail(Object.keys(headBlobIds).length === paths.size &&
    Object.keys(headBlobIds).every(path => paths.has(path)), 'PR Git blob inventory mismatch');
  for (const path of pullRequestChanges) fail(sha(headBlobIds[path]), 'missing/deleted PR blob: ' + path);
  const touchesVerifier = pullRequestChanges.some(path =>
    v3Verifier.has(path) || inheritedVerifier.has(path));
  if (touchesVerifier) {
    fail(baseCommit === V3_POLICY_REVIEW_BASE, 'verifier changes require a new policy/version review');
    fail(pullRequestChanges.length === V3_VERIFIER_FILES.length &&
      V3_VERIFIER_FILES.every(path => paths.has(path)), 'v3 bootstrap must change exactly five files');
  } else {
    for (const path of pullRequestChanges) {
      fail(gameplay.has(path), 'unapproved match-control PR path: ' + path);
    }
  }
  return { policyVersion: 3, prChangedFiles: paths.size,
    verifierMigration: touchesVerifier, gameplayScoped: !touchesVerifier };
}
