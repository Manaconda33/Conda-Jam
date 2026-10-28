"""Run Kraken pickup attempt03 through the Jam Stage production sprite loader.

The atlas manifest and ball track are added only to browser-served module
responses. The loose-ball fixture is set once per facing/zoom, then production
simulation ticks run normally. No checked-in runtime or manifest file is edited.
"""
from pathlib import Path
from os import environ
from hashlib import sha256
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[7]
OUT = Path(__file__).resolve().parent / 'single-player-fixture' / 'native'
OUT.mkdir(parents=True, exist_ok=True)
PORT = environ.get('PORT', '4235')
URL = f'http://127.0.0.1:{PORT}/'
ATLAS_FILE = ROOT / 'tools/generate-art/previews/kraken-pickup5-attempt04/kraken-pickup5-attempt04-cleanup02-atlas-candidate.png'
ATLAS_SRC = './public/assets/animation/kraken-pickup-attempt03-normal-loader.png'
TRACK = {'height': [0.65, 0.45, 0.2, 0.2, 0.5], 'forward': [3.5, 4.5, 5.5, 4.5, 4.5]}
TICKS = [0, 2, 4, 6, 7, 8, 10, 11]
COURT_Y = float(environ.get('COURT_Y', '50'))

manifest_addition = f"""
animationAssetManifest.characters.kraken.directions.right.pickup={{
 src:{json.dumps(ATLAS_SRC)},columns:5,rows:1,reviewed:true,mirrorSafe:true,baselineY:90,
 frames:Array.from({{length:5}},(_,i)=>({{x:i*80,y:0,w:80,h:96}}))
}};
"""
track_addition = '\nathleteBallTracks.kraken={...(athleteBallTracks.kraken||{}),pickup:' + json.dumps(TRACK) + '};\n'

def add_manifest(route):
    response = route.fetch()
    body = response.text()
    if 'export const animationAssetManifest = ' not in body:
        raise RuntimeError('production animation manifest export not found')
    route.fulfill(response=response, body=body + manifest_addition)

def add_track(route):
    response = route.fetch()
    body = response.text()
    if 'const athleteBallTracks=' not in body:
        raise RuntimeError('production athlete ball track declaration not found')
    route.fulfill(response=response, body=body + track_addition)

def expose_loader_assets(route):
    response = route.fetch()
    body = response.text()
    marker = 'const productionSpriteAssets={manifest:animationAssetManifest,images:productionSpriteImages};'
    if marker not in body:
        raise RuntimeError('production loader asset map declaration not found')
    body = body.replace(marker, marker + 'window.__pickupReviewAssets=productionSpriteAssets;', 1)
    route.fulfill(response=response, body=body)

def serve_candidate_atlas(route):
    route.fulfill(path=str(ATLAS_FILE), content_type='image/png')

server = Popen(['node', 'tools/server.mjs'], cwd=ROOT, env={**environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)
report = {
    'renderer': 'Chromium current Jam Stage canvas',
    'validationClass': 'normal production sprite loader and selector with browser-response-only candidate manifest/track overlays',
    'notUserInitiated': True,
    'atlas': ATLAS_SRC,
    'atlasFile': str(ATLAS_FILE.relative_to(ROOT)),
    'atlasSha256': sha256(ATLAS_FILE.read_bytes()).hexdigest(),
    'track': TRACK,
    'baselineY': 90,
    'durations': [2, 3, 2, 1, 4],
    'sampleTicks': TICKS,
    'courtY': COURT_Y,
    'rosterIsolation': 'match initialized normally through Jam Stage, production sprite loader run; then state.players=[kraken] before the loose-ball fixture so only Kraken is rendered and simulated. This is a single-player validation fixture, not a full-match behavior claim.',
    'runs': [],
    'browserErrors': [],
    'failedRequests': [],
}

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

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-dev-shm-usage'])
        for zoom in (100, 120):
            for facing, direction in ((1, 'right'), (-1, 'left')):
                page = browser.new_page(viewport={'width': 900, 'height': 700}, device_scale_factor=1)
                errors, failed = [], []
                page.on('pageerror', lambda exc: errors.append(str(exc)))
                page.on('requestfailed', lambda req: failed.append({'url': req.url, 'failure': req.failure}))
                page.add_init_script('window.requestAnimationFrame=()=>0')
                page.route('**/src/content/animation-assets.js', add_manifest)
                page.route('**/src/core/animation.js', add_track)
                page.route('**/src/main.js', expose_loader_assets)
                page.route('**/public/assets/animation/kraken-pickup-attempt03-normal-loader.png', serve_candidate_atlas)
                page.goto(URL, wait_until='networkidle', timeout=120000)
                page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=120000)
                page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}', zoom)
                page.evaluate("window.jamverse.start('vesper-harbor-undertow','scoria-rams',180,128)")
                page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='kraken')")
                try:
                    page.wait_for_function("()=>{const img=window.__pickupReviewAssets?.images.get('./public/assets/animation/kraken-pickup-attempt03-normal-loader.png');return img?.complete&&img.naturalWidth===400}", timeout=8000)
                except Exception:
                    debug = page.evaluate("""()=>({map:window.__pickupReviewAssets?Array.from(window.__pickupReviewAssets.images.entries()).map(([src,img])=>({src,complete:img.complete,width:img.naturalWidth})):null,
                      game:window.jamverse?{players:window.jamverse.state?.players?.map(p=>p.id),phase:window.jamverse.state?.phase}:null})""")
                    raise RuntimeError(f'Candidate atlas did not load via production loader: {debug}; browserErrors={errors}; failedRequests={failed}')
                setup = page.evaluate("""({facing,courtY})=>{
                  const g=window.jamverse,s=g.state,p=s.players.find(q=>q.id==='kraken');
                  s.players=[p];
                  p.x=100;p.y=courtY;p.z=p.vx=p.vy=p.vz=0;p.facing=facing;p.hasBall=false;p.stun=0;p.animation={clip:'idle',tick:0};p.anim='idle';
                  s.phase='playing';s.pause=false;s.score=[0,0];s.scorePause=0;s.possession=1;s.clock=180;s.shotClock=24;s.events=[];s.lastEvent='';
                  Object.assign(s.ball,{mode:'loose',ownerId:null,targetId:null,aerialTargetId:null,lastTouch:'opponent',attemptId:null,scored:false,
                    x:p.x+facing*2.5,y:p.y+1.5,z:.2,vx:facing*.09,vy:0,vz:0});
                  return {player:p.id,facing,x:p.x,y:p.y,players:s.players.map(q=>q.id),ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z,mode:s.ball.mode,owner:s.ball.ownerId},score:[...s.score]};
                }""", {'facing': facing, 'courtY': COURT_Y})
                start_step = None
                for step in range(1, 60):
                    state = page.evaluate("""()=>{const g=window.jamverse,s=g.state,p=s.players.find(q=>q.id==='kraken');g.tick(1,s.players.map(q=>({playerId:q.id})));return {tick:p.animation.tick,clip:p.animation.clip,ballMode:s.ball.mode,owner:s.ball.ownerId,events:s.events};}""")
                    if state['clip'] == 'pickup':
                        start_step = step
                        break
                if start_step is None:
                    raise RuntimeError(f'Kraken never entered pickup: {direction} zoom{zoom}')
                run = {'facing': facing, 'direction': direction, 'zoom': zoom, 'setup': setup, 'pickupStartStep': start_step, 'captures': []}
                for target_tick in TICKS:
                    while True:
                        snapshot = page.evaluate("""async()=>{
                          const g=window.jamverse,s=g.state,p=s.players.find(q=>q.id==='kraken');
                          const {selectProductionSprite}=await import('/src/render/animation-sprites.js');
                          const selected=selectProductionSprite(p,window.__pickupReviewAssets);
                          return {tick:p.animation.tick,clip:p.animation.clip,action:p.animation.action?.kind,hasBall:p.hasBall,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z,mode:s.ball.mode,owner:s.ball.ownerId},score:[...s.score],events:s.events,
                            sprite:selected?{src:selected.src,frame:selected.frame,flip:selected.flip,baselineY:selected.baselineY}:null,
                            assetLoader:{imageWidth:window.__pickupReviewAssets.images.get('./public/assets/animation/kraken-pickup-attempt03-normal-loader.png')?.naturalWidth}};
                        }""")
                        if snapshot['clip'] != 'pickup' or snapshot['tick'] >= target_tick:
                            break
                        page.evaluate('inputs=>window.jamverse.tick(1,inputs)', page.evaluate('()=>window.jamverse.state.players.map(p=>({playerId:p.id}))'))
                    if snapshot['clip'] == 'pickup' and snapshot['tick'] == target_tick:
                        filename = f'{direction}-zoom{zoom}-tick{target_tick:02d}-frame{snapshot["sprite"]["frame"] if snapshot["sprite"] else "fallback"}.png'
                        destination = OUT / filename
                        page.locator('#game').screenshot(path=str(destination))
                        record = {**snapshot, 'path': filename, 'sha256': sha256(destination.read_bytes()).hexdigest()}
                        run['captures'].append(record)
                run['finalState'] = page.evaluate("""()=>{const g=window.jamverse,s=g.state,p=s.players.find(q=>q.id==='kraken');return {clip:p.animation.clip,tick:p.animation.tick,hasBall:p.hasBall,ballMode:s.ball.mode,owner:s.ball.ownerId,score:[...s.score],events:s.events};}""")
                run['browserErrors'] = errors
                run['failedRequests'] = failed
                report['runs'].append(run)
                report['browserErrors'].extend(errors)
                report['failedRequests'].extend(failed)
                page.close()
        browser.close()
    report['captureCount'] = sum(len(run['captures']) for run in report['runs'])
    report['normalLoaderCheck'] = all(
        len(run['captures']) == len(TICKS)
        and all(cap['sprite'] and cap['sprite']['src'] == ATLAS_SRC and cap['sprite']['baselineY'] == 90 for cap in run['captures'])
        for run in report['runs'])
    report['allRunsOwnBallAfterGrab'] = all(run['finalState']['owner'] == 'kraken' and run['finalState']['score'] == [0, 0] for run in report['runs'])
    report['captureIntegrity'] = all(cap['sha256'] for run in report['runs'] for cap in run['captures'])
    report['loaderSimulationPass'] = report['captureCount'] == 32 and report['normalLoaderCheck'] and report['allRunsOwnBallAfterGrab'] and not report['browserErrors'] and not report['failedRequests']
    report['visualReview'] = {'status': 'pending independent visual review', 'registrationEligible': False}
    report['productionReady'] = False
    (OUT.parent / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
    if not report['loaderSimulationPass']:
        raise RuntimeError(f'normal-loader validation failed; see {OUT.parent / "report.json"}')
finally:
    server.terminate()
    try:
        server.wait(timeout=5)
    except Exception:
        server.kill()
