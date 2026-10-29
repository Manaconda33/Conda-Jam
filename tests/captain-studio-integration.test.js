import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, stat as statFile, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { integrateCaptainBatch, promoteIntegration } from '../tools/captain-studio/integrate-batch.mjs';
import { renderIntegrationLedger, renderIntegrationReport } from '../tools/captain-studio/integration-report.mjs';

const commitId = n => String(n).repeat(40).slice(0,40);

async function repository(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'captain-integration-base-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  git('init', '-q'); git('config', 'user.name', 'Integration Fixture'); git('config', 'user.email', 'integration@example.invalid');
  const put = async (file, body) => { const target=path.join(root,file); await mkdir(path.dirname(target),{recursive:true}); await writeFile(target,body); };
  const manifest={version:1,characters:{'reef-captain':{directions:{right:{}}},'marsh-captain':{directions:{right:{}}}}};
  await put('README.md','base\n');
  await put('public/assets/animation/manifest.json',JSON.stringify(manifest)+'\n');
  await put('src/content/animation-assets.js',`export const animationAssetManifest = ${JSON.stringify(manifest)};\n`);
  await put('src/content/animation-ball-tracks.js','export const athleteBallTracks = {};\nexport const athleteBallTrackProvenance = {};\n');
  git('add','-A');git('commit','-qm','base');
  const sha=git('rev-parse','HEAD');
  return {root,git,put,base:sha};
}

const baselineAudit={generatedAt:'volatile',missingClipCount:2,errors:[
  {code:'missing-clip',athlete:'reef-captain',clip:'pass',direction:'right'},
  {code:'missing-clip',athlete:'marsh-captain',clip:'receive',direction:'left'},
  {code:'prompt-lineage',athlete:'reef-captain',message:'inherited finding'},
],targetShortfalls:[],captains:{'reef-captain':{missing:[{clip:'pass',direction:'right'}]},'marsh-captain':{missing:[{clip:'receive',direction:'left'}]}}};
const config={integratorVersion:'1',schemaVersion:1,registryGeneratorVersion:'1',strictAuditConfig:{mode:'strict'},baselineFindingSetHashes:{audit:'f'.repeat(64)},mirrorPolicyHash:'a'.repeat(64),resourcePolicyHash:'b'.repeat(64),resourceLimits:{maxBatchPackages:8,maxDecodedPixelsPerImage:64_000_000,maxInputFileBytes:64*1024*1024,maxPackageBytes:1024*1024,maxBatchBytes:8*1024*1024}};

async function packageFixture(t, root, captainId, packageId, clip, direction, assetPath, extraPath) {
  const packageRoot=await mkdtemp(path.join(os.tmpdir(),`captain-package-${captainId}-`));
  t.after(()=>rm(packageRoot,{recursive:true,force:true}));
  execFileSync('git',['clone','--quiet','--no-hardlinks',root.root,packageRoot],{stdio:'ignore'});
  const workerGit=(...args)=>execFileSync('git',args,{cwd:packageRoot,encoding:'utf8'}).trim();
  workerGit('config','user.name','Worker Fixture');workerGit('config','user.email','worker@example.invalid');
  const assetBytes=Buffer.from(`${captainId}/${clip}/${direction}`), asset=path.join(packageRoot,assetPath);await mkdir(path.dirname(asset),{recursive:true});await writeFile(asset,assetBytes);
  const trackPath=`tools/generate-art/studio/${captainId}/tracks/${clip}.json`,trackBytes=Buffer.from(JSON.stringify({height:[1],forward:[2]})),track=path.join(packageRoot,trackPath);await mkdir(path.dirname(track),{recursive:true});await writeFile(track,trackBytes);
  const files=[{path:assetPath,sha256:createHash('sha256').update(assetBytes).digest('hex')},{path:trackPath,sha256:createHash('sha256').update(trackBytes).digest('hex')}].sort((a,b)=>a.path.localeCompare(b.path));
  const manifestPath=path.join(packageRoot,'tools/generate-art/studio',captainId,'package.json');await mkdir(path.dirname(manifestPath),{recursive:true});
  await writeFile(manifestPath,JSON.stringify({captainId,packageId,baseCommit:root.base,files}));
  if(extraPath){const extra=path.join(packageRoot,extraPath);await mkdir(path.dirname(extra),{recursive:true});await writeFile(extra,'unlisted worker history change\n');}
  workerGit('add','-A');workerGit('commit','-qm','worker contribution');
  const workerCommit=workerGit('rev-parse','HEAD');
  const manifestRoot=await mkdtemp(path.join(os.tmpdir(),`captain-export-${captainId}-`));t.after(()=>rm(manifestRoot,{recursive:true,force:true}));
  await writeFile(path.join(manifestRoot,'package.json'),JSON.stringify({captainId,packageId,baseCommit:root.base,files,reviewRecord:{workerCommit}}));
  return {packageRoot,manifestRoot};
}

function validatorFor(results) { return async ({packageRoot}) => results.get(packageRoot); }
const valid = (captainId,packageId,clip,direction,assetPath) => {
  const assetSha256=createHash('sha256').update(`${captainId}/${clip}/${direction}`).digest('hex');
  const track={height:[1],forward:[2]},trackPath=`tools/generate-art/studio/${captainId}/tracks/${clip}.json`,trackSha256=createHash('sha256').update(JSON.stringify(track)).digest('hex');
  return {
  ok:true,captainId,packageId,totalBytes:16,errors:[],updates:[{
    clip,direction,assetPath,assetSha256,
    manifestEntry:{src:`./${assetPath}`,sha256:assetSha256,columns:1,rows:1,frames:[{x:0,y:0,w:8,h:8}],reviewed:true},
    trackPath,trackSha256,track,
  }]};
};

test('integrator stages valid packages only and produces identical trees in any input order', async t => {
  const base=await repository(t), output=await mkdtemp(path.join(os.tmpdir(),'captain-integration-output-'));
  t.after(()=>rm(output,{recursive:true,force:true}));
  const originalManifest=await readFile(path.join(base.root,'public/assets/animation/manifest.json'));
  const originalRegistry=await readFile(path.join(base.root,'src/content/animation-assets.js'));
  const a=await packageFixture(t,base,'reef-captain','2'.repeat(64),'pass','right','public/assets/animation/reef-captain-pass-right.webp');
  const b=await packageFixture(t,base,'marsh-captain','3'.repeat(64),'receive','left','public/assets/animation/marsh-captain-receive-left.png');
  const results=new Map([[a.packageRoot,valid('reef-captain','2'.repeat(64),'pass','right','public/assets/animation/reef-captain-pass-right.webp')],[b.packageRoot,valid('marsh-captain','3'.repeat(64),'receive','left','public/assets/animation/marsh-captain-receive-left.png')]]);
  const run=packages=>integrateCaptainBatch({baseRoot:base.root,baseCommit:base.base,packageRoots:packages,outputRoot:output,baseline:{audit:baselineAudit,dependencies:[]},auditRunner:async({captains})=>({...baselineAudit,generatedAt:new Date().toISOString(),missingClipCount:2-captains.length,errors:baselineAudit.errors.filter(row=>row.code!=='missing-clip'||!captains.includes(row.athlete))}),validatePackageImpl:validatorFor(results),...config});
  const first=await run([b,a]);
  process.env.TZ='Pacific/Honolulu';
  const second=await run([a,b]);
  assert.equal(first.ok,true,JSON.stringify(first));
  assert.deepEqual(first.acceptedPackages.map(row=>row.captainId),['marsh-captain','reef-captain']);
  assert.equal(first.treeSha,second.treeSha);
  assert.equal(first.batchId,second.batchId);
  assert.equal(first.reportBytes,second.reportBytes);
  assert.equal(first.sidecarLedgerBytes,second.sidecarLedgerBytes);
  assert.equal(base.git('rev-parse','HEAD'),base.base);
  assert.deepEqual(await readFile(path.join(base.root,'public/assets/animation/manifest.json')),originalManifest,'staged manifest writes must not mutate hardlinked base files');
  assert.deepEqual(await readFile(path.join(base.root,'src/content/animation-assets.js')),originalRegistry,'generated source replacement must leave base bytes intact');
  const [baseArtwork,stagedArtwork]=await Promise.all([statFile(path.join(base.root,'README.md')),statFile(path.join(first.stagingRoot,'README.md'))]);
  assert.equal(stagedArtwork.ino,baseArtwork.ino,'unchanged base files are hardlinked rather than duplicated');
  const stagedManifest=JSON.parse(await readFile(path.join(first.stagingRoot,'public/assets/animation/manifest.json'),'utf8'));
  assert.equal(stagedManifest.characters['reef-captain'].directions.right.pass.reviewed,true);
  assert.equal(stagedManifest.characters['marsh-captain'].directions.left.receive.reviewed,true);
  const report=JSON.parse(await readFile(path.join(first.stagingRoot,'docs/animation-production/studio/integrations',first.batchId,'report.json'),'utf8'));
  assert.ok(report.normalizedAuditReport.errors.some(row=>row.code==='prompt-lineage'));
  assert.equal(Object.hasOwn(report.normalizedAuditReport,'generatedAt'),false);
});

test('integrator rejects a valid-looking package when worker history includes an unlisted forbidden path', async t => {
  const base=await repository(t), output=await mkdtemp(path.join(os.tmpdir(),'captain-integration-history-'));
  t.after(()=>rm(output,{recursive:true,force:true}));
  const pkg=await packageFixture(t,base,'reef-captain','5'.repeat(64),'pass','right','public/assets/animation/reef-captain-pass-right.webp','README_secret.txt');
  let validatorCalled=false;
  const result=await integrateCaptainBatch({
    baseRoot:base.root,baseCommit:base.base,packageRoots:[pkg],outputRoot:output,
    baseline:{audit:baselineAudit,captains:baselineAudit.captains},
    validatePackageImpl:async()=>{validatorCalled=true;return valid('reef-captain','5'.repeat(64),'pass','right','public/assets/animation/reef-captain-pass-right.webp');},
    ...config,
  });
  assert.equal(validatorCalled,false,'history collection must run before package validation');
  assert.deepEqual(result.rejectedPackages[0].reasonCodes,['CAPTAIN_SCOPE_VIOLATION']);
});

test('a rejected package is isolated while valid packages integrate with a stable rework code', async t => {
  const base=await repository(t), output=await mkdtemp(path.join(os.tmpdir(),'captain-integration-subset-'));
  t.after(()=>rm(output,{recursive:true,force:true}));
  const a=await packageFixture(t,base,'reef-captain','2'.repeat(64),'pass','right','public/assets/animation/reef-captain-pass-right.webp');
  const b=await packageFixture(t,base,'marsh-captain','3'.repeat(64),'receive','left','public/assets/animation/marsh-captain-receive-left.png');
  const results=new Map([[a.packageRoot,valid('reef-captain','2'.repeat(64),'pass','right','public/assets/animation/reef-captain-pass-right.webp')],[b.packageRoot,{ok:false,captainId:'marsh-captain',packageId:'3'.repeat(64),errors:[{code:'ARTWORK_DIGEST_MISMATCH'}]}]]);
  const result=await integrateCaptainBatch({baseRoot:base.root,baseCommit:base.base,packageRoots:[b,a],outputRoot:output,baseline:{audit:baselineAudit,dependencies:[]},auditRunner:async()=>({...baselineAudit,missingClipCount:1,errors:baselineAudit.errors.filter(row=>row.athlete!=='reef-captain'||row.code!=='missing-clip')}),validatePackageImpl:validatorFor(results),...config});
  assert.equal(result.ok,true,JSON.stringify(result));
  assert.deepEqual(result.acceptedPackages.map(row=>row.captainId),['reef-captain']);
  assert.deepEqual(result.rejectedPackages,[{captainId:'marsh-captain',packageId:'3'.repeat(64),reasonCodes:['ARTWORK_DIGEST_MISMATCH'],rebaseAndReviewRequired:true}]);
  assert.equal(base.git('rev-parse','HEAD'),base.base);
});

test('integrator validates an immutable exported manifest against worker-root file contents', async t => {
  const base=await repository(t), output=await mkdtemp(path.join(os.tmpdir(),'captain-integration-export-'));
  t.after(()=>rm(output,{recursive:true,force:true}));
  const root=await packageFixture(t,base,'reef-captain','2'.repeat(64),'pass','right','public/assets/animation/reef-captain-pass-right.webp');
  const manifestRoot=root.manifestRoot;
  let received;
  const result=await integrateCaptainBatch({
    baseRoot:base.root,baseCommit:base.base,packageRoots:[{packageRoot:root.packageRoot,manifestRoot}],outputRoot:output,
    baseline:{audit:baselineAudit,dependencies:[]},
    auditRunner:async()=>({...baselineAudit,missingClipCount:1,errors:baselineAudit.errors.filter(row=>row.code!=='missing-clip'||row.athlete!=='reef-captain')}),
    validatePackageImpl:async options=>{received=options;return valid('reef-captain','2'.repeat(64),'pass','right','public/assets/animation/reef-captain-pass-right.webp');},
    ...config,
  });
  assert.equal(result.ok,true,JSON.stringify(result));
  assert.equal(received.packageRoot,root.packageRoot);
  assert.equal(received.manifestRoot,manifestRoot);
  assert.equal(received.manifestRelativePath,'package.json');
  const linkedRoot=path.join(manifestRoot,'linked-export-root');await symlink(manifestRoot,linkedRoot);t.after(()=>rm(linkedRoot,{recursive:true,force:true}));
  const rejected=await integrateCaptainBatch({
    baseRoot:base.root,baseCommit:base.base,packageRoots:[{packageRoot:root.packageRoot,manifestRoot:linkedRoot}],outputRoot:output,
    baseline:{audit:baselineAudit,dependencies:[]},validatePackageImpl:async()=>{throw new Error('must reject symlink before validation');},...config,
  });
  assert.ok(rejected.rejectedPackages[0].reasonCodes.includes('PACKAGE_SYMLINK_REJECTED'));
});

test('audit additions and duplicate captain ownership fail closed before a tree is returned', async t => {
  const base=await repository(t), output=await mkdtemp(path.join(os.tmpdir(),'captain-integration-reject-'));
  t.after(()=>rm(output,{recursive:true,force:true}));
  const a=await packageFixture(t,base,'reef-captain','2'.repeat(64),'pass','right','public/assets/animation/reef-captain-pass-right.webp');
  const good=valid('reef-captain','2'.repeat(64),'pass','right','public/assets/animation/reef-captain-pass-right.webp');
  const duplicate=valid('reef-captain','4'.repeat(64),'pass','right','public/assets/animation/reef-captain-pass-right.webp');
  const duplicateRoot=await packageFixture(t,base,'reef-captain','4'.repeat(64),'pass','right','public/assets/animation/reef-captain-pass-right.webp');
  const results=new Map([[a.packageRoot,good],[duplicateRoot.packageRoot,duplicate]]);
  const duplicateResult=await integrateCaptainBatch({baseRoot:base.root,baseCommit:base.base,packageRoots:[a,duplicateRoot],outputRoot:output,baseline:{audit:baselineAudit},auditRunner:async()=>baselineAudit,validatePackageImpl:validatorFor(results),...config});
  assert.deepEqual(duplicateResult.rejectedPackages.map(row=>row.reasonCodes),[['DUPLICATE_CAPTAIN']],JSON.stringify(duplicateResult));
  const addedError={code:'new-failure',athlete:'reef-captain'};
  const auditResult=await integrateCaptainBatch({baseRoot:base.root,baseCommit:base.base,packageRoots:[a],outputRoot:output,baseline:{audit:baselineAudit},auditRunner:async()=>({...baselineAudit,errors:[...baselineAudit.errors,addedError]}),validatePackageImpl:validatorFor(results),...config});
  assert.equal(auditResult.ok,false);
  assert.ok(auditResult.rejectionCodes.includes('NEW_AUDIT_FINDING'));
  assert.equal(base.git('rev-parse','HEAD'),base.base);
});

test('integration report and ledger canonicalize independent of clocks and event ordering', () => {
  const record={batchId:'a'.repeat(64),baseCommit:commitId(1),treeSha:'b'.repeat(40),acceptedPackages:[{captainId:'reef',packageId:'c'.repeat(64)}],rejectedPackages:[{captainId:'marsh',packageId:'d'.repeat(64),reasonCodes:['BAD_HASH'],rebaseAndReviewRequired:true}],normalizedAuditHash:'e'.repeat(64)};
  assert.equal(renderIntegrationReport(record),renderIntegrationReport({...record,recordedAt:new Date().toISOString()}));
  assert.equal(renderIntegrationLedger(record),renderIntegrationLedger({...record,rejectedPackages:[...record.rejectedPackages].reverse()}));
});

test('ref promotion uses compare-and-swap and rejects protected or unapproved refs', async t => {
  const base=await repository(t), old=base.base;
  const second=await base.put('second.txt','second\n');base.git('add','-A');base.git('commit','-qm','second');
  const next=base.git('rev-parse','HEAD');
  await assert.rejects(()=>promoteIntegration({repositoryRoot:base.root,expectedRefSha:old,integrationCommit:next,targetRef:'refs/heads/main',allowedTargetRefs:['refs/heads/main']}),e=>e.code==='PROTECTED_REF');
  await assert.rejects(()=>promoteIntegration({repositoryRoot:base.root,expectedRefSha:old,integrationCommit:next,targetRef:'refs/heads/feature/review',allowedTargetRefs:[]}),e=>e.code==='UNAPPROVED_REF');
  base.git('branch','review/integration',old);
  await promoteIntegration({repositoryRoot:base.root,expectedRefSha:old,integrationCommit:next,targetRef:'refs/heads/review/integration',allowedTargetRefs:['refs/heads/review/integration']});
  await promoteIntegration({repositoryRoot:base.root,expectedRefSha:old,integrationCommit:next,targetRef:'refs/heads/review/integration',allowedTargetRefs:['refs/heads/review/integration']});
  assert.equal(base.git('rev-parse','refs/heads/review/integration'),next);
});
