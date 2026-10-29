# Independent source review — Kraken `dunk-360`, attempt01

**Verdict: reject as a production source. The raw contains 15 main figures and real alpha, but its facing sequence breaks continuity, its dunk poses do not read clearly, cell margins are weak, and its shading misses the pixel-art requirement. Preserve raw and provenance; do not clean, pack, or register this attempt.**

## Provenance and hashes

- Raw: `tools/generate-art/sources/kraken-dunk-360-attempt01-generated-raw.png`, 1536×1024 RGBA.
- Generation ID: `exec-f7cd3f90-01ed-4d47-b1f5-72fa707539ca` (`2026-10-29T04:59:00Z`).
- Raw SHA-256 `2034e538b642e7d2eaa3e6591cf03b7da39b403eb711d3fb8ba78dba61286bc4` matches provenance.
- Exact prompt SHA-256 `f8ff4674a9fc66eb7ce0de25b9549b668ed802f7e559ce091babacd54535eadb` matches provenance.

## Findings

- **Alpha/backdrop: partial pass.** The image has real RGBA transparency: 989,439 pixels are alpha 0, 583,425 partially transparent, and none are alpha 255. The brown field shown in some viewers is hidden RGB beneath zero alpha rather than a visible opaque backdrop. Every alpha-zero pixel carries nonblack RGB, so filtered resampling could bleed brown into outlines. At alpha≥64 there are exactly 15 major sprite components; at alpha≥1 there are 2,063 total components, including 2,051 small fragments. The transparent background is real, but the numerous low-alpha edge fragments and hidden RGB are not clean sprite edges.
- **Pose count and full anatomy: gross pass.** Fifteen full-body figures are visible in the intended 5×3 order. Kraken's auburn hair, elf ears, warm skin, amulet, burgundy uniform with copper trim, socks and shoes remain broadly consistent. Bodies and limbs appear complete, with no extra figures or basketball. The bottom-row landing and recovery silhouettes are distinct.
- **Turn continuity: fail.** The front/side/back turns are visible early, but the middle row breaks the intended continuous 360-degree rotation. Frames 8–10 switch from a near-front/three-quarter view (frame8), to a clear back view (frame9), then back toward a near-front view with an arm raised (frame10). The sequence jumps orientation instead of progressing smoothly from adjacent poses. This breaks the central action requested.
- **Dunk/recovery distinctness: fail.** Frames 11 and 12 show raised/extended arms but do not clearly depict the dunk extension and follow-through as different action phases. They read more like overhead reaches, with no clear downward slam. Frames 13–15 transition into crouch/landing/recovery, though the dunk event itself remains ambiguous. The README summary's action concern is confirmed.
- **Cell separation and margins: partial/fail.** A 1536×1024 5×3 layout gives nominal cells about 307×341 px. Fifteen main figures are separated at alpha≥64, but several approach or cross implied boundaries: the first-column sprites reach x≈320–321 past the x≈307 boundary, another lower-row figure reaches x≈621 past x≈614, and row-boundary figures begin as close as y≈335 against the y≈341 seam. This does not provide safe, generous gutters for straightforward cell extraction.
- **Pixel-art quality and fringe: fail.** The sprites use blended painterly shading and soft ramps rather than crisp pixel clusters and discrete color steps. Red/orange edge coloration and many semi-transparent fragments remain around silhouettes. Scaling cannot change the underlying rendering style, and aggressive thresholding risks eroding the dark outlines.

## Recommendation

Keep this as rejected source evidence only. Do not spend cleanup effort on an atlas or ball track for this attempt: the facing discontinuity and unclear dunk action require redrawn poses, while the source style also misses the required game-pixel look. A future attempt should preserve the early turn sequence, show every intermediate facing from back through opposite profile to the starting direction without jumps, and clearly separate dunk extension from follow-through before landing. Keep the ball on a separate athlete-specific track.
