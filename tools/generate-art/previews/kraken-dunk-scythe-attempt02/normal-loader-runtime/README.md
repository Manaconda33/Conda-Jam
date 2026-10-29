# Kraken dunk-scythe registered-loader integration review

**Verdict: pass for isolated candidate integration only. The production repo remains unregistered.**

The live repository manifest and `src/content/animation-assets.js` do not contain Kraken `dunk-scythe`. To exercise the ordinary registered asset loader without touching those shared files, the then-current app source was copied to `/tmp/kraken-scythe-production-loader`. Only that isolated copy received a temporary candidate registry entry and candidate track entry. The capture script ran in runtime mode: it did not route-inject candidate art or ball-track data (`candidateAtlasInjected:false`, `candidateBallTrackInjected:false`). The only route hook exposed the renderer's existing loaded image map for capture verification.

The registered atlas was encoded as a true lossless WebP from the independently reviewed cleanup03 PNG. It is 440×288 RGBA and pixel-identical to the PNG after decode. SHA-256: `433f427f13a004b2bae42da55287243ed2903257ce3ebabbc69b44850362417e`. The source PNG SHA-256 is `baef51515b6f0f5041ced9ea436736928e6d4924eac9ec83ae80dac02e588c54`.

## Final integration pass

`attempt-02-proper-webp/` contains the registered WebP artifact, the temporary manifest entry, full capture report, and 60 screenshots across both facings × 100/120 zoom. The loader selected all 15 expected frames from `./public/assets/animation/kraken-dunk-scythe-right.webp` in every run. Both directions scored two points for Kraken at tick 23 and were grounded; there were no browser errors. The left-facing run awards the away score column as expected.

Manual review of the proper-WebP captures confirmed the already reviewed hand contact at frames 6–9, rim release at frame 10, and identity/scale against the current Vesper Harbor Undertow / Blackthorn Court Kings Jam Stage. Representative images include `attempt-02-proper-webp/right-frame08-tick17-zoom120.png` and `attempt-02-proper-webp/left-frame10-tick21-zoom120.png`.

## Preserved rejected packaging trial

`rejected-pass-01-png-bytes-as-webp/` retains the initial 60-image loader run. It was rejected because the candidate PNG payload had been copied to a filename ending in `.webp`. The browser could decode it, but this did not match the registered asset format. The final pass uses the correct lossless WebP encoding.

This integration review establishes loader compatibility for a candidate registry entry. It does not register the clip in the shared production manifest or approve asset promotion.
