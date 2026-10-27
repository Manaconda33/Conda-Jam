"""Capture reviewed captain actions through the production Jam Stage renderer."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'tools/generate-art/previews/leo-captain-support-integration/native'
OUT.mkdir(parents=True, exist_ok=True)
PORT = '4191'
URL = f'http://127.0.0.1:{PORT}/'
server = Popen(['node', 'tools/server.mjs'], cwd=ROOT, env={**environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)
report = {'renderer': 'Chromium production Jam Stage canvas', 'baseUrl': URL, 'athlete': 'leo', 'clipCaptures': []}

try:
    deadline = monotonic() + 20
    while monotonic() < deadline:
        if server.poll() is not None:
            raise RuntimeError('Jam Stage preview server exited before becoming ready')
        try:
            with urlopen(URL, timeout=1) as response:
                if response.status == 200:
                    break
        except Exception:
            sleep(.1)
    else:
        raise TimeoutError('Jam Stage preview server did not become ready')

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-dev-shm-usage'])
        page = browser.new_page(viewport={'width': 900, 'height': 700}, device_scale_factor=1)
        errors = []
        page.on('pageerror', lambda exc: errors.append(str(exc)))
        # Stop the live 60 Hz loop so manually selected frame ticks are not
        # replaced by idle simulation state before Playwright takes a screenshot.
        page.add_init_script('window.requestAnimationFrame = () => 0')
        page.goto(URL, wait_until='networkidle')
        page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105')
        page.evaluate("window.jamverse.start('blackthorn-court-kings','chicago-condas',180,3)")
        page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='leo')")
        # Let the production camera settle around the centered player/ball before
        # capturing. A zero-duration paint alone leaves the game-start camera at
        # the opening end of the court and can put Leo outside the screenshot.
        page.evaluate("""() => {
          const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='leo');
          s.players=[p];p.x=100;p.y=75;p.z=0;p.facing=1;p.hasBall=false;p.animation={clip:'idle',tick:0};
          Object.assign(s.ball,{x:100,y:75,z:0,mode:'dead',ownerId:null,aerialTargetId:null,vx:0,vy:0,vz:0});
          s.pause=true;
          for(let i=0;i<120;i++)g.tick(1/60);
          s.pause=false;
        }""")
        page.evaluate("""async () => {
          const {animationClips} = await import('/src/core/animation.js');
          window.__captainClipTimings = Object.fromEntries(['block','push','fall','celebrate'].map(key=>[key,animationClips[key].frames.map(x=>x.duration)]));
        }""")
        timings = page.evaluate('window.__captainClipTimings')
        captures = []
        for zoom in [100, 120]:
            page.locator('#camera-zoom').evaluate('(el,v)=>{el.value=String(v);el.dispatchEvent(new Event("input",{bubbles:true}))}', zoom)
            for clip, durations in timings.items():
                tick = 0
                for frame, duration in enumerate(durations):
                    for facing, direction in [(1, 'right'), (-1, 'left')]:
                        capture = page.evaluate('''({clip,tick,facing}) => {
                          const g=window.jamverse, state=g.state, p=state.players.find(x=>x.id==='leo');
                          state.ball.x=100;state.ball.y=75;state.ball.mode='dead';state.ball.ownerId=null;state.ball.vx=0;state.ball.vy=0;state.ball.vz=0;
                          p.x=100;p.y=75;p.facing=facing;p.animation={clip,tick};p.anim=clip;p.hasBall=false;
                          g.tick(0);
                          return {clip,tick,facing:p.facing,ballMode:state.ball.mode,owner:state.ball.ownerId,canvasArt:document.querySelector('#game').dataset.gameplayArt};
                        }''', {'clip': clip, 'tick': tick, 'facing': facing})
                        name = f'{clip}-frame{frame:02d}-{direction}-zoom{zoom}.png'
                        page.locator('#game').screenshot(path=str(OUT / name))
                        captures.append({**capture, 'frame': frame, 'zoom': zoom, 'path': str((OUT / name).relative_to(ROOT))})
                    tick += duration
        browser.close()
        if errors:
            raise RuntimeError(f'Browser errors during captain captures: {errors}')
        expected = sum(map(len, timings.values())) * 2 * 2
        if len(captures) != expected:
            raise RuntimeError(f'Expected {expected} captain frame captures; got {len(captures)}')
        if any(c['canvasArt'] != 'generated-full-roster-atlases' for c in captures):
            raise RuntimeError('The live canvas did not report the production animation renderer')
        if any(c['ballMode'] != 'dead' or c['owner'] is not None for c in captures):
            raise RuntimeError('A ball unexpectedly entered a no-ball captain clip')
        report['clipTimings'] = timings
        report['clipCaptures'] = captures
        report['captureCount'] = len(captures)
        report['uncaughtBrowserErrors'] = errors
        (OUT / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
        print(json.dumps({'captures': len(captures), 'timings': timings, 'errors': errors, 'out': str(OUT)}))
finally:
    server.terminate()
    server.wait(timeout=5)
