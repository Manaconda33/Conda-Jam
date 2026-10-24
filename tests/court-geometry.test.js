import test from 'node:test';
import assert from 'node:assert/strict';
import {flightHeightFromHand} from '../src/core/animation.js';
import {court} from '../src/core/simulation.js';
const {courtMarkings,ballElevation,ballHeightPixels}=await import('../src/render/court-geometry.js').catch(()=>({courtMarkings:()=>({ends:[]}),ballElevation:()=>0,ballHeightPixels:()=>0}));
test('free flight starts at the rendered hand below and above the compressed rim plane',()=>{
 for(const hand of [.2,.55,1.6,2.1,3,3.5])for(const jump of [0,2,5,18]){
  assert.ok(Math.abs(ballElevation(flightHeightFromHand(hand,jump))-ballElevation(hand)-jump*7)<1e-9);
 }
});
test('court markings map regulation hoop, lane and elliptical three-point dimensions',()=>{
 const geometry=courtMarkings(court);assert.equal(geometry.ends.length,2);const [left,right]=geometry.ends;
 assert.ok(Math.abs(left.hoop[0]-200*5.25/94)<1e-9,'rim center is 5.25 ft from baseline');
 assert.ok(Math.abs(left.board[0]-200*4/94)<1e-9,'backboard face is 4 ft from baseline');
 assert.ok(Math.abs(left.key[1][0]-200*19/94)<1e-9,'lane ends at the 19 ft free throw line');
 assert.ok(Math.abs(left.key[2][1]-left.key[1][1]-100*16/50)<1e-9,'lane is 16 ft wide');
 assert.ok(Math.abs(left.threePoint.radiusX-200*23.75/94)<1e-9);
 assert.ok(Math.abs(left.threePoint.radiusY-100*23.75/50)<1e-9);
 assert.equal(left.freeThrow.center[0],left.key[1][0]);
 for(const end of geometry.ends){
  const mid=(end.threePoint.start+end.threePoint.end)/2;
  const arcX=end.hoop[0]+Math.cos(mid)*end.threePoint.radiusX;
  assert.ok(end.hoop[0]<100?arcX>end.hoop[0]:arcX<end.hoop[0],'three-point arc faces into the court');
  const [x,y]=end.threePoint.corners[0][1];
  assert.ok(Math.abs(((x-end.hoop[0])/end.threePoint.radiusX)**2+((y-50)/end.threePoint.radiusY)**2-1)<1e-9,'corner segment joins the regulation arc');
  assert.equal(end.threePoint.corners[0][0][0],end.baseline);
 }
 assert.ok(Math.abs(left.hoop[0]+right.hoop[0]-200)<1e-9,'hoops mirror across half court');
});
test('rendered basket elevation matches the scoring plane and rises above the floor',()=>{
 const end=courtMarkings(court).ends[0];assert.ok(end?.rimHeight>70,'rim must be raised from floor');assert.equal(end?.rimHeight,ballHeightPixels({mode:'shot',z:2.6}));assert.equal(ballElevation(0),0);assert.ok(ballElevation(25)<160,'high arcs must stay readable');
});
test('carried ball uses the same jump displacement as its owner without stretching it',()=>{
 const owner={z:5};assert.ok(Math.abs(ballHeightPixels({mode:'carried',z:6.2},owner)-ballHeightPixels({mode:'carried',z:1.2},{z:0})-35)<1e-8);
});
test('an aerial pass meets the receiving hand without a visual height jump at grab',()=>{
 const receiver={id:'receiver',z:4.2},incoming={mode:'pass',aerialTargetId:'receiver',z:7.2};
 assert.equal(ballHeightPixels(incoming,receiver),ballHeightPixels({...incoming,mode:'carried'},receiver));
});
