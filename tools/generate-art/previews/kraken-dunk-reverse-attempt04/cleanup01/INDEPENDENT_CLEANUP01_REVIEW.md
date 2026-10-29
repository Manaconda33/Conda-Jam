# Independent cleanup01 review — Kraken dunk reverse, attempt 04

**Verdict: cleanup01 is a viable gameplay candidate for visual review.** It preserves 15 distinct complete poses, fixes the raw alpha/edge problems, aligns to a common baseline, and retains a readable reverse-dunk arc. The individual side margins are narrow in a few cells but no figure is clipped.

## Provenance and inspected assets

- Cleanup layout report names `tools/generate-art/sources/kraken-dunk-reverse-attempt04-generated-raw.png` with SHA-256 `0f4199b0dfc401f0004d077266c3d3211465d7e628ec57dacecf340d4fe19e50`, matching the raw source.
- The attempt04 provenance file SHA-256 is `87401076fc6a4e8411e7b844ef49002ae249db721279c081fff67aaf720935bf`.
- Inspected the cleanup atlas plus light and dark previews, and compared scale with the existing `public/assets/animation/kraken-idle-right.webp`.
- Atlas is 400×288 RGBA with 80×96 cells. Light/dark previews are opaque composites for contrast checks.

## Findings

- **Poses/anatomy:** The layout report records 15 poses and 15 unique normalized frame hashes. Visual inspection confirms distinct full-body frames with heads, torsos, arms/hands, legs and shoes present. Cleanup does not visibly clip limbs or remove a meaningful part of a pose. Kraken’s auburn hair, pointed ears, warm skin, copper pendant, burgundy/copper uniform, socks and shoes stay recognizable across front, side and back views.
- **Scale vs idle:** The idle sheet’s visible sprites are about 61–64 px tall in 80×64 cells. Cleanup sprites are 51–81 px tall in 80×96 cells, with a median of about 68 px. At the atlas’s native pixel scale, overall size is close to idle, though the inverted/action poses vary more in height as expected.
- **Margins and baseline:** All figures fit within their 80×96 cells. The layout report aligns visible alpha bounds to baselineY=92 and leaves 4 px below. Side margins range from 6 to 41 px; most are comfortable, while the tightest (6–8 px) cells leave limited horizontal breathing room. Top margins range from 8 to 41 px. No visible cross-cell overlap or clipping in the atlas/previews.
- **Alpha and palette:** The atlas has binary alpha (0/255) with transparent gutters. It uses one shared 16-color visible palette, 16 colors per frame, nearest-neighbor scaling, and hard pixel edges. Light and dark previews show no obvious matte fringe, halo, checker artifact, or background contamination.
- **Reverse-dunk action:** Frames 8–11 remain distinct: inverted apex, further rotation with cocked arm, downward dunk extension, and a separate extended follow-through. The direction of the arm sweep reads toward an imaginary rim; the ball can remain a separate gameplay track. Frame 12 begins the fall in a visibly different pose.

Review covers the attempt04 cleanup atlas, both contrast previews, and the cleanup layout report. Nothing was registered or changed in production.
