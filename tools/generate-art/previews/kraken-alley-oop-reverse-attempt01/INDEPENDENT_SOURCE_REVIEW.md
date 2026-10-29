# Independent source review — Kraken `alley-oop-reverse`, attempt01

**Verdict: reject as a production source. Real alpha and 15 grossly complete poses are present, but the reverse-catch/transfer beats are weakly distinguished, silhouettes cross cell margins, edges carry fringe, and the art is painterly rather than pixel art. Preserve raw and provenance; do not pack or register.**

## Source and prompt verification

- Raw: `tools/generate-art/sources/kraken-alley-oop-reverse-attempt01-generated-raw.png`, 1536×1024 RGBA.
- Generation ID: `exec-a6016418-9be9-44bb-b515-e059a85489ff` (`2026-10-29T04:53:00Z`).
- Raw SHA-256 `31ecc2823309d4e5da7e3301151ebac64536f17c77662bc7d7335c1c4c8e45af` matches provenance.
- Exact prompt SHA-256 `bee5558e49f9508d6481ff94d5721488ba9c4fef2b6451bfb90f17d2d961e260` matches provenance.

## Findings

- **True alpha/backdrop: partial pass.** Alpha is 0–254, with 1,022,819 zero-alpha pixels, 550,045 partially transparent pixels and no alpha-255 pixels. The brown field visible in some image previews is RGB under zero-alpha pixels, not an opaque backdrop. At alpha≥64 there are exactly 15 main sprite components. At alpha≥1 there are 6,632 components, including 6,612 small low-alpha fragments, so a threshold-aware cleanup would be required. Every zero-alpha pixel contains nonblack hidden RGB; filtering could pull brown/red edge color into the sprite. A red/yellow halo is visible around many contours.
- **Pose count and full anatomy: gross pass.** Fifteen figures appear in the requested 5×3, row-major arrangement. Heads, pointed ears, arms, hands, legs and shoes are generally visible; no obvious extra or missing limb. The repeated auburn hair, warm skin, copper amulet and burgundy/copper kit preserve Kraken's identity through the backward-facing poses. No basketball or extra prop is visible.
- **Alley-oop reverse sequence: partial.** The sheet communicates ready/look-back, pivot/run, airborne rotation and back-facing poses. Frame10's hands are placed behind/above the head, appropriate for an imaginary catch, and frame12 extends one arm overhead as a possible reverse finish. However frames10 and11 are very similar hands-behind-head silhouettes. Their difference does not clearly show the catch followed by secure transfer/control of an imaginary pass. The reverse finish pose also reads as a raised reach, not an unmistakable reverse dunk extension. The separate ball would help during gameplay, but cannot establish missing pose distinctions in this source sheet.
- **Cell separation and margins: fail.** Nominal 5×3 cells are about 307×341 px. Several poses do not stay in their assigned cells. For example, row2/column4 extends to x=1244 past the x≈1229 boundary; row1/column4 ends only about 8 px before that boundary; row3/column1 starts about 19 px above its row boundary. Other figures approach their column edges. The overall grid is recognizable, but generous safe gutters and cell-contained silhouettes are not consistently present.
- **Pixel-art style: fail.** The character shading is smoothly blended with antialiased edges rather than discrete hard-edged pixel clusters. Red/yellow fringe further softens the outline. The prompt calls for crisp retro game sprites with a limited palette; cleanup and nearest-neighbor scaling cannot correct the underlying painted rendering.

## Recommendation

Preserve the raw as rejected source material. It can inform the choreography of turning back, catching behind the head and reaching for a reverse finish, but it is not a cleanup-ready runtime atlas. A new source needs visibly different catch and secure/transfer frames, a clearly reverse-directed finish pose, true clean alpha gutters with figures contained in their cells, and actual low-resolution pixel art. Keep the basketball on its separate athlete-specific track.
