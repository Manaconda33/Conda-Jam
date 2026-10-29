# Kraken `pickup` attempt05 — independent registered normal-loader review

**Decision: pass.** The capture uses the production manifest entry `./public/assets/animation/kraken-pickup-right.webp` and the registered Kraken track. Report flags `runtimeIntegration:true`, `candidateAtlasInjected:false`, and `candidateBallTrackInjected:false`. No preview atlas, manifest, selector, simulation, or track was injected. The page instrumentation only exposes the track object to the capture report.

The current Jam Stage matchup is Vesper Harbor Undertow vs Blackthorn Court Kings at courtY75. All 32 capture files and SHA-256 checks pass, with no uncaught browser errors. Frames selected at ticks0/2/4/6/7/8/10/11 are 0/1/1/2/3/4/4/4. Right-facing uses no flip and left-facing uses horizontal flip at both 100% and 120% zoom.

Production pickup progression reaches the tick7 grab event and transfers ownership to Kraken. The ball contacts the low reaching hand at tick7, lifts into the gathered hands/lower torso by tick8, and remains stable at ticks10/11 in both directions. No ball-placement, crop, mirror, fallback, score, or renderer defect is visible.

Historical invalid/rejected attempts remain preserved: attempt07 was an incorrect-vector normal-loader run with the old shin-placement track; attempt03 used the stale Scoria matchup; attempts04/05 are the shin and face/head ball-placement rejects. Attempt08 is the accepted normal-loader evidence.
