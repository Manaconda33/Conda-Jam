# Independent source review — Kraken dunk reverse, attempt 02

**Verdict: reject as a gameplay source candidate.** The sheet contains 15 complete, recognizable Kraken sprites in a 5×3 layout, but the required inverted apex and forceful reverse-dunk extension are missing or assigned to the wrong beats. Alpha edges and cell spacing also miss the prompt’s hard-edge/wide-gutter requirements.

## Prompt and source integrity

- Prompt: `tools/generate-art/kraken-dunk-reverse-attempt02-imagegen-prompt.txt`
- Prompt SHA-256: `5b4412f0de1c0b57c48b6ce854a355159d2eb5d0442a8bcc70a199627d6735f1` (matches provenance)
- Raw source: `tools/generate-art/sources/kraken-dunk-reverse-attempt02-generated-raw.png`
- Raw SHA-256: `3792c883603269d3fd5f4a79fb6dc13c930262aa1e8473b0b6964e26ce8dc769` (matches provenance)
- Image: PNG, 1536×1024 RGBA.
- **Duplicate source finding:** This raw hash and the provenance `generationId` (`exec-c94e4e32-b34b-431b-86b6-5d53ae74ca3b`) exactly match Kraken alley-oop-reverse attempt03. The source is byte-for-byte the same image, despite the different clip prompt and attempt label. This also explains why the requested reverse-dunk poses are not present in this source.

## Findings

- **Alpha/background:** The empty areas and corners are genuinely transparent (925,081 alpha-zero pixels); no ball, hoop, court, or text is visible. However, 647,783 pixels are partially transparent (alpha 1–254), and none are fully opaque (max alpha 254). The soft edge pixels conflict with the prompt’s crisp, hard-edged sprite requirement.
- **Cell containment/margins:** There are 15 row-major figures, broadly aligned to 5×3 cells. Using alpha ≥128 silhouette bounds, poses 3 and 4 reach the bottom edge of the first row; pose 7 reaches the right edge of its cell; pose 8 reaches both the top and left edges of its cell. Several other margins are narrow, so the requested wide transparent gutters are not met. The figures remain recognizable and are not substantially clipped.
- **Anatomy/identity:** All 15 figures read as full body, with head, torso, both arms/hands, both legs and shoes present. Kraken’s auburn hair, pointed ears, warm skin, copper amulet and burgundy/copper uniform remain broadly consistent. No obvious missing or extra limbs; rear views naturally hide some facial details.
- **Reverse-dunk action and pose distinction:** The first poses broadly read as approach, pivot, run, gather and load. Pose 8 (row 2, column 3) is a back-facing airborne pose with bent legs, not the requested inverted apex with both legs high. Pose 9 has one hand raised and could serve as a cocked-arm apex. Pose 10 is a bent-arm, one-arm-out pose rather than a forceful down-sweeping dunk extension. Pose 11 has both hands behind the head/nape, reading more like control than an extended follow-through. Pose 12 leans diagonally down with one arm out and one down, but does not repair the missing frame-10 dunk beat. The sequence does not clearly show the requested reverse dunk.
- **Pixel-art style:** The figures have dark outlines and some pixel-like contours, but use soft/antialiased edges, extensive partial alpha and detailed smooth shading rather than hard square clusters with a compact palette. This misses the strict pixel-art specification.

Review is limited to the raw source, exact prompt and provenance. No cleanup or production registration was performed.
