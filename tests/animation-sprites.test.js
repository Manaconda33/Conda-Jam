import test from 'node:test';
import assert from 'node:assert/strict';
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
