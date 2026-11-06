# Independent cleanup01 review — Kraken alley-oop reverse, attempt 03

**Verdict: cleanup quality is a strong improvement and the atlas is acceptable in transparency, framing, and pose completeness, but hold from gameplay-candidate approval until pose 12 is corrected or explicitly accepted.** The catch/control poses read distinctly. The main remaining concern is that pose 12 does not unmistakably read as a reverse dunk.

## Inspected files and integrity

Visually inspected the cleanup atlas, light preview, and dark preview alongside `cleanup-layout-report.json`.

- Cleanup atlas: `kraken-alley-oop-reverse-attempt03-cleanup01-atlas.png`, 400×288 RGBA; alpha is binary (0 or 255), with transparent gaps.
- Light and dark previews: both 1200×864; silhouettes remain clear against both backgrounds.
- Layout report identifies the raw source SHA-256 as `3792c883603269d3fd5f4a79fb6dc13c930262aa1e8473b0b6964e26ce8dc769`, matching the preserved attempt03 raw source. Its provenance file also remains unchanged at SHA-256 `9f9f3dde8e0828da4f0d0656b3c770e14fe4c717a26023cf1bbd0f00b7da4b76`.
- Cleanup method uses nearest-neighbor scaling, a shared 16-color palette, binary alpha, and no repaint/pose creation. This resolves the source's soft-alpha edges without introducing visible background matte, glow, or checker artifacts.

## Visual findings

- **Transparency and pixel style:** Cleanup is effective. Atlas empty cells are transparent; the light/dark previews show no obvious fringe against contrasting backgrounds. Nearest-neighbor pixels and the limited palette look substantially crisper and more game-ready than the raw source.
- **Count, anatomy, identity:** Exactly 15 full-body poses appear in row-major order. Limbs and shoes remain readable at the 80×96 cell size. Hair, ears, amulet, uniform, trim, socks, and shoes remain recognizably consistent, with expected face/amulet occlusion in rear views. No obvious missing/extra anatomy or cleanup loss.
- **Margins and baseline:** Every figure remains inside its cell. Left/right padding is generally sufficient, though pose 8 has only 8 px on its right and pose 12 has about 9–10 px on its sides in 80 px cells. The updated report distinguishes the padded image-placement rectangle from the visible alpha bounds: all 15 alpha silhouettes end at baselineY=92 (baselineDelta=0) and leave 4 px below. The earlier apparent 5–6 px overrun for poses 3 and 4 was transparent padding in their placement rectangles, not visible pixels; there is no baseline mismatch.
- **Action poses 9–12:** Pose 9 is an open single-hand reach; pose 10 changes to a behind-head catch silhouette; pose 11 brings both hands together at the nape and reads as control. These are distinct. Pose 12 is separate and has a downward arm with the other arm counterbalancing outward, but its side-leaning silhouette reads more like a generic diagonal drop/follow-through than an unmistakable reverse dunk. Even with the ball tracked separately, the far-side, behind-the-body dunk extension is not clear enough at gameplay size.

Review covers the listed cleanup previews and report only. The raw source and provenance were not modified, and nothing was registered.
