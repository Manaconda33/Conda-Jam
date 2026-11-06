import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { appendPackageLedgerEntry, parsePackageLedger } from '../tools/captain-studio/package-ledger.mjs';

const sha='a'.repeat(40),assetHash='b'.repeat(64),packageId='c'.repeat(64);
const event=(overrides={})=>({
  eventId:'d'.repeat(64),packageId,captainId:'reef-captain',baseCommit:sha,workerCommit:'e'.repeat(40),
  recordedAt:'2026-10-29T17:00:00.000Z',state:'quarantined',
  inventory:[{path:'public/assets/animation/reef-captain-pass-right.webp',mode:'100644',objectId:'f'.repeat(40),objectType:'blob',sha256:assetHash,size:123,disposition:'runtime-atlas'}],
  reviewerReferences:[],reasonCodes:['GENERATION_ID_MISSING'],...overrides
});
async function temp(t){const root=await mkdtemp(path.join(os.tmpdir(),'captain-ledger-'));t.after(()=>rm(root,{recursive:true,force:true}));return {root,file:'ledger.jsonl'};}

test('package ledger appends canonical immutable entries and preserves previous bytes',async t=>{
  const {root,file}=await temp(t),first=event();
  await appendPackageLedgerEntry({ledgerRoot:root,ledgerPath:file,entry:first});
  const prefix=await readFile(path.join(root,file),'utf8');assert.equal(prefix.endsWith('\n'),true);
  const evidencePath='tools/generate-art/studio/reef-captain/reviews/approval.json';
  const second=event({eventId:'1'.repeat(64),packageId:'2'.repeat(64),state:'accepted',recordedAt:'2026-10-29T17:01:00.000Z',inventory:[event().inventory[0],{path:evidencePath,mode:'100644',objectId:'2'.repeat(40),objectType:'blob',sha256:'2'.repeat(64),size:99,disposition:'review-evidence'}],reviewerReferences:[{path:evidencePath,sha256:'2'.repeat(64)}],reasonCodes:[]});
  await appendPackageLedgerEntry({ledgerRoot:root,ledgerPath:file,entry:second});
  const full=await readFile(path.join(root,file),'utf8');assert.ok(full.startsWith(prefix));
  assert.deepEqual(parsePackageLedger(full),[first,second]);
});

test('ledger rejects duplicate package and event IDs and malformed event records',async t=>{
  const {root,file}=await temp(t),first=event();await appendPackageLedgerEntry({ledgerRoot:root,ledgerPath:file,entry:first});
  await assert.rejects(()=>appendPackageLedgerEntry({ledgerRoot:root,ledgerPath:file,entry:first}),e=>e.code==='DUPLICATE_PACKAGE_ID');
  await assert.rejects(()=>appendPackageLedgerEntry({ledgerRoot:root,ledgerPath:file,entry:event({packageId:'1'.repeat(64)})}),e=>e.code==='DUPLICATE_EVENT_ID');
  await assert.rejects(()=>appendPackageLedgerEntry({ledgerRoot:root,ledgerPath:file,entry:event({state:'pending'})}),e=>e.code==='INVALID_LEDGER_ENTRY');
  await assert.rejects(()=>appendPackageLedgerEntry({ledgerRoot:root,ledgerPath:file,entry:event({inventory:[{path:'../escape',mode:'100644',objectId:'1'.repeat(40),objectType:'blob',sha256:assetHash,size:1,disposition:'runtime-atlas'}]})}),e=>e.code==='INVALID_LEDGER_ENTRY');
  await assert.rejects(()=>appendPackageLedgerEntry({ledgerRoot:root,ledgerPath:file,entry:event({state:'accepted',reasonCodes:[],reviewerReferences:[]})}),e=>e.code==='INVALID_LEDGER_ENTRY');
  await assert.rejects(()=>appendPackageLedgerEntry({ledgerRoot:root,ledgerPath:file,entry:event({eventId:'1'.repeat(64),packageId:'2'.repeat(64),state:'accepted',reasonCodes:[],reviewerReferences:[{path:'public/assets/animation/reef-captain-pass-right.webp',sha256:assetHash}]})}),e=>e.code==='INVALID_LEDGER_ENTRY');
  await assert.rejects(()=>appendPackageLedgerEntry({ledgerRoot:root,ledgerPath:file,entry:event({inventory:[{path:'A.md',mode:'100644',objectId:'1'.repeat(40),objectType:'blob',sha256:assetHash,size:1,disposition:'evidence'},{path:'a.md',mode:'100644',objectId:'2'.repeat(40),objectType:'blob',sha256:assetHash,size:1,disposition:'evidence'}]})}),e=>e.code==='INVALID_LEDGER_ENTRY');
});

test('ledger validates existing canonical lines and refuses symlink targets',async t=>{
  const {root,file}=await temp(t);await writeFile(path.join(root,file),'not json\n');
  await assert.rejects(()=>appendPackageLedgerEntry({ledgerRoot:root,ledgerPath:file,entry:event()}),e=>e.code==='LEDGER_CORRUPT');
  const target='ledger-target',link='ledger-link';await writeFile(path.join(root,target),'');await symlink(target,path.join(root,link));
  await assert.rejects(()=>appendPackageLedgerEntry({ledgerRoot:root,ledgerPath:link,entry:event()}),e=>e.code==='UNSAFE_LEDGER_PATH');
  const dir='real-dir',dirLink='dir-link';await mkdir(path.join(root,dir));await symlink(dir,path.join(root,dirLink));
  await assert.rejects(()=>appendPackageLedgerEntry({ledgerRoot:root,ledgerPath:path.join(dirLink,'ledger.jsonl'),entry:event()}),e=>e.code==='UNSAFE_LEDGER_PATH');
});

test('ledger serializes concurrent appends for a single writer and preserves lock ownership',async t=>{
  const {root,file}=await temp(t),entry=event(),lock=path.join(root,file+'.lock');
  await writeFile(lock,'held');
  await assert.rejects(()=>appendPackageLedgerEntry({ledgerRoot:root,ledgerPath:file,entry}),e=>e.code==='LEDGER_BUSY');
  assert.equal(await readFile(lock,'utf8'),'held');await rm(lock);
  const attempts=await Promise.allSettled([
    appendPackageLedgerEntry({ledgerRoot:root,ledgerPath:file,entry}),
    appendPackageLedgerEntry({ledgerRoot:root,ledgerPath:file,entry})
  ]);
  assert.equal(attempts.filter(result=>result.status==='fulfilled').length,1);
  assert.equal(attempts.filter(result=>result.status==='rejected').length,1);
  assert.equal(parsePackageLedger(await readFile(path.join(root,file),'utf8')).length,1);
});
