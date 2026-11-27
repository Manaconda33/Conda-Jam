import test from 'node:test';
import assert from 'node:assert/strict';
import {
  V6_POLICY_REVIEW_BASE, V6_VERIFIER_FILES, MYTH_RECEIVE_BLOBS, MYTH_RECEIVE_FINDING,
  assertPullRequestEvolutionScope, exactLiveFindings, auditExpectations,
} from '../tools/captain-studio/source-evolution-contract-v6.mjs';
const fake = '1'.repeat(40);
const policy = Object.fromEntries(V6_VERIFIER_FILES.map(p => [p, fake]));
const sprite = 'public/assets/animation/myth-receive-right.webp';
const clip = { ...MYTH_RECEIVE_BLOBS };
const paths = Object.keys(clip);
test('only a complete policy bootstrap at the pinned base can amend CI', () => {
  assert.equal(assertPullRequestEvolutionScope(V6_POLICY_REVIEW_BASE, Object.keys(policy), policy).verifierMigration, true);
  assert.throws(() => assertPullRequestEvolutionScope(fake, Object.keys(policy), policy));
  assert.throws(() => assertPullRequestEvolutionScope(V6_POLICY_REVIEW_BASE, Object.keys(policy).slice(1), Object.fromEntries(Object.entries(policy).slice(1))));
  assert.throws(() => assertPullRequestEvolutionScope(V6_POLICY_REVIEW_BASE, [...Object.keys(policy), ...paths], {...policy, ...clip}));
});
test('art scope requires exact bytes, no unrelated paths, and a base with v6', () => {
  const verifiedBase = { v6Installed: true };
  assert.equal(assertPullRequestEvolutionScope(fake, paths, clip, verifiedBase).mythReceive, true);
  assert.throws(() => assertPullRequestEvolutionScope(fake, paths, clip));
  assert.throws(() => assertPullRequestEvolutionScope(fake, paths, {...clip,[sprite]:fake}, verifiedBase));
  assert.throws(() => assertPullRequestEvolutionScope(fake, paths.slice(1), Object.fromEntries(Object.entries(clip).slice(1)), verifiedBase));
  assert.throws(() => assertPullRequestEvolutionScope(fake, [...paths,'package.json'], {...clip,'package.json':fake}, verifiedBase));
});
test('live audit expectations change only if exact reviewed pilot blobs are present', () => {
  const old = ['a', MYTH_RECEIVE_FINDING,'b'];
  assert.deepEqual(exactLiveFindings(old, false), old);
  assert.deepEqual(exactLiveFindings(old, true), ['a','b']);
  assert.throws(() => exactLiveFindings(['a','b'], true));
  assert.throws(() => exactLiveFindings([MYTH_RECEIVE_FINDING,MYTH_RECEIVE_FINDING], true));
  assert.deepEqual(auditExpectations({totalFindings:746,missingClipAssignments:706,nonVerbatimPrompts:40},true),
    {totalFindings:745,missingClipAssignments:705,nonVerbatimPrompts:40,inspectedClips:2398,originalAuthoredClips:571,uniqueSourceAtlases:571,uniqueSourceDrawings:5493});
});
