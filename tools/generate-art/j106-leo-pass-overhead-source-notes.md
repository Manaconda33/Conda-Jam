# J.106 — Leo overhead-pass source notes

Six complete right-facing poses show a measured gather, two-hand overhead raise, tick-5 lob release, follow-through and recovery. Leo keeps pale skin, long wavy black hair, refined mustache, adult human anatomy, composed expression and black/crimson kit.

- Accepted generation: `exec-e1a09303-9223-46f6-9ecd-e832e2f48083`, 2026-10-24; canon K.05.
- Raw sheet: `tools/generate-art/sources/j106-leo-pass-overhead-generated-raw.png`; SHA-256 is in `tools/generate-art/j106-leo-pass-overhead6-provenance.json`.
- Atlas: `public/assets/animation/leo-pass-overhead-right.webp`; layout `tools/generate-art/leo-pass-overhead6-layouts.json`.
- Packer/cleanup: `tools/generate-art/package-leo-action6.py` isolates six original bodies and records their crops without drawing or duplicating poses.
- Verbatim prompt: `tools/generate-art/j106-leo-pass-overhead6-prompt.md`. No rejected generation was used.

Accepted Leo-specific separate track: height `[1.1,2.3,2.3,2.7,3.2,1.25]`; forward `[4.5,4.8,4.7,6.5,7,7]`. Runtime preserves the canonical overhead-pass release frame3/tick7. The original generation prompt says tick5; this discrepancy is explicitly documented and was not used to change gameplay timing. Attempt08 passed production Jam Stage review at100%/120%, in both facings, and deterministic possession/release simulation tests. Track trials and causes are in `leo-pass-overhead-track-review.md`.
