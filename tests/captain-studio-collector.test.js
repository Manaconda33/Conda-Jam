import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, symlink, truncate, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { collectCaptainContribution } from '../tools/captain-studio/collect-worker-diff.mjs';

async function fixture(t) {
  const root=await mkdtemp(path.join(os.tmpdir(),'captain-collector-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
  git('init','-q');git('config','user.name','Collector Fixture');git('config','user.email','collector@example.invalid');
  const put=async(file,content='fixture')=>{const target=path.join(root,file);await mkdir(path.dirname(target),{recursive:true});await writeFile(target,content);};
  const commit=(message)=>{git('add','-A');git('commit','-qm',message);return git('rev-parse','HEAD');};
  await put('README.md','base');const base=commit('base');
  return {root,git,put,commit,base};
}

const assignment={missing:[{clip:'pass',direction:'right'}]};

test('collector accepts a clean two-commit, captain-scoped contribution and returns stable blobs',async t=>{
  const f=await fixture(t);
  await f.put('tools/generate-art/studio/reef-captain/prompts/pass.md','exact prompt');
  f.commit('add prompt');
  await f.put('public/assets/animation/reef-captain-pass-right.webp','atlas bytes');
  const worker=f.commit('add assigned atlas');
  const result=await collectCaptainContribution({repositoryRoot:f.root,baseCommit:f.base,workerCommit:worker,captainId:'reef-captain',assignment});
  assert.equal(result.ok,true);
  assert.equal(result.baseCommit,f.base);
  assert.equal(result.workerCommit,worker);
  assert.deepEqual(result.commits.length,2);
  assert.deepEqual(result.files.map(x=>x.path),[
    'public/assets/animation/reef-captain-pass-right.webp',
    'tools/generate-art/studio/reef-captain/prompts/pass.md'
  ]);
  assert.ok(result.files.every(x=>x.mode==='100644'&&x.sha256.length===64&&x.blob));
});

test('collector requires the checkout to be exactly the submitted worker commit',async t=>{
  const f=await fixture(t);await f.put('public/assets/animation/reef-captain-pass-right.webp','atlas');const worker=f.commit('complete package');
  f.git('checkout','-q',f.base);
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:f.root,baseCommit:f.base,workerCommit:worker,captainId:'reef-captain',assignment}),e=>e.code==='WORKER_HEAD_MISMATCH');
});

test('collector rejects changes outside the captain package and assigned atlas set',async t=>{
  const f=await fixture(t);await f.put('src/core/animation.js','forbidden');const worker=f.commit('edit engine');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:f.root,baseCommit:f.base,workerCommit:worker,captainId:'reef-captain',assignment}),e=>e.code==='CAPTAIN_SCOPE_VIOLATION');
});

test('collector rejects accepted-file edits, deletions, merges, and dirty workspaces',async t=>{
  const edited=await fixture(t);await edited.put('README.md','changed');const editCommit=edited.commit('edit base');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:edited.root,baseCommit:edited.base,workerCommit:editCommit,captainId:'reef-captain',assignment}),e=>e.code==='BASE_FILE_MODIFIED');

  const deleted=await fixture(t);await deleted.put('tools/generate-art/studio/reef-captain/rejected/trial.md','rejected');deleted.commit('record rejected trial');
  execFileSync('git',['rm','-q','tools/generate-art/studio/reef-captain/rejected/trial.md'],{cwd:deleted.root});const deletion=deleted.commit('delete rejected trial');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:deleted.root,baseCommit:deleted.base,workerCommit:deletion,captainId:'reef-captain',assignment}),e=>e.code==='HISTORY_DELETION');

  const dirty=await fixture(t);await dirty.put('tools/generate-art/studio/reef-captain/prompts/pass.md');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:dirty.root,baseCommit:dirty.base,workerCommit:dirty.base,captainId:'reef-captain',assignment}),e=>e.code==='DIRTY_WORKTREE');

  const merged=await fixture(t);merged.git('checkout','-qb','review-left',merged.base);
  await merged.put('tools/generate-art/studio/reef-captain/prompts/pass.md','left');merged.commit('left package');
  merged.git('checkout','-qb','review-right',merged.base);
  await merged.put('public/assets/animation/reef-captain-pass-right.webp','right');merged.commit('right atlas');
  merged.git('checkout','-q','review-left');merged.git('merge','--no-ff','-qm','merge contribution','review-right');const mergeCommit=merged.git('rev-parse','HEAD');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:merged.root,baseCommit:merged.base,workerCommit:mergeCommit,captainId:'reef-captain',assignment}),e=>e.code==='MERGE_COMMIT_REJECTED');
});

test('collector rejects wrong captain paths, symlinks, executable files, and LFS pointers',async t=>{
  const wrong=await fixture(t);await wrong.put('public/assets/animation/another-captain-pass-right.webp');const wrongCommit=wrong.commit('wrong captain atlas');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:wrong.root,baseCommit:wrong.base,workerCommit:wrongCommit,captainId:'reef-captain',assignment}),e=>e.code==='CAPTAIN_SCOPE_VIOLATION');

  const linked=await fixture(t);const linkPath=path.join(linked.root,'tools/generate-art/studio/reef-captain/prompts/link');await mkdir(path.dirname(linkPath),{recursive:true});await symlink('missing-target',linkPath);const linkCommit=linked.commit('add symlink');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:linked.root,baseCommit:linked.base,workerCommit:linkCommit,captainId:'reef-captain',assignment}),e=>e.code==='UNSAFE_GIT_MODE');

  const transientLink=await fixture(t);const transientPath=path.join(transientLink.root,'tools/generate-art/studio/reef-captain/prompts/trial.md');await mkdir(path.dirname(transientPath),{recursive:true});await symlink('missing-target',transientPath);transientLink.commit('record link');await rm(transientPath);await writeFile(transientPath,'repaired bytes');await transientLink.put('public/assets/animation/reef-captain-pass-right.webp','atlas');const repairedLink=transientLink.commit('replace link');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:transientLink.root,baseCommit:transientLink.base,workerCommit:repairedLink,captainId:'reef-captain',assignment}),e=>e.code==='UNSAFE_GIT_MODE');

  const executable=await fixture(t);await executable.put('tools/generate-art/studio/reef-captain/prompts/run.sh','#!/bin/sh');execFileSync('chmod',['+x',path.join(executable.root,'tools/generate-art/studio/reef-captain/prompts/run.sh')]);const execCommit=executable.commit('add executable');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:executable.root,baseCommit:executable.base,workerCommit:execCommit,captainId:'reef-captain',assignment}),e=>e.code==='UNSAFE_GIT_MODE');

  const lfs=await fixture(t);await lfs.put('public/assets/animation/reef-captain-pass-right.webp','version https://git-lfs.github.com/spec/v1\noid sha256:deadbeef\nsize 9\n');const lfsCommit=lfs.commit('add pointer');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:lfs.root,baseCommit:lfs.base,workerCommit:lfsCommit,captainId:'reef-captain',assignment}),e=>e.code==='LFS_POINTER');

  const transientLfs=await fixture(t);const pointer='version https://git-lfs.github.com/spec/v1\noid sha256:deadbeef\nsize 9\n';await transientLfs.put('public/assets/animation/reef-captain-pass-right.webp',pointer);transientLfs.commit('record LFS pointer');await transientLfs.put('public/assets/animation/reef-captain-pass-right.webp','repaired atlas bytes');const repairedLfs=transientLfs.commit('replace LFS pointer');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:transientLfs.root,baseCommit:transientLfs.base,workerCommit:repairedLfs,captainId:'reef-captain',assignment}),e=>e.code==='LFS_POINTER');
});

test('collector detects path collisions and incomplete assigned clip sets',async t=>{
  const collision=await fixture(t);await collision.put('tools/generate-art/studio/reef-captain/prompts/pose.md','lower');await collision.put('tools/generate-art/studio/reef-captain/prompts/POSE.md','upper');const collisionCommit=collision.commit('add colliding names');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:collision.root,baseCommit:collision.base,workerCommit:collisionCommit,captainId:'reef-captain',assignment}),e=>e.code==='PATH_COLLISION');

  const incomplete=await fixture(t);await incomplete.put('tools/generate-art/studio/reef-captain/prompts/pass.md');const incompleteCommit=incomplete.commit('incomplete package');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:incomplete.root,baseCommit:incomplete.base,workerCommit:incompleteCommit,captainId:'reef-captain',assignment}),e=>e.code==='MISSING_ASSIGNED_ATLAS');

  const occupied=await fixture(t);await occupied.put('public/assets/animation/reef-captain-pass-right.webp','existing');occupied.base=occupied.commit('existing atlas');await occupied.put('public/assets/animation/reef-captain-pass-right.png','alternate extension');const alternate=occupied.commit('duplicate logical atlas');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:occupied.root,baseCommit:occupied.base,workerCommit:alternate,captainId:'reef-captain',assignment}),e=>e.code==='BASE_ATLAS_ALREADY_EXISTS');
});

test('collector resolves hyphenated captain and clip IDs only through exact assignment paths',async t=>{
  const f=await fixture(t),expanded={missing:[{clip:'dunk-windmill',direction:'right'},{clip:'alley-oop-power',direction:'left'}]};
  await f.put('tools/generate-art/studio/reef-captain/prompts/actions.md','prompt');
  await f.put('public/assets/animation/reef-captain-dunk-windmill-right.webp','right atlas');
  await f.put('public/assets/animation/reef-captain-alley-oop-power-left.png','left atlas');
  const worker=f.commit('add hyphenated actions');
  const result=await collectCaptainContribution({repositoryRoot:f.root,baseCommit:f.base,workerCommit:worker,captainId:'reef-captain',assignment:expanded});
  assert.deepEqual(result.files.filter(x=>x.disposition.kind==='runtime-atlas').map(x=>[x.disposition.clip,x.disposition.direction]),[['alley-oop-power','left'],['dunk-windmill','right']]);
});

test('collector checks exact hyphenated baseline collisions and rejects lookalike prefixes',async t=>{
  const occupied=await fixture(t),assigned={missing:[{clip:'dunk-windmill',direction:'right'}]};
  await occupied.put('public/assets/animation/reef-captain-dunk-windmill-right.webp','baseline atlas');occupied.base=occupied.commit('pin occupied atlas');
  await occupied.put('public/assets/animation/reef-captain-dunk-windmill-right.png','duplicate extension');const duplicate=occupied.commit('add duplicate action');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:occupied.root,baseCommit:occupied.base,workerCommit:duplicate,captainId:'reef-captain',assignment:assigned}),e=>e.code==='BASE_ATLAS_ALREADY_EXISTS');

  const lookalike=await fixture(t);await lookalike.put('public/assets/animation/reef-captain-extra-dunk-windmill-right.webp','lookalike');const worker=lookalike.commit('add lookalike prefix');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:lookalike.root,baseCommit:lookalike.base,workerCommit:worker,captainId:'reef-captain',assignment:assigned}),e=>e.code==='UNASSIGNED_ATLAS');
});

test('collector rejects oversized blobs from Git metadata before loading their contents',async t=>{
  const f=await fixture(t);const large=path.join(f.root,'tools/generate-art/studio/reef-captain/sources/oversized.bin');await mkdir(path.dirname(large),{recursive:true});await writeFile(large,'');await truncate(large,64*1024*1024+1);await f.put('public/assets/animation/reef-captain-pass-right.webp','atlas');const worker=f.commit('oversized input');
  await assert.rejects(()=>collectCaptainContribution({repositoryRoot:f.root,baseCommit:f.base,workerCommit:worker,captainId:'reef-captain',assignment}),e=>e.code==='FILE_TOO_LARGE');
});
