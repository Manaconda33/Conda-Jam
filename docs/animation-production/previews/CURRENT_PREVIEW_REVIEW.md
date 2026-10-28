# Current Jamverse animation preview verification

**Review timestamp:** 2026-10-28 14:21 UTC
**Branch baseline:** `e763ff1fff7048b38489089d1dcc36451d1bd8e5` (`codex/captain-animation-completion`)
**Build:** `npm run build`, standalone `dist/JAMVERSE_96.html`

The rebuilt branch preview contains all current animation registrations:

- 105 roster athletes
- 882 registered athlete/clip assignments
- 882 unique referenced atlas assets
- 8,041 frame rectangles
- 0 missing atlas sources in the built preview
- 0 extra atlas sources outside the manifest references
- Standalone preview size: 118,838,777 bytes

Krios has all 29 registered clips; Kraken has its current 7. Unregistered Kraken rebound and reverse-layup candidates are absent from the preview. They remain review artifacts, not runtime registrations.

The preview was rebuilt after the rejected 0.8 Jam Stage shot-scale experiment was removed from the working renderer. Shoot track attempts22–24 remain diagnostic captures with the temporary scale experiment; no renderer or animation registration change is part of the current preview.

This validates the local branch build. The Pages workflow deploys `main`; this preview check does not claim a deployed Pages commit or URL.
