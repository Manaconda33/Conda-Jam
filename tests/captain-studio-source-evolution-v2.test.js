import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  ACCEPTED_SNAPSHOT_MERGE, IMMUTABLE_SNAPSHOT_FILES, V2_POLICY_REVIEW_BASE,
  V2_VERIFIER_FILES, FROZEN_V1_VERIFIER_FILES, REVIEWED_SOURCE_VARIANTS_V2,
  assertVersionedSourceEvolution, assertCurrentPinnedSource, assertPullRequestEvolutionScope,
} from '../tools/captain-studio/source-evolution-contract-v2.mjs';

const sha=n=>String(n).repeat(40).slice(0,40);
const blobs=paths=>Object.fromEntries(paths.map((path,i)=>[path,sha(i+1)]));
const guard='tools/captain-studio/integrate-batch.mjs';
const integrationTest='tests/captain-studio-integration.test.js';
const exportTest='tests/captain-studio-export.test.js';
const accepted=[...FROZEN_V1_VERIFIER_FILES,...V2_VERIFIER_FILES];

test('v2 retains PR20 immutable snapshot and PR23 frozen v1 records',()=>{
  assert.equal(ACCEPTED_SNAPSHOT_MERGE,'2654be8c094900200dd03910a99552b6cf1c2c07');
  assert.equal(V2_POLICY_REVIEW_BASE,'1e145e7be3317fde6839632e85ac58daab516d00');
  assert.equal(IMMUTABLE_SNAPSHOT_FILES.length,5);
  assert.equal(FROZEN_V1_VERIFIER_FILES.length,3);
  assert.equal(V2_VERIFIER_FILES.length,5);
  assert.deepEqual(assertVersionedSourceEvolution(accepted,blobs(accepted)),{
    policyVersion:2,changedPaths:accepted.length,sourceVariants:0
  });
});

test('only corrected exact candidate hashes pass; stale PR22 v1 hashes fail',()=>{
  for(const [path,oldBlob] of [[guard,'87627b0702ce037f8268848003bac20b585a0357'],
    [integrationTest,'6ef46fbbdc2877e8d15f38489d6a6e3cf7555380']]){
    const original=sha(5);
    assert.doesNotThrow(()=>assertCurrentPinnedSource(path,original,original));
    assert.doesNotThrow(()=>assertCurrentPinnedSource(path,original,REVIEWED_SOURCE_VARIANTS_V2[path]));
    assert.throws(()=>assertCurrentPinnedSource(path,original,oldBlob),/unreviewed current source-pin drift/);
  }
  assert.equal(REVIEWED_SOURCE_VARIANTS_V2[exportTest],'3d9a9079dc0c17908f7f0f617e4bb285899c47b5');
});

test('complete post-PR20 evolution includes only frozen verifier records and pinned source variants',()=>{
  const paths=[...accepted,exportTest,guard,integrationTest];
  const ids={...blobs(accepted),...REVIEWED_SOURCE_VARIANTS_V2};
  assert.deepEqual(assertVersionedSourceEvolution(paths,ids),{
    policyVersion:2,changedPaths:paths.length,sourceVariants:3
  });
});

test('original snapshot, artwork, runtime and arbitrary source changes are rejected',()=>{
  const orig=blobs(accepted);
  for(const path of [...IMMUTABLE_SNAPSHOT_FILES,
    'src/core/animation.js','public/assets/animation/manifest.json',
    'public/assets/animation/kraken-idle-right.webp',
    'docs/animation-production/PR17_AUDIT_EXPECTED_SIGNATURES.json']){
    assert.throws(()=>assertVersionedSourceEvolution([...accepted,path],{...orig,[path]:sha(9)}),
      /historical snapshot must be immutable|unapproved source-evolution path/);
  }
});

test('wrong blob, deletions, injected or duplicate paths fail closed',()=>{
  const ids=blobs(accepted);
  assert.throws(()=>assertVersionedSourceEvolution([...accepted,guard],{...ids,[guard]:sha(7)}),/unreviewed blob variant/);
  assert.throws(()=>assertVersionedSourceEvolution([...accepted,guard],ids),/missing or deleted HEAD Git blob/);
  assert.throws(()=>assertVersionedSourceEvolution([...accepted,accepted[0]],ids),/duplicate change path/);
  assert.throws(()=>assertVersionedSourceEvolution([...accepted,'bad'+String.fromCharCode(0)+'path'],
    {...ids,['bad'+String.fromCharCode(0)+'path']:sha(7)}),/malformed or duplicate change path/);
  assert.throws(()=>assertVersionedSourceEvolution(accepted,{...ids,extra:sha(9)}),/HEAD inventory differs/);
});

test('v2 verifier bootstrap only accepts five exact files at approved PR23 merge',()=>{
  const candidate=blobs(V2_VERIFIER_FILES);
  assert.deepEqual(assertPullRequestEvolutionScope(V2_POLICY_REVIEW_BASE,V2_VERIFIER_FILES,candidate),
    {policyVersion:2,prChangedFiles:5,verifierMigration:true});
  assert.throws(()=>assertPullRequestEvolutionScope(sha(8),V2_VERIFIER_FILES,candidate),
    /verifier change requires next version/);
  const four=V2_VERIFIER_FILES.slice(1);
  assert.throws(()=>assertPullRequestEvolutionScope(V2_POLICY_REVIEW_BASE,four,blobs(four)),
    /v2 migration scope mismatch/);
  assert.throws(()=>assertPullRequestEvolutionScope(V2_POLICY_REVIEW_BASE,[...V2_VERIFIER_FILES,guard],
    {...candidate,[guard]:REVIEWED_SOURCE_VARIANTS_V2[guard]}),/v2 migration scope mismatch/);
});

test('future PR accepts corrected source-only changes but rejects verifier edits and artwork',()=>{
  const later=sha(8);
  const source={[guard]:REVIEWED_SOURCE_VARIANTS_V2[guard],
    [integrationTest]:REVIEWED_SOURCE_VARIANTS_V2[integrationTest]};
  assert.deepEqual(assertPullRequestEvolutionScope(later,[guard,integrationTest],source),
    {policyVersion:2,prChangedFiles:2,verifierMigration:false});
  assert.throws(()=>assertPullRequestEvolutionScope(later,[guard],{[guard]:sha(9)}),
    /unreviewed PR source blob/);
  assert.throws(()=>assertPullRequestEvolutionScope(later,[FROZEN_V1_VERIFIER_FILES[0]],
    {[FROZEN_V1_VERIFIER_FILES[0]]:sha(8)}),/verifier change requires next version/);
  assert.throws(()=>assertPullRequestEvolutionScope(later,['public/assets/animation/manifest.json'],
    {'public/assets/animation/manifest.json':sha(8)}),/unapproved PR source path/);
  assert.throws(()=>assertPullRequestEvolutionScope(later,[guard,guard],{[guard]:source[guard]}),
    /duplicate PR changed paths/);
});

test('v2 audit workflow triggers on policy, verifier and corrected PR22 files',()=>{
  const workflow=readFileSync(new URL('../.github/workflows/captain-studio-baseline-verify.yml',import.meta.url),'utf8');
  for(const value of ['CAPTAIN_STUDIO_SOURCE_EVOLUTION_V1.md','CAPTAIN_STUDIO_SOURCE_EVOLUTION_V2.md',
    'captain-studio-source-evolution.test.js','captain-studio-source-evolution-v2.test.js',
    'captain-studio-integration.test.js','tools/captain-studio/**'])
    assert.ok(workflow.includes(value),'missing CI trigger: '+value);
  const verify=readFileSync(new URL('../tools/captain-studio/verify-baseline.mjs',import.meta.url),'utf8');
  assert.match(verify,/source-evolution-contract-v2\.mjs/);
  assert.match(verify,/FROZEN_V1_VERIFIER_FILES/);
});

test('v2 does not promote pilot, new artwork or Myth recovery',()=>{
  const baseline=JSON.parse(readFileSync(new URL('../docs/animation-production/CAPTAIN_STUDIO_BASELINE.json',import.meta.url),'utf8'));
  assert.equal(baseline.gates.studioPilotAuthorized,false);
  assert.equal(baseline.gates.newArtAcceptedByThisSnapshot,false);
  assert.equal(baseline.gates.mythUnpublishedLocalWorktreeInspected,false);
  assert.equal(baseline.gates.resourceLimitsMeasuredFromAcceptedBundles,false);
});
