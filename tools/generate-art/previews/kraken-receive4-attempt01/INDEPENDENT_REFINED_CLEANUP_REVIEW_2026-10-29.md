# Kraken `receive` attempt01 — refined cleanup review (2026-10-29)

**Decision: pass for Kraken-specific ball-track trials only. Not accepted for production packing or registration.**

The review covers the updated 160×192 atlas (`kraken-receive4-attempt01-runtime-candidate.png`), all four normalized poses, its light/dark previews, cleanup report/layout, raw source, and the registered Kraken idle/pass references. Current atlas SHA-256: see `layout.json`, which records the exact atlas hash.

All four 80×96 cells contain distinct frames: open-hand anticipation, extended reach, sternum catch, and lower cradle. Kraken's medium brown/copper skin, auburn tied-back hair, pointed ear, copper amulet, burgundy/gold uniform, wrist details, and shoes stay consistent with her registered identity. Anatomy is complete; fingers remain within the cells and open hands are readable. The nearest-neighbor cleanup reads as pixel clusters at runtime scale and is visually coherent with the captain's existing artwork, with slightly less fine shading.

The refined layout has baseline y94, minimum side margins of 5px, 24px top margin and 2px bottom margin. Light/dark previews show no apparent broad red haze or matte halo after the 1.25-source-pixel fringe treatment; alpha remains 0–255 and no ball is baked into the art. Original RGB values are retained; cleanup gates alpha and resizes with nearest-neighbor.

Still required before production acceptance: calibrate Kraken's separate receive track, exercise actual incoming-pass/catch gameplay through the current Jam Stage normal loader in both facings and 100%/120% zoom, and inspect the 2px bottom margin in runtime captures. The earlier `INDEPENDENT_CLEANUP_REVIEW_2026-10-28.md` describes the superseded layout and remains for history; this note reviews the refined output.
