import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { validateRelativePath } from './package-hash.mjs';

const MAX_BLOB_BYTES=64*1024*1024;
const ALLOWED_PACKAGE_DIRS=new Set(['prompts','sources','layouts','tracks','reviews','previews','rejected']);

export class ContributionCollectionError extends Error {
  constructor(code,path='') { super(path?`${code}: ${path}`:code);this.name='ContributionCollectionError';this.code=code;this.path=path||undefined; }
}
function reject(code,path){throw new ContributionCollectionError(code,path);}
function git(root,args,{encoding='utf8'}={}){
  try{return execFileSync('git',args,{cwd:root,encoding,maxBuffer:256*1024*1024,stdio:['ignore','pipe','pipe']});}
  catch(error){throw new ContributionCollectionError('GIT_OBJECT_ERROR',args.join(' '));}
}
function parseNameStatus(raw){
  const fields=raw.split('\0');if(fields.at(-1)==='')fields.pop();const changes=[];
  for(let i=0;i<fields.length;){const status=fields[i++];if(!/^[A-Z]$/.test(status)||i>=fields.length)reject('MALFORMED_GIT_DIFF');changes.push({status,path:fields[i++]});}
  return changes;
}
function parseTree(raw){
  const entries=new Map(),fields=raw.split('\0');if(fields.at(-1)==='')fields.pop();
  for(const field of fields){const tab=field.indexOf('\t');if(tab<0)reject('MALFORMED_GIT_TREE');const [mode,type,oid]=field.slice(0,tab).split(' '),file=field.slice(tab+1);validatePath(file);entries.set(file,{mode,type,oid});}
  return entries;
}
function validatePath(file){try{return validateRelativePath(file);}catch{reject('UNSAFE_PATH',file);}}
function validateCaptainId(id){if(typeof id!=='string'||! /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))reject('INVALID_CAPTAIN_ID');return id;}
function assignmentAtlasPaths(assignment,captainId){
  if(!assignment||!Array.isArray(assignment.missing)||assignment.missing.length===0)reject('INVALID_ASSIGNMENT');
  const expected=new Map();
  for(const item of assignment.missing){
    if(!item||typeof item.clip!=='string'||! /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.clip)||!['left','right'].includes(item.direction))reject('INVALID_ASSIGNMENT');
    const key=`${item.clip}\0${item.direction}`;if(expected.has(key))reject('DUPLICATE_ASSIGNMENT');
    expected.set(key,{clip:item.clip,direction:item.direction});
  }
  return expected;
}
function classifyPath(file,captainId,expectedAtlases){
  const root=`tools/generate-art/studio/${captainId}/`;
  if(file===`${root}package.json`)return {kind:'package-manifest'};
  if(file.startsWith(root)){
    const tail=file.slice(root.length),slash=tail.indexOf('/');
    if(slash<1||!ALLOWED_PACKAGE_DIRS.has(tail.slice(0,slash))||slash===tail.length-1)reject('CAPTAIN_SCOPE_VIOLATION',file);
    return {kind:'captain-evidence',category:tail.slice(0,slash)};
  }
  for(const {clip,direction} of expectedAtlases.values()){
    for(const extension of ['png','webp']){
      if(file===`public/assets/animation/${captainId}-${clip}-${direction}.${extension}`)return {kind:'runtime-atlas',clip,direction};
    }
  }
  if(file.startsWith(`public/assets/animation/${captainId}-`))reject('UNASSIGNED_ATLAS',file);
  reject('CAPTAIN_SCOPE_VIOLATION',file);
}
function readBlob(root,oid){return git(root,['cat-file','blob',oid],{encoding:'buffer'});}
function blobSize(root,oid){const size=Number(git(root,['cat-file','-s',oid]).trim());if(!Number.isSafeInteger(size)||size<0)reject('INVALID_BLOB_SIZE',oid);return size;}
function validatedBlob(root,entry,file,cache){
  if(!entry||entry.type!=='blob'||entry.mode!=='100644')reject('UNSAFE_GIT_MODE',file);
  if(cache.has(entry.oid))return cache.get(entry.oid);
  const size=blobSize(root,entry.oid);if(size>MAX_BLOB_BYTES)reject('FILE_TOO_LARGE',file);
  const blob=readBlob(root,entry.oid);if(blob.length!==size)reject('BLOB_SIZE_MISMATCH',file);
  if(blob.subarray(0,48).toString('utf8').startsWith('version https://git-lfs.github.com/spec/v1'))reject('LFS_POINTER',file);
  const value={blob,size,sha256:sha256(blob)};cache.set(entry.oid,value);return value;
}
function sha256(bytes){return createHash('sha256').update(bytes).digest('hex');}

/**
 * Collects the complete immutable Git contribution for one captain. Worker
 * metadata never defines the path allowlist: every historical diff and the
 * final tree are checked against the coordinator's assignment.
 */
export async function collectCaptainContribution({repositoryRoot,baseCommit,workerCommit,captainId,assignment}){
  if(typeof repositoryRoot!=='string'||!repositoryRoot)reject('INVALID_REPOSITORY_ROOT');
  validateCaptainId(captainId);
  const base=git(repositoryRoot,['rev-parse','--verify',`${baseCommit}^{commit}`]).trim();
  const worker=git(repositoryRoot,['rev-parse','--verify',`${workerCommit}^{commit}`]).trim();
  if(base!==baseCommit||worker!==workerCommit)reject('NON_CANONICAL_COMMIT_ID');
  const status=git(repositoryRoot,['status','--porcelain=v1','--untracked-files=all']).trim();if(status)reject('DIRTY_WORKTREE');
  if(git(repositoryRoot,['rev-parse','HEAD']).trim()!==worker)reject('WORKER_HEAD_MISMATCH');
  try{execFileSync('git',['merge-base','--is-ancestor',base,worker],{cwd:repositoryRoot,stdio:'ignore'});}catch{reject('BASE_NOT_ANCESTOR');}

  const history=git(repositoryRoot,['rev-list','--reverse','--parents',`${base}..${worker}`]).trim().split('\n').filter(Boolean).map(line=>line.split(' '));
  const commits=[];
  for(const row of history){if(row.length!==2)reject('MERGE_COMMIT_REJECTED',row[0]);commits.push(row[0]);}
  const expectedAtlases=assignmentAtlasPaths(assignment,captainId);
  const baseEntries=parseTree(git(repositoryRoot,['ls-tree','-rz','-r','--full-tree',base]));
  const finalEntries=parseTree(git(repositoryRoot,['ls-tree','-rz','-r','--full-tree',worker]));
  const checkedBlobs=new Map();
  const baseFolded=new Map();for(const file of baseEntries.keys())baseFolded.set(file.normalize('NFC').toLowerCase(),file);
  for(const [key,entry] of expectedAtlases){
    for(const extension of ['png','webp']){
      const path=`public/assets/animation/${captainId}-${entry.clip}-${entry.direction}.${extension}`;
      if(baseEntries.has(path))reject('BASE_ATLAS_ALREADY_EXISTS',`${entry.clip}:${entry.direction}`);
    }
  }
  const changed=parseNameStatus(git(repositoryRoot,['diff','--name-status','-z','--no-renames',base,worker]));
  const inventory=new Map();
  for(const change of changed){
    validatePath(change.path);
    if(change.status!=='A')reject('BASE_FILE_MODIFIED',change.path);
    const disposition=classifyPath(change.path,captainId,expectedAtlases);
    inventory.set(change.path,disposition);
  }

  for(const commit of commits){
    const parents=git(repositoryRoot,['rev-list','--parents','-n','1',commit]).trim().split(' ');
    if(parents.length!==2)reject('MERGE_COMMIT_REJECTED',commit);
    const changes=parseNameStatus(git(repositoryRoot,['diff-tree','--no-commit-id','--name-status','-z','--no-renames','-r',parents[1],commit]));
    const commitEntries=parseTree(git(repositoryRoot,['ls-tree','-rz','-r','--full-tree',commit]));
    for(const change of changes){
      validatePath(change.path);
      if(change.status==='D')reject('HISTORY_DELETION',change.path);
      if(change.status==='M'&&baseEntries.has(change.path))reject('BASE_FILE_MODIFIED',change.path);
      if(!['A','M'].includes(change.status))reject('UNSUPPORTED_HISTORY_CHANGE',change.path);
      classifyPath(change.path,captainId,expectedAtlases);
      validatedBlob(repositoryRoot,commitEntries.get(change.path),change.path,checkedBlobs);
    }
  }

  const folded=new Map();
  for(const file of inventory.keys()){
    const key=file.normalize('NFC').toLowerCase();if(folded.has(key))reject('PATH_COLLISION',file);folded.set(key,file);
    if(baseFolded.has(key))reject('PATH_COLLISION',file);
  }
  const seenAtlases=new Set();
  for(const file of inventory.keys()){
    const entry=inventory.get(file);if(entry.kind!=='runtime-atlas')continue;
    const key=`${entry.clip}\0${entry.direction}`;if(seenAtlases.has(key))reject('DUPLICATE_ATLAS',file);seenAtlases.add(key);
  }
  const files=[];
  for(const file of [...inventory.keys()].sort()){
    const entry=finalEntries.get(file);if(!entry)reject('FINAL_FILE_MISSING',file);
    const {blob,size,sha256:hash}=validatedBlob(repositoryRoot,entry,file,checkedBlobs);
    files.push({path:file,mode:entry.mode,objectId:entry.oid,objectType:entry.type,size,sha256:hash,disposition:inventory.get(file),blob});
  }
  for(const [key,entry] of expectedAtlases)if(!seenAtlases.has(key))reject('MISSING_ASSIGNED_ATLAS',`${entry.clip}:${entry.direction}`);
  return {ok:true,baseCommit,workerCommit,commits,files};
}
