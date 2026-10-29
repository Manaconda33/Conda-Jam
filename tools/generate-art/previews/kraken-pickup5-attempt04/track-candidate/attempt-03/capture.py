"""Calibrate Kraken pickup's separate ball track in real Jam Stage gameplay."""
from pathlib import Path
from os import environ
from hashlib import sha256
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[6]
ATTEMPT=int(environ.get('ATTEMPT','3'))
OUT=ROOT/f'tools/generate-art/previews/kraken-pickup5-attempt04/track-candidate/attempt-{ATTEMPT:02d}/native'
OUT.mkdir(parents=True,exist_ok=True)
PORT=environ.get('PORT','4234');URL=f'http://127.0.0.1:{PORT}/'
COURT_Y=float(environ.get('COURT_Y','50'))
INITIAL_FORWARD=float(environ.get('INITIAL_FORWARD','2.5'))
INITIAL_BALL_Z=float(environ.get('INITIAL_BALL_Z','0.2'))
INITIAL_BALL_VZ=float(environ.get('INITIAL_BALL_VZ','0'))
INITIAL_LATERAL_OFFSET=float(environ.get('INITIAL_LATERAL_OFFSET','1.5'))
RUNTIME_INTEGRATION=environ.get('RUNTIME_INTEGRATION','0')=='1'
TRACK=json.loads(environ.get('TRACK_JSON','{"height":[0.65,0.45,0.2,0.2,0.5],"forward":[3.5,4.5,5.5,4.5,4.5]}'))
ATLAS='./tools/generate-art/previews/kraken-pickup5-attempt04/kraken-pickup5-attempt04-cleanup02-atlas-candidate.png'
SAMPLE_TICKS=[0,2,4,6,7,8,10,11]

def inject_tracks(route):
 response=route.fetch();body=response.text()
 if 'const athleteBallTracks=' not in body:raise RuntimeError('Could not instrument served athleteBallTracks')
 route.fulfill(response=response,body=body.replace('const athleteBallTracks=','export const athleteBallTracks=',1))

server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
report={'renderer':'Chromium production Jam Stage canvas','athlete':'kraken','clip':'pickup','candidateAtlas':ATLAS,'candidateTrack':TRACK,'runtimeIntegration':RUNTIME_INTEGRATION,
 'candidateAtlasSha256':sha256((ROOT/ATLAS[2:]).read_bytes()).hexdigest(),'candidateAtlasInjected':not RUNTIME_INTEGRATION,'candidateBallTrackInjected':not RUNTIME_INTEGRATION,
 'captureScript':'tools/generate-art/previews/kraken-pickup5-attempt04/track-candidate/attempt-03/capture.py','baselineY':90,'frameDurations':[2,3,2,1,4],
 'sourceArtReview':'tools/generate-art/previews/kraken-pickup5-attempt04/INDEPENDENT_CLEANUP02_REVIEW.md',
 'simulation':'A controlled one-time loose-ball fixture enters normal stepMatch progression. Production integration advances ball physics, schedules pickup, reaches the grab anchor, transfers possession, and continues carried-ball rendering.',
 'captureMethod':'Fixture is set once per run; then only normal production ticks advance. No per-tick ball/player teleports. Candidate artwork/track is injected into page memory only; checked-in manifest/runtime remain unchanged.',
 'court':'vesper-harbor-undertow vs scoria-rams','courtY':COURT_Y,'initialForward':INITIAL_FORWARD,'initialLateralOffset':INITIAL_LATERAL_OFFSET,'initialBallZ':INITIAL_BALL_Z,'initialBallVz':INITIAL_BALL_VZ,'sampleTicks':SAMPLE_TICKS,'captures':[],'gameplayRuns':[]}
try:
 deadline=monotonic()+30
 while monotonic()<deadline:
  if server.poll() is not None:raise RuntimeError('Jam Stage server exited before readiness')
  try:
   with urlopen(URL,timeout=1) as response:
    if response.status==200:break
  except Exception:sleep(.1)
 else:raise TimeoutError('Jam Stage server did not become ready')
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  page=browser.new_page(viewport={'width':900,'height':700},device_scale_factor=1);errors=[];page.on('pageerror',lambda exc:errors.append(str(exc)))
  page.add_init_script('window.requestAnimationFrame=()=>0');page.route('**/src/core/animation.js',inject_tracks)
  page.goto(URL,wait_until='networkidle',timeout=120000)
  page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105',timeout=120000)
  page.evaluate(f"""async()=>{{
    const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
    const {{athleteBallTracks}}=await import('/src/core/animation.js');
    if(!{str(RUNTIME_INTEGRATION).lower()}){{athleteBallTracks.kraken??={{}};athleteBallTracks.kraken.pickup={json.dumps(TRACK)};animationAssetManifest.characters.kraken.directions.right.pickup={{src:'{ATLAS}',columns:5,rows:1,reviewed:true,mirrorSafe:true,baselineY:90,frames:Array.from({{length:5}},(_,i)=>({{x:i*80,y:0,w:80,h:96}}))}};animationAssetManifest.characters.kraken.mirrorSafe=true;animationAssetManifest.characters.kraken.mirrorReview={{status:'reviewed'}};}}
    const image=new Image();image.src='{ATLAS}';await image.decode();window.__krakenPickupAtlas=image;
    window.jamverse.start('vesper-harbor-undertow','scoria-rams',180,128);
  }}""")
  page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='kraken')")
  for zoom in [100,120]:
   page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}',zoom)
   for facing,direction in [(1,'right'),(-1,'left')]:
    page.evaluate("window.jamverse.start('vesper-harbor-undertow','scoria-rams',180,128)")
    page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='kraken')")
    setup=page.evaluate("""({facing,courtY,initialForward,lateralOffset,ballZ,ballVz})=>{
      const g=window.jamverse,s=g.state,p=s.players.find(q=>q.id==='kraken');
      p.x=100;p.y=courtY;p.z=p.vx=p.vy=p.vz=0;p.facing=facing;p.hasBall=false;p.stun=0;p.animation={clip:'idle',tick:0};p.anim='idle';
      for(const q of s.players)if(q!==p){q.x=q.team===p.team?35:175;q.y=8;q.z=q.vx=q.vy=q.vz=0;q.hasBall=false;q.stun=999;q.animation={clip:'idle',tick:0};q.anim='idle';}
      s.phase='playing';s.pause=false;s.score=[0,0];s.scorePause=0;s.possession=1;s.clock=180;s.shotClock=24;s.events=[];s.lastEvent='';
      Object.assign(s.ball,{mode:'loose',ownerId:null,targetId:null,aerialTargetId:null,lastTouch:'opponent',attemptId:null,scored:false,
        x:p.x+facing*initialForward,y:p.y+lateralOffset,z:ballZ,vx:facing*.09,vy:0,vz:ballVz});
      return{player:p.id,x:p.x,y:p.y,facing,courtY,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z,vx:s.ball.vx,vy:s.ball.vy,vz:s.ball.vz},zoom:s.cameraZoom};
    }""",{'facing':facing,'courtY':COURT_Y,'initialForward':INITIAL_FORWARD,'lateralOffset':INITIAL_LATERAL_OFFSET,'ballZ':INITIAL_BALL_Z,'ballVz':INITIAL_BALL_VZ})
    start=None
    for step in range(1,60):
     state=page.evaluate("""()=>{const g=window.jamverse,s=g.state,p=s.players.find(q=>q.id==='kraken');g.tick(1,s.players.map(q=>({playerId:q.id})));return{tick:p.animation.tick,clip:p.animation.clip,action:p.animation.action?.kind,ballMode:s.ball.mode,owner:s.ball.ownerId};}""")
     if state['clip']=='pickup':start=step;break
    if start is None:
     report['gameplayRuns'].append({'facing':facing,'zoom':zoom,'setup':setup,'error':'Kraken never entered pickup'});continue
    for tick in SAMPLE_TICKS:
     while True:
      info=page.evaluate("""async(atlas)=>{const g=window.jamverse,s=g.state,p=s.players.find(q=>q.id==='kraken');
        const {selectProductionSprite}=await import('/src/render/animation-sprites.js');const {animationAssetManifest}=await import('/src/content/animation-assets.js');
        const selected=selectProductionSprite(p,{manifest:animationAssetManifest,images:new Map([[atlas,window.__krakenPickupAtlas]])});
        return{tick:p.animation.tick,clip:p.animation.clip,action:p.animation.action?.kind,player:{x:p.x,y:p.y,z:p.z,facing:p.facing,hasBall:p.hasBall},
          ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z,mode:s.ball.mode,owner:s.ball.ownerId,lastTouch:s.ball.lastTouch},
          selected:selected?{frame:selected.frame,flip:selected.flip,src:selected.src}:null,events:s.events,paused:s.pause,phase:s.phase,
          canvasArt:document.querySelector('#game').dataset.gameplayArt};}""",ATLAS)
      if info['clip']!='pickup' or info['tick']>=tick:break
      page.evaluate("inputs=>window.jamverse.tick(1,inputs)",page.evaluate("()=>window.jamverse.state.players.map(p=>({playerId:p.id}))"))
     if info['clip']=='pickup' and info['tick']==tick:
      dest=OUT/f'actual-{direction}-pickup-tick{tick:02d}-zoom{zoom}.png';page.locator('#game').screenshot(path=str(dest))
      if not dest.is_file() or dest.stat().st_size==0:raise RuntimeError(f'Empty capture: {dest}')
      report['captures'].append({**info,'facing':facing,'zoom':zoom,'path':dest.relative_to(ROOT).as_posix(),'screenshotSha256':sha256(dest.read_bytes()).hexdigest(),'setup':setup})
    while True:
     status=page.evaluate("""()=>{const g=window.jamverse,s=g.state,p=s.players.find(q=>q.id==='kraken');return{clip:p.animation.clip,tick:p.animation.tick,hasBall:p.hasBall,ballMode:s.ball.mode,owner:s.ball.ownerId,events:s.events};}""")
     if status['hasBall'] and status['owner']=='kraken' and status['tick']>=7:break
     if status['clip']!='pickup':break
     page.evaluate("inputs=>window.jamverse.tick(1,inputs)",page.evaluate("()=>window.jamverse.state.players.map(p=>({playerId:p.id}))"))
    report['gameplayRuns'].append({'facing':facing,'zoom':zoom,'setup':setup,'pickupStartStep':start,'finalState':status,'browserErrors':errors})
  browser.close()
  if errors:raise RuntimeError(f'Browser errors: {errors}')
  report['captureCount']=len(report['captures']);report['uncaughtBrowserErrors']=errors
  report['captureIntegrity']={'files':report['captureCount'],'missing':[],'hashMismatches':[]}
  for capture in report['captures']:
   capturePath=ROOT/capture['path']
   if not capturePath.is_file():report['captureIntegrity']['missing'].append(capture['path'])
   elif sha256(capturePath.read_bytes()).hexdigest()!=capture['screenshotSha256']:report['captureIntegrity']['hashMismatches'].append(capture['path'])
  if report['captureIntegrity']['missing'] or report['captureIntegrity']['hashMismatches']:
   raise RuntimeError('Capture integrity failure: '+json.dumps(report['captureIntegrity']))
  bad=[c for c in report['captures'] if c['clip']!='pickup' or c['selected'] is None or c['selected']['src']!=ATLAS or c['selected']['flip']!=(c['facing']<0) or c['paused'] or c['phase']!='playing']
  if bad:raise RuntimeError('Selector/facing/phase capture mismatch: '+json.dumps(bad[:5]))
  for run in report['gameplayRuns']:
   if not(run['finalState']['hasBall'] and run['finalState']['owner']=='kraken' and any(e['text']=='Kraken grabs the ball' for e in run['finalState']['events'])):
    raise RuntimeError('Kraken did not complete the pickup catch: '+json.dumps(run))
  (OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
  print(json.dumps({'attempt':ATTEMPT,'captures':report['captureCount'],'track':TRACK,'runs':len(report['gameplayRuns']),'errors':errors,'output':str(OUT)}))
finally:
 server.terminate();server.wait(timeout=5)
