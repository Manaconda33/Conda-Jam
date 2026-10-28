# J.128 Krios `push` — attempt02 source notes

Attempt02 is a new source generation prompted to correct attempt01's reviewed contact-pose anatomy defect. It must be reviewed independently; do not transfer attempt01's acceptance for other frames to attempt02.

## Attempt01 rejection and correction

Attempt01 ImageGen artifact `exec-711ce2c5-93c3-4cb8-854d-dadfc8773b85`, generated 2026-10-28T06:08:24Z, raw SHA-256 `8e4655158f653e6aeaaf94eb53c29e7d81549e8f49fb2c37289c41b308247310`. Raw source review at `tools/generate-art/previews/krios-push-attempt01/INDEPENDENT_SOURCE_REVIEW.md` initially described frame5 as two-arm contact. Later native cleanup review at `tools/generate-art/previews/krios-push-attempt01/INDEPENDENT_CLEANUP_REVIEW.md` inspected raw, isolated and native previews and rejected the source: frame index 5 / tick 8 contains only one forward-reaching arm and one visible open hand. The second arm/hand is not separately visible; correcting it in cleanup would invent anatomy. Preserve all attempt01 outputs and this conflicting-review history unchanged.

The attempt02 exact prompt at `tools/generate-art/krios-push-attempt02-imagegen-prompt.txt` explicitly requires two straight parallel arms, two separately readable five-finger open palms side-by-side with a clear gap, one slightly higher, and no overlap/occlusion/single-arm read. It also reserves broad margins and an extra-wide green separator between contact frame index5 and follow-through frame index6 to address attempt01's tight source boundary and near-zero contact margin.

## Canonical requirements

- Canon: J.128 Krios, red-skinned giant with huge black curled ram horns, heavy dark beard, muscular but coherent human anatomy, black/charcoal uniform with ember-red accents.
- Exactly 11 unique original poses; target all 11 (the formal minimum is 8). No pose invention, duplication, or redraw during cleanup.
- `src/core/animation.js` timing: non-looping, durations `[2,2,2,1,1,2,2,3,3,3,3]`; contact anchor is frame index 5 at tick 8.
- Exact pose sequence: `tools/generate-art/pose-catalog.json`, `push` entry.
- Empty hands; no ball art or track. Validate simulated target shove/possession behavior separately.

## Identity/style references

- `public/assets/animation/krios-block-right.webp` — SHA-256 `feec8fcde6708c70fab9071d5719423a234dbcf119ee1f78efe16b84eeb7658f`
- `public/assets/animation/krios-steal-right.webp` — SHA-256 `197a1b59bbfef4a382d96dd882ff842dad7ca654f24689a239ad1a565a685d2a`
- `public/assets/animation/krios-shoot-right.webp` — SHA-256 `d189428aa72896a35fa138b195702002c486b341a73822592576f1acb1bbfa6f`

## Review and preservation

Keep the generated raw image immutable. Record returned artifact/generation ID, UTC timestamp, actual dimensions and color mode, exact prompt SHA, reference hashes, and raw-image SHA in attempt02 provenance. Inspect all eleven source poses before cleanup, with heightened scrutiny of the two complete arms and hands at contact, hand separation, cell margins, and contact/follow-through figure separation. If source passes, isolate actual components without inventing/moving anatomy; preserve layouts, cleanup masks, edge/alpha notes, frame hashes, light/dark and native previews, rejected variants, and reviewer findings. Candidate and registered-runtime reviews are still required before registration. Do not silently upgrade source-only acceptance to runtime acceptance.
