# Krios dunk-clutch attempt 04 source review

**Review date:** 2026-10-28  
**Verdict:** **REJECT. Not eligible for ball-track trials or runtime registration.**

## Source and cleanup

- ImageGen generation ID: `exec-6147911c-5f95-4cc4-b856-b47d1d3dea8b`, timestamp `2026-10-28T09:08:00Z`.
- Exact prompt: `tools/generate-art/krios-dunk-clutch15-attempt04-imagegen-prompt.txt`, SHA-256 `a03e5a2c53fccb07ec4f5fe57a6561319db6b02744b0ce0ae529226a5c2da355`.
- Raw sheet: `tools/generate-art/sources/krios-dunk-clutch15-attempt04-generated-raw.png`, 1619×971 RGB, SHA-256 `e4546a88a685026a93c905803312486214683f51d3623633ddbb734eaff0f42f`.
- Cleanup used the authored 5×3 source-cell boundaries rather than global component ordering. It keeps each cell's largest 8-connected foreground component, drops and records smaller detached fragments, keys the green background to alpha, despills green, and scales uniformly with nearest-neighbor sampling into transparent 128×96 cells at common baseline y=94. No pose redraw was performed.
- Reviewed outputs: `cleanup-layout-report.json`, `target-size-pose-contact-sheet.png`, the 15 isolated frames, and the light/dark previews in this directory.

## Review findings

**Identity and anatomy:** The sheet consistently depicts the requested Krios: dark red skin, tied-back black curls, full beard, muscular human proportions, black uniform with red/gold trim, and dark shoes. All 15 cells contain a full-body character without obvious fused limbs or crop loss. The target-size figures remain readable. This generation uses smooth, glossy, highly rendered shading rather than the referenced game sprite's crisp limited-palette pixel clusters, so the style match is weak, but the decisive rejection reasons are below.

**Cell isolation and cleanup:** The original raw sheet has 18 large connected components under a global key, not 15. Inspection showed that a small detached piece in the second-row first cell crosses into the row gutter. Global row grouping therefore misorders cells. The reviewed cleanup instead used the explicit 5×3 grid and retained one principal figure per cell. Small detached fragments were excluded and recorded. The cleaned atlas has 15 distinct normalized frame hashes, transparent backgrounds, consistent cell dimensions and baseline, and adequate margins. The green key and despill leave no prominent green fringe in the light or dark preview.

**Ball-free requirement — failed:** The prompt and provenance prohibit any ball or ball-like mark. Raw source cell 2 (zero-based frame 2) contains an unmistakable glossy, dark spherical object cradled between the hands, with a bright specular highlight. Enlarged raw evidence is saved as `raw-cell-02-ball-like-mark-review.png`; adjacent raw cells 3 and 4 are also preserved as `raw-cell-03-ball-like-mark-review.png` and `raw-cell-04-ball-like-mark-review.png` for comparison. The shiny sphere is not transparent-key contamination: it is within the character silhouette and survives cell cleanup. Because it is baked into athlete art, this sheet cannot establish a separate athlete-specific ball track.

**Action timing — failed against the supplied canonical anchors:** The drawn sequence broadly resembles approach, gather/load, takeoff, clutch, arm drive, release, and recovery. However, the visible takeoff occurs after the canonical `takeoff: 2` frame (index 2 is the crouched load), and the diagonal release occurs at index 9 while provenance requires `release: 10`. The prompt's numbered beats and the zero-based canonical anchors therefore do not align. At the required release frame 10, the figure is already in follow-through. The final crouch/recovery poses also do not place the `land: 14` anchor on a clear first ground-contact pose. These discrepancies make timing and ball placement unreliable without changing the canonical specification.

## Disposition

Preserve the raw sheet, prompt, provenance, cleanup, previews, isolated frames, and enlarged rejection evidence. Do not register the atlas or calibrate a ball track against it. A replacement must be ball-free and place takeoff, release, and first landing at the canonical zero-based anchors before it can be considered for trials.
