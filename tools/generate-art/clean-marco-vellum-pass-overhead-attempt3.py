#!/usr/bin/env python3
"""Isolate and uniformly scale Marco pass attempt 3 without redrawing poses."""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, label

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "tools/generate-art/sources/marco-vellum-pass-overhead-attempt3-generated-raw.png"
OUTPUT = ROOT / "tools/generate-art/sources/marco-vellum-pass-overhead-attempt3-clean-candidate.png"
CELL = 512
MAX_POSE = (330, 330)


def main():
    source = np.asarray(Image.open(SOURCE).convert("RGBA"))
    sheet = np.zeros_like(source)
    layouts = []
    for index in range(6):
        row, column = divmod(index, 3)
        x0, y0 = column * CELL, row * CELL
        cell = source[y0:y0 + CELL, x0:x0 + CELL].copy()
        labels, count = label(cell[:, :, 3] >= 64)
        if not count:
            raise ValueError(f"Pose {index}: no alpha>=64 component")
        sizes = np.bincount(labels.ravel(), minlength=count + 1)
        component = int(np.argmax(sizes[1:]) + 1)
        core = labels == component
        yy, xx = np.where(core)
        bounds = (int(xx.min()), int(yy.min()), int(xx.max()) + 1, int(yy.max()) + 1)
        margin = 2
        x1, y1, x2, y2 = bounds
        x1, y1 = max(0, x1 - margin), max(0, y1 - margin)
        x2, y2 = min(CELL, x2 + margin), min(CELL, y2 + margin)
        crop = cell[y1:y2, x1:x2].copy()
        crop_core = core[y1:y2, x1:x2]
        fringe = distance_transform_edt(~crop_core) <= margin
        crop[~fringe, 3] = 0
        crop[crop[:, :, 3] < 8, 3] = 0

        scale = min(MAX_POSE[0] / crop.shape[1], MAX_POSE[1] / crop.shape[0], 1.0)
        width = max(1, round(crop.shape[1] * scale))
        height = max(1, round(crop.shape[0] * scale))
        resized = Image.fromarray(crop, "RGBA").resize((width, height), Image.Resampling.NEAREST)
        px, py = (CELL - width) // 2, (CELL - height) // 2
        sheet[y0 + py:y0 + py + height, x0 + px:x0 + px + width] = np.asarray(resized)
        layouts.append({
            "frame": index,
            "sourceBounds": [int(xx.min()), int(yy.min()), int(xx.max()), int(yy.max())],
            "sourceMargins": [int(xx.min()), int(CELL - 1 - xx.max()), int(yy.min()), int(CELL - 1 - yy.max())],
            "isolatedSourceCrop": [x1, y1, x2, y2],
            "scale": round(scale, 6),
            "outputBounds": [px, py, px + width - 1, py + height - 1],
            "outputMargins": [px, CELL - px - width, py, CELL - py - height],
        })

    Image.fromarray(sheet, "RGBA").save(OUTPUT)
    import json
    layout_path = ROOT / "tools/generate-art/marco-vellum-pass-overhead-attempt3-layouts.json"
    layout_path.write_text(json.dumps({"source": str(SOURCE.relative_to(ROOT)), "output": str(OUTPUT.relative_to(ROOT)), "method": "per-cell largest alpha>=64 component, retain original antialias pixels within 2px dilation, uniform nearest-neighbor scale to <=330x330, center in transparent 512px cell; no redraw, synthesis, or pose rearrangement", "frames": layouts}, indent=2) + "\n")
    print(f"Wrote {OUTPUT.relative_to(ROOT)} and {layout_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
