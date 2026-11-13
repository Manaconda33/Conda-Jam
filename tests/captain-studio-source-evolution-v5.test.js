import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  ACCEPTED_SNAPSHOT_MERGE,
  IMMUTABLE_SNAPSHOT_FILES,
  V5_POLICY_REVIEW_BASE,
  V5_VERIFIER_FILES,
  FROZEN_V4_VERIFIER_FILES,
  V5_SHOT_PHYSICS_PATHS,
  assertVersionedSourceEvolution,
  assertPullRequestEvolutionScope,
} from '../tools/captain-studio/source-evolution-contract-v5.mjs';
import { V3_MATCH_CONTROL_PATHS } from '../tools/captain-studio/source-evolution-contract-v3.mjs';
import { V4_VERIFIER_FILES, V4_CPU_TEAM_PLAY_PATHS } from '../tools/captain-studio/source-evolution-contract-v4.mjs';
import { REVIEWED_SOURCE_VARIANTS_V2 } from '../tools/captain-studio/source-evolution-contract-v2.mjs';

const sha = n => String(n).repeat(40).slice(0, 40);
const blobs = paths => Object.fromEntries(paths.map((path, i) => [path, sha((i % 9) + 1)]));
const inherited = [...FROZEN_V4_VERIFIER_FILES, ...V5_VERIFIER_FILES];

test('v5 retains the PR20 snapshot and freezes all v1-v4 verifier records', () => {
  assert.equal(ACCEPTED_SNAPSHOT_MERGE, '2654be8c094900200dd03910a99552b6cf1c2c07');
  assert.equal(V5_POLICY_REVIEW_BASE, 'e87074b8d677909fcc3dd87d1c44c8975885525b');
  assert.equal(IMMUTABLE_SNAPSHOT_FILES.length, 5);
  assert.equal(V5_VERIFIER_FILES.length, 5);
  // The v4 doc, contract and test join the nine frozen v1-v3 records.
  assert.equal(FROZEN_V4_VERIFIER_FILES.length, 12);
  for (const path of V4_VERIFIER_FILES.filter(p => !V5_VERIFIER_FILES.includes(p))) {
    assert.ok(FROZEN_V4_VERIFIER_FILES.includes(path), 'v4 record not frozen: ' + path);
  }
  assert.deepEqual(V5_SHOT_PHYSICS_PATHS, [
    'src/core/simulation.js',
    'src/core/ai.js',
    'tests/shot-physics.test.js',
    'tests/ai.test.js',
    'tools/ai-benchmark.mjs',
    'docs/BALANCE_NOTES.md',
    'docs/KNOWN_ISSUES.md',
  ]);
});

test('cumulative history accepts the merged v4 change and this change, with exact v2 pins', () => {
  const gameplay = [...new Set([...V4_CPU_TEAM_PLAY_PATHS, ...V5_SHOT_PHYSICS_PATHS, ...V3_MATCH_CONTROL_PATHS])];
  const paths = [...inherited, ...Object.keys(REVIEWED_SOURCE_VARIANTS_V2), ...gameplay];
  const pins = { ...blobs([...inherited, ...gameplay]), ...REVIEWED_SOURCE_VARIANTS_V2 };
  const value = assertVersionedSourceEvolution(paths, pins);
  assert.equal(value.policyVersion, 5);
  assert.equal(value.preservedReviewedVariants, 3);
  assert.equal(value.scopedGameplayPaths, gameplay.length);
  assert.throws(() => assertVersionedSourceEvolution(paths, { ...pins, other: sha(9) }), /HEAD inventory mismatch/);
  assert.throws(() => assertVersionedSourceEvolution(paths, { ...pins,
    'tools/captain-studio/integrate-batch.mjs': sha(8) }), /unreviewed historical v2 source variant/);
});

test('exact base and exact five-file bootstrap only for verifier migration', () => {
  assert.deepEqual(
    assertPullRequestEvolutionScope(V5_POLICY_REVIEW_BASE, V5_VERIFIER_FILES, blobs(V5_VERIFIER_FILES)),
    { policyVersion: 5, prChangedFiles: 5, verifierMigration: true, gameplayScoped: false });
  assert.throws(() => assertPullRequestEvolutionScope(sha(9), V5_VERIFIER_FILES, blobs(V5_VERIFIER_FILES)),
    /new policy\/version review/);
  const missing = V5_VERIFIER_FILES.slice(1);
  assert.throws(() => assertPullRequestEvolutionScope(V5_POLICY_REVIEW_BASE, missing, blobs(missing)),
    /v5 bootstrap must change exactly five files/);
  const extra = [...V5_VERIFIER_FILES, V5_SHOT_PHYSICS_PATHS[0]];
  assert.throws(() => assertPullRequestEvolutionScope(V5_POLICY_REVIEW_BASE, extra, blobs(extra)),
    /v5 bootstrap must change exactly five files/);
});

test('gameplay PRs may change the shot-physics paths and the v3 characterization paths only', () => {
  assert.deepEqual(assertPullRequestEvolutionScope(sha(9), V5_SHOT_PHYSICS_PATHS, blobs(V5_SHOT_PHYSICS_PATHS)),
    { policyVersion: 5, prChangedFiles: 7, verifierMigration: false, gameplayScoped: true });
  assert.deepEqual(assertPullRequestEvolutionScope(sha(9), V3_MATCH_CONTROL_PATHS, blobs(V3_MATCH_CONTROL_PATHS)),
    { policyVersion: 5, prChangedFiles: 3, verifierMigration: false, gameplayScoped: true });
  // v4-only paths are history now, not open for new PRs.
  for (const path of V4_CPU_TEAM_PLAY_PATHS.filter(p => !V5_SHOT_PHYSICS_PATHS.includes(p))) {
    assert.throws(() => assertPullRequestEvolutionScope(sha(9), [path], { [path]: sha(8) }),
      /unapproved gameplay PR path/, path);
  }
});

test('animation, art, package, deployment and harness paths stay outside v5', () => {
  const invalid = [
    'src/main.js', 'src/core/animation.js', 'src/core/preferences.js', 'src/content/teams.js',
    'src/content/animation-assets.js', 'src/render/animation-sprites.js', 'public/assets/animation/manifest.json',
    'tests/game-core.test.js', 'tools/e2e_smoke.py', 'tools/captain-studio/validate-package.mjs',
    'docs/animation-production/CAPTAIN_STUDIO_BASELINE.json', '.github/workflows/pages.yml',
    'package.json', 'package-lock.json',
  ];
  for (const path of invalid) {
    assert.throws(() => assertPullRequestEvolutionScope(sha(9), [path], { [path]: sha(8) }),
      /unapproved gameplay PR path/, path);
    assert.throws(() => assertVersionedSourceEvolution([...inherited, path], { ...blobs(inherited), [path]: sha(8) }),
      /historical snapshot must be immutable|unapproved cumulative source-evolution path/, path);
  }
  const mixed = [...V5_SHOT_PHYSICS_PATHS, 'package.json'];
  assert.throws(() => assertPullRequestEvolutionScope(sha(9), mixed, blobs(mixed)),
    /unapproved gameplay PR path: package\.json/);
});

test('no verifier changes after the bootstrap, including frozen v4 records', () => {
  for (const path of FROZEN_V4_VERIFIER_FILES) {
    assert.throws(() => assertPullRequestEvolutionScope(sha(9), [path], { [path]: sha(8) }),
      /new policy\/version review/, path);
  }
});

test('the verifier and workflow load the v5 contract and keep the browser gate', async () => {
  // Behavioral check: the scope job imports exactly the v5 export, by module path.
  const yaml = readFileSync(new URL('../.github/workflows/captain-studio-baseline-verify.yml', import.meta.url), 'utf8');
  const imports = [...yaml.matchAll(/from '\.\/tools\/captain-studio\/(source-evolution-contract[^']*)'/g)].map(m => m[1]);
  assert.deepEqual(imports, ['source-evolution-contract-v5.mjs']);
  const trigger = yaml.split('on:\n')[1]?.split('permissions:\n')[0] ?? '';
  assert.doesNotMatch(trigger, /^\s+paths(?:-ignore)?:/m);
  const gameplayJob = yaml.split('  match-control-tests:\n')[1] ?? '';
  for (const command of ['npm test', 'npm run build', 'npm run test:e2e']) assert.ok(gameplayJob.includes('run: ' + command), command);
  const verifier = readFileSync(new URL('../tools/captain-studio/verify-baseline.mjs', import.meta.url), 'utf8');
  const code = verifier.split('\n').filter(line => !line.trim().startsWith('//')).join('\n');
  assert.match(code, /from '\.\/source-evolution-contract-v5\.mjs'/);
  assert.match(code, /= assertV5VersionedSourceEvolution\(/);
  assert.match(code, /= assertV5PullRequestEvolutionScope\(/);
  assert.doesNotMatch(code, /assertV4\w+\(/, 'v4 checks are documentation-only in executable code');
});
