# J.100 — Keeg reverse dunk

## Generation record

- Athlete: Keeg (`keeg`), Moonmorel Hex; canonical identity K.03.
- Action: `dunk-reverse`; fifteen distinct poses. Pose10 is the single release at simulation tick21.
- Direction: original right-facing art; K.03 approves body mirroring.
- Image-generation date (UTC): 2026-10-24.
- Generation ID: `exec-f54acfc6-8616-4a37-9dd2-e94b3ff41df7`.
- Raw image: `tools/generate-art/sources/j100-keeg-dunk-reverse-generated-raw.png` (1536×1024 RGBA), SHA-256 `ba73d07a1236e04851dbee582dc5400cf4af9f474afd5439db803aef87c0624e`.
- Cleaned 5×3 source: `tools/generate-art/sources/j100-keeg-dunk-reverse15.png`, SHA-256 `9ebb871c77d922933e9e30768370d1e2802d86e7d9ef96372220373b4a5e10a4`.
- Initial visual review: fifteen connected full-body poses; the back-facing reverse carry and far-side overhead finish are distinct. Atlas/runtime hand and ball review remains in progress.

## Verbatim generation prompt

```text
Create an original 1536×1024 transparent RGBA production sprite sheet for JAMVERSE '96: Keeg of the Moonmorel Hex performing a right-facing REVERSE dunk. Arrange exactly fifteen separate complete full-body Keeg poses in a strict five-column by three-row grid, row-major. Keep each pose entirely inside its own cell with broad transparent gutters and outer margins. Same scale, camera, anatomy and identity. No overlap, borders, scenery, court, hoop, floor, shadows, effects, text, labels, teammate, opponent or props.

Keeg is a flamboyant adult human man with normal athletic human anatomy, black hair, a neatly trimmed close black beard, an expressive face, and a very tall complete ornate purple witch hat with silver trim and small mushroom ornaments. He wears the layered purple/lavender/silver Moonmorel Hex athletic kit, belt and restrained occult detailing, plus matching purple/silver shoes. Preserve his face, adult human proportions, black hair, close beard, full hat height and silhouette, mushrooms, kit palette, and readable outline in every drawing. No monster anatomy, horns, robe, cape, staff, extra limbs or altered hat. Keep hands empty. The basketball is a separately rendered game object: never paint a ball, sphere, orb, seams, rim or prop.

This is an athletic reverse dunk, not a regular forward power dunk: Keeg turns his back/shoulder toward the rim during the flight, carries the invisible ball behind the far side of his very tall hat, then reaches backward over his shoulder and releases into the reverse side of the rim. Keep the entire hat visible and untouched by hand or ball in every pose. Pose 10 (zero based, eleventh cell) is the single empty-handed dunk release at simulation tick 21; poses 0–9 retain possession; poses 11–14 are empty-handed follow-through, landing and recovery. Fifteen unique connected poses:
0 balanced right-facing approach, knees soft, hands low;
1 gather and begin to load, the empty ball-miming hand near the waist;
2 deep crouch and two-foot plant, shoulders begin turning away from the rim;
3 explosive takeoff, torso rotates so the back/shoulder leads;
4 airborne ascent, legs lift, invisible ball swings from the near hip toward the far side;
5 carry the ball-miming hand behind the back at waist/shoulder level, torso turned away;
6 rise across the lane, arm sweeps behind the shoulder and alongside the hat with visible clearance;
7 high reverse-side cock, hand and wrist behind the far edge of the complete hat;
8 peak, torso turned away from the basket, elbow flexed and empty hand poised over the far shoulder;
9 coil into the backward finish, arm begins extending behind the shoulder, both hands empty;
10 RELEASE at peak at tick21: reverse-side arm reaches backward/high into the rim with palm open after the one-handed dunk; full hat remains unobstructed;
11 empty-handed arm follows through backward/down, other arm counterbalances;
12 descending under control, torso rotates back toward the court, legs tuck naturally;
13 controlled landing with knees flexed and arms lowering;
14 grounded, balanced recovery stance with empty hands.

Keep Keeg right-facing in the source sheet and moving toward image-right on approach. Preserve two arms, two legs, two natural hands and shoes in all poses. Return only one sharp, clean, truly transparent RGBA sprite sheet; no alpha haze, checkerboard, matte or speckles.
```
