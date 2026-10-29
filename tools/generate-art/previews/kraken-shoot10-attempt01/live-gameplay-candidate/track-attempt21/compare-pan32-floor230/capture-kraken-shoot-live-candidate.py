"""Review an unregistered Kraken J.07 shoot track inside live Jam Stage.

All changes are in-memory browser route overlays. The candidate track feeds the
normal sampleBallHeight/sampleBallForward functions through a temporary module
overlay; after tick 13 the actual production shot physics runs uninterrupted.
"""
from pathlib import Path
from hashlib import sha256
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT = Path('/workspace/captain-animation')
ATTEMPT = int(environ.get('ATTEMPT', '1'))
OUT = ROOT / 'tools/generate-art/previews/kraken-shoot10-attempt01/live-gameplay-candidate/track-attempt21/compare-pan32-floor230/kraken'
OUT.mkdir(parents=True, exist_ok=True)
PORT = environ.get('PORT', '4524')
URL = f'http://127.0.0.1:{PORT}/'
COURT_Y = float(environ.get('COURT_Y','90'))
PLAYER_X_RIGHT = float(environ.get('PLAYER_X_RIGHT','135'))
PLAYER_X_LEFT = float(environ.get('PLAYER_X_LEFT','65'))
ATLAS = './tools/generate-art/previews/kraken-shoot10-attempt01/kraken-shoot10-attempt01-runtime-candidate.png'
TRACK = json.loads(environ.get('TRACK_JSON', json.dumps({
    'height': [1.1, 0.95, 1.25, 1.6, 2.0, 2.25, 2.15, 1.9, 1.15, 1.05],
    'forward': [4, 5, 4, 3, 1, 4, 5.5, 4.5, 5, 5],
})))
FRAME_TICKS = [0, 3, 6, 8, 10, 13, 14, 16, 19, 23]
RELEASE_TICK = 13
RENDER_TICKS = [14, 16, 19, 23]
REPORT = {
    'renderer': 'Chromium production Jam Stage canvas',
    'simulation': 'window.jamverse.tick -> src/core/simulation.js; no state writes after release',
    'athlete': 'kraken', 'clip': 'shoot', 'attempt': ATTEMPT,
    'candidateAtlas': ATLAS, 'candidateAtlasInjected': True,
    'candidateTrack': TRACK, 'court': 'current Jam Stage court', 'courtY': COURT_Y,
    'canonicalFrameStartTicks': FRAME_TICKS,
    'releaseTick': RELEASE_TICK, 'zoomLevels': [100, 120], 'facings': [],
}

def save_capture(page, basename, record):
    destination = OUT / basename
    page.locator('#game').screenshot(path=str(destination))
    if not destination.is_file() or destination.stat().st_size == 0:
        raise RuntimeError(f'capture output missing/empty: {destination}')
    return {**record, 'path': basename, 'screenshotSha256': sha256(destination.read_bytes()).hexdigest()}

server = Popen(['node', 'tools/server.mjs'], cwd=ROOT,
               env={**environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)
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
        browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium',
                                     args=['--no-sandbox', '--disable-dev-shm-usage'])
        for zoom in (100, 120):
            for facing, label in ((1, 'right'), (-1, 'left')):
                page = browser.new_page(viewport={'width': 900, 'height': 700}, device_scale_factor=1)
                errors = []
                failed_requests = []
                page.on('pageerror', lambda exc: errors.append(str(exc)))
                page.on('requestfailed', lambda req: failed_requests.append({'url': req.url, 'failure': req.failure}))

                def add_candidate_manifest(route):
                    response = route.fetch()
                    body = response.text()
                    marker = 'export const animationAssetManifest = '
                    if marker not in body:
                        raise RuntimeError('animation manifest export marker missing')
                    addition = f"""
animationAssetManifest.characters.kraken.directions.right.shoot={{
  src:{json.dumps(ATLAS)}, columns:5, rows:2, reviewed:true, mirrorSafe:true,
  frames:Array.from({{length:10}},(_,i)=>({{x:(i%5)*80,y:Math.floor(i/5)*96,w:80,h:96}}))
}};
"""
                    route.fulfill(response=response, body=body + addition)

                def add_candidate_track(route):
                    response = route.fetch()
                    body = response.text()
                    route.fulfill(response=response, body=body + '\nathleteBallTracks.kraken={shoot:' + json.dumps(TRACK) + '};\n')

                def pan_stage_geometry(route):
                    response=route.fetch()
                    body=response.text()
                    floor_before='const floorHeight=height*(JAM_STAGE.floorHeight/JAM_STAGE.viewportHeight);'; floor_after='const floorHeight=height*((JAM_STAGE.floorHeight-30*Math.min(1,Math.max(0,(Number(zoom)||100)-100)/20))/JAM_STAGE.viewportHeight);'
                    pan_before='const py=groundY-(Number(z)||0)*JAM_STAGE.actorElevationPixelsPerWorld*zoomFactor;'; pan_after='const py=groundY-(Number(z)||0)*JAM_STAGE.actorElevationPixelsPerWorld*zoomFactor+32*Math.min(1,Math.max(0,(Number(zoom)||100)-100)/20);'
                    if floor_before not in body: raise RuntimeError('projectJamStagePoint floor formula missing')
                    body=body.replace(floor_before,floor_after,1)
                    if pan_before not in body: raise RuntimeError('projectJamStagePoint Y formula missing')
                    route.fulfill(response=response,body=body.replace(pan_before,pan_after,1))

                def expose_image_map(route):
                    response = route.fetch()
                    route.fulfill(response=response, body=response.text() + '\nwindow.__productionSpriteImagesForReview=productionSpriteImages;window.__cameraReview=()=>({camX,stagePreview,stageViewDirection,cameraZoom,canvas:[canvas.width,canvas.height]});window.__setCameraReview=x=>{camX=x};\n')

                page.route('**/src/content/animation-assets.js', add_candidate_manifest)
                page.route('**/src/core/animation.js', add_candidate_track)
                page.route('**/src/render/jam-stage.js', pan_stage_geometry)
                page.route('**/src/main.js', expose_image_map)
                page.add_init_script('window.requestAnimationFrame=()=>0')
                page.goto(URL, wait_until='networkidle', timeout=120000)
                page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=120000)
                page.evaluate("""({facing})=>window.jamverse.start(
                  facing>0?'vesper-harbor-undertow':'scoria-rams',
                  facing>0?'scoria-rams':'vesper-harbor-undertow',180,119)""", {'facing':facing})
                page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='kraken')", timeout=30000)
                page.evaluate("""async({atlas,zoom})=>{
                  const image=new Image();image.src=atlas;await image.decode();
                  window.__krakenCandidateAtlas=image;
                  window.__productionSpriteImagesForReview.set(atlas,image);
                  window.__krakenCandidateManifest=(await import('/src/content/animation-assets.js')).animationAssetManifest;
                  window.__krakenCandidateSelector=(await import('/src/render/animation-sprites.js')).selectProductionSprite;
                  document.querySelector('#camera-zoom').value=String(zoom);
                  document.querySelector('#camera-zoom').dispatchEvent(new Event('input',{bubbles:true}));
                }""", {'atlas': ATLAS, 'zoom': zoom})

                setup = page.evaluate("""({facing,courtY,rightX,leftX})=>{
                  const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='kraken');
                  s.players=[p];s.practice=true;s.clock=9999;s.shotClock=24;s.pause=false;s.scorePause=0;s.phase='playing';
                  // Mirror the court side and source position with facing so a real
                  // game shot travels toward the assigned hoop instead of crossing
                  // the on-court P1 marker from the reverse side.
                  p.x=facing>0?rightX:leftX;p.y=courtY;p.z=p.vz=p.vx=p.vy=0;p.facing=facing;p.hasBall=true;p.charge=0;p.stun=0;
                  p.animation={clip:'idle-ball',tick:0};p.anim='idle-ball';s.possession=p.team;
                  Object.assign(s.ball,{mode:'carried',ownerId:p.id,lastTouch:p.id,targetId:null,aerialTargetId:null,attemptId:null,
                    x:p.x+facing*4,y:p.y,z:1.1,vx:0,vy:0,vz:0,scored:false});
                  return {player:p.id,team:p.team,x:p.x,y:p.y,facing,players:s.players.length,ballOwner:s.ball.ownerId};
                }""", {'facing': facing, 'courtY': COURT_Y,'rightX':PLAYER_X_RIGHT,'leftX':PLAYER_X_LEFT})

                # Seed the stage camera at the steady shot-approach focus. The harness
                # sets the shooter directly into a shot-ready position; this represents
                # the normal camera state after following that carried ball there.
                basket_x=200*(1-5.25/94) if facing>0 else 200*(5.25/94)
                carried_ball_x=setup['x']+facing*4
                approach=max(0,min(1,(70-abs(basket_x-carried_ball_x))/(70-30)))
                camera_focus=carried_ball_x+(basket_x-facing*17-carried_ball_x)*approach
                page.evaluate('x=>window.__setCameraReview(x)',camera_focus)
                setup['cameraSeedFocusX']=camera_focus

                # Fire the actual game action, then record every authored frame start.
                page.evaluate("""()=>window.jamverse.tick(1,window.jamverse.state.players.map(p=>({playerId:p.id,x:0,y:0,shootPressed:p.id==='kraken'})))""")
                initial = page.evaluate("""()=>{const g=window.jamverse,s=g.state,p=s.players[0];return {clip:p.animation.clip,tick:p.animation.tick,action:p.animation.action?.kind,hasBall:p.hasBall,ballMode:s.ball.mode}}""")
                captures = []
                observed = set()
                released = None
                trajectory = []
                score_capture = None
                terminal_miss = None
                # The first authored pose is tick 0, immediately after the real
                # shoot input queues the action and before the next simulation step.
                first = page.evaluate("""async()=>{const p=window.jamverse.state.players[0];
                  const selected=window.__krakenCandidateSelector(p,{manifest:window.__krakenCandidateManifest,images:window.__productionSpriteImagesForReview});
                  return {tick:p.animation.tick,clip:p.animation.clip,frame:selected?.frame,src:selected?.src,flip:selected?.flip};
                }""")
                if first['clip'] != 'shoot' or first['tick'] != 0 or first['frame'] != 0 or first['src'] != ATLAS:
                    raise RuntimeError('initial tick-0 selector mismatch: '+json.dumps(first))
                first_name=f'{label}-zoom{zoom}-tick00-frame00.png'
                captures.append(save_capture(page,first_name,{'tick':0,'frame':0,'state':first,'captureClass':'authored-frame-start'}))
                observed.add(0)
                max_steps = 200
                for step in range(max_steps):
                    state_before = page.evaluate("""({track})=>{
                      const g=window.jamverse,s=g.state,p=s.players[0];
                      // advanceAnimations runs before actions in stepMatch. Feed the next canonical sample
                      // while the ball is still carried so makeShot reads this athlete-specific track.
                      if(p.animation.clip==='shoot'&&p.hasBall&&s.ball.mode==='carried'){
                        const t=p.animation.tick+1;
                        let i=0;for(let n=0;n<10;n++)if([0,3,6,8,10,13,14,16,19,23][n]<=t)i=n;
                        const next=Math.min(9,i+1),start=[0,3,6,8,10,13,14,16,19,23][i];
                        const duration=[3,3,2,2,3,1,2,3,4,4][i];
                        const q=Math.max(0,Math.min(1,(t-start)/duration));
                        const h=track.height[i]+(track.height[next]-track.height[i])*q;
                        const f=track.forward[i]+(track.forward[next]-track.forward[i])*q;
                        s.ball.x=p.x+p.facing*f;s.ball.y=p.y;s.ball.z=p.z+h;s.ball.mode='carried';s.ball.ownerId=p.id;
                      }
                      return {clip:p.animation.clip,tick:p.animation.tick,action:p.animation.action?.kind,ball:s.ball.mode};
                    }""", {'track': TRACK})
                    page.evaluate("""()=>window.jamverse.tick(1,window.jamverse.state.players.map(p=>({playerId:p.id,x:0,y:0})))""")
                    state = page.evaluate("""async()=>{
                      const g=window.jamverse,s=g.state,p=s.players[0],b=s.ball;
                      const selected=window.__krakenCandidateSelector(p,{manifest:window.__krakenCandidateManifest,images:window.__productionSpriteImagesForReview});
                      return {tick:p.animation.tick,clip:p.animation.clip,frame:selected?.frame,src:selected?.src,flip:selected?.flip,
                        elevation:p.z,action:p.animation.action?.kind,hasBall:p.hasBall,
                        ball:{mode:b.mode,ownerId:b.ownerId,lastTouch:b.lastTouch,attemptId:b.attemptId,x:b.x,y:b.y,z:b.z,vx:b.vx,vy:b.vy,vz:b.vz,made:b.made},
                        score:[...s.score],scoredAttempts:[...(s.scoredAttempts??[])],scorePause:s.scorePause,phase:s.phase,camera:window.__cameraReview()};
                    }""")
                    if state['ball']['mode'] == 'shot' and released is None:
                        released = state.copy()
                    if state['clip'] == 'shoot' and state['tick'] in FRAME_TICKS and state['tick'] not in observed:
                        expected = FRAME_TICKS.index(state['tick'])
                        if state['frame'] != expected or state['src'] != ATLAS or state['flip'] != (facing < 0):
                            raise RuntimeError(f"selector mismatch at tick {state['tick']}: {state}")
                        name = f'{label}-zoom{zoom}-tick{state["tick"]:02d}-frame{expected:02d}.png'
                        captures.append(save_capture(page,name,{'tick':state['tick'],'frame':expected,'state':state,'captureClass':'authored-frame-start'}))
                        observed.add(state['tick'])
                    if state['ball']['mode'] in ('shot','dead') or released is not None:
                        if released is not None:
                            trajectory.append(state)
                            if state['tick'] in RENDER_TICKS:
                                sample_index=len(trajectory)-1
                                name=f'{label}-zoom{zoom}-flight-sample{sample_index:03d}-tick{state["tick"]:02d}-{state["clip"]}-frame{state["frame"]:02d}.png'
                                captures.append(save_capture(page,name,{'tick':state['tick'],'frame':state['frame'],'state':state,'flight':True,'captureClass':'continuous-flight-sample','simulationSampleIndex':sample_index}))
                            if state['scoredAttempts'] and score_capture is None:
                                name=f'{label}-zoom{zoom}-score-complete.png'
                                score_capture=save_capture(page,name,{'state':state,'captureClass':'score-complete'})
                                break
                            if state['ball']['mode']=='dead' and not state['scoredAttempts']:
                                terminal_miss=state
                                break
                if errors:
                    raise RuntimeError('browser errors: '+json.dumps(errors))
                if observed != set(FRAME_TICKS):
                    raise RuntimeError(f'missing authored frame starts: expected {FRAME_TICKS}, observed {sorted(observed)}; final={state}')
                if released is None:
                    raise RuntimeError('actual simulation never released the shot; last state '+json.dumps(state))
                if released['tick'] != RELEASE_TICK or released['clip'] != 'shoot' or released['ball']['ownerId'] is not None or released['ball']['lastTouch'] != 'kraken':
                    raise RuntimeError('release invariant failed: '+json.dumps(released))
                row = {'facing':label,'facingSign':facing,'zoom':zoom,'initialAction':initial,'setup':setup,
                       'captures':captures,'observedFrameTicks':sorted(observed),'release':released,
                       'flightSamples':trajectory,'scoreCompleteCapture':score_capture,'terminalMiss':terminal_miss,
                       'uncaughtBrowserErrors':errors,'failedRequests':failed_requests}
                REPORT['facings'].append(row)
                page.close()
        browser.close()
    all_captures=[capture for run in REPORT['facings'] for capture in run['captures']]
    all_captures.extend(run['scoreCompleteCapture'] for run in REPORT['facings'] if run['scoreCompleteCapture'])
    paths=[capture['path'] for capture in all_captures]
    if len(paths)!=len(set(paths)):
        duplicates=sorted(path for path in set(paths) if paths.count(path)>1)
        raise RuntimeError('screenshot path collision(s): '+json.dumps(duplicates))
    integrity=[]
    for run in REPORT['facings']:
        for capture in run['captures']+[run['scoreCompleteCapture']]:
            if not capture:
                continue
            path=OUT/capture['path']
            if not path.is_file() or sha256(path.read_bytes()).hexdigest()!=capture['screenshotSha256']:
                raise RuntimeError('capture file/hash verification failed: '+str(path))
            integrity.append({'path':capture['path'],'exists':True,'sha256Matches':True,
                              'recordedClip':capture['state'].get('clip'),
                              'recordedTick':capture['state'].get('tick'),
                              'recordedFrame':capture['state'].get('frame'),
                              'captureClass':capture['captureClass']})
    REPORT['captureCount'] = len(all_captures)
    REPORT['captureIntegrity']={'uniquePathCount':len(set(paths)),'entries':integrity}
    (OUT/'report.json').write_text(json.dumps(REPORT,indent=2)+'\n')
    print(json.dumps({'output':str(OUT),'captures':REPORT['captureCount'],'runs':len(REPORT['facings']),
                      'releases':[r['release'] for r in REPORT['facings']]}))
finally:
    server.terminate()
    server.wait(timeout=5)
