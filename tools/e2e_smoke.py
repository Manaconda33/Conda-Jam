from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import sleep
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'artifacts'/'screenshots'
OUT.mkdir(parents=True,exist_ok=True)
def leave_match(page,confirm=True):
    page.click('#back-menu')
    if page.locator('#quit-dialog').evaluate('(dialog)=>dialog.open'):
        page.click('#confirm-quit' if confirm else '#cancel-quit')

server=Popen(['node','tools/server.mjs'],cwd=ROOT,env={**environ,'PORT':'4175'},stdout=DEVNULL,stderr=DEVNULL)
standalone_server=Popen(['node','tools/server.mjs','dist'],cwd=ROOT,env={**environ,'PORT':'4176'},stdout=DEVNULL,stderr=DEVNULL)
try:
    sleep(.25)
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        page=browser.new_page(viewport={'width':1200,'height':900},device_scale_factor=1)
        errors=[]; bad=[]
        page.on('pageerror',lambda exc:errors.append(str(exc)))
        page.on('requestfailed',lambda req:bad.append(req.url))
        page.goto('http://127.0.0.1:4175',wait_until='networkidle')
        page.screenshot(path=str(OUT/'title.png'))
        roster=page.evaluate('window.jamverse.rosterCheck')
        assert roster['teams']==35 and roster['athletes']==105 and not roster['errors'],roster
        page.click('#settings')
        page.locator('#text-size').evaluate("el=>{el.value='120';el.dispatchEvent(new Event('input',{bubbles:true}))}")
        page.locator('#music-volume').evaluate("el=>{el.value='30';el.dispatchEvent(new Event('input',{bubbles:true}))}")
        page.locator('#effects-volume').evaluate("el=>{el.value='75';el.dispatchEvent(new Event('input',{bubbles:true}))}")
        page.check('#reduced-flash')
        page.check('#team-markers')
        page.uncheck('#screen-shake')
        page.uncheck('#audio-captions')
        assert page.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--ui-zoom').trim()")=='1.2'
        cabinet=page.locator('.cabinet').bounding_box()
        assert cabinet['y']>=0 and cabinet['y']+cabinet['height']<=900,cabinet
        page.locator('.key-settings summary').click()
        page.locator("#key-bindings button[data-player='0'][data-action='right']").click()
        page.keyboard.press('e')
        page.click('#settings-dialog .dialog-button')
        settings=page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v5'))")
        assert settings['textSize']==120 and settings['musicVolume']==.3 and settings['effectsVolume']==.75 and settings['screenShake'] is False and settings['reducedFlash'] is True and settings['audioCaptions'] is False and settings['teamMarkers'] is True and settings['controls'][0]['right']=='e',settings
        page.click('#settings')
        page.locator('#text-size').evaluate("el=>{el.value='100';el.dispatchEvent(new Event('input',{bubbles:true}))}")
        page.locator('#music-volume').evaluate("el=>{el.value='55';el.dispatchEvent(new Event('input',{bubbles:true}))}")
        page.locator('#effects-volume').evaluate("el=>{el.value='55';el.dispatchEvent(new Event('input',{bubbles:true}))}")
        page.uncheck('#reduced-flash')
        page.uncheck('#team-markers')
        page.check('#screen-shake')
        page.check('#audio-captions')
        page.click('#settings-dialog .dialog-button')
        page.click('#choose-home')
        assert page.locator('.team-choice').count()==35
        assert page.locator('.team-choice canvas.captain-portrait').count()==35
        assert page.locator('.team-choice canvas.team-crest').count()==35
        page.wait_for_function("document.querySelector('.team-choice canvas').dataset.artSource==='generated-atlas'")
        page.wait_for_function("document.querySelector('.team-crest').dataset.artSource==='generated-atlas'")
        assert page.locator('.captain-portrait[data-art-source="generated-atlas"]').count()==35,'all captains should use generated portrait atlas art'
        assert page.locator('.team-crest[data-art-source="generated-atlas"]').count()==35,'all franchises should use generated crest atlas art'
        assert '3PT' in page.locator(".team-choice[data-team-id='chicago-condas']").get_attribute('title')
        assert 'Manaconda' in page.locator(".team-choice[data-team-id='chicago-condas'] .roster-summary").inner_text()
        assert '#3' in page.locator(".team-choice[data-team-id='chicago-condas'] .roster-summary").inner_text()
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
        page.screenshot(path=str(OUT/'captain-dragon-queen.png'))
        for slug,label,name in [
            ('emberwood-kits','Emberwood Kits','Paprika'),
            ('venom-delta-fangs','Venom Delta Fangs','Suga'),
            ('lantern-hollow-wombats','Lantern Hollow Wombats','Steeb'),
            ('london-royal-spots','London Royal Spots','GB Design'),
            ('stripewood-longarms','Stripewood Longarms','Quirky')
        ]:
            page.select_option('#home-team',label=label)
            assert page.locator('#choose-home b').inner_text()==name
            page.screenshot(path=str(OUT/f'captain-{slug}.png'))
        for slug,label,name in [
            ('manaconda','Chicago Condas','Manaconda'),
            ('keeg','Moonmorel Hex','Keeg'),
            ('krios','Scoria Rams','Krios'),
            ('e-indigo','Astral Drift Orbits','E. Indigo'),
            ('avek','Amp City Thunderchords','Avek'),
            ('dea','Cheshire Hollow Grinners','Dea')
        ]:
            page.select_option('#home-team',label=label)
            assert page.locator('#choose-home b').inner_text()==name
            page.screenshot(path=str(OUT/f'captain-{slug}.png'))
        captains=page.evaluate("window.jamverse.teams.map(t=>({id:t.id,name:t.roster[0].name}))")
        for captain in captains:
            page.select_option('#home-team',value=captain['id'])
            assert page.locator('#choose-home b').inner_text()==captain['name'],captain
        page.select_option('#home-team',label='Chicago Condas')
        page.click('#practice')
        page.evaluate("window.jamverse.state.ball.mode='loose';window.jamverse.state.ball.ownerId=null;for(const p of window.jamverse.state.players)p.hasBall=false")
        page.keyboard.press('r')
        practice=page.evaluate('({practice:window.jamverse.state.practice,clock:window.jamverse.state.clock,shotClock:window.jamverse.state.shotClock,owner:window.jamverse.state.ball.ownerId})')
        assert practice['practice'] and practice['clock']==9999 and practice['shotClock']==24 and practice['owner']==page.evaluate('window.jamverse.state.players[0].id'),practice
        page.evaluate('window.jamverse.tick(1800)')
        assert page.evaluate("window.jamverse.state.phase==='playing'&&window.jamverse.state.clock===9999&&window.jamverse.state.shotClock===24")
        page.evaluate("window.dispatchEvent(new Event('blur'))")
        assert page.evaluate('window.jamverse.state.pause'),'browser focus loss must freeze the active match'
        page.keyboard.press('Enter')
        assert page.evaluate('!window.jamverse.state.pause'),'the active match must resume cleanly after focus returns'
        page.click('#back-menu')
        assert page.locator('#quit-dialog').evaluate('(dialog)=>dialog.open'),'quitting an active match must request confirmation'
        page.click('#cancel-quit')
        assert page.locator('#quit-dialog').evaluate('(dialog)=>!dialog.open') and page.evaluate("window.jamverse.state.phase==='playing' && !window.jamverse.state.pause"),'canceling quit must resume the same match'
        leave_match(page)
        page.select_option('#home-lineup',value='juniper-vale')
        page.select_option('#difficulty',label='Rookie')
        page.click('#play')
        page.wait_for_function("document.querySelector('#game').dataset.gameplayArt==='generated-full-roster-atlases'")
        page.wait_for_function('window.jamverse.audioStatus.music===true')
        assert page.evaluate("window.jamverse.state.difficulty==='Rookie'"),'selected CPU difficulty must reach the running match'
        assert page.evaluate("window.jamverse.state.players.find(p=>p.team===0&&p.id==='juniper-vale')!==undefined")
        assert page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v5')).homePartnerId==='juniper-vale'")
        assert 'E MOVE' in page.locator('#game-controls-hint').inner_text()
        page.wait_for_function("document.querySelector('#game-screen').classList.contains('hidden') === false")
        page.wait_for_timeout(700)
        page.screenshot(path=str(OUT/'court-chicago-crownfire.png'))
        assert page.locator('#game').get_attribute('data-gameplay-art')=='generated-full-roster-atlases','on-court canonical captains should use generated full-body art'
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
        assert page.url=='http://127.0.0.1:4175/'
        leave_match(page)
        assert page.locator('#start-screen').is_visible()
        page.check('#two-players')
        page.click('#play')
        second_initial=page.evaluate('window.jamverse.state.players[2].y')
        page.keyboard.down('ArrowDown');page.wait_for_timeout(250);page.keyboard.up('ArrowDown')
        second_moved=page.evaluate('window.jamverse.state.players[2].y')
        assert second_moved>second_initial,f'split-keyboard player 2 movement failed: {second_initial} -> {second_moved}'
        leave_match(page)
        page.check('#same-team')
        page.click('#play')
        assert page.evaluate("window.jamverse.controlledPlayers.join(',')===window.jamverse.state.players.slice(0,2).map(p=>p.id).join(',')"),'same-team co-op must assign both home athletes to human controls'
        coop_initial=page.evaluate('window.jamverse.state.players[1].y')
        page.keyboard.down('ArrowDown');page.wait_for_timeout(250);page.keyboard.up('ArrowDown')
        coop_moved=page.evaluate('window.jamverse.state.players[1].y')
        assert coop_moved>coop_initial,f'teammate co-op partner movement failed: {coop_initial} -> {coop_moved}'
        leave_match(page)
        page.uncheck('#two-players')
        assert page.locator('#same-team').is_disabled()
        # Start a real season fixture and let the simulation finish before checking saved advancement.
        page.select_option('#home-team',label='Chicago Condas')
        page.select_option('#quarter',value='180')
        standings_before=page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v5')).leagueRecords['chicago-condas'].played")
        page.click('#campaign')
        page.screenshot(path=str(OUT/'campaign-ladder.png'))
        page.click('#campaign-play')
        assert page.locator('#campaign-dialog').evaluate('(d)=>!d.open')
        assert page.evaluate("window.jamverse.state.teamNames[0]==='Chicago Condas'")
        page.evaluate('window.jamverse.tick(120000)')
        assert page.evaluate("window.jamverse.state.phase==='final'")
        page.wait_for_function("JSON.parse(localStorage.getItem('jamverse96-v5')).season.round === 1")
        season=page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v5')).season")
        assert season['teamId']=='chicago-condas' and season['round']==1,season
        records=page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v5')).leagueRecords")
        assert records['chicago-condas']['played']==standings_before+1 and records['chicago-condas']['wins']+records['chicago-condas']['losses']==records['chicago-condas']['played'],records['chicago-condas']
        assert records['chicago-condas']['wins'] in (0,1) and '-' in page.locator(".team-choice[data-team-id='chicago-condas'] i").inner_text()
        careers=page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v5')).careerRecords")
        assert len(careers)==105 and any(row['games']>0 for row in careers.values())
        leave_match(page)
        page.click('#standings')
        assert page.locator('#standings-list li').count()==35
        assert 'Chicago Condas' in page.locator('#standings-list').inner_text()
        page.locator('#standings-dialog .dialog-button').click()
        page.click('#careers')
        assert page.locator('#career-list li').count()<=10 and page.locator('#career-list li').count()>0
        page.locator('#career-dialog .dialog-button').click()
        page.keyboard.press('Escape')
        page.click('#campaign')
        page.click('#campaign-play')
        page.evaluate("window.jamverse.state.winner=1; window.jamverse.state.phase='final'")
        page.wait_for_function("JSON.parse(localStorage.getItem('jamverse96-v5')).season.complete === true")
        loss=page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v5')).season")
        assert loss['losses']==1 and loss['wins']==0,loss
        page.keyboard.press('Escape')
        page.click('#campaign')
        assert page.locator('#campaign-play').inner_text()=='START NEW RUN'
        page.click('#campaign-play')
        reset=page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v5')).season")
        assert reset['round']==0 and reset['complete'] is False,reset
        leave_match(page)
        page.click('#settings')
        before_reset=page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v5'))")
        page.once('dialog',lambda dialog:dialog.dismiss())
        page.click('#reset-progress')
        assert page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v5')).leagueRecords['chicago-condas'].played")==before_reset['leagueRecords']['chicago-condas']['played']
        page.once('dialog',lambda dialog:dialog.accept())
        page.click('#reset-progress')
        after_reset=page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v5'))")
        assert after_reset['season']['round']==0 and after_reset['season']['complete'] is False
        assert sum(row['played'] for row in after_reset['leagueRecords'].values())==0
        assert sum(row['games'] for row in after_reset['careerRecords'].values())==0
        assert after_reset['musicVolume']==before_reset['musicVolume'] and after_reset['controls']==before_reset['controls']
        page.click('#settings-dialog .dialog-button')
        # Play the saved cup route through three result commits and verify each round advances.
        page.click('#tournament')
        assert page.locator('#cup-bracket li').count()==3
        page.screenshot(path=str(OUT/'jam-cup-bracket.png'))
        opponents=[]
        for round_index in range(3):
            page.click('#cup-play')
            assert page.locator('#tournament-dialog').evaluate('(d)=>!d.open')
            opponents.append(page.evaluate('window.jamverse.state.teamNames[1]'))
            page.evaluate('window.jamverse.state.winner=0;window.jamverse.state.phase="final"')
            page.wait_for_function(f"JSON.parse(localStorage.getItem('jamverse96-v5')).tournament.round==={round_index+1}")
            if round_index<2:
                page.keyboard.press('Escape')
                page.click('#tournament')
                assert page.locator('#cup-play').inner_text().startswith('PLAY')
        cup=page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v5')).tournament")
        assert cup['complete'] and cup['champion']=='chicago-condas' and cup['results']==['win','win','win'],cup
        assert len(set(opponents))==3,opponents
        page.keyboard.press('Escape')
        page.evaluate("""window.jamverse.start('chicago-condas','crownfire-sovereigns',30,1);
          const m=window.jamverse.state,carrier=m.players.find(p=>p.team===1),target=m.players.find(p=>p.team===1&&p!==carrier),defender=m.players.find(p=>p.team===0);
          for(const p of m.players)p.hasBall=false; m.possession=1; carrier.hasBall=true; carrier.x=150;carrier.y=10;
          target.x=100;target.y=50;defender.x=100;defender.y=50;defender.strength=99;
          m.ball.mode='carried';m.ball.ownerId=carrier.id;m.ball.x=carrier.x;m.ball.y=carrier.y;m.ball.z=1;""")
        page.keyboard.down('l');page.wait_for_timeout(35);page.keyboard.down('k');page.wait_for_timeout(120);page.keyboard.up('k');page.keyboard.up('l')
        shove=page.evaluate("""(()=>{const m=window.jamverse.state,d=m.players.find(p=>p.team===0);return {players:m.players.map(p=>({id:p.id,team:p.team,anim:p.anim,stun:p.stun})),defenderKnockdowns:d.knockdowns,lastEvent:m.lastEvent}})()""")
        assert shove['defenderKnockdowns']==1 and any(p['team']==1 and p['anim']=='knockdown' for p in shove['players']),shove
        leave_match(page)
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
        page.evaluate("""(()=>{window.__testPads=Array.from({length:3},(_,index)=>({index,axes:[index===2?-1:0,0],buttons:Array.from({length:16},()=>({pressed:false,value:0})),connected:true}));Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>window.__testPads})})()""")
        page.wait_for_function('window.jamverse.controlledPlayers.length===4')
        page.evaluate('window.jamverse.state.pause=false')
        four_pad_start=page.evaluate('window.jamverse.state.players[3].x')
        page.wait_for_timeout(220)
        four_pad_end=page.evaluate('window.jamverse.state.players[3].x')
        four_player_state=page.evaluate("({controlled:window.jamverse.controlledPlayers,inputs:window.jamverse.keyState.inputs.map(i=>({id:i.playerId,x:i.x,y:i.y})),players:window.jamverse.state.players.map(p=>({id:p.id,x:p.x,y:p.y})),pause:window.jamverse.state.pause})")
        assert four_pad_end<four_pad_start,f'fourth local player (keyboard + three gamepads) movement failed: {four_pad_start} -> {four_pad_end}; {four_player_state}'
        page.evaluate("""(()=>{window.__testPads=Array.from({length:4},(_,index)=>({index,axes:[index===3?-1:0,0],buttons:Array.from({length:16},()=>({pressed:false,value:0})),connected:true}));Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>window.__testPads})})()""")
        page.wait_for_function('window.jamverse.keyState.inputs.length===4 && window.jamverse.keyState.inputs.every(i=>i.playerId)')
        page.evaluate('window.jamverse.state.pause=false')
        four_controller_start=page.evaluate('window.jamverse.state.players[3].x')
        page.wait_for_timeout(220)
        four_controller_end=page.evaluate('window.jamverse.state.players[3].x')
        assert four_controller_end<four_controller_start,f'four-gamepad movement failed: {four_controller_start} -> {four_controller_end}'
        page.evaluate("Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[]})")
        page.wait_for_function('window.jamverse.controlledPlayers.length===1')
        leave_match(page)
        page.set_viewport_size({'width':390,'height':844})
        cabinet=page.locator('.cabinet').bounding_box()
        assert cabinet['x']>=0 and cabinet['x']+cabinet['width']<=390 and cabinet['y']>=0 and cabinet['y']+cabinet['height']<=844,cabinet
        page.click('#choose-home')
        assert page.locator('.team-choice').count()==35
        assert page.locator('.team-choice canvas.captain-portrait').count()==35
        assert page.locator('.team-choice canvas.team-crest').count()==35
        assert '3PT' in page.locator(".team-choice[data-team-id='chicago-condas']").get_attribute('title')
        assert 'Manaconda' in page.locator(".team-choice[data-team-id='chicago-condas'] .roster-summary").inner_text()
        page.locator(".team-choice[data-team-id='verdant-reach-archers']").click()
        assert page.locator('#home-team').input_value()=='verdant-reach-archers'
        mobile=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
        mobile.on('pageerror',lambda exc:errors.append(str(exc)))
        mobile.goto('http://127.0.0.1:4175',wait_until='networkidle')
        mobile.select_option('#quarter','60')
        mobile.click('#play')
        assert mobile.locator('.touch-controls').is_visible()
        before=mobile.evaluate('window.jamverse.state.players[0].x')
        right=mobile.locator('[data-touch="right"]');box=right.bounding_box()
        mobile.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);mobile.mouse.down();mobile.wait_for_timeout(180);mobile.mouse.up()
        after=mobile.evaluate('window.jamverse.state.players[0].x')
        assert after>before,f'touch movement failed: {before} -> {after}'
        shoot=mobile.locator('[data-touch="shoot"]');shotbox=shoot.bounding_box()
        mobile.mouse.move(shotbox['x']+shotbox['width']/2,shotbox['y']+shotbox['height']/2);mobile.mouse.down();mobile.wait_for_timeout(100);mobile.mouse.up();mobile.wait_for_timeout(120)
        assert mobile.evaluate('window.jamverse.state.players[0].fga')>0,'touch shoot did not register'
        leave_match(mobile);mobile.click('#practice')
        assert mobile.locator('[data-touch="reset"]').is_visible(),'practice ball-reset button must be available on touch screens'
        mobile.evaluate("window.jamverse.state.ball.mode='loose';window.jamverse.state.ball.ownerId=null;for(const p of window.jamverse.state.players)p.hasBall=false")
        reset=mobile.locator('[data-touch="reset"]');box=reset.bounding_box();mobile.mouse.click(box['x']+box['width']/2,box['y']+box['height']/2)
        assert mobile.evaluate('window.jamverse.state.ball.ownerId===window.jamverse.state.players[0].id')
        mobile.set_viewport_size({'width':320,'height':568})
        controls=mobile.locator('.touch-controls').bounding_box()
        assert controls['x']>=0 and controls['x']+controls['width']<=320,controls
        mobile.close()
        migration=browser.new_page(viewport={'width':1200,'height':900})
        migration.add_init_script("""localStorage.setItem('jamverse96-v1',JSON.stringify({home:'emberwood-kits',away:'venom-delta-fangs',volume:.3,textSize:110,reducedFlash:true,teamMarkers:true,difficulty:'Legend',quarter:120,season:{teamId:'emberwood-kits',round:2,wins:2,losses:0,complete:false,lastResult:'win'}}))""")
        migration.goto('http://127.0.0.1:4175',wait_until='networkidle')
        migrated=migration.evaluate("JSON.parse(localStorage.getItem('jamverse96-v5'))")
        assert migrated['schemaVersion']==5 and migrated['home']=='emberwood-kits' and migrated['away']=='venom-delta-fangs',migrated
        assert migrated['musicVolume']==.3 and migrated['effectsVolume']==.3 and migrated['textSize']==110 and migrated['season']['wins']==2 and len(migrated['leagueRecords'])==35 and len(migrated['careerRecords'])==105,migrated
        assert migration.locator('#home-team').input_value()=='emberwood-kits'
        migration.close()
        preview=browser.new_page(viewport={'width':1200,'height':900})
        preview_errors=[];preview_bad=[]
        preview.on('pageerror',lambda exc:preview_errors.append(str(exc)))
        preview.on('requestfailed',lambda req:preview_bad.append(req.url))
        preview.goto('http://127.0.0.1:4176/',wait_until='networkidle')
        preview.wait_for_function("document.querySelector('.team-choice canvas').dataset.artSource==='generated-atlas'")
        preview.wait_for_function("document.querySelector('.team-crest').dataset.artSource==='generated-atlas'")
        assert preview.locator('.captain-portrait[data-art-source="generated-atlas"]').count()==35
        assert preview.locator('.team-crest[data-art-source="generated-atlas"]').count()==35
        assert not preview_errors,preview_errors
        assert not preview_bad,preview_bad
        assert preview.evaluate("performance.getEntriesByType('resource').filter(r=>new URL(r.name).origin!==location.origin).length")==0
        preview.close()
        standalone=browser.new_page(viewport={'width':1200,'height':900})
        standalone_errors=[];standalone.on('pageerror',lambda exc:standalone_errors.append(str(exc)))
        standalone.goto('http://127.0.0.1:4176/JAMVERSE_96.html',wait_until='load')
        standalone_roster=standalone.evaluate('window.jamverse.rosterCheck')
        assert standalone_roster['teams']==35 and standalone_roster['athletes']==105 and not standalone_roster['errors'],standalone_roster
        assert standalone.evaluate("performance.getEntriesByType('resource').filter(r=>new URL(r.name).origin!==location.origin).length")==0
        standalone.click('#play')
        standalone.wait_for_function("document.querySelector('#game').dataset.gameplayArt==='generated-full-roster-atlases'")
        standalone.wait_for_function("document.querySelector('#game').dataset.supportPortraits==='generated-70-athlete-atlas'")
        standalone.wait_for_function("document.querySelector('#game').dataset.runArt==='generated-105-athlete-run-poses'")
        standalone.wait_for_function("document.querySelector('#game').dataset.shotArt==='generated-105-athlete-shot-poses'")
        standalone.wait_for_function("document.querySelector('#game').dataset.dunkArt==='generated-105-athlete-dunk-poses'")
        standalone.wait_for_function('window.jamverse.audioStatus.music===true')
        standalone.wait_for_function('window.jamverse.state?.players?.length===4')
        assert not standalone_errors,standalone_errors
        standalone.close()
        page.set_viewport_size({'width':1200,'height':900})
        assert not errors,errors
        assert not bad,bad
        browser.close()
    print('PASS Chromium journeys; standalone file opens offline with 35 teams / 105 athletes and tips off; 35 teams / 105 athletes; CPU difficulty selection, keyboard/gamepad rebinding, split-team and same-team co-op, touch movement and touch shooting, pause and disconnect fallback, settings, substitutions, held-shot charge/release, body-check, dunk/FIRE scenarios, nonhuman matchups, a complete default-length match, and season progression.')
    print('Screenshots:',', '.join(p.name for p in OUT.glob('*.png')))
finally:
    server.terminate();server.wait(timeout=5)
    standalone_server.terminate();standalone_server.wait(timeout=5)
