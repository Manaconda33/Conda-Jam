# Krios J.128 `layup-reverse` attempt01 cleanup/layout review

**Disposition: clear the cleaned native-size candidate for separate athlete-specific ball-track trials only. Do not register as production art yet.** This is a visual/layout review, not approval of runtime integration.

Reviewed raw source and request, independent source review, cleanup script and counts, transparent 4×2 sheet, 128×96 atlas proof, runtime layout, and light/dark native and 4× previews.

## Art and cleanup

All eight poses remain recognizable as Krios: vivid red skin, large curled black horns, charcoal beard, dark Scoria Rams kit with red/gold trim, white socks and rugged boots. The anatomy is coherent and full body in every frame. The action order reads as gather, takeoff, partly back-facing rise, rising arm approach, bent-arm reverse-side peak, open-hand release, descent, and balanced landing. Frame4 retains the bent shooting arm at peak; frame5 has a visibly open, extended release hand. No basketball or ball-shaped object appears in the art.

The matte is removed cleanly in the transparent sheet and in both preview backgrounds. At enlarged review scale I see no material green spill, broken outlines, or source-pixel holes on the horns, face, fingers, socks, gold trim, or boots. The raw 1536×1024 RGB source remains preserved. The cleanup report records the source hash, thresholds, connected key pixels, island repairs/removals, and local edge cleanup. No redraw or interpolation between poses was used.

## Layout and scale

The raw sheet's original cell crossings have been resolved with per-pose bounds from the independent source review and one shared fit scale (`0.8913649025069638`). All eight cells meet the 32 px margin requirement; the tightest margins are exactly 32 px on frame4. No frame is clipped or overlaps a neighbor in the fitted 4×2 sheet.

The native proof uses a fixed 0.195 source-to-runtime scale, 128×96 cells, nearest-neighbor resampling, and shared y=94 baseline with 2 px bottom margin for each pose. Silhouette height varies with the pose itself, not a frame-specific scale adjustment. The 4× proof is crisp; cell order and separation remain readable.

## Remaining validation before production

The ball remains separate. Calibrate and inspect Krios's own track through tick11 and the single tick12 release in actual gameplay, both facings and 100%/120% zoom. Verify action timing, separate ball ownership/release, shot resolution, and no browser errors against the registered runtime before accepting the clip. The art candidate has not been registered.
