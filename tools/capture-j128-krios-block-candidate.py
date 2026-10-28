"""Capture Krios block art in Jam Stage with a candidate atlas before registration."""
from pathlib import Path
from os import environ
from subprocess import Popen,DEVNULL
from time import monotonic,sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
RUNTIME_INTEGRATION=environ.get('RUNTIME_INTEGRATION','0')=='1'
ATLAS=environ.get('ATLAS','./public/assets/animation/krios-block-right.webp' if RUNTIME_INTEGRATION else './tools/generate-art/previews/krios-block4-attempt01/krios-block4-attempt01-runtime-candidate.png')
ATTEMPT=environ.get('ATTEMPT','01');PORT=environ.get('PORT','4228');URL=f'http://127.0.0.1:{PORT}/';COURT_Y=int(environ.get('COURT_Y','90'))
OUT=ROOT/(f'tools/generate-art/previews/j128-krios-block-candidate/attempt-{ATTEMPT}/registered-runtime' if RUNTIME_INTEGRATION else f'tools/generate-art/previews/j128-krios-block-candidate/attempt-{ATTEMPT}/native');OUT.mkdir(parents=True,exist_ok=True)
TICKS=[1,2,5,8]
report={'renderer':'Chromium production Jam Stage canvas','athlete':'krios','clip':'block','atlas':ATLAS,'runtimeIntegration':RUNTIME_INTEGRATION,'candidateAtlasInjected':not RUNTIME_INTEGRATION,'court':'current Jam Stage court geometry; Scoria Rams vs Blackthorn Court Kings','courtY':COURT_Y,'sampleTicks':TICKS,'captureMethod':'Candidate atlas is added to the in-memory manifest before app initialization. After the match starts, the harness waits for the candidate file to decode and places that loaded image in the actual app productionSpriteImages map before triggering the real defensive block input. Production stepMatch and renderer advance the player and camera; the block has no ball track and no ball is injected or painted.','runs':[],'uncaughtBrowserErrors':[]}
if RUNTIME_INTEGRATION:report['captureMethod']='No manifest or candidate-art injection. beginMatch loads the registered public atlas through the normal loadProductionSprites path; the harness waits for that exact productionSpriteImages entry to finish loading before real block input. Production stepMatch and renderer advance the player/camera; no ball track applies and no ball is painted.'
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
try:
 deadline=monotonic()+30
 while monotonic()<deadline:
  if server.poll() is not None:raise RuntimeError('server exited')
  try:
   with urlopen(URL,timeout=1) as r:
    if r.status==200:break
  except Exception:sleep(.1)
 else:raise TimeoutError('server startup')
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  for zoom in (100,120):
   for facing,direction in ((1,'right'),(-1,'left')):
    page=browser.new_page(viewport={'width':900,'height':700});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    def inject(route):
     response=route.fetch();body=response.text();marker='export const animationAssetManifest = '
     if marker not in body:raise RuntimeError('manifest export missing')
     code=f"\nanimationAssetManifest.characters.krios.directions.right.block={{src:'{ATLAS}',columns:4,rows:1,reviewed:true,mirrorSafe:true,frames:Array.from({{length:4}},(_,i)=>({{x:i*128,y:0,w:128,h:96}}))}};\n"
     route.fulfill(response=response,body=body+code)
    if not RUNTIME_INTEGRATION:page.route('**/src/content/animation-assets.js',inject)
    def expose_main(route):
     response=route.fetch();route.fulfill(response=response,body=response.text()+'\nwindow.__productionSpriteImagesForReview=productionSpriteImages;\n')
    page.route('**/src/main.js',expose_main)
    page.add_init_script(f'window.requestAnimationFrame=()=>0;window.__runtimeIntegration={str(RUNTIME_INTEGRATION).lower()}')
    page.goto(URL,wait_until='networkidle',timeout=120000)
    page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105',timeout=120000)
    home='scoria-rams' if facing>0 else 'blackthorn-court-kings';away='blackthorn-court-kings' if facing>0 else 'scoria-rams'
    page.evaluate('''async({home,away,zoom,facing,courtY,atlas})=>{
      const {animationAssetManifest}=await import('/src/content/animation-assets.js');
      const entry=animationAssetManifest.characters.krios.directions.right.block;
      if(!entry||entry.src!==atlas||!entry.reviewed||entry.frames?.length!==4)throw Error('block atlas registration missing or review pending');
      window.jamverse.start(home,away,180,31);
      const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='krios');
      document.querySelector('#camera-zoom').value=String(zoom);document.querySelector('#camera-zoom').dispatchEvent(new Event('input',{bubbles:true}));
      s.players=[p];s.possession=1-p.team;s.pause=false;s.phase='playing';s.score=[0,0];
      p.x=facing>0?176:24;p.y=courtY;p.vx=p.vy=p.z=0;p.vz=0;p.facing=facing;p.hasBall=false;p.stun=0;p.animation={clip:'idle',tick:0};p.anim='idle';
      Object.assign(s.ball,{mode:'dead',ownerId:null,targetId:null,attemptId:null,scored:false,vx:0,vy:0,vz:0,x:p.x,y:p.y,z:0});
      for(let i=0;i<90;i++)g.tick(1,[{playerId:p.id,x:0,y:0}]);
      p.x=facing>0?176:24;p.y=courtY;p.vx=p.vy=p.z=0;p.vz=0;p.facing=facing;p.animation={clip:'idle',tick:0};p.anim='idle';
      return {p:p.id,team:p.team,x:p.x,y:p.y};
    }''',{'home':home,'away':away,'zoom':zoom,'facing':facing,'courtY':COURT_Y,'atlas':ATLAS})
    if RUNTIME_INTEGRATION:
     try:page.wait_for_function('(src)=>{const image=window.__productionSpriteImagesForReview?.get(src);return Boolean(image?.complete&&image.naturalWidth)}',arg=ATLAS,timeout=30000,polling=100)
     except Exception as error:
      state=page.evaluate('(src)=>({entries:[...(window.__productionSpriteImagesForReview??new Map())].map(([key,image])=>({key,complete:image.complete,width:image.naturalWidth})),expected:src,roster:window.jamverse.state?.players?.map(player=>player.id)})',ATLAS)
      raise RuntimeError(f'registered atlas failed to load through the normal app path: {json.dumps(state)}') from error
    # Trigger block through the game input path and capture its start frame immediately.
    page.evaluate('''()=>{const g=window.jamverse,p=g.state.players[0];g.tick(1,[{playerId:p.id,blockPressed:true}]);}''')
    run={'facing':facing,'direction':direction,'home':home,'away':away,'zoom':zoom,'captures':[]}
    for tick in TICKS:
     current=page.evaluate('''({target})=>{const g=window.jamverse,s=g.state,p=s.players[0];while(p.animation.tick<target){g.tick(1,[{playerId:p.id,x:0,y:0}]);}
       const {animationAssetManifest}=window.__none||{};
       return {tick:p.animation.tick,clip:p.animation.clip,frame:p.animation.tick,anim:p.anim,z:p.z,vz:p.vz,hasBall:p.hasBall,blocks:p.blocks,ballMode:s.ball.mode,ballOwner:s.ball.ownerId,score:s.score};}''',{'target':tick})
     # inspect the same production image map used by drawAthlete
     selected=page.evaluate('''async({tick,atlas})=>{const g=window.jamverse,p=g.state.players[0];const {animationAssetManifest}=await import('/src/content/animation-assets.js');
       const {selectProductionSprite}=await import('/src/render/animation-sprites.js');
       const images=window.__productionSpriteImagesForReview;const image=images.get(atlas);const s=selectProductionSprite(p,{manifest:animationAssetManifest,images});return {frame:s?.frame,src:s?.src,flip:s?.flip,productionImageReady:Boolean(image?.complete&&image.naturalWidth)};}''',{'tick':tick,'atlas':ATLAS})
     if tick>0: current=page.evaluate('''()=>{const p=window.jamverse.state.players[0],s=window.jamverse.state;return {tick:p.animation.tick,clip:p.animation.clip,anim:p.anim,z:p.z,vz:p.vz,hasBall:p.hasBall,blocks:p.blocks,ballMode:s.ball.mode,ballOwner:s.ball.ownerId,score:s.score};}''')
     if current['clip']!='block' or selected['src']!=ATLAS or selected['frame']!=tick//([2,3,3,4][0]):
      # Resolve frames by the canonical duration table rather than hand assumptions.
      frame=0
      for duration in [2,3,3,4]:
       if tick>=duration:tick-=duration;frame+=1
       else:break
      if current['clip']!='block' or selected['src']!=ATLAS or selected['frame']!=frame:raise RuntimeError(f'selection mismatch {current} {selected} expected frame{frame}')
     name=f'{direction}-frame{selected["frame"]}-tick{current["tick"]}-zoom{zoom}.png';path=OUT/name;page.locator('#game').screenshot(path=str(path))
     row={**current,**selected,'zoom':zoom,'path':path.relative_to(ROOT).as_posix()};run['captures'].append(row)
     if current['hasBall'] or current['ballMode']!='dead' or current['ballOwner'] is not None:raise RuntimeError('ball ownership/mode changed during ball-free block')
    report['runs'].append(run)
    if errors:raise RuntimeError('browser errors '+json.dumps(errors))
    page.close()
  browser.close()
 report['uncaughtBrowserErrors']=[];report['captureCount']=sum(len(x['captures']) for x in report['runs']);(OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'captures':report['captureCount'],'runs':len(report['runs']),'errors':report['uncaughtBrowserErrors'],'output':str(OUT)}))
finally:
 server.terminate();server.wait(timeout=5)
