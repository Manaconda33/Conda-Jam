# J.30 locomotion source generations

Generation date: 2026-10-22. Runtime roster indexing maps Camden Union to zero-based cell58 and Poppy Stitch to cell59 in the existing supporting-player portrait and gameplay atlases. The references in `tools/generate-art/references/` use those exact cells; the gameplay crops isolate the athlete component. Both are original human roster athletes in the London Royal Spots cobalt/red/white kit.

The first generated candidate set used cells56 and57 by mistake. It is preserved under `tools/generate-art/sources/*wrong-cell-identity-rejected.png`; no drawing from it is eligible for assembly. The rejected generation IDs are Camden `exec-1c8afd66-3cf3-4536-b368-5e00ed2f5e5d` and `exec-6adf27a6-c163-4230-85cc-6f48d7dd251f`, and Poppy `exec-3cb8531a-0ffb-4de2-bc15-6830765a3a45` and `exec-fcdb06d0-499c-4d39-aae0-4b8f7a48f3b7`.

## Camden Union

Reference identity: adult human man with warm tan skin, dark eyes, clean-shaven angular face, short dense dark navy-blue hair swept upward/back under a cobalt headband with small red/white accents, and muscular natural proportions. Royal Spots uniform: cobalt sleeveless basketball jersey and shorts with white panels, red piping and dark cobalt/white court shoes. Camden is not GB Design and has no jaguar anatomy, spots, flag costume or mascot insignia.

### Correct-cell base generation — accepted 28-pose source

Image generation ID: `exec-37f87e22-f082-49bc-a360-0483d0bae9d4`. The alpha audit found28 separate full-body components in row order on transparent RGBA. Every figure is in bounds; the closest top edge is4px, with complete hair visible. The source is preserved as `sources/camden-union-locomotion-base.png`.

Prompt:

> Create an original polished full-body 2D arcade basketball sprite sheet: exactly 28 separate complete drawings of the SAME adult human man, arranged 7 columns by 4 rows, strict left-to-right row-major order on true transparent RGBA. The attached Camden Union portrait and isolated gameplay sprite crop come from his actual runtime roster cells and are strict identity references. Preserve his warm tan skin, dark eyes, clean-shaven angular face, short dense dark navy-blue hair swept upward/back beneath a cobalt-blue athletic headband with small red/white accents, and muscular natural adult build. Keep him clearly human, never feline. London Royal Spots kit: cobalt-blue sleeveless basketball jersey and shorts, clear white panels, restrained red piping, dark cobalt/white court shoes. No flag, real mark, brand, number, letters, mascot, spots, jewelry or props. Match the illustrated 1990s arcade sports style and proportions of the references.
>
> Keep generous true-transparent gutters between every full figure; body silhouettes must not touch or overlap. Center each complete body and keep hair, elbows, hands, fingers and shoes safely inside the canvas. Consistent three-quarter gameplay camera, scale, anatomy and shared row baselines. No basketball; game draws its own separate ball. No floor, shadow, grid, checkerboard, border, labels, panels, extra people, duplicates or mirrored pose variants.
>
> Row 1: seven upright relaxed idle stances with subtle distinct breathing, weight-shift and foot-placement changes; pose6 is an upright ball-ready stance with an open empty right hand near waist height. Row 2: seven distinct low stationary right-hand dribble poses, knees bent and empty hand reaching through different low bounce phases. Row 3: seven clear upright running strides with varied arms and legs. Row 4: seven low forward dribble-run strides, forward lean and varied legs while the empty right hand cycles through low bounce phases. Each is a complete in-bounds figure.

### Correct-cell safe supplement — 14 poses

Image generation ID: `exec-9302c029-44ea-4b75-a75f-8dc2c8ffcf10`. The alpha audit found14 separate full-body components on true RGBA; all hair, hands and shoes are in-bounds. The narrowest right-edge margin is10px, and the assembler adds transparent space around every isolated crop. The accepted source is preserved as `sources/camden-union-locomotion-supplement-14.png`.

Prompt:

> Generate exactly14 new complete full-body drawings of Camden Union on a wide transparent RGBA sheet, 7 columns by2 rows, strict row-major. Use the attached correct-cell Camden portrait, isolated gameplay crop and accepted base as references. Same warm tan skin, dark eyes, clean-shaven angular face, short dense dark navy-blue hair swept upward/back, cobalt headband with small red/white accents, muscular natural human proportions. Match the base's cobalt-blue sleeveless London Royal Spots kit with white panels, restrained red piping and cobalt/white shoes. No beard, feline anatomy, spots, flag, mascot mark, number, text, ball or prop.
>
> Use wide transparent outer margins and gutters between figures; draw each body at about55% of cell width and60% of row height. Every figure is separate, with full hair, head, hands, fingers and shoes well inside the canvas. No touching, clipping, overlap or fused alpha components. True RGBA transparency, no checkerboard, grid or background. Keep consistent camera, scale, shared row baselines, clean contours and the base's illustrated arcade shading. Runtime draws the ball separately, so every hand is empty.
>
> Exact order: row1 cells0–2 are three tall upright ball-ready stances with relaxed open right hands at waist height; cells3–6 are four distinct upright run strides. Row2 cells0–2 are three low stationary right-hand dribbles; cells3–6 are four low forward dribble-run strides with varied leg positions and right hand through different low bounce phases. Do not repeat drawings.

## Poppy Stitch

Reference identity: adult human woman with fair warm skin, dark eyes, confident expression, long vivid red curls gathered in a high ponytail and held by a navy-blue athletic headband, and natural athletic-curvy proportions. Royal Spots uniform: cobalt sleeveless jersey and shorts with white panels, restrained red piping and dark cobalt/white shoes. Poppy is not GB Design and has no feline features or flag costume.

### Correct-cell base generation — accepted 28-pose source

Image generation ID: `exec-3a570a00-5aa0-4e1b-ae94-178c6ef479a5`. The alpha audit found28 separate full-body components on transparent RGBA. All hair, hands, and shoes are in-bounds; the top margin is2px with complete hair visible. The source is preserved as `sources/poppy-stitch-locomotion-base.png`.

Prompt:

> Create an original polished full-body 2D arcade basketball sprite sheet: exactly 28 separate complete drawings of the SAME adult human woman, arranged 7 columns by4 rows, strict left-to-right row-major order on true transparent RGBA. The attached Poppy Stitch portrait and isolated gameplay sprite crop come from her actual runtime roster cells and are strict identity references. Preserve her fair warm skin, dark eyes, confident expression, long vivid red curls gathered in a high ponytail and held by a navy-blue athletic headband, and natural athletic-curvy adult build. Keep her clearly human. London Royal Spots kit: cobalt-blue sleeveless basketball jersey and shorts, clear white panels, restrained red piping, dark cobalt/white court shoes. No flag, real mark, brand, number, letters, mascot, feline anatomy or props. Match the illustrated 1990s arcade sports style and proportions of the references.
>
> Keep generous true-transparent gutters between every full figure; body silhouettes must not touch or overlap. Center each complete body and keep the full ponytail, head, elbows, hands, fingers and shoes safely inside the canvas. Consistent three-quarter gameplay camera, scale, anatomy and shared row baselines. No basketball; game draws its own separate ball. No floor, shadow, grid, checkerboard, border, labels, panels, extra people, duplicates or mirrored pose variants.
>
> Row 1: seven upright relaxed idle stances with subtle distinct breathing, weight-shift and foot-placement changes; pose6 is an upright ball-ready stance with an open empty right hand near waist height. Row 2: seven distinct low stationary right-hand dribble poses, knees bent and empty hand reaching through different low bounce phases. Row 3: seven clear upright running strides with varied arms and legs. Row 4: seven low forward dribble-run strides, forward lean and varied legs while the empty right hand cycles through low bounce phases. Each is a complete in-bounds figure.

### Correct-cell safe supplement — 14 poses

Image generation ID: pending. The accepted supplement must contain14 separate complete in-bounds figures with true alpha and no touching components.

Prompt:

> Generate exactly14 new complete full-body drawings of Poppy Stitch on a wide transparent RGBA sheet, 7 columns by2 rows, strict row-major. Use the attached correct-cell Poppy portrait, isolated gameplay crop and accepted base as references. Same fair warm skin, dark eyes, confident expression, long vivid red curls gathered in a high ponytail under a navy-blue athletic headband, natural athletic-curvy adult human proportions. Match the base's cobalt-blue sleeveless London Royal Spots kit with white panels, restrained red piping and cobalt/white shoes. No black hair, puffs, feline anatomy, flag, mascot mark, number, text, ball or prop.
>
> Use wide transparent outer margins and gutters between figures; draw each body at about55% of cell width and60% of row height. Every figure is separate, with full ponytail, head, hands, fingers and shoes well inside the canvas. No touching, clipping, overlap or fused alpha components. True RGBA transparency, no checkerboard, grid or background. Keep consistent camera, scale, shared row baselines, clean contours and the base's illustrated arcade shading. Runtime draws the ball separately, so every hand is empty.
>
> Exact order: row1 cells0–2 are three tall upright ball-ready stances with relaxed open right hands at waist height; cells3–6 are four distinct upright run strides. Row2 cells0–2 are three low stationary right-hand dribbles; cells3–6 are four low forward dribble-run strides with varied leg positions and right hand through different low bounce phases. Do not repeat drawings.

## Assembly and review

Expected assembled source per athlete:42 unique drawings across idle6, idle-ball4, dribble10, run11 and dribble-run11. Assembly uses in-bounds alpha-isolated source components only, with transparent margins added around each selected crop. Preserve every raw source and record generation IDs, hashes, component counts, rejected figures and the exact 42-frame map. Never crop fused figures into separate poses.
