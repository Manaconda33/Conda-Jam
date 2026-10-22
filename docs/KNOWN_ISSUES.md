# Known issues

## P1 — Contact defense does not stop the ball

Pressing shoot/block on defense can deflect jump shots and dunk releases when the defender jumps close enough and at the right height. Descending-shot goaltending is called within an approximate protected hoop region; exact rim contact is not simulated. Turbo+pass body-checks off-ball opponents with strength-based knockdowns, and the CPU attempts occasional checks. There is no foul/charge system or knockdown line in the box score.

## P1 — Art and roster selection are early

The 35-team manifest now has generated portraits and four generated full-body poses for all 105 athletes, including distinct canon-captain anatomy; portraits appear in HUD cards, running has a two-pose cycle, and jump-shot/dunk poses appear during their actions. Five-action locomotion atlases cover all35 captains and58 supporting athletes; Dorian Mycel and Luca Velori also have four reviewed locomotion clips each, with idle-ball remaining on fallback until proper standing poses are generated. Selected athletes also have shots, passes and nonhuman interactions. The full 29-clip production spec remains incomplete: most of the105 athletes still lack many idle/run/dribble, pass/receive, shooting, defense/contact, recovery, rebound, celebration and bench animations. Some canon props are less visible at game scale, and the full roster needs individual animation/collision review.

## P1 — Tournament depth is limited

Season Run persists an eight-opponent route, advances on wins, and ends the run on a loss. Jam Cup now provides a seeded eight-team single-elimination bracket with three rounds, local persistence, elimination, and a championship result. The separate league table records and ranks completed non-practice matches for all 35 franchises. Cup seeding and CPU bracket games are deterministic for the saved seed; team ratings do not yet affect off-court CPU results.

## P2 — Arcade court collision/presentation gaps

Rim and backboard contact use approximate collision volumes rather than detailed geometry. The crowd uses repeated procedural silhouettes rather than individually illustrated audience sprites, and the camera does not smoothly scroll all the way to both baskets. The canvas is pixel-scaled and readable, but not yet a full NBA-era sprite composition.

## P2 — Controls/settings gaps

Keyboard movement/action remapping is supported and saved for P1/P2. Up to four gamepads can take all athlete slots, including a four-pad-only match; disconnecting a pad releases that athlete to CPU or keyboard control, and reconnects are reassigned. Third/fourth keyboard bindings and physical controller variants remain untested. Gamepad button remapping is not complete. Music and effects have separate saved levels. Reduced-flash disables crowd twinkle and score shake; it does not limit every motion/animation effect.
