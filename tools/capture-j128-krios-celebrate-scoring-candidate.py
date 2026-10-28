"""Capture Krios celebrate after the production scoring transition on Jam Stage."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
from hashlib import sha256
import json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];PORT=environ.get('PORT','4239');URL=f'http://127.0.0.1:{PORT}/';ATLAS='./public/assets/animation/krios-celebrate-right.webp'
TICKS=[0,5,10,16,24,34,44,52,59,65];OUT=ROOT/'tools/generate-art/previews/krios-celebrate10-attempt01/scoring-transition/registered-runtime';OUT.mkdir(parents=True,exist_ok=True)
report={'athlete':'krios','clip':'celebrate','renderer':'Chromium production Jam Stage canvas','atlas':ATLAS,'atlasSha256':sha256((ROOT/ATLAS[2:]).read_bytes()).hexdigest(),'runtimeIntegration':True,'candidateAtlasInjected':False,'scoringTransition':'Production commitScore(match,{id,team,playerId,points}) starts celebrate and marks the ball dead/unowned; no clip/tick/score injection.','court':'current Jam Stage; Scoria Rams vs Blackthorn Court Kings','courtY':90,'frameDurations':[5,5,6,8,10,10,8,7,6,5],'sampledTicks':TICKS,'runs':[],'uncaughtBrowserErrors':[]}
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
try:
 deadline=monotonic()+30
 while monotonic()<deadline:
  if server.poll() is not None:raise RuntimeError('Jam Stage server exited')
  try:
   with urlopen(URL,timeout=1) as r:
    if r.status==200:break
  except Exception:sleep(.1)
 else:raise TimeoutError('Jam Stage server readiness')
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for zoom in (100,120):
   for facing,direction in ((1,'right'),(-1,'left')):
    page=browser.new_page(viewport={'width':900,'height':700},device_scale_factor=1);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.add_init_script('window.requestAnimationFrame=()=>0')
    def expose(route):
     response=route.fetch();route.fulfill(response=response,body=response.text()+'\nwindow.__productionSpriteImagesForReview=productionSpriteImages;')
    page.route('**/src/main.js',expose)
    page.goto(URL,wait_until='networkidle',timeout=120000);page.wait_for_function('window.jamverse&&window.jamverse.rosterCheck.athletes===105',timeout=120000)
    home,away=('scoria-rams','blackthorn-court-kings') if facing>0 else ('blackthorn-court-kings','scoria-rams')
    init=page.evaluate("""async({home,away,zoom,atlas})=>{const {animationAssetManifest}=await import('/src/content/animation-assets.js');const {commitScore}=await import('/src/core/simulation.js');const {selectProductionSprite}=await import('/src/render/animation-sprites.js');const m=window.jamverse.start(home,away,180,1013904226);const s=window.jamverse.state,k=s.players.find(p=>p.id==='krios');s.players=[k];k.facing=home==='scoria-rams'?1:-1;k.x=90;k.y=50;k.z=0;k.hasBall=false;k.vx=k.vy=k.vz=0;s.ball.mode='dead';s.ball.ownerId=null;s.ball.x=k.x;s.ball.y=k.y;s.ball.z=0;s.ball.lastTouch=k.id;s.score=[0,0];s.pause=false;const ok=commitScore(s,{id:'krios-celebrate-review',team:k.team,playerId:k.id,points:2});if(!ok||k.animation.clip!=='celebrate'||k.animation.tick!==0)throw Error('production score did not start celebrate');window.__celebrate={manifest:animationAssetManifest,selectProductionSprite,k};document.querySelector('#camera-zoom').value=String(zoom);document.querySelector('#camera-zoom').dispatchEvent(new Event('input',{bubbles:true}));return{score:[...s.score],ballMode:s.ball.mode,owner:s.ball.ownerId,event:s.events.at(-1),clip:k.animation.clip,tick:k.animation.tick};}""",{'home':home,'away':away,'zoom':zoom,'atlas':ATLAS})
    page.wait_for_function('(src)=>{const i=window.__productionSpriteImagesForReview?.get(src);return Boolean(i?.complete&&i.naturalWidth)}',arg=ATLAS,timeout=120000,polling=100)
    run={'facing':facing,'direction':direction,'zoom':zoom,'scoreTransition':init,'captures':[]}
    for index,tick in enumerate(TICKS):
     info=page.evaluate("""({tick,atlas})=>{const g=window.jamverse,s=g.state,k=window.__celebrate.k;while(k.animation.tick<tick)g.tick(1,[{playerId:k.id}]);g.tick(0,[]);const selected=window.__celebrate.selectProductionSprite(k,{manifest:window.__celebrate.manifest,images:window.__productionSpriteImagesForReview});return{tick:k.animation.tick,clip:k.animation.clip,selectedFrame:selected?.frame,selectedSrc:selected?.src,flip:selected?.flip,score:[...s.score],ballMode:s.ball.mode,owner:s.ball.ownerId,scored:s.ball.scored,event:s.events.at(-1)};}""",{'tick':tick,'atlas':ATLAS})
     if info['tick']!=tick or info['selectedFrame']!=index or info['selectedSrc']!=ATLAS or info['flip']!=(facing<0) or info['score'][0 if facing>0 else 1]!=2 or info['ballMode']!='dead' or info['owner'] is not None:raise RuntimeError('celebration state/selector mismatch '+json.dumps(info))
     name=f'{direction}-frame{index}-tick{tick}-zoom{zoom}.png';page.locator('#game').screenshot(path=str(OUT/name));info['path']=(OUT/name).relative_to(ROOT).as_posix();run['captures'].append(info)
    if errors:report['uncaughtBrowserErrors'].extend(errors);raise RuntimeError(str(errors))
    report['runs'].append(run);page.close()
  browser.close()
 report['captureCount']=sum(len(r['captures']) for r in report['runs']);(OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'captures':report['captureCount'],'errors':report['uncaughtBrowserErrors'],'output':str(OUT)}))
finally:server.terminate();server.wait(timeout=5)
