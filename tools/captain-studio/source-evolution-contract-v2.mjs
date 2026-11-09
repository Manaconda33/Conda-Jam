// Captain Studio source-evolution policy v2, proposed November 9, 2026.
// Retain original PR20 evidence and the merged v1 verifier; permit exactly one
// independently reviewed v2 verifier migration and byte-pinned source variants.
// Passing CI is NOT merge, new art, production or pilot authorization.
import {
  ACCEPTED_SNAPSHOT_MERGE,
  IMMUTABLE_SNAPSHOT_FILES,
  V1_VERIFIER_FILES,
} from './source-evolution-contract.mjs';
export { ACCEPTED_SNAPSHOT_MERGE, IMMUTABLE_SNAPSHOT_FILES };

export const V2_POLICY_REVIEW_BASE = '1e145e7be3317fde6839632e85ac58daab516d00';
export const V2_VERIFIER_FILES = Object.freeze([
  '.github/workflows/captain-studio-baseline-verify.yml',
  'docs/animation-production/CAPTAIN_STUDIO_SOURCE_EVOLUTION_V2.md',
  'tools/captain-studio/source-evolution-contract-v2.mjs',
  'tools/captain-studio/verify-baseline.mjs',
  'tests/captain-studio-source-evolution-v2.test.js',
]);
export const FROZEN_V1_VERIFIER_FILES = Object.freeze(
  V1_VERIFIER_FILES.filter(path => !V2_VERIFIER_FILES.includes(path))
);

// These are Git *blob* SHA-1 pins, not a package manifest or owner approval.
// The two PR22 pins represent the corrected pre-worker-history preflight guard.
export const REVIEWED_SOURCE_VARIANTS_V2 = Object.freeze({
  'tests/captain-studio-export.test.js': '3d9a9079dc0c17908f7f0f617e4bb285899c47b5',
  'tools/captain-studio/integrate-batch.mjs': '6fe561d3ae87760d903da65470ca968cd68930e7',
  'tests/captain-studio-integration.test.js': '215ab7c722eb87b3b4bf93c8b78a83bece62ba48',
});

const sha = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
const fail = (ok, message) => {
  if (!ok) throw Error('Captain Studio evolution v2 contract failed: ' + message);
};
const verifierFiles = new Set([...V1_VERIFIER_FILES, ...V2_VERIFIER_FILES]);

/** Complete Git diff from accepted PR20 merge to HEAD, with actual HEAD blobs. */
export function assertVersionedSourceEvolution(changedPaths, headBlobIds) {
  fail(Array.isArray(changedPaths) && changedPaths.length > 0, 'missing changed-path inventory');
  fail(headBlobIds && typeof headBlobIds === 'object' && !Array.isArray(headBlobIds), 'HEAD Git blob inventory');
  const immutable = new Set(IMMUTABLE_SNAPSHOT_FILES), seen = new Set();
  for (const path of changedPaths) {
    fail(typeof path === 'string' && path.length > 0 &&
      !path.includes(String.fromCharCode(0)) && !seen.has(path), 'malformed or duplicate change path');
    seen.add(path);
    fail(!immutable.has(path), 'historical snapshot must be immutable: ' + path);
    fail(verifierFiles.has(path) || Object.hasOwn(REVIEWED_SOURCE_VARIANTS_V2,path), 'unapproved source-evolution path: ' + path);
    fail(sha(headBlobIds[path]), 'missing or deleted HEAD Git blob: ' + path);
    if (Object.hasOwn(REVIEWED_SOURCE_VARIANTS_V2, path))
      fail(headBlobIds[path] === REVIEWED_SOURCE_VARIANTS_V2[path], 'unreviewed blob variant: ' + path);
  }
  fail(Object.keys(headBlobIds).length === seen.size &&
    Object.keys(headBlobIds).every(path => seen.has(path)), 'HEAD inventory differs from complete Git diff');
  return {policyVersion:2,changedPaths:changedPaths.length,
    sourceVariants:changedPaths.filter(path=>Object.hasOwn(REVIEWED_SOURCE_VARIANTS_V2,path)).length};
}

export function assertCurrentPinnedSource(path, originalGitBlob, headGitBlob) {
  fail(sha(originalGitBlob) && sha(headGitBlob), 'malformed source-pin object ID: ' + path);
  fail(headGitBlob === originalGitBlob ||
    (Object.hasOwn(REVIEWED_SOURCE_VARIANTS_V2,path) &&
      headGitBlob === REVIEWED_SOURCE_VARIANTS_V2[path]), 'unreviewed current source-pin drift: ' + path);
}

/** Trusted PR base SHA and complete Git diff; verifier edits only on exact v2 bootstrap. */
export function assertPullRequestEvolutionScope(baseCommit,pullRequestChanges,headBlobIds) {
  fail(sha(baseCommit) && Array.isArray(pullRequestChanges) && pullRequestChanges.length > 0,
    'missing PR base or changed paths');
  fail(headBlobIds && typeof headBlobIds === 'object' && !Array.isArray(headBlobIds),
    'missing PR HEAD blobs');
  const unique = new Set(pullRequestChanges);
  fail(unique.size === pullRequestChanges.length, 'duplicate PR changed paths');
  fail(Object.keys(headBlobIds).length === unique.size &&
    Object.keys(headBlobIds).every(path=>unique.has(path)), 'PR blob inventory mismatch');
  for(const path of pullRequestChanges)fail(sha(headBlobIds[path]), 'missing PR Git blob: ' + path);

  const touchesVerifier = pullRequestChanges.some(path=>verifierFiles.has(path));
  if(touchesVerifier) {
    fail(baseCommit === V2_POLICY_REVIEW_BASE, 'verifier change requires next version and separate review');
    fail(pullRequestChanges.length === V2_VERIFIER_FILES.length &&
      V2_VERIFIER_FILES.every(path=>unique.has(path)), 'v2 migration scope mismatch');
  } else {
    for (const path of pullRequestChanges) {
      fail(Object.hasOwn(REVIEWED_SOURCE_VARIANTS_V2,path), 'unapproved PR source path: ' + path);
      fail(headBlobIds[path] === REVIEWED_SOURCE_VARIANTS_V2[path], 'unreviewed PR source blob: ' + path);
    }
  }
  return {policyVersion:2,prChangedFiles:pullRequestChanges.length,verifierMigration:touchesVerifier};
}
