# Independent registered-runtime review: Krios reverse layup

**Disposition: clears registered-runtime validation for production registration.** This review confirms the registered atlas and core track behaved correctly through the real Jam Stage renderer in the exercised scoring setup. It does not substitute for the project’s remaining full validation and audit.

- The capture report records `runtimeIntegration: true`, no browser errors, and 64 captures across four runs: right and left facing at 100% and 120% zoom. The script’s registered mode does not inject either the candidate atlas or a replacement track; it uses `public/assets/animation/krios-layup-reverse-right.webp`, the public manifest, and the current `src/core/animation.js` track.
- Every run selected `layup-reverse`, began on frame 0 with Krios owning the carried ball, and selected the registered atlas. At tick 11/frame 4 the ball remained carried by Krios. At tick 12/frame 5 the clip released once, cleared ball ownership, and produced the “Krios launches a 2-pointer” event.
- At 120% zoom, the release frame reads cleanly from either facing: the ball is at the raised hand and moves toward the basket. The 100% view preserves the same alignment. Reverse-facing track placement mirrors across the athlete as intended.
- All four runs scored two points by tick 49; right-facing Scoria scored `[2,0]`, and left-facing Scoria scored `[0,2]` as the away side. Logs contain one launch and one score event per run.
- The report identifies the court as the current Jam Stage court geometry in this worktree, Scoria Rams versus Blackthorn Court Kings, with court Y=90.

The atlas itself had already received a separate cleanup review for identity, pose separation, margins, matte cleanup, and transparent runtime layout. This review is specifically registered-runtime evidence for the reversed layup’s asset selection, track timing, visual ball contact, and scoring in both facings.
