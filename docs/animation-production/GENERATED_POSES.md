# Generated animation production checkpoint

2026-10-21. Issue3 remains **incomplete**. Actual registered total: **1,040 authored drawings across 118 reviewed clips and17 athletes**. Full roster target:30,765 drawings /105 athletes.

| Athlete | Clips | Authored drawings | Encoded bytes |
| --- | ---: | ---: | ---: |
| manaconda | 29 | 293 | 1,305,626 |
| reed-ashcroft | 6 | 52 | 184,348 |
| accu | 6 | 52 | 200,024 |
| nova-stitch | 6 | 52 | 229,296 |
| juniper-vale | 6 | 52 | 223,912 |
| echo-catwalk | 6 | 52 | 177,280 |
| paprika | 9 | 67 | 482,196 |
| lavi | 5 | 42 | 193,484 |
| leo | 5 | 42 | 164,840 |
| kraken | 5 | 42 | 166,106 |
| krios | 5 | 42 | 215,304 |
| colossus | 5 | 42 | 217,884 |
| mcfleurdel | 5 | 42 | 196,718 |
| ria | 5 | 42 | 175,396 |
| gummiefish | 5 | 42 | 219,698 |
| piper-quickstep | 5 | 42 | 196,618 |
| briar-foxglove | 5 | 42 | 180,192 |

Manaconda has all29 required clips at target counts (293 drawings), including all8 fifteen-pose dunks and both fifteen-pose aerial finishes. Reed Ashcroft, Juniper Vale, Accu, Nova Stitch and Echo Catwalk each have42 locomotion poses plus10 shooting poses. Paprika has42 quadruped locomotion poses,10 nose-flick shot poses,6 nose-pass poses,4 receive poses and5 pickup poses. Lavi, Leo, Kraken, Krios, Colossus, McFleurdel, Ria, Gummiefish, Piper Quickstep and Briar Foxglove each have42 reviewed locomotion poses; their remaining24 clips are still absent.

## Sources and safeguards

All art was generated through imagegen; exact prompts, original generation paths/dates, source hashes, crop rectangles, uniform scales and component-isolation flags are in tools/generate-art/*-provenance.json and *-layouts.json. Original PNGs remain under /workspace/generated_images. Atlas packing extracts/downsamples existing drawings; it does not manufacture frames.

Sources are inspected at full resolution and in packed atlases before explicit reviewed flags are set. Direction mirroring requires separate canonical review. Paprika remains a tiny quadruped with animal paws, large ears and pale-tipped tail. Human supporting identities retain their existing faces/hair/palettes.

Rejected generations remain excluded: touching/cut figures, baked balls/numerals, incorrect crest direction, missing left-facing360 stage, mistimed interaction poses and ragged grid rows. Some accepted crowded captain sheets use component isolation only after visually confirming42 separate bodies; it assigns existing antialias pixels without synthesizing poses. The accepted360 includes back/left/front/right turn stages after two rejected repairs. Eleven Python packing checks cover counts, clipping, transparency, source rejection, row ordering and exact component extraction.

## Gameplay integration

Per-frame hand tracks follow the different dunk sweeps and both aerial catches. Passes and shots start free flight at the actual sampled hand; compressed flight elevation matches attached jump height at release. Paprika uses separate paw/nose tracks, tiny fox body scale, quadruped shot/pass/catch/pickup art and correct paw position from match start through inbound. Sprite sizes follow camera zoom. Held balls draw in front of their carrier; control markers follow body height. Eighty-four focused animation tests pass.

## Validation limits

The native Canvas adapter executes actual src/main.js and captures all29 clip keys across3 court positions, with production/fallback annotations. Manaconda, Leo, Krios, Kraken, Lavi, Colossus, McFleurdel, Ria and Gummiefish diagnostics each loaded93 images; Piper and Briar each loaded102 images. Each produced87 snapshots; their five locomotion clips were flagged production, with fallback reported for unfinished actions. Native Canvas is not browser/CSS/mobile E2E validation. Chromium launch is blocked in this sandbox. Actual wrist alignment and loop continuity still need browser playtest.

Latest full validation results and pending generation are recorded in SESSION_HANDOFF.md. The strict production audit remains incomplete: 118 reviewed clips are decoded, with375 missing clips across represented athletes and88 athletes not yet represented. Passing gameplay tests or one complete captain does not close issue3.
