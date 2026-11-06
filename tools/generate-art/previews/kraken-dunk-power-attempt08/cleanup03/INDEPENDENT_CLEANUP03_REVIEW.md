# Kraken dunk-power attempt08 cleanup03 — independent review

**Verdict: detached-fragment cleanup passes; art remains a candidate only.** The four affected cells now contain just their primary figure. The removed pixels were detached pieces, not connected hands or feet. The pixel-style concern is only partly improved, and several figures sit above the declared baseline after the fragments are removed.

## Findings

- The atlas is a transparent, binary-alpha 400×288 image with 15 unique 80×96 frames and `baselineY: 92`. Connected-component review finds exactly one visible component in every cell. The small pieces previously seen in frames 3, 4, 5 and 9 are gone; light/dark previews show no remaining detached specks. Comparing with cleanup02, the operation removes only those isolated pixels (15, 53, 23 and 29 pixels, respectively). The main head, hands, legs and shoes remain intact.
- Cell margins are otherwise usable: left/right 10–39 px, top 8–20 px. However, after the isolated pixels are removed, frames 3, 4, 5 and 9 have 9, 11, 9 and 9 px of bottom cell margin instead of 4 px. Their primary silhouettes end 5–7 px above the declared baselineY92. This is plausible for airborne frame 9, but the plant/load beats (frames 4–5) need baseline alignment review before gameplay trials.
- The 15 poses are distinct, and the order still reads as approach, gather, plant/load, takeoff/ascent, peak, downward action, follow-through, landing and recovery. Identity and complete anatomy remain intact; no ball is baked in.
- Nearest-neighbor resizing and the shared 24-color palette make the edges blocky and remove soft alpha halos. They do **not fully resolve style**: the downscaled muscle/clothing gradients turn into noisy, muddy clusters rather than the intentional pixel groupings in Kraken's production sprite. Treat it as pose/track reference, not production art.
- **Layout report needs a provenance update:** `cleanup-layout-report.json` does not mention the new `<64` detached-component removal step, although cleanup03 differs from cleanup02 by exactly those removals.

No production files were changed.
