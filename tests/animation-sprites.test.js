import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {athleteVisualScale,ballDrawDepth} from '../src/render/animation-sprites.js';
import {animationAssetManifest} from '../src/content/animation-assets.js';
import {animationMirrorPolicy} from '../src/content/animation-mirror-policy.js';
import {animationClips,anchorTick,sampleAnimation,sampleBallHeight,sampleBallForward} from '../src/core/animation.js';
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
for(const [id,section] of [['dragon-queen','K.27'],['dea','K.32'],['lula','K.35'],['avek','K.22'],['suga','K.28'],['jragena','K.31']])test(`${id} selects ten reviewed canon-specific shot poses in both directions`,()=>{
 const character=animationAssetManifest.characters[id],shot=character.directions.right.shoot;
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(character.directions.left,undefined);assert.equal(shot.reviewed,true);assert.equal(shot.frames.length,10);
 assert.equal(new Set(shot.frames.map(frame=>frame.hash)).size,10);
 assert.equal(shot.provenance.canonicalSection,section);assert.equal(shot.provenance.review.status,'accepted');
 const width=Math.max(...shot.frames.map(frame=>frame.x+frame.w)),height=Math.max(...shot.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[shot.src,{complete:true,naturalWidth:width,naturalHeight:height,file:shot.src}]]);
 for(const [facing,flip] of [[1,false],[-1,true]]){
  const sprite=selectProductionSprite({id,facing,animation:{clip:'shoot',tick:4}},{manifest:animationAssetManifest,images});
  assert.equal(sprite?.atlas.file,shot.src);assert.equal(sprite?.flip,flip);
 }
});
test('short reviewed atlases are sampled across every authored frame without dropping to fallback',()=>{
 const assets=fixture(),clip=assets.manifest.characters.hero.directions.right.run;
 clip.frames=clip.frames.slice(0,8);
 const player={id:'hero',facing:1,animation:{clip:'run',tick:20}};
 const sprite=selectProductionSprite(player,assets);
 assert.ok(sprite,'last simulation frame remains production-selected');
 assert.equal(sprite.sx,70,'the final authored pose is reached by the final simulation frame');
 player.animation.tick=8;
 assert.equal(selectProductionSprite(player,assets)?.sx,30,'intermediate poses are proportionally sampled');
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
test('Dorian Mycel and Luca Velori use reviewed canon-specific locomotion in both facings',()=>{
 const expectedCounts={
  'dorian-mycel':{idle:6,dribble:8,run:13,'dribble-run':8},
  'luca-velori':{idle:6,dribble:14,run:8,'dribble-run':14},
 };
 for(const [id,expected] of Object.entries(expectedCounts)){
  const character=animationAssetManifest.characters[id];
  assert.equal(character.mirrorSafe,true,id+' canon allows reviewed mirroring');
  assert.equal(character.mirrorReview.status,'reviewed',id+' mirror review');
  assert.equal(character.directions.right['idle-ball'],undefined,id+' uses fallback until a standing ball-ready clip is authored');
  const images=new Map();
  for(const [key,count] of Object.entries(expected)){
   const clip=character.directions.right[key];
   assert.equal(clip.reviewed,true,id+' '+key+' review');
   assert.equal(clip.frames.length,count,id+' '+key+' frame count');
   assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,count,id+' '+key+' distinct drawings');
   assert.equal(clip.provenance.review.status,'accepted',id+' '+key+' provenance');
   const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w));
   const height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
   images.set(clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src});
  }
  for(const [facing,flip] of [[1,false],[-1,true]]) for(const key of Object.keys(expected)){
   const clip=character.directions.right[key];
   const sprite=selectProductionSprite({id,facing,animation:{clip:key,tick:4}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src,id+' '+key+' facing '+facing+' selects production art');
   assert.equal(sprite?.flip,flip,id+' '+key+' facing '+facing+' flip');
  }
 }
});
test('Moss Granite and Thump Alder select all42 reviewed J.29 locomotion drawings in both facings',()=>{
 const expected={idle:6,'idle-ball':4,dribble:10,run:11,'dribble-run':11};
 for(const id of ['moss-granite','thump-alder']){
  const character=animationAssetManifest.characters[id];
  assert.equal(character?.mirrorSafe,true,id+' canon-approved mirror');
  assert.equal(character?.mirrorReview?.status,'reviewed',id+' mirror review');
  assert.equal(character?.directions?.left,undefined,id+' uses reviewed right-facing art with safe mirroring');
  assert.deepEqual(Object.keys(character?.directions?.right??{}).sort(),Object.keys(expected).sort(),id+' registers every locomotion action');
  const images=new Map();
  for(const [key,count] of Object.entries(expected)){
   const clip=character.directions.right[key];
   assert.equal(clip.reviewed,true,id+' '+key+' review');
   assert.equal(clip.frames.length,count,id+' '+key+' authored drawings');
   assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,count,id+' '+key+' distinct drawings');
   assert.equal(clip.provenance.canonicalSection,'J.29',id+' '+key+' canon provenance');
   assert.equal(clip.provenance.review.status,'accepted',id+' '+key+' visual review');
   const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w));
   const height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
   images.set(clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src});
  }
  for(const [facing,flip] of [[1,false],[-1,true]])for(const key of Object.keys(expected)){
   const clip=character.directions.right[key];
   const sprite=selectProductionSprite({id,facing,animation:{clip:key,tick:4}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src,id+' '+key+' selects reviewed production art');
   assert.equal(sprite?.flip,flip,id+' '+key+' facing policy');
  }
 }
});
test('Camden Union and Poppy Stitch select all42 reviewed J.30 locomotion drawings in both facings',()=>{
 const expected={idle:6,'idle-ball':4,dribble:10,run:11,'dribble-run':11};
 const identities={
  'camden-union':{cell:58,identity:['warm-tan adult human man','short dense dark navy-blue hair','cobalt headband']},
  'poppy-stitch':{cell:59,identity:['fair-warm adult human woman','long vivid red curls','navy headband']},
 };
 for(const [id,{cell,identity}] of Object.entries(identities)){
  const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id];
  assert.equal(character?.mirrorSafe,true,id+' canon-approved mirror');
  assert.equal(character?.mirrorReview?.status,'reviewed',id+' mirror review');
  assert.equal(policy?.sourceCell,cell,id+' uses the exact runtime reference cell');
  assert.equal(policy?.canonicalSection,'J.30');
  for(const marker of identity)assert.match(policy.mirrorReview.notes,new RegExp(marker,'i'),id+' preserves '+marker);
  assert.equal(character?.directions?.left,undefined,id+' uses reviewed right-facing art with safe mirroring');
  assert.deepEqual(Object.keys(character?.directions?.right??{}).sort(),Object.keys(expected).sort(),id+' registers every locomotion action');
  const images=new Map();
  for(const [key,count] of Object.entries(expected)){
   const clip=character.directions.right[key];
   assert.equal(clip.reviewed,true,id+' '+key+' review');
   assert.equal(clip.frames.length,count,id+' '+key+' authored drawings');
   assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,count,id+' '+key+' distinct drawings');
   assert.equal(clip.provenance.canonicalSection,'J.30',id+' '+key+' canon provenance');
   assert.equal(clip.provenance.review.status,'accepted',id+' '+key+' visual review');
   const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w));
   const height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
   images.set(clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src});
  }
  for(const [facing,flip] of [[1,false],[-1,true]])for(const key of Object.keys(expected)){
   const clip=character.directions.right[key];
   const sprite=selectProductionSprite({id,facing,animation:{clip:key,tick:4}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src,id+' '+key+' selects reviewed production art');
   assert.equal(sprite?.flip,flip,id+' '+key+' facing policy');
  }
 }
});
test('Draya Staffwind and Kael Rune select all42 reviewed J.31 locomotion drawings in both facings',()=>{
 const expected={idle:6,'idle-ball':4,dribble:10,run:11,'dribble-run':11};
 const identities={
  'draya-staffwind':{cell:60,identity:['warm medium-brown skin','chestnut-brown locs','high ponytail','athletic-curvy']},
  'kael-rune':{cell:61,identity:['warm medium-brown skin','navy-black curls','connected beard','compact muscular']},
 };
 for(const [id,{cell,identity}] of Object.entries(identities)){
  const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id];
  assert.equal(character?.mirrorSafe,true,id+' canon-approved mirror');
  assert.equal(character?.mirrorReview?.status,'reviewed',id+' mirror review');
  assert.equal(policy?.sourceCell,cell,id+' exact runtime reference cell');
  assert.equal(policy?.canonicalSection,'J.31');
  for(const marker of identity)assert.match(policy.mirrorReview.notes,new RegExp(marker,'i'),id+' preserves '+marker);
  assert.equal(character?.directions?.left,undefined,id+' uses safe reviewed mirroring');
  assert.deepEqual(Object.keys(character?.directions?.right??{}).sort(),Object.keys(expected).sort(),id+' registers all five actions');
  const images=new Map();
  for(const [key,count] of Object.entries(expected)){
   const clip=character.directions.right[key];
   assert.equal(clip.reviewed,true,id+' '+key+' review');
   assert.equal(clip.frames.length,count,id+' '+key+' authored poses');
   assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,count,id+' '+key+' distinct poses');
   assert.equal(clip.provenance.canonicalSection,'J.31',id+' '+key+' canon provenance');
   assert.equal(clip.provenance.review.status,'accepted',id+' '+key+' visual review');
   const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w));
   const height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
   images.set(clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src});
  }
  for(const [facing,flip] of [[1,false],[-1,true]])for(const key of Object.keys(expected)){
   const clip=character.directions.right[key];
   const sprite=selectProductionSprite({id,facing,animation:{clip:key,tick:4}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src,id+' '+key+' selects production art');
   assert.equal(sprite?.flip,flip,id+' '+key+' facing policy');
  }
 }
});
test('Lilt Smile and Violet Wink select all42 reviewed J.32 locomotion drawings in both facings',()=>{
 const expected={idle:6,'idle-ball':4,dribble:10,run:11,'dribble-run':11};
 const identities={
  'lilt-smile':{cell:62,identity:['vivid-magenta high ponytail','warm tie','tall human athletic']},
  'violet-wink':{cell:63,identity:['short dense lavender curls','compact human athletic-variant']},
 };
 for(const [id,{cell,identity}] of Object.entries(identities)){
  const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id];
  assert.equal(character?.mirrorSafe,true,id+' canon-approved mirror');
  assert.equal(character?.mirrorReview?.status,'reviewed',id+' mirror review');
  assert.equal(policy?.sourceCell,cell,id+' exact runtime reference cell');
  assert.equal(policy?.canonicalSection,'J.32');
  for(const marker of identity)assert.match(policy.mirrorReview.notes,new RegExp(marker,'i'),id+' preserves '+marker);
  assert.equal(character?.directions?.left,undefined,id+' uses reviewed right-facing art with safe mirroring');
  assert.deepEqual(Object.keys(character?.directions?.right??{}).sort(),Object.keys(expected).sort(),id+' registers all five actions');
  const poseMap=character.directions.right.idle.provenance.assembly.poseMap;
  if(id==='lilt-smile'){
   assert.equal(poseMap[5].sourcePose,6,'Lilt keeps six upright idle drawings');
   assert.deepEqual(poseMap[6],{poseIndex:6,clip:'idle-ball',source:'base',sourcePose:5},'Lilt maps the low open-hand stance into ball-ready');
  }
  const images=new Map();
  for(const [key,count] of Object.entries(expected)){
   const clip=character.directions.right[key];
   assert.equal(clip.reviewed,true,id+' '+key+' visual review');
   assert.equal(clip.frames.length,count,id+' '+key+' authored drawings');
   assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,count,id+' '+key+' distinct drawings');
   assert.equal(clip.provenance.canonicalSection,'J.32',id+' '+key+' canon provenance');
   assert.equal(clip.provenance.review.status,'accepted',id+' '+key+' accepted review');
   const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w));
   const height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
   images.set(clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src});
  }
  for(const [facing,flip] of [[1,false],[-1,true]])for(const key of Object.keys(expected)){
   const clip=character.directions.right[key];
   const sprite=selectProductionSprite({id,facing,animation:{clip:key,tick:4}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src,id+' '+key+' selects reviewed production art');
   assert.equal(sprite?.flip,flip,id+' '+key+' facing policy');
  }
 }
});
test('Fern Howl and Koa Vale select all42 reviewed J.33 locomotion drawings in both facings',()=>{
 const expected={idle:6,'idle-ball':4,dribble:10,run:11,'dribble-run':11};
 const identities={
  'fern-howl':{cell:64,identity:['fair warm skin','abundant teal curls','warm tie','tall natural human athletic']},
  'koa-vale':{cell:65,identity:['deep brown skin','close-cropped blue-black curls','compact natural human athletic']},
 };
 for(const [id,{cell,identity}] of Object.entries(identities)){
  const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id];
  assert.equal(character?.mirrorSafe,true,id+' canon-approved mirror');
  assert.equal(character?.mirrorReview?.status,'reviewed',id+' mirror review');
  assert.equal(policy?.sourceCell,cell,id+' exact runtime reference cell');
  assert.equal(policy?.canonicalSection,'J.33');
  for(const marker of identity)assert.match(policy.mirrorReview.notes,new RegExp(marker,'i'),id+' preserves '+marker);
  assert.equal(character?.directions?.left,undefined,id+' uses reviewed right-facing art with safe mirroring');
  assert.deepEqual(Object.keys(character?.directions?.right??{}).sort(),Object.keys(expected).sort(),id+' registers all five actions');
  const poseMap=character.directions.right.idle.provenance.assembly.poseMap;
  assert.deepEqual(poseMap[6],{poseIndex:6,clip:'idle-ball',source:'base',sourcePose:6},id+' uses the upright open-hand base pose');
  const mapped=poseMap.map(({source,sourcePose})=>`${source}:${sourcePose}`);
  assert.equal(new Set(mapped).size,42,id+' has42 unique source drawings');
  const images=new Map();
  for(const [key,count] of Object.entries(expected)){
   const clip=character.directions.right[key];
   assert.equal(clip.reviewed,true,id+' '+key+' visual review');
   assert.equal(clip.frames.length,count,id+' '+key+' authored drawings');
   assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,count,id+' '+key+' distinct drawings');
   assert.equal(clip.provenance.canonicalSection,'J.33',id+' '+key+' canon provenance');
   assert.equal(clip.provenance.review.status,'accepted',id+' '+key+' accepted review');
   const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w));
   const height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
   images.set(clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src});
  }
  for(const [facing,flip] of [[1,false],[-1,true]])for(const key of Object.keys(expected)){
   const clip=character.directions.right[key];
   const sprite=selectProductionSprite({id,facing,animation:{clip:key,tick:4}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src,id+' '+key+' selects reviewed production art');
   assert.equal(sprite?.flip,flip,id+' '+key+' facing policy');
  }
 }
});
test('Scribble Turner and Palette Spry select all42 reviewed J.34 locomotion drawings in both facings',()=>{
 const expected={idle:6,'idle-ball':4,dribble:10,run:11,'dribble-run':11};
 const identities={
  'scribble-turner':{cell:66,identity:['warm tan skin','very full dark-brown curls','tall natural human athletic']},
  'palette-spry':{cell:67,identity:['fair warm skin','blonde curls','high ponytail','compact natural human athletic']},
 };
 for(const [id,{cell,identity}] of Object.entries(identities)){
  const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id];
  assert.equal(character?.mirrorSafe,true,id+' canon-approved mirror');
  assert.equal(character?.mirrorReview?.status,'reviewed',id+' mirror review');
  assert.equal(policy?.sourceCell,cell,id+' exact runtime reference cell');
  assert.equal(policy?.canonicalSection,'J.34');
  for(const marker of identity)assert.match(policy.mirrorReview.notes,new RegExp(marker,'i'),id+' preserves '+marker);
  assert.equal(character?.directions?.left,undefined,id+' uses reviewed right-facing art with safe mirroring');
  assert.deepEqual(Object.keys(character?.directions?.right??{}).sort(),Object.keys(expected).sort(),id+' registers all five actions');
  const poseMap=character.directions.right.idle.provenance.assembly.poseMap;
  assert.deepEqual(poseMap[6],{poseIndex:6,clip:'idle-ball',source:'base',sourcePose:6},id+' keeps the upright open-hand base pose');
  const mapped=poseMap.map(({source,sourcePose})=>`${source}:${sourcePose}`);
  assert.equal(new Set(mapped).size,42,id+' has42 unique source drawings');
  const images=new Map();
  for(const [key,count] of Object.entries(expected)){
   const clip=character.directions.right[key];
   assert.equal(clip.reviewed,true,id+' '+key+' visual review');
   assert.equal(clip.frames.length,count,id+' '+key+' authored drawings');
   assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,count,id+' '+key+' distinct drawings');
   assert.equal(clip.provenance.canonicalSection,'J.34',id+' '+key+' canon provenance');
   assert.equal(clip.provenance.review.status,'accepted',id+' '+key+' accepted review');
   const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w));
   const height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
   images.set(clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src});
  }
  for(const [facing,flip] of [[1,false],[-1,true]])for(const key of Object.keys(expected)){
   const clip=character.directions.right[key];
   const sprite=selectProductionSprite({id,facing,animation:{clip:key,tick:4}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src,id+' '+key+' selects reviewed production art');
   assert.equal(sprite?.flip,flip,id+' '+key+' facing policy');
  }
 }
});
test('Sage Fletch and Hazel Bloom select all42 reviewed J.35 locomotion drawings in both facings',()=>{
 const expected={idle:6,'idle-ball':4,dribble:10,run:11,'dribble-run':11};
 const identities={
  'sage-fletch':{cell:68,identity:['warm tan skin','dark eyes','short dense olive-green curls','tall natural human athletic','forest-green/gold kit']},
  'hazel-bloom':{cell:69,identity:['light warm skin','dark eyes','abundant blonde curls','green/gold headwear','compact natural human athletic','forest-green/gold kit']},
 };
 for(const [id,{cell,identity}] of Object.entries(identities)){
  const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id];
  assert.equal(character?.mirrorSafe,true,id+' canon-approved mirror');
  assert.equal(character?.mirrorReview?.status,'reviewed',id+' mirror review');
  assert.equal(policy?.sourceCell,cell,id+' exact runtime reference cell');
  assert.equal(policy?.canonicalSection,'J.35');
  for(const marker of identity)assert.match(policy.mirrorReview.notes,new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),id+' preserves '+marker);
  assert.equal(character?.directions?.left,undefined,id+' uses reviewed right-facing art with safe mirroring');
  assert.deepEqual(Object.keys(character?.directions?.right??{}).sort(),Object.keys(expected).sort(),id+' registers all five actions');
  const provenance=character.directions.right.idle.provenance;
  assert.deepEqual(provenance.assembly.poseMap[6],{poseIndex:6,clip:'idle-ball',source:'base',sourcePose:6},id+' keeps the upright open-hand base pose');
  assert.equal(provenance.assembly.poseCount,42,id+' assembled42 poses');
  assert.equal(new Set(provenance.assembly.normalizedPoseSha256).size,42,id+' normalized drawings remain distinct');
  if(id==='sage-fletch')assert.ok(provenance.unselectedCandidates.some(candidate=>candidate.reason.includes('bounds overlapped')),id+' preserves the rejected overlapping supplement');
  const mapped=provenance.assembly.poseMap.map(({source,sourcePose})=>`${source}:${sourcePose}`);
  assert.equal(new Set(mapped).size,42,id+' maps42 unique source drawings');
  const images=new Map();
  for(const [key,count] of Object.entries(expected)){
   const clip=character.directions.right[key];
   assert.equal(clip.reviewed,true,id+' '+key+' visual review');
   assert.equal(clip.frames.length,count,id+' '+key+' authored drawings');
   assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,count,id+' '+key+' distinct drawings');
   assert.equal(clip.provenance.canonicalSection,'J.35',id+' '+key+' canon provenance');
   assert.equal(clip.provenance.review.status,'accepted',id+' '+key+' accepted review');
   const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w));
   const height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
   images.set(clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src});
  }
  for(const [facing,flip] of [[1,false],[-1,true]])for(const key of Object.keys(expected)){
   const clip=character.directions.right[key];
   const sprite=selectProductionSprite({id,facing,animation:{clip:key,tick:4}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src,id+' '+key+' selects reviewed production art');
   assert.equal(sprite?.flip,flip,id+' '+key+' facing policy');
  }
 }
});
test('Reed Ashcroft and Juniper Vale select six reviewed standard-pass poses with canon-safe mirroring',()=>{
 const expected={
  'reed-ashcroft':{cell:0,sha:'899ecb696c14b5407e66859d1698d037b4dafec79545a6e0c7129e1be139da3a'},
  'juniper-vale':{cell:1,sha:'37d0b5cdbc55085872c3b0007bd300d1716660822a6007f33ae702e2ffa5b764'},
 };
 for(const [id,{cell,sha}] of Object.entries(expected)){
  const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.pass;
  assert.equal(character?.mirrorSafe,true,id+' mirror-safe policy');
  assert.equal(character?.mirrorReview?.status,'reviewed',id+' canon mirror review');
  assert.equal(policy?.sourceCell,cell,id+' uses its exact supporting reference cell');
  assert.equal(policy?.canonicalSection,'J.01');
  assert.equal(character?.directions?.left,undefined,id+' uses right-facing source with reviewed safe mirroring');
  assert.ok(clip,id+' standard pass registration');
  assert.equal(clip.reviewed,true,id+' atlas visual review');
  assert.equal(clip.frames.length,6,id+' exactly six authored frames');
  assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,6,id+' six unique decoded frame hashes');
  assert.equal(clip.provenance.sourceSha256,sha,id+' accepted source hash');
  assert.equal(clip.provenance.componentIsolation,true,id+' records component-only isolation');
  assert.equal(clip.provenance.review.status,'accepted',id+' accepted source review');
  assert.equal(clip.provenance.sourceRects.length,6,id+' records all source crops');
  assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),[0,1,2,3,4,5],id+' maps six poses in row-major order');
  const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
  const images=new Map([[clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src}]]);
  let tick=0;
  for(let frame=0;frame<6;frame++){
   for(const [facing,flip] of [[1,false],[-1,true]]){
    const sprite=selectProductionSprite({id,facing,animation:{clip:'pass',tick}},{manifest:animationAssetManifest,images});
    assert.equal(sprite?.atlas.file,clip.src,id+' frame'+frame+' production source');
    assert.equal(sprite?.frame,frame,id+' frame'+frame+' pose map');
    assert.equal(sprite?.flip,flip,id+' frame'+frame+' facing');
   }
   tick+=animationClips.pass.frames[frame].duration;
  }
 }
});
test('Reed Ashcroft and Juniper Vale select six reviewed overhead-pass poses in both facings',()=>{
 const expected={
  'reed-ashcroft':{cell:0,sha:'5d79b9e21e92ecbfcd01c52b172e2b5edea54bd816fb675edcfe266cbad7223a',claim:'urn:c2pa:8824cde9-9672-4ef1-95c6-5df8b69d322b'},
  'juniper-vale':{cell:1,sha:'f4c63e9c1eb7efb6f63132e860fbd1770278efae50436b75bac8474d8a41f61c',claim:'urn:c2pa:04a84ded-b735-4d59-b786-879d38d7ad2f'},
 };
 for(const [id,{cell,sha,claim}] of Object.entries(expected)){
  const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.['pass-overhead'];
  assert.equal(character?.mirrorSafe,true,id+' canon-safe mirror policy');
  assert.equal(character?.mirrorReview?.status,'reviewed',id+' canon mirror review');
  assert.equal(policy?.sourceCell,cell,id+' uses the canonical supporting cell');
  assert.equal(character?.directions?.left,undefined,id+' uses reviewed body mirroring');
  assert.ok(clip,id+' overhead-pass registration');
  assert.equal(clip.reviewed,true,id+' atlas visual review');
  assert.equal(clip.frames.length,6,id+' six authored poses');
  assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,6,id+' six unique decoded frame hashes');
  assert.equal(clip.provenance.sourceSha256,sha,id+' accepted source hash');
  assert.equal(clip.provenance.sourceClaimId,claim,id+' C2PA source claim');
  assert.equal(clip.provenance.componentIsolation,true,id+' records component-only isolation');
  assert.equal(clip.provenance.review.status,'accepted',id+' accepted source review');
  assert.equal(clip.provenance.sourceRects.length,6,id+' records all six source crops');
  assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),[0,1,2,3,4,5],id+' maps poses in row-major order');
  const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
  const images=new Map([[clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src}]]);
  let tick=0;
  for(let frame=0;frame<6;frame++){
   for(const [facing,flip] of [[1,false],[-1,true]]){
    const sprite=selectProductionSprite({id,facing,animation:{clip:'pass-overhead',tick}},{manifest:animationAssetManifest,images});
    assert.equal(sprite?.atlas.file,clip.src,id+' frame'+frame+' production source');
    assert.equal(sprite?.frame,frame,id+' frame'+frame+' pose mapping');
    assert.equal(sprite?.flip,flip,id+' frame'+frame+' safe facing');
   }
   tick+=animationClips['pass-overhead'].frames[frame].duration;
  }
 }
});
test('Reed Ashcroft and Juniper Vale select six reviewed behind-pass poses in both facings',()=>{
 const expected={
  'reed-ashcroft':{cell:0,sha:'5e143021d547aa3bc77c6f3c7174a1d67ce0cd06ca5f4b8ffffa242328183ee7',claim:'urn:c2pa:9fbc1ede-d3d1-499c-8584-69226e6b761d'},
  'juniper-vale':{cell:1,sha:'db6cc001535e969934c74d13f3104d5569eb75de756e934e32d8eb7ef17bbb0b',claim:'urn:c2pa:343053b0-b094-41b6-ae31-51a783aaa5ae'},
 };
 for(const [id,{cell,sha,claim}] of Object.entries(expected)){
  const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.['pass-behind'];
  assert.equal(character?.mirrorSafe,true,id+' canon-safe mirror policy');
  assert.equal(character?.mirrorReview?.status,'reviewed',id+' canon mirror review');
  assert.equal(policy?.sourceCell,cell,id+' uses the canonical supporting cell');
  assert.equal(character?.directions?.left,undefined,id+' uses reviewed body mirroring');
  assert.ok(clip,id+' behind-pass registration');
  assert.equal(clip.reviewed,true,id+' atlas visual review');
  assert.equal(clip.frames.length,6,id+' six authored poses');
  assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,6,id+' six unique decoded frame hashes');
  assert.equal(clip.provenance.sourceSha256,sha,id+' accepted source hash');
  assert.equal(clip.provenance.sourceClaimId,claim,id+' C2PA source claim');
  assert.equal(clip.provenance.componentIsolation,true,id+' records component-only isolation');
  assert.equal(clip.provenance.review.status,'accepted',id+' accepted source review');
  assert.equal(clip.provenance.sourceRects.length,6,id+' records all six source crops');
  assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),[0,1,2,3,4,5],id+' maps poses in row-major order');
  const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
  const images=new Map([[clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src}]]);
  let tick=0;
  for(let frame=0;frame<6;frame++){
   for(const [facing,flip] of [[1,false],[-1,true]]){
    const sprite=selectProductionSprite({id,facing,animation:{clip:'pass-behind',tick}},{manifest:animationAssetManifest,images});
    assert.equal(sprite?.atlas.file,clip.src,id+' frame'+frame+' production source');
    assert.equal(sprite?.frame,frame,id+' frame'+frame+' pose mapping');
    assert.equal(sprite?.flip,flip,id+' frame'+frame+' safe facing');
   }
   tick+=animationClips['pass-behind'].frames[frame].duration;
  }
 }
});
test('Reed Ashcroft and Juniper Vale select four reviewed receive poses in both facings',()=>{
 const expected={
  'reed-ashcroft':{cell:0,sha:'db671f39313f9bca36902999f95f466b69ed2eba01dc957f6388e40cf4b6bb1a',claim:'urn:c2pa:37f708bb-82c2-495d-90c6-96ed1a6e873a'},
  'juniper-vale':{cell:1,sha:'036575d4a5180a6579d4f818453bedfbb397e09c3ad766481240f467db5045d4',claim:'urn:c2pa:d04c3b01-9367-47fd-a74d-c5c41f163a6e'},
 };
 assert.equal(anchorTick('receive','grab'),4,'receive frame2 is the catch frame');
 for(const [id,{cell,sha,claim}] of Object.entries(expected)){
  const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.receive;
  assert.equal(character?.mirrorSafe,true,id+' canon-safe mirror policy');
  assert.equal(character?.mirrorReview?.status,'reviewed',id+' canon mirror review');
  assert.equal(policy?.sourceCell,cell,id+' uses canonical supporting cell');
  assert.equal(character?.directions?.left,undefined,id+' uses reviewed body mirroring');
  assert.ok(clip,id+' receive registration');
  assert.equal(clip.reviewed,true,id+' atlas visual review');
  assert.equal(clip.frames.length,4,id+' four authored poses');
  assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,4,id+' four unique decoded frame hashes');
  assert.equal(clip.provenance.sourceSha256,sha,id+' accepted source hash');
  assert.equal(clip.provenance.sourceClaimId,claim,id+' C2PA source claim');
  assert.equal(clip.provenance.componentIsolation,true,id+' records component-only isolation');
  assert.equal(clip.provenance.review.status,'accepted',id+' accepted source review');
  assert.equal(clip.provenance.sourceRects.length,4,id+' records four source crops');
  assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),[0,1,2,3],id+' maps poses in row-major order');
  const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
  const images=new Map([[clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src}]]);
  let tick=0;
  for(let frame=0;frame<4;frame++){
   for(const [facing,flip] of [[1,false],[-1,true]]){
    const sprite=selectProductionSprite({id,facing,animation:{clip:'receive',tick}},{manifest:animationAssetManifest,images});
    assert.equal(sprite?.atlas.file,clip.src,id+' frame'+frame+' production source');
    assert.equal(sprite?.frame,frame,id+' frame'+frame+' pose mapping');
    assert.equal(sprite?.flip,flip,id+' frame'+frame+' safe facing');
   }
   tick+=animationClips.receive.frames[frame].duration;
  }
 }
});
test('Reed Ashcroft and Juniper Vale select five reviewed pickup poses in both facings',()=>{
 const expected={
  'reed-ashcroft':{cell:0,sha:'11d8ac99e53323ac067e6b1bd4d5092f851fd24d8e629fdac9353386c3403b6e',claim:'urn:c2pa:36f642e7-d69d-4b98-b20b-1f36fadf1f6f'},
  'juniper-vale':{cell:1,sha:'513447530582fd197a7b9fd87815d48de212e55f4fe0e0a582779fdd76e21b3a',claim:'urn:c2pa:716fda8b-b288-48c2-bcc2-13c2f16d5144'},
 };
 assert.equal(anchorTick('pickup','grab'),7,'pickup frame3 is the ground-contact frame');
 for(const [id,{cell,sha,claim}] of Object.entries(expected)){
  const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.pickup;
  assert.equal(character?.mirrorSafe,true,id+' canon-safe mirror policy');
  assert.equal(character?.mirrorReview?.status,'reviewed',id+' canon mirror review');
  assert.equal(policy?.sourceCell,cell,id+' uses canonical supporting cell');
  assert.equal(character?.directions?.left,undefined,id+' uses reviewed body mirroring');
  assert.ok(clip,id+' pickup registration');
  assert.equal(clip.reviewed,true,id+' atlas visual review');
  assert.equal(clip.frames.length,5,id+' five authored poses');
  assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,5,id+' five unique decoded frame hashes');
  assert.equal(clip.provenance.sourceSha256,sha,id+' accepted source hash');
  assert.equal(clip.provenance.sourceClaimId,claim,id+' C2PA source claim');
  assert.equal(clip.provenance.componentIsolation,true,id+' records component-only isolation');
  assert.equal(clip.provenance.review.status,'accepted',id+' accepted source review');
  assert.equal(clip.provenance.sourceRects.length,5,id+' records five source crops');
  assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),[0,1,2,3,4],id+' maps poses in row-major order');
  const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
  const images=new Map([[clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src}]]);
  let tick=0;
  for(let frame=0;frame<5;frame++){
   for(const [facing,flip] of [[1,false],[-1,true]]){
    const sprite=selectProductionSprite({id,facing,animation:{clip:'pickup',tick}},{manifest:animationAssetManifest,images});
    assert.equal(sprite?.atlas.file,clip.src,id+' frame'+frame+' production source');
    assert.equal(sprite?.frame,frame,id+' frame'+frame+' pose mapping');
    assert.equal(sprite?.flip,flip,id+' frame'+frame+' safe facing');
   }
   tick+=animationClips.pickup.frames[frame].duration;
  }
 }
});
test('Reed Ashcroft and Juniper Vale select eight reviewed steal poses with separate tracks in both facings',()=>{
 const expected={
  'reed-ashcroft':{cell:0,sha:'c703f0ec1ef00b4cbd40852ae7d827dbc5b248e4e8e0f7742ad3f13434dc7eca',claim:'urn:c2pa:3842a374-eef9-4102-9e54-248fcbd85d19',instance:'xmp:iid:b3313172-affa-49fb-990e-60699fc7bbea',forward:14,height:1.35},
  'juniper-vale':{cell:1,sha:'7624f8f9014fa6f067b1b3c6a15dbcbc8f803342a01c430ec048370a47672a14',claim:'urn:c2pa:81807973-de42-45de-a3f9-3ad41c9f0ff9',instance:'xmp:iid:06446649-7362-4e4e-a5a9-734701d388d4',forward:12,height:1.25},
 };
 assert.equal(anchorTick('steal','grab'),5,'steal frame3 is the contact pose');
 for(const [id,record] of Object.entries(expected)){
  const {cell,sha,claim,instance,forward,height}=record,character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.steal;
  assert.equal(character?.mirrorSafe,true,id+' canon-safe mirror policy');
  assert.equal(character?.mirrorReview?.status,'reviewed',id+' canon mirror review');
  assert.equal(policy?.sourceCell,cell,id+' uses the canonical supporting cell');
  assert.equal(policy?.canonicalSection,'J.01');
  assert.equal(character?.directions?.left,undefined,id+' uses canon-approved body mirroring');
  assert.ok(clip,id+' steal registration');assert.equal(clip.reviewed,true,id+' atlas visual review');
  assert.equal(clip.frames.length,8,id+' eight authored poses');
  assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,8,id+' eight unique decoded frames');
  assert.equal(clip.provenance.sourceSha256,sha,id+' accepted source hash');
  assert.equal(clip.provenance.sourceClaimId,claim,id+' C2PA source claim');
  assert.equal(clip.provenance.sourceInstanceId,instance,id+' XMP source instance');
  assert.equal(clip.provenance.componentIsolation,true,id+' records component-only isolation');
  assert.equal(clip.provenance.review.status,'accepted',id+' accepted source review');
  assert.equal(clip.provenance.sourceRects.length,8,id+' records all eight source crops');
  assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),[0,1,2,3,4,5,6,7],id+' maps frames in row-major order');
  assert.equal(sampleBallForward('steal',anchorTick('steal','grab'),id),forward,id+' athlete-specific contact reach');
  assert.equal(sampleBallHeight('steal',anchorTick('steal','grab'),id),height,id+' athlete-specific contact height');
  const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),heightPx=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
  const images=new Map([[clip.src,{complete:true,naturalWidth:width,naturalHeight:heightPx,file:clip.src}]]);
  let tick=0;
  for(let frame=0;frame<8;frame++){
   assert.equal(sampleAnimation('steal',tick).frame,frame,id+' runtime pose timing');
   for(const [facing,flip] of [[1,false],[-1,true]]){
    const sprite=selectProductionSprite({id,facing,animation:{clip:'steal',tick}},{manifest:animationAssetManifest,images});
    assert.equal(sprite?.atlas.file,clip.src,id+' frame'+frame+' production source');
    assert.equal(sprite?.frame,frame,id+' frame'+frame+' authored pose');
    assert.equal(sprite?.flip,flip,id+' frame'+frame+' facing');
   }
   tick+=animationClips.steal.frames[frame].duration;
  }
 }
});
test('Reed selects the reviewed eight-pose layup and releases at his authored hand in both facings',()=>{
 const id='reed-ashcroft',character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.layup;
 assert.equal(character?.mirrorSafe,true,'Reed stays canon-safe for mirrored play');
 assert.equal(character?.mirrorReview?.status,'reviewed');
 assert.equal(policy?.sourceCell,0);assert.equal(policy?.canonicalSection,'J.01');
 assert.equal(character?.directions?.left,undefined,'use the reviewed canonical body mirror');
 assert.ok(clip,'Reed layup atlas registration');assert.equal(clip.reviewed,true);
 assert.equal(clip.src,'./public/assets/animation/reed-ashcroft-layup-right.webp');
 assert.equal(clip.sha256,'9624ba5e1ee8620281ef3d86194102c61fe705ad7e97ffc5c4e90f3f97cef0fc');
 assert.equal(clip.frames.length,8);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,8);
 assert.equal(clip.provenance.sourceSha256,'38a9bf398e438392d041fb404124454e85ca712b397d646feb11d9860add733e');
 assert.equal(clip.provenance.sourceClaimId,'urn:c2pa:4bf739e2-3342-46e6-955b-b41b0714dca1');
 assert.equal(clip.provenance.sourceInstanceId,'xmp:iid:c3d764a7-741f-46fb-b19e-835b9913b2ba');
 assert.equal(clip.provenance.promptVerbatim,false,'retained prompt reconstruction is identified honestly');
 assert.equal(clip.provenance.sourcePromptStatus,'reconstructed');
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.sourceRects.length,8);
 assert.equal(anchorTick('layup','release'),10,'frame4 is the release pose');
 assert.equal(sampleBallForward('layup',10,id),7.676,'ball reaches Reed\'s high release hand');
 assert.equal(sampleBallHeight('layup',10,id),2.135,'ball height follows Reed\'s high release hand');
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src}]]);
 let tick=0;
 for(let frame=0;frame<8;frame++){
  assert.equal(sampleAnimation('layup',tick).frame,frame,'runtime maps authored pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'layup',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src,'production source for frame '+frame);
   assert.equal(sprite?.frame,frame,'production pose '+frame);
   assert.equal(sprite?.flip,flip,'safe mirrored facing for frame '+frame);
  }
  tick+=animationClips.layup.frames[frame].duration;
 }
});
for(const [id,atlas,atlasHash,sourceHash,claim,instance,cell,forward,heightValue]of [
 ['reed-ashcroft','./public/assets/animation/reed-ashcroft-layup-reverse-right.webp','69e49117340e1abf285628373c1ca14f6fd56a0ccf695bcad046dd20ae6a034d','b8dd095adb7dae1c6e3145f7fa53bb6d9bdf713536f0a9e569cbe89e7f3f767f','urn:c2pa:311afb05-654b-4e8b-9fd8-7ea49f165d73','xmp:iid:aaf952af-978b-484a-9380-838654e5571a',0,7.676,2.135],
 ['juniper-vale','./public/assets/animation/juniper-vale-layup-reverse-right.webp','2bf25d9b992f9d22d7e976ee2653f0da057b7637ab7efdb4912dd5443aa30877','d786c1334b991f17573d3b704058979af73ac03506da5a6fa01cf33c024a3cac','urn:c2pa:48a5051d-5299-4f7e-aa7f-cbe1c791a990','xmp:iid:539461c1-ee03-458a-a82d-eaccae097066',1,5.3,2.03]
])test(`${id} selects the reviewed eight-pose reverse layup and release hand in both facings`,()=>{
 const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.['layup-reverse'];
 assert.equal(character?.mirrorSafe,true);assert.equal(character?.mirrorReview?.status,'reviewed');
 assert.equal(policy?.sourceCell,cell);assert.equal(policy?.canonicalSection,'J.01');assert.equal(character?.directions?.left,undefined);
 assert.ok(clip,'reverse layup atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);assert.equal(clip.sha256,atlasHash);
 assert.equal(clip.frames.length,8);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,8);
 assert.equal(clip.provenance.sourceSha256,sourceHash);assert.equal(clip.provenance.sourceClaimId,claim);assert.equal(clip.provenance.sourceInstanceId,instance);
 assert.equal(clip.provenance.promptVerbatim,true);assert.equal(clip.provenance.sourcePromptStatus,'verbatim');
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');assert.equal(clip.provenance.sourceRects.length,8);
 assert.equal(anchorTick('layup-reverse','release'),12,'frame5 is the reverse release pose');
 assert.equal(sampleBallForward('layup-reverse',12,id),forward);assert.equal(sampleBallHeight('layup-reverse',12,id),heightValue);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<8;frame++){
  assert.equal(sampleAnimation('layup-reverse',tick).frame,frame,'runtime maps authored reverse pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'layup-reverse',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['layup-reverse'].frames[frame].duration;
 }
});
for(const [id,atlas,atlasHash,sourceHash,claim,instance,cell]of [
 ['reed-ashcroft','./public/assets/animation/reed-ashcroft-block-right.webp','f52a240b12130452579df27b6a142c6e80d6d24c350b679bf44c8f3f6bfb4811','bdabaaa3025e5e862c1fc8187295f123ebe268c6c6697abb38d19c458f970bc2','urn:c2pa:157c8a00-de7f-4573-ae10-95ad2b7c13b3','xmp:iid:1113e0e0-b730-4eab-be8c-993e96270136',0],
 ['juniper-vale','./public/assets/animation/juniper-vale-block-right.webp','7fbd6959ec2832660da07e3ba689694b6cfaeec5ca5275b55ead6878c4b33fab','f6ecec8e1fd3a4d90986acecc44dca44a3bf7448377e0be064ec038c7c4050a6','urn:c2pa:6c23c302-517f-4ced-8938-8d66e4adabae','xmp:iid:5d49deef-f07d-4c6e-9458-a94414e8cedc',1]
])test(`${id} selects the reviewed four-pose block atlas with safe mirroring`,()=>{
 const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.block;
 assert.equal(character?.mirrorSafe,true);assert.equal(character?.mirrorReview?.status,'reviewed');
 assert.equal(policy?.sourceCell,cell);assert.equal(policy?.canonicalSection,'J.01');assert.equal(character?.directions?.left,undefined);
 assert.ok(clip,'block atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);assert.equal(clip.sha256,atlasHash);
 assert.equal(clip.frames.length,4);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,4);
 assert.equal(clip.provenance.sourceSha256,sourceHash);assert.equal(clip.provenance.sourceClaimId,claim);assert.equal(clip.provenance.sourceInstanceId,instance);
 assert.equal(clip.provenance.promptVerbatim,true);assert.equal(clip.provenance.sourcePromptStatus,'verbatim');
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');assert.equal(clip.provenance.sourceRects.length,4);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<4;frame++){
  assert.equal(sampleAnimation('block',tick).frame,frame,'runtime maps authored block pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'block',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips.block.frames[frame].duration;
 }
});
test('Juniper selects the component-isolated eight-pose layup with her own release hand in both facings',()=>{
 const id='juniper-vale',character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.layup;
 assert.equal(character?.mirrorSafe,true,'Juniper stays canon-safe for mirrored play');
 assert.equal(character?.mirrorReview?.status,'reviewed');
 assert.equal(policy?.sourceCell,1);assert.equal(policy?.canonicalSection,'J.01');
 assert.equal(character?.directions?.left,undefined,'use the reviewed canonical body mirror');
 assert.ok(clip,'Juniper layup atlas registration');assert.equal(clip.reviewed,true);
 assert.equal(clip.src,'./public/assets/animation/juniper-vale-layup-right.webp');
 assert.equal(clip.sha256,'a0e19e36d7ea5517575cf6bd6491e46109b8332d2fc627302e8f283ca9b8e2e2');
 assert.equal(clip.frames.length,8);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,8);
 assert.equal(clip.provenance.sourceSha256,'3774ed5ada2b3cc0e480ab3804086fcfae63c271bc9c68b32102edbcc8498cbb');
 assert.equal(clip.provenance.sourceClaimId,'urn:c2pa:362b0cf3-0067-4f3e-bc85-1b3ff9c665e0');
 assert.equal(clip.provenance.sourceInstanceId,'xmp:iid:fe60bb19-7be6-4e03-b170-8f68a1ef20ed');
 assert.equal(clip.provenance.promptVerbatim,false,'retained prompt reconstruction is identified honestly');
 assert.equal(clip.provenance.sourcePromptStatus,'reconstructed');
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.sourceRects.length,8);
 assert.equal(anchorTick('layup','release'),10,'frame4 is the release pose');
 assert.equal(sampleBallForward('layup',10,id),5.3,'ball reaches Juniper\'s high release hand');
 assert.equal(sampleBallHeight('layup',10,id),2.03,'ball height follows Juniper\'s high release hand');
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[clip.src,{complete:true,naturalWidth:width,naturalHeight:height,file:clip.src}]]);
 let tick=0;
 for(let frame=0;frame<8;frame++){
  assert.equal(sampleAnimation('layup',tick).frame,frame,'runtime maps authored pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'layup',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src,'production source for frame '+frame);
   assert.equal(sprite?.frame,frame,'production pose '+frame);
   assert.equal(sprite?.flip,flip,'safe mirrored facing for frame '+frame);
  }
  tick+=animationClips.layup.frames[frame].duration;
 }
});
for(const [id,atlas,sourceHash,generationId,cell]of [
 ['reed-ashcroft','./public/assets/animation/reed-ashcroft-push-right.webp','19e87a173041d908738e7e0de5eab3bdfedc42e39d2e57cb5c674e13574a4c57','exec-60bd6440-2ba0-46a5-866a-7149689d5fa4',0],
 ['juniper-vale','./public/assets/animation/juniper-vale-push-right.webp','2a73736f88310d65758cd603d63b4eec465979cd6d47355831388f0e975f1ed6','exec-06b35cc0-86a3-4070-8abf-93d917229141',1]
])test(`${id} selects eleven reviewed press/push poses with the J.01 mirror policy`,()=>{
 const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.push;
 assert.equal(character?.mirrorSafe,true);assert.equal(character?.mirrorReview?.status,'reviewed');
 assert.equal(policy?.sourceCell,cell);assert.equal(policy?.canonicalSection,'J.01');assert.equal(character?.directions?.left,undefined);
 assert.ok(clip,'push atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,11);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,11);
 assert.equal(clip.provenance.sourceSha256,sourceHash);assert.equal(clip.provenance.imageGenerationId,generationId);
 assert.equal(clip.provenance.c2paClaim,null);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.componentIsolation,true);
 assert.equal(clip.provenance.review.status,'accepted');assert.equal(clip.provenance.sourceRects.length,11);
 assert.equal(anchorTick('push','contact'),8,'frame5 is the contact pose at tick8');
 assert.equal(sampleAnimation('push',anchorTick('push','contact')).frame,5);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<11;frame++){
  assert.equal(sampleAnimation('push',tick).frame,frame,'runtime maps authored push pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'push',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips.push.frames[frame].duration;
 }
});
for(const [id,atlas,atlasHash,sourceHash,generationId,cell,expectedHeight,expectedForward]of [
 ['reed-ashcroft','./public/assets/animation/reed-ashcroft-rebound-right.webp','ec3c5d372ed009ee7639c44559f1b8b1a8cee18e21695eb92326c832110a7aad','49210e8b91e7f737eccda131da9a60f453e5b27249e4670d39be88cb351ef8d8','exec-082937c2-c3d1-4059-84f9-0783fb38646b',0,2.55,0],
 ['juniper-vale','./public/assets/animation/juniper-vale-rebound-right.webp','cee83b7b1f0ecef96e8aa082ca364f37bd99a923f20e90eba7bab04681700fef','8f13d387d1ad00e93b99b41b39a500bd70528bd4bbe88c6a7a6780354b7066a4','exec-a17a9a33-3f08-435f-9b13-70172bab0d7c',1,2.45,0]
])test(`${id} selects five reviewed rebound poses and tracks its own grab hand`,()=>{
 const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.rebound;
 assert.equal(character?.mirrorSafe,true);assert.equal(character?.mirrorReview?.status,'reviewed');
 assert.equal(policy?.sourceCell,cell);assert.equal(policy?.canonicalSection,'J.01');assert.equal(character?.directions?.left,undefined);
 assert.ok(clip,'rebound atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);assert.equal(clip.sha256,atlasHash);
 assert.equal(clip.frames.length,5);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,5);
 assert.equal(clip.provenance.sourceSha256,sourceHash);assert.equal(clip.provenance.imageGenerationId,generationId);
 assert.equal(clip.provenance.c2paClaim,null);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.componentIsolation,true);
 assert.equal(clip.provenance.rawBackground,'low-opacity painted gradient excluded by component-only packing');
 assert.equal(clip.provenance.review.status,'accepted');assert.equal(clip.provenance.sourceRects.length,5);
 assert.equal(anchorTick('rebound','grab'),5);assert.equal(sampleAnimation('rebound',5).frame,3,'frame3 is the grab pose');
 assert.equal(sampleBallHeight('rebound',5,id),expectedHeight);assert.equal(sampleBallForward('rebound',5,id),expectedForward);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<5;frame++){
  assert.equal(sampleAnimation('rebound',tick).frame,frame,'runtime maps authored rebound pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'rebound',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips.rebound.frames[frame].duration;
 }
});
for(const [id,atlas,atlasHash,sourceHash,generationId,cell]of [
 ['reed-ashcroft','./public/assets/animation/reed-ashcroft-fall-right.webp','101b5868486aece37cbc1419c88eba052cef7355869edd372c33459622512c69','7a991d566a46210402fb457187c8a693757e2751394c6fd21ed9910cb37a332c','exec-c3fd5206-c958-4ecc-b96f-41aa4f26483d',0],
 ['juniper-vale','./public/assets/animation/juniper-vale-fall-right.webp','dde0a395934a5666786a9efc694424dd0f7442ed7cf705c26719ef7e09778939','e38fad03165e8e0b4598b1f85e58c4d5dc7fc4e0f6272b941e69c94cd05a9fe7','exec-5510f7ae-4594-4f3d-bec4-cc2b2477270e',1]
])test(`${id} selects ten reviewed fall and get-up poses with the J.01 mirror policy`,()=>{
 const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.fall;
 assert.equal(character?.mirrorSafe,true);assert.equal(character?.mirrorReview?.status,'reviewed');
 assert.equal(policy?.sourceCell,cell);assert.equal(policy?.canonicalSection,'J.01');assert.equal(character?.directions?.left,undefined);
 assert.ok(clip,'fall atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.sha256,atlasHash);
 assert.equal(clip.frames.length,10);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,10);
 assert.equal(clip.provenance.sourceSha256,sourceHash);assert.equal(clip.provenance.imageGenerationId,generationId);
 assert.equal(clip.provenance.c2paClaim,null);assert.equal(clip.provenance.promptVerbatim,false);
 assert.equal(clip.provenance.sourcePromptStatus,'reconstructed');assert.equal(clip.provenance.componentIsolation,true);
 assert.equal(clip.provenance.review.status,'accepted');assert.equal(clip.provenance.sourceRects.length,10);
 assert.equal(anchorTick('fall','finish'),33,'frame9 is the recovered defensive stance');
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<10;frame++){
  assert.equal(sampleAnimation('fall',tick).frame,frame,'runtime maps authored fall pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'fall',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips.fall.frames[frame].duration;
 }
});
for(const [id,atlas,atlasHash,sourceHash,generationId,cell]of [
 ['reed-ashcroft','./public/assets/animation/reed-ashcroft-celebrate-right.webp','99e79471335beacbddbb77c1c54535956efdd0eeb94002aed45df3581ce7083a','b18998be2023e14e6e526104d037cfd59066091c90b716238e5542239a46a497','exec-8cc51fae-065b-4e4c-8001-ab67e2e0d41b',0],
 ['juniper-vale','./public/assets/animation/juniper-vale-celebrate-right.webp','3cdff36cd66d4c49d98ff9840587cb225c7448b0c9b3b9a0496d1114c6fc5bf4','5f19e373a451f39e07882a963fcf7ed99e95f8763d320d281b521d61d99c6968','exec-55046130-9caf-499c-afaf-b47d001e7099',1]
])test(`${id} selects ten reviewed celebration poses with the J.01 mirror policy`,()=>{
 const character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.celebrate;
 assert.equal(character?.mirrorSafe,true);assert.equal(character?.mirrorReview?.status,'reviewed');
 assert.equal(policy?.sourceCell,cell);assert.equal(policy?.canonicalSection,'J.01');assert.equal(character?.directions?.left,undefined);
 assert.ok(clip,'celebrate atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);assert.equal(clip.sha256,atlasHash);
 assert.equal(clip.frames.length,10);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,10);
 assert.equal(clip.provenance.sourceSha256,sourceHash);assert.equal(clip.provenance.imageGenerationId,generationId);
 assert.equal(clip.provenance.c2paClaim,null);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.componentIsolation,true);
 assert.equal(clip.provenance.review.status,'accepted');assert.equal(clip.provenance.sourceRects.length,10);
 assert.equal(anchorTick('celebrate','finish'),65);assert.equal(sampleAnimation('celebrate',65).frame,9);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<10;frame++){
  assert.equal(sampleAnimation('celebrate',tick).frame,frame,'runtime maps authored celebration pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'celebrate',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips.celebrate.frames[frame].duration;
 }
});
for(const [key,atlas]of [['pass-overhead','./public/assets/animation/paprika-pass-overhead-right.webp'],['pass-behind','./public/assets/animation/paprika-pass-behind-right.webp']])test(`Paprika selects all six reviewed ${key} fox poses with safe mirroring`,()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,clip=character?.directions?.right?.[key];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');assert.equal(policy.sourceCell,1);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Paprika action atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,6);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,6);
 assert.equal(clip.provenance.imageGenerationId,clip.provenance.generationId);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.c2paClaim,null);
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.sourceRects.length,6);assert.equal(clip.provenance.sourceSha256.length,64);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<6;frame++){
  assert.equal(sampleAnimation(key,tick).frame,frame,`runtime maps authored ${key} pose ${frame}`);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:key,tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips[key].frames[frame].duration;
 }
});
test('Paprika selects all fifteen reviewed power-dunk poses with safe mirroring',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-dunk-power-right.webp',clip=character?.directions?.right?.['dunk-power'];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');assert.equal(policy.sourceCell,1);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Paprika power-dunk atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.imageGenerationId,clip.provenance.generationId);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.c2paClaim,null);
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.sourceRects.length,15);assert.equal(clip.provenance.sourceSha256.length,64);
 assert.equal(anchorTick('dunk-power','takeoff'),4);assert.equal(anchorTick('dunk-power','peak'),14);
 assert.equal(anchorTick('dunk-power','release'),21);assert.equal(anchorTick('dunk-power','finish'),23);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-power',tick).frame,frame,'runtime maps authored power-dunk pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'dunk-power',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-power'].frames[frame].duration;
 }
});
test('Paprika selects all fifteen reviewed windmill-dunk poses with safe mirroring',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-dunk-windmill-right.webp',clip=character?.directions?.right?.['dunk-windmill'];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');assert.equal(policy.sourceCell,1);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Paprika windmill-dunk atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.imageGenerationId,clip.provenance.generationId);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.c2paClaim,null);
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.sourceRects.length,15);assert.equal(clip.provenance.sourceSha256.length,64);
 assert.equal(anchorTick('dunk-windmill','takeoff'),4);assert.equal(anchorTick('dunk-windmill','grab'),10);
 assert.equal(anchorTick('dunk-windmill','peak'),14);assert.equal(anchorTick('dunk-windmill','release'),21);
 assert.equal(anchorTick('dunk-windmill','finish'),23);assert.equal(anchorTick('dunk-windmill','land'),30);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-windmill',tick).frame,frame,'runtime maps authored windmill-dunk pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'dunk-windmill',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-windmill'].frames[frame].duration;
 }
});
test('Paprika selects all fifteen reviewed reverse-dunk poses with safe mirroring',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-dunk-reverse-right.webp',clip=character?.directions?.right?.['dunk-reverse'];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');assert.equal(policy.sourceCell,1);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Paprika reverse-dunk atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.imageGenerationId,clip.provenance.generationId);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.c2paClaim,null);
 assert.equal(clip.provenance.componentIsolation,false);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.sourceRects.length,15);assert.equal(clip.provenance.sourceSha256.length,64);
 assert.equal(anchorTick('dunk-reverse','takeoff'),4);assert.equal(anchorTick('dunk-reverse','grab'),10);
 assert.equal(anchorTick('dunk-reverse','peak'),14);assert.equal(anchorTick('dunk-reverse','release'),21);
 assert.equal(anchorTick('dunk-reverse','finish'),23);assert.equal(anchorTick('dunk-reverse','land'),30);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-reverse',tick).frame,frame,'runtime maps authored reverse-dunk pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'dunk-reverse',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-reverse'].frames[frame].duration;
 }
});
test('Reed selects all fifteen reviewed 360-dunk poses and mirrors the canon-safe spin',()=>{
 const id='reed-ashcroft',character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.['dunk-360'];
 assert.equal(character?.mirrorSafe,true);assert.equal(character?.mirrorReview?.status,'reviewed');
 assert.equal(policy?.canonicalSection,'J.01');assert.equal(policy?.sourceCell,0);assert.equal(character?.directions?.left,undefined);
 assert.ok(clip,'Reed 360-dunk atlas registration');assert.equal(clip.reviewed,true);
 assert.equal(clip.src,'./public/assets/animation/reed-ashcroft-dunk-360-right.webp');
 assert.equal(clip.sha256,'9dce6f01588266f7060aa19b914367926b016049fb219f446b98b92a0a2c34f2');
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.sourceSha256,'e7b03d137f4930a79a2d00fc5ff464e0743be0a02ad2696672c6979ecbbe80d3');
 assert.equal(clip.provenance.imageGenerationId,'exec-5090a026-412a-4cd7-9ebd-5f9343968893');
 assert.equal(clip.provenance.parentGenerationId,'exec-7507e18b-74d1-49d5-8bdc-19f93687a22b');
 assert.equal(clip.provenance.promptVerbatim,true);assert.equal(clip.provenance.sourcePromptStatus,'verbatim');
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.rejectedAttempts.length,2);
 assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),Array.from({length:15},(_,i)=>i));
 assert.equal(anchorTick('dunk-360','takeoff'),4);assert.equal(anchorTick('dunk-360','grab'),10);
 assert.equal(anchorTick('dunk-360','peak'),14);assert.equal(anchorTick('dunk-360','release'),21);
 assert.equal(anchorTick('dunk-360','finish'),23);assert.equal(anchorTick('dunk-360','land'),30);
 assert.equal(sampleBallForward('dunk-360',14,id),4,'the ball returns to Reed’s right-facing high hand after the spin');
 assert.equal(sampleBallForward('dunk-360',17,id),-6,'the spinning gather sweeps across to the far side');
 assert.equal(sampleBallHeight('dunk-360',17,id),2.5);
 const images=new Map([[clip.src,{complete:true,naturalWidth:512,naturalHeight:384,file:clip.src}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-360',tick).frame,frame,'runtime maps Reed 360-dunk pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'dunk-360',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-360'].frames[frame].duration;
 }
});
test('Reed selects all fifteen reviewed tomahawk-dunk poses with cleaned art and J.01 mirroring',()=>{
 const id='reed-ashcroft',character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.['dunk-tomahawk'];
 assert.equal(character?.mirrorSafe,true);assert.equal(character?.mirrorReview?.status,'reviewed');
 assert.equal(policy?.canonicalSection,'J.01');assert.equal(policy?.sourceCell,0);assert.equal(character?.directions?.left,undefined);
 assert.ok(clip,'Reed tomahawk-dunk atlas registration');assert.equal(clip.reviewed,true);
 assert.equal(clip.src,'./public/assets/animation/reed-ashcroft-dunk-tomahawk-right.webp');
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.sourceSha256,'a53cb1b62884cee98e51b7e040c245a5817c802e22daee04f05a42637fccc832');
 assert.equal(clip.provenance.imageGenerationId,'exec-5656a62f-fac9-4d13-8b3b-c3097731165d');
 assert.equal(clip.provenance.promptVerbatim,true);assert.equal(clip.provenance.sourcePromptStatus,'verbatim');
 assert.equal(clip.provenance.cleanup.clearedExteriorRedPixels,3567);assert.equal(clip.provenance.cleanup.script,'tools/generate-art/clean-alpha-fringe.py');
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.rejectedAttempts.length,9);
 assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),Array.from({length:15},(_,i)=>i));
 assert.equal(anchorTick('dunk-tomahawk','takeoff'),4);assert.equal(anchorTick('dunk-tomahawk','grab'),10);
 assert.equal(anchorTick('dunk-tomahawk','peak'),14);assert.equal(anchorTick('dunk-tomahawk','release'),21);
 assert.equal(anchorTick('dunk-tomahawk','finish'),23);assert.equal(anchorTick('dunk-tomahawk','land'),30);
 assert.equal(sampleBallHeight('dunk-tomahawk',19,id),2.2);assert.equal(sampleBallForward('dunk-tomahawk',19,id),13);
 const images=new Map([[clip.src,{complete:true,naturalWidth:512,naturalHeight:384,file:clip.src}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-tomahawk',tick).frame,frame,'runtime maps Reed tomahawk pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'dunk-tomahawk',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-tomahawk'].frames[frame].duration;
 }
});
test('Reed selects all fifteen reviewed double-pump poses with the J.01 canon mirror review',()=>{
 const id='reed-ashcroft',character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.['dunk-double'];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'J.01');assert.equal(policy.sourceCell,0);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Reed double-dunk atlas registration');assert.equal(clip.reviewed,true);
 assert.equal(clip.src,'./public/assets/animation/reed-ashcroft-dunk-double-right.webp');
 assert.equal(clip.sha256,'b227944c1cf73210e015c8c30840ac21c8b96b3403c51f21d891b8dfb6ee13ca');
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.sourceSha256,'7c4733b31ad8953746c6df39e218c8fac07934e74bc64d77b94ea7a3b4e899e6');
 assert.equal(clip.provenance.rawSourceSha256,'720dc0de3a6760bb8368858c0f5f5c76a3f52919b9a799eb0d64f6aab5804f0f');
 assert.equal(clip.provenance.imageGenerationId,'exec-f79e4407-2f42-4f4d-add7-b676f2e28139');
 assert.equal(clip.provenance.promptVerbatim,true);assert.equal(clip.provenance.sourcePromptStatus,'verbatim');
 assert.equal(clip.provenance.cleanup.clearedExteriorRedPixels,3076);assert.equal(clip.provenance.componentIsolation,true);
 assert.equal(clip.provenance.review.status,'accepted');assert.deepEqual(clip.provenance.rejectedAttempts,[]);
 assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),Array.from({length:15},(_,i)=>i));
 assert.equal(anchorTick('dunk-double','takeoff'),4);assert.equal(anchorTick('dunk-double','grab'),10);
 assert.equal(anchorTick('dunk-double','peak'),14);assert.equal(anchorTick('dunk-double','release'),21);
 assert.equal(anchorTick('dunk-double','finish'),23);assert.equal(anchorTick('dunk-double','land'),30);
 assert.equal(sampleBallHeight('dunk-double',17,id),2.35);assert.equal(sampleBallForward('dunk-double',17,id),4.5);
 assert.equal(sampleBallHeight('dunk-double',19,id),2.9);assert.equal(sampleBallForward('dunk-double',19,id),12.5);
 const images=new Map([[clip.src,{complete:true,naturalWidth:512,naturalHeight:384,file:clip.src}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-double',tick).frame,frame,'runtime maps authored double-pump pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'dunk-double',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-double'].frames[frame].duration;
 }
});
test('Reed selects every reviewed clutch pose with source provenance and J.01 mirroring',()=>{
 const id='reed-ashcroft',character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.['dunk-clutch'];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.match(character.mirrorReview.notes,/J\.01/);assert.match(character.mirrorReview.notes,/no fixed-side anatomy/i);
 assert.equal(policy.canonicalSection,'J.01');assert.equal(policy.sourceCell,0);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Reed clutch-dunk atlas registration');assert.equal(clip.reviewed,true);
 assert.equal(clip.src,'./public/assets/animation/reed-ashcroft-dunk-clutch-right.webp');
 assert.equal(clip.sha256,'21bdf2e36e918a0b22cd276217df59100d83033c1c01a4497a0409171efcf6fb');
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.sourceSha256,'20452291f9a59af300dbedfd769d178a11a944d6d3f21409b68327460cf7dbcb');
 assert.equal(clip.provenance.rawSourceSha256,'56d9e11adaf01c66c60392c55bb019813baf80c8886082b333a2a027267effca');
 assert.equal(clip.provenance.imageGenerationId,'exec-059a7805-24c1-42aa-8404-7315f1eacf77');
 assert.equal(clip.provenance.promptVerbatim,true);assert.equal(clip.provenance.sourcePromptStatus,'verbatim');
 assert.equal(clip.provenance.cleanup.clearedExteriorRedPixels,2433);
 assert.equal(clip.provenance.cleanup.disconnectedSpeckPixels,2584);
 assert.equal(clip.provenance.cleanup.edgeMattePixels,55304);
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.deepEqual(clip.provenance.rejectedAttempts.map(attempt=>attempt.sourceSha256),[
  '1795fe06ea2ad6180b8fef0580db909cc63486f76e3a2285bfd4eba11e440e86',
  'db292066eae58176ef67f127d18980596d7b87d4f1b723a6b95edc0ed7d82a0e',
  '9233be34db8dd25d1bbc78358765f4056734efdf7d0eb13a0cc987fa033de161'
 ]);
 assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),Array.from({length:15},(_,i)=>i));
 const sha256=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
 assert.equal(sha256('tools/generate-art/sources/j70-reed-ashcroft-dunk-clutch-generated-raw.png'),clip.provenance.rawSourceSha256);
 assert.equal(sha256('tools/generate-art/sources/j70-reed-ashcroft-dunk-clutch15.png'),clip.provenance.sourceSha256);
 assert.equal(anchorTick('dunk-clutch','takeoff'),4);assert.equal(anchorTick('dunk-clutch','grab'),10);
 assert.equal(anchorTick('dunk-clutch','peak'),14);assert.equal(anchorTick('dunk-clutch','release'),21);
 assert.equal(anchorTick('dunk-clutch','finish'),23);assert.equal(anchorTick('dunk-clutch','land'),30);
 assert.equal(sampleBallHeight('dunk-clutch',10,id),.9);assert.equal(sampleBallForward('dunk-clutch',10,id),3);
 assert.equal(sampleBallHeight('dunk-clutch',19,id),1.7);assert.equal(sampleBallForward('dunk-clutch',19,id),10);
 assert.equal(sampleBallHeight('dunk-clutch',21,id),1.8);assert.equal(sampleBallForward('dunk-clutch',21,id),13);
 const images=new Map([[clip.src,{complete:true,naturalWidth:512,naturalHeight:384,file:clip.src}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-clutch',tick).frame,frame,'runtime maps authored clutch pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'dunk-clutch',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-clutch'].frames[frame].duration;
 }
});
test('Reed selects all fifteen reviewed scythe poses with the corrected source and J.01 mirror review',()=>{
 const id='reed-ashcroft',character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.['dunk-scythe'];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.match(character.mirrorReview.notes,/J\.01/);assert.match(character.mirrorReview.notes,/transient right-hand low-to-high sweep/);
 assert.equal(policy.canonicalSection,'J.01');assert.equal(policy.sourceCell,0);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Reed scythe-dunk atlas registration');assert.equal(clip.reviewed,true);
 assert.equal(clip.src,'./public/assets/animation/reed-ashcroft-dunk-scythe-right.webp');
 assert.equal(clip.sha256,'4e6b1c247b52fd1a7c563390f46551c31016a6dea9542294ca87de090e91d853');
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.sourceSha256,'982d5113ea82ac8728185503d79ccfc8c9d1906eb4cc336738499ea25aa91393');
 assert.equal(clip.provenance.rawSourceSha256,'8bfdadae52027d68d0c46fbb5f283de25702e531534fc5e264031637f3228ddb');
 assert.equal(clip.provenance.imageGenerationId,'exec-b615f42d-9928-4df6-b477-33b8070a8eec');
 assert.equal(clip.provenance.promptVerbatim,true);assert.equal(clip.provenance.sourcePromptStatus,'verbatim');
 assert.equal(clip.provenance.cleanup.clearedExteriorRedPixels,1251);
 assert.equal(clip.provenance.cleanup.disconnectedSpeckPixels,836);
 assert.equal(clip.provenance.cleanup.edgeMattePixels,29110);
 assert.equal(clip.provenance.componentIsolation,false);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.rejectedAttempts.length,1);
 assert.equal(clip.provenance.rejectedAttempts[0].generationId,'exec-59c34682-bdea-4b69-a237-6d754fa2de42');
 assert.equal(clip.provenance.rejectedAttempts[0].sourceSha256,'f0e58d27da66dd36893c451aa443661d9074b0f5505d13d6db2c9a4e1b12cfac');
 assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),Array.from({length:15},(_,i)=>i));
 const sha256=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
 assert.equal(sha256('tools/generate-art/sources/j71-reed-ashcroft-dunk-scythe-generated-raw.png'),clip.provenance.rawSourceSha256);
 assert.equal(sha256('tools/generate-art/sources/j71-reed-ashcroft-dunk-scythe15.png'),clip.provenance.sourceSha256);
 assert.equal(sha256('tools/generate-art/sources/j71-reed-ashcroft-dunk-scythe-attempt1-rejected-muddled-sweep.png'),clip.provenance.rejectedAttempts[0].sourceSha256);
 assert.ok(readFileSync(clip.provenance.promptFile,'utf8').includes(clip.provenance.prompt),'the exact accepted retry prompt is retained verbatim');
 assert.equal(anchorTick('dunk-scythe','takeoff'),4);assert.equal(anchorTick('dunk-scythe','grab'),10);
 assert.equal(anchorTick('dunk-scythe','peak'),14);assert.equal(anchorTick('dunk-scythe','release'),21);
 assert.equal(anchorTick('dunk-scythe','finish'),23);assert.equal(anchorTick('dunk-scythe','land'),30);
 assert.equal(sampleBallHeight('dunk-scythe',10,id),.45);assert.equal(sampleBallForward('dunk-scythe',10,id),-7);
 assert.equal(sampleBallHeight('dunk-scythe',17,id),1.65);assert.equal(sampleBallForward('dunk-scythe',17,id),-2);
 assert.equal(sampleBallHeight('dunk-scythe',19,id),2.35);assert.equal(sampleBallForward('dunk-scythe',19,id),10);
 assert.equal(sampleBallHeight('dunk-scythe',21,id),2.3);assert.equal(sampleBallForward('dunk-scythe',21,id),13);
 const images=new Map([[clip.src,{complete:true,naturalWidth:512,naturalHeight:384,file:clip.src}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-scythe',tick).frame,frame,'runtime maps authored scythe pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'dunk-scythe',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-scythe'].frames[frame].duration;
 }
});
test('Paprika selects all fifteen reviewed 360-dunk poses with safe mirroring',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-dunk-360-right.webp',clip=character?.directions?.right?.['dunk-360'];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');assert.equal(policy.sourceCell,1);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Paprika 360-dunk atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.imageGenerationId,clip.provenance.generationId);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.c2paClaim,null);
 assert.equal(clip.provenance.componentIsolation,false);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.sourceRects.length,15);assert.equal(clip.provenance.sourceSha256.length,64);
 assert.equal(anchorTick('dunk-360','takeoff'),4);assert.equal(anchorTick('dunk-360','grab'),10);
 assert.equal(anchorTick('dunk-360','peak'),14);assert.equal(anchorTick('dunk-360','release'),21);
 assert.equal(anchorTick('dunk-360','finish'),23);assert.equal(anchorTick('dunk-360','land'),30);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-360',tick).frame,frame,'runtime maps authored 360-dunk pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'dunk-360',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-360'].frames[frame].duration;
 }
});
test('Paprika selects all fifteen reviewed tomahawk-dunk poses with safe mirroring',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-dunk-tomahawk-right.webp',clip=character?.directions?.right?.['dunk-tomahawk'];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');assert.equal(policy.sourceCell,1);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Paprika tomahawk-dunk atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.imageGenerationId,clip.provenance.generationId);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.c2paClaim,null);
 assert.equal(clip.provenance.componentIsolation,false);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.sourceRects.length,15);assert.equal(clip.provenance.sourceSha256.length,64);
 assert.equal(anchorTick('dunk-tomahawk','takeoff'),4);assert.equal(anchorTick('dunk-tomahawk','grab'),10);
 assert.equal(anchorTick('dunk-tomahawk','peak'),14);assert.equal(anchorTick('dunk-tomahawk','release'),21);
 assert.equal(anchorTick('dunk-tomahawk','finish'),23);assert.equal(anchorTick('dunk-tomahawk','land'),30);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-tomahawk',tick).frame,frame,'runtime maps authored tomahawk-dunk pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'dunk-tomahawk',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-tomahawk'].frames[frame].duration;
 }
});
test('Paprika selects all fifteen reviewed double-dunk poses with safe mirroring',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-dunk-double-right.webp',clip=character?.directions?.right?.['dunk-double'];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');assert.equal(policy.sourceCell,1);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Paprika double-dunk atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.imageGenerationId,clip.provenance.generationId);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.c2paClaim,null);
 assert.equal(clip.provenance.componentIsolation,false);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.sourceRects.length,15);assert.equal(clip.provenance.sourceSha256.length,64);
 assert.equal(anchorTick('dunk-double','takeoff'),4);assert.equal(anchorTick('dunk-double','grab'),10);
 assert.equal(anchorTick('dunk-double','peak'),14);assert.equal(anchorTick('dunk-double','release'),21);
 assert.equal(anchorTick('dunk-double','finish'),23);assert.equal(anchorTick('dunk-double','land'),30);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-double',tick).frame,frame,'runtime maps authored double-dunk pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'dunk-double',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-double'].frames[frame].duration;
 }
});
test('Paprika selects all fifteen reviewed clutch-dunk poses with safe mirroring',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-dunk-clutch-right.webp',clip=character?.directions?.right?.['dunk-clutch'];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');assert.equal(policy.sourceCell,1);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Paprika clutch-dunk atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.imageGenerationId,clip.provenance.generationId);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.c2paClaim,null);
 assert.equal(clip.provenance.componentIsolation,false);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.sourceRects.length,15);assert.equal(clip.provenance.sourceSha256.length,64);
 assert.equal(anchorTick('dunk-clutch','takeoff'),4);assert.equal(anchorTick('dunk-clutch','grab'),10);
 assert.equal(anchorTick('dunk-clutch','peak'),14);assert.equal(anchorTick('dunk-clutch','release'),21);
 assert.equal(anchorTick('dunk-clutch','finish'),23);assert.equal(anchorTick('dunk-clutch','land'),30);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-clutch',tick).frame,frame,'runtime maps authored clutch-dunk pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'dunk-clutch',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-clutch'].frames[frame].duration;
 }
});
test('Paprika selects all fifteen reviewed scythe-dunk poses with safe mirroring',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-dunk-scythe-right.webp',clip=character?.directions?.right?.['dunk-scythe'];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');assert.equal(policy.sourceCell,1);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Paprika scythe-dunk atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.imageGenerationId,clip.provenance.generationId);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.c2paClaim,null);
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.sourceRects.length,15);assert.equal(clip.provenance.sourceSha256.length,64);
 assert.equal(anchorTick('dunk-scythe','takeoff'),4);assert.equal(anchorTick('dunk-scythe','grab'),10);
 assert.equal(anchorTick('dunk-scythe','peak'),14);assert.equal(anchorTick('dunk-scythe','release'),21);
 assert.equal(anchorTick('dunk-scythe','finish'),23);assert.equal(anchorTick('dunk-scythe','land'),30);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-scythe',tick).frame,frame,'runtime maps authored scythe-dunk pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'dunk-scythe',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-scythe'].frames[frame].duration;
 }
});
test('Paprika selects all fifteen reviewed power alley-oop poses with safe mirroring',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-alley-oop-power-right.webp',clip=character?.directions?.right?.['alley-oop-power'];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');assert.equal(policy.sourceCell,1);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Paprika power alley-oop atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.imageGenerationId,clip.provenance.generationId);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.c2paClaim,null);
 assert.equal(clip.provenance.componentIsolation,false);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.sourceRects.length,15);assert.equal(clip.provenance.sourceSha256.length,64);
 assert.equal(anchorTick('alley-oop-power','takeoff'),4);assert.equal(anchorTick('alley-oop-power','grab'),10);
 assert.equal(anchorTick('alley-oop-power','peak'),14);assert.equal(anchorTick('alley-oop-power','release'),21);
 assert.equal(anchorTick('alley-oop-power','finish'),23);assert.equal(anchorTick('alley-oop-power','land'),30);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('alley-oop-power',tick).frame,frame,'runtime maps authored alley-oop pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'alley-oop-power',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['alley-oop-power'].frames[frame].duration;
 }
});
test('Paprika selects all fifteen reviewed reverse alley-oop poses with safe mirroring',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-alley-oop-reverse-right.webp',clip=character?.directions?.right?.['alley-oop-reverse'];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');assert.equal(policy.sourceCell,1);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Paprika reverse alley-oop atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.imageGenerationId,clip.provenance.generationId);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.c2paClaim,null);
 assert.equal(clip.provenance.componentIsolation,false);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.sourceRects.length,15);assert.equal(clip.provenance.sourceSha256.length,64);
 assert.equal(anchorTick('alley-oop-reverse','takeoff'),4);assert.equal(anchorTick('alley-oop-reverse','grab'),10);
 assert.equal(anchorTick('alley-oop-reverse','peak'),14);assert.equal(anchorTick('alley-oop-reverse','release'),21);
 assert.equal(anchorTick('alley-oop-reverse','finish'),23);assert.equal(anchorTick('alley-oop-reverse','land'),30);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('alley-oop-reverse',tick).frame,frame,'runtime maps authored reverse alley-oop pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'alley-oop-reverse',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['alley-oop-reverse'].frames[frame].duration;
 }
});
test('Paprika selects all eight reviewed quadruped layup poses with safe mirroring',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-layup-right.webp',clip=character?.directions?.right?.layup;
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');assert.equal(policy.sourceCell,1);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Paprika layup atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,8);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,8);
 assert.equal(clip.provenance.imageGenerationId,clip.provenance.generationId);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.c2paClaim,null);
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.sourceRects.length,8);assert.equal(clip.provenance.sourceSha256.length,64);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<8;frame++){
  assert.equal(sampleAnimation('layup',tick).frame,frame,`runtime maps authored layup pose ${frame}`);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'layup',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips.layup.frames[frame].duration;
 }
});
test('Paprika selects all eight reviewed reverse-layup poses with release at frame5',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-layup-reverse-right.webp',clip=character?.directions?.right?.['layup-reverse'];
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');assert.equal(policy.sourceCell,1);
 assert.ok(clip,'Paprika reverse-layup atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,8);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,8);
 assert.equal(clip.provenance.imageGenerationId,clip.provenance.generationId);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.componentIsolation,true);
 assert.equal(clip.provenance.review.status,'accepted');assert.equal(clip.provenance.sourceRects.length,8);
 assert.equal(clip.provenance.rejectedAttempts.length,1);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<8;frame++){
  assert.equal(sampleAnimation('layup-reverse',tick).frame,frame,`runtime maps reverse-layup pose ${frame}`);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'layup-reverse',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['layup-reverse'].frames[frame].duration;
 }
 assert.equal(anchorTick('layup-reverse','release'),12);assert.equal(sampleAnimation('layup-reverse',12).frame,5);
});
test('Paprika selects all four reviewed quadruped block poses and reaches apex at tick5',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-block-right.webp',clip=character?.directions?.right?.block;
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');assert.equal(policy.sourceCell,1);
 assert.ok(clip,'Paprika block atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,4);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,4);
 assert.equal(clip.provenance.imageGenerationId,clip.provenance.generationId);assert.equal(clip.provenance.promptVerbatim,true);
 assert.equal(clip.provenance.sourcePromptStatus,'verbatim');assert.equal(clip.provenance.componentIsolation,true);
 assert.equal(clip.provenance.review.status,'accepted');assert.equal(clip.provenance.sourceRects.length,4);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 assert.equal(anchorTick('block','apex'),5);assert.equal(sampleAnimation('block',5).frame,2);
 let tick=0;
 for(let frame=0;frame<4;frame++){
  assert.equal(sampleAnimation('block',tick).frame,frame,`runtime maps block pose ${frame}`);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'block',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips.block.frames[frame].duration;
 }
});
test('Paprika selects all eight reviewed quadruped steal poses with a paw-height contact track',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-steal-right.webp',clip=character?.directions?.right?.steal;
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');
 assert.ok(clip,'Paprika steal atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,8);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,8);
 assert.equal(clip.provenance.sourceSha256,'82d2ba1da0602179904a16dd2529d2f23a140c258675b0a966ea0f4b0d1fa781');
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),[0,1,2,3,4,5,6,7]);
 const contact=anchorTick('steal','grab');assert.equal(contact,5);assert.equal(sampleAnimation('steal',contact).frame,3);
 assert.equal(sampleBallForward('steal',contact,'paprika'),13);assert.equal(sampleBallHeight('steal',contact,'paprika'),.25);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<8;frame++){
  assert.equal(sampleAnimation('steal',tick).frame,frame,'runtime maps steal pose '+frame);
  for(const [facing,flip] of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'steal',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips.steal.frames[frame].duration;
 }
});
test('Paprika selects all eleven reviewed quadruped push poses with contact at tick8',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-push-right.webp',clip=character?.directions?.right?.push;
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');
 assert.ok(clip,'Paprika push atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,11);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,11);
 assert.equal(clip.provenance.sourceSha256,'920f97d8ac9e28a68eed848496cc43a5a54c3398fae65e3f7d2bc651c184c5bc');
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),Array.from({length:11},(_,i)=>i));
 const contact=anchorTick('push','contact');assert.equal(contact,8);assert.equal(sampleAnimation('push',contact).frame,5);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<11;frame++){
  assert.equal(sampleAnimation('push',tick).frame,frame,'runtime maps push pose '+frame);
  for(const [facing,flip] of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'push',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips.push.frames[frame].duration;
 }
});
test('Paprika selects all five reviewed quadruped rebound poses with a muzzle-height grab at tick5',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-rebound-right.webp',clip=character?.directions?.right?.rebound;
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');
 assert.ok(clip,'Paprika rebound atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,5);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,5);
 assert.equal(clip.provenance.sourceSha256,'7afb8d42e7a9df04ed1573a349d50a83ef1a4c3c2b3fa1837ececf59155fdfc8');
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),[0,1,2,3,4]);
 const grab=anchorTick('rebound','grab');assert.equal(grab,5);assert.equal(sampleAnimation('rebound',grab).frame,3);
 assert.equal(sampleBallForward('rebound',grab,'paprika'),12);assert.equal(sampleBallHeight('rebound',grab,'paprika'),1.15);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<5;frame++){
  assert.equal(sampleAnimation('rebound',tick).frame,frame,'runtime maps rebound pose '+frame);
  for(const [facing,flip] of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'rebound',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips.rebound.frames[frame].duration;
 }
});
test('Paprika selects all ten reviewed quadruped fall poses and recovers at tick33',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-fall-right.webp',clip=character?.directions?.right?.fall;
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');assert.equal(policy.sourceCell,1);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Paprika fall atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,10);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,10);
 assert.equal(clip.provenance.sourceSha256,'e14f4f8f6a3c6e6b600fe1daaf86ff70488c5a30ef3ada727d91f16694a424e0');
 assert.equal(clip.provenance.imageGenerationId,'exec-5140dbf2-c59d-4806-9ef0-0a0607271035');
 assert.equal(clip.provenance.promptVerbatim,true);assert.equal(clip.provenance.sourcePromptStatus,'verbatim');
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),Array.from({length:10},(_,i)=>i));
 assert.equal(anchorTick('fall','finish'),33);assert.equal(sampleAnimation('fall',33).frame,9);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<10;frame++){
  assert.equal(sampleAnimation('fall',tick).frame,frame,'runtime maps fall pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'fall',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips.fall.frames[frame].duration;
 }
});
test('Paprika selects all ten reviewed quadruped celebration poses and finishes at tick65',()=>{
 const character=animationAssetManifest.characters.paprika,policy=animationMirrorPolicy.paprika,atlas='./public/assets/animation/paprika-celebrate-right.webp',clip=character?.directions?.right?.celebrate;
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(policy.canonicalSection,'K.02');assert.equal(policy.sourceCell,1);assert.equal(character.directions.left,undefined);
 assert.ok(clip,'Paprika celebration atlas registration');assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);
 assert.equal(clip.frames.length,10);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,10);
 assert.equal(clip.provenance.sourceSha256,'5b68c8ab04bbce2245808eab1314e0b8483991669eac2c8ebc7fc5090421cf06');
 assert.equal(clip.provenance.imageGenerationId,'exec-289b6e9a-b203-4e11-ae1d-e7bcb97554aa');
 assert.equal(clip.provenance.promptVerbatim,true);assert.equal(clip.provenance.sourcePromptStatus,'verbatim');
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.rejectedAttempts.length,3);
 assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),Array.from({length:10},(_,i)=>i));
 assert.equal(anchorTick('celebrate','finish'),65);assert.equal(sampleAnimation('celebrate',65).frame,9);
 const width=Math.max(...clip.frames.map(frame=>frame.x+frame.w)),height=Math.max(...clip.frames.map(frame=>frame.y+frame.h));
 const images=new Map([[atlas,{complete:true,naturalWidth:width,naturalHeight:height,file:atlas}]]);
 let tick=0;
 for(let frame=0;frame<10;frame++){
  assert.equal(sampleAnimation('celebrate',tick).frame,frame,'runtime maps celebration pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id:'paprika',facing,animation:{clip:'celebrate',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips.celebrate.frames[frame].duration;
 }
});
test('Reed selects all fifteen reviewed power-dunk poses with his canon mirror policy and hand track',()=>{
 const id='reed-ashcroft',character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.['dunk-power'];
 assert.equal(character?.mirrorSafe,true,'Reed retains his approved body mirroring');
 assert.equal(character?.mirrorReview?.status,'reviewed');
 assert.equal(policy?.canonicalSection,'J.01');assert.equal(policy?.sourceCell,0);
 assert.equal(character?.directions?.left,undefined,'use the reviewed right atlas and safe flip');
 assert.ok(clip,'Reed power-dunk atlas registration');assert.equal(clip.reviewed,true);
 assert.equal(clip.src,'./public/assets/animation/reed-ashcroft-dunk-power-right.webp');
 assert.equal(clip.sha256,'80ee8925c3b47c4af872cf3f41abc0df3279fe25f1125899936a27ca1c7b5dce');
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.sourceSha256,'3a1b17b1109e4418a608c0eea9dc8cf42cbeb6b62b96c6f527221b074a1c6fc5');
 assert.equal(clip.provenance.imageGenerationId,'exec-da5fadf0-7af1-42f6-8f92-57b1755d00bc');
 assert.equal(clip.provenance.promptVerbatim,true);assert.equal(clip.provenance.sourcePromptStatus,'verbatim');
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.rejectedAttempts.length,3);
 assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),Array.from({length:15},(_,i)=>i));
 assert.equal(anchorTick('dunk-power','release'),21);assert.equal(anchorTick('dunk-power','finish'),23);
 assert.equal(sampleBallForward('dunk-power',10,id),10.964,'the separate ball reaches Reed’s raised hand at the gather');
 assert.equal(sampleBallHeight('dunk-power',10,id),2.336,'the gather ball stays at Reed’s hand height');
 const images=new Map([[clip.src,{complete:true,naturalWidth:512,naturalHeight:384,file:clip.src}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-power',tick).frame,frame,'runtime maps Reed pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'dunk-power',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-power'].frames[frame].duration;
 }
});
test('Reed selects all fifteen reviewed windmill-dunk poses with his canon mirror policy and hand track',()=>{
 const id='reed-ashcroft',character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.['dunk-windmill'];
 assert.equal(character?.mirrorSafe,true);assert.equal(character?.mirrorReview?.status,'reviewed');
 assert.equal(policy?.canonicalSection,'J.01');assert.equal(policy?.sourceCell,0);assert.equal(character?.directions?.left,undefined);
 assert.ok(clip,'Reed windmill-dunk atlas registration');assert.equal(clip.reviewed,true);
 assert.equal(clip.src,'./public/assets/animation/reed-ashcroft-dunk-windmill-right.webp');
 assert.equal(clip.sha256,'9c062828bc9a7ea25fe14d412b5c574a712de9c4d9b94e7d4cc4a1bcf00aed28');
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.sourceSha256,'a38695c3fa6e76dcef8824a25bfa38b48b009fc4540746265c9a508b8543b596');
 assert.equal(clip.provenance.imageGenerationId,'exec-34036773-7bc2-4918-aede-bcd9bdeb2111');
 assert.equal(clip.provenance.promptVerbatim,true);assert.equal(clip.provenance.sourcePromptStatus,'verbatim');
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.rejectedAttempts.length,1);
 assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),Array.from({length:15},(_,i)=>i));
 assert.equal(anchorTick('dunk-windmill','takeoff'),4);assert.equal(anchorTick('dunk-windmill','grab'),10);
 assert.equal(anchorTick('dunk-windmill','peak'),14);assert.equal(anchorTick('dunk-windmill','release'),21);
 assert.equal(anchorTick('dunk-windmill','finish'),23);assert.equal(anchorTick('dunk-windmill','land'),30);
 assert.equal(sampleBallForward('dunk-windmill',4,id),-10.6,'the low sweep carries behind Reed’s hip');
 assert.equal(sampleBallHeight('dunk-windmill',4,id),1.216);
 const images=new Map([[clip.src,{complete:true,naturalWidth:512,naturalHeight:384,file:clip.src}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-windmill',tick).frame,frame,'runtime maps Reed windmill pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'dunk-windmill',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-windmill'].frames[frame].duration;
 }
});
test('Reed selects all fifteen reviewed reverse-dunk poses with his canon mirror policy and hand track',()=>{
 const id='reed-ashcroft',character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.['dunk-reverse'];
 assert.equal(character?.mirrorSafe,true);assert.equal(character?.mirrorReview?.status,'reviewed');
 assert.equal(policy?.canonicalSection,'J.01');assert.equal(policy?.sourceCell,0);assert.equal(character?.directions?.left,undefined);
 assert.ok(clip,'Reed reverse-dunk atlas registration');assert.equal(clip.reviewed,true);
 assert.equal(clip.src,'./public/assets/animation/reed-ashcroft-dunk-reverse-right.webp');
 assert.equal(clip.sha256,'c50d46d7afb1aa81a7523aaf4124c066a19db26db3b8ff32293036b628bd3efa');
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.sourceSha256,'e43cf79d2b3a2895269286437049ce5cbd14c1af4bea7e7dcc6984fcc51a56f5');
 assert.equal(clip.provenance.imageGenerationId,'exec-c4480382-c010-4ce2-9d04-1ffe7677874d');
 assert.equal(clip.provenance.parentGenerationId,'exec-b2af408e-7e84-428c-9d7b-bf4b2abf8557');
 assert.equal(clip.provenance.promptVerbatim,true);assert.equal(clip.provenance.sourcePromptStatus,'verbatim');
 assert.equal(clip.provenance.componentIsolation,true);assert.equal(clip.provenance.review.status,'accepted');
 assert.equal(clip.provenance.rejectedAttempts.length,1);
 assert.deepEqual(clip.provenance.sourceRects.map(rect=>rect.sourceIndex),Array.from({length:15},(_,i)=>i));
 assert.equal(anchorTick('dunk-reverse','takeoff'),4);assert.equal(anchorTick('dunk-reverse','grab'),10);
 assert.equal(anchorTick('dunk-reverse','peak'),14);assert.equal(anchorTick('dunk-reverse','release'),21);
 assert.equal(anchorTick('dunk-reverse','finish'),23);assert.equal(anchorTick('dunk-reverse','land'),30);
 assert.equal(sampleBallForward('dunk-reverse',17,id),-10.2,'the ball travels behind Reed’s crown');
 assert.equal(sampleBallHeight('dunk-reverse',17,id),2.35);
 const images=new Map([[clip.src,{complete:true,naturalWidth:512,naturalHeight:384,file:clip.src}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('dunk-reverse',tick).frame,frame,'runtime maps Reed reverse-dunk pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'dunk-reverse',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['dunk-reverse'].frames[frame].duration;
 }
});
test('Reed selects all fifteen reviewed power alley-oop poses with his J.01 mirror policy and lob track',()=>{
 const id='reed-ashcroft',character=animationAssetManifest.characters[id],policy=animationMirrorPolicy[id],clip=character?.directions?.right?.['alley-oop-power'];
 assert.equal(character?.mirrorSafe,true);assert.equal(character?.mirrorReview?.status,'reviewed');
 assert.equal(policy?.canonicalSection,'J.01');assert.equal(policy?.sourceCell,0);assert.equal(character?.directions?.left,undefined);
 assert.ok(clip,'Reed alley-oop-power atlas registration');assert.equal(clip.reviewed,true);
 assert.equal(clip.src,'./public/assets/animation/reed-ashcroft-alley-oop-power-right.webp');
 assert.equal(clip.sha256,'0fb58f6690fa720532ade62062387990ebf3938f924332cac2cdd7e0166f8be5');
 assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.sourceSha256,'852a3d903d91b25eb2efe8dcfd62be8913325986e57efa5a532c0823e44e11b2');
 assert.equal(clip.provenance.rawSourceSha256,'1f89eb1f48f57aebac1b57ccfd12ddd0e35150215e0ec469cdfb39f2e7dd97c4');
 assert.equal(clip.provenance.imageGenerationId,'exec-23ac5143-10f0-487a-b366-6daed68703d5');
 assert.equal(clip.provenance.promptVerbatim,true);assert.equal(clip.provenance.sourcePromptStatus,'verbatim');
 assert.equal(clip.provenance.review.status,'accepted');assert.deepEqual(clip.provenance.rejectedAttempts,[]);
 assert.deepEqual(clip.provenance.actionAnchors,{takeoff:4,grab:10,peak:14,release:21,finish:23,land:30});
 const prompt=readFileSync('tools/generate-art/j72-reed-ashcroft-alley-oop-power-prompt.md','utf8');
 assert.equal(clip.provenance.prompt,prompt.slice(prompt.indexOf('Create a new original transparent sprite sheet.')).trimEnd());
 assert.equal(anchorTick('alley-oop-power','grab'),10);assert.equal(anchorTick('alley-oop-power','release'),21);
 assert.equal(sampleBallForward('alley-oop-power',10,id),9.5,'catch ball reaches Reed’s raised hand');
 assert.equal(sampleBallHeight('alley-oop-power',10,id),2.3,'catch ball aligns with Reed’s overhead hand');
 assert.equal(sampleBallForward('alley-oop-power',20,id),11.695,'pre-release ball reaches Reed’s extended hand');
 const images=new Map([[clip.src,{complete:true,naturalWidth:512,naturalHeight:384,file:clip.src}]]);
 let tick=0;
 for(let frame=0;frame<15;frame++){
  assert.equal(sampleAnimation('alley-oop-power',tick).frame,frame,'runtime maps Reed lob pose '+frame);
  for(const [facing,flip]of [[1,false],[-1,true]]){
   const sprite=selectProductionSprite({id,facing,animation:{clip:'alley-oop-power',tick}},{manifest:animationAssetManifest,images});
   assert.equal(sprite?.atlas.file,clip.src);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);
  }
  tick+=animationClips['alley-oop-power'].frames[frame].duration;
 }
});
