"""Render Krios fall candidate poses on the current Jam Stage without registering them."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
from hashlib import sha256
import json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]; PORT=environ.get('PORT','4238'); URL=f'http://127.0.0.1:{PORT}/'; RUNTIME=environ.get('RUNTIME_INTEGRATION','0')=='1'
ATLAS='./public/assets/animation/krios-fall-right.webp' if RUNTIME else './tools/generate-art/previews/krios-fall10-attempt01/krios-fall10-attempt01-runtime-candidate.png'
TICKS=[1,3,5,8,11,14,18,23,29,35]; OUT=ROOT/'tools/generate-art/previews/krios-fall10-attempt01/live-knockdown-candidate' / ('registered-runtime' if RUNTIME else 'candidate'); OUT.mkdir(parents=True,exist_ok=True)
report={'athlete':'krios','clip':'fall','renderer':'Chromium current Jam Stage','atlas':ATLAS,'atlasSha256':sha256((ROOT/ATLAS[2:]).read_bytes()).hexdigest(),'court':'current Jam Stage; Scoria Rams vs Blackthorn Court Kings','courtY':90,'runtimeIntegration':RUNTIME,'candidateAtlasInjected':not RUNTIME,'candidateBallTrackInjected':False,'seed':2654435761,'liveFallTrigger':'Leo push hits off-ball Krios at tick8; fall animation starts on the following simulation tick; Leo is removed from the visual roster after the successful contact so he cannot occlude low fall poses; no ball ownership','frameDurations':[2,2,2,3,3,4,5,6,6,7],'sampledTicks':TICKS,'runs':[],'uncaughtBrowserErrors':[]}
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
try:
 deadline=monotonic()+30
 while monotonic()<deadline:
  if server.poll() is not None: raise RuntimeError('Jam Stage server exited')
  try:
   with urlopen(URL,timeout=1) as r:
    if r.status==200: break
  except Exception: sleep(.1)
 else: raise TimeoutError('Jam Stage server readiness')
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for zoom in (100,120):
   for facing,direction in ((1,'right'),(-1,'left')):
    page=browser.new_page(viewport={'width':900,'height':700},device_scale_factor=1);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    if not RUNTIME:
     def inject(route):
      resp=route.fetch();addition=f"\nanimationAssetManifest.characters.krios.directions.right.fall={{src:{json.dumps(ATLAS)},columns:10,rows:1,reviewed:true,frames:Array.from({{length:10}},(_,i)=>({{x:i*128,y:0,w:128,h:96}}))}}; animationAssetManifest.characters.krios.mirrorSafe=true; animationAssetManifest.characters.krios.mirrorReview={{status:'reviewed'}};\n";route.fulfill(response=resp,body=resp.text()+addition)
     page.route('**/src/content/animation-assets.js',inject)
    def expose(route):
     resp=route.fetch();route.fulfill(response=resp,body=resp.text()+'\nwindow.__productionSpriteImagesForReview=productionSpriteImages;')
    page.route('**/src/main.js',expose);page.add_init_script('window.requestAnimationFrame=()=>0')
    page.goto(URL,wait_until='networkidle',timeout=120000);page.wait_for_function('window.jamverse&&window.jamverse.rosterCheck.athletes===105',timeout=120000)
    home,away=('scoria-rams','blackthorn-court-kings') if facing>0 else ('blackthorn-court-kings','scoria-rams')
    page.evaluate("""async ({home,away,zoom,atlas,runtime})=>{const {animationAssetManifest}=await import('/src/content/animation-assets.js');const {selectProductionSprite}=await import('/src/render/animation-sprites.js');window.__review={manifest:animationAssetManifest,selectProductionSprite};window.jamverse.start(home,away,180,2654435761);const s=window.jamverse.state,k=s.players.find(p=>p.id==='krios'),l=s.players.find(p=>p.id==='leo');s.players=[k,l];s.possession=k.team;const sign=home==='scoria-rams'?1:-1;Object.assign(l,{x:100,y:93,facing:sign,hasBall:false,stun:0,animation:{clip:'idle',tick:0},anim:'idle'});Object.assign(k,{x:100+sign*4.7,y:90,z:0,vx:0,vy:0,vz:0,facing:-sign,hasBall:false,stun:0,animation:{clip:'idle',tick:0},anim:'idle'});Object.assign(s.ball,{mode:'dead',ownerId:null,targetId:null,aerialTargetId:null,attemptId:null,scored:false,x:100,y:90,z:0,vx:0,vy:0,vz:0});s.rng=2654435761;window.jamverse.tick(1,[{playerId:l.id,shovePressed:true},{playerId:k.id}]);while(l.animation.clip==='push'&&l.animation.tick<8)window.jamverse.tick(1,[{playerId:l.id},{playerId:k.id}]);window.jamverse.tick(1,[{playerId:l.id},{playerId:k.id}]);if(k.animation.clip!=='fall')throw Error('Deterministic push did not knock Krios down');const event=s.events.at(-1);s.players=[k];window.__live={k,l,startedAt:k.animation.tick,event};if(!runtime){const image=new Image();image.src=atlas;await image.decode();window.__productionSpriteImagesForReview.set(atlas,image);}document.querySelector('#camera-zoom').value=String(zoom);document.querySelector('#camera-zoom').dispatchEvent(new Event('input',{bubbles:true}));window.__krios=k;}""",{'home':home,'away':away,'zoom':zoom,'atlas':ATLAS,'runtime':RUNTIME})
    page.wait_for_function('(src)=>{let i=window.__productionSpriteImagesForReview?.get(src);return Boolean(i?.complete&&i.naturalWidth)}',arg=ATLAS,timeout=120000,polling=100)
    run={'facing':facing,'direction':direction,'zoom':zoom,'captures':[]}
    for index,tick in enumerate(TICKS):
     info=page.evaluate("""({atlas,tick})=>{const k=window.__krios,a=window.__review;while(k.animation.tick<tick)window.jamverse.tick(1,[{playerId:window.__live.l.id},{playerId:k.id}]);const selected=a.selectProductionSprite(k,{manifest:a.manifest,images:window.__productionSpriteImagesForReview});return {tick:k.animation.tick,clip:k.animation.clip,selectedFrame:selected?.frame,selectedSrc:selected?.src,flip:selected?.flip,ballMode:window.jamverse.state.ball.mode,owner:window.jamverse.state.ball.ownerId,triggerEvent:window.__live.event};}""",{'atlas':ATLAS,'tick':tick})
     if info['selectedFrame']!=index or info['selectedSrc']!=ATLAS or info['flip']!=(facing<0):raise RuntimeError('selector mismatch '+json.dumps(info))
     name=f'{direction}-frame{index}-tick{tick}-zoom{zoom}.png';page.locator('#game').screenshot(path=str(OUT/name));info['path']=(OUT/name).relative_to(ROOT).as_posix();run['captures'].append(info)
    if errors:report['uncaughtBrowserErrors'].extend(errors);raise RuntimeError(str(errors))
    report['runs'].append(run);page.close()
  browser.close()
 report['captureCount']=sum(len(r['captures']) for r in report['runs']);(OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'captures':report['captureCount'],'errors':report['uncaughtBrowserErrors'],'output':str(OUT)}))
finally:server.terminate();server.wait(timeout=5)
