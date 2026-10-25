"""Pack four reviewed action poses without drawing or duplicating pixels."""
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


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def pose_rectangles(image: Image.Image) -> tuple[list[dict], np.ndarray, np.ndarray]:
    if image.mode != "RGBA" or image.width < 512 or image.height < 512:
        raise ValueError("Expected a transparent RGBA 2x2 source sheet")
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

    if len(rectangles) != 4:
        raise ValueError(f"Expected four separate complete bodies; found {len(rectangles)}")

    top = sorted((r for r in rectangles if r["cy"] < image.height / 2), key=lambda r: r["cx"])
    bottom = sorted((r for r in rectangles if r["cy"] >= image.height / 2), key=lambda r: r["cx"])
    if len(top) != 2 or len(bottom) != 2:
        raise ValueError("Four poses do not form two complete rows of two")
    ordered = top + bottom

    for index, rect in enumerate(ordered):
        expected_column = index % 2
        center_column = int(rect["cx"] // (image.width / 2))
        if center_column != expected_column:
            raise ValueError(f"Pose {index} is not in row-major column {expected_column}")
        rect["sourceIndex"] = index
        rect["x"] = max(0, rect["x0"] - 2)
        rect["y"] = max(0, rect["y0"] - 2)
        rect["w"] = min(image.width, rect["x1"] + 2) - rect["x"]
        rect["h"] = min(image.height, rect["y1"] + 2) - rect["y"]

    # Tight component bounds can overlap even when the figures themselves are
    # separate (for example, a top-row shoe and bottom-row ponytail). The
    # nearest-component owner map below masks every neighboring component out
    # of each crop while retaining every pixel belonging to its own component.
    seeds = np.where(np.isin(components, [r["component"] for r in ordered]), components, 0)
    owner_indices = distance_transform_edt(seeds == 0, return_distances=False, return_indices=True)
    owners = seeds[tuple(owner_indices)]
    return ordered, pixels, owners


def package(athlete: str, source_path: Path, provenance_path: Path) -> Path:
    if athlete not in {"reed-ashcroft", "juniper-vale", "paprika", "keeg", "piper-quickstep"}:
        raise ValueError("This reviewed batch only accepts Reed Ashcroft, Juniper Vale, Paprika, Keeg, and Piper Quickstep")
    provenance = json.loads(provenance_path.read_text())
    clip = provenance.get("clip")
    if clip not in {"receive", "block"}:
        raise ValueError("This four-pose packer accepts only reviewed receive or block clips")
    if provenance.get("eligibleForPacking") is not True or provenance.get("review", {}).get("status") != "accepted":
        raise ValueError("Only explicitly accepted four-pose sources may be packed")
    if provenance.get("athlete") != athlete or provenance.get("direction") != "right":
        raise ValueError("Source provenance must match the athlete and right-facing direction")
    prompt = provenance.get("prompt") or provenance.get("sourcePrompt")
    if not prompt or not provenance.get("generatedAt"):
        raise ValueError("Exact generation prompt and date are required")
    if provenance.get("sourceSha256") != sha256(source_path):
        raise ValueError("Source SHA-256 does not match accepted provenance")

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
    atlas = Image.new("RGBA", (cell_width * 2, cell_height * 2), (0, 0, 0, 0))
    frames = []
    for index, crop in enumerate(crops):
        size = (max(1, round(crop.width * scale)), max(1, round(crop.height * scale)))
        resized = crop.resize(size, Image.Resampling.LANCZOS)
        if resized.width > cell_width or resized.height > 92:
            raise ValueError(f"Pose {index} does not fit its normalized atlas cell")
        row, column = divmod(index, 2)
        x = column * cell_width + (cell_width - resized.width) // 2
        y = row * cell_height + 94 - resized.height
        atlas.alpha_composite(resized, (x, y))
        frames.append({"x": column * cell_width, "y": row * cell_height, "w": cell_width, "h": cell_height})

    output_path = OUTPUT_DIR / f"{athlete}-{clip}-right.webp"
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
        "packaging": f"package-action4.py; {cell_width}x96 cells; baseline94; lossless WebP; 4 original {clip} poses",
    }
    layout = {
        "athlete": athlete,
        "direction": "right",
        "clip": clip,
        "src": "./public/assets/animation/" + output_path.name,
        "columns": 2,
        "rows": 2,
        "frames": frames,
        "provenance": provenance,
    }
    layout_path = ROOT / "tools/generate-art" / f"{athlete}-{clip}4-layouts.json"
    layout_path.write_text(json.dumps([layout], indent=2) + "\n")
    print(f"Packed {athlete}/{clip}: 4 unique poses -> {output_path.relative_to(ROOT)} ({atlas.width}x{atlas.height})")
    print(f"Recorded layout: {layout_path.relative_to(ROOT)}")
    return layout_path


if __name__ == "__main__":
    if len(sys.argv) != 4:
        raise SystemExit("Usage: python tools/generate-art/package-action4.py ATHLETE SOURCE.png PROVENANCE.json")
    package(sys.argv[1], Path(sys.argv[2]).resolve(), Path(sys.argv[3]).resolve())
