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
        page.select_option('#home-team',label='Chicago Condas')
        page.select_option('#away-team',label='Crownfire Sovereigns')
        page.select_option('#home-lineup',value='juniper-vale')
        page.click('#play')
        assert page.evaluate("window.jamverse.state.players.find(p=>p.team===0&&p.id==='juniper-vale')!==undefined")
        assert page.evaluate("JSON.parse(localStorage.getItem('jamverse96-v1')).homePartnerId==='juniper-vale'")
        page.wait_for_function("document.querySelector('#game-screen').classList.contains('hidden') === false")
        page.wait_for_timeout(700)
        page.screenshot(path=str(OUT/'court-chicago-crownfire.png'))
        initial=page.evaluate('window.jamverse.state.players[0].x')
        page.keyboard.down('d');page.wait_for_timeout(250);page.keyboard.up('d')
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
        page.wait_for_function("window.jamverse.state.phase === 'playing'")
        page.keyboard.down('k');page.wait_for_timeout(80);page.keyboard.up('k')
        page.keyboard.down('j');page.wait_for_timeout(80);page.keyboard.up('j')
        page.keyboard.press('Enter')
        assert page.evaluate('window.jamverse.state.pause') is True
        page.keyboard.press('Enter')
        assert page.evaluate('window.jamverse.state.pause') is False
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
        assert not errors,errors
        assert not bad,bad
        browser.close()
        print('PASS Chromium browser journey; 35 teams / 105 athletes; movement, substitution controls, body-check, dunk/FIRE scenarios, nonhuman matchups, full short matches, and season win/loss/replay.')
        print('Screenshots:',', '.join(p.name for p in OUT.glob('*.png')))
finally:
    server.terminate();server.wait(timeout=5)
