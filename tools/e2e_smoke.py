from pathlib import Path
from subprocess import Popen, DEVNULL
from time import sleep
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'artifacts'/'screenshots'
OUT.mkdir(parents=True,exist_ok=True)
server=Popen(['node','tools/server.mjs'],cwd=ROOT,stdout=DEVNULL,stderr=DEVNULL)
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        page=browser.new_page(viewport={'width':1200,'height':900},device_scale_factor=1)
        errors=[]; bad=[]
        page.on('pageerror',lambda exc:errors.append(str(exc)))
        page.on('requestfailed',lambda req:bad.append(req.url))
        page.goto('http://127.0.0.1:4173',wait_until='networkidle')
        page.screenshot(path=str(OUT/'title.png'))
        roster=page.evaluate('window.jamverse.rosterCheck')
        assert roster['teams']==35 and roster['athletes']==105 and not roster['errors'],roster
        page.click('#settings')
        page.locator('#text-size').evaluate("el=>{el.value='120';el.dispatchEvent(new Event('input',{bubbles:true}))}")
        page.check('#reduced-flash')
        assert page.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--ui-zoom').trim()")=='1.2'
        cabinet=page.locator('.cabinet').bounding_box()
        assert cabinet['y']>=0 and cabinet['y']+cabinet['height']<=900,cabinet
        page.locator('.key-settings summary').click()
        page.locator("#key-bindings button[data-player='0'][data-action='right']").click()
        page.keyboard.press('e')
        page.click('#settings-dialog .dialog-button')
        settings=page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v1'))")
        assert settings['textSize']==120 and settings['reducedFlash'] is True and settings['controls'][0]['right']=='e',settings
        page.click('#settings')
        page.locator('#text-size').evaluate("el=>{el.value='100';el.dispatchEvent(new Event('input',{bubbles:true}))}")
        page.uncheck('#reduced-flash')
        page.click('#settings-dialog .dialog-button')
        page.click('#choose-home')
        assert page.locator('.team-choice').count()==35
        page.wait_for_timeout(120)
        page.screenshot(path=str(OUT/'team-selection-grid.png'))
        page.click(".team-choice[data-team-id='greenwall-giants']")
        assert page.locator('#home-team').input_value()=='greenwall-giants'
        assert page.locator('#choose-home b').inner_text()=='6foot10'
        page.click('#choose-home')
        page.click(".team-choice[data-team-id='chicago-condas']")
        page.click('#choose-away')
        page.click(".team-choice[data-team-id='crownfire-sovereigns']")
        page.select_option('#home-team',label='Chicago Condas')
        page.select_option('#away-team',label='Crownfire Sovereigns')
        page.select_option('#home-lineup',value='juniper-vale')
        page.click('#play')
        assert page.evaluate("window.jamverse.state.players.find(p=>p.team===0&&p.id==='juniper-vale')!==undefined")
        assert page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v1')).homePartnerId==='juniper-vale'")
        assert 'E MOVE' in page.locator('#game-controls-hint').inner_text()
        page.wait_for_function("document.querySelector('#game-screen').classList.contains('hidden') === false")
        page.wait_for_timeout(700)
        page.screenshot(path=str(OUT/'court-chicago-crownfire.png'))
        initial=page.evaluate('window.jamverse.state.players[0].x')
        page.keyboard.down('e');page.wait_for_timeout(250);page.keyboard.up('e')
        moved=page.evaluate('window.jamverse.state.players[0].x')
        assert moved>initial,f'right movement failed: {initial} -> {moved}'
        page.evaluate('window.jamverse.state.clock=1/60')
        page.wait_for_function("window.jamverse.state.phase === 'break'")
        home_bench=page.evaluate('window.jamverse.state.lineups[0].benchId')
        page.keyboard.press('p')
        assert page.evaluate('window.jamverse.state.lineups[0].partnerId')==home_bench
        away_bench=page.evaluate('window.jamverse.state.lineups[1].benchId')
        page.keyboard.press('o')
        assert page.evaluate('window.jamverse.state.lineups[1].partnerId')==away_bench
        page.screenshot(path=str(OUT/'quarter-break-substitutions.png'))
        page.wait_for_function("window.jamverse.state.phase === 'playing'")
        page.keyboard.down('k');page.wait_for_timeout(80);page.keyboard.up('k')
        page.keyboard.down('j');page.wait_for_timeout(80);page.keyboard.up('j')
        page.keyboard.press('Enter')
        assert page.evaluate('window.jamverse.state.pause') is True
        page.keyboard.press('Enter')
        assert page.evaluate('window.jamverse.state.pause') is False
        page.evaluate("""window.jamverse.start('chicago-condas','crownfire-sovereigns',60,11);
          const m=window.jamverse.state,s=m.players.find(p=>p.hasBall);s.x=170;s.y=50;
          for(const d of m.players.filter(p=>p.team!==s.team)){d.x=20;d.y=d===m.players[2]?0:100;}""")
        page.keyboard.down('j');page.wait_for_timeout(140)
        charge_state=page.evaluate("(()=>{const m=window.jamverse.state,p=m.players[0];return {phase:m.phase,pause:m.pause,clock:m.clock,age:m.possessionAge,ball:m.ball.mode,owner:m.ball.ownerId,player:p.id,hasBall:p.hasBall,charge:p.charge,lastEvent:m.lastEvent,controls:window.jamverse.controlledPlayers,keys:window.jamverse.keyState}})()")
        assert charge_state['ball']=='carried' and charge_state['charge']>=4,f'hold should charge without releasing: {charge_state}'
        page.keyboard.up('j');page.wait_for_timeout(80)
        assert page.evaluate("window.jamverse.state.players[0].charge===0&&window.jamverse.state.players[0].fga===1"),'release should create one shot attempt'
        assert page.evaluate("['shot','loose','dead'].includes(window.jamverse.state.ball.mode)")
        page.evaluate("""window.jamverse.start('chicago-condas','crownfire-sovereigns',60,1);
          const m=window.jamverse.state, shooter=m.players.find(p=>p.hasBall); shooter.x=170; shooter.y=50; shooter.shoot=99;
          for(const d of m.players.filter(p=>p.team!==shooter.team)){d.x=20;d.y=d===m.players[2]?0:100;}
          window.jamverse.tick(1,[{playerId:shooter.id,shootPressed:true}]);""")
        assert page.evaluate("window.jamverse.state.ball.mode==='shot'")
        page.evaluate('window.jamverse.tick(120)')
        assert page.evaluate('window.jamverse.state.score[0]')==2
        page.evaluate("window.jamverse.start('emberwood-kits','venom-delta-fangs',30,5)")
        page.wait_for_timeout(500)
        page.screenshot(path=str(OUT/'court-kits-fangs.png'))
        page.evaluate("window.jamverse.start('stripewood-longarms','lantern-hollow-wombats',30,7)")
        page.wait_for_timeout(400)
        page.screenshot(path=str(OUT/'court-longarms-wombats.png'))
        page.evaluate("window.jamverse.start('stripewood-longarms','crownfire-sovereigns',30,8)")
        page.wait_for_timeout(400)
        page.screenshot(path=str(OUT/'court-quirky-dragonqueen.png'))
        page.evaluate("window.jamverse.start('nocturne-city-blankfaces','emberwood-kits',30,9)")
        page.wait_for_timeout(400)
        page.screenshot(path=str(OUT/'court-alexithymia-paprika.png'))
        # Reproduce a close turbo dunk and freeze the action frame for visual review.
        dunk=page.evaluate("""(()=>{const j=window.jamverse;j.start('chicago-condas','crownfire-sovereigns',60,1);const m=j.state,p=m.players[0];p.x=186;p.y=50;p.vx=.2;p.dunk=99;for(const d of m.players.filter(x=>x.team===1)){d.x=20;d.y=d===m.players[2]?0:100;}j.tick(5,[{playerId:p.id,x:1,turbo:true,shootPressed:true}]);return m.ball.mode;})()""")
        assert dunk=='dunk',f'expected a dunk release, got {dunk}'
        page.screenshot(path=str(OUT/'dunk-release.png'))
        page.evaluate('window.jamverse.tick(35)')
        assert page.evaluate('window.jamverse.state.score[0]')==2,'dunk should count once'
        # Three guaranteed open releases use the real shot/score path to activate FIRE.
        fire=page.evaluate("""(()=>{const j=window.jamverse;j.start('chicago-condas','crownfire-sovereigns',180,1);const m=j.state,p=m.players[0];for(const d of m.players.filter(x=>x.team===1)){d.x=20;d.y=d===m.players[2]?0:100;}
          for(let shot=0;shot<3;shot++){m.phase='playing';m.scorePause=0;m.possession=0;for(const a of m.players)a.hasBall=false;p.hasBall=true;p.x=169;p.y=50;m.ball.mode='carried';m.ball.ownerId=p.id;m.ball.x=p.x;m.ball.y=p.y;m.ball.z=1;m.rng=1;const before=m.score[0];j.tick(1,[{playerId:p.id,shootPressed:true}]);for(let tick=0;tick<140&&m.score[0]===before;tick++)j.tick(1,[]);if(m.score[0]===before)return {failedAt:shot,score:m.score};}
          for(const a of m.players)a.hasBall=false;p.hasBall=true;p.x=100;p.y=50;m.ball.mode='carried';m.ball.ownerId=p.id;m.ball.x=p.x;m.ball.y=p.y;m.ball.z=1;j.tick(1);return {score:m.score,onFire:p.onFire,madeRun:p.madeRun};})()""")
        assert fire['score'][0]==6 and fire['onFire'] is True and fire['madeRun']==3,fire
        page.screenshot(path=str(OUT/'active-fire.png'))
        # Exercise the period clock and match-end path through the actual 60 Hz rules simulation.
        page.evaluate("window.jamverse.start('chicago-condas','crownfire-sovereigns',30,3); window.jamverse.tick(60000)")
        phase=page.evaluate('window.jamverse.state.phase')
        assert phase=='final',f'expected final, got {phase}'
        assert page.evaluate('window.jamverse.state.quarterSeconds')==30
        score=page.evaluate('window.jamverse.state.score')
        assert score!=[0,0],f'full match had no baskets: {score}'
        page.screenshot(path=str(OUT/'final-boxscore.png'))
        page.keyboard.press('Enter')
        page.wait_for_function("window.jamverse.state.phase === 'playing'")
        assert page.url=='http://127.0.0.1:4173/'
        page.click('#back-menu')
        assert page.locator('#start-screen').is_visible()
        page.check('#two-players')
        page.click('#play')
        second_initial=page.evaluate('window.jamverse.state.players[2].y')
        page.keyboard.down('ArrowDown');page.wait_for_timeout(250);page.keyboard.up('ArrowDown')
        second_moved=page.evaluate('window.jamverse.state.players[2].y')
        assert second_moved>second_initial,f'split-keyboard player 2 movement failed: {second_initial} -> {second_moved}'
        page.click('#back-menu')
        page.uncheck('#two-players')
        # Start a real season fixture and let the simulation finish before checking saved advancement.
        page.select_option('#home-team',label='Chicago Condas')
        page.select_option('#quarter',value='60')
        page.click('#campaign')
        page.screenshot(path=str(OUT/'campaign-ladder.png'))
        page.click('#campaign-play')
        assert page.locator('#campaign-dialog').evaluate('(d)=>!d.open')
        assert page.evaluate("window.jamverse.state.teamNames[0]==='Chicago Condas'")
        page.evaluate('window.jamverse.tick(120000)')
        assert page.evaluate("window.jamverse.state.phase==='final'")
        page.wait_for_function("JSON.parse(localStorage.getItem('jamverse96-v1')).season.round === 1")
        season=page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v1')).season")
        assert season['teamId']=='chicago-condas' and season['round']==1,season
        page.keyboard.press('Escape')
        page.click('#campaign')
        page.click('#campaign-play')
        page.evaluate("window.jamverse.state.winner=1; window.jamverse.state.phase='final'")
        page.wait_for_function("JSON.parse(localStorage.getItem('jamverse96-v1')).season.complete === true")
        loss=page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v1')).season")
        assert loss['losses']==1 and loss['wins']==0,loss
        page.keyboard.press('Escape')
        page.click('#campaign')
        assert page.locator('#campaign-play').inner_text()=='START NEW RUN'
        page.click('#campaign-play')
        reset=page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v1')).season")
        assert reset['round']==0 and reset['complete'] is False,reset
        page.evaluate("""window.jamverse.start('chicago-condas','crownfire-sovereigns',30,1);
          const m=window.jamverse.state,carrier=m.players.find(p=>p.team===1),target=m.players.find(p=>p.team===1&&p!==carrier),defender=m.players.find(p=>p.team===0);
          for(const p of m.players)p.hasBall=false; m.possession=1; carrier.hasBall=true; carrier.x=150;carrier.y=10;
          target.x=100;target.y=50;defender.x=100;defender.y=50;defender.strength=99;
          m.ball.mode='carried';m.ball.ownerId=carrier.id;m.ball.x=carrier.x;m.ball.y=carrier.y;m.ball.z=1;""")
        page.keyboard.down('l');page.wait_for_timeout(35);page.keyboard.down('k');page.wait_for_timeout(120);page.keyboard.up('k');page.keyboard.up('l')
        shove=page.evaluate("""(()=>{const m=window.jamverse.state,d=m.players.find(p=>p.team===0);return {players:m.players.map(p=>({id:p.id,team:p.team,anim:p.anim,stun:p.stun})),defenderKnockdowns:d.knockdowns,lastEvent:m.lastEvent}})()""")
        assert shove['defenderKnockdowns']==1 and any(p['team']==1 and p['anim']=='knockdown' for p in shove['players']),shove
        page.click('#back-menu')
        page.evaluate("""(()=>{const buttons=Array.from({length:16},()=>({pressed:false,value:0}));const gp={index:0,axes:[1,0],buttons,connected:true};Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[gp]});window.__testGamepad={gp};})()""")
        page.click('#play')
        pad_initial=page.evaluate('window.jamverse.state.players[1].x')
        page.wait_for_timeout(220)
        pad_moved=page.evaluate('window.jamverse.state.players[1].x')
        assert pad_moved>pad_initial,f'gamepad horizontal movement failed: {pad_initial} -> {pad_moved}'
        page.evaluate('window.__testGamepad.gp.buttons[9].pressed=true')
        page.wait_for_function('window.jamverse.state.pause===true')
        page.evaluate('window.__testGamepad.gp.buttons[9].pressed=false')
        page.wait_for_timeout(50)
        page.evaluate('window.__testGamepad.gp.buttons[9].pressed=true')
        page.wait_for_function('window.jamverse.state.pause===false')
        assert page.evaluate('window.jamverse.controlledPlayers.includes(window.jamverse.state.players[1].id)')
        page.evaluate("Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[]})")
        page.wait_for_function('!window.jamverse.controlledPlayers.includes(window.jamverse.state.players[1].id)')
        page.evaluate("Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[window.__testGamepad.gp]})")
        page.wait_for_function('window.jamverse.controlledPlayers.includes(window.jamverse.state.players[1].id)')
        page.evaluate("Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[]})")
        page.wait_for_function('!window.jamverse.controlledPlayers.includes(window.jamverse.state.players[1].id)')
        page.click('#back-menu')
        page.set_viewport_size({'width':390,'height':844})
        cabinet=page.locator('.cabinet').bounding_box()
        assert cabinet['x']>=0 and cabinet['x']+cabinet['width']<=390 and cabinet['y']>=0 and cabinet['y']+cabinet['height']<=844,cabinet
        page.click('#choose-home')
        assert page.locator('.team-choice').count()==35
        page.locator(".team-choice[data-team-id='verdant-reach-archers']").click()
        assert page.locator('#home-team').input_value()=='verdant-reach-archers'
        page.set_viewport_size({'width':1200,'height':900})
        assert not errors,errors
        assert not bad,bad
        browser.close()
    print('PASS Chromium browser journey; 35 teams / 105 athletes; keyboard/gamepad rebinding, movement, pause and disconnect fallback, settings, substitutions, held-shot charge/release, body-check, dunk/FIRE scenarios, nonhuman matchups, full short matches, and season progression.')
        print('Screenshots:',', '.join(p.name for p in OUT.glob('*.png')))
finally:
    server.terminate();server.wait(timeout=5)
