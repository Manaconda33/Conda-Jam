# J.32 Cheshire Hollow Grinners locomotion sources

Runtime supporting cells: Lilt Smile is cell62 and Violet Wink is cell63. Use each athlete's exact portrait and isolated gameplay reference from `tools/generate-art/references/`, plus that athlete's accepted base for its supplement. Both are human; preserve the portrait's own face, hair, proportions and purple/pink/gold palette. Names and the Grinners theme do not imply fantasy anatomy, creature features or props.

The accepted sequence is42 unique authored drawings: idle6, idle-ball4, dribble10, run11 and dribble-run11. Generate and review the28-pose base first, then the safe14-pose supplement. Never crop touching/fused drawings into separate frames.

## Lilt Smile

Identity: adult human woman with light warm skin, dark eyes, abundant vivid-magenta curls gathered in a high ponytail with a small warm-colored tie, and a confident expressive face. Keep her natural tall athletic proportions. Cheshire kit is a sleeveless purple jersey and shorts with pale pink/cream and gold edging, touches of turquoise, and court shoes matching the references.

### Base — exactly 28 poses

Prompt:

> Create an original polished full-body 2D arcade basketball sprite sheet with exactly 28 separate complete drawings of the same adult human woman, arranged 7 columns by 4 rows in strict row-major order on true transparent RGBA. Use the attached Lilt Smile cell62 portrait and isolated gameplay crop as strict identity references. Preserve her light warm skin, dark eyes, confident face, abundant vivid-magenta curls gathered high with the small warm-colored tie visible in the references, and natural tall athletic proportions. Match Cheshire Hollow Grinners' sleeveless purple basketball jersey and shorts with pale-pink/cream and gold edging, restrained turquoise details and matching court shoes. No creature anatomy, fangs, ears, horns, wings, fantasy props, logo, number, writing, ball or brand. Match the illustrated 1990s arcade style of the references.
>
> Give each complete figure ample transparent space: no touching, overlap, clipping or joined alpha components. Keep the full ponytail, head, elbows, hands, fingers and shoes in frame. Consistent three-quarter gameplay view, character scale, anatomy and shared row baselines. Hands empty because the game draws the ball separately. No floor, shadow, labels, grid, checkerboard, border, panels, extra people, repeated poses or mirrored copies.
>
> Row1: seven upright relaxed idle variations with subtle distinct posture and foot placement; pose6 is ball-ready with an open empty right hand near waist height. Row2: seven distinct low stationary right-hand dribbles, bent knees and different bounce phases. Row3: seven clear upright running strides with varied arms and legs. Row4: seven low forward dribble-run strides with forward lean, varied legs and different low right-hand bounce phases.

### Safe supplement — exactly 14 poses

Prompt:

> Generate exactly 14 new complete full-body Lilt Smile drawings on a wide transparent RGBA sheet,7 columns by 2 rows, strict row-major. Use her attached cell62 portrait, isolated gameplay crop and accepted28-pose base as strict identity and style references. Keep the same light warm skin, dark eyes, vivid-magenta high ponytail with its warm tie, natural tall athletic build and purple/pink/gold/turquoise Cheshire kit. No creature anatomy, fangs, fantasy features, logo, writing, number, ball or props.
>
> Use wide transparent outer margins and generous gutters; figures should occupy about 55% of each cell's width and60% of row height. Every silhouette must be separate, with no touching, clipping, overlap or fused components. Keep hair, hands, fingers and shoes well inside the canvas. Preserve the base's camera, scale, anatomy and shared baselines. No floor, shadow, checkerboard, grid, border, labels, panels, extra people, duplicate drawings or mirrored pose variants. Hands stay empty; the game draws its own basketball.
>
> Row1 cells0–2: three distinct upright ball-ready poses with relaxed open right hands near waist height. Cells3–6: four different upright run strides. Row2 cells0–2: three separate low stationary right-hand dribbles at distinct bounce phases. Cells3–6: four low forward dribble-run strides, changing legs and low right-hand bounce phases. Draw14 complete in-bounds poses.

## Violet Wink

Identity: compact adult human athlete with light warm skin, dark eyes, defined brows and short dense lavender curls with a spiked texture. Match the compact athletic-variant silhouette in the gameplay reference. Keep the face and presentation faithful to the attached portrait instead of inferring details from the name. Cheshire kit is purple with pink/cream and gold accents and matching court shoes.

### Base — exactly 28 poses

Prompt:

> Create an original polished full-body 2D arcade basketball sprite sheet with exactly 28 separate complete drawings of the same compact adult human athlete, arranged 7 columns by 4 rows in strict row-major order on true transparent RGBA. Use the attached Violet Wink cell63 portrait and isolated gameplay crop as strict identity references. Preserve light warm skin, dark eyes, defined brows, short dense lavender curls with the same spiked texture, and the compact human athletic-variant proportions shown in the references. Match Cheshire Hollow Grinners' sleeveless purple basketball jersey and shorts with pale-pink/cream and gold accents, restrained turquoise details and matching court shoes. Keep Violet clearly human; no creature anatomy, fangs, ears, horns, wings, magic, logo, number, writing, ball or brand. Match the illustrated 1990s arcade style of the references.
>
> Give every complete figure generous transparent gutters; silhouettes must not touch, overlap, clip or form joined components. Keep curls, head, elbows, hands, fingers and shoes in frame. Consistent three-quarter gameplay view, compact scale, anatomy and shared row baselines. Hands empty because the game draws the ball separately. No floor, shadow, labels, grid, checkerboard, border, panels, extra people, duplicate poses or mirrored copies.
>
> Row1: seven upright relaxed idle variations with subtle distinct posture and foot placement; pose6 is ball-ready with an open empty right hand near waist height. Row2: seven different low stationary right-hand dribbles, bent knees and varied bounce phases. Row3: seven clear upright running strides with different arm/leg positions. Row4: seven low forward dribble-run strides with forward lean, varied legs and different low right-hand bounce phases.

### Safe supplement — exactly 14 poses

Prompt:

> Generate exactly 14 new complete full-body Violet Wink drawings on a wide transparent RGBA sheet,7 columns by 2 rows, strict row-major. Use the attached cell63 portrait, isolated gameplay crop and accepted28-pose base as strict identity and style references. Preserve light warm skin, dark eyes, defined brows, short lavender textured curls, compact human athletic-variant proportions and purple/pink/cream/gold/turquoise Cheshire kit. Keep Violet human and faithful to the portrait; no creature anatomy, fangs, fantasy details, logo, writing, number, ball or props.
>
> Use wide transparent outer margins and generous gutters; figures should occupy about 55% of each cell's width and60% of row height. Each silhouette must be complete and separate, with no touching, clipping, overlap or fused components. Keep curls, hands, fingers and shoes well inside the canvas. Match the base's camera, scale, anatomy and shared baselines. No floor, shadow, checkerboard, grid, border, labels, panels, extra people, duplicates or mirrored pose variants. Hands stay empty; the game draws its own basketball.
>
> Row1 cells0–2: three distinct upright ball-ready poses with relaxed open right hands near waist height. Cells3–6: four different upright run strides. Row2 cells0–2: three separate low stationary right-hand dribbles at distinct bounce phases. Cells3–6: four low forward dribble-run strides, changing legs and low right-hand bounce phases. Draw14 complete in-bounds poses.

## Review gate

Before assembly, verify28 base and14 supplement figures are isolated, in bounds and visually distinct; confirm faces, hair, kit and body scale match the exact cell62/63 references. Reject any fused/clipped sheet as a whole candidate. After source review, record generation IDs, exact prompts, raw source hashes, selected component rectangles and exclusions in provenance. Review both directions against canon before mirror policy; add athlete-specific separate-ball tracks; preview all five clips at standard and zoom120 before atlas registration.
