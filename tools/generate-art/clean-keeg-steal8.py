#!/usr/bin/env python3
"""Isolate eight Keeg steal poses, preserve pixels, scale uniformly, and center in reviewed cells."""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
import sys

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, find_objects, label

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "tools/generate-art/sources/j92-keeg-steal-generated-correction-raw.png"
OUTPUT = ROOT / "tools/generate-art/sources/j92-keeg-steal8.png"
LAYOUT = ROOT / "tools/generate-art/j92-keeg-steal-cleanup-layout.json"


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
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
            "component": component,
            "area": area,
            "x0": int(xs.start), "y0": int(ys.start),
            "x1": int(xs.stop), "y1": int(ys.stop),
            "cx": (xs.start + xs.stop) / 2,
            "cy": (ys.start + ys.stop) / 2,
        })
    if len(bodies) != 8:
        raise ValueError(f"Expected eight isolated complete bodies; found {len(bodies)}")
    rows = [sorted((b for b in bodies if b["cy"] < source.height / 2), key=lambda b: b["cx"]),
            sorted((b for b in bodies if b["cy"] >= source.height / 2), key=lambda b: b["cx"])]
    if any(len(row) != 4 for row in rows):
        raise ValueError("Expected two rows of four poses")
    bodies = rows[0] + rows[1]
    seeds = np.where(np.isin(labels, [b["component"] for b in bodies]), labels, 0)
    owners = seeds[tuple(distance_transform_edt(seeds == 0, return_distances=False, return_indices=True))]
    output = Image.new("RGBA", source.size, (0, 0, 0, 0))
    records = []
    for index, body in enumerate(bodies):
        column, row = index % 4, index // 4
        cell_x, cell_y = column * 384, row * 512
        x0, y0 = max(0, body["x0"] - 3), max(0, body["y0"] - 3)
        x1, y1 = min(source.width, body["x1"] + 3), min(source.height, body["y1"] + 3)
        crop = pixels[y0:y1, x0:x1].copy()
        crop_owners = owners[y0:y1, x0:x1]
        crop[crop_owners != body["component"], 3] = 0
        pose = Image.fromarray(crop, "RGBA")
        bbox = pose.getchannel("A").point(lambda value: 255 if value > 8 else 0).getbbox()
        if bbox is None:
            raise ValueError(f"Pose {index} is empty after component isolation")
        pose = pose.crop(bbox)
        width, height = pose.size
        scale = min(316 / width, 444 / height, 1.0)
        size = (max(1, round(width * scale)), max(1, round(height * scale)))
        pose = pose.resize(size, Image.Resampling.LANCZOS)
        dest_x = cell_x + (384 - size[0]) // 2
        dest_y = cell_y + 478 - size[1]
        output.alpha_composite(pose, (dest_x, dest_y))
        margins = [dest_x - cell_x, dest_y - cell_y,
                   cell_x + 384 - dest_x - size[0], cell_y + 512 - dest_y - size[1]]
        if min(margins) < 34:
            raise ValueError(f"Pose {index} violates reviewed 34px margins: {margins}")
        records.append({
            "sourceIndex": index, "component": body["component"], "areaPx": body["area"],
            "rawBounds": [body["x0"], body["y0"], body["x1"], body["y1"]],
            "scale": round(scale, 6), "destination": [dest_x, dest_y, size[0], size[1]],
            "marginsPx": margins,
        })
    output.save(OUTPUT)
    layout = {
        "source": str(RAW.relative_to(ROOT)), "sourceSha256": sha(RAW),
        "cleanedSource": str(OUTPUT.relative_to(ROOT)), "cleanedSourceSha256": sha(OUTPUT),
        "method": "threshold alpha at64; isolate eight row-major connected athletes; clear non-owner pixels in 3px padded crops; preserve aspect ratio; fit inside384x512 cells with at least34px margin and shared bottom baseline",
        "frames": records,
    }
    LAYOUT.write_text(json.dumps(layout, indent=2) + "\n")
    print(json.dumps({"sourceSha256": layout["sourceSha256"], "cleanedSourceSha256": layout["cleanedSourceSha256"], "frames": len(records), "minimumMarginPx": min(min(frame["marginsPx"]) for frame in records), "layout": str(LAYOUT.relative_to(ROOT))}))


if __name__ == "__main__":
    main()
