"""Capture J104's candidate shoot through real Jamverse simulation and ball physics."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/environ.get('OUT_REL','tools/generate-art/previews/j104-leo-shoot-track-candidate/attempt-07/gameplay/rendered-courty90')
OUT.mkdir(parents=True,exist_ok=True)
PORT='4228';URL=f'http://127.0.0.1:{PORT}/'
COURT_Y=float(environ.get('COURT_Y','90'))
RELEASE_VZ=float(environ.get('RELEASE_VZ','nan'))
USE_CANDIDATE_TRACK=environ.get('USE_CANDIDATE_TRACK','0')=='1'
ATLAS='./public/assets/animation/leo-shoot-right.webp'
TRACK=json.loads(environ.get('TRACK_JSON', '{"height":[0.95,1.1,2.1,2.1,2.7,7.5,6.5,4.5,2.1,1.05],"forward":[6,7,6.5,4,3,4,4,4,6.5,5.5]}'))
FRAME_TICKS=[0,3,6,8,10,13,14,16,19,23]
DURATIONS=[3,3,2,2,3,1,2,3,4,4]
RENDER_TICKS=[13,14,16,19,23]
server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':PORT},stdout=DEVNULL,stderr=DEVNULL)
report={'renderer':'Current Jam Stage canvas','simulation':'window.jamverse.tick -> src/core/simulation.js stepMatch','athlete':'leo','clip':'shoot','candidateTrack':TRACK,'releaseTick':13,'candidateReleaseVz':None if not (RELEASE_VZ==RELEASE_VZ) else RELEASE_VZ,'releasePath':'Actual simulation advances continuously. Before release, the separately rendered carried ball is aligned to candidate track. With no RELEASE_VZ override, release position and launch are entirely production makeShot/integrateBall; an explicit RELEASE_VZ is a separate calibration variant. No post-release coordinate samples or screenshot-time ball teleports are assigned.','targetCaptures':RENDER_TICKS+['score-complete'],'zoomLevels':[100,120],'facings':[]}
try:
 deadline=monotonic()+30
 while monotonic()<deadline:
  if server.poll() is not None: raise RuntimeError('Jam Stage server exited before readiness')
  try:
   with urlopen(URL,timeout=1) as response:
    if response.status==200:break
  except Exception:sleep(.1)
 else:raise TimeoutError('Jam Stage server did not become ready')
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  page=browser.new_page(viewport={'width':900,'height':700},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda exc:errors.append(str(exc)))
  page.add_init_script('window.requestAnimationFrame=()=>0')
  page.goto(URL,wait_until='networkidle',timeout=120000)
  page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105',timeout=120000)
  report['productionReleaseVz'] = page.evaluate("async()=>{const a=await import('/src/core/animation.js');return a.sampleBallReleaseVz('shoot','leo')}")
  page.evaluate(f"""async()=>{{
   const image=new Image();image.src='{ATLAS}';await image.decode();window.__leoShootAtlas=image;
   const {{animationAssetManifest}}=await import('/src/content/animation-assets.js');
   animationAssetManifest.characters.leo.directions.right.shoot={{src:'{ATLAS}',columns:5,rows:2,reviewed:true,mirrorSafe:true,frames:Array.from({{length:10}},(_,i)=>({{x:(i%5)*64,y:Math.floor(i/5)*96,w:64,h:96}}))}};
  }}""")
  snapshots=[]
  for facing,label in [(1,'right'),(-1,'left')]:
   capture_rows=[]
   page.evaluate("(facing)=>window.jamverse.start('blackthorn-court-kings','scoria-rams',180,4)",facing)
   page.wait_for_function("window.jamverse.state && window.jamverse.state.players.some(p=>p.id==='leo')")
   page.evaluate("""({facing,track,courtY})=>{
     const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='leo');s.practice=true;s.clock=1000;s.shotClock=24;s.pause=false;s.scorePause=0;s.phase='playing';
     for(const q of s.players){q.vx=q.vy=q.vz=q.z=0;q.stun=0;if(q.team!==p.team){q.x=20;q.y=q===s.players.find(x=>x.team!==p.team)?5:95}else if(q!==p){q.x=100;q.y=5}q.hasBall=false}
     p.x=130;p.y=courtY;p.facing=facing;p.hasBall=true;p.charge=0;p.animation={clip:'idle-ball',tick:0};p.anim='idle-ball';s.possession=p.team;
     s.ball.mode='carried';s.ball.ownerId=p.id;s.ball.targetId=null;s.ball.aerialTargetId=null;s.ball.lastTouch=p.id;s.ball.vx=s.ball.vy=s.ball.vz=0;
     const FRAME_TICKS=[0,3,6,8,10,13,14,16,19,23],DURATIONS=[3,3,2,2,3,1,2,3,4,4];const setTrackPoint=()=>{const t=p.animation.tick;let frame=0;for(let i=0;i<FRAME_TICKS.length;i++)if(FRAME_TICKS[i]<=t)frame=i;const next=Math.min(frame+1,track.height.length-1),progress=Math.max(0,Math.min(1,(t-FRAME_TICKS[frame])/DURATIONS[frame])),lerp=(x,y)=>x+(y-x)*progress;s.ball.x=p.x+p.facing*lerp(track.forward[frame],track.forward[next]);s.ball.y=p.y;s.ball.z=p.z+lerp(track.height[frame],track.height[next]);s.ball.mode='carried';s.ball.ownerId=p.id};
     window.__j104={p,s,track,setTrackPoint,released:false};
   }""",{'facing':facing,'track':TRACK,'courtY':COURT_Y})
   page.evaluate('(vz)=>window.__j104CandidateVz=vz',RELEASE_VZ)
   page.evaluate('(enabled)=>window.__j104UseCandidate=enabled',USE_CANDIDATE_TRACK)
   input_frames=lambda shoot=False: page.evaluate("""({shoot})=>window.jamverse.state.players.map(p=>({playerId:p.id,x:0,y:0,shootPressed:shoot&&p.id==='leo'}))""",{'shoot':shoot})
   page.evaluate("()=>window.jamverse.tick(1,window.jamverse.state.players.map(p=>({playerId:p.id,x:0,y:0,shootPressed:p.id==='leo'})))")
   if USE_CANDIDATE_TRACK: page.evaluate("()=>{const c=window.__j104;c.setTrackPoint();window.jamverse.tick(0)}")
   shot_id=None;captured_ticks=set();score_captured=False
   max_steps=180
   previous=page.evaluate("()=>({clip:window.__j104.p.animation.clip,tick:window.__j104.p.animation.tick,ballMode:window.__j104.s.ball.mode})")
   for step in range(max_steps):
    page.evaluate("()=>window.jamverse.tick(1,window.jamverse.state.players.map(p=>({playerId:p.id,x:0,y:0})))")
    state=page.evaluate("""async()=>{
      const {flightHeightFromHand}=await import('/src/core/animation.js');
      const c=window.__j104,{p,s,track}=c,b=s.ball,t=p.animation.tick;const candidateVz=window.__j104CandidateVz;
      if(b.mode==='shot'&&!c.released){
        c.makeShotFacts={clip:p.animation.clip,tick:p.animation.tick,vzBeforeCapture:b.vz};
        const height=b.z,made=b.made;
        if(Number.isFinite(candidateVz)){
          const dx=p.facing*track.forward[5],candidateHeight=flightHeightFromHand(track.height[5],p.z);
          const hoop=b.targetX,releaseX=p.x+dx,distance=Math.abs(hoop-releaseX);
          b.x=releaseX;b.y=p.y;b.z=candidateHeight;b.vz=made?candidateVz:b.vz;
          const descent=(b.vz+Math.sqrt(b.vz*b.vz+4*.013*(candidateHeight-2.6)))/.026;
          b.vx=(Math.sign(hoop-releaseX)||1)*(made?Math.min(1.25,distance/descent):Math.abs(b.vx));
          b.vy=made?(50-p.y)/descent:(50-p.y)/75;
        }
      c.released=true;c.releaseAttemptId=b.attemptId;c.releaseFacts={tick:t,pz:p.z,height,ownerId:b.ownerId,playerHasBall:p.hasBall,lastTouch:b.lastTouch,mode:b.mode,made,makeShotFacts:c.makeShotFacts,launch:{x:b.x,y:b.y,z:b.z,vx:b.vx,vy:b.vy,vz:b.vz,targetX:b.targetX,targetY:b.targetY}};
      }
      if(window.__j104UseCandidate&&!c.released&&b.mode==='carried')c.setTrackPoint();
      return{tick:t,clip:p.animation.clip,player:{x:p.x,y:p.y,z:p.z,facing:p.facing,hasBall:p.hasBall},ball:{x:b.x,y:b.y,z:b.z,mode:b.mode,ownerId:b.ownerId,lastTouch:b.lastTouch,attemptId:b.attemptId,made:b.made},score:[...s.score],scoredAttempts:[...(s.scoredAttempts??[])],phase:s.phase,scorePause:s.scorePause,canvasArt:document.querySelector('#game').dataset.gameplayArt};
    }""")
    if state['tick'] in RENDER_TICKS or (state['scoredAttempts'] and shot_id is not None):
      shot_id=state['ball']['attemptId'] or shot_id
      if state['tick'] in RENDER_TICKS and state['tick'] not in captured_ticks:
       captured_ticks.add(state['tick'])
       for zoom in [100,120]:
        page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}',zoom)
        page.evaluate('()=>window.jamverse.tick(0)')
        name=f'{label}-tick{state["tick"]:02d}-zoom{zoom}.png';page.locator('#game').screenshot(path=str(OUT/name))
        capture_rows.append({'label':name,'path':str((OUT/name).relative_to(ROOT)),'state':state,'zoom':zoom})
      if state['scoredAttempts'] and shot_id in state['scoredAttempts'] and not score_captured:
       score_captured=True
       for zoom in [100,120]:
        page.locator('#camera-zoom').evaluate('(e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}))}',zoom)
        page.evaluate('()=>window.jamverse.tick(0)')
        name=f'{label}-score-complete-zoom{zoom}.png';page.locator('#game').screenshot(path=str(OUT/name))
        capture_rows.append({'label':name,'path':str((OUT/name).relative_to(ROOT)),'state':state,'zoom':zoom})
       snapshots.append({'facing':label,'release':page.evaluate('()=>window.__j104.releaseFacts'),'scoreComplete':state,'captures':capture_rows});break
   else:raise RuntimeError(f'No completed score in {label} direction; last state {state}')
   if not snapshots or snapshots[-1]['facing']!=label:raise RuntimeError(f'Shot did not complete for {label}')
   report['facings'].append(snapshots[-1])
  browser.close()
  if errors:raise RuntimeError('Browser errors: '+str(errors))
  expected=2*len(RENDER_TICKS+['score-complete'])*2
  actual=sum(len(f['captures']) for f in report['facings'])
  if actual!=expected:raise RuntimeError(f'Expected {expected} captures, got {actual}; lengths={[len(f["captures"]) for f in report["facings"]]}')
  if any(f['release']['tick']!=13 or f['release']['ownerId'] is not None or f['release']['playerHasBall'] for f in report['facings']):raise RuntimeError('Candidate release ownership/timing invariant failed')
  if any(not f['scoreComplete']['scoredAttempts'] for f in report['facings']):raise RuntimeError('At least one shot did not score')
  report['captureCount']=actual;report['uncaughtBrowserErrors']=errors;(OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
  print(json.dumps({'captures':actual,'facings':[{'facing':f['facing'],'release':f['release'],'score':f['scoreComplete']['score'],'scoredAttempts':f['scoreComplete']['scoredAttempts']} for f in report['facings']],'errors':errors,'output':str(OUT)}))
finally:
 server.terminate();server.wait(timeout=5)
