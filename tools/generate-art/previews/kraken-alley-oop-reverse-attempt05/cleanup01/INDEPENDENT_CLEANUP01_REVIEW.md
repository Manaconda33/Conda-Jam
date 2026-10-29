# Independent cleanup01 review — Kraken alley-oop reverse, attempt 05

**Verdict: cleanup01 is structurally clean and the reverse-dunk keyframe remains readable after horizontal mirroring, with one source-boundary caveat.** The low hand stays behind the torso and below the crown in the mirrored view. The atlas preserves 15 distinct full-body poses, binary alpha, shared palette, and aligned baselines. The visible sprites are smaller than Kraken idle, and two raw cells touched their source edges before cleanup.

## Provenance and inspected assets

- The cleanup report’s source hash `081e75e24918c758344d68f07580bb7df384627ec921057beec1cd00c93e6bf7` matches the attempt05 raw source.
- Inspected the cleanup atlas, light preview, dark preview, layout report, cleanup script, and `public/assets/animation/kraken-idle-right.webp` for scale comparison.
- Atlas: 400×288 RGBA, with 80×96 cells. Light/dark previews preserve visibility against contrasting backgrounds.

## Findings

- **Poses and anatomy:** The layout report records 15 poses and 15 unique normalized frame hashes; visual inspection confirms distinct silhouettes. Head, torso, arms/hands, legs, and shoes remain visible. Kraken’s hair, ears, copper amulet, burgundy/copper uniform, dark socks, and shoes stay recognizable. No obvious detached fragment or cleanup loss.
- **Pose 12/mirroring:** The low hand remains visible at hip level behind the lower torso, with the opposite arm raised for balance. I checked a horizontally mirrored diagnostic: the low-hand-behind-back cue survives and swaps screen side as expected. The cleanup script itself does not mirror the atlas. In the supplied orientation this reads as a reverse-dunk finish; a mirrored gameplay orientation preserves the action while reversing its screen-side assignment.
- **Source-edge caveat:** The raw source bounds touch the left side of source cell 8 and the top of source cell 9 at the cleanup threshold. The cleaned poses appear complete with no visibly chopped limb, but cleanup cannot restore any pixels that may already have been cut at those raw cell boundaries.
- **Margins and baseline:** All cleanup alpha bounds are inside their 80×96 cells. Reported horizontal margins range from 14 to 49 px, top margins from 14 to 41 px, and bottom margins are 4 px. Every visible pose aligns to baselineY=92 (baselineDelta=0). No cleaned silhouette crosses a cell edge.
- **Scale vs idle:** Cleanup visible heights range from 43 to 67 px, with a median around 52 px. The existing idle sprites are about 61–64 px tall in 80×64 cells. The cleaned animation is therefore about 16% shorter at the median, though the largest poses are close to idle height.
- **Alpha, palette, and edges:** The atlas uses binary alpha (0/255), transparent gutters, nearest-neighbor scaling, and one shared 16-color visible palette. Light/dark previews show crisp outlines without obvious matte fringe, glow, checker artifacts, or background contamination.

Review covers the listed attempt05 cleanup assets only. Nothing was registered or changed in production.
