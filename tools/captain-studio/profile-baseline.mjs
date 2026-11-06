import { lstat,readdir,statfs } from 'node:fs/promises';
import { join } from 'node:path';
const MiB=1024*1024;
function nonnegativeInteger(value,label) {
  if(!Number.isSafeInteger(value) || value<0) throw new TypeError(`Invalid ${label}`);
}
export async function measureWorkspaceBudget(path,reserveBytes) {
  nonnegativeInteger(reserveBytes,'reserve');
  const space=await statfs(path,{bigint:true});
  const available=space.bavail*space.bsize;
  if(available>BigInt(Number.MAX_SAFE_INTEGER)) throw new RangeError('Unsupported workspace capacity');
  return {availableBytes:Number(available),reserveBytes};
}
async function measure(root) {
  let files=0,bytes=0;
  async function visit(path) {
    const stat=await lstat(path);
    if(stat.isSymbolicLink()) throw new TypeError('Symlink in evidence bundle');
    if(stat.isDirectory()) {
      for(const name of (await readdir(path)).sort()) await visit(join(path,name));
    } else if(stat.isFile()) {
      if(stat.size>64*MiB) throw new RangeError('Evidence file exceeds 64 MiB input policy');
      files++;bytes+=stat.size;
      nonnegativeInteger(bytes,'bundle byte count');
    } else throw new TypeError('Nonregular evidence file');
  }
  if(!(await lstat(root)).isDirectory()) throw new TypeError('Bundle root must be a directory');
  await visit(root);
  if(files===0) throw new TypeError('Empty evidence bundle');
  return {files,bytes};
}
/** Measures only explicitly designated complete/reviewed baseline bundles. Does not write limits. */
export async function profileBaseline({captainBundles,availableBytes,reserveBytes}) {
  nonnegativeInteger(availableBytes,'available bytes');nonnegativeInteger(reserveBytes,'reserve bytes');
  if(!Array.isArray(captainBundles) || captainBundles.length===0 || availableBytes<=reserveBytes) throw new TypeError('Reviewed bundles and storage headroom required');
  const measurements=[],seen=new Set();
  for(const bundle of captainBundles) {
    if(!bundle || typeof bundle.captainId!=='string' || !bundle.captainId || seen.has(bundle.captainId) || bundle.complete!==true || bundle.review!=='accepted' || typeof bundle.root!=='string') throw new TypeError('Unique complete accepted captain bundle required');
    seen.add(bundle.captainId);
    measurements.push({captainId:bundle.captainId,...await measure(bundle.root)});
  }
  measurements.sort((a,b)=>a.captainId<b.captainId?-1:a.captainId>b.captainId?1:0);
  const maxPackageBytes=Math.ceil(Math.max(...measurements.map(row=>row.bytes))*1.25/MiB)*MiB;
  const maxPackageFiles=Math.ceil(Math.max(...measurements.map(row=>row.files))*1.25);
  const budget=availableBytes-reserveBytes;
  if(maxPackageBytes>budget) throw new RangeError('Insufficient workspace after reserve');
  return {measurements,workspace:{availableBytes,reserveBytes},limits:{maxBatchPackages:8,maxDecodedPixelsPerImage:64000000,maxInputFileBytes:64*MiB,maxPackageFiles,maxPackageBytes,maxBatchBytes:Math.min(budget,8*maxPackageBytes)}};
}
