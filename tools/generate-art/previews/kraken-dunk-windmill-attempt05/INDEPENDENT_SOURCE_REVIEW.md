# Independent source review — Kraken dunk-windmill attempt05

**Verdict: accept for component-based cleanup and candidate gameplay trials only.** Do not register the raw sheet.

## Provenance and alpha

- Exact prompt: `tools/generate-art/kraken-dunk-windmill-attempt05-imagegen-prompt.txt`; generation ID `exec-d84a3f6d-12ba-4593-a17a-e0a3e683c916`.
- Raw hash `133b9f5a4f02144ee2c8211aa6fdacb122afb00be3930b9e093d20fcd87f3eff` matches attempt05 provenance.
- The PNG is 1536×1024 RGBA. Blank gutters are truly transparent (alpha 0), but the raw range is 0–254 with 564,844 partial-alpha pixels and no fully opaque pixels. Binary-alpha cleanup is required. The apparent brown fill in image previews is the viewer composite; it is not present in transparent pixels. No broad red halo is visible.

## Figures, layout, identity, and action

- At an alpha threshold of 64, the sheet separates into exactly 15 components, five in each of three source-row bands. All 15 are complete full-body Kraken poses; no figure touches the canvas edge or loses a hand, limb, ear, or shoe. The nominal canvas is not evenly divisible into 5×3, and some component bounds cross nominal cell boundaries, so fixed cell crops could clip artwork. Component extraction and row-major repacking are appropriate.
- Identity and anatomy remain consistent: pointed ears, auburn hair, warm skin, copper pendant, burgundy/copper uniform, socks and burgundy shoes. No extra limbs or ball/hoop are visible.
- The action reads as approach, load, takeoff, arm sweep behind the body, horizontal extension, shoulder pass, raised arc, forceful low strike, follow-through, landing and recovery. Frames7–12 are sequential and not exact duplicates; the two raised-arm poses immediately before the strike are somewhat similar, so preserve and inspect their distinction after reduction. The strike is lowered before descent.
- Raw shading is softly illustrated/antialiased rather than crisp pixel art. Use binary alpha, a shared limited palette, nearest-neighbor scaling and component-aware packing, then review the light/dark proofs. Do not invent or redraw poses.

The source is suitable for cleanup and candidate gameplay testing only. Final cleanup still needs its own anatomy/margin/style review and the separate Kraken ball-track must be calibrated in both facings and zooms.
