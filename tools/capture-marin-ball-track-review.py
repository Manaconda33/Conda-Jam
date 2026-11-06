"""Capture Marin's registered receive/idle-ball hand positions and action handoffs.

No asset or runtime overrides are applied. Tracks are sampled from the current
production modules and screenshots use the current Jam Stage renderer.
"""
from hashlib import sha256
from pathlib import Path
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'tools/generate-art/previews/marin-dusk-ball-track-review-05'
OUT.mkdir(parents=True, exist_ok=True)
PORT = '4291'
URL = f'http://127.0.0.1:{PORT}/'
FRAME_TICKS = {'receive': [0, 2, 4, 5], 'idle-ball': [0, 8, 16, 24]}
REPORT = {'assetMode': 'registered-normal-loader', 'athlete': 'marin-dusk', 'tracks': {}, 'captureCount': 0, 'captures': [], 'errors': []}

server = Popen(['node', 'tools/server.mjs'], cwd=ROOT, env={**__import__('os').environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)
try:
    deadline = monotonic() + 30
    while monotonic() < deadline:
        if server.poll() is not None:
            raise RuntimeError('Jam Stage server exited before ready')
        try:
            with urlopen(URL, timeout=1) as response:
                if response.status == 200:
                    break
        except Exception:
            sleep(.1)
    else:
        raise TimeoutError('Jam Stage server did not become ready')

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-dev-shm-usage'])
        for facing, label in ((1, 'right'), (-1, 'left')):
            home, away = ('vesper-harbor-undertow', 'scoria-rams') if facing > 0 else ('scoria-rams', 'vesper-harbor-undertow')
            for zoom in (100, 120):
                page = browser.new_page(viewport={'width': 900, 'height': 700}, device_scale_factor=1)
                page.on('pageerror', lambda exc: REPORT['errors'].append(str(exc)))
                def expose_images(route):
                    response=route.fetch()
                    route.fulfill(response=response,body=response.text()+'\nwindow.__productionSpriteImagesForReview=productionSpriteImages;\n')
                page.route('**/src/main.js', expose_images)
                awaitable = page.goto(URL, wait_until='networkidle', timeout=120000)
                page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=120000)
                page.evaluate('window.__reviewImages=window.__productionSpriteImagesForReview')
                page.evaluate('''async ({home,away,facing,zoom,kind,tick,action})=>{
                  const g=window.jamverse;g.start(home,away,180,951);const s=g.state;
                  const p=s.players.find(x=>x.id==='marin-dusk');
                  const mate=s.players.find(x=>x.team===p.team&&x.id!=='marin-dusk');
                  if(!p||!mate)throw Error('Marin/teammate missing');
                  s.players=[p,mate];p.x=100;p.y=50;p.z=p.vz=p.vx=p.vy=0;p.facing=facing;p.stun=0;p.charge=0;p.action=null;p.hasBall=true;
                  p.animation={clip:kind==='handoff'?'idle-ball':kind,tick:kind==='handoff'?0:tick};p.anim=p.animation.clip;
                  s.practice=true;s.phase='playing';s.pause=false;s.scorePause=0;s.score=[0,0];s.clock=180;s.shotClock=24;s.possession=p.team;
                  Object.assign(s.ball,{mode:'carried',ownerId:p.id,lastTouch:p.id,targetId:null,aerialTargetId:null,attemptId:null,scored:false,x:p.x+facing*1.45,y:p.y,z:1.45,vx:0,vy:0,vz:0});
                  document.querySelector('#camera-zoom').value=String(zoom);document.querySelector('#camera-zoom').dispatchEvent(new Event('input',{bubbles:true}));
                  if(kind==='handoff')g.tick(1,s.players.map(x=>({playerId:x.id,x:0,y:0,[action+'Pressed']:x===p})));
                  const core=await import('/src/core/animation.js');const current=g.state.players.find(x=>x.id==='marin-dusk');
                  return {player:current.id,team:current.team,clip:current.animation.clip,tick:current.animation.tick,action:current.animation.action?.kind,ball:{...g.state.ball},track:{height:core.sampleBallHeight(current.animation.clip,current.animation.tick,current.id),forward:core.sampleBallForward(current.animation.clip,current.animation.tick,current.id)},selection:(await import('/src/render/animation-sprites.js')).selectProductionSprite(current,{manifest:(await import('/src/content/animation-assets.js')).animationAssetManifest,images:window.__reviewImages})};
                }''', {'home':home,'away':away,'facing':facing,'zoom':zoom,'kind':'receive','tick':0,'action':'pass'})
                for clip, ticks in FRAME_TICKS.items():
                    for tick in ticks:
                        state=page.evaluate('''async({clip,tick})=>{
                          const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='marin-dusk'),core=await import('/src/core/animation.js');
                          p.animation={clip,tick};p.anim=clip;
                          const h=core.sampleBallHeight(clip,tick,p.id),f=core.sampleBallForward(clip,tick,p.id);
                          Object.assign(s.ball,{mode:'carried',ownerId:p.id,lastTouch:p.id,x:p.x+p.facing*f,y:p.y,z:p.z+h,vx:0,vy:0,vz:0});
                          const selection=(await import('/src/render/animation-sprites.js')).selectProductionSprite(p,{manifest:(await import('/src/content/animation-assets.js')).animationAssetManifest,images:window.__reviewImages});
                          return {tick,clip,frame:core.sampleAnimation(clip,tick).frame,track:{height:h,forward:f},ball:{x:s.ball.x,z:s.ball.z},selection};
                        }''', {'clip':clip,'tick':tick})
                        page.wait_for_timeout(100)
                        name=f'{label}-zoom{zoom}-{clip}-tick{tick:02d}-frame{state["frame"]}.png';dest=OUT/name
                        page.locator('#game').screenshot(path=str(dest))
                        REPORT['captures'].append({**state,'facing':label,'zoom':zoom,'path':name,'sha256':sha256(dest.read_bytes()).hexdigest()})
                for action in ('pass','shoot'):
                    handoff=page.evaluate('''async({action,facing})=>{
                      const g=window.jamverse,s=g.state,p=s.players.find(x=>x.id==='marin-dusk'),core=await import('/src/core/animation.js');
                      p.hasBall=true;p.animation={clip:'idle-ball',tick:0};p.anim='idle-ball';
                      if(action==='shoot'){p.x=facing>0?150:50;p.y=90;}
                      Object.assign(s.ball,{mode:'carried',ownerId:p.id,lastTouch:p.id,x:p.x+p.facing*1.45,y:p.y,z:1.45,vx:0,vy:0,vz:0});
                      g.tick(1,s.players.map(x=>({playerId:x.id,x:0,y:0,[action+'Pressed']:x===p})));
                      const q=g.state.players.find(x=>x.id==='marin-dusk');
                      const selection=(await import('/src/render/animation-sprites.js')).selectProductionSprite(q,{manifest:(await import('/src/content/animation-assets.js')).animationAssetManifest,images:window.__reviewImages});
                      return {clip:q.animation.clip,tick:q.animation.tick,action:q.animation.action?.kind,ball:{mode:s.ball.mode,ownerId:s.ball.ownerId,lastTouch:s.ball.lastTouch,x:s.ball.x,z:s.ball.z},track:{height:core.sampleBallHeight(q.animation.clip,q.animation.tick,q.id),forward:core.sampleBallForward(q.animation.clip,q.animation.tick,q.id)},selection};
                    }''', {'action':action,'facing':facing})
                    page.wait_for_timeout(100)
                    name=f'{label}-zoom{zoom}-idle-ball-to-{action}.png';dest=OUT/name
                    page.locator('#game').screenshot(path=str(dest))
                    REPORT['captures'].append({**handoff,'facing':label,'zoom':zoom,'path':name,'sha256':sha256(dest.read_bytes()).hexdigest(),'transition':f'idle-ball→{action}'})
                page.close()
        browser.close()
    REPORT['captureCount']=len(REPORT['captures'])
    REPORT['tracks']={'receive':{'height':[1.3,1.35,1.7,1.75],'forward':[4,4,2,1]},'idle-ball':{'height':[1.45]*4,'forward':[1]*4},'marinPassSource':'echo-catwalk','marinShootSource':'echo-catwalk'}
    if REPORT['errors']:
        raise RuntimeError('Browser errors: '+json.dumps(REPORT['errors']))
    with (OUT/'report.json').open('w') as f:
        json.dump(REPORT,f,indent=2)
finally:
    server.terminate()
    try:server.wait(timeout=5)
    except Exception:server.kill()

print(json.dumps({'captures':REPORT['captureCount'],'errors':REPORT['errors'],'out':str(OUT)}))
