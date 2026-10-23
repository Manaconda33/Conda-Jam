# J.56 — Paprika reverse dunk

## Generation and source review

- Athlete: Paprika (`paprika`), canon K.02.
- Clip: fifteen right-facing `dunk-reverse` poses using shared takeoff, grab, peak, release, finish, and land markers at frame indices 2, 5, 7, 10, 11, and 14.
- The basketball is a separate gameplay object. Paprika remains a compact, low, four-footed fox; the reverse action comes from her shoulder and head turn with a short bent forepaw.
- Accepted marker-alignment edit: `exec-98987b5d-d9d3-437d-a64c-6b2faeba0ca8`, based on edge-cleanup candidate `exec-8d9f1c76-3a1a-4ccc-9be1-ef58c394c77d`, itself based on pose-turn candidate `exec-43fcd02e-076e-4bf4-8bc1-4b11d8cba98a`.
- Pose-turn candidate `exec-43fcd02e-076e-4bf4-8bc1-4b11d8cba98a` was an edit of `exec-0ddd1cbc-f4f9-4325-92b6-f74886f6ec68`; it turned Paprika's body and head through the reverse arc while retaining short fox limbs. The accepted edit corrected frames 10–12 to align with the shared release, finish, and descent markers.
- The accepted sheet receives the conservative edge pass from `clean-alpha-fringe.py`: only strongly red pixels connected to transparent background are cleared, plus stray pixels on the four outermost image edges. The pass clears 834 fringe pixels and leaves the dark outline and interior fur intact.
- The final 15 source figures pass the component-isolation check in exact 5×3 row-major order. Atlas crops are uniformly downscaled into fifteen 128×96 cells; the sixteenth cell remains transparent.
- No ball or hoop is drawn. Source and atlas are reviewed on light and dark backgrounds, with the fox's four-legged identity and the gameplay marker positions preserved.

## Rejected candidates

- `exec-cee7b301-d71a-427f-904f-750e4d6449d4` — initial source; the reverse motion read, but the near foreleg was too long and a bright red fringe surrounded the silhouettes. Preserved as `sources/j56-paprika-dunk-reverse-attempt1-rejected-red-halo.png`.
- `exec-5590757d-e450-4f70-a506-2f041d0b84ca` — edge-cleanup edit; it retained the long foreleg and red fringe, so it was rejected. Preserved as `sources/j56-paprika-dunk-reverse-attempt2-halo-cleanup-candidate.png`.
- `exec-0ddd1cbc-f4f9-4325-92b6-f74886f6ec68` — short-legged source; the action was too generic and frames 3–11 did not read clearly as a reverse dunk. Preserved as `sources/j56-paprika-dunk-reverse-attempt3-rejected-weak-reverse.png`.
- `exec-85471476-764c-4e73-b0da-7a8b36a7ef67` — anatomy edit of attempt 1; the reaching foreleg still read too long. Preserved as `sources/j56-paprika-dunk-reverse-attempt4-rejected-long-foreleg.png`.
- `exec-43fcd02e-076e-4bf4-8bc1-4b11d8cba98a` — action-turn candidate; it had the preferred compact limbs and readable body turn, but frames 10–12 did not align with the release, finish, and descent markers. Preserved as `sources/j56-paprika-dunk-reverse-attempt5-rejected-marker-timing.png`.
- `exec-8d9f1c76-3a1a-4ccc-9be1-ef58c394c77d` — fringe-cleanup edit of attempt 5; it retained the visible edge color and was superseded by the marker-alignment edit plus the local alpha sanitation step. Preserved as `sources/j56-paprika-dunk-reverse-attempt6-rejected-edge-fringe.png`.

## Pose-turn candidate prompt (`exec-43fcd02e-076e-4bf4-8bc1-4b11d8cba98a`)

```text
Refine this exact Paprika sprite sheet, preserving the complete 5×3 row-major grid, fifteen whole figures, same cell positions, scale, right-facing three-quarter camera, canon fox face/colors, vest, tail shape, ground baseline and short-legged quadruped anatomy.

Action correction: Frames 0–2 and 12–14 are already good and should remain nearly pixel-identical. In airborne frames 3–11, make the REVERSE DUNK clear through a compact torso/shoulder/head rotation. As Paprika rises, turn her shoulder line and vest back panel away from the imaginary rim, show more of the back of her fox torso at peak frames 6–8, and turn her head/muzzle back over the shoulder to track the separate invisible ball. The curled near forepaw stays short and close to the chest or cheek; it must not stretch over or beyond the ear tips. Do not make an arm shape. Keep both natural forelegs compact, like the existing grounded poses, and all hind legs/paws naturally tucked or trailing. At frame 7 she should be at the highest point with her back/shoulders clearly turned toward the basket direction. Frames 8–10 continue the behind-the-head route with a compact paw/muzzle flick, then frames 11–12 begin untwisting on descent. The ball is rendered by the game and must not appear. This should not read as a windmill, a forward dunk, or a generic straight jump.

Maintain Paprika's identity as a tiny real four-legged fox with low horizontal body, russet orange coat, cream muzzle/chest/belly, huge triangular ears, bright eyes, pointed muzzle, pale-tipped bushy tail and purple-gold vest. No humanoid anatomy, upright or biped stance, long arms, fingers, hands, shoes or extra clothing. Four real short fox legs with paws.

Correct the perimeter only as needed: outside any actual dark silhouette edge there must be clean transparent alpha 0, with no red/coral/magenta fringe or haze. Keep internal pink ear color and fur intact. Leave generous transparent gutters. No ball, hoop, scenery, floor, shadow, glow, text, border or grid overlay. Return same-size transparent RGBA atlas with exactly fifteen separate full fox poses.
```

## Accepted marker-alignment edit prompt (`exec-98987b5d-d9d3-437d-a64c-6b2faeba0ca8`)

```text
Edit only the bottom row of this exact Paprika dunk-reverse sheet; preserve its 5×3 layout, cell positions, 1620×971 canvas, character identity, short quadruped anatomy, art style and every figure outside the bottom-left, bottom-center and bottom-right cells.

The exact required marker timing is: bottom-left cell is frame 10 RELEASE; bottom-center cell is frame 11 FINISH immediately after release; bottom-right cell is frame 12 early descent. The last two cells in the bottom row are frame 13 landing approach and frame 14 grounded landing, and must remain unchanged.

In frame 10 (bottom-left), keep Paprika airborne with her body and shoulders still turned away from the imaginary right-side rim. Turn her head/muzzle back over the shoulder to track the invisible ball behind the crown. Give her one compact, short near-forepaw flick beside/just behind the ear as the release; the foreleg stays short and bent at her shoulder, never longer than the natural legs in the reference and never a human arm. Her four-legged fox silhouette must remain clear.
In frame 11 (bottom-center), show the immediate aerial scoring follow-through: the compact paw lowers behind the shoulder, her torso still trails the rim with the back partly toward camera, muzzle begins to untwist, and her tail balances.
In frame 12 (bottom-right), she drops away and untwists further, with all four short paws beginning to unfold toward landing.

Do not add a ball or hoop. Do not add fingers, a long arm, upright anatomy, extra legs, or human limbs. Do not change the first ten cells or the final two landing cells.

Keep a truly transparent background and clean dark-brown/near-black outlines directly at the fur edge, with no red/coral/magenta fringe or haze. Return the same transparent RGBA sheet, exactly fifteen separate full fox poses.
```
