# Current Jamverse animation preview verification

**Review timestamp:** 2026-10-28 19:55 UTC
**Branch:** `codex/captain-animation-completion` with Kraken J.129 `pass-overhead` and the reviewed catch-depth fix
**Build:** `npm run build`; standalone `dist/JAMVERSE_96.html`

The current local preview includes all registered animation assets:

- 105 roster athletes
- 886 registered athlete/clip assignments
- 886 production animation atlases
- 8,073 production frame rectangles
- 48 referenced legacy atlases
- 934 total embedded atlases, checked byte-for-byte
- 0 missing, extra, or mismatched embedded atlas sources
- Standalone preview size: 119,117,646 bytes

Kraken J.07 / J.129 has 11 of 29 registered clips. Its new six-pose `pass-overhead` atlas and separate track are included. A normal-loader check exercised all six frame selections in both facings; four live passes reached Marin Dusk at courtY=75 and 100%/120% zoom, with the ball visible into her hands and no score change or browser error. The renderer draws the ball ahead of its intended receiver only within the 6-unit catch radius; simulation remains unchanged. Rejected track trials 05–08 and the accepted attempt09 evidence remain in `tools/generate-art/previews/kraken-pass-overhead-track-candidate/`.

The preview still uses Kraken's reviewed elf artwork in its celebration, shooting, chest-pass, and overhead-pass clips. Kraken's rebound and reverse layup remain unregistered. The local preview is not a Pages deployment.
