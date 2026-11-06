# Independent normal-loader review — Krios J.128 `dunk-scythe`, track attempt09

**Verdict: PASS for the reviewed attempt09 runtime captures.**

## Evidence reviewed

Reviewed the four 15-frame capture runs in this folder: right/left facings at 100%/120% zoom (60 captures total). The report confirms normal-loader runtime integration, no candidate atlas or track injection, track attempt09, and registered atlas `public/assets/animation/krios-dunk-scythe-right.png` (SHA-256 `87f16ec492c286c9ddcb61c09acc1f515d6acdfec92719fc1e144d097606f0ac`). Selected cells and left-facing mirror flags are consistent. The current Jam Stage at courtY90 is recorded, with no browser or console errors.

## Findings

- **Corrected lateral sweep:** At frame06/tick12 the ball now meets the raised hand in all four facing/zoom runs; the detached below-hand gap from attempt08 is resolved. Frames07–09 continue a readable lateral sweep with the ball staying at or immediately beside the active hand as Krios crosses toward the rim.
- **HUD/framing:** The high ball in frames06–07 comes close to the top UI at 120% but remains fully visible in both facings. Athlete, hoop, court, and HUD remain framed; no clipping or spill is apparent.
- **Release/contact:** At frame10/tick21 the ownerless ball is visible at the rim with the reaching hand/arm; the contact reads clearly in both directions. At tick23/frame11 the ball is gone as the follow-through proceeds.
- **Ownership and score:** Krios carries through tick19; the ball becomes ownerless in `dunk` mode at tick21 and transitions to `dead` at tick23. The expected two points and `Krios scores 2!` event appear for the correct team in both facings.
- **Landing and rendering:** Tick30/frame14 shows controlled landing/recovery. All requested frames select the registered atlas. No fallback sprite, missing image, browser error, or console error is reported.

## Recommendation

Track attempt09 and the registered `dunk-scythe` atlas pass this independent normal-loader review. The frame06 hand contact is restored; keep the close but clear 120% HUD margin in mind for later presentation changes.
