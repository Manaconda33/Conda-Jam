# Issue #4 stage preview

Date: 2026-10-26

**Status: landscape vertical slice ready for owner review; Issue #4 is not accepted.** The Chicago Condas vs Crownfire Sovereigns stage is available in game only with `?stagePreview=1`. The candidate keeps the renderer opt-in. Reed’s shared athlete-specific shot ball track aligns his gameplay release with his authored hand; scoring logic and sprite frames are unchanged. Portrait remains at its letterboxed baseline and does not meet its target.

## Review link and evidence

- [Private stage review gallery](https://jamverse-stage-review-20261026.manaconda2433.chatgpt.site/) compares revision 6 with revision 5, which had the reviewed rim size and baseline placement but missed the assembly dimensions. Site source `bc7fed05fb211dc21ecd418bab7b551b1bbcdb9c` deployed successfully as version `appgver_762ae380645c8191a8d79b1fb7fa7a98`; production GitHub Pages was not changed.
- For local QA, run `npm run preview` and open `http://localhost:4173/JAMVERSE_96.html?stagePreview=1` inside the development environment. This localhost address is not a user-facing link.
- Current staged Chromium captures and measured `capture-manifest.json` are in `artifacts/screenshots/issue4-stage/`. Revisions 1–5 are preserved in `baseline-v1/` through `baseline-v5/`.
- `tools/capture-issue4-stage.mjs` reproduces the four frames with zero simulation ticks while the renderer settles. The shots are staged frames, not gameplay footage. Reed’s authored separate-ball tracks provide the dunk and shot ball positions. The capture derives the released ball X from his runtime shot track rather than a hand-entered offset.

## Hoop revision

Revision 2 corrected the rim size but the local handoff incorrectly dropped Issue #4’s assembly-size target. The authoritative issue requires the full basket assembly to occupy 30–50% of viewport width and 55–66% of viewport height, with the backboard alone at 12–16% of width. Revision 6 restores those requirements without enlarging the rim.

Revision 6 keeps the rim 8 world units inside the endline and its 42.5 px diameter. Its edge sits about 16 px inside the line; the 62 px board overlaps the baseline. The base is 13.5 world units beyond the endline at depth Y=78, near the apron and fully visible. With the attack camera framing, the left/right assembly bounds are 30.6% W × 56.4% H; the board is 13.1% W and the rim centers are 29.5% / 70.5%. The support depth sorts in front of far-side players and behind near-side players. The dunk capture shows the ball and fingertips meeting the rim. Reed’s separate `shoot` ball-forward track is 11.5 world units at frame 5 / tick 13, matching the authored release hand.

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
| Full hoop assembly | 30.6% W × 56.4% H | 30–50% W × 55–66% H | Pass |
| Backboard width | 13.1% W | 12–16% W | Pass |
| Rim edge to baseline | about 16px in both mirrored views | close to line, still inbounds | Pass |
| Board and support | board overlaps baseline; base 13.5 world units beyond endline near apron, fully visible | board/rim over line; base off court | Pass |
| Rim centers | right 70.5%; left 29.5% W | right 70–80%; left 20–30% | Pass |
| Dunk contact | ball overlaps Reed’s raised fingertips and grazes the rim | legible hand/rim contact | Pass |
| Support clearance | outside rim and player silhouette in both directions | no accidental crossings | Pass |

Dragon Queen is nonhuman and is not used for the far-human height measurement. The 1996 reference screenshots show different camera distances; visual review compares rim/player proportions by scene rather than applying one assembly-width target to every shot.

## Portrait gate and limits

The portrait capture retains the current 4:3 letterboxed layout. Its game canvas is about y=232–505, or 32.3% of the 390×844 screen, below the 55% / 464px target. Issue #4’s work order gates portrait camera/layout work on owner approval of this landscape slice. This candidate is ready for that approval; it does not claim portrait acceptance or complete Issue #4.

## Verification

- `npm test`: PASS, 495 tests.
- `npm run test:e2e`: PASS, complete Chromium offline startup, match, and season journey.
- `npm run lint`: PASS, 19 JavaScript modules.
- `npm run validate:content`: PASS, 35 franchises / 105 athletes.
- `npm run simulate:league`: PASS, 100 matches / 857,283 ticks / 5 overtime periods.
- `npm run build`: PASS, including the self-contained bundle.
- Stage projection, camera tracking, and Reed shot-track tests: PASS, 13 focused tests.
- Chromium 154 captures: four frames, zero page errors. The manifest records the calculated assembly bounds and out-of-bounds anchors; revisions 1–5 are retained. Portrait remains baseline only.
- No animation assets or registrations changed; the strict animation audit was not refreshed.
- Production Pages remains at the earlier `513e0a59` / run #169 checkpoint. No scoring logic or sprite frames changed. Reed’s shared shot-release origin now follows the athlete-specific track and therefore affects his gameplay ball positioning. No production Pages deployment was made.
