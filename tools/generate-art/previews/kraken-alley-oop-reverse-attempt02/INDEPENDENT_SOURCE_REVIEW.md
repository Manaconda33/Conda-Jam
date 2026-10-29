# Independent source review — Kraken alley-oop reverse, attempt 02

**Verdict: reject as a source candidate for the requested sequence.** The sheet has 15 recognizable, complete poses and a transparent alpha channel, but the critical reverse catch/control/dunk beat is not sufficiently distinct or correctly directed. The layout also has a couple of cell-edge violations, and the rendering is softer than the requested hard-edged pixel art.

## Provenance and integrity

- Prompt: `tools/generate-art/kraken-alley-oop-reverse-attempt02-imagegen-prompt.txt`
- Prompt SHA-256: `5272242a3a4f5d4d2744a26c1b0fc6b4e28e7fec0cd8b3c29768bebb8e78cb1e` (matches provenance)
- Raw source: `tools/generate-art/sources/kraken-alley-oop-reverse-attempt02-generated-raw.png`
- Raw SHA-256: `c74b7ceb3469701581979433a6cc7bbad295cc140398e8683d8fda7382399f0a` (matches provenance)
- Image properties: PNG, 1536×1024, RGBA; provenance records fresh ImageGen generation with `transparent_background=true`.

## Findings

- **Background/alpha:** Alpha is genuinely transparent in the empty regions (1,077,357 fully transparent pixels, including all corners); there is no visible court, hoop, ball, or label in the figures. However, 495,507 pixels have partial alpha (values 1–254), and no pixel reaches alpha 255. This is a very soft/antialiased alpha treatment for the requested crisp, hard-edged pixel art.
- **Count, anatomy, identity:** The row-major sheet contains exactly 15 figures. Each reads as a full body with head, torso, two arms/hands, two legs, and two shoes. Visible front/side poses retain Kraken’s auburn hair, pointed ears, burgundy-and-copper uniform, and amulet; rear-facing poses necessarily show less of the face and amulet, but the hair and uniform remain consistent. No obvious missing-limb or extra-limb error.
- **Cell placement/margins:** The figures mostly stay in their 5×3 cells, and all 15 poses are recognizable. But pose 9’s alpha silhouette reaches the left edge of its fourth-column cell, and pose 13 is only about 3 px below its row’s top edge and about 13 px from the cell’s right edge (using alpha ≥128). Those violate the requested safe margins. Other poses have reasonable separation.
- **Poses 9–12:** Pose 9 is a one-arm-back reach; pose 10 brings both hands overhead; pose 11 is nearly the same overhead hands-together silhouette as pose 10, so secure control does not read as a distinct beat. Pose 12 extends both arms diagonally up and away, reading more like an overhead release/follow-through than a reverse dunk extension behind and down across the back of the head. The key catch → secure control → reverse dunk progression is therefore not clear.
- **Style/artifacts:** Shapes and outlines have a pixel-art look, but the sheet uses many partially transparent edge pixels and a soft, high-detail finish rather than consistently crisp square clusters and hard edges. I did not observe stray props or text.

Review is limited to the raw source and recorded prompt/provenance. No cleanup or production registration was performed.
