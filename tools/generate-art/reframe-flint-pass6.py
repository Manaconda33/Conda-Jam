#!/usr/bin/env python3
"""Uniformly scale and reframe Flint's six accepted pass poses into roomy 3x2 cells."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, find_objects, label

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "tools/generate-art/sources/flint-rooker-pass6.png"
OUTPUT = ROOT / "tools/generate-art/sources/flint-rooker-pass6-reframed.png"
CELL_SIZE = (512, 512)
SCALE = 0.77
MARGIN = 40


def main():
    original = Image.open(SOURCE).convert("RGBA")
    pixels = np.asarray(original)
    alpha = pixels[:, :, 3]
    components, _ = label(alpha >= 64, structure=np.ones((3, 3), dtype=np.uint8))
    rectangles = []
    for component, slices in enumerate(find_objects(components), start=1):
        if slices is None:
            continue
        area = int(np.count_nonzero(components[slices] == component))
        if area < 1000:
            continue
        ys, xs = slices
        rect = {"component": component, "area": area, "x0": int(xs.start), "y0": int(ys.start), "x1": int(xs.stop), "y1": int(ys.stop)}
        rect["cx"] = (rect["x0"] + rect["x1"]) / 2
        rect["cy"] = (rect["y0"] + rect["y1"]) / 2
        rectangles.append(rect)
    if len(rectangles) != 6:
        raise ValueError(f"Expected six complete pose components; found {len(rectangles)}")
    cells = {}
    for rect in rectangles:
        cell = (min(1, int(rect["cy"] // (original.height / 2))), min(2, int(rect["cx"] // (original.width / 3))))
        if cell in cells:
            raise ValueError(f"Multiple poses occupy source cell {cell}")
        cells[cell] = rect
    expected = [(row, col) for row in range(2) for col in range(3)]
    if set(cells) != set(expected):
        raise ValueError("Source does not contain a complete 3x2 row-major pose set")

    seeds = np.where(np.isin(components, [cells[cell]["component"] for cell in expected]), components, 0)
    owner_indices = distance_transform_edt(seeds == 0, return_distances=False, return_indices=True)
    owners = seeds[tuple(owner_indices)]
    sheet = Image.new("RGBA", original.size, (0, 0, 0, 0))
    rows = []
    for index, cell in enumerate(expected):
        rect = cells[cell]
        x0, y0 = max(0, rect["x0"] - 2), max(0, rect["y0"] - 2)
        x1, y1 = min(original.width, rect["x1"] + 2), min(original.height, rect["y1"] + 2)
        crop = pixels[y0:y1, x0:x1].copy()
        local_owners = owners[y0:y1, x0:x1]
        crop[local_owners != rect["component"], 3] = 0
        resized = Image.fromarray(crop, "RGBA").resize((round(crop.shape[1] * SCALE), round(crop.shape[0] * SCALE)), Image.Resampling.LANCZOS)
        row, col = cell
        if resized.width > CELL_SIZE[0] - 2 * MARGIN or resized.height > CELL_SIZE[1] - 2 * MARGIN:
            raise ValueError(f"Pose {index} cannot fit the requested 40px margins")
        px = col * CELL_SIZE[0] + (CELL_SIZE[0] - resized.width) // 2
        py = (row + 1) * CELL_SIZE[1] - MARGIN - resized.height
        actual_margins = (px - col * CELL_SIZE[0], py - row * CELL_SIZE[1], (col + 1) * CELL_SIZE[0] - (px + resized.width), (row + 1) * CELL_SIZE[1] - (py + resized.height))
        if min(actual_margins) < MARGIN:
            raise ValueError(f"Pose {index} has less than {MARGIN}px cell clearance: {actual_margins}")
        sheet.alpha_composite(resized, (px, py))
        rows.append({"sourceIndex": index, "sourceComponent": rect["component"], "sourceRect": [x0, y0, x1 - x0, y1 - y0], "outputRect": [px, py, resized.width, resized.height], "cellMargins": actual_margins})
    sheet.save(OUTPUT, optimize=True)
    print(f"Reframed 6 poses uniformly at {SCALE}x -> {OUTPUT.relative_to(ROOT)} ({original.width}x{original.height})")
    print(rows)


if __name__ == "__main__":
    main()
