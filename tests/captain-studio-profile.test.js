import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,writeFile,mkdir,symlink,rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { profileBaseline } from '../tools/captain-studio/profile-baseline.mjs';
test('limits derive from real complete reviewed bundles and a reserved storage budget',async()=>{
 const root=await mkdtemp(join(tmpdir(),'studio-profile-'));
 try {
  await mkdir(join(root,'sources'));await writeFile(join(root,'sources','a.png'),Buffer.alloc(100));await writeFile(join(root,'b.json'),'{}');
  const result=await profileBaseline({captainBundles:[{captainId:'a',root,complete:true,review:'accepted'}],availableBytes:10*1024*1024,reserveBytes:2*1024*1024});
  assert.equal(result.measurements[0].files,2);assert.equal(result.measurements[0].bytes,102);
  assert.equal(result.limits.maxPackageFiles,3);assert.equal(result.limits.maxPackageBytes,1024*1024);
  assert.equal(result.limits.maxBatchBytes,8*1024*1024);
  assert.equal(result.limits.maxBatchPackages,8);
  await assert.rejects(profileBaseline({captainBundles:[{captainId:'a',root,complete:true,review:'accepted'}],availableBytes:1024,reserveBytes:1}),/Insufficient workspace/);
  await symlink(join(root,'b.json'),join(root,'alias'));await assert.rejects(profileBaseline({captainBundles:[{captainId:'a',root,complete:true,review:'accepted'}],availableBytes:10000000,reserveBytes:1}));
 } finally {await rm(root,{recursive:true,force:true});}
});
test('no limits are fabricated without reviewed evidence or sufficient headroom',async()=>{
 for(const input of [{captainBundles:[],availableBytes:10,reserveBytes:1},{captainBundles:[{captainId:'a',root:'.',complete:false,review:'accepted'}],availableBytes:10,reserveBytes:1},{captainBundles:[],availableBytes:1,reserveBytes:2}]) await assert.rejects(profileBaseline(input));
});
