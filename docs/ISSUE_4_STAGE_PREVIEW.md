# Issue #4 stage preview

Date: 2026-10-26

**Status: opt-in renderer review candidate; not accepted.** The Chicago Condas vs Crownfire Sovereigns stage is available in game only with `?stagePreview=1`. The opt-in renderer does not change the default camera or stage composition. Reed’s shared athlete-specific shot ball track was also adjusted so gameplay release positioning meets his authored hand; scoring logic and sprite frames are unchanged. Portrait remains at its letterboxed baseline and does not meet its target.

## Review link and evidence

- [Private stage review gallery](https://jamverse-stage-review-20261026.manaconda2433.chatgpt.site/) hosts revision 5 beside the prior on-court-base capture. Its separate Sites source commit is `28ea6072f5e7493eb47cf654494198b7cae602d6`, deployed successfully as version `appgver_56c360e9152481918889d7d927842090`; production GitHub Pages was not changed.
- For local QA, run `npm run preview` and open `http://localhost:4173/JAMVERSE_96.html?stagePreview=1` inside the development environment. This localhost address is not a user-facing link.
- Current staged Chromium captures and `capture-manifest.json` are in `artifacts/screenshots/issue4-stage/`. Revisions 1–4 are preserved in `baseline-v1/` through `baseline-v4/`; revision 2 retains the previous in-court base placement.
- `tools/capture-issue4-stage.mjs` reproduces the four frames with zero simulation ticks while the renderer settles. The shots are staged frames, not gameplay footage. Reed’s authored separate-ball tracks provide the dunk and shot ball positions. The capture derives the released ball X from his runtime shot track rather than a hand-entered offset.

## Hoop revision

The first candidate enlarged the entire basket 1.9× around the rim. Its old 30–50% viewport assembly-width target rewarded the oversized rim and fixed-offset backboard visible in the baseline captures. Revision 2 removes that criterion.

Revision 5 anchors the staged rim 8 world units in from each endline and the backboard 4.5 units in. The backboard overlaps the baseline; the nearest rim edge stays about 16 px inside it at standard zoom. The support base is 8 units beyond the endline at the rim’s across-court depth, wholly outside the painted floor and fully inside the viewport. The support is sorted behind the board. On the 480×360 canvas, rim width remains about 42.5 px, about 0.40 of a standing player at mid-depth. The dunk capture shows the ball and fingertips meeting the rim. Reed’s separate `shoot` ball-forward track is 11.5 world units at frame 5 / tick 13, matching the authored release hand. Left and right views mirror, with rim centers near 22% and 78% of the canvas width.

The reference research supports using court coordinates, perspective, and object-specific scale as design principles. The public [NBA Jam assembly archive](https://github.com/historicalsource/nba-jam) separates hoop and backboard coordinates in `WORLD.EQU` and declares perspective modes and scale data in `DISP.EQU`. Its provenance and licensing are unclear; no source code was copied. Mark Turmell’s [developer interview](https://lawson.media/shows/gameplay/episodes/nba-jam-mark-turmell-tim-kitzrow-reyan-ali) describes the original court’s scanline scrolling and parallax, so the arcade renderer’s hardware technique is treated as historical context rather than a direct Canvas recipe.

## Landscape measurements

| Check | Candidate result | Target | Status |
| --- | ---: | ---: | --- |
| Floor band | y=152–360; 57.8% H | 55–60% H | Pass |
| Standard court slice | 50% at midcourt | 48–52% | Pass |
| Near standing figure | 110px; 30.6% H | 30–36% H | Pass |
| Far standing human | 100px; 27.8% H | 24–30% H | Pass |
| Dunk pose | 142px; 39.4% H | 35–42% H | Pass |
| Ball diameter | 19px; 4.0% W | 3.5–4.5% W | Pass |
| Nominal rim / standing-player width | 42.5px / 107px; 0.40 ratio | 0.36–0.47 close view | Pass |
| Rim edge to baseline | about 16px in both mirrored views | close to line, still inbounds | Pass |
| Board and support | board overlaps baseline; base 8 world units beyond endline, fully visible | board/rim over line; base off court | Pass |
| Rim centers | right 78.3%; left 21.7% W | right 70–80%; left 20–30% | Pass |
| Dunk contact | ball overlaps Reed’s raised fingertips and grazes the rim | legible hand/rim contact | Pass |
| Support clearance | outside rim and player silhouette in both directions | no accidental crossings | Pass |

Dragon Queen is nonhuman and is not used for the far-human height measurement. The 1996 reference screenshots show different camera distances; visual review compares rim/player proportions by scene rather than applying one assembly-width target to every shot.

## Portrait gate and limits

The portrait capture retains the current 4:3 letterboxed layout. Its game canvas is about y=232–505, or 32.3% of the 390×844 screen, below the 55% / 464px target. Portrait camera/layout work remains gated on review of this stage slice, so the candidate does not claim portrait acceptance or complete Issue #4.

## Verification

- `npm test`: PASS, 495 tests.
- `npm run test:e2e`: PASS, complete Chromium offline startup, match, and season journey.
- `npm run lint`: PASS, 19 JavaScript modules.
- `npm run validate:content`: PASS, 35 franchises / 105 athletes.
- `npm run simulate:league`: PASS, 100 matches / 857,283 ticks / 5 overtime periods.
- `npm run build`: PASS, including the self-contained bundle.
- Stage projection, camera tracking, and Reed shot-track tests: PASS, 13 focused tests.
- Chromium 154 captures: four frames, zero page errors; revision 2 on-court bases and revisions 3–4 are retained for comparison; portrait remains baseline only.
- No animation assets or registrations changed; the strict animation audit was not refreshed.
- Production Pages remains at the earlier `513e0a59` / run #169 checkpoint. No scoring logic or sprite frames changed. Reed’s shared shot-release origin now follows the athlete-specific track and therefore affects his gameplay ball positioning. No production deployment was made.
