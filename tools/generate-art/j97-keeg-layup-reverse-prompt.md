# J.97 — Keeg reverse layup

## Generation record

- Athlete: Keeg (`keeg`), Moonmorel Hex; canonical identity in K.03.
- Action: `layup-reverse`, eight distinct poses. Frame 4 is the high reverse-side peak before release; frame 5 releases at simulation tick 12.
- Direction: original right-facing art; K.03 approves mirroring.
- Image-generation time (UTC): 2026-10-24 00:03 UTC.
- Generation ID: `exec-0aa3a988-6dc5-48ea-8115-48924eb1e7c4`.
- Raw source: `tools/generate-art/sources/j97-keeg-layup-reverse-generated-raw.png` (1536×1024 RGBA), SHA-256 `017b3081a0097a608bf67777e5d4a85c439a466e0da0732597543bbaef640086`.
- Initial review: eight distinct poses, eight separate alpha-connected bodies; all hats, ornaments, limbs and shoes remain in-bounds. Final cleanup, atlas packaging, anatomical review and both-facing runtime review are pending.

## Verbatim generation prompt

```text
Create one original true-transparent RGBA sprite sheet for JAMVERSE '96: Keeg's right-facing reverse layup. Keeg is the canonical Moonmorel Hex athlete: a flamboyant adult human man with normal athletic human anatomy, black hair, a neatly trimmed close black beard, and an extremely tall complete ornate purple witch hat with silver trim and small mushroom ornaments. His clothing is layered lavender, purple and silver Moonmorel Hex athletic kit with belts, rings and restrained occult detailing. Preserve the same face, close beard, black hair, very tall hat silhouette and height, mushroom ornaments, human proportions, shoes, palette and crisp chunky 1990s arcade pixel-art sprite style in all eight drawings. Do not make him a wizard caricature or change his hat, face, body, or uniform.

Draw exactly eight separate complete right-facing three-quarter full-body Keeg poses, strict four columns by two rows, row-major. Each cell contains one independently drawn original pose at identical scale and camera view. Use a clean transparent RGBA canvas with generous transparent gutters and wide outer margins, especially above the tall hat. Keep his entire hat, all limbs and shoes inside the cell. No figure touches/crosses a cell boundary or overlaps another. No scenery, floor, hoop, shadow, glow, grid, labels, text, border or other character.

This is a reverse-side layup, not a regular layup or dunk. Show one mechanically connected compact takeoff, torso rotation, reverse-side overhead finish and landing sequence as he crosses beneath the hoop. The basketball is rendered separately by the game: never draw a ball, sphere, seams, orb, or object. His natural human hands mime the ball position but remain visibly empty and distinct. Keep the very tall hat intact and visible through every shoulder turn.

Pose order is tied to the runtime: pose 4 (fifth cell) is the high reverse-side peak and preparation; Keeg is still holding the invisible ball. Pose 5 (sixth cell) is the sole release at simulation tick 12; after that his hands are empty. Make all poses clearly distinct:
0. Low, controlled approach toward the right along the baseline, knees flexed and hands empty near waist.
1. Gather while moving right, knees bend, hands close together at chest height as if securing the invisible ball.
2. Plant and begin taking off under the rim; turn shoulders and head to show the reverse-side rotation without hiding or deforming the hat.
3. Rise across the lane, rotate the torso naturally; bring the shooting hand beside the hat, ball-miming hand still empty.
4. High airborne reverse-side peak before release, chest partly turned away, head looking over shoulder toward the target, far-side shooting hand cocked safely beside and just above the rear edge of the hat; invisible ball remains gathered in that empty hand position.
5. RELEASE at the peak at tick 12: extend the far-side arm up and back over the shoulder toward the reverse side of the rim with an open empty hand and clear wrist snap. Do not put fingers, wrist or arm through the hat. This is the only release pose.
6. Empty-handed follow-through as Keeg descends beyond the rim; extended arm relaxes, knees tuck naturally, hat remains whole.
7. Land balanced on both feet with flexed knees and recover to an upright ready stance.

Keep the movement athletic and anatomically sound with two arms, two legs, two hands and two shoes in every complete drawing. Preserve his adult human face, beard and readable purple hat details. Output only the sprite sheet with real alpha transparency, clean pixel edges and no exterior matte or speckles.
```
