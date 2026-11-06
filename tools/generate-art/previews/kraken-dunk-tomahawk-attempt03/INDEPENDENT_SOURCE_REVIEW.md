# Independent source review — Kraken dunk-tomahawk attempt03

**Decision: reject this raw source; do not begin cleanup or registration.** The background is not transparent, and the requested strike beat is delayed/repeated overhead.

## Provenance

- Raw: `tools/generate-art/sources/kraken-dunk-tomahawk-attempt03-generated-raw.png`
- SHA-256: `4715b66dc3085c531edd75f854e42287572db85011c00f59d4ee9d6e9c317dfa`, matching provenance.
- Generation ID: `exec-f0ea6a36-ba5f-4fcf-8aff-b381c9941689`.
- Prompt SHA-256: `04bdcc3797807ecb2b17c4d7cd16749828996bd4fab866ab31b0782cbf2f6978`, matching the saved prompt.
- Dimensions: 1536×1024 RGBA.

## Findings

- The canvas has alpha range 0–254, with 514,994 partially transparent pixels and no fully opaque pixels. The preview shows a broad brown vignette behind the sprites; it is encoded as widespread partial alpha, not an empty transparent background. Sampled background pixels also have nonzero alpha (for example, (100,100) alpha=1). This cannot be treated as clean transparent source art without a substantial background extraction pass that risks damaging the antialiased figure edges.
- Fifteen figures are visible and broadly consistent as Kraken: auburn hair, pointed ears, warm skin, copper pendant, burgundy/copper uniform, dark socks and burgundy shoes. Bodies and limbs are generally complete; no ball or hoop is baked in. The rendering has a hard pixel-outline aesthetic, although the shaded gradients and softened edges do not meet the prompt's strict 16-color, no-gradient arcade pixel-art requirement.
- The 1536×1024 canvas does not divide evenly into a 5×3 grid, and the background bridges the cells, so the requested strict separated cell geometry cannot be verified or safely cropped from this raw sheet.
- The tomahawk arc is incomplete at the required beats. Frames 8–9 move from a bent arm behind the crown to raised overhead, but frame 10 remains another high overhead pose. The first unmistakable below-head downstroke appears in frame 11, one beat late; frame 11 also does not clearly separate into the requested extended below-shoulder follow-through. The arc therefore repeats overhead and compresses strike/follow-through.

## Recommendation

Preserve as rejected. Regenerate with an actually empty alpha channel outside hard-edged figures, a canvas divisible into equal 5×3 cells with transparent gutters, and the frame 10 hand clearly below the head followed by a distinct frame 11 extended below the shoulder. Keep the current Kraken kit and broad body action, but remove the vignette and gradients.
