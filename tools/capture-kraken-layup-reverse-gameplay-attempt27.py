"""Capture J.07 Kraken reverse-layup ball-track candidates on the production Jam Stage."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ATTEMPT = int(environ.get('ATTEMPT', '27'))
SELECTED_FACING = int(environ.get('FACING','0'))
if SELECTED_FACING not in (-1,0,1): raise ValueError('FACING must be -1, 0, or 1')
OUT = ROOT / f"tools/generate-art/previews/kraken-layup-reverse-track-candidate/attempt-{ATTEMPT:02d}/gameplay/{'both' if SELECTED_FACING==0 else ('right' if SELECTED_FACING>0 else 'left')}"
OUT.mkdir(parents=True, exist_ok=True)
COURT_Y = 80
PORT = '4294'
URL = f'http://127.0.0.1:{PORT}/'
TRACK = json.loads((ROOT / 'tools/generate-art/previews/kraken-layup-reverse-track-candidate/attempt-25/track.json').read_text())
RELEASE_VZ = environ.get('RELEASE_VZ')
FRAME_TICKS = [0, 2, 5, 7, 10, 12, 13, 17]
DURATIONS = [2, 3, 2, 3, 2, 1, 4, 4]
TICKS = [0, 2, 5, 7, 10, 11, 12, 13, 17, 20, 30, 60, 100, 110, 120, 150]
RELEASE = None
ATLAS = './tools/generate-art/previews/kraken-layup-reverse8-attempt03/cleanup02-baseline-offset/kraken-layup-reverse8-attempt03-cleanup02-atlas.png'
server = Popen(['node', 'tools/server.mjs'], cwd=ROOT, env={**environ, 'PORT':PORT}, stdout=DEVNULL, stderr=DEVNULL)
report = {
    'renderer':'Chromium production Jam Stage canvas', 'baseUrl':URL, 'athlete':'kraken', 'clip':'layup-reverse',
    'candidateAtlas':ATLAS, 'candidateTrack':TRACK, 'candidateReleaseVz':float(RELEASE_VZ) if RELEASE_VZ is not None else None, 'simulation':'Actual production stepMatch loop. Candidate-only atlas/track injected in page; manifest baselineY=92 applies a measured two-pixel downward compensation after shifting art upward two pixels to add bottom margin. No production files changed.',
    'court':'vesper-harbor-undertow vs blackthorn-court-kings', 'courtY':COURT_Y,
    'grid':'Post-release trajectory checkpoints plus score/dead-ball completion for both facings × 100%/120%' ,
    'captureMethod':'For each facing, the match starts with Kraken on the selected offensive roster (home for right, away for left) so the production renderer resolves him from the matching team roster. A one-time diagnostic fixture keeps only that real Kraken player in frame and initializes the production layup-reverse shot action. Production stepMatch advances animation, takeoff, carried-ball track, release, shot physics, rim/score resolution, and completion continuously. No manual per-tick ball teleporting; no pause overlay; no ball baked into art.', 'fixture':'Fresh match per facing/zoom; after 100 neutral production ticks with Kraken holding the ball at the attacking rim, the camera follows normally and the action begins. The production stepMatch path runs until score/ball completion.',
    'captures':[], 'ownershipTrace':[]
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
        page = browser.new_page(viewport={'width':900,'height':1000}, device_scale_factor=1)
        errors=[];page.on('pageerror', lambda exc: errors.append(str(exc)));page.on('console', lambda msg: errors.append('console '+msg.text) if msg.type=='error' else None)
        def patch_animation(route):
            response=route.fetch()
            body=response.text()
            marker="athleteBallTracks.kraken={steal:"
            release=(",releaseVz:"+json.dumps(float(RELEASE_VZ))) if RELEASE_VZ is not None else ""
            insertion="athleteBallTracks.kraken['layup-reverse']={height:"+json.dumps(TRACK['height'])+",forward:"+json.dumps(TRACK['forward'])+release+"};\n"
            if marker not in body: raise RuntimeError('Could not find Kraken track initialization')
            insert_at=body.find('\n',body.find(marker))
            if insert_at<0: raise RuntimeError('Could not find end of Kraken track initialization')
            body=body[:insert_at]+'\n'+insertion+body[insert_at:]
            route.fulfill(response=response,body=body)
        page.route('**/src/core/animation.js',patch_animation)
        def expose_sprite_images(route):
            response=route.fetch()
            route.fulfill(response=response,body=response.text()+"\nwindow.__productionSpriteImagesForReview=productionSpriteImages;\n")
        page.route('**/src/main.js',expose_sprite_images)
        page.add_init_script('window.requestAnimationFrame=()=>0')
        page.goto(URL, wait_until='networkidle', timeout=120000)
        try:
            page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=15000)
        except Exception as exc:
            raise RuntimeError(f'Jamverse boot failed: {exc}; browser errors={errors}; page={page.url}') from exc
        page.evaluate(f"""async()=>{{
          const image=new Image();image.src='{ATLAS}';await image.decode();window.__krakenReverseLayupAtlas=image;window.__productionSpriteImagesForReview.set('{ATLAS}',image);
          const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
          const kraken=animationAssetManifest.characters.kraken;
          kraken.directions.right['layup-reverse']={{src:'{ATLAS}',columns:4,rows:2,reviewed:true,mirrorSafe:true,baselineY:92,frames:Array.from({{length:8}},(_,i)=>({{x:(i%4)*80,y:Math.floor(i/4)*96,w:80,h:96}}))}};
          const teams=window.jamverse.teams, home=teams.find(t=>t.roster.some(a=>a.id==='kraken')), away=teams.find(t=>t!==home);
          window.jamverse.start(home.id,away.id,180,41);
        }}""")
        page.wait_for_function("window.jamverse.state && window.jamverse.state.players.length===4")
        page.wait_for_timeout(250)
        report['setupFixture']='Per facing, Jam Stage starts a real roster containing Kraken on the scoring team (home for right, away for left). A one-time fixture retains that Kraken instance at near the attacking hoop and initializes the layup-reverse shot action; stepMatch owns subsequent animation, elevation, ball, release, and flight updates.'
        for zoom in [100,120]:
            page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}',zoom)
            facings=[(SELECTED_FACING,'right' if SELECTED_FACING>0 else 'left')] if SELECTED_FACING else [(1,'right'),(-1,'left')]
            for facing,direction in facings:
                page.evaluate("""({facing,courtY})=>{
                  const g=window.jamverse,teams=g.teams,krakenTeam=teams.find(t=>t.roster.some(a=>a.id==='kraken')),other=teams.find(t=>t!==krakenTeam);
                  const home=facing>0?krakenTeam:other,away=facing>0?other:krakenTeam;
                  g.start(home.id,away.id,180,41);
                  const s=g.state;let p=s.players.find(x=>x.id==='kraken');
                  if(!p)throw new Error('Kraken is missing from selected offensive roster');
                  s.pause=false;s.phase='playing';s.score=[0,0];s.scorePause=0;s.scoredAttempts=[];s.nextAttempt=1;s.rng=41;
                  p.x=(facing>0?150:50);p.y=courtY;p.vx=p.vy=p.vz=p.z=0;p.facing=facing;p.hasBall=true;p.charge=0;p.stun=0;p.animation={clip:'idle-ball',tick:0};p.anim='idle-ball';
                  s.players=[p];p.fga=0;p.fgm=0;
                  s.possession=p.team;Object.assign(s.ball,{mode:'carried',ownerId:p.id,targetId:null,lastTouch:p.id,attemptId:null,scored:false,vx:0,vy:0,vz:0,x:p.x+facing*5,y:p.y,z:1});
                  for(let warmup=0;warmup<100;warmup++)g.tick(1,[{playerId:p.id,x:0,y:0}]);
                  s.clock=180;s.shotClock=24;s.phase='playing';s.pause=false;s.scorePause=0;
                  p.animation={clip:'layup-reverse',tick:0,jump:true,action:{kind:'shot',charge:0}};p.anim='shoot';p.poseFrames=21;window.__krakenSimTick=0;
                  return {team:p.team,home:home.id,away:away.id,facing,x:p.x,y:p.y,pause:s.pause,rosterHasKraken:home.roster.some(a=>a.id==='kraken')||away.roster.some(a=>a.id==='kraken'),cameraWarmupTicks:100};
                }""", {'facing':facing,'courtY':COURT_Y})
                for tick in TICKS:
                    state=page.evaluate("""({target,facing,zoom,atlas})=>{const g=window.jamverse;while(window.__krakenSimTick<target){const p=g.state.players.find(x=>x.id==='kraken');g.tick(1,[{playerId:p.id,x:0,y:0}]);window.__krakenSimTick++;}const s=g.state,p=s.players.find(x=>x.id==='kraken');return {scored:s.ball.scored===true,dead:s.ball.mode==='dead',mode:s.ball.mode,score:s.score,owner:s.ball.ownerId,hasBall:p?.hasBall,trace:{tick:target,facing,zoom,animationTick:p.animation.tick,playerHasBall:p.hasBall,ownerId:s.ball.ownerId,ballMode:s.ball.mode,scored:s.ball.scored===true,score:[...s.score]}};}""",{'target':tick,'facing':facing,'zoom':zoom,'atlas':ATLAS})
                    report['ownershipTrace'].append(state['trace'])
                    info=page.evaluate("""async({tick,facing,atlas})=>{
                      const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='kraken');
                      const {selectProductionSprite}=await import('/src/render/animation-sprites.js');const {animationAssetManifest}=await import('/src/content/animation-assets.js');
                      const selected=selectProductionSprite(p,{manifest:animationAssetManifest,images:new Map([[atlas,window.__krakenReverseLayupAtlas]])});const runtimeAtlas=window.__productionSpriteImagesForReview.get(atlas);const runtimeSelected=selectProductionSprite(p,{manifest:animationAssetManifest,images:window.__productionSpriteImagesForReview});
                      const canvas=document.querySelector('#game'),stageCameraX=Number(canvas.dataset.stageCameraX),{projectJamStagePoint}=await import('/src/render/jam-stage.js');
                      const projectedPlayer=projectJamStagePoint({x:p.x,y:p.y,z:p.z,cameraX:stageCameraX,zoom:Number(document.querySelector('#camera-zoom').value),viewDirection:facing});
                      return{tick,animationTick:p.animation.tick,frame:selected?.frame,runtimeSelectedFrame:runtimeSelected?.frame,runtimeSelectedSrc:runtimeSelected?.src,runtimeImage:{present:Boolean(runtimeAtlas),complete:runtimeAtlas?.complete,naturalWidth:runtimeAtlas?.naturalWidth},animationClip:p.animation.clip,player:{x:p.x,y:p.y,z:p.z,vz:p.vz,facing:p.facing,hasBall:p.hasBall,fga:p.fga,fgm:p.fgm,team:p.team,rosterMatch:window.jamverse.teams.find(t=>t.id===document.querySelector(p.team===0?'#home-team':'#away-team').value)?.roster.some(a=>a.id==='kraken'),screen:projectedPlayer},cameraX:stageCameraX,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z,vx:s.ball.vx,vy:s.ball.vy,vz:s.ball.vz,mode:s.ball.mode,ownerId:s.ball.ownerId,made:s.ball.made,scored:s.ball.scored,targetX:s.ball.targetX,targetY:s.ball.targetY,targetZ:s.ball.targetZ},facing,flip:selected?.flip,src:selected?.src,phase:s.phase,pause:s.pause,score:s.score,scorePause:s.scorePause,lastEvent:s.lastEvent,events:s.events.slice(-4)};
                    }""",{'tick':tick,'facing':facing,'atlas':ATLAS})
                    name=f'gameplay-{direction}-tick{tick:03d}-zoom{zoom}.png';page.locator('#game').screenshot(path=str(OUT/name));report['captures'].append({**info,'zoom':zoom,'path':str((OUT/name).relative_to(ROOT))})
                    if state['scored'] or state['dead']: break
        browser.close()
        if errors: raise RuntimeError(f'Browser errors: {errors}')
        bad_ownership=[]
        for facing in ([SELECTED_FACING] if SELECTED_FACING else (1,-1)):
            for zoom in (100,120):
                rows=[row for row in report['ownershipTrace'] if row['facing']==facing and row['zoom']==zoom]
                early=[row for row in rows if row['tick']<12 and (row['ownerId']!='kraken' or not row['playerHasBall'])]
                release=[row for row in rows if row['tick']==12]
                if early or len(release)!=1 or release[0]['ownerId'] is not None or release[0]['playerHasBall'] or release[0]['ballMode']!='shot': bad_ownership.append({'facing':facing,'zoom':zoom,'early':early[:1],'release':release})
        if bad_ownership: raise RuntimeError('Ownership/release timing mismatch: '+json.dumps(bad_ownership))
        bad=[c for c in report['captures'] if c['pause'] or (c['tick']<=20 and (c['src']!=ATLAS or c['frame'] is None or c['flip']!=(c['facing']<0)))]
        if bad: raise RuntimeError('Production sprite selection/pause mismatch: '+json.dumps(bad[:5]))
        report['captureCount']=len(report['captures']);report['uncaughtBrowserErrors']=errors;(OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
        print(json.dumps({'attempt':ATTEMPT,'captures':len(report['captures']),'ticks':TICKS,'track':TRACK,'errors':errors,'output':str(OUT)}))
finally:
    server.terminate();server.wait(timeout=5)
