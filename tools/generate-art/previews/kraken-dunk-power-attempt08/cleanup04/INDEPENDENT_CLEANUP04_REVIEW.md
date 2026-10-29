# Kraken dunk-power attempt08 cleanup04 — independent review

**Verdict: pass for candidate gameplay review only; do not register yet.** The 16-color pass improves the 80×96 sprite read substantially. Baseline, alpha, cell margins and anatomy look sound. A normal-loader visual review is the next meaningful quality check.

- **Alpha/fragments:** binary alpha with transparent background; all 15 cells have exactly one connected component. The stray fragments reported in cleanup02 are gone. Light/dark previews show no visible residue.
- **Fit/baseline:** 15 unique row-major frames in 80×96 cells, baselineY92 and 4 px bottom margin in every frame. Left/right margins are 10–39 px and top margins 8–20 px. Main silhouettes are complete; heads, hands, legs and shoes remain visible. No ball is baked in.
- **Pose sequence:** approach/gather/load, takeoff/ascent, peak, downward slam, follow-through/descent, landing and recovery remain distinct. Some approach beats are close, but their arm/leg positions change enough to preserve motion. No frame appears to have lost connected anatomy in the new cleanup.
- **Style:** the 16-color palette and nearest-neighbor fit now read as pixel sprites at target size and are closer to Kraken's production palette/outline language than cleanup03. Skin and uniform still have coarse, irregular color clusters from the illustrated source, so the art is less deliberate than the production idle; gameplay-size review is needed before registration.
- **Report detail:** `cleanup-layout-report.json` records nearest-neighbor, 16 colors, binary alpha and baseline alignment, but does not mention the `<64 px` detached-component removal step described for cleanup04. Update that cleanup provenance before the report is treated as complete.

Candidate-only review; no production files changed.
