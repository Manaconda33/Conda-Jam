"""Capture candidate Kraken steal ball tracks with the production Jam Stage renderer."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ATTEMPT = int(environ.get('ATTEMPT', '1'))
REVISION = environ.get('REVISION', '')
PORT = environ.get('PORT', '4228')
URL = f'http://127.0.0.1:{PORT}/'
ATLAS = './tools/generate-art/sources/kraken-steal-candidate2-cleanup01-atlas.png'
TRIAL = f'attempt-{ATTEMPT:02d}' + (f'-{REVISION}' if REVISION else '')
OUT = ROOT / f'tools/generate-art/previews/kraken-steal-track-candidate/{TRIAL}/native'
OUT.mkdir(parents=True, exist_ok=True)
FRAME_TICKS = [0, 2, 4, 5, 6, 8, 10, 13]
HEIGHT = json.loads(environ.get('TRACK_HEIGHT', '[1.0,0.9,0.75,0.55,0.75,0.95,1.05,1.0]'))
FORWARD = json.loads(environ.get('TRACK_FORWARD', '[5,8,10,12,11,8,6,5]'))
if len(HEIGHT) != 8 or len(FORWARD) != 8:
    raise SystemExit('TRACK_HEIGHT and TRACK_FORWARD must each contain 8 values')

server = Popen(['node', 'tools/server.mjs'], cwd=ROOT, env={**environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)
report = {
    'renderer': 'Chromium production Jam Stage canvas',
    'baseUrl': URL,
    'athlete': 'kraken',
    'clip': 'steal',
    'attempt': ATTEMPT,
    'revision': REVISION or None,
    'candidateAtlas': ATLAS,
    'candidateTrack': {'height': HEIGHT, 'forward': FORWARD},
    'court': 'vesper-harbor-undertow vs blackthorn-court-kings',
    'courtY': 90,
    'grid': '8 canonical steal pose starts × both facings × 100%/120% zoom = 32 captures',
    'captureMethod': 'Single Jam Stage start. Temporary in-page atlas override for unregistered cleanup01 candidate. Ball is a separate loose render staged at Kraken-specific hand offsets; no ball is included in the sprite atlas.',
    'captures': [],
}

try:
    deadline = monotonic() + 30
    while monotonic() < deadline:
        if server.poll() is not None:
            raise RuntimeError('Jam Stage server exited before becoming ready')
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
        page.add_init_script('window.requestAnimationFrame=()=>0')
        page.goto(URL, wait_until='networkidle', timeout=120000)
        page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=120000)
        page.evaluate(f"""async()=>{{
          const image=new Image();image.src='{ATLAS}';await image.decode();window.__krakenStealCandidate=image;
          const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
          animationAssetManifest.characters.kraken.directions.right.steal={{
            src:'{ATLAS}',columns:4,rows:2,reviewed:true,
            frames:Array.from({{length:8}},(_,i)=>({{x:(i%4)*80,y:Math.floor(i/4)*96,w:80,h:96}}))
          }};
        }}""")
        # Override before the only start so loadProductionSprites() loads the candidate atlas.
        page.evaluate("window.jamverse.start('vesper-harbor-undertow','blackthorn-court-kings',180,4)")
        page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='kraken')")
        page.wait_for_timeout(500)
        page.evaluate("""()=>{
          const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='kraken');
          s.players=[p];p.x=100;p.y=90;p.z=0;p.facing=1;p.animation={clip:'steal',tick:0};p.anim='steal';p.hasBall=false;
          s.ball.mode='loose';s.ball.ownerId=null;s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.lastTouch=null;
          s.ball.vx=s.ball.vy=s.ball.vz=0;s.pause=true;g.tick(1/60);s.pause=false;
        }""")
        report['stageReset'] = page.evaluate("()=>{const canvases=[...document.querySelectorAll('canvas')],rects=canvases.map(c=>c.getBoundingClientRect().toJSON());return{playerIds:window.jamverse.state.players.map(p=>p.id),playerCount:window.jamverse.state.players.length,canvasCount:canvases.length,visibleGameCanvasCount:rects.filter(r=>r.width>100&&r.height>100).length,gameCanvas:document.querySelector('#game').getBoundingClientRect().toJSON(),gameplayArt:document.querySelector('#game').dataset.gameplayArt}}")
        if report['stageReset']['playerCount'] != 1 or report['stageReset']['visibleGameCanvasCount'] != 1:
            raise RuntimeError(f"Expected one staged athlete and one visible Jam Stage canvas: {report['stageReset']}")
        for zoom in [100, 120]:
            page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}', zoom)
            for facing, direction in [(1, 'right'), (-1, 'left')]:
                for frame, tick in enumerate(FRAME_TICKS):
                    info = page.evaluate("""async({frame,tick,facing,atlas,height,forward})=>{
                      const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='kraken');
                      p.x=100;p.y=90;p.z=0;p.facing=facing;p.animation={clip:'steal',tick};p.anim='steal';p.hasBall=false;
                      s.ball.mode='loose';s.ball.ownerId=null;s.ball.targetId=null;s.ball.aerialTargetId=null;
                      s.ball.x=p.x+facing*forward;s.ball.y=p.y;s.ball.z=height;s.ball.vx=s.ball.vy=s.ball.vz=0;
                      g.tick(0);
                      const {selectProductionSprite}=await import('/src/render/animation-sprites.js');
                      const {animationAssetManifest}=await import('/src/content/animation-assets.js');
                      const selected=selectProductionSprite(p,{manifest:animationAssetManifest,images:new Map([[atlas,window.__krakenStealCandidate]])});
                      return{tick,frame,facing,ballMode:s.ball.mode,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z},gameplayArt:document.querySelector('#game').dataset.gameplayArt,
                        selection:selected&&{src:selected.src,frame:selected.frame,flip:selected.flip,classification:selected.classification,production:selected.production}};
                    }""", {'frame': frame, 'tick': tick, 'facing': facing, 'atlas': ATLAS, 'height': HEIGHT[frame], 'forward': FORWARD[frame]})
                    name = f'frame{frame:02d}-tick{tick:02d}-{direction}-zoom{zoom}.png'
                    page.locator('#game').screenshot(path=str(OUT / name))
                    report['captures'].append({**info,'zoom':zoom,'path':str((OUT/name).relative_to(ROOT))})
        browser.close()
        if errors:
            raise RuntimeError(f'Browser errors: {errors}')
        if len(report['captures']) != 32 or any(c['gameplayArt']!='generated-full-roster-atlases' for c in report['captures']):
            raise RuntimeError('Expected 32 production Jam Stage steal captures')
        bad=next((c for c in report['captures'] if c['selection'] is None or c['selection']['src']!=ATLAS or c['selection']['frame']!=c['frame'] or c['selection']['flip']!=(c['facing']<0)),None)
        if bad:
            raise RuntimeError('Production selector mismatch: '+str(bad))
        report['captureCount']=len(report['captures'])
        report['uncaughtBrowserErrors']=errors
        (OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
        print(json.dumps({'attempt':ATTEMPT,'revision':REVISION or None,'captures':len(report['captures']),'ticks':FRAME_TICKS,'height':HEIGHT,'forward':FORWARD,'stageReset':report['stageReset'],'errors':errors,'output':str(OUT)}))
finally:
    server.terminate()
    server.wait(timeout=5)
