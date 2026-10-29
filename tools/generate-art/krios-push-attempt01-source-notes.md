# J.128 Krios `push` — attempt01 source notes

This is a source-generation preparation packet only. No image has been generated, reviewed, cleaned, registered, or accepted. It intentionally does not modify shared runtime files.

## Canon and references

- Canon: J.128, Krios; `tools/generate-art/pose-catalog.json` identifies a horned-giant rig and describes an enormously muscular red-skinned male with black ram horns and a wild dark beard.
- Style/identity references:
  - `public/assets/animation/krios-block-right.webp` — SHA-256 `feec8fcde6708c70fab9071d5719423a234dbcf119ee1f78efe16b84eeb7658f`
  - `public/assets/animation/krios-steal-right.webp` — SHA-256 `197a1b59bbfef4a382d96dd882ff842dad7ca654f24689a239ad1a565a685d2a`
  - `public/assets/animation/krios-shoot-right.webp` — SHA-256 `d189428aa72896a35fa138b195702002c486b341a73822592576f1acb1bbfa6f`
- Exact prompt: `tools/generate-art/krios-push-attempt01-imagegen-prompt.txt`. Preserve the file verbatim with its SHA in generation provenance.

## Required timing and pose count

The authoritative definition is `src/core/animation.js`: 11 frames, non-looping, durations `[2,2,2,1,1,2,2,3,3,3,3]`; contact anchor frame index 5 is tick 8. The corresponding complete pose briefs are in `tools/generate-art/pose-catalog.json` under `push`. Exactly 11 unique complete drawings are required; atlas spare cells are empty and never count as poses. Minimum unique-frame count is 8, but the source target is all 11.

## Artwork constraints

Maintain Krios's red skin, black curled horns, dark beard, charcoal/ember uniform, gigantic muscular build, and coherent human anatomy. Hands stay empty: no basketball or opponent should be baked in. Particular review focus: the sixth drawing's fully extended hands, separated readable fingers, connected arms/shoulders, and stable horn/beard identity; distinctness of near-contact versus contact; natural recovery; clear baseline and full-body crop; clean transparency and no green fringe after cleanup.

## Layout and review plan

Prompt requests flat pure-green 4×3 output with 11 populated cells, but generated dimensions/layout must be measured from the returned raw image rather than assumed. Preserve raw output unchanged. Record original artifact/generation ID, UTC time, actual dimensions/mode, prompt/reference hashes, and raw SHA-256. Review raw identity/anatomy/action order and cell crossings before choosing cleanup. If acceptable, extract only the 11 actual figures without redrawing or inventing poses; retain source rects, component IDs, cleanup decisions, any alpha-edge corrections, per-frame hashes, native dimensions, baseline, uniqueness results, and rejected alternatives. Produce light and dark previews, then separate candidate and registered-runtime ball/contact reviews before runtime acceptance. Keep every rejected raw/candidate and explain why it failed.

## Ball policy

`push` is an empty-handed action. Existing generic push gameplay may knock a target back, but no basketball is carried by Krios during this clip. Confirm actual gameplay ownership/state while reviewing registered runtime; do not add a ball track to make the artwork appear complete. Contact frame 5 at tick 8 should read as a two-palm shove, with the target handled by simulation.
