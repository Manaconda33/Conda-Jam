import test from 'node:test';
import assert from 'node:assert/strict';
import {flightHeightFromHand} from '../src/core/animation.js';
const {courtMarkings,ballElevation,ballHeightPixels}=await import('../src/render/court-geometry.js').catch(()=>({courtMarkings:()=>({ends:[]}),ballElevation:()=>0,ballHeightPixels:()=>0}));
test('free flight starts at the rendered hand below and above the compressed rim plane',()=>{
 for(const hand of [.2,.55,1.6,2.1,3,3.5])for(const jump of [0,2,5,18]){
  assert.ok(Math.abs(ballElevation(flightHeightFromHand(hand,jump))-ballElevation(hand)-jump*7)<1e-9);
 }
});
test('free throw circle meets the lane end and three point arcs face into the court',()=>{
 const geometry=courtMarkings({hoops:[8,192],arc:50.5,cornerY:6.4});assert.equal(geometry.ends.length,2);
 for(const end of geometry.ends){assert.equal(end.freeThrow.center[0],end.key[1][0]);const mid=(end.threePoint.start+end.threePoint.end)/2;const arcX=end.hoop[0]+Math.cos(mid)*end.threePoint.radius;assert.ok(end.hoop[0]<100?arcX>end.hoop[0]:arcX<end.hoop[0]);
 const [x,y]=end.threePoint.corners[0][1];assert.ok(Math.abs(Math.hypot(x-end.hoop[0],y-50)-50.5)<1e-8,'corner segment must join arc');assert.equal(end.threePoint.corners[0][0][0],end.baseline);}
});
test('rendered basket elevation matches the scoring plane and rises above the floor',()=>{
 const end=courtMarkings({hoops:[8,192],arc:50.5}).ends[0];assert.ok(end?.rimHeight>70,'rim must be raised from floor');assert.equal(end?.rimHeight,ballHeightPixels({mode:'shot',z:2.6}));assert.equal(ballElevation(0),0);assert.ok(ballElevation(25)<160,'high arcs must stay readable');
});
test('carried ball uses the same jump displacement as its owner without stretching it',()=>{
 const owner={z:5};assert.ok(Math.abs(ballHeightPixels({mode:'carried',z:6.2},owner)-ballHeightPixels({mode:'carried',z:1.2},{z:0})-35)<1e-8);
});
test('an aerial pass meets the receiving hand without a visual height jump at grab',()=>{
 const receiver={id:'receiver',z:4.2},incoming={mode:'pass',aerialTargetId:'receiver',z:7.2};
 assert.equal(ballHeightPixels(incoming,receiver),ballHeightPixels({...incoming,mode:'carried'},receiver));
});
