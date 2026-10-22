# Sable Regent — 42-frame locomotion source (scale/layout retry)

## Canon references

- Portrait/gameplay identity: `public/assets/supporting-player-portrait-atlas.png` cell 8 and `public/assets/supporting-player-gameplay-sprites.png` cell 8; extracted references are `tools/generate-art/references/sable-regent-portrait-reference.png` and `tools/generate-art/references/sable-regent-gameplay-reference.png`.
- The rejected first attempt had 35 poses because its figures were too large for six rows. It remains excluded.

## Image-generation prompt

Create a transparent RGBA 7-column by 6-row sprite atlas containing exactly42 complete drawings of Sable Regent. Make all six rows visibly separate and equally spaced, with exactly seven figures in each row. The last row must contain seven finished figures; do not stop after row five. Fit the entire six-row grid inside a landscape 7:6 canvas with transparent outer margin. The supplied prior portrait is the identity reference and the supplied gameplay sprite is the costume/style reference. Sable is the same adult human woman in every cell: warm brown skin, the same face and black hair gathered back under her distinctive red headband, and the same Blackthorn Court Kings black/crimson kit with crisp white trim and wristbands. Keep her identity and adult human anatomy exactly consistent.

IMPORTANT SCALE: The previous attempt made oversized figures and only fit five rows. Draw each athlete at about 65% of a cell's height, with generous transparent space above and below. Keep each pose around 140–155 pixels tall on a roughly 1160-pixel-tall canvas. The image must show six complete horizontal rows, not five. Each cell is a small individual sprite with clear gutters. Do not enlarge figures to fill a row. Keep hair, hands, shoes and limbs completely inside each cell; never let poses touch or connect.

Use polished 1990s arcade cel-shaded sprite art with crisp dark outlines, readable limbs and genuine transparency. Keep hands completely empty: absolutely no basketballs, spheres, props or accessories anywhere. No floor, shadow, scenery, background, border, cell guides, labels, words, numbers or logos.

Read left-to-right, top-to-bottom. Positions1–6 are quiet upright idle variations; position7 is idle-ball frame1. Positions8–10 are the remaining idle-ball frames; positions11–14 are dribble frames1–4. Positions15–20 are dribble frames5–10; position21 is run frame1. Positions22–28 are run frames2–8. Positions29–31 are run frames9–11; positions32–35 are dribble-run frames1–4. Positions36–42 are dribble-run frames5–11. This exact sequence must fill all42 cells. All poses are distinct, complete and anatomically clear; every hand remains empty for the game-rendered ball.
