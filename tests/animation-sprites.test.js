import test from 'node:test';
import assert from 'node:assert/strict';
import {athleteVisualScale,ballDrawDepth} from '../src/render/animation-sprites.js';
import {animationAssetManifest} from '../src/content/animation-assets.js';
import {animationClips} from '../src/core/animation.js';
test('Manaconda retains all29 reviewed production clips and293 distinct authored crops',()=>{
 const clips=animationAssetManifest.characters.manaconda.directions.right;
 assert.deepEqual(Object.keys(clips).sort(),Object.keys(animationClips).sort());let total=0;
 for(const [key,clip]of Object.entries(clips)){assert.equal(clip.reviewed,true,key);assert.equal(clip.frames.length,animationClips[key].frames.length,key);assert.equal(new Set(clip.frames.map(f=>f.hash)).size,clip.frames.length,key);total+=clip.frames.length;}
 assert.equal(total,293);
});
test('held balls remain visible in front of their carrier at every jump height',()=>{
 for(const z of [0,5,18]){const owner={id:'carrier',y:50,z};const depth=ballDrawDepth({mode:'carried',ownerId:owner.id,y:50},[owner]);assert.ok(depth>owner.y-owner.z*.05);assert.ok(depth<51);}
 assert.equal(ballDrawDepth({mode:'shot',y:50},[]),49.5);
 assert.equal(ballDrawDepth({mode:'carried',ownerId:'missing',y:50},[]),49.5);
});
test('a tiny kit fox keeps quadruped scale and athletes follow camera magnification',()=>{
 assert.equal(athleteVisualScale({rig:'quadruped-fox',height:'tall'}),.52);
 for(const athlete of [{rig:'quadruped-fox'},{height:'towering'},{height:'compact'},{height:'tall'}]){
  assert.ok(Math.abs(athleteVisualScale(athlete,120)-athleteVisualScale(athlete)*1.2)<1e-12);
  assert.ok(Math.abs(athleteVisualScale(athlete,85)-athleteVisualScale(athlete)*.85)<1e-12);
 }
});
const {selectProductionSprite,legacySpritePose}=await import('../src/render/animation-sprites.js').catch(()=>({selectProductionSprite:()=>null,legacySpritePose:()=>null}));
const src='./public/assets/animation/test.webp',image={complete:true,naturalWidth:110,naturalHeight:20};
function fixture(){return {manifest:{version:1,characters:{hero:{mirrorSafe:true,mirrorReview:{status:'reviewed',notes:'No directional markings'},directions:{right:{run:{src,reviewed:true,frames:Array.from({length:11},(_,i)=>({x:i*10,y:0,w:10,h:20}))}}}}}},images:new Map([[src,image]])};}
test('samples live simulation action and tick rather than the immutable roster entry',()=>{
 const player={id:'hero',anim:'run',facing:1,animation:{clip:'run',tick:2}};
 const sprite=selectProductionSprite(player,fixture());assert.ok(sprite,'live run frame should be selected');assert.equal(sprite.sx,10);assert.equal(sprite.sourceWidth,10);assert.equal(sprite.flip,false);
 player.animation.tick=20;assert.equal(selectProductionSprite(player,fixture()).sx,100);
});
test('explicit left art is used without reversing canonical asymmetry',()=>{
 const assets=fixture(),hero=assets.manifest.characters.hero;hero.mirrorSafe=false;hero.directions.left={run:{...hero.directions.right.run,frames:hero.directions.right.run.frames.map(frame=>({...frame,y:10,h:10}))}};
 const sprite=selectProductionSprite({id:'hero',facing:-1,animation:{clip:'run',tick:2}},assets);assert.equal(sprite?.sy,10);assert.equal(sprite?.flip,false);
 delete hero.directions.left;assert.equal(selectProductionSprite({id:'hero',facing:-1,animation:{clip:'run',tick:2}},assets),null);
});
test('E. Indigo uses distinct reviewed atlases for both facings without mirroring',()=>{
 const character=animationAssetManifest.characters['e-indigo'];
 assert.equal(character.mirrorSafe,false);assert.equal(character.mirrorReview.status,'reviewed');
 const clips=['idle','idle-ball','dribble','run','dribble-run'];
 for(const clip of clips){
  const right=character.directions.right[clip],left=character.directions.left[clip];
  assert.equal(right.reviewed,true,'right '+clip);assert.equal(left.reviewed,true,'left '+clip);
  assert.notEqual(right.src,left.src,clip+' must use independently authored direction art');
  const images=new Map([[right.src,{complete:true,naturalWidth:right.columns*96,naturalHeight:right.rows*96,file:right.src}],[left.src,{complete:true,naturalWidth:left.columns*96,naturalHeight:left.rows*96,file:left.src}]]);
  const makePlayer=facing=>({id:'e-indigo',facing,animation:{clip,tick:4}});
  const rightSprite=selectProductionSprite(makePlayer(1),{manifest:animationAssetManifest,images});
  const leftSprite=selectProductionSprite(makePlayer(-1),{manifest:animationAssetManifest,images});
  assert.equal(rightSprite?.atlas.file,right.src);assert.equal(rightSprite?.flip,false);
  assert.equal(leftSprite?.atlas.file,left.src);assert.equal(leftSprite?.flip,false);
 }
});
test('GB Design uses complete independently authored jaguar locomotion in both directions',()=>{
 const character=animationAssetManifest.characters['gb-design'];
 assert.equal(character.mirrorSafe,false);assert.equal(character.mirrorReview.status,'reviewed');
 for(const key of ['idle','idle-ball','dribble','run','dribble-run']){
  const right=character.directions.right[key],left=character.directions.left[key];
  assert.equal(right.reviewed,true,'right '+key);assert.equal(left.reviewed,true,'left '+key);
  assert.notEqual(right.src,left.src,key+' must keep the Union Jack correctly oriented');
  assert.equal(new Set(right.frames.map(frame=>frame.hash)).size,right.frames.length,'right '+key+' has distinct poses');
  assert.equal(new Set(left.frames.map(frame=>frame.hash)).size,left.frames.length,'left '+key+' has distinct poses');
  assert.equal(right.provenance.review.status,'accepted');assert.equal(left.provenance.review.status,'accepted');
  for(const [direction,clip,facing] of [['right',right,1],['left',left,-1]]){
   const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
   const images=new Map([[clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src}]]);
   const sprite=selectProductionSprite({id:'gb-design',facing,animation:{clip:key,tick:4}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src,direction+' '+key+' source');assert.equal(sprite?.flip,false,direction+' '+key+' never mirrors');
  }
 }
});
test('Alexithymia uses 42 distinct reviewed noir poses and only approved mirroring',()=>{
 const character=animationAssetManifest.characters.alexithymia;
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(character.directions.left,undefined,'the canonically mirror-safe athlete uses one authored facing');
 const expected={idle:6,'idle-ball':4,dribble:10,run:11,'dribble-run':11};
 const images=new Map();
 for(const [key,count] of Object.entries(expected)){
  const clip=character.directions.right[key];
  assert.equal(clip.reviewed,true,key);assert.equal(clip.frames.length,count,key);
  assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,count,key+' contains distinct crops');
  assert.equal(clip.provenance.review.status,'accepted',key);
  const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
  images.set(clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src});
 }
 assert.equal(Object.values(expected).reduce((sum,count)=>sum+count,0),42);
 for(const [facing,flip] of [[1,false],[-1,true]]){
  for(const clip of Object.keys(expected)){
   const player={id:'alexithymia',facing,animation:{clip,tick:4}};
   const sprite=selectProductionSprite(player,{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,character.directions.right[clip].src,clip+' source');
   assert.equal(sprite?.flip,flip,clip+' facing');
  }
 }
});
test('6foot10 uses all42 reviewed orc locomotion poses and only approved mirroring',()=>{
 const character=animationAssetManifest.characters['6foot10'];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(character.directions.left,undefined,'the canonically mirror-safe orc uses one authored facing');
 const expected={idle:6,'idle-ball':4,dribble:10,run:11,'dribble-run':11},images=new Map();
 for(const [key,count] of Object.entries(expected)){
  const clip=character.directions.right[key];
  assert.equal(clip.reviewed,true,key);assert.equal(clip.frames.length,count,key);
  assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,count,key+' contains distinct crops');
  assert.equal(clip.provenance.review.status,'accepted',key);
  const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
  images.set(clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src});
 }
 assert.equal(Object.values(expected).reduce((sum,count)=>sum+count,0),42);
 for(const [facing,flip] of [[1,false],[-1,true]])for(const key of Object.keys(expected)){
  const sprite=selectProductionSprite({id:'6foot10',facing,animation:{clip:key,tick:4}},{manifest:animationAssetManifest,images});
  assert.equal(sprite?.atlas.file,character.directions.right[key].src,key+' source');
  assert.equal(sprite?.flip,flip,key+' facing');
 }
});
test('Avek uses complete metal-deity locomotion and canon-approved mirroring',()=>{
 const character=animationAssetManifest.characters.avek;
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 const expected={idle:6,'idle-ball':4,dribble:10,run:11,'dribble-run':11},images=new Map();
 for(const [key,count]of Object.entries(expected)){
  const clip=character.directions.right[key];assert.equal(clip.reviewed,true,key);assert.equal(clip.frames.length,count,key);
  assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,count,key+' contains distinct crops');
  assert.equal(clip.provenance.review.status,'accepted',key);
  const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
  images.set(clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src});
 }
 assert.equal(Object.values(expected).reduce((sum,count)=>sum+count,0),42);
 for(const [facing,flip]of [[1,false],[-1,true]])for(const clip of Object.keys(expected)){
  const sprite=selectProductionSprite({id:'avek',facing,animation:{clip,tick:4}},{manifest:animationAssetManifest,images});
  assert.equal(sprite?.atlas.file,character.directions.right[clip].src,clip+' source');assert.equal(sprite?.flip,flip,clip+' facing');
 }
});
test('Avek keeps his masked armor art in all42 locomotion poses and approved facings',()=>{
 const character=animationAssetManifest.characters.avek;
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(character.directions.left,undefined);
 const expected={idle:6,'idle-ball':4,dribble:10,run:11,'dribble-run':11},images=new Map();
 for(const [key,count] of Object.entries(expected)){
  const clip=character.directions.right[key];
  assert.equal(clip.reviewed,true,key);assert.equal(clip.frames.length,count,key);
  assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,count,key+' contains distinct poses');
  assert.equal(clip.provenance.review.status,'accepted',key);
  const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
  images.set(clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src});
 }
 assert.equal(Object.values(expected).reduce((sum,count)=>sum+count,0),42);
 for(const [facing,flip] of [[1,false],[-1,true]])for(const key of Object.keys(expected)){
  const sprite=selectProductionSprite({id:'avek',facing,animation:{clip:key,tick:4}},{manifest:animationAssetManifest,images});
  assert.equal(sprite?.atlas.file,character.directions.right[key].src,key+' source');
  assert.equal(sprite?.flip,flip,key+' facing');
 }
});
test('Jragena keeps her winged dark-purple athlete through all42 reviewed poses',()=>{
 const character=animationAssetManifest.characters.jragena;
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(character.directions.left,undefined);
 const expected={idle:6,'idle-ball':4,dribble:10,run:11,'dribble-run':11},images=new Map();
 for(const [key,count] of Object.entries(expected)){
  const clip=character.directions.right[key];
  assert.equal(clip.reviewed,true,key);assert.equal(clip.frames.length,count,key);
  assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,count,key+' contains distinct poses');
  assert.equal(clip.provenance.review.status,'accepted',key);
  const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
  images.set(clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src});
 }
 assert.equal(Object.values(expected).reduce((sum,count)=>sum+count,0),42);
 for(const [facing,flip] of [[1,false],[-1,true]])for(const key of Object.keys(expected)){
  const sprite=selectProductionSprite({id:'jragena',facing,animation:{clip:key,tick:4}},{manifest:animationAssetManifest,images});
  assert.equal(sprite?.atlas.file,character.directions.right[key].src,key+' source');
  assert.equal(sprite?.flip,flip,key+' facing');
 }
});
test('Pack Mama keeps her human wolf-hooded canon through 52 reviewed poses',()=>{
 const character=animationAssetManifest.characters['pack-mama'];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(character.directions.left,undefined);
 const expected={idle:6,'idle-ball':4,dribble:10,run:11,'dribble-run':11,shoot:10},images=new Map();
 for(const [key,count] of Object.entries(expected)){
  const clip=character.directions.right[key];
  assert.equal(clip.reviewed,true,key);assert.equal(clip.frames.length,count,key);
  assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,count,key+' contains distinct poses');
  assert.equal(clip.provenance.review.status,'accepted',key);
  assert.equal(clip.provenance.canonicalSection,'K.33',key);
  const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
  images.set(clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src});
 }
 assert.equal(Object.values(expected).reduce((sum,count)=>sum+count,0),52);
 for(const [facing,flip] of [[1,false],[-1,true]])for(const key of Object.keys(expected)){
  const sprite=selectProductionSprite({id:'pack-mama',facing,animation:{clip:key,tick:4}},{manifest:animationAssetManifest,images});
  assert.equal(sprite?.atlas.file,character.directions.right[key].src,key+' source');
  assert.equal(sprite?.flip,flip,key+' facing');
 }
});
test('Quirky keeps his orangutan-zebra hybrid anatomy through 52 reviewed poses',()=>{
 const character=animationAssetManifest.characters.quirky;
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(character.directions.left,undefined);
 const expected={idle:6,'idle-ball':4,dribble:10,run:11,'dribble-run':11,shoot:10},images=new Map();
 for(const [key,count] of Object.entries(expected)){
  const clip=character.directions.right[key];
  assert.equal(clip.reviewed,true,key);assert.equal(clip.frames.length,count,key);
  assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,count,key+' contains distinct poses');
  assert.equal(clip.provenance.review.status,'accepted',key);
  assert.equal(clip.provenance.canonicalSection,'K.34',key);
  const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
  images.set(clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src});
 }
 assert.equal(Object.values(expected).reduce((sum,count)=>sum+count,0),52);
 for(const [facing,flip] of [[1,false],[-1,true]])for(const key of Object.keys(expected)){
  const sprite=selectProductionSprite({id:'quirky',facing,animation:{clip:key,tick:4}},{manifest:animationAssetManifest,images});
  assert.equal(sprite?.atlas.file,character.directions.right[key].src,key+' source');
  assert.equal(sprite?.flip,flip,key+' facing');
 }
});
test('mirroring requires reviewed per-character permission and art must be loaded/reviewed',()=>{
 const assets=fixture(),player={id:'hero',facing:-1,animation:{clip:'run',tick:0}};
 assert.equal(selectProductionSprite(player,assets)?.flip,true);
 assets.manifest.characters.hero.mirrorReview.status='pending';assert.equal(selectProductionSprite(player,assets),null);
 assets.manifest.characters.hero.mirrorReview.status='reviewed';assets.images=new Map();assert.equal(selectProductionSprite(player,assets),null);
});
test('legacy animation uses simulation ticks, including dribble running and dunk variants',()=>{
 const pose=legacySpritePose({anim:'run',animation:{clip:'dribble-run',tick:12}});assert.ok(pose);assert.equal(pose.action,'run');assert.ok(pose.runFrame>0);
 assert.equal(legacySpritePose({animation:{clip:'dunk-windmill',tick:20}})?.action,'dunk');
 assert.equal(legacySpritePose({animation:{clip:'pass-overhead',tick:6}})?.action,'pass');
});
