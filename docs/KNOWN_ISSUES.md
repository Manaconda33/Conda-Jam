# Known issues

## P1 — Contact defense and shot timing need balance review

Pressing shoot/block can deflect jump shots and dunk releases when the defender jumps close enough and at the right height. Descending-shot goaltending uses an approximate protected hoop region; exact rim contact is not simulated. Turbo+pass can body-check nearby opponents, with a lower strength-based chance to jar the ball loose from its carrier than to knock down an off-ball defender. Successful carrier checks give the defender last touch and stun the carrier; CPU checks remain occasional. Knockdowns appear in the final box score. A shot or dunk released before the buzzer now remains live until the attempt resolves; misses that become loose balls end the period immediately. These timings still need human balance review. Personal fouls and charges are intentionally absent under the master spec's arcade rules.

## P1 — Art and roster selection are early

The 35-team manifest now has generated portraits and four generated full-body poses for all 105 athletes, including distinct canon-captain anatomy; portraits appear in HUD cards, running has a two-pose cycle, and jump-shot/dunk poses appear during their actions. Five-action locomotion atlases cover all35 captains and58 supporting athletes; Dorian Mycel and Luca Velori also have four reviewed locomotion clips each, with idle-ball remaining on fallback until proper standing poses are generated. Selected athletes also have shots, passes and nonhuman interactions. The full 29-clip production spec remains incomplete: most of the105 athletes still lack many idle/run/dribble, pass/receive, shooting, defense/contact, recovery, rebound, celebration and bench animations. Some canon props are less visible at game scale, and the full roster needs individual animation/collision review.

## P1 — Tournament depth is limited

Season Run persists an eight-opponent route, advances on wins, and ends the run on a loss. Jam Cup now provides a seeded eight-team single-elimination bracket with three rounds, local persistence, elimination, and a championship result. CPU bracket games use the average roster OVR: each rating point of advantage adds one percentage point to a 50% baseline, bounded between20% and80%, with the saved seed preserving reproducible outcomes. The separate league table records and ranks completed non-practice matches for all35 franchises.

## P2 — Arcade court collision/presentation gaps

Rim and backboard contact use approximate collision volumes rather than detailed geometry. The crowd uses repeated procedural silhouettes rather than individually illustrated audience sprites. The court camera now uses a dead zone, velocity look-ahead and time-based easing, with its focus bounded to the court. The canvas is pixel-scaled and readable, but not yet a full NBA-era sprite composition. An opt-in runtime diagnostics overlay is available with `?debug=1` or F3; it shows FPS, average simulation tick cost, seed and match state. Sustained performance percentiles on 720p/1080p displays still need measurement.

## P2 — Controls/settings gaps

Keyboard movement/action remapping is supported and saved for P1/P2. Gamepad shoot, pass, turbo and pause buttons can be mapped and saved for all connected pads; movement reads either the left stick or D-pad. Up to four gamepads can take all athlete slots, including a four-pad-only match; disconnecting a pad releases that athlete to CPU or keyboard control, and reconnects are reassigned. Third/fourth keyboard bindings and physical controller variants remain untested. Music and effects have separate saved levels. Every modal now exposes its visible heading as its accessible name; Chromium role/name assertions cover Settings, franchise selection, season, cup, standings and career leaders. Reduced-flash disables crowd twinkle and score shake; it does not limit every motion/animation effect.
