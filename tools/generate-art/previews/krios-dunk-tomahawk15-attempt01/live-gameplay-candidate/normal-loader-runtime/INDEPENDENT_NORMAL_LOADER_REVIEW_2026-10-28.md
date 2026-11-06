# Independent normal-loader review — Krios J.128 `dunk-tomahawk`

**Verdict: PASS for the reviewed normal-loader capture set.**

## Evidence reviewed

Reviewed all 60 current Jam Stage captures: 15 sampled frames/ticks × both facings × 100% and 120% zoom. The report confirms normal-loader runtime integration, no candidate asset/track injection, track attempt04, and registered atlas `public/assets/animation/krios-dunk-tomahawk-right.png` (SHA-256 `0cea7aaccf5def1b1a6ae15de241222182feae8366a8aebf1b5e5c03c3d26774`). Each capture selects the expected registered source; right-facing is unflipped and left-facing is mirrored. No browser or console errors are recorded.

## Findings

- **Airborne pose separation:** Frames3–7 read as a progression from tucked takeoff through a compact tomahawk gather, changing leg tuck and arm positions, then a high one-hand hold and drive. The silhouettes are closely grouped but remain distinguishable at native 100% and 120%; they do not look like one repeated airborne pose. Krios's identity and anatomy remain intact.
- **Frame9 hand and HUD margin:** At frame09/tick19 the ball is visibly near the raised hand, below the HUD, with clear separation from the top UI. Both facings retain full ball visibility at both zooms.
- **Gather and peak:** The separate ball stays with the raised hand through the gathered arc and peak. No clipping against the HUD or stage boundary is apparent.
- **Release/contact:** At frame10/tick21 the ball is visible at the rim in both facings, with Krios's extended arm reaching the basket. Contact reads clearly without the ball covering the torso. The scoring follow-through begins at tick23/frame11 with the ball gone.
- **Ownership and score:** State data shows Krios carrying through tick19, transitioning to ownerless `dunk` at tick21, then `dead` at tick23 with the correct two points and `Krios scores 2!` event. Scoreboard and event agree in both directions.
- **Landing and framing:** Tick30/frame14 shows a stable landing/recovery. Player, hoop, court markings, and HUD remain within view; no fallback sprite, spill, or browser artifact is apparent. A small `P1` gameplay prompt appears in some captures but does not obscure the action.

## Recommendation

The registered `dunk-tomahawk` atlas and attempt04 ball track pass this independent 60-capture runtime review for pose separation, framing, release contact, scoring, and landing.
