# Issue #4 stage preview

Date: 2026-10-26

**Status: landscape vertical slice ready for owner review; Issue #4 remains PARTIAL.** The Chicago Condas vs Crownfire Sovereigns stage stays opt-in behind `?stagePreview=1`. Revision 10 improves the basket face and out-of-bounds placement, expands the north–south court projection without scaling standing athletes, and captures a dunk camera sequence. Portrait remains at its letterboxed baseline and does not meet its target.

## Review link and evidence

- [Private stage review gallery](https://jamverse-stage-review-20261026.manaconda2433.chatgpt.site/) shows revision 5 beside revision 10, the left shot release, court scale, portrait baseline, and the approach-to-recovery dunk sequence. The separate Sites project is version 6 (`appgver_3baedc45398c819187215b2740ee6576`), source `a73ca581cb3f6cbb421fde98dd30fc87cb9a9945`; its deployment succeeded. Production GitHub Pages was not changed.
- Current Chromium captures and measured `capture-manifest.json` are in `artifacts/screenshots/issue4-stage/`. Eight frames include near dribble, right dunk peak, left shot release, portrait baseline, and four dunk camera states. Prior revisions 1–5 remain in `baseline-v1/` through `baseline-v5/`.
- `tools/capture-issue4-stage.mjs` reproduces the eight frames from authored pose/ball tracks and deterministic scene states. It does not advance gameplay simulation; the camera alone eases between states. Captures are staged frames, not gameplay footage.

## Revision 10 hoop and camera

The rim's outside edge crosses the projected baseline by about 1.56px in both views. The 44.05px rim remains about 0.41 of a mid-depth standing player's height. The backboard's actual horizontal screen bounds are 12.63% of viewport width and align to the projected baseline within measurement precision (0°). Its north–south axis is projected with a stable attack-direction camera basis, so the court does not rotate as the camera follows an attacker.

The entire hoop assembly measures 32.0% W × 61.8% H, within Issue #4's 30–50% W × 55–66% H target. The stanchion foot is 12 world units outside the endline at depth Y=60; both projected base bounds remain visible. The floor occupies 65% of viewport height (y=126–360). Far, mid, and near standing humans remain 27.2%, 29.8%, and 32.4% of viewport height; only the dunk pose receives stage lift, a modest 8% apex push-in, and a 22px downward camera pan.

The four-frame camera record moves from x=101.5 at the approach capture to x=128.7, x=155.9, and x=172.1 at launch/apex, then settles at x=173.7 on recovery while the attacker moves x=150→168→178→174. The ball remains at the separate athlete-specific track and clears the HUD in the apex capture.

The preview renderer remains opt-in. Scoring logic, production sprite frames, and animation registrations are unchanged. Reed's shared `shoot` ball track continues to align gameplay release with his authored hand. No animation assets were added or registered by this pass.

## Landscape measurements

| Check | Revision 10 | Target | Status |
| --- | ---: | ---: | --- |
| Floor band | y=126–360; 65.0% H | expanded north–south view | Pass |
| Midcourt slice | 50% of court length | 48–52% | Pass |
| Standing human height | 27.2% far / 29.8% mid / 32.4% near | 24–36% | Pass |
| Rim / standing-player width | 44.05px / 107.4px; 0.41 ratio | 0.36–0.47 close view | Pass |
| Full hoop assembly | 32.0% W × 61.8% H | 30–50% W × 55–66% H | Pass |
| Backboard horizontal bounds | 12.63% W | 12–16% W | Pass |
| Board / baseline alignment | 0° | parallel with perspective | Pass |
| Rim edge to baseline | 1.56px beyond in both views | just over out-of-bounds line | Pass |
| Support base | 12 world units out; fully visible both ends | off court | Pass |
| Rim centers | left 28.9% / right 71.1% W | left 20–30% / right 70–80% | Pass |
| Dunk camera follow | x=101.5→173.7 through recovery | frame attacker and basket | Pass |

The arcade renderer references court coordinates, object-specific scale, and camera perspective as design principles. The public [NBA Jam assembly archive](https://github.com/historicalsource/nba-jam) separates hoop/backboard coordinates in `WORLD.EQU` and declares perspective modes and scale data in `DISP.EQU`; its provenance and licensing are unclear, and no code was copied. Mark Turmell's [developer interview](https://lawson.media/shows/gameplay/episodes/nba-jam-mark-turmell-tim-kitzrow-reyan-ali) describes scanline scrolling and parallax as historical context, not as a direct Canvas recipe.

## Portrait gate and limits

Portrait retains the existing 4:3 letterboxed layout. The canvas occupies about 32.3% of the 390×844 screen versus the 55% / 464px target. Issue #4 still gates portrait camera/layout work on owner approval of this landscape slice. This candidate does not claim portrait acceptance or full Issue #4 acceptance.

## Verification

- `npm test`: 52 test files pass. `npm run test:e2e`: full Chromium journey passes, including offline standalone startup and a complete match/season progression. `npm run lint`: 19 modules pass.
- `npm run validate:content`: 35 franchises / 105 athletes pass. `npm run simulate:league`: 100 matches, 857,283 ticks, and 5 overtimes pass. `npm run build` passes.
- Focused stage projection tests: 10/10 pass, including athlete scale preservation, actual horizontal board bounds, baseline overlap, assembly bounds, stable view azimuth through camera translation, and rim placement. Chromium 154 captured eight deterministic frames with zero page errors; camera X and actual horizontal board bounds are recorded in the manifest.
- Strict animation audit was not refreshed because this pass changes no assets. Production Pages remains at the prior documented `513e0a59` / run #169 checkpoint; no production Pages deployment was made.
