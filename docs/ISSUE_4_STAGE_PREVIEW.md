# Issue #4 stage preview

Date: 2026-10-26

**Status: Revision 15 landscape staging candidate ready for owner review; Issue #4 remains PARTIAL.** The Chicago Condas vs Crownfire Sovereigns stage stays opt-in behind `?stagePreview=1`. Production Pages and gameplay are unchanged.

## Review link and evidence

- [Private stage review gallery](https://jamverse-stage-review-20261026.manaconda2433.chatgpt.site/) is version 8, deployed from source commit `09470d8d61344de2c875a2c40f427efb2b08f5cc`. It compares Revision 5, R10, R13, and R15 and retains the eight-frame R13 capture set. The gallery remains owner-only.
- Current Chromium captures and measured `capture-manifest.json` are in `artifacts/screenshots/issue4-stage/`. Eight staged frames include centered court coverage, right dunk peak, left shot release, portrait baseline, and four dunk camera states. The R13 source captures remain separately archived in the review gallery.
- `tools/capture-issue4-stage.mjs` reproduces the frames from authored pose/ball tracks and deterministic scene states. It does not advance gameplay simulation; the camera alone eases between states. Captures are staged frames, not gameplay footage.

## Revision 15 court, hoop, and jump presentation

The view restores the prior 50% court-length framing so playable key and three-point markings return to their R10 screen scale. The far/mid/near court slices are 53.2% / 51.5% / 50.0%. The court floor now spans y=100–360, or 72.2% of the viewport height, while standing athletes remain 27.2% far, 29.8% mid, and 32.4% near. In the centered coverage view, the two-pixel midcourt stripe is snapped to one screen x-coordinate and is pixel-vertical between both projected endline midpoints.

The rim is 42.44px wide, about 0.39 of a mid-depth standing player's height. Its outer edge extends 2.79px across the projected out-of-bounds line in both attack views. The backboard is 13.16% of viewport width and parallel to the projected endline at 0°. The complete hoop assembly measures 32.64% W × 63.95% H. Each support base is fully visible 12 world units beyond its baseline.

Shot and dunk sprites rise with their existing vertical `z` lift: the dunk peak is lifted by 120px in screen space without enlarging standing athletes. Their shadows remain at the action's takeoff x/y on the floor plane. The dunker's body stays court-ward of the rim and reaches beside it; the separate athlete-specific ball track stays aligned with the hand. The camera sequence advances x=101.5→128.7→155.9→170.4→171.7 through recovery while Reed moves x=150→168→178→174.

| Check | Revision 15 | Target | Status |
| --- | ---: | ---: | --- |
| Floor band | y=100–360; 72.2% H | expanded north–south view | Pass |
| Visible court length | 50.0% near / 51.5% mid / 53.2% far | playable half-court scale | Pass |
| Midcourt stripe | pixel-vertical in coverage view | vertical between projected boundaries | Pass |
| Standing human height | 27.2% far / 29.8% mid / 32.4% near | 24–36% | Pass |
| Rim / standing-player width | 42.44px / 107.4px; 0.39 ratio | 0.36–0.47 close view | Pass |
| Full hoop assembly | 32.64% W × 63.95% H | 30–50% W × 55–66% H | Pass |
| Board width and alignment | 13.16% W; 0° from projected baseline | 12–16% W; parallel with perspective | Pass |
| Rim edge to baseline | 2.79px over in both views | just over out-of-bounds line | Pass |
| Support base | 12 world units beyond line; fully visible | base off court | Pass |
| Dunk lift and shadow | 120px lift; shadow fixed at takeoff | vertical lift from stationary takeoff mark | Pass |
| Dunk camera follow | x=101.5→171.7 through recovery | frame attacker and basket | Pass |

## Reference and limits

The arcade renderer references court coordinates, object-specific scale, and camera perspective as design principles. The public [NBA Jam assembly archive](https://github.com/historicalsource/nba-jam) separates hoop/backboard coordinates in `WORLD.EQU` and declares perspective modes and scale data in `DISP.EQU`; its provenance and licensing are unclear, and no code was copied. Mark Turmell's [developer interview](https://lawson.media/shows/gameplay/episodes/nba-jam-mark-turmell-tim-kitzrow-reyan-ali) describes scanline scrolling and parallax as historical context, not as a direct Canvas recipe.

Portrait retains the existing 4:3 letterboxed layout. The canvas occupies about 32.3% of the 390×844 screen versus the 55% / 464px target. This candidate does not claim portrait acceptance or full Issue #4 acceptance.

## Verification

- `npm test`: 52 test files pass. `npm run lint`: 19 JavaScript modules pass. `npm run validate:content`: 35 franchises / 105 unique athletes pass. Focused stage projection tests pass 11/11. The isolated bundle build passes.
- Chromium 154 captured all eight R15 staged frames with zero page errors. The manifest records court scale/depth, standing heights, rim/base bounds, and the camera sequence.
- Independent visual and code reviews confirm the playable-area scale, expanded north–south depth, vertical center stripe, fixed takeoff shadow, dunk-to-rim relation, separate ball alignment, and preview-only guards.
- No animation art, sprite frames, animation registrations, scoring logic, or production gameplay path changed. The strict animation audit was not refreshed because no animation assets changed. Production Pages remains at the prior documented `513e0a59` / run #169 checkpoint; no production Pages deployment was made.
