# Independent source review — Kraken alley-oop reverse, attempt 04

**Verdict: reject as a gameplay source candidate.** The sheet has 15 complete poses and a broadly coherent sequence, but pose 12 misses the explicit far-side, behind-the-back reverse-dunk direction. The raw source also has soft alpha edges and insufficient cell margins.

## Provenance and uniqueness

- Prompt: `tools/generate-art/kraken-alley-oop-reverse-attempt04-imagegen-prompt.txt`
- Prompt SHA-256: `2f0f20b38d51f0e969c218d767d6bbea8f231fe3546e6a9db69ede0918baa3be` (matches provenance)
- Raw source: `tools/generate-art/sources/kraken-alley-oop-reverse-attempt04-generated-raw.png`
- Raw SHA-256: `6e84f3a2913b734c76ca335bbce7f87106610f4afde1e60a4bf6fd97d953bc11` (matches provenance)
- Generation ID: `exec-4aae8e00-bf50-476a-b6c9-c140f7909095` (appears only in attempt04 provenance)
- The raw hash is unique among the Kraken sources checked, including alley-oop-reverse attempts 01–03 and the other Kraken raw sprites.
- Image properties: PNG, 1536×1024 RGBA.

## Findings

- **Transparency/alpha:** Empty areas and corners are transparent. However, 543,332 pixels have partial alpha (values 1–254), and none are fully opaque. Faint nonzero-alpha traces reach cell borders; the raw alpha is not hard-edged or cleanly isolated to the figures.
- **Cell margins:** There are exactly 15 row-major figures, each mostly recognizable inside its nominal 5×3 cell. But the prompt’s clear margin on every side is not achieved. At alpha ≥128, pose 4 touches the right edge of its cell, pose 5 touches the left edge, pose 9 comes within 1 px of the right edge, and pose 11 leaves only 4 px on its right. Many other margins are below the requested 8% (about 25 px horizontally and 27 px vertically). At alpha >0, faint traces reach the boundaries of many cells.
- **Anatomy/identity:** All frames read as full body with head, torso, two arms/hands, two legs and shoes. Kraken’s warm skin, auburn hair, pointed ears, copper amulet, burgundy/copper uniform, dark socks, and shoes are consistent. No obvious extra or missing limbs.
- **Poses 9–12:** Pose 9 reads as a one-hand reach behind the crown with the other arm balancing. Pose 10 is a separate catch-like pose with one hand behind the head and the other arm out. Pose 11 turns the torso and brings a bent arm beside the head/shoulder, reading as control. Pose 12 is also a distinct back-facing airborne silhouette, but its bent hand remains above the crown while the opposite arm reaches outward/down. It does not show the specified dunking hand below and behind the crown at the far side of the body. Viewed alone, it reads more like another overhead reach or generic aerial turn than a forceful reverse dunk. The ball being animated separately does not resolve this directional mismatch.
- **Pixel-art style:** Dark outlines and clustered colors suggest pixel art, but detailed smooth shading and extensive partial alpha create soft edges instead of crisp square clusters and hard opaque pixels. No text or props are visible.

Review is limited to the raw source, exact prompt, and provenance. No cleanup or production registration was performed.
