"""Capture Kraken block candidate frames in the production Jam Stage renderer."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'tools/generate-art/previews/kraken-block-native-candidate'
OUT.mkdir(parents=True, exist_ok=True)
PORT = environ.get('PORT', '4227')
URL = f'http://127.0.0.1:{PORT}/'
ATLAS = './tools/generate-art/sources/kraken-block-candidate3-cleanup02-atlas.png'
FRAME_TICKS = [0, 2, 5, 8]
PLAYER_Z = [0, .55, 1.4, .45]
server = Popen(['node', 'tools/server.mjs'], cwd=ROOT, env={**environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)
report = {
    'renderer': 'Chromium production Jam Stage canvas',
    'baseUrl': URL,
    'athlete': 'kraken',
    'clip': 'block',
    'candidateAtlas': ATLAS,
    'court': 'vesper-harbor-undertow vs blackthorn-court-kings',
    'courtY': 90,
    'grid': '4 canonical block poses × both facings × 100%/120% zoom = 16 captures',
    'captureMethod': 'Temporary in-page manifest override for unregistered Kraken candidate atlas. Static pose samples follow canonical frame-start ticks; no ball is included in the athlete art, and the separate game ball is staged off screen.',
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
        page.evaluate("window.jamverse.start('vesper-harbor-undertow','blackthorn-court-kings',180,4)")
        page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='kraken')")
        page.evaluate(f"""async()=>{{
          const image=new Image();image.src='{ATLAS}';await image.decode();window.__krakenBlockCandidate=image;
          const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
          animationAssetManifest.characters.kraken.directions.right.block={{
            src:'{ATLAS}',columns:2,rows:2,reviewed:true,
            frames:[{{x:0,y:0,w:80,h:96}},{{x:80,y:0,w:80,h:96}},{{x:0,y:96,w:80,h:96}},{{x:80,y:96,w:80,h:96}}]
          }};
        }}""")
        page.evaluate("window.jamverse.start('vesper-harbor-undertow','blackthorn-court-kings',180,4)")
        page.wait_for_timeout(500)
        page.evaluate("""()=>{
          const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='kraken');
          s.players=[p];p.x=100;p.y=90;p.z=0;p.facing=1;p.animation={clip:'block',tick:0};p.anim='block';p.hasBall=false;
          s.ball.mode='loose';s.ball.ownerId=null;s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.x=120;s.ball.y=90;s.ball.z=2.5;s.ball.vx=s.ball.vy=s.ball.vz=0;
          s.pause=true;for(let i=0;i<120;i++)g.tick(1/60);s.pause=false;
        }""")
        report['stageReset'] = page.evaluate("()=>({playerIds:window.jamverse.state.players.map(p=>p.id),canvasCount:document.querySelectorAll('canvas').length,canvasRects:[...document.querySelectorAll('canvas')].map(c=>c.getBoundingClientRect().toJSON()),court:document.querySelector('#game').dataset.court})")
        for zoom in [100, 120]:
            page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}', zoom)
            for facing, direction in [(1, 'right'), (-1, 'left')]:
                for frame, tick in enumerate(FRAME_TICKS):
                    info = page.evaluate("""async({frame,tick,facing,atlas,z})=>{
                      const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='kraken');
                      p.x=100;p.y=90;p.z=z;p.facing=facing;p.animation={clip:'block',tick};p.anim='block';p.hasBall=false;
                      s.ball.mode='loose';s.ball.ownerId=null;s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.x=120;s.ball.y=90;s.ball.z=2.5;s.ball.vx=s.ball.vy=s.ball.vz=0;
                      g.tick(0);
                      const {selectProductionSprite}=await import('/src/render/animation-sprites.js');
                      const {animationAssetManifest}=await import('/src/content/animation-assets.js');
                      const selected=selectProductionSprite(p,{manifest:animationAssetManifest,images:new Map([[atlas,window.__krakenBlockCandidate]])});
                      return{tick,frame,facing,z:p.z,ballMode:s.ball.mode,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z},gameplayArt:document.querySelector('#game').dataset.gameplayArt,
                        selection:selected&&{src:selected.src,frame:selected.frame,flip:selected.flip,classification:selected.classification,production:selected.production}};
                    }""", {'frame': frame, 'tick': tick, 'facing': facing, 'atlas': ATLAS, 'z': PLAYER_Z[frame]})
                    name = f'frame{frame:02d}-tick{tick:02d}-{direction}-zoom{zoom}.png'
                    page.locator('#game').screenshot(path=str(OUT / name))
                    report['captures'].append({**info,'zoom':zoom,'path':str((OUT/name).relative_to(ROOT))})
        browser.close()
        if errors:
            raise RuntimeError(f'Browser errors: {errors}')
        if len(report['captures']) != 16 or any(c['gameplayArt']!='generated-full-roster-atlases' for c in report['captures']):
            raise RuntimeError('Expected 16 production Jam Stage block captures')
        bad=next((c for c in report['captures'] if c['selection'] is None or c['selection']['src']!=ATLAS or c['selection']['frame']!=c['frame'] or c['selection']['flip']!=(c['facing']<0)),None)
        if bad:
            raise RuntimeError('Production selector mismatch: '+str(bad))
        report['captureCount']=len(report['captures'])
        report['uncaughtBrowserErrors']=errors
        (OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
        print(json.dumps({'captures':len(report['captures']),'ticks':FRAME_TICKS,'errors':errors,'output':str(OUT)}))
finally:
    server.terminate()
    server.wait(timeout=5)
