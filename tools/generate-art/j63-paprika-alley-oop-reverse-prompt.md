# J.63 — Paprika reverse alley-oop

## Generation and source review

- Athlete: Paprika (`paprika`), canon K.02.
- Clip: fifteen right-facing `alley-oop-reverse` poses. The lob is caught at frame5 / tick10; the reverse finish releases at frame10 / tick21, scores at tick23, and lands at tick30.
- Image generation: `exec-52f271e1-610a-421e-9ad4-56fcc0bb5f54`.
- The accepted RGBA sheet has fifteen distinct, complete fox figures in strict 5×3 row-major order. Paprika reaches for a teammate's invisible lob with her short forepaw and muzzle, secures it at her chest, and turns away from the rim for a single backward-over-shoulder reverse finish.
- `clean-alpha-fringe.py` cleared no connected exterior red pixels and set the outermost image edges transparent. Strict source inspection found fifteen distinct, complete, in-bounds bodies with nonoverlapping source bounds.
- The original generation is preserved as `tools/generate-art/sources/j63-paprika-alley-oop-reverse-generated-raw.png`; the accepted source is `tools/generate-art/sources/j63-paprika-alley-oop-reverse15.png`. Prompt, source map, packed layout and provenance are recorded in this file and `paprika-alley-oop-reverse15-{layouts,provenance}.json`.

## Verbatim generation prompt

```text
Create one original transparent RGBA production sprite atlas for JAMVERSE ’96: Paprika Rill’s ALLEY-OOP-REVERSE. Use the first reference only to preserve Paprika’s exact fox identity and fitted kit; use the second only to understand a reverse-side finish. Create new poses.

Paprika is always the same tiny natural four-footed kit fox: low horizontal compact body, russet-orange fur, cream muzzle/chest/underside, very large triangular ears, bright fox eyes, pointed muzzle, full bushy pale-tipped tail, and fitted purple-and-gold basketball vest. Preserve short real fox legs and paws. She is never humanoid, anthropomorphic, upright or bipedal: no human arms, hands, fingers, shoes, weapons, or added clothing.

Make exactly 15 distinct, complete full-body poses in strict 5-column by 3-row left-to-right, top-to-bottom order on a 1536×1024 transparent canvas. One fox per cell, same game scale and right-facing three-quarter starting view. Leave broad transparent gutters; keep every ear, paw, muzzle and tail tip fully in bounds. True alpha-zero transparency outside each figure. Crisp chunky 1990s arcade pixel art with clean dark-brown/near-black outlines. No clipping, overlap, fused or duplicate figures, red/coral/pink fringe, haze, floor, shadow, glow, backdrop, border, grid, text or effects. Stable ground baseline; gameplay supplies jump elevation.

This is an ALLEY-OOP-REVERSE: an invisible high lob from a teammate arrives while Paprika accelerates to the rim. She jumps, catches the lob with her short near forepaw and muzzle, secures it close to her chest, then turns her compact airborne body away from the imaginary rim and delivers one backward-over-shoulder reverse finish. Keep all four natural fox legs short and visible. Her far paw, hind legs and bushy tail counterbalance the turn. The ball and hoop are separate gameplay objects and must not appear; no passer or opponent.

Exact row-major sequence: frame0 four-paw approach while looking up for the lob; frame1 accelerate and lift the near paw; frame2 plant and push off with the hind paws; frame3 rise with both short forepaws reaching toward the unseen pass; frame4 track the lob with muzzle and near paw; frame5 catch and secure the pass beside the muzzle at tick10, paws still short and attached; frame6 draw it tightly beside the chest; frame7 reach the airborne peak, body begins turning away, tail counterbalances; frame8 rotate the shoulders and head toward a rear three-quarter view; frame9 turn the muzzle over the shoulder as the near paw carries the invisible ball behind the crown; frame10 release the reverse alley-oop at tick21 with one short backward paw-and-muzzle push; frame11 reverse scoring follow-through with the near paw folding back toward the chest; frame12 unwind and descend; frame13 extend all four paws toward landing; frame14 fully grounded, compact alert stance. Make catch frame5 unmistakable and frames8–11 read clearly as one backward reverse finish. Do not turn her upright, lengthen a fox leg into an arm, spin a full 360, or turn this into windmill, tomahawk, scythe, double-pump or clutch. Return only the clean transparent RGBA atlas.
```
