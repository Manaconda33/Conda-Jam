"""Isolate Kraken's six original chest-pass poses and pack a trial atlas."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[4]
HERE = Path(__file__).resolve().parent
RAW_PATH = ROOT / "tools/generate-art/sources/kraken-pass6-attempt01-generated-raw.png"
CW, CH, BASELINE, TARGET_HEIGHT = 96, 96, 94, 88
DURATIONS = [2, 2, 1, 1, 2, 3]
POSE_NAMES = ["chest-setup", "windup", "step-pre-release", "release-tick05", "follow-through", "recovery"]
RAW = np.asarray(Image.open(RAW_PATH).convert("RGBA"))
ALPHA = RAW[:, :, 3]

# Six large alpha>=16 components identify the six full-body poses. Keep source
# RGB/alpha only on each component and its original 1.5px anti-aliased fringe.
labels, count = ndimage.label(ALPHA >= 16, structure=np.ones((3, 3), dtype=np.uint8))
sizes = np.bincount(labels.ravel(), minlength=count + 1)
figure_ids = [int(i) for i in range(1, count + 1) if sizes[i] >= 10_000]
if len(figure_ids) != 6:
    raise RuntimeError(f"Expected six isolated full-body figures, got {len(figure_ids)}")
records = []
for component_id in figure_ids:
    yy, xx = np.where(labels == component_id)
    bbox = [int(xx.min()), int(yy.min()), int(xx.max() + 1), int(yy.max() + 1)]
    records.append((float(np.mean(yy)), float(np.mean(xx)), component_id, bbox))
records.sort(key=lambda r: (r[0] >= RAW.shape[0] / 2, r[1]))

OUT = HERE / "poses"
PREVIEW = HERE
OUT.mkdir(parents=True, exist_ok=True)
cells: list[Image.Image] = []
frames = []
for index, (_, _, component_id, bbox) in enumerate(records):
    x0, y0, x1, y1 = bbox
    ex0, ey0, ex1, ey1 = max(0, x0 - 4), max(0, y0 - 4), min(RAW.shape[1], x1 + 4), min(RAW.shape[0], y1 + 4)
    local_core = labels[ey0:ey1, ex0:ex1] == component_id
    local_alpha = ALPHA[ey0:ey1, ex0:ex1]
    fringe = ndimage.distance_transform_edt(~local_core) <= 1.5
    keep = local_core | ((local_alpha > 0) & fringe)
    crop = RAW[ey0:ey1, ex0:ex1].copy()
    crop[:, :, 3] = np.where(keep, crop[:, :, 3], 0).astype(np.uint8)
    yy, xx = np.where(crop[:, :, 3] > 0)
    crop = crop[yy.min():yy.max() + 1, xx.min():xx.max() + 1]
    source_height, source_width = crop.shape[:2]
    scale = TARGET_HEIGHT / source_height
    width = round(source_width * scale)
    if width > CW - 4:
        raise RuntimeError(f"Pose {index} would leave less than 2px side margin: {width}px in {CW}px")
    sprite = Image.fromarray(crop, "RGBA").resize((width, TARGET_HEIGHT), Image.Resampling.NEAREST)
    cell = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    left, top = (CW - width) // 2, BASELINE - TARGET_HEIGHT
    cell.alpha_composite(sprite, (left, top))
    cell_path = OUT / f"frame-{index:02d}-{POSE_NAMES[index]}.png"
    cell.save(cell_path)
    cells.append(cell)
    frames.append({
        "frame": index,
        "pose": POSE_NAMES[index],
        "duration": DURATIONS[index],
        "sourceComponent": component_id,
        "sourceBounds": bbox,
        "sourceCropBounds": [ex0 + int(xx.min()), ey0 + int(yy.min()), ex0 + int(xx.max() + 1), ey0 + int(yy.max() + 1)],
        "sourceDimensions": [int(source_width), int(source_height)],
        "scaledDimensions": [width, TARGET_HEIGHT],
        "uniformScale": scale,
        "cellOffset": [left, top],
        "baselineY": BASELINE,
        "uniqueColors": int(np.unique(np.asarray(cell).reshape(-1, 4), axis=0).shape[0]),
        "sha256": hashlib.sha256(cell_path.read_bytes()).hexdigest(),
    })

atlas = Image.new("RGBA", (CW * len(cells), CH), (0, 0, 0, 0))
for i, cell in enumerate(cells):
    atlas.alpha_composite(cell, (i * CW, 0))
atlas_path = HERE / "kraken-pass6-attempt01-cleanup01-atlas-candidate.png"
atlas.save(atlas_path)
layout = {
    "source": "tools/generate-art/sources/kraken-pass6-attempt01-generated-raw.png",
    "atlasCandidate": atlas_path.name,
    "cellSize": [CW, CH],
    "columns": len(cells),
    "rows": 1,
    "baselineY": BASELINE,
    "durations": DURATIONS,
    "frames": frames,
    "method": "six row-major large connected alpha components; retain original RGB and alpha on each figure plus its 1.5px source fringe; uniform nearest-neighbor resize to 88px high; centered in 96x96 cells at baseline y94",
    "status": "cleanup/layout candidate; independent review and track trial pending",
    "atlasSha256": hashlib.sha256(atlas_path.read_bytes()).hexdigest(),
}
(HERE / "cleanup01-layout.json").write_text(json.dumps(layout, indent=2) + "\n")
for name, bg in (("light", (238, 232, 219, 255)), ("dark", (25, 25, 44, 255))):
    preview = Image.new("RGBA", atlas.size, bg)
    preview.alpha_composite(atlas)
    preview.save(PREVIEW / f"cleanup01-{name}-native.png")
    preview.resize((atlas.width * 4, atlas.height * 4), Image.Resampling.NEAREST).save(PREVIEW / f"cleanup01-{name}-nearest4x.png")
print(json.dumps({"frameCount": len(frames), "uniqueFrames": len({f['sha256'] for f in frames}), "atlasSha256": layout["atlasSha256"], "layout": layout}, indent=2))
