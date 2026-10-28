"""Capture J111 Leo reverse-layup ball-track candidates on the production Jam Stage."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ATTEMPT = int(environ.get('ATTEMPT', '1'))
OUT = ROOT / 'tools/generate-art/previews/j111-leo-layup-reverse-track-candidate/attempt-04/native'
OUT.mkdir(parents=True, exist_ok=True)
COURT_Y = 90
PORT = '4227'
URL = f'http://127.0.0.1:{PORT}/'
TRACK = json.loads(environ.get('TRACK_JSON', '{"height":[0.40,1.61,1.98,2.60,2.65,2.65,1.45,0.84],"forward":[5.85,6.58,4.02,4.50,4.50,5.80,6.58,5.85]}'))
FRAME_TICKS = [0, 2, 5, 7, 10, 12, 13, 17]
DURATIONS = [2, 3, 2, 3, 2, 1, 4, 4]
TICKS = [0, 2, 5, 7, 10, 11, 12, 13, 17, 20]
RELEASE = None
ATLAS = './tools/generate-art/sources/j111-leo-layup-reverse-attempt06-facefix-cleanup01-atlas.png'
server = Popen(['node', 'tools/server.mjs'], cwd=ROOT, env={**environ, 'PORT':PORT}, stdout=DEVNULL, stderr=DEVNULL)
report = {
    'renderer':'Chromium production Jam Stage canvas', 'baseUrl':URL, 'athlete':'leo', 'clip':'layup-reverse',
    'candidateAtlas':ATLAS, 'candidateTrack':TRACK, 'simulation':'Actual production stepMatch loop. A single setup action initializes the existing layup-reverse shot state on a one-player diagnostic match because courtY=90 is outside queueShot close-range criteria. Track injected into served animation module in-page only; no production files changed.',
    'court':'vesper-harbor-undertow vs blackthorn-court-kings', 'courtY':COURT_Y,
    'grid':'10 actual simulation checkpoints across both facings × 100%/120% = 40 captures',
    'captureMethod':'Jam Stage starts from the normal roster, then a one-time diagnostic fixture keeps only Leo in frame and initializes the production layup-reverse shot action. Production stepMatch advances animation, takeoff, carried-ball track, release, and flight continuously. No manual per-tick teleporting; no pause overlay; no ball baked into art.',
    'captures':[]
}
try:
    deadline = monotonic() + 30
    while monotonic() < deadline:
        if server.poll() is not None: raise RuntimeError('Jam Stage server exited before readiness')
        try:
            with urlopen(URL, timeout=1) as response:
                if response.status == 200: break
        except Exception: sleep(.1)
    else: raise TimeoutError('Jam Stage server did not become ready')
    with sync_playwright() as pwt:
        browser = pwt.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage'])
        page = browser.new_page(viewport={'width':900,'height':700}, device_scale_factor=1)
        errors=[];page.on('pageerror', lambda exc: errors.append(str(exc)))
        def patch_animation(route):
            response=route.fetch()
            body=response.text()
            marker="athleteBallTracks.leo['pass-overhead']={"
            insertion="athleteBallTracks.leo['layup-reverse']={height:"+json.dumps(TRACK['height'])+",forward:"+json.dumps(TRACK['forward'])+"};\n"
            if marker not in body: raise RuntimeError('Could not find post-initialization Leo track insertion point')
            body=body.replace(marker,insertion+marker,1)
            route.fulfill(response=response,body=body)
        page.route('**/src/core/animation.js',patch_animation)
        page.add_init_script('window.requestAnimationFrame=()=>0')
        page.goto(URL, wait_until='networkidle', timeout=120000)
        page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=120000)
        page.evaluate(f"""async()=>{{
          const image=new Image();image.src='{ATLAS}';await image.decode();window.__leoReverseLayupAtlas=image;
          const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
          const leo=animationAssetManifest.characters.leo;
          leo.directions.right['layup-reverse']={{src:'{ATLAS}',columns:4,rows:2,reviewed:true,mirrorSafe:true,frames:Array.from({{length:8}},(_,i)=>({{x:(i%4)*80,y:Math.floor(i/4)*96,w:80,h:96}}))}};
          const teams=window.jamverse.teams, home=teams.find(t=>t.roster.some(a=>a.id==='leo')), away=teams.find(t=>t!==home);
          window.jamverse.start(home.id,away.id,180,41);
        }}""")
        page.wait_for_function("window.jamverse.state && window.jamverse.state.players.length===4")
        page.wait_for_timeout(250)
        report['setupFixture']='One-time diagnostic fixture on the current Jam Stage: single Leo at court x=100,y=90 with the production layup-reverse shot action initialized. Production stepMatch owns subsequent animation, elevation, ball, release, and flight updates.'
        for zoom in [100,120]:
            page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}',zoom)
            for facing,direction in [(1,'right'),(-1,'left')]:
                page.evaluate("""({facing,courtY})=>{
                  const g=window.jamverse,s=g.state;let p=s.players.find(x=>x.id==='leo');
                  if(!p){p=s.players[0];p.id='leo';p.name='Leo';p.shoot=99;p.team=0;}
                  s.pause=false;s.phase='playing';s.score=[0,0];s.scorePause=0;s.nextAttempt=1;s.rng=41;
                  p.x=100;p.y=courtY;p.vx=p.vy=p.vz=p.z=0;p.facing=facing;p.hasBall=true;p.charge=0;p.stun=0;p.animation={clip:'idle-ball',tick:0};p.anim='idle-ball';
                  s.players=[p];p.team=0;p.id='leo';p.name='Leo';p.shoot=99;
                  p.animation={clip:'layup-reverse',tick:0,jump:true,action:{kind:'shot',charge:0}};p.anim='shoot';p.poseFrames=21;
                  s.possession=p.team;Object.assign(s.ball,{mode:'carried',ownerId:p.id,targetId:null,lastTouch:p.id,attemptId:null,scored:false,vx:0,vy:0,vz:0,x:p.x+facing*5,y:p.y,z:1});
                  return {team:p.team,facing,x:p.x,y:p.y,pause:s.pause};
                }""", {'facing':facing,'courtY':COURT_Y})
                for tick in range(0,22):
                    if tick>0: page.evaluate("""()=>{const g=window.jamverse,p=g.state.players.find(x=>x.id==='leo');g.tick(1,[{playerId:p.id,x:0,y:0}]);}""")
                    if tick not in TICKS: continue
                    info=page.evaluate("""async({tick,facing,atlas})=>{
                      const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='leo');
                      const {selectProductionSprite}=await import('/src/render/animation-sprites.js');const {animationAssetManifest}=await import('/src/content/animation-assets.js');
                      const selected=selectProductionSprite(p,{manifest:animationAssetManifest,images:new Map([[atlas,window.__leoReverseLayupAtlas]])});
                      return{tick,animationTick:p.animation.tick,frame:selected?.frame,animationClip:p.animation.clip,player:{x:p.x,y:p.y,z:p.z,vz:p.vz,facing:p.facing,hasBall:p.hasBall},ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z,vx:s.ball.vx,vy:s.ball.vy,vz:s.ball.vz,mode:s.ball.mode,ownerId:s.ball.ownerId,made:s.ball.made},facing,flip:selected?.flip,src:selected?.src,phase:s.phase,pause:s.pause,score:s.score};
                    }""",{'tick':tick,'facing':facing,'atlas':ATLAS})
                    name=f'actual-{direction}-tick{tick:02d}-zoom{zoom}.png';page.locator('#game').screenshot(path=str(OUT/name));report['captures'].append({**info,'zoom':zoom,'path':str((OUT/name).relative_to(ROOT))})
        browser.close()
        if errors: raise RuntimeError(f'Browser errors: {errors}')
        bad=[c for c in report['captures'] if c['src']!=ATLAS or c['frame'] is None or c['flip']!=(c['facing']<0) or c['pause']]
        if bad: raise RuntimeError('Production sprite selection/pause mismatch: '+json.dumps(bad[:5]))
        report['captureCount']=len(report['captures']);report['uncaughtBrowserErrors']=errors;(OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
        print(json.dumps({'attempt':ATTEMPT,'captures':len(report['captures']),'ticks':TICKS,'track':TRACK,'errors':errors,'output':str(OUT)}))
finally:
    server.terminate();server.wait(timeout=5)
