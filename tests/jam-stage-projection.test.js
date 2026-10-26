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
  stageHoopGeometry,
} from '../src/render/jam-stage.js';
import { courtMarkings } from '../src/render/court-geometry.js';

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
  const leftHoop=200*5.25/94,rightHoop=200*(1-5.25/94);
  const rightRim=stageCameraFocusX(rightHoop,rightHoop,1);
  const leftRim=stageCameraFocusX(leftHoop,leftHoop,-1);
  assert.equal(rightRim,rightHoop-18);
  assert.equal(leftRim,leftHoop+18);
  const pixelsPerWorld=480/(200*(JAM_STAGE.standardSlicePercent/100));
  const rightRimWorldX=JAM_STAGE.courtLength-JAM_STAGE.hoopRimBaselineOffsetWorld;
  const leftRimWorldX=JAM_STAGE.hoopRimBaselineOffsetWorld;
  const rightScreenX=240+(rightRimWorldX-rightRim)*pixelsPerWorld*JAM_STAGE.nearHorizontalScale;
  const leftScreenX=240+(leftRimWorldX-leftRim)*pixelsPerWorld*JAM_STAGE.nearHorizontalScale;
  assert.ok(rightScreenX>=330&&rightScreenX<=350,`right rim at ${rightScreenX}px`);
  assert.ok(leftScreenX>=130&&leftScreenX<=150,`left rim at ${leftScreenX}px`);
  const approaching=stageCameraFocusX(150,200,1);
  assert.ok(approaching>150&&approaching<174,'focus transitions smoothly before reaching the rim');
  assert.equal(stageCameraFocusX(170,200,1),182,'focus settles on the attack framing inside the final 30 world units');
  assert.ok(JAM_STAGE.hoopAssemblyScale>=1&&JAM_STAGE.hoopAssemblyScale<=1.2,'the assembly retains its court-scale geometry');
});

test('stage hoops use court anchors, reference-sized rims, and distinct support depth',()=>{
  const [leftEnd,rightEnd]=courtMarkings().ends;
  const left=stageHoopGeometry(leftEnd,{cameraX:stageCameraFocusX(leftEnd.hoop[0],leftEnd.hoop[0],-1)});
  const right=stageHoopGeometry(rightEnd,{cameraX:stageCameraFocusX(rightEnd.hoop[0],rightEnd.hoop[0],1)});
  const playerHeight=JAM_STAGE.viewportHeight*stageStandingHeightPercent(50)/100;
  const rimPlayerRatio=right.rimWidthPixels/playerHeight;
  assert.ok(rimPlayerRatio>=.36&&rimPlayerRatio<=.47,`rim is ${rimPlayerRatio.toFixed(2)} of a standing player`);
  const leftRimPercent=100*left.rimX/JAM_STAGE.viewportWidth,rightRimPercent=100*right.rimX/JAM_STAGE.viewportWidth;
  assert.ok(leftRimPercent>=20&&leftRimPercent<=30,`left attack rim is at ${leftRimPercent.toFixed(1)}% W`);
  assert.ok(rightRimPercent>=70&&rightRimPercent<=80,`right attack rim is at ${rightRimPercent.toFixed(1)}% W`);
  assert.ok(left.boardX<left.rimX&&right.boardX>right.rimX,'backboards project from their own court anchors');
  assert.ok(left.baseWorldX<0&&right.baseWorldX>JAM_STAGE.courtLength,'stanchion bases sit beyond their baselines');
  assert.equal(left.baseWorldY,JAM_STAGE.stanchionBaseDepthY,'left support base sits toward the near apron');
  assert.equal(right.baseWorldY,JAM_STAGE.stanchionBaseDepthY,'right support base sits toward the near apron');
  assert.ok(left.baseX<left.baselineScreenX&&right.baseX>right.baselineScreenX,'support bases render beyond the out-of-bounds lines');
  const leftRimMargin=left.rimX-left.rimWidthPixels/2-left.baselineScreenX;
  const rightRimMargin=right.baselineScreenX-(right.rimX+right.rimWidthPixels/2);
  assert.ok(leftRimMargin>=12&&leftRimMargin<=20&&rightRimMargin>=12&&rightRimMargin<=20,'rim edges sit just inside the baseline');
  assert.ok(left.boardX-left.boardWidth/2<left.baselineScreenX&&left.boardX+left.boardWidth/2>left.baselineScreenX,'left backboard overlaps the baseline');
  assert.ok(right.boardX-right.boardWidth/2<right.baselineScreenX&&right.boardX+right.boardWidth/2>right.baselineScreenX,'right backboard overlaps the baseline');
  assert.ok(left.supportDepth>left.rimDepth&&right.supportDepth>right.rimDepth,'foreground supports sort in front of the backboard');
  assert.ok(left.baseX-left.baseHalfWidth>=0&&right.baseX+right.baseHalfWidth<=JAM_STAGE.viewportWidth,'both full off-court bases stay visible in the attack frame');
  assert.ok(left.supportAttachX<left.rimX-left.rimWidthPixels/2&&right.supportAttachX>right.rimX+right.rimWidthPixels/2,'support attaches outside the rim on both sides');
  assert.ok(left.boardWidth/left.boardHeight>=1.5&&left.boardWidth/left.boardHeight<=1.7,'backboard keeps a landscape arcade silhouette');
  assert.ok(left.rimX-left.rimWidthPixels/2>=0&&right.rimX+right.rimWidthPixels/2<=JAM_STAGE.viewportWidth,'both rims remain inside the attack frame');
  assert.ok(left.boardWidth<80&&right.boardWidth<80,'the board avoids the former full-screen enlargement');
  for(const hoop of [left,right]){
    const minX=Math.min(hoop.rimX-hoop.rimWidthPixels/2,hoop.boardX-hoop.boardWidth/2,hoop.baseX-hoop.baseHalfWidth,hoop.supportAttachX);
    const maxX=Math.max(hoop.rimX+hoop.rimWidthPixels/2,hoop.boardX+hoop.boardWidth/2,hoop.baseX+hoop.baseHalfWidth,hoop.supportAttachX);
    const assemblyWidthPercent=100*(maxX-minX)/JAM_STAGE.viewportWidth;
    const assemblyHeightPercent=100*(hoop.baseY+2*hoop.scale-hoop.boardTop)/JAM_STAGE.viewportHeight;
    const boardWidthPercent=100*hoop.boardWidth/JAM_STAGE.viewportWidth;
    assert.ok(assemblyWidthPercent>=30&&assemblyWidthPercent<=50,`assembly is ${assemblyWidthPercent.toFixed(1)}% W`);
    assert.ok(assemblyHeightPercent>=55&&assemblyHeightPercent<=66,`assembly is ${assemblyHeightPercent.toFixed(1)}% H`);
    assert.ok(boardWidthPercent>=12&&boardWidthPercent<=16,`board is ${boardWidthPercent.toFixed(1)}% W`);
  }
});
