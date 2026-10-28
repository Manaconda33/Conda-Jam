"""Validate the unregistered push candidate in real current Jam Stage gameplay.

The captain is a defender pushing a ball-carrying Krios. Candidate artwork/track
are response overrides only; no production registry is modified.
"""
from pathlib import Path
from os import environ
from subprocess import Popen,DEVNULL
from time import monotonic,sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'tools/generate-art/previews/kraken-push-track-candidate/attempt-02'/environ.get('PUSH_STAGE_VARIANT','actual-gameplay');OUT.mkdir(parents=True,exist_ok=True)
CARRIER=bool(int(environ.get('PUSH_CARRIER','0')))
PORT=environ.get('PORT','4293');URL=f'http://127.0.0.1:{PORT}/';ATLAS='./tools/generate-art/previews/kraken-push11-attempt01/kraken-push11-attempt01-runtime-candidate.png'
track=json.load(open(ROOT/'tools/generate-art/previews/kraken-push-track-candidate/attempt-02/track.json'));heights=track['height'];forwards=track['forward'];ticks=track['frameStartTicks']
report={'renderer':'Chromium current Jam Stage production canvas','athlete':'kraken','clip':'push','atlas':ATLAS,'trackAttempt':2,'candidateOverridesOnly':True,'runtimeIntegration':False,'scenario':('actual shove against ball-carrying Krios' if CARRIER else 'actual shove against off-ball Krios')+' within reach; Kraken is placed nearer the sideline for contact visibility; deterministic seed 1','frameStartTicks':ticks,'runs':[],'uncaughtBrowserErrors':[]}
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
try:
 deadline=monotonic()+30
 while monotonic()<deadline:
  if server.poll() is not None:raise RuntimeError('Jam Stage server exited')
  try:
   with urlopen(URL,timeout=1) as res:
    if res.status==200:break
  except Exception:sleep(.1)
 else:raise TimeoutError('server did not become ready')
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for zoom in (100,120):
   for facing,direction in ((1,'right'),(-1,'left')):
    page=browser.new_page(viewport={'width':900,'height':700});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    def override_manifest(route):
     res=route.fetch();add=f"\nanimationAssetManifest.characters.kraken.directions.right.push={{src:{json.dumps(ATLAS)},columns:4,rows:3,reviewed:true,frames:Array.from({{length:11}},(_,i)=>({{x:(i%4)*80,y:Math.floor(i/4)*96,w:80,h:96}}))}};animationAssetManifest.characters.kraken.mirrorSafe=true;animationAssetManifest.characters.kraken.mirrorReview={{status:'reviewed'}};";route.fulfill(response=res,body=res.text()+add)
    def override_track(route):
     res=route.fetch();route.fulfill(response=res,body=res.text()+f"\nathleteBallTracks.kraken.push={json.dumps({'height':heights,'forward':forwards},separators=(',',':'))};")
    def expose_images(route):
     res=route.fetch();route.fulfill(response=res,body=res.text()+'\nwindow.__productionSpriteImagesForReview=productionSpriteImages;')
    page.route('**/src/content/animation-assets.js',override_manifest);page.route('**/src/core/animation.js',override_track);page.route('**/src/main.js',expose_images)
    page.add_init_script('window.requestAnimationFrame=()=>0');page.goto(URL,wait_until='networkidle',timeout=120000);page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105',timeout=120000)
    page.evaluate("""async ({zoom,atlas,facing,heights,forwards,carrier})=>{const g=window.jamverse;g.start('vesper-harbor-undertow','scoria-rams',180,1);const s=g.state,k=s.players.find(p=>p.id==='kraken'),t=s.players.find(p=>p.id==='krios');if(!k||!t)throw Error('Kraken/Krios missing');s.players=[k,t];for(const p of s.players){p.stun=0;p.hasBall=false;p.charge=0;p.animation={clip:'idle',tick:0};p.anim='idle';p.z=p.vz=p.vx=p.vy=0;p.facing=facing;}k.x=100;k.y=54;k.facing=facing;t.x=100+facing*4;t.y=50;t.hasBall=carrier;t.facing=-facing;t.animation={clip:'idle-ball',tick:0};t.anim='idle-ball';s.phase='playing';s.possession=t.team;s.pause=false;s.score=[0,0];s.clock=180;s.shotClock=24;s.rng=1;Object.assign(s.ball,{mode:carrier?'carried':'dead',ownerId:carrier?t.id:null,lastTouch:t.id,targetId:null,aerialTargetId:null,attemptId:null,scored:false,x:t.x,y:t.y,z:carrier?1.1:0,vx:0,vy:0,vz:0});const im=new Image();im.src=atlas;await im.decode();window.__pushActual={k,t,atlas,now:0,manifest:(await import('/src/content/animation-assets.js')).animationAssetManifest};window.__productionSpriteImagesForReview.set(atlas,im);let sl=document.querySelector('#camera-zoom');sl.value=String(zoom);sl.dispatchEvent(new Event('input',{bubbles:true}));g.tick(0,[]);const inputs=s.players.map(p=>({playerId:p.id,x:0,y:0,shovePressed:p.id===k.id}));g.tick(1,inputs);if(k.animation.clip!=='push'||k.animation.action?.kind!=='push')throw Error('Real defensive shove did not select push clip');window.__pushActual.now=0;}""",{'zoom':zoom,'atlas':ATLAS,'facing':facing,'heights':heights,'forwards':forwards,'carrier':CARRIER})
    run={'direction':direction,'facing':facing,'zoom':zoom,'captures':[]}
    for frame,tick in enumerate(ticks):
     c=page.evaluate("""async ({tick,frame,atlas})=>{const g=window.jamverse,s=g.state,c=window.__pushActual,k=c.k,t=c.t;while(c.now<tick){g.tick(1,s.players.map(p=>({playerId:p.id,x:0,y:0})));c.now++;}const {selectProductionSprite}=await import('/src/render/animation-sprites.js');const {anchorTick}=await import('/src/core/animation.js');const sel=selectProductionSprite(k,{manifest:c.manifest,images:window.__productionSpriteImagesForReview});return {frame,tick,clip:k.animation.clip,clipTick:k.animation.tick,targetId:k.animation.action?.targetId??null,contactTick:anchorTick('push','contact'),targetStun:t.stun,knockdowns:k.knockdowns,ball:{mode:s.ball.mode,owner:s.ball.ownerId,lastTouch:s.ball.lastTouch},score:s.score,selection:{src:sel?.src,frame:sel?.frame,flip:sel?.flip,expectedSrc:atlas,expectedFrame:frame},events:s.events.slice(-2)};}""",{'tick':tick,'frame':frame,'atlas':ATLAS})
     c['path']=(OUT/f'{direction}-zoom{zoom}-frame{frame:02d}-tick{tick:02d}.png').relative_to(ROOT).as_posix();page.locator('#game').screenshot(path=str(ROOT/c['path']));run['captures'].append(c)
    report['runs'].append(run)
    if errors:report['uncaughtBrowserErrors']+=errors;raise RuntimeError('browser error '+json.dumps(errors))
    page.close()
  browser.close()
 report['captureCount']=sum(len(r['captures']) for r in report['runs']);report['expectedCaptureCount']=44
 for run in report['runs']:
  contact=next(c for c in run['captures'] if c['tick']==8)
  if contact['clip']!='push' or contact['knockdowns']<1 or contact['targetStun']<=0 or contact['ball']['mode']!=('loose' if CARRIER else 'dead') or contact['score']!=[0,0]:raise RuntimeError('Tick8 real push contact did not knock ball loose: '+json.dumps(contact))
  for c in run['captures']:
   if c['selection']['src']!=ATLAS or c['selection']['frame']!=c['frame'] or c['selection']['flip']!=(run['facing']<0):raise RuntimeError('production selector mismatch '+json.dumps(c))
 report['status']='actual push gameplay candidate passed selector/timing/knockdown checks, but independent visual review remains required; no runtime registration'
 (OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'captures':report['captureCount'],'errors':report['uncaughtBrowserErrors'],'status':report['status']}))
finally:
 server.terminate()
 try:server.wait(timeout=5)
 except Exception:server.kill()
