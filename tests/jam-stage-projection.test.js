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
  stageBallHeightPixels,
  stageAttackPanY,
  stageAttackZoom,
  stageDunkContactOffsetPixels,
  stageCameraFocusX,
  stageViewShearDirection,
  stageHoopGeometry,
  stageMidcourtScreenX,
} from '../src/render/jam-stage.js';
import { courtMarkings } from '../src/render/court-geometry.js';

test('Jam stage expands north-south court space without changing athlete scale',()=>{
  const far=projectJamStagePoint({x:120,y:0,cameraX:120});
  const near=projectJamStagePoint({x:120,y:100,cameraX:120});
  assert.equal(far[1],JAM_STAGE.floorTop);
  assert.equal(near[1],JAM_STAGE.viewportHeight);
  assert.ok(JAM_STAGE.floorHeightPercent>=71&&JAM_STAGE.floorHeightPercent<=73);
  assert.equal(near[1]-far[1],260);
  assert.equal(stageDepthScale(0),.84);
  assert.equal(stageDepthScale(100),1);
  assert.ok(Math.abs(stageStandingHeightPercent(0)-27.2363)<.01);
  assert.ok(Math.abs(stageStandingHeightPercent(100)-32.4242)<.01);
  assert.ok(near[1]>far[1]);
});

test('stage jump projection raises the whole athlete by the reference height without scaling the sprite',()=>{
  const ground=projectJamStagePoint({x:100,y:50,z:0,cameraX:100});
  const peak=projectJamStagePoint({x:100,y:50,z:5,cameraX:100});
  assert.equal(ground[1]-peak[1],120);
  assert.equal(stageStandingHeightPercent(50),29.83023333333333);
  const rawAttachedBallHeight=2.4*7+60.564;
  assert.equal(stageBallHeightPixels(rawAttachedBallHeight,2.4,1.82),2.4*24+60.564*1.82);
  assert.equal(stageAttackZoom(0),1);
  assert.equal(stageAttackZoom(2.5),1.04);
  assert.equal(stageAttackZoom(5),1.08);
});

test('preview reveals most of the attacking half while far sideline narrows',()=>{
  const midSlice=stageCourtSlicePercent(50);
  const nearSlice=stageCourtSlicePercent(100);
  assert.ok(Math.abs(nearSlice-50)<1e-8,`near-side slice is ${nearSlice}%`);
  assert.ok(midSlice>=51&&midSlice<=53,`mid-court slice ${midSlice}%`);
  const farLeft=projectJamStagePoint({x:0,y:0,cameraX:100})[0];
  const nearLeft=projectJamStagePoint({x:0,y:100,cameraX:100})[0];
  const farRight=projectJamStagePoint({x:200,y:0,cameraX:100})[0];
  const nearRight=projectJamStagePoint({x:200,y:100,cameraX:100})[0];
  assert.ok(farRight-farLeft<nearRight-nearLeft,'far sideline is shorter than the near sideline');
});

test('the preview half-court stripe stays vertical while other court lines keep perspective',()=>{
  const cameraX=stageCameraFocusX(200,200,1),viewDirection=1;
  const far=projectJamStagePoint({x:100,y:0,cameraX,viewDirection});
  const near=projectJamStagePoint({x:100,y:100,cameraX,viewDirection});
  const centerX=stageMidcourtScreenX({cameraX,viewDirection});
  assert.equal(centerX,near[0],'the vertical stripe remains attached to the visible near-side half-court crossing');
  assert.ok(Math.abs(far[0]-near[0])<1e-9,'the projected court plane keeps the center stripe vertical at both endline crossings');
  assert.ok(Math.abs(centerX-far[0])<1e-9);
  assert.ok(Math.abs(stageDunkContactOffsetPixels(0,1))<1e-9);
  assert.equal(stageDunkContactOffsetPixels(5,1),-30,'the rising dunk body shifts toward midcourt at peak');
  assert.equal(stageDunkContactOffsetPixels(5,-1),30,'mirrored dunks shift toward midcourt');
});

test('north-south perspective shifts court lines and produces a foreshortened endline axis',()=>{
  const far=projectJamStagePoint({x:200,y:0,cameraX:120});
  const near=projectJamStagePoint({x:200,y:100,cameraX:120});
  const expectedEdgeShift=JAM_STAGE.courtDepthShearPixels+(JAM_STAGE.courtLength/2)*(JAM_STAGE.nearHorizontalScale-JAM_STAGE.farHorizontalScale)*(JAM_STAGE.viewportWidth/(JAM_STAGE.courtLength*(JAM_STAGE.standardSlicePercent/100)));
  assert.ok(Math.abs((near[0]-far[0])-expectedEdgeShift)<1e-9,'endline perspective combines shear and far/near court scale');
  assert.ok(JAM_STAGE.courtDepthShearPixels>=220&&JAM_STAGE.courtDepthShearPixels<=250);
  const centerFar=projectJamStagePoint({x:100,y:0,cameraX:120})[0];
  const centerNear=projectJamStagePoint({x:100,y:100,cameraX:120})[0];
  assert.ok(Math.abs(centerNear-centerFar)<1e-9,'the centered vertical stripe has no north-south shear');
  const leftFar=projectJamStagePoint({x:0,y:0,cameraX:80})[0];
  const leftNear=projectJamStagePoint({x:0,y:100,cameraX:80})[0];
  assert.ok(Math.abs((leftNear-leftFar)+expectedEdgeShift)<1e-9);
  const [leftEnd,rightEnd]=courtMarkings().ends;
  for(const [end,direction] of [[leftEnd,-1],[rightEnd,1]]){
    const cameraX=stageCameraFocusX(end.hoop[0],end.hoop[0],direction);
    const hoop=stageHoopGeometry(end,{cameraX,viewDirection:direction});
    const baselineStart=projectJamStagePoint({x:end.baseline,y:0,cameraX,viewDirection:direction});
    const baselineEnd=projectJamStagePoint({x:end.baseline,y:100,cameraX,viewDirection:direction});
    const xy=p=>Array.isArray(p)?p:[p.x,p.y];
    const angle=([a,b])=>{const [ax,ay]=xy(a),[bx,by]=xy(b);return Math.atan2(by-ay,bx-ax)};
    const error=Math.abs(Math.atan2(Math.sin(angle([hoop.boardNear,hoop.boardFar])-angle([baselineStart,baselineEnd])),Math.cos(angle([hoop.boardNear,hoop.boardFar])-angle([baselineStart,baselineEnd]))));
    assert.ok(error<=2*Math.PI/180,`board/endline angle error ${error*180/Math.PI} degrees`);
    assert.ok(hoop.rimPoints.length>=24,'rim has a projected court-plane ellipse');
    assert.ok(hoop.rimDepthPixels/hoop.rimWidthPixels>=.35&&hoop.rimDepthPixels/hoop.rimWidthPixels<=.65,'rim ellipse shows court-plane depth');
  }
});

test('court perspective changes continuously as the attack camera crosses midcourt',()=>{
  assert.equal(stageViewShearDirection(80),-1);
  assert.equal(stageViewShearDirection(120),1);
  assert.ok(Math.abs(stageViewShearDirection(101)-stageViewShearDirection(99))<.11,'camera crossing the midpoint cannot flip court geometry in one frame');
  assert.equal(stageViewShearDirection(101,1),stageViewShearDirection(173,1),'attack camera translation keeps one stable viewing azimuth');
  assert.equal(stageAttackPanY(0),0);
  assert.equal(stageAttackPanY(2.5),21);
  assert.equal(stageAttackPanY(5),42,'apex pan keeps the higher jump clear of the HUD');
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
  assert.equal(rightRim,rightHoop-JAM_STAGE.attackRimScreenOffsetWorld);
  assert.equal(leftRim,leftHoop+JAM_STAGE.attackRimScreenOffsetWorld);
  const pixelsPerWorld=480/(200*(JAM_STAGE.standardSlicePercent/100));
  const rightRimWorldX=JAM_STAGE.courtLength-JAM_STAGE.hoopRimBaselineOffsetWorld;
  const leftRimWorldX=JAM_STAGE.hoopRimBaselineOffsetWorld;
  const rightScreenX=240+(rightRimWorldX-rightRim)*pixelsPerWorld*JAM_STAGE.nearHorizontalScale;
  const leftScreenX=240+(leftRimWorldX-leftRim)*pixelsPerWorld*JAM_STAGE.nearHorizontalScale;
  assert.ok(rightScreenX>=330&&rightScreenX<=360,`right rim at ${rightScreenX}px`);
  assert.ok(leftScreenX>=120&&leftScreenX<=150,`left rim at ${leftScreenX}px`);
  const approaching=stageCameraFocusX(150,200,1);
  assert.ok(approaching>150&&approaching<174,'focus transitions smoothly before reaching the rim');
  assert.equal(stageCameraFocusX(170,200,1),183,'focus settles on the attack framing inside the final 30 world units');
  assert.ok(JAM_STAGE.hoopAssemblyScale>=1&&JAM_STAGE.hoopAssemblyScale<=1.2,'the assembly retains its court-scale geometry');
});

test('stage hoops use court anchors, reference-sized rims, and distinct support depth',()=>{
  const [leftEnd,rightEnd]=courtMarkings().ends;
  const left=stageHoopGeometry(leftEnd,{cameraX:stageCameraFocusX(leftEnd.hoop[0],leftEnd.hoop[0],-1),viewDirection:-1});
  const right=stageHoopGeometry(rightEnd,{cameraX:stageCameraFocusX(rightEnd.hoop[0],rightEnd.hoop[0],1),viewDirection:1});
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
  assert.ok(leftRimMargin>=-4&&leftRimMargin<=1&&rightRimMargin>=-4&&rightRimMargin<=1,'rim edge kisses or slightly crosses the baseline');
  assert.ok(left.boardX-left.boardWidth/2<left.baselineScreenX&&left.boardX+left.boardWidth/2>left.baselineScreenX,'left backboard overlaps the baseline');
  assert.ok(right.boardX-right.boardWidth/2<right.baselineScreenX&&right.boardX+right.boardWidth/2>right.baselineScreenX,'right backboard overlaps the baseline');
  assert.ok(left.supportDepth>left.rimDepth&&right.supportDepth>right.rimDepth,'foreground supports sort in front of the backboard');
  assert.ok(left.baseBounds.left>=0&&right.baseBounds.right<=JAM_STAGE.viewportWidth,'both full off-court bases stay visible in the attack frame');
  assert.ok(left.supportAttach.y<left.baseY&&right.supportAttach.y<right.baseY,'support bars rise from the off-court base to the rim assembly');
  assert.ok(left.boardAxisLength/left.boardHeight>=1.5&&left.boardAxisLength/left.boardHeight<=2.2,'backboard face keeps a landscape arcade silhouette along the endline');
  assert.ok(left.rimX-left.rimWidthPixels/2>=0&&right.rimX+right.rimWidthPixels/2<=JAM_STAGE.viewportWidth,'both rims remain inside the attack frame');
  assert.ok(left.boardWidth<80&&right.boardWidth<80,'the board avoids the former full-screen enlargement');
  for(const hoop of [left,right]){
    const points=[...hoop.rimPoints,...hoop.boardQuad,...hoop.baseCorners,hoop.supportAttach];
    const minX=Math.min(...points.map(p=>p.x)),maxX=Math.max(...points.map(p=>p.x));
    const assemblyWidthPercent=100*(maxX-minX)/JAM_STAGE.viewportWidth;
    const assemblyPoints=[...hoop.rimPoints,...hoop.boardQuad,...hoop.baseCorners];
    const assemblyHeightPercent=100*(Math.max(...assemblyPoints.map(p=>p.y))-Math.min(...assemblyPoints.map(p=>p.y)))/JAM_STAGE.viewportHeight;
    const boardWidthPercent=100*hoop.boardWidth/JAM_STAGE.viewportWidth;
    assert.ok(assemblyWidthPercent>=30&&assemblyWidthPercent<=50,`assembly is ${assemblyWidthPercent.toFixed(1)}% W`);
    assert.ok(assemblyHeightPercent>=55&&assemblyHeightPercent<=66,`assembly is ${assemblyHeightPercent.toFixed(1)}% H`);
    assert.ok(boardWidthPercent>=12&&boardWidthPercent<=16,`board is ${boardWidthPercent.toFixed(1)}% W`);
  }
});
