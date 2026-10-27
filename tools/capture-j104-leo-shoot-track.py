"""Capture J104 Leo shoot ball-track candidates in production Jam Stage."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
ATTEMPT=int(environ.get('ATTEMPT','1'))
OUT=ROOT/f'tools/generate-art/previews/j104-leo-shoot-track-candidate/attempt-{ATTEMPT:02d}/native'
OUT.mkdir(parents=True,exist_ok=True)
COURT_Y=float(environ.get('COURT_Y','90'))
PORT='4224';URL=f'http://127.0.0.1:{PORT}/'
TRACK=json.loads(environ.get('TRACK_JSON','{"height":[0.95,1.1,1.25,1.55,1.9,2.15,2.1,1.8,1.35,1.05],"forward":[6,7.5,8.5,9.5,10.5,11.5,10.5,8.5,6.5,5.5]}'))
FRAME_TICKS=[0,3,6,8,10,13,14,16,19,23]
TICKS=[0,3,6,8,10,11,12,13,14,16,19,23]
DURATIONS=[3,3,2,2,3,1,2,3,4,4]
Z={0:0,3:0,6:.75,8:1.5,10:2.25,11:2.5,12:2.75,13:3.0,14:2.9,16:2.5,19:1.5,23:0}
RELEASE=json.loads(environ.get('RELEASE_JSON','{"13":[12,5.15],"14":[14,5.4],"16":[18,5.6],"19":[26,4.9],"23":[38,2.4]}'))
ATLAS='./public/assets/animation/leo-shoot-right.webp'
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
report={'renderer':'Chromium production Jam Stage canvas','baseUrl':URL,'athlete':'leo','clip':'shoot','candidateAtlas':ATLAS,'candidateTrack':TRACK,'releasePositions':RELEASE,'court':'scoria-rams vs blackthorn-court-kings','courtY':COURT_Y,'grid':'10 authored frame starts plus interpolated release approach ticks 11/12, both facings × 100%/120% = 48 captures','captureMethod':'Atlas override is installed before the single Jam Stage start; ball remains separate and is positioned on the candidate hand track until release tick13, then follows reviewed free-flight sample coordinates.','captures':[]}
try:
 deadline=monotonic()+30
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
  page.evaluate(f"""async()=>{{
   const image=new Image();image.src='{ATLAS}';await image.decode();window.__leoShootAtlas=image;
   const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
   animationAssetManifest.characters.leo.directions.right.shoot={{src:'{ATLAS}',columns:5,rows:2,reviewed:true,mirrorSafe:true,frames:Array.from({{length:10}},(_,i)=>({{x:(i%5)*64,y:Math.floor(i/5)*96,w:64,h:96}}))}};
   window.jamverse.start('scoria-rams','blackthorn-court-kings',180,4);
  }}""")
  page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='leo')")
  page.wait_for_timeout(500)
  page.evaluate("(courtY)=>{const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='leo');s.players=[p];p.x=100;p.y=courtY;p.z=0;p.facing=1;p.animation={clip:'shoot',tick:0};p.anim='shoot';p.hasBall=true;s.ball.x=p.x+6;s.ball.y=p.y;s.ball.z=.95;s.ball.mode='carried';s.ball.ownerId='leo';s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.vx=s.ball.vy=s.ball.vz=0;s.pause=true;for(let i=0;i<120;i++)g.tick(1/60);s.pause=false}",COURT_Y)
  report['stageReset']=page.evaluate("()=>({playerIds:window.jamverse.state.players.map(p=>p.id),canvasCount:document.querySelectorAll('canvas').length,canvasRects:[...document.querySelectorAll('canvas')].map(c=>c.getBoundingClientRect().toJSON())})")
  for zoom in [100,120]:
   page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}',zoom)
   for facing,direction in [(1,'right'),(-1,'left')]:
    for tick in TICKS:
     frame=max(i for i,start in enumerate(FRAME_TICKS) if start<=tick)
     progress=min(1,(tick-FRAME_TICKS[frame])/DURATIONS[frame])
     info=page.evaluate("""async({frame,tick,progress,facing,z,track,release,atlas,courtY})=>{
      const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='leo');p.x=100;p.y=courtY;p.z=z;p.facing=facing;p.animation={clip:'shoot',tick};p.anim='shoot';p.hasBall=tick<13;
      if(tick<13){const h=track.height[frame]+(track.height[Math.min(frame+1,9)]-track.height[frame])*progress,f=track.forward[frame]+(track.forward[Math.min(frame+1,9)]-track.forward[frame])*progress;s.ball.x=p.x+facing*f;s.ball.y=p.y;s.ball.z=p.z+h;s.ball.mode='carried';s.ball.ownerId='leo'}
      else{const [dx,bz]=release[String(tick)]??[track.forward[frame],p.z+track.height[frame]];s.ball.x=p.x+facing*dx;s.ball.y=p.y;s.ball.z=bz;s.ball.mode='shot';s.ball.ownerId=null}
      s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.vx=s.ball.vy=s.ball.vz=0;g.tick(0);
      const {selectProductionSprite}=await import('/src/render/animation-sprites.js');const {animationAssetManifest}=await import('/src/content/animation-assets.js');
      const selected=selectProductionSprite(p,{manifest:animationAssetManifest,images:new Map([[atlas,window.__leoShootAtlas]])});
      return{tick,frame,facing,z:p.z,ballMode:s.ball.mode,owner:s.ball.ownerId,ball:{x:s.ball.x,y:s.ball.y,z:s.ball.z},canvasArt:document.querySelector('#game').dataset.gameplayArt,selection:selected&&{src:selected.src,frame:selected.frame,flip:selected.flip,classification:selected.classification,production:selected.production}}
     }""",{'frame':frame,'tick':tick,'progress':progress,'facing':facing,'z':Z[tick],'track':TRACK,'release':RELEASE,'atlas':ATLAS,'courtY':COURT_Y})
     name=f'frame{frame:02d}-tick{tick:02d}-{direction}-zoom{zoom}.png';page.locator('#game').screenshot(path=str(OUT/name));report['captures'].append({**info,'zoom':zoom,'path':str((OUT/name).relative_to(ROOT))})
  browser.close()
  if errors: raise RuntimeError(f'Browser errors: {errors}')
  if len(report['captures'])!=48 or any(c['canvasArt']!='generated-full-roster-atlases' for c in report['captures']):raise RuntimeError('Expected 48 native Jam Stage captures')
  bad=next((c for c in report['captures'] if c['selection'] is None or c['selection']['src']!=ATLAS or c['selection']['frame']!=c['frame'] or c['selection']['flip']!=(c['facing']<0)),None)
  if bad:raise RuntimeError('Production selector mismatch: '+str(bad))
  report['captureCount']=len(report['captures']);report['uncaughtBrowserErrors']=errors;(OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
  print(json.dumps({'attempt':ATTEMPT,'captures':len(report['captures']),'ticks':TICKS,'track':TRACK,'errors':errors,'output':str(OUT)}))
finally:
 server.terminate();server.wait(timeout=5)
