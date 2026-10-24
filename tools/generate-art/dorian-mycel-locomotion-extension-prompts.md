# Dorian Mycel locomotion extensions — 2026-10-24

The first two multi-pose sheets failed review because their characters nearly touched or crossed the cell divider. The sheets and exact prompts remain preserved as rejected candidates. Individual single-pose sources passed visual review and are packed as new authored frames 08–09 for `dribble` and 08–10 for `dribble-run`.

All five accepted sources use the Dorian gameplay reference and the existing clip atlas. Each source is a transparent RGBA image with a single complete figure. The atlas packer keeps at least 5px around the source pose in its destination cell. The separate game ball is never painted into the figure art.

## Rejected candidate: dribble, attempt 1

Generation: `exec-b78fe3a1-c9ba-4fa2-a6d8-0845aeeab791`

Source: `tools/generate-art/sources/dorian-mycel-dribble-extension-attempt1-rejected-tight-margin.png`

Reason: The two figures leave only 2px and 1px of horizontal clearance beside the shared cell divider, below the specified 10% margin. Both poses otherwise show complete, consistent Dorian anatomy and no baked-in ball. Rejected before packing.

Exact prompt:

```text
Create a transparent RGBA sprite sheet in a precise 2-column × 1-row layout with exactly TWO new full-body basketball DRIBBLE poses for Dorian Mycel, using both references to match his identity and the existing dribble sequence. Each figure is isolated in its own equal-width cell, centered, with generous transparent padding on every side (at least 10% of cell width and height); no body part touches or crosses a cell boundary. Dorian is a compact athletic adult human man with warm medium-brown skin, clean-shaven face, short dense vivid-purple curls, strong brows, purple Chicago Condas jersey and shorts with silver/lavender trim, dark knee pads, purple wristbands, purple/silver shoes. Preserve natural human anatomy: one head, two arms, two hands, two legs, two shoes. Do not draw a basketball, text, props, floor, background, or effects: the game ball is separately rendered. These are two genuinely distinct intermediate recovery poses to extend the existing eight-pose low stationary dribble loop toward its target of ten, not copies of the reference frames: cell 1 is a low crouched reset immediately after the deepest bounce, one hand reaching down and forward near court level, the other balancing behind; cell 2 rises slightly into the next controlled hand-over-ball motion, knees bent and body compact, reaching hand higher than in cell 1. Keep the hand path and body scale consistent with the existing sequence, with clear pose separation and full visible anatomy.
```

## Rejected candidate: dribble-run, attempt 1

Generation: `exec-a0289503-d14c-4acf-bdcf-c34dd4c930d2`

Source: `tools/generate-art/sources/dorian-mycel-dribble-run-extension-attempt1-rejected-tight-margin.png`

Reason: The first pose leaves 4px at the right edge of its cell and the second leaves 5px at the left. This does not meet the specified 10% side margin. The figures are otherwise separate, complete, and ball-free. Rejected before packing.

Exact prompt:

```text
Create a transparent RGBA sprite sheet in a precise 3-column × 1-row layout with exactly THREE new full-body Dorian Mycel poses. Use the references to match his identity, proportions, colors and the existing low dribble-run cycle. Equal-width isolated cells, centered figures and generous transparent padding on every side (at least 10% of cell width/height); no body part touches or crosses a cell boundary. Dorian is a compact athletic adult human man, warm medium-brown skin, clean-shaven face, short dense vivid-purple curls, strong brows, purple Chicago Condas jersey and shorts with silver/lavender trim, dark knee pads, purple wristbands, purple/silver shoes. Preserve natural anatomy: one head, two arms, two hands, two legs, two shoes. No basketball, text, objects, floor, background or effects; game ball stays separately rendered. These are three genuinely distinct intermediate frames to extend the existing eight-pose low, fast dribble-run toward its eleven-pose target, never copies: left cell is a compact forward lean with left leg driving forward and right leg stretched back, near hand reaching low forward; middle cell is the opposite running stride, torso still low, far hand counter-swinging and near hand low; right cell is a compact crossover transition with feet closer beneath him and the low dribbling hand crossing forward. Keep each silhouette separated, complete and proportionate, with clear stride variation and matching game-sprite style.
```

## Rejected candidate: dribble, attempt 2

Generation: `exec-30e8cd52-a2e6-42b5-b1ce-21c8476c08cc`

Source: `tools/generate-art/sources/dorian-mycel-dribble-extension-attempt2-rejected-tight-margin.png`

Reason: Despite a stricter safe-area prompt, both figures extend to the shared cell divider (0px and 1px clearance). Rejected before packing.

Exact prompt:

```text
Regenerate a transparent RGBA sprite sheet, exactly TWO separate full-body basketball dribble poses for Dorian Mycel in a clean 2-column × 1-row grid. The grid cells are square. Strict safe-area rule: each entire figure, including hair, fingers and shoes, must fit inside the central 65% of its cell width and central 80% of cell height, leaving at least 17% clear transparent margin on LEFT and RIGHT and 10% TOP/BOTTOM. Keep the two figures well apart across the center divider; no part may cross a cell boundary. Do not crop or enlarge the figures to fill the canvas. Match the supplied game reference and dribble atlas: same compact athletic adult human man, warm medium-brown skin, clean-shaven face, short dense vivid-purple curls, strong brows, purple Chicago Condas jersey/shorts with silver-lavender trim, dark knee pads, purple wristbands, purple/silver basketball shoes; natural two-arm, two-leg anatomy. The poses are two distinct low stationary dribble loop continuations, not copies: cell one is a crouched reset after the deepest bounce, one hand reaches low forward and the other counterbalances behind; cell two rises slightly into the controlled next hand-over-ball motion, knees still bent and compact, reaching hand higher. No ball, text, props, floor, scene, background or effects. Only these two isolated transparent characters, no extra marks.
```

## Accepted single-pose sources

The accepted prompts are recorded verbatim with SHA-256 hashes, generation IDs, source paths, and review notes in `tools/generate-art/dorian-mycel-locomotion-extension-provenance.json`.

### `dribble`, frame 08 — generation `exec-6b17c340-5307-4cbe-a517-f139ab7f3a0e`

```text
One isolated full-body transparent RGBA sprite of Dorian Mycel in a low stationary dribble recovery pose, viewed from his established right-facing three-quarter angle. Match the reference exactly: compact athletic adult human man, warm medium-brown skin, clean-shaven, short dense vivid-purple curls, strong brows, purple Chicago Condas jersey and shorts with silver/lavender trim, dark knee pads, purple wristbands and purple/silver basketball shoes. Keep natural anatomy: one head, two arms with two hands, two legs and two shoes. He crouches compactly just after the deepest bounce: knees bent, torso inclined forward, right/near hand open and reaching low-forward toward the court plane, left/far arm balancing behind, eyes following the separate ball. This is a newly authored frame distinct from all poses in the reference atlas and will be used as an intermediate in the existing dribble loop. Composition is strict: center the whole figure in a square canvas, figure occupies at most 60% canvas width and 75% height, with at least 20% transparent margin left/right and 12% top/bottom; no hair, hand, shoe or limb crosses these bounds. No basketball, text, props, floor, background or effects. Fully transparent background, crisp arcade sprite shading.
```

### `dribble`, frame 09 — generation `exec-aa733eac-7ba3-4ce5-bed4-886392ed4576`

```text
One isolated full-body transparent RGBA sprite of Dorian Mycel in a controlled low stationary dribble transition, viewed from his established right-facing three-quarter angle. Match the attached Dorian game reference and dribble atlas: compact athletic adult human man, warm medium-brown skin, clean-shaven, short dense vivid-purple curls, strong brows, purple Chicago Condas jersey and shorts with silver/lavender trim, dark knee pads, purple wristbands, purple/silver shoes. Correct natural anatomy: one head, two arms/hands, two legs/shoes. This is a newly authored intermediate frame distinct from the atlas: knees stay bent and torso compact, he rises a little from the deepest bounce while the near/right open hand guides the separate ball at shin-to-knee height in front, far arm balances behind, eyes track down and forward. Center whole figure on a square transparent canvas with clear gutters; nothing touches any image edge. No ball, text, props, floor, background, or effects. Match the polished 90s arcade sprite shading.
```

### `dribble-run`, frame 08 — generation `exec-5d1c7a47-5e4d-4f0a-891a-daf45e18676b`

```text
One isolated full-body transparent RGBA arcade-game sprite of Dorian Mycel sprint-dribbling, matching both references: compact athletic adult human male, warm medium-brown skin, clean-shaven, short dense vivid-purple curls, strong brows, purple Chicago Condas uniform with silver/lavender trim, dark knee pads, purple wristbands and purple/silver shoes. Correct human anatomy, two arms/hands, two legs/shoes. Right-facing low turbo-dribble stride, a genuinely new frame: torso pitched forward and low, right leg drives forward under the body while left leg stretches back, near hand open and reaching low-forward as it controls the separate ball, opposite arm counterbalances behind. Focused eyes face forward. Entire figure centered within a square canvas with visible transparent margin on every edge; no hair, hand or shoe touches or is cropped by canvas. Do not draw a ball, text, props, floor, background, or effects. Transparent background.
```

### `dribble-run`, frame 09 — generation `exec-7a8ab175-b6d1-46a0-bd4a-90775d6316c8`

```text
One isolated full-body transparent RGBA arcade-game sprite of Dorian Mycel sprint-dribbling, matching the supplied Dorian references: compact athletic adult human male, warm medium-brown skin, clean-shaven, short dense vivid-purple curls, strong brows, purple Chicago Condas uniform with silver/lavender trim, dark knee pads, purple wristbands and purple/silver shoes. Correct human anatomy, two arms/hands, two legs/shoes. Right-facing low turbo-dribble cycle, a new opposite stride to the reference: torso pitched forward and low, left leg drives forward beneath him while right leg stretches behind, near/right hand reaches low-forward to control the separate ball, opposite arm counter-swings back. Eyes focused forward. Whole figure centered in a square transparent canvas, generous clear gutter on all sides, no cropping or edge contact. No basketball, text, props, floor, background, or effects. Transparent background.
```

### `dribble-run`, frame 10 — generation `exec-6ea6b03e-59e1-4d6b-a0b0-8bb0d84b592a`

```text
One isolated full-body transparent RGBA arcade-game sprite of Dorian Mycel in a low-speed crossover transition while sprint-dribbling, matching the supplied Dorian references: compact athletic adult human male, warm medium-brown skin, clean-shaven, short dense vivid-purple curls, strong brows, purple Chicago Condas uniform with silver/lavender trim, dark knee pads, purple wristbands and purple/silver shoes. Correct natural human anatomy: one head, two arms/hands, two legs/shoes. This is a distinct third new intermediate frame for the low dribble-run cycle: keep torso forward and low; bring both feet closer beneath the hips as he changes direction; cross the near hand low in front of his body toward the other side, with the opposite arm bent and counterbalancing. Rightward gaze and compact stance. Center the complete figure in a square transparent canvas with clear space around hair, hands and shoes; do not crop or touch edges. No basketball, text, objects, floor, background, or effects. Transparent background, polished 90s arcade sprite shading.
```
