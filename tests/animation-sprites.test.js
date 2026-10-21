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
