## Verbatim image-generation prompt

```text
Sprite-sheet specification: fifteen independent full-body figures on an actually transparent RGBA canvas, 5 columns × 3 rows. Return only the sheet. Every pixel outside the people is alpha 0; no colored backdrop, gradient, glow, shadow, floor, cell backgrounds, or effects. Each person is isolated with empty transparent gutters. No ball or sphere of any kind anywhere in the image; no basketball prop in hands. The basketball exists only as a separate game object and is not drawn.

JAMVERSE '96 right-facing POWER DUNK animation, Dorian Mycel, exactly fifteen different poses, row major. Use the two attached identity references. Dorian must remain the same compact adult human in every frame: warm medium-brown skin, clean shaven expressive face, strong brows, short dense vivid-purple curls, purple Chicago Condas jersey and shorts with silver/lavender trim, dark knee pads, purple wristbands, purple/silver shoes; exactly two arms, two hands, two legs, two shoes. Keep all figures inside canvas, same scale and identity. Clean bold outlined 1990s arcade pixel art.

One continuous explosive right-handed power dunk with empty hands miming the separate basketball: 0 low balanced approach, arms ready; 1 drives forward and bends knees; 2 cups empty hands at waist, plant; 3 last forward step; 4 pushes off and rises; 5 airborne gather, hands empty and close to chest; 6 ascends, right arm starts extension; 7 climbs, right empty hand overhead; 8 peak, right arm extended upward; 9 extends toward imaginary hoop outside image; 10 scoring hand-drive finish, empty hand; 11 airborne follow-through; 12 descends, legs extending; 13 balanced crouched landing; 14 upright recovery, arms settle. No hoop, court, floor, other person, text, number, logo, seam, prop, panel, border, or divider. Ensure frame 5 is empty-handed with absolutely no object between hands. Fifteen unique connected poses only.
```

Rejected generation `exec-2da9d47e-f0a0-44d9-8943-0439681c8071`: multiple figures touch/cross the canvas bottom edge (185 opaque edge pixels), clipping poses. Do not pack or use this candidate.
