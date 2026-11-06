# Independent normal-loader review — Kraken alley-oop-power attempt09

**Verdict: pass for the registered gameplay path.** The current Jam Stage normal loader uses the checked-in Kraken atlas and production ball track; this capture set contains no candidate injection.

## Runtime provenance

- `report.json` records `runtimeIntegration: true`, `candidateAtlasInjected: false`, and `candidateBallTrackInjected: false`, with 60 captures across both facings, 100%/120% zoom, and all 15 frame starts.
- The selected atlas is `./public/assets/animation/kraken-alley-oop-power-right.webp` in every capture. Its manifest SHA-256 `880ed3a1128e46bb76c53681f44e9678b50086149ff8c6951216e06607478fdc` matches the file and report. The manifest records 15 frames in a 5×3 atlas at baselineY 92.
- The report's attempt04 track vectors exactly match `athleteBallTracks.kraken['alley-oop-power']` in `src/core/animation.js`. All frame indices 0–14 are selected in order; right-facing is unflipped and left-facing is correctly mirrored.
- The current-court run uses courtY 90 and a real Marin Dusk pass. `uncaughtBrowserErrors` is empty.

## Visual and state checks

- Frames 0–4 show the approach, receive setup, and incoming pass. The report records Marin's pass event at tick 7 and Kraken's catch at tick 10/frame5. At the catch, the ball is adjacent to Kraken's receiving hand; the hand/ball contact reads cleanly in both facings. The large foreground passer overlaps part of Kraken's lower body in some views, but does not obscure the catch hand or ball.
- Frames 5–9 keep the ball owned by Kraken and visually close to the raised/carrying hand through the ascent and approach to the rim. The contact sheets at 100% and 120% show the ball moving with the hand rather than floating away; left-facing contact is consistent after mirroring.
- At tick 21/frame10, the ball reaches the rim, `action.released` is true, `ball.mode` is `dunk`, and owner is cleared. The tick21 screenshots show the ball at the rim. At tick23/frame11 the event is “Kraken scores 2!” and the score becomes `[2,0]` in the right-facing run and `[0,2]` in the left-facing run. Frames 12–14 retain the score with the ball dead/unowned while Kraken descends and recovers.
- The whole play remains inside the current Jam Stage viewport at both zooms/facings. Kraken remains visible through the pass, catch, carry, rim contact, and recovery; no HUD overlay obscures the relevant contact/release. The large foreground teammate is visually prominent but is part of the live court context and does not conceal the key interaction.
- The on-court athlete matches production Kraken: warm skin, short auburn hair, pointed-ear silhouette, copper pendant, and burgundy/copper uniform. The court label/HUD and report identify Kraken as receiver/scorer.

No concrete normal-loader integration blocker found. This run validates the registered atlas/track and the scoring transition under normal Jam Stage rendering; the report state and all 60 screenshot paths are preserved beside this note.
