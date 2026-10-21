# Generated animation production checkpoint

2026-10-21. Issue3 remains **incomplete**. Actual registered total: **611 authored drawings across 66 reviewed clips and7 athletes**. Full roster target:30,765 drawings /105 athletes.

| Athlete | Clips | Authored drawings | Encoded bytes |
| --- | ---: | ---: | ---: |
| manaconda | 29 | 293 | 1,305,626 |
| reed-ashcroft | 6 | 52 | 184,348 |
| accu | 6 | 52 | 200,024 |
| nova-stitch | 6 | 52 | 229,296 |
| juniper-vale | 6 | 52 | 223,912 |
| echo-catwalk | 6 | 52 | 177,280 |
| paprika | 7 | 58 | 416,912 |

Manaconda has all29 required clips at target counts (293 drawings), including all8 fifteen-pose dunks and both fifteen-pose aerial finishes. All6 Chicago/Neo Runway athletes have42 locomotion poses plus10 shooting poses. Paprika has42 quadruped locomotion poses,10 nose-flick shot poses and6 nose-pass poses.

## Sources and safeguards

All art was generated through imagegen; exact prompts, original generation paths/dates, source hashes, crop rectangles, uniform scales and component-isolation flags are in tools/generate-art/*-provenance.json and *-layouts.json. Original PNGs remain under /workspace/generated_images. Atlas packing extracts/downsamples existing drawings; it does not manufacture frames.

Sources are inspected at full resolution and in packed atlases before explicit reviewed flags are set. Direction mirroring requires separate canonical review. Paprika remains a tiny quadruped with animal paws, large ears and pale-tipped tail. Human supporting identities retain their existing faces/hair/palettes.

Rejected generations remain excluded: touching/cut figures, baked balls/numerals, incorrect crest direction, missing left-facing360 stage, mistimed interaction poses and ragged grid rows. The accepted360 includes back/left/front/right turn stages after two rejected repairs. Eleven Python packing checks cover counts, clipping, transparency, source rejection, row ordering and exact component extraction. All29 currently accepted multi-pose sources were rechecked against the strengthened row guard without changing existing crop order.

## Gameplay integration

Per-frame hand tracks follow the different dunk sweeps and both aerial catches. Passes and shots start free flight at the actual sampled hand; compressed flight elevation matches attached jump height at release. Paprika uses separate paw/nose tracks, tiny fox body scale and quadruped shot/pass art. Sprite sizes follow camera zoom. Held balls draw in front of their carrier; control markers follow body height. Eighty focused animation tests pass.

## Validation limits

The native Canvas adapter executes actual src/main.js and captures all29 clip keys across3 court positions, with production/fallback annotations. Manaconda93loadedimages/87snapshots after all29clips; Paprika snapshots include only her reviewed clips and explicit legacy fallback elsewhere. Native Canvas is not browser/CSS/mobile E2E validation. Chromium launch is blocked in this sandbox. Actual wrist alignment and loop continuity still need browser playtest.

Latest full validation results and pending generation are recorded in SESSION_HANDOFF.md. The strict production audit must continue to fail until the remaining roster art is complete; passing gameplay tests or one complete captain does not close issue3.
