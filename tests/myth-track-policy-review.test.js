import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { canonicalJson } from '../tools/captain-studio/canonical-json.mjs';
import { assertBlobInventory, assertRuntimeRows } from '../tools/captain-studio/myth-track-policy-review.mjs';

const hash = row => createHash('sha256').update(canonicalJson(row)).digest('hex');
const blob = {path:'src/content/animation-ball-tracks.js',blob:'a'.repeat(40),sha256:'b'.repeat(64)};
test('exact artifact inventory rejects added, dropped, substituted, and duplicate paths',()=>{
 const expected=[blob];
 assert.doesNotThrow(()=>assertBlobInventory(expected,[{...blob}]));
 for (const bad of [[],[{...blob,blob:'c'.repeat(40)}],[blob,{...blob,path:'package.json'}],[blob,blob]])
  assert.throws(()=>assertBlobInventory(expected,bad),/inventory|blob/);
});
const row = ['old','old',null,10,false,[2,8],{takeoff:2},[[1,2],[3,4]]];
const base = {myth:{approved:row,offscope:structuredClone(row)},other:{approved:structuredClone(row)}};
const next = structuredClone(base);
next.myth.approved[0]='reviewed';next.myth.approved[1]='reviewed';next.myth.approved[7][0]=[1.25,2.75];
const approved = {approved:{runtimeBeforeSha256:hash(row),runtimeAfterSha256:hash(next.myth.approved)}};
test('only exact Myth source/sample tuple may differ',()=>{
 assert.deepEqual(assertRuntimeRows(base,next,approved,3),{rows:3,changed:['approved']});
 const mutate = f=>{const candidate=structuredClone(next);f(candidate);return candidate;};
 assert.throws(()=>assertRuntimeRows(base,base,approved,3),/approved set|fingerprint/);
 assert.throws(()=>assertRuntimeRows(base,mutate(x=>x.other.approved[7][0][0]++),approved,3),/outside approved Myth/);
 assert.throws(()=>assertRuntimeRows(base,mutate(x=>x.myth.offscope[0]='new'),approved,3),/outside approved Myth/);
 assert.throws(()=>assertRuntimeRows(base,mutate(x=>x.myth.approved[6].takeoff++),approved,3),/timing|anchor/);
 assert.throws(()=>assertRuntimeRows(base,mutate(x=>x.myth.approved[2]=1),approved,3),/timing|release/);
 assert.throws(()=>assertRuntimeRows(base,mutate(x=>x.myth.approved[7][0][0]+=.01),approved,3),/fingerprint/);
 assert.throws(()=>assertRuntimeRows(base,mutate(x=>delete x.myth.offscope),approved,3),/identity|count/);
});
