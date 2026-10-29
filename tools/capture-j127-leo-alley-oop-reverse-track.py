"""Capture Leo alley-oop-reverse track candidates through the production Jam Stage."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
ATTEMPT=int(environ.get('ATTEMPT','23'))
OUT=ROOT/f'tools/generate-art/previews/j127-leo-alley-oop-reverse-track-candidate/attempt-{ATTEMPT:02d}/native'
OUT.mkdir(parents=True,exist_ok=True)
COURT_Y=float(environ.get('COURT_Y','90'))
PLAYER_X=float(environ.get('PLAYER_X','100'))
PORT=environ.get('PORT','4222');URL=f'http://127.0.0.1:{PORT}/'
track=json.loads(environ.get('TRACK_JSON','{"height":[1.0,1.1,1.4,1.7,2.0,2.25,2.35,2.5,2.35,2.5,2.25,1.8,1.2,0.75,0.6],"forward":[6,8,9,8,4,-6,-8,-9,-9,-10,-11,-8,-3,1,3]}'))
ticks=[0,2,4,7,9,10,12,14,17,19,20,21,22,23,26]
z_by_tick={0:0,2:0,4:0,7:2.2699524987,9:3.5355339059,10:4.0450849719,12:4.7552825815,14:5,17:4.3301270189,19:3.2139380484,20:2.5,21:1.7101007166,22:.95,23:0,26:0}
release=json.loads(environ.get('RELEASE_JSON','{"21":[-12,2.25],"22":[-14,1.8],"23":[-16,1.0],"26":[-10,0.6]}'))
durations=[2,2,3,2,1,2,2,3,2,2,2,3,2,2,3]
atlas='./tools/generate-art/sources/j127-leo-alley-oop-reverse-attempt02-candidate-atlas.png'
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
report={'renderer':'Chromium production Jam Stage canvas','baseUrl':URL,'athlete':'leo','clip':'alley-oop-reverse','candidateTrack':track,'releasePositions':release,'captureMethod':'Stages canonical dunk z-height at authored frame starts; the incoming lob is an ownerless pass through tick9, attached to Leo from catch tick10 through tick20, then released as a separate ownerless dunk at tick21.','cameraSetup':'Temporary in-page dunk-alias selects the production Jam Stage dunk camera pan. Atlas pixels and courtY remain unchanged. The input zoom is divided by stageAttackZoom(player.z), preserving effective canvas zoom at the requested 100%/120% while the stage camera pans down by its production 42px peak amount.','playerX':PLAYER_X,'courtY':COURT_Y,'captures':[]}
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
        page.evaluate(f"""async()=>{{const image=new Image();image.src='{atlas}';await image.decode();window.__leoReverseAtlas=image;
          const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
          const candidate={{src:'{atlas}',columns:4,rows:4,reviewed:true,frames:Array.from({{length:15}},(_,i)=>({{x:(i%4)*128,y:Math.floor(i/4)*96,w:128,h:96}}))}};
          animationAssetManifest.characters.leo.directions.right['alley-oop-reverse']=candidate;
          animationAssetManifest.characters.leo.directions.right['dunk-alley-oop-reverse']=candidate;
          const {{animationClips}}=await import('/src/core/animation.js');animationClips['dunk-alley-oop-reverse']=animationClips['alley-oop-reverse'];
        }}""")
        # start once more after adding the temporary candidate to the manifest;
        # this makes the production loader put its atlas in the renderer image map.
        page.evaluate("window.jamverse.start('blackthorn-court-kings','chicago-condas',180,4)")
        page.wait_for_timeout(800)
        page.evaluate("(courtY)=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='leo');s.players=[p];p.x=100;p.y=courtY;p.z=0;p.facing=1;p.hasBall=true;p.animation={clip:'alley-oop-reverse',tick:0};p.anim='alley-oop-reverse';Object.assign(s.ball,{x:100,y:courtY,z:1,mode:'carried',ownerId:'leo',targetId:null,aerialTargetId:null,vx:0,vy:0,vz:0});s.pause=true;for(let i=0;i<120;i++)g.tick(1/60);s.pause=false}",COURT_Y)
        setup=page.evaluate("""()=>({playerCount:window.jamverse.state.players.length,playerIds:window.jamverse.state.players.map(p=>p.id),canvasCount:document.querySelectorAll('canvas').length,canvasRects:[...document.querySelectorAll('canvas')].map(c=>c.getBoundingClientRect().toJSON()),camera:'production stage dunk camera with temporary same-atlas dunk alias'})""")
        report['stageReset']=setup
        for zoom in [100,120]:
            for facing,direction in [(1,'right'),(-1,'left')]:
                for tick in ticks:
                    elapsed=0;frame=0
                    for frame,duration in enumerate(durations):
                        if tick<elapsed+duration:break
                        elapsed+=duration
                    if tick==21:frame=10
                    info=page.evaluate("""async({tick,frame,facing,z,track,release,atlas,courtY,playerX,requestedZoom})=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='leo');const stageZoom=1+.08*Math.max(0,Math.min(1,z/5)),inputZoom=requestedZoom/stageZoom,e=document.querySelector('#camera-zoom');e.value=String(inputZoom);e.dispatchEvent(new Event('input',{bubbles:true}));p.x=playerX;p.y=courtY;p.z=z;p.facing=facing;p.animation={clip:'dunk-alley-oop-reverse',tick};p.anim='dunk-alley-oop-reverse';p.hasBall=tick>=10&&tick<21;const h=track.height[frame],f=track.forward[frame];if(tick<10){s.ball.x=p.x+facing*f;s.ball.y=p.y;s.ball.z=p.z+h;s.ball.mode='pass';s.ball.ownerId=null}else if(tick<21){s.ball.x=p.x+facing*f;s.ball.y=p.y;s.ball.z=p.z+h;s.ball.mode='carried';s.ball.ownerId='leo'}else{const entry=release[String(tick)]??[f,p.z+h],point=Array.isArray(entry)?entry:(facing<0?entry.left:entry.right);const [dx,bz]=point;s.ball.x=p.x+facing*dx;s.ball.y=p.y;s.ball.z=bz;s.ball.mode='dunk';s.ball.ownerId=null}s.ball.targetId=null;s.ball.aerialTargetId=tick<10?'leo':null;s.ball.vx=0;s.ball.vy=0;s.ball.vz=0;g.tick(0);const {selectProductionSprite}=await import('/src/render/animation-sprites.js');const {animationAssetManifest}=await import('/src/content/animation-assets.js');const selected=selectProductionSprite(p,{manifest:animationAssetManifest,images:new Map([[atlas,window.__leoReverseAtlas]])});return{tick,frame,facing,z:p.z,ballMode:s.ball.mode,owner:s.ball.ownerId,aerialTarget:s.ball.aerialTargetId,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z},requestedZoom,effectiveZoom:inputZoom*stageZoom,stagePanY:42*Math.max(0,Math.min(1,z/5)),canvasArt:document.querySelector('#game').dataset.gameplayArt,selection:selected&&{src:selected.src,frame:selected.frame,flip:selected.flip,classification:selected.classification,production:selected.production}}}""",{'tick':tick,'frame':frame,'facing':facing,'z':z_by_tick[tick],'track':track,'release':release,'atlas':atlas,'courtY':COURT_Y,'playerX':PLAYER_X,'requestedZoom':zoom})
                    name=f'tick{tick:02d}-{direction}-zoom{zoom}.png';page.locator('#game').screenshot(path=str(OUT/name));report['captures'].append({**info,'zoom':zoom,'path':str((OUT/name).relative_to(ROOT))})
        browser.close()
        if errors:raise RuntimeError(f'Browser errors: {errors}')
        if len(report['captures'])!=60 or any(c['canvasArt']!='generated-full-roster-atlases' for c in report['captures']):raise RuntimeError('Expected 60 production dunk captures')
        if any(c['selection'] is None or c['selection']['src']!=atlas or c['selection']['flip']!=(c['facing']<0) for c in report['captures']):raise RuntimeError('Production selector mismatch: '+str(next((c for c in report['captures'] if c['selection'] is None or c['selection']['src']!=atlas or c['selection']['flip']!=(c['facing']<0)),None)))
        report['captureCount']=len(report['captures']);report['uncaughtBrowserErrors']=errors;(OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
        print(json.dumps({'captures':len(report['captures']),'ticks':ticks,'errors':errors,'out':str(OUT)}))
finally:
    server.terminate();server.wait(timeout=5)
