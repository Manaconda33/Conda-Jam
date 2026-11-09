import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  ACCEPTED_SNAPSHOT_MERGE,
  IMMUTABLE_SNAPSHOT_FILES,
  V3_POLICY_REVIEW_BASE,
  V3_VERIFIER_FILES,
  FROZEN_V2_VERIFIER_FILES,
  V3_MATCH_CONTROL_PATHS,
  assertVersionedSourceEvolution,
  assertPullRequestEvolutionScope,
} from '../tools/captain-studio/source-evolution-contract-v3.mjs';
import { REVIEWED_SOURCE_VARIANTS_V2 } from '../tools/captain-studio/source-evolution-contract-v2.mjs';

const sha = n => String(n).repeat(40).slice(0, 40);
const blobs = paths => Object.fromEntries(paths.map((path, i) => [path, sha(i + 1)]));
const inherited = [...FROZEN_V2_VERIFIER_FILES, ...V3_VERIFIER_FILES];

test('v3 retains frozen PR20 snapshot and both historical verifier generations', () => {
  assert.equal(ACCEPTED_SNAPSHOT_MERGE, '2654be8c094900200dd03910a99552b6cf1c2c07');
  assert.equal(V3_POLICY_REVIEW_BASE, '7d96e1bbb5e966a48f7748e87127f1008b1c25e8');
  assert.equal(IMMUTABLE_SNAPSHOT_FILES.length, 5);
  assert.equal(FROZEN_V2_VERIFIER_FILES.length, 6);
  assert.equal(V3_VERIFIER_FILES.length, 5);
  assert.equal(new Set([...inherited, ...V3_MATCH_CONTROL_PATHS]).size,
    inherited.length + V3_MATCH_CONTROL_PATHS.length);
  assert.deepEqual(V3_MATCH_CONTROL_PATHS, [
    'tests/match-control-characterization.test.js',
    'docs/architecture/BASELINE_CHARACTERIZATION.md',
    'docs/architecture/MATCH_CONTROL_TRANSITIONS.md',
  ]);
});

test('v3 checks full HEAD inventory and retains exact inherited v2 Git blobs', () => {
  const paths = [...inherited, ...Object.keys(REVIEWED_SOURCE_VARIANTS_V2)];
  const pins = { ...blobs(inherited), ...REVIEWED_SOURCE_VARIANTS_V2 };
  const value = assertVersionedSourceEvolution(paths, pins);
  assert.equal(value.policyVersion, 3);
  assert.equal(value.preservedReviewedVariants, 3);
  assert.equal(value.scopedGameplayPaths, 0);
  assert.throws(() => assertVersionedSourceEvolution(paths, { ...pins, other: sha(9) }),
    /HEAD inventory mismatch/);
  assert.throws(() => assertVersionedSourceEvolution(paths, { ...pins,
    'tools/captain-studio/integrate-batch.mjs': sha(8) }),
    /unreviewed historical v2 source variant/);
});

test('exact base and exact five-file bootstrap only for verifier migration', () => {
  assert.deepEqual(
    assertPullRequestEvolutionScope(V3_POLICY_REVIEW_BASE, V3_VERIFIER_FILES, blobs(V3_VERIFIER_FILES)),
    { policyVersion: 3, prChangedFiles: 5, verifierMigration: true, gameplayScoped: false });
  assert.throws(() => assertPullRequestEvolutionScope(sha(9), V3_VERIFIER_FILES,
    blobs(V3_VERIFIER_FILES)), /new policy\/version review/);
  const missing = V3_VERIFIER_FILES.slice(1);
  assert.throws(() => assertPullRequestEvolutionScope(V3_POLICY_REVIEW_BASE, missing, blobs(missing)),
    /v3 bootstrap must change exactly five files/);
  const extra = [...V3_VERIFIER_FILES, V3_MATCH_CONTROL_PATHS[0]];
  assert.throws(() => assertPullRequestEvolutionScope(V3_POLICY_REVIEW_BASE, extra, blobs(extra)),
    /v3 bootstrap must change exactly five files/);
});

test('non-bootstrap changes are limited to explicitly enumerated match-control paths', () => {
  const scoped = [
    'tests/match-control-characterization.test.js',
    'docs/architecture/BASELINE_CHARACTERIZATION.md',
  ];
  assert.deepEqual(assertPullRequestEvolutionScope(V3_POLICY_REVIEW_BASE, scoped, blobs(scoped)),
    { policyVersion: 3, prChangedFiles: 2, verifierMigration: false, gameplayScoped: true });
  const invalid = [
    'src/main.js',
    'src/core/match-control.js',
    'tests/match-control.test.js',
    'tools/e2e_smoke.py',
    'src/core/simulation.js',
    'src/core/animation.js',
    'src/core/preferences.js',
    'src/content/animation-assets.js',
    'public/assets/animation/manifest.json',
    'tools/captain-studio/validate-package.mjs',
    'docs/animation-production/CAPTAIN_STUDIO_BASELINE.json',
    '.github/workflows/pages.yml',
    'package.json',
  ];
  for (const path of invalid) {
    assert.throws(() => assertPullRequestEvolutionScope(sha(9), [path], { [path]: sha(8) }),
      /unapproved match-control PR path/);
    assert.throws(() => assertVersionedSourceEvolution([...inherited, path],
      { ...blobs(inherited), [path]: sha(8) }),
    /historical snapshot must be immutable|unapproved cumulative source-evolution path/);
  }
});

test('no arbitrary verifier changes after the separately reviewed bootstrap', () => {
  for (const path of FROZEN_V2_VERIFIER_FILES) {
    assert.throws(() => assertPullRequestEvolutionScope(sha(9), [path], { [path]: sha(8) }),
      /new policy\/version review/);
  }
  const future = V3_VERIFIER_FILES[2];
  assert.throws(() => assertPullRequestEvolutionScope(sha(9), [future], { [future]: sha(8) }),
    /new policy\/version review/);
  assert.throws(() => assertPullRequestEvolutionScope(sha(9),
    ['src/main.js', 'src/main.js'], { 'src/main.js': sha(8) }),
    /duplicate PR changed path/);
});

test('strict workflow triggers for every pull request, including disallowed-only edits', () => {
  const yaml = readFileSync(new URL('../.github/workflows/captain-studio-baseline-verify.yml', import.meta.url), 'utf8');
  const trigger = yaml.split('on:\n')[1]?.split('permissions:\n')[0] ?? '';
  assert.match(trigger, /^  pull_request:\s*$/m);
  assert.doesNotMatch(trigger, /^\s+paths(?:-ignore)?:/m,
    'PR trigger must not skip disallowed-only paths');
  assert.match(yaml, /^  scope-check:$/m);
  assert.match(yaml, /name: Captain Studio scope \(all PRs\)/);
  assert.match(yaml, /git.*diff.*--name-only.*--no-renames/);
  assert.match(yaml, /assertPullRequestEvolutionScope\(base, paths, blobs\)/);
  assert.match(yaml, /fetch-depth: 0/);
  const dependents = ['exact-baseline', 'match-control-tests'];
  for (const job of dependents) {
    assert.ok(yaml.includes('  ' + job + ':\n    needs: scope-check\n'),
      'missing fail-closed dependency for ' + job);
  }
  for (const command of ['npm test', 'npm run lint', 'npm run validate:content',
    'npm run simulate:league']) {
    assert.ok(yaml.includes('run: ' + command), 'missing full-coverage command: ' + command);
  }
  const verifier = readFileSync(new URL('../tools/captain-studio/verify-baseline.mjs', import.meta.url), 'utf8');
  assert.match(verifier, /source-evolution-contract-v3\.mjs/);
  assert.match(verifier, /FROZEN_V2_VERIFIER_FILES/);
});

test('disallowed-only package and deployment PRs fail the all-PR scope contract', () => {
  for (const path of ['package.json', '.github/workflows/pages.yml']) {
    const changed = [path];
    assert.throws(() => assertPullRequestEvolutionScope(sha(9), changed,
      { [path]: sha(7) }), /unapproved match-control PR path/);
  }
});

test('ordinary follow-up source PRs cannot smuggle runtime behavior into characterization v3', () => {
  for (const path of ['src/main.js', 'src/core/match-control.js',
    'tests/match-control.test.js', 'tools/e2e_smoke.py']) {
    assert.throws(() => assertPullRequestEvolutionScope(sha(9), [path],
      { [path]: sha(7) }), /unapproved match-control PR path/);
  }
});

test('accepted historical audit and production gates retain their source-of-truth values', () => {
  const baseline = JSON.parse(readFileSync(new URL('../docs/animation-production/CAPTAIN_STUDIO_BASELINE.json', import.meta.url), 'utf8'));
  assert.equal(baseline.gates.studioPilotAuthorized, false);
  assert.equal(baseline.gates.newArtAcceptedByThisSnapshot, false);
  assert.equal(baseline.gates.mythUnpublishedLocalWorktreeInspected, false);
  assert.equal(baseline.gates.resourceLimitsMeasuredFromAcceptedBundles, false);
  assert.equal(baseline.strictAudit.expectations.totalFindings, 746);
});
