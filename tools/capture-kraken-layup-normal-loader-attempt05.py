"""Verify the provisional Kraken layup through the real manifest/asset loader on current court."""
from pathlib import Path
from os import environ
from subprocess import Popen,DEVNULL
from time import monotonic,sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
ATLAS='./public/assets/animation/kraken-layup-right.webp';PORT=environ.get('PORT','4240');URL=f'http://127.0.0.1:{PORT}/'
OUT=ROOT/'tools/generate-art/previews/kraken-layup-normal-loader/attempt-05';OUT.mkdir(parents=True,exist_ok=False)
TICKS=[0,2,5,8,9,10,11,14,18,21,30,40,49,50,60]
report={'athlete':'kraken','clip':'layup','atlas':ATLAS,'track':{'height':[1.0,1.2,1.55,1.78,1.85,2.0,1.35,.75],'forward':[3,3,3.5,2.9,4.2,4.0,3,3],'releaseVz':.45},'runtimeIntegration':True,'candidateAtlasInjected':False,'candidateTrackInjected':False,'matchup':'Vesper Harbor Undertow vs Blackthorn Court Kings','courtY':60,'method':'Normal production manifest, main.js loadProductionSprites image map, and athleteBallTracks code are used without route overrides. The harness changes only deterministic match/player state to launch the documented layup input and advance ordinary production stepMatch/render ticks.','runs':[],'uncaughtBrowserErrors':[]}
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
try:
 deadline=monotonic()+30
 while monotonic()<deadline:
  if server.poll() is not None:raise RuntimeError('Jam Stage server exited before readiness')
  try:
   with urlopen(URL,timeout=1) as res:
    if res.status==200:break
  except Exception:sleep(.1)
 else:raise TimeoutError('Jam Stage server readiness')
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for zoom in (100,120):
   for facing,direction in ((1,'right'),(-1,'left')):
    page=browser.new_page(viewport={'width':900,'height':700},device_scale_factor=1);errors=[]
    page.on('pageerror',lambda err:errors.append(str(err)));page.on('console',lambda msg:errors.append(msg.text) if msg.type=='error' else None)
    page.add_init_script('window.requestAnimationFrame=()=>0')
    def expose_main(route):
     response=route.fetch();body=response.text();marker='raf=requestAnimationFrame(frame);startArcadeMusic()'
     if marker not in body:raise RuntimeError('Could not disable autonomous animation loop for deterministic step captures')
     body=body.replace(marker,'raf=0;startArcadeMusic()',1)
     body+='\nwindow.__productionSpriteImagesForReview=productionSpriteImages;\n'
     route.fulfill(response=response,body=body)
    page.route('**/src/main.js',expose_main)
    page.goto(URL,wait_until='networkidle',timeout=120000)
    page.wait_for_function('window.jamverse&&window.jamverse.rosterCheck.athletes===105',timeout=120000)
    home='vesper-harbor-undertow' if facing>0 else 'blackthorn-court-kings';away='blackthorn-court-kings' if facing>0 else 'vesper-harbor-undertow'
    page.evaluate("""async({home,away,zoom,facing,atlas})=>{
      const g=window.jamverse;g.start(home,away,180,1107);const s=g.state,p=s.players.find(q=>q.id==='kraken');
      if(!p)throw Error('Kraken absent from live roster');
      const {animationAssetManifest}=await import('/src/content/animation-assets.js');
      const entry=animationAssetManifest.characters.kraken.directions.right.layup;
      if(!entry?.reviewed||entry.src!==atlas||entry.frames?.length!==8)throw Error('Provisional layup is not in the live production manifest');
      s.players=[p];p.x=facing>0?182:18;p.y=60;p.facing=facing;p.vx=p.vy=p.vz=p.z=0;p.hasBall=true;p.charge=0;p.stun=0;p.animation={clip:'idle-ball',tick:0};p.anim='idle-ball';p.fga=p.fgm=0;
      s.phase='playing';s.pause=false;s.score=[0,0];s.scorePause=0;s.nextAttempt=1;s.rng=1107;s.clock=180;s.shotClock=24;s.possession=p.team;
      Object.assign(s.ball,{mode:'carried',ownerId:p.id,targetId:null,aerialTargetId:null,lastTouch:p.id,attemptId:null,scored:false,x:p.x+facing*3,y:p.y,z:1,vx:0,vy:0,vz:0});
      const {createInput}=await import('/src/core/simulation.js');for(let i=0;i<100;i++)g.tick(1,[createInput(p.id,{})]);s.clock=180;s.shotClock=24;s.score=[0,0];s.scorePause=0;s.nextAttempt=1;s.phase='playing';s.pause=false;s.possession=p.team;p.vx=p.vy=p.vz=0;Object.assign(s.ball,{mode:'carried',ownerId:p.id,targetId:null,aerialTargetId:null,lastTouch:p.id,attemptId:null,scored:false,x:p.x+facing*3,y:p.y,z:1,vx:0,vy:0,vz:0});g.tick(1,[createInput(p.id,{shootPressed:true,layupVariant:'normal'})]);
      if(p.animation.clip!=='layup'||p.animation.tick!==0)throw Error(`Layup gameplay input selected ${p.animation.clip}/${p.animation.tick}`);
      const slider=document.querySelector('#camera-zoom');slider.value=String(zoom);slider.dispatchEvent(new Event('input',{bubbles:true}));
      return {home,away,team:p.team,facing,position:[p.x,p.y],zoom,entry:{src:entry.src,reviewed:entry.reviewed},imageLoadStarted:Boolean(window.__productionSpriteImagesForReview?.get(atlas))};
    }""",{'home':home,'away':away,'zoom':zoom,'facing':facing,'atlas':ATLAS})
    page.wait_for_function("(src)=>{const im=window.__productionSpriteImagesForReview?.get(src);return Boolean(im?.complete&&im.naturalWidth===320&&im.naturalHeight===192)}",arg=ATLAS,timeout=120000,polling=100)
    run={'facing':facing,'direction':direction,'zoom':zoom,'team':'vesper-harbor-undertow','home':home,'away':away,'captures':[],'trace':[]}
    for tick in range(max(TICKS)+1):
     if tick>0:page.evaluate("""()=>{const g=window.jamverse,s=g.state;g.tick(1,s.players.map(p=>({playerId:p.id,x:0,y:0})));}""")
     if tick not in TICKS:continue
     info=page.evaluate("""async({tick,atlas})=>{const g=window.jamverse,s=g.state,p=s.players[0];const {selectProductionSprite}=await import('/src/render/animation-sprites.js');const {animationAssetManifest}=await import('/src/content/animation-assets.js');const {sampleBallHeight,sampleBallForward}=await import('/src/core/animation.js');const images=window.__productionSpriteImagesForReview,selected=selectProductionSprite(p,{manifest:animationAssetManifest,images});return {tick,clip:p.animation.clip,animationTick:p.animation.tick,frame:selected?.frame,src:selected?.src,flip:selected?.flip,productionImage:{present:Boolean(images.get(atlas)),complete:images.get(atlas)?.complete,width:images.get(atlas)?.naturalWidth,height:images.get(atlas)?.naturalHeight},player:{x:p.x,y:p.y,z:p.z,facing:p.facing,hasBall:p.hasBall,fga:p.fga,fgm:p.fgm},ball:{x:+s.ball.x.toFixed(3),y:+s.ball.y.toFixed(3),z:+s.ball.z.toFixed(3),mode:s.ball.mode,owner:s.ball.ownerId,made:s.ball.made},track:{height:sampleBallHeight('layup',p.animation.tick,'kraken'),forward:sampleBallForward('layup',p.animation.tick,'kraken')},score:s.score,events:s.events.slice(-2),phase:s.phase,pause:s.pause};}""",{'tick':tick,'atlas':ATLAS})
     run['trace'].append(info)
     name=f'{direction}-tick{tick:02d}-zoom{zoom}.png';path=OUT/name;page.locator('#game').screenshot(path=str(path));info['path']=path.relative_to(ROOT).as_posix();run['captures'].append(info)
    release=next(c for c in run['captures'] if c['tick']==10);post=next(c for c in run['captures'] if c['tick']==50)
    run['result']={'releasedAtTick10':release['ball']['mode']=='shot' and release['ball']['owner'] is None,'madeTwoByTick50':post['score']==([2,0] if facing>0 else [0,2]),'finalScore':post['score']}
    if not run['result']['releasedAtTick10'] or not run['result']['madeTwoByTick50']:raise RuntimeError('Normal-loader gameplay outcome mismatch '+json.dumps(run['result']))
    if errors:report['uncaughtBrowserErrors'].extend(errors);raise RuntimeError(json.dumps(errors))
    report['runs'].append(run);page.close()
  browser.close()
 report['captureCount']=sum(len(r['captures']) for r in report['runs']);(OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'runs':len(report['runs']),'captures':report['captureCount'],'errors':report['uncaughtBrowserErrors'],'output':str(OUT)}))
finally:
 server.terminate()
 try:server.wait(timeout=5)
 except Exception:server.kill()
