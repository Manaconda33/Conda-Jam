# Issue #4 stage preview checkpoint

Date: 2026-10-26

**Status: local review candidate; not deployed or accepted.** The Chicago Condas vs Crownfire Sovereigns stage is available behind `?stagePreview=1`. Without that query flag, the default view and gameplay remain unchanged. No simulation values or gameplay rules were modified. This candidate is ready for visual review; portrait acceptance remains gated and is not claimed.

## Preview and evidence

- Run `npm run preview`, then open `http://localhost:4173/JAMVERSE_96.html?stagePreview=1` for the local opt-in bundle. This is a local preview; it does not overwrite or deploy the production page.
- Four staged Chromium captures using registered production sprites are in `artifacts/screenshots/issue4-stage/`: near-side dribble, right dunk peak, left shot release, and portrait play. The exact scene positions, clips, ticks, ball states, preview flag, and browser version are recorded in `capture-manifest.json`.
- `tools/capture-issue4-stage.mjs` reproduces the frames with zero simulation ticks while the renderer settles. These are staged frames, not gameplay footage. Reed's authored separate-ball tracks supply the dunk and shot ball positions; the ball is drawn separately from the athlete sprites.

## Landscape measurements

| Check | Capture result | Target | Status |
| --- | ---: | ---: | --- |
| Floor band | y=152–360; 57.8% H | 55–60% H | Pass |
| Standard court slice | 50% at midcourt | 48–52% | Pass |
| Near standing figure | Manaconda: 110px; 30.6% H | 30–36% H | Pass |
| Far standing human | Auric Scale: 100px; 27.8% H | 24–30% H | Pass |
| Dunk pose | 142px; 39.4% H | 35–42% H | Pass |
| Ball diameter | 19px; 4.0% W | 3.5–4.5% W | Pass |
| Hoop assembly | 146–147px; 30.4–30.6% W | 30–50% W | Pass |
| Rim center | right 75.8–76.0%; left 24.8% W | right 70–80%; left 20–30% W | Pass |
| Dunk ball contact | Orange ball overlaps the raised fingers at the rim | Clearly separate and hand-aligned | Pass |

Dragon Queen is a nonhuman and is not used for the far-human height measurement. The camera focus uses each attack basket, with its transition complete within 30 world units. Hoops and support feet are mirrored, visible, and depth-sorted in the landscape captures.

## Portrait gate and limitations

The portrait screenshot preserves the current 4:3 letterboxed layout. Its game canvas is about y=232–505, or 32.3% of the 390×844 screen, below the 55% / 464px target; its standing figure is also below 95px. Issue #4's approval gate comes before portrait camera/layout work, so this remains a clearly marked baseline and the candidate does not claim portrait acceptance.

The preview is not a complete Issue #4 implementation. No full court redraw, production rollout, deployment, or approval claim is included. The gameplay renderer's default path and simulation remain isolated from the stage preview.

## Verification

- `npm run build`: PASS, including the self-contained `dist/JAMVERSE_96.html` bundle.
- `npm run lint`: PASS, 19 JavaScript modules.
- `npm test`: PASS, 51 test files.
- `npm run test:e2e`: PASS, Chromium standalone offline startup and complete match/season journey, including controls, substitutions, dunk/FIRE, nonhuman matchups and accessibility checks.
- `node tests/jam-stage-projection.test.js`: PASS, 6 tests.
- `node tests/camera-tracking.test.js`: PASS, 5 tests.
- Final Chromium 154 capture: four frames, zero page errors. Captures and manifest timestamp: `2026-10-26T02:58:27.344Z`.
- The strict animation audit was not refreshed because no animation asset or registration changed; the current J.129/J.130 audit status remains as recorded in the asset audit and handoff notes.
