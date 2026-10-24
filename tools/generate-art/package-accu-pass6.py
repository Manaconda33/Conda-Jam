"""Pack six reviewed six-frame action drawings without inventing poses.

The source sheet is a 3x2 transparent contact sheet. Figures are assigned by
their connected alpha components and center position, then only uniformly
resized and placed into baseline-aligned 112x96 atlas cells.
"""
from __future__ import annotations

import hashlib
import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, find_objects, label

ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = ROOT / "public/assets/animation"


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _pose_rectangles(image: Image.Image) -> tuple[list[dict], np.ndarray, np.ndarray]:
    if image.mode != "RGBA":
        raise ValueError("Expected a true RGBA source sheet")
    if image.size != (1536, 1024):
        raise ValueError(f"Expected the reviewed 1536x1024 3x2 source, got {image.size}")

    pixels = np.asarray(image)
    alpha = pixels[:, :, 3]
    if int(alpha.min()) != 0 or int(alpha.max()) < 240:
        raise ValueError("Source needs transparent background and solid figure pixels")

    components, _ = label(alpha >= 64, structure=np.ones((3, 3), dtype=np.uint8))
    rects = []
    minimum_area = image.width * image.height * 0.006
    for component_index, slices in enumerate(find_objects(components), start=1):
        if slices is None:
            continue
        component_pixels = int(np.count_nonzero(components[slices] == component_index))
        if component_pixels < minimum_area:
            continue
        y_slice, x_slice = slices
        rect = {
            "component": component_index,
            "area": component_pixels,
            "x0": int(x_slice.start),
            "y0": int(y_slice.start),
            "x1": int(x_slice.stop),
            "y1": int(y_slice.stop),
        }
        if rect["x0"] < 2 or rect["y0"] < 2 or rect["x1"] > image.width - 2 or rect["y1"] > image.height - 2:
            raise ValueError("A complete pose touches the outside source-sheet border")
        rect["cx"] = (rect["x0"] + rect["x1"]) / 2
        rect["cy"] = (rect["y0"] + rect["y1"]) / 2
        rects.append(rect)

    if len(rects) != 6:
        summary = sorted((r["area"] for r in rects), reverse=True)
        raise ValueError(f"Expected six separate full-body components; found {len(rects)} ({summary})")

    top = sorted((r for r in rects if r["cy"] < image.height / 2), key=lambda r: r["cx"])
    bottom = sorted((r for r in rects if r["cy"] >= image.height / 2), key=lambda r: r["cx"])
    if len(top) != 3 or len(bottom) != 3:
        raise ValueError("Six poses do not form two complete rows of three")
    ordered = top + bottom

    for index, rect in enumerate(ordered):
        expected_column = index % 3
        center_column = int(rect["cx"] // (image.width / 3))
        if center_column != expected_column:
            raise ValueError(f"Pose {index} is not in row-major column {expected_column}")
        rect["sourceIndex"] = index
        rect["x"] = max(0, rect["x0"] - 2)
        rect["y"] = max(0, rect["y0"] - 2)
        rect["w"] = min(image.width, rect["x1"] + 2) - rect["x"]
        rect["h"] = min(image.height, rect["y1"] + 2) - rect["y"]

    for left_index, left in enumerate(ordered):
        for right in ordered[left_index + 1 :]:
            overlap_x = min(left["x1"], right["x1"]) - max(left["x0"], right["x0"])
            overlap_y = min(left["y1"], right["y1"]) - max(left["y0"], right["y0"])
            if overlap_x > 0 and overlap_y > 0:
                raise ValueError("Pose component bounds overlap; refusing an unsafe crop")

    seeds = np.where(np.isin(components, [r["component"] for r in ordered]), components, 0)
    owner_indices = distance_transform_edt(seeds == 0, return_distances=False, return_indices=True)
    owners = seeds[tuple(owner_indices)]
    return ordered, pixels, owners


def package(athlete: str, clip: str, source_path: Path, provenance_path: Path) -> Path:
    if athlete not in {"accu"}:
        raise ValueError("Accu-specific six-pose batch")
    provenance = json.loads(provenance_path.read_text())
    if provenance.get("eligibleForPacking") is not True or provenance.get("review", {}).get("status") != "accepted":
        raise ValueError("Only explicitly accepted six-pose sources may be packed")
    if provenance.get("athlete") != athlete or provenance.get("clip") != clip or provenance.get("direction") != "right":
        raise ValueError("Source provenance must match the requested athlete, clip, and right-facing direction")
    source_prompt = provenance.get("prompt") or provenance.get("sourcePrompt")
    if not source_prompt or not provenance.get("generatedAt"):
        raise ValueError("Exact generation prompt and date are required")

    if provenance.get("sourceSha256") and provenance["sourceSha256"] != _sha256(source_path):
        raise ValueError("Source SHA-256 does not match accepted provenance")

    with Image.open(source_path) as opened:
        source = opened.copy()
    rects, pixels, owners = _pose_rectangles(source)

    crops = []
    for rect in rects:
        x, y, w, h = (rect[key] for key in ("x", "y", "w", "h"))
        crop = pixels[y : y + h, x : x + w].copy()
        local_owners = owners[y : y + h, x : x + w]
        crop[local_owners != rect["component"], 3] = 0
        crops.append(Image.fromarray(crop, mode="RGBA"))

    maximum_height = max(crop.height for crop in crops)
    scale = 92 / maximum_height
    maximum_scaled_width = max(crop.width * scale for crop in crops)
    cell_width = max(64, math.ceil((maximum_scaled_width + 4) / 16) * 16)
    if cell_width > 192:
        raise ValueError("The reviewed pass poses exceed the supported atlas width")

    frame_width = cell_width
    frame_height = 96
    atlas = Image.new("RGBA", (frame_width * 3, frame_height * 2), (0, 0, 0, 0))
    frame_layouts = []
    for index, crop in enumerate(crops):
        new_size = (max(1, round(crop.width * scale)), max(1, round(crop.height * scale)))
        resized = crop.resize(new_size, Image.Resampling.LANCZOS)
        if resized.width > cell_width or resized.height > 92:
            raise ValueError(f"Pose {index} does not fit its normalized atlas cell")
        column, row = index % 3, index // 3
        x = column * frame_width + (frame_width - resized.width) // 2
        y = row * frame_height + 94 - resized.height
        atlas.alpha_composite(resized, (x, y))
        frame_layouts.append({"x": column * frame_width, "y": row * frame_height, "w": frame_width, "h": frame_height})

    output_path = OUTPUT_DIR / f"{athlete}-{clip}-right.webp"
    if output_path.exists():
        raise FileExistsError(output_path)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    atlas.save(output_path, "WEBP", lossless=True, quality=88, method=6)

    recorded_rects = [
        {key: rect[key] for key in ("sourceIndex", "x", "y", "w", "h", "component", "area")}
        for rect in rects
    ]
    layout = {
        "athlete": athlete,
        "direction": "right",
        "clip": clip,
        "src": "./public/assets/animation/" + output_path.name,
        "columns": 3,
        "rows": 2,
        "frames": frame_layouts,
        "provenance": {
            **provenance,
            "prompt": source_prompt,
            "sourceImage": str(source_path),
            "sourceSha256": _sha256(source_path),
            "sourceRects": recorded_rects,
            "uniformScale": scale,
            "componentIsolation": True,
            "packaging": f"package-pass6.py; {cell_width}x96 cells; baseline94; lossless WebP; 6 original {clip} poses",
        },
    }
    layout_path = ROOT / "tools/generate-art" / f"{athlete}-{clip}6-layouts.json"
    layout_path.write_text(json.dumps([layout], indent=2) + "\n")
    print(f"Packed {athlete}/{clip}: {len(crops)} unique poses -> {output_path.relative_to(ROOT)} ({atlas.width}x{atlas.height})")
    print(f"Recorded layout: {layout_path.relative_to(ROOT)}")
    return layout_path


if __name__ == "__main__":
    if len(sys.argv) == 4:
        athlete, clip = sys.argv[1], "pass"
        source, provenance = sys.argv[2:]
    elif len(sys.argv) == 5:
        athlete, clip, source, provenance = sys.argv[1:]
    else:
        raise SystemExit("Usage: python tools/generate-art/package-pass6.py ATHLETE [CLIP] SOURCE.png PROVENANCE.json")
    package(athlete, clip, Path(source).resolve(), Path(provenance).resolve())
