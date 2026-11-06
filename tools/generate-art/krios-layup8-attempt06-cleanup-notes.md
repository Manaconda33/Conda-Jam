# Krios J.128 `layup` attempt06 cleanup and layout trial

This is a review-only derivation. The raw ImageGen RGB source remains unchanged at `tools/generate-art/sources/krios-layup8-attempt06-chromakey-generated-raw.png`.

## Chroma removal and spill cleanup

`tools/generate-art/clean-krios-layup8-attempt06.py` preserves the raw PNG and creates the transparent trial. It keys 8-connected pixels meeting `G >= 130`, `G-R >= 40`, and `G-B >= 40` that touch a canvas edge. It also keys disconnected matching green islands inside the reviewed pose bounds. Small interior green components of at most 60 pixels keep their alpha and have their RGB replaced with the nearest non-key pixel. Larger green islands are transparent. In the two-pixel edge neighborhood, weak green spill pixels meeting `G >= 70`, `G-R >= 8`, and `G-B >= 8` are cleared. Remaining weak green-dominant pixels inside the source pose bounds (`G >= 50`, `G-R >= 4`, `G-B >= 4`) receive nearest non-green RGB repair with opacity preserved.

The removal counts, thresholds, component counts, raw hash, and image hashes are recorded in `tools/generate-art/previews/krios-layup8-attempt06/cleanup-layout-report.json`. A generated green basketball-shaped artifact at pose7's hands is removed. Raw pixels outside alpha and documented spill-repair pixels remain as generated; no pose was redrawn or synthesized.

## Layout

The independent source review supplied the source figure bounds; each was uniformly scaled with a single factor `0.9957081545064378` and centered in its own 384×512 source cell. All source-cell margins are at least 24 px. The individual frame crops are in `previews/krios-layup8-attempt06/poses/`.

The 128×96 native-size layout proof uses a fixed scale of `0.18`, nearest-neighbor pixel resampling, horizontal center alignment, and shared y=94 baseline. The 8-cell proof and offsets are in `runtime-layout.json`. Light, dark, and 4× nearest-neighbor previews are provided. No ball appears in the art; all ball motion remains a separate Krios track.

## Review status

The source review accepts attempt06 for chroma cleanup/layout trials only. The latest independent cleanup review clears the fixed-scale native-size candidate for athlete-specific ball-track trials. It is **not production-approved or registered**; actual runtime selection, both facings/zoom, ball contact/release/ownership, shot result, timing, and gameplay continuity remain required.

Attempt01–05 remain preserved as rejects for background glow/vignette; none of their pixels are used.


## Registered production review — 2026-10-28

The cleaned `layup` atlas is registered as `public/assets/animation/krios-layup-right.webp`. Independent registered-runtime review passed actual manifest selection, both facings at 100%/120%, separate ball alignment/release, and scoring on the current Jam Stage court. Evidence: `tools/generate-art/previews/j128-krios-layup-track-candidate/attempt-01/registered-runtime/INDEPENDENT_REGISTERED_RUNTIME_REVIEW.md` and `tools/generate-art/previews/j128-krios-layup-track-candidate/attempt-01/registered-runtime/report.json`. Earlier trial-only/rejection notes remain as historical review records; this acceptance supersedes their pending status.
