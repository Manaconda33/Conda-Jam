# Independent source review — Kraken dunk-360 attempt04

**Decision: reject as a cleanup/gameplay candidate.** The raw image is transparent and contains 15 separated figures, but the required strike is late, the rotation beats repeat, and the attached red fringe/soft illustrative style is not repairable by a simple cleanup.

## Provenance and raw checks

- Raw: `tools/generate-art/sources/kraken-dunk-360-attempt04-generated-raw.png`
- SHA-256: `09815b44112cee5750f1f0be60d40e018b335f706fdfd8d8a049230ae70fda86`, matching provenance.
- Generation ID: `exec-be7509cc-95d4-4723-bda1-108ef5061c47`.
- Dimensions: 1619×971 RGBA. Prompt is `tools/generate-art/kraken-dunk-360-attempt04-imagegen-prompt.txt`.
- Background gutters are transparent (sampled alpha 0). There are 15 separated visible components and no ball, hoop or prop. Alpha spans 0–255, with 551,207 partially transparent pixels; the figures have visible antialiased edges and a bright red/orange halo.

## Findings

- Identity and anatomy are broadly consistent across the sheet: warm skin, pointed ears, auburn hair, copper pendant, burgundy/copper uniform, dark socks and burgundy shoes. The poses are generally full-body and distinct outside the repeated rotation frames.
- The canvas does not divide into equal 5×3 cells. At a nominal 1619×971 5×3 split, the top of two bottom-row figures begins around y=628–629, above the nominal row boundary y≈647. A fixed-cell crop would remove those top pixels. The source is component-separable, but needs repacking to prevent crop loss.
- Rotation progresses through side and rear views and returns toward the front, but the turn is not well resolved: the back-facing frames 8–9 are nearly the same body/arm silhouette. Frames 10–11 return toward front while the right arm stays raised; frame11 does not show the required forceful downward strike. The first clear lower-arm/downward pose appears at frame12, with the follow-through displaced again to frame13.
- The source is smooth shaded illustration with antialiasing rather than hard-edged 16-color pixel art. Red/orange fringe is attached around most silhouettes, not isolated specks. Component extraction and nearest-neighbor fitting alone cannot remove it without changing the figure edges; preserving it would carry the visible defect into gameplay.

## Recommendation

Preserve as rejected. Do not use this as a cleanup source for gameplay. A retry should keep the recognizable Kraken identity but use five distinct orientations through frames7–11, put the arm strike at frame11 and a separate lower follow-through at frame12, and produce crisp red-free pixel silhouettes on a canvas divisible into equal 5×3 cells.
