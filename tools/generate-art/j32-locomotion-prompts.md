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

## Generated source records — 2026-10-23

The exact cell references used for both athletes are the portrait and isolated gameplay files named above. The source PNGs are retained without edits under `tools/generate-art/sources/`; all accepted base and supplement sheets pass the existing alpha-component reader as exactly28 or14 in-bounds, separated figures in row-major seven-column bands. No generated ball or prop appears in accepted sources. J.32 assembly, pose maps, source rectangles and normalized unique-pose hashes are recorded in each `*-locomotion42-provenance.json` file.

### Lilt Smile — accepted base

- Generation: `exec-ae593f2b-503e-4d51-abc6-57e001861d52`; source: `sources/lilt-smile-locomotion-base.png`; SHA256 `1e12234f27ea2c375d41c204a43cb175b70ef44da6ef15b98262c88d181d2741`.
- Size 1659×948, transparent RGBA; 28 separate, in-bounds figures. Reviewed against cell62 portrait/gameplay: light warm skin, dark eyes, vivid-magenta high ponytail with warm tie, tall human athletic build, purple/pink/gold/turquoise kit, empty hands. The sixth idle-row drawing is a distinct low ball-ready stance and is mapped to idle-ball; the six upright variations remain idle.

Exact image-generation prompt:

> Create an original full-body 2D arcade basketball sprite sheet with exactly 28 separate complete drawings of the same adult human woman, arranged 7 columns by 4 rows, strict row-major, on true transparent RGBA. Use both attached Lilt Smile actual runtime cell62 references as strict identity: her portrait and isolated gameplay crop. Preserve light warm skin, dark eyes, confident expressive adult face, abundant vivid-magenta curls gathered into a high ponytail with the small warm-colored tie visible in the references, and natural tall athletic proportions. Match Cheshire Hollow Grinners' sleeveless purple basketball jersey and shorts with pale-pink/cream and gold edging, restrained turquoise details, and matching court shoes. Clearly human: no creature anatomy, fangs, ears, horns, wings, fantasy features or props. Match the illustrated 1990s arcade basketball style of the references.
>
> Give every complete figure ample transparent space: no touching, overlap, clipping or joined alpha components. Keep her full ponytail, head, elbows, hands, fingers and shoes in frame. Consistent three-quarter gameplay view, character scale, anatomy and shared row baselines. Every hand stays empty because the game draws the basketball separately. No floor, shadow, labels, grid, checkerboard, border, panels, logo, number, writing, ball, brand, extra people, repeated poses or mirrored copies.
>
> Row 1: seven upright relaxed idle variations with subtle distinct posture and foot placement; pose 6 is ball-ready with an open empty right hand near waist height. Row 2: seven distinct low stationary right-hand dribbles, bent knees and different bounce phases, but no ball drawn. Row 3: seven clear upright running strides with varied arms and legs. Row 4: seven low forward dribble-run strides with forward lean, varied legs and different low right-hand bounce phases. Draw exactly 28 complete separate in-bounds figures.

### Lilt Smile — accepted supplement

- Generation: `exec-2875ce1a-45b8-4331-8fe3-e2d25c986789`; source: `sources/lilt-smile-locomotion-supplement-14.png`; SHA256 `04c2e7649372a5a32cebb34899ef33b3c07af1ffa80a438012b11851a09f1a4f`.
- Size 2067×761, transparent RGBA; 14 distinct connected-alpha figures, separated and fully in bounds. Reviewed for three upright ball-ready drawings, four run strides, three stationary dribbles and four dribble-run strides. The raw image leaves 20px at its tightest outside edge; every silhouette remains intact and separated. No hands contain a ball or prop.

Exact image-generation prompt:

> Generate exactly 14 new complete full-body Lilt Smile drawings on a wide transparent RGBA sheet, 7 columns by 2 rows, strict row-major. Use the attached exact runtime cell62 portrait, isolated gameplay crop and accepted 28-pose base as strict identity and style references. Keep her light warm skin, dark eyes, confident adult face, abundant vivid-magenta curls gathered in a high ponytail with its small warm-colored tie, natural tall athletic proportions, and purple/pink/cream/gold/turquoise Cheshire kit. Clearly human; no creature anatomy, fangs, fantasy features, logo, writing, number, ball or props.
>
> Use wide transparent outer margins and generous gutters; each figure should occupy about 55% of its cell width and 60% of its row height. Every silhouette must be complete and separate, with no touching, clipping, overlap or fused components. Keep hair, hands, fingers and shoes well inside the canvas. Preserve the base's camera, scale, anatomy and shared baselines. No floor, shadow, checkerboard, grid, border, labels, panels, extra people, duplicate drawings or mirrored pose variants. Hands stay empty; the game draws its own basketball.
>
> Row 1 cells 0–2: three distinct upright ball-ready poses with relaxed open right hands near waist height. Cells 3–6: four different upright run strides. Row 2 cells 0–2: three separate low stationary right-hand dribbles at distinct bounce phases. Cells 3–6: four low forward dribble-run strides, changing legs and low right-hand bounce phases. Draw exactly 14 complete in-bounds poses.

### Lilt Smile — rejected stricter retry

- Generation: `exec-6ed2781d-a0d9-4386-9df7-1c38d42ef0d4`; source: `sources/lilt-smile-locomotion-supplement-14-rejected-margin.png`; SHA256 `a89b8d3448da101f7ec4f5fd5373be78a4eab126ef69346ff160e002992439a4`.
- Size 2032×774, transparent RGBA; 14 components, but rejected as a whole because an outside pose was clipped and the first three cells did not retain the required open-hand ball-ready poses. It is preserved only as excluded source history.

Exact retry prompt:

> Generate a new safe supplement of exactly 14 complete full-body drawings of Lilt Smile on transparent RGBA, in seven evenly spaced columns and two rows, read row-major. Use the attached exact cell62 portrait, gameplay crop and accepted 28-pose base for identity and style. Preserve her light warm skin, dark eyes, confident face, abundant vivid-magenta curls in a high ponytail with the warm tie, natural tall athletic build, and Cheshire purple/pink/cream/gold/turquoise uniform. Keep her fully human. Every hand is empty. No basketball, props, words, numbers, logos, creature features or extra people.
>
> Compose each pose well inside its own equal-sized tile. Leave a visible clear transparent gutter between all neighboring poses and broad transparent space outside the first and last figures. Keep each complete figure to roughly 55 percent of a tile's width and 65 percent of its row's height. Do not let any hair, hand, finger, shoe or sole approach the canvas edge. Each figure must be separate and complete, with ample room all around; no touching, overlap, clipping or fused components. Preserve the accepted base's scale, anatomy and three-quarter gameplay camera. Do not draw tile outlines, grid, checkerboard, border, floor, shadow or labels.
>
> Row 1 tiles 0–2: three upright ball-ready stances with distinct weight shifts and relaxed open right hands near the waist. Tiles 3–6: four clearly different upright running strides. Row 2 tiles 0–2: three low stationary right-hand dribbles at different bounce phases (hands empty, no ball). Tiles 3–6: four low forward dribble-run strides with varied legs and low right-hand phases. Draw exactly 14 unique complete in-bounds figures.

### Violet Wink — accepted base and supplement

Base generation: `exec-09cf07f4-4dbc-4e95-afee-8f2b9e04e096`; source: `sources/violet-wink-locomotion-base.png`; SHA256 `24c5e9b28b31474c410ec8825e64f2f9f8e37095daab4f90a89c6c8adb80b8a1`. Size 1659×948, transparent RGBA; 28 separate, in-bounds figures in four seven-pose rows.

Supplement generation: `exec-0879b4ad-9a20-4776-8224-0444b3f3d55a`; source: `sources/violet-wink-locomotion-supplement-14.png`; SHA256 `026be30e82ba16b27c48c9597734494d674934cb8e4c1196661f0752d8724e0c`. Size 2032×774, transparent RGBA; 14 separate, in-bounds figures in two seven-pose rows.

Both sheets were reviewed against cell63 portrait/gameplay. Violet remains a human compact athletic variant with light warm skin, dark eyes, defined brows, short dense lavender curls, and purple/pink/cream/gold/turquoise kit. Hands are empty; no creature anatomy, ball or props were added. The supplement's nearest outside margin is 20px; all fourteen figures remain complete and distinct.

Exact base prompt:

> Create an original polished full-body 2D arcade basketball sprite sheet with exactly 28 separate complete drawings of the same compact adult human athlete, arranged 7 columns by 4 rows, strict row-major, on true transparent RGBA. Use both attached Violet Wink actual runtime cell63 references as strict identity: her portrait and isolated gameplay crop. Preserve light warm skin, dark eyes, defined brows, short dense lavender curls with the same spiked texture, and the compact human athletic-variant proportions shown in the references. Match Cheshire Hollow Grinners' sleeveless purple basketball jersey and shorts with pale-pink/cream and gold accents, restrained turquoise details, and matching court shoes. Keep Violet clearly human and faithful to the portrait; no creature anatomy, fangs, ears, horns, wings, magic, fantasy props, logo, number, writing, ball or brand. Match the illustrated 1990s arcade basketball style of the references.
>
> Give every complete figure generous transparent gutters; silhouettes must not touch, overlap, clip or form joined components. Keep curls, head, elbows, hands, fingers and shoes in frame. Consistent three-quarter gameplay view, compact scale, anatomy and shared row baselines. Every hand stays empty because the game draws the basketball separately. No floor, shadow, labels, grid, checkerboard, border, panels, extra people, repeated poses or mirrored copies.
>
> Row 1: seven upright relaxed idle variations with subtle distinct posture and foot placement; pose 6 is ball-ready with an open empty right hand near waist height. Row 2: seven different low stationary right-hand dribbles, bent knees and varied bounce phases, but no ball drawn. Row 3: seven clear upright running strides with different arm and leg positions. Row 4: seven low forward dribble-run strides with forward lean, varied legs and different low right-hand bounce phases. Draw exactly 28 complete separate in-bounds figures.

Exact supplement prompt:

> Generate exactly 14 new complete full-body Violet Wink drawings on a wide transparent RGBA sheet, 7 equal columns by 2 equal rows, strict row-major. Use the attached exact runtime cell63 portrait, isolated gameplay crop and accepted 28-pose base as strict identity and style references. Preserve light warm skin, dark eyes, defined brows, short dense lavender curls with the same spiked texture, compact human athletic-variant proportions, and purple/pink/cream/gold/turquoise Cheshire kit. Keep Violet human and faithful to the portrait; no creature anatomy, fangs, fantasy details, logo, writing, number, ball or props.
>
> Compose a roomy contact sheet with exactly one complete figure centered inside each of 14 equal invisible tiles. Leave at least 50 pixels of clear transparent margin on every outer edge and at least 55 pixels clear between neighboring figures. Each figure should use only about half its tile's width and 60 percent of its tile's height. Show every curl, head, hand, finger, shoe and sole fully inside the canvas. No silhouette may touch another figure or the canvas edge. No clipping, overlap or fused components. Keep all poses at matching scale and the base's camera and anatomy. No floor, shadow, checkerboard, visible grid, border, labels, extra people, duplicates or mirrored variants. Every hand is empty because the game draws the basketball separately.
>
> Row 1, tiles 0–2: three distinct upright ball-ready stances with relaxed open right hands near waist height. Tiles 3–6: four clearly different upright running strides. Row 2, tiles 0–2: three separate low stationary right-hand dribbles at distinct bounce phases, without a ball. Tiles 3–6: four low forward dribble-run strides, changing legs and low right-hand bounce phases. All 14 figures must be small enough to fit within their own tile with wide clear gutters and all limbs visible.
