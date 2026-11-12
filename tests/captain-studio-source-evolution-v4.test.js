import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  ACCEPTED_SNAPSHOT_MERGE,
  IMMUTABLE_SNAPSHOT_FILES,
  V4_POLICY_REVIEW_BASE,
  V4_VERIFIER_FILES,
  FROZEN_V3_VERIFIER_FILES,
  V4_CPU_TEAM_PLAY_PATHS,
  assertVersionedSourceEvolution,
  assertPullRequestEvolutionScope,
} from '../tools/captain-studio/source-evolution-contract-v4.mjs';
import { V3_MATCH_CONTROL_PATHS, V3_VERIFIER_FILES } from '../tools/captain-studio/source-evolution-contract-v3.mjs';
import { REVIEWED_SOURCE_VARIANTS_V2 } from '../tools/captain-studio/source-evolution-contract-v2.mjs';

const sha = n => String(n).repeat(40).slice(0, 40);
const blobs = paths => Object.fromEntries(paths.map((path, i) => [path, sha(i + 1)]));
const inherited = [...FROZEN_V3_VERIFIER_FILES, ...V4_VERIFIER_FILES];

test('v4 retains the PR20 snapshot and freezes all v1/v2/v3 verifier records', () => {
  assert.equal(ACCEPTED_SNAPSHOT_MERGE, '2654be8c094900200dd03910a99552b6cf1c2c07');
  assert.equal(V4_POLICY_REVIEW_BASE, 'f2788aec6786675f9e5b1ce516a65cbf788b2d78');
  assert.equal(IMMUTABLE_SNAPSHOT_FILES.length, 5);
  assert.equal(V4_VERIFIER_FILES.length, 5);
  // v3 doc, contract and test join the six frozen v1/v2 records.
  assert.equal(FROZEN_V3_VERIFIER_FILES.length, 9);
  for (const path of V3_VERIFIER_FILES.filter(p => !V4_VERIFIER_FILES.includes(p))) {
    assert.ok(FROZEN_V3_VERIFIER_FILES.includes(path), 'v3 record not frozen: ' + path);
  }
  assert.equal(new Set([...inherited, ...V3_MATCH_CONTROL_PATHS, ...V4_CPU_TEAM_PLAY_PATHS]).size,
    inherited.length + V3_MATCH_CONTROL_PATHS.length + V4_CPU_TEAM_PLAY_PATHS.length);
  assert.deepEqual(V4_CPU_TEAM_PLAY_PATHS, [
    'src/core/ai.js',
    'src/core/simulation.js',
    'tests/ai.test.js',
    'tools/ai-benchmark.mjs',
    'tools/build.mjs',
    'README.md',
    'docs/BALANCE_NOTES.md',
    'docs/KNOWN_ISSUES.md',
  ]);
});

test('v4 checks the full HEAD inventory and keeps exact inherited v2 Git blobs', () => {
  const paths = [...inherited, ...Object.keys(REVIEWED_SOURCE_VARIANTS_V2), ...V4_CPU_TEAM_PLAY_PATHS];
  const pins = { ...blobs([...inherited, ...V4_CPU_TEAM_PLAY_PATHS]), ...REVIEWED_SOURCE_VARIANTS_V2 };
  const value = assertVersionedSourceEvolution(paths, pins);
  assert.equal(value.policyVersion, 4);
  assert.equal(value.preservedReviewedVariants, 3);
  assert.equal(value.scopedGameplayPaths, V4_CPU_TEAM_PLAY_PATHS.length);
  assert.throws(() => assertVersionedSourceEvolution(paths, { ...pins, other: sha(9) }),
    /HEAD inventory mismatch/);
  assert.throws(() => assertVersionedSourceEvolution(paths, { ...pins,
    'tools/captain-studio/integrate-batch.mjs': sha(8) }),
    /unreviewed historical v2 source variant/);
});

test('exact base and exact five-file bootstrap only for verifier migration', () => {
  assert.deepEqual(
    assertPullRequestEvolutionScope(V4_POLICY_REVIEW_BASE, V4_VERIFIER_FILES, blobs(V4_VERIFIER_FILES)),
    { policyVersion: 4, prChangedFiles: 5, verifierMigration: true, gameplayScoped: false });
  assert.throws(() => assertPullRequestEvolutionScope(sha(9), V4_VERIFIER_FILES,
    blobs(V4_VERIFIER_FILES)), /new policy\/version review/);
  const missing = V4_VERIFIER_FILES.slice(1);
  assert.throws(() => assertPullRequestEvolutionScope(V4_POLICY_REVIEW_BASE, missing, blobs(missing)),
    /v4 bootstrap must change exactly five files/);
  const extra = [...V4_VERIFIER_FILES, V4_CPU_TEAM_PLAY_PATHS[0]];
  assert.throws(() => assertPullRequestEvolutionScope(V4_POLICY_REVIEW_BASE, extra, blobs(extra)),
    /v4 bootstrap must change exactly five files/);
});

test('gameplay PRs may change the CPU team-play paths and the v3 characterization paths', () => {
  assert.deepEqual(assertPullRequestEvolutionScope(sha(9), V4_CPU_TEAM_PLAY_PATHS, blobs(V4_CPU_TEAM_PLAY_PATHS)),
    { policyVersion: 4, prChangedFiles: 8, verifierMigration: false, gameplayScoped: true });
  assert.deepEqual(assertPullRequestEvolutionScope(sha(9), V3_MATCH_CONTROL_PATHS, blobs(V3_MATCH_CONTROL_PATHS)),
    { policyVersion: 4, prChangedFiles: 3, verifierMigration: false, gameplayScoped: true });
});

test('animation, art, package, deployment and harness paths stay outside v4', () => {
  const invalid = [
    'src/main.js',
    'src/core/match-control.js',
    'src/core/animation.js',
    'src/core/preferences.js',
    'src/content/animation-assets.js',
    'src/content/animation-ball-tracks.js',
    'src/render/animation-sprites.js',
    'public/assets/animation/manifest.json',
    'tools/e2e_smoke.py',
    'tools/captain-studio/validate-package.mjs',
    'docs/animation-production/CAPTAIN_STUDIO_BASELINE.json',
    '.github/workflows/pages.yml',
    'package.json',
    'package-lock.json',
  ];
  for (const path of invalid) {
    assert.throws(() => assertPullRequestEvolutionScope(sha(9), [path], { [path]: sha(8) }),
      /unapproved gameplay PR path/);
    assert.throws(() => assertVersionedSourceEvolution([...inherited, path],
      { ...blobs(inherited), [path]: sha(8) }),
    /historical snapshot must be immutable|unapproved cumulative source-evolution path/);
  }
  // One disallowed file sinks an otherwise in-scope gameplay PR.
  const mixed = [...V4_CPU_TEAM_PLAY_PATHS, 'package.json'];
  assert.throws(() => assertPullRequestEvolutionScope(sha(9), mixed, blobs(mixed)),
    /unapproved gameplay PR path: package\.json/);
});

test('no verifier changes after the bootstrap, including frozen v3 records', () => {
  for (const path of FROZEN_V3_VERIFIER_FILES) {
    assert.throws(() => assertPullRequestEvolutionScope(sha(9), [path], { [path]: sha(8) }),
      /new policy\/version review/);
  }
  const future = V4_VERIFIER_FILES[2];
  assert.throws(() => assertPullRequestEvolutionScope(sha(9), [future], { [future]: sha(8) }),
    /new policy\/version review/);
  assert.throws(() => assertPullRequestEvolutionScope(sha(9),
    ['src/core/ai.js', 'src/core/ai.js'], { 'src/core/ai.js': sha(8) }),
    /duplicate PR changed path/);
});

test('workflow uses v4, stays unfiltered and gates gameplay on the browser smoke suite', () => {
  const yaml = readFileSync(new URL('../.github/workflows/captain-studio-baseline-verify.yml', import.meta.url), 'utf8');
  const trigger = yaml.split('on:\n')[1]?.split('permissions:\n')[0] ?? '';
  assert.match(trigger, /^  pull_request:\s*$/m);
  assert.doesNotMatch(trigger, /^\s+paths(?:-ignore)?:/m);
  assert.match(yaml, /source-evolution-contract-v4\.mjs/);
  assert.doesNotMatch(yaml, /import \{ assertPullRequestEvolutionScope \} from '\.\/tools\/captain-studio\/source-evolution-contract-v3\.mjs'/);
  const gameplayJob = yaml.split('  match-control-tests:\n')[1] ?? '';
  for (const command of ['npm test', 'npm run lint', 'npm run validate:content',
    'npm run simulate:league', 'npm run build', 'npm run test:e2e']) {
    assert.ok(gameplayJob.includes('run: ' + command), 'gameplay job missing: ' + command);
  }
  assert.match(gameplayJob, /playwright==\d+\.\d+\.\d+/, 'Playwright must be pinned');
  assert.match(gameplayJob, /\/usr\/bin\/chromium/);
  const verifier = readFileSync(new URL('../tools/captain-studio/verify-baseline.mjs', import.meta.url), 'utf8');
  assert.match(verifier, /source-evolution-contract-v4\.mjs/);
  assert.match(verifier, /FROZEN_V3_VERIFIER_FILES/);
  assert.match(verifier, /assertV4VersionedSourceEvolution\(changedPaths, changedBlobIds\)/);
  assert.match(verifier, /assertV4PullRequestEvolutionScope\(prBase, prChanges, prBlobs\)/);
});
