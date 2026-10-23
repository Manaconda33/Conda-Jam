# J.67 — Reed Ashcroft 360 dunk

## Generation prompt

Create one original transparent RGBA production sprite sheet for Reed Ashcroft's right-facing `dunk-360` action in JAMVERSE ’96.

Canvas and layout: exactly 15 distinct complete full-body drawings in a strict five-column by three-row grid, left-to-right then top-to-bottom, on a transparent 1619×971 canvas. One Reed figure per cell. Keep body scale consistent and the grounded foot baseline stable; gameplay supplies jump height. Leave broad genuinely transparent gutters, keeping every hair tip, hand, shoe and outline pixel inside its cell. No clipping, touching, overlap, fusion, duplicate drawings or mirror-copy trick. True alpha-zero outside figures. Use readable, crisp 1990s arcade pixel-art clusters, a strong dark outline and consistent lighting.

Character identity: Reed is the same young adult human man in every view, with medium-brown skin, dark focused eyes and brows, a small dark goatee, dark purple-black braids gathered into a compact high topknot, and a natural athletic muscular build. Keep his face, hair and proportions consistent as he turns; the back of his head and uniform remain coherent in rear views. Braids remain attached to the scalp and trail naturally, never becoming a cape or extra limb. He wears his blank Chicago Condas uniform in deep purple with gold trim, white lower-leg wear and purple-and-gold basketball shoes. Keep him fully human. No glasses, headband, armor, fantasy anatomy, numbers, lettering or logos.

Action: one complete 360-degree body spin during a high dunk. Reed starts carrying the invisible basketball at his right hip. He takes off while his shoulders and hips rotate together around his vertical axis, passes through a clear rear view and opposite profile, completes the full turn facing right again before the release, then finishes with a forward right-hand dunk and lands. The ball is a separate runtime object and must not appear in the art. The torso, shoulders, head, legs and braids rotate as one coherent human body; the arms remain natural and attached. This is a 360 spin, not a windmill arm circle, reverse dunk, alley-oop or 180-degree turn.

Exact pose sequence, one individually articulated complete drawing per cell:

0. Right-facing three-quarter approach, staggered stance, invisible ball cradled at the right hip and free arm opening for balance.
1. Plant the lead foot and sink the hips; cross the invisible ball toward the far hip while the free elbow draws back to initiate the turn.
2. TAKEOFF: both feet clear the ground after leg extension; the invisible ball hugs the abdomen as shoulders turn one-quarter away.
3. Early ascent; lead knee lifts, trailing leg folds, back turns halfway toward the viewer and the ball hand stays close to the ribs.
4. Mid-ascent; both knees gather; clear rear three-quarter view, shoulders and hips continuing the same rotation.
5. GRAB at tick10: secure the already-carried invisible ball with both hands at the chest as the rotation passes through a full back-facing view. This is not a pass or catch.
6. Late ascent; turn through the opposite profile with the ball protected at the chest; the head, legs and braid mass follow the body turn.
7. PEAK at tick14: complete the full 360-degree turn and face right again; one arm and the invisible ball rise high while the free arm spreads to brake the spin.
8. Start descent; keep the chest toward the right rim, cock the finishing arm slightly behind the head and fold the free elbow across the chest.
9. Pre-release; square toward the imagined rim and drive the right forearm forward from above the ear.
10. RELEASE at tick21: snap the right wrist down through the imaginary rim after the completed spin; fingers open only now. The figure is empty-handed after release.
11. FINISH at tick23: continue the downward right-arm follow-through while the free arm extends sideways to stop residual rotation.
12. Descend and recover; move the empty hand across the opposite chest and turn only a small recovery quarter.
13. Landing approach; unfold both legs beneath the body and widen the arms at different heights for balance.
14. LAND at tick30: meet the ground with both feet, bend the knees deeply to absorb impact and settle facing right in a stable stance. No further spin while planted.

All 15 poses must be visibly distinct and follow the exact order. Show the actual whole-body front/rear/profile rotation across frames3–7 and return to Reed's starting right-facing view before release. Preserve Reed's face, skin, goatee, braided topknot, natural human anatomy, kit, legwear and shoes. No basketball, hoop, rim, floor, shadow, glow, background, border, grid, cell markers, lettering, opponent, passer or prop. Do not move the entire artwork upward to fake the jump. Return only the clean transparent RGBA sheet.

## Review references

- Reed identity: `tools/generate-art/references/reed-ashcroft-portrait-reference.png` and `tools/generate-art/references/reed-ashcroft-gameplay-reference.png`.
- Accepted Reed style and outfit: `public/assets/animation/reed-ashcroft-dunk-reverse-right.webp` and `public/assets/animation/reed-ashcroft-dunk-windmill-right.webp`.
- Generic 360 action timing only: `public/assets/animation/manaconda-dunk-360-right.webp`; do not copy Manaconda's appearance.

## Provenance

Record the exact generation ID, raw source, accepted-source hash, every rejected candidate, source rectangles, packed atlas hash, canon mirror review, Reed-specific ball-track review, and standard/zoom120 native preview findings in `reed-ashcroft-dunk-36015-provenance.json` and `reed-ashcroft-dunk-36015-layouts.json`.
