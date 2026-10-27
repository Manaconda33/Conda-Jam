#!/usr/bin/env python3
"""Normalize reviewed J.131 attempt 06 into separate 72x95 atlas cells.

Raw generations remain untouched. Only isolated low-alpha pixels outside a
4-pixel halo around the main alpha>=16 component are dropped; no body pixels
are painted, masked, or reconstructed. Each figure uses one shared 0.185
nearest-neighbor scale and its accepted-game baseline y=89.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "tools/generate-art/sources/j131-briar-foxglove-layup-reverse-attempt-06-raw.png"
OUTDIR = ROOT / "tools/generate-art/candidates/j131-briar-foxglove-layup-reverse-attempt-06"
DEST = OUTDIR / "briar-foxglove-layup-reverse-8x-candidate.png"
REPORT = OUTDIR / "normalization-report.json"
CELL_W, CELL_H = 72, 95
SRC_CELL_W, SRC_CELL_H = 384, 512
SCALE = 0.185
BASELINE = 89

raw = np.array(Image.open(SOURCE).convert("RGBA"))
if raw.shape[:2] != (1024, 1536):
    raise SystemExit(f"unexpected source dimensions: {raw.shape[1]}x{raw.shape[0]}")
out = Image.new("RGBA", (CELL_W * 4, CELL_H * 2), (0, 0, 0, 0))
records = []

for index in range(8):
    col, row = index % 4, index // 4
    cell = raw[row * SRC_CELL_H:(row + 1) * SRC_CELL_H,
               col * SRC_CELL_W:(col + 1) * SRC_CELL_W].copy()
    alpha = cell[:, :, 3]
    core_labels, core_count = ndimage.label(alpha >= 16, np.ones((3, 3), dtype=np.uint8))
    if not core_count:
        raise SystemExit(f"pose {index + 1} has no alpha>=16 subject pixels")
    core_sizes = np.bincount(core_labels.ravel())
    core_sizes[0] = 0
    core_label = int(core_sizes.argmax())
    core_mask = core_labels == core_label
    ys, xs = np.where(core_mask)
    x0, x1 = int(xs.min()), int(xs.max() + 1)
    y0, y1 = int(ys.min()), int(ys.max() + 1)

    # Preserve all native subject/antialias pixels near the main figure. Clear
    # only disconnected low-alpha fringe lying outside a 4-source-pixel halo.
    halo = np.zeros_like(alpha, dtype=bool)
    halo[max(0, y0 - 4):min(SRC_CELL_H, y1 + 4),
         max(0, x0 - 4):min(SRC_CELL_W, x1 + 4)] = True
    low_fringe = (alpha > 0) & (alpha < 16) & ~halo
    removed = int(low_fringe.sum())
    cell[low_fringe, 3] = 0

    # Crop the subject with four source pixels of antialias allowance.
    cx0, cx1 = max(0, x0 - 4), min(SRC_CELL_W, x1 + 4)
    cy0, cy1 = max(0, y0 - 4), min(SRC_CELL_H, y1 + 4)
    crop = Image.fromarray(cell, "RGBA").crop((cx0, cy0, cx1, cy1))
    size = (round(crop.width * SCALE), round(crop.height * SCALE))
    sprite = crop.resize(size, Image.Resampling.NEAREST)
    if sprite.width > CELL_W - 12 or sprite.height > BASELINE - 6:
        raise SystemExit(f"pose {index + 1} does not fit: {sprite.size}")
    dx = col * CELL_W + (CELL_W - sprite.width) // 2
    dy = row * CELL_H + BASELINE - sprite.height
    out.alpha_composite(sprite, (dx, dy))
    placed = out.crop((col * CELL_W, row * CELL_H,
                       (col + 1) * CELL_W, (row + 1) * CELL_H))
    box = placed.getchannel("A").getbbox()
    records.append({
        "pose": index + 1,
        "sourceAlpha16BBox": [x0, y0, x1, y1],
        "sourceCrop": [cx0, cy0, cx1, cy1],
        "uniformScale": SCALE,
        "normalizedSize": list(sprite.size),
        "atlasPlacement": [dx, dy],
        "normalizedAlphaBBoxLocal": list(box) if box else None,
        "removedDetachedLowAlphaFringePixels": removed,
        "baselineY": BASELINE,
    })

OUTDIR.mkdir(parents=True, exist_ok=True)
out.save(DEST, format="PNG", optimize=True)
REPORT.write_text(json.dumps({
    "source": str(SOURCE.relative_to(ROOT)),
    "sourceSha256": __import__("hashlib").sha256(SOURCE.read_bytes()).hexdigest(),
    "destination": str(DEST.relative_to(ROOT)),
    "layout": {"columns": 4, "rows": 2, "cellWidth": CELL_W, "cellHeight": CELL_H},
    "cleanup": "Only disconnected alpha 1–15 pixels outside a 4px halo around each largest alpha>=16 component were cleared; no subject pixels were repainted. Each subject crop uses uniform nearest-neighbor scale 0.185 and baseline y=89.",
    "poses": records,
}, indent=2) + "\n")
print(DEST)
print(REPORT)
