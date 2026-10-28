# Current Jamverse animation preview verification

**Review timestamp:** 2026-10-28 15:28 UTC
**Branch baseline:** `eec6e111` (`codex/captain-animation-completion`)
**Build:** `npm run build`, standalone `dist/JAMVERSE_96.html`; exact current atlas bytes verified embedded

The rebuilt branch preview contains all current animation registrations:

- 105 roster athletes
- 882 registered athlete/clip assignments
- 882 unique referenced atlas assets
- 8,041 frame rectangles
- 0 missing atlas sources in the built preview
- 0 extra atlas sources outside the manifest references
- 0 embedded atlas byte mismatches
- Standalone preview size: 118,839,714 bytes

Krios has all 29 registered clips; Kraken has its current 7. Unregistered Kraken rebound and reverse-layup candidates are absent from the preview. They remain review artifacts, not runtime registrations.

The preview was rebuilt from the pushed renderer checkpoint. Candidate Kraken celebrate and pickup artwork is still unregistered and does not appear in the runtime preview. The Krios score animation remains the current generic fallback when Kraken scores; the new Kraken celebrate source is under candidate review.

This validates the local branch build. The Pages workflow deploys `main`; this preview check does not claim a deployed Pages commit or URL.
