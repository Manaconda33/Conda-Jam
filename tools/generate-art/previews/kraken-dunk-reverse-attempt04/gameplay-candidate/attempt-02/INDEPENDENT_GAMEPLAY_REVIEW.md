# Independent gameplay review — Kraken dunk-reverse attempt04, track attempt02

**Verdict: reject this track candidate for production-loader review.** Action timing, frame selection, and scoring pass, but the ball separates visibly from Kraken’s hands during the reverse-dunk carry at frames 8–9. Keep this attempt as calibration evidence and retune the Kraken-specific track before another review.

## Provenance and run integrity

- Cleanup atlas SHA-256: `1b3b57281f839449c256308014cf26f8bf87e1c2b5a365fdbe743babb2ecea42`, matching the report.
- Capture report SHA-256: `ac654aec01878ee138ab3b25c39943967aebc1993c8e9c163a8d7c3d2aa68f68`.
- Capture script SHA-256: `10a6c1a13f28610379e70931197098aa2007e1631d46e3b0332739321377fd20`.
- `report.json` records 60 captures, `runtimeIntegration:false`, `candidateAtlasInjected:true`, `candidateBallTrackInjected:true`, and no uncaught browser errors. This proves a candidate-only run; it does not prove production-loader integration.
- The report selects frames 0–14 in order for both facings and both zoom levels. Right uses the atlas directly; left mirrors it. All frames retain Kraken’s production identity/palette.

## Gameplay checks

- Both-facing timing passes: frame10/tick21 enters `mode:dunk` and clears ball ownership; frame11/tick23 records a two-point Kraken score; frame14/tick30 shows the upright recovery pose with the ball dead/unowned.
- **Contact fails at frame8/tick17 and frame9/tick19.** I inspected both 120% facing captures. At frame8, the ball overlaps the upper torso/shoulder area rather than meeting a clearly visible hand. At frame9, the ball hangs below and away from the lowered hand by a plainly visible gap. Mirroring reproduces the same separation. The sampled forward/height values for those frames are `(-1.5, 1.3)` and `(1.5, -0.9)`; the negative height at frame9 pulls the ball down without closing the hand gap.
- At frame10/tick21, the ball is at the rim and the dunk release is visually plausible. This correct rim contact does not make the preceding detached carry acceptable.
- The 120% court captures keep Kraken, hoop, and ball in view without HUD obstruction. The same clip/frame/mirror selectors and score state appear at 100%. Marin is not part of this dunk-only action.

Retain the source and captures. Retune frames8–9 for direct hand contact in both facings, then rerun both zooms and have the new attempt independently reviewed before trying the production loader.
