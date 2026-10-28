const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

/**
 * Issue #4's first-pass Jam camera geometry for the 480×360 logical viewport.
 * The values are renderer-only: simulation world coordinates stay 0–200×0–100.
 */
export const JAM_STAGE=Object.freeze({
  viewportWidth:480,
  viewportHeight:360,
  courtLength:200,
  farSidelineY:0,
  nearSidelineY:100,
  floorTop:100,
  floorHeight:260,
  floorHeightPercent:100*260/360,
  courtDepthShearPixels:240,
  // Keep one basket half at readable scale; centered coverage frames expose the stripe.
  standardSlicePercent:50,
  attackCameraApproachRadius:70,
  attackCameraFullFocusRadius:30,
  attackRimScreenOffsetWorld:17,
  hoopAssemblyScale:1.1,
  // Stage-only visual offsets from each endline; the painted court stays unchanged.
  hoopRimBaselineOffsetWorld:4.0,
  hoopBoardBaselineOffsetWorld:2,
  hoopRimRadius:19,
  hoopRimDepthRadius:4.5,
  hoopRimWorldRadius:4.0,
  hoopRimStroke:4,
  hoopNetLength:28,
  hoopBoardWidth:62,
  hoopBoardSpanY:23.5,
  hoopBoardHeight:40,
  hoopRimElevationScale:1.38,
  hoopSupportWidth:9,
  hoopBaseHalfWidth:22,
  // Keep the whole support foot outside the endline, toward the front apron.
  stanchionBaseOffsetWorld:12,
  stanchionBaseHalfSpanY:12,
  stanchionBaseDepthY:60,
  farHorizontalScale:.94,
  nearHorizontalScale:1,
  rendererSpriteScale:2.05,
  rendererTallNonhumanScale:1.4,
  humanSourceSilhouetteRatio:.73,
  farSpriteScale:.84,
  nearSpriteScale:1,
  targetStandingNearHeightPercent:30,
  targetStandingFarHeightPercent:24,
  ballDiameterPixels:19,
  targetBallDiameterPercent:3.5,
  heightProjectionLinear:.88,
  actorElevationPixelsPerWorld:24,
  dunkCourtwardOffsetPixels:30,
});

const normalizedDepth=y=>clamp((Number(y)||0)/JAM_STAGE.nearSidelineY,0,1);

/** Continuous athlete scale from the far sideline to the near sideline. */
export function stageDepthScale(y){
  const depth=normalizedDepth(y);
  return JAM_STAGE.farSpriteScale+(JAM_STAGE.nearSpriteScale-JAM_STAGE.farSpriteScale)*depth;
}

/** Configured near/far sprite scale against the 480×360 logical viewport. */
export function stageStandingHeightPercent(y,sourceHeight=78,zoom=100,silhouetteRatio=JAM_STAGE.humanSourceSilhouetteRatio){
  const zoomFactor=clamp(Number.isFinite(zoom)?zoom/100:1,.5,2);
  return 100*sourceHeight*JAM_STAGE.rendererSpriteScale*stageDepthScale(y)*zoomFactor*silhouetteRatio/JAM_STAGE.viewportHeight;
}

/** Keep oversized/nonhuman silhouettes readable without stretching their anatomy. */
export function stageAthleteScale(player,y,silhouetteRatio=JAM_STAGE.humanSourceSilhouetteRatio){
  const towering=player?.height==='towering';
  const base=towering?JAM_STAGE.rendererTallNonhumanScale:JAM_STAGE.rendererSpriteScale*JAM_STAGE.humanSourceSilhouetteRatio/Math.max(.1,silhouetteRatio);
  return base*stageDepthScale(y);
}

/** Configured in-flight ball diameter as a percentage of viewport width. */
export function stageBallDiameterPercent(width=JAM_STAGE.viewportWidth){
  return 100*JAM_STAGE.ballDiameterPixels/width;
}

/** Convert the authored ball track to screen pixels while matching the stage-only athlete jump lift. */
export function stageBallHeightPixels(authoredHeightPixels,ownerZ=0,flightScale=1){
  const height=Math.max(0,Number(authoredHeightPixels)||0),jump=Math.max(0,Number(ownerZ)||0);
  return height*flightScale+jump*(JAM_STAGE.actorElevationPixelsPerWorld-7*flightScale);
}

/** Percentage of full court length visible at a given court depth. */
export function stageCourtSlicePercent(y=50,width=JAM_STAGE.viewportWidth,zoom=100){
  const depth=normalizedDepth(y);
  const horizontalScale=JAM_STAGE.farHorizontalScale+(JAM_STAGE.nearHorizontalScale-JAM_STAGE.farHorizontalScale)*depth;
  const zoomFactor=clamp(Number.isFinite(zoom)?zoom/100:1,.5,2);
  const pixelsPerWorld=width/(JAM_STAGE.courtLength*(JAM_STAGE.standardSlicePercent/100));
  return 100*width/(pixelsPerWorld*horizontalScale*zoomFactor*JAM_STAGE.courtLength);
}

/** Ease the attack focus so the near rim settles around 70% (right) / 30% (left). */
export function stageCameraFocusX(ballX,basketX,direction){
  const distance=Math.abs(basketX-ballX);
  const approach=clamp((JAM_STAGE.attackCameraApproachRadius-distance)/(JAM_STAGE.attackCameraApproachRadius-JAM_STAGE.attackCameraFullFocusRadius),0,1);
  const attackFocus=basketX-Math.sign(direction||1)*JAM_STAGE.attackRimScreenOffsetWorld;
  return ballX+(attackFocus-ballX)*approach;
}

/** Modest preview-only push-in that follows the authored dunker's apex. */
export function stageAttackZoom(jumpZ){
  return 1+.08*clamp((Number(jumpZ)||0)/5,0,1);
}

/** Ease the preview's court-plane shear between the two attack directions. */
export function stageViewShearDirection(cameraX,attackDirection){
  if(Number.isFinite(attackDirection)&&attackDirection!==0)return Math.sign(attackDirection);
  return clamp((Number(cameraX)-100)/20,-1,1);
}

/** Downward camera pan keeps tall captain sprites below the scoreboard at dunk apex. */
export function stageAttackPanY(jumpZ){
  return 140*clamp((Number(jumpZ)||0)/5,0,1);
}

/** Nudge the airborne dunk presentation court-ward so only the hand reaches across the rim. */
export function stageDunkContactOffsetPixels(jumpZ,facing){
  return -Math.sign(Number(facing)||1)*JAM_STAGE.dunkCourtwardOffsetPixels*clamp((Number(jumpZ)||0)/5,0,1);
}

/**
 * Project one simulation point into the preview court.
 * x follows the scrolling court length; y maps the far-to-near depth band;
 * z remains an independent vertical lift and never changes simulation state.
 */
export function projectJamStagePoint({x,y,z=0,cameraX=100,zoom=100,width=JAM_STAGE.viewportWidth,height=JAM_STAGE.viewportHeight,viewDirection}){
  const depth=normalizedDepth(y);
  const zoomFactor=clamp(Number.isFinite(zoom)?zoom/100:1,.5,2);
  const horizontalScale=JAM_STAGE.farHorizontalScale+(JAM_STAGE.nearHorizontalScale-JAM_STAGE.farHorizontalScale)*depth;
  const pixelsPerWorld=width/(JAM_STAGE.courtLength*(JAM_STAGE.standardSlicePercent/100));
  const normalizedFloor=JAM_STAGE.heightProjectionLinear*depth+(1-JAM_STAGE.heightProjectionLinear)*depth*depth;
  const floorTop=height*(JAM_STAGE.floorTop/JAM_STAGE.viewportHeight);
  const floorHeight=height*(JAM_STAGE.floorHeight/JAM_STAGE.viewportHeight);
  const groundY=height-(height-(floorTop+floorHeight*normalizedFloor))*zoomFactor;
  const shearDirection=stageViewShearDirection(cameraX,viewDirection);
  const centerX=JAM_STAGE.courtLength/2;
  const courtDistance=Number(x)-centerX;
  const cameraOffset=(centerX-cameraX)*pixelsPerWorld*JAM_STAGE.nearHorizontalScale*zoomFactor;
  const courtOffset=courtDistance*pixelsPerWorld*horizontalScale*zoomFactor;
  const shearStrength=clamp(Math.abs(courtDistance)/centerX,0,1);
  const depthShear=(depth-.5)*JAM_STAGE.courtDepthShearPixels*shearDirection*shearStrength*width/JAM_STAGE.viewportWidth;
  const px=width/2+cameraOffset+courtOffset+depthShear;
  const py=groundY-(Number(z)||0)*JAM_STAGE.actorElevationPixelsPerWorld*zoomFactor;
  return [px,py];
}

/** Keep the preview's half-court stripe vertical while the other court lines retain perspective. */
export function stageMidcourtScreenX({cameraX=100,zoom=100,width=JAM_STAGE.viewportWidth,height=JAM_STAGE.viewportHeight,viewDirection}={}){
  return projectJamStagePoint({x:JAM_STAGE.courtLength/2,y:JAM_STAGE.nearSidelineY,z:0,cameraX,zoom,width,height,viewDirection})[0];
}

/**
 * Project the rim, endline-parallel backboard, and fully off-court stanchion.
 */
export function stageHoopGeometry(end,{cameraX=100,zoom=100,width=JAM_STAGE.viewportWidth,height=JAM_STAGE.viewportHeight,viewDirection}={}){
  const projectPoint=point=>projectJamStagePoint({...point,viewDirection});
  const [,worldY]=end.hoop;
  const worldX=end.baseline+end.direction*JAM_STAGE.hoopRimBaselineOffsetWorld;
  const boardWorldX=end.baseline+end.direction*JAM_STAGE.hoopBoardBaselineOffsetWorld;
  const zoomFactor=clamp(Number.isFinite(zoom)?zoom/100:1,.5,2);
  const depthScale=stageDepthScale(worldY);
  const scale=JAM_STAGE.hoopAssemblyScale*depthScale*zoomFactor;
  const [rimFloorX,rimFloorY]=projectPoint({x:worldX,y:worldY,cameraX,zoom,width,height});
  const [boardFloorX]=projectPoint({x:boardWorldX,y:worldY,cameraX,zoom,width,height});
  const [baselineScreenX]=projectPoint({x:end.baseline,y:worldY,cameraX,zoom,width,height});
  const baseOuterWorldX=end.baseline-end.direction*JAM_STAGE.stanchionBaseOffsetWorld;
  const baseWorldX=(end.baseline+baseOuterWorldX)/2;
  const baseWorldY=JAM_STAGE.stanchionBaseDepthY;
  const rimY=rimFloorY-end.rimHeight*JAM_STAGE.hoopRimElevationScale*zoomFactor;
  const boardHeight=JAM_STAGE.hoopBoardHeight*scale;
  const baselineNorth=projectPoint({x:end.baseline,y:0,cameraX,zoom,width,height});
  const baselineSouth=projectPoint({x:end.baseline,y:100,cameraX,zoom,width,height});
  const endlineX=baselineSouth[0]-baselineNorth[0],endlineY=baselineSouth[1]-baselineNorth[1];
  const endlineLength=Math.hypot(endlineX,endlineY)||1;
  const boardSpanPixels=endlineLength*JAM_STAGE.hoopBoardSpanY/100;
  const axisX=endlineX/endlineLength,axisY=endlineY/endlineLength;
  const boardCenter={x:boardFloorX,y:rimY};
  const boardNear={x:boardCenter.x-axisX*boardSpanPixels/2,y:boardCenter.y-axisY*boardSpanPixels/2};
  const boardFar={x:boardCenter.x+axisX*boardSpanPixels/2,y:boardCenter.y+axisY*boardSpanPixels/2};
  const boardQuad=[
    {x:boardFar.x,y:boardFar.y-boardHeight},
    {x:boardNear.x,y:boardNear.y-boardHeight},
    boardNear,
    boardFar,
  ];
  const boardBounds={left:Math.min(...boardQuad.map(p=>p.x)),right:Math.max(...boardQuad.map(p=>p.x)),top:Math.min(...boardQuad.map(p=>p.y)),bottom:Math.max(...boardQuad.map(p=>p.y))};
  const rimPoints=[];
  for(let i=0;i<32;i++){
    const angle=2*Math.PI*i/32;
    const [x,floorY]=projectPoint({
      x:worldX+Math.cos(angle)*JAM_STAGE.hoopRimWorldRadius,
      y:worldY+Math.sin(angle)*JAM_STAGE.hoopRimWorldRadius,
      cameraX,zoom,width,height,
    });
    rimPoints.push({x,y:floorY-end.rimHeight*JAM_STAGE.hoopRimElevationScale*zoomFactor});
  }
  const rimXs=rimPoints.map(p=>p.x),rimYs=rimPoints.map(p=>p.y);
  const rimWidthPixels=Math.max(...rimXs)-Math.min(...rimXs);
  const rimDepthPixels=Math.max(...rimYs)-Math.min(...rimYs);
  const baseCorners=[];
  for(const x of [end.baseline,baseOuterWorldX])for(const y of [baseWorldY-JAM_STAGE.stanchionBaseHalfSpanY,baseWorldY+JAM_STAGE.stanchionBaseHalfSpanY]){
    const [px,py]=projectPoint({x,y,cameraX,zoom,width,height});baseCorners.push({x:px,y:py});
  }
  const baseXs=baseCorners.map(p=>p.x),baseYs=baseCorners.map(p=>p.y);
  const baseBounds={left:Math.min(...baseXs),right:Math.max(...baseXs),top:Math.min(...baseYs),bottom:Math.max(...baseYs)};
  const [baseX,baseY]=projectPoint({x:baseWorldX,y:baseWorldY,cameraX,zoom,width,height});
  const [supportAttachX,supportAttachY]=projectPoint({x:boardWorldX+end.direction*2,y:worldY,cameraX,zoom,width,height});
  const supportAttach={x:supportAttachX,y:supportAttachY-end.rimHeight*.75*zoomFactor};
  return {
    rimX:rimFloorX,
    rimY,
    rimWidthPixels,
    rimDepthPixels,
    rimPoints,
    boardX:boardFloorX,
    boardNear,
    boardFar,
    boardQuad,
    boardBounds,
    baselineScreenX,
    supportAttachX:supportAttach.x,
    supportAttach,
    boardTop:rimY-boardHeight,
    boardWidth:boardBounds.right-boardBounds.left,
    boardAxisLength:boardSpanPixels,
    boardHeight,
    baseX,
    baseY,
    baseWorldX,
    baseWorldY,
    baseOuterWorldX,
    baseCorners,
    baseBounds,
    baseHalfWidth:(baseBounds.right-baseBounds.left)/2,
    supportWidth:JAM_STAGE.hoopSupportWidth*scale,
    netLength:JAM_STAGE.hoopNetLength*scale,
    actorElevationPixelsPerWorld:JAM_STAGE.actorElevationPixelsPerWorld,
    scale,
    rimDepth:worldY,
    supportDepth:baseWorldY,
  };
}
