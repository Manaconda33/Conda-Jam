# Current Jamverse animation preview verification

**Review timestamp:** 2026-10-29 02:34 UTC  
**Branch:** `codex/captain-animation-completion` at the accepted Kraken `pass-behind` checkpoint  
**Build:** `npm run build`; standalone `dist/JAMVERSE_96.html`

The current local preview includes every registered animation asset from the production manifest:

- 105 roster athletes
- 887 registered athlete/clip assignments
- 887 production animation atlas assignments
- 8,079 production frame rectangles
- 48 referenced legacy atlases
- 935 total embedded atlases
- `pass-behind` is included in Kraken's 12 registered clips

The build completed after registering the Kraken atlas and running the normal-loader capture review. The focused pass-behind integration test and full test suite passed (77/77), lint passed (21 JavaScript modules), and content validation passed (35 franchises, 105 athletes, 35 captains). This is the current local branch preview; it is not a Pages deployment.

The strict report-only asset audit remains intentionally incomplete: 2,380 inspected assignments, 553 source atlases, 5,288 unique source drawings, and 723 missing captain assignments. Kraken J.129 has 17 missing clips. A fresh fall generation is preserved but rejected for painterly style and is not included in this build.
