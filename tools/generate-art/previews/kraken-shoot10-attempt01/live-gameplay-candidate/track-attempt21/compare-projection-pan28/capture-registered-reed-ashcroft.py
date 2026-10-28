from pathlib import Path
from hashlib import sha256
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright
ROOT=Path('/workspace/captain-animation')
OUT=ROOT/'tools/generate-art/previews/kraken-shoot10-attempt01/live-gameplay-candidate/track-attempt21/compare-projection-pan28/reed-ashcroft'
OUT.mkdir(parents=True,exist_ok=True)
PORT='4511'; URL=f'http://127.0.0.1:{PORT}/'
TARGETS={13,43,73,83}
report={'renderer':'Current Jam Stage with normal registered assets and production simulation','comparisonAthlete':'reed-ashcroft','captain':False,'clips':['shoot'],'scaleUnderReview':'stageBallFlightScale(shot,false)=0.8','patches':{'manifest':'none','ballTrack':'none','simulation':'none','camera':'test-harness camera initialization only'},'zoomLevels':[100,120],'facings':[]}
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
try:
 deadline=monotonic()+30
 while monotonic()<deadline:
  if server.poll() is not None: raise RuntimeError('server exited')
  try:
   with urlopen(URL,timeout=1) as response:
    if response.status==200: break
  except Exception: sleep(.1)
 else: raise TimeoutError('server not ready')
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for zoom in (100,120):
   for facing,label in ((1,'right'),(-1,'left')):
    page=browser.new_page(viewport={'width':900,'height':700},device_scale_factor=1)
    errors=[]; failed=[]
    page.on('pageerror',lambda exc:errors.append(str(exc)))
    page.on('requestfailed',lambda req:failed.append({'url':req.url,'failure':req.failure}))
    page.route('**/src/main.js',lambda route: route.fulfill(response=route.fetch(),body=route.fetch().text()))
    # Redo route with a single fetched response body plus a harness-only camera setter.
    asyncroute=''
    page.unroute('**/src/main.js')
    def expose(route):
     res=route.fetch(); body=res.text()
     route.fulfill(response=res,body=body+'\nwindow.__setCameraReview=x=>{camX=x};window.__cameraReview=()=>({camX,stagePreview,cameraZoom});\n')
    def pan_geometry(route):
     res=route.fetch(); body=res.text()
     before='const py=groundY-(Number(z)||0)*JAM_STAGE.actorElevationPixelsPerWorld*zoomFactor;'; after='const py=groundY-(Number(z)||0)*JAM_STAGE.actorElevationPixelsPerWorld*zoomFactor+28*Math.min(1,Math.max(0,(Number(zoom)||100)-100)/20);'
     if before not in body: raise RuntimeError('projectJamStagePoint y formula not found in test route')
     route.fulfill(response=res,body=body.replace(before,after,1))
    page.route('**/src/render/jam-stage.js',pan_geometry)
    page.route('**/src/main.js',expose)
    page.add_init_script('window.requestAnimationFrame=()=>0')
    page.goto(URL,wait_until='networkidle',timeout=120000)
    page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105',timeout=120000)
    home='chicago-condas' if facing>0 else 'scoria-rams'; away='scoria-rams' if facing>0 else 'chicago-condas'
    page.evaluate('(x)=>window.jamverse.start(x.home,x.away,180,31)',{'home':home,'away':away})
    page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='reed-ashcroft')",timeout=30000)
    page.evaluate('(z)=>{const e=document.querySelector("#camera-zoom");e.value=String(z);e.dispatchEvent(new Event("input",{bubbles:true}))}',zoom)
    setup=page.evaluate('''({facing})=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='reed-ashcroft');s.players=[p];s.practice=true;s.clock=9999;s.shotClock=24;s.pause=false;s.scorePause=0;s.phase='playing';p.x=facing>0?142:58;p.y=90;p.z=p.vz=p.vx=p.vy=0;p.facing=facing;p.hasBall=true;p.charge=0;p.stun=0;p.animation={clip:'idle-ball',tick:0};p.anim='idle-ball';s.possession=p.team;Object.assign(s.ball,{mode:'carried',ownerId:p.id,lastTouch:p.id,targetId:null,aerialTargetId:null,attemptId:null,x:p.x+facing*4,y:p.y,z:1.1,vx:0,vy:0,vz:0,scored:false});const basket=200*(facing>0?1-5.25/94:5.25/94),bx=p.x+facing*4,approach=Math.max(0,Math.min(1,(70-Math.abs(basket-bx))/(70-30))),focus=bx+(basket-facing*17-bx)*approach;window.__setCameraReview(focus);return{player:p.id,team:p.team,captain:p.captain,x:p.x,y:p.y,facing,zoom:document.querySelector('#camera-zoom').value,camera:window.__cameraReview()}}''',{'facing':facing})
    tracks=page.evaluate("async()=>{const a=await import('/src/core/animation.js'); return {height:[0,3,6,10,13,14,19,23].map(t=>a.sampleBallHeight('shoot',t,'reed-ashcroft')),forward:[0,3,6,10,13,14,19,23].map(t=>a.sampleBallForward('shoot',t,'reed-ashcroft')),releaseVz:a.sampleBallReleaseVz('shoot','reed-ashcroft')}}")
    page.evaluate("()=>window.jamverse.tick(1,window.jamverse.state.players.map(p=>({playerId:p.id,x:0,y:0,shootPressed:p.id==='reed-ashcroft'})))")
    rows=[];released=None;score=None
    def capture(tick,state):
     name=f'{label}-zoom{zoom}-tick{tick:02d}-{state["clip"]}-ball-{state["ball"]["mode"]}.png';path=OUT/name
     page.locator('#game').screenshot(path=str(path));return {'path':str(path.relative_to(ROOT)),'sha256':sha256(path.read_bytes()).hexdigest(),'tick':tick,'state':state}
    for step in range(120):
     state=page.evaluate('''()=>{const g=window.jamverse,s=g.state,p=s.players[0],b=s.ball;return{tick:p.animation.tick,clip:p.animation.clip,frame:p.animation.frame,hasBall:p.hasBall,action:p.animation.action?.kind,position:{x:p.x,y:p.y,z:p.z},ball:{mode:b.mode,ownerId:b.ownerId,lastTouch:b.lastTouch,x:b.x,y:b.y,z:b.z,vx:b.vx,vy:b.vy,vz:b.vz},score:[...s.score],scoredAttempts:[...(s.scoredAttempts||[])],phase:s.phase,scorePause:s.scorePause,camera:window.__cameraReview()}}''')
     t=state['tick']
     if step in TARGETS and not any(r['tick']==step for r in rows):rows.append(capture(step,state))
     if state['ball']['mode']=='shot' and released is None:
      released=state.copy()
     if state['scoredAttempts'] and score is None:
      score=capture(t,state);break
     if released and state['ball']['mode']=='dead':break
     page.evaluate('()=>window.jamverse.tick(1,window.jamverse.state.players.map(p=>({playerId:p.id,x:0,y:0})))')
    if errors: raise RuntimeError('browser error '+json.dumps(errors))
    if released is None: raise RuntimeError('normal production simulation never released; final '+json.dumps(state))
    # The 0th iteration observes tick0; ensure screenshots cover key action boundaries.
    rows_by_tick={x['tick']:x for x in rows}
    if released['tick']!=13: raise RuntimeError(f'normal release tick differs from expected 13: {released}')
    report['facings'].append({'facing':label,'zoom':zoom,'setup':setup,'runtimeRegisteredTrackSamples':tracks,'release':released,'captures':rows,'scoreCapture':score,'uncaughtBrowserErrors':errors,'failedRequests':failed})
    page.close()
  browser.close()
 report['captureCount']=sum(len(x['captures'])+(x['scoreCapture'] is not None) for x in report['facings'])
 report['allNormalAssets']=True
 (OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'output':str(OUT),'runs':len(report['facings']),'captures':report['captureCount'],'releaseTicks':[r['release']['tick'] for r in report['facings']],'scores':[r['scoreCapture']['state']['score'] if r['scoreCapture'] else None for r in report['facings']],'errors':[r['uncaughtBrowserErrors'] for r in report['facings']]}))
finally:
 server.terminate();server.wait(timeout=5)
