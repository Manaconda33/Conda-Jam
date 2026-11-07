import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  ACCEPTED_SNAPSHOT_MERGE,
  V1_BOOTSTRAP_REVIEW_BASE,
  IMMUTABLE_SNAPSHOT_FILES,
  REVIEWED_SOURCE_VARIANTS_V1,
  V1_VERIFIER_FILES,
  assertCurrentPinnedSource,
  assertPullRequestEvolutionScope,
  assertVersionedSourceEvolution,
} from '../tools/captain-studio/source-evolution-contract.mjs';

const sourceSha = 'bfdcac485db2e46f206a134ff3cd5e43a7cae9df';
const evolvedSha = REVIEWED_SOURCE_VARIANTS_V1['tools/captain-studio/integrate-batch.mjs'];
const original = 'tests/captain-studio-export.test.js';
const guard = 'tools/captain-studio/integrate-batch.mjs';
const integrationTest = 'tests/captain-studio-integration.test.js';
const v1Paths = [...V1_VERIFIER_FILES];
const v1Blobs = Object.fromEntries(v1Paths.map((path, index) => [path, String(index + 1).repeat(40).slice(0, 40)]));
const sample = (more = {}) => ({...v1Blobs, ...more});

test('source evolution v1 pins the previously accepted source snapshot and preserves its records', () => {
  assert.equal(ACCEPTED_SNAPSHOT_MERGE, '2654be8c094900200dd03910a99552b6cf1c2c07');
  assert.equal(IMMUTABLE_SNAPSHOT_FILES.length, 5);
  assert.equal(V1_VERIFIER_FILES.length, 5);
  assert.deepEqual(assertVersionedSourceEvolution(v1Paths, sample()), {
    policyVersion: 1, changedPaths: v1Paths.length, sourceVariants: 0,
  });
});

test('historical original Git pin and exact reviewed candidate blob both pass; unrelated drift fails', () => {
  assert.doesNotThrow(() => assertCurrentPinnedSource(guard, sourceSha, sourceSha));
  assert.doesNotThrow(() => assertCurrentPinnedSource(guard, sourceSha, evolvedSha));
  assert.throws(() => assertCurrentPinnedSource(guard, sourceSha, 'f'.repeat(40)), /unreviewed current source-pin drift/);
  assert.throws(() => assertCurrentPinnedSource('src/core/animation.js', 'a'.repeat(40), evolvedSha), /unreviewed current source-pin drift/);
});

test('source evolution v1 recognizes the already merged PR21 and byte-pinned proposed PR22 only', () => {
  const changed = [...v1Paths, original, guard, integrationTest];
  const actual = sample({
    [original]: REVIEWED_SOURCE_VARIANTS_V1[original],
    [guard]: REVIEWED_SOURCE_VARIANTS_V1[guard],
    [integrationTest]: REVIEWED_SOURCE_VARIANTS_V1[integrationTest],
  });
  assert.deepEqual(assertVersionedSourceEvolution(changed, actual), {
    policyVersion: 1, changedPaths: changed.length, sourceVariants: 3,
  });
});

test('historical snapshot paths are immutable even if they appear in a candidate allowlist', () => {
  for (const path of IMMUTABLE_SNAPSHOT_FILES) {
    assert.throws(
      () => assertVersionedSourceEvolution([...v1Paths, path], sample({[path]:'a'.repeat(40)})),
      /historical snapshot must be immutable/,
    );
  }
});

test('an unapproved source, atlas, runtime manifest, or misleading new approval is rejected', () => {
  for (const path of [
    'src/core/animation.js',
    'src/content/animation-assets.js',
    'public/assets/animation/kraken-idle-right.webp',
    'public/assets/animation/manifest.json',
    'docs/animation-production/PR17_AUDIT_EXPECTED_SIGNATURES.json',
    'tools/captain-studio/resource-limits.json',
  ]) {
    assert.throws(
      () => assertVersionedSourceEvolution([...v1Paths, path], sample({[path]:'a'.repeat(40)})),
      /unapproved source-evolution path/,
    );
  }
});

test('candidate integrator or test files with any other Git blob are rejected', () => {
  for (const path of [original, guard, integrationTest]) {
    assert.throws(
      () => assertVersionedSourceEvolution([...v1Paths, path], sample({[path]:'e'.repeat(40)})),
      /unreviewed blob variant/,
    );
  }
});

test('missing blobs, deletions, invented changes, or duplicate path inventories are rejected', () => {
  assert.throws(() => assertVersionedSourceEvolution([], {}), /missing changed-path inventory/);
  assert.throws(() => assertVersionedSourceEvolution([...v1Paths, guard], sample()), /missing or deleted HEAD Git blob/);
  assert.throws(() => assertVersionedSourceEvolution([...v1Paths, v1Paths[0]], sample()), /duplicate change path/);
  assert.throws(() => assertVersionedSourceEvolution([...v1Paths, 'bad' + String.fromCharCode(0) + 'path'], sample()), /malformed or duplicate change path/);
  assert.throws(() => assertVersionedSourceEvolution(v1Paths, sample({extra:'a'.repeat(40)})), /HEAD inventory differs/);
  assert.throws(() => assertVersionedSourceEvolution(v1Paths, sample({[v1Paths[0]]:''})), /missing or deleted HEAD Git blob/);
});

test('the CI workflow triggers on both v1 policy changes and the proposed PR22 source', () => {
  const workflow = readFileSync(new URL('../.github/workflows/captain-studio-baseline-verify.yml', import.meta.url), 'utf8');
  for (const name of [
    'tools/captain-studio/**',
    'captain-studio-source-evolution.test.js',
    'CAPTAIN_STUDIO_SOURCE_EVOLUTION_V1.md',
    'captain-studio-integration.test.js',
  ]) assert.ok(workflow.includes(name), 'missing workflow trigger: '+name);
});

test('frozen source baseline JSON is preserved and still refuses pilot or Myth recovery claims', () => {
  const baseline = JSON.parse(readFileSync(new URL('../docs/animation-production/CAPTAIN_STUDIO_BASELINE.json', import.meta.url), 'utf8'));
  assert.equal(baseline.source.commit, '895ff9c598689ce58980b504876b3b36c027f6a5');
  assert.equal(Object.keys(baseline.source.blobIds).length, 17);
  assert.equal(baseline.gates.studioPilotAuthorized, false);
  assert.equal(baseline.gates.mythUnpublishedLocalWorktreeInspected, false);
  assert.equal(baseline.strictAudit.expectations.strictOk, false);
});

test('v1 verifier bootstrap is allowed only on its exact independently reviewed base', () => {
  assert.equal(V1_BOOTSTRAP_REVIEW_BASE, 'd18a65f1eee7f00ee9fa4d5946f3859e9108d5f1');
  const valid=assertPullRequestEvolutionScope(V1_BOOTSTRAP_REVIEW_BASE, v1Paths, sample());
  assert.deepEqual(valid, {policyVersion:1,prChangedFiles:5,verifierMigration:true});
  assert.throws(
    () => assertPullRequestEvolutionScope('a'.repeat(40), v1Paths, sample()),
    /verifier change requires next version/,
  );
  assert.throws(
    () => assertPullRequestEvolutionScope(V1_BOOTSTRAP_REVIEW_BASE, v1Paths.slice(1),
      Object.fromEntries(v1Paths.slice(1).map(path=>[path,v1Blobs[path]]))),
    /v1 migration scope mismatch/,
  );
  assert.throws(
    () => assertPullRequestEvolutionScope(V1_BOOTSTRAP_REVIEW_BASE, [...v1Paths,'src/core/animation.js'],
      sample({'src/core/animation.js':'b'.repeat(40)})),
    /v1 migration scope mismatch/,
  );
});

test('a later PR is limited to reviewed exact file variants, never verifier edits or artwork', () => {
  const base='a'.repeat(40); // Simulates a future owner-approved main ancestry.
  assert.deepEqual(assertPullRequestEvolutionScope(base,[guard,integrationTest],{
    [guard]: REVIEWED_SOURCE_VARIANTS_V1[guard],
    [integrationTest]: REVIEWED_SOURCE_VARIANTS_V1[integrationTest],
  }), {policyVersion:1,prChangedFiles:2,verifierMigration:false});
  assert.throws(
    () => assertPullRequestEvolutionScope(base,[guard],{[guard]:'f'.repeat(40)}),
    /unreviewed PR source blob/,
  );
  assert.throws(
    () => assertPullRequestEvolutionScope(base,['public/assets/animation/manifest.json'],{
      'public/assets/animation/manifest.json':'a'.repeat(40)
    }),
    /unapproved PR source path/,
  );
  assert.throws(
    () => assertPullRequestEvolutionScope(base,[V1_VERIFIER_FILES[0]],{[V1_VERIFIER_FILES[0]]:'a'.repeat(40)}),
    /verifier change requires next version/,
  );
  assert.throws(
    () => assertPullRequestEvolutionScope(base,[guard,guard],{[guard]:REVIEWED_SOURCE_VARIANTS_V1[guard]}),
    /duplicate PR changed paths/,
  );
});
