"""Capture Krios steal art and separate-ball contact on current Jam Stage."""
from pathlib import Path
from os import environ
from subprocess import Popen,DEVNULL
from time import monotonic,sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
RUNTIME_INTEGRATION=environ.get('RUNTIME_INTEGRATION','0')=='1'
ATLAS=environ.get('ATLAS','./public/assets/animation/krios-steal-right.webp' if RUNTIME_INTEGRATION else './tools/generate-art/previews/krios-steal8-attempt01/krios-steal8-attempt01-runtime-candidate.png')
TRACK=json.loads(environ.get('TRACK_JSON','{"height":[1.0,0.9,0.75,0.5,0.6,0.9,1.05,1.0],"forward":[6,8,10,8,10,8,8,7]}'))
ATTEMPT=environ.get('ATTEMPT','01');PORT=environ.get('PORT','4234');URL=f'http://127.0.0.1:{PORT}/';COURT_Y=90
OUT=ROOT/(f'tools/generate-art/previews/j128-krios-steal-track-candidate/attempt-{ATTEMPT}/registered-runtime' if RUNTIME_INTEGRATION else f'tools/generate-art/previews/j128-krios-steal-track-candidate/attempt-{ATTEMPT}/native');OUT.mkdir(parents=True,exist_ok=True)
TICKS=[1,3,4,5,7,9,11,13]
report={'renderer':'Chromium production Jam Stage canvas','athlete':'krios','clip':'steal','candidateAtlas':ATLAS,
 'candidateTrack':TRACK,'runtimeIntegration':RUNTIME_INTEGRATION,'candidateAtlasInjected':not RUNTIME_INTEGRATION,'candidateTrackInjected':not RUNTIME_INTEGRATION,
 'court':'current Jam Stage court geometry; Scoria Rams vs Blackthorn Court Kings','courtY':COURT_Y,
 'frameStartTicks':TICKS,'frameDurations':[2,2,1,1,2,2,3,3],
 'captureMethod':('No atlas or track injection. beginMatch loads the registered atlas and actual `athleteBallTracks.krios.steal` through the normal app/core path; the harness waits for the registered `productionSpriteImages` entry before input.' if RUNTIME_INTEGRATION else 'The candidate atlas is decoded and placed in the app productionSpriteImages map; the in-memory manifest and athleteBallTracks.krios.steal are injected before startup.')+' Production Jam Stage inputs and stepMatch drive all animation and ball state. Showcase runs use a real defensive steal input against a holder outside reach so all eight art frames can play; contact runs use in-range holders, search deterministic seeds with Krios’s actual steal stat until a real tick5 steal occurs, then capture the separate loose ball created from heldBallPoint. No per-tick ball teleporting.',
 'runs':[],'uncaughtBrowserErrors':[]}
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
try:
 deadline=monotonic()+30
 while monotonic()<deadline:
  if server.poll() is not None:raise RuntimeError('Jam Stage server exited')
  try:
   with urlopen(URL,timeout=1) as response:
    if response.status==200:break
  except Exception:sleep(.1)
 else:raise TimeoutError('Jam Stage server did not become ready')
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for zoom in (100,120):
   for facing,direction in ((1,'right'),(-1,'left')):
    page=browser.new_page(viewport={'width':900,'height':700});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    def inject_manifest(route):
     response=route.fetch();body=response.text();marker='export const animationAssetManifest = '
     if marker not in body:raise RuntimeError('manifest export missing')
     addition=f"\nanimationAssetManifest.characters.krios.directions.right.steal={{src:'{ATLAS}',columns:8,rows:1,reviewed:true,mirrorSafe:true,frames:Array.from({{length:8}},(_,i)=>({{x:i*128,y:0,w:128,h:96}}))}};\n"
     route.fulfill(response=response,body=body+addition)
    def inject_track(route):
     response=route.fetch();body=response.text();marker='function sampleFrameScalar('
     if marker not in body:raise RuntimeError('track injection point missing')
     addition=f"athleteBallTracks.krios ||= {{}}; athleteBallTracks.krios.steal={json.dumps(TRACK,separators=(',',':'))};\n"
     route.fulfill(response=response,body=body.replace(marker,addition+marker,1))
    if not RUNTIME_INTEGRATION:
     page.route('**/src/content/animation-assets.js',inject_manifest);page.route('**/src/core/animation.js',inject_track)
    def expose_main(route):
     response=route.fetch();route.fulfill(response=response,body=response.text()+'\nwindow.__productionSpriteImagesForReview=productionSpriteImages;\n')
    page.route('**/src/main.js',expose_main)
    page.add_init_script(f'window.requestAnimationFrame=()=>0;window.__stealRuntimeIntegration={str(RUNTIME_INTEGRATION).lower()}')
    page.goto(URL,wait_until='networkidle',timeout=120000);page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105',timeout=120000)
    home='scoria-rams' if facing>0 else 'blackthorn-court-kings';away='blackthorn-court-kings' if facing>0 else 'scoria-rams'
    page.evaluate("""async({atlas,home,away,zoom,facing})=>{
      const {animationAssetManifest}=await import('/src/content/animation-assets.js');window.__animationAssetManifestForReview=animationAssetManifest;
      const {selectProductionSprite}=await import('/src/render/animation-sprites.js');window.__selectProductionSpriteForReview=selectProductionSprite;
      const clip=animationAssetManifest.characters.krios.directions.right.steal;
      if(clip.src!==atlas||clip.frames.length!==8||!clip.reviewed)throw Error('clip registration missing or review pending');
      window.jamverse.start(home,away,180,53);
      if(!window.__stealRuntimeIntegration){const image=new Image();image.src=atlas;await image.decode();window.__stealCandidateImage=image;window.__productionSpriteImagesForReview.set(atlas,image);}
      document.querySelector('#camera-zoom').value=String(zoom);document.querySelector('#camera-zoom').dispatchEvent(new Event('input',{bubbles:true}));
      return true;
    }""",{'atlas':ATLAS,'home':home,'away':away,'zoom':zoom,'facing':facing})
    page.wait_for_function('(src)=>{const i=window.__productionSpriteImagesForReview.get(src);return Boolean(i?.complete&&i.naturalWidth)}',arg=ATLAS,timeout=30000,polling=100)
    # Drive the complete eight-pose sequence through the real defensive input path.
    setup="""({facing,courtY,holderDistance})=>{
      const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='krios'),h=s.players.find(x=>x.team!==p.team);
      if(!p||!h)throw Error('Krios or opposing holder missing');s.players=[p,h];s.possession=h.team;s.phase='playing';s.pause=false;s.score=[0,0];s.scorePause=0;
      p.x=100;p.y=courtY;p.vx=p.vy=p.vz=p.z=0;p.facing=facing;p.hasBall=false;p.stun=0;p.animation={clip:'idle',tick:0};p.anim='idle';
      h.x=100+facing*holderDistance;h.y=courtY;h.vx=h.vy=h.vz=h.z=0;h.facing=-facing;h.hasBall=true;h.stun=0;h.animation={clip:'idle-ball',tick:0};h.anim='idle-ball';
      Object.assign(s.ball,{mode:'carried',ownerId:h.id,targetId:null,lastTouch:h.id,attemptId:null,scored:false,vx:0,vy:0,vz:0,x:h.x+h.facing*6,y:h.y,z:1});
      g.tick(1,[{playerId:p.id,stealPressed:true},{playerId:h.id,x:0,y:0}]);return {player:p.id,holder:h.id,teams:[p.team,h.team],steal:p.steal,tick:p.animation.tick};
    }"""
    init=page.evaluate(setup,{'facing':facing,'courtY':COURT_Y,'holderDistance':20})
    run={'mode':'full-pose-sequence','facing':facing,'direction':direction,'zoom':zoom,'initialState':init,'captures':[]}
    for frame,tick in enumerate(TICKS):
     current=page.evaluate("""({target,atlas})=>{const g=window.jamverse,s=g.state,p=s.players[0],h=s.players[1];while(p.animation.tick<target)g.tick(1,[{playerId:p.id,x:0,y:0},{playerId:h.id,x:0,y:0}]);
      const selected=window.__selectProductionSpriteForReview(p,{manifest:window.__animationAssetManifestForReview,images:window.__productionSpriteImagesForReview});return {tick:p.animation.tick,clip:p.animation.clip,frame:selected?.frame,src:selected?.src,flip:selected?.flip,hasBall:p.hasBall,steals:p.steals,ball:{mode:s.ball.mode,ownerId:s.ball.ownerId,x:s.ball.x,y:s.ball.y,z:s.ball.z},holderStun:h.stun};}""",{'target':tick,'atlas':ATLAS})
     current['zoom']=zoom;current['path']=(OUT.relative_to(ROOT)/f'{direction}-frame{current["frame"]}-tick{tick}-zoom{zoom}.png').as_posix()
     page.locator('#game').screenshot(path=str(ROOT/current['path']));run['captures'].append(current)
     if current['frame']!=frame or current['src']!=ATLAS or current['flip']!=(facing<0):raise RuntimeError(f'frame selection mismatch {current}')
    if any(c['hasBall'] or c['steals'] for c in run['captures']):raise RuntimeError('out-of-range showcase unexpectedly stole the ball')
    report['runs'].append(run)
    # Separate real successful steal run places the loose ball from the Krios frame3/tick5 track.
    successSeed=page.evaluate("""({facing,courtY})=>{const g=window.jamverse;for(let seed=1;seed<=300;seed++){
      const home=facing>0?'scoria-rams':'blackthorn-court-kings',away=facing>0?'blackthorn-court-kings':'scoria-rams';g.start(home,away,180,seed);const s=g.state,p=s.players.find(x=>x.id==='krios'),h=s.players.find(x=>x.team!==p.team);s.players=[p,h];s.possession=h.team;
      p.x=100;p.y=courtY;p.vx=p.vy=p.vz=p.z=0;p.facing=facing;p.hasBall=false;p.stun=0;p.animation={clip:'idle',tick:0};
      h.x=100+facing*4;h.y=courtY-6;h.vx=h.vy=h.vz=h.z=0;h.facing=-facing;h.hasBall=true;h.stun=0;h.animation={clip:'idle-ball',tick:0};
      Object.assign(s.ball,{mode:'carried',ownerId:h.id,targetId:null,lastTouch:h.id,attemptId:null,scored:false,vx:0,vy:0,vz:0,x:h.x+h.facing*6,y:h.y,z:1});s.rng=seed>>>0;
      g.tick(1,[{playerId:p.id,stealPressed:true},{playerId:h.id,x:0,y:0}]);while(p.animation.tick<5)g.tick(1,[{playerId:p.id,x:0,y:0},{playerId:h.id,x:0,y:0}]);
      if(p.steals===1)return {seed,tick:p.animation.tick,clip:p.animation.clip,frame:window.__selectProductionSpriteForReview(p,{manifest:window.__animationAssetManifestForReview,images:window.__productionSpriteImagesForReview})?.frame,
       steals:p.steals,playerHasBall:p.hasBall,holderHasBall:h.hasBall,ball:{mode:s.ball.mode,ownerId:s.ball.ownerId,x:s.ball.x,y:s.ball.y,z:s.ball.z},holderStun:h.stun,steal:p.steal};
    }throw Error('no deterministic successful steal seed found');}""",{'facing':facing,'courtY':COURT_Y})
    contact={'mode':'successful-contact','facing':facing,'direction':direction,'zoom':zoom,**successSeed};
    name=f'{direction}-contact-frame{successSeed.get("frame")}-tick5-zoom{zoom}.png';contact['path']=(OUT.relative_to(ROOT)/name).as_posix();page.locator('#game').screenshot(path=str(ROOT/contact['path']));report['runs'].append(contact)
    if errors:raise RuntimeError('browser errors '+json.dumps(errors))
    page.close()
  browser.close()
 report['uncaughtBrowserErrors']=[];report['captureCount']=sum(len(r['captures']) if 'captures' in r else 1 for r in report['runs']);(OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'captures':report['captureCount'],'runs':len(report['runs']),'track':TRACK,'errors':report['uncaughtBrowserErrors'],'output':str(OUT)}))
finally:
 server.terminate();server.wait(timeout=5)
