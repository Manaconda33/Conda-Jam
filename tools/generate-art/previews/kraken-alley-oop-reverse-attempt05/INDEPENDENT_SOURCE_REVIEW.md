# Independent source review — Kraken alley-oop reverse, attempt 05

**Verdict: the reverse-dunk silhouette is closer, but the raw sheet is not ready for gameplay use.** Frame 12 now places a hand below the crown and behind the torso, but the back-facing pose appears to use the left hand for that action while the right arm is raised; the prompt specifies the opposite. The raw sheet also misses its hard-alpha, pixel style, and size/margin requirements.

## Provenance and uniqueness

- Prompt: `tools/generate-art/kraken-alley-oop-reverse-attempt05-imagegen-prompt.txt`
- Prompt SHA-256: `d9b4bbc0043526d73dfbdc86d4a8f3f91f53a602173782a4aef0d3ebf3286d8f` (matches provenance)
- Raw source: `tools/generate-art/sources/kraken-alley-oop-reverse-attempt05-generated-raw.png`
- Raw SHA-256: `081e75e24918c758344d68f07580bb7df384627ec921057beec1cd00c93e6bf7` (matches provenance)
- Generation ID: `exec-a047bb4f-a706-469c-887b-218e06c069de` (appears only in attempt05 provenance)
- Raw hash appears only in this Kraken generated-raw source among those checked.
- Image properties: PNG, 1536×1024 RGBA.

## Findings

- **Alpha/background:** Empty regions are transparent. But 485,908 pixels have partial alpha (values 1–254), and none are fully opaque. Faint nonzero-alpha traces touch cell boundaries in many cells. This conflicts with the prompt’s fully transparent gaps and opaque pixel edges.
- **Count/anatomy/identity:** There are exactly 15 row-major full-body figures. Heads, torsos, arms/hands, legs, and shoes are visible. Hair, pointed ears, copper amulet, warm skin, burgundy/copper uniform, dark socks, and burgundy shoes remain consistent. No obvious missing/extra limbs.
- **Margins and scale:** The sheet does not meet the specified maximum of 65% cell width and 75% cell height for all figures. At alpha ≥128, pose 8 occupies about 85% of its cell width and 90% of its height; pose 9 occupies about 88% width and 95% height. Several other poses are similarly oversized. High-alpha silhouettes also touch or nearly touch boundaries (for example, pose 4 reaches the bottom, pose 7 reaches the right edge, and pose 8 reaches the left edge). Faint alpha extends to more cell edges.
- **Frame 12/reverse-dunk read:** The pose is back-facing and airborne; one hand is visibly down at hip/waist height behind the lower torso while the other arm counterbalances upward. This is a meaningful improvement and does read as a reverse dunk finish in silhouette. However, the low hand appears to be Kraken’s left hand in the back view, while the right arm is raised; the prompt explicitly assigns the low far-side dunk to the right arm and the raised counterbalance to the left. The action is close but not fully prompt-compliant.
- **Other action beats:** The sequence has 15 distinguishable poses. Poses 10 and 11 keep a hand near the head/ear with different torso and balance positions; pose 12 lowers a hand behind the body, making the height progression visible. The approach, takeoff, descent, and recovery are broadly readable.
- **Pixel style:** The outlines have some pixel-like steps, but the rendering is detailed and softly shaded, with extensive semitransparent edges rather than chunky flat clusters and a hard limited palette. A cleanup would be needed before gameplay use.

Review is limited to the raw source, exact prompt, and provenance. No cleanup or production registration was performed.
