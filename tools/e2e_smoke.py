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
        page.click('#play')
        page.wait_for_function("document.querySelector('#game-screen').classList.contains('hidden') === false")
        page.wait_for_timeout(700)
        page.screenshot(path=str(OUT/'court-chicago-crownfire.png'))
        initial=page.evaluate('window.jamverse.state.players[0].x')
        page.keyboard.down('d');page.wait_for_timeout(250);page.keyboard.up('d')
        moved=page.evaluate('window.jamverse.state.players[0].x')
        assert moved>initial,f'right movement failed: {initial} -> {moved}'
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
        assert not errors,errors
        assert not bad,bad
        browser.close()
        print('PASS Chromium browser journey; 35 teams / 105 athletes; controls, pause, nonhuman matchups, full short match and rematch-to-menu.')
        print('Screenshots:',', '.join(p.name for p in OUT.glob('*.png')))
finally:
    server.terminate();server.wait(timeout=5)
