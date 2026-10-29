import { createHash } from 'node:crypto';
import { canonicalJson } from './canonical-json.mjs';
const digest = value => createHash('sha256').update(canonicalJson(value),'utf8').digest('hex');
export function validateRelativePath(path) {
  if (typeof path !== 'string' || !path || path.includes('\\') || path.includes('\0') || path.startsWith('/') || /^[A-Za-z]:/.test(path) || path.split('/').some(p => !p || p === '.' || p === '..')) throw new TypeError('Unsafe relative path');
  return path;
}
export function canonicalFileInventory(files) {
  if (!Array.isArray(files)) throw new TypeError('File inventory required');
  const seen = new Set();
  return files.map(file => {
    const path = validateRelativePath(file.path);
    const key = path.normalize('NFC').toLowerCase();
    if (seen.has(key)) throw new TypeError('Duplicate/colliding path');
    seen.add(key);
    if (!/^[a-f0-9]{64}$/.test(file.sha256)) throw new TypeError('Invalid SHA-256');
    return {path,sha256:file.sha256};
  }).sort((a,b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
}
export function computeArtworkDigest({artworkInventory}) {
  const {files,assignments,...metadata}=artworkInventory;
  if (!Array.isArray(assignments)) throw new TypeError('Assignments required');
  const seen=new Set();
  const sorted=assignments.map(assignment=>{
    if (typeof assignment.clip !== 'string' || !['left','right'].includes(assignment.direction)) throw new TypeError('Invalid assignment');
    const key=assignment.clip+'\0'+assignment.direction;
    if (seen.has(key)) throw new TypeError('Duplicate assignment');
    seen.add(key);return assignment;
  }).sort((a,b)=> { const x=a.clip+'\0'+a.direction,y=b.clip+'\0'+b.direction; return x<y?-1:x>y?1:0; });
  return digest({domain:'captain-artwork-v1',inventory:{...metadata,files:canonicalFileInventory(files),assignments:sorted}});
}
export function computeTrackDigest({trackInventory}) {
  return digest({domain:'captain-tracks-v1',inventory:trackInventory});
}
export function computePackageDigest({manifest,files}) {
  const {packageId: omitted,...payload} = manifest;
  return digest({domain:'captain-package-v1',manifest:payload,files:canonicalFileInventory(files)});
}
