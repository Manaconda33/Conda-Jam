# J.71 — Reed Ashcroft scythe dunk, corrected sweep staging

## Generation prompt

Create a new source sheet from this exact specification:

Create one original transparent RGBA production sprite sheet for Reed Ashcroft's right-facing `dunk-scythe` action in JAMVERSE ’96. Use the attached portrait and gameplay references only for Reed's identity, body proportions, uniform palette and rendering scale. Do not copy any other dunk's hand or arm choreography.

Canvas and layout: exactly fifteen distinct complete full-body Reed drawings in five equal columns by three equal rows, strict left-to-right and top-to-bottom order, on one transparent 1619×971 canvas. There must be exactly one isolated figure per cell and true alpha-zero outside every figure. Keep each figure at a consistent scale and on the same baseline; never use whole-body vertical movement to fake the jump. Keep all hair tips, hands, fingers, shoes and outlines within their cell, separated by broad transparent gutters. No overlap, fusion, duplicate pose or mirrored copy. Render crisp readable 1990s arcade pixel art with a deep near-black/purple outline and consistent light.

Reed is a young adult human man with medium-brown skin, focused dark eyes and brows, a small dark goatee, and long dark purple-black braids attached to a compact high topknot. Preserve his recognizable face and natural muscular human anatomy, including correct hands and five fingers. He wears his blank Chicago Condas deep-purple basketball kit with gold trim, white lower-leg wear and purple-and-gold shoes. Keep the palette limited to those canon colors. No glasses, headband, armor, fantasy anatomy, letters, numbers, logos, red exterior edge or colored halo.

One continuous scythe action only: Reed controls an invisible game ball in his right hand. He dips that hand low behind his hip, swings it in a single broad diagonal arc behind and then across his torso, and carries it from below his waist to above his right shoulder and forward toward the rim. The body rotates with the sweep, but the action remains one readable low-to-high diagonal cut. This must not become a run cycle, a windmill circle, a chest clutch, a two-hand hold, or a double pump. Keep the imagined ball outside his silhouette in the low/back phase and beside his hand in the rising phase. Draw no ball, hoop or rim; gameplay provides them separately.

The fifteen cells map exactly to these poses in row-major order. Make the arm and hand positions visibly progress from cell to cell:

0. Rightward stride with the ball controlled low at the right hip; head and eyes face the rim.
1. Plant the lead shoe, bend the knees, and draw the right hand low beside the rear hip.
2. TAKEOFF with both feet off the floor; right elbow pulls behind the waist and the torso starts to turn.
3. Begin the sweep downward and backward: right hand passes behind the right thigh, clearly below the waist; left hand reaches forward.
4. Turn the torso farther away; extend the right arm behind the body and lower the hand to knee height. Preserve a clear gap between arm and body.
5. LOW POINT: bend both knees in the air; the right hand reaches behind and below the hip, the lowest and farthest-back point of the arc. Left arm counterbalances in front.
6. Reverse the hand direction: swing the right hand upward from behind the hip to the back of the waist, elbow bent. Do not raise it over the head yet.
7. Carry the same right hand diagonally forward and upward across the abdomen to the lower chest; shoulders rotate toward the rim.
8. Continue upward across the chest to the right shoulder; right elbow is bent beside the head and the invisible ball remains in hand.
9. Extend the right arm high and forward toward the imaginary right-side rim, with the hand still closed around the ball; this is the only pre-release reach.
10. RELEASE at tick21: open the right fingers and snap the empty hand forward/down through the imaginary rim. This is the only release pose.
11. FINISH at tick23: follow through with the empty right hand across and down; left arm extends for balance.
12. Descend with both empty hands spread naturally and the torso returning to a right-facing stance.
13. Lower both legs beneath the hips and prepare a two-shoe landing with empty hands stabilizing.
14. LAND at tick30: both feet meet the ground, knees bend to absorb impact, and Reed settles into a balanced ready position.

Critical choreography check: cells3,4,5 must each show the right hand behind and below the hip, descending to a clear low point. Cells6,7,8,9 must show the same hand rising successively from hip, across the abdomen, to shoulder, then high-forward. The source should visibly read as one continuous low-to-high scythe arc even without a ball drawn. Cell10 alone opens the right hand. Cells11–14 stay empty-handed. Every cell is a complete, independently articulated human Reed. Keep shoes on the stable sheet baseline. No court, shadow, grid, guides, frame borders, text, special effects, opponents or extra props. Return only the transparent sprite sheet.
