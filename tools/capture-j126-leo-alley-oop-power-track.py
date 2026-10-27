"""Capture Leo alley-oop-power ball-track candidate through production Jam Stage."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
ATTEMPT=int(environ.get('ATTEMPT','1'))
OUT=ROOT/f'tools/generate-art/previews/leo-alley-oop-power-track-candidate/attempt-{ATTEMPT:02d}/native'
OUT.mkdir(parents=True,exist_ok=True)
PORT='4221';URL=f'http://127.0.0.1:{PORT}/'
track=json.loads(environ.get('TRACK_JSON','{"height":[1.0,1.2,1.5,1.7,1.8,1.9,2.0,1.7,1.4,1.2,1.0,0.9,0.8,0.65,0.55],"forward":[6,8,10,8,6,4,2,1,2,6,10,12,9,7,6]}'))
ticks=[0,2,4,7,9,10,12,14,17,19,20,21,22,23,26]
z_by_tick={0:0,2:0,4:0,7:2.2699524987,9:3.5355339059,10:4.0450849719,12:4.7552825815,14:5,17:4.3301270189,19:3.2139380484,20:2.5,21:1.7101007166,22:.95,23:0,26:0}
release=json.loads(environ.get('RELEASE_JSON','{"21":[6,2.3],"22":[8,1.8],"23":[10,1.0],"26":[12,0.6]}'))
durations=[2,2,3,2,1,2,2,3,2,2,2,3,2,2,3]
atlas='./public/assets/animation/leo-alley-oop-power-attempt02-right.webp'
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
report={'renderer':'Chromium production Jam Stage canvas','baseUrl':URL,'athlete':'leo','clip':'alley-oop-power','candidateTrack':track,'releasePositions':release,'captureMethod':'Stages canonical dunk z-height at authored frame starts and carries ball using Leo-specific candidate offsets through tick20; post-release ball is separate ownerless dunk state.','captures':[]}
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
        page.evaluate(f"""async()=>{{const image=new Image();image.src='{atlas}';await image.decode();window.__leoDoubleAtlas=image;
          const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
          animationAssetManifest.characters.leo.directions.right['alley-oop-power']={{src:'{atlas}',columns:4,rows:4,reviewed:true,frames:Array.from({{length:15}},(_,i)=>({{x:(i%4)*128,y:Math.floor(i/4)*96,w:128,h:96}}))}};
        }}""")
        # start once more after adding the temporary candidate to the manifest;
        # this makes the production loader put its atlas in the renderer image map.
        page.evaluate("window.jamverse.start('blackthorn-court-kings','chicago-condas',180,4)")
        page.wait_for_timeout(800)
        page.evaluate("""()=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='leo');s.players=[p];p.x=100;p.y=75;p.z=0;p.facing=1;p.hasBall=true;p.animation={clip:'alley-oop-power',tick:0};p.anim='alley-oop-power';Object.assign(s.ball,{x:100,y:75,z:1,mode:'carried',ownerId:'leo',targetId:null,aerialTargetId:null,vx:0,vy:0,vz:0});s.pause=true;for(let i=0;i<120;i++)g.tick(1/60);s.pause=false}""")
        setup=page.evaluate("""()=>({playerCount:window.jamverse.state.players.length,playerIds:window.jamverse.state.players.map(p=>p.id),canvasCount:document.querySelectorAll('canvas').length,canvasRects:[...document.querySelectorAll('canvas')].map(c=>c.getBoundingClientRect().toJSON())})""")
        report['stageReset']=setup
        for zoom in [100,120]:
            page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}',zoom)
            for facing,direction in [(1,'right'),(-1,'left')]:
                for tick in ticks:
                    elapsed=0;frame=0
                    for frame,duration in enumerate(durations):
                        if tick<elapsed+duration:break
                        elapsed+=duration
                    if tick==21:frame=10
                    info=page.evaluate("""async({tick,frame,facing,z,track,release,atlas})=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='leo');p.x=100;p.y=75;p.z=z;p.facing=facing;p.animation={clip:'alley-oop-power',tick};p.anim='alley-oop-power';p.hasBall=tick<21;const h=track.height[frame],f=track.forward[frame];if(tick<21){s.ball.x=p.x+facing*f;s.ball.y=p.y;s.ball.z=p.z+h;s.ball.mode='carried';s.ball.ownerId='leo'}else{const [dx,bz]=release[String(tick)]??[f,p.z+h];s.ball.x=p.x+facing*dx;s.ball.y=p.y;s.ball.z=bz;s.ball.mode='dunk';s.ball.ownerId=null}s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.vx=0;s.ball.vy=0;s.ball.vz=0;g.tick(0);const {selectProductionSprite}=await import('/src/render/animation-sprites.js');const {animationAssetManifest}=await import('/src/content/animation-assets.js');const selected=selectProductionSprite(p,{manifest:animationAssetManifest,images:new Map([[atlas,window.__leoDoubleAtlas]])});return{tick,frame,facing,z:p.z,ballMode:s.ball.mode,owner:s.ball.ownerId,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z},canvasArt:document.querySelector('#game').dataset.gameplayArt,selection:selected&&{src:selected.src,frame:selected.frame,flip:selected.flip,classification:selected.classification,production:selected.production}}}""",{'tick':tick,'frame':frame,'facing':facing,'z':z_by_tick[tick],'track':track,'release':release,'atlas':atlas})
                    name=f'tick{tick:02d}-{direction}-zoom{zoom}.png';page.locator('#game').screenshot(path=str(OUT/name));report['captures'].append({**info,'zoom':zoom,'path':str((OUT/name).relative_to(ROOT))})
        browser.close()
        if errors:raise RuntimeError(f'Browser errors: {errors}')
        if len(report['captures'])!=60 or any(c['canvasArt']!='generated-full-roster-atlases' for c in report['captures']):raise RuntimeError('Expected 60 production dunk captures')
        if any(c['selection'] is None or c['selection']['src']!=atlas or c['selection']['flip']!=(c['facing']<0) for c in report['captures']):raise RuntimeError(f"Production selector did not return Leo atlas: {report['captures'][0].get('selection')}")
        report['captureCount']=len(report['captures']);report['uncaughtBrowserErrors']=errors;(OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
        print(json.dumps({'captures':len(report['captures']),'ticks':ticks,'errors':errors,'out':str(OUT)}))
finally:
    server.terminate();server.wait(timeout=5)
