"""Capture a provisional Leo layup track in the centered production Jam Stage."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'tools/generate-art/previews/leo-layup-track-candidate/attempt-04/native'
OUT.mkdir(parents=True,exist_ok=True)
PORT='4194';URL=f'http://127.0.0.1:{PORT}/'
track={'height':[.95,.8,2.0,2.6,2.35,1.8,.95,.6],'forward':[5,3,5,4.5,14,11,7,5]}
durations=[2,3,3,2,1,3,4,4]
player_z={'0':0,'2':0,'5':1.111140466,'8':1.847759065,'9':1.961570561,'10':2,'11':1.961570561,'14':1.414213562,'18':0}
released_ball={'10':(13.9126163,3.9136596),'11':(13.8252326,4.9513191),'14':(13.5630814,7.9082979),'18':(13.2135465,11.4869362)}
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
report={'renderer':'Chromium production Jam Stage canvas','baseUrl':URL,'athlete':'leo','clip':'layup','candidateTrack':track,'captureMethod':'staged authored poses centered at x100/y75; pre-release ball follows the proposed hand track; post-release positions reference direct simulation samples. Gameplay ownership/release is verified separately.','captures':[]}
try:
    deadline=monotonic()+20
    while monotonic()<deadline:
        if server.poll() is not None: raise RuntimeError('Jam Stage server exited before ready')
        try:
            with urlopen(URL,timeout=1) as response:
                if response.status==200: break
        except Exception: sleep(.1)
    else: raise TimeoutError('Jam Stage server did not become ready')
    with sync_playwright() as pwt:
        browser=pwt.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        page=browser.new_page(viewport={'width':900,'height':700},device_scale_factor=1)
        errors=[];page.on('pageerror',lambda exc:errors.append(str(exc)))
        page.add_init_script('window.requestAnimationFrame=()=>0')
        page.goto(URL,wait_until='networkidle',timeout=120000)
        page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105',timeout=120000)
        page.evaluate("window.jamverse.start('blackthorn-court-kings','chicago-condas',180,110)")
        page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='leo')")
        page.evaluate("""()=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='leo');s.players=[p];p.x=100;p.y=75;p.z=0;p.facing=1;p.hasBall=false;p.animation={clip:'idle',tick:0};Object.assign(s.ball,{x:100,y:75,z:0,mode:'dead',ownerId:null,aerialTargetId:null,vx:0,vy:0,vz:0});s.pause=true;for(let i=0;i<120;i++)g.tick(1/60);s.pause=false}""")
        page.evaluate('track=>window.__candidateTrack=track',track)
        ticks=[0,2,5,8,9,10,11,14,18]
        for zoom in [100,120]:
            page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}',zoom)
            for facing,direction in [(1,'right'),(-1,'left')]:
                for tick in ticks:
                    info=page.evaluate("""({tick,facing,zByTick,release})=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='leo'),d=[2,3,3,2,1,3,4,4];let elapsed=0,frame=0;for(;frame<d.length-1;frame++){if(tick<elapsed+d[frame])break;elapsed+=d[frame]}p.x=100;p.y=75;p.z=zByTick[tick]??0;p.facing=facing;p.animation={clip:'layup',tick};p.anim='layup';const h=window.__candidateTrack.height[frame],f=window.__candidateTrack.forward[frame];if(tick<10){p.hasBall=true;s.ball.x=p.x+facing*f;s.ball.y=p.y;s.ball.z=p.z+h;s.ball.mode='carried';s.ball.ownerId='leo'}else{p.hasBall=false;const[dx,bz]=release[tick];s.ball.x=p.x+facing*dx;s.ball.y=p.y;s.ball.z=bz;s.ball.mode='shot';s.ball.ownerId=null}s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.vx=s.ball.vy=s.ball.vz=0;g.tick(0);return{tick,frame,facing,playerZ:p.z,ballMode:s.ball.mode,owner:s.ball.ownerId,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z},canvasArt:document.querySelector('#game').dataset.gameplayArt}}""",{'tick':tick,'facing':facing,'zByTick':player_z,'release':released_ball})
                    name=f'tick{tick:02d}-{direction}-zoom{zoom}.png';page.locator('#game').screenshot(path=str(OUT/name))
                    report['captures'].append({**info,'zoom':zoom,'path':str((OUT/name).relative_to(ROOT))})
        browser.close()
        if errors: raise RuntimeError(f'Browser errors: {errors}')
        if len(report['captures'])!=36 or any(c['canvasArt']!='generated-full-roster-atlases' for c in report['captures']):raise RuntimeError('Expected 36 production layup captures')
        report['captureCount']=len(report['captures']);report['uncaughtBrowserErrors']=errors
        (OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
        print(json.dumps({'captures':len(report['captures']),'ticks':ticks,'errors':errors,'out':str(OUT)}))
finally:
    server.terminate();server.wait(timeout=5)
