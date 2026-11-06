"""Inject an isolated Krios dunk-clutch atlas/track trial into Jam Stage."""
from hashlib import sha256
from json import dumps, load
from os import environ
from pathlib import Path
from subprocess import DEVNULL, Popen
from time import monotonic, sleep
from urllib.request import urlopen

from playwright.sync_api import sync_playwright

BASE = Path(__file__).resolve().parent
ROOT = BASE.parents[4]
TRACK_ATTEMPT = int(environ.get('TRACK_ATTEMPT', '1'))
TRIAL_DIR = BASE / f'track-attempt{TRACK_ATTEMPT:02d}'
TRIAL = load((TRIAL_DIR / 'track.json').open())
TRACK = TRIAL['track']
ATLAS_REL = TRIAL['sourceAtlas']
ATLAS = './' + ATLAS_REL
ATLAS_SHA = sha256((ROOT / ATLAS_REL).read_bytes()).hexdigest()
PORT = environ.get('PORT', '4247')
URL = f'http://127.0.0.1:{PORT}/'
OUT = TRIAL_DIR / 'native'
OUT.mkdir(parents=True, exist_ok=True)
DURATIONS = [2, 2, 3, 2, 1, 2, 2, 3, 2, 2, 2, 3, 2, 2, 3]
TICKS = [0, 4, 10, 12, 14, 17, 19, 20, 21, 23, 26, 28, 30, 32]
REPORT = {
    'renderer': 'Chromium current Jam Stage production renderer',
    'athlete': 'krios', 'clip': 'dunk-clutch', 'attempt': TRACK_ATTEMPT,
    'atlas': ATLAS_REL, 'atlasSha256': ATLAS_SHA,
    'trackFile': 'track.json', 'candidateTrack': TRACK,
    'runtimeIntegration': False, 'candidateAtlasInjected': True,
    'candidateBallTrackInjected': True,
    'court': 'current Jam Stage; Scoria Rams vs Blackthorn Court Kings',
    'courtY': 90, 'seed': 128128,
    'sampleTicks': TICKS,
    'timeline': {'heldThroughFrame': 9, 'releaseTick': 21,
                 'scoreTick': 23, 'landTick': 30},
    'method': 'Queue a real dunk-clutch action through Jam Stage; advance normal simulation ticks; inject only the candidate atlas and Krios clip track through Playwright response routes. Shared source files are not edited.',
    'runs': [], 'uncaughtBrowserErrors': [],
}

def frame_at_tick(tick):
    cursor = 0
    for index, duration in enumerate(DURATIONS):
        if tick < cursor + duration:
            return index
        cursor += duration
    return len(DURATIONS) - 1

server = Popen(['node', 'tools/server.mjs'], cwd=ROOT,
               env={**environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)
try:
    deadline = monotonic() + 30
    while monotonic() < deadline:
        if server.poll() is not None:
            raise RuntimeError('Jam Stage server exited before ready')
        try:
            with urlopen(URL, timeout=1) as response:
                if response.status == 200:
                    break
        except Exception:
            sleep(.1)
    else:
        raise TimeoutError('Jam Stage server readiness')

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium',
                                     args=['--no-sandbox', '--disable-dev-shm-usage'])
        for zoom in (100, 120):
            for facing, direction in ((1, 'right'), (-1, 'left')):
                page = browser.new_page(viewport={'width': 900, 'height': 700}, device_scale_factor=1)
                errors = []
                page.on('pageerror', lambda error: errors.append(str(error)))

                def inject_manifest(route):
                    response = route.fetch()
                    addition = (
                        "\nanimationAssetManifest.characters.krios.directions.right['dunk-clutch']="
                        f"{{src:{dumps(ATLAS)},columns:15,rows:1,reviewed:true,"
                        "frames:Array.from({length:15},(_,i)=>({x:i*128,y:0,w:128,h:96}))};"
                        " animationAssetManifest.characters.krios.mirrorSafe=true;"
                        " animationAssetManifest.characters.krios.mirrorReview={status:'reviewed'};\n"
                    )
                    route.fulfill(response=response, body=response.text() + addition)

                def inject_track(route):
                    response = route.fetch()
                    addition = "\nathleteBallTracks.krios['dunk-clutch']=" + dumps(TRACK, separators=(',', ':')) + ';\n'
                    route.fulfill(response=response, body=response.text() + addition)

                def expose_images(route):
                    response = route.fetch()
                    route.fulfill(response=response, body=response.text() +
                                  '\nwindow.__productionSpriteImagesForReview=productionSpriteImages; window.__setReviewCameraX=(x)=>{camX=x};\n')

                page.route('**/src/content/animation-assets.js', inject_manifest)
                page.route('**/src/core/animation.js', inject_track)
                page.route('**/src/main.js', expose_images)
                page.add_init_script('window.requestAnimationFrame=()=>0')
                page.goto(URL, wait_until='networkidle', timeout=120000)
                page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=120000)

                home, away = (('scoria-rams', 'blackthorn-court-kings') if facing > 0 else
                              ('blackthorn-court-kings', 'scoria-rams'))
                start_x = 186 if facing > 0 else 14
                page.evaluate("""async ({home,away,zoom,atlas,track,facing,startX,seed})=>{
                  const {animationAssetManifest}=await import('/src/content/animation-assets.js');
                  const {sampleBallHeight,sampleBallForward,animationClips}=await import('/src/core/animation.js');
                  const {selectProductionSprite}=await import('/src/render/animation-sprites.js');
                  const g=window.jamverse;g.start(home,away,180,seed);const s=g.state,k=s.players.find(p=>p.id==='krios');
                  if(!k)throw Error('Krios missing after current-court start');
                  for(const p of s.players){p.hasBall=false;p.charge=0;p.animation={clip:'idle',tick:0};p.anim='idle';p.z=p.vz=0;p.vx=p.vy=0;p.x=p===k?startX:(p.team===k.team?100:120);p.y=p===k?50:(p.team===k.team?18:82);}
                  k.facing=facing;k.vx=facing*.2;k.dunk=99;k.hasBall=true;k.animation={clip:'idle-ball',tick:0};k.anim='idle-ball';
                  s.phase='playing';s.possession=k.team;s.pause=false;s.score=[0,0];s.clock=180;s.shotClock=24;s.rng=seed;
                  Object.assign(s.ball,{mode:'carried',ownerId:k.id,lastTouch:k.id,targetId:null,aerialTargetId:null,attemptId:null,scored:false,x:k.x+facing*track.forward[0],y:k.y,z:track.height[0],vx:0,vy:0,vz:0});
                  window.__candidate={manifest:animationAssetManifest,sampleBallHeight,sampleBallForward,animationClips,selectProductionSprite,k};
                  if(!window.__productionSpriteImagesForReview.has(atlas)){const image=new Image();image.src=atlas;await image.decode();window.__productionSpriteImagesForReview.set(atlas,image);}
                  document.querySelector('#camera-zoom').value=String(zoom);document.querySelector('#camera-zoom').dispatchEvent(new Event('input',{bubbles:true}));
                  window.__setReviewCameraX(startX);g.tick(0,[]);
                  g.tick(1,[{playerId:k.id,x:facing,turbo:true,shootPressed:true,dunkVariant:'clutch'},...s.players.filter(p=>p!==k).map(p=>({playerId:p.id}))]);
                  if(k.animation.clip!=='dunk-clutch'||k.animation.tick!==0)throw Error('Expected actual production dunk-clutch action');
                }""", {'home': home, 'away': away, 'zoom': zoom, 'atlas': ATLAS,
                      'track': TRACK, 'facing': facing, 'startX': start_x, 'seed': 128128})
                page.wait_for_function('(src)=>{const i=window.__productionSpriteImagesForReview?.get(src);return Boolean(i?.complete&&i.naturalWidth)}',
                                       arg=ATLAS, timeout=120000, polling=100)
                run = {'facing': facing, 'direction': direction, 'zoom': zoom, 'captures': []}
                for tick in TICKS:
                    expected_frame = frame_at_tick(tick)
                    if tick:
                        advanced = page.evaluate("""({targetTick})=>{const g=window.jamverse,k=window.__candidate.k,players=g.state.players;while(k.animation.clip==='dunk-clutch'&&k.animation.tick<targetTick)g.tick(1,players.map(p=>({playerId:p.id})));return{kTick:k.animation.tick,clip:k.animation.clip,ballMode:g.state.ball.mode,owner:g.state.ball.ownerId,score:g.state.score,events:g.state.events.slice(-3)}}""", {'targetTick': tick})
                        if advanced['kTick'] != tick:
                            raise RuntimeError('Could not advance action to tick '+str(tick)+': '+dumps(advanced))
                    info = page.evaluate("""({tick,expectedFrame,atlas})=>{const g=window.jamverse,s=g.state,c=window.__candidate,k=c.k;const selected=c.selectProductionSprite(k,{manifest:c.manifest,images:window.__productionSpriteImagesForReview});const frame={height:c.sampleBallHeight('dunk-clutch',tick,'krios'),forward:c.sampleBallForward('dunk-clutch',tick,'krios')};window.__setReviewCameraX(k.x);g.tick(0,[]);return{tick,expectedFrame,clip:k.animation.clip,animationTick:k.animation.tick,selectedFrame:selected?.frame,selectedSrc:selected?.src,flip:selected?.flip,player:{x:k.x,y:k.y,z:k.z,facing:k.facing,hasBall:k.hasBall},ball:{mode:s.ball.mode,owner:s.ball.ownerId,x:s.ball.x,y:s.ball.y,z:s.ball.z,scored:s.ball.scored},trackPoint:frame,score:s.score,events:s.events.slice(-3),cameraX:document.querySelector('#game').dataset.stageCameraX,atlas}}""", {'tick': tick, 'expectedFrame': expected_frame, 'atlas': ATLAS})
                    if info['selectedFrame'] != expected_frame or info['selectedSrc'] != ATLAS or info['flip'] != (facing < 0):
                        raise RuntimeError('Production selector mismatch '+dumps(info))
                    name = f'{direction}-tick{tick:02d}-frame{expected_frame:02d}-zoom{zoom}.png'
                    info['path'] = (OUT / name).relative_to(ROOT).as_posix()
                    page.locator('#game').screenshot(path=str(OUT / name))
                    run['captures'].append(info)
                if errors:
                    REPORT['uncaughtBrowserErrors'].extend(errors)
                    raise RuntimeError('Browser errors '+dumps(errors))
                REPORT['runs'].append(run)
                page.close()
        browser.close()

    REPORT['captureCount'] = sum(len(run['captures']) for run in REPORT['runs'])
    REPORT['assertions'] = {
        'heldThroughTick20': all(next(c for c in r['captures'] if c['tick'] == 20)['ball']['mode'] == 'carried' and next(c for c in r['captures'] if c['tick'] == 20)['ball']['owner'] == 'krios' for r in REPORT['runs']),
        'releaseTick21': all(next(c for c in r['captures'] if c['tick'] == 21)['ball']['mode'] == 'dunk' for r in REPORT['runs']),
        'scoreTick23': all(next(c for c in r['captures'] if c['tick'] == 23)['score'] == ([2,0] if r['facing'] > 0 else [0,2]) for r in REPORT['runs']),
        'landTick30': all(next(c for c in r['captures'] if c['tick'] == 30)['player']['z'] == 0 for r in REPORT['runs']),
        'bothFacingsAndZooms': len(REPORT['runs']) == 4,
    }
    (OUT / 'report.json').write_text(dumps(REPORT, indent=2) + '\n')
    print(dumps({'captures': REPORT['captureCount'], 'runs': len(REPORT['runs']),
                 'assertions': REPORT['assertions'], 'errors': REPORT['uncaughtBrowserErrors'],
                 'output': str(OUT)}))
finally:
    server.terminate()
    server.wait(timeout=5)
