# Supporting-player animation reuse

Updated 2026-10-27. This authorized model applies only to the 70 noncaptains. All 35 captains keep the original authored-art requirement and are excluded from the reuse map.

## Current implementation

- Seven complete supporting libraries are retained as original artwork: Reed Ashcroft, Juniper Vale, Piper Quickstep, Moxie Capwell, Dorian Mycel, Nova Stitch and Echo Catwalk.
- The other 63 players have explicit compatible donor assignments in `src/content/supporting-animation-libraries.js`: human/tall uses Reed, human/compact uses Juniper, and athletic-variant/compact uses Echo. These assignments cover the 29 existing clip names and retain the recipient's simulation, timing and athlete-specific ball tracks.
- `src/render/uniform-palette.js` implements a lazy, per-source/per-palette cached canvas transform. It preserves transparency and modifies only pixels inside frame-relative candidate garment zones. The transform is deliberately blocked from gameplay while its donor mask review is pending.
- `tools/audit-animation-assets.mjs` reports effective clip classifications separately from unique source libraries, atlas files and decoded source drawings. Shared lineage and derived palette clips are not counted as new authored drawings. Captains continue to be audited against their own manifest entries.

## Visual gate and current coverage

The first output review found visible hair and skin contamination in color-distance candidates. The candidate mask was tightened to torso and shorts zones and reviewed again across idle, pass, rebound, fall, celebrate and dunk-power atlases for Reed, Juniper and Echo. Those previews still contain color spills and incomplete garment coverage. This mask attempt is rejected; the contact sheet and source SHA list are preserved in `docs/animation-production/palette-mask-reviews/attempt-02-rejected/`. No shared palette assignment is approved for runtime, and no source art or captain asset was changed.

The code keeps the 63 assignments classified as **unreviewed**, does not select them in gameplay, and reports them as audit errors until a reviewed donor-specific garment mask passes image review. The seven original libraries remain unaffected. Current effective reused-player count: **0 of 63 pending palette-mask acceptance**. This is an explicit unresolved production gate, not completed coverage.

## Review evidence and next implementation step

Representative source and transformed sheets were inspected against light blue; the failed candidate is reproducible with `src/render/uniform-palette.js` and the exact source atlases in `public/assets/animation/`. The failed attempt affected shirt/hair regions and skin pixels despite frame zones, so simple color-range and vertical-zone masking are not acceptable. Next work must author or generate a garment-only mask per donor source clip, preserve every source pixel outside the mask, review all 29 clips for each donor family and team palette, then calibrate a light/dark board and native gameplay capture before changing any assignment to `review: accepted`.

No production atlas, image-generation attribution, provenance, or original-frame hash is rewritten by this reuse layer. The active Briar J.131/J.138 source and review files are preserved separately and were not modified by the reuse implementation.
