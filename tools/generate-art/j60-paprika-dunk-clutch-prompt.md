# J.60 — Paprika clutch dunk

## Generation and source review

- Athlete: Paprika (`paprika`), canon K.02.
- Clip: fifteen right-facing `dunk-clutch` poses. Runtime timing uses takeoff tick4, grab tick10, peak tick14, release tick21, finish tick23, and landing tick30.
- Image generation: `exec-ae288a59-cca9-4290-b44b-11d1ef187e0d`.
- The accepted RGBA source has fifteen distinct complete fox figures in 5×3 row-major order. Frames3–8 keep both short forepaws tucked against her chest beneath the muzzle; one compact paw/muzzle release follows. Paprika's short legs, russet/cream fur, large ears, pale-tipped tail and purple/gold vest remain consistent.
- `clean-alpha-fringe.py` cleared no connected exterior red pixels and set the outermost image edges transparent. Dark/light source review confirms all figures remain isolated, complete and in bounds. No ball or hoop is drawn.
- The original generated image is preserved as `tools/generate-art/sources/j60-paprika-dunk-clutch-generated-raw.png`; the accepted source is `tools/generate-art/sources/j60-paprika-dunk-clutch15.png`.
- No retries were rejected for this checkpoint.

## Verbatim generation prompt

```text
Create one original transparent RGBA production sprite atlas for JAMVERSE ’96: Paprika Rill’s DUNK-CLUTCH. Use the reference sheets only to preserve her exact character identity and established game sprite style, not to copy their actions.

Paprika is the same tiny, natural four-footed kit fox in every pose: low horizontal body, russet-orange fur, cream muzzle/chest/underside, very large triangular ears, bright fox eyes, pointed muzzle, full bushy tail with pale tip, and fitted purple-and-gold basketball vest. Keep her compact proportions, short real fox legs and paws. Never make her humanoid, anthropomorphic, upright or bipedal: no human arms, hands, fingers, shoes or extra clothing.

Create exactly 15 distinct complete full-body poses in a strict 5-column by 3-row grid, left-to-right then top-to-bottom, on a 1536×1024 transparent canvas. One Paprika per cell; same scale and right-facing three-quarter gameplay camera. Leave wide clean transparent gutters, keep every ear, paw, muzzle and tail tip in bounds, alpha zero outside the figures. Crisp chunky 1990s arcade pixel art with clean dark-brown/near-black outlines. No clipping, overlap, fused figures, duplicates, red/coral/pink exterior fringe, haze, floor, ground shadow, glow, background, border, grid lines, text or extra effects. Stable baseline; the game supplies jump elevation.

This is a DUNK-CLUTCH: Paprika protects the invisible gameplay ball tightly against her chest with her two short forepaws folded naturally below the muzzle while rising. Her body curls compactly around the ball; her ears, muzzle and eyes stay visible above her paws, and her bushy tail counterbalances behind. She gathers at the muzzle, tucks both forepaws close around the invisible ball for several frames at the peak, then makes one short forward/downward paw-and-muzzle release. Do not draw the ball. Do not stretch either foreleg, form human hands, cover her face, stand her upright, spin her body, make a windmill or two-pump action, or make a tomahawk swing. The hoop and basketball are separate gameplay objects and MUST NOT appear.

Exact row-major sequence: frame0 alert compact four-paw approach; frame1 plant and gather the invisible ball by muzzle; frame2 hind paws push off as she takes flight; frame3 lift both forepaws and pull them close under the muzzle; frame4 curl the compact body around the invisible ball; frame5 secure the clutch against the chest with muzzle above both paws; frame6 tuck tighter, keeping short forelegs and all four legs distinct; frame7 peak, hold the protective clutch and let tail counterbalance; frame8 begin uncurling, paws still close to chest; frame9 bring muzzle and near paw forward in preparation for release; frame10 compact paw-and-muzzle release toward the imaginary rim; frame11 immediate scoring follow-through with forepaws folding back; frame12 descend and open the body; frame13 extend all four short paws for landing; frame14 grounded compact alert stance facing right. Make frames3–8 clearly read as a secure, close-to-chest clutch, followed by one short release, distinct from power, windmill, reverse, 360, tomahawk and double-pump dunks. No ball, hoop or rim. Return only the clean transparent RGBA atlas.
```
