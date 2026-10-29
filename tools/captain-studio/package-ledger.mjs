import { constants } from 'node:fs';
import { lstat, open, unlink } from 'node:fs/promises';
import { hostname } from 'node:os';
import { dirname, resolve, sep } from 'node:path';
import { canonicalJson } from './canonical-json.mjs';
import { validateRelativePath } from './package-hash.mjs';

const HASH=/^[a-f0-9]{64}$/;
const COMMIT=/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/;
const STATES=new Set(['accepted','quarantined','rejected']);
const ENTRY_KEYS=['baseCommit','captainId','eventId','inventory','packageId','reasonCodes','recordedAt','reviewerReferences','state','workerCommit'];
function fail(code){const error=new Error(code);error.code=code;throw error;}
function isRecord(value){return value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.getPrototypeOf(value)===Object.prototype;}
function validateEntry(entry){
  if(!isRecord(entry)||Object.keys(entry).sort().join('\0')!==ENTRY_KEYS.slice().sort().join('\0'))fail('INVALID_LEDGER_ENTRY');
  if(!HASH.test(entry.eventId)||!HASH.test(entry.packageId)||!COMMIT.test(entry.baseCommit)||!COMMIT.test(entry.workerCommit))fail('INVALID_LEDGER_ENTRY');
  if(typeof entry.captainId!=='string'||! /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.captainId))fail('INVALID_LEDGER_ENTRY');
  if(typeof entry.recordedAt!=='string'||!Number.isFinite(Date.parse(entry.recordedAt))||new Date(entry.recordedAt).toISOString()!==entry.recordedAt)fail('INVALID_LEDGER_ENTRY');
  if(!STATES.has(entry.state)||!Array.isArray(entry.inventory)||!Array.isArray(entry.reviewerReferences)||!Array.isArray(entry.reasonCodes))fail('INVALID_LEDGER_ENTRY');
  if((entry.state==='accepted'&&entry.reasonCodes.length)||(entry.state!=='accepted'&&!entry.reasonCodes.length))fail('INVALID_LEDGER_ENTRY');
  const paths=new Set(),foldedPaths=new Set();
  for(const file of entry.inventory){
    if(!isRecord(file)||Object.keys(file).sort().join('\0')!==['disposition','mode','objectId','objectType','path','sha256','size'].sort().join('\0'))fail('INVALID_LEDGER_ENTRY');
    try{validateRelativePath(file.path);}catch{fail('INVALID_LEDGER_ENTRY');}
    const folded=file.path.normalize('NFC').toLowerCase();
    if(paths.has(file.path)||foldedPaths.has(folded)||file.mode!=='100644'||file.objectType!=='blob'||! /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/.test(file.objectId)||!HASH.test(file.sha256)||!Number.isSafeInteger(file.size)||file.size<0||typeof file.disposition!=='string'||!file.disposition)fail('INVALID_LEDGER_ENTRY');
    paths.add(file.path);foldedPaths.add(folded);
  }
  if(!entry.inventory.length)fail('INVALID_LEDGER_ENTRY');
  const sortedPaths=[...paths].sort();if(entry.inventory.some((file,index)=>file.path!==sortedPaths[index]))fail('INVALID_LEDGER_ENTRY');
  for(const ref of entry.reviewerReferences){
    if(!isRecord(ref)||Object.keys(ref).sort().join('\0')!=='path\0sha256')fail('INVALID_LEDGER_ENTRY');
    try{validateRelativePath(ref.path);}catch{fail('INVALID_LEDGER_ENTRY');}
    if(!HASH.test(ref.sha256))fail('INVALID_LEDGER_ENTRY');
    const evidence=entry.inventory.find(file=>file.path===ref.path&&file.sha256===ref.sha256);
    if(!evidence||!(evidence.disposition==='review-evidence'||/\/reviews\//.test(evidence.path)))fail('INVALID_LEDGER_ENTRY');
  }
  if(entry.reviewerReferences.length!==new Set(entry.reviewerReferences.map(ref=>ref.path)).size)fail('INVALID_LEDGER_ENTRY');
  if(entry.state==='accepted'&&(!entry.reviewerReferences.length||!entry.inventory.some(file=>file.disposition==='runtime-atlas')))fail('INVALID_LEDGER_ENTRY');
  if(entry.reasonCodes.some(code=>typeof code!=='string'||! /^[A-Z][A-Z0-9_]*$/.test(code))||new Set(entry.reasonCodes).size!==entry.reasonCodes.length)fail('INVALID_LEDGER_ENTRY');
  return entry;
}
export function parsePackageLedger(text){
  if(typeof text!=='string')fail('LEDGER_CORRUPT');if(!text)return [];
  if(!text.endsWith('\n'))fail('LEDGER_CORRUPT');
  const rows=text.slice(0,-1).split('\n'),seenEvents=new Set(),seenPackages=new Set(),entries=[];
  try{
    for(const row of rows){if(!row)fail('LEDGER_CORRUPT');const entry=validateEntry(JSON.parse(row));if(canonicalJson(entry)!==row)fail('LEDGER_CORRUPT');if(seenEvents.has(entry.eventId)||seenPackages.has(entry.packageId))fail('LEDGER_CORRUPT');seenEvents.add(entry.eventId);seenPackages.add(entry.packageId);entries.push(entry);}
  }catch{fail('LEDGER_CORRUPT');}
  return entries;
}
/**
 * Appends under a single-writer lock. If a process dies while holding the
 * lock, the adjacent `.lock` file records its PID and host. An operator may
 * remove that file only after confirming on the recorded host that the
 * process is gone and no coordinator is still writing this ledger.
 */
export async function appendPackageLedgerEntry({ledgerRoot,ledgerPath,entry}){
  if(typeof ledgerRoot!=='string'||!ledgerRoot||typeof ledgerPath!=='string'||!ledgerPath)fail('UNSAFE_LEDGER_PATH');
  let snapshot;try{snapshot=JSON.parse(canonicalJson(entry));}catch{fail('INVALID_LEDGER_ENTRY');}
  validateEntry(snapshot);
  const root=resolve(ledgerRoot);let relative;
  try{relative=validateRelativePath(ledgerPath);}catch{fail('UNSAFE_LEDGER_PATH');}
  ledgerPath=resolve(root,relative);if(!ledgerPath.startsWith(root+sep))fail('UNSAFE_LEDGER_PATH');
  for(let parent=dirname(ledgerPath);;parent=dirname(parent)){
    let info;try{info=await lstat(parent);}catch{fail('UNSAFE_LEDGER_PATH');}
    if(info.isSymbolicLink()||!info.isDirectory())fail('UNSAFE_LEDGER_PATH');
    if(parent===root)break;if(parent===dirname(parent)||!parent.startsWith(root+sep))fail('UNSAFE_LEDGER_PATH');
  }
  const serialized=canonicalJson(snapshot)+'\n';
  const lockPath=`${ledgerPath}.lock`;let lock,handle;
  try{
    try{lock=await open(lockPath,constants.O_CREAT|constants.O_EXCL|constants.O_WRONLY|constants.O_NOFOLLOW,0o600);}
    catch(error){if(error.code==='EEXIST')fail('LEDGER_BUSY');if(error.code==='ELOOP')fail('UNSAFE_LEDGER_PATH');throw error;}
    await lock.writeFile(`pid=${process.pid}\nhost=${hostname()}\n`,'utf8');await lock.sync();
    try{handle=await open(ledgerPath,constants.O_CREAT|constants.O_APPEND|constants.O_RDWR|constants.O_NOFOLLOW,0o600);}
    catch(error){if(error.code==='ELOOP')fail('UNSAFE_LEDGER_PATH');throw error;}
    if(!(await handle.stat()).isFile())fail('UNSAFE_LEDGER_PATH');
    const current=await handle.readFile('utf8'),entries=parsePackageLedger(current);
    if(entries.some(item=>item.packageId===snapshot.packageId))fail('DUPLICATE_PACKAGE_ID');
    if(entries.some(item=>item.eventId===snapshot.eventId))fail('DUPLICATE_EVENT_ID');
    await handle.writeFile(serialized,'utf8');await handle.sync();
  }finally{
    await handle?.close();await lock?.close();
    if(lock)try{await unlink(lockPath);}catch(error){if(error.code!=='ENOENT')throw error;}
  }
  return {entry:snapshot,bytes:Buffer.byteLength(serialized)};
}
