# J.120 Leo dunk-reverse source and packing notes

- Canonical target: J.120 / Leo / `dunk-reverse`, captain bespoke source.
- Exact original prompt: `tools/generate-art/j120-leo-dunk-reverse15-prompt.md`.
- Attempt01 generation: `c2pa:ab343ffc-fbb0-4151-afee-642ffc74839e`; raw sheet `tools/generate-art/sources/j120-leo-dunk-reverse-attempt01-generated-raw.png`; rejected because PNG was RGB with an opaque gray checkerboard and gold trim.
- Attempt02 edit: `c2pa:72f55ae0-737d-4d3a-b5b7-dc0c3971ce5b`; exact edit prompt `tools/generate-art/j120-leo-dunk-reverse15-edit-prompt.md`; raw sheet `tools/generate-art/sources/j120-leo-dunk-reverse-attempt02-generated-raw.png`.
- Cleanup: `tools/generate-art/clean-j120-leo-dunk-reverse.py` removes only edge-connected near-neutral checkerboard pixels; enclosed highlights are preserved. The cleaned RGBA candidate is `tools/generate-art/sources/j120-leo-dunk-reverse-attempt02-cleaned.png`.
- Independent source review accepts the packed-size candidate, with a noted smoother/comic shading style than the crispest game sprites.
- Packing: `tools/generate-art/pack-j120-leo-dunk-reverse.py` isolates 15 original connected figures, assigns them row-major, uniformly scales and baseline-aligns at y94 in a 4×4 128×96 atlas. No poses are redrawn, mirrored, repeated or interpolated. Atlas: `public/assets/animation/leo-dunk-reverse-right.webp`; blank frame16 remains transparent.
- Layout and per-pose source/destination rectangles: `tools/generate-art/j120-leo-dunk-reverse15-layout.json`.
- Light/dark source contact proofs: `tools/generate-art/previews/j120-leo-dunk-reverse-light-candidate.png` and `...-dark-candidate.png`; packed proofs: `tools/generate-art/previews/j120-leo-dunk-reverse-atlas-light.png` and `...-dark.png`.
- Accepted athlete-specific track attempt06 and all six 60-capture Jam Stage sets are preserved in `tools/generate-art/j120-leo-dunk-reverse-track-trials.json` and `tools/generate-art/previews/leo-dunk-reverse-track-candidate/`. Independent review accepts hand contact and the backward release in both facings at100%/120%; deterministic gameplay test confirms release at tick21 and score at tick23.
- Full generation lineage and hashes: `tools/generate-art/j120-leo-dunk-reverse15-provenance.json`.
