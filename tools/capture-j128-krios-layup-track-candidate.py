"""Capture candidate trials or registered-runtime Krios layup reviews on Jam Stage."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
CLIP=environ.get('CLIP','layup')
if CLIP not in ('layup','layup-reverse'): raise ValueError('CLIP must be layup or layup-reverse')
REVERSE=CLIP=='layup-reverse'
RUNTIME_INTEGRATION=environ.get('RUNTIME_INTEGRATION','0')=='1'
ATLAS=environ.get('ATLAS', './public/assets/animation/krios-layup-right.webp' if not REVERSE else './public/assets/animation/krios-layup-reverse-right.webp') if RUNTIME_INTEGRATION else environ.get('ATLAS', './tools/generate-art/previews/krios-layup8-attempt06/krios-layup8-attempt06-runtime-candidate.png' if not REVERSE else './tools/generate-art/previews/krios-layup-reverse8-attempt01/krios-layup-reverse8-attempt01-runtime-candidate.png')
TRACK=json.loads(environ.get('TRACK_JSON', '{"height":[0.65,0.9,1.2,1.65,2.35,2.1,1.2,0.65],"forward":[3,5,7,9,13,10,7,5],"releaseVz":0.45}' if not REVERSE else '{"height":[0.65,0.9,1.15,1.55,1.95,2.2,1.4,0.65],"forward":[3,5,6,5,2,-5,6,5],"releaseVz":0.45}'))
FRAME_TICKS=[0,2,5,8,10,11,14,18] if not REVERSE else [0,2,5,7,10,12,13,17]
DURATIONS=[2,3,3,2,1,3,4,4] if not REVERSE else [2,3,2,3,2,1,4,4]
TOTAL=sum(DURATIONS)
RELEASE_TICK=10 if not REVERSE else 12
SAMPLES=sorted(set([0,*FRAME_TICKS,RELEASE_TICK-1,RELEASE_TICK,TOTAL-1,TOTAL,30,40,49,50,60]))
ATTEMPT=environ.get('ATTEMPT','01')
OUT=ROOT/(f'tools/generate-art/previews/j128-krios-{CLIP}-track-candidate/attempt-{ATTEMPT}/registered-runtime' if RUNTIME_INTEGRATION else f'tools/generate-art/previews/j128-krios-{CLIP}-track-candidate/attempt-{ATTEMPT}/native')
OUT.mkdir(parents=True,exist_ok=True)
COURT_Y=int(environ.get('COURT_Y','90'))
PORT=environ.get('PORT','4227');URL=f'http://127.0.0.1:{PORT}/'
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
report={'renderer':'Chromium production Jam Stage canvas','athlete':'krios','clip':CLIP,'candidateAtlas':ATLAS,
 'candidateTrack':TRACK,'runtimeIntegration':RUNTIME_INTEGRATION,'court':'current Jam Stage court geometry in this worktree; scoria-rams vs blackthorn-court-kings',
 'courtY':COURT_Y,'frameStartTicks':FRAME_TICKS,'frameDurations':DURATIONS,'sampleTicks':SAMPLES,
 'captureMethod':'A one-time diagnostic shot action initializes Krios at the attacking end of the current court. The camera is warmed through 100 ordinary carried-ball ticks before production stepMatch advances the layup. Candidate mode injects only the atlas and track before startup; registered mode uses the actual public manifest atlas and athleteBallTracks with no injection. No per-tick ball teleporting.',
 'captures':[],'runs':[]}
try:
 deadline=monotonic()+30
 while monotonic()<deadline:
  if server.poll() is not None: raise RuntimeError('Jam Stage server exited before readiness')
  try:
   with urlopen(URL,timeout=1) as response:
    if response.status==200:break
  except Exception:sleep(.1)
 else:raise TimeoutError('Jam Stage server did not become ready')
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for zoom in [100,120]:
   for facing,direction in [(1,'right'),(-1,'left')]:
    page=browser.new_page(viewport={'width':900,'height':700},device_scale_factor=1)
    errors=[];page.on('pageerror',lambda exc:errors.append(str(exc)))
    def patch(route):
     response=route.fetch();body=response.text();marker='function sampleFrameScalar('
     track=json.dumps(TRACK,separators=(',',':'))
     insert=f"athleteBallTracks.krios['{CLIP}']={track};\n"
     if marker not in body:raise RuntimeError('Could not locate post-initialization track hook')
     route.fulfill(response=response,body=body.replace(marker,insert+marker,1))
    if not RUNTIME_INTEGRATION:page.route('**/src/core/animation.js',patch)
    page.add_init_script('window.requestAnimationFrame=()=>0')
    page.goto(URL,wait_until='networkidle',timeout=120000)
    page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105',timeout=120000)
    home='scoria-rams' if facing>0 else 'blackthorn-court-kings'
    away='blackthorn-court-kings' if facing>0 else 'scoria-rams'
    if RUNTIME_INTEGRATION:
     page.evaluate("""async({atlas,clip,home,away})=>{
      const image=new Image();image.src=atlas;await image.decode();window.__kriosLayupCandidate=image;
      const {animationAssetManifest}=await import('/src/content/animation-assets.js');
      const entry=animationAssetManifest.characters.krios.directions.right[clip];
      if(!entry?.reviewed||entry.src!==atlas||entry.frames?.length!==8)throw new Error('Registered runtime atlas missing/review-pending');
      window.jamverse.start(home,away,180,41);
     }""",{'atlas':ATLAS,'clip':CLIP,'home':home,'away':away})
    else:
     page.evaluate(f"""async()=>{{
      const image=new Image();image.src='{ATLAS}';await image.decode();window.__kriosLayupCandidate=image;
      const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
      const k=animationAssetManifest.characters.krios;
      k.directions.right['{CLIP}']={{src:'{ATLAS}',columns:8,rows:1,reviewed:true,mirrorSafe:true,frames:Array.from({{length:8}},(_,i)=>({{x:i*128,y:0,w:128,h:96}}))}};
      window.jamverse.start('{home}','{away}',180,41);
     }}""")
    page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='krios')")
    page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}',zoom)
    page.evaluate("""({facing,courtY,clip,total})=>{
     const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='krios');
     s.pause=false;s.phase='playing';s.score=[0,0];s.scorePause=0;s.nextAttempt=1;s.rng=41;
     p.x=facing>0?176:24;p.y=courtY;p.vx=p.vy=p.vz=p.z=0;p.facing=facing;p.hasBall=true;p.charge=0;p.stun=0;
     p.animation={clip:'idle-ball',tick:0};p.anim='idle-ball';p.poseFrames=4;s.players=[p];s.possession=p.team;
     Object.assign(s.ball,{mode:'carried',ownerId:p.id,targetId:null,lastTouch:p.id,attemptId:null,scored:false,vx:0,vy:0,vz:0,x:p.x+facing*3,y:p.y,z:1});
     for(let i=0;i<100;i++)g.tick(1,[{playerId:p.id,x:0,y:0}]);
     s.clock=180;s.shotClock=24;s.score=[0,0];s.scorePause=0;s.nextAttempt=1;s.events=[];s.lastEvent='';
     p.animation={clip,tick:0,jump:true,action:{kind:'shot',charge:0}};p.anim='shoot';p.poseFrames=total;
     Object.assign(s.ball,{mode:'carried',ownerId:p.id,targetId:null,lastTouch:p.id,attemptId:null,scored:false,vx:0,vy:0,vz:0,x:p.x+facing*3,y:p.y,z:1});
     g.tick(0,[]);
     return {athlete:p.id,team:p.team,facing,x:p.x,y:p.y,clip,total,zoom:s.cameraZoom};
    }""",{'facing':facing,'courtY':COURT_Y,'clip':CLIP,'total':TOTAL})
    run={'facing':facing,'direction':direction,'offenseTeam':home if facing>0 else away,'home':home,'away':away,'zoom':zoom,'captures':[]}
    for tick in range(max(SAMPLES)+1):
     if tick>0:page.evaluate("""()=>{const g=window.jamverse,p=g.state.players.find(x=>x.id==='krios');g.tick(1,[{playerId:p.id,x:0,y:0}]);}""")
     if tick not in SAMPLES:continue
     info=page.evaluate("""async({tick,atlas})=>{
      const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='krios');
      const {selectProductionSprite}=await import('/src/render/animation-sprites.js');const {animationAssetManifest}=await import('/src/content/animation-assets.js');
      const selected=selectProductionSprite(p,{manifest:animationAssetManifest,images:new Map([[atlas,window.__kriosLayupCandidate]])});
      return{tick,animationTick:p.animation.tick,frame:selected?.frame,animationClip:p.animation.clip,action:p.animation.action?.kind,
       player:{x:p.x,y:p.y,z:p.z,vz:p.vz,facing:p.facing,hasBall:p.hasBall,team:p.team},
       ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z,vx:s.ball.vx,vy:s.ball.vy,vz:s.ball.vz,mode:s.ball.mode,ownerId:s.ball.ownerId,made:s.ball.made},
       facing:p.facing,flip:selected?.flip,src:selected?.src,phase:s.phase,pause:s.pause,score:s.score,events:s.events,cameraX:document.querySelector('#game').dataset.stageCameraX};
     }""",{'tick':tick,'atlas':ATLAS})
     name=f'actual-{direction}-tick{tick:02d}-zoom{zoom}.png';path=OUT/name;page.locator('#game').screenshot(path=str(path));item={**info,'zoom':zoom,'path':path.relative_to(ROOT).as_posix()};run['captures'].append(item);report['captures'].append(item)
    report['runs'].append(run)
    if errors:raise RuntimeError('Browser errors: '+json.dumps(errors))
    page.close()
  browser.close()
 bad=[c for c in report['captures'] if (c['tick']<TOTAL and (c['src']!=ATLAS or c['frame'] is None or c['flip']!=(c['facing']<0))) or c['pause']]
 if bad:raise RuntimeError('Candidate selector/facing/pause mismatch: '+json.dumps(bad[:6]))
 report['uncaughtBrowserErrors']=[];report['captureCount']=len(report['captures'])
 (OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'clip':CLIP,'candidateAtlas':ATLAS,'track':TRACK,'captures':report['captureCount'],'runs':len(report['runs']),'errors':report['uncaughtBrowserErrors'],'output':str(OUT)}))
finally:
 server.terminate();server.wait(timeout=5)
