# J.36 action 06 — Reed Ashcroft and Juniper Vale, pickup

Create an original five-pose right-facing pickup clip for each Chicago Condas athlete. The required clip maps source poses0–4 to runtime frames0–4; frame3 is the marked floor-contact grab at tick7. The separate game basketball is rendered by the simulation.

## Acceptance and integration

Each accepted source is transparent RGBA with five complete isolated bodies in a 3-column × 2-row sheet, strict row-major order and an empty bottom-right slot. All five silhouettes are complete and in bounds. Hands remain empty; no basketball is baked into the sprite. Component ownership removes neighboring components from intersecting crop rectangles without redrawing poses. The accepted frame3 places the lead hand at court level. All five decoded atlas frames must be unique.

| Athlete | Cell | Accepted source | Source SHA-256 | Packed atlas |
|:--|--:|:--|:--|:--|
| Reed Ashcroft | 0 | `reed-ashcroft-pickup5-candidate1.png` (1536×1024) | `11d8ac99e53323ac067e6b1bd4d5092f851fd24d8e629fdac9353386c3403b6e` | `reed-ashcroft-pickup-right.webp` (288×192) |
| Juniper Vale | 1 | `juniper-vale-pickup5-candidate1.png` (1536×1024) | `513447530582fd197a7b9fd87815d48de212e55f4fe0e0a582779fdd76e21b3a` | `juniper-vale-pickup-right.webp` (288×192) |

## Reed Ashcroft — supporting cell0

Exact accepted generation prompt:

```text
Create an original transparent RGBA sprite sheet with exactly five distinct complete full-body drawings of Reed Ashcroft, Chicago Condas supporting athlete cell0. Use the attached Reed portrait and isolated gameplay sprite as strict identity references; use the clean standard-pass atlas for game-sprite scale, style and uniform only, not pose copying. Preserve medium-brown skin, dark eyes and brows, small dark goatee, dark-purple/black braids swept into a high topknot, young-adult natural human athletic proportions, purple-and-gold Condas uniform, white lower-leg wear and matching shoes. No glasses, gray beard, crest, cape, scarf, armor, animal traits, extra jewelry, props or fantasy anatomy. Plain blank uniform fabric with gold/purple trim only: absolutely no jersey numbers, digits, lettering, badges or text. Arrange exactly five different complete figures in a 3-column by 2-row sheet, strict row-major order; the final bottom-right cell is empty and transparent. Use right-facing three-quarter full-body view in every pose, consistent scale and foot baseline. Transparent background; each complete silhouette isolated with clear gutters. No cropping, clipping, overlap, touching or fused figures. The game basketball is rendered separately: no ball or object in or near either hand in any frame. Pose sequence: frame0 notices a loose ball near the court and takes a small step toward it, knees begin to bend and focused eyes look down; frame1 crouches lower with a forward lean, lead hand opens and reaches down while the other arm balances; frame2 sinks into a deep athletic squat and extends the lead arm toward the floor with fingers open, weight shifting over the lead foot; frame3 is the clearly marked pickup contact pose: fingertips and open hand reach the floor where the unseen game ball would be, with knees flexed and free arm balancing, but the hands remain visibly empty and no ball is drawn; frame4 rises from the squat and draws the still-empty lead hand toward the waist, settling into a balanced possession stance. Each pose is independently articulated, anatomically natural, complete and visibly distinct. No ground, floor, cast shadow, glow, checkerboard, text, numbers, logos, panels, borders, grid lines or extra people.
```

Generation and review record:

- Image generation `exec-8ca18105-efab-47a1-b168-03bbe1dbcc33`; generated `2026-10-23T03:13:28.491780584Z`; C2PA claim `urn:c2pa:36f642e7-d69d-4b98-b20b-1f36fadf1f6f`; XMP instance `xmp:iid:c9bc5aca-9a7c-4f69-b820-f5531524264b`.
- References: `tools/generate-art/references/reed-ashcroft-portrait-reference.png`, `tools/generate-art/references/reed-ashcroft-gameplay-reference.png`, `public/assets/animation/reed-ashcroft-pass-right.webp`.
- Review: Visually reviewed raw transparent source on light and dark grounds. The 3×2 sheet contains five complete distinct original bodies in row-major order, with the bottom-right cell empty. Canonical skin, face, hair, build and uniform identity are preserved; both hands remain empty with no numbers or logos. Frame3 is the marked floor-contact pickup pose. Alpha>=64 connected-component review identifies exactly five complete figures; none touches or clips the source edge. No pose is redrawn, copied or mirrored.

## Juniper Vale — supporting cell1

Exact accepted generation prompt:

```text
Create an original transparent RGBA sprite sheet with exactly five distinct complete full-body drawings of Juniper Vale, Chicago Condas supporting athlete cell1. Use the attached portrait as strict identity reference and her clean standard-pass atlas for game-sprite scale, style and uniform only; do not copy its poses. Preserve light warm skin, dark eyes, focused adult face, abundant dark-purple curls gathered high with the small gold tie, compact natural human athletic proportions, dark-purple basketball uniform with gold trim, dark knee pads and matching shoes. Crucial uniform rule: jersey and shorts are plain blank fabric with trim only. Absolutely no numerals, digits, lettering, logos, badges or text anywhere. No pointed ears, fantasy anatomy, glasses, extra jewelry, armor or props. Arrange exactly five different complete figures in a 3-column by 2-row sheet, strict row-major order; the final bottom-right cell is empty and transparent. Right-facing three-quarter full-body view in every pose, same scale and camera. Transparent background; complete silhouettes isolated with clear gutters. No clipping, cropping, overlap, touching or fused figures. The game basketball is rendered separately: no ball, circle or object is drawn in or near either hand in any frame. Pose sequence: frame0 notices a loose ball near the court and takes a small step toward it, knees begin to bend and focused eyes look down; frame1 crouches lower with a forward lean, lead hand opens and reaches down while the other arm balances; frame2 sinks into a deep athletic squat and extends the lead arm toward the floor with fingers open, weight shifting over the lead foot; frame3 is the clearly marked pickup contact pose: fingertips and open hand reach the floor where the unseen game ball would be, with knees flexed and free arm balancing, but the hands remain visibly empty and no ball is drawn; frame4 rises from the squat and draws the still-empty lead hand toward the waist, settling into a balanced possession stance. Each pose is independently articulated, anatomically natural, complete and visibly distinct. No ground, floor, cast shadow, glow, checkerboard, text, numbers, logos, panels, borders, grid lines or extra people.
```

Generation and review record:

- Image generation `exec-7a728f46-6d69-49da-bae3-93c5c66d9d26`; generated `2026-10-23T03:14:12.968092472Z`; C2PA claim `urn:c2pa:716fda8b-b288-48c2-bcc2-13c2f16d5144`; XMP instance `xmp:iid:851fd1cd-080f-4319-8724-e075cbb5d74d`.
- References: `tools/generate-art/references/juniper-vale-portrait-reference.png`, `public/assets/animation/juniper-vale-pass-right.webp`.
- Review: Visually reviewed raw transparent source on light and dark grounds. The 3×2 sheet contains five complete distinct original bodies in row-major order, with the bottom-right cell empty. Canonical skin, face, hair, build and uniform identity are preserved; both hands remain empty with no numbers or logos. Frame3 is the marked floor-contact pickup pose. Alpha>=64 connected-component review identifies exactly five complete figures; none touches or clips the source edge. No pose is redrawn, copied or mirrored.

## Runtime and visual validation

The registered `pickup` clip has five frames with durations `[2,3,2,1,4]`; `grab` marks frame3 at tick7. The separate ball tracks reach forward18 for Reed and16 for Juniper at height0 on the floor-contact pose. The ball rises with each athlete’s hand on the final pose.

Light/dark atlas contact sheets are under `artifacts/asset-review/j36/*-pickup-atlas-review.png`. Standard and zoom120 native Canvas previews each load118 images and capture87 snapshots per athlete. All five poses select production art in both facings; the frame3 ball tracks meet the floor-level hand. Captures are under `artifacts/native-render-preview/{reed-ashcroft,juniper-vale}{,-zoom120}`.
