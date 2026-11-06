"""Capture unregistered Kraken push artwork/track in the current Jam Stage.

Temporary in-page overrides only. Candidate possession is forced to inspect the
separate per-athlete hand track while each push pose is sampled; this does not
claim to validate the defensive shove interaction or register production assets.
"""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
ATTEMPT=int(environ.get('ATTEMPT','1')); OUT=ROOT/f'tools/generate-art/previews/kraken-push-track-candidate/attempt-{ATTEMPT:02d}/native'; OUT.mkdir(parents=True,exist_ok=True)
PORT=environ.get('PORT','4291'); URL=f'http://127.0.0.1:{PORT}/'; HOME='vesper-harbor-undertow'; AWAY='scoria-rams'; SEED=713; COURT_Y=50
ATLAS='./tools/generate-art/previews/kraken-push11-attempt01/kraken-push11-attempt01-runtime-candidate.png'
track=json.load(open(ROOT/f'tools/generate-art/previews/kraken-push-track-candidate/attempt-{ATTEMPT:02d}/track.json'))
TICKS=track['frameStartTicks']; heights=track['height']; forwards=track['forward']
report={'renderer':'Chromium current Jam Stage production canvas','athlete':'kraken','clip':'push','attempt':ATTEMPT,'atlas':ATLAS,'atlasLayout':{'columns':4,'rows':3,'cellWidth':80,'cellHeight':96,'frames':11},'candidateTrack':{'height':heights,'forward':forwards},'candidateAtlasInjected':True,'candidateBallTrackInjected':True,'runtimeIntegration':False,'captureMethod':'Forced Kraken carried-ball possession during selector sampling to review the separate athlete track; defensive shove action/target interaction is not claimed as gameplay-validated.','court':{'home':HOME,'away':AWAY,'name':'Vesper Harbor Undertow vs Scoria Rams','courtY':COURT_Y},'seed':SEED,'frameStartTicks':TICKS,'runs':[],'uncaughtBrowserErrors':[]}
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
try:
 deadline=monotonic()+30
 while monotonic()<deadline:
  if server.poll() is not None: raise RuntimeError('Jam Stage server exited before ready')
  try:
   with urlopen(URL,timeout=1) as response:
    if response.status==200: break
  except Exception: sleep(.1)
 else: raise TimeoutError('Jam Stage server did not become ready')
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for zoom in (100,120):
   for facing,direction in ((1,'right'),(-1,'left')):
    page=browser.new_page(viewport={'width':900,'height':700},device_scale_factor=1); errors=[]
    page.on('pageerror',lambda exc:errors.append(str(exc)))
    def override_manifest(route):
     response=route.fetch(); addition=f"""
animationAssetManifest.characters.kraken.directions.right.push={{src:{json.dumps(ATLAS)},columns:4,rows:3,reviewed:true,frames:Array.from({{length:11}},(_,i)=>({{x:(i%4)*80,y:Math.floor(i/4)*96,w:80,h:96}}))}};
animationAssetManifest.characters.kraken.mirrorSafe=true; animationAssetManifest.characters.kraken.mirrorReview={{status:'reviewed'}};
"""; route.fulfill(response=response,body=response.text()+'\n'+addition)
    def override_track(route):
     response=route.fetch(); addition=f"\nathleteBallTracks.kraken.push={json.dumps({'height':heights,'forward':forwards},separators=(',',':'))};\n"; route.fulfill(response=response,body=response.text()+addition)
    def expose_images(route):
     response=route.fetch(); route.fulfill(response=response,body=response.text()+'\nwindow.__productionSpriteImagesForReview=productionSpriteImages;\n')
    page.route('**/src/content/animation-assets.js',override_manifest); page.route('**/src/core/animation.js',override_track); page.route('**/src/main.js',expose_images)
    page.add_init_script('window.requestAnimationFrame=()=>0'); page.goto(URL,wait_until='networkidle',timeout=120000); page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105',timeout=120000)
    page.evaluate("""async ({home,away,zoom,atlas,heights,forwards,facing,courtY,seed})=>{
      const g=window.jamverse;g.start(home,away,180,seed);const s=g.state,k=s.players.find(p=>p.id==='kraken'),opp=s.players.find(p=>p.team!==k.team);
      if(!k||!opp)throw Error('Kraken/opponent missing');s.players=[k,opp];
      for(const p of s.players){p.hasBall=false;p.stun=0;p.charge=0;p.animation={clip:'idle',tick:0};p.anim='idle';p.z=p.vz=p.vx=p.vy=0;p.facing=facing;}
      k.x=100;k.y=courtY;k.facing=facing;k.hasBall=true;k.animation={clip:'push',tick:0};k.anim='push';
      opp.x=100-facing*8;opp.y=courtY; s.phase='playing';s.possession=k.team;s.pause=false;s.score=[0,0];s.clock=180;s.shotClock=24;s.rng=seed;
      Object.assign(s.ball,{mode:'carried',ownerId:k.id,lastTouch:k.id,targetId:null,aerialTargetId:null,attemptId:null,scored:false,x:k.x+facing*forwards[0],y:k.y,z:heights[0],vx:0,vy:0,vz:0});
      const image=new Image();image.src=atlas;await image.decode();window.__push={k,opp,atlas,heights,forwards,now:0,manifest:(await import('/src/content/animation-assets.js')).animationAssetManifest};
      window.__productionSpriteImagesForReview.set(atlas,image);const slider=document.querySelector('#camera-zoom');slider.value=String(zoom);slider.dispatchEvent(new Event('input',{bubbles:true}));g.tick(0,[]);
    }""",{'home':HOME,'away':AWAY,'zoom':zoom,'atlas':ATLAS,'heights':heights,'forwards':forwards,'facing':facing,'courtY':COURT_Y,'seed':SEED})
    run={'facing':facing,'direction':direction,'zoom':zoom,'captures':[]}
    for frame,tick in enumerate(TICKS):
     info=page.evaluate("""async ({tick,frame,atlas})=>{const g=window.jamverse,s=g.state,c=window.__push,k=c.k;while(c.now<tick){g.tick(1,s.players.map(p=>({playerId:p.id,x:0,y:0})));c.now++;}
       const {selectProductionSprite}=await import('/src/render/animation-sprites.js');const {sampleBallHeight,sampleBallForward}=await import('/src/core/animation.js');
       const selected=selectProductionSprite(k,{manifest:c.manifest,images:window.__productionSpriteImagesForReview});const h=sampleBallHeight('push',k.animation.tick,'kraken'),f=sampleBallForward('push',k.animation.tick,'kraken');
       const carried=s.ball.mode==='carried'&&s.ball.ownerId===k.id;return {frame,tick,clip:k.animation.clip,clipTick:k.animation.tick,track:{height:h,forward:f},carried,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z},selection:{src:selected?.src,frame:selected?.frame,flip:selected?.flip,expectedSrc:atlas,expectedFrame:frame},score:s.score};}""",{'tick':tick,'frame':frame,'atlas':ATLAS})
     info['path']=(OUT/f'frame-{frame:02d}-tick{tick:02d}-{direction}-zoom{zoom}.png').relative_to(ROOT).as_posix(); page.locator('#game').screenshot(path=str(ROOT/info['path'])); run['captures'].append(info)
    if errors: report['uncaughtBrowserErrors']+=errors; raise RuntimeError('Browser error '+json.dumps(errors))
    report['runs'].append(run);page.close()
  browser.close()
 report['captureCount']=sum(len(r['captures']) for r in report['runs']);report['expectedCaptureCount']=44
 if report['captureCount']!=44: raise RuntimeError(f"Expected 44 captures, got {report['captureCount']}")
 for run in report['runs']:
  for cap in run['captures']:
   if not cap['carried'] or cap['score']!=[0,0] or cap['selection']['src']!=ATLAS or cap['selection']['frame']!=cap['frame'] or cap['selection']['flip']!=(run['facing']<0): raise RuntimeError('Selector/attachment mismatch: '+json.dumps(cap))
 report['status']='candidate visual/selector review evidence only; no runtime asset/track registered'
 (OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'captures':report['captureCount'],'errors':report['uncaughtBrowserErrors'],'status':report['status']}))
finally:
 server.terminate()
 try: server.wait(timeout=5)
 except Exception: server.kill()
