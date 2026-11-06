"""Capture Kraken J.07 rebound through live missed-shot and loose-ball physics."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
from hashlib import sha256
import json

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = environ.get('RUNTIME_INTEGRATION', '0') == '1'
ATLAS = './public/assets/animation/kraken-rebound-right.webp'
TRACK = {'height': [0.4, 0.2, 0.65, 0.95, 0.9], 'forward': [3, 2.5, 0, 0, 1]}
FRAME_TICKS = [0, 2, 4, 5, 7]
SEED = 14384
PORT = environ.get('PORT', '4295')
TRACK_ATTEMPT = environ.get('TRACK_ATTEMPT', '01')
URL = f'http://127.0.0.1:{PORT}/'
OUT = ROOT / 'tools/generate-art/previews/kraken-rebound-track-candidate/attempt-09/normal-loader'
OUT.mkdir(parents=True, exist_ok=True)
atlas_sha = sha256((ROOT / ATLAS[2:]).read_bytes()).hexdigest()
report = {
    'renderer': 'Chromium production Jam Stage canvas', 'athlete': 'kraken', 'clip': 'rebound',
    'atlas': ATLAS, 'atlasSha256': atlas_sha, 'productionTrack':'src/core/animation.js', 'productionManifest':'public/assets/animation/manifest.json',
    'runtimeIntegration': 'checked-in manifest and core track; production loadProductionSprites invoked directly before live simulation', 'candidateAtlasInjected': False, 'candidateTrackInjected': False,
    'court': 'current Jam Stage; Scoria Rams vs Blackthorn Court Kings', 'courtY': 90,
    'frameDurations': [2, 2, 1, 2, 4], 'grabAnchorFrame': 3, 'grabAnchorTick': 5,
    'sampledFrameTicks': FRAME_TICKS, 'seed': SEED,
    'captureMethod': 'No manifest or core route is overridden. The production loadProductionSprites function loads the registered WebP from the checked-in manifest; the actual core track is used. ' +
        'A deterministic missed three-pointer from Leo triggers the production shot, live miss, loose-ball flight, scheduled Kraken rebound, tick5 catch and carried chest recovery. The court actors and ball are positioned once before the shot; all later motion uses normal simulation ticks. No per-tick teleporting.',
    'runs': [], 'uncaughtBrowserErrors': [],
}

server = Popen(['node', 'tools/server.mjs'], cwd=ROOT, env={**environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)
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
        browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-dev-shm-usage'])
        for zoom in (100, 120):
            for facing, direction in ((1, 'right'), (-1, 'left')):
                page = browser.new_page(viewport={'width': 900, 'height': 700}, device_scale_factor=1)
                errors = []
                page.on('pageerror', lambda error: errors.append(str(error)))
                def expose_images(route):
                    response = route.fetch()
                    route.fulfill(response=response, body=response.text() + """\nwindow.__productionSpriteImagesForReview=productionSpriteImages;window.__loadProductionSpritesForReview=loadProductionSprites;window.__drawAudit=[];const __drawImageOrig=ctx.drawImage.bind(ctx);ctx.drawImage=function(image,...args){if((image?.currentSrc||image?.src||"").includes("kraken-rebound-right.webp"))window.__drawAudit.push({url:image.currentSrc||image.src,args});return __drawImageOrig(image,...args)};\n""")
                page.route('**/src/main.js', expose_images)
                page.add_init_script('window.requestAnimationFrame=()=>0')
                page.goto(URL, wait_until='networkidle', timeout=120000)
                page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=120000)
                home, away = ('vesper-harbor-undertow', 'blackthorn-court-kings')
                page.evaluate("""async ({home,away,atlas,zoom,runtime,facing})=>{
                  const {animationAssetManifest}=await import('/src/content/animation-assets.js');
                  const {sampleBallHeight,sampleBallForward,animationClips}=await import('/src/core/animation.js');
                  const {selectProductionSprite}=await import('/src/render/animation-sprites.js');
                  const entry=animationAssetManifest.characters.kraken.directions.right.rebound;
                  if(!entry||entry.src!==atlas||entry.frames?.length!==5||entry.reviewed!==true)throw Error('Kraken rebound production manifest is not reviewed');window.__reboundManifestReviewed=entry.reviewed;
                  window.__rebound={manifest:animationAssetManifest,clips:animationClips,sampleBallHeight,sampleBallForward,selectProductionSprite};
                  window.jamverse.start(home,away,180,14384);window.__loadProductionSpritesForReview(window.jamverse.state.players);
                  const s=window.jamverse.state,k=s.players.find(p=>p.id==='kraken'),l=s.players.find(p=>p.id==='leo'),d=s.players.find(p=>p.id==='sable-regent');
                  s.players=[k,l,d];const sign=facing;k.facing=sign;const kx=69,lx=110,dx=sign>0?64:136;
                  Object.assign(k,{x:kx,y:50.5,z:0,vx:0,vy:0,vz:0,facing:sign,hasBall:false,stun:0,shoot:0,animation:{clip:'idle',tick:0},anim:'idle'});
                  Object.assign(l,{x:lx,y:75,z:0,vx:0,vy:0,vz:0,facing:1,hasBall:true,s:0,shoot:0,stun:0,animation:{clip:'idle-ball',tick:0},anim:'idle-ball'});
                  Object.assign(d,{x:dx,y:75,z:0,vx:0,vy:0,vz:0,facing:sign,hasBall:false,stun:0,shoot:0,animation:{clip:'idle',tick:0},anim:'idle'});
                  s.phase='playing';s.pause=false;s.score=[0,0];s.scorePause=0;s.possession=l.team;s.clock=180;s.shotClock=24;s.rng=14384;
                  Object.assign(s.ball,{mode:'carried',ownerId:l.id,targetId:null,aerialTargetId:null,lastTouch:l.id,attemptId:null,scored:false,made:false,x:lx+l.facing*6,y:75,z:1.1,vx:0,vy:0,vz:0});
                  const input=()=>[k,l,d].map(p=>({playerId:p.id}));window.jamverse.tick(1,[...input().filter(i=>i.playerId!==l.id),{playerId:l.id,shootPressed:true}]);
                  await new Promise((resolve,reject)=>{const image=window.__productionSpriteImagesForReview.get(atlas);if(image?.complete&&image.naturalWidth)resolve();else{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',()=>reject(Error('production loader image failed')), {once:true});}});
                  document.querySelector('#camera-zoom').value=String(zoom);document.querySelector('#camera-zoom').dispatchEvent(new Event('input',{bubbles:true}));
                  window.__reboundInput={facing:sign,home,away,krakenX:kx,shooterX:lx,defenderX:dx,seed:14384};
                }""", {'home': home, 'away': away, 'atlas': ATLAS, 'zoom': zoom, 'runtime': RUNTIME, 'facing': facing})
                # RAF is disabled to keep samples deterministic; interval polling still wakes.
                page.wait_for_function('(src)=>{const image=window.__productionSpriteImagesForReview?.get(src);return Boolean(image?.complete&&image.naturalWidth)}', arg=ATLAS, timeout=120000, polling=100)
                trajectory = page.evaluate("""()=>{const g=window.jamverse,s=g.state;let launched=false,reboundStarted=false;const ballTrace=[];
                  for(let i=0;i<180;i++){const k=s.players.find(p=>p.id==='kraken'),l=s.players.find(p=>p.id==='leo'),d=s.players.find(p=>p.id==='sable-regent');
                    g.tick(1,[{playerId:k.id},{playerId:l.id},{playerId:d.id}]);
                    launched ||= s.events.some(e=>e.text.includes('Leo launches'));
                    if(s.events.at(-1)?.text==='Rebound!'||s.events.at(-1)?.text.startsWith('Out of bounds'))ballTrace.push({step:i+1,event:s.events.at(-1).text,x:s.ball.x,y:s.ball.y,z:s.ball.z,vx:s.ball.vx,vy:s.ball.vy,vz:s.ball.vz,mode:s.ball.mode});
                    if(k.animation.clip==='rebound'){reboundStarted=true;return {launched,reboundStarted,globalStep:i+1,reboundTick:k.animation.tick,ballMode:s.ball.mode,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z},owner:s.ball.ownerId,player:k.id,ballTrace,events:s.events.slice(-3)};}
                  }return {launched,reboundStarted:false,ballMode:s.ball.mode,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z,owner:s.ball.ownerId},players:s.players.map(p=>({id:p.id,team:p.team,x:p.x,y:p.y,clip:p.animation.clip,tick:p.animation.tick,hasBall:p.hasBall,rebounds:p.rebounds})),ballTrace,events:s.events.slice(-8)};
                }""")
                if not trajectory.get('reboundStarted'):
                    raise RuntimeError('Live missed shot did not schedule Kraken rebound: ' + json.dumps(trajectory))
                run = {'facing': facing, 'direction': direction, 'zoom': zoom, 'trajectory': trajectory, 'captures': []}
                for index, target_tick in enumerate(FRAME_TICKS):
                    if index:
                        advanced = page.evaluate("""({targetTick})=>{const g=window.jamverse,s=g.state,k=s.players.find(p=>p.id==='kraken'),l=s.players.find(p=>p.id==='leo'),d=s.players.find(p=>p.id==='sable-regent');
                          while(k.animation.clip==='rebound'&&k.animation.tick<targetTick)g.tick(1,[{playerId:k.id},{playerId:l.id},{playerId:d.id}]);
                          return {clip:k.animation.clip,tick:k.animation.tick,owner:s.ball.ownerId,mode:s.ball.mode};
                        }""", {'targetTick': target_tick})
                        if advanced['clip'] != 'rebound' or advanced['tick'] != target_tick:
                            raise RuntimeError('Could not advance live rebound to frame start: ' + json.dumps(advanced))
                    info = page.evaluate("""({atlas,targetTick})=>{const g=window.jamverse,s=g.state,k=s.players.find(p=>p.id==='kraken'),a=window.__rebound,selected=a.selectProductionSprite(k,{manifest:a.manifest,images:window.__productionSpriteImagesForReview});
                      const point={height:a.sampleBallHeight('rebound',targetTick,'kraken'),forward:a.sampleBallForward('rebound',targetTick,'kraken')};
                      return {tick:k.animation.tick,clip:k.animation.clip,selectedFrame:selected?.frame,selectedSrc:selected?.src,flip:selected?.flip,expectedFrame:targetTick<2?0:targetTick<4?1:targetTick<5?2:targetTick<7?3:4,
                        manifestReviewed:window.__reboundManifestReviewed,loadedImage:{present:window.__productionSpriteImagesForReview.has(atlas),complete:window.__productionSpriteImagesForReview.get(atlas)?.complete,naturalWidth:window.__productionSpriteImagesForReview.get(atlas)?.naturalWidth},drawCalls:window.__drawAudit.slice(-8),score:s.score,hasBall:k.hasBall,ball:{mode:s.ball.mode,owner:s.ball.ownerId,x:s.ball.x,y:s.ball.y,z:s.ball.z},trackPoint:point,
                        ballHandDelta:k.hasBall?{x:s.ball.x-(k.x+k.facing*point.forward),z:s.ball.z-(k.z+point.height)}:null,
                        rebounds:k.rebounds,events:s.events.slice(-3),atlas};}""", {'atlas': ATLAS, 'targetTick': target_tick})
                    expected_owned = target_tick >= 5
                    if info['clip'] != 'rebound' or info['tick'] != target_tick or info['selectedSrc'] != ATLAS or info['selectedFrame'] != index or info['flip'] != (facing < 0):
                        raise RuntimeError('Rebound sprite selection mismatch: ' + json.dumps({'info':info,'expected':{'index':index,'target_tick':target_tick,'atlas':ATLAS,'flip':facing<0},'checks':{'clip':info['clip']!='rebound','tick':info['tick']!=target_tick,'frame':info['selectedFrame']!=index,'src':info['selectedSrc']!=ATLAS,'flip':info['flip']!=(facing<0)}}))
                    if info['hasBall'] != expected_owned or info['ball']['owner'] != ('kraken' if expected_owned else None) or info['ball']['mode'] != ('carried' if expected_owned else 'loose'):
                        raise RuntimeError('Rebound ball ownership transition mismatch: ' + json.dumps(info))
                    if expected_owned and (abs(info['ballHandDelta']['x']) > .01 or abs(info['ballHandDelta']['z']) > .01):
                        raise RuntimeError('Carried rebound ball differs from Kraken-specific hand track: ' + json.dumps(info))
                    name = f'{direction}-frame{index}-tick{target_tick}-zoom{zoom}.png'
                    info['path'] = (OUT / name).relative_to(ROOT).as_posix()
                    page.locator('#game').screenshot(path=str(OUT / name))
                    run['captures'].append(info)
                if errors:
                    report['uncaughtBrowserErrors'].extend(errors)
                    raise RuntimeError('browser page errors: ' + json.dumps(errors))
                report['runs'].append(run)
                page.close()
        browser.close()
    report['captureCount'] = sum(len(run['captures']) for run in report['runs'])
    report['uncaughtBrowserErrors'] = list(dict.fromkeys(report['uncaughtBrowserErrors']))
    (OUT / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({'captures': report['captureCount'], 'runs': len(report['runs']), 'errors': report['uncaughtBrowserErrors'], 'output': str(OUT)}))
finally:
    server.terminate()
    server.wait(timeout=5)
