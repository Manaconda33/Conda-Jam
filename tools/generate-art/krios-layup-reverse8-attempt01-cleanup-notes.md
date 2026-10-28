# Krios J.128 `layup-reverse` attempt01 cleanup/layout trial

The opaque RGB raw ImageGen file remains unchanged. The independent source reviewer supplied eight foreground crop bounds because several generated figures cross the nominal 384×512 grid. The cleanup script then removes the green matte and builds a transparent 4×2 layout using a single fit factor of `0.8913649025069638` (nearest-neighbor), giving every logical source cell at least 32 transparent pixels on all sides. Each keyed source crop and measured cell output bounds are recorded in `cleanup-layout-report.json`.

The key uses green dominance (`G>=130`, `G-R>=40`, `G-B>=40`) with 8-connected background reachability from the canvas border, plus disconnected green islands. Small islands (≤60 pixels) receive RGB repair from the nearest non-key pixel with alpha preserved. A two-pixel matte-edge zone clears weaker green spill (`G>=70`, `G-R>=8`, `G-B>=8`); weak green-dominant pixels inside silhouette bounds (`G>=50`, `G-R>=4`, `G-B>=4`) receive nearest non-green RGB repair with alpha preserved. No pose was redrawn or synthesized. Original generated RGB is retained separately for exact recovery.

The native-size runtime trial is eight 128×96 cells, one fixed source-to-runtime scale `.195`, nearest-neighbor resampling, horizontally centered artwork, and shared y=94 baseline. It is review-only and not yet registered. The ball is absent from the artwork and requires a separate athlete-specific Krios track through tick11 with release at tick12.

Light/dark proofs are saved at 4× nearest-neighbor scale. Source review accepted the raw art for cleanup/layout trials only. The cleaned sheet and native runtime candidate remain unaccepted until independent cleanup review and actual registered-runtime review across both facings, gameplay timing, ball contact/release/ownership, and shot completion.


## Registered production review — 2026-10-28

The cleaned `layup-reverse` atlas is registered as `public/assets/animation/krios-layup-reverse-right.webp`. Independent registered-runtime review passed actual manifest selection, both facings at 100%/120%, separate ball alignment/release, and scoring on the current Jam Stage court. Evidence: `tools/generate-art/previews/j128-krios-layup-reverse-track-candidate/attempt-01/registered-runtime/INDEPENDENT_REGISTERED_RUNTIME_REVIEW.md` and `tools/generate-art/previews/j128-krios-layup-reverse-track-candidate/attempt-01/registered-runtime/report.json`. Earlier trial-only/rejection notes remain as historical review records; this acceptance supersedes their pending status.
