# Independent review: Kraken J.07 `shoot` track attempt04

**Date:** 2026-10-28  
**Verdict:** **REJECT for production review.** The hand-contact sequence and capture integrity pass, but the later shot flight leaves the visible play area before scoring; the player marker also overlaps the ball in some left-facing post-release captures.

## Scope and evidence checks

Reviewed the attempt04 report, candidate vector, action frames, early `shoot` flight samples, later `idle` flight samples, and score-complete captures for both facings at 100% and 120% zoom. The atlas/vector remain candidate-only. No runtime assets or production docs were changed.

The corrected capture package passes its integrity check: report lists 76 unique paths including score-complete captures, all exist and match their recorded SHA-256 values. I independently confirmed 72 per-run capture entries are unique across four runs (18 each), and all four runs record the three-point score for `shot-1`.

## Checks that pass

- **Contact and release:** frames2/tick6, 3/tick8, and 4/tick10 show the ball carried at Kraken's hands through the gather and lift. Frame5/tick13 releases from the raised hand; state switches from carried/owned to `mode=shot`, `ownerId=null`, retaining `lastTouch=kraken` and `attemptId=shot-1`.
- **Early flight:** shoot frames6–9 show a separate, visible rising ball. The atlas selector uses the expected frame order and right/left mirror settings. The trajectory and contact look consistent at both tested zooms.
- **Score:** all four run states record score `[3,0]` and `scoredAttempts: ["shot-1"]`; score-complete captures show 3–0.
- **Capture integrity:** no duplicate or missing screenshot paths remain; recorded hashes match.

## Blocking visual defect

Later `idle` captures show Kraken back in a grounded idle pose while the still-active shot is outside the visible canvas. For example, `right-zoom120-flight-sample028-tick14-idle-frame01.png` and `left-zoom120-flight-sample028-tick14-idle-frame01.png` show only the ball's court shadow; the orange ball is absent from the play area. The same issue persists in the later idle samples at ticks16,19,23, at both zooms and facings. By comparison, `*-flight-sample010-tick23-shoot-frame09.png` still shows the ball near the top edge, indicating the later samples progress beyond the visible upper boundary during the ongoing shot. A made score does not compensate for an extended, unrendered portion of the flight.

In the left-facing post-release frame the cyan P1 marker also overlaps the ball's upper area (notably `left-zoom120-flight-sample001-tick14-shoot-frame06.png`), reducing separation during the early flight. This is smaller than the off-screen arc but should be corrected or accounted for in the review capture.

## Follow-up

Recalibrate the shot trajectory/release state so the ball stays within the visible court view through flight and score, or demonstrate a camera framing change that keeps the ball visible without HUD occlusion. Re-capture both facings and zooms, including early release and later idle flight, then review the corrected images. Attempt04 is not accepted by this independent review.
