import test from 'node:test';
import assert from 'node:assert/strict';
import {
  JAM_STAGE,
  stageBallDiameterPercent,
  projectJamStagePoint,
  stageCourtSlicePercent,
  stageDepthScale,
  stageAthleteScale,
  stageStandingHeightPercent,
  stageCameraFocusX,
} from '../src/render/jam-stage.js';

test('Jam stage projects the court into a low floor band',()=>{
  const far=projectJamStagePoint({x:100,y:0,cameraX:100});
  const near=projectJamStagePoint({x:100,y:100,cameraX:100});
  assert.equal(far[1],JAM_STAGE.floorTop);
  assert.equal(near[1],JAM_STAGE.viewportHeight);
  assert.ok(JAM_STAGE.floorHeightPercent>=55&&JAM_STAGE.floorHeightPercent<=60);
  assert.ok(near[1]>far[1]);
});

test('standard stage slice is about half the court and far sideline narrows',()=>{
  const midSlice=stageCourtSlicePercent(50);
  assert.ok(midSlice>=48&&midSlice<=52,`mid-court slice ${midSlice}%`);
  const farLeft=projectJamStagePoint({x:0,y:0,cameraX:100})[0];
  const nearLeft=projectJamStagePoint({x:0,y:100,cameraX:100})[0];
  const farRight=projectJamStagePoint({x:200,y:0,cameraX:100})[0];
  const nearRight=projectJamStagePoint({x:200,y:100,cameraX:100})[0];
  assert.ok(farRight-farLeft<nearRight-nearLeft,'far sideline is shorter than the near sideline');
});

test('depth scale matches Issue 4 near/far ratio and height responds to zoom',()=>{
  const ratio=stageDepthScale(0)/stageDepthScale(100);
  assert.ok(ratio>=.82&&ratio<=.88,`far-to-near scale ratio ${ratio}`);
  const standard=projectJamStagePoint({x:100,y:50,z:5,cameraX:100,zoom:100});
  const close=projectJamStagePoint({x:100,y:50,z:5,cameraX:100,zoom:120});
  assert.ok(close[1]<standard[1],'higher camera zoom raises projected height');
});

test('configured sprite and ball sizes reach the landscape staging targets',()=>{
  const near=stageStandingHeightPercent(100),far=stageStandingHeightPercent(0),ball=stageBallDiameterPercent();
  assert.ok(near>=30&&near<=36,`near standing sprite is ${near}% H`);
  assert.ok(far>=24&&far<=30,`far standing sprite is ${far}% H`);
  assert.ok(ball>=3.5&&ball<=4.5,`ball diameter is ${ball}% W`);
  assert.equal(JAM_STAGE.targetStandingNearHeightPercent,30);
  assert.equal(JAM_STAGE.targetStandingFarHeightPercent,24);
  assert.equal(JAM_STAGE.targetBallDiameterPercent,3.5);
});

test('human stage scale compensates for authored alpha padding without distorting sprites',()=>{
  const sparse=stageAthleteScale({height:'tall'},100,.73)*.73;
  const dense=stageAthleteScale({height:'tall'},100,.958)*.958;
  assert.ok(Math.abs(sparse-dense)<1e-12,'both source crops produce the same visible standing height');
  assert.ok(stageAthleteScale({height:'towering'},100,.812)<stageAthleteScale({height:'tall'},100,.812),'towering nonhuman keeps its narrower stage scale');
});

test('attack camera frames either rim symmetrically and eases into the approach',()=>{
  const rightRim=stageCameraFocusX(200,200,1);
  const leftRim=stageCameraFocusX(0,0,-1);
  assert.equal(rightRim,174);
  assert.equal(leftRim,26);
  const pixelsPerWorld=480/(200*(JAM_STAGE.standardSlicePercent/100));
  const rightScreenX=240+(200-rightRim)*pixelsPerWorld*JAM_STAGE.nearHorizontalScale;
  const leftScreenX=240+(0-leftRim)*pixelsPerWorld*JAM_STAGE.nearHorizontalScale;
  assert.ok(rightScreenX>=360&&rightScreenX<=370,`right rim at ${rightScreenX}px`);
  assert.ok(leftScreenX>=110&&leftScreenX<=120,`left rim at ${leftScreenX}px`);
  const approaching=stageCameraFocusX(150,200,1);
  assert.ok(approaching>150&&approaching<174,'focus transitions smoothly before reaching the rim');
  assert.equal(stageCameraFocusX(170,200,1),174,'focus settles on the attack framing inside the final 30 world units');
  assert.ok(JAM_STAGE.hoopAssemblyScale>=1.9,'the stage hoop meets the 30% assembly-width floor after uniform scale-up');
});
