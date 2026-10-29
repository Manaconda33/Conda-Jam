"""Review Kraken J.129's registered overhead pass in the normal Jam Stage loader."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ATTEMPT = 9
OUT = ROOT / f'tools/generate-art/previews/kraken-pass-overhead-track-candidate/attempt-{ATTEMPT:02d}/normal-loader'
OUT.mkdir(parents=True, exist_ok=True)
PORT = environ.get('PORT', '4238')
URL = f'http://127.0.0.1:{PORT}/'
ATLAS = './public/assets/animation/kraken-pass-overhead-right.png'
RELEASE_TICK = 7
FRAME_STARTS = [0, 2, 5, 7, 8, 10]
COURT_Y = 75
report = {
    'status': 'registered normal-loader review candidate; acceptance pending independent visual review',
    'renderer': 'Chromium production Jam Stage canvas', 'baseUrl': URL,
    'athlete': 'kraken', 'team': 'vesper-harbor-undertow', 'clip': 'pass-overhead',
    'productionAtlas': ATLAS,
    'productionTrack': {'height': [1.05, 1.85, 1.75, 1.9, 2.1, 1.2], 'forward': [2.5, 3, 2, 6, 10, 14], 'releaseVz': .232},
    'frameStarts': FRAME_STARTS, 'releaseTick': RELEASE_TICK, 'courtY': COURT_Y,
    'captureGrid': 'all frame starts plus release and post-release samples, both facings × 100%/120% zoom; actual gameplay pass through Marin catch',
    'captureMethod': 'Registered production manifest and athlete track loaded normally; no manifest or animation module interception/override. A real Jam Stage pass action advances simulation and free flight to Marin catch.',
    'captures': [], 'gameplayPasses': [], 'uncaughtBrowserErrors': [],
}
server = None if environ.get('EXTERNAL_SERVER') == '1' else Popen(['node', 'tools/server.mjs'], cwd=ROOT, env={**environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)

try:
    deadline = monotonic() + 30
    while monotonic() < deadline:
        if server is not None and server.poll() is not None:
            raise RuntimeError('Jam Stage server exited before ready')
        try:
            with urlopen(URL, timeout=1) as response:
                if response.status == 200:
                    break
        except Exception:
            sleep(.1)
    else:
        raise TimeoutError('Jam Stage server did not become ready')

    with sync_playwright() as pwt:
        browser = pwt.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-dev-shm-usage'])
        page = browser.new_page(viewport={'width': 900, 'height': 700}, device_scale_factor=1)
        errors = []
        page.on('pageerror', lambda exc: errors.append(str(exc)))
        page.on('requestfailed', lambda req: errors.append(f'request failed: {req.url} {req.failure}'))
        page.add_init_script('window.requestAnimationFrame=()=>0')
        page.goto(URL, wait_until='networkidle', timeout=120000)
        page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=120000)

        load_production_art = f"""async()=>{{
          const image=new Image();image.src='{ATLAS}';await image.decode();
          const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
          const {{selectProductionSprite}}=await import('/src/render/animation-sprites.js');
          const {{sampleBallForward,sampleBallHeight,sampleBallReleaseVz}}=await import('/src/core/animation.js');
          const clip=animationAssetManifest.characters.kraken.directions.right['pass-overhead'];
          return {{clip,probe:[sampleBallForward('pass-overhead',0,'kraken'),sampleBallHeight('pass-overhead',0,'kraken'),sampleBallForward('pass-overhead',7,'kraken'),sampleBallHeight('pass-overhead',7,'kraken'),sampleBallReleaseVz('pass-overhead','kraken')],image:image&&{{width:image.naturalWidth,height:image.naturalHeight}},selectProductionSprite:String(selectProductionSprite)}};
        }}"""
        production = page.evaluate(load_production_art)
        if not production['clip'] or production['clip']['src'] != ATLAS:
            raise RuntimeError(f'Normal manifest did not load registered atlas: {production["clip"]}')
        if production['probe'] != [2.5, 1.05, 6, 1.9, .232]:
            raise RuntimeError(f'Normal module did not load registered track: {production["probe"]}')
        if production['image'] != {'width': 240, 'height': 192}:
            raise RuntimeError(f'Unexpected production atlas dimensions: {production["image"]}')
        report['normalLoaderProbe'] = {'source': production['clip']['src'], 'frameCount': len(production['clip']['frames']), 'atlasSize': production['image'], 'ballTrackAt0And7AndReleaseVz': production['probe']}

        for zoom in [100, 120]:
            page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}', zoom)
            for facing in [1, -1]:
                home, away = ('vesper-harbor-undertow', 'blackthorn-court-kings') if facing == 1 else ('blackthorn-court-kings', 'vesper-harbor-undertow')
                page.evaluate('([h,a])=>window.jamverse.start(h,a,180,7)', [home, away])
                page.wait_for_timeout(150)
                setup = page.evaluate("""({facing,courtY})=>{
                  const g=window.jamverse,s=g.state,k=s.players.find(p=>p.id==='kraken'),r=s.players.find(p=>p.team===k.team&&p.id!==k.id);
                  for(const p of s.players){p.x=p.team===k.team?(p.id===k.id?(facing===1?80:120):(facing===1?110:90)):(p.team===0?20:180);p.y=p.id==='kraken'||p.id===r.id?courtY:(p.team===0?15:85);p.z=p.vx=p.vy=p.vz=0;p.hasBall=false;p.animation={clip:'idle',tick:0};p.anim='idle';p.facing=p.id===r.id?-facing:(p.team===k.team?facing:(p.team===0?1:-1))}
                  k.hasBall=true;k.animation={clip:'idle-ball',tick:0};k.anim='idle-ball';s.ball.mode='carried';s.ball.ownerId=k.id;s.ball.lastTouch=k.id;s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.x=k.x;s.ball.y=k.y;s.ball.z=1;s.ball.vx=s.ball.vy=s.ball.vz=0;s.possession=k.team;s.pause=false;s.practice=true;
                  return {passer:{id:k.id,x:k.x,facing:k.facing},receiver:{id:r.id,x:r.x},score:[...s.score]};
                }""", {'facing': facing, 'courtY': COURT_Y})

                selection_probe = f"""async({{tick,mode,owner}})=>{{
                  const g=window.jamverse,s=g.state,k=s.players.find(p=>p.id==='kraken');
                  k.animation={{clip:'pass-overhead',tick}};k.anim='pass-overhead';k.hasBall=mode==='carried';s.ball.mode=mode;s.ball.ownerId=owner;s.ball.lastTouch='kraken';
                  const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
                  const {{selectProductionSprite}}=await import('/src/render/animation-sprites.js');
                  const {{sampleBallForward,sampleBallHeight}}=await import('/src/core/animation.js');
                  const image=new Image();image.src='{ATLAS}';await image.decode();
                  s.ball.x=k.x+k.facing*sampleBallForward('pass-overhead',tick,'kraken');s.ball.y=k.y;s.ball.z=sampleBallHeight('pass-overhead',tick,'kraken');
                  g.tick(0);
                  const selected=selectProductionSprite(k,{{manifest:animationAssetManifest,images:new Map([[{json.dumps(ATLAS)},image]])}});
                  return selected&&{{src:selected.src,frame:selected.frame,flip:selected.flip,production:selected.production,classification:selected.classification}};
                }}"""
                frame_records = []
                for tick in FRAME_STARTS:
                    mode = 'carried' if tick < RELEASE_TICK else 'pass'
                    owner = 'kraken' if mode == 'carried' else None
                    selection = page.evaluate(selection_probe, {'tick': tick, 'mode': mode, 'owner': owner})
                    expected_frame = FRAME_STARTS.index(tick)
                    if not selection or selection['src'] != ATLAS or selection['frame'] != expected_frame or selection['flip'] != (facing < 0) or not selection['production']:
                        raise RuntimeError(f'Normal production selector failed at tick {tick}, facing {facing}: {selection}')
                    file = OUT / f'frame-tick{tick:02d}-facing{facing:+d}-zoom{zoom}.png'
                    page.locator('#game').screenshot(path=str(file))
                    frame_records.append({'tick': tick, 'frame': expected_frame, 'mode': mode, 'selection': selection, 'path': str(file.relative_to(ROOT))})
                    report['captures'].append({'tick': tick, 'frame': expected_frame, 'facing': facing, 'zoom': zoom, 'path': str(file.relative_to(ROOT)), 'selection': selection})

                # Reset, issue the action, and let normal simulation release, fly, and catch.
                page.evaluate('([h,a])=>window.jamverse.start(h,a,180,7)', [home, away])
                page.wait_for_timeout(150)
                page.evaluate("""({facing,courtY})=>{
                  const s=window.jamverse.state,k=s.players.find(p=>p.id==='kraken'),r=s.players.find(p=>p.team===k.team&&p.id!==k.id);
                  for(const p of s.players){p.x=p.team===k.team?(p.id===k.id?(facing===1?80:120):(facing===1?110:90)):(p.team===0?20:180);p.y=p.id==='kraken'||p.id===r.id?courtY:(p.team===0?15:85);p.z=p.vx=p.vy=p.vz=0;p.hasBall=false;p.animation={clip:'idle',tick:0};p.anim='idle';p.facing=p.id===r.id?-facing:(p.team===k.team?facing:(p.team===0?1:-1))}
                  k.hasBall=true;k.animation={clip:'idle-ball',tick:0};k.anim='idle-ball';s.ball.mode='carried';s.ball.ownerId=k.id;s.ball.lastTouch=k.id;s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.x=k.x;s.ball.y=k.y;s.ball.z=1;s.ball.vx=s.ball.vy=s.ball.vz=0;s.possession=k.team;s.pause=false;s.practice=true;
                }""", {'facing': facing, 'courtY': COURT_Y})

                trace = []
                catch = None
                for step in range(45):
                    state = page.evaluate("""({issue})=>{
                      const g=window.jamverse,s=g.state,k=s.players.find(p=>p.id==='kraken'),inputs=s.players.map(p=>({playerId:p.id}));
                      if(issue){const i=inputs.find(p=>p.playerId==='kraken');i.passPressed=true;i.passVariant='pass-overhead'}
                      g.tick(1,inputs);
                      const r=s.players.find(p=>p.team===k.team&&p.id!==k.id);
                      return {tick:k.animation.tick,clip:k.animation.clip,ball:{mode:s.ball.mode,ownerId:s.ball.ownerId,targetId:s.ball.targetId,lastTouch:s.ball.lastTouch,x:s.ball.x,y:s.ball.y,z:s.ball.z,vx:s.ball.vx,vy:s.ball.vy,vz:s.ball.vz},receiver:{id:r.id,hasBall:r.hasBall,clip:r.animation.clip,tick:r.animation.tick},score:[...s.score],lastEvent:s.lastEvent};
                    }""", {'issue': step == 0})
                    if (state['clip'] == 'pass-overhead' and (state['tick'] in FRAME_STARTS or state['tick'] in [RELEASE_TICK + 1, RELEASE_TICK + 3])) or step in [12, 16, 20, 23, 25, 26, 27]:
                        file = OUT / f'live-step{step:02d}-tick{state["tick"]:02d}-facing{facing:+d}-zoom{zoom}.png'
                        page.locator('#game').screenshot(path=str(file))
                        state['capture'] = str(file.relative_to(ROOT))
                    trace.append({'step': step, **state})
                    if state['receiver']['hasBall']:
                        catch = {'step': step, **state}
                        break
                if not catch or catch['ball']['ownerId'] != 'marin-dusk' or catch['score'] != setup['score']:
                    raise RuntimeError(f'Live overhead pass did not complete cleanly: facing={facing} zoom={zoom} catch={catch}')
                if not any(x['clip'] == 'pass-overhead' and x['ball']['mode'] == 'pass' and x['ball']['lastTouch'] == 'kraken' for x in trace):
                    raise RuntimeError('The actual sim did not reach a Kraken-owned overhead release')
                report['gameplayPasses'].append({'zoom': zoom, 'facing': facing, 'setup': setup, 'frameStarts': frame_records, 'trace': trace, 'catch': catch, 'passed': True})

        browser.close()
        if errors:
            report['uncaughtBrowserErrors'] = errors
            raise RuntimeError(f'Browser/request errors: {errors}')
        report['captureCount'] = len(report['captures'])
        report['gameplayPassCount'] = len(report['gameplayPasses'])
        report['gameplayPassed'] = all(p['passed'] for p in report['gameplayPasses'])
        (OUT / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
        print(json.dumps({'captures': report['captureCount'], 'gameplayPasses': report['gameplayPassCount'], 'gameplayPassed': report['gameplayPassed'], 'errors': errors, 'out': str(OUT)}, indent=2))
finally:
    if server is not None:
        server.terminate()
        server.wait(timeout=5)
