"""Capture Kraken's unregistered pass atlas/track in the current Jam Stage.

The candidate atlas and athlete-specific track are temporary browser-response
overrides only. No production manifest, runtime file, or asset is written.
"""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
from hashlib import sha256
import json

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ATTEMPT = int(environ.get('ATTEMPT', '1'))
OUT = ROOT / f'tools/generate-art/previews/kraken-pass6-track-candidate/attempt-{ATTEMPT:02d}/native'
OUT.mkdir(parents=True, exist_ok=True)
PORT = environ.get('PORT', '4287')
URL = f'http://127.0.0.1:{PORT}/'
COURT_Y = float(environ.get('COURT_Y', '50'))
ATLAS = './tools/generate-art/previews/kraken-pass6-attempt02/kraken-pass6-attempt02-runtime-candidate.png'
TRACK = json.loads(environ.get('TRACK_JSON', '{"height":[1.05,1.15,1.4,1.5,1.35,1.05],"forward":[8,9,11,13,12,8]}'))
FRAME_TICKS = [0, 2, 4, 5, 6, 8]
POST_RELEASE_TICKS = [11, 14, 18, 22, 26]
SAMPLE_TICKS = FRAME_TICKS + POST_RELEASE_TICKS
SEED = int(environ.get('SEED', '707'))
RECEIVER_FACING = environ.get('RECEIVER_FACING', 'toward-pass')
RECEIVER_TRACK = json.loads(environ.get('RECEIVER_TRACK_JSON', '{"receive":{"height":[1.3,1.35,1.2,1.45],"forward":[4,4,2,1]},"idle-ball":{"height":[1.45,1.45,1.45,1.45],"forward":[1,1,1,1]}}'))
HOME = 'vesper-harbor-undertow'
AWAY = 'scoria-rams'
if RECEIVER_FACING not in ('toward-pass', 'attack'):
    raise ValueError("RECEIVER_FACING must be 'toward-pass' or 'attack'")

if len(TRACK.get('height', [])) != 6 or len(TRACK.get('forward', [])) != 6:
    raise ValueError('TRACK_JSON must contain six height and six forward offsets')

report = {
    'renderer': 'Chromium current Jam Stage production canvas',
    'athlete': 'kraken', 'clip': 'pass', 'attempt': ATTEMPT,
    'atlas': ATLAS, 'atlasSha256': sha256((ROOT / ATLAS[2:]).read_bytes()).hexdigest(),
    'atlasLayout': {'columns': 3, 'rows': 2, 'cellWidth': 80, 'cellHeight': 96, 'frames': 6},
    'candidateTrack': TRACK, 'runtimeIntegration': False,
    'receiverFacingPolicy': RECEIVER_FACING,
    'candidateReceiverTrack': RECEIVER_TRACK,
    'candidateReceiverTrackInjected': True,
    'candidateReceiverTrackTarget': 'marin-dusk receive + idle-ball in page-response override only',
    'productionManifestModified': False, 'productionRuntimeModified': False,
    'productionAthleteTrackModified': False, 'productionSourceArtModified': False,
    'productionRegistryModified': False, 'runtimeIntegration': False,
    'candidateAtlasInjected': True, 'candidateBallTrackInjected': True,
    'overrideScope': 'Temporary in-page response overrides; production files and registries are not modified.',
    'court': {'home': HOME, 'away': AWAY, 'name': 'Vesper Harbor Undertow vs Scoria Rams', 'courtY': COURT_Y},
    'seed': SEED, 'releaseFrame': 3, 'releaseTick': 5,
    'frameStartTicks': FRAME_TICKS, 'postReleaseFlightTicks': POST_RELEASE_TICKS,
    'expectedScore': [0, 0], 'runs': [], 'uncaughtBrowserErrors': [],
}

server = Popen(['node', 'tools/server.mjs'], cwd=ROOT,
               env={**environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)
try:
    deadline = monotonic() + 30
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
        browser = pwt.chromium.launch(headless=True, executable_path='/usr/bin/chromium',
                                      args=['--no-sandbox', '--disable-dev-shm-usage'])
        for zoom in (100, 120):
            for facing, direction in ((1, 'right'), (-1, 'left')):
                page = browser.new_page(viewport={'width': 900, 'height': 700}, device_scale_factor=1)
                errors = []
                page.on('pageerror', lambda exc: errors.append(str(exc)))

                def override_manifest(route):
                    response = route.fetch()
                    addition = f"""
animationAssetManifest.characters.kraken.directions.right.pass={{
  src:{json.dumps(ATLAS)}, columns:3, rows:2, reviewed:true,
  frames:Array.from({{length:6}},(_,i)=>({{x:(i%3)*80,y:Math.floor(i/3)*96,w:80,h:96}}))
}};
animationAssetManifest.characters.kraken.mirrorSafe=true;
animationAssetManifest.characters.kraken.mirrorReview={{status:'reviewed'}};
"""
                    route.fulfill(response=response, body=response.text() + '\n' + addition)

                def override_track(route):
                    response = route.fetch()
                    addition = (f"\nathleteBallTracks.kraken.pass={json.dumps(TRACK,separators=(',',':'))};\n"
                                f"athleteBallTracks['marin-dusk']={json.dumps(RECEIVER_TRACK,separators=(',',':'))};\n")
                    route.fulfill(response=response, body=response.text() + addition)

                def expose_images(route):
                    response = route.fetch()
                    route.fulfill(response=response, body=response.text() +
                                  '\nwindow.__productionSpriteImagesForReview=productionSpriteImages;\n')

                page.route('**/src/content/animation-assets.js', override_manifest)
                page.route('**/src/core/animation.js', override_track)
                page.route('**/src/main.js', expose_images)
                page.add_init_script('window.requestAnimationFrame=()=>0')
                page.goto(URL, wait_until='networkidle', timeout=120000)
                page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=120000)
                home, away = (HOME, AWAY) if facing > 0 else (AWAY, HOME)

                page.evaluate("""async ({home,away,zoom,atlas,track,facing,courtY,seed,receiverFacing})=>{
                  const g=window.jamverse;
                  g.start(home,away,180,seed);
                  const s=g.state,k=s.players.find(p=>p.id==='kraken');
                  const mate=s.players.find(p=>p.team===k.team&&p.id!==k.id);
                  if(!k||!mate)throw Error('Kraken/teammate missing from Vesper Harbor roster');
                  s.players=[k,mate];
                  for(const p of s.players){p.hasBall=false;p.stun=0;p.charge=0;p.action=null;p.animation={clip:'idle',tick:0};p.anim='idle';p.z=p.vz=p.vx=p.vy=0;p.facing=facing;}
                  k.x=100;k.y=courtY;k.facing=facing;k.hasBall=true;k.animation={clip:'idle-ball',tick:0};k.anim='idle-ball';
                  mate.x=100+facing*26;mate.y=courtY;mate.facing=receiverFacing==='attack'?facing:facing*-1;
                  s.phase='playing';s.possession=k.team;s.pause=false;s.score=[0,0];s.clock=180;s.shotClock=24;s.rng=seed;
                  Object.assign(s.ball,{mode:'carried',ownerId:k.id,lastTouch:k.id,targetId:null,aerialTargetId:null,attemptId:null,scored:false,x:k.x+facing*track.forward[0],y:k.y,z:track.height[0],vx:0,vy:0,vz:0});
                  const image=new Image();image.src=atlas;await image.decode();
                  window.__krakenPass={k,mate,atlas,track,image,manifest:(await import('/src/content/animation-assets.js')).animationAssetManifest};
                  window.__productionSpriteImagesForReview.set(atlas,image);
                  document.querySelector('#camera-zoom').value=String(zoom);
                  document.querySelector('#camera-zoom').dispatchEvent(new Event('input',{bubbles:true}));
                  g.tick(0,[]);
                  const inputs=s.players.map(p=>({playerId:p.id,x:0,y:0}));
                  g.tick(1,inputs.map(v=>v.playerId===k.id?{...v,passPressed:true,passVariant:'pass'}:v));
                  if(k.animation.clip!=='pass'||k.animation.tick!==0||k.animation.action?.kind!=='pass')
                    throw Error('Expected actual Kraken chest-pass action at tick0');
                  window.__krakenPass.nowTick=0;
                }""", {'home':home,'away':away,'zoom':zoom,'atlas':ATLAS,'track':TRACK,
                      'facing':facing,'courtY':COURT_Y,'seed':SEED,'receiverFacing':RECEIVER_FACING})

                run = {'facing': facing, 'direction': direction, 'zoom': zoom, 'captures': []}
                for tick in SAMPLE_TICKS:
                    info = page.evaluate("""async ({targetTick,frameTicks,atlas,facing})=>{
                      const g=window.jamverse,s=g.state,c=window.__krakenPass,k=c.k,mate=c.mate;
                      const inputs=s.players.map(p=>({playerId:p.id,x:0,y:0}));
                      while(c.nowTick<targetTick){g.tick(1,inputs);c.nowTick++;}
                      const {selectProductionSprite}=await import('/src/render/animation-sprites.js');
                      const {sampleAnimation,sampleBallHeight,sampleBallForward}=await import('/src/core/animation.js');
                      const selected=selectProductionSprite(k,{manifest:c.manifest,images:window.__productionSpriteImagesForReview});
                      const isFrameSample=frameTicks.includes(targetTick);
                      const trackPoint=isFrameSample?{height:sampleBallHeight('pass',targetTick,'kraken'),forward:sampleBallForward('pass',targetTick,'kraken')}:null;
                      const carried=k.hasBall&&s.ball.ownerId===k.id;
                      const frame=carried?sampleAnimation('pass',targetTick).frame:null;
                      const receiverTrackPoint=mate.hasBall?{clip:mate.animation.clip,tick:mate.animation.tick,
                        height:sampleBallHeight(mate.animation.clip,mate.animation.tick,mate.id),
                        forward:sampleBallForward(mate.animation.clip,mate.animation.tick,mate.id),
                        ballTrackSource: (await import('/src/core/animation.js')).athleteBallTrackSource(mate.id,mate.animation.clip,'height')}:null;
                      const receiverAttachmentDelta=receiverTrackPoint?{
                        x:s.ball.x-(mate.x+mate.facing*receiverTrackPoint.forward),
                        z:s.ball.z-receiverTrackPoint.height}:null;
                      return {tick:targetTick,clip:k.animation.clip,clipTick:k.animation.clip==='pass'?k.animation.tick:null,
                        sampleKind:isFrameSample?'authored-frame-start':'post-release-flight',
                        selection:{source:selected?.src??null,frame:selected?.frame??null,flip:selected?.flip??null,
                          expectedSource:isFrameSample?atlas:null,expectedFrame:isFrameSample?sampleAnimation('pass',targetTick).frame:null},
                        trackPoint,carriedDelta:carried?{x:s.ball.x-(k.x+facing*trackPoint.forward),z:s.ball.z-trackPoint.height}:null,
                        ball:{mode:s.ball.mode,owner:s.ball.ownerId,target:s.ball.targetId,x:s.ball.x,y:s.ball.y,z:s.ball.z,
                          vx:s.ball.vx,vy:s.ball.vy,vz:s.ball.vz,lastTouch:s.ball.lastTouch},
                        passer:{id:k.id,x:k.x,y:k.y,hasBall:k.hasBall,action:k.animation.action?{kind:k.animation.action.kind,released:k.animation.action.released}:null},
                        receiver:{id:mate.id,x:mate.x,y:mate.y,facing:mate.facing,hasBall:mate.hasBall,clip:mate.animation.clip,tick:mate.animation.tick},
                        receiverTrackPoint,receiverAttachmentDelta,
                        score:s.score,clock:s.clock,events:s.events.slice(-3),atlas};
                    }""", {'targetTick':tick,'frameTicks':FRAME_TICKS,'atlas':ATLAS,'facing':facing})
                    info['sampleKind']='authored-frame-start' if tick in FRAME_TICKS else 'post-release-flight'
                    info['path']=(OUT/f'frame-{tick:02d}-{direction}-zoom{zoom}.png').relative_to(ROOT).as_posix()
                    page.locator('#game').screenshot(path=str(OUT/f'frame-{tick:02d}-{direction}-zoom{zoom}.png'))
                    run['captures'].append(info)

                if errors:
                    report['uncaughtBrowserErrors'].extend(errors)
                    raise RuntimeError('Browser errors: ' + json.dumps(errors))
                report['runs'].append(run)
                page.close()
        browser.close()

    report['captureCount']=sum(len(run['captures']) for run in report['runs'])
    report['expectedCaptureCount']=len(SAMPLE_TICKS)*4
    if report['captureCount'] != report['expectedCaptureCount']:
        raise RuntimeError(f"Expected {report['expectedCaptureCount']} captures, got {report['captureCount']}")
    bad=[]
    for run in report['runs']:
        final_capture=run['captures'][-1]
        if not final_capture['receiver']['hasBall']:
            raise RuntimeError(f"Expected target teammate to catch the pass by tick {POST_RELEASE_TICKS[-1]}: {json.dumps(final_capture)}")
        for capture in run['captures']:
            selection=capture['selection']
            if capture['tick'] in FRAME_TICKS and (
                selection['source'] != ATLAS or selection['frame'] != selection['expectedFrame'] or
                selection['flip'] != (run['facing'] < 0)
            ):
                bad.append(capture)
    if bad:
        raise RuntimeError('Production selector mismatch: '+json.dumps(bad[0]))
    for run in report['runs']:
        for capture in run['captures']:
            tick=capture['tick']; ball=capture['ball']; passer=capture['passer']
            if capture['score'] != [0,0]:
                raise RuntimeError(f"Chest pass unexpectedly changed score at tick {tick}: {capture['score']}")
            if tick < 5 and (ball['mode'] != 'carried' or ball['owner'] != 'kraken' or not passer['hasBall']):
                raise RuntimeError(f"Kraken lost carried-ball contact before tick5: {json.dumps(capture)}")
            if tick == 5 and (ball['mode'] != 'pass' or ball['owner'] is not None or ball['lastTouch'] != 'kraken'):
                raise RuntimeError(f"Expected separate ownerless pass release at tick5: {json.dumps(capture)}")
            if tick > 5 and passer['hasBall']:
                raise RuntimeError(f"Kraken retained possession after tick5 release: {json.dumps(capture)}")
        for tick, expected_clip in ((22, 'receive'), (26, 'idle-ball')):
            capture=next(c for c in run['captures'] if c['tick']==tick)
            if capture['ball']['mode'] != 'carried' or capture['ball']['owner'] != 'marin-dusk':
                raise RuntimeError(f"Marin should retain ownership through tick {tick}: {json.dumps(capture)}")
            if capture['receiver']['clip'] != expected_clip or not capture['receiver']['hasBall']:
                raise RuntimeError(f"Marin expected {expected_clip} possession pose at tick {tick}: {json.dumps(capture)}")
            delta=capture['receiverAttachmentDelta']
            if not delta or abs(delta['x']) > 1e-8 or abs(delta['z']) > 1e-8:
                raise RuntimeError(f"Marin ball failed to follow recipient-specific hand track at tick {tick}: {json.dumps(capture)}")
        catch_events=[event for c in run['captures'] for event in c['events']
                      if event.get('text') == 'Marin Dusk catches it']
        if not catch_events or catch_events[0].get('tick') != 21:
            raise RuntimeError(f"Receiver catch timing changed from tick21: {json.dumps(catch_events)}")
    (OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({'captures':report['captureCount'],'frameStarts':FRAME_TICKS,
                      'postReleaseFlightTicks':POST_RELEASE_TICKS,'errors':report['uncaughtBrowserErrors'],
                      'out':str(OUT)}))
finally:
    server.terminate()
    server.wait(timeout=5)
