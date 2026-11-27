import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,stepMatch} from '../src/core/simulation.js';
import {animationAssetManifest} from '../src/content/animation-assets.js';
import {teams} from '../src/content/teams.js';
import {ballDrawDepth,selectProductionSprite} from '../src/render/animation-sprites.js';

const team=id=>teams.find(t=>t.id===id);
function fixture(facing=1){
 const m=createMatch({home:team('blueglass-knights'),away:team('scoria-rams'),quarterSeconds:180,seed:1});
 const myth=m.players.find(p=>p.id==='myth'),holder=m.players.find(p=>p.id==='krios');
 Object.assign(myth,{x:100,y:76,z:0,vx:0,vy:0,facing,hasBall:false,stun:0,animation:{clip:'idle',tick:0},anim:'idle'});
 for(const p of m.players)if(p!==myth)Object.assign(p,{x:p===holder?100+facing*7.2:170,y:p===holder?73:12,z:0,vx:0,vy:0,facing:-facing,hasBall:p===holder,stun:p===holder?0:999,animation:{clip:p===holder?'idle-ball':'idle',tick:0},anim:p===holder?'idle-ball':'idle'});
 Object.assign(m,{possession:holder.team,rng:1});
 Object.assign(m.ball,{mode:'carried',ownerId:holder.id,lastTouch:holder.id,targetId:null,x:holder.x-facing*3,y:holder.y,z:1.1,vx:0,vy:0,vz:0});
 const tick=(stealPressed=false)=>stepMatch(m,m.players.map(p=>({playerId:p.id,stealPressed:p===myth&&stealPressed})));
 return {m,myth,holder,tick};
}

test('Myth poke retains tick-10 recovery and drops the cue before another steal',()=>{
 for(const facing of [1,-1]){
  const {m,myth,holder,tick}=fixture(facing);
  tick(true);
  for(let t=1;t<=5;t++)tick();
  assert.equal(myth.steals,1);
  assert.equal(myth.animation.tick,0);
  assert.equal(myth.animation.renderCue,'poke-recovery');
  assert.equal(m.ball.ownerId,null);
  assert.equal(m.ball.mode,'loose');
  assert.ok(Math.abs(m.ball.x-(100+facing*1.92))<1e-8);
  for(let t=6;t<10;t++){tick();assert.equal(m.ball.ownerId,null);}
  tick();assert.equal(m.ball.ownerId,myth.id);assert.equal(myth.animation.tick,5);
  for(let t=11;t<=22;t++)tick();
  assert.equal(myth.animation.clip,'idle-ball');assert.equal(myth.animation.renderCue,undefined);
  Object.assign(myth,{hasBall:false});Object.assign(holder,{hasBall:true,stun:0,x:100+facing*12});
  m.possession=holder.team;Object.assign(m.ball,{mode:'carried',ownerId:holder.id});
  tick(true);assert.equal(myth.animation.clip,'steal');assert.equal(myth.animation.renderCue,undefined);
 }
});

test('Interception keeps the steal clock and selects the receive art only with the cue',()=>{
 const {m,myth,holder,tick}=fixture();
 holder.hasBall=false;
 Object.assign(m.ball,{mode:'pass',ownerId:null,lastTouch:holder.id,targetId:null,x:myth.x+4.9,y:myth.y,z:1.32,vx:-.52,vy:0,vz:.07});
 tick();assert.equal(myth.animation.renderCue,'interception');
 for(let t=1;t<=5;t++)tick();
 assert.equal(myth.animation.clip,'steal');assert.equal(myth.animation.tick,5);
 assert.equal(m.ball.ownerId,myth.id);assert.equal(myth.steals,1);
 const clips=animationAssetManifest.characters.myth.directions.right;
 const image=(w,h)=>({complete:true,naturalWidth:w,naturalHeight:h});
 const images=new Map([[clips.steal.src,image(384,192)],[clips.receive.src,image(192,192)]]);
 for(const facing of [1,-1]){
  const player={...myth,facing,captain:true};
  const read=animation=>selectProductionSprite({...player,animation},{manifest:animationAssetManifest,images});
  assert.equal(read(player.animation).src,clips.receive.src);
  assert.equal(read(player.animation).frame,2);
  assert.equal(read(player.animation).flip,facing<0);
  assert.equal(read({clip:'steal',tick:0,renderCue:'poke-recovery'}).frame,3);
  assert.equal(read({clip:'steal',tick:5,renderCue:'poke-recovery'}).frame,4);
  assert.equal(read({clip:'steal',tick:0}).frame,0);
 }
});

test('Loose-ball depth override lasts only the first two Myth recovery draws',()=>{
 const ball={mode:'loose',lastTouch:'myth',x:102,y:75,z:1.2};
 const myth=tick=>({id:'myth',x:100,y:76,z:0,animation:{clip:'steal',renderCue:'poke-recovery',tick}});
 assert.equal(ballDrawDepth(ball,[myth(0)]),76.01);
 assert.equal(ballDrawDepth(ball,[myth(1)]),76.01);
 assert.equal(ballDrawDepth(ball,[myth(2)]),74.5);
 assert.equal(ballDrawDepth({...ball,lastTouch:'krios'},[myth(0)]),74.5);
 assert.equal(ballDrawDepth({...ball,x:110},[myth(0)]),74.5);
});
