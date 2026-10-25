#!/usr/bin/env python3
"""Remove generated glow and isolate eight Piper steal poses into clean cells."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, find_objects, label

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "tools/generate-art/sources/piper-quickstep-steal-attempt1-generated-raw.png"
OUTPUT = ROOT / "tools/generate-art/sources/piper-quickstep-steal-attempt1-clean-candidate.png"
LAYOUT = ROOT / "tools/generate-art/piper-quickstep-steal-attempt1-layouts.json"


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


with Image.open(RAW) as im:
    source = im.convert("RGBA")
pixels = np.asarray(source)
alpha = pixels[:, :, 3]
labels, _ = label(alpha >= 64, structure=np.ones((3, 3), dtype=np.uint8))
bodies = []
for component, slices in enumerate(find_objects(labels), start=1):
    if slices is None:
        continue
    area = int(np.count_nonzero(labels[slices] == component))
    if area < source.width * source.height * 0.004:
        continue
    ys, xs = slices
    bodies.append({
        "component": component, "area": area,
        "x0": int(xs.start), "y0": int(ys.start),
        "x1": int(xs.stop), "y1": int(ys.stop),
        "cx": (xs.start + xs.stop) / 2, "cy": (ys.start + ys.stop) / 2,
    })
if len(bodies) != 8:
    raise SystemExit(f"Expected eight distinct poses; found {len(bodies)}")
rows = [
    sorted((b for b in bodies if b["cy"] < source.height / 2), key=lambda b: b["cx"]),
    sorted((b for b in bodies if b["cy"] >= source.height / 2), key=lambda b: b["cx"]),
]
if any(len(row) != 4 for row in rows):
    raise SystemExit(f"Expected two rows of four poses; got {[len(row) for row in rows]}")
bodies = rows[0] + rows[1]
seeds = np.where(np.isin(labels, [b["component"] for b in bodies]), labels, 0)
owners = seeds[tuple(distance_transform_edt(seeds == 0, return_distances=False, return_indices=True))]
output = Image.new("RGBA", source.size, (0, 0, 0, 0))
records = []
for index, body in enumerate(bodies):
    cell_x, cell_y = (index % 4) * 384, (index // 4) * 512
    x0, y0 = max(0, body["x0"] - 3), max(0, body["y0"] - 3)
    x1, y1 = min(source.width, body["x1"] + 3), min(source.height, body["y1"] + 3)
    crop = pixels[y0:y1, x0:x1].copy()
    crop_owners = owners[y0:y1, x0:x1]
    crop[crop_owners != body["component"], 3] = 0
    pose = Image.fromarray(crop, "RGBA")
    bbox = pose.getchannel("A").point(lambda value: 255 if value > 8 else 0).getbbox()
    if bbox is None:
        raise SystemExit(f"Pose {index} disappeared during isolation")
    pose = pose.crop(bbox)
    width, height = pose.size
    scale = min(264 / width, 360 / height, 1.0)
    size = (max(1, round(width * scale)), max(1, round(height * scale)))
    pose = pose.resize(size, Image.Resampling.LANCZOS)
    dest_x = cell_x + (384 - size[0]) // 2
    dest_y = cell_y + (512 - size[1]) // 2
    output.alpha_composite(pose, (dest_x, dest_y))
    margins = [dest_x-cell_x, dest_y-cell_y, cell_x+384-dest_x-size[0], cell_y+512-dest_y-size[1]]
    if min(margins) < 60:
        raise SystemExit(f"Pose {index} misses 60px safety margin: {margins}")
    records.append({
        "frame": index, "sourceComponent": body["component"],
        "alpha64AreaPx": body["area"],
        "rawBoundsXYXY": [body["x0"], body["y0"], body["x1"], body["y1"]],
        "uniformScale": round(scale, 6),
        "cleanBoundsInSheet": [dest_x, dest_y, size[0], size[1]],
        "fullyTransparentMarginsLTRBpx": margins,
    })
output.save(OUTPUT)
layout = {
    "athlete": "piper-quickstep", "clip": "steal", "attempt": 1,
    "rawSource": str(RAW.relative_to(ROOT)), "rawSourceSha256": sha(RAW),
    "cleanedSource": str(OUTPUT.relative_to(ROOT)), "cleanedSourceSha256": sha(OUTPUT),
    "sheet": [source.width, source.height], "cell": [384, 512],
    "method": "Threshold alpha at64 to identify complete authored figures; require eight separate connected components in two source rows; assign nearby generated pixels to the nearest figure to remove glow and neighboring-cell bleed; crop and uniformly scale each original pose to at most264x360; center in its row-major 384x512 cell. No pose is drawn, invented, mirrored, or duplicated.",
    "frames": records,
}
LAYOUT.write_text(json.dumps(layout, indent=2) + "\n")
print(json.dumps({"rawSha256": layout["rawSourceSha256"], "cleanSha256": layout["cleanedSourceSha256"], "frames": len(records), "minimumFullyTransparentMarginPx": min(min(r["fullyTransparentMarginsLTRBpx"]) for r in records), "layout": str(LAYOUT.relative_to(ROOT))}))
