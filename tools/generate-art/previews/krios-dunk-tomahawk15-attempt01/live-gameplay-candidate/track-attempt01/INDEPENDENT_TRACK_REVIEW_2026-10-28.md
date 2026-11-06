# Independent candidate track review — Krios `dunk-tomahawk` attempt 01

**Verdict: REJECT track attempt01; retain atlas for further track calibration.**

Reviewed all 60 candidate captures from the current Jam Stage: 15 sampled action frames/ticks, right and left facing, 100% and 120% zoom. The capture report confirms candidate-only atlas/track injection, correct selected frame in both directions, horizontal flip for left-facing, and zero uncaught browser errors.

## Findings

- At frame05/tick10, the carried ball is near Krios's bent arm/hand as the tomahawk gather begins in both directions. At frame07/tick14, it remains close to the raised hand and clears the HUD at both zooms/facings.
- At frame09/tick19, the ball is visibly separated below and behind the raised finishing hand in both directions. In the right-facing 120% capture the ball is around Krios's shoulder/side while the hand is overhead; the mirrored left-facing capture shows the same gap. The carry therefore breaks before the release anchor. This is the blocking defect.
- HUD margins are clear in the sampled arc; no ball/HUD clipping was seen.
- At frame10/tick21, the separate ball reaches the rim during the downward tomahawk contact. Ownership remains Krios through tick19, the ball becomes ownerless in dunk mode at tick21, and the expected two-point score is recorded at tick23 in the correct team slot for each facing. The authored sequence continues through landing at tick30 with the ball dead/unowned.
- No sprite fallback, direction-selection error, or browser error was found. The current Jam Stage court and rim stay framed.

## Calibration guidance

Preserve attempt01 and its rejected review. Raise the frame09/tick19 carried-ball height and move its forward offset toward the raised hand, then inspect the transition from frames08–10 in both directions. Recheck HUD clearance at 120%; keep the release/contact and score anchors intact. Do not register until a corrected track passes normal-loader review.
