# Issue #4 stage preview

Date: 2026-10-26

**Status: Revision 13 landscape staging candidate ready for owner review; Issue #4 remains PARTIAL.** The Chicago Condas vs Crownfire Sovereigns stage stays opt-in behind `?stagePreview=1`. Production Pages and gameplay are unchanged.

## Review link and evidence

- [Private stage review gallery](https://jamverse-stage-review-20261026.manaconda2433.chatgpt.site/) is version 7, deployed from source commit `f66f2e38c49321cb7d06d685c77845173d2271d1`. It compares Revision 5, R10, R11, and R13; preserves the eight-frame R13 capture set and its manifest. The gallery remains owner-only.
- Current Chromium captures and measured `capture-manifest.json` are in `artifacts/screenshots/issue4-stage/`. Eight staged frames include near dribble, right dunk peak, left shot release, portrait baseline, and four dunk camera states. R10 and R11 source captures remain separately archived in the review gallery.
- `tools/capture-issue4-stage.mjs` reproduces the frames from authored pose/ball tracks and deterministic scene states. It does not advance gameplay simulation; the camera alone eases between states. Captures are staged frames, not gameplay footage.

## Revision 13 court, hoop, and jump presentation

The stage shows 70.0% of the court length from the near side, 72.2% at mid-depth, and 74.5% at the far side. Its 65% north–south floor band leaves standing athletes at 27.2% far, 29.8% mid, and 32.4% near viewport height. The midcourt stripe projects to one screen x-coordinate across the court, meeting both endline boundaries vertically; sideline, endline, and hoop-board depth cues remain.

The rim is 42.11px wide, about 0.39 of a mid-depth standing player's height. Its outer edge extends 1.91px over the projected out-of-bounds line in both attack views. The backboard is 13.30% of viewport width and parallel to the projected endline at 0°. The complete hoop assembly measures 30.71% W × 61.79% H. Each support base is fully visible 14.8 world units beyond its baseline.

Shot and dunk sprites rise with their existing vertical `z` lift: the dunk peak is lifted by 120px in screen space without enlarging standing athletes. Their shadows remain at the action's takeoff x/y on the floor plane. The dunker is court-ward of the rim; the sprite and separate athlete-specific ball track receive the same preview-only screen offset. The renderer sorts the dunker between the backboard and foreground rim/net. The camera sequence advances x=101.5→128.7→154.5→160.3→160.8 through recovery while Reed moves x=150→168→178→174.

| Check | Revision 13 | Target | Status |
| --- | ---: | ---: | --- |
| Floor band | y=126–360; 65.0% H | expanded north–south view | Pass |
| Visible court length | 70.0% near / 72.2% mid / 74.5% far | more attacking half toward midcourt | Pass |
| Midcourt stripe | vertical and meets both projected boundaries | vertical | Pass |
| Standing human height | 27.2% far / 29.8% mid / 32.4% near | 24–36% | Pass |
| Rim / standing-player width | 42.11px / 107.4px; 0.39 ratio | 0.36–0.47 close view | Pass |
| Full hoop assembly | 30.71% W × 61.79% H | 30–50% W × 55–66% H | Pass |
| Board width and alignment | 13.30% W; 0° from projected baseline | 12–16% W; parallel with perspective | Pass |
| Rim edge to baseline | 1.91px over in both views | just over out-of-bounds line | Pass |
| Support base | 14.8 world units beyond line; fully visible | base off court | Pass |
| Dunk lift and shadow | 120px lift; shadow fixed at takeoff | vertical lift from stationary takeoff mark | Pass |
| Dunk camera follow | x=101.5→160.8 through recovery | frame attacker and basket | Pass |

## Reference and limits

The arcade renderer references court coordinates, object-specific scale, and camera perspective as design principles. The public [NBA Jam assembly archive](https://github.com/historicalsource/nba-jam) separates hoop/backboard coordinates in `WORLD.EQU` and declares perspective modes and scale data in `DISP.EQU`; its provenance and licensing are unclear, and no code was copied. Mark Turmell's [developer interview](https://lawson.media/shows/gameplay/episodes/nba-jam-mark-turmell-tim-kitzrow-reyan-ali) describes scanline scrolling and parallax as historical context, not as a direct Canvas recipe.

Portrait retains the existing 4:3 letterboxed layout. The canvas occupies about 32.3% of the 390×844 screen versus the 55% / 464px target. This candidate does not claim portrait acceptance or full Issue #4 acceptance.

## Verification

- `npm test`: 52 test files pass. `npm run lint`: 19 JavaScript modules pass. `npm run validate:content`: 35 franchises / 105 unique athletes pass. Focused stage projection tests pass 11/11. An isolated production bundle build passes.
- The preserved Chromium 154 R13 capture set reports zero page errors. An optional R14 offset trial could not start Chromium in the current restricted environment; the unreviewed change was discarded, and the captured R13 geometry remains the candidate.
- Independent visual review confirms the vertical center stripe, larger attacking-half view, visible vertical lift from the stationary takeoff shadow, and a dunk pose that reads as reaching toward the rim rather than standing on it.
- No animation art, sprite frames, animation registrations, scoring logic, or production gameplay path changed. The strict animation audit was not refreshed because no animation assets changed. Production Pages remains at the prior documented `513e0a59` / run #169 checkpoint; no production Pages deployment was made.
