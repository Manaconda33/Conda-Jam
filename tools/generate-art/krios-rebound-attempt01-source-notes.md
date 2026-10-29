# J.128 Krios `rebound` — attempt01 source notes

This is a source-generation preparation packet only. No image has been generated, reviewed, cleaned, registered, or accepted. No Krios rebound atlas or rebound-specific track is currently registered.

## Canonical requirements

- Canon source: `tools/generate-art/pose-catalog.json`, Krios entry; J.128/Krios, `horned-giant` rig. An enormous muscular red-skinned male with huge black ram horns and wild dark beard; fully coherent human anatomy.
- Animation definition in `src/core/animation.js`: five non-looping frames, durations `[2,2,1,2,4]`; `grab` anchor is frame index 3, whose starting tick is 5. Do not change this schedule.
- Full ordered pose descriptions are in the `rebound` entry of `pose-catalog.json`; this prompt preserves them.
- Exactly five distinct full-body drawings are required. The athlete artwork remains ball-free. Later work must calibrate a separate Krios-specific rebound ball track and review it in the actual Jam Stage; do not reuse another athlete's track by assumption.

## Existing style references (SHA-256)

- `public/assets/animation/krios-idle-right.webp` — `3972858f17324a3a45a629ce9ce9c0b7544e957c3675bc1ed74017017d8be939`
- `public/assets/animation/krios-block-right.webp` — `feec8fcde6708c70fab9071d5719423a234dbcf119ee1f78efe16b84eeb7658f`
- `public/assets/animation/krios-steal-right.webp` — `197a1b59bbfef4a382d96dd882ff842dad7ca654f24689a239ad1a565a685d2a`

No Krios `rebound` clip exists in the current right-facing production manifest and there is no `athleteBallTracks.krios.rebound` entry in core. Similar rebound tracks for other athletes are references only; do not copy their values without native Krios calibration.

## Review priorities and risks

Retain the raw generation unchanged and record exact prompt text/hash, image-generation artifact ID, generation timestamp, raw dimensions/color mode/hash and reference hashes. Inspect that all five poses are present, distinct, full body, anatomically connected and consistently Krios. Verify both arms/hands remain empty in every drawing, especially the high two-hand grab; no basketball may be baked into art. Check the hands leave a visually useful gap for the separate ball sprite at frame3. Confirm clean uniform green, component-safe gutters, transparency after cleanup, silhouette margins, native pixel readability and a shared baseline. Use only cleanup that isolates and aligns actual source figures; do not invent missing anatomy or poses. Preserve source rects, cleanup masks/notes, frame hashes, light/dark previews and every rejected candidate with its reason. Source/layout acceptance alone is not runtime acceptance: candidate and registered Jam Stage ball-contact reviews must verify Krios's own track, both facings and actual simulation timing before registration.
