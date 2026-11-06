"""Capture a Leo dunk-360 candidate through the production Jam Stage renderer."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'tools/generate-art/previews/leo-dunk-360-track-candidate/attempt-08/native'
OUT.mkdir(parents=True,exist_ok=True)
PORT='4199';URL=f'http://127.0.0.1:{PORT}/'
track={'height':[1.05,1.15,1.35,1.6,1.8,1.25,2.0,2.4,2.6,1.95,.3,2.2,1.5,.75,.65],'forward':[5,5,3,1,-4,0,-4,4.5,5,4,5,10,7,5,6]}
ticks=[0,2,4,7,9,10,12,14,17,19,20,21,22,23,26]
z_by_tick={0:0,2:0,4:0,7:2.2699524987,9:3.5355339059,10:4.0450849719,12:4.7552825815,14:5,17:4.3301270189,19:3.2139380484,20:2.5,21:1.7101007166,22:.95,23:0,26:0}
release={'22':(8.5,2.0),'23':(10.5,1.3),'26':(14.5,.6)}
durations=[2,2,3,2,1,2,2,3,2,2,2,3,2,2,3]
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
report={'renderer':'Chromium production Jam Stage canvas','baseUrl':URL,'athlete':'leo','clip':'dunk-360','candidateTrack':track,'captureMethod':'Manually stages the canonical dunk z-height at each authored frame start; carried ball follows candidate track through tick20, separate ownerless dunk ball at tick21 release. Deterministic gameplay verification is separate.','captures':[]}
try:
    deadline=monotonic()+20
    while monotonic()<deadline:
        if server.poll() is not None:raise RuntimeError('Jam Stage server exited before ready')
        try:
            with urlopen(URL,timeout=1) as response:
                if response.status==200:break
        except Exception:sleep(.1)
    else:raise TimeoutError('Jam Stage server did not become ready')
    with sync_playwright() as pwt:
        browser=pwt.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        page=browser.new_page(viewport={'width':900,'height':700},device_scale_factor=1)
        errors=[];page.on('pageerror',lambda exc:errors.append(str(exc)));page.add_init_script('window.requestAnimationFrame=()=>0')
        page.goto(URL,wait_until='networkidle',timeout=120000);page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105',timeout=120000)
        page.evaluate("window.jamverse.start('blackthorn-court-kings','chicago-condas',180,4)")
        page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='leo')")
        page.evaluate("""()=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='leo');s.players=[p];p.x=100;p.y=75;p.z=0;p.facing=1;p.hasBall=true;p.animation={clip:'dunk-360',tick:0};p.anim='dunk-360';Object.assign(s.ball,{x:100,y:75,z:1,mode:'carried',ownerId:'leo',targetId:null,aerialTargetId:null,vx:0,vy:0,vz:0});s.pause=true;for(let i=0;i<120;i++)g.tick(1/60);s.pause=false}""")
        for zoom in [100,120]:
            page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}',zoom)
            for facing,direction in [(1,'right'),(-1,'left')]:
                for tick in ticks:
                    elapsed=0;frame=0
                    for frame,duration in enumerate(durations):
                        if tick<elapsed+duration:break
                        elapsed+=duration
                    if tick==21:frame=10
                    info=page.evaluate("""({tick,frame,facing,z,track,release})=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='leo');p.x=100;p.y=75;p.z=z;p.facing=facing;p.animation={clip:'dunk-360',tick};p.anim='dunk-360';p.hasBall=true;const h=track.height[frame],f=track.forward[frame];if(tick<21){s.ball.x=p.x+facing*f;s.ball.y=p.y;s.ball.z=p.z+h;s.ball.mode='carried';s.ball.ownerId='leo'}else{const [dx,bz]=release[String(tick)]??[f,p.z+h];s.ball.x=p.x+facing*dx;s.ball.y=p.y;s.ball.z=bz;s.ball.mode='dunk';s.ball.ownerId=null}s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.vx=0;s.ball.vy=0;s.ball.vz=0;g.tick(0);return{tick,frame,facing,z:p.z,ballMode:s.ball.mode,owner:s.ball.ownerId,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z},canvasArt:document.querySelector('#game').dataset.gameplayArt}}""",{'tick':tick,'frame':frame,'facing':facing,'z':z_by_tick[tick],'track':track,'release':release})
                    name=f'tick{tick:02d}-{direction}-zoom{zoom}.png';page.locator('#game').screenshot(path=str(OUT/name));report['captures'].append({**info,'zoom':zoom,'path':str((OUT/name).relative_to(ROOT))})
        browser.close()
        if errors:raise RuntimeError(f'Browser errors: {errors}')
        if len(report['captures'])!=60 or any(c['canvasArt']!='generated-full-roster-atlases' for c in report['captures']):raise RuntimeError('Expected 60 production dunk captures')
        report['captureCount']=len(report['captures']);report['uncaughtBrowserErrors']=errors;(OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
        print(json.dumps({'captures':len(report['captures']),'ticks':ticks,'errors':errors,'out':str(OUT)}))
finally:
    server.terminate();server.wait(timeout=5)
