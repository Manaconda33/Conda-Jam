# J.107 — Leo behind-the-back pass source notes

Six distinct right-facing poses show a composed gather, deceptive shoulder turn, low behind-the-back release, follow-through and recovery. Leo remains a pale adult human with long wavy black hair, refined mustache, black/crimson uniform and natural anatomy.

- Accepted generation: `exec-2ff99ab9-fa21-4f68-882c-76c419637383`, 2026-10-24; canon K.05.
- Raw: `tools/generate-art/sources/j107-leo-pass-behind-generated-raw.png`; hash is recorded in `tools/generate-art/j107-leo-pass-behind6-provenance.json`.
- Atlas: `public/assets/animation/leo-pass-behind-right.webp`; layout: `tools/generate-art/leo-pass-behind6-layouts.json`.
- Shared component-isolation wrapper: `tools/generate-art/package-leo-action6.py`; it packs the six original poses without drawing or duplicating frames.
- Verbatim prompt: `tools/generate-art/j107-leo-pass-behind6-prompt.md`. No rejected generation was used.

Accepted Leo-specific track: height `[1.6,1.05,1.2,1.6,1.1,1]`; forward `[4,2,-6,-10,-10,3]`. Canonical runtime release is frame3/tick7. The prompt says tick5; this is documented without changing gameplay timing. Attempt04 passes native Jam Stage review at100%/120% in both facings and deterministic release/ownership tests. Trial history is in `leo-pass-behind-track-review.md`.
