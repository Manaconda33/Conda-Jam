#!/usr/bin/env python3
"""Remove rebound-sheet glow and center five complete Piper poses in cells."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "tools/generate-art/sources/piper-quickstep-rebound-attempt1-generated-raw.png"
OUTPUT = ROOT / "tools/generate-art/sources/piper-quickstep-rebound-attempt1-clean-candidate.png"
LAYOUT = ROOT / "tools/generate-art/piper-quickstep-rebound-attempt1-layouts.json"
CELL = 512
SHEET = (CELL * 3, CELL * 2)
MAX_BODY = 380
STRUCTURE = np.ones((3, 3), dtype=bool)


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


raw = Image.open(SOURCE).convert("RGBA")
pixels = np.asarray(raw)
alpha = pixels[:, :, 3]
labels, component_count = ndimage.label(alpha >= 64, structure=STRUCTURE)
sizes = np.bincount(labels.ravel())
sizes[0] = 0
selected = [int(i) for i in np.argsort(sizes)[::-1] if sizes[i] > 1000][:5]
if len(selected) != 5:
    raise SystemExit(f"Expected five complete source poses; found {len(selected)} major components")

poses = []
for component in selected:
    core = labels == component
    retain = ndimage.binary_dilation(core, structure=STRUCTURE, iterations=1) & (alpha >= 12)
    ys, xs = np.where(core)
    x0, x1, y0, y1 = int(xs.min()), int(xs.max()) + 1, int(ys.min()), int(ys.max()) + 1
    crop = pixels[y0:y1, x0:x1].copy()
    crop[~retain[y0:y1, x0:x1]] = 0
    h, w = crop.shape[:2]
    poses.append({"component": component, "area": int(sizes[component]), "bbox": [x0, y0, x1 - 1, y1 - 1], "rgba": crop, "width": w, "height": h})

# The two rows are separated by vertical center; figures crossing a cell edge
# are kept whole, then repaired by scale-and-center without drawing new pixels.
top = sorted((p for p in poses if p["bbox"][1] + p["bbox"][3] < raw.height), key=lambda p: p["bbox"][0] + p["bbox"][2])
bottom = sorted((p for p in poses if p["bbox"][1] + p["bbox"][3] >= raw.height), key=lambda p: p["bbox"][0] + p["bbox"][2])
# In the generated 3x2 grid, a pose centered exactly near the middle can make
# bbox-edge classification ambiguous. Resolve rows by actual vertical center.
ordered = sorted(poses, key=lambda p: (p["bbox"][1] + p["bbox"][3]) / 2)
if len(ordered) != 5 or not (ordered[2]["bbox"][1] + ordered[2]["bbox"][3]) / 2 < CELL:
    raise SystemExit("Could not separate three top-row poses from two bottom-row poses")
ordered = sorted(ordered[:3], key=lambda p: p["bbox"][0] + p["bbox"][2]) + sorted(ordered[3:], key=lambda p: p["bbox"][0] + p["bbox"][2])

sheet = Image.new("RGBA", SHEET, (0, 0, 0, 0))
records = []
for index, pose in enumerate(ordered):
    image = Image.fromarray(pose["rgba"], "RGBA")
    scale = min(MAX_BODY / pose["width"], MAX_BODY / pose["height"])
    out_size = (max(1, round(pose["width"] * scale)), max(1, round(pose["height"] * scale)))
    alpha_source = np.asarray(image)[:, :, 3]
    alpha_image = Image.fromarray(alpha_source, "L").resize(out_size, Image.Resampling.LANCZOS)
    premul = np.asarray(image)[:, :, :3].astype(np.float32) * (alpha_source[:, :, None].astype(np.float32) / 255)
    rgb_image = Image.fromarray(np.clip(premul, 0, 255).astype(np.uint8), "RGB").resize(out_size, Image.Resampling.LANCZOS)
    a = np.asarray(alpha_image).astype(np.uint16)
    premul_resized = np.asarray(rgb_image).astype(np.float32)
    rgb = np.clip(premul_resized * (255 / np.maximum(a.astype(np.float32), 1)[:, :, None]), 0, 255).astype(np.uint8)
    output = np.dstack((rgb, a.astype(np.uint8)))
    output[a == 0] = 0
    pose_image = Image.fromarray(output, "RGBA")

    row, col = divmod(index, 3)
    cell_x, cell_y = col * CELL, row * CELL
    px, py = cell_x + (CELL - pose_image.width) // 2, cell_y + (CELL - pose_image.height) // 2
    sheet.alpha_composite(pose_image, (px, py))
    frame = np.asarray(sheet.crop((cell_x, cell_y, cell_x + CELL, cell_y + CELL)))[:, :, 3]
    yy, xx = np.where(frame > 0)
    margins_all_alpha = [int(xx.min()), CELL - 1 - int(xx.max()), int(yy.min()), CELL - 1 - int(yy.max())]
    if min(margins_all_alpha) < 64:
        raise SystemExit(f"frame {index} margin failed: {margins_all_alpha}")
    records.append({
        "frame": index,
        "source_component": pose["component"],
        "source_component_area_alpha64": pose["area"],
        "source_bbox_xyxy": pose["bbox"],
        "source_bbox_size": [pose["width"], pose["height"]],
        "uniform_scale": round(scale, 6),
        "output_size": list(out_size),
        "output_xy": [px, py],
        "transparent_margins_ltrb_px": margins_all_alpha,
        "removed_components": max(0, component_count - len(selected)),
    })

sheet.save(OUTPUT)
LAYOUT.write_text(json.dumps({
    "athlete": "Piper Quickstep",
    "clip": "rebound",
    "attempt": 1,
    "raw_source": str(SOURCE.relative_to(ROOT)),
    "raw_source_sha256": sha(SOURCE),
    "cleaned_source": str(OUTPUT.relative_to(ROOT)),
    "cleaned_source_sha256": sha(OUTPUT),
    "cleaned_size": list(SHEET),
    "layout": "row-major 3x2; cells 0–4 contain the five complete authored poses; cell5 remains empty",
    "cleanup": "Global alpha>=64 connected-component isolation keeps each full body even when it crosses the raw row boundary; retain one-pixel antialias dilation; discard detached glow and alpha<12; crop, uniformly scale to fit380x380, and center in transparent 512px cells with at least64px fully transparent margin. No pose is drawn, synthesized, rearranged, or duplicated.",
    "frames": records,
}, indent=2) + "\n")
print(OUTPUT)
print("sha256", sha(OUTPUT))
print("minimum margin", min(min(r["transparent_margins_ltrb_px"]) for r in records))
