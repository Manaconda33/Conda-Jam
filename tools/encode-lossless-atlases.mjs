// Optional asset-authoring tool. Normal builds consume the committed derivatives.
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { decodeImage } from './animation-assets.mjs';
const root=new URL('../',import.meta.url),reportUrl=new URL('docs/LOSSLESS_ATLAS_PROVENANCE.json',root);
const report=JSON.parse(await readFile(reportUrl,'utf8'));
const verifyOnly=process.argv.includes('--verify-only');
for(const asset of report.assets){
  const original=fileURLToPath(new URL(asset.original,root)),derivative=fileURLToPath(new URL(asset.derivative,root));
  const before=await decodeImage(original);
  if(before.sha256!==asset.originalSha256)throw new Error(`Original changed: ${asset.original}`);
  if(!verifyOnly)execFileSync('convert',[original,'-define','webp:lossless=true','-define','webp:exact=true','-quality','100',derivative],{stdio:'inherit'});
  const after=await decodeImage(derivative);
  if(before.width!==after.width||before.height!==after.height||!before.pixels.equals(after.pixels))throw new Error(`RGBA mismatch: ${asset.derivative}`);
  if(verifyOnly&&after.sha256!==asset.derivativeSha256)throw new Error(`Derivative changed: ${asset.derivative}`);
  if(!verifyOnly){asset.derivativeSha256=after.sha256;asset.derivativeBytes=(await readFile(derivative)).length;}
  console.log(`Exact RGBA: ${asset.name}`);
}
if(!verifyOnly)await writeFile(reportUrl,JSON.stringify(report,null,2)+'\n');
