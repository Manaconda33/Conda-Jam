"""Review Kraken's celebrate candidate through the real score transition."""
from pathlib import Path
from os import environ
from subprocess import Popen, DEVNULL
from time import monotonic, sleep
from urllib.request import urlopen
from hashlib import sha256
import json

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PORT = environ.get("PORT", "4241")
URL = f"http://127.0.0.1:{PORT}/"
ATLAS = "./public/assets/animation/kraken-celebrate-right.png"
PROMPT_PATH = "tools/generate-art/kraken-celebrate10-attempt04-imagegen-prompt.txt"
TRACK = [5, 5, 6, 8, 10, 10, 8, 7, 6, 5]
TICKS = [0, 5, 10, 16, 24, 34, 44, 52, 59, 65]
OUT = ROOT / "tools/generate-art/previews/kraken-celebrate10-attempt04/scoring-transition/normal-loader-review"
OUT.mkdir(parents=True, exist_ok=True)
report = {
    "athlete": "kraken",
    "clip": "celebrate",
    "renderer": "Chromium production Jam Stage canvas",
    "atlas": ATLAS,
    "atlasSha256": sha256((ROOT / ATLAS[2:]).read_bytes()).hexdigest(),
    "generationId": "exec-9d03ef60-48f3-4ab8-a07e-441c5d89b4bf",
    "prompt": PROMPT_PATH,
    "runtimeIntegration": True,
    "candidateAtlasInjected": False,
    "candidateBallTrackInjected": False,
    "normalLoader": "public/assets/animation/manifest.json → src/content/animation-assets.js → loadProductionSprites → selectProductionSprite",
    "cleanupPass": "cleanup02",
    "frameDimensions": [88, 96],
    "baselineY": 94,
    "scoringTransition": "Production commitScore(match,{id,team,playerId,points}) starts Kraken celebrate and marks the ball dead/unowned; no score, clip, or tick is injected.",
    "court": "current Jam Stage; Vesper Harbor Undertow vs Chicago Condas",
    "courtY": 90,
    "frameDurations": TRACK,
    "sampledTicks": TICKS,
    "runs": [],
    "uncaughtBrowserErrors": [],
}
server = Popen(["node", "tools/server.mjs"], cwd=ROOT, env={**environ, "PORT": PORT}, stdout=DEVNULL, stderr=DEVNULL)
try:
    deadline = monotonic() + 30
    while monotonic() < deadline:
        if server.poll() is not None:
            raise RuntimeError("Jam Stage server exited")
        try:
            with urlopen(URL, timeout=1) as response:
                if response.status == 200:
                    break
        except Exception:
            sleep(0.1)
    else:
        raise TimeoutError("Jam Stage server readiness")

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path="/usr/bin/chromium", args=["--no-sandbox", "--disable-dev-shm-usage"])
        for zoom in (100, 120):
            for facing, direction in ((1, "right"), (-1, "left")):
                page = browser.new_page(viewport={"width": 900, "height": 700}, device_scale_factor=1)
                errors = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.add_init_script("window.requestAnimationFrame=()=>0")

                def expose_main(route):
                    response = route.fetch()
                    route.fulfill(response=response, body=response.text() + "\nwindow.__productionSpriteImagesForReview=productionSpriteImages;")



                page.route("**/src/main.js", expose_main)
                page.goto(URL, wait_until="networkidle", timeout=120000)
                page.wait_for_function("window.jamverse&&window.jamverse.rosterCheck.athletes===105", timeout=120000)
                home, away = (("vesper-harbor-undertow", "chicago-condas") if facing > 0 else ("chicago-condas", "vesper-harbor-undertow"))
                init = page.evaluate("""async({home,away,zoom})=>{
                  const {animationAssetManifest}=await import('/src/content/animation-assets.js');
                  const {commitScore}=await import('/src/core/simulation.js');
                  const {selectProductionSprite}=await import('/src/render/animation-sprites.js');
                  const match=window.jamverse.start(home,away,180,1013904226);const state=window.jamverse.state;
                  const k=state.players.find(p=>p.id==='kraken');state.players=[k];k.facing=home==='vesper-harbor-undertow'?1:-1;k.x=90;k.y=50;k.z=0;k.hasBall=false;k.vx=k.vy=k.vz=0;
                  state.ball.mode='dead';state.ball.ownerId=null;state.ball.x=k.x;state.ball.y=k.y;state.ball.z=0;state.ball.lastTouch=k.id;state.score=[0,0];state.pause=false;
                  const ok=commitScore(state,{id:'kraken-celebrate-review',team:k.team,playerId:k.id,points:2});
                  if(!ok||k.animation.clip!=='celebrate'||k.animation.tick!==0)throw Error('production score did not start Kraken celebrate');
                  window.__review={manifest:animationAssetManifest,selectProductionSprite,k};
                  document.querySelector('#camera-zoom').value=String(zoom);document.querySelector('#camera-zoom').dispatchEvent(new Event('input',{bubbles:true}));
                  return{score:[...state.score],ballMode:state.ball.mode,owner:state.ball.ownerId,event:state.events.at(-1),clip:k.animation.clip,tick:k.animation.tick};
                }""", {"home": home, "away": away, "zoom": zoom})
                page.wait_for_function("(src)=>{const image=window.__productionSpriteImagesForReview?.get(src);return Boolean(image?.complete&&image.naturalWidth)}", arg=ATLAS, timeout=120000, polling=100)
                run = {"facing": facing, "direction": direction, "zoom": zoom, "scoreTransition": init, "captures": []}
                for index, tick in enumerate(TICKS):
                    info = page.evaluate("""({tick})=>{
                      const game=window.jamverse,state=game.state,k=window.__review.k;while(k.animation.tick<tick)game.tick(1,[{playerId:k.id}]);game.tick(0,[]);
                      const selected=window.__review.selectProductionSprite(k,{manifest:window.__review.manifest,images:window.__productionSpriteImagesForReview});
                      return{tick:k.animation.tick,clip:k.animation.clip,selectedFrame:selected?.frame,selectedSrc:selected?.src,flip:selected?.flip,score:[...state.score],ballMode:state.ball.mode,owner:state.ball.ownerId,scored:state.ball.scored,event:state.events.at(-1)};
                    }""", {"tick": tick})
                    expected_score = [2, 0] if facing > 0 else [0, 2]
                    if info["tick"] != tick or info["selectedFrame"] != index or info["selectedSrc"] != ATLAS or info["flip"] != (facing < 0) or info["score"] != expected_score or info["ballMode"] != "dead" or info["owner"] is not None:
                        raise RuntimeError("celebration state/selector mismatch " + json.dumps(info))
                    name = f"{direction}-frame{index:02d}-tick{tick}-zoom{zoom}.png"
                    page.locator("#game").screenshot(path=str(OUT / name))
                    info["path"] = (OUT / name).relative_to(ROOT).as_posix()
                    run["captures"].append(info)
                if errors:
                    report["uncaughtBrowserErrors"].extend(errors)
                    raise RuntimeError(str(errors))
                report["runs"].append(run)
                page.close()
        browser.close()
    report["captureCount"] = sum(len(run["captures"]) for run in report["runs"])
    (OUT / "report.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps({"captures": report["captureCount"], "errors": report["uncaughtBrowserErrors"], "output": str(OUT)}))
finally:
    server.terminate()
    server.wait(timeout=5)
