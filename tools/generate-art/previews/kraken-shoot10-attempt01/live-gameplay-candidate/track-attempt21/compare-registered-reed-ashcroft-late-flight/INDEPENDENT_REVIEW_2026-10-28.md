# Jam Stage shot-flight scale comparison: Reed Ashcroft

## Verdict

The renderer-only shot scale of `0.8` preserves simulation behavior, release timing and scoring for a second registered shooter, but it does not keep the ball visible at 120% zoom through the late flight. Do not treat this result as broad 120% visibility acceptance.

## Setup

- Athlete: Reed Ashcroft (`reed-ashcroft`), supporting player (`captain: false`), registered 29-clip library.
- Clip: production `shoot` atlas and registered athlete-specific ball track; no atlas, track, manifest, or simulation overrides.
- Renderer: current Jam Stage court, Chromium canvas at 100% and 120%, both facings.
- Action: real `window.jamverse.tick()` simulation with a normal shoot input; no ball coordinate writes after release. Camera is seeded by the harness to account for initializing the shooter directly at the shot-ready position, as in the Kraken capture harness.
- Renderer change under review: `stageBallFlightScale('shot', false) === 0.8`.

The reproducible harness is [capture-registered-reed-ashcroft.py](capture-registered-reed-ashcroft.py); per-run state and SHA-256 hashes are in [report.json](report.json). Captures at animation tick 13 (release) and 30, 60 and 70 simulation steps after release are retained in this folder.

## Results

All four runs (right/left × 100%/120%) released at tick 13, scored 3 points on the correct side, and reported zero uncaught browser errors or failed requests. The production physics and score are unchanged by the render scale. The registered Reed shot's state is mirrored correctly; at 70 simulation steps after release, the ball remains in flight near the hoop at world x 181.9 (right) / 18.1 (left), z 19.59.

At 100%, the orange ball is visibly near the rim in both facings. At 120%, the ball is absent from the late-flight screenshot while its shadow remains on court; the fixed top HUD overlaps the ball/hoop region in that tighter view. The same loss occurs on both sides. The screenshots at 120% and `report.json` establish that simulation still advances and scores normally, while the rendered visibility is insufficient for cross-player acceptance.

This is a limitation observed with scale `0.8`; the comparison does not prove it was introduced by the change. The previous `1.62` shot scale would project the ball higher, so it is not evidence that restoring the old scale resolves the crop.

## Captures

- [Right, 120%, release tick 13](right-zoom120-tick13-shoot-ball-shot.png)
- [Right, 120%, 70 steps after release](right-zoom120-tick83-idle-ball-shot.png)
- [Left, 120%, release tick 13](left-zoom120-tick13-shoot-ball-shot.png)
- [Left, 120%, 70 steps after release](left-zoom120-tick83-idle-ball-shot.png)
- [Right, 100%, 70 steps after release](right-zoom100-tick83-idle-ball-shot.png)
- [Left, 100%, 70 steps after release](left-zoom100-tick83-idle-ball-shot.png)
