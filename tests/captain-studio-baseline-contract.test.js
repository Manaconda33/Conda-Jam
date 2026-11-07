import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  APPROVED_BASELINE_PATHS,
  assertApprovedChangePaths,
  assertBaselineContract,
  HISTORICAL_BRANCHES,
  PINNED_SOURCE_PATHS,
} from '../tools/captain-studio/baseline-contract.mjs';

const recorded = JSON.parse(readFileSync(new URL('../docs/animation-production/CAPTAIN_STUDIO_BASELINE.json', import.meta.url), 'utf8'));
const copy = () => structuredClone(recorded);
const rejected = (modify, reason) => {
  const candidate = copy();
  modify(candidate);
  assert.throws(() => assertBaselineContract(candidate), reason);
};

test('accepts current read-only baseline with 17 independent pins and 3 retained historical branches', () => {
  assert.equal(PINNED_SOURCE_PATHS.length, 17);
  assert.equal(HISTORICAL_BRANCHES.length, 3);
  assert.equal(APPROVED_BASELINE_PATHS.length, 7);
  assert.doesNotThrow(() => assertBaselineContract(copy()));
});

test('rejects missing and substituted source pins', () => {
  rejected(b => { delete b.source.blobIds[PINNED_SOURCE_PATHS[0]]; }, /exact 17 required source pins/);
  rejected(b => {
    delete b.source.blobIds[PINNED_SOURCE_PATHS[0]];
    b.source.blobIds['src/unreviewed-fallback.js'] = 'a'.repeat(40);
  }, /exact 17 required source pins/);
  rejected(b => { b.source.blobIds[PINNED_SOURCE_PATHS[0]] = 'not-a-sha'; }, /source pin hash shape/);
});

test('rejects source-commit and source-tree repinning', () => {
  rejected(b => { b.source.commit = 'f'.repeat(40); }, /frozen merged source identity/);
  rejected(b => { b.source.tree = 'e'.repeat(40); }, /frozen merged source identity/);
  rejected(b => { b.source.ref = 'different'; }, /source ref/);
});

test('rejects false statements about original Myth recovery or worktree checks', () => {
  rejected(b => { b.gates.mythUnpublishedLocalWorktreeInspected = true; }, /mythUnpublishedLocalWorktreeInspected/);
  rejected(b => { b.branchRetirement.localWorktreeDependenciesVerified = true; }, /local worktree dependencies/);
  rejected(b => { b.branchRetirement.manualRecheckRequired = false; }, /manual worktree recheck/);
  rejected(b => { b.branchRetirement.remoteBranchesDeleted = true; }, /remote branches remain preserved/);
});

test('rejects owner activation and artwork-acceptance gate changes', () => {
  for (const key of ['studioPilotAuthorized', 'additionalCaptainLanesAuthorized', 'newArtAcceptedByThisSnapshot', 'resourceLimitsMeasuredFromAcceptedBundles']) {
    rejected(b => { b.gates[key] = true; }, new RegExp(key));
  }
  rejected(b => { b.strictAudit.expectations.strictOk = true; }, /strict artwork remains incomplete/);
});

test('rejects removing or changing visual issues 18 and 19', () => {
  rejected(b => { b.gates.independentVisualIssuesOpen = [18]; }, /visual holds/);
  rejected(b => { b.gates.independentVisualIssuesOpen = [18, 20]; }, /visual holds/);
  rejected(b => { b.gates.independentVisualIssuesOpen = [18, 18]; }, /visual holds/);
});

test('rejects missing or altered preserved historical branch references', () => {
  rejected(b => { b.branchRetirement.branches.pop(); }, /historical branch count/);
  rejected(b => { b.branchRetirement.branches[0].head = 'd'.repeat(40); }, /historical branch pin/);
  rejected(b => { b.branchRetirement.branches[1].name = 'codex/other'; }, /historical branch pin/);
});

test('rejects false representation of Myth or Kraken registered gaps', () => {
  rejected(b => { b.gapMatrix.mythMissing = 0; }, /Myth\/Kraken gap/);
  rejected(b => { b.gapMatrix.krakenMissing = 2; }, /Myth\/Kraken gap/);
});

test('rejects an unapproved game source, atlas, or unrelated file in candidate diff', () => {
  assert.doesNotThrow(() => assertApprovedChangePaths([...APPROVED_BASELINE_PATHS]));
  for (const path of ['src/content/animation-assets.js', 'public/assets/animation/kraken.png', 'README.md']) {
    assert.throws(() => assertApprovedChangePaths([...APPROVED_BASELINE_PATHS, path]), /unapproved change outside baseline files/);
  }
  assert.throws(() => assertApprovedChangePaths([]), /candidate change list/);
});

test('baseline verification workflow triggers on all review files and protected source inputs', () => {
  const workflow = readFileSync(new URL('../.github/workflows/captain-studio-baseline-verify.yml', import.meta.url), 'utf8');
  for (const token of [
    'CAPTAIN_STUDIO_BASELINE_2026-11-06.md',
    'CAPTAIN_GAP_MATRIX.csv',
    'ASSET_AUDIT_LATEST.*',
    'PR17_AUDIT_EXPECTED_SIGNATURES.json',
    'src/**',
    'public/assets/animation/**',
    'tools/captain-studio/**',
    'captain-studio-baseline-contract.test.js',
  ]) assert.ok(workflow.includes(token), 'workflow trigger coverage missing ' + token);
});
