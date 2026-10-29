"""Calibrate Krios's receive hand track with an actual incoming teammate pass."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ATTEMPT = int(environ.get('ATTEMPT', '1'))
OUT = ROOT / f'tools/generate-art/previews/j128-krios-receive-track-candidate/attempt-{ATTEMPT:02d}/native'
OUT.mkdir(parents=True, exist_ok=True)
PORT = environ.get('PORT', '4231')
URL = f'http://127.0.0.1:{PORT}/'
COURT_Y = float(environ.get('COURT_Y', '90'))
TRACK = json.loads(environ.get('TRACK_JSON', '{"height":[1.1,2.0,2.1,1.2],"forward":[5,9,9,5]}'))
ATLAS = './public/assets/animation/krios-receive-right.webp'
SAMPLE_TICKS = [0, 2, 4, 5, 7]

def inject_track_export(route):
    response = route.fetch()
    body = response.text()
    if 'const athleteBallTracks=' not in body:
        raise RuntimeError('Could not instrument served athleteBallTracks source')
    route.fulfill(response=response, body=body.replace('const athleteBallTracks=', 'export const athleteBallTracks=', 1))

server = Popen(['node', 'tools/server.mjs'], cwd=ROOT, env={**environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)
report = {
    'renderer': 'Chromium production Jam Stage canvas',
    'athlete': 'krios', 'clip': 'receive', 'candidateAtlas': ATLAS, 'candidateTrack': TRACK,
    'sourceArtReview': 'tools/generate-art/krios-receive4-provenance.json',
    'simulation': 'A real Scoria Rams teammate pass starts the receive animation. Production stepMatch advances the incoming ball, catch anchor, carried ball and held state. Candidate ball track and atlas are injected in page memory only.',
    'captureMethod': 'Set the passer and Krios fixture once, then step only normal production inputs. No per-tick player or ball teleports. Capture the actual incoming pass and receive action at five receive-local ticks, both facings and camera zooms.',
    'court': 'scoria-rams vs blackthorn-court-kings', 'courtY': COURT_Y,
    'samples': SAMPLE_TICKS, 'captures': [], 'gameplayRuns': []
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

    with sync_playwright() as pwt:
        browser = pwt.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-dev-shm-usage'])
        page = browser.new_page(viewport={'width': 900, 'height': 700}, device_scale_factor=1)
        errors = []
        page.on('pageerror', lambda exc: errors.append(str(exc)))
        page.add_init_script('window.requestAnimationFrame=()=>0')
        page.route('**/src/core/animation.js', inject_track_export)
        page.goto(URL, wait_until='networkidle', timeout=120000)
        page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=120000)

        # Add candidate atlas/track before match startup so renderer loads the exact artwork.
        page.evaluate(f"""async()=>{{
          const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
          const {{athleteBallTracks}}=await import('/src/core/animation.js');
          athleteBallTracks.krios??={{}};athleteBallTracks.krios.receive={json.dumps(TRACK)};
          animationAssetManifest.characters.krios.directions.right.receive={{src:'{ATLAS}',columns:5,rows:1,reviewed:true,mirrorSafe:true,frames:Array.from({{length:4}},(_,i)=>({{x:i*104,y:0,w:104,h:96}}))}};
          const image=new Image();image.src='{ATLAS}';await image.decode();window.__kriosReceiveAtlas=image;
          window.jamverse.start('scoria-rams','blackthorn-court-kings',180,128);
        }}""")
        page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='krios')")
        for zoom in [100, 120]:
            page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}', zoom)
            for facing, direction in [(1, 'right'), (-1, 'left')]:
                # Restart between facings/zooms so the production atlas loader and event state reset.
                page.evaluate("window.jamverse.start('scoria-rams','blackthorn-court-kings',180,128)")
                page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='krios')")
                setup = page.evaluate("""({facing,courtY})=>{
                  const g=window.jamverse,s=g.state;
                  const receiver=s.players.find(p=>p.id==='krios');
                  const passer=s.players.find(p=>p.team===receiver.team&&p.id!=='krios');
                  receiver.x=100;receiver.y=courtY;receiver.z=receiver.vx=receiver.vy=receiver.vz=0;
                  receiver.facing=facing;receiver.hasBall=false;receiver.stun=0;receiver.animation={clip:'idle',tick:0};receiver.anim='idle';
                  passer.x=100-facing*24;passer.y=courtY;passer.z=passer.vx=passer.vy=passer.vz=0;
                  passer.facing=facing;passer.hasBall=true;passer.stun=0;passer.animation={clip:'idle-ball',tick:0};passer.anim='idle-ball';
                  for(const q of s.players)if(q!==receiver&&q!==passer){q.x=q.team===receiver.team?40:180;q.y=8;q.z=q.vx=q.vy=q.vz=0;q.hasBall=false;q.stun=999;q.animation={clip:'idle',tick:0};q.anim='idle';}
                  s.phase='playing';s.pause=false;s.score=[0,0];s.scorePause=0;s.possession=passer.team;s.clock=180;s.shotClock=24;
                  Object.assign(s.ball,{mode:'carried',ownerId:passer.id,targetId:null,aerialTargetId:null,lastTouch:passer.id,
                    attemptId:null,scored:false,x:passer.x+facing*5,y:passer.y,z:1.1,vx:0,vy:0,vz:0});
                  s.events=[];s.lastEvent='';
                  return{passer:passer.id,receiver:receiver.id,passerX:passer.x,receiverX:receiver.x,facing,courtY,zoom:s.cameraZoom};
                }""", {'facing': facing, 'courtY': COURT_Y})
                passer_id = setup['passer']
                receiver_id = setup['receiver']
                page.evaluate("""({passerId,receiverId})=>{const g=window.jamverse,s=g.state,inputs=s.players.map(p=>({playerId:p.id}));
                  inputs.find(x=>x.playerId===passerId).passPressed=true;g.tick(1,inputs);}""", {'passerId': passer_id, 'receiverId': receiver_id})
                receive_start = None
                for step in range(1, 80):
                    state = page.evaluate("""({passerId,receiverId})=>{const g=window.jamverse,s=g.state,inputs=s.players.map(p=>({playerId:p.id}));
                      g.tick(1,inputs);const r=s.players.find(p=>p.id===receiverId);return{tick:r.animation.tick,clip:r.animation.clip,hasBall:r.hasBall,
                        ball:{mode:s.ball.mode,owner:s.ball.ownerId,target:s.ball.targetId,lastTouch:s.ball.lastTouch,x:s.ball.x,y:s.ball.y,z:s.ball.z},events:s.events};}""", {'passerId': passer_id, 'receiverId': receiver_id})
                    if state['clip'] == 'receive':
                        receive_start = step
                        break
                if receive_start is None:
                    report['gameplayRuns'].append({'facing': facing, 'zoom': zoom, 'setup': setup, 'error': 'Krios never entered receive clip'})
                    continue
                for tick in SAMPLE_TICKS:
                    while True:
                        info = page.evaluate("""async({receiverId,atlas})=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id===receiverId);
                          const {selectProductionSprite}=await import('/src/render/animation-sprites.js');
                          const {animationAssetManifest}=await import('/src/content/animation-assets.js');
                          const selected=selectProductionSprite(p,{manifest:animationAssetManifest,images:new Map([[atlas,window.__kriosReceiveAtlas]])});
                          return{tick:p.animation.tick,clip:p.animation.clip,player:{x:p.x,y:p.y,z:p.z,facing:p.facing,hasBall:p.hasBall},
                            ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z,mode:s.ball.mode,owner:s.ball.ownerId,target:s.ball.targetId,lastTouch:s.ball.lastTouch},
                            selected:selected?{frame:selected.frame,flip:selected.flip,src:selected.src}:null,
                            events:s.events,paused:s.pause,phase:s.phase,canvasArt:document.querySelector('#game').dataset.gameplayArt};}""", {'receiverId': receiver_id, 'atlas': ATLAS})
                        if info['clip'] != 'receive':
                            break
                        if info['tick'] == tick:
                            break
                        if info['tick'] > tick:
                            break
                        inputs = page.evaluate("""()=>window.jamverse.state.players.map(p=>({playerId:p.id}))""")
                        page.evaluate("""inputs=>window.jamverse.tick(1,inputs)""", inputs)
                    if info['clip'] != 'receive' or info['tick'] != tick:
                        continue
                    name = f'actual-{direction}-receive-tick{tick:02d}-zoom{zoom}.png'
                    path = OUT / name
                    page.locator('#game').screenshot(path=str(path))
                    report['captures'].append({**info, 'facing': facing, 'zoom': zoom,
                        'path': path.relative_to(ROOT).as_posix(), 'setup': setup})
                # Advance continuously through catch and the receive clip; no state teleports.
                while True:
                    status = page.evaluate("""receiverId=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id===receiverId);
                      return{clip:p.animation.clip,tick:p.animation.tick,hasBall:p.hasBall,ballMode:s.ball.mode,owner:s.ball.ownerId,
                        target:s.ball.targetId,events:s.events};}""", receiver_id)
                    if status['hasBall'] and status['owner'] == receiver_id and status['tick'] >= 4:
                        break
                    if status['clip'] != 'receive':
                        break
                    inputs = page.evaluate("""()=>window.jamverse.state.players.map(p=>({playerId:p.id}))""")
                    page.evaluate("""inputs=>window.jamverse.tick(1,inputs)""", inputs)
                report['gameplayRuns'].append({'facing': facing, 'zoom': zoom, 'setup': setup, 'receiveStartStep': receive_start,
                    'finalState': status, 'browserErrors': errors})
        browser.close()
        if errors:
            raise RuntimeError(f'Browser errors: {errors}')
        report['captureCount'] = len(report['captures'])
        report['uncaughtBrowserErrors'] = errors
        bad = [c for c in report['captures'] if c['clip'] != 'receive' or c['selected'] is None or c['selected']['src'] != ATLAS or c['selected']['flip'] != (c['facing'] < 0) or c['paused'] or c['phase'] != 'playing']
        if bad:
            raise RuntimeError('Selector/facing/paused capture mismatch: ' + json.dumps(bad[:5]))
        for run in report['gameplayRuns']:
            if not (run['finalState']['hasBall'] and run['finalState']['owner'] == 'krios' and
                    any(event['text'] == 'Krios catches it' and event['tick'] == run['receiveStartStep'] + 4 for event in run['finalState']['events'])):
                raise RuntimeError('Krios did not gain ownership at receive frame 2/tick 4: ' + json.dumps(run))
        (OUT / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
        print(json.dumps({'attempt': ATTEMPT, 'captures': report['captureCount'], 'track': TRACK,
            'gameplayRuns': len(report['gameplayRuns']), 'errors': errors, 'output': str(OUT)}))
finally:
    server.terminate()
    server.wait(timeout=5)
