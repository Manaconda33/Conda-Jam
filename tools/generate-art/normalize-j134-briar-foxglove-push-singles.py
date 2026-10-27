#!/usr/bin/env python3
"""Normalize reviewed J.134 single-pose sources into a 4x3 review atlas."""
from pathlib import Path
from PIL import Image
import json

ROOT = Path(__file__).resolve().parents[2]
SOURCES = ROOT / "tools/generate-art/sources"
OUT = ROOT / "tools/generate-art/candidates/j134-briar-foxglove-push-singles-attempt-01"
OUT.mkdir(parents=True, exist_ok=True)
FRAMES = {
    0: "j134-briar-foxglove-push-pose-00-attempt-01-raw.png",
    1: "j134-briar-foxglove-push-pose-01-attempt-01-raw.png",
    2: "j134-briar-foxglove-push-pose-02-attempt-01-raw.png",
    3: "j134-briar-foxglove-push-pose-03-attempt-02-raw.png",
    4: "j134-briar-foxglove-push-pose-04-attempt-02-raw.png",
    5: "j134-briar-foxglove-push-pose-05-attempt-01-raw.png",
    6: "j134-briar-foxglove-push-pose-06-attempt-02-raw.png",
    7: "j134-briar-foxglove-push-pose-07-attempt-01-raw.png",
    8: "j134-briar-foxglove-push-pose-08-attempt-01-raw.png",
    9: "j134-briar-foxglove-push-pose-09-attempt-01-raw.png",
    10: "j134-briar-foxglove-push-pose-10-attempt-01-raw.png",
}
CELL_W, CELL_H = 112, 96
BASELINE = 89
TARGET_H, MAX_W = 76, 100
atlas = Image.new("RGBA", (CELL_W * 4, CELL_H * 3), (0, 0, 0, 0))
records = []
for frame, filename in FRAMES.items():
    source_path = SOURCES / filename
    source = Image.open(source_path).convert("RGBA")
    alpha = source.getchannel("A")
    mask = alpha.point(lambda value: 255 if value >= 16 else 0)
    bbox = mask.getbbox()
    if not bbox:
        raise ValueError(f"No alpha>=16 pixels in frame {frame}: {filename}")
    left, top, right, bottom = bbox
    crop_box = (max(0, left - 2), max(0, top - 2), min(source.width, right + 2), min(source.height, bottom + 2))
    crop = source.crop(crop_box)
    crop.putalpha(crop.getchannel("A").point(lambda value: value if value >= 16 else 0))
    scale = min(TARGET_H / crop.height, MAX_W / crop.width)
    new_size = (max(1, round(crop.width * scale)), max(1, round(crop.height * scale)))
    sprite = crop.resize(new_size, Image.Resampling.NEAREST)
    x = (CELL_W - sprite.width) // 2
    y = BASELINE - sprite.height
    if x < 4 or x + sprite.width > CELL_W - 4 or y < 4 or BASELINE >= CELL_H:
        raise ValueError(f"Frame {frame} fails safe cell bounds: placement={(x,y)}, size={new_size}")
    atlas.alpha_composite(sprite, (frame % 4 * CELL_W + x, frame // 4 * CELL_H + y))
    records.append({
        "frame": frame, "source": f"tools/generate-art/sources/{filename}",
        "source_alpha16_bbox": [left, top, right, bottom], "source_crop": list(crop_box),
        "uniform_scale": scale, "normalized_size": list(new_size),
        "placement": [frame % 4 * CELL_W + x, frame // 4 * CELL_H + y],
        "cell_baseline_y": BASELINE,
    })
atlas.save(OUT / "briar-foxglove-push-4x-candidate.png", optimize=False)
(OUT / "normalization-report.json").write_text(json.dumps({
    "source_method": "individually generated, reviewed, ball-free pose sources; threshold alpha>=16 and nearest-neighbor uniform scaling",
    "atlas": [atlas.width, atlas.height], "cell": [CELL_W, CELL_H], "frames": 11,
    "empty_cells": [11], "baseline_y": BASELINE, "poses": records,
}, indent=2) + "\n")
print(f"Wrote {atlas.width}x{atlas.height} atlas with {len(records)} frames; cell12 is empty.")
