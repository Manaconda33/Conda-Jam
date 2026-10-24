# J.98 — Keeg power dunk

## Generation record

- Athlete: Keeg (`keeg`), Moonmorel Hex; canonical identity K.03.
- Action: `dunk-power`; fifteen distinct poses. Pose10 is the one-hand release at simulation tick21.
- Direction: original right-facing art; K.03 approves body mirroring.
- Image-generation time (UTC): 2026-10-24.
- Generation ID: `exec-e7da59f6-70b5-4424-a581-50618d4898fe`.
- Raw image: `tools/generate-art/sources/j98-keeg-dunk-power-generated-raw.png` (1536×1024 RGBA), SHA-256 `9a68e2f1bd94498e47a079bc74412b0ee3fd257c93657c38ca1494b7e8b093a6`.
- Cleaned 5×3 source: `tools/generate-art/sources/j98-keeg-dunk-power15.png`, SHA-256 `e1a077991759d139ad74f17c5ecdb4ffa73fee8fbee0a604fd234b5716c601b2`.
- Initial visual review: fifteen connected complete figures, the complete tall hat remains present in every frame, and no baked-in basketball appears. Final atlas/play-scale/ball alignment review is in progress.

## Verbatim generation prompt

```text
Create an original 1536×1024 transparent RGBA production sprite sheet for JAMVERSE '96: Keeg of the Moonmorel Hex performing a power dunk. Five equal columns by three equal rows, strict row-major order, exactly fifteen distinct complete full-body athlete poses. Use the same athlete in every cell. Leave broad transparent gutters and outer margins; keep every part of the complete figure, especially the extremely tall hat and mushrooms, entirely inside its own cell. No overlap, no borders, no grid lines. No environment, court, hoop, floor, shadows, effects, text, label, opponent, teammate, or props.

Keeg is a flamboyant adult human man with natural adult athletic human anatomy, black hair, a neat close black beard, expressive face, and an extremely tall complete ornate purple witch hat with silver trim and small mushroom ornaments. His uniform is the layered purple/lavender/silver Moonmorel Hex athletic kit, belt and restrained occult detailing; matching purple/silver basketball shoes. Maintain his identity, normal human proportions, facial hair, full hat height/silhouette, mushrooms, palette, and game-sprite scale in all fifteen drawings. He is not a monster or nonhuman; no robe, cape, staff, extra fingers, horns, or beard changes. Keep all hands empty. The actual basketball is drawn separately by the game: NEVER draw any ball, sphere, orb, seams, hoop or held object.

Draw a connected, mechanically sound right-facing one-handed POWER DUNK. The sequence accelerates into a takeoff, raises the ball-miming hand beside and then above the tall hat without touching it, reaches an overhead peak, makes one clear extended release, follows through with empty hands, then descends and lands under control. Pose 10 (zero-based, eleventh cell) is the single dunk release at simulation tick 21; poses 0–9 have not released; poses 11–14 are empty-handed after release. All drawings are original distinct poses with stable scale and consistent anatomy:
0 balanced right-facing approach, ready stance, knees soft;
1 gather, hands close to waist, knees bend;
2 compact two-foot plant and deeper loading crouch;
3 explosive takeoff begins, hips and shoulders rising;
4 airborne drive, lead knee lifts, ball-miming hand rises from waist toward chest;
5 ascent continues, torso rotates toward the rim, hand carries invisible ball at shoulder level;
6 rise, elbows flex as the hand cocks above the shoulder and clear of the hat;
7 high takeoff peak, arm and wrist cock behind/above the hat with generous clear gap;
8 drive the empty ball-miming hand forward and up over the rim plane, body fully extended;
9 highest reach, open hand above the hat and extended toward the right;
10 RELEASE at peak at tick21: shooting arm fully extended high/right, palm and fingers open after one forceful downward dunk snap; this is the only release pose;
11 empty-handed dunk follow-through, arm continuing down and forward, other arm counterbalances;
12 empty-handed descent, torso lowers, legs begin to tuck;
13 controlled landing, knees flex, arms relax;
14 complete balanced grounded recovery, empty hands, ready stance.

Keep the right-facing direction consistent (Keeg looks and travels toward image-right). Show his full body and complete hat in every cell. Maintain clean transparent alpha-zero background with sharp readable silhouettes. Return only the sprite sheet.
```
