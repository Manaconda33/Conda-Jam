"""Render a Krios dunk-power art/ball-track trial in the production Jam Stage.

This trial injects candidate art and the candidate Krios-only track in page memory;
it never changes a production manifest or registers the clip.
"""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
from hashlib import sha256
import json

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PORT = environ.get('PORT', '4243')
URL = f'http://127.0.0.1:{PORT}/'
ART_ATTEMPT = environ.get('ART_ATTEMPT', '01')
TRACK_ATTEMPT = environ.get('TRACK_ATTEMPT', '01')
ATLAS = f'./tools/generate-art/previews/krios-dunk-power15-attempt{ART_ATTEMPT}/krios-dunk-power15-attempt{ART_ATTEMPT}-runtime-candidate.png'
OUT = ROOT / f'tools/generate-art/previews/krios-dunk-power15-attempt{ART_ATTEMPT}/jam-stage-candidate/track-attempt{TRACK_ATTEMPT}'
OUT.mkdir(parents=True, exist_ok=True)

# Candidate hand-center estimates from the cleaned 128x96 cells. Values are
# only a starting fit; reviewers must approve actual Jam Stage contacts.
TRACKS = {
  '01': {
    'height': [.99, 1.16, 1.47, 2.0, 2.16, 2.19, 1.90, 1.93, 1.93, 1.99, 1.53, .81, 1.0, .83, .62],
    'forward': [5.85, 5.1, 8.77, -1.1, 8.8, 3.3, 9.9, 5.85, 13.1, 14.6, 12.4, 3.3, 8.4, 8.8, -1.46],
  },
  '02': {
    'height': [1.0, 1.0, 1.15, 1.3, 1.25, 1.3, 1.25, 1.3, 1.35, 1.4, 1.35, .85, .95, .8, .62],
    'forward': [5.5, 5.0, 7.5, 0.0, 6.0, 2.0, 2.0, 1.0, 8.0, 12.0, 12.0, 3.0, 8.0, 8.0, -1.0],
  },
  '03': {
    'height': [1.0, 1.0, 1.15, 1.45, 1.95, 2.0, 2.05, 2.15, 1.95, 1.95, 1.95, .85, .95, .8, .62],
    'forward': [5.5, 5.0, 7.5, 0.0, 3.0, 2.0, 1.0, 1.0, 8.0, 12.0, 12.0, 3.0, 8.0, 8.0, -1.0],
  },
  '04': {
    'height': [1.0, 1.0, 1.15, 1.45, 1.75, 1.7, 1.6, 1.65, 1.7, 1.8, 1.95, .85, .95, .8, .62],
    'forward': [5.5, 5.0, 7.5, 0.0, 3.0, 2.0, 1.0, 1.0, 8.0, 12.0, 12.0, 3.0, 8.0, 8.0, -1.0],
  },
}
TRACK = TRACKS[TRACK_ATTEMPT]
DURATIONS = [2, 2, 3, 2, 1, 2, 2, 3, 2, 2, 2, 3, 2, 2, 3]
FRAME_TICKS = [0, 2, 4, 7, 9, 10, 12, 14, 17, 19, 21, 23, 26, 28, 30]
Z_BY_TICK = {0: 0, 2: 0, 4: .65, 7: 1.65, 9: 2.1, 10: 2.25, 12: 2.75, 14: 3.0, 17: 3.0, 19: 2.5, 21: 2.2, 23: 1.7, 26: .8, 28: .3, 30: 0}
RELEASE = {'21': (13.1, 2.35), '23': (14.0, 1.2), '26': (16.0, .45)}

report = {
    'renderer': 'Chromium current Jam Stage production renderer', 'athlete': 'krios',
    'clip': 'dunk-power', 'atlas': ATLAS,
    'atlasSha256': sha256((ROOT / ATLAS[2:]).read_bytes()).hexdigest(),
    'candidateTrack': TRACK, 'trackAttempt': TRACK_ATTEMPT, 'artAttempt': ART_ATTEMPT, 'runtimeIntegration': False,
    'candidateAtlasInjected': True, 'candidateTrackInjected': True,
    'court': 'current Jam Stage; Scoria Rams vs Blackthorn Court Kings', 'courtY': 90,
    'frameDurations': DURATIONS, 'sampledFrameTicks': FRAME_TICKS,
    'actionAnchors': {'takeoff': {'frame': 2, 'tick': 4}, 'grab': {'frame': 5, 'tick': 10},
                      'peak': {'frame': 7, 'tick': 14}, 'release': {'frame': 10, 'tick': 21},
                      'finish': {'frame': 11, 'tick': 23}, 'land': {'frame': 14, 'tick': 30}},
    'captureMethod': 'Candidate atlas and Krios-specific track loaded before game start. Athlete and z values are staged at canonical dunk ticks to review hands/ball against live production projection; this is visual calibration only, not gameplay acceptance.',
    'runs': [], 'uncaughtBrowserErrors': []
}

server = Popen(['node', 'tools/server.mjs'], cwd=ROOT, env={**environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)
try:
    deadline = monotonic() + 30
    while monotonic() < deadline:
        if server.poll() is not None:
            raise RuntimeError('Jam Stage server exited before readiness')
        try:
            with urlopen(URL, timeout=1) as response:
                if response.status == 200:
                    break
        except Exception:
            sleep(.1)
    else:
        raise TimeoutError('Jam Stage server did not become ready')

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-dev-shm-usage'])
        for zoom in (100, 120):
            for facing, direction in ((1, 'right'), (-1, 'left')):
                page = browser.new_page(viewport={'width': 900, 'height': 700}, device_scale_factor=1)
                errors = []
                page.on('pageerror', lambda error: errors.append(str(error)))

                def inject_manifest(route):
                    response = route.fetch()
                    addition = f"\nanimationAssetManifest.characters.krios.directions.right['dunk-power']={{src:{json.dumps(ATLAS)},columns:15,rows:1,reviewed:true,frames:Array.from({{length:15}},(_,i)=>({{x:i*128,y:0,w:128,h:96}}))}}; animationAssetManifest.characters.krios.mirrorSafe=true; animationAssetManifest.characters.krios.mirrorReview={{status:'reviewed'}};\n"
                    route.fulfill(response=response, body=response.text() + addition)

                def inject_track(route):
                    response = route.fetch()
                    addition = f"\nathleteBallTracks.krios['dunk-power']={json.dumps(TRACK,separators=(',',':'))};\n"
                    route.fulfill(response=response, body=response.text() + addition)

                def expose_images(route):
                    response = route.fetch()
                    route.fulfill(response=response, body=response.text() + '\nwindow.__productionSpriteImagesForReview=productionSpriteImages;\n')

                page.route('**/src/content/animation-assets.js', inject_manifest)
                page.route('**/src/core/animation.js', inject_track)
                page.route('**/src/main.js', expose_images)
                page.add_init_script('window.requestAnimationFrame=()=>0')
                page.goto(URL, wait_until='networkidle', timeout=120000)
                page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=120000)
                home, away = ('scoria-rams', 'blackthorn-court-kings') if facing > 0 else ('blackthorn-court-kings', 'scoria-rams')
                page.evaluate("""async ({home,away,zoom,atlas,track})=>{
                  const {animationAssetManifest}=await import('/src/content/animation-assets.js');
                  const {animationClips,sampleBallHeight,sampleBallForward}=await import('/src/core/animation.js');
                  const {selectProductionSprite}=await import('/src/render/animation-sprites.js');
                  const entry=animationAssetManifest.characters.krios.directions.right['dunk-power'];
                  if(!entry||entry.frames.length!==15)throw Error('Krios candidate asset missing');
                  window.__review={manifest:animationAssetManifest,clips:animationClips,sampleBallHeight,sampleBallForward,selectProductionSprite};
                  window.jamverse.start(home,away,180,2654435761);
                  const s=window.jamverse.state,k=s.players.find(p=>p.id==='krios');s.players=[k];
                  k.x=100;k.y=90;k.z=0;k.facing=home==='scoria-rams'?1:-1;k.hasBall=true;k.animation={clip:'dunk-power',tick:0};k.anim='dunk-power';
                  Object.assign(s.ball,{x:k.x+k.facing*track.forward[0],y:k.y,z:track.height[0],mode:'carried',ownerId:k.id,targetId:null,aerialTargetId:null,lastTouch:k.id,attemptId:null,scored:false,vx:0,vy:0,vz:0});
                  s.pause=true;for(let i=0;i<120;i++)window.jamverse.tick(1/60);s.pause=false;
                  const image=new Image();image.src=atlas;await image.decode();window.__productionSpriteImagesForReview.set(atlas,image);
                  document.querySelector('#camera-zoom').value=String(zoom);document.querySelector('#camera-zoom').dispatchEvent(new Event('input',{bubbles:true}));
                  window.__krios=k;
                }""", {'home': home, 'away': away, 'zoom': zoom, 'atlas': ATLAS, 'track': TRACK})
                page.wait_for_function('(src)=>{const i=window.__productionSpriteImagesForReview?.get(src);return Boolean(i?.complete&&i.naturalWidth)}', arg=ATLAS, timeout=120000, polling=100)
                run = {'facing': facing, 'direction': direction, 'zoom': zoom, 'captures': []}
                for frame, tick in enumerate(FRAME_TICKS):
                    info = page.evaluate("""({frame,tick,z,track,release,facing,atlas})=>{
                      const g=window.jamverse,s=g.state,k=window.__krios,a=window.__review;
                      k.x=100;k.y=90;k.z=z;k.facing=facing;k.hasBall=tick<21;
                      k.animation={clip:'dunk-power',tick};k.anim='dunk-power';
                      if(tick<21){s.ball.x=k.x+k.facing*track.forward[frame];s.ball.y=k.y;s.ball.z=k.z+track.height[frame];s.ball.mode='carried';s.ball.ownerId=k.id;}
                      else {const [forward,height]=release[String(tick)]??[track.forward[frame],k.z+track.height[frame]];s.ball.x=k.x+k.facing*forward;s.ball.y=k.y;s.ball.z=height;s.ball.mode='dunk';s.ball.ownerId=null;}
                      s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.vx=0;s.ball.vy=0;s.ball.vz=0;g.tick(0);
                      const selected=a.selectProductionSprite(k,{manifest:a.manifest,images:window.__productionSpriteImagesForReview});
                      return {tick,frame,clip:k.animation.clip,selectedFrame:selected?.frame,selectedSrc:selected?.src,flip:selected?.flip,ballMode:s.ball.mode,owner:s.ball.ownerId,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z},trackPoint:{height:track.height[frame],forward:track.forward[frame]},atlas};
                    }""", {'frame': frame, 'tick': tick, 'z': Z_BY_TICK[tick], 'track': TRACK, 'release': RELEASE, 'facing': facing, 'atlas': ATLAS})
                    if info['selectedFrame'] != frame or info['selectedSrc'] != ATLAS or info['flip'] != (facing < 0):
                        raise RuntimeError('Production selector mismatch: ' + json.dumps(info))
                    name = f'{direction}-frame{frame:02d}-tick{tick:02d}-zoom{zoom}.png'
                    info['path'] = (OUT / name).relative_to(ROOT).as_posix()
                    page.locator('#game').screenshot(path=str(OUT / name))
                    run['captures'].append(info)
                if errors:
                    report['uncaughtBrowserErrors'].extend(errors)
                    raise RuntimeError('browser errors: ' + json.dumps(errors))
                report['runs'].append(run)
                page.close()
        browser.close()

    report['captureCount'] = sum(len(run['captures']) for run in report['runs'])
    (OUT / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({'captures': report['captureCount'], 'runs': len(report['runs']), 'errors': report['uncaughtBrowserErrors'], 'output': str(OUT)}))
finally:
    server.terminate()
    server.wait(timeout=5)
