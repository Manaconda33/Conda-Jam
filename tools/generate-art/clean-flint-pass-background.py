"""Remove smooth generated backdrop from Flint's reviewed pass sheet.

Usage: python tools/generate-art/clean-flint-pass-background.py
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation, binary_propagation

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "tools/generate-art/sources/flint-rooker-pass-attempt1-rejected.png"
OUTPUT = ROOT / "tools/generate-art/sources/flint-rooker-pass6.png"
EDGE_THRESHOLD = 5


def exterior_mask(rgb: np.ndarray) -> np.ndarray:
    height, width = rgb.shape[:2]
    if width % 3 or height % 2:
        raise ValueError("Expected an exact 3-column by 2-row atlas")
    removed = np.zeros((height, width), dtype=bool)
    for row in range(2):
        for column in range(3):
            y0, y1 = row * (height // 2), (row + 1) * (height // 2)
            x0, x1 = column * (width // 3), (column + 1) * (width // 3)
            cell = rgb[y0:y1, x0:x1].astype(np.int16)
            barrier = np.zeros(cell.shape[:2], dtype=bool)
            for dy, dx in ((0, 1), (1, 0)):
                a = cell[:-dy or None, :-dx or None]
                b = cell[dy:, dx:]
                contrast = np.max(np.abs(a - b), axis=2) > EDGE_THRESHOLD
                barrier[:-dy or None, :-dx or None] |= contrast
                barrier[dy:, dx:] |= contrast
            barrier = binary_dilation(barrier, iterations=1)
            traversable = ~barrier
            seeds = np.zeros_like(traversable)
            seeds[[0, -1], :] = True
            seeds[:, [0, -1]] = True
            seeds &= traversable
            removed[y0:y1, x0:x1] = binary_propagation(seeds, mask=traversable)
    return removed


def main() -> None:
    source = Image.open(SOURCE).convert("RGB")
    rgb = np.asarray(source)
    background = exterior_mask(rgb)
    rgba = np.dstack((rgb, np.where(background, 0, 255).astype(np.uint8)))
    Image.fromarray(rgba, "RGBA").save(OUTPUT)
    print(
        f"Removed smooth backdrop pixels in six independent cells: "
        f"{int(background.sum())} / {background.size} ({background.mean():.1%}); "
        f"RGB sprite pixels preserved exactly; wrote {OUTPUT.relative_to(ROOT)}"
    )


if __name__ == "__main__":
    main()
