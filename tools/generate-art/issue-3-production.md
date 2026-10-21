# Issue #3 sprite production handoff

Target: 105 athletes, 29 clips and 293 authored frames per athlete per required direction. Accepted issue minima total 278: dribble 8, run 8, dribble-run 8, shoot 8, push 8, celebrate 8; remaining minima equal targets. Minimum-approved genuinely distinct clips may ship; target shortfalls remain visible in the audit. Frame scheduling must map available authored frames honestly rather than claiming repeated playback frames are new drawings. The authoritative frame counts, timing and event anchors are in `src/core/animation.js`; asset registration and audit instructions are in `docs/ANIMATION_ASSET_AUDIT.md`.

Generate authentic distinct hand-drawn pixel animation frames using imagegen. Preserve each athlete's canonical portrait identity, clothing palette, anatomy, face, markings and accessories. Nonhuman athletes retain their actual rigs. Never create apparent frame counts by duplicating, shifting, rotating, recoloring, stretching or adding noise to existing sprites.

Suggested generation groups per athlete and direction:

| Group | Clips | Total frames |
| --- | --- | ---: |
| locomotion | idle 6, idle-ball 4, dribble 10, run 11, dribble-run 11 | 42 |
| ball-actions | shoot 10, pass 6, pass-overhead 6, pass-behind 6, receive 4, pickup 5 | 37 |
| court-actions | layup 8, layup-reverse 8, block 4, steal 8, push 11, rebound 5, fall 10, celebrate 10 | 64 |
| dunks | power, windmill, reverse, 360, tomahawk, double, clutch, scythe; 15 each | 120 |
| alley-oops | power 15, reverse 15 | 30 |

Use smaller sheets or batches if a generator cannot reliably keep every frame distinct and aligned. File names: `public/assets/animation/<athlete-id>-<group>-<direction>.webp`. Transparent RGBA, consistent framing/scale/feet, sufficient limb and ball padding, no labels or grid lines inside image. Export losslessly where possible. Atlas dimensions and frame crop coordinates must describe the actual output, including any non-square cells.

Prompt template:

> Create [clip/group and exact frame counts] for [athlete identity and canonical details], facing [direction]. Use the supplied canonical reference. Each cell contains one fully drawn distinct animation pose with consistent identity and uniform scale, transparent background, generous silhouette padding and matching floor baseline. Lay cells out as [explicit columns x rows with per-cell ordering]. [Describe each frame's progression and clip event anchors.] Ball release, reception, lift, peak, contact and landing must occur in the specified poses. Do not repeat poses or simulate motion by moving/scaling a duplicate. Do not add text, decorative frame borders, shadows outside the sprite, or new accessories.

Save generation timestamp, original artifact/reference and prompt. Register crops using `tools/register-animation-atlas.mjs`, inspect the resulting exported art and playback, then record clip approval. Keep mirror review pending until the athlete's asymmetries have been checked deliberately; draw separate left-facing clips when needed. Missing art stays missing in the audit; no fallback or procedural sprite is production-complete evidence.
