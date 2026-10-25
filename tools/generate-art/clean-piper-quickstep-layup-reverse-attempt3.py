#!/usr/bin/env python3
"""Isolate, de-fringe, scale and center Piper reverse-layup source poses."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "tools/generate-art/sources/piper-quickstep-layup-reverse-attempt3-generated-raw.png"
OUTPUT = ROOT / "tools/generate-art/sources/piper-quickstep-layup-reverse-attempt3-clean-candidate.png"
LAYOUT = ROOT / "tools/generate-art/piper-quickstep-layup-reverse-attempt3-layouts.json"
CELL = 512
SHEET = (CELL * 4, CELL * 2)
MAX_BODY = 384
STRUCTURE = np.ones((3, 3), dtype=bool)


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def process_cell(rgba: np.ndarray) -> tuple[Image.Image, dict]:
    alpha = rgba[:, :, 3]
    labels, count = ndimage.label(alpha >= 32, structure=STRUCTURE)
    sizes = np.bincount(labels.ravel())
    sizes[0] = 0
    main_label = int(np.argmax(sizes))
    strong = labels == main_label
    # Keep antialiased edge pixels adjacent to the main solid character only.
    retain = ndimage.binary_dilation(strong, structure=STRUCTURE, iterations=1)
    retain &= alpha >= 12
    ys, xs = np.where(strong)
    left, right = int(xs.min()), int(xs.max()) + 1
    top, bottom = int(ys.min()), int(ys.max()) + 1
    crop = rgba[top:bottom, left:right].copy()
    local_retain = retain[top:bottom, left:right]
    crop[~local_retain] = 0
    crop_alpha = crop[:, :, 3].copy()

    height, width = crop.shape[:2]
    scale = min(MAX_BODY / width, MAX_BODY / height)
    out_size = (max(1, round(width * scale)), max(1, round(height * scale)))
    image = Image.fromarray(crop, "RGBA")
    # Resize premultiplied RGB and alpha separately to prevent colored fringes.
    alpha_image = Image.fromarray(crop_alpha, "L").resize(out_size, Image.Resampling.LANCZOS)
    premul = crop[:, :, :3].astype(np.float32) * (crop_alpha[:, :, None].astype(np.float32) / 255.0)
    premul_image = Image.fromarray(np.clip(premul, 0, 255).astype(np.uint8), "RGB").resize(out_size, Image.Resampling.LANCZOS)
    resized_alpha = np.asarray(alpha_image).astype(np.uint16)
    resized_premul = np.asarray(premul_image).astype(np.float32)
    denom = np.maximum(resized_alpha.astype(np.float32), 1.0)[:, :, None]
    rgb = np.clip(resized_premul * (255.0 / denom), 0, 255).astype(np.uint8)
    cleaned = np.dstack((rgb, resized_alpha.astype(np.uint8)))
    cleaned[resized_alpha == 0] = 0
    return Image.fromarray(cleaned, "RGBA"), {
        "component_count_alpha32": int(count),
        "source_bbox_ltrb": [left, top, right - 1, bottom - 1],
        "source_bbox_size": [width, height],
        "scale": round(scale, 6),
        "cleaned_size": list(out_size),
        "retained_alpha_pixels_before_resize": int(local_retain.sum()),
    }


raw = Image.open(SOURCE).convert("RGBA")
rgba = np.asarray(raw)
source_h, source_w = rgba.shape[:2]
sheet = Image.new("RGBA", SHEET, (0, 0, 0, 0))
records = []
for index in range(8):
    row, col = divmod(index, 4)
    sx0, sx1 = round(col * source_w / 4), round((col + 1) * source_w / 4)
    sy0, sy1 = round(row * source_h / 2), round((row + 1) * source_h / 2)
    pose, record = process_cell(rgba[sy0:sy1, sx0:sx1])
    px = col * CELL + (CELL - pose.width) // 2
    py = row * CELL + (CELL - pose.height) // 2
    sheet.alpha_composite(pose, (px, py))
    alpha = np.asarray(sheet.crop((col * CELL, row * CELL, (col + 1) * CELL, (row + 1) * CELL)))[:, :, 3]
    yy, xx = np.where(alpha >= 32)
    margins = [int(xx.min()), int(CELL - 1 - xx.max()), int(yy.min()), int(CELL - 1 - yy.max())]
    record.update({
        "frame": index,
        "source_cell_xyxy": [sx0, sy0, sx1, sy1],
        "output_xy": [px, py],
        "margins_ltrb_alpha32_px": margins,
        "min_margin_alpha32_px": min(margins),
        "connected_components_removed": max(0, record["component_count_alpha32"] - 1),
        "alpha_below_12_removed": True,
    })
    if min(margins) < 64:
        raise SystemExit(f"frame {index} margin failed: {margins}")
    records.append(record)

sheet.save(OUTPUT)
LAYOUT.write_text(json.dumps({
    "athlete": "Piper Quickstep",
    "clip": "layup-reverse",
    "attempt": 3,
    "raw_source": str(SOURCE.relative_to(ROOT)),
    "raw_source_sha256": sha(SOURCE),
    "cleaned_source": str(OUTPUT.relative_to(ROOT)),
    "cleaned_source_sha256": sha(OUTPUT),
    "cleaned_size": list(SHEET),
    "layout": "row-major 4x2, 512x512 cells",
    "cleanup": "Per-cell alpha>=32 largest-component isolation; one-pixel antialias dilation; remove detached components and alpha<12 fringe; crop silhouette; premultiplied-alpha Lanczos resize uniformly to fit 384x384; center on transparent 512px cell.",
    "frames": records,
}, indent=2) + "\n")
print(OUTPUT)
print("sha256", sha(OUTPUT))
print("min margins", min(r["min_margin_alpha32_px"] for r in records))
