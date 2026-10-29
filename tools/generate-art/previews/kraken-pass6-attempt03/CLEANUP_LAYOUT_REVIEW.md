# Kraken pass attempt03 — cleanup/layout trial review

**Status:** Extraction and 96×96 layout are viable as a visual trial. Keep this candidate unregistered and provisional. The six figures can be separated without overlap; the native-size and target-size previews show the intended action and recognizable Kraken appearance. There are small alpha flecks around some edges on the light 4× preview, and downsampling loses shading detail compared with the registered idle atlas. Do not treat this trial as final/runtime acceptance.

## Provenance and outputs

- Prompt: `tools/generate-art/kraken-pass6-attempt03-imagegen-prompt.txt`
- Raw source: `tools/generate-art/sources/kraken-pass6-attempt03-generated-raw.png`
- Generation ID: `exec-6af62d0f-5c3d-4f21-a213-93f524e77291`
- Raw SHA-256: `44c042bf175ca1337c24c3f06fc569eefab0d971c3207b9ce4f1222fa32a2075` (matches the trial report)
- 96×96 row-major trial atlas: `review-trial-96/pass6-attempt03-trial-96x96.png`
- Builder and measurements: `review-trial-96/build-review-trial.py`, `review-trial-96/review-trial-report.json`

All outputs live in this attempt03 preview folder. The source, prompt and any separately accepted attempt02 assets were left untouched. No ball track or runtime registration was changed.

## Extraction and layout

The builder segments the six large alpha-connected silhouettes and orders them by visual row and x position, not by assumed equal-width columns. No major silhouette masks overlap. Each figure was extracted with all source RGBA values retained inside the silhouette and within a 3-source-pixel neighborhood. 191 nearby detached nonzero-alpha pixels were retained with their original RGB and alpha. More distant detached alpha (3,823 pixels across 1,274 small components) was omitted from the derived trial as background speckle; the untouched raw preserves it. No silhouette pixels were redrawn, color-adjusted or removed.

One shared scale (0.152964, nearest-neighbor sampling) maps all six onto 96×96 cells, with feet at y=90. Figure heights are 79–82px; left/right margins are 8px minimum and bottom margin is 6px. Actual extracted source bounds, hashes, and per-frame margins are in the JSON report. The former lower-row equal-column assumption would have misordered/cut the extended poses; the resulting atlas is correctly ordered setup, windup, loaded step, release, follow-through, recovery.

## Visual inspection

Reviewed `native-extracted-figures.png`, 96px light and dark previews, 4× nearest-neighbor light and dark previews, and side-by-side actual-size comparisons with `public/assets/animation/kraken-idle-right.webp`.

- **Sequence:** Setup, windup and loaded step stay gathered at the chest; frame 3 remains loaded. Frame 4 is the only release. Frame 5 softens the extended reach and frame 6 lowers the hands. All hands remain empty; no ball is baked into the art.
- **Identity and anatomy:** All poses retain the pointed ear, auburn hair, copper amulet, burgundy/copper kit, wristbands and shoes. Full heads, hands and shoes fit the cells. Stance and body remain coherent at native size; the wide follow-through silhouettes have clear per-cell gutters.
- **Light/dark transparency:** No opaque background or large halo appears. A few isolated pale/gray edge flecks remain noticeable on the light 4× preview near some hair/outline pixels. They are much less apparent at actual size and on dark, but should be checked against any desired cleanup threshold before acceptance. The raw's many distant alpha components are documented and preserved in the source rather than silently discarded.
- **Style and scale:** At actual size, character height is close to Kraken idle. The pass figures are broader and the high-resolution source shading becomes chunky under nearest-neighbor reduction; compared side-by-side with idle, this is recognizable as Kraken but not a perfect pixel-cluster/style match. Nearest sampling keeps source color/alpha samples and avoids a blur filter; 4× views expose some small irregular clusters. A smoother filter would alter more source pixels and might soften the intended pixel-art edge, so this trial does not silently switch filters.

## Acceptance boundary

This is a cleanup/layout review, not runtime/gameplay validation. It establishes six distinct cells, correct row order, common baseline and legible candidate output at the requested size. It does not establish release ticks, ball-track placement, gameplay transitions, mirroring, or absence of all target-scale edge defects. Keep the separately calibrated athlete-specific ball track; no ball is included here. The remaining light-preview flecks and style difference should stay visible in the acceptance record if this candidate advances.
