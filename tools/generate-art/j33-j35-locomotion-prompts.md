# J.33–J.35 supporting-athlete locomotion prompts

Prepared 2026-10-22 from the exact runtime cells documented in `j32-j35-reference-checkpoint.md`. These are generation prompts only; do not treat a prompt or reference crop as a completed sprite. The reference portrait and isolated gameplay crop for each named athlete are strict identity and proportion references. Names and franchise themes do not authorize fantasy or animal anatomy, unusual limbs, weapons or props. Generate each athlete independently.

Each accepted athlete needs42 unique authored drawings in this order: idle6, idle-ball4, dribble10, run11, dribble-run11. First generate and review a28-pose base, then generate a safe14-pose supplement using that athlete's accepted base. Never crop a touching, fused or clipped silhouette into multiple poses.

## J.33 — Emerald Den Wolves

The team palette is emerald, teal and gold. Both athletes are human as recorded by the runtime rigs; “Wolves” does not imply wolf features.

### Fern Howl — cell64, tall human woman

Identity lock: fair warm skin, dark eyes, abundant teal curls gathered high with a warm-colored tie, tall natural human athletic build. Preserve the face and hairline from `references/fern-howl-portrait-reference.png`, and the body scale and emerald/teal/gold uniform from `references/fern-howl-gameplay-reference.png`.

**Base prompt — exactly28 figures, 7 columns × 4 rows:**

> Create an original polished full-body 2D arcade basketball sprite sheet with exactly 28 separate complete drawings of the same adult human woman, arranged in 7 columns by 4 rows, strict row-major, on true transparent RGBA. Use the attached Fern Howl cell64 portrait and isolated gameplay crop as strict identity references. Preserve her fair warm skin, dark eyes, abundant teal curls gathered high with the same warm-colored tie, and tall natural human athletic proportions. Match the Emerald Den Wolves sleeveless emerald/teal basketball jersey and shorts with gold accents and matching court shoes shown in the reference. Keep Fern human; no wolf ears, muzzle, fur body, tail, claws, bows, arrows, fantasy features or props. Match the illustrated 1990s arcade sports style of the references.
>
> Give every full figure generous transparent gutters. Each silhouette must be complete and separate, with no touching, overlap, clipping or fused components. Keep all curls, hands, fingers and shoes in bounds. Hold the same three-quarter gameplay view, scale, anatomy and shared row baselines. Hands stay empty because the game draws the ball separately. No floor, shadow, labels, grid, checkerboard, border, panels, extra people, duplicate poses or mirrored copies.
>
> Row1: six distinct upright relaxed idle variations, then one upright ball-ready pose with an open empty right hand near waist height. Row2: seven distinct low stationary right-hand dribbles with bent knees and varied bounce phases. Row3: seven upright running strides with varied arms and legs. Row4: seven low forward dribble-run strides with forward lean, varied legs and low right-hand bounce phases.

**Safe supplement prompt — exactly14 figures, 7 columns × 2 rows:**

> Generate exactly 14 new complete full-body Fern Howl drawings on a wide transparent RGBA sheet, arranged 7 columns by 2 rows, strict row-major. Attach her exact cell64 portrait, isolated gameplay crop and accepted 28-pose base. Preserve the same fair warm skin, dark eyes, high gathered teal curls and warm tie, tall natural human athletic build and emerald/teal/gold uniform. Keep her human; no wolf features, bows, arrows, fantasy details, logo, writing, number, ball or props.
>
> Use wide transparent outer margins and generous gutters; draw each figure at about 55% of cell width and 60% of row height. Every silhouette must be separate, complete and in bounds, with no touching, clipping, overlap or fused components. Match the base camera, scale, anatomy and row baselines. Keep hands empty. No floor, shadow, checkerboard, grid, border, labels, panels, extra figures, duplicates or mirrored pose variants.
>
> Row1 cells0–2: three distinct upright ball-ready poses with open empty right hands near waist height. Cells3–6: four different upright run strides. Row2 cells0–2: three low stationary right-hand dribbles at distinct bounce phases. Cells3–6: four low forward dribble-run strides with changing legs and low right-hand bounce phases. Draw14 complete in-bounds poses.

### Koa Vale — cell65, compact human man

Identity lock: deep brown skin, dark eyes, close-cropped blue-black curls and the exact face details shown in the portrait. Preserve the compact natural human athletic proportions and emerald/teal/gold kit from the isolated gameplay reference. Do not infer any features beyond the two references.

**Base prompt — exactly28 figures, 7 columns × 4 rows:**

> Create an original polished full-body 2D arcade basketball sprite sheet with exactly 28 separate complete drawings of the same compact adult human man, arranged in 7 columns by 4 rows, strict row-major, on true transparent RGBA. Use the attached Koa Vale cell65 portrait and isolated gameplay crop as strict identity references. Preserve his deep brown skin, dark eyes, close-cropped blue-black curls, exact face details from the portrait and compact natural human athletic proportions from gameplay. Match the Emerald Den Wolves sleeveless emerald/teal basketball jersey and shorts with gold accents and matching court shoes shown in the reference. Keep Koa human; no wolf ears, muzzle, fur body, tail, claws, bows, arrows, fantasy features or props. Match the illustrated 1990s arcade sports style of the references.
>
> Give every full figure generous transparent gutters. Each silhouette must be complete and separate, with no touching, overlap, clipping or fused components. Keep hair, hands, fingers and shoes in bounds. Hold the same three-quarter gameplay view, compact scale, anatomy and shared row baselines. Hands stay empty because the game draws the ball separately. No floor, shadow, labels, grid, checkerboard, border, panels, extra people, duplicate poses or mirrored copies.
>
> Row1: six distinct upright relaxed idle variations, then one upright ball-ready pose with an open empty right hand near waist height. Row2: seven distinct low stationary right-hand dribbles with bent knees and varied bounce phases. Row3: seven upright running strides with varied arms and legs. Row4: seven low forward dribble-run strides with forward lean, varied legs and low right-hand bounce phases.

**Safe supplement prompt — exactly14 figures, 7 columns × 2 rows:**

> Generate exactly 14 new complete full-body Koa Vale drawings on a wide transparent RGBA sheet, arranged 7 columns by 2 rows, strict row-major. Attach his exact cell65 portrait, isolated gameplay crop and accepted 28-pose base. Preserve his deep brown skin, dark eyes, close-cropped blue-black curls, portrait-matched face, compact human athletic proportions and emerald/teal/gold uniform. Keep him human; no wolf features, bows, arrows, fantasy details, logo, writing, number, ball or props.
>
> Use wide transparent outer margins and generous gutters; draw each figure at about 55% of cell width and 60% of row height. Every silhouette must be separate, complete and in bounds, with no touching, clipping, overlap or fused components. Match the base camera, compact scale, anatomy and row baselines. Keep hands empty. No floor, shadow, checkerboard, grid, border, labels, panels, extra figures, duplicates or mirrored pose variants.
>
> Row1 cells0–2: three distinct upright ball-ready poses with open empty right hands near waist height. Cells3–6: four different upright run strides. Row2 cells0–2: three low stationary right-hand dribbles at distinct bounce phases. Cells3–6: four low forward dribble-run strides with changing legs and low right-hand bounce phases. Draw14 complete in-bounds poses.

### J.33 generation record

The accepted source pairs below passed the exact 28/14 connected-alpha and spacing checks. Their selected imagegen outputs, source hashes, maps and per-pose rectangles are recorded in the generated provenance and layout JSON. Both identities were visually compared to their exact cell64/65 portrait and gameplay crops; no wolf traits or equipment were added.

| Athlete | Generation | Source | SHA-256 | Review |
|---|---|---|---|---|
| Fern Howl | `exec-e4cc7078-9930-4a75-9514-9b4eab48b6b9` | `sources/fern-howl-locomotion-base.png` | `c3be1eb25041612f2cddf9a35e8d12aa07a2f1edc427cdf2200fd07fcafbe722` | Accepted: 28 separate; upright open-hand ready pose. |
| Fern Howl | `exec-2f0dc865-1c36-4e7d-94b1-7f764e2775a7` | `sources/fern-howl-locomotion-supplement-14.png` | `c194e85b2329030f3ed50261bd0ea042d9f19c7e24d432a20b6a3a7fea9246ae` | Accepted: 14 separate, in-bounds poses. |
| Koa Vale | `exec-2b0c986b-175b-4163-ad04-be4a5c59eb8f` | `sources/koa-vale-locomotion-base.png` | `b39c8c71f9a24842baf6d6f697be0fb695a6691b080b8b285a8321160430d2f1` | Accepted: 28 separate; upright, open-hand ready pose. |
| Koa Vale | `exec-a5418451-327b-4ad5-95e7-9eb655f9c51e` | `sources/koa-vale-locomotion-supplement-14.png` | `367e2bfa9676179bb78986c479be0fb695a6691b080b8b285a8321160430d2f1` | Accepted: 14 separate, in-bounds poses. |

Rejected candidates remain in `sources/` for audit and are never assembled: Fern base `exec-83475b09-f6aa-4f9f-b7f5-059fde379e4c` (`d4207f187e02bc08f003cfbdf1790ad1dab669309654a1c5de21bb4b70838bbf`) had only27 isolated figures; Fern base `exec-fbb0f095-ed73-49de-a5ca-d198d349d492` (`4e10e0332c822fde04ad8aed15162fc910dfd872ba4aa24be0fcf10327627583`) crouched in the ready cell; Fern supplement `exec-186f1621-b96f-47e5-b9a7-3bc894b61238` (`142a1f29f60ff924805c1cb271b53c9bd4c5eba45310ee6daebfb894e826123f`) failed the neighboring-figure overlap check. Koa base `exec-50f210ef-fcd0-417e-ba0c-fa2f241a4c8e` (`3536583490dbd683275467662cd301e74902e4ae9bbba957aeeee3670bb5c1be`) crouched in the ready cell; `exec-95a68bc5-f092-47a0-83cf-8536258106bd` (`f69c2c931ea5fb98d1d436c5f3dfa9fac41f08fa4b922610ee222a0cfa37136a`) lacked a clearly open ready hand; and `exec-44f934b9-5489-40fa-bfa1-5160ac095c7c` (`30900acbe1cfc743057488591ebbcdc42282e93ffadecd7ca993bf77f3e48b70`) fused figures, leaving26 components.

#### fern-howl-base

Exact selected generation prompt:

> Create an original polished full-body 2D arcade basketball sprite sheet with exactly 28 separate complete drawings of the same adult human woman, arranged in 7 columns by 4 rows, strict row-major, on true transparent RGBA. Use the attached Fern Howl cell64 portrait and isolated gameplay crop as strict identity references. Preserve her fair warm skin, dark eyes, abundant teal curls gathered high with the same warm-colored tie, and tall natural human athletic proportions. Match the Emerald Den Wolves sleeveless emerald/teal basketball jersey and shorts with gold accents and matching court shoes shown in the reference. Keep Fern human; no wolf ears, muzzle, fur body, tail, claws, bows, arrows, fantasy features or props. Match the illustrated 1990s arcade sports style of the references.
>
> Lay out exactly 7 equal columns and exactly 4 equal rows. Put exactly one full figure at the center of every cell and no other marks. Give every silhouette generous transparent gutters. Each figure must be distinct, fully contained within its cell and separated by substantial empty transparent pixels on every side. No touching, overlap, clipping, crop, merge or fused figures. Ensure every curl, hand, finger and shoe stays far from cell edges. Keep the same three-quarter gameplay view, tall scale, anatomy and shared row baselines. Hands stay empty because the game draws the ball separately. The canvas outside the 28 figures must be fully transparent alpha zero: no green haze, background, gradient, vignette, glow, halo, colored mat, floor, shadow, labels, grid, checkerboard, border, panels, extra people, duplicated poses, or mirrored copies.
>
> Rows: row 1 has six distinct upright relaxed idle variations and then one upright ball-ready pose with an open empty right hand near waist height. Row 2 has seven distinct low stationary right-hand dribbles with bent knees and varied bounce phases. Row 3 has seven upright running strides with varied arms and legs. Row 4 has seven low forward dribble-run strides with forward lean, varied legs and low right-hand bounce phases. Keep all 28 figures separate, whole, and inside their cells.

#### fern-howl-supplement

Exact selected generation prompt:

> Generate exactly 14 new complete full-body Fern Howl drawings on a wide true-transparent RGBA sheet, 7 equal columns × 2 equal rows, strict row-major. Use her portrait, gameplay crop and accepted 28-pose base as strict identity, anatomy and style references. Preserve fair warm skin, dark eyes, abundant high-gathered teal curls with warm tie, tall natural human athletic build and Emerald Den Wolves emerald/teal/gold basketball kit. Human only. No wolf features, fantasy details, logo, text, number, ball or props.
>
> Place exactly one figure at the center of every cell. Keep every figure no wider than 46% of the column width and no taller than 62% of the row height. Leave at least 50px transparent horizontal gaps between silhouettes, 24px vertical gaps, and clear outer margins. No touching, clipping, overlap or merging, including fingers, hair, shoes, outline and antialiasing. Keep hands empty. Canvas elsewhere alpha-zero transparent; no floor, shadow, glow, haze, gradient, checkerboard, grid, border, labels, panels, duplicate poses or mirrored copies. Same gameplay camera and proportions as base.
>
> Row1 cells1–3: three distinct upright standing ball-ready variations, relaxed vertical torso, feet planted, slight knee bend, open empty right hand near waist. Do not crouch, squat or lean. Cells4–7: four distinct upright running strides. Row2 cells1–3: three low stationary right-hand dribbles with different bounce phases, empty hand and no ball. Cells4–7: four low forward-leaning dribble-run strides with changing legs and low right-hand bounce phases. Exactly14 poses.

#### koa-vale-base

Exact selected generation prompt:

> Create an original polished 28-pose Koa Vale full-body basketball sprite sheet: exactly 7 equal columns × 4 equal rows, strict row-major, on true transparent RGBA. Use the attached portrait and gameplay crop as exact identity/proportion references, and use the prior sprite sheet only for pose style. Preserve deep brown skin, dark eyes, close-cropped blue-black curls, exact portrait face details, compact natural human athletic build and Emerald Den Wolves emerald/teal/gold uniform. He is human; no wolf traits or fantasy details.
>
> Every cell contains exactly one fully separate complete figure, centered and confined within its own cell. Draw figures compactly, no wider than 50% of the cell width and no taller than 72% of the row height. Maintain at least 38 px horizontal and 24 px vertical transparent separation from neighboring silhouettes. Do not let hands, shoes, hair, outlines or antialiasing touch another figure. Exactly 28 distinct figures, no duplicates, overlap, clipping or fusion. Canvas outside figures is alpha-zero transparent, no shadows, floor, glow, haze, gradient, checkerboard, labels, grid, border or background. Empty hands, no ball or props.
>
> Top row cells1–6: six distinct upright relaxed idle poses. Top row cell7: unmistakably upright ball-ready pose with vertical torso, feet planted, slight knee bend, right forearm bent in front, clearly open empty palm at waist height; do not crouch, squat, lean, reach sideways, cross arms or put hands on hips. Row2: seven low stationary right-hand dribbles with varied bounce phases. Row3: seven upright running strides. Row4: seven low forward dribble-run strides. Keep natural anatomy, compact proportions, same three-quarter gameplay camera and 1990s arcade sports illustration.

#### koa-vale-supplement

Exact selected generation prompt:

> Generate exactly 14 new complete full-body Koa Vale drawings on a wide true-transparent RGBA sheet, 7 equal columns × 2 equal rows, strict row-major. Use his portrait, gameplay crop and accepted 28-pose base as strict identity, anatomy and style references. Preserve deep brown skin, dark eyes, close-cropped blue-black curls, exact portrait face details, compact natural human athletic build and Emerald Den Wolves emerald/teal/gold basketball kit. Human only. No wolf features, fantasy details, logo, text, number, ball or props.
>
> Place exactly one figure at the center of every cell. Keep every figure no wider than 46% of the column width and no taller than 62% of the row height. Leave at least 50px transparent horizontal gaps between silhouettes, 24px vertical gaps, and clear outer margins. No touching, clipping, overlap or merging, including fingers, hair, shoes, outline and antialiasing. Keep hands empty. Canvas elsewhere alpha-zero transparent; no floor, shadow, glow, haze, gradient, checkerboard, grid, border, labels, panels, duplicate poses or mirrored copies. Same gameplay camera and proportions as base.
>
> Row1 cells1–3: three distinct upright standing ball-ready variations, relaxed vertical torso, feet planted, slight knee bend, open empty right hand near waist. Do not crouch, squat or lean. Cells4–7: four distinct upright running strides. Row2 cells1–3: three low stationary right-hand dribbles with different bounce phases, empty hand and no ball. Cells4–7: four low forward-leaning dribble-run strides with changing legs and low right-hand bounce phases. Exactly14 poses.

## J.34 — Stripewood Longarms

The palette is charcoal, orange and purple. Both athletes use the human rig; “Longarms” does not mean elongated arms or unusual anatomy. Keep natural human limb lengths as shown by each reference.

### Scribble Turner — cell66, tall human man

Identity lock: warm tan skin, dark eyes, very full dark-brown curls, and the portrait's exact mouth and brow details. Keep his tall natural human athletic build and charcoal/orange/purple kit from the gameplay reference.

**Base prompt — exactly28 figures, 7 columns × 4 rows:**

> Create an original polished full-body 2D arcade basketball sprite sheet with exactly 28 separate complete drawings of the same tall adult human man, arranged in 7 columns by 4 rows, strict row-major, on true transparent RGBA. Use the attached Scribble Turner cell66 portrait and isolated gameplay crop as strict identity references. Preserve his warm tan skin, dark eyes, very full dark-brown curls, exact mouth and brow details from the portrait, and tall natural human athletic proportions. Match the Stripewood Longarms sleeveless charcoal basketball jersey and shorts with orange and purple accents and matching court shoes shown in the reference. Keep Scribble human with ordinary natural arm and leg proportions; no elongated limbs, extra joints, creature features, bows, arrows, fantasy equipment or props. Match the illustrated 1990s arcade sports style of the references.
>
> Give every full figure generous transparent gutters. Each silhouette must be complete and separate, with no touching, overlap, clipping or fused components. Keep curls, hands, fingers and shoes in bounds. Hold the same three-quarter gameplay view, scale, anatomy and shared row baselines. Hands stay empty because the game draws the ball separately. No floor, shadow, labels, grid, checkerboard, border, panels, extra people, duplicate poses or mirrored copies.
>
> Row1: six distinct upright relaxed idle variations, then one upright ball-ready pose with an open empty right hand near waist height. Row2: seven distinct low stationary right-hand dribbles with bent knees and varied bounce phases. Row3: seven upright running strides with varied arms and legs. Row4: seven low forward dribble-run strides with forward lean, varied legs and low right-hand bounce phases.

**Safe supplement prompt — exactly14 figures, 7 columns × 2 rows:**

> Generate exactly 14 new complete full-body Scribble Turner drawings on a wide transparent RGBA sheet, arranged 7 columns by 2 rows, strict row-major. Attach his exact cell66 portrait, isolated gameplay crop and accepted 28-pose base. Preserve warm tan skin, dark eyes, very full dark-brown curls, portrait-matched mouth and brows, tall natural human proportions and charcoal/orange/purple uniform. Keep his arms and legs naturally proportioned; no extra length, creature features, bows, arrows, fantasy details, logo, writing, number, ball or props.
>
> Use wide transparent outer margins and generous gutters; draw each figure at about 55% of cell width and 60% of row height. Every silhouette must be separate, complete and in bounds, with no touching, clipping, overlap or fused components. Match the base camera, scale, anatomy and row baselines. Keep hands empty. No floor, shadow, checkerboard, grid, border, labels, panels, extra figures, duplicates or mirrored pose variants.
>
> Row1 cells0–2: three distinct upright ball-ready poses with open empty right hands near waist height. Cells3–6: four different upright run strides. Row2 cells0–2: three low stationary right-hand dribbles at distinct bounce phases. Cells3–6: four low forward dribble-run strides with changing legs and low right-hand bounce phases. Draw14 complete in-bounds poses.

### Palette Spry — cell67, compact human woman

Identity lock: fair warm skin, dark eyes, blonde curls gathered in a high ponytail with a warm tie, compact natural human athletic proportions and charcoal/orange/purple kit. Her gameplay `athletic-variant` rig is still human; retain the reference's compact silhouette and no fantasy details.

**Base prompt — exactly28 figures, 7 columns × 4 rows:**

> Create an original polished full-body 2D arcade basketball sprite sheet with exactly 28 separate complete drawings of the same compact adult human woman, arranged in 7 columns by 4 rows, strict row-major, on true transparent RGBA. Use the attached Palette Spry cell67 portrait and isolated gameplay crop as strict identity references. Preserve her fair warm skin, dark eyes, blonde curls gathered into a high ponytail with the same warm tie, and compact natural human athletic proportions shown in gameplay. Match the Stripewood Longarms sleeveless charcoal basketball jersey and shorts with orange and purple accents and matching court shoes shown in the reference. Keep Palette human with ordinary natural limb proportions; no elongated arms, extra joints, creature features, bows, arrows, fantasy equipment or props. Match the illustrated 1990s arcade sports style of the references.
>
> Give every full figure generous transparent gutters. Each silhouette must be complete and separate, with no touching, overlap, clipping or fused components. Keep ponytail, curls, hands, fingers and shoes in bounds. Hold the same three-quarter gameplay view, compact scale, anatomy and shared row baselines. Hands stay empty because the game draws the ball separately. No floor, shadow, labels, grid, checkerboard, border, panels, extra people, duplicate poses or mirrored copies.
>
> Row1: six distinct upright relaxed idle variations, then one upright ball-ready pose with an open empty right hand near waist height. Row2: seven distinct low stationary right-hand dribbles with bent knees and varied bounce phases. Row3: seven upright running strides with varied arms and legs. Row4: seven low forward dribble-run strides with forward lean, varied legs and low right-hand bounce phases.

**Safe supplement prompt — exactly14 figures, 7 columns × 2 rows:**

> Generate exactly 14 new complete full-body Palette Spry drawings on a wide transparent RGBA sheet, arranged 7 columns by 2 rows, strict row-major. Attach her exact cell67 portrait, isolated gameplay crop and accepted 28-pose base. Preserve fair warm skin, dark eyes, blonde high ponytail with the warm tie, compact natural human athletic proportions and charcoal/orange/purple uniform. Keep her arms and legs naturally proportioned; no Longarms anatomy, creature features, bows, arrows, fantasy details, logo, writing, number, ball or props.
>
> Use wide transparent outer margins and generous gutters; draw each figure at about 55% of cell width and 60% of row height. Every silhouette must be separate, complete and in bounds, with no touching, clipping, overlap or fused components. Keep curls, ponytail, hands, fingers and shoes safely inside the canvas. Match the base camera, compact scale, anatomy and row baselines. Keep hands empty. No floor, shadow, checkerboard, grid, border, labels, panels, extra figures, duplicates or mirrored pose variants.
>
> Row1 cells0–2: three distinct upright ball-ready poses with open empty right hands near waist height. Cells3–6: four different upright run strides. Row2 cells0–2: three low stationary right-hand dribbles at distinct bounce phases. Cells3–6: four low forward dribble-run strides with changing legs and low right-hand bounce phases. Draw14 complete in-bounds poses.

## J.35 — Verdant Reach Archers

The palette is forest green and gold with green accents. Both athletes use the human rig, and the references show basketball players. “Archers” does not imply bows, arrows or fantasy anatomy.

### Sage Fletch — cell68, tall human man

Identity lock: warm tan skin, dark eyes, short dense olive-green curls, tall natural human athletic build and forest-green/gold uniform.

**Base prompt — exactly28 figures, 7 columns × 4 rows:**

> Create an original polished full-body 2D arcade basketball sprite sheet with exactly 28 separate complete drawings of the same tall adult human man, arranged in 7 columns by 4 rows, strict row-major, on true transparent RGBA. Use the attached Sage Fletch cell68 portrait and isolated gameplay crop as strict identity references. Preserve his warm tan skin, dark eyes, short dense olive-green curls, face details from the portrait and tall natural human athletic proportions from gameplay. Match the Verdant Reach Archers forest-green sleeveless basketball jersey and shorts with gold accents and matching court shoes shown in the reference. Keep Sage human; no elf ears, bows, arrows, armor, creature features, fantasy gear or props. Match the illustrated 1990s arcade sports style of the references.
>
> Give every full figure generous transparent gutters. Each silhouette must be complete and separate, with no touching, overlap, clipping or fused components. Keep curls, hands, fingers and shoes in bounds. Hold the same three-quarter gameplay view, scale, anatomy and shared row baselines. Hands stay empty because the game draws the ball separately. No floor, shadow, labels, grid, checkerboard, border, panels, extra people, duplicate poses or mirrored copies.
>
> Row1: six distinct upright relaxed idle variations, then one upright ball-ready pose with an open empty right hand near waist height. Row2: seven distinct low stationary right-hand dribbles with bent knees and varied bounce phases. Row3: seven upright running strides with varied arms and legs. Row4: seven low forward dribble-run strides with forward lean, varied legs and low right-hand bounce phases.

**Safe supplement prompt — exactly14 figures, 7 columns × 2 rows:**

> Generate exactly 14 new complete full-body Sage Fletch drawings on a wide transparent RGBA sheet, arranged 7 columns by 2 rows, strict row-major. Attach his exact cell68 portrait, isolated gameplay crop and accepted 28-pose base. Preserve warm tan skin, dark eyes, short dense olive-green curls, tall natural human proportions and forest-green/gold uniform. Keep him human; no elf ears, bows, arrows, armor, fantasy details, logo, writing, number, ball or props.
>
> Use wide transparent outer margins and generous gutters; draw each figure at about 55% of cell width and 60% of row height. Every silhouette must be separate, complete and in bounds, with no touching, clipping, overlap or fused components. Match the base camera, scale, anatomy and row baselines. Keep hands empty. No floor, shadow, checkerboard, grid, border, labels, panels, extra figures, duplicates or mirrored pose variants.
>
> Row1 cells0–2: three distinct upright ball-ready poses with open empty right hands near waist height. Cells3–6: four different upright run strides. Row2 cells0–2: three low stationary right-hand dribbles at distinct bounce phases. Cells3–6: four low forward dribble-run strides with changing legs and low right-hand bounce phases. Draw14 complete in-bounds poses.

### Hazel Bloom — cell69, compact human woman

Identity lock: light warm skin, dark eyes, abundant blonde curls gathered high with green/gold headwear, compact natural human athletic proportions and green/gold uniform. Keep the gameplay silhouette human and compact.

**Base prompt — exactly28 figures, 7 columns × 4 rows:**

> Create an original polished full-body 2D arcade basketball sprite sheet with exactly 28 separate complete drawings of the same compact adult human woman, arranged in 7 columns by 4 rows, strict row-major, on true transparent RGBA. Use the attached Hazel Bloom cell69 portrait and isolated gameplay crop as strict identity references. Preserve her light warm skin, dark eyes, abundant blonde curls gathered high with the same green/gold headwear, face details from the portrait and compact natural human athletic proportions from gameplay. Match the Verdant Reach Archers forest-green sleeveless basketball jersey and shorts with gold accents and matching court shoes shown in the reference. Keep Hazel human; no elf ears, bows, arrows, armor, creature features, fantasy gear or props. Match the illustrated 1990s arcade sports style of the references.
>
> Give every full figure generous transparent gutters. Each silhouette must be complete and separate, with no touching, overlap, clipping or fused components. Keep curls, headwear, hands, fingers and shoes in bounds. Hold the same three-quarter gameplay view, compact scale, anatomy and shared row baselines. Hands stay empty because the game draws the ball separately. No floor, shadow, labels, grid, checkerboard, border, panels, extra people, duplicate poses or mirrored copies.
>
> Row1: six distinct upright relaxed idle variations, then one upright ball-ready pose with an open empty right hand near waist height. Row2: seven distinct low stationary right-hand dribbles with bent knees and varied bounce phases. Row3: seven upright running strides with varied arms and legs. Row4: seven low forward dribble-run strides with forward lean, varied legs and low right-hand bounce phases.

**Safe supplement prompt — exactly14 figures, 7 columns × 2 rows:**

> Generate exactly 14 new complete full-body Hazel Bloom drawings on a wide transparent RGBA sheet, arranged 7 columns by 2 rows, strict row-major. Attach her exact cell69 portrait, isolated gameplay crop and accepted 28-pose base. Preserve light warm skin, dark eyes, abundant high blonde curls with the green/gold headwear, compact natural human athletic proportions and forest-green/gold uniform. Keep her human; no elf ears, bows, arrows, armor, fantasy details, logo, writing, number, ball or props.
>
> Use wide transparent outer margins and generous gutters; draw each figure at about 55% of cell width and 60% of row height. Every silhouette must be separate, complete and in bounds, with no touching, clipping, overlap or fused components. Keep curls, headwear, hands, fingers and shoes safely inside the canvas. Match the base camera, compact scale, anatomy and row baselines. Keep hands empty. No floor, shadow, checkerboard, grid, border, labels, panels, extra figures, duplicates or mirrored pose variants.
>
> Row1 cells0–2: three distinct upright ball-ready poses with open empty right hands near waist height. Cells3–6: four different upright run strides. Row2 cells0–2: three low stationary right-hand dribbles at distinct bounce phases. Cells3–6: four low forward dribble-run strides with changing legs and low right-hand bounce phases. Draw14 complete in-bounds poses.

## Review gate for all six athletes

Before assembly, count28 and14 full alpha-isolated bodies separately and reject any touching, fused, clipped or identity-drifting source sheet whole. Compare faces, hair, skin, body proportions and kit to the exact cell references. For each accepted source, record the generation ID, full prompt, source hash, chosen component rectangles, excluded components and pose map. Review canon mirroring before applying it, build athlete-specific separate-ball tracks, then inspect native previews for all five clips at standard scale and zoom120 before registering atlases.
