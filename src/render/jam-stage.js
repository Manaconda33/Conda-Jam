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
  floorTop:152,
  floorHeight:208,
  floorHeightPercent:100*208/360,
  standardSlicePercent:50,
  attackCameraApproachRadius:70,
  attackCameraFullFocusRadius:30,
  attackRimScreenOffsetWorld:18,
  hoopAssemblyScale:1.1,
  // Stage-only visual offsets from each endline; the painted court stays unchanged.
  hoopRimBaselineOffsetWorld:8,
  hoopBoardBaselineOffsetWorld:4.5,
  hoopRimRadius:19,
  hoopRimDepthRadius:4.5,
  hoopRimStroke:4,
  hoopNetLength:28,
  hoopBoardWidth:62,
  hoopBoardHeight:40,
  hoopRimElevationScale:1.38,
  hoopSupportWidth:9,
  hoopBaseHalfWidth:22,
  // Place the foot beyond the baseline near the front apron, inside the frame.
  stanchionBaseOffsetWorld:13.5,
  stanchionBaseDepthY:78,
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

/**
 * Project one simulation point into the preview court.
 * x follows the scrolling court length; y maps the far-to-near depth band;
 * z remains an independent vertical lift and never changes simulation state.
 */
export function projectJamStagePoint({x,y,z=0,cameraX=100,zoom=100,width=JAM_STAGE.viewportWidth,height=JAM_STAGE.viewportHeight}){
  const depth=normalizedDepth(y);
  const zoomFactor=clamp(Number.isFinite(zoom)?zoom/100:1,.5,2);
  const horizontalScale=JAM_STAGE.farHorizontalScale+(JAM_STAGE.nearHorizontalScale-JAM_STAGE.farHorizontalScale)*depth;
  const pixelsPerWorld=width/(JAM_STAGE.courtLength*(JAM_STAGE.standardSlicePercent/100));
  const normalizedFloor=JAM_STAGE.heightProjectionLinear*depth+(1-JAM_STAGE.heightProjectionLinear)*depth*depth;
  const floorTop=height*(JAM_STAGE.floorTop/JAM_STAGE.viewportHeight);
  const floorHeight=height*(JAM_STAGE.floorHeight/JAM_STAGE.viewportHeight);
  const groundY=height-(height-(floorTop+floorHeight*normalizedFloor))*zoomFactor;
  const px=width/2+(x-cameraX)*pixelsPerWorld*horizontalScale*zoomFactor;
  const py=groundY-(Number(z)||0)*7*zoomFactor;
  return [px,py];
}

/**
 * Project the rim, backboard, and foreground stanchion from court anchors.
 * The rim/backboard stay just inside the baseline while the stanchion foot
 * sits beyond that baseline, outside the playing surface.
 */
export function stageHoopGeometry(end,{cameraX=100,zoom=100,width=JAM_STAGE.viewportWidth,height=JAM_STAGE.viewportHeight}={}){
  const [,worldY]=end.hoop;
  const side=-end.direction;
  const worldX=end.baseline+end.direction*JAM_STAGE.hoopRimBaselineOffsetWorld;
  const boardWorldX=end.baseline+end.direction*JAM_STAGE.hoopBoardBaselineOffsetWorld;
  const zoomFactor=clamp(Number.isFinite(zoom)?zoom/100:1,.5,2);
  const depthScale=stageDepthScale(worldY);
  const scale=JAM_STAGE.hoopAssemblyScale*depthScale*zoomFactor;
  const [rimFloorX,rimFloorY]=projectJamStagePoint({x:worldX,y:worldY,cameraX,zoom,width,height});
  const [boardFloorX]=projectJamStagePoint({x:boardWorldX,y:worldY,cameraX,zoom,width,height});
  const [baselineScreenX]=projectJamStagePoint({x:end.baseline,y:worldY,cameraX,zoom,width,height});
  const baseWorldX=end.baseline-end.direction*JAM_STAGE.stanchionBaseOffsetWorld;
  const baseWorldY=JAM_STAGE.stanchionBaseDepthY;
  const [baseX,baseY]=projectJamStagePoint({
    x:baseWorldX,
    y:baseWorldY,
    cameraX,zoom,width,height,
  });
  const rimY=rimFloorY-end.rimHeight*JAM_STAGE.hoopRimElevationScale*zoomFactor;
  const boardHeight=JAM_STAGE.hoopBoardHeight*scale;
  return {
    rimX:rimFloorX,
    rimY,
    rimWidthPixels:(JAM_STAGE.hoopRimRadius*2+JAM_STAGE.hoopRimStroke)*scale,
    rimDepthPixels:JAM_STAGE.hoopRimDepthRadius*2*scale,
    boardX:boardFloorX,
    baselineScreenX,
    supportAttachX:boardFloorX+side*JAM_STAGE.hoopBoardWidth*scale*.42,
    boardTop:rimY-boardHeight,
    boardWidth:JAM_STAGE.hoopBoardWidth*scale,
    boardHeight,
    baseX,
    baseY,
    baseWorldX,
    baseWorldY,
    baseHalfWidth:JAM_STAGE.hoopBaseHalfWidth*scale,
    supportWidth:JAM_STAGE.hoopSupportWidth*scale,
    netLength:JAM_STAGE.hoopNetLength*scale,
    scale,
    rimDepth:worldY,
    supportDepth:baseWorldY,
  };
}
