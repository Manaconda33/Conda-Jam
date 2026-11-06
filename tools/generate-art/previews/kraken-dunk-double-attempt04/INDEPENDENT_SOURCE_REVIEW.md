# Independent source review — Kraken dunk-double attempt04

**Decision: accept for careful component-based cleanup and candidate gameplay trials only.** The action and identity are viable; fixed-cell packing and raw rendering are not acceptable as-is.

## Provenance and alpha

- Raw: `tools/generate-art/sources/kraken-dunk-double-attempt04-generated-raw.png`
- SHA-256: `8a582d128de208c2dc6fb5b10063e463dd978e6baef9f99d5e04b08cb49a17a4`, matching provenance.
- Generation ID: `exec-082755a3-2ba2-4385-b10c-5cd7664f98f7`.
- Prompt SHA-256: `4f8d9ac117aca5dacfadb6b3055757563d5ee6b3a08c16f21077c1b14ca7d072`.
- Dimensions: 1536×1024 RGBA. Blank inter-cell samples have alpha 0 and the sheet separates into 15 large components; no ball or hoop is present. No figure touches the outside canvas. The raw alpha range is 0–254, with 610,630 partial-alpha pixels and no fully opaque pixels, so thresholding/binary-alpha cleanup is required. Transparent areas contain hidden warm RGB that should remain untouched behind alpha 0.

## Pose, anatomy, and identity

- All 15 full-body poses are visually distinct and Kraken's identity is consistent: auburn hair, pointed ears, warm skin, copper pendant, burgundy/copper uniform, dark socks and shoes. Hands, limbs and footwear are attached and readable; I see no duplicated anatomy.
- The double-pump sequence is clear: approach/gather/load, leap, first two-hand rise, recoil to chest, second higher rise, forceful downstroke, lower follow-through, descent, landing and upright recovery. The first pump, recoil, second pump, and strike are visibly different silhouettes; the slam does not remain overhead.
- No pose sheet tells a full gameplay story by itself, but the requested action order is present and suitable for timing review after cleanup.

## Layout and style

- The 1536×1024 canvas does not divide evenly into 5×3 cells. Several upper-row figures cross nominal column boundaries, and a few figures touch the nominal row starts. Fixed 5×3 crops would clip source pixels. The figures are separate enough for component extraction and row-major sorting, followed by common-scale packing and baseline alignment.
- The raw image has smooth shading and antialiased edge pixels rather than hard square pixel clusters. It has no conspicuous bright red halo. A shared limited palette, nearest-neighbor scaling, and binary alpha could make a useful pixel-art derivative, but that derivative must be visually checked against the source to ensure it preserves fingers, ears and shoes.

## Recommendation

Proceed with component-based cleanup only. Preserve the raw source, record each extracted component and any discarded residue, fit 15 poses to common production cells with safe margins and baseline, then review light/dark proofs and native captures before considering further use. This review does not approve registration.
