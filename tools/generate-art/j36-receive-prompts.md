# J.36 action 05 — Reed Ashcroft and Juniper Vale, receive

Generate an original four-pose right-facing receive clip for each Chicago Condas athlete. The required `receive` clip maps source poses0–3 to runtime frames0–3; frame2 is the marked catch at tick4. The game basketball is rendered separately. Keep both hands empty in the generated art, and preserve the exact human identities, anatomy and uniform rules.

## Acceptance and integration

Each accepted source is a transparent RGBA 2×2 sheet with four isolated complete bodies in row-major order. Component ownership isolates existing antialias pixels when padded crop bounds intersect; it does not synthesize, copy, mirror or redraw poses. Tiny unrelated alpha specks below0.4% of the source area are discarded. All four decoded atlas crops must be unique. Frame2 is the chest-height catch pose; the separate game ball is attached to the athlete-specific hand track at the `grab` anchor.

| Athlete | Cell | Accepted source | Source SHA-256 | Packed atlas |
|:--|--:|:--|:--|:--|
| Reed Ashcroft | 0 | `reed-ashcroft-receive4-candidate1.png` (1380×1140) | `db671f39313f9bca36902999f95f466b69ed2eba01dc957f6388e40cf4b6bb1a` | `reed-ashcroft-receive-right.webp` (224×192) |
| Juniper Vale | 1 | `juniper-vale-receive4-candidate2.png` (1536×1024) | `036575d4a5180a6579d4f818453bedfbb397e09c3ad766481240f467db5045d4` | `juniper-vale-receive-right.webp` (192×192) |

## Reed Ashcroft — supporting cell0

Exact accepted generation prompt:

```text
Create an original transparent RGBA sprite sheet with exactly four complete full-body action drawings of Reed Ashcroft, Chicago Condas supporting athlete cell0. Use his attached portrait and gameplay sprite as strict identity references and the clean standard-pass atlas only for game-sprite scale and style. Preserve medium-brown skin, dark eyes and brows, small dark goatee, dark-purple/black braids swept into a high topknot, natural young-adult human athletic proportions, purple-and-gold Condas uniform, white lower-leg wear and matching shoes. No glasses, gray beard, crest, cape, scarf, armor, animal traits, extra jewelry or props. Use a right-facing three-quarter full-body view and arrange exactly four distinct complete figures in a 2-column by 2-row sheet, strict row-major order. Transparent background, each full silhouette completely visible and separate with clear gutters. No cropping, clipping, overlap, touching, fusion, ground, shadows, glow, text, numbers, logos, panels, borders, grid lines or extra figures. The game basketball is separate: absolutely no ball or object is drawn in or near either hand in any frame. Pose sequence: 0 track an incoming pass in a balanced stance with both empty hands open in front of the chest; 1 step toward the catch, extend both open hands slightly forward and up, eyes following the unseen pass; 2 marked catch frame: close both empty hands together at chest height as though securing the ball, elbows bend to absorb impact; 3 cushion the catch and draw both still-empty hands toward the chest while settling into a stable possession stance. Make frame2 clearly read as the catch, without drawing a ball. Keep face, hair, skin, build, clothing and scale consistent.
```

Generation and review record:

- Generated: `2026-10-23T02:57:50.584030732Z`; C2PA claim `urn:c2pa:37f708bb-82c2-495d-90c6-96ed1a6e873a`; XMP instance `xmp:iid:cff56559-87d2-4e88-a5aa-a0bbcc263fe4`.
- References: `tools/generate-art/references/reed-ashcroft-portrait-reference.png`, `tools/generate-art/references/reed-ashcroft-gameplay-reference.png`, `public/assets/animation/reed-ashcroft-pass-right.webp`.
- Review: Visually reviewed source on light and dark grounds. The 2x2 sheet has four complete distinct Reed Ashcroft poses matching canonical cell0 skin, face, hair, human build and Chicago Condas identity. Both hands stay empty and no jersey numerals appear. The bottom-left source pose (frame2) is the marked catch; the bottom-right pose cushions the catch. Alpha>=64 component review identifies four complete isolated bodies. The packer isolates original bodies and drops only non-body alpha noise; no pose is redrawn, copied or mirrored.

## Juniper Vale — supporting cell1

The first generated candidate is preserved whole as `juniper-vale-receive4-attempt1-rejected-jersey-numbers.png` and excluded from packing because visible jersey numerals violate her blank-kit canon.

Exact accepted generation prompt:

```text
Create an original transparent RGBA sprite sheet with exactly four complete full-body action drawings of Juniper Vale, Chicago Condas support athlete cell1. Use the attached portrait as strict identity reference and her clean standard-pass atlas for game-sprite scale, style and uniform; do not copy a pose. Preserve light warm skin, dark eyes, focused adult face, abundant dark-purple curls gathered high with the small gold tie, compact natural human athletic proportions, dark-purple basketball uniform with gold trim, dark knee pads and matching shoes. Crucial uniform rule: the jersey and shorts are plain blank fabric with gold trim only. Absolutely no numerals, number 3, digits, lettering, logos, badges or text anywhere. No pointed ears, fantasy traits, glasses, extra jewelry, armor or props. Use a right-facing three-quarter full-body view. Arrange exactly four distinct complete figures in a 2-column by 2-row sheet, strict row-major order. Transparent background; each full silhouette visible, isolated and separated by clear gutters. No cropping, clipping, overlap, touching, fusion, ground, shadows, glow, panels, borders, grid lines or extra figures. The game basketball is separate: no ball, circle or held object is drawn in or near either hand in any frame. Pose sequence: 0 track an incoming pass in a balanced stance with both empty hands open in front of the chest; 1 step toward the catch and extend both open hands slightly forward and up, eyes following the unseen pass; 2 marked catch frame: close both empty hands together at chest height as though securing the ball, elbows bend to absorb impact; 3 cushion the catch and draw both still-empty hands toward the chest while settling into a stable possession stance. Make frame2 clearly read as the catch without drawing a ball. Keep face, hair, skin, build, blank uniform and scale consistent.
```

Generation and review record:

- Generated: `2026-10-23T03:00:36.033058985Z`; C2PA claim `urn:c2pa:d04c3b01-9367-47fd-a74d-c5c41f163a6e`; XMP instance `xmp:iid:dbee373e-f2d7-4c36-932c-ad8df912c911`.
- References: `tools/generate-art/references/juniper-vale-portrait-reference.png`, `public/assets/animation/juniper-vale-pass-right.webp`.
- Review: Visually reviewed source on light and dark grounds. The 2x2 sheet has four complete distinct Juniper Vale poses matching canonical cell1 skin, face, hair, human build and Chicago Condas identity. Both hands stay empty and no jersey numerals appear. The bottom-left source pose (frame2) is the marked catch; the bottom-right pose cushions the catch. Alpha>=64 component review identifies four complete isolated bodies and one unrelated two-pixel speck below the packaging threshold. The packer isolates original bodies and drops only non-body alpha noise; no pose is redrawn, copied or mirrored.

## Runtime and visual validation

The registered `receive` clip is four frames with durations `[2,2,1,3]`; `grab` marks frame2 at tick4. Reed’s separate ball track reaches forward15 at height1.5; Juniper’s reaches forward13 at height1.5. Both tracks and mirrored body selection are checked in both facings by animation tests.

The production atlas is visually reviewed on light/dark grounds. Standard and zoom120 native Canvas previews each load116 images and capture87 snapshots per athlete; each receive frame selects reviewed production art in both facings. Catch previews show the separate ball at the hands. Captures: `artifacts/native-render-preview/{reed-ashcroft,juniper-vale}{,-zoom120}`; atlas review contact sheets: `artifacts/asset-review/j36/*-receive-atlas-review.png`.
