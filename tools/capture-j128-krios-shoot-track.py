"""Capture Krios shoot ball-track candidates through production Jam Stage."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ATTEMPT = int(environ.get('ATTEMPT', '1'))
OUT = ROOT / f'tools/generate-art/previews/j128-krios-shoot-track-candidate/attempt-{ATTEMPT:02d}/native'
OUT.mkdir(parents=True, exist_ok=True)
COURT_Y = float(environ.get('COURT_Y', '90'))
PORT = '4223'
URL = f'http://127.0.0.1:{PORT}/'
track = json.loads(environ.get('TRACK_JSON', '{"height":[1.05,1.2,1.45,1.65,1.95,2.35,2.1,1.8,1.3,1.0],"forward":[7,8,9,9,10,12,11,9,7,6]}'))
ticks = [0, 3, 6, 8, 10, 13, 14, 16, 19, 23]
frames = list(range(10))
z_by_tick = {0: 0, 3: 0, 6: .75, 8: 1.5, 10: 2.25, 13: 3.0, 14: 2.9, 16: 2.5, 19: 1.5, 23: 0}
release = json.loads(environ.get('RELEASE_JSON', '{"13":[12,2.35],"14":[14,2.7],"16":[18,3.2],"19":[26,3.4],"23":[38,2.4]}'))
durations = [3, 3, 2, 2, 3, 1, 2, 3, 4, 4]
atlas = './public/assets/animation/krios-shoot-right.webp'
server = Popen(['node', 'tools/server.mjs'], cwd=ROOT, env={**environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)
report = {
    'renderer': 'Chromium production Jam Stage canvas', 'baseUrl': URL,
    'athlete': 'krios', 'clip': 'shoot', 'candidateAtlas': atlas,
    'candidateTrack': track, 'releasePositions': release, 'courtY': COURT_Y,
    'grid': '10 authored frame starts × 2 facings × 2 zooms = 40 captures per successful attempt',
    'captureMethod': 'Temporary in-page manifest override for unregistered Krios atlas; ball placed at Krios-specific frame track until release tick13, then at reviewed free-flight sample coordinates.',
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
          const image=new Image();image.src='{atlas}';await image.decode();window.__kriosShootAtlas=image;
          const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
          animationAssetManifest.characters.krios.directions.right.shoot={{src:'{atlas}',columns:5,rows:2,reviewed:true,mirrorSafe:true,frames:Array.from({{length:10}},(_,i)=>({{x:(i%5)*80,y:Math.floor(i/5)*96,w:80,h:96}}))}};
        }}""")
        page.evaluate("window.jamverse.start('scoria-rams','blackthorn-court-kings',180,4)")
        page.wait_for_timeout(700)
        page.evaluate("(courtY)=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='krios');s.players=[p];p.x=100;p.y=courtY;p.z=0;p.facing=1;p.animation={clip:'shoot',tick:0};p.anim='shoot';p.hasBall=true;s.ball.x=p.x+7;s.ball.y=p.y;s.ball.z=1.05;s.ball.mode='carried';s.ball.ownerId='krios';s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.vx=0;s.ball.vy=0;s.ball.vz=0;s.pause=true;for(let i=0;i<120;i++)g.tick(1/60);s.pause=false}", COURT_Y)
        stage = page.evaluate("()=>({playerIds:window.jamverse.state.players.map(p=>p.id),canvasCount:document.querySelectorAll('canvas').length,canvasRects:[...document.querySelectorAll('canvas')].map(c=>c.getBoundingClientRect().toJSON())})")
        report['stageReset'] = stage
        tick_by_frame = [0, 3, 6, 8, 10, 13, 14, 16, 19, 23]
        for zoom in [100, 120]:
            page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}', zoom)
            for facing, direction in [(1, 'right'), (-1, 'left')]:
                for frame, tick in enumerate(tick_by_frame):
                    info = page.evaluate("""async({frame,tick,facing,z,track,release,atlas,courtY})=>{
                      const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='krios');
                      p.x=100;p.y=courtY;p.z=z;p.facing=facing;p.animation={clip:'shoot',tick};p.anim='shoot';p.hasBall=tick<13;
                      if(tick<13){const h=track.height[frame],f=track.forward[frame];s.ball.x=p.x+facing*f;s.ball.y=p.y;s.ball.z=p.z+h;s.ball.mode='carried';s.ball.ownerId='krios'}
                      else{const [dx,bz]=release[String(tick)]??[track.forward[frame],p.z+track.height[frame]];s.ball.x=p.x+facing*dx;s.ball.y=p.y;s.ball.z=bz;s.ball.mode='shot';s.ball.ownerId=null}
                      s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.vx=0;s.ball.vy=0;s.ball.vz=0;g.tick(0);
                      const {selectProductionSprite}=await import('/src/render/animation-sprites.js');
                      const {animationAssetManifest}=await import('/src/content/animation-assets.js');
                      const selected=selectProductionSprite(p,{manifest:animationAssetManifest,images:new Map([[atlas,window.__kriosShootAtlas]])});
                      return{tick,frame,facing,z:p.z,ballMode:s.ball.mode,owner:s.ball.ownerId,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z},canvasArt:document.querySelector('#game').dataset.gameplayArt,selection:selected&&{src:selected.src,frame:selected.frame,flip:selected.flip,classification:selected.classification,production:selected.production}}
                    }""", {'frame': frame, 'tick': tick, 'facing': facing, 'z': z_by_tick[tick], 'track': track, 'release': release, 'atlas': atlas, 'courtY': COURT_Y})
                    name = f'frame{frame:02d}-tick{tick:02d}-{direction}-zoom{zoom}.png'
                    page.locator('#game').screenshot(path=str(OUT / name))
                    report['captures'].append({**info, 'zoom': zoom, 'path': str((OUT / name).relative_to(ROOT))})
        browser.close()
        if errors:
            raise RuntimeError(f'Browser errors: {errors}')
        if len(report['captures']) != 40 or any(c['canvasArt'] != 'generated-full-roster-atlases' for c in report['captures']):
            raise RuntimeError('Expected 40 production shoot captures')
        bad = next((c for c in report['captures'] if c['selection'] is None or c['selection']['src'] != atlas or c['selection']['frame'] != c['frame'] or c['selection']['flip'] != (c['facing'] < 0)), None)
        if bad:
            raise RuntimeError('Production selector mismatch: ' + str(bad))
        report['captureCount'] = len(report['captures'])
        report['uncaughtBrowserErrors'] = errors
        (OUT / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
        print(json.dumps({'captures': len(report['captures']), 'ticks': ticks, 'errors': errors, 'out': str(OUT)}))
finally:
    server.terminate()
    server.wait(timeout=5)
