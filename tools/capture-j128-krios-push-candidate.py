"""Capture Krios J.128 push candidate on current Jam Stage (courtY=90).

This is a review harness only: candidate mode injects one atlas into the normal
production sprite selector; registered mode uses the application's normal
loader. It never injects a ball track or paints a ball into the athlete art.
"""
from pathlib import Path
from hashlib import sha256
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = environ.get('RUNTIME_INTEGRATION', '0') == '1'
ATLAS = environ.get('ATLAS', './public/assets/animation/krios-push-right.webp' if RUNTIME else './tools/generate-art/previews/krios-push-attempt02/krios-push-attempt02-runtime-candidate.png')
ATTEMPT = environ.get('ATTEMPT', '02')
PORT = environ.get('PORT', '4236')
URL = f'http://127.0.0.1:{PORT}/'
COURT_Y = 90
# Cumulative starts from [2,2,2,1,1,2,2,3,3,3,3]. The input step itself
# advances to tick1/frame0, so frame0's canonical tick0 is represented by the
# first observable post-input sample at tick1. Later frame starts are sampled
# at their canonical ticks.
CANONICAL_FRAME_START_TICKS = [0, 2, 4, 6, 7, 8, 10, 12, 15, 18, 21]
FRAME_START_TICKS = [1, *CANONICAL_FRAME_START_TICKS[1:]]
CONTACT_TICK = 8
CONTACT_FRAME = 5
DURATIONS = [2, 2, 2, 1, 1, 2, 2, 3, 3, 3, 3]
OUT = ROOT / f'tools/generate-art/previews/j128-krios-push-candidate/attempt-{ATTEMPT}/' / ('registered-runtime' if RUNTIME else 'native')
OUT.mkdir(parents=True, exist_ok=True)

report = {
    'renderer': 'Chromium production Jam Stage canvas', 'athlete': 'krios', 'clip': 'push',
    'atlas': ATLAS, 'candidateAtlasSha256': sha256((ROOT / ATLAS[2:]).read_bytes()).hexdigest(), 'runtimeIntegration': RUNTIME, 'candidateAtlasInjected': not RUNTIME,
    'court': 'current Jam Stage court geometry; Scoria Rams vs Blackthorn Court Kings',
    'courtY': COURT_Y, 'frameDurations': DURATIONS,
    'canonicalFrameStartTicks': CANONICAL_FRAME_START_TICKS,
    'sampledFrameStartTicks': FRAME_START_TICKS,
    'simulationContactTick': CONTACT_TICK, 'simulationContactFrame': CONTACT_FRAME,
    'authoredContactFrame': CONTACT_FRAME, 'authoredContactCanonicalTick': CONTACT_TICK,
    'timingDisagreement': False,
    'captureMethod': ('Registered mode uses normal production atlas loading with no art/track injection. ' if RUNTIME else 'Candidate mode adds the atlas to the in-memory Krios push manifest and decodes it into productionSpriteImages before input. ') +
        'Both modes use actual Jam Stage shove input and simulation ticks. No ball art or ball track is injected; the ball remains dead/unowned for this non-carrier push trial. Showcase seeds are selected for a failed push roll so every pose remains readable; separate successful-contact runs record the real tick-8/frame-5 knockdown and resulting ball state.',
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
                request_failures = []
                page.on('requestfailed', lambda request: request_failures.append({'url': request.url, 'failure': request.failure}))

                if not RUNTIME:
                    def inject_manifest(route):
                        response = route.fetch()
                        body = response.text()
                        marker = 'export const animationAssetManifest = '
                        if marker not in body:
                            raise RuntimeError('animation manifest export marker missing')
                        frames = "Array.from({length:11},(_,i)=>({x:i*128,y:0,w:128,h:96}))"
                        addition = f"\nanimationAssetManifest.characters.krios.directions.right.push={{src:{json.dumps(ATLAS)},columns:11,rows:1,reviewed:true,mirrorSafe:true,frames:{frames}}};\n"
                        route.fulfill(response=response, body=body + addition)
                    page.route('**/src/content/animation-assets.js', inject_manifest)

                def expose_images(route):
                    response = route.fetch()
                    route.fulfill(response=response, body=response.text() + '\nwindow.__productionSpriteImagesForReview=productionSpriteImages;\n')
                page.route('**/src/main.js', expose_images)
                page.add_init_script('window.requestAnimationFrame=()=>0')
                page.goto(URL, wait_until='networkidle', timeout=120000)
                page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=120000)
                home = 'scoria-rams' if facing > 0 else 'blackthorn-court-kings'
                away = 'blackthorn-court-kings' if facing > 0 else 'scoria-rams'
                page.evaluate("""async ({home,away,atlas,zoom,runtime})=>{
                    const {animationAssetManifest}=await import('/src/content/animation-assets.js');
                    const entry=animationAssetManifest.characters.krios.directions.right.push;
                    if(!entry||entry.src!==atlas||entry.frames?.length!==11||!entry.reviewed)throw Error('Krios push candidate manifest missing/review-pending');
                    window.__pushManifest=animationAssetManifest;
                    window.__pushSelector=(await import('/src/render/animation-sprites.js')).selectProductionSprite;
                    window.jamverse.start(home,away,180,53);
                    document.querySelector('#camera-zoom').value=String(zoom);
                    document.querySelector('#camera-zoom').dispatchEvent(new Event('input',{bubbles:true}));
                    if(!runtime){const image=new Image();image.src=atlas;await image.decode();window.__pushCandidateImage=image;window.__productionSpriteImagesForReview.set(atlas,image);}
                }""", {'home': home, 'away': away, 'atlas': ATLAS, 'zoom': zoom, 'runtime': RUNTIME})
                try:
                    # RAF is deliberately disabled by the capture harness so game time
                    # advances only through explicit simulation ticks. Use interval
                    # polling here; Playwright's default RAF polling would never wake.
                    page.wait_for_function('(src)=>{const image=window.__productionSpriteImagesForReview?.get(src);return Boolean(image?.complete&&image.naturalWidth)}', arg=ATLAS, timeout=120000, polling=100)
                except Exception as error:
                    state = page.evaluate('(src)=>({roster:window.jamverse?.state?.players?.map(p=>p.id),manifestSrc:window.__pushManifest?.characters?.krios?.directions?.right?.push?.src,productionMapKeys:[...(window.__productionSpriteImagesForReview??new Map()).keys()],kriosImages:[...(window.__productionSpriteImagesForReview??new Map())].filter(([key])=>key.includes("krios")).map(([key,image])=>({key,complete:image.complete,width:image.naturalWidth,src:image.src})),expected:src})', ATLAS)
                    state['requestFailures'] = request_failures
                    state['pageErrors'] = errors
                    raise RuntimeError('normal production atlas did not load: '+json.dumps(state)) from error

                # Actual shove path chooses the closest opposing non-carrier when
                # possession belongs to that opponent team. We leave the ball
                # dead/unowned and never supply any player-specific ball data.
                setup = page.evaluate("""async ({facing,seed,success})=>{
                    const g=window.jamverse,home='scoria-rams',away='blackthorn-court-kings';
                    g.start(home,away,180,seed);const s=g.state;
                    const p=s.players.find(x=>x.id==='krios');
                    const t=s.players.find(x=>x.team!==p.team&&!x.captain);
                    if(!p||!t)throw Error('Krios/opposing supporting target missing');
                    s.players=[p,t];s.possession=t.team;s.phase='playing';s.pause=false;s.score=[0,0];s.scorePause=0;
                    p.x=100;p.y=93;p.vx=p.vy=p.vz=p.z=0;p.facing=facing;p.hasBall=false;p.stun=0;p.animation={clip:'idle',tick:0};p.anim='idle';
                    t.x=100+facing*4.7;t.y=90;t.vx=t.vy=t.vz=t.z=0;t.facing=-facing;t.hasBall=false;t.stun=0;t.animation={clip:'idle',tick:0};t.anim='idle';
                    Object.assign(s.ball,{mode:'dead',ownerId:null,targetId:null,aerialTargetId:null,attemptId:null,scored:false,vx:0,vy:0,vz:0,x:100,y:90,z:0});
                    s.rng=seed>>>0;
                    g.tick(1,[{playerId:p.id,shovePressed:true},{playerId:t.id,x:0,y:0}]);
                    return {player:p.id,target:t.id,facing,seed,postInputTick:p.animation.tick,clip:p.animation.clip,targetX:t.x,targetY:t.y,targetDistance:Math.hypot(t.x-p.x,t.y-p.y),successRequested:success};
                }""", {'facing': facing, 'seed': 1, 'success': False})

                # For the full pose sequence use a seed whose actual tick-8 roll
                # misses, leaving the target standing and unobscured.
                miss_seed = page.evaluate("""({facing})=>{const g=window.jamverse;for(let i=1;i<=200;i++){const seed=(i*2654435761)>>>0;
                    g.start('scoria-rams','blackthorn-court-kings',180,seed);const s=g.state,p=s.players.find(x=>x.id==='krios'),t=s.players.find(x=>x.team!==p.team&&!x.captain);
                    s.players=[p,t];s.possession=t.team;s.phase='playing';s.pause=false;p.x=100;p.y=93;p.facing=facing;p.hasBall=false;p.stun=0;p.animation={clip:'idle',tick:0};
                    t.x=100+facing*4.7;t.y=90;t.hasBall=false;t.stun=0;t.animation={clip:'idle',tick:0};Object.assign(s.ball,{mode:'dead',ownerId:null,targetId:null,attemptId:null,scored:false,x:100,y:90,z:0,vx:0,vy:0,vz:0});s.rng=seed>>>0;
                    g.tick(1,[{playerId:p.id,shovePressed:true},{playerId:t.id,x:0,y:0}]);while(p.animation.tick<8)g.tick(1,[{playerId:p.id,x:0,y:0},{playerId:t.id,x:0,y:0}]);
                    if(p.animation.clip==='push'&&p.knockdowns===0)return seed;
                }throw Error('No failed push seed found');}""", {'facing': facing})
                # Reinitialize showcase with the deterministic miss seed.
                page.evaluate("""({facing,seed})=>{const g=window.jamverse;g.start('scoria-rams','blackthorn-court-kings',180,seed);const s=g.state,p=s.players.find(x=>x.id==='krios'),t=s.players.find(x=>x.team!==p.team&&!x.captain);s.players=[p,t];s.possession=t.team;s.phase='playing';s.pause=false;s.score=[0,0];p.x=100;p.y=93;p.facing=facing;p.hasBall=false;p.stun=0;p.animation={clip:'idle',tick:0};t.x=100+facing*4.7;t.y=90;t.hasBall=false;t.stun=0;t.animation={clip:'idle',tick:0};Object.assign(s.ball,{mode:'dead',ownerId:null,targetId:null,attemptId:null,scored:false,x:100,y:90,z:0,vx:0,vy:0,vz:0});s.rng=seed>>>0;g.tick(1,[{playerId:p.id,shovePressed:true},{playerId:t.id,x:0,y:0}]);}""", {'facing': facing, 'seed': miss_seed})
                run = {'mode': 'all-frame-showcase-failed-contact-roll', 'facing': facing, 'direction': direction, 'zoom': zoom, 'seed': miss_seed, 'initialState': setup, 'captures': []}
                for index, target_tick in enumerate(FRAME_START_TICKS):
                    info = page.evaluate("""async ({targetTick,atlas})=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='krios'),t=s.players.find(x=>x.id!==p.id);while(p.animation.tick<targetTick)g.tick(1,[{playerId:p.id,x:0,y:0},{playerId:t.id,x:0,y:0}]);const selected=window.__pushSelector(p,{manifest:window.__pushManifest,images:window.__productionSpriteImagesForReview});return {tick:p.animation.tick,clip:p.animation.clip,frame:selected?.frame,src:selected?.src,flip:selected?.flip,playerFacing:p.facing,target:{id:t.id,stun:t.stun,clip:t.animation?.clip},knockdowns:p.knockdowns,ball:{mode:s.ball.mode,ownerId:s.ball.ownerId}};}""", {'targetTick': target_tick, 'atlas': ATLAS})
                    expected = index
                    if info['clip'] != 'push' or info['frame'] != expected or info['src'] != ATLAS or info['flip'] != (facing < 0):
                        raise RuntimeError(f'push selector mismatch expected frame {expected}: {info}')
                    if info['ball'] != {'mode': 'dead', 'ownerId': None}:
                        raise RuntimeError(f'ball state changed during non-carrier push: {info}')
                    name = f'{direction}-frame{expected}-tick{info["tick"]}-zoom{zoom}.png'
                    info.update({'zoom': zoom, 'path': (OUT / name).relative_to(ROOT).as_posix()})
                    page.locator('#game').screenshot(path=str(OUT / name))
                    run['captures'].append(info)
                report['runs'].append(run)

                # Separate actual successful non-carrier contact. Try fixed
                # seeds and inspect the real simulation result at tick8/frame5.
                success = page.evaluate("""({facing})=>{const g=window.jamverse;for(let i=1;i<=300;i++){const seed=(i*2654435761)>>>0;
                    g.start('scoria-rams','blackthorn-court-kings',180,seed);const s=g.state,p=s.players.find(x=>x.id==='krios'),t=s.players.find(x=>x.team!==p.team&&!x.captain);s.players=[p,t];s.possession=t.team;s.phase='playing';s.pause=false;p.x=100;p.y=93;p.facing=facing;p.hasBall=false;p.stun=0;p.animation={clip:'idle',tick:0};t.x=100+facing*4.7;t.y=90;t.hasBall=false;t.stun=0;t.animation={clip:'idle',tick:0};Object.assign(s.ball,{mode:'dead',ownerId:null,targetId:null,attemptId:null,scored:false,x:100,y:90,z:0,vx:0,vy:0,vz:0});s.rng=seed>>>0;g.tick(1,[{playerId:p.id,shovePressed:true},{playerId:t.id,x:0,y:0}]);while(p.animation.tick<8)g.tick(1,[{playerId:p.id,x:0,y:0},{playerId:t.id,x:0,y:0}]);if(p.knockdowns>0)return {seed,tick:p.animation.tick,clip:p.animation.clip,target:{id:t.id,stun:t.stun,clip:t.animation.clip},knockdowns:p.knockdowns,event:s.lastEvent,ball:{mode:s.ball.mode,ownerId:s.ball.ownerId}};
                }throw Error('No successful push-contact seed found');}""", {'facing': facing})
                page.evaluate("""({facing,seed})=>{const g=window.jamverse;g.start('scoria-rams','blackthorn-court-kings',180,seed);const s=g.state,p=s.players.find(x=>x.id==='krios'),t=s.players.find(x=>x.team!==p.team&&!x.captain);s.players=[p,t];s.possession=t.team;s.phase='playing';s.pause=false;p.x=100;p.y=93;p.facing=facing;p.hasBall=false;p.stun=0;p.animation={clip:'idle',tick:0};t.x=100+facing*4.7;t.y=90;t.hasBall=false;t.stun=0;t.animation={clip:'idle',tick:0};Object.assign(s.ball,{mode:'dead',ownerId:null,targetId:null,attemptId:null,scored:false,x:100,y:90,z:0,vx:0,vy:0,vz:0});s.rng=seed>>>0;g.tick(1,[{playerId:p.id,shovePressed:true},{playerId:t.id,x:0,y:0}]);while(p.animation.tick<8)g.tick(1,[{playerId:p.id,x:0,y:0},{playerId:t.id,x:0,y:0}]);}""", {'facing': facing, 'seed': success['seed']})
                contact = page.evaluate("""async()=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='krios'),t=s.players.find(x=>x.id!==p.id);const selected=window.__pushSelector(p,{manifest:window.__pushManifest,images:window.__productionSpriteImagesForReview});return {tick:p.animation.tick,clip:p.animation.clip,frame:selected?.frame,src:selected?.src,flip:selected?.flip,target:{id:t.id,stun:t.stun,clip:t.animation.clip},knockdowns:p.knockdowns,event:s.lastEvent,ball:{mode:s.ball.mode,ownerId:s.ball.ownerId}};}""")
                if contact['tick'] != CONTACT_TICK or contact['frame'] != CONTACT_FRAME or contact['src'] != ATLAS or contact['knockdowns'] != 1 or contact['target']['stun'] <= 0 or contact['target']['clip'] != 'fall':
                    raise RuntimeError(f'actual push contact did not knock target down: {contact}')
                cname = f'{direction}-successful-contact-frame5-tick8-zoom{zoom}.png'
                page.locator('#game').screenshot(path=str(OUT / cname))
                report['runs'].append({'mode': 'successful-noncarrier-contact', 'facing': facing, 'direction': direction, 'zoom': zoom, 'seed': success['seed'], 'targetSetup': {'playerY':93,'targetX':100+facing*4.7,'targetY':90,'distance':5.574}, 'path': (OUT / cname).relative_to(ROOT).as_posix(), **contact})
                if errors:
                    report['uncaughtBrowserErrors'].extend(errors)
                    raise RuntimeError('browser page errors: ' + json.dumps(errors))
                page.close()
        browser.close()
    report['captureCount'] = sum(len(run.get('captures', [])) + (1 if run['mode'] == 'successful-noncarrier-contact' else 0) for run in report['runs'])
    (OUT / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({'captures': report['captureCount'], 'runs': len(report['runs']), 'output': str(OUT)}))
finally:
    server.terminate()
    server.wait(timeout=5)
