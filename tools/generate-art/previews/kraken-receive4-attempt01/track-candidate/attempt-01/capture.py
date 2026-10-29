"""Calibrate Kraken's separate receive track using current-court gameplay."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[6]
ATTEMPT=int(environ.get('ATTEMPT','1'))
OUT=ROOT/f'tools/generate-art/previews/kraken-receive4-attempt01/track-candidate/attempt-{ATTEMPT:02d}/native'
OUT.mkdir(parents=True,exist_ok=True)
COURT_Y=float(environ.get('COURT_Y','75'))
PORT=environ.get('PORT','4249');URL=f'http://127.0.0.1:{PORT}/'
ATLAS='./tools/generate-art/previews/kraken-receive4-attempt01/kraken-receive4-attempt01-runtime-candidate.png'
TRACK=json.loads(environ.get('TRACK_JSON','{"height":[1.3,1.4,1.74,1.2],"forward":[3,4.5,3,2]}'))
FRAMES=[0,1,2,3];FRAME_TICKS=[0,2,4,5]

def expose_tracks(route):
    response=route.fetch();body=response.text()
    marker='const athleteBallTracks='
    if marker not in body:raise RuntimeError('Could not expose athleteBallTracks for candidate trial')
    route.fulfill(response=response,body=body.replace(marker,'export const athleteBallTracks=',1))

server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
report={'status':'candidate-only current-court incoming pass/catch trial; independent review pending','renderer':'Chromium Jam Stage production simulation','athlete':'kraken','clip':'receive','candidateAtlas':ATLAS,'candidateTrack':TRACK,'candidateAtlasInjected':True,'candidateBallTrackInjected':True,'runtimeIntegration':False,'court':'vesper-harbor-undertow vs blackthorn-court-kings','courtY':COURT_Y,'frameDurations':[2,2,1,3],'catchAnchorTick':4,'matchup':'Vesper Harbor Undertow vs Blackthorn Court Kings','captures':[],'runs':[]}
try:
    deadline=monotonic()+30
    while monotonic()<deadline:
        if server.poll() is not None:raise RuntimeError('Jam Stage server exited before readiness')
        try:
            with urlopen(URL,timeout=1) as response:
                if response.status==200:break
        except Exception:sleep(.1)
    else:raise TimeoutError('Jam Stage server did not become ready')
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        page=browser.new_page(viewport={'width':900,'height':700},device_scale_factor=1);errors=[];page.on('pageerror',lambda exc:errors.append(str(exc)))
        page.add_init_script('window.requestAnimationFrame=()=>0');page.route('**/src/core/animation.js',expose_tracks)
        page.goto(URL,wait_until='networkidle',timeout=120000);page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105',timeout=120000)
        page.evaluate(f"""async()=>{{
          const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
          const {{athleteBallTracks}}=await import('/src/core/animation.js');
          const atlas='{ATLAS}';const im=new Image();im.src=atlas;await im.decode();window.__krakenReceiveAtlas=im;
          animationAssetManifest.characters.kraken.directions.right.receive={{src:atlas,columns:2,rows:2,reviewed:true,mirrorSafe:true,baselineY:94,frames:Array.from({{length:4}},(_,i)=>({{x:(i%2)*80,y:Math.floor(i/2)*96,w:80,h:96}}))}};
          athleteBallTracks.kraken??={{}};athleteBallTracks.kraken.receive={json.dumps(TRACK)};
        }}""")
        for zoom in [100,120]:
          page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}',zoom)
          for facing,direction in [(1,'right'),(-1,'left')]:
            page.evaluate("window.jamverse.start('vesper-harbor-undertow','blackthorn-court-kings',180,41)")
            setup=page.evaluate("""({facing,courtY})=>{
              const g=window.jamverse,s=g.state,k=s.players.find(p=>p.id==='kraken'),m=s.players.find(p=>p.id==='marin-dusk');
              for(const p of s.players){p.x=p.team===k.team?35:175;p.y=8;p.z=p.vx=p.vy=p.vz=0;p.hasBall=false;p.stun=999;p.animation={clip:'idle',tick:0};p.anim='idle';}
              k.x=100;k.y=courtY;k.facing=-facing;k.stun=0;k.animation={clip:'idle',tick:0};k.anim='idle';k.hasBall=false;
              m.x=100-facing*20;m.y=courtY;m.facing=facing;m.stun=0;m.animation={clip:'idle-ball',tick:0};m.anim='idle-ball';m.hasBall=true;
              s.phase='playing';s.pause=false;s.practice=true;s.score=[0,0];s.scorePause=0;s.events=[];s.lastEvent='';s.possession=m.team;
              Object.assign(s.ball,{mode:'carried',ownerId:m.id,targetId:null,aerialTargetId:null,lastTouch:m.id,attemptId:null,scored:false,x:m.x,y:m.y,z:1,vx:0,vy:0,vz:0});
              return{facing,courtY,passer:{id:m.id,x:m.x,y:m.y,facing:m.facing},receiver:{id:k.id,x:k.x,y:k.y,facing:k.facing},score:[...s.score]};
            }""",{'facing':facing,'courtY':COURT_Y})
            trace=[];previous=None;catch=None
            for step in range(22):
              state=page.evaluate("""({send,step})=>{const g=window.jamverse,s=g.state,k=s.players.find(p=>p.id==='kraken'),m=s.players.find(p=>p.id==='marin-dusk'),inputs=s.players.map(p=>({playerId:p.id}));if(send){const x=inputs.find(i=>i.playerId===m.id);x.passPressed=true;x.passVariant='pass'}g.tick(1,inputs);return{step,kraken:{clip:k.animation.clip,tick:k.animation.tick,action:k.animation.action?.kind,hasBall:k.hasBall,facing:k.facing},marin:{clip:m.animation.clip,tick:m.animation.tick,hasBall:m.hasBall},ball:{mode:s.ball.mode,owner:s.ball.ownerId,lastTouch:s.ball.lastTouch,x:s.ball.x,y:s.ball.y,z:s.ball.z,vx:s.ball.vx,vy:s.ball.vy,vz:s.ball.vz},score:[...s.score],event:s.lastEvent};}""",{'send':step==0,'step':step})
              delta=None
              if previous and state['ball']['owner']=='kraken':delta={'x':state['ball']['x']-previous['x'],'z':state['ball']['z']-previous['z']}
              file=None
              if state['kraken']['clip']=='receive' or state['ball']['owner']=='kraken' or state['ball']['mode']=='pass':
                path=OUT/f'gameplay-{direction}-step{step:02d}-receive-tick{state["kraken"]["tick"]:02d}-zoom{zoom}.png';page.locator('#game').screenshot(path=str(path));file=str(path.relative_to(ROOT))
              trace.append({**state,'catchCorrection':delta,'capture':file})
              if state['ball']['owner']=='kraken' and catch is None:catch={'step':step,'receiveTick':state['kraken']['tick'],'correction':delta,'ball':state['ball'].copy(),'capture':file}
              previous=state['ball'].copy()
              if catch and state['kraken']['tick']>=7:break
            report['runs'].append({'facing':facing,'zoom':zoom,'setup':setup,'catch':catch,'trace':trace,'final':trace[-1] if trace else None})
        browser.close()
    if errors:raise RuntimeError('Browser errors: '+json.dumps(errors))
    report['uncaughtBrowserErrors']=errors
    for run in report['runs']:
      if not run['catch']:raise RuntimeError('Kraken did not catch Marin pass: '+json.dumps(run))
      if run['final']['ball']['owner']!='kraken' or run['final']['score']!=[0,0]:raise RuntimeError('Bad final possession/score: '+json.dumps(run))
    report['captureCount']=sum(len(r['trace']) for r in report['runs'])
    (OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({'attempt':ATTEMPT,'runs':len(report['runs']),'captures':report['captureCount'],'track':TRACK,'catchSteps':[r['catch']['step'] for r in report['runs']],'corrections':[r['catch']['correction'] for r in report['runs']],'errors':errors,'output':str(OUT)}))
finally:
    server.terminate();server.wait(timeout=5)
