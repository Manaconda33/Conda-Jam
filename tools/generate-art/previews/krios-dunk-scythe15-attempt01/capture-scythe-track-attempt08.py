"""Run Krios dunk-scythe through live production simulation with candidate assets.

Candidate art/track are injected before Jam Stage start. This exercises an actual
queued power dunk, ball release, score transition, and landing without registration.
"""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
from hashlib import sha256
import json

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[4]
PORT = environ.get('PORT', '4244')
URL = f'http://127.0.0.1:{PORT}/'
ART_ATTEMPT = environ.get('ART_ATTEMPT', '01')
TRACK_ATTEMPT = environ.get('TRACK_ATTEMPT', '08')
RUNTIME = environ.get('RUNTIME_INTEGRATION', '0') == '1'
ATLAS = f'./tools/generate-art/previews/krios-dunk-scythe15-attempt{ART_ATTEMPT}/krios-dunk-scythe15-attempt{ART_ATTEMPT}-runtime-candidate.png'
if RUNTIME:
    ATLAS = './public/assets/animation/krios-dunk-scythe-right.png'
TRACKS = {
    '09': {'height':[0.84,1.0,1.33,1.16,1.82,1.13,2.0,1.75,1.25,1.2,0.76,0.59,0.39,0.39,0.64], 'forward':[0.73,-8.5,7.67,2.19,-5.0,6.94,-6.5,-10.5,10.0,11.0,9.5,-4.38,-6.57,-1.83,-5.11]},
    '08': {'height':[0.84,1.0,1.33,1.16,1.82,1.13,1.4,1.75,1.25,1.2,0.76,0.59,0.39,0.39,0.64], 'forward':[0.73,-8.5,7.67,2.19,-5.0,6.94,-6.5,-10.5,10.0,11.0,9.5,-4.38,-6.57,-1.83,-5.11]},
    '02': {'height':[1.0,.9,1.2,1.5,1.3,1.35,1.45,1.55,1.6,2.2,1.95,1.2,1.0,.8,.7], 'forward':[5,4,3,1,-1,-1,-2,-3,-3,-1,12,10,8,6,4]},
    '03': {'height':[1.0,.9,1.2,1.5,1.3,1.35,1.5,1.6,1.7,1.6,2.0,1.2,1.0,.8,.7], 'forward':[5,4,3,1,-1,0,-2,-3,-2,-1,12,10,8,6,4]},
    '04': {'height':[1.0,.9,1.2,1.5,1.3,1.35,1.5,1.6,1.7,1.9,2.0,1.2,1.0,.8,.7], 'forward':[5,4,3,1,-1,0,-2,-3,-2,-1,12,10,8,6,4]},
}
TRACK = TRACKS[TRACK_ATTEMPT]
TICKS = [0,2,4,7,9,10,12,14,17,19,21,23,26,28,30]
OUT = ROOT / (f'tools/generate-art/previews/krios-dunk-scythe15-attempt{ART_ATTEMPT}/live-gameplay-candidate/normal-loader-runtime-track{TRACK_ATTEMPT}' if RUNTIME else f'tools/generate-art/previews/krios-dunk-scythe15-attempt{ART_ATTEMPT}/live-gameplay-candidate/track-attempt{TRACK_ATTEMPT}')
OUT.mkdir(parents=True, exist_ok=True)
report = {
    'renderer':'Chromium current Jam Stage production renderer', 'athlete':'krios', 'clip':'dunk-scythe',
    'atlas':ATLAS, 'atlasSha256':sha256((ROOT/ATLAS[2:]).read_bytes()).hexdigest(),
    'trackAttempt':TRACK_ATTEMPT, 'candidateTrack':TRACK, 'runtimeIntegration':RUNTIME,
    'candidateAtlasInjected':not RUNTIME, 'candidateBallTrackInjected':not RUNTIME,
    'court':'current Jam Stage; Scoria Rams vs Blackthorn Court Kings', 'courtY':90,
    'seed':128128, 'sampleTicks':TICKS, 'expectedScore':[2,0],
    'method':'Queue an actual production dunk-scythe action through Jam Stage simulation input and advance only normal simulation ticks. Runtime mode uses the registered manifest and athlete-specific track without candidate injection.',
    'runs':[], 'uncaughtBrowserErrors':[]
}

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
                    addition=f"\nanimationAssetManifest.characters.krios.directions.right['dunk-scythe']={{src:{json.dumps(ATLAS)},columns:15,rows:1,reviewed:true,frames:Array.from({{length:15}},(_,i)=>({{x:i*128,y:0,w:128,h:96}}))}}; animationAssetManifest.characters.krios.mirrorSafe=true; animationAssetManifest.characters.krios.mirrorReview={{status:'reviewed'}};\n"
                    route.fulfill(response=response,body=response.text()+addition)
                def inject_track(route):
                    response=route.fetch();addition=f"\nathleteBallTracks.krios['dunk-scythe']={json.dumps(TRACK,separators=(',',':'))};\n"
                    route.fulfill(response=response,body=response.text()+addition)
                def expose_images(route):
                    response=route.fetch();route.fulfill(response=response,body=response.text()+'\nwindow.__productionSpriteImagesForReview=productionSpriteImages; window.__setReviewCameraX=(x)=>{camX=x};\n')
                if not RUNTIME:
                    page.route('**/src/content/animation-assets.js',inject_manifest)
                    page.route('**/src/core/animation.js',inject_track)
                page.route('**/src/main.js',expose_images)
                page.add_init_script('window.requestAnimationFrame=()=>0')
                page.goto(URL,wait_until='networkidle',timeout=120000)
                page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105',timeout=120000)
                home,away=('scoria-rams','blackthorn-court-kings') if facing>0 else ('blackthorn-court-kings','scoria-rams')
                start_x=186 if facing>0 else 14
                page.evaluate("""async ({home,away,zoom,atlas,track,facing,startX,seed})=>{
                  const {animationAssetManifest}=await import('/src/content/animation-assets.js');
                  const {sampleBallHeight,sampleBallForward,animationClips}=await import('/src/core/animation.js');
                  const {selectProductionSprite}=await import('/src/render/animation-sprites.js');
                  const g=window.jamverse;g.start(home,away,180,seed);const s=g.state,k=s.players.find(p=>p.id==='krios');
                  if(!k)throw Error('Krios missing after current-court start');
                  for(const p of s.players){p.hasBall=false;p.charge=0;p.animation={clip:'idle',tick:0};p.anim='idle';p.z=p.vz=0;p.vx=p.vy=0;p.x=p===k?startX:(p.team===k.team?100:120);p.y=p===k?50:(p===k?50:p.team===k.team?18:82);}
                  k.facing=facing;k.vx=facing*.2;k.dunk=99;k.hasBall=true;k.animation={clip:'idle-ball',tick:0};k.anim='idle-ball';
                  s.phase='playing';s.possession=k.team;s.pause=false;s.score=[0,0];s.clock=180;s.shotClock=24;s.rng=seed;
                  Object.assign(s.ball,{mode:'carried',ownerId:k.id,lastTouch:k.id,targetId:null,aerialTargetId:null,attemptId:null,scored:false,x:k.x+facing*6,y:k.y,z:1.1,vx:0,vy:0,vz:0});
                  window.__candidate={manifest:animationAssetManifest,sampleBallHeight,sampleBallForward,animationClips,selectProductionSprite,k};
                  if(!window.__productionSpriteImagesForReview.has(atlas)){const image=new Image();image.src=atlas;await image.decode();window.__productionSpriteImagesForReview.set(atlas,image);}
                  document.querySelector('#camera-zoom').value=String(zoom);document.querySelector('#camera-zoom').dispatchEvent(new Event('input',{bubbles:true}));
                  window.__setReviewCameraX(startX);g.tick(0,[]);
                  g.tick(1,[{playerId:k.id,x:facing,turbo:true,shootPressed:true,dunkVariant:'scythe'},...s.players.filter(p=>p!==k).map(p=>({playerId:p.id}))]);
                  if(k.animation.clip!=='dunk-scythe'||k.animation.tick!==0)throw Error('Expected actual production dunk action');
                }""",{'home':home,'away':away,'zoom':zoom,'atlas':ATLAS,'track':TRACK,'facing':facing,'startX':start_x,'seed':128128})
                page.wait_for_function('(src)=>{const i=window.__productionSpriteImagesForReview?.get(src);return Boolean(i?.complete&&i.naturalWidth)}',arg=ATLAS,timeout=120000,polling=100)
                run={'facing':facing,'direction':direction,'zoom':zoom,'captures':[]}
                for frame,tick in enumerate(TICKS):
                    if tick:
                        advanced=page.evaluate("""({targetTick})=>{const g=window.jamverse,k=window.__candidate.k,players=g.state.players;while(k.animation.clip==='dunk-scythe'&&k.animation.tick<targetTick)g.tick(1,players.map(p=>({playerId:p.id})));return{kTick:k.animation.tick,clip:k.animation.clip,ballMode:g.state.ball.mode,owner:g.state.ball.ownerId,score:g.state.score,events:g.state.events.slice(-3)}}""",{'targetTick':tick})
                        if advanced['kTick']!=tick: raise RuntimeError('Could not advance action to tick '+str(tick)+': '+json.dumps(advanced))
                    info=page.evaluate("""({frame,tick,atlas,track})=>{const g=window.jamverse,s=g.state,c=window.__candidate,k=c.k,selected=c.selectProductionSprite(k,{manifest:c.manifest,images:window.__productionSpriteImagesForReview});const point={height:c.sampleBallHeight('dunk-scythe',tick,'krios'),forward:c.sampleBallForward('dunk-scythe',tick,'krios')};window.__setReviewCameraX(k.x);g.tick(0,[]);return{frame,tick,clip:k.animation.clip,selectedFrame:selected?.frame,selectedSrc:selected?.src,flip:selected?.flip,z:k.z,position:{x:k.x,y:k.y},cameraX:document.querySelector('#game').dataset.stageCameraX,hasBall:k.hasBall,ball:{mode:s.ball.mode,owner:s.ball.ownerId,x:s.ball.x,y:s.ball.y,z:s.ball.z},trackPoint:point,carriedDelta:k.hasBall?{x:s.ball.x-(k.x+k.facing*point.forward),z:s.ball.z-(k.z+point.height)}:null,score:s.score,events:s.events.slice(-3),atlas}}""",{'frame':frame,'tick':tick,'atlas':ATLAS,'track':TRACK})
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
