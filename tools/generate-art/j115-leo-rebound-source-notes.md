# J.115 — Leo rebound source notes

Five distinct full-body poses show Leo setting under the ball, jumping, reaching high, catching and recovering. He remains pale, adult and human with long wavy black hair, refined mustache, composed face and black/crimson kit. No ball is drawn.

- Accepted generation: `exec-bd4af4d4-34e8-4379-ad24-594842a49409`; date 2026-10-24; canon K.05.
- Raw sheet: `tools/generate-art/sources/j115-leo-rebound-generated-raw.png`; source/atlas hashes in `tools/generate-art/j115-leo-rebound5-provenance.json`.
- Atlas: `public/assets/animation/leo-rebound-right.webp`; layout: `tools/generate-art/leo-rebound5-layouts.json`.
- Packer/cleanup: `tools/generate-art/package-leo-action5.py`; isolates five original body components and leaves the sixth cell transparent.
- Verbatim prompt: `tools/generate-art/j115-leo-rebound5-prompt.md`; no rejected source.

Accepted Leo-specific separate ball track: height `[1.1,1.55,2.25,1.85,1.25]`; forward `[5,7,10,4.5,4.5]`. The ball meets Leo’s empty hands at frame3/tick5 and follows the pull-down into frame4 at tick7. Attempt01 was rejected after native capture showed the ball too high and forward at the catch and too far forward on the recovery hold. Attempt02 passes independent Jam Stage review in both facings at100%/120% zoom. Deterministic simulation confirms the loose ball remains unowned through tick4 and transfers to Leo alone at tick5. The track remains separate from the art.

The source/packed light and dark proofs are `tools/generate-art/previews/leo-rebound-atlas-light.png` and `tools/generate-art/previews/leo-rebound-atlas-dark.png`. All 32 attempt01/02 captures and exact track trials are retained under `tools/generate-art/previews/leo-rebound-track-candidate/` and indexed in `tools/generate-art/j115-leo-rebound-track-trials.json`.
