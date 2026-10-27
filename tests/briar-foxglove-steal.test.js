import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {animationAssetManifest} from '../src/content/animation-assets.js';
import {animationClips,anchorTick,sampleAnimation,sampleBallHeight,sampleBallForward} from '../src/core/animation.js';
import {selectProductionSprite} from '../src/render/animation-sprites.js';

const athlete='briar-foxglove'; const atlas='./public/assets/animation/briar-foxglove-steal-right.png';
const src='../public/assets/animation/briar-foxglove-steal-right.png';
const clip=animationAssetManifest.characters[athlete].directions.right.steal;
const heights=[.9,.8,.5,.4,.65,.9,1.0,1.05],forward=[8,9,10,6,7,7,9,10];
const {PNG}=createRequire(import.meta.url)('pngjs');

test('Briar steal atlas and separate loose-ball track are registered and calibrated',()=>{
 assert.equal(clip.src,atlas); assert.equal(clip.reviewed,true); assert.equal(clip.provenance.issue,'J.133');
 assert.equal(clip.provenance.review.status,'accepted'); assert.equal(clip.provenance.ballTrack.status,'accepted-native-review');
 assert.equal(clip.provenance.ballTrack.grabFrame,3); assert.equal(clip.provenance.ballTrack.grabTick,5);
 assert.deepEqual(clip.provenance.ballTrack.height,heights); assert.deepEqual(clip.provenance.ballTrack.forward,forward);
 assert.equal(anchorTick('steal','grab'),5); assert.deepEqual(animationClips.steal.frames.map(f=>f.duration),[2,2,1,1,2,2,3,3]);
 const frameTicks=[0,2,4,5,6,8,10,13];
 assert.deepEqual(frameTicks.map(t=>sampleBallHeight('steal',t,athlete)),heights);
 assert.deepEqual(frameTicks.map(t=>sampleBallForward('steal',t,athlete)),forward);
 assert.notEqual(sampleBallForward('steal',5,athlete),sampleBallForward('steal',5,'nova-stitch'));
 const bytes=readFileSync(new URL(src,import.meta.url)); assert.equal(createHash('sha256').update(bytes).digest('hex'),clip.sha256);
 const png=PNG.sync.read(bytes); assert.equal(png.width,288); assert.equal(png.height,190); assert.equal(clip.frames.length,8);
 const images=new Map([[atlas,{complete:true,naturalWidth:288,naturalHeight:190,file:atlas}]]);let tick=0;
 for(let i=0;i<8;i++){
  assert.equal(sampleAnimation('steal',tick).frame,i);
  for(const [facing,flip] of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:athlete,facing,animation:{clip:'steal',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,i);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips.steal.frames[i].duration;
 }
 assert.equal(tick,16);
 for(const zoom of ['100','120']){
  const r=JSON.parse(readFileSync(new URL(`../tools/generate-art/previews/j133-briar-foxglove-steal/attempt-02/native-${zoom}/report.json`,import.meta.url)));
  assert.equal(r.previewCourtY,75);assert.equal(r.cameraZoom,Number(zoom));
  const caps=r.actionFramePreviews.filter(x=>x.athlete===athlete&&x.clip==='steal');assert.equal(caps.length,16);
  assert.ok(caps.every(x=>x.production&&x.selectedFrame===x.frame&&!x.hasBall&&x.ballMode==='loose'&&x.ballOwnerId===null));
 }
});
