# Independent source and cleanup review — Kraken dunk-scythe attempt02

**Verdict for candidate gameplay: reject cleanup01 as currently packed.** The raw contains recoverable pose art, but the current 80×96 atlas has a visible cross-cell fragment and a clipped overhead arm. Do not use this derivative for gameplay captures or register it.

## Provenance

- Raw source: `tools/generate-art/sources/kraken-dunk-scythe-attempt02-generated-raw.png`
- SHA-256: `cf884557a0df46049b5625172bb216bb3a1152ec0fc804b752560ecc8b8d4a52` (matches `tools/generate-art/kraken-dunk-scythe-attempt02-provenance.json`). Prompt hash also matches provenance: `6a365fe056b042134f17ad3308ee590381236bfbaf11c3cc0aa20a65cc300185`.
- Cleanup01 atlas SHA-256: `81935683257bc104e4210668560708d3a5861f0c5a2ff154142660e6ddbf0df4`.

## Review findings

- **Identity/anatomy:** All 15 raw poses read as the same warm-skinned auburn-haired elf with pointed ears, copper pendant, burgundy/copper uniform, dark socks, and burgundy shoes. Bodies are generally complete; no ball or prop is visible. Identity matches Kraken's accepted idle sprite.
- **Raw alpha:** RGBA source has alpha 0 in sampled inter-cell gutters; the brown backdrop visible in the raw viewer is hidden RGB under transparent pixels. Edges are antialiased (alpha min 0/max 254), but no opaque backdrop contamination. Cleanup01 uses binary alpha, so its light/dark previews show no visible halo.
- **Cell integrity blocker:** Cleanup01 crops nominal 307×341 row-major cells, but a large pose component crosses those boundaries. Raw pose index 8 spans `(988,317)` to `(1240,611)`: it begins 24 px above its row's y=341 boundary and extends 11 px beyond its cell's x=1229 edge. Its upper fragment is incorrectly packed below pose index 3, visible in the cleanup01 light/dark proof; pose index 8 consequently loses that part of the arm/hand. This is not ordinary edge cleanup. The current sheet needs a component-based repack that assigns all 15 connected figures globally, rather than the current fixed-cell crops.
- **Sequence:** The approach/load/flight/follow-through/landing order is readable. Zero-based indices 6–8 (poses 7–9) advance from a bent rising arm, to a higher behind-head hook, to the apex hook; the beats are more differentiated than attempt01, though index 7 to 8 is still a modest silhouette change at 80×96. Index 9 begins the forward/downward sweep. No obvious missing limbs on the correctly isolated raw figures.
- **Style and scale:** Nearest-neighbor fitting and a limited shared palette make cleanup01 visibly pixelated, but the raw remains painterly and the reduced sprite retains mottled shading. It is a borderline match to Kraken's crisp accepted idle atlas. More concretely, cleanup01 figures occupy only about 49–69 px vertically in 96 px cells, versus 89–92 px for the accepted idle frames; cleanup01 baseline is y=92, while the idle feet reach y=94. A shared-scale repack should be brought closer to production scale/baseline without clipping the wide poses.

## Salvage recommendation

A new generation is **not required yet**: thresholded source analysis finds 15 large, separate figure components, so the raw poses can be recovered. Rebuild cleanup from those global components, preserve the complete pose-8 arm, remove its fragment from pose 3, and re-fit at Kraken's production scale/baseline. Re-review the resulting atlas before candidate gameplay. The current cleanup01 derivative fails that gate.

## Superseding cleanup02 component-repack review — 2026-10-29

The cleanup01 rejection above remains accurate for that fixed-cell derivative. I reviewed the newer `cleanup02-component-repack/` derivative, which extracts all 15 large 8-connected figures globally and restores the whole pose-8 arm.

**Updated verdict: pass for candidate gameplay trial only; not accepted for registration.** The visible cleanup01 fragment is gone, all 15 row-major poses are present and distinct, cell margins are safe, and the shared baseline is y=94, matching Kraken idle. Light/dark previews show binary alpha with no stray residue or visible fringe. Identity, full anatomy, ball-free hands, and burgundy/copper palette remain consistent with Kraken. The overhead sequence advances from an open rising arm (index 6), to a behind-head hook (index 7), to a further crown hook (index 8), followed by the downward sweep (index 9) and extended follow-through (index 10); the incremental change between indices 7 and 8 is modest but readable.

Against the accepted Kraken idle atlas, the repack is still smaller: occupied height ranges from 57 to 82 pixels in 96px cells, versus 89–92px for idle. Frame 14 is close to production size, while the low running/crouching poses are shorter by design. The palette-reduced nearest-neighbor image is visibly pixelated but remains more shaded/noisy than idle. Those are review cautions for gameplay interpretation; they do not prevent a candidate-only interaction trial. Any later acceptance should compare actual native captures and revisit scale/style consistency.

The raw source remains hash-verified at `cf884557a0df46049b5625172bb216bb3a1152ec0fc804b752560ecc8b8d4a52`; the cleanup02 atlas SHA-256 is `53cb1ac6a2b82027359b57131a032baf21d2e257b7f0c120765ba3c0782a99c0`. No production asset or manifest was changed.
