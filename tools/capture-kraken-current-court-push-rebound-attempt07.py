"""Run unregistered Kraken push and live rebound trials on Vesper vs Blackthorn.

Candidate atlas/track are response overrides for this browser session only.
This script saves evidence under a new date-stamped path; it never edits the
production manifest or animation module on disk.
"""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'tools/generate-art/previews/kraken-current-court-trials-20261029-attempt07'
PUSH = OUT / 'push'
REBOUND = OUT / 'rebound'
PUSH.mkdir(parents=True, exist_ok=True)
REBOUND.mkdir(parents=True, exist_ok=True)
PUSH_ATLAS = './tools/generate-art/previews/kraken-push11-attempt02/kraken-push11-attempt02-runtime-candidate.png'
REBOUND_ATLAS = './tools/generate-art/previews/kraken-rebound5-attempt03/kraken-rebound5-attempt03-runtime-candidate.png'
rebound_track = json.loads((ROOT / 'tools/generate-art/previews/kraken-rebound-track-candidate/attempt-01/track.json').read_text())
push_track = json.loads((ROOT / 'tools/generate-art/previews/kraken-push-track-candidate/attempt-02/track.json').read_text())
PORT = environ.get('PORT', '4397')
URL = f'http://127.0.0.1:{PORT}/'

report = {
    'date': '2026-10-29', 'court': {'home': 'vesper-harbor-undertow', 'away': 'blackthorn-court-kings', 'courtY': 75},
    'candidateOverridesOnly': True, 'productionRegistration': False,
    'oldScoriaCourtY50Trials': 'Preserved but invalid for this current-court review.',
    'pushCandidate': {'atlas': PUSH_ATLAS, 'separateBallOwner': 'Sable Regent (actual Blackthorn roster athlete)', 'krakenBallTrackInjected': False, 'reason': 'Kraken does not own the live ball during the shove'},
    'reboundCandidate': {'atlas': REBOUND_ATLAS, 'track': rebound_track, 'shooter': 'Leo (actual Blackthorn roster athlete)', 'scenario': 'live missed shot -> loose ball -> Kraken catch'},
    'runs': {'push': [], 'rebound': []}, 'errors': []
}

server = Popen(['node', 'tools/server.mjs'], cwd=ROOT, env={**environ, 'PORT': PORT}, stdout=DEVNULL, stderr=DEVNULL)

def route_overrides(page, atlas, clip, nframes, cols, track, cell_width=80, cell_height=96):
    def manifest(route):
        response = route.fetch()
        extra = f"\nanimationAssetManifest.characters.kraken.directions.right[{json.dumps(clip)}]={{src:{json.dumps(atlas)},columns:{cols},rows:{(nframes+cols-1)//cols},reviewed:true,frames:Array.from({{length:{nframes}}},(_,i)=>({{x:(i%{cols})*{cell_width},y:Math.floor(i/{cols})*{cell_height},w:{cell_width},h:{cell_height}}}))}};animationAssetManifest.characters.kraken.mirrorSafe=true;animationAssetManifest.characters.kraken.mirrorReview={{status:'reviewed'}};"
        route.fulfill(response=response, body=response.text() + extra)
    def animation(route):
        response = route.fetch()
        route.fulfill(response=response, body=response.text() + f"\nathleteBallTracks.kraken[{json.dumps(clip)}]={json.dumps({'height':track['height'],'forward':track['forward']},separators=(',',':'))};")
    def images(route):
        response = route.fetch()
        route.fulfill(response=response, body=response.text() + '\nwindow.__productionSpriteImagesForReview=productionSpriteImages;')
    page.route('**/src/content/animation-assets.js', manifest)
    if track is not None: page.route('**/src/core/animation.js', animation)
    page.route('**/src/main.js', images)
    page.add_init_script('window.requestAnimationFrame=()=>0')

try:
    deadline = monotonic() + 30
    while monotonic() < deadline:
        if server.poll() is not None: raise RuntimeError('Jam Stage server exited')
        try:
            with urlopen(URL, timeout=1) as r:
                if r.status == 200: break
        except Exception: sleep(.1)
    else: raise TimeoutError('Jam Stage server did not start')
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage'])
        for zoom in (100, 120):
            for facing, direction in ((1, 'right'), (-1, 'left')):
                # Live ball-carrying push against Blackthorn's real Sable Regent.
                page = browser.new_page(viewport={'width': 900, 'height': 700}, device_scale_factor=1)
                errors=[]; page.on('pageerror', lambda e: errors.append(str(e)))
                route_overrides(page, PUSH_ATLAS, 'push', 11, 4, None, 128, 112)
                page.goto(URL, wait_until='networkidle', timeout=120000)
                page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105', timeout=120000)
                page.evaluate("""async ({zoom,facing,atlas})=>{
                  const g=window.jamverse;g.start('vesper-harbor-undertow','blackthorn-court-kings',180,1);const s=g.state,k=s.players.find(p=>p.id==='kraken'),t=s.players.find(p=>p.name==='Sable Regent');if(!k||!t)throw Error('Kraken/Sable missing');
                  s.players=[k,t];for(const p of s.players){p.stun=0;p.charge=0;p.hasBall=false;p.animation={clip:'idle',tick:0};p.anim='idle';p.z=p.vz=p.vx=p.vy=0;p.facing=facing;}
                  k.x=100;k.y=75;k.facing=facing;t.x=100+facing*10;t.y=75;t.facing=-facing;t.hasBall=true;t.animation={clip:'idle-ball',tick:0};t.anim='idle-ball';
                  s.phase='playing';s.possession=t.team;s.pause=false;s.score=[0,0];s.clock=180;s.shotClock=24;s.rng=1;
                  Object.assign(s.ball,{mode:'carried',ownerId:t.id,lastTouch:t.id,targetId:null,aerialTargetId:null,attemptId:null,scored:false,x:t.x,y:t.y,z:1,vx:0,vy:0,vz:0});
                  const im=new Image();im.src=atlas;await im.decode();window.__productionSpriteImagesForReview.set(atlas,im);window.__trial={k,t,atlas,now:0,manifest:(await import('/src/content/animation-assets.js')).animationAssetManifest};
                  const sl=document.querySelector('#camera-zoom');sl.value=String(zoom);sl.dispatchEvent(new Event('input',{bubbles:true}));g.tick(0,[]);g.tick(1,s.players.map(p=>({playerId:p.id,x:0,y:0,shovePressed:p.id===k.id})));if(k.animation.clip!=='push')throw Error('Push input did not select push clip');
                }""", {'zoom':zoom,'facing':facing,'atlas':PUSH_ATLAS})
                run={'facing':facing,'direction':direction,'zoom':zoom,'opponent':'Sable Regent','captures':[]}
                for frame,tick in enumerate(push_track['frameStartTicks']):
                    c=page.evaluate("""async ({tick,frame,atlas})=>{const g=window.jamverse,s=g.state,q=window.__trial;while(q.now<tick){g.tick(1,s.players.map(p=>({playerId:p.id,x:0,y:0})));q.now++;}const {selectProductionSprite}=await import('/src/render/animation-sprites.js');const {anchorTick}=await import('/src/core/animation.js');const sel=selectProductionSprite(q.k,{manifest:q.manifest,images:window.__productionSpriteImagesForReview});return {frame,tick,clip:q.k.animation.clip,clipTick:q.k.animation.tick,target:q.k.animation.action?.targetId??null,contactTick:anchorTick('push','contact'),targetStun:q.t.stun,knockdowns:q.k.knockdowns,ball:{mode:s.ball.mode,owner:s.ball.ownerId,lastTouch:s.ball.lastTouch},score:s.score,selection:{src:sel?.src,frame:sel?.frame,flip:sel?.flip}};}""",{'tick':tick,'frame':frame,'atlas':PUSH_ATLAS})
                    c['path']=(PUSH/f'{direction}-zoom{zoom}-frame{frame:02d}-tick{tick:02d}.png').relative_to(ROOT).as_posix();page.locator('#game').screenshot(path=str(ROOT/c['path']));run['captures'].append(c)
                contact=next(x for x in run['captures'] if x['tick']==8)
                run['result']='passed' if contact['knockdowns']>=1 and contact['targetStun']>0 and contact['ball']['mode']=='loose' else 'failed'
                if run['result']!='passed': raise RuntimeError('Push did not result in successful contact: '+json.dumps(contact))
                if errors: report['errors']+=errors; raise RuntimeError(json.dumps(errors))
                report['runs']['push'].append(run);page.close()

                # Actual Blackthorn shot, deliberately deterministic miss, and in-engine Kraken rebound.
                page=browser.new_page(viewport={'width':900,'height':700},device_scale_factor=1)
                errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
                route_overrides(page, REBOUND_ATLAS, 'rebound', 5, 4, rebound_track)
                page.goto(URL,wait_until='networkidle',timeout=120000);page.wait_for_function('window.jamverse && window.jamverse.rosterCheck.athletes===105',timeout=120000)
                page.evaluate("""async ({zoom,facing,atlas})=>{
                  const g=window.jamverse;g.start('vesper-harbor-undertow','blackthorn-court-kings',180,14384);const s=g.state,k=s.players.find(p=>p.id==='kraken'),sh=s.players.find(p=>p.id==='leo');if(!k||!sh)throw Error('Kraken/Leo missing');
                  s.players=[k,sh];for(const p of s.players){p.stun=0;p.charge=0;p.hasBall=false;p.animation={clip:'idle',tick:0};p.anim='idle';p.z=p.vz=p.vx=p.vy=0;p.facing=facing;}
                  sh.x=110;sh.y=75;sh.facing=1;sh.shoot=0;sh.hasBall=true;sh.animation={clip:'idle-ball',tick:0};sh.anim='idle-ball';k.x=69;k.y=50.5;k.facing=facing;
                  s.phase='playing';s.possession=sh.team;s.pause=false;s.score=[0,0];s.clock=180;s.shotClock=24;s.rng=14384;
                  Object.assign(s.ball,{mode:'carried',ownerId:sh.id,lastTouch:sh.id,targetId:null,aerialTargetId:null,attemptId:null,scored:false,x:sh.x,y:sh.y,z:1,vx:0,vy:0,vz:0});
                  const im=new Image();im.src=atlas;await im.decode();window.__productionSpriteImagesForReview.set(atlas,im);window.__rebound={k,sh,atlas,now:0,manifest:(await import('/src/content/animation-assets.js')).animationAssetManifest,log:[]};
                  const sl=document.querySelector('#camera-zoom');sl.value=String(zoom);sl.dispatchEvent(new Event('input',{bubbles:true}));g.tick(0,[]);g.tick(1,[{playerId:sh.id,x:0,y:0,shootPressed:true},{playerId:k.id,x:0,y:0}]);for(let i=0;i<24&&s.ball.mode!=='shot';i++)g.tick(1,s.players.map(p=>({playerId:p.id,x:0,y:0})));window.__rebound.shotTick=s.ball.mode==='shot';
                }""",{'zoom':zoom,'facing':facing,'atlas':REBOUND_ATLAS})
                live=page.evaluate("""()=>{const s=window.jamverse.state,q=window.__rebound;return {mode:s.ball.mode,shotMade:s.ball.made,clip:q.sh.animation.clip,seed:s.rng,shooter:q.sh.name,rosterIds:s.players.map(p=>p.id)};}""")
                if live['mode']!='shot' or live['shotMade'] is not False: raise RuntimeError('Did not produce a live miss: '+json.dumps(live))
                # Capture the real shot, then let the ordinary engine find and animate the rebound.
                rrun={'facing':facing,'direction':direction,'zoom':zoom,'shooter':'Leo','seed':14384,'shotAtStart':live,'captures':[],'timeline':[]}
                for i in range(110):
                    state=page.evaluate("""async ()=>{const g=window.jamverse,s=g.state,q=window.__rebound;const {selectProductionSprite}=await import('/src/render/animation-sprites.js');const {sampleBallHeight,sampleBallForward}=await import('/src/core/animation.js');const sel=selectProductionSprite(q.k,{manifest:q.manifest,images:window.__productionSpriteImagesForReview});return {tick:q.now,mode:s.ball.mode,made:s.ball.made,ball:{x:+s.ball.x.toFixed(2),y:+s.ball.y.toFixed(2),z:+s.ball.z.toFixed(2)},kraken:{clip:q.k.animation.clip,clipTick:q.k.animation.tick,action:q.k.animation.action?.kind??null,hasBall:q.k.hasBall,track:{height:sampleBallHeight('rebound',q.k.animation.tick,'kraken'),forward:sampleBallForward('rebound',q.k.animation.tick,'kraken')},selection:{src:sel?.src,frame:sel?.frame,flip:sel?.flip}},events:s.events.slice(-2),score:s.score};}""")
                    if i in (0,8,16,24,32,40,48,56,64,72,80,88,96,104):
                        state['path']=(REBOUND/f'{direction}-zoom{zoom}-timeline{i:03d}.png').relative_to(ROOT).as_posix();page.locator('#game').screenshot(path=str(ROOT/state['path']))
                    rrun['timeline'].append(state)
                    if state['kraken']['clip']=='rebound' and state['kraken']['clipTick'] in rebound_track['frameStartTicks'] and not any(c['kraken']['clipTick']==state['kraken']['clipTick'] for c in rrun['captures']):
                        state['actualRebound']=True
                        state['path']=(REBOUND/f'{direction}-zoom{zoom}-rebound-tick{state["kraken"]["clipTick"]:02d}.png').relative_to(ROOT).as_posix();page.locator('#game').screenshot(path=str(ROOT/state['path']));rrun['captures'].append(state)
                    page.evaluate("""()=>{const g=window.jamverse,s=g.state,q=window.__rebound;g.tick(1,s.players.map(p=>({playerId:p.id,x:0,y:0})));q.now++;}""")
                    if state['kraken']['hasBall'] and state['mode']=='carried' and state['kraken']['clip']=='rebound': rrun['caughtAt']=state['tick']
                    if rrun.get('caughtAt') is not None and len(rrun['captures'])==len(rebound_track['frameStartTicks']): break
                rrun['result']='passed' if rrun.get('caughtAt') is not None else 'failed'
                if not any(t['mode']=='loose' for t in rrun['timeline']): rrun['result']='failed: no loose ball'
                if errors: report['errors']+=errors;raise RuntimeError(json.dumps(errors))
                report['runs']['rebound'].append(rrun);page.close()
        browser.close()
    report['summary']={
        'pushRuns':len(report['runs']['push']),'pushCaptures':sum(len(r['captures']) for r in report['runs']['push']),
        'reboundRuns':len(report['runs']['rebound']),'reboundCatches':sum(r['result']=='passed' for r in report['runs']['rebound']),
        'reboundCandidateVerdict':'track trial evidence only; source art remains visually provisional',
        'pushCandidateVerdict':'track trial evidence only; source art remains visually provisional'
    }
    (OUT/'report.json').write_text(json.dumps(report,indent=2)+'\n')
    (OUT/'README.md').write_text('# Kraken current-court candidate trials\n\nThese unregistered trials inject candidate art/track through local browser response overrides only. Production manifest and animation files were not changed. Court: Vesper Harbor Undertow vs Blackthorn Court Kings, athlete stage y=75. The older Scoria Rams y=50 trials remain preserved but invalid for this review.\n\nSee `report.json` for per-facing, per-zoom gameplay traces and screenshots.\n')
    print(json.dumps(report['summary']))
finally:
    server.terminate()
    try: server.wait(timeout=5)
    except Exception: server.kill()
