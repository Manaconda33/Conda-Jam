# Independent normal-loader review — Kraken dunk-reverse attempt04

**Verdict: pass.** The registered atlas and athlete-specific ball track render correctly through the real Jam Stage loader.

## Integration and provenance

- `report.json` records 60 captures, four combinations (right/left × 100/120), `runtimeIntegration: true`, `candidateAtlasInjected: false`, `candidateBallTrackInjected: false`, and no uncaught browser errors.
- Loader source is `public/assets/animation/kraken-dunk-reverse-right.webp`; report SHA-256 `4451fbaaa89288f50d36f46196799a6ba72c0cb23a2cde67bc45ec2cf84c2520` matches both the file and checked-in manifest entry for Kraken/dunk-reverse.
- The runtime track is the registered Kraken vector in `src/core/animation.js`: height `[1,.9,1.2,1.6,1.55,1.65,1.6,1.75,-1.4,-.1,2.1,1.2,1,.8,.7]`, forward `[5,4,3,1,-1,-2,-3,-4,3.5,1.5,12,10,8,6,4]`. The report's recorded vector matches it.

## Visual and state review

- Each sampled pose 0–14 is selected in order across all runs. Right-facing captures show `flip:false`; left-facing captures show `flip:true`. The Kraken sprite remains fully visible and recognizable in the current court framing at both zooms.
- Frames8–9 (ticks17/19) are intentionally inverted poses. In both facings the ball is below the inverted body, against the reaching hand; at 100% and 120% it reads as contact rather than a ball floating near the crown. The same position is retained while the turn resolves.
- Tick21/frame10 shows the reverse release at the rim, with the ball in the hoop area and the athlete's arm extended through the finish. The ball becomes unowned/dead after release; tick23/frame11 records the expected 2-point score, and frames12–14 show the descent/recovery with no athlete-owned ball.
- Score is 2–0 for the attacking side in both facings and zooms. The HUD and rim remain visible; no browser errors were reported.

## Recommendation

Accept this run as normal-loader integration evidence for the registered Kraken dunk-reverse atlas and track. The report and screenshots agree on frame selection, mirror handling, inverted hand contact, release timing and scoring.
