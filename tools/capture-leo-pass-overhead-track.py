"""Capture a provisional Leo overhead-pass ball path through the production Jam Stage."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'tools/generate-art/previews/leo-pass-overhead-track-candidate/attempt-08/native'
OUT.mkdir(parents=True,exist_ok=True)
PORT='4192';URL=f'http://127.0.0.1:{PORT}/'
track={'height':[1.1,2.3,2.3,2.7,3.2,1.25],'forward':[4.5,4.8,4.7,6.5,7,7]}
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
report={'renderer':'Chromium production Jam Stage canvas','baseUrl':URL,'athlete':'leo','clip':'pass-overhead','candidateTrack':track,'captures':[]}
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
        page.evaluate("window.jamverse.start('blackthorn-court-kings','chicago-condas',180,3)")
        page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='leo')")
        page.evaluate("""()=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='leo');s.players=[p];p.x=100;p.y=75;p.z=0;p.facing=1;p.hasBall=false;p.animation={clip:'idle',tick:0};Object.assign(s.ball,{x:100,y:75,z:0,mode:'dead',ownerId:null,aerialTargetId:null,vx:0,vy:0,vz:0});s.pause=true;for(let i=0;i<120;i++)g.tick(1/60);s.pause=false}""")
        page.evaluate("""async()=>{const a=await import('/src/core/animation.js');window.__pass={timings:a.animationClips['pass-overhead'].frames.map(x=>x.duration)}}""");page.evaluate('track=>window.__candidateTrack=track',track)
        ticks=[0,2,6,7,8,10]
        for zoom in [100,120]:
            page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}',zoom)
            for facing,direction in [(1,'right'),(-1,'left')]:
                for tick in ticks:
                    info=page.evaluate("""({tick,facing})=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='leo'),a=window.__pass;p.x=100;p.y=75;p.facing=facing;p.animation={clip:'pass-overhead',tick};p.anim='pass-overhead';p.hasBall=tick<7;const frame=tick===0?0:tick===2?1:tick===6?2:tick===7?3:tick===8?4:5;let height=window.__candidateTrack.height[frame],forward=window.__candidateTrack.forward[frame];if(tick>=7){height=window.__candidateTrack.height[3]+(tick-7)*.04;forward=window.__candidateTrack.forward[3]+(tick-7)*1.4}s.ball.x=p.x+facing*forward;s.ball.y=p.y;s.ball.z=height;s.ball.mode=tick<7?'carried':'free';s.ball.ownerId=tick<7?'leo':null;s.ball.aerialTargetId=null;s.ball.vx=0;s.ball.vy=0;s.ball.vz=0;g.tick(0);return{tick,facing,ballMode:s.ball.mode,owner:s.ball.ownerId,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z},canvasArt:document.querySelector('#game').dataset.gameplayArt}}""",{'tick':tick,'facing':facing})
                    name=f'tick{tick:02d}-{direction}-zoom{zoom}.png';page.locator('#game').screenshot(path=str(OUT/name))
                    report['captures'].append({**info,'frame':0 if tick<2 else 1 if tick<5 else 2 if tick<7 else 3 if tick<8 else 4 if tick<10 else 5,'zoom':zoom,'path':str((OUT/name).relative_to(ROOT))})
        browser.close()
        if errors: raise RuntimeError(f'Browser errors: {errors}')
        if len(report['captures'])!=24 or any(c['canvasArt']!='generated-full-roster-atlases' for c in report['captures']):raise RuntimeError('Expected 24 production overhead-pass captures')
        report['captureCount']=len(report['captures']);report['uncaughtBrowserErrors']=errors
        (OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
        print(json.dumps({'captures':len(report['captures']),'ticks':ticks,'errors':errors,'out':str(OUT)}))
finally:
    server.terminate();server.wait(timeout=5)
