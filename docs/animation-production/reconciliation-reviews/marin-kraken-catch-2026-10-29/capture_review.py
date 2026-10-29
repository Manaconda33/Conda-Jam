from __future__ import annotations

import json
import os
import socket
import subprocess
import time
from pathlib import Path
from urllib.request import urlopen

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent / "attempt-02"
HOME_TEAM = "vesper-harbor-undertow"
AWAY_TEAM = "chicago-condas"


def free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def wait_server(url: str, process: subprocess.Popen) -> None:
    deadline = time.monotonic() + 20
    while time.monotonic() < deadline:
        if process.poll() is not None:
            raise RuntimeError("candidate server exited before becoming ready")
        try:
            with urlopen(url, timeout=1) as response:
                if response.status == 200:
                    return
        except Exception:
            time.sleep(.1)
    raise TimeoutError(f"candidate server unavailable: {url}")


def make_contact_sheet(paths: list[Path], output: Path) -> None:
    columns, cell_w, cell_h, label_h = 3, 480, 360, 28
    rows = (len(paths) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * cell_w, rows * (cell_h + label_h)), "#151a2c")
    draw = ImageDraw.Draw(sheet)
    for index, path in enumerate(paths):
        x = (index % columns) * cell_w
        y = (index // columns) * (cell_h + label_h)
        draw.text((x + 8, y + 7), path.stem, fill="#f5e9b2")
        with Image.open(path) as frame:
            sheet.paste(frame.convert("RGB"), (x, y + label_h))
    sheet.save(output)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    port = free_port()
    server = subprocess.Popen(
        ["node", "tools/server.mjs"], cwd=ROOT,
        env={**os.environ, "PORT": str(port)}, stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE, text=True,
    )
    base_url = f"http://127.0.0.1:{port}"
    errors: list[str] = []
    failed: list[str] = []
    http_errors: list[str] = []
    result: dict = {
        "candidateCommit": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip(),
        "homeTeam": HOME_TEAM,
        "awayTeam": AWAY_TEAM,
        "homePartner": "marin-dusk",
        "facingConvention": "Marin faces Kraken; Kraken faces Marin",
        "zooms": [100, 120],
        "frames": [],
    }
    try:
        wait_server(base_url + "/", server)
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(
                headless=True, executable_path="/usr/bin/chromium",
                args=["--no-sandbox", "--disable-dev-shm-usage"],
            )
            for facing in (1, -1):
                for zoom in (100, 120):
                    page = browser.new_page(viewport={"width": 1200, "height": 900}, device_scale_factor=1)
                    page.on("pageerror", lambda exc: errors.append("pageerror: " + str(exc)))
                    page.on("console", lambda msg: errors.append("console error: " + msg.text + " @ " + json.dumps(msg.location)) if msg.type == "error" else None)
                    page.on("requestfailed", lambda req: failed.append(req.url))
                    page.on("response", lambda response: http_errors.append(f"{response.status} {response.url}") if response.status >= 400 else None)
                    page.route("**/favicon.ico", lambda route: route.fulfill(status=204, body=""))
                    page.goto(base_url, wait_until="networkidle")
                    page.evaluate("window.requestAnimationFrame = () => 0")
                    page.select_option("#home-team", HOME_TEAM)
                    page.select_option("#away-team", AWAY_TEAM)
                    page.select_option("#home-lineup", "marin-dusk")
                    page.locator("#camera-zoom").evaluate(
                        "(el, value) => { el.value=String(value); el.dispatchEvent(new Event('input',{bubbles:true})); }",
                        zoom,
                    )
                    page.evaluate("""() => {
                      window.__productionImages=[];
                      const NativeImage=window.Image;
                      window.Image=function(...args){const image=new NativeImage(...args);window.__productionImages.push(image);return image;};
                      window.Image.prototype=NativeImage.prototype;
                      const canvas=document.querySelector('#game');
                      const original=CanvasRenderingContext2D.prototype.drawImage;
                      window.__renderedSpriteEvents=[];window.__expectedSprites={};
                      CanvasRenderingContext2D.prototype.drawImage=function(image,...args){
                        if(this.canvas===canvas&&args.length===8){
                          const matches=[];
                          for(const [id,expected] of Object.entries(window.__expectedSprites)){
                            const crop=[expected.sx,expected.sy,expected.sourceWidth,expected.sourceHeight];
                            if(image===expected.atlas&&crop.every((value,index)=>Math.abs(value-args[index])<1e-6))matches.push(id);
                          }
                          window.__renderedSpriteEvents.push({matches,sourceType:image.constructor?.name??'unknown',source:image.src||null,width:image.width||image.naturalWidth||0,height:image.height||image.naturalHeight||0,crop:args.slice(0,4)});
                        }
                        return original.call(this,image,...args);
                      };
                    }""")
                    page.evaluate("([home,away])=>window.jamverse.start(home,away,60,110)", [HOME_TEAM, AWAY_TEAM])
                    page.wait_for_function("window.jamverse && window.jamverse.state && window.__productionImages.length > 0")
                    page.evaluate("""async () => {
                      const [{animationAssetManifest},{supportingAnimationLibraries},{selectProductionSprite}]=await Promise.all([
                        import('/src/content/animation-assets.js'),
                        import('/src/content/supporting-animation-libraries.js'),
                        import('/src/render/animation-sprites.js')
                      ]);
                      window.__reviewModules={animationAssetManifest,supportingAnimationLibraries,selectProductionSprite};
                      const donor=supportingAnimationLibraries['marin-dusk'].donorId;
                      const sources=[
                        animationAssetManifest.characters[donor].directions.right.pass.src,
                        animationAssetManifest.characters[donor].directions.right.receive.src,
                        animationAssetManifest.characters.kraken.directions.right['idle-ball'].src,
                        animationAssetManifest.characters.kraken.directions.right.receive.src
                      ];
                      await Promise.all(sources.map(src=>new Promise((resolve,reject)=>{
                        const image=window.__productionImages.find(item=>item.src===new URL(src,location.href).href||item.src===src);
                        if(!image)return reject(new Error(`normal loader did not request ${src}`));
                        if(image.complete&&image.naturalWidth)return resolve();
                        image.addEventListener('load',resolve,{once:true});image.addEventListener('error',()=>reject(new Error(`asset failed: ${src}`)),{once:true});
                      })));
                    }""")
                    state = page.evaluate("""args => {
                      const s=window.jamverse.state;
                      const k=s.players.find(p=>p.id==='kraken'),m=s.players.find(p=>p.id==='marin-dusk');
                      if(!k||!m||k.team!==m.team)throw new Error('Kraken and Marin are not the active teammates');
                      for(const p of s.players){p.hasBall=false;p.vx=p.vy=p.vz=p.z=0;if(p!==k&&p!==m){p.x=p.team===k.team?35:175;p.y=8;p.stun=999;}}
                      k.x=100;k.y=75;k.facing=-args.facing;k.stun=0;
                      m.x=100-args.facing*20;m.y=75;m.facing=args.facing;m.stun=0;m.hasBall=true;
                      s.phase='playing';s.pause=false;s.possession=m.team;
                      Object.assign(s.ball,{mode:'carried',ownerId:m.id,targetId:null,aerialTargetId:null,lastTouch:m.id,attemptId:null,scored:false,x:m.x,y:m.y,z:1,vx:0,vy:0,vz:0});
                      return {quarterSeconds:s.quarterSeconds,players:s.players.map(p=>({id:p.id,team:p.team})),ballMode:s.ball.mode};
                    }""", {"facing": facing})
                    result.setdefault("setup", []).append({"facing": facing, "zoom": zoom, **state})
                    neutral = page.evaluate("window.jamverse.state.players.map(p=>({playerId:p.id}))")

                    def capture(label: str) -> dict:
                        frame_data = page.evaluate("""label => {
                          const s=window.jamverse.state,md=s.players.find(p=>p.id==='marin-dusk'),kd=s.players.find(p=>p.id==='kraken');
                          const {animationAssetManifest:manifest,supportingAnimationLibraries:libraries,selectProductionSprite:select}=window.__reviewModules;
                          const roster=window.jamverse.teams.flatMap(t=>t.roster),images=new Map();for(const image of window.__productionImages){images.set(image.src,image);for(const character of Object.values(manifest.characters))for(const direction of Object.values(character.directions??{}))for(const clip of Object.values(direction))if(clip?.src&&new URL(clip.src,location.href).href===image.src)images.set(clip.src,image);}
                          const choose=p=>{const athlete=roster.find(a=>a.id===p.id);return select({...p,captain:athlete.captain,palette:athlete.palette,height:athlete.height,rig:athlete.rig},{manifest,images,libraries});};
                          const m=choose(md),k=choose(kd);if(!m?.production||!k?.production)throw new Error('production selector returned fallback/missing sprite');
                          window.__expectedSprites={'marin-dusk':m,kraken:k};window.__renderedSpriteEvents=[];window.jamverse.tick(0);
                          const matches={};for(const id of ['marin-dusk','kraken'])matches[id]=window.__renderedSpriteEvents.some(event=>event.matches.includes(id));
                          return {label,zoom:document.querySelector('#camera-zoom').value,marin:{clip:md.animation.clip,tick:md.animation.tick,facing:md.facing,selector:{src:m.src,libraryId:m.libraryId,classification:m.classification,frame:m.frame,flip:m.flip,production:m.production}},kraken:{clip:kd.animation.clip,tick:kd.animation.tick,facing:kd.facing,selector:{src:k.src,libraryId:k.libraryId,classification:k.classification,frame:k.frame,flip:k.flip,production:k.production}},ball:{mode:s.ball.mode,ownerId:s.ball.ownerId,lastTouch:s.ball.lastTouch,x:s.ball.x,y:s.ball.y,z:s.ball.z},renderedSpriteMatches:matches,drawEvents:window.__renderedSpriteEvents.length,score:[...s.score],errors:[]};
                        }""", label)
                        if not all(frame_data["renderedSpriteMatches"].values()):
                            raise RuntimeError(f"normal renderer did not draw registered sprites: {frame_data}")
                        image_path = OUT / f"facing-{'right' if facing==1 else 'left'}-zoom-{zoom}-{label}.png"
                        page.locator("#game").screenshot(path=str(image_path))
                        frame_data["screenshot"] = image_path.name
                        return frame_data

                    frames = [capture("before-pass")]
                    page.evaluate("""frames => {const s=window.jamverse.state;s.pause=false;window.jamverse.tick(1,frames);}""", [
                        {"playerId": p["id"], **({"passPressed": True, "passVariant": "pass"} if p["id"] == "marin-dusk" else {})}
                        for p in state["players"]
                    ])
                    frames.append(capture("pass-start"))
                    for step in range(1, 21):
                        page.evaluate("""frames => {const s=window.jamverse.state;s.pause=false;window.jamverse.tick(1,frames);}""", neutral)
                        snapshot = capture(f"step-{step:02d}")
                        frames.append(snapshot)
                        if snapshot["ball"]["ownerId"] == "kraken":
                            for tail in range(1, 4):
                                page.evaluate("""frames => {const s=window.jamverse.state;s.pause=false;window.jamverse.tick(1,frames);}""", neutral)
                                frames.append(capture(f"hold-{tail}"))
                            break
                    else:
                        raise AssertionError("Kraken did not catch the pass within 20 simulation ticks")
                    if not any(frame["marin"]["clip"] == "pass" and frame["ball"]["mode"] == "pass" for frame in frames):
                        raise AssertionError("captured timeline omitted the pass release")
                    grabbed = next(frame for frame in frames if frame["ball"]["ownerId"] == "kraken")
                    if grabbed["kraken"]["tick"] != 4 or grabbed["kraken"]["clip"] != "receive":
                        raise AssertionError(f"unexpected catch anchor: {grabbed}")
                    result["frames"].extend({"facing": facing, "zoom": zoom, **frame} for frame in frames)
                    make_contact_sheet(
                        [OUT / frame["screenshot"] for frame in frames],
                        OUT / f"contact-right-{'right' if facing==1 else 'left'}-zoom-{zoom}.png",
                    )
                    page.close()
            browser.close()
        if errors or failed or http_errors:
            raise AssertionError(f"browser errors={errors}; failed requests={failed}; HTTP errors={http_errors}")
        result["browserErrors"] = errors
        result["failedRequests"] = failed
        result["httpErrors"] = http_errors
        result["status"] = "pass"
        (OUT / "capture-review.json").write_text(json.dumps(result, indent=2) + "\n")
    finally:
        server.terminate()
        try:
            server.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server.kill()
            server.wait(timeout=5)


if __name__ == "__main__":
    main()
