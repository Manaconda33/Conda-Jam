import fs from 'node:fs/promises';
import playwright from 'file:///opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js';
import { sampleBallForward, sampleBallHeight, flightHeightFromHand } from '../src/core/animation.js';
const {chromium}=playwright;
const out='/workspace/Conda-Jam/artifacts/screenshots/issue4-stage';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:1200,height:900},deviceScaleFactor:1});
await context.addInitScript(()=>{localStorage.setItem('jamverse96-v5',JSON.stringify({audioCaptions:false,screenShake:false,reducedFlash:true,teamMarkers:false,cameraZoom:100,home:'chicago-condas',away:'crownfire-sovereigns'}));window.requestAnimationFrame=()=>0;window.cancelAnimationFrame=()=>{};});
const page=await context.newPage(),errors=[],captures={};page.on('pageerror',e=>errors.push(String(e)));
await page.goto('http://localhost:4173/?stagePreview=1');await page.waitForFunction('Boolean(window.jamverse)');
await page.evaluate("window.jamverse.start('chicago-condas','crownfire-sovereigns',60,1101)");await page.waitForTimeout(700);
await page.waitForFunction("document.querySelector('#game').dataset.gameplayArt==='generated-full-roster-atlases'");
async function stage(name,scene,portrait=false){
 if(portrait)await page.setViewportSize({width:390,height:844}); else await page.setViewportSize({width:1200,height:900});
 await page.evaluate(({scene})=>{
  const m=window.jamverse.state;for(const p of m.players){p.vx=p.vy=p.vz=0;p.z=0;p.hasBall=false;p.facing=p.team===0?1:-1;p.anim='idle';p.animation={clip:'idle-ball',tick:0};}
  const get=id=>m.players.find(p=>p.id===id);const player=get(scene.player);
  player.x=scene.x;player.y=scene.y;player.z=scene.z??0;player.facing=scene.facing??1;player.anim=scene.clip;player.animation={clip:scene.clip,tick:scene.tick};player.hasBall=Boolean(scene.carried);
  if(scene.defenders)for(const [id,x,y,z=0] of scene.defenders){const d=get(id);d.x=x;d.y=y;d.z=z;d.anim='idle';d.animation={clip:'idle-ball',tick:0};}
  if(scene.carried){m.ball.mode='carried';m.ball.ownerId=player.id;m.ball.aerialTargetId=null;m.ball.x=player.x+(scene.ballDx??8)*player.facing;m.ball.y=player.y;m.ball.z=player.z+(scene.ballDz??1);m.ball.vx=0;m.ball.vy=0;}
  else {m.ball.mode='shot';m.ball.ownerId=null;m.ball.aerialTargetId=null;m.ball.x=scene.ballX??player.x-(scene.ballDx??sampleBallForward(scene.clip,scene.tick,player.id));m.ball.y=scene.ballY??player.y;m.ball.z=scene.ballZ??4;m.ball.vx=scene.ballVx??0;m.ball.vy=0;}
  m.lastEvent='';m.pause=false;m.phase='playing';
 },{scene});
 // Call the regular render path with zero simulation ticks until the stage camera settles at the target.
 await page.evaluate(()=>{for(let i=0;i<240;i++)window.jamverse.tick(0)});
 if(portrait)await page.screenshot({path:`${out}/${name}.png`});
 else {const data=await page.locator('#game').evaluate(e=>e.toDataURL('image/png'));await fs.writeFile(`${out}/${name}.png`,Buffer.from(data.split(',')[1],'base64'));}
 captures[name]={scene,previewFlag:await page.locator('#game').getAttribute('data-stage-preview'),state:await page.evaluate(()=>({players:window.jamverse.state.players.map(p=>({id:p.id,x:p.x,y:p.y,z:p.z,facing:p.facing,clip:p.animation.clip,tick:p.animation.tick})),ball:{mode:window.jamverse.state.ball.mode,x:window.jamverse.state.ball.x,y:window.jamverse.state.ball.y,z:window.jamverse.state.ball.z,ownerId:window.jamverse.state.ball.ownerId}}))};
}
await stage('a-near-dribble',{player:'reed-ashcroft',x:100,y:82,clip:'dribble',tick:15,carried:true,ballDx:sampleBallForward('dribble',15,'reed-ashcroft'),ballDz:sampleBallHeight('dribble',15,'reed-ashcroft'),defenders:[['manaconda',78,86],['dragon-queen',80,22],['auric-scale',132,18]]});
await stage('b-right-dunk-peak',{player:'reed-ashcroft',x:178,y:72,z:2.4,facing:1,clip:'dunk-power',tick:14,carried:true,ballDx:sampleBallForward('dunk-power',14,'reed-ashcroft'),ballDz:sampleBallHeight('dunk-power',14,'reed-ashcroft'),defenders:[['manaconda',150,25],['dragon-queen',158,24],['auric-scale',162,36]]});
await stage('c-left-shot-release',{player:'reed-ashcroft',x:33,y:63,z:2.2,facing:-1,clip:'shoot',tick:13,carried:false,ballDx:11.5,ballY:63,ballZ:flightHeightFromHand(sampleBallHeight('shoot',13,'reed-ashcroft'),2.2),ballVx:-.15,defenders:[['manaconda',53,26],['auric-scale',55,74],['dragon-queen',75,45]]});
await stage('d-portrait-play',{player:'reed-ashcroft',x:100,y:82,clip:'dribble',tick:15,carried:true,ballDx:sampleBallForward('dribble',15,'reed-ashcroft'),ballDz:sampleBallHeight('dribble',15,'reed-ashcroft'),defenders:[['manaconda',78,86],['dragon-queen',80,22],['auric-scale',132,18]]},true);
const browserVersion=await browser.version();await fs.writeFile(`${out}/capture-manifest.json`,JSON.stringify({capturedAt:new Date().toISOString(),browserVersion,viewport:{landscape:'1200x900 canvas native480x360',portrait:'390x844'},stagePreview:true,gameplayArt:'generated-full-roster-atlases',stagedFrames:true,gameplayFootage:false,simulationChanged:false,portraitStatus:'baseline only; current 4:3 letterboxing retained pending slice approval',errors,captures},null,2)+'\n');console.log(JSON.stringify({out,errors,browserVersion,stagedFrames:Object.keys(captures)}));
await browser.close();
