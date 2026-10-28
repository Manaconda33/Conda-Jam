"""Capture Krios J.128 rebound through live missed-shot and loose-ball physics."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
from hashlib import sha256
import json

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = environ.get('RUNTIME_INTEGRATION', '0') == '1'
ATLAS = './public/assets/animation/krios-rebound-right.webp' if RUNTIME else './tools/generate-art/previews/krios-rebound-attempt03/krios-rebound-attempt03-runtime-candidate.png'
TRACK = {'height': [1.1, 1.7, 2.0, 2.1, 1.3], 'forward': [4, 3, 1, 0.5, 1]}
FRAME_TICKS = [0, 2, 4, 5, 7]
SEED = 1013904226
PORT = environ.get('PORT', '4237')
TRACK_ATTEMPT = environ.get('TRACK_ATTEMPT', '03')
URL = f'http://127.0.0.1:{PORT}/'
OUT = ROOT / 'tools/generate-art/previews/j128-krios-rebound-candidate/attempt-03' / f'track-{TRACK_ATTEMPT}' / ('registered-runtime' if RUNTIME else 'native')
OUT.mkdir(parents=True, exist_ok=True)
atlas_sha = sha256((ROOT / ATLAS[2:]).read_bytes()).hexdigest()
report = {
    'renderer': 'Chromium production Jam Stage canvas', 'athlete': 'krios', 'clip': 'rebound',
    'atlas': ATLAS, 'atlasSha256': atlas_sha, 'candidateTrack': TRACK,
    'runtimeIntegration': RUNTIME, 'candidateAtlasInjected': not RUNTIME,
    'court': 'current Jam Stage; Scoria Rams vs Blackthorn Court Kings', 'courtY': 90,
    'frameDurations': [2, 2, 1, 2, 4], 'grabAnchorFrame': 3, 'grabAnchorTick': 5,
    'sampledFrameTicks': FRAME_TICKS, 'seed': SEED,
    'captureMethod': ('Normal production loader and registered Krios rebound track; no art or track injection. ' if RUNTIME else 'Candidate artwork and candidate Krios-specific ball track are loaded only into page memory. ') +
        'A deterministic missed three-pointer from Leo triggers the production shot, live miss, loose-ball flight, scheduled Krios rebound, tick5 catch and carried chest recovery. The court actors and ball are positioned once before the shot; all later motion uses normal simulation ticks. No per-tick teleporting.',
    'runs': [], 'uncaughtBrowserErrors': [],
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
                if not RUNTIME:
                    def inject_manifest(route):
                        response = route.fetch()
                        frames = "Array.from({length:5},(_,i)=>({x:i*128,y:0,w:128,h:96}))"
                        addition = f"\nanimationAssetManifest.characters.krios.directions.right.rebound={{src:{json.dumps(ATLAS)},columns:5,rows:1,reviewed:true,mirrorSafe:true,frames:{frames}}};\n"
                        route.fulfill(response=response, body=response.text() + addition)
                    def inject_track(route):
                        response = route.fetch()
                        addition = f"\nathleteBallTracks.krios.rebound={json.dumps(TRACK,separators=(',',':'))};\n"
                        route.fulfill(response=response, body=response.text() + addition)
                    page.route('**/src/content/animation-assets.js', inject_manifest)
                    page.route('**/src/core/animation.js', inject_track)
                def expose_images(route):
                    response = route.fetch()
                    route.fulfill(response=response, body=response.text() + '\nwindow.__productionSpriteImagesForReview=productionSpriteImages;\n')
                page.route('**/src/main.js', expose_images)
                page.add_init_script('window.requestAnimationFrame=()=>0')
                page.goto(URL, wait_until='networkidle', timeout=120000)
                page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=120000)
                home, away = ('scoria-rams', 'blackthorn-court-kings') if facing > 0 else ('blackthorn-court-kings', 'scoria-rams')
                page.evaluate("""async ({home,away,atlas,zoom,runtime})=>{
                  const {animationAssetManifest}=await import('/src/content/animation-assets.js');
                  const {sampleBallHeight,sampleBallForward,animationClips}=await import('/src/core/animation.js');
                  const {selectProductionSprite}=await import('/src/render/animation-sprites.js');
                  const entry=animationAssetManifest.characters.krios.directions.right.rebound;
                  if(!entry||entry.src!==atlas||entry.frames?.length!==5)throw Error('Krios rebound candidate manifest missing');
                  window.__rebound={manifest:animationAssetManifest,clips:animationClips,sampleBallHeight,sampleBallForward,selectProductionSprite};
                  window.jamverse.start(home,away,180,1013904226);
                  const s=window.jamverse.state,k=s.players.find(p=>p.id==='krios'),l=s.players.find(p=>p.id==='leo'),d=s.players.find(p=>p.id==='flint-rooker');
                  s.players=[k,l,d];const sign=k.facing=home==='scoria-rams'?1:-1;const kx=sign>0?14:186,lx=sign>0?68:132,dx=sign>0?64:136;
                  Object.assign(k,{x:kx,y:50,z:0,vx:0,vy:0,vz:0,facing:sign,hasBall:false,stun:0,animation:{clip:'idle',tick:0},anim:'idle'});
                  Object.assign(l,{x:lx,y:50,z:0,vx:0,vy:0,vz:0,facing:-sign,hasBall:true,stun:0,animation:{clip:'idle-ball',tick:0},anim:'idle-ball'});
                  Object.assign(d,{x:dx,y:50,z:0,vx:0,vy:0,vz:0,facing:sign,hasBall:false,stun:0,animation:{clip:'idle',tick:0},anim:'idle'});
                  s.phase='playing';s.pause=false;s.score=[0,0];s.scorePause=0;s.possession=l.team;s.clock=180;s.shotClock=24;s.rng=1013904226;
                  Object.assign(s.ball,{mode:'carried',ownerId:l.id,targetId:null,aerialTargetId:null,lastTouch:l.id,attemptId:null,scored:false,made:false,x:lx+l.facing*6,y:50,z:1.1,vx:0,vy:0,vz:0});
                  const input=()=>[k,l,d].map(p=>({playerId:p.id}));window.jamverse.tick(1,[...input().filter(i=>i.playerId!==l.id),{playerId:l.id,shootPressed:true}]);
                  if(!runtime){const image=new Image();image.src=atlas;await image.decode();window.__productionSpriteImagesForReview.set(atlas,image);}
                  document.querySelector('#camera-zoom').value=String(zoom);document.querySelector('#camera-zoom').dispatchEvent(new Event('input',{bubbles:true}));
                  window.__reboundInput={facing:sign,home,away,kriosX:kx,shooterX:lx,defenderX:dx,seed:1013904226};
                }""", {'home': home, 'away': away, 'atlas': ATLAS, 'zoom': zoom, 'runtime': RUNTIME})
                # RAF is disabled to keep samples deterministic; interval polling still wakes.
                page.wait_for_function('(src)=>{const image=window.__productionSpriteImagesForReview?.get(src);return Boolean(image?.complete&&image.naturalWidth)}', arg=ATLAS, timeout=120000, polling=100)
                trajectory = page.evaluate("""()=>{const g=window.jamverse,s=g.state;let launched=false,reboundStarted=false;
                  for(let i=0;i<180;i++){const k=s.players.find(p=>p.id==='krios'),l=s.players.find(p=>p.id==='leo'),d=s.players.find(p=>p.id==='flint-rooker');
                    g.tick(1,[{playerId:k.id},{playerId:l.id},{playerId:d.id}]);
                    launched ||= s.events.some(e=>e.text.includes('Leo launches'));
                    if(k.animation.clip==='rebound'&&k.animation.tick===0){reboundStarted=true;return {launched,reboundStarted,globalStep:i+1,ballMode:s.ball.mode,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z},owner:s.ball.ownerId,player:k.id,events:s.events.slice(-3)};}
                  }return {launched,reboundStarted:false,ballMode:s.ball.mode,events:s.events.slice(-3)};
                }""")
                if not trajectory.get('reboundStarted'):
                    raise RuntimeError('Live missed shot did not schedule Krios rebound: ' + json.dumps(trajectory))
                run = {'facing': facing, 'direction': direction, 'zoom': zoom, 'trajectory': trajectory, 'captures': []}
                for index, target_tick in enumerate(FRAME_TICKS):
                    if index:
                        advanced = page.evaluate("""({targetTick})=>{const g=window.jamverse,s=g.state,k=s.players.find(p=>p.id==='krios'),l=s.players.find(p=>p.id==='leo'),d=s.players.find(p=>p.id==='flint-rooker');
                          while(k.animation.clip==='rebound'&&k.animation.tick<targetTick)g.tick(1,[{playerId:k.id},{playerId:l.id},{playerId:d.id}]);
                          return {clip:k.animation.clip,tick:k.animation.tick,owner:s.ball.ownerId,mode:s.ball.mode};
                        }""", {'targetTick': target_tick})
                        if advanced['clip'] != 'rebound' or advanced['tick'] != target_tick:
                            raise RuntimeError('Could not advance live rebound to frame start: ' + json.dumps(advanced))
                    info = page.evaluate("""({atlas,targetTick})=>{const g=window.jamverse,s=g.state,k=s.players.find(p=>p.id==='krios'),a=window.__rebound,selected=a.selectProductionSprite(k,{manifest:a.manifest,images:window.__productionSpriteImagesForReview});
                      const point={height:a.sampleBallHeight('rebound',targetTick,'krios'),forward:a.sampleBallForward('rebound',targetTick,'krios')};
                      return {tick:k.animation.tick,clip:k.animation.clip,selectedFrame:selected?.frame,selectedSrc:selected?.src,flip:selected?.flip,expectedFrame:targetTick<2?0:targetTick<4?1:targetTick<5?2:targetTick<7?3:4,
                        hasBall:k.hasBall,ball:{mode:s.ball.mode,owner:s.ball.ownerId,x:s.ball.x,y:s.ball.y,z:s.ball.z},trackPoint:point,
                        ballHandDelta:k.hasBall?{x:s.ball.x-(k.x+k.facing*point.forward),z:s.ball.z-(k.z+point.height)}:null,
                        rebounds:k.rebounds,events:s.events.slice(-3),atlas};}""", {'atlas': ATLAS, 'targetTick': target_tick})
                    expected_owned = target_tick >= 5
                    if info['clip'] != 'rebound' or info['tick'] != target_tick or info['selectedFrame'] != index or info['selectedSrc'] != ATLAS or info['flip'] != (facing < 0):
                        raise RuntimeError('Rebound sprite selection mismatch: ' + json.dumps(info))
                    if info['hasBall'] != expected_owned or info['ball']['owner'] != ('krios' if expected_owned else None) or info['ball']['mode'] != ('carried' if expected_owned else 'loose'):
                        raise RuntimeError('Rebound ball ownership transition mismatch: ' + json.dumps(info))
                    if expected_owned and (abs(info['ballHandDelta']['x']) > .01 or abs(info['ballHandDelta']['z']) > .01):
                        raise RuntimeError('Carried rebound ball differs from Krios-specific hand track: ' + json.dumps(info))
                    name = f'{direction}-frame{index}-tick{target_tick}-zoom{zoom}.png'
                    info['path'] = (OUT / name).relative_to(ROOT).as_posix()
                    page.locator('#game').screenshot(path=str(OUT / name))
                    run['captures'].append(info)
                if errors:
                    report['uncaughtBrowserErrors'].extend(errors)
                    raise RuntimeError('browser page errors: ' + json.dumps(errors))
                report['runs'].append(run)
                page.close()
        browser.close()
    report['captureCount'] = sum(len(run['captures']) for run in report['runs'])
    report['uncaughtBrowserErrors'] = list(dict.fromkeys(report['uncaughtBrowserErrors']))
    (OUT / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({'captures': report['captureCount'], 'runs': len(report['runs']), 'errors': report['uncaughtBrowserErrors'], 'output': str(OUT)}))
finally:
    server.terminate()
    server.wait(timeout=5)
