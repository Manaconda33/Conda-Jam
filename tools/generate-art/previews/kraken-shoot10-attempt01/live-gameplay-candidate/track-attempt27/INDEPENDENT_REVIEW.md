# Kraken J.129 Shoot Attempt 27: Camera Focus Offset Trial

## Verdict: no viable camera-focus-only offset

This trial preserved attempt26's x=142/58, y=90 setup, shoot atlas, frame timing, `releaseVz:0.46`, court, and fixed hoop. A separate capture harness injected a direction-relative world-space offset into the stage camera focus target only; no runtime file, production renderer, manifest, hoop, or asset was changed. Each offset folder contains its own `report.json` and all 72 screenshots (both facings, 100%/120%, ten authored poses, flight captures, and score-complete view).

| Inward focus offset | Result |
| ---: | --- |
| 0 | Control reproduces attempt26: full 100% framing; 120% target rim clips at the horizontal edge. |
| +6 | Pulls the 120% rim inward, but the rim remains crowded against/under the top event banner in the left-facing view. Player and shot remain in frame. |
| +12 | Rim is farther inward and the ball remains visible, but the left-facing rim is still at the top HUD/banner boundary. This does not meet full-rim visibility. |
| +18 | Same vertical HUD/banner obstruction persists; the camera offset adds no useful vertical clearance. |
| +24 | Same obstruction. |
| +30 | Camera framing plateaus at approximately the +24 composition; the left-facing score-complete view also pushes Kraken partly off the right edge. Reject. |

The closest views to compare are `offset-+0.0/left-zoom120-tick23-frame09.png`, `offset-+12.0/left-zoom120-tick23-frame09.png`, and `offset-+30.0/left-zoom120-score-complete.png`; the matched 100% frames in each folder show that the normal zoom remains composed. The direction-relative shift does move the target hoop horizontally, but the remaining 120% defect is its vertical collision with the top UI/event banner. Increasing horizontal focus cannot lower that fixed UI overlap; large shifts eventually sacrifice player visibility. The 100% and 120% score-complete screenshots still show a made three in all runs: right-facing `[3,0]`, left-facing `[0,3]`. All runs have zero browser errors and zero failed requests.

No offset met the screen condition, so there is no candidate setting to carry forward and no Reed regression was warranted. Solving the remaining 120% view needs a zoom-aware vertical camera pan or viewport/UI-layout change, followed by the same four-case Kraken screen and a Reed registered-shot regression. Keep hoop geometry and attempt26's score setup fixed.
