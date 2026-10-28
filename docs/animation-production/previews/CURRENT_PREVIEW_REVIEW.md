# Current Jamverse animation preview verification

**Review timestamp:** 2026-10-28 19:25 UTC
**Branch baseline:** `codex/captain-animation-completion` with the Kraken pass checkpoint built and validated
**Build:** `npm run build`, standalone `dist/JAMVERSE_96.html`; exact current atlas bytes verified embedded

The rebuilt branch preview contains all current animation registrations:

- 105 roster athletes
- 885 registered athlete/clip assignments
- 885 unique referenced atlas assets
- 8,067 frame rectangles
- 0 missing atlas sources in the built preview
- 0 extra atlas sources outside the manifest references
- 0 embedded atlas byte mismatches
- Standalone preview size: 119,062,808 bytes

Krios has all 29 registered clips; Kraken has 10 registered clips, including `celebrate`, `shoot`, and the newly accepted bespoke `pass`. The local preview uses Kraken's reviewed elf art, plus accepted separate-ball shooting and passing tracks. Kraken rebound and reverse-layup candidates remain excluded.

The preview embeds every registered manifest atlas byte-for-byte with no missing or extra source. Normal-loader gameplay evidence for Kraken `shoot` confirms the new manifest entry and integrated ball track select `kraken-shoot-right.webp` in both facings and score correctly in all four zoom/facing runs; see `tools/generate-art/previews/kraken-shoot10-attempt01/live-gameplay-candidate/track-attempt36/offset-+10.0/`.

Kraken `pass` also uses its registered normal-loader atlas and athlete-specific ball path. The live pass reaches Marin Dusk's receive frame2/tick4 hand track without a floor bounce or catch snap; attempt15 passes 64 captures at both facings and zooms. Evidence and independent review: `tools/generate-art/previews/kraken-pass6-track-candidate/attempt-15/native/`.

An identity follow-up compared the user-provided Krios-on-court screenshot with the authoritative roster specs, the Kraken/Krios source atlases, and the current branch's normal-loader celebration capture. The submitted screenshot depicts Krios while Kraken receives the score, but its source build is unknown. The registered celebration atlas and current branch capture depict Kraken's elf design. See `tools/generate-art/previews/kraken-celebrate10-attempt04/identity-audit/INDEPENDENT_IDENTITY_AUDIT.md`; this comparison does not establish the submitted screenshot's build provenance.

This validates the local branch build. The Pages workflow deploys `main`; this preview check does not claim a deployed Pages commit or URL.
