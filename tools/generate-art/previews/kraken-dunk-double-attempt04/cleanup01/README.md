# Kraken dunk-double attempt04 cleanup01

**Status: derived candidate only; independent cleanup review pending. Nothing here is registered or accepted for gameplay.**

The untouched ImageGen source and prompt remain at the paths recorded in `tools/generate-art/kraken-dunk-double-attempt04-provenance.json`. The raw PNG SHA-256 is `8a582d128de208c2dc6fb5b10063e463dd978e6baef9f99d5e04b08cb49a17a4`; the generation ID is `exec-082755a3-2ba2-4385-b10c-5cd7664f98f7`.

## Cleanup

Run `python tools/generate-art/clean-kraken-dunk-double-attempt04-cleanup01.py` to reproduce this directory. The script thresholds source alpha at 64, extracts all 15 connected athlete components, restores row-major order by three source-row centroid bands and horizontal centroid, and packs the full poses into a transparent 5×3 atlas of 80×96 cells. It derives one shared 24-color palette across all visible poses, applies it without dithering, and uses a common 0.2330097087 nearest-neighbor scale. Feet align to baselineY 94. Transparent pixels are cleared; figures are not painted, recolored by hand, or reshaped.

No component was discarded. All 15 output frames have distinct normalized hashes. The cell margins range from 4 to 23 px horizontally, 15 to 37 px at top, and 2 px below baseline. Visible heights range from 57 to 79 px, reflecting the source silhouettes including bent, overhead, and upright poses. The largest source silhouette controls the common scale and safe side margins.

## Files

- `kraken-dunk-double-attempt04-cleanup01-atlas.png`: transparent 400×288 runtime-shaped candidate atlas.
- `kraken-dunk-double-attempt04-cleanup01-light-preview.png` and `...-dark-preview.png`: 3× nearest-neighbor proofs against contrasting backgrounds.
- `cleanup-layout-report.json`: source lineage, source component boxes, dimensions, per-frame bounds, margins, palette, alpha cleanup, hashes, and review status.

The independent source review accepts the raw art for careful cleanup and candidate gameplay trials. It does not accept this cleanup derivative; independent final cleanup review remains pending.
