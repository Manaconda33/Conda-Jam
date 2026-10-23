# J.62 — Paprika power alley-oop

## Generation and source review

- Athlete: Paprika (`paprika`), canon K.02.
- Clip: fifteen right-facing `alley-oop-power` poses. The incoming lob is caught at frame5 / tick10; the dunk releases at frame10 / tick21, scores at tick23, and lands at tick30.
- Image generation: `exec-6b1f6c37-f8ca-463e-83eb-db9869537e27`.
- The accepted RGBA sheet has fifteen isolated complete fox figures in strict 5×3 row-major order. Paprika looks up and reaches with a short natural forepaw, catches the separate lob with her muzzle/forepaw, gathers beside the chest, and makes a compact power finish without standing upright.
- `clean-alpha-fringe.py` cleared no connected exterior red pixels and set the outermost image edges transparent. Dark/light atlas review follows packing; source bounds are complete and nonoverlapping.
- The original generation is preserved as `tools/generate-art/sources/j62-paprika-alley-oop-power-generated-raw.png`; the accepted source is `tools/generate-art/sources/j62-paprika-alley-oop-power15.png`. Exact prompt, source map, packed layout and provenance are recorded in this file and `paprika-alley-oop-power15-{layouts,provenance}.json`.

## Verbatim generation prompt

```text
Create one original transparent RGBA production sprite atlas for JAMVERSE ’96: Paprika Rill’s ALLEY-OOP-POWER. Use the reference sheets only to preserve Paprika’s exact fox identity and established game pixel-art style, not to copy their actions.

Paprika is the same tiny natural quadruped kit fox in every pose: low horizontal body, russet-orange fur, cream muzzle/chest/underside, very large triangular ears, bright fox eyes, pointed muzzle, full bushy tail with pale tip, and fitted purple-and-gold basketball vest. Keep her tiny compact proportions and short real fox legs and paws. She is never humanoid, anthropomorphic, upright or bipedal: no human arms, hands, fingers, shoes or added clothing.

Make exactly 15 distinct complete full-body poses in strict 5-column by 3-row left-to-right, top-to-bottom order, on a 1536×1024 transparent canvas. One Paprika per cell, same scale and right-facing three-quarter gameplay view. Leave broad transparent gutters; keep every ear, paw, muzzle and pale tail tip inside the canvas. True alpha-zero transparency outside every figure. Crisp chunky 1990s arcade pixel art with clean dark-brown/near-black outlines. No clipping, overlap, fused or duplicated figures, red/coral/pink exterior fringe, haze, floor, ground shadow, glow, background, border, grid lines, text or effects. Same stable ground baseline; gameplay supplies jump elevation.

This is a POWER ALLEY-OOP: an invisible lob arrives from a teammate; Paprika jumps, catches it with her natural near forepaw and muzzle, gathers tight beside her chest, then makes one strong compact forward-and-up power dunk at the imaginary rim. The near forepaw stays short and attached at the shoulder; her far paw, hind legs and bushy tail counterbalance. Keep all four fox legs visible and natural. The separate game basketball and hoop MUST NOT appear in the sprites. Do not add a passer or opponent. Do not make a human arm, stand her upright, spin her, or turn this into a windmill, tomahawk, clutch, double-pump or reverse dunk.

Exact row-major sequence: frame0 alert four-paw run toward the incoming lob; frame1 accelerate and look upward, near paw begins to lift; frame2 plant and takeoff, hind paws push off; frame3 leap upward with both short forepaws reaching naturally toward the unseen pass; frame4 track the ball with muzzle and near paw; frame5 catch the lob at tick10, compactly secure it beside the muzzle with the short near paw; frame6 draw the invisible ball to the chest while continuing upward; frame7 peak with the ball gathered and tail balancing; frame8 begin a direct forward power arc toward the rim; frame9 stretch compactly into the lane with the near paw and muzzle aligned; frame10 release at tick21 with one short strong paw/muzzle push; frame11 airborne scoring follow-through, paw folds toward chest; frame12 descend and untwist; frame13 extend all four short paws toward landing; frame14 fully grounded compact alert stance facing right. Make the catch at frame5 and direct power finish at frames8–11 unmistakable. No drawn basketball, hoop, passer, person, weapon, scenery or effect. Return only the clean transparent RGBA atlas.
```
