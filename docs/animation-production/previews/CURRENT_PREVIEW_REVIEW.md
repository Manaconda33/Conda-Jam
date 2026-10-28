# Current Jamverse animation preview verification

**Review timestamp:** 2026-10-28 15:46 UTC
**Branch baseline:** `755a4a9b` (`codex/captain-animation-completion`)
**Build:** `npm run build`, standalone `dist/JAMVERSE_96.html`; exact current atlas bytes verified embedded

The rebuilt branch preview contains all current animation registrations:

- 105 roster athletes
- 883 registered athlete/clip assignments
- 883 unique referenced atlas assets
- 8,051 frame rectangles
- 0 missing atlas sources in the built preview
- 0 extra atlas sources outside the manifest references
- 0 embedded atlas byte mismatches
- Standalone preview size: 118,953,442 bytes

Krios has all 29 registered clips; Kraken has 8 registered clips, including `celebrate`. The local preview uses Kraken's reviewed bespoke celebration atlas, so new scores display Kraken instead of the old Krios fallback. Kraken rebound and reverse-layup candidates remain excluded.

The preview was rebuilt from commit `755a4a9b`. Every atlas source matches its embedded byte-for-byte representation, including `kraken-celebrate-right.png`.

An identity follow-up compared the user-provided Krios-on-court screenshot with the authoritative roster specs, the Kraken/Krios source atlases, and the current branch's normal-loader celebration capture. The submitted screenshot depicts Krios while Kraken receives the score, but its source build is unknown. The registered celebration atlas and current branch capture depict Kraken's elf design. See `tools/generate-art/previews/kraken-celebrate10-attempt04/identity-audit/INDEPENDENT_IDENTITY_AUDIT.md`; this comparison does not establish the submitted screenshot's build provenance.

This validates the local branch build. The Pages workflow deploys `main`; this preview check does not claim a deployed Pages commit or URL.
