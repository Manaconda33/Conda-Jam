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

test('strict workflow covers bootstrap and follow-on match-control reviews', () => {
  const yaml = readFileSync(new URL('../.github/workflows/captain-studio-baseline-verify.yml', import.meta.url), 'utf8');
  for (const path of [
    'CAPTAIN_STUDIO_SOURCE_EVOLUTION_V3.md',
    'captain-studio-source-evolution-v3.test.js',
    'docs/architecture/**',
    'tests/match-control*.test.js',
    'tools/e2e_smoke.py',
  ]) assert.ok(yaml.includes(path), 'missing strict CI trigger: ' + path);
  const verifier = readFileSync(new URL('../tools/captain-studio/verify-baseline.mjs', import.meta.url), 'utf8');
  assert.match(verifier, /source-evolution-contract-v3\.mjs/);
  assert.match(verifier, /FROZEN_V2_VERIFIER_FILES/);
});

test('accepted historical audit and production gates retain their source-of-truth values', () => {
  const baseline = JSON.parse(readFileSync(new URL('../docs/animation-production/CAPTAIN_STUDIO_BASELINE.json', import.meta.url), 'utf8'));
  assert.equal(baseline.gates.studioPilotAuthorized, false);
  assert.equal(baseline.gates.newArtAcceptedByThisSnapshot, false);
  assert.equal(baseline.gates.mythUnpublishedLocalWorktreeInspected, false);
  assert.equal(baseline.gates.resourceLimitsMeasuredFromAcceptedBundles, false);
  assert.equal(baseline.strictAudit.expectations.totalFindings, 746);
});
