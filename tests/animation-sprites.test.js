import test from 'node:test';
import assert from 'node:assert/strict';
import {athleteVisualScale,ballDrawDepth} from '../src/render/animation-sprites.js';
import {animationAssetManifest} from '../src/content/animation-assets.js';
import {animationMirrorPolicy} from '../src/content/animation-mirror-policy.js';
import {animationClips,anchorTick} from '../src/core/animation.js';
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
