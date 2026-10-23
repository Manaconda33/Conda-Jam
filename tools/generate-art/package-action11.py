"""Pack eleven reviewed right-facing press/push poses with component isolation."""
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
ATHLETES = {"reed-ashcroft", "juniper-vale", "paprika"}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def pose_rectangles(image: Image.Image) -> tuple[list[dict], np.ndarray, np.ndarray]:
    if image.mode != "RGBA" or image.width < 1000 or image.height < 750:
        raise ValueError("Expected a transparent RGBA 4x3 source sheet")
    pixels = np.asarray(image)
    alpha = pixels[:, :, 3]
    if int(alpha.min()) != 0 or int(alpha.max()) < 240:
        raise ValueError("Source needs transparent background and solid figure pixels")

    components, _ = label(alpha >= 64, structure=np.ones((3, 3), dtype=np.uint8))
    rectangles = []
    minimum_area = image.width * image.height * 0.004
    for component, slices in enumerate(find_objects(components), start=1):
        if slices is None:
            continue
        area = int(np.count_nonzero(components[slices] == component))
        if area < minimum_area:
            continue
        ys, xs = slices
        rect = {
            "component": component,
            "area": area,
            "x0": int(xs.start),
            "y0": int(ys.start),
            "x1": int(xs.stop),
            "y1": int(ys.stop),
        }
        if rect["x0"] < 2 or rect["y0"] < 2 or rect["x1"] > image.width - 2 or rect["y1"] > image.height - 2:
            raise ValueError("A complete pose touches the outside source-sheet border")
        rect["cx"] = (rect["x0"] + rect["x1"]) / 2
        rect["cy"] = (rect["y0"] + rect["y1"]) / 2
        rectangles.append(rect)

    if len(rectangles) != 11:
        raise ValueError(f"Expected eleven separate complete bodies; found {len(rectangles)}")

    ordered = sorted(rectangles, key=lambda rect: (rect["cy"], rect["cx"]))
    cell_width, cell_height = image.width / 4, image.height / 3
    cells = {}
    for rect in rectangles:
        column = min(3, int(rect["cx"] // cell_width))
        row = min(2, int(rect["cy"] // cell_height))
        cell = (row, column)
        if cell in cells:
            raise ValueError(f"More than one pose occupies source cell {cell}")
        cells[cell] = rect
    expected = [(row, col) for row in range(3) for col in range(4) if (row, col) != (2, 3)]
    if set(cells) != set(expected):
        raise ValueError("Eleven poses must fill the first eleven cells of a 4x3 row-major sheet")
    ordered = [cells[cell] for cell in expected]

    for index, rect in enumerate(ordered):
        rect["sourceIndex"] = index
        rect["x"] = max(0, rect["x0"] - 2)
        rect["y"] = max(0, rect["y0"] - 2)
        rect["w"] = min(image.width, rect["x1"] + 2) - rect["x"]
        rect["h"] = min(image.height, rect["y1"] + 2) - rect["y"]

    # Keep each figure's pixels while masking adjacent antialiasing fragments.
    seeds = np.where(np.isin(components, [rect["component"] for rect in ordered]), components, 0)
    owner_indices = distance_transform_edt(seeds == 0, return_distances=False, return_indices=True)
    owners = seeds[tuple(owner_indices)]
    return ordered, pixels, owners


def package(athlete: str, source_path: Path, provenance_path: Path) -> Path:
    if athlete not in ATHLETES:
        raise ValueError("This reviewed batch only accepts Reed Ashcroft, Juniper Vale, and Paprika")
    provenance = json.loads(provenance_path.read_text())
    prompt = provenance.get("prompt") or provenance.get("sourcePrompt")
    if provenance.get("eligibleForPacking") is not True or provenance.get("review", {}).get("status") != "accepted":
        raise ValueError("Only explicitly accepted eleven-pose sources may be packed")
    if provenance.get("athlete") != athlete or provenance.get("clip") != "push" or provenance.get("direction") != "right":
        raise ValueError("Source provenance must match the athlete, push clip, and right-facing direction")
    if not prompt or not provenance.get("generatedAt") or provenance.get("sourceSha256") != sha256(source_path):
        raise ValueError("Exact source prompt, generation date, and matching source SHA-256 are required")

    with Image.open(source_path) as opened:
        source = opened.copy()
    rectangles, pixels, owners = pose_rectangles(source)
    crops = []
    for rect in rectangles:
        x, y, width, height = (rect[key] for key in ("x", "y", "w", "h"))
        crop = pixels[y : y + height, x : x + width].copy()
        local_owners = owners[y : y + height, x : x + width]
        crop[local_owners != rect["component"], 3] = 0
        crops.append(Image.fromarray(crop, mode="RGBA"))

    scale = 92 / max(crop.height for crop in crops)
    widest = max(crop.width * scale for crop in crops)
    cell_width = max(64, math.ceil((widest + 4) / 16) * 16)
    if cell_width > 192:
        raise ValueError("The action poses exceed the supported atlas width")
    cell_height = 96
    atlas = Image.new("RGBA", (cell_width * 4, cell_height * 3), (0, 0, 0, 0))
    frames = []
    for index, crop in enumerate(crops):
        size = (max(1, round(crop.width * scale)), max(1, round(crop.height * scale)))
        resized = crop.resize(size, Image.Resampling.LANCZOS)
        if resized.width > cell_width or resized.height > 92:
            raise ValueError(f"Pose {index} does not fit its normalized atlas cell")
        row, column = divmod(index, 4)
        x = column * cell_width + (cell_width - resized.width) // 2
        y = row * cell_height + 94 - resized.height
        atlas.alpha_composite(resized, (x, y))
        frames.append({"x": column * cell_width, "y": row * cell_height, "w": cell_width, "h": cell_height})

    output_path = OUTPUT_DIR / f"{athlete}-push-right.webp"
    if output_path.exists():
        raise FileExistsError(output_path)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    atlas.save(output_path, "WEBP", lossless=True, quality=88, method=6)

    provenance = {
        **provenance,
        "prompt": prompt,
        "sourceImage": str(source_path),
        "sourceSha256": sha256(source_path),
        "sourceRects": [
            {key: rect[key] for key in ("sourceIndex", "x", "y", "w", "h", "component", "area")}
            for rect in rectangles
        ],
        "uniformScale": scale,
        "componentIsolation": True,
        "packaging": f"package-action11.py; {cell_width}x96 cells; baseline94; lossless WebP; 11 original push poses",
    }
    layout = {
        "athlete": athlete,
        "direction": "right",
        "clip": "push",
        "src": "./public/assets/animation/" + output_path.name,
        "columns": 4,
        "rows": 3,
        "frames": frames,
        "provenance": provenance,
    }
    layout_path = ROOT / "tools/generate-art" / f"{athlete}-push11-layouts.json"
    layout_path.write_text(json.dumps([layout], indent=2) + "\n")
    print(f"Packed {athlete}/push: 11 unique poses -> {output_path.relative_to(ROOT)} ({atlas.width}x{atlas.height})")
    print(f"Recorded layout: {layout_path.relative_to(ROOT)}")
    return layout_path


if __name__ == "__main__":
    if len(sys.argv) != 4:
        raise SystemExit("Usage: python tools/generate-art/package-action11.py ATHLETE SOURCE.png PROVENANCE.json")
    package(sys.argv[1], Path(sys.argv[2]).resolve(), Path(sys.argv[3]).resolve())
