// Captain Studio source-evolution policy v5: admits one reviewed gameplay change
// (shot physics: blockable jumpers and live rebounds) on top of v3/v4.
// This is verification eligibility only. It cannot authorize art, production or merges.
import {
  ACCEPTED_SNAPSHOT_MERGE,
  IMMUTABLE_SNAPSHOT_FILES,
  REVIEWED_SOURCE_VARIANTS_V2,
  assertCurrentPinnedSource,
} from './source-evolution-contract-v2.mjs';
import { V3_MATCH_CONTROL_PATHS } from './source-evolution-contract-v3.mjs';
import {
  FROZEN_V3_VERIFIER_FILES,
  V4_VERIFIER_FILES,
  V4_CPU_TEAM_PLAY_PATHS,
} from './source-evolution-contract-v4.mjs';

export { ACCEPTED_SNAPSHOT_MERGE, IMMUTABLE_SNAPSHOT_FILES, assertCurrentPinnedSource };
export const V5_POLICY_REVIEW_BASE = 'e87074b8d677909fcc3dd87d1c44c8975885525b';

// Bootstrap must be its own independently reviewed five-file PR against the
// exact post-PR28 main commit. Later PRs may NOT edit any verifier file.
export const V5_VERIFIER_FILES = Object.freeze([
  '.github/workflows/captain-studio-baseline-verify.yml',
  'docs/animation-production/CAPTAIN_STUDIO_SOURCE_EVOLUTION_V5.md',
  'tools/captain-studio/source-evolution-contract-v5.mjs',
  'tools/captain-studio/verify-baseline.mjs',
  'tests/captain-studio-source-evolution-v5.test.js',
]);

// Every v1-v4 verifier record not revised by this bootstrap stays byte-identical.
export const FROZEN_V4_VERIFIER_FILES = Object.freeze([
  ...new Set([...FROZEN_V3_VERIFIER_FILES, ...V4_VERIFIER_FILES]
    .filter(path => !V5_VERIFIER_FILES.includes(path))),
].sort());

// Exact paths of the reviewed shot-physics change. Animation, art, manifests,
// package/deployment files, src/main.js and the browser harness stay excluded.
export const V5_SHOT_PHYSICS_PATHS = Object.freeze([
  'src/core/simulation.js',
  'src/core/ai.js',
  'tests/shot-physics.test.js',
  'tests/ai.test.js',
  'tools/ai-benchmark.mjs',
  'docs/BALANCE_NOTES.md',
  'docs/KNOWN_ISSUES.md',
]);

const sha = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
const fail = (condition, message) => {
  if (!condition) throw Error('Captain Studio evolution v5 contract failed: ' + message);
};
const frozen = new Set(IMMUTABLE_SNAPSHOT_FILES);
const inheritedVerifier = new Set(FROZEN_V4_VERIFIER_FILES);
const v5Verifier = new Set(V5_VERIFIER_FILES);
// PR scope admits only the v3 characterization paths and this change. The
// cumulative history additionally carries the already-merged v4 change.
const prGameplay = new Set([...V3_MATCH_CONTROL_PATHS, ...V5_SHOT_PHYSICS_PATHS]);
const cumulativeGameplay = new Set([...prGameplay, ...V4_CPU_TEAM_PLAY_PATHS]);

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
    fail(inheritedVerifier.has(path) || v5Verifier.has(path) ||
      Object.hasOwn(REVIEWED_SOURCE_VARIANTS_V2, path) || cumulativeGameplay.has(path),
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
    policyVersion: 5,
    changedPaths: seen.size,
    preservedReviewedVariants: changedPaths.filter(path =>
      Object.hasOwn(REVIEWED_SOURCE_VARIANTS_V2, path)).length,
    scopedGameplayPaths: changedPaths.filter(path => cumulativeGameplay.has(path)).length,
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
    v5Verifier.has(path) || inheritedVerifier.has(path));
  if (touchesVerifier) {
    fail(baseCommit === V5_POLICY_REVIEW_BASE, 'verifier changes require a new policy/version review');
    fail(pullRequestChanges.length === V5_VERIFIER_FILES.length &&
      V5_VERIFIER_FILES.every(path => paths.has(path)), 'v5 bootstrap must change exactly five files');
  } else {
    for (const path of pullRequestChanges) {
      fail(prGameplay.has(path), 'unapproved gameplay PR path: ' + path);
    }
  }
  return { policyVersion: 5, prChangedFiles: paths.size,
    verifierMigration: touchesVerifier, gameplayScoped: !touchesVerifier };
}
