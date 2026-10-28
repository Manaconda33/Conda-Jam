# Krios `dunk-scythe` candidate ball-track review

**Review date:** 2026-10-28  **Verdict:** REJECT track attempt01; do not register.

## Candidate and capture method

- Separate candidate track is preserved in `candidate-track.json`; no runtime track, manifest, registry, or production documentation was changed.
- Live capture used the current Jam Stage and normal production renderer/simulation: queued Krios `dunk-scythe`, candidate atlas and track injected in-memory before game start, normal tick advancement to all 15 canonical sample ticks.
- Both facings and camera zoom 100%/120% were captured: 4 runs, 60 screenshots, zero uncaught browser errors. Atlas: `krios-dunk-scythe15-attempt01-runtime-candidate.png`, SHA-256 `87f16ec492c286c9ddcb61c09acc1f515d6acdfec92719fc1e144d097606f0ac.
- Complete machine-readable state and screenshot paths: `report.json`. Contact sheets: `overview-right-zoom100.jpg`, `overview-left-zoom100.jpg`, `overview-right-zoom120.jpg`, and `overview-left-zoom120.jpg`.

## Gate review

| Check | Verdict | Evidence |
|---|---|---|
| Contact/held frames | **REJECT** | Frames1, 4, and6–9 show the ball visibly separated from the corresponding hand/sweep; in left-facing capture frame7 the ball is far left while the extended arm reaches right. The in-memory track does not follow the source hand centers in screen space. |
| Diagonal release | **PASS mechanically; fail overall** | Tick21/frame10 changes ownership to unowned dunk mode, ball is rendered at rim area. The prior carried path does not visibly meet the releasing hand consistently. |
| Score | **PASS** | At tick23/frame11 the production simulation scores 2 points (right-facing [2,0], left-facing [0,2]); ball transitions to dead mode. |
| Landing/recovery | **PASS mechanically** | Athlete reaches frame14 at tick30 and returns to ground; ball remains dead/unowned. |
| Facing/mirror | **PASS selection; REJECT contact** | All 15 frames select the candidate atlas in both directions and `flip` is false right/true left. Ball track mirrors in world direction but does not remain attached to the mirrored hand. |
| HUD/native zoom | **PASS** | HUD and game bounds remain legible at 100% and 120%; no camera/capture clipping. |
| Browser/runtime capture | **PASS** | Four normal Jam Stage runs; no uncaught browser errors. |

## Findings and next calibration direction

The simulation accepts the action, release, score, and landing timing, but the proposed track derived directly from canonical hand points is not a visually acceptable contact track. The largest misses occur during the broad lateral sweep, and mirroring retains the selection but exposes the same contact offset on the other side. Reject this calibration rather than treating successful scoring as proof of ball alignment. Recalibrate against rendered screen-space hand centers on frames1–9, then recapture the same four-facing/zoom runs before any registration decision.

## Preservation

All source captures and candidate evidence are kept under `live-gameplay-candidate/track-attempt01/`. This is an exploratory rejected attempt; it does not modify or replace original source art and is not a production acceptance.
