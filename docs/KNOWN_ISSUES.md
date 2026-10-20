# Known issues

## P1 — Contact defense does not stop the ball

Pressing shoot/block on defense can deflect jump shots and dunk releases when the defender jumps close enough and at the right height. Descending-shot goaltending is called within an approximate protected hoop region; exact rim contact is not simulated. Turbo+pass body-checks off-ball opponents with strength-based knockdowns, and the CPU attempts occasional checks. There is no foul/charge system or knockdown line in the box score.

## P1 — Art and roster selection are early

The league manifest has 35 teams and all 105 named athletes. Menu selectors choose the active second athlete and quarter-break hotkeys rotate between partners and the third athlete with stats retained. Sprite drawings are procedural Canvas primitives; they do not have the required animation atlas, portraits for every captain, signature celebration props, or enough anatomical detail for final art acceptance.

## P1 — Tournament depth is limited

Season Run now persists an eight-opponent route, advances on wins, and ends the run on a loss. It does not provide league-wide standings, seeding, or a full tournament bracket.

## P2 — Arcade court collision/presentation gaps

Rim and backboard contact use approximate collision volumes rather than detailed geometry. The crowd uses repeated blocks and the camera does not smoothly scroll all the way to both baskets. The canvas is pixel-scaled and readable, but not yet a full NBA-era sprite composition.

## P2 — Controls/settings gaps

Keyboard remapping, robust gamepad reconnect/focus reassignment, third/fourth-player joining, and volume accessibility controls for separate buses are not complete. Reduced-flash disables the crowd light twinkle; it does not limit every motion/animation effect.
