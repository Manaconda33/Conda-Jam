import {
  assertCurrentPinnedSource as assertV5PinnedSource,
  assertPullRequestEvolutionScope as assertV5Scope,
  assertVersionedSourceEvolution as assertV5Evolution,
  FROZEN_V4_VERIFIER_FILES,
  V5_VERIFIER_FILES,
} from './source-evolution-contract-v5.mjs';

export const V6_POLICY_REVIEW_BASE = 'bbac2bc6e474e33e42fe972564121c0e6c0e4716';
export const V6_MODULE = 'tools/captain-studio/source-evolution-contract-v6.mjs';
export const V6_VERIFIER_FILES = Object.freeze([
  '.github/workflows/captain-studio-baseline-verify.yml',
  'docs/animation-production/CAPTAIN_STUDIO_SOURCE_EVOLUTION_V6.md',
  'tests/captain-studio-source-evolution-v5.test.js',
  'tests/captain-studio-source-evolution-v6.test.js',
  V6_MODULE,
  'tools/captain-studio/verify-baseline.mjs',
]);
export const FROZEN_V5_VERIFIER_FILES = Object.freeze(V5_VERIFIER_FILES.filter(p => !V6_VERIFIER_FILES.includes(p)));
export const MYTH_RECEIVE_BLOBS = Object.freeze({
  'public/assets/animation/manifest.json': 'b85d89ab083578691ec694e2da0e5d5cc74e1dca',
  'src/content/animation-assets.js': '3e6a8a78bb2783b55704ba79ca5ee2c8ca424590',
  'public/assets/animation/myth-receive-right.webp': 'a61eda08ca474ecbd4d1806e8919899cfbc0b251',
  'tools/generate-art/studio/myth/receive-attempt01/myth-receive-source.png': '98cb80552bcbcb089d3c8d2cd58d2d294149fd8a',
  'tools/generate-art/studio/myth/receive-attempt02/myth-receive-source.png': 'd4254bab11d43e28ce30d710b8de5f3f9fda308d',
  'tools/generate-art/studio/myth/receive-attempt02/pack-myth-receive.py': '6ebc91789f8335f89b0511074a56879fd5794e3f',
});
export const MYTH_RECEIVE_FINDING = 'missing-clip|myth|right|receive|original-authored';
const sha = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
const fail = (ok, message) => { if (!ok) throw Error('Captain Studio evolution v6: ' + message); };
const policyPaths = new Set([...V6_VERIFIER_FILES, ...V5_VERIFIER_FILES, ...FROZEN_V4_VERIFIER_FILES]);
const artPaths = Object.keys(MYTH_RECEIVE_BLOBS);
function validateInventory(paths, blobs) {
  fail(Array.isArray(paths) && paths.length && blobs && typeof blobs === 'object'
    && !Array.isArray(blobs), 'missing complete path/blob inventory');
  const names = new Set(paths);
  fail(names.size === paths.length && Object.keys(blobs).length === names.size
    && paths.every(p => typeof p === 'string' && p.length && !p.includes('\0')
      && Object.hasOwn(blobs,p) && sha(blobs[p])), 'invalid path/blob inventory');
}
function requireArt(paths, blobs) {
  fail(artPaths.every(p => paths.includes(p) && blobs[p] === MYTH_RECEIVE_BLOBS[p]),
    'expected all exact approved Myth clip blobs');
}
export function assertPullRequestEvolutionScope(base, paths, blobs, {v6Installed = false} = {}) {
  fail(sha(base), 'invalid trusted PR base');
  validateInventory(paths, blobs);
  if (paths.some(p => policyPaths.has(p))) {
    fail(base === V6_POLICY_REVIEW_BASE && !v6Installed
      && paths.length === V6_VERIFIER_FILES.length && V6_VERIFIER_FILES.every(p => paths.includes(p)),
    'v6 verifier bootstrap requires its exact standalone diff on the pinned base');
    return {policyVersion:6, verifierMigration:true, mythReceive:false};
  }
  if (paths.some(p => artPaths.includes(p))) {
    fail(v6Installed && paths.length === artPaths.length, 'Myth clip requires installed v6 and its standalone diff');
    requireArt(paths, blobs);
    return {policyVersion:6, verifierMigration:false, mythReceive:true};
  }
  return {...assertV5Scope(base, paths, blobs), policyVersion:6, mythReceive:false};
}
export function assertVersionedSourceEvolution(paths, blobs) {
  validateInventory(paths, blobs);
  const mythReceive = paths.some(p => artPaths.includes(p));
  if (mythReceive) requireArt(paths, blobs);
  // Preserve the old contract for every old path, including the historical
  // policy files. Only the exact pilot blobs and new v6 paths are new.
  const inherited = paths.filter(p => !artPaths.includes(p)
    && (!V6_VERIFIER_FILES.includes(p) || V5_VERIFIER_FILES.includes(p)));
  const v5 = assertV5Evolution(inherited, Object.fromEntries(inherited.map(p => [p, blobs[p]])));
  return {...v5, policyVersion:6, changedPaths:paths.length, mythReceive};
}
export function assertCurrentPinnedSource(path, original, head, mythReceive) {
  if (mythReceive && Object.hasOwn(MYTH_RECEIVE_BLOBS,path)) {
    fail(head === MYTH_RECEIVE_BLOBS[path], 'invalid Myth clip source pin: ' + path);
  } else assertV5PinnedSource(path, original, head);
}
export function exactLiveFindings(historical, mythReceive) {
  if (!mythReceive) return historical;
  fail(historical.filter(x => x === MYTH_RECEIVE_FINDING).length === 1, 'Myth identity missing or duplicated in historical baseline');
  return historical.filter(x => x !== MYTH_RECEIVE_FINDING);
}
export function auditExpectations(historical, mythReceive) {
  if (!mythReceive) return historical;
  return {...historical, inspectedClips:2398, originalAuthoredClips:571, uniqueSourceAtlases:571,
    uniqueSourceDrawings:5493, missingClipAssignments:705, totalFindings:745};
}
