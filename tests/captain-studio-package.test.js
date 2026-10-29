import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalJson } from '../tools/captain-studio/canonical-json.mjs';
import { computeArtworkDigest, computeTrackDigest, computePackageDigest } from '../tools/captain-studio/package-hash.mjs';
test('canonical serialization orders keys, preserves arrays and rejects non JSON inputs', () => {
  assert.equal(canonicalJson({z:[2,1],a:{y:2,x:1}}),'{"a":{"x":1,"y":2},"z":[2,1]}');
  for(const value of [undefined,NaN,Infinity,()=>{},new Date(),{a:undefined}]) assert.throws(()=>canonicalJson(value));
  const cycle={};cycle.self=cycle;assert.throws(()=>canonicalJson(cycle));
  assert.throws(()=>canonicalJson({a:1n}));
});
test('approval is downstream of fixed artwork and track digests', () => {
  const artworkInventory={assignments:[{clip:'idle',direction:'right'}],files:[{path:'a.png',sha256:'a'.repeat(64)}]};
  const artworkDigest=computeArtworkDigest({artworkInventory});
  const trackDigest=computeTrackDigest({trackInventory:{idle:{height:[1,2]}}});
  const manifest={artworkDigest,trackDigest,reviewRecord:{artworkDigest,approval:'accepted'}};
  const files=[{path:'review.json',sha256:'b'.repeat(64)}];
  const initial=computePackageDigest({manifest,files});
  assert.equal(computePackageDigest({manifest:{...manifest,packageId:initial},files}),initial);
  assert.notEqual(computePackageDigest({manifest,files:[{...files[0],sha256:'c'.repeat(64)}]}),initial);
  assert.equal(computeArtworkDigest({artworkInventory}),artworkDigest);
  assert.notEqual(computeArtworkDigest({artworkInventory:{...artworkInventory,files:[{path:'a.png',sha256:'d'.repeat(64)}]}}),artworkDigest);
});
test('package hashing is path ordered and rejects aliases and malformed file inventories', () => {
 const manifest={artworkDigest:'a'.repeat(64)};
 const files=[{path:'z.png',sha256:'b'.repeat(64)},{path:'a.png',sha256:'c'.repeat(64)}];
 assert.equal(computePackageDigest({manifest,files}),computePackageDigest({manifest,files:[...files].reverse()}));
 for(const path of ['../a','/a','a/../b','a\\b','a//b']) assert.throws(()=>computePackageDigest({manifest,files:[{path,sha256:'a'.repeat(64)}]}));
 assert.throws(()=>computePackageDigest({manifest,files:[files[0],files[0]]}));
 assert.throws(()=>computePackageDigest({manifest,files:[{path:'A.png',sha256:'a'.repeat(64)},{path:'a.png',sha256:'b'.repeat(64)}]}));
});
test('canonical JSON rejects accessor array entries before evaluating them',()=>{
 const values=[];let invoked=0;Object.defineProperty(values,'0',{enumerable:true,get(){invoked++;return invoked;}});values.length=1;
 assert.throws(()=>canonicalJson(values));assert.equal(invoked,0);
});
test('artwork digest sorts file and assignment sets and rejects collisions',()=>{
 const artworkInventory={files:[{path:'z.png',sha256:'a'.repeat(64)},{path:'a.png',sha256:'b'.repeat(64)}],assignments:[{clip:'run',direction:'right'},{clip:'idle',direction:'left'}]};
 assert.equal(computeArtworkDigest({artworkInventory}),computeArtworkDigest({artworkInventory:{files:[...artworkInventory.files].reverse(),assignments:[...artworkInventory.assignments].reverse()}}));
 assert.throws(()=>computeArtworkDigest({artworkInventory:{...artworkInventory,files:[artworkInventory.files[0],artworkInventory.files[0]]}}));
});
