# J.105 — Keeg scythe dunk — retry 06

## Verbatim generation prompt

```text
Create a NEW transparent 1536x1024 RGBA arcade sprite sheet for JAMVERSE '96. The attached Keeg sheet is only an identity and style reference. Compose exactly fifteen distinct full-body Keeg poses in a strict five-column, three-row grid, row-major, one centered pose per cell.

THE FIGURES MUST BE SMALL. Each cell is about 307x341 pixels. Limit each complete figure from hat tip to shoe sole to 165 pixels tall and 190 pixels wide maximum, about 48% of cell height. Place each figure in the center of its own cell with at least 85 pixels of empty transparent clearance above and below, and 58 pixels left and right. The full ornate hat and both shoes must remain visible. Draw substantial empty alpha space between every figure and every grid boundary. Make all poses the same small scale. No silhouette may touch a cell edge, cross a gutter, or overlap another figure.

Keeg is an adult human man with athletic human proportions, black hair, neat black beard, expressive face, complete very tall purple witch hat with silver trim and visible mushroom ornaments, layered purple/lavender/silver Moonmorel Hex athletic kit, belt and matching shoes. Preserve these details in the small scale. Exactly two arms, two hands, two legs. No monster traits, horns, robe, cape, staff, scythe, blade, ball, sphere, prop or extra object. His game basketball is separate art; all hands mime an invisible ball.

A SINGLE one-handed scythe dunk: right-facing approach, waist gather, two-foot plant, jump, low rear hand sweep behind the hip, reverse into one rising diagonal across the body, one overhead finish. This is not a windmill, reverse, tomahawk, 360 or double-pump. The sequence is fifteen unique poses, strict row-major:
0 approach facing/moving right;
1 gather at waist;
2 plant and coil;
3 takeoff, hand drops behind hip;
4 low rear sweep;
5 deepest low sweep;
6 rise reverses diagonally across torso;
7 hand beside the head but clearly forward/right of hat;
8 ascent with rising arm;
9 high cocked hand forward/right of hat;
10 sole release, arm extended diagonally forward/up with empty open palm, simulation tick21;
11 empty follow-through;
12 descent;
13 flexed two-foot landing;
14 stable recovery with empty hands.
Poses0-9 carry the invisible ball. Pose10 releases. Poses11-14 are empty-handed.

True transparency in all gutters and outer canvas. Absolutely no orange ball, painted sphere, circle, checkerboard, background, gradient, matte, haze, halo, shadow, border, text, labels, floor, court, hoop, teammates or opponents. Crisp original arcade sprite art, clear pose separation and generous transparent margins. Return only the sheet.
```

Generation `exec-e23e2309-e986-4152-a33c-af879b24711d`; source `sources/j105-keeg-dunk-scythe-attempt-06-review.png`; SHA-256 `e98e933d35f88566966deffa45340e8faae8a81bc58fcf9aad24c5473448a873`. **Rejected.** The RGBA sheet has two nontransparent outer-edge pixels. Against the 85-pixel required vertical margin, all fifteen cells fail; several figures have zero top or bottom clearance. Gather poses1 and2 still paint an orange basketball. The black/white grid preview is `../../artifacts/native-render-preview/j105-keeg-dunk-scythe-attempt-06-review.png`.
