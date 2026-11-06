"""Capture real Krios behind-pass gameplay and candidate ball-track variants."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ATTEMPT = int(environ.get('ATTEMPT', '1'))
OUT = ROOT / f'tools/generate-art/previews/j128-krios-pass-behind-track-candidate/attempt-{ATTEMPT:02d}/native'
OUT.mkdir(parents=True, exist_ok=True)
COURT_Y = float(environ.get('COURT_Y', '90'))
PORT = environ.get('PORT', '4228')
URL = f'http://127.0.0.1:{PORT}/'
TRACK = json.loads(environ.get('TRACK_JSON', '{"height":[1.05,1.3,1.2,1.25,1.25,1.2],"forward":[5,2,-3,-9,-12,-8]}'))
CAPTURE_TICKS = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 18, 24, 30, 36, 42, 48, 54, 60]
ATLAS = './public/assets/animation/krios-pass-behind-right.webp'

def _inject_track_export(route):
    response = route.fetch()
    body = response.text()
    if 'const athleteBallTracks=' not in body:
        raise RuntimeError('Could not instrument served athleteBallTracks source')
    route.fulfill(response=response, body=body.replace('const athleteBallTracks=', 'export const athleteBallTracks=', 1))

server = Popen(['node', 'tools/server.mjs'], cwd=ROOT, env={**environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)
report = {
    'renderer': 'Chromium production Jam Stage canvas', 'baseUrl': URL,
    'athlete': 'krios', 'clip': 'pass-behind', 'candidateAtlas': ATLAS,
    'candidateTrack': TRACK, 'court': 'scoria-rams vs blackthorn-court-kings', 'courtY': COURT_Y,
    'releaseTick': 7, 'captureTicks': CAPTURE_TICKS,
    'simulation': 'Real Jam Stage stepMatch loop with temporary candidate athleteBallTracks entry injected into the served animation module in-page only.',
    'captureMethod': 'A Krios-led Scoria Rams match is started. Fixture setup grants Krios possession near a teammate and repositions the players once before the pass. The pass-behind action, separate carried ball, release, projectile flight and receiver catch are advanced by stepMatch; no per-tick manual player/ball teleporting.',
    'captures': []
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
        page = browser.new_page(viewport={'width':900,'height':700}, device_scale_factor=1)
        errors=[]
        page.on('pageerror', lambda exc: errors.append(str(exc)))
        page.add_init_script('window.requestAnimationFrame=()=>0')
        page.route('**/src/core/animation.js', lambda route: _inject_track_export(route))
        page.goto(URL, wait_until='networkidle', timeout=120000)
        page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=120000)
        page.evaluate("window.jamverse.start('scoria-rams','blackthorn-court-kings',180,51)")
        page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='krios')")
        page.evaluate(f"""async()=>{{
          const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
          const {{athleteBallTracks}}=await import('/src/core/animation.js');
          athleteBallTracks.krios??={{}};athleteBallTracks.krios['pass-behind']={json.dumps(TRACK)};
          const atlas='{ATLAS}';
          animationAssetManifest.characters.krios.directions.right['pass-behind']={{src:atlas,columns:5,rows:2,reviewed:true,mirrorSafe:true,frames:Array.from({{length:6}},(_,i)=>({{x:(i%5)*104,y:Math.floor(i/5)*96,w:104,h:96}}))}};
          const image=new Image();image.src=atlas;await image.decode();window.__kriosBehindAtlas=image;
          window.jamverse.start('scoria-rams','blackthorn-court-kings',180,51);
        }}""")
        for zoom in [100,120]:
          page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}',zoom)
          for facing,direction in [(1,'right'),(-1,'left')]:
            setup=page.evaluate("""({facing,courtY})=>{
              const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='krios');
              const teammates=s.players.filter(x=>x.team===p.team&&x!==p);const target=teammates[0];
              p.x=100;p.y=courtY;p.facing=facing;p.vx=p.vy=p.vz=p.z=0;p.hasBall=true;p.stun=0;p.animation={clip:'idle-ball',tick:0};p.anim='idle-ball';
              target.x=p.x+facing*25;target.y=courtY;target.vx=target.vy=target.vz=target.z=0;target.facing=-facing;target.hasBall=false;target.stun=0;target.animation={clip:'idle',tick:0};target.anim='idle';
              for(const q of s.players)if(q!==p&&q!==target){q.x=q.team===p.team?(facing>0?40:160):(facing>0?18:182);q.y=10;q.vx=q.vy=q.vz=q.z=0;q.hasBall=false;q.stun=999;q.animation={clip:'idle',tick:0};q.anim='idle'}
              s.phase='playing';s.pause=false;s.score=[0,0];s.scorePause=0;s.possession=p.team;s.clock=180;s.shotClock=24;
              Object.assign(s.ball,{mode:'carried',ownerId:p.id,targetId:null,aerialTargetId:null,lastTouch:p.id,attemptId:null,scored:false,vx:0,vy:0,vz:0,x:p.x+facing*5,y:p.y,z:1.05});
              return{player:p.id,target:target.id,team:p.team,facing,playerPoint:[p.x,p.y],targetPoint:[target.x,target.y]};
            }""",{'facing':facing,'courtY':COURT_Y})
            report.setdefault('setups',[]).append({'zoom':zoom,**setup})
            page.evaluate("""()=>{const g=window.jamverse,p=g.state.players.find(x=>x.id==='krios');const frames=g.state.players.map(x=>({playerId:x.id}));const f=frames.find(x=>x.playerId===p.id);Object.assign(f,{passPressed:true,y:1});g.tick(1,frames)}""")
            final_state=None
            for step in range(1,71):
              state=page.evaluate("""()=>{const g=window.jamverse,s=g.state;return{p:s.players.find(x=>x.id==='krios'),tick:s.players.find(x=>x.id==='krios').animation?.tick??0,ball:s.ball,target:s.players.find(x=>x.id===s.ball.ownerId)}}""")
              if step in CAPTURE_TICKS:
                info=page.evaluate("""async({step,facing,atlas})=>{
                  const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='krios');
                  const {selectProductionSprite}=await import('/src/render/animation-sprites.js');const {animationAssetManifest}=await import('/src/content/animation-assets.js');
                  const selected=selectProductionSprite(p,{manifest:animationAssetManifest,images:new Map([[atlas,window.__kriosBehindAtlas]])});
                  return{step,animationTick:p.animation.tick,animationClip:p.animation.clip,frame:selected?.frame,facing,actualFacing:p.facing,flip:selected?.flip,src:selected?.src,player:{x:p.x,y:p.y,z:p.z,hasBall:p.hasBall},ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z,mode:s.ball.mode,ownerId:s.ball.ownerId,targetId:s.ball.targetId,lastTouch:s.ball.lastTouch},receiver:s.players.find(x=>x.id===s.ball.ownerId)?.id??null,score:s.score,phase:s.phase,pause:s.pause,canvasArt:document.querySelector('#game').dataset.gameplayArt}
                }""",{'step':step,'facing':facing,'atlas':ATLAS})
                page.evaluate("""()=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='krios'),target=s.players.find(x=>x.id===s.ball.targetId);window.__capturePlayers=s.players;s.players=target?[p,target]:[p];g.tick(0)}""")
                name=f'actual-{direction}-step{step:02d}-tick{info["animationTick"]:02d}-zoom{zoom}.png';page.locator('#game').screenshot(path=str(OUT/name));report['captures'].append({**info,'zoom':zoom,'path':str((OUT/name).relative_to(ROOT))})
                page.evaluate("""()=>{const g=window.jamverse;g.state.players=window.__capturePlayers;delete window.__capturePlayers;g.tick(0)}""")
              # Continue the real production simulation with neutral controls.
              page.evaluate("""()=>{const g=window.jamverse;g.tick(1,g.state.players.map(x=>({playerId:x.id})))}""")
              after=page.evaluate("""()=>{const s=window.jamverse.state;const p=s.players.find(x=>x.id==='krios');return{tick:p.animation?.tick??0,mode:s.ball.mode,owner:s.ball.ownerId,target:s.ball.targetId,caught:s.players.find(x=>x.id===s.ball.ownerId)?.id??null,score:s.score,phase:s.phase,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z},players:s.players.map(q=>({id:q.id,x:q.x,y:q.y,z:q.z,hasBall:q.hasBall}))}}""")
              final_state=after
              if after['caught'] and after['caught']!='krios':
                report.setdefault('receiverEvents',[]).append({'zoom':zoom,'facing':facing,'step':step,'state':after})
                break
              if after['phase']=='final': break
            report.setdefault('gameplayResults',[]).append({'zoom':zoom,'facing':facing,'finalState':final_state,'captureCount':len([c for c in report['captures'] if c['zoom']==zoom and c['facing']==facing])})
        browser.close()
        if errors: raise RuntimeError(f'Browser errors: {errors}')
        report['captureCount']=len(report['captures']);report['uncaughtBrowserErrors']=errors
        bad=[c for c in report['captures'] if (c['animationClip']=='pass-behind' and (c['src']!=ATLAS or c['frame'] is None or c['flip']!=(c['facing']<0))) or c['pause']]
        if bad: raise RuntimeError('Selector/facing/paused capture mismatch: '+json.dumps(bad[:5]))
        (OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
        print(json.dumps({'captures':len(report['captures']),'receiverEvents':report.get('receiverEvents',[]),'errors':errors,'out':str(OUT)}))
finally:
    server.terminate();server.wait(timeout=5)
