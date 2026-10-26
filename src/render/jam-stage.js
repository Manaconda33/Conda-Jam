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
  attackRimScreenOffsetWorld:26,
  hoopAssemblyScale:1.9,
  stanchionBaseY:55,
  stanchionBaseOffsetWorld:0,
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

/** Ease the attack focus so the near rim settles around 75% (right) / 25% (left). */
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
