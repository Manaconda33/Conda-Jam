# J.58 — Paprika tomahawk dunk

## Generation and source review

- Athlete: Paprika (`paprika`), canon K.02.
- Clip: fifteen right-facing `dunk-tomahawk` poses. Runtime timing uses takeoff tick4, grab tick10, peak tick14, release tick21, finish tick23, and landing tick30.
- Image generation: `exec-e669c77d-0519-435b-9482-048329501431`.
- The accepted RGBA source has fifteen separate complete figures in row-major 5×3 order. All poses retain Paprika's short four-legged fox anatomy, russet/cream coat, pale-tipped bushy tail, large ears and purple/gold vest. The near forepaw makes a compact overhead-to-downward tomahawk arc; it stays attached at the shoulder and does not become a human arm. The separate gameplay ball and hoop are absent.
- `clean-alpha-fringe.py` cleared no connected exterior red pixels and set the four outermost image edges transparent. Dark/light source review showed distinct figures and clean transparent gutters.
- The original generated image is preserved as `tools/generate-art/sources/j58-paprika-dunk-tomahawk-generated-raw.png`; the accepted source is `tools/generate-art/sources/j58-paprika-dunk-tomahawk15.png`. Source rectangles and atlas crops are recorded in `paprika-dunk-tomahawk15-layouts.json`.
- No retries were rejected for this checkpoint.

## Verbatim generation prompt

```text
Create one original transparent RGBA production sprite atlas for JAMVERSE ’96: Paprika Rill’s DUNK-TOMAHAWK, using the two reference sheets only to keep her exact identity and game art style consistent. Do not copy the references’ actions.

Paprika is the same tiny, natural four-footed kit fox in every pose: low horizontal body, russet-orange fur, cream muzzle/chest/underside, very large triangular ears, bright fox eyes, pointed muzzle, full bushy tail with pale tip, and fitted purple-and-gold basketball vest. Preserve her compact proportions and short real fox legs and paws. She is never humanoid, anthropomorphic, upright, or bipedal: no human arms, hands, fingers, shoes, or added clothing.

Make exactly 15 distinct complete full-body poses, strict 5-column by 3-row grid, left-to-right then top-to-bottom, on a 1536×1024 canvas. One complete Paprika per position. Same size and right-facing three-quarter gameplay camera throughout. Keep every ear, paw, muzzle and tail tip inside broad transparent gutters. True transparent alpha-zero outside each figure. Crisp chunky 1990s arcade pixel art with clean dark-brown/near-black outlines directly against fur. No clipping, overlap, fused figures, duplicate poses, red/coral/pink exterior fringe, haze, floor, shadow, glow, background, border, grid lines, text or effects. Keep a stable ground baseline; gameplay supplies jump elevation.

This is a TOMAHAWK DUNK: show one strong overhead-to-downward strike with the near forepaw while Paprika stays a compact horizontal quadruped. The paw makes a short, natural arc from beside her muzzle, high over the near ear, briefly cocked back behind her head/shoulder, then snapping forward and down toward the imaginary rim. The far forepaw, all four short legs, torso and tail counterbalance naturally. Let her head and eyes track the invisible game ball. The paw is always attached at the shoulder and bent close to her chest; never stretch or lengthen the leg, invent a human arm, rotate her body upright, or make a windmill circle. The basket and basketball are rendered separately by gameplay and MUST NOT appear in the art. No hoop.

Exact row-major sequence: frame0 alert compact four-paw approach; frame1 plant and crouch, gather the invisible ball by muzzle; frame2 takeoff with hind paws pushing from ground; frame3 airborne, near forepaw lifts beside cheek; frame4 short paw arcs above near ear; frame5 cocked tomahawk pose with paw behind head and close to shoulder, legs tucked naturally; frame6 compact peak preparation, muzzle follows the invisible ball; frame7 highest point with paw cocked above/behind ear and tail balancing; frame8 shoulder and head turn slightly toward the rim, paw still compact; frame9 fast short forepaw strike swings forward and down; frame10 release pose toward imaginary rim, with only a natural short-paw flick beside muzzle; frame11 immediate scoring follow-through, paw folds back toward chest; frame12 descend while untwisting, all four paws begin opening toward landing; frame13 extend short paws for a four-footed landing; frame14 fully grounded, compact alert stance facing right. Make frames4–11 clearly read as one overhead-to-downward tomahawk motion, distinct from a windmill, reverse dunk, or straight power dunk. No ball or hoop. Return only the clean transparent RGBA atlas.
```
