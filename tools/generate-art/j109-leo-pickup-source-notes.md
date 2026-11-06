# J.109 — Leo loose-ball pickup source notes

Five distinct right-facing figures show a controlled low reach, fingertip ground contact and recovery. Leo remains pale, adult and human with long wavy black hair, refined mustache, composed face and black/crimson basketball kit. The separate basketball is not drawn.

- Accepted generation: `exec-3367d441-68b5-4b6a-8591-5dfbbe77ace3`; date 2026-10-24; canon K.05.
- Raw sheet: `tools/generate-art/sources/j109-leo-pickup-generated-raw.png`; hash in `tools/generate-art/j109-leo-pickup5-provenance.json`.
- Atlas: `public/assets/animation/leo-pickup-right.webp`; layout: `tools/generate-art/leo-pickup5-layouts.json`.
- Packer and component cleanup: `tools/generate-art/package-leo-action5.py`.
- Verbatim prompt: `tools/generate-art/j109-leo-pickup5-prompt.md`; no rejected generation was used.

Initial Leo-specific ball track: height `[0.95,0.65,0.3,0,0.7]`; forward `[6,9,13,16,10]`. Ball touches the floor at frame3/tick7. Runtime hand-contact review and manifest registration remain pending central integration.

## Native ball-track review

- The exact source prompt, generation ID, raw source and atlas hashes, five-pose layout, component-isolation cleanup and rejected-generation history remain in the files above. An independent source review confirmed five distinct full-body poses, one empty sixth cell, clear Leo identity/anatomy, no ball pixels, and no clipping. The raw sheet’s low-alpha haze is removed by the existing component-isolation packer; the original raw image is preserved.
- Attempt01 H `[0.95,0.65,0.3,0,0.7]`, F `[6,9,13,16,10]` was captured and rejected because the ground ball sat too far beyond the reaching fingertips. Attempt02 H `[0.95,0.65,0.1,0,1.1]`, F `[6,9,12,8,6]` refined low approach and recovery but left the catch too close to Leo’s body. Attempt03 F `[6,9,12,15,8]` overshot the tick7 fingertip contact. Attempt04 is accepted: H `[0.95,0.65,0.1,0,1.1]`, F `[6,9,12,11.5,8]` makes the ball edge meet the reaching fingers at the floor on tick7 and keeps it in the recovery hand at tick8.
- The accepted attempt has 28 production Jam Stage captures covering ticks0/2/4/6/7/8/11, right and mirrored left, at100% and120% zoom. Browser errors: zero. The harness manually stages visual pose/ball placement; `tests/leo-pickup.test.js` independently uses the real simulation and verifies the ball remains loose through tick6, becomes Leo-owned at tick7, and follows the track through recovery in both facings.
- The atlas was registered only for native review after restoring Leo’s canonical `mirrorReview` status (the atlas registrar defaults it to pending). The approved mirror policy is unchanged. Light/dark source proofs are `tools/generate-art/previews/leo-pickup-atlas-light.png` and `tools/generate-art/previews/leo-pickup-atlas-dark.png`.
