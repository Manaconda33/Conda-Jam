Create one original production sprite sheet for Piper Quickstep performing a right-facing basketball layup. Use the supplied Piper source only to preserve her visual identity and line/rendering style. Piper is the same athletic adult human woman with warm-brown skin, a bright orange high ponytail tied behind her head, russet-red uniform with cream speed stripes and trim, and matching red/cream trainers. Keep her face, skin, hair, uniform palette, proportions, and shoes consistent. Preserve complete human anatomy: two arms and hands, two legs and shoes.

Canvas and layout: true transparent RGBA, exactly 2048x1024 pixels, four equal columns by two equal rows, each cell 512x512. Draw exactly one complete Piper pose in every cell, row-major frames 0 through 7; there is no unused cell. Center each whole figure in its own cell and leave at least 64px of transparent space from every body part, including ponytail, hands, ball-less fingertips, and shoes, to each cell edge. Keep all figures the same scale and facing image-right in the same three-quarter side view. No body part may cross or touch a cell boundary. Poses must be clearly distinct, complete, and non-overlapping.

Eight-pose sequence, preserving this exact order:
0. Approach and gather: low athletic drive step toward the basket, eyes up, hands empty but beginning to gather an invisible ball near the waist.
1. TAKEOFF at simulation tick 2: spring upward from the final approach step; lead knee rises and the invisible ball is gathered near the shooting shoulder.
2. Rise: clear airborne extension, lead knee still high, torso balanced, invisible ball carried upward in both hands.
3. Final gather at simulation tick 8: compact airborne layup gather near the head and shooting shoulder, elbows bent, eyes on the target.
4. RELEASE at simulation tick 10 and peak: one clean right-handed layup release pose, shooting arm extended high-forward with open fingertips, opposite arm balancing, lead knee lifted. This is the single release frame.
5. Follow-through at simulation tick 11: a clearly different empty-handed follow-through with shooting wrist relaxed forward, opposite arm opening for balance, still airborne.
6. Descent: begin dropping from the layup, arms lowering naturally and legs preparing for landing.
7. FINISH at simulation tick 18: balanced two-foot landing and recovery, upright and in control, hands empty.

The basketball is a separate athlete-specific runtime object and must never be painted into any sprite. Both hands remain visibly empty in every pose. Do not draw any ball, sphere, ball seams, object, hoop, rim, floor, court, ground shadow, glow, scenery, background color, checkerboard, grid, cell dividers, border, text, label, UI, teammate, or extra person. Preserve genuine alpha-zero empty background and gutters. Return only the transparent sheet.
