"""GitHub Actions-only Marin/Juniper visual-donor integration probe.

All scenarios use the registered JAMVERSE gameplay renderer, simulation ticks
and original published PR6/PR7 source. The candidate calibration is installed
separately in an ephemeral runner worktree. No generated clips are injected.
This script records reproducible evidence, NOT independent art acceptance.
"""
from hashlib import sha256
from pathlib import Path
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
import json
import os

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "tools/generate-art/previews/marin-live-pr6-pr7-scratch"
OUT.mkdir(parents=True, exist_ok=True)
PORT = "4297"
URL = "http://127.0.0.1:" + PORT + "/"
REQUIRED_CLIPS = ["idle-ball", "dribble", "dribble-run", "pass", "receive"]
CAPTURE_STEPS = {
    "idle-ball": {0, 1, 4, 8, 16, 24},
    "dribble": {0, 1, 2, 3, 5, 7, 9},
    "dribble-run": {0, 1, 2, 3, 5, 7, 9},
    "pass-catch": {0, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23},
}
REPORT = {
    "category": "scratch-gameplay-driven-normal-loader-evidence",
    "accepted": False,
    "runtime": "published PR6 plus PR7 ephemeral combined checkout",
    "visualDonor": "juniper-vale",
    "originalMythWorkspaceAccess": False,
    "runs": [],
    "errors": [],
    "screenshotCount": 0,
}
server = None


def expose_images(route):
    response = route.fetch()
    route.fulfill(
        response=response,
        body=response.text() + "\nwindow.__productionSpriteImagesForReview=productionSpriteImages;\n",
    )


def wait_ready():
    deadline = monotonic() + 30
    while monotonic() < deadline:
        if server.poll() is not None:
            raise RuntimeError("JAMVERSE game server exited")
        try:
            if urlopen(URL, timeout=1).status == 200:
                return
        except Exception:
            sleep(0.1)
    raise RuntimeError("JAMVERSE game server unavailable")


def setup_scenario(page, direction, zoom, scenario):
    return page.evaluate(
        """async ({facing,zoom,scenario}) => {
          const game=window.jamverse;
          game.start('vesper-harbor-undertow','scoria-rams',180,110);
          const state=game.state;
          const marin=state.players.find(p=>p.id==='marin-dusk');
          const kraken=state.players.find(p=>p.id==='kraken');
          if(!marin||!kraken)throw Error('Exact registered Marin/Kraken roster not loaded');
          for(const p of state.players){
            p.hasBall=false;p.vx=p.vy=p.vz=p.z=0;p.charge=0;p.stun=999;
            p.animation={clip:'idle',tick:0};p.anim='idle';
            if(p!==marin&&p!==kraken){p.x=p.team===marin.team?35:175;p.y=8;}
          }
          marin.stun=0;marin.facing=facing;marin.y=75;
          marin.x=scenario==='pass-catch'?100-facing*20:100;
          marin.animation={clip:'idle-ball',tick:0};
          // Simulation locomotion state is idle, while animation clip is idle-ball.
          // This is the normal createMatch/stepMatch contract.
          marin.anim='idle';marin.hasBall=true;
          kraken.stun=0;kraken.facing=-facing;kraken.y=75;
          kraken.x=scenario==='pass-catch'?100:145;
          const core=await import('/src/core/animation.js');
          const x=marin.x+facing*core.sampleBallForward('idle-ball',0,marin.id);
          const z=core.sampleBallHeight('idle-ball',0,marin.id);
          state.phase='playing';state.pause=false;state.practice=true;
          state.possession=marin.team;state.scorePause=0;
          state.clock=180;state.shotClock=24;state.pendingInboundTeam=null;
          Object.assign(state.ball,{
            mode:'carried',ownerId:marin.id,targetId:null,aerialTargetId:null,
            lastTouch:marin.id,attemptId:null,scored:false,
            x,y:marin.y,z,vx:0,vy:0,vz:0
          });
          const slider=document.querySelector('#camera-zoom');
          slider.value=String(zoom);
          slider.dispatchEvent(new Event('input',{bubbles:true}));
          window.__marinLiveReview={
            core,manifest:(await import('/src/content/animation-assets.js')).animationAssetManifest,
            select:(await import('/src/render/animation-sprites.js')).selectProductionSprite
          };
          game.tick(0,[]);
          return {marinId:marin.id,krakenId:kraken.id,team:marin.team,zoom,facing};
        }""",
        {"facing": direction, "zoom": zoom, "scenario": scenario},
    )


def sample_gameplay(page, scenario, facing, step):
    return page.evaluate(
        """({scenario,facing,step}) => {
          const game=window.jamverse;
          const state=game.state;
          const marin=state.players.find(p=>p.id==='marin-dusk');
          const kraken=state.players.find(p=>p.id==='kraken');
          if(step>0){
            const frames=state.players.map(p=>({
              playerId:p.id,
              ...(p.id===marin.id&&scenario==='dribble'?{x:facing}:{}),
              ...(p.id===marin.id&&scenario==='dribble-run'?{x:facing,turbo:true}:{}),
              ...(p.id===marin.id&&scenario==='pass-catch'&&step===1?{passPressed:true,passVariant:'pass'}:{})
            }));
            game.tick(1,frames);
          }else game.tick(0,[]);
          const review=window.__marinLiveReview;
          const images=window.__productionSpriteImagesForReview;
          const sprite=p=>{
            const s=review.select(p,{manifest:review.manifest,images});
            return s?{src:s.src,frame:s.frame,flip:s.flip,
              libraryId:s.libraryId,classification:s.classification,production:s.production}:null;
          };
          const player=p=>({
            id:p.id,x:p.x,y:p.y,z:p.z,facing:p.facing,hasBall:p.hasBall,
            clip:p.animation.clip,tick:p.animation.tick,atlas:sprite(p)
          });
          const ball=state.ball;
          const hand=p=>{
            const clip=p.animation.clip,tick=p.animation.tick;
            return {
              x:p.x+p.facing*review.core.sampleBallForward(clip,tick,p.id),
              z:p.z+review.core.sampleBallHeight(clip,tick,p.id)
            };
          };
          return {
            step,scene:scenario,
            marin:player(marin),kraken:player(kraken),
            ball:{mode:ball.mode,ownerId:ball.ownerId,targetId:ball.targetId,
              lastTouch:ball.lastTouch,x:ball.x,y:ball.y,z:ball.z},
            expectedHandMarin:hand(marin),expectedHandKraken:hand(kraken),
            events:state.events.slice(-3).map(e=>e.text||String(e))
          };
        }""",
        {"scenario": scenario, "facing": facing, "step": step},
    )


def validate_run(run):
    scene = run["scenario"]
    records = run["frames"]
    active = [x for x in records[1:] if x["marin"]["clip"] == scene]
    if scene in ("dribble", "dribble-run"):
        if len(active) < 4:
            raise AssertionError(scene + " never established active locomotion clip")
        for x in active:
            if x["ball"]["mode"] != "carried" or x["ball"]["ownerId"] != "marin-dusk":
                raise AssertionError("Marin lost the ball during " + scene)
            hand = x["expectedHandMarin"]
            if abs(x["ball"]["x"] - hand["x"]) > 1e-4:
                raise AssertionError("Marin carried-ball x diverged from registered track")
            if abs(x["ball"]["z"] - hand["z"]) > 1e-4:
                raise AssertionError("Marin carried-ball z diverged from registered track")
    if scene == "idle-ball":
        if not any(x["marin"]["clip"] == "idle-ball" for x in records):
            raise AssertionError("No real idle-ball frames")
    if scene == "pass-catch":
        if not any(x["ball"]["mode"] == "pass" for x in records):
            raise AssertionError("Pass never released")
        prev = None
        catch = None
        for x in records:
            if x["kraken"]["hasBall"] and (prev is None or not prev["kraken"]["hasBall"]):
                catch = x
                run["catchDelta"] = {
                    "x": x["ball"]["x"] - prev["ball"]["x"] if prev else None,
                    "z": x["ball"]["z"] - prev["ball"]["z"] if prev else None,
                }
            prev = x
        if not catch:
            raise AssertionError("Kraken never completed the actual pass/receive catch")
        if catch["ball"]["ownerId"] != "kraken":
            raise AssertionError("Wrong owner after catch")
        if catch["kraken"]["clip"] != "receive":
            raise AssertionError("Registered receive animation missing at catch")
        if abs(run["catchDelta"]["x"]) >= .02 or abs(run["catchDelta"]["z"]) >= .01:
            raise AssertionError("Catch snap exceeds baseline accepted tolerance")
        run["catchStep"] = catch["step"]
    for x in records:
        marin = x["marin"]
        atlas = marin["atlas"]
        if atlas is None or not atlas["production"] or atlas["libraryId"] != "juniper-vale":
            raise AssertionError("Marin used missing/nonproduction/non-Juniper visual atlas")
        if not atlas["src"].startswith("./public/assets/animation/juniper-vale-"):
            raise AssertionError("Marin visual atlas source mismatch")
        kraken = x["kraken"]
        if kraken["clip"] == "receive":
            atlas = kraken["atlas"]
            if atlas is None or atlas["libraryId"] != "kraken" or not atlas["production"]:
                raise AssertionError("Kraken receive did not select registered production atlas")


def run_all(browser):
    for facing, label in [(1, "right"), (-1, "left")]:
        for zoom in [100, 120]:
            page = browser.new_page(viewport={"width": 900, "height": 700}, device_scale_factor=1)
            page.on("pageerror", lambda exc: REPORT["errors"].append(str(exc)))
            page.add_init_script("window.requestAnimationFrame=()=>0")
            page.route("**/src/main.js", expose_images)
            page.goto(URL, wait_until="networkidle", timeout=120000)
            page.wait_for_function("window.jamverse && window.jamverse.rosterCheck.athletes===105")
            sources = page.evaluate(
                """async clips=>{
                  const {animationAssetManifest:m}=await import('/src/content/animation-assets.js');
                  const own=m.characters['juniper-vale'].directions.right;
                  return clips.map(clip=>({clip,src:own[clip]?.src||null})).concat([
                    {clip:'kraken-receive',src:m.characters.kraken.directions.right.receive?.src||null}
                  ]);
                }""",
                REQUIRED_CLIPS,
            )
            missing = [s["clip"] for s in sources if not s["src"]]
            if missing:
                raise RuntimeError("Registered manifest missing needed clips: " + repr(missing))
            REPORT["registeredSources"] = sources
            for scene in ["idle-ball", "dribble", "dribble-run", "pass-catch"]:
                setup = setup_scenario(page, facing, zoom, scene)
                # Source atlases are loaded by beginMatch/loadProductionSprites,
                # so never await the images while still in the menu.
                try:
                    page.wait_for_function(
                        """items=>items.every(item=>{
                          const im=window.__productionSpriteImagesForReview?.get(item.src);
                          return Boolean(im?.complete&&im.naturalWidth);
                        })""",
                        arg=sources, timeout=30000, polling=100,
                    )
                except Exception as exc:
                    statuses = page.evaluate(
                        """items=>items.map(item=>{
                          const im=window.__productionSpriteImagesForReview?.get(item.src);
                          return {clip:item.clip,src:item.src,inMap:Boolean(im),
                            complete:Boolean(im?.complete),width:im?.naturalWidth||0};
                        })""", sources
                    )
                    raise RuntimeError("Post-match sprite readiness failed: " + json.dumps(statuses)) from exc
                run = {
                    "facing": label, "zoom": zoom, "scenario": scene,
                    "setup": setup, "frames": [], "screenshots": []
                }
                limit = 26 if scene == "pass-catch" else 25 if scene == "idle-ball" else 12
                for step in range(limit):
                    state = sample_gameplay(page, scene, facing, step)
                    run["frames"].append(state)
                    if step in CAPTURE_STEPS[scene] or (
                        scene == "pass-catch" and step > 0 and
                        state["kraken"]["hasBall"] and
                        not run["frames"][-2]["kraken"]["hasBall"]
                    ):
                        name = "%s-zoom%s-%s-step%02d-%s-%s.png" % (
                            label, zoom, scene, step,
                            state["marin"]["clip"], state["kraken"]["clip"]
                        )
                        output = OUT / name
                        page.locator("#game").screenshot(path=str(output))
                        run["screenshots"].append({
                            "file": name, "sha256": sha256(output.read_bytes()).hexdigest(),
                            "step": step
                        })
                        REPORT["screenshotCount"] += 1
                validate_run(run)
                REPORT["runs"].append(run)
            page.close()


try:
    server = Popen(
        ["node", "tools/server.mjs"], cwd=ROOT, env={**os.environ, "PORT": PORT},
        stdout=DEVNULL, stderr=DEVNULL,
    )
    wait_ready()
    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=True, executable_path="/usr/bin/google-chrome",
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        try:
            run_all(browser)
        finally:
            browser.close()
except Exception as exc:
    REPORT["errors"].append(repr(exc))
finally:
    if server is not None:
        server.terminate()
        try:
            server.wait(timeout=5)
        except Exception:
            server.kill()
    (OUT / "report.json").write_text(json.dumps(REPORT, indent=2) + "\n")
    print(json.dumps({
        "runs": len(REPORT["runs"]), "screenshots": REPORT["screenshotCount"],
        "errors": REPORT["errors"], "output": str(OUT)
    }))
if REPORT["errors"]:
    raise RuntimeError("Marin actual-gameplay validation failed; inspect report and captured evidence")
if len(REPORT["runs"]) != 16:
    raise RuntimeError("Missing facing/zoom/scenario coverage")
