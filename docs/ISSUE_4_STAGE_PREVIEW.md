# Issue #4 stage preview

Date: 2026-10-26

**Status: opt-in renderer review candidate; not accepted.** The Chicago Condas vs Crownfire Sovereigns stage is available in game only with `?stagePreview=1`. The default renderer, simulation, and gameplay rules remain unchanged. Portrait remains at its letterboxed baseline and does not meet its target.

## Review link and evidence

- [Private stage review gallery](https://jamverse-stage-review-20261026.manaconda2433.chatgpt.site/) hosts the current captures and the original baseline captures for side-by-side review. It is a separate Sites project; the production GitHub Pages site was not changed.
- For local QA, run `npm run preview` and open `http://localhost:4173/JAMVERSE_96.html?stagePreview=1` inside the development environment. This localhost address is not a user-facing link.
- Current staged Chromium captures and `capture-manifest.json` are in `artifacts/screenshots/issue4-stage/`. The prior 1.9× hoop captures and manifest are preserved under `artifacts/screenshots/issue4-stage/baseline-v1/`.
- `tools/capture-issue4-stage.mjs` reproduces the four frames with zero simulation ticks while the renderer settles. The shots are staged frames, not gameplay footage. Reed’s authored separate-ball tracks provide the dunk and shot ball positions.

## Hoop revision

The first candidate enlarged the entire basket 1.9× around the rim. Its old 30–50% viewport assembly-width target rewarded the oversized rim and fixed-offset backboard visible in the baseline captures. Revision 2 removes that criterion.

The current renderer projects the rim and backboard from their separate court anchors and places the stanchion foot near the foreground sideline. Rim/backboard and support are depth-sorted separately. On the 480×360 canvas, the rim’s nominal width is about 42.5 px, about 0.40 of a standing player at mid-depth. The dunk capture shows the ball and fingertips meeting the rim; the support clears the player. The shot-release capture places Reed close enough to the left rim for the release to read as a basket attempt. Left and right views mirror, with the rim centers near 25% and 76% of the canvas width.

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
| Rim centers | right 75.8–76.0%; left 24.8% W | right 70–80%; left 20–30% | Pass |
| Dunk contact | ball overlaps Reed’s raised fingertips and grazes the rim | legible hand/rim contact | Pass |
| Support clearance | outside rim and player silhouette in both directions | no accidental crossings | Pass |

Dragon Queen is nonhuman and is not used for the far-human height measurement. The 1996 reference screenshots show different camera distances; visual review compares rim/player proportions by scene rather than applying one assembly-width target to every shot.

## Portrait gate and limits

The portrait capture retains the current 4:3 letterboxed layout. Its game canvas is about y=232–505, or 32.3% of the 390×844 screen, below the 55% / 464px target. Portrait camera/layout work remains gated on review of this stage slice, so the candidate does not claim portrait acceptance or complete Issue #4.

## Verification

- `npm test`: PASS, 494 tests.
- `npm run test:e2e`: PASS, complete Chromium offline startup, match, and season journey.
- `npm run lint`: PASS, 19 JavaScript modules.
- `npm run validate:content`: PASS, 35 franchises / 105 athletes.
- `npm run simulate:league`: PASS, 100 matches / 861,421 ticks / 6 overtime periods.
- `npm run build`: PASS, including the self-contained bundle.
- Stage projection and camera tracking tests: PASS, 12 focused tests.
- Chromium 154 captures: four frames, zero page errors; portrait remains baseline only.
- No animation assets or registrations changed; the strict animation audit was not refreshed.
- Production Pages remains at the earlier `513e0a59` / run #169 checkpoint. No production deployment or gameplay change is included.
