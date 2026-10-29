# Kraken J.129 Shoot Attempt 28: Candidate Vertical Scene Pan

## Verdict: +24 virtual pixels is a viable 120% framing lead

This was an in-memory capture-only test. Attempt26's shoot track (`releaseVz:0.46`), candidate atlas, setup (x=142/58, y=90), simulation, fixed hoop, and production renderer stayed unchanged. The separate harness rewrote the current `main.js` response to wrap `drawArena()`, `drawCourt()`, hoop/player/ball drawing in a nested canvas save, apply `ctx.translate(0, panY)`, then restore before `drawHUD()`. Thus the court scene moved down while the HUD stayed fixed. Harness: `tools/capture-kraken-shoot-vertical-pan-trial.py`.

| Scene pan | Result at 120% | Result at 100% control |
| ---: | --- | --- |
| +16 px | Rim is substantially clearer, but the left-facing target rim still touches/overlaps the 3-point event banner. | Full play remains in view. |
| +24 px | Full rim is visible below the HUD/banner at both facings. Sampled ball flight stays below the HUD; player is fully in-frame through tick 23 and score-complete. | With this exploratory uniform pan, the player remains in frame and both shots score; the grounded shadow approaches the lower edge. Prefer applying the pan only at 120%. |
| +32 px | Hoop clears, but the player/shoes are clipped at the bottom during action or score-complete captures. Reject. | Player/shoes also clip at the bottom. Reject. |

The most useful visual evidence is in `down-pan-+24/left-zoom120-tick23-frame09.png`, `down-pan-+24/right-zoom120-tick23-frame09.png`, and each `*-zoom120-score-complete.png`. The +24 action frames show the target rim fully in-frame and the ball visibly below the HUD. Both players remain fully inside the viewport after scoring. By comparison, +32 evidence shows bottom-edge player clipping, while +16 left-facing evidence still has the hoop too close to the event banner.

All pan settings have 72 unique capture paths, all ten authored shoot frame starts in all four facing/zoom combinations, a sampled maximum ball height of about z=7.05, correct three-point results in every run (`[3,0]` right-facing and `[0,3]` left-facing), no browser errors, and no failed requests. The `down-pan-+24-zoom-aware/` folder repeats the +24 result while applying zero pan at 100% and +24 only at 120%; this preserves the existing 100% composition and is the preferred implementation lead.

This is capture-harness evidence only, not acceptance of a production renderer change. If the lead is implemented, keep the pan zoom-aware and verify it in the normal Jam Stage/game path, then regression-check Reed's registered shot and other fixed-HUD/viewport cases. Do not move the hoop or alter attempt26's shot/score setup.
