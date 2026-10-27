"""Capture J128 Krios overhead-pass track candidates through production Jam Stage."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ATTEMPT = int(environ.get('ATTEMPT', '5'))
OUT = ROOT / f'tools/generate-art/previews/j128-krios-overhead-pass-track-candidate/attempt-{ATTEMPT:02d}/native'
OUT.mkdir(parents=True, exist_ok=True)
COURT_Y = float(environ.get('COURT_Y', '90'))
PORT = environ.get('PORT', '4225')
URL = f'http://127.0.0.1:{PORT}/'
track = json.loads(environ.get('TRACK_JSON', '{"height":[1.45,1.9,2.8,3.0,2.85,1.4],"forward":[9,10,8,10,13,9]}'))
tick_by_frame = [0, 2, 5, 7, 8, 10]
release = json.loads(environ.get('RELEASE_JSON', '{"8":[16,5.2],"10":[24,6.5]}'))
atlas = './public/assets/animation/krios-pass-overhead-right.webp'
server = Popen(['node', 'tools/server.mjs'], cwd=ROOT, env={**environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)
report = {
    'renderer': 'Chromium production Jam Stage canvas', 'baseUrl': URL,
    'athlete': 'krios', 'clip': 'pass-overhead', 'candidateAtlas': atlas,
    'candidateTrack': track, 'releasePositions': release, 'courtY': COURT_Y,
    'grid': '6 authored frame starts × 2 facings × 2 zooms = 24 captures per successful attempt',
    'releaseTick': 7,
    'captureMethod': 'Temporary in-page manifest override for unregistered Krios overhead-pass atlas; separate ball follows the candidate hand track through tick6 and becomes ownerless pass flight at tick7. Post-release samples are staged coordinates, not physics validation.',
    'captures': []
}
try:
    deadline = monotonic() + 20
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
        raise TimeoutError('Jam Stage server did not become ready')
    with sync_playwright() as pwt:
        browser = pwt.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-dev-shm-usage'])
        page = browser.new_page(viewport={'width': 900, 'height': 700}, device_scale_factor=1)
        errors = []
        page.on('pageerror', lambda exc: errors.append(str(exc)))
        page.add_init_script('window.requestAnimationFrame=()=>0')
        page.goto(URL, wait_until='networkidle', timeout=120000)
        page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=120000)
        page.evaluate("window.jamverse.start('scoria-rams','blackthorn-court-kings',180,4)")
        page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='krios')")
        page.evaluate(f"""async()=>{{
          const image=new Image();image.src='{atlas}';await image.decode();window.__kriosOverheadPassAtlas=image;
          const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
          animationAssetManifest.characters.krios.directions.right['pass-overhead']={{src:'{atlas}',columns:5,rows:2,reviewed:true,mirrorSafe:true,frames:Array.from({{length:6}},(_,i)=>({{x:(i%5)*104,y:Math.floor(i/5)*96,w:104,h:96}}))}};
        }}""")
        page.evaluate("window.jamverse.start('scoria-rams','blackthorn-court-kings',180,4)")
        page.wait_for_timeout(700)
        page.evaluate("""(courtY)=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='krios');s.players=[p];p.x=100;p.y=courtY;p.z=0;p.facing=1;p.animation={clip:'pass-overhead',tick:0};p.anim='pass-overhead';p.hasBall=true;s.ball.x=p.x+9;s.ball.y=p.y;s.ball.z=1.45;s.ball.mode='carried';s.ball.ownerId='krios';s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.vx=0;s.ball.vy=0;s.ball.vz=0;s.pause=true;for(let i=0;i<120;i++)g.tick(1/60);s.pause=false}""", COURT_Y)
        stage = page.evaluate("()=>({playerIds:window.jamverse.state.players.map(p=>p.id),canvasCount:document.querySelectorAll('canvas').length,canvasRects:[...document.querySelectorAll('canvas')].map(c=>c.getBoundingClientRect().toJSON())})")
        report['stageReset'] = stage
        for zoom in [100, 120]:
            page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}', zoom)
            for facing, direction in [(1, 'right'), (-1, 'left')]:
                for frame, tick in enumerate(tick_by_frame):
                    info = page.evaluate("""async({frame,tick,facing,track,release,atlas,courtY})=>{
                      const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='krios');
                      p.x=100;p.y=courtY;p.z=0;p.facing=facing;p.animation={clip:'pass-overhead',tick};p.anim='pass-overhead';p.hasBall=tick<7;
                      if(tick<7){const h=track.height[frame],f=track.forward[frame];s.ball.x=p.x+facing*f;s.ball.y=p.y;s.ball.z=h;s.ball.mode='carried';s.ball.ownerId='krios'}
                      else{const [dx,bz]=release[String(tick)]??[track.forward[frame],track.height[frame]];s.ball.x=p.x+facing*dx;s.ball.y=p.y;s.ball.z=bz;s.ball.mode='pass';s.ball.ownerId=null}
                      s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.vx=0;s.ball.vy=0;s.ball.vz=0;g.tick(0);
                      const {selectProductionSprite}=await import('/src/render/animation-sprites.js');
                      const {animationAssetManifest}=await import('/src/content/animation-assets.js');
                      const selected=selectProductionSprite(p,{manifest:animationAssetManifest,images:new Map([[atlas,window.__kriosOverheadPassAtlas]])});
                      return{tick,frame,facing,z:p.z,ballMode:s.ball.mode,owner:s.ball.ownerId,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z},canvasArt:document.querySelector('#game').dataset.gameplayArt,selection:selected&&{src:selected.src,frame:selected.frame,flip:selected.flip,classification:selected.classification,production:selected.production}}
                    }""", {'frame': frame, 'tick': tick, 'facing': facing, 'track': track, 'release': release, 'atlas': atlas, 'courtY': COURT_Y})
                    name = f'frame{frame:02d}-tick{tick:02d}-{direction}-zoom{zoom}.png'
                    page.locator('#game').screenshot(path=str(OUT / name))
                    report['captures'].append({**info, 'zoom': zoom, 'path': str((OUT / name).relative_to(ROOT))})
        browser.close()
        if errors:
            raise RuntimeError(f'Browser errors: {errors}')
        if len(report['captures']) != 24 or any(c['canvasArt'] != 'generated-full-roster-atlases' for c in report['captures']):
            raise RuntimeError('Expected 24 production overhead-pass captures')
        bad = next((c for c in report['captures'] if c['selection'] is None or c['selection']['src'] != atlas or c['selection']['frame'] != c['frame'] or c['selection']['flip'] != (c['facing'] < 0)), None)
        if bad:
            raise RuntimeError('Production selector mismatch: ' + str(bad))
        report['captureCount'] = len(report['captures'])
        report['uncaughtBrowserErrors'] = errors
        (OUT / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
        print(json.dumps({'captures': len(report['captures']), 'ticks': tick_by_frame, 'errors': errors, 'out': str(OUT)}))
finally:
    server.terminate()
    server.wait(timeout=5)
