#!/usr/bin/env python3
"""Remove block-sheet glow and center four whole Piper poses in cells."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "tools/generate-art/sources/piper-quickstep-block-attempt1-generated-raw.png"
OUTPUT = ROOT / "tools/generate-art/sources/piper-quickstep-block-attempt1-clean-candidate.png"
LAYOUT = ROOT / "tools/generate-art/piper-quickstep-block-attempt1-layouts.json"
CELL_W, CELL_H = 768, 512
MAX_BODY = 380
SHEET = (CELL_W * 2, CELL_H * 2)
STRUCTURE = np.ones((3, 3), dtype=bool)


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


raw = Image.open(SOURCE).convert("RGBA")
pixels = np.asarray(raw)
alpha = pixels[:, :, 3]
labels, component_count = ndimage.label(alpha >= 64, structure=STRUCTURE)
sizes = np.bincount(labels.ravel())
sizes[0] = 0
selected = [int(i) for i in np.argsort(sizes)[::-1] if sizes[i] > 1000][:4]
if len(selected) != 4:
    raise SystemExit(f"Expected four complete source poses; found {len(selected)} major components")

poses = []
for component in selected:
    core = labels == component
    retain = ndimage.binary_dilation(core, structure=STRUCTURE, iterations=1) & (alpha >= 12)
    ys, xs = np.where(core)
    x0, x1, y0, y1 = int(xs.min()), int(xs.max()) + 1, int(ys.min()), int(ys.max()) + 1
    crop = pixels[y0:y1, x0:x1].copy()
    crop[~retain[y0:y1, x0:x1]] = 0
    poses.append({"component": component, "area": int(sizes[component]), "bbox": [x0, y0, x1 - 1, y1 - 1], "rgba": crop})

ordered = sorted(poses, key=lambda p: (p["bbox"][1] + p["bbox"][3]) / 2)
if (ordered[1]["bbox"][1] + ordered[1]["bbox"][3]) / 2 >= CELL_H:
    raise SystemExit("Could not identify two complete top-row poses")
ordered = sorted(ordered[:2], key=lambda p: p["bbox"][0] + p["bbox"][2]) + sorted(ordered[2:], key=lambda p: p["bbox"][0] + p["bbox"][2])

sheet = Image.new("RGBA", SHEET, (0, 0, 0, 0))
records = []
for index, pose in enumerate(ordered):
    crop = Image.fromarray(pose["rgba"], "RGBA")
    scale = min(MAX_BODY / crop.width, MAX_BODY / crop.height)
    out_size = (max(1, round(crop.width * scale)), max(1, round(crop.height * scale)))
    crop_alpha = np.asarray(crop)[:, :, 3]
    alpha_image = Image.fromarray(crop_alpha, "L").resize(out_size, Image.Resampling.LANCZOS)
    premul = np.asarray(crop)[:, :, :3].astype(np.float32) * (crop_alpha[:, :, None].astype(np.float32) / 255)
    rgb_image = Image.fromarray(np.clip(premul, 0, 255).astype(np.uint8), "RGB").resize(out_size, Image.Resampling.LANCZOS)
    a = np.asarray(alpha_image).astype(np.uint16)
    rgb = np.clip(np.asarray(rgb_image).astype(np.float32) * (255 / np.maximum(a.astype(np.float32), 1)[:, :, None]), 0, 255).astype(np.uint8)
    output = np.dstack((rgb, a.astype(np.uint8)))
    output[a == 0] = 0
    pose_image = Image.fromarray(output, "RGBA")
    row, col = divmod(index, 2)
    cell_x, cell_y = col * CELL_W, row * CELL_H
    px, py = cell_x + (CELL_W - pose_image.width) // 2, cell_y + (CELL_H - pose_image.height) // 2
    sheet.alpha_composite(pose_image, (px, py))
    frame_alpha = np.asarray(sheet.crop((cell_x, cell_y, cell_x + CELL_W, cell_y + CELL_H)))[:, :, 3]
    yy, xx = np.where(frame_alpha > 0)
    margins = [int(xx.min()), CELL_W - 1 - int(xx.max()), int(yy.min()), CELL_H - 1 - int(yy.max())]
    if min(margins) < 64:
        raise SystemExit(f"frame {index} margin failed: {margins}")
    records.append({
        "frame": index,
        "source_component": pose["component"],
        "source_area_alpha64": pose["area"],
        "source_bbox_xyxy": pose["bbox"],
        "uniform_scale": round(scale, 6),
        "output_size": list(out_size),
        "output_xy": [px, py],
        "transparent_margins_ltrb_px": margins,
        "removed_components": max(0, component_count - len(selected)),
    })

sheet.save(OUTPUT)
LAYOUT.write_text(json.dumps({
    "athlete": "Piper Quickstep",
    "clip": "block",
    "attempt": 1,
    "raw_source": str(SOURCE.relative_to(ROOT)),
    "raw_source_sha256": sha(SOURCE),
    "cleaned_source": str(OUTPUT.relative_to(ROOT)),
    "cleaned_source_sha256": sha(OUTPUT),
    "cleaned_size": list(SHEET),
    "layout": "row-major 2x2, four complete authored poses",
    "cleanup": "Global alpha>=64 connected-component isolation retains complete figures even when they cross the raw row boundary; remove detached glow/specks and alpha<12 outside one-pixel antialias dilation; crop, uniformly scale each pose to fit380x380, then center in transparent768x512 cells. No pose pixels drawn, synthesized, duplicated, or reordered.",
    "frames": records,
}, indent=2) + "\n")
print(OUTPUT)
print("sha256", sha(OUTPUT))
print("minimum margin", min(min(r["transparent_margins_ltrb_px"]) for r in records))
