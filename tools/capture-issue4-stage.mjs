import fs from 'node:fs/promises';
import playwright from 'file:///opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js';
import { sampleBallForward, sampleBallHeight, flightHeightFromHand } from '../src/core/animation.js';
import { court } from '../src/core/simulation.js';
import { courtMarkings } from '../src/render/court-geometry.js';
import { JAM_STAGE, projectJamStagePoint, stageCameraFocusX, stageCourtSlicePercent, stageDunkContactOffsetPixels, stageHoopGeometry, stageStandingHeightPercent } from '../src/render/jam-stage.js';
const {chromium}=playwright;
const out='/workspace/Conda-Jam/artifacts/screenshots/issue4-stage';await fs.mkdir(out,{recursive:true});
const baseURL=process.env.JAM_STAGE_CAPTURE_URL??'http://localhost:4173';
const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:1200,height:900},deviceScaleFactor:1});
await context.addInitScript(()=>{localStorage.setItem('jamverse96-v5',JSON.stringify({audioCaptions:false,screenShake:false,reducedFlash:true,teamMarkers:false,cameraZoom:100,home:'chicago-condas',away:'crownfire-sovereigns'}));window.requestAnimationFrame=()=>0;window.cancelAnimationFrame=()=>{};});
const page=await context.newPage(),errors=[],captures={};page.on('pageerror',e=>errors.push(String(e)));
await page.goto(`${baseURL}/?stagePreview=1`);await page.waitForFunction('Boolean(window.jamverse)');
await page.evaluate("window.jamverse.start('chicago-condas','crownfire-sovereigns',60,1101)");await page.waitForTimeout(700);
await page.waitForFunction("document.querySelector('#game').dataset.gameplayArt==='generated-full-roster-atlases'");
async function stage(name,scene,portrait=false){
 if(portrait)await page.setViewportSize({width:390,height:844}); else await page.setViewportSize({width:1200,height:900});
 if(!Object.hasOwn(scene,'ballX')&&!scene.carried)scene.ballX=scene.x+scene.facing*sampleBallForward(scene.clip,scene.tick,scene.player);
 await page.evaluate(({scene})=>{
  const m=window.jamverse.state;for(const p of m.players){p.vx=p.vy=p.vz=0;p.z=0;p.hasBall=false;p.facing=p.team===0?1:-1;p.anim='idle';p.animation={clip:'idle-ball',tick:0};}
  const get=id=>m.players.find(p=>p.id===id);const player=get(scene.player);
  player.x=scene.x;player.y=scene.y;player.z=scene.z??0;player.facing=scene.facing??1;player.anim=scene.clip;player.animation={clip:scene.clip,tick:scene.tick};player.hasBall=Boolean(scene.carried);
  if(scene.clip==='shoot'||scene.clip.startsWith('dunk-'))player.animation.action={kind:scene.clip==='shoot'?'shot':'dunk',startX:scene.takeoffX??scene.x,startY:scene.takeoffY??scene.y};
  if(scene.defenders)for(const [id,x,y,z=0] of scene.defenders){const d=get(id);d.x=x;d.y=y;d.z=z;d.anim='idle';d.animation={clip:'idle-ball',tick:0};}
  if(scene.carried){m.ball.mode='carried';m.ball.ownerId=player.id;m.ball.aerialTargetId=null;m.ball.x=player.x+(scene.ballDx??8)*player.facing;m.ball.y=player.y;m.ball.z=player.z+(scene.ballDz??1);m.ball.vx=0;m.ball.vy=0;}
  else {m.ball.mode='shot';m.ball.ownerId=null;m.ball.aerialTargetId=null;m.ball.lastTouch=player.id;m.ball.attemptId=`preview-${scene.player}-${scene.tick}`;m.ball.x=scene.ballX;m.ball.y=scene.ballY??player.y;m.ball.z=scene.ballZ??4;m.ball.vx=scene.ballVx??0;m.ball.vy=0;}
  m.lastEvent='';m.pause=false;m.phase='playing';
 },{scene});
 // Call the regular render path with zero simulation ticks until the stage camera settles at the target.
 await page.evaluate(()=>{for(let i=0;i<240;i++)window.jamverse.tick(0)});
 if(portrait)await page.screenshot({path:`${out}/${name}.png`});
 else {const data=await page.locator('#game').evaluate(e=>e.toDataURL('image/png'));await fs.writeFile(`${out}/${name}.png`,Buffer.from(data.split(',')[1],'base64'));}
 captures[name]={scene,previewFlag:await page.locator('#game').getAttribute('data-stage-preview'),state:await page.evaluate(()=>({players:window.jamverse.state.players.map(p=>({id:p.id,x:p.x,y:p.y,z:p.z,facing:p.facing,clip:p.animation.clip,tick:p.animation.tick})),ball:{mode:window.jamverse.state.ball.mode,x:window.jamverse.state.ball.x,y:window.jamverse.state.ball.y,z:window.jamverse.state.ball.z,ownerId:window.jamverse.state.ball.ownerId}}))};
}
await stage('a-near-dribble',{player:'reed-ashcroft',x:100,y:82,clip:'dribble',tick:15,carried:true,ballDx:sampleBallForward('dribble',15,'reed-ashcroft'),ballDz:sampleBallHeight('dribble',15,'reed-ashcroft'),defenders:[['manaconda',78,86],['dragon-queen',80,22],['auric-scale',132,18]]});
await stage('b-right-dunk-peak',{player:'reed-ashcroft',x:178,y:72,takeoffX:150,takeoffY:72,z:5,facing:1,clip:'dunk-power',tick:14,carried:true,ballDx:sampleBallForward('dunk-power',14,'reed-ashcroft'),ballDz:sampleBallHeight('dunk-power',14,'reed-ashcroft'),defenders:[['manaconda',150,25],['dragon-queen',158,24],['auric-scale',162,36]]});
await stage('c-left-shot-release',{player:'reed-ashcroft',x:33,y:63,z:2.2,facing:-1,clip:'shoot',tick:13,carried:false,ballY:63,ballZ:flightHeightFromHand(sampleBallHeight('shoot',13,'reed-ashcroft'),2.2),ballVx:-.15,defenders:[['manaconda',53,26],['auric-scale',55,74],['dragon-queen',63,45]]});
await stage('d-portrait-play',{player:'reed-ashcroft',x:100,y:82,clip:'dribble',tick:15,carried:true,ballDx:sampleBallForward('dribble',15,'reed-ashcroft'),ballDz:sampleBallHeight('dribble',15,'reed-ashcroft'),defenders:[['manaconda',78,86],['dragon-queen',80,22],['auric-scale',132,18]]},true);
await page.setViewportSize({width:1200,height:900});
const cameraSequence=[];
async function dunkCameraFrame(name,x,z,tick){
 const scene={player:'reed-ashcroft',x,y:72,takeoffX:150,takeoffY:72,z,facing:1,clip:'dunk-power',tick,carried:true,ballDx:sampleBallForward('dunk-power',tick,'reed-ashcroft'),ballDz:sampleBallHeight('dunk-power',tick,'reed-ashcroft')};
 const camera=await page.evaluate(({scene})=>{
  const m=window.jamverse.state;for(const p of m.players){p.vx=p.vy=p.vz=0;p.z=0;p.hasBall=false;p.anim='idle';p.animation={clip:'idle-ball',tick:0};}
  const player=m.players.find(p=>p.id===scene.player);player.x=scene.x;player.y=scene.y;player.z=scene.z;player.facing=scene.facing;player.anim=scene.clip;player.animation={clip:scene.clip,tick:scene.tick,action:{kind:'dunk',startX:scene.takeoffX,startY:scene.takeoffY}};player.hasBall=true;
  m.ball.mode='carried';m.ball.ownerId=player.id;m.ball.aerialTargetId=null;m.ball.x=player.x+scene.ballDx*player.facing;m.ball.y=player.y;m.ball.z=player.z+scene.ballDz;m.ball.vx=m.ball.vy=0;
  const before=Number(document.querySelector('#game').dataset.stageCameraX);for(let i=0;i<20;i++)window.jamverse.tick(0);
  return{cameraXBefore:before,cameraXAfter:Number(document.querySelector('#game').dataset.stageCameraX),playerX:player.x,playerZ:player.z,clip:player.animation.clip,tick:player.animation.tick};
 },{scene});
 const path=`${out}/${name}.png`,data=await page.locator('#game').evaluate(e=>e.toDataURL('image/png'));await fs.writeFile(path,Buffer.from(data.split(',')[1],'base64'));
 cameraSequence.push({name,...camera});captures[name]={scene,camera};
}
await dunkCameraFrame('e-dunk-approach',150,0,3);
await dunkCameraFrame('f-dunk-launch',168,2,8);
await dunkCameraFrame('g-dunk-apex',178,5,14);
await dunkCameraFrame('h-dunk-recovery',174,1,20);
function measureHoop(end,direction){
 const cameraX=stageCameraFocusX(end.hoop[0],end.hoop[0],direction);
 const g=stageHoopGeometry(end,{cameraX,viewDirection:direction});
 const points=[...g.rimPoints,...g.boardQuad,...g.baseCorners,g.supportAttach];
 const xs=points.map(p=>p.x),ys=points.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
 const baselineNorth=projectJamStagePoint({x:end.baseline,y:0,cameraX,viewDirection:direction}),baselineSouth=projectJamStagePoint({x:end.baseline,y:100,cameraX,viewDirection:direction});
 const boardVector=[g.boardFar.x-g.boardNear.x,g.boardFar.y-g.boardNear.y],baselineVector=[baselineSouth[0]-baselineNorth[0],baselineSouth[1]-baselineNorth[1]];
 const boardAngle=Math.atan2(boardVector[1],boardVector[0]),baselineAngle=Math.atan2(baselineVector[1],baselineVector[0]);
 const boardBaselineAngleErrorDegrees=Math.abs(Math.atan2(Math.sin(boardAngle-baselineAngle),Math.cos(boardAngle-baselineAngle)))*180/Math.PI;
 const rimXs=g.rimPoints.map(p=>p.x),rimMinX=Math.min(...rimXs),rimMaxX=Math.max(...rimXs);
 return {
  rimCenterPercent:100*g.rimX/JAM_STAGE.viewportWidth,
  rimEdgeBaselineGapPixels:direction>0?g.baselineScreenX-rimMaxX:rimMinX-g.baselineScreenX,
  rimDiameterPixels:g.rimWidthPixels,
  boardWidthPercent:100*g.boardWidth/JAM_STAGE.viewportWidth,
  boardBaselineAngleErrorDegrees,
  boardScreenBounds:g.boardBounds,
  assemblyWidthPercent:100*(maxX-minX)/JAM_STAGE.viewportWidth,
  assemblyHeightPercent:100*(maxY-minY)/JAM_STAGE.viewportHeight,
  baseWorld:{x:g.baseWorldX,y:g.baseWorldY,outerX:g.baseOuterWorldX},
  baseScreenBounds:g.baseBounds,
  baseVisible:g.baseBounds.left>=0&&g.baseBounds.right<=JAM_STAGE.viewportWidth,
 };
}
const [leftEnd,rightEnd]=courtMarkings(court).ends;
const hoopMeasurements={left:measureHoop(leftEnd,-1),right:measureHoop(rightEnd,1)};
const browserVersion=await browser.version();await fs.writeFile(`${out}/capture-manifest.json`,JSON.stringify({capturedAt:new Date().toISOString(),browserVersion,viewport:{landscape:'1200x900 canvas native480x360',portrait:'390x844'},stagePreview:true,stageRevision:13,courtProjection:{floorTop:JAM_STAGE.floorTop,floorHeight:JAM_STAGE.floorHeight,floorHeightPercent:JAM_STAGE.floorHeightPercent,visibleCourtLengthPercent:{far:stageCourtSlicePercent(0),mid:stageCourtSlicePercent(50),near:stageCourtSlicePercent(100)},midcourtStripe:'vertical from the center-based court projection; adjacent endlines retain perspective',northSouthShearPixels:JAM_STAGE.courtDepthShearPixels,viewDirection:'locked to the current attack direction for the complete camera pan',standingHeightsPercent:{far:stageStandingHeightPercent(0),mid:stageStandingHeightPercent(50),near:stageStandingHeightPercent(100)}},hoopGeometry:{rimWorldRadius:JAM_STAGE.hoopRimWorldRadius,baselineOffsetsWorld:{rim:JAM_STAGE.hoopRimBaselineOffsetWorld,board:JAM_STAGE.hoopBoardBaselineOffsetWorld,baseBeyond:JAM_STAGE.stanchionBaseOffsetWorld},supportDepthY:JAM_STAGE.stanchionBaseDepthY,measurements:hoopMeasurements},actionProjection:{actorElevationPixelsPerWorld:JAM_STAGE.actorElevationPixelsPerWorld,dunkCaptureLiftPixels:5*JAM_STAGE.actorElevationPixelsPerWorld,attackZoomAtApex:1.08,attackPanAtApex:42,dunkCourtwardOffsetAtApexPixels:stageDunkContactOffsetPixels(5,1),shadow:'fixed at action takeoff x/y on the court plane'},cameraSequence,gameplayArt:'generated-full-roster-atlases',stagedFrames:true,gameplayFootage:false,simulationChanged:false,portraitStatus:'baseline only; current 4:3 letterboxing retained pending slice approval',errors,captures},null,2)+'\n');console.log(JSON.stringify({out,errors,browserVersion,stagedFrames:Object.keys(captures),cameraSequence,hoopMeasurements}));
await browser.close();
