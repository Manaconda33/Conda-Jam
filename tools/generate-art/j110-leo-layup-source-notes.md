# J.110 — Leo layup source notes

Eight complete right-facing poses show a patient approach, gathered takeoff, high one-hand extension, open-hand release and balanced landing. Leo remains pale, adult and human with long wavy black hair, refined mustache, composed face and black/crimson Court Kings kit. Art contains no basketball.

- Accepted generation: `exec-ed078327-ebab-4bd1-b390-ef2fde79cbce`; date 2026-10-24; canon K.05.
- Raw sheet: `tools/generate-art/sources/j110-leo-layup-generated-raw.png`; source SHA and atlas SHA/size are in `tools/generate-art/j110-leo-layup8-provenance.json`.
- Atlas: `public/assets/animation/leo-layup-right.webp`; layout: `tools/generate-art/leo-layup8-layouts.json`.
- Packer/cleanup: `tools/generate-art/package-leo-action8.py`; it isolates eight components without inventing or duplicating poses.
- Verbatim prompt: `tools/generate-art/j110-leo-layup8-prompt.md`; no rejected source.

Initial separate Leo ball track: height `[0.95,1.15,1.45,2.05,2.35,1.8,0.95,0.6]`; forward `[5,7,9,12,14,11,7,5]`. The right hand releases on frame4/tick10. Runtime hand-contact tuning and manifest registration remain pending central integration.

## Native ball-track calibration

- Independent source review passed the eight distinct poses, Leo identity/anatomy, transparent packed atlas and cell margins. The broad alpha haze in the raw generated sheet is removed by the existing component-isolation packer; raw source remains preserved unchanged.
- Attempt01 was preserved as a rejected native harness run: it advanced actual game players into a bad camera composition and cropped Leo. It is not art-quality evidence.
- Attempt02 used the initial track H `[0.95,1.15,1.45,2.05,2.35,1.8,0.95,0.6]`, F `[5,7,9,12,14,11,7,5]`. Review rejected its gather and airborne frames for being too far from the hands and low.
- Attempt03 H `[0.95,0.8,2.0,2.6,2.35,1.8,0.95,0.6]`, F `[5,3,5,2.5,14,11,7,5]` aligned the waist gather and close-to-head carry, but independent review saw an 8–12px fingertip gap on frame3/ticks8–9.
- Attempt04 is accepted: H `[0.95,0.8,2.0,2.6,2.35,1.8,0.95,0.6]`, F `[5,3,5,4.5,14,11,7,5]`. Independent review confirms the ball edge meets Leo’s raised fingertips at ticks8–9 in both facings. Tick10 is the canonical release and its native screenshot shows the separate projectile moving away after release.
- The 36 accepted Jam Stage captures cover ticks0/2/5/8/9/10/11/14/18, both facings and 100%/120% zoom, with zero browser errors. The post-release ball positions were sampled from the actual Leo simulation. `tests/leo-layup.test.js` separately verifies the ball remains owned through tick9, releases once from the frame4/tick10 hand anchor in both facings and remains ownerless through finish.
- Light/dark atlas previews are `tools/generate-art/previews/leo-layup-atlas-light.png` and `tools/generate-art/previews/leo-layup-atlas-dark.png`.
