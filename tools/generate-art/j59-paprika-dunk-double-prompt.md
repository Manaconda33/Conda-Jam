# J.59 — Paprika double-pump dunk

## Generation and source review

- Athlete: Paprika (`paprika`), canon K.02.
- Clip: fifteen right-facing `dunk-double` poses. Runtime timing uses takeoff tick4, grab tick10, peak tick14, release tick21, finish tick23, and landing tick30.
- Image generation: `exec-1863deea-0382-4146-bb5f-51b0353c6ef3`.
- The accepted RGBA source contains fifteen distinct complete fox figures in strict 5×3 order. Frames3–9 show the first paw lift, low fake, and second rise as a high/low/high rhythm. Paprika keeps her short quadruped legs, russet/cream fur, pale-tipped tail, large ears, and purple/gold vest. No ball or hoop is drawn.
- `clean-alpha-fringe.py` cleared no connected exterior red pixels and set the four outermost image edges transparent. The source was inspected on dark and light backgrounds; all figures remain separate and in bounds.
- The original generated image is preserved as `tools/generate-art/sources/j59-paprika-dunk-double-generated-raw.png`; the accepted source is `tools/generate-art/sources/j59-paprika-dunk-double15.png`.
- No retries were rejected for this checkpoint.

## Verbatim generation prompt

```text
Create one original transparent RGBA production sprite atlas for JAMVERSE ’96: Paprika Rill’s DUNK-DOUBLE. Use the reference sheets to preserve her exact canon and game pixel-art style, but create a new action sequence.

Paprika is the same tiny, natural four-footed kit fox in every pose: low horizontal body, russet-orange fur, cream muzzle/chest/underside, very large triangular ears, bright fox eyes, pointed muzzle, full bushy tail with pale tip, and fitted purple-and-gold basketball vest. Preserve her compact proportions and short real fox legs and paws. She is never humanoid, anthropomorphic, upright or bipedal: no human arms, hands, fingers, shoes, or added clothing.

Create exactly 15 distinct complete full-body poses in a strict 5-column by 3-row grid, left-to-right then top-to-bottom, on a 1536×1024 canvas. One Paprika per cell, same scale and right-facing three-quarter gameplay view. Keep ears, paws, muzzle and tail tip within broad transparent gutters. True alpha-zero transparent background outside the figures. Crisp chunky 1990s arcade pixel art with clean dark-brown/near-black outlines. No clipping, overlap, fused or duplicated figures, red/coral/pink exterior fringe, haze, floor, shadow, glow, background, border, grid lines, text or effects. Keep a stable baseline; gameplay supplies jump height.

This is a DOUBLE-PUMP DUNK with two distinct upward paw pumps during one leap: Paprika first raises the near forepaw above her ear, pulls it back down toward her cheek/muzzle for a compact fake, then drives that same short paw high again before the final forward release. Keep her horizontal fox body compact. Her head/muzzle tracks the invisible ball; the far paw, hind legs and bushy tail balance her. The forepaw remains attached at the shoulder, with naturally short bent-leg proportions. Do not extend into a human arm, rise upright, spin her body, circle the paw like a windmill, or turn it into a tomahawk. The basketball and hoop are separate gameplay objects and MUST NOT appear in the sprites.

Exact row-major sequence: frame0 alert four-paw approach; frame1 plant and gather the invisible ball by muzzle; frame2 takeoff as hind paws push off; frame3 first upward paw lift beside the cheek; frame4 first pump reaches above the near ear; frame5 first fake pulls the paw down close beside the muzzle; frame6 compact midair tuck, head still follows the ball; frame7 second pump starts, short paw rises again; frame8 second high extension at the peak, with tail balancing; frame9 body leans toward the rim and the paw prepares the final drive; frame10 compact forward paw-and-muzzle release toward the imaginary rim; frame11 scoring follow-through, paw folds close to chest; frame12 descend and untwist; frame13 extend all four short paws toward landing; frame14 fully grounded, compact alert stance facing right. Make both pumps clear and separate in frames3–9, with a visible high-low-high rhythm; no full rotation and no circular windmill. No ball or hoop. Return only the clean transparent RGBA atlas.
```
