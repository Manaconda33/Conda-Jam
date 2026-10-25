#!/usr/bin/env python3
"""Isolate Piper's ten generated celebration poses into the prompted 4x3 sheet."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, find_objects, label

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "tools/generate-art/sources/piper-quickstep-celebrate-attempt1-generated-raw.png"
OUT = ROOT / "tools/generate-art/sources/piper-quickstep-celebrate-attempt1-clean-4x3-candidate.png"
LAYOUT = ROOT / "tools/generate-art/piper-quickstep-celebrate-attempt1-layouts-4x3.json"
WIDTH, HEIGHT, COLUMNS, ROWS = 1536, 1536, 4, 3


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    source = Image.open(RAW).convert("RGBA")
    source_pixels = np.asarray(source)
    alpha = source_pixels[:, :, 3]
    if source.size != (1254, 1254) or alpha.min() != 0 or alpha.max() != 255:
        raise ValueError("Unexpected raw source size/alpha; inspect before cleanup")

    labels, _ = label(alpha >= 64, structure=np.ones((3, 3), dtype=np.uint8))
    components = []
    for number, slices in enumerate(find_objects(labels), start=1):
        if slices is None:
            continue
        area = int(np.count_nonzero(labels[slices] == number))
        if area < 20_000:
            continue
        y_slice, x_slice = slices
        components.append({
            "component": number,
            "area": area,
            "bbox": [int(x_slice.start), int(y_slice.start), int(x_slice.stop), int(y_slice.stop)],
            "cx": (x_slice.start + x_slice.stop) / 2,
            "cy": (y_slice.start + y_slice.stop) / 2,
        })
    if len(components) != 10:
        raise ValueError(f"Expected 10 complete alpha>=64 figure components; found {len(components)}")
    # Keep the first cleanup's numbered component order as the canonical source
    # index: top-to-bottom by vertical center, then left-to-right on ties.
    initial_cleanup_order = sorted(components, key=lambda r: (r["cy"], r["cx"]))
    source_order = initial_cleanup_order.copy()
    # Record the raw sheet's loose 4+4+2 left-to-right ordering as a crosswalk,
    # but map from the preserved initial cleanup index for reproducibility.
    raw_rows = [initial_cleanup_order[0:4], initial_cleanup_order[4:8], initial_cleanup_order[8:10]]
    raw_reading_order = [rect for row in raw_rows for rect in sorted(row, key=lambda r: r["cx"])]
    raw_reading_index = {rect["component"]: index for index, rect in enumerate(raw_reading_order)}
    # Grounded crouch -> compact fist rise -> raised fists -> V apex -> angled
    # descent -> landing -> punch -> open-hand reach -> low recovery -> salute.
    output_to_source_frame = [3, 2, 1, 0, 5, 7, 4, 6, 9, 8]
    components = [source_order[index].copy() for index in output_to_source_frame]
    for rect, source_frame in zip(components, output_to_source_frame, strict=True):
        rect["sourceFrameIndexInitialOrder"] = source_frame
        rect["sourceFrameIndexRawReadingOrder"] = raw_reading_index[rect["component"]]

    output = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    frame_rows = []
    for frame, rect in enumerate(components):
        component = rect["component"]
        x0, y0, x1, y1 = rect["bbox"]
        # Keep source antialiasing only in a 2px dilation of the original body.
        x0e, y0e = max(0, x0 - 2), max(0, y0 - 2)
        x1e, y1e = min(source.width, x1 + 2), min(source.height, y1 + 2)
        region_labels = labels[y0e:y1e, x0e:x1e]
        core = region_labels == component
        distance = distance_transform_edt(~core)
        keep = distance <= 2.0
        rgba = source_pixels[y0e:y1e, x0e:x1e].copy()
        rgba[~keep, 3] = 0
        crop = Image.fromarray(rgba, "RGBA").convert("RGBa")

        scale = 0.55
        size = (max(1, round(crop.width * scale)), max(1, round(crop.height * scale)))
        resized = crop.resize(size, Image.Resampling.LANCZOS).convert("RGBA")
        column, row = frame % COLUMNS, frame // COLUMNS
        left = column * (WIDTH // COLUMNS)
        right = (column + 1) * (WIDTH // COLUMNS)
        top = row * (HEIGHT // ROWS)
        baseline = top + 452
        x = left + (right - left - resized.width) // 2
        y = baseline - resized.height
        if x < left + 60 or x + resized.width > right - 60 or y < top + 60 or baseline > top + 452:
            raise ValueError(f"Frame {frame} failed cleaned source cell margins")
        output.alpha_composite(resized, (x, y))
        frame_rows.append({
            "frame": frame,
            "sourceFrameIndexInitialOrder": rect["sourceFrameIndexInitialOrder"],
            "sourceFrameIndexRawReadingOrder": rect["sourceFrameIndexRawReadingOrder"],
            "sourceComponent": component,
            "sourceAreaAlpha64": rect["area"],
            "sourceBBoxXYXY": rect["bbox"],
            "rowMajorOutputCell": [row, column],
            "uniformScale": scale,
            "outputSize": list(resized.size),
            "outputXY": [x, y],
            "transparentMarginsLTRBpx": [x-left, right-(x+resized.width), y-top, top+512-baseline],
        })

    output.save(OUT, format="PNG", optimize=True)
    layout = {
        "athlete": "piper-quickstep",
        "clip": "celebrate",
        "attempt": 1,
        "rawSource": str(RAW.relative_to(ROOT)),
        "rawSourceSha256": digest(RAW),
        "cleanedSource": str(OUT.relative_to(ROOT)),
        "cleanedSourceSha256": digest(OUT),
        "cleanedSize": list(output.size),
        "layout": "4x3 row-major 1536x1536 source, cells 0-9 occupied and 10-11 fully transparent; output-to-initial-cleanup source-frame mapping [3,2,1,0,5,7,4,6,9,8]; raw loose-grid reading-order crosswalk is recorded per frame; earlier order candidates are preserved separately",
        "cleanup": "Global alpha>=64 component extraction retains the ten complete generated figures; detached glow/specks are removed; original antialias alpha is retained only within 2px of each component; each figure is uniformly resized at common scale .55 and centered within its 384x512 cell on a shared baseline. The explicit source-frame remap changes only order and placement; no figure pixels are drawn, synthesized, duplicated, or removed.",
        "frames": frame_rows,
    }
    LAYOUT.write_text(json.dumps(layout, indent=2) + "\n")
    print(json.dumps({"source": str(OUT), "sha256": digest(OUT), "frames": len(frame_rows), "size": list(output.size)}, indent=2))


if __name__ == "__main__":
    main()
