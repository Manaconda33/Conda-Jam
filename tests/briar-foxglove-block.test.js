import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {animationAssetManifest} from '../src/content/animation-assets.js';
import {animationClips,sampleAnimation} from '../src/core/animation.js';
import {selectProductionSprite} from '../src/render/animation-sprites.js';

const athlete='briar-foxglove';
const clip=animationAssetManifest.characters[athlete].directions.right.block;
const atlas='./public/assets/animation/briar-foxglove-block-right.png';
const source='../public/assets/animation/briar-foxglove-block-right.png';
const require=createRequire(import.meta.url); const {PNG}=require('pngjs');

test('Briar block atlas preserves four reviewed poses with empty hands',()=>{
 assert.equal(clip.src,atlas); assert.equal(clip.reviewed,true);
 assert.equal(clip.provenance.issue,'J.132'); assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.candidateOnly,false); assert.match(clip.provenance.ballTrack,/none; defensive block/);
 assert.equal(clip.columns,2); assert.equal(clip.rows,2); assert.equal(clip.frames.length,4);
 assert.equal(new Set(clip.frames.map(f=>f.hash)).size,4);
 const bytes=readFileSync(new URL(source,import.meta.url));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),clip.sha256);
 const png=PNG.sync.read(bytes); assert.equal(png.width,144); assert.equal(png.height,190);
 for(let i=0;i<4;i++){
  const x=(i%2)*72,y=Math.floor(i/2)*95; const pts=[];
  for(let py=y;py<y+95;py++)for(let px=x;px<x+72;px++)if(png.data[(py*png.width+px)*4+3]>=16)pts.push([px-x,py-y]);
  assert.ok(pts.length>0); assert.ok(Math.min(...pts.map(p=>p[0]))>=6); assert.ok(Math.min(...pts.map(p=>p[1]))>=6);
  assert.ok(Math.max(...pts.map(p=>p[0]))<66); assert.ok(Math.max(...pts.map(p=>p[1]))<89);
 }
 const images=new Map([[atlas,{complete:true,naturalWidth:144,naturalHeight:190,file:atlas}]]);
 let tick=0;
 for(let i=0;i<4;i++){
  assert.equal(sampleAnimation('block',tick).frame,i);
  for(const [facing,flip] of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:athlete,facing,animation:{clip:'block',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas); assert.equal(sprite?.frame,i); assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips.block.frames[i].duration;
 }
 assert.deepEqual(animationClips.block.frames.map(f=>f.duration),[2,3,3,4]);
 assert.equal(tick,12);
 for(const zoom of ['100','120']){
  const report=JSON.parse(readFileSync(new URL(`../tools/generate-art/previews/j132-briar-foxglove-block/attempt-07/native-${zoom}/report.json`,import.meta.url)));
  assert.equal(report.previewCourtY,75); assert.equal(report.cameraZoom,Number(zoom));
  const captures=report.actionFramePreviews.filter(p=>p.athlete===athlete&&p.clip==='block'); assert.equal(captures.length,8);
  assert.ok(captures.every(p=>p.production&&p.selectedFrame===p.frame&&!p.hasBall&&p.ballOwnerId===null&&p.ballMode==='dead'));
 }
});
