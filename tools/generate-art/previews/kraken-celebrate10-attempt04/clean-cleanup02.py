"""Isolate the ten Kraken celebrate figures and pack a 10-frame trial atlas."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[4]
HERE = Path(__file__).resolve().parent
RAW_PATH = ROOT / "tools/generate-art/sources/kraken-celebrate10-attempt04-generated-raw.png"
OUTDIR = HERE / "cleanup02"
OUT = OUTDIR / "poses"
CW, CH, BASELINE = 88, 96, 94
TARGET_HEIGHT = 88
DURATIONS = [5, 5, 6, 8, 10, 10, 8, 7, 6, 5]
RAW = np.asarray(Image.open(RAW_PATH).convert("RGBA"))
ALPHA = RAW[:, :, 3]

# The generator leaves isolated alpha specks in the otherwise clear canvas.
# Select the ten large character silhouettes; retain only their original pixels
# and the original alpha fringe within 1.5 source pixels of each silhouette.
labels, count = ndimage.label(ALPHA >= 16, structure=np.ones((3, 3), dtype=np.uint8))
sizes = np.bincount(labels.ravel(), minlength=count + 1)
figure_ids = [int(i) for i in np.argsort(sizes[1:])[::-1] + 1 if sizes[i] >= 10_000]
if len(figure_ids) != 10:
    raise RuntimeError(f"Expected ten separate figure components; found {len(figure_ids)}")

# Sort figures in row-major order by center Y, then X.
records = []
for component_id in figure_ids:
    yy, xx = np.where(labels == component_id)
    bbox = [int(xx.min()), int(yy.min()), int(xx.max() + 1), int(yy.max() + 1)]
    records.append((float(np.mean(yy)), float(np.mean(xx)), component_id, bbox))
records.sort(key=lambda r: (r[0] >= RAW.shape[0] / 2, r[1]))

OUTDIR.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)
cells: list[Image.Image] = []
layout = []
for index, (_, _, component_id, bbox) in enumerate(records):
    x0, y0, x1, y1 = bbox
    pad = 4
    ex0, ey0, ex1, ey1 = max(0, x0-pad), max(0, y0-pad), min(RAW.shape[1], x1+pad), min(RAW.shape[0], y1+pad)
    local_core = labels[ey0:ey1, ex0:ex1] == component_id
    local_alpha = ALPHA[ey0:ey1, ex0:ex1]
    fringe = ndimage.distance_transform_edt(~local_core) <= 1.5
    keep = local_core | ((local_alpha > 0) & fringe)
    crop = RAW[ey0:ey1, ex0:ex1].copy()
    crop[:, :, 3] = np.where(keep, crop[:, :, 3], 0).astype(np.uint8)
    ys, xs = np.where(crop[:, :, 3] > 0)
    crop = crop[ys.min():ys.max()+1, xs.min():xs.max()+1]
    source_height, source_width = crop.shape[:2]
    scale = TARGET_HEIGHT / source_height
    width = round(source_width * scale)
    sprite = Image.fromarray(crop, "RGBA").resize((width, TARGET_HEIGHT), Image.Resampling.NEAREST)
    cell = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    left = (CW - width) // 2
    top = BASELINE - TARGET_HEIGHT
    if left < 0 or left + width > CW or top < 0 or top + TARGET_HEIGHT > CH:
        raise RuntimeError(f"Frame {index} does not fit cell: {width}×{TARGET_HEIGHT}")
    cell.alpha_composite(sprite, (left, top))
    path = OUT / f"frame-{index:02d}-celebrate.png"
    cell.save(path)
    cells.append(cell)
    layout.append({
        "frame": index,
        "sourceComponent": component_id,
        "sourceBounds": bbox,
        "sourceCropBounds": [ex0 + int(xs.min()), ey0 + int(ys.min()), ex0 + int(xs.max()+1), ey0 + int(ys.max()+1)],
        "sourceDimensions": [int(source_width), int(source_height)],
        "scaledDimensions": [width, TARGET_HEIGHT],
        "scale": scale,
        "cellOffset": [left, top],
        "baselineY": BASELINE,
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "uniqueColors": int(np.unique(np.asarray(cell).reshape(-1,4), axis=0).shape[0]),
    })

atlas = Image.new("RGBA", (CW * len(cells), CH), (0, 0, 0, 0))
for i, cell in enumerate(cells):
    atlas.alpha_composite(cell, (i * CW, 0))
atlas_path = OUTDIR / "kraken-celebrate10-attempt04-cleanup02-atlas-candidate.png"
atlas.save(atlas_path)
layout_data = {
    "source": "tools/generate-art/sources/kraken-celebrate10-attempt04-generated-raw.png",
    "atlasCandidate": atlas_path.name,
    "cellSize": [CW, CH],
    "baselineY": BASELINE,
    "frames": layout,
    "reusedPixels": False,
    "method": "one-to-one extraction by large connected alpha component; retain original source RGB/alpha within a 1.5px source edge fringe; uniform nearest-neighbor scale to 88px height; align soles at baselineY=94 to match Kraken's registered idle baseline; use uniform 88x96 cells to keep at least 4px horizontal margin around the broadest arms-open pose",
    "durations": DURATIONS,
}
(OUTDIR / "cleanup02-layout.json").write_text(json.dumps(layout_data, indent=2) + "\n")

# Native previews composite the same transparent cells over light and dark.
for name, bg in (("light", (238, 232, 219, 255)), ("dark", (25, 25, 44, 255))):
    preview = Image.new("RGBA", atlas.size, bg)
    preview.alpha_composite(atlas)
    preview.save(OUTDIR / f"cleanup02-{name}-native.png")
    preview.resize((atlas.width * 4, atlas.height * 4), Image.Resampling.NEAREST).save(
        OUTDIR / f"cleanup02-{name}-nearest4x.png"
    )

print(json.dumps({"frames": len(cells), "atlas": atlas_path.name, "layout": layout_data}, indent=2))
