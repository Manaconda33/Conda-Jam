import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { spawn } from 'node:child_process';
import { access, link, lstat, mkdir, mkdtemp, readFile, readdir, rm, stat, symlink, writeFile, rename } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { canonicalJson } from './canonical-json.mjs';
import { compareAudits, normalizeAudit } from './compare-audits.mjs';
import { validateRelativePath } from './package-hash.mjs';
import { renderIntegrationLedger, renderIntegrationReport } from './integration-report.mjs';
import { writeBallTrackRegistry } from '../register-animation-ball-tracks.mjs';
import { collectCaptainContribution } from './collect-worker-diff.mjs';
import { animationClips } from '../../src/core/animation.js';

const SHA=/^[a-f0-9]{64}$/;
const COMMIT=/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/;
const MAX_BLOB_BYTES=64*1024*1024;
const MAX_DECODED_PIXELS=64_000_000;
const hash=value=>createHash('sha256').update(value).digest('hex');
function issue(code,detail={}){return {code,...detail};}
function stableCodes(errors){return [...new Set(errors.map(row=>typeof row==='string'?row:row?.code).filter(Boolean))].sort();}
function git(root,args,options={}){
  try{return execFileSync('git',args,{cwd:root,encoding:options.encoding??'utf8',maxBuffer:256*1024*1024,stdio:['ignore','pipe','pipe']});}
  catch(error){throw Object.assign(new Error('GIT_OPERATION_FAILED'),{code:'GIT_OPERATION_FAILED',cause:error});}
}
function validateBatchInputs({baseRoot,baseCommit,outputRoot,packageRoots,config}){
  if(typeof baseRoot!=='string'||typeof outputRoot!=='string'||!Array.isArray(packageRoots))throw Object.assign(new Error('INVALID_BATCH_INPUT'),{code:'INVALID_BATCH_INPUT'});
  if(!COMMIT.test(baseCommit??''))throw Object.assign(new Error('INVALID_BASE_COMMIT'),{code:'INVALID_BASE_COMMIT'});
  if(!config||!['integratorVersion','schemaVersion','registryGeneratorVersion','strictAuditConfig','baselineFindingSetHashes','mirrorPolicyHash','resourcePolicyHash'].every(key=>Object.hasOwn(config,key)))throw Object.assign(new Error('INTEGRATION_INPUT_HASH_MISSING'),{code:'INTEGRATION_INPUT_HASH_MISSING'});
  if(!SHA.test(config.mirrorPolicyHash)||!SHA.test(config.resourcePolicyHash)||!config.baselineFindingSetHashes||typeof config.baselineFindingSetHashes!=='object')throw Object.assign(new Error('INTEGRATION_INPUT_HASH_INVALID'),{code:'INTEGRATION_INPUT_HASH_INVALID'});
  const limits=config.resourceLimits;
  if(!limits||!['maxBatchPackages','maxDecodedPixelsPerImage','maxInputFileBytes','maxPackageBytes','maxBatchBytes'].every(key=>Number.isSafeInteger(limits[key])&&limits[key]>0)||limits.maxBatchPackages>8||limits.maxDecodedPixelsPerImage>MAX_DECODED_PIXELS||limits.maxInputFileBytes>MAX_BLOB_BYTES)throw Object.assign(new Error('RESOURCE_LIMITS_INVALID'),{code:'RESOURCE_LIMITS_INVALID'});
  const root=resolve(baseRoot),out=resolve(outputRoot);
  if(out===root||out.startsWith(root+sep)||root.startsWith(out+sep))throw Object.assign(new Error('OUTPUT_ROOT_OVERLAP'),{code:'OUTPUT_ROOT_OVERLAP'});
  const head=git(root,['rev-parse','--verify','HEAD']).trim();
  if(head!==baseCommit)throw Object.assign(new Error('STALE_BASE'),{code:'STALE_BASE'});
  if(git(root,['status','--porcelain=v1','--untracked-files=all']).trim())throw Object.assign(new Error('DIRTY_BASE'),{code:'DIRTY_BASE'});
  return {root,out};
}
function validateUpdateShape(update,captainId){
  if(!update||typeof update.clip!=='string'||!['left','right'].includes(update.direction)||typeof update.assetPath!=='string'||!SHA.test(update.assetSha256))return 'INVALID_UPDATE';
  if(!animationClips[update.clip])return 'UNSUPPORTED_CLIP';
  try{validateRelativePath(update.assetPath);}catch{return 'UNSAFE_ASSET_PATH';}
  if(!update.assetPath.startsWith(`public/assets/animation/${captainId}-`)||! /\.(png|webp)$/.test(update.assetPath))return 'CAPTAIN_SCOPE_VIOLATION';
  const row=update.manifestEntry??update;
  if(row.assetPath&&row.assetPath!==update.assetPath||row.assetSha256&&row.assetSha256!==update.assetSha256)return 'ASSET_MANIFEST_MISMATCH';
  if(row.reviewed!==undefined&&row.reviewed!==true)return 'ASSET_MANIFEST_MISMATCH';
  const frames=row.cells??row.frames;
  if(!Array.isArray(frames)||frames.length===0)return 'INVALID_FRAME_GEOMETRY';
  for(const frame of frames)if(!frame||!['x','y','w','h'].every(key=>Number.isSafeInteger(frame[key]))||frame.x<0||frame.y<0||frame.w<=0||frame.h<=0)return 'INVALID_FRAME_GEOMETRY';
  if(typeof update.trackPath!=='string'||!SHA.test(update.trackSha256)||!update.track||!Array.isArray(update.track.height)||!Array.isArray(update.track.forward))return 'INVALID_TRACK';
  if(update.track.height.length!==update.track.forward.length||!update.track.height.every(Number.isFinite)||!update.track.forward.every(Number.isFinite))return 'INVALID_TRACK';
  return null;
}
async function assertNoSymlinkPath(inputPath,{directory=false}={}){
  const absolute=resolve(inputPath),parts=absolute.split(sep).filter(Boolean);let cursor=sep;
  for(let index=0;index<parts.length;index++){
    cursor=join(cursor,parts[index]);const stat=await lstat(cursor);
    if(stat.isSymbolicLink())throw Object.assign(new Error('PACKAGE_SYMLINK_REJECTED'),{code:'PACKAGE_SYMLINK_REJECTED'});
    if(index<parts.length-1&&!stat.isDirectory())throw Object.assign(new Error('PACKAGE_PATH_INVALID'),{code:'PACKAGE_PATH_INVALID'});
    if(index===parts.length-1&&(directory?!stat.isDirectory():!stat.isFile()))throw Object.assign(new Error('PACKAGE_PATH_INVALID'),{code:'PACKAGE_PATH_INVALID'});
  }
}
async function locatePackageManifest(packageRoot, manifestRoot, manifestRelativePath){
  await assertNoSymlinkPath(packageRoot,{directory:true});
  if (manifestRoot) {
    const relativePath=validateRelativePath(manifestRelativePath??'package.json');
    await assertNoSymlinkPath(manifestRoot,{directory:true});
    const candidate=join(manifestRoot,relativePath);await assertNoSymlinkPath(candidate);
    return {root:manifestRoot,relativePath,absolutePath:candidate};
  }
  const studio=join(packageRoot,'tools/generate-art/studio');
  try{await assertNoSymlinkPath(studio,{directory:true});}
  catch(error){if(error.code==='ENOENT')throw Object.assign(new Error('PACKAGE_NAMESPACE_INVALID'),{code:'PACKAGE_NAMESPACE_INVALID'});throw error;}
  const entries=await readdir(studio,{withFileTypes:true}),paths=[];
  for(const entry of entries){
    if(entry.isSymbolicLink())throw Object.assign(new Error('PACKAGE_SYMLINK_REJECTED'),{code:'PACKAGE_SYMLINK_REJECTED'});
    if(!entry.isDirectory())continue;
    const candidate=join(studio,entry.name,'package.json');
    try{const item=await lstat(candidate);if(item.isSymbolicLink()||!item.isFile())throw Object.assign(new Error('PACKAGE_MANIFEST_INVALID'),{code:'PACKAGE_MANIFEST_INVALID'});paths.push(candidate);}catch(error){if(error.code!=='ENOENT')throw error;}
  }
  if(paths.length!==1)throw Object.assign(new Error(paths.length?'MULTIPLE_PACKAGE_MANIFESTS':'PACKAGE_MANIFEST_MISSING'),{code:paths.length?'MULTIPLE_PACKAGE_MANIFESTS':'PACKAGE_MANIFEST_MISSING'});
  return {root:packageRoot,relativePath:relative(packageRoot,paths[0]),absolutePath:paths[0]};
}
async function runtimeManifestEntry(update,packageRecord){
  const row=update.manifestEntry??update;
  if(typeof row.src==='string'&&row.sha256)return row;
  const frames=row.cells??row.frames??[];
  const trial=packageRecord.manifest.trials?.find(item=>item.clip===update.clip&&item.direction===update.direction&&item.disposition==='accepted');
  const promptPath=trial?.promptPath??row.promptPath;
  const prompt=promptPath?await readFile(join(packageRecord.packageRoot,promptPath),'utf8'):undefined;
  const provenance={...(row.provenance??{}),
    promptPath:trial?.promptPath,promptSha256:trial?.promptSha256,
    generationId:trial?.generationId,generatedAt:trial?.generatedAt,
    rawSourcePath:trial?.rawSourcePath,rawSourceSha256:trial?.rawSourceSha256,
    sourcePath:row.sourcePath,sourceSha256:row.sourceSha256,
    layoutPath:row.layoutPath,layoutSha256:row.layoutSha256,
    trackPath:row.trackPath,trackSha256:row.trackSha256,
    reviewer:trial?.reviewer,cleanupLineage:trial?.cleanupLineage,
    packageId:packageRecord.packageId,
  };
  if(prompt!==undefined)provenance.prompt=prompt;
  return {
    src:`./${update.assetPath}`,columns:row.columns??frames.length,rows:row.rows??1,
    frames,sha256:update.assetSha256,source:'imagegen',provenance,reviewed:true,
    ...(Number.isFinite(row.baselineY)?{baselineY:row.baselineY}:{}),
  };
}
async function packageBytes(packageRoot,manifest,limits){
  const inventory=manifest.files??manifest.fileInventory??[];
  if(!Array.isArray(inventory))throw Object.assign(new Error('INVALID_FILE_INVENTORY'),{code:'INVALID_FILE_INVENTORY'});
  let bytes=0;
  for(const row of inventory){
    try{validateRelativePath(row.path);}catch{throw Object.assign(new Error('UNSAFE_PACKAGE_PATH'),{code:'UNSAFE_PACKAGE_PATH'});}
    if(!SHA.test(row.sha256??''))throw Object.assign(new Error('INVALID_FILE_HASH'),{code:'INVALID_FILE_HASH'});
    const content=await readFile(join(packageRoot,row.path));
    if(content.length>limits.maxInputFileBytes)throw Object.assign(new Error('INPUT_FILE_LIMIT'),{code:'INPUT_FILE_LIMIT'});
    if(hash(content)!==row.sha256)throw Object.assign(new Error('PACKAGE_FILE_HASH_MISMATCH'),{code:'PACKAGE_FILE_HASH_MISMATCH'});
    bytes+=content.length;
  }
  if(Number.isFinite(manifest.totalBytes)&&manifest.totalBytes!==bytes)throw Object.assign(new Error('PACKAGE_BYTE_COUNT_MISMATCH'),{code:'PACKAGE_BYTE_COUNT_MISMATCH'});
  if(bytes>limits.maxPackageBytes)throw Object.assign(new Error('PACKAGE_BYTE_LIMIT'),{code:'PACKAGE_BYTE_LIMIT'});
  return bytes;
}
async function defaultValidatePackage(options){
  const {validatePackage}=await import('./validate-package.mjs');
  return validatePackage(options);
}
async function createStage({baseRoot,baseCommit,out,batchId}){
  await mkdir(out,{recursive:true});
  if((await stat(baseRoot)).dev!==(await stat(out)).dev)throw Object.assign(new Error('STAGING_DEVICE_MISMATCH'),{code:'STAGING_DEVICE_MISMATCH'});
  const stagingRoot=await mkdtemp(join(out,`captain-batch-${batchId.slice(0,12)}-`));
  const child=spawn('git',['ls-tree','-rz','-r','--full-tree',baseCommit],{cwd:baseRoot,stdio:['ignore','pipe','pipe']});
  const closed=new Promise((resolveClose,rejectClose)=>{child.once('error',rejectClose);child.once('close',resolveClose);});
  let pending='',stderr='',failure=null;
  child.stderr.setEncoding('utf8');child.stderr.on('data',chunk=>{stderr=(stderr+chunk).slice(-4096);});
  const createEntry=async record=>{
    const tab=record.indexOf('\t');if(tab<0)throw new Error('MALFORMED_BASE_TREE');
    const [mode,type]=record.slice(0,tab).split(' '),file=record.slice(tab+1);
    validateRelativePath(file);
    const source=join(baseRoot,file),target=join(stagingRoot,file);await mkdir(dirname(target),{recursive:true});
    if(type!=='blob')throw new Error('UNSUPPORTED_BASE_OBJECT');
    if(mode==='120000')await symlink(await readFile(source,'utf8'),target);
    else if(mode==='100644'||mode==='100755')await link(source,target);
    else throw new Error('UNSUPPORTED_BASE_MODE');
  };
  let tasks=[];
  child.stdout.setEncoding('utf8');
  try{
    for await(const chunk of child.stdout){
      pending+=chunk;let end;
      while((end=pending.indexOf('\0'))>=0){const record=pending.slice(0,end);pending=pending.slice(end+1);tasks.push(createEntry(record).catch(error=>{failure??=error;}));if(tasks.length>=32){await Promise.all(tasks);tasks=[];if(failure)throw failure;}}
    }
    if(pending)throw new Error('MALFORMED_BASE_TREE');
    await Promise.all(tasks);
    if(failure)throw failure;
    const exitCode=await closed;
    if(exitCode!==0)throw new Error(`GIT_LS_TREE_FAILED ${stderr}`);
    return stagingRoot;
  }catch(error){
    child.kill();await rm(stagingRoot,{recursive:true,force:true});
    throw Object.assign(new Error(error.message==='UNSUPPORTED_BASE_MODE'?'UNSUPPORTED_BASE_MODE':error.message==='MALFORMED_BASE_TREE'?'MALFORMED_BASE_TREE':'BASE_TREE_STAGING_FAILED'),{code:error.message==='UNSUPPORTED_BASE_MODE'?'UNSUPPORTED_BASE_MODE':error.message==='MALFORMED_BASE_TREE'?'MALFORMED_BASE_TREE':'BASE_TREE_STAGING_FAILED',cause:error});
  }
}
async function replaceFile(path,bytes){
  const temporary=`${path}.integrator-${process.pid}-${Math.random().toString(16).slice(2)}`;
  try{await writeFile(temporary,bytes);await rename(temporary,path);}catch(error){await rm(temporary,{force:true});throw error;}
}
async function readTrackRegistry(file){
  const module=await import(`${pathToFileURL(file).href}?batch=${hash(file).slice(0,12)}`);
  if(!module.athleteBallTracks||!module.athleteBallTrackProvenance)throw Object.assign(new Error('TRACK_REGISTRY_INVALID'),{code:'TRACK_REGISTRY_INVALID'});
  return {athleteBallTracks:JSON.parse(JSON.stringify(module.athleteBallTracks)),athleteBallTrackProvenance:JSON.parse(JSON.stringify(module.athleteBallTrackProvenance))};
}
async function applyUpdates({stagingRoot,updates,packages}){
  const manifestPath=join(stagingRoot,'public/assets/animation/manifest.json');
  const manifest=JSON.parse(await readFile(manifestPath,'utf8'));
  const trackRegistry=await readTrackRegistry(join(stagingRoot,'src/content/animation-ball-tracks.js'));
  const usedPaths=new Set();
  for(const pkg of packages){
    const packageManifestPath=`tools/generate-art/studio/${pkg.captainId}/package.json`;
    try{await access(join(stagingRoot,packageManifestPath));throw Object.assign(new Error('BASE_PACKAGE_OCCUPIED'),{code:'BASE_PACKAGE_OCCUPIED'});}catch(error){if(error.code!=='ENOENT')throw error;}
    const destination=join(stagingRoot,packageManifestPath);await mkdir(dirname(destination),{recursive:true});
    await writeFile(destination,`${canonicalJson(pkg.manifest)}\n`,'utf8');
    for(const file of pkg.manifest.files??pkg.manifest.fileInventory??[]){
      if(file.path===packageManifestPath)continue;
      try{validateRelativePath(file.path);}catch{throw Object.assign(new Error('UNSAFE_PACKAGE_PATH'),{code:'UNSAFE_PACKAGE_PATH'});}
      const scoped=file.path.startsWith(`tools/generate-art/studio/${pkg.captainId}/`);
      const isAssignedAtlas=pkg.updates.some(update=>update.assetPath===file.path);
      if(!scoped&&!isAssignedAtlas)throw Object.assign(new Error('CAPTAIN_SCOPE_VIOLATION'),{code:'CAPTAIN_SCOPE_VIOLATION'});
      const target=join(stagingRoot,file.path);
      try{await access(target);throw Object.assign(new Error('BASE_PATH_OCCUPIED'),{code:'BASE_PATH_OCCUPIED'});}catch(error){if(error.code!=='ENOENT')throw error;}
      await mkdir(dirname(target),{recursive:true});
      const bytes=await readFile(join(pkg.packageRoot,file.path));
      if(hash(bytes)!==file.sha256)throw Object.assign(new Error('PACKAGE_FILE_HASH_MISMATCH'),{code:'PACKAGE_FILE_HASH_MISMATCH'});
      if(file.path!==pkg.updates.find(update=>update.assetPath===file.path)?.assetPath)await writeFile(target,bytes);
    }
  }
  for(const update of updates){
    const pathKey=update.assetPath.normalize('NFC').toLowerCase();
    if(usedPaths.has(pathKey))throw Object.assign(new Error('DUPLICATE_ASSET_PATH'),{code:'DUPLICATE_ASSET_PATH'});
    usedPaths.add(pathKey);
    const output=join(stagingRoot,update.assetPath);
    await mkdir(dirname(output),{recursive:true});
    const bytes=await readFile(join(update.packageRoot,update.assetPath));
    if(hash(bytes)!==update.assetSha256)throw Object.assign(new Error('PACKAGE_FILE_HASH_MISMATCH'),{code:'PACKAGE_FILE_HASH_MISMATCH'});
    try{await access(output);throw Object.assign(new Error('BASE_ASSET_OCCUPIED'),{code:'BASE_ASSET_OCCUPIED'});}catch(error){if(error.code!=='ENOENT')throw error;}
    await writeFile(output,bytes);
    const character=manifest.characters[update.captainId];
    if(!character)throw Object.assign(new Error('CAPTAIN_NOT_IN_BASE'),{code:'CAPTAIN_NOT_IN_BASE'});
    character.directions??={};character.directions[update.direction]??={};
    if(character.directions[update.direction][update.clip])throw Object.assign(new Error('ACCEPTED_ART_REPLACEMENT'),{code:'ACCEPTED_ART_REPLACEMENT'});
    const sourcePackage=packages.find(candidate=>candidate.captainId===update.captainId&&candidate.packageId===update.packageId);
    character.directions[update.direction][update.clip]=await runtimeManifestEntry(update,sourcePackage??{manifest:{},packageId:update.packageId,packageRoot:update.packageRoot});
  }
  const clipTracks=new Map();
  for(const update of updates){
    const key=`${update.captainId}\0${update.clip}`,serialized=canonicalJson(update.track);
    if(clipTracks.has(key)&&clipTracks.get(key).serialized!==serialized)throw Object.assign(new Error('DIRECTION_TRACK_MISMATCH'),{code:'DIRECTION_TRACK_MISMATCH'});
    if(!clipTracks.has(key))clipTracks.set(key,{serialized,update});
  }
  for(const [key,{update}] of clipTracks){
    const [captainId,clip]=key.split('\0');trackRegistry.athleteBallTracks[captainId]??={};
    const existing=trackRegistry.athleteBallTracks[captainId][clip];
    if(existing&&canonicalJson(existing)!==canonicalJson(update.track))throw Object.assign(new Error('TRACK_ALREADY_EXISTS'),{code:'TRACK_ALREADY_EXISTS'});
    if(!existing)trackRegistry.athleteBallTracks[captainId][clip]=update.track;
    trackRegistry.athleteBallTrackProvenance[captainId]??={};
    if(!trackRegistry.athleteBallTrackProvenance[captainId][clip])trackRegistry.athleteBallTrackProvenance[captainId][clip]=update.trackProvenance??{classification:'captain-package',packageId:update.packageId,trackPath:update.trackPath,trackSha256:update.trackSha256};
  }
  await replaceFile(manifestPath,`${canonicalJson(manifest)}\n`);
  const canonicalManifest=canonicalJson(manifest);
  await replaceFile(join(stagingRoot,'src/content/animation-assets.js'),`// Generated by tools/register-animation-atlas.mjs from the production manifest.\nexport const animationAssetManifest = ${canonicalManifest};\n`);
  await writeBallTrackRegistry(trackRegistry,join(stagingRoot,'src/content/animation-ball-tracks.js'));
}
function hashTree(root){
  execFileSync('git',['init','-q'],{cwd:root,stdio:'ignore'});
  execFileSync('git',['config','user.name','Captain Studio Integrator'],{cwd:root,stdio:'ignore'});
  execFileSync('git',['config','user.email','captain-studio-integrator@example.invalid'],{cwd:root,stdio:'ignore'});
  execFileSync('git',['add','-A'],{cwd:root,stdio:'ignore'});
  return execFileSync('git',['write-tree'],{cwd:root,encoding:'utf8'}).trim();
}
function batchIdentity({baseCommit,packageIds,config}){
  const record={domain:'captain-studio-integration-v1',baseCommit,packageIds:[...packageIds].sort(),integratorVersion:config.integratorVersion,schemaVersion:config.schemaVersion,registryGeneratorVersion:config.registryGeneratorVersion,strictAuditConfig:config.strictAuditConfig,baselineFindingSetHashes:config.baselineFindingSetHashes,mirrorPolicyHash:config.mirrorPolicyHash,resourcePolicyHash:config.resourcePolicyHash,resourceLimits:config.resourceLimits};
  return hash(canonicalJson(record));
}
function auditCompare(baseline,current,captains){
  let comparison;
  try{comparison=compareAudits(baseline,current);}catch{return {ok:false,errors:[issue('MALFORMED_AUDIT')]};}
  const errors=[];
  if(comparison.added.length)errors.push(issue('NEW_AUDIT_FINDING',{count:comparison.added.length}));
  if(comparison.shortfalls.added.length)errors.push(issue('NEW_FRAME_SHORTFALL',{count:comparison.shortfalls.added.length}));
  if(comparison.missingIncrease>0)errors.push(issue('MISSING_ASSIGNMENT_INCREASE',{count:comparison.missingIncrease}));
  const remaining=current.errors.filter(row=>row.code==='missing-clip'&&captains.includes(row.athlete));
  if(remaining.length)errors.push(issue('CAPTAIN_GAPS_REMAIN',{count:remaining.length}));
  return {ok:errors.length===0,comparison,errors};
}
async function defaultAuditRunner({root}){
  const temp=await mkdtemp(join(tmpdir(),'captain-strict-audit-'));
  const json=join(temp,'audit.json'),markdown=join(temp,'audit.md');
  try{
    execFileSync('node',['tools/audit-animation-assets.mjs','--report-only','--json',json,'--markdown',markdown],{cwd:root,stdio:'ignore'});
    return JSON.parse(await readFile(json,'utf8'));
  }finally{await rm(temp,{recursive:true,force:true});}
}

/** Validate and stage one same-base batch. This function does not move refs. */
export async function integrateCaptainBatch(options){
  const {baseRoot,baseCommit,packageRoots,outputRoot,baseline,auditRunner=defaultAuditRunner,validatePackageImpl,resourceLimits={}}=options;
  const config=options.config??options;
  if(!config.resourceLimits&&Object.keys(resourceLimits).length)config.resourceLimits=resourceLimits;
  const limits=config.resourceLimits??{};
  let paths;
  try{paths=validateBatchInputs({baseRoot,baseCommit,outputRoot,packageRoots,config});}
  catch(error){return {ok:false,baseCommit,acceptedPackages:[],rejectedPackages:[],rejectionCodes:[error.code??'INVALID_BATCH_INPUT'],errors:[issue(error.code??'INVALID_BATCH_INPUT')],stagingRoot:null,treeSha:null};}
  if(packageRoots.length>limits.maxBatchPackages)return {ok:false,baseCommit,acceptedPackages:[],rejectedPackages:[],rejectionCodes:['BATCH_PACKAGE_LIMIT'],errors:[issue('BATCH_PACKAGE_LIMIT')],stagingRoot:null,treeSha:null};
  const validate=validatePackageImpl??defaultValidatePackage;
  const descriptors=packageRoots.map(value=>typeof value==='string'?{packageRoot:resolve(value)}:{...value,packageRoot:resolve(value.packageRoot),...(value.manifestRoot?{manifestRoot:resolve(value.manifestRoot)}:{})});
  const sortedRoots=[...new Map(descriptors.map(row=>[`${row.packageRoot}\0${row.manifestRoot??''}\0${row.manifestRelativePath??''}`,row])).values()].sort((a,b)=>a.packageRoot.localeCompare(b.packageRoot)||String(a.manifestRoot??'').localeCompare(String(b.manifestRoot??'')));
  const validCandidates=[],rejectedPackages=[];
  let batchBytes=0;
  for(const descriptor of sortedRoots){
    const {packageRoot,manifestRoot,manifestRelativePath}=descriptor;
    let packageId='unknown',captainId='unknown';
    try{
      const located=await locatePackageManifest(packageRoot,manifestRoot,manifestRelativePath);
      const manifest=JSON.parse(await readFile(located.absolutePath,'utf8'));
      packageId=manifest.packageId??packageId;captainId=manifest.captainId??captainId;
      if(manifest.baseCommit!==baseCommit)throw Object.assign(new Error('STALE_PACKAGE_BASE'),{code:'STALE_PACKAGE_BASE'});
      const workerCommit=manifest.reviewRecord?.workerCommit;
      const assignment=(baseline?.captains??baseline?.audit?.captains)?.[captainId]?.missing;
      if(!Array.isArray(assignment)||!assignment.length)throw Object.assign(new Error('WORKER_ASSIGNMENT_BASELINE_MISSING'),{code:'WORKER_ASSIGNMENT_BASELINE_MISSING'});
      const collected=await collectCaptainContribution({repositoryRoot:packageRoot,baseCommit,workerCommit,captainId,assignment:{missing:assignment}});
      const declared=new Map((manifest.files??manifest.fileInventory??[]).map(row=>[row.path,row.sha256]));
      const actual=collected.files.filter(row=>row.disposition.kind!=='package-manifest');
      if(declared.size!==actual.length||actual.some(row=>declared.get(row.path)!==row.sha256))throw Object.assign(new Error('WORKER_HISTORY_INVENTORY_MISMATCH'),{code:'WORKER_HISTORY_INVENTORY_MISMATCH'});
      const bytes=await packageBytes(packageRoot,manifest,limits);batchBytes+=bytes;
      const result=await validate({packageRoot,manifestRoot:located.root,manifestRelativePath:located.relativePath,baseRoot:paths.root,baseCommit,baseline});
      if(!result?.ok){const codes=stableCodes(result?.errors??[]);rejectedPackages.push({captainId:result?.captainId??captainId,packageId:result?.packageId??packageId,reasonCodes:codes.length?codes:['PACKAGE_REJECTED'],rebaseAndReviewRequired:true});continue;}
      if(result.baseCommit&&result.baseCommit!==baseCommit)throw Object.assign(new Error('STALE_PACKAGE_BASE'),{code:'STALE_PACKAGE_BASE'});
      const inventory=new Map((manifest.files??manifest.fileInventory??[]).map(row=>[row.path,row.sha256]));
      for(const update of result.updates??[])if(inventory.get(update.assetPath)!==update.assetSha256||inventory.get(update.trackPath)!==update.trackSha256)throw Object.assign(new Error('UNDECLARED_UPDATE_INPUT'),{code:'UNDECLARED_UPDATE_INPUT'});
      if(result.packageId&&result.packageId!==manifest.packageId)throw Object.assign(new Error('PACKAGE_DIGEST_MISMATCH'),{code:'PACKAGE_DIGEST_MISMATCH'});
      validCandidates.push({packageRoot,manifest,manifestPath:located.absolutePath,manifestRoot:located.root,manifestRelativePath:located.relativePath,...result,packageId:result.packageId??packageId,captainId:result.captainId??captainId});
    }catch(error){
      rejectedPackages.push({captainId,packageId,reasonCodes:[error.code??'PACKAGE_VALIDATION_ERROR'],rebaseAndReviewRequired:true});
    }
  }
  if(batchBytes>limits.maxBatchBytes){
    const overLimit=validCandidates.map(item=>({captainId:item.captainId,packageId:item.packageId,reasonCodes:['BATCH_BYTE_LIMIT'],rebaseAndReviewRequired:true}));
    rejectedPackages.push(...overLimit);validCandidates.length=0;
  }
  const acceptedPackages=[];
  const seenCaptains=new Set(),seenPaths=new Set();
  for(const item of validCandidates.sort((a,b)=>a.captainId.localeCompare(b.captainId)||a.packageId.localeCompare(b.packageId))){
    let reason=null;
    if(seenCaptains.has(item.captainId))reason='DUPLICATE_CAPTAIN';
    const localPaths=new Set();
    for(const update of item.updates??[]){
      reason=reason??validateUpdateShape(update,item.captainId);
      if(!reason){const key=update.assetPath.normalize('NFC').toLowerCase();if(localPaths.has(key)||seenPaths.has(key))reason='DUPLICATE_ASSET_PATH';localPaths.add(key);}
    }
    if(reason){rejectedPackages.push({captainId:item.captainId,packageId:item.packageId,reasonCodes:[reason],rebaseAndReviewRequired:true});continue;}
    seenCaptains.add(item.captainId);for(const key of localPaths)seenPaths.add(key);
    acceptedPackages.push(item);
  }
  rejectedPackages.sort((a,b)=>a.captainId.localeCompare(b.captainId)||a.packageId.localeCompare(b.packageId));
  const batchId=batchIdentity({baseCommit,packageIds:acceptedPackages.map(row=>row.packageId),config});
  const activityRecord={batchId,baseCommit,packageIds:acceptedPackages.map(row=>row.packageId).sort(),rejectedPackages:rejectedPackages.map(({captainId,packageId,reasonCodes})=>({captainId,packageId,reasonCodes})).sort((a,b)=>a.captainId.localeCompare(b.captainId)||a.packageId.localeCompare(b.packageId))};
  if(!acceptedPackages.length){
    const reportBytes=renderIntegrationReport({...activityRecord,acceptedPackages:[],normalizedAuditHash:null});
    const sidecarLedgerBytes=renderIntegrationLedger(activityRecord);
    return {ok:false,batchId,baseCommit,acceptedPackages:[],rejectedPackages,rejectionCodes:stableCodes(rejectedPackages.flatMap(row=>row.reasonCodes)),errors:[],stagingRoot:null,treeSha:null,reportBytes,sidecarLedgerBytes};
  }
  if(!baseline?.audit)return {ok:false,batchId,baseCommit,acceptedPackages:[],rejectedPackages,rejectionCodes:['BASELINE_AUDIT_REQUIRED'],errors:[issue('BASELINE_AUDIT_REQUIRED')],stagingRoot:null,treeSha:null};
  let stagingRoot;
  try{
    stagingRoot=await createStage({baseRoot:paths.root,baseCommit,out:paths.out,batchId});
    const updates=acceptedPackages.flatMap(pkg=>(pkg.updates??[]).map(update=>({...update,captainId:pkg.captainId,packageId:pkg.packageId,packageRoot:pkg.packageRoot})));
    await applyUpdates({stagingRoot,updates,packages:acceptedPackages});
    const currentAudit=await auditRunner({root:stagingRoot,baseCommit,batchId,acceptedPackages,captains:acceptedPackages.map(row=>row.captainId)});
    const comparison=auditCompare(baseline.audit,currentAudit,acceptedPackages.map(row=>row.captainId));
    const normalizedAuditHash=comparison.comparison?.normalizedAuditHash??null;
    const report={batchId,baseCommit,acceptedPackages:acceptedPackages.map(({captainId,packageId})=>({captainId,packageId})),rejectedPackages,normalizedAuditHash,normalizedAuditReport:normalizeAudit(currentAudit),rejectionCodes:comparison.ok?[]:stableCodes(comparison.errors)};
    if(!comparison.ok){
      return {ok:false,...report,errors:comparison.errors,rejectionCodes:stableCodes(comparison.errors),stagingRoot,treeSha:null};
    }
    const inTreeReport=renderIntegrationReport(report);
    const inTreeReportPath=join(stagingRoot,'docs/animation-production/studio/integrations',batchId,'report.json');
    await mkdir(dirname(inTreeReportPath),{recursive:true});await writeFile(inTreeReportPath,inTreeReport,'utf8');
    const treeSha=hashTree(stagingRoot);
    const reportBytes=renderIntegrationReport({...report,treeSha});
    const sidecarLedgerBytes=renderIntegrationLedger({...activityRecord,treeSha,normalizedAuditHash});
    await writeFile(join(paths.out,`${batchId}.report.json`),reportBytes,'utf8');
    await writeFile(join(paths.out,`${batchId}.ledger.jsonl`),sidecarLedgerBytes,'utf8');
    return {ok:true,...report,stagingRoot,treeSha,reportBytes,sidecarLedgerBytes,acceptedPackages:report.acceptedPackages};
  }catch(error){
    return {ok:false,batchId,baseCommit,acceptedPackages:[],rejectedPackages,rejectionCodes:[error.code??'INTEGRATION_FAILED'],errors:[issue(error.code??'INTEGRATION_FAILED')],stagingRoot:stagingRoot??null,treeSha:null};
  }
}

/** Compare-and-swap promotion is intentionally separate from batch staging. */
export async function promoteIntegration({repositoryRoot,expectedRefSha,integrationCommit,targetRef,allowedTargetRefs=[]}){
  const fail=code=>{throw Object.assign(new Error(code),{code});};
  if(typeof repositoryRoot!=='string'||!COMMIT.test(expectedRefSha??'')||!COMMIT.test(integrationCommit??'')||typeof targetRef!=='string')fail('INVALID_PROMOTION_INPUT');
  if(targetRef==='refs/heads/main'||targetRef==='refs/heads/master'||targetRef.startsWith('refs/heads/release')||targetRef.startsWith('refs/tags/')||/deploy/i.test(targetRef))fail('PROTECTED_REF');
  if(!Array.isArray(allowedTargetRefs)||!allowedTargetRefs.includes(targetRef))fail('UNAPPROVED_REF');
  try{git(repositoryRoot,['cat-file','-e',`${integrationCommit}^{commit}`]);}catch{fail('INTEGRATION_COMMIT_MISSING');}
  let current;
  try{current=git(repositoryRoot,['rev-parse','--verify',targetRef]).trim();}
  catch{fail('PROMOTION_REF_MISSING');}
  if(current===integrationCommit)return {promoted:false,idempotent:true,ref:targetRef,sha:integrationCommit};
  if(current!==expectedRefSha)fail('STALE_REF');
  try{git(repositoryRoot,['update-ref',targetRef,integrationCommit,expectedRefSha]);}
  catch{fail('STALE_REF');}
  return {promoted:true,idempotent:false,ref:targetRef,sha:integrationCommit};
}
