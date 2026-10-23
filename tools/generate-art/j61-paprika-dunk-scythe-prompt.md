# J.61 — Paprika scythe dunk

## Generation and source review

- Athlete: Paprika (`paprika`), canon K.02.
- Clip: fifteen right-facing `dunk-scythe` poses. Runtime timing uses takeoff tick4, grab tick10, peak tick14, release tick21, finish tick23, and landing tick30.
- Image generation: `exec-135864b6-34c2-4aca-bb8b-1bef5d3580d5`.
- The source contains fifteen separate full-body fox components in strict 5×3 row-major order. The 2-pixel padded source rectangles of the final bottom-row pair overlap by one pixel, while their alpha components remain separate; the component-aware packer assigns antialiased edge pixels to the nearest figure without inventing pose pixels. The packed atlas was inspected on dark and light backgrounds.
- `clean-alpha-fringe.py` cleared no connected exterior red pixels and set the outermost image edges transparent. Paprika remains quadrupedal with short natural legs, russet/cream fur, large ears, pale-tipped tail and purple/gold vest; there is no weapon, ball or hoop.
- The original generation is preserved as `tools/generate-art/sources/j61-paprika-dunk-scythe-generated-raw.png`; the accepted source is `tools/generate-art/sources/j61-paprika-dunk-scythe15.png`. Its exact prompt, component map, packed layout and provenance are recorded here and in `paprika-dunk-scythe15-{layouts,provenance}.json`.

## Verbatim generation prompt

```text
Create one original transparent RGBA production sprite atlas for JAMVERSE ’96: Paprika Rill’s DUNK-SCYTHE. Use the reference sheets only to preserve her exact fox identity and game sprite style; create a new action.

Paprika is the same tiny, natural four-footed kit fox in every pose: low horizontal body, russet-orange fur, cream muzzle/chest/underside, very large triangular ears, bright fox eyes, pointed muzzle, full bushy tail with pale tip, and fitted purple-and-gold basketball vest. Preserve her compact proportions, short real fox legs and paws. She is never humanoid, anthropomorphic, upright or bipedal: no human arms, hands, fingers, shoes, weapons or added clothing.

Create exactly 15 distinct complete full-body poses in a strict 5-column by 3-row grid, left-to-right then top-to-bottom, on a 1536×1024 transparent canvas. One Paprika in each cell, same scale and right-facing three-quarter gameplay camera. Keep each complete body in bounds with wide transparent gutters and alpha zero outside the foxes. Crisp chunky 1990s arcade pixel art with clean dark-brown/near-black outlines. No clipping, overlap, fused figures, duplicate poses, red/coral/pink fringe, haze, floor, shadow, glow, background, border, grid lines, text or effects. Stable ground baseline; gameplay supplies jump elevation.

This is a DUNK-SCYTHE: while Paprika's low horizontal body remains compact and quadrupedal, her short near forepaw makes one tight diagonal crescent sweep from low beside the chest/back toward high above the muzzle and near ear, then cuts forward/down to the imaginary rim. Her head and eyes track the separate invisible ball. Her far forepaw, four short legs and pale-tipped tail balance the jump. Keep the near leg attached at its shoulder and visibly short; bend the paw close to the torso so it never becomes a long arm or blade. Do not draw a weapon, ball or hoop. Do not spin the full body, swing a circular windmill, do a vertical tomahawk stroke, or add repeated double pumps. The basketball is rendered separately by gameplay and MUST NOT appear.

Exact row-major sequence: frame0 compact alert four-paw approach; frame1 plant and gather invisible ball by muzzle; frame2 hind paws push off for takeoff; frame3 near paw tucks low beside chest as her body lifts; frame4 shoulder turns slightly and paw sweeps back beside the torso; frame5 paw traces a short diagonal path beneath/behind the chest, all paws remain short and visible; frame6 near paw rises diagonally across the chest toward the shoulder; frame7 compact C-shaped paw sweep climbs beside the cheek and ear; frame8 high point with the near paw above/forward of the muzzle, tail counterbalances; frame9 one quick diagonal cut toward the imaginary rim; frame10 compact paw-and-muzzle release at the rim lane; frame11 immediate aerial follow-through with paw folded back near chest; frame12 descend and untwist; frame13 extend four paws toward landing; frame14 grounded alert four-paw stance facing right. Make frames4–9 read as one diagonal crescent, not a full circle; frames10–11 complete the short release. Keep the face readable. No ball, weapon or hoop. Return only the clean transparent RGBA atlas.
```
