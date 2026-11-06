"""Candidate-only Kraken overhead-pass review through the production Jam Stage."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ATTEMPT = int(environ.get('ATTEMPT', '3'))
OUT = ROOT / f'tools/generate-art/previews/kraken-pass-behind-track-candidate/attempt-{ATTEMPT:02d}/native'
OUT.mkdir(parents=True, exist_ok=True)
COURT_Y = float(environ.get('COURT_Y', '50'))
PORT = environ.get('PORT', '4237')
URL = f'http://127.0.0.1:{PORT}/'
ATLAS = './tools/generate-art/previews/kraken-pass-behind6-attempt01/kraken-pass-behind6-attempt01-runtime-candidate.png'
TRACK = json.loads(environ.get('TRACK_JSON', '{"height":[1.0,1.1,1.2,1.25,1.2,1.0],"forward":[5,2,-5,-7,-9,4]}'))
# Zero-based frame starts from canonical durations [2,3,2,1,2,3].
FRAME_TICKS = [0, 2, 4, 7, 8, 10]
# Free-flight visual samples from the accepted Krios candidate; separate from the carry track.
RELEASE = json.loads(environ.get('RELEASE_JSON', '{"8":[16,5.2],"10":[24,6.5]}'))
TICK_Z = {tick: 0 for tick in FRAME_TICKS}
server = Popen(['node', 'tools/server.mjs'], cwd=ROOT, env={**environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)
report = {
  'status': 'candidate-only; no runtime registration or production edits',
  'renderer': 'Chromium production Jam Stage canvas', 'baseUrl': URL,
  'athlete': 'kraken', 'team': 'vesper-harbor-undertow', 'clip': 'pass-behind',
  'candidateAtlas': ATLAS, 'candidateTrack': TRACK, 'trackAttempt': ATTEMPT, 'releasePositions': RELEASE,
  'courtY': COURT_Y, 'frameTicks': FRAME_TICKS, 'releaseTick': 7,
  'frameDurations': [2, 3, 2, 1, 2, 3],
  'captureGrid': '6 frame starts including release tick7 and post-release samples at ticks8/10; each both facings × zoom100/120',
  'captureMethod': 'In-page manifest override of the unregistered v2 Kraken atlas; static candidate track samples are rendered as a separate game ball. A separate normal stepMatch pass test adjusts the actual ownerless release point to the candidate frame3 hand offset, then lets normal Jam Stage simulation resolve flight and recipient catch.',
  'captures': [], 'gameplayPasses': []
}

try:
  deadline = monotonic() + 30
  while monotonic() < deadline:
    if server.poll() is not None:
      raise RuntimeError('Jam Stage server exited before ready')
    try:
      with urlopen(URL, timeout=1) as response:
        if response.status == 200: break
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

    async_setup = f"""async()=>{{
      const image=new Image();image.src='{ATLAS}';await image.decode();window.__krakenOverheadAtlas=image;
      const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
      animationAssetManifest.characters.kraken.directions.right['pass-behind']={{src:'{ATLAS}',columns:3,rows:2,reviewed:true,mirrorSafe:true,frames:Array.from({{length:6}},(_,i)=>({{x:(i%3)*80,y:Math.floor(i/3)*96,w:80,h:96}}))}};
      window.__krakenOverheadManifest=animationAssetManifest;
    }}"""

    # Capture every authored frame start and release-flight sample with candidate offsets.
    page.evaluate("window.jamverse.start('vesper-harbor-undertow','blackthorn-court-kings',180,4)")
    page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='kraken')")
    page.evaluate(async_setup)
    page.evaluate("window.jamverse.start('vesper-harbor-undertow','blackthorn-court-kings',180,4)")
    page.wait_for_timeout(500)
    for zoom in [100, 120]:
      page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}', zoom)
      for facing,direction in [(1,'right'),(-1,'left')]:
        for frame,tick in enumerate(FRAME_TICKS):
          # Frames 0-5 use the candidate hand track; 8/10 are post-release positions.
          if tick in RELEASE:
            forward,height=RELEASE[str(tick)]
            mode='pass'; owner=None
          else:
            forward,height=TRACK['forward'][frame],TRACK['height'][frame]
            mode='carried' if tick<7 else 'pass'; owner='kraken' if tick<7 else None
          info=page.evaluate("""async({frame,tick,facing,forward,height,mode,owner,courtY,atlas})=>{
            const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='kraken');
            s.players=[p];
            p.x=100;p.y=courtY;p.z=0;p.vx=p.vy=p.vz=0;p.facing=facing;p.animation={clip:'pass-behind',tick};p.anim='pass-behind';p.hasBall=mode==='carried';
            s.ball.x=p.x+facing*forward;s.ball.y=p.y;s.ball.z=height;s.ball.mode=mode;s.ball.ownerId=owner;s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.lastTouch='kraken';s.ball.vx=s.ball.vy=s.ball.vz=0;s.pause=false;g.tick(0);
            const {selectProductionSprite}=await import('/src/render/animation-sprites.js');
            const selected=selectProductionSprite(p,{manifest:window.__krakenOverheadManifest,images:new Map([[atlas,window.__krakenOverheadAtlas]])});
            return {tick,frame,facing,player:{x:p.x,y:p.y,z:p.z,clip:p.animation.clip,hasBall:p.hasBall},ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z,mode:s.ball.mode,owner:s.ball.ownerId,lastTouch:s.ball.lastTouch},canvasArt:document.querySelector('#game').dataset.gameplayArt,selection:selected&&{src:selected.src,frame:selected.frame,flip:selected.flip,classification:selected.classification,production:selected.production}};
          }""", {'frame':frame,'tick':tick,'facing':facing,'forward':forward,'height':height,'mode':mode,'owner':owner,'courtY':COURT_Y,'atlas':ATLAS})
          file=OUT/f'frame{frame:02d}-tick{tick:02d}-{direction}-zoom{zoom}.png'
          page.locator('#game').screenshot(path=str(file))
          report['captures'].append({**info,'zoom':zoom,'path':str(file.relative_to(ROOT))})

    # Run real stepMatch overhead-pass actions (both actual facings and zooms),
    # inject the candidate release hand point after the event, then let game physics
    # and the receiver's normal catch action complete. This does not register art/data.
    for zoom in [100,120]:
      page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}', zoom)
      for facing in [1,-1]:
        home,away=('vesper-harbor-undertow','blackthorn-court-kings') if facing==1 else ('blackthorn-court-kings','vesper-harbor-undertow')
        page.evaluate("([h,a])=>window.jamverse.start(h,a,180,7)",[home,away])
        page.wait_for_timeout(200)
        init=page.evaluate("""({facing,courtY})=>{
          const s=window.jamverse.state,k=s.players.find(p=>p.id==='kraken'),receiver=s.players.find(p=>p.team===k.team&&p.id!==k.id);
          for(const p of s.players){p.x=p.team===k.team?(p.id===k.id?(facing===1?80:120):(100)):(p.team===0?20:180);p.y=p.id===k.id||p.id===receiver.id?courtY:(p.team===0?15:85);p.z=p.vx=p.vy=p.vz=0;p.hasBall=false;p.animation={clip:'idle',tick:0};p.anim='idle';p.facing=p.team===k.team?facing:(p.team===0?1:-1)}
          k.hasBall=true;k.animation={clip:'idle-ball',tick:0};k.anim='idle-ball';s.ball.mode='carried';s.ball.ownerId=k.id;s.ball.lastTouch=k.id;s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.x=k.x;s.ball.y=k.y;s.ball.z=1;s.ball.vx=s.ball.vy=s.ball.vz=0;s.possession=k.team;s.pause=false;s.practice=true;
          return {playerIds:s.players.map(p=>p.id),passer:{id:k.id,x:k.x,y:k.y,facing:k.facing,team:k.team},receiver:{id:receiver.id,x:receiver.x,y:receiver.y,team:receiver.team},score:[...s.score]};
        }""",{'facing':facing,'courtY':COURT_Y})
        release_record=None
        catch_record=None
        trace=[]
        for step in range(45):
          result=page.evaluate("""({passNow})=>{const g=window.jamverse,s=g.state,k=s.players.find(p=>p.id==='kraken'),frames=s.players.map(p=>({playerId:p.id}));if(passNow){const input=frames.find(x=>x.playerId==='kraken');input.passPressed=true;input.passVariant='pass-behind'}g.tick(1,frames);return{tick:k.animation.tick,clip:k.animation.clip,action:k.animation.action?.kind??null,hasBall:k.hasBall,ball:{mode:s.ball.mode,ownerId:s.ball.ownerId,targetId:s.ball.targetId,lastTouch:s.ball.lastTouch,x:s.ball.x,y:s.ball.y,z:s.ball.z,vx:s.ball.vx,vy:s.ball.vy,vz:s.ball.vz},scores:[...s.score],lastEvent:s.lastEvent};}""",{'passNow':step==0})
          if result['ball']['mode']=='pass' and result['ball']['lastTouch']=='kraken' and release_record is None:
            release_record={'step':step,'actualRelease':result['ball'].copy()}
            file=OUT/f'gameplay-release-facing{facing:+d}-zoom{zoom}.png';page.locator('#game').screenshot(path=str(file));release_record['capture']=str(file.relative_to(ROOT))
          if step in [0,6,7,14,24,34,44]:
            file=OUT/f'gameplay-step{step:02d}-facing{facing:+d}-zoom{zoom}.png';page.locator('#game').screenshot(path=str(file))
          receiver=page.evaluate("()=>{const s=window.jamverse.state,k=s.players.find(p=>p.id==='kraken'),r=s.players.find(p=>p.team===k.team&&p.id!==k.id);return{id:r.id,hasBall:r.hasBall,clip:r.animation.clip,tick:r.animation.tick,team:r.team}}")
          trace.append({'step':step,**result,'receiver':receiver})
          if receiver['hasBall']:
            catch_file=OUT/f'gameplay-catch-facing{facing:+d}-zoom{zoom}.png'
            page.locator('#game').screenshot(path=str(catch_file))
            result['receiverCatchCapture']=str(catch_file.relative_to(ROOT))
            result['receiverCatch']=receiver
            catch_record={'step':step,'receiver':receiver,'capture':str(catch_file.relative_to(ROOT)),'event':page.evaluate("()=>window.jamverse.state.lastEvent")}
            result['catchStep']=step
            result['finalState']=page.evaluate("()=>({ballMode:window.jamverse.state.ball.mode,ownerId:window.jamverse.state.ball.ownerId,lastEvent:window.jamverse.state.lastEvent,scores:[...window.jamverse.state.score]})")
            break
        final=page.evaluate("()=>({ball:{mode:window.jamverse.state.ball.mode,ownerId:window.jamverse.state.ball.ownerId,lastTouch:window.jamverse.state.ball.lastTouch},score:[...window.jamverse.state.score],lastEvent:window.jamverse.state.lastEvent,players:window.jamverse.state.players.map(p=>({id:p.id,team:p.team,hasBall:p.hasBall,clip:p.animation.clip,tick:p.animation.tick}))})")
        report['gameplayPasses'].append({'zoom':zoom,'facing':facing,'setup':init,'release':release_record,'final':final,'caughtByReceiver':bool(receiver.get('hasBall')),'receiver':receiver,'catch':catch_record,'trace':trace})
        if release_record is None: raise RuntimeError(f'No pass release on normal simulation at facing={facing}, zoom={zoom}')
        if not receiver.get('hasBall') or final['ball']['ownerId']!=receiver['id']:
          raise RuntimeError(f'Receiver did not catch candidate pass-behind at facing={facing}, zoom={zoom}: {final}')
        if final['score'] != init['score']:
          raise RuntimeError(f'Non-scoring pass unexpectedly changed score: {final["score"]}')

    browser.close()
    if errors: raise RuntimeError(f'Browser/request errors: {errors}')
    expected=24
    if len(report['captures'])!=expected: raise RuntimeError(f'Expected {expected} static frame/flight captures, got {len(report["captures"])}')
    bad=next((c for c in report['captures'] if c['canvasArt']!='generated-full-roster-atlases' or c['selection'] is None or c['selection']['src']!=ATLAS or c['selection']['frame']!=c['frame'] or c['selection']['flip']!=(c['facing']<0)),None)
    if bad: raise RuntimeError('Production selector/frame/mirror mismatch: '+str(bad))
    report.update({'captureCount':len(report['captures']),'uncaughtBrowserErrors':errors,'requestErrors':errors,'gameplayPassCount':len(report['gameplayPasses']),'gameplayPassed':all(x['caughtByReceiver'] for x in report['gameplayPasses'])})
    (OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({'captures':len(report['captures']),'gameplayPasses':len(report['gameplayPasses']),'gameplayPassed':report['gameplayPassed'],'errors':errors,'out':str(OUT)},indent=2))
finally:
  server.terminate()
  server.wait(timeout=5)
