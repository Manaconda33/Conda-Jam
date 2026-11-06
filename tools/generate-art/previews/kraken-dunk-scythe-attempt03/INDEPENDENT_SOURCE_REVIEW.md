# Independent source and cleanup review — Kraken dunk-scythe attempt03

**Verdict: better action source than attempt02, but cleanup01 is not ready for candidate gameplay.** The raw is potentially salvageable by component-based repacking; current fixed-cell cleanup clips an arm and scales the player much smaller than the accepted Kraken atlas.

## Provenance

- Raw: `tools/generate-art/sources/kraken-dunk-scythe-attempt03-generated-raw.png`
- SHA-256 verified: `ae5aa2df5328ba94879048a260dfaf58d191e8917d99f6aa1bc72fff37cda06d` (matches `tools/generate-art/kraken-dunk-scythe-attempt03-provenance.json`).
- Prompt SHA-256 verified: `b4f7248cf26259fe2b05b118ef4a2908af8d1ff1626a3434fadbb6dd4abad18f`.

## Findings

- **Identity/anatomy:** Fifteen consistent Kraken figures: warm skin, pointed ears, short auburn hair, copper pendant, burgundy/copper kit, dark socks, burgundy shoes. No ball or prop. All 15 large alpha components are separate and the figures are generally anatomically complete in the raw.
- **Alpha:** Transparent corners/gutters; the brown backdrop visible in the raw viewer is hidden RGB with alpha 0. Raw edges are antialiased (alpha 0–254). Cleanup01 has binary alpha and no visible light/dark fringe.
- **Cell fit:** Fixed-cell cleanup does clip/crop poses. Raw pose index 6 (one-based frame 7) extends to x=628, 14 px beyond its nominal cell edge at x=614. Cleanup01's `sourceBounds` stop at the cell edge (`x=307` local), and the light/dark preview shows the extended balancing hand ending at the right cell edge. Pose index 8 begins at y=341 exactly at its row boundary, so it has no top gutter. A global component repack is safer than the current nominal-cell extraction.
- **Action:** This attempt improves the scythe sequence over attempt02. Indices 6–8 (one-based frames 7–9) read as initial upward arm sweep, higher behind-head hook, then a further overhead hook/apex. Index 9 bends into the forward/downward sweep; index 10 begins follow-through. The four requested beats are more differentiated than in attempt02, though neighboring overhead silhouettes still have modest arm-position changes at 80×96.
- **Style and scale:** Cleanup01 turns the raw's smooth, shaded illustration into hard-edged clusters with a shared limited palette, but the raw itself is painterly and the output retains mottled shading. Against accepted Kraken idle art, cleanup01 is too small: its frame silhouettes are roughly 53–68 px tall, compared with about 89–92 px for idle. Cleanup baseline is y=92 versus idle feet at y=94. The athlete would visibly shrink in the clip.

## Recommendation

Do not use cleanup01 for gameplay or registration. Attempt03 is the better pose source and does not yet require another generation: repack the 15 global components to retain the full balancing arm, fit closer to production Kraken scale/baseline, then review pixel style and sequence again. If the repacked 7–9 sweep still reads as repeated overhead poses, generate a targeted revision for those beats.
