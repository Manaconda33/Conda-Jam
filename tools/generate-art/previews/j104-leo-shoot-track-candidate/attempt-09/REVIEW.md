# J.104 Leo `shoot` attempt09 — accepted gameplay-relative track candidate

This candidate passed the actual gameplay renderer check. Its source art is unchanged; the ball is a separate object.

- Height: `[0.95,1.1,2.1,2.1,2.2,2.5,2.2,2.7,2.1,1.05]`
- Forward: `[6,7,6.5,4,3,4,4,4,6.5,5.5]`
- Release: frame5/tick13; real player jump is `z=2`; production `flightHeightFromHand(2.5,2)` gives launch z3.
- Capture and scoring evidence: `gameplay/rendered-courty90/report.json` and 24 screenshots.

Capture ran the production Jam Stage and stepped actual `window.jamverse.tick()` / `stepMatch` for every animation and flight tick. The ball is attached on the candidate track until tick12. At tick13 the real shot action releases it; its candidate starting point and production makeShot launch equations are applied once at that boundary. After that, no ball coordinates are assigned: the ball advances only through `integrateBall` until score completion. Both facings were rendered at ticks13,14,16,19,23 and final score, at 100%/120% zoom.

Visual review at 120% shows tick13 contact on the raised hand in both directions, tick14 still leaving the hand cleanly, and tick16 separated on a rising path. Ticks19/23 continue toward the rim. The 100% captures show the full player/court context. The high H7.5 attempt07 defect is resolved; actual stage source elevation compensation is present in these renders. The game score is 3–0 in both facing runs, with `ball.ownerId=null`, `leo.hasBall=false`, `ball.mode='shot'`, and `lastTouch='leo'` at release. See JSON for exact state values.

The actual run has 24 captures, both directions, no browser errors, correct `generated-full-roster-atlases` renderer, and the expected 3-point completion in both facings. `gameplay/rendered-courty90/report.json` records the actual per-tick positions and final states. `native/report.json` records the 48-frame candidate selector and mirror checks across 100%/120% plus useful pre-release gather captures. The direction-aware ball flight in the actual run follows the team0 target rim; no left-facing mirrored post-release path is substituted.

Track provenance: no ImageGen call was needed, so there is no new prompt or generation ID. The accepted original Leo shoot atlas and all prior attempts remain intact. The exact `TRACK_JSON` is in both reports. `tools/capture-j104-leo-shoot-track.py` records the static selector grid; `tools/capture-j104-shoot-real-gameplay.py` records actual gameplay flight and score.

Additional full-gameplay limit: the 120% actual simulation render shows a clean tick13 hand release and tick16 separation, but the rising shot reaches the top HUD around tick19 and is clipped there by tick23 at courtY90. At 100% it stays visible. The candidate track itself passes release contact/ownership/scoring; camera coverage of the late arc remains a renderer-level caveat, documented in `gameplay/REVIEW.md`.
