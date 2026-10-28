"""Run Krios alley-oop-power through Jam Stage with candidate art and ball tracks.

Candidate atlas/track are injected before game start. The teammate throws a real
alley-oop pass; all later movement is production simulation tick advancement.
"""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
from hashlib import sha256
import json

from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
PORT=environ.get('PORT','4261')
URL=f'http://127.0.0.1:{PORT}/'
TRACK_ATTEMPT=environ.get('TRACK_ATTEMPT','01')
CAMERA_SHIM=environ.get('CAMERA_SHIM','0')=='1'
RUNTIME_INTEGRATION=environ.get('RUNTIME_INTEGRATION','0')=='1'
ATLAS='./tools/generate-art/previews/krios-alley-oop-power15-attempt01/krios-alley-oop-power15-attempt01-runtime-candidate.png'
if RUNTIME_INTEGRATION: ATLAS='./public/assets/animation/krios-alley-oop-power-right.png'
# Attempt01 uses the canonical hand-center projection in animation.js.
# Later attempts may override positions after native capture review.
TRACKS={
 '01': {'height':[1.37,1.71,2.22,2.16,1.96,1.82,1.70,1.93,1.93,1.34,.70,.64,.39,.37,.65],
       'forward':[9.50,10.23,7.67,5.12,8.40,4.75,0.00,10.23,10.23,11.70,5.12,1.10,-2.19,-1.10,-2.92]},
 '02': {'height':[1.37,1.71,2.22,2.16,1.96,.65,.55,.85,1.0,1.1,.70,.64,.39,.37,.65],
       'forward':[9.50,10.23,7.67,5.12,8.40,2.5,0.0,5.0,5.0,6.0,5.12,1.10,-2.19,-1.10,-2.92]},
 '03': {'height':[1.37,1.71,2.22,2.16,1.96,.65,.55,.70,.45,1.1,.70,.64,.39,.37,.65],
       'forward':[9.50,10.23,7.67,5.12,8.40,2.5,0.0,7.5,10.0,6.0,5.12,1.10,-2.19,-1.10,-2.92]},
 '04': {'height':[1.37,1.71,2.22,2.16,1.96,.65,.55,.70,.45,2.0,.70,.64,.39,.37,.65],
       'forward':[9.50,10.23,7.67,5.12,8.40,2.5,0.0,7.5,10.0,2.5,5.12,1.10,-2.19,-1.10,-2.92]},
 '05': {'height':[1.37,1.71,2.22,2.16,1.96,.65,.55,.70,.45,1.6,.70,.64,.39,.37,.65],
       'forward':[9.50,10.23,7.67,5.12,8.40,2.5,0.0,7.5,10.0,2.5,5.12,1.10,-2.19,-1.10,-2.92]},
}
TRACK=TRACKS[TRACK_ATTEMPT]
TICKS=[0,2,4,7,9,10,12,14,17,19,21,23,26,28,30]
OUT=ROOT/(f'tools/generate-art/previews/krios-alley-oop-power15-attempt01/live-gameplay-candidate/normal-loader-runtime' if RUNTIME_INTEGRATION else f'tools/generate-art/previews/krios-alley-oop-power15-attempt01/live-gameplay-candidate/track-attempt{TRACK_ATTEMPT}')
if CAMERA_SHIM: OUT=OUT/'camera-shim'
OUT.mkdir(parents=True,exist_ok=True)
report={'renderer':'Chromium current Jam Stage production renderer','athlete':'krios','clip':'alley-oop-power','atlas':ATLAS,'atlasSha256':sha256((ROOT/ATLAS[2:]).read_bytes()).hexdigest(),'trackAttempt':TRACK_ATTEMPT,'candidateTrack':TRACK,'runtimeIntegration':RUNTIME_INTEGRATION,'cameraShim':CAMERA_SHIM,'candidateAtlasInjected':not RUNTIME_INTEGRATION,'candidateBallTrackInjected':not RUNTIME_INTEGRATION,'court':'current Jam Stage; actual teammate alley-oop pass; Scoria Rams / Blackthorn Court Kings','courtY':90,'sampleTicks':TICKS,'expectedScore':[2,0],'method':'Set Krios and Flint in a live match, throw a production turbo alley-oop pass, then advance normal simulation ticks. The target starts the real alley-oop-power action and catches only at the authored grab anchor. Runtime mode uses the registered atlas and Krios-specific track without injection.','runs':[],'uncaughtBrowserErrors':[]}
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
try:
 deadline=monotonic()+30
 while monotonic()<deadline:
  if server.poll() is not None: raise RuntimeError('Jam Stage server exited before ready')
  try:
   with urlopen(URL,timeout=1) as response:
    if response.status==200: break
  except Exception: sleep(.1)
 else: raise TimeoutError('Jam Stage server readiness')
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for zoom in (100,120):
   for facing,direction in ((1,'right'),(-1,'left')):
    page=browser.new_page(viewport={'width':900,'height':700},device_scale_factor=1)
    errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
    def inject_manifest(route):
     response=route.fetch()
     add=f"\nanimationAssetManifest.characters.krios.directions.right['alley-oop-power']={{src:{json.dumps(ATLAS)},columns:15,rows:1,reviewed:true,frames:Array.from({{length:15}},(_,i)=>({{x:i*128,y:0,w:128,h:96}}))}}; animationAssetManifest.characters.krios.mirrorSafe=true; animationAssetManifest.characters.krios.mirrorReview={{status:'reviewed'}};\n"
     route.fulfill(response=response,body=response.text()+add)
    def inject_track(route):
     response=route.fetch();route.fulfill(response=response,body=response.text()+f"\nathleteBallTracks.krios['alley-oop-power']={json.dumps(TRACK,separators=(',',':'))};\n")
    def expose_images(route):
     response=route.fetch();body=response.text()
     if CAMERA_SHIM:
      needle="p.animation?.clip?.startsWith('dunk-')"
      body=body.replace(needle,"(p.animation?.clip?.startsWith('dunk-')||p.animation?.clip?.startsWith('alley-oop-'))")
      if body.count("p.animation?.clip?.startsWith('alley-oop-')")<5: raise RuntimeError('camera shim missed expected dunk camera/render branches')
     route.fulfill(response=response,body=body+'\nwindow.__productionSpriteImagesForReview=productionSpriteImages; window.__setReviewCameraX=(x)=>{camX=x};\n')
    if not RUNTIME_INTEGRATION:
     page.route('**/src/content/animation-assets.js',inject_manifest)
     page.route('**/src/core/animation.js',inject_track)
    page.route('**/src/main.js',expose_images)
    page.add_init_script('window.requestAnimationFrame=()=>0')
    page.goto(URL,wait_until='networkidle',timeout=120000)
    page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105',timeout=120000)
    home,away=('scoria-rams','blackthorn-court-kings') if facing>0 else ('blackthorn-court-kings','scoria-rams')
    page.evaluate("""async ({home,away,zoom,atlas,track,facing,startX,passerStart,seed})=>{
      const {animationAssetManifest}=await import('/src/content/animation-assets.js');
      const {sampleBallHeight,sampleBallForward,animationClips,anchorTick}=await import('/src/core/animation.js');
      const {selectProductionSprite}=await import('/src/render/animation-sprites.js');
      const g=window.jamverse;g.start(home,away,180,seed);const s=g.state,k=s.players.find(p=>p.id==='krios'),passer=s.players.find(p=>p.id==='flint-rooker');
      if(!k||!passer||k.team!==passer.team)throw Error('Krios/teammate missing from match');
      for(const p of s.players){p.hasBall=false;p.charge=0;p.stun=0;p.animation={clip:'idle',tick:0};p.anim='idle';p.z=p.vz=0;p.vx=p.vy=0;p.action=null;p.dunk=99;p.x=p.team===k.team?100:100;p.y=p.team===k.team?18:82;}
      k.x=startX;k.y=46;k.facing=facing;k.z=k.vz=0;k.vx=k.vy=0;k.hasBall=false;k.animation={clip:'idle',tick:0};k.anim='idle';
      passer.x=passerStart;passer.y=50;passer.facing=facing;passer.vx=facing*.2;passer.hasBall=true;passer.animation={clip:'idle-ball',tick:0};passer.anim='idle-ball';
      s.phase='playing';s.possession=k.team;s.pause=false;s.score=[0,0];s.clock=180;s.shotClock=24;s.rng=seed;
      Object.assign(s.ball,{mode:'carried',ownerId:passer.id,lastTouch:passer.id,targetId:null,aerialTargetId:null,attemptId:null,scored:false,x:passer.x+facing*6,y:passer.y,z:1.1,vx:0,vy:0,vz:0});
      window.__candidate={manifest:animationAssetManifest,sampleBallHeight,sampleBallForward,animationClips,anchorTick,selectProductionSprite,k,passer};
      if(!window.__productionSpriteImagesForReview.has(atlas)){const image=new Image();image.src=atlas;await image.decode();window.__productionSpriteImagesForReview.set(atlas,image);}
      document.querySelector('#camera-zoom').value=String(zoom);document.querySelector('#camera-zoom').dispatchEvent(new Event('input',{bubbles:true}));
      window.__setReviewCameraX(k.x);g.tick(0,[]);
      g.tick(1,[{playerId:passer.id,passPressed:true,turbo:true,alleyOop:'power'},...s.players.filter(p=>p!==passer).map(p=>({playerId:p.id}))]);
      while(passer.animation.clip==='pass-overhead'&&passer.animation.tick<anchorTick('pass-overhead','release'))g.tick(1,s.players.map(p=>({playerId:p.id})));
      if(k.animation.clip!=='alley-oop-power'||k.animation.tick!==0)throw Error('Expected real production alley-oop-power action, got '+k.animation.clip+':'+k.animation.tick);
      return{k:k.id,passer:passer.id,clip:k.animation.clip,tick:k.animation.tick,ball:{mode:s.ball.mode,owner:s.ball.ownerId,aerialTargetId:s.ball.aerialTargetId},score:s.score};
    }""",{'home':home,'away':away,'zoom':zoom,'atlas':ATLAS,'track':TRACK,'facing':facing,'startX':184 if facing>0 else 16,'passerStart':170 if facing>0 else 30,'seed':128128})
    page.wait_for_function('(src)=>{const i=window.__productionSpriteImagesForReview?.get(src);return Boolean(i?.complete&&i.naturalWidth)}',arg=ATLAS,timeout=120000,polling=100)
    run={'facing':facing,'direction':direction,'zoom':zoom,'captures':[]}
    for frame,tick in enumerate(TICKS):
     if tick:
      advanced=page.evaluate("""({targetTick})=>{const g=window.jamverse,k=window.__candidate.k,players=g.state.players;while(k.animation.clip==='alley-oop-power'&&k.animation.tick<targetTick)g.tick(1,players.map(p=>({playerId:p.id})));return{kTick:k.animation.tick,clip:k.animation.clip,ballMode:g.state.ball.mode,owner:g.state.ball.ownerId,aerialTarget:g.state.ball.aerialTargetId,score:g.state.score,events:g.state.events.slice(-5)}}""",{'targetTick':tick})
      if advanced['kTick']!=tick:raise RuntimeError('Could not advance to tick '+str(tick)+': '+json.dumps(advanced))
     info=page.evaluate("""({frame,tick,atlas})=>{const g=window.jamverse,s=g.state,c=window.__candidate,k=c.k,selected=c.selectProductionSprite(k,{manifest:c.manifest,images:window.__productionSpriteImagesForReview}),point={height:c.sampleBallHeight('alley-oop-power',tick,'krios'),forward:c.sampleBallForward('alley-oop-power',tick,'krios')};window.__setReviewCameraX(k.x);g.tick(0,[]);return{frame,tick,clip:k.animation.clip,action:k.animation.action?{kind:k.animation.action.kind,awaitingCatch:k.animation.action.awaitingCatch,released:k.animation.action.released}:null,selectedFrame:selected?.frame,selectedSrc:selected?.src,flip:selected?.flip,z:k.z,position:{x:k.x,y:k.y},cameraX:document.querySelector('#game').dataset.stageCameraX,hasBall:k.hasBall,ball:{mode:s.ball.mode,owner:s.ball.ownerId,aerialTargetId:s.ball.aerialTargetId,x:s.ball.x,y:s.ball.y,z:s.ball.z},trackPoint:point,carriedDelta:k.hasBall?{x:s.ball.x-(k.x+k.facing*point.forward),z:s.ball.z-(k.z+point.height)}:null,score:s.score,events:s.events.slice(-5),atlas}}""",{'frame':frame,'tick':tick,'atlas':ATLAS})
     if info['selectedFrame']!=frame or info['selectedSrc']!=ATLAS or info['flip']!=(facing<0):raise RuntimeError('Production selector mismatch '+json.dumps(info))
     name=f'{direction}-frame{frame:02d}-tick{tick:02d}-zoom{zoom}.png';info['path']=(OUT/name).relative_to(ROOT).as_posix();page.locator('#game').screenshot(path=str(OUT/name));run['captures'].append(info)
    if errors:report['uncaughtBrowserErrors'].extend(errors);raise RuntimeError('Browser errors '+json.dumps(errors))
    report['runs'].append(run);page.close()
  browser.close()
 report['captureCount']=sum(len(run['captures']) for run in report['runs'])
 (OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'captures':report['captureCount'],'runs':len(report['runs']),'errors':report['uncaughtBrowserErrors'],'output':str(OUT)}))
finally:
 server.terminate();server.wait(timeout=5)
