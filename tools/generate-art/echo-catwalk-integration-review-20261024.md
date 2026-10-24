# Echo Catwalk integration review — 2026-10-24

## Accepted scope

Echo's six existing locomotion/shoot clips and 23 action clips are registered in production. The new action package contributes 241 authored frames; Echo now has 29/29 clips and 293 authored drawings. Each of the 23 ball-bearing clips has an Echo-specific runtime track separate from the sprite atlas. Four action clips contain no ball: `block`, `celebrate`, `fall`, and `push`.

The action source sheets, verbatim prompt files, generation IDs, source hashes, source maps, cleanup scripts, four rejected PNG candidates, layouts, repack archives, dark/light proofs and native previews remain under `tools/generate-art/`. Packed cells have at least five transparent pixels on all four edges and were downscaled only as recorded by the repack script.

## Human and native review

The read-only source review verified all 23 action-source hashes and prompt text. Dark/light proofs were reviewed for Echo's adult male identity, teal/purple uniform, natural anatomy, distinct separated poses, alpha transparency, safe cell margins and absence of baked-in basketballs. No source was rejected. The atlas and runtime were checked in native Canvas at 100% and 120%, both facings.

The final native pass loaded 222 images and saved 87 per-clip summaries plus 572 action-frame captures at each zoom. All captures selected Echo's production atlas. Carried-ball states name Echo as owner; released/free-ball states have no carrier. Contact review covered pass, receive, shoot, layup, reverse alley-oop catch and finish, rebound, steal, pickup, and the final carried point of all ten dunk/aerial clips. Calibration changes, including before/after values and frame/tick reasons, are preserved in `echo-catwalk-runtime-ball-tracks.json`.

Final reports and frames are under:

- `tools/generate-art/previews/echo-catwalk-package-20261024/native-100-final-candidate/`
- `tools/generate-art/previews/echo-catwalk-package-20261024/native-120-final-candidate/`

Superseded intermediate renders were discarded after calibration to keep the repository focused on accepted evidence; every track adjustment remains documented with before/after coordinates and frame/tick reason in the track JSON. The final candidate passed the independent native review.

## Provenance limitation

The original generation images for Echo's five locomotion clips and `shoot` are missing from the workspace. Their original generation IDs, SHA-256 hashes and exact prompts remain recorded in their layout files. Existing production atlases were retained; no replacement pose or source image was fabricated. Details: `echo-catwalk-source-image-availability.md`.
