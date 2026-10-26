# J.130 Briar Foxglove layup — packed native review

## Candidate layout

The provisional 8-pose source uses a4×2 atlas /288×190 with72×95 cells, baseline y=89. Uniform scale fits all figures to at most62×83; margins are at least5px left/right and6px top/bottom. Cleanup crops outside the largest alpha>=16 silhouette bounds while retaining every source pixel inside those bounds; no component mask, redrawing, or recoloring is used. Raw inputs and rejected candidates remain unchanged. The 13-pixel pose04 detail remains inside the retained source bounds.

Candidate layout, source hashes, component counts, cells, atlas and track remapping are recorded in `tools/generate-art/candidates/j130-briar-foxglove-layup-production-candidate/production-layout.json`. The clean-looking light/dark proof is `light-dark-production-layout-proof.png`; this does not establish native acceptance.

## Current GitHub main native renderer

Captures use the current Jam Stage implementation from GitHub `main` and `tools/render-preview.mjs`’s process-local candidate override. No runtime manifest or game track was changed. At100% and120%, report rows verify frames0–4 in both facings at ticks0,2,5,8,10, held tick9 and ownerless shot mode at tick10. Every selected source rect reports the candidate atlas.

Independent visual review rejects the candidate render:

- Frame2 is replaced by detached purple/blue/green pixel fragments at Briar’s position in both facings. Its source PNG is clean, the packed atlas crop is pixel-identical, and the selector reports source rect [144,0,72,95]. This renderer/frame-specific defect remains unexplained.
- The separate ball does not meet the raised shooting hand at tick9: it appears below and beside the hand at both zooms. At tick10 it remains beside the hand and does not read as a clear forward/up release.
- The full athlete silhouette is visible at both zooms. No clear stray alpha residue appears in the other packed cells.

The current candidate H/F values are estimates only. Do not integrate them. Correct frame2 selection, then remeasure and calibrate the separate athlete-specific track in the current renderer. Frames5–7 remain unowned after release and have no calibrated values.

Reports and PNG captures are in `tools/generate-art/previews/j130-briar-foxglove-layup/packed-native-100/` and `packed-native-120/`. The old `native-{100,120}` images are retained as historical diagnostics from a stale renderer and do not count as acceptance evidence.