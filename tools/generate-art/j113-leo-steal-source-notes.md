# J.113 — Leo steal source notes

Eight complete right-facing poses show a defensive set, low reach, hand contact, controlled pullback and recovery. Leo remains pale, adult and human with long wavy black hair, refined mustache, black/crimson uniform and natural anatomy. The basketball remains external.

- Accepted generation: `exec-10be67e6-cd16-4ffe-aedb-e1ed4c7982b5`; date 2026-10-24; canon K.05.
- Raw sheet: `tools/generate-art/sources/j113-leo-steal-generated-raw.png`; hashes and atlas facts in `tools/generate-art/j113-leo-steal8-provenance.json`.
- Atlas: `public/assets/animation/leo-steal-right.webp`; layout: `tools/generate-art/leo-steal8-layouts.json`.
- Packer/cleanup: `tools/generate-art/package-leo-action8.py` with eight-component isolation.
- Verbatim prompt: `tools/generate-art/j113-leo-steal8-prompt.md`; no rejected generation.

Leo-specific separate-ball track: height `[1.05,1.0,0.8,1.15,1.25,1.1,1.1,1.1]`; forward `[6,9,12,12.5,6,7,7,6]`. Frame3/tick5 places the separate ball at the extended hand; frame4 pulls it toward Leo's torso after the recovery catch. A successful initial steal jars the opponent's ball loose at tick5. Simulation then schedules a second steal catch; Leo gains possession at that recovery clip's own tick5 grab. The ball remains separate throughout. The original proposal `[1.05,1,0.8,1.15,0.9,1,1.1,1.1]` / `[6,9,12,14,12,9,7,6]` is preserved as attempt01, but its capture harness selected fallback art and could not support visual review.

Jam Stage candidate renders for attempts02–04 cover all eight selected pose ticks in both facings at100%/120%. Attempt04 was visually accepted: its separate ball overlaps the open fingertips at frame3/tick5 and follows the hand toward the torso in frame4. Attempt01 harness output is retained but invalid because registration was still pending and the fallback sprite rendered. See `tools/generate-art/previews/leo-steal-track-candidate/` for captures and reports. Full simulation ownership/timing is validated by the canonical steal tests.
