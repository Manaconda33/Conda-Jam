#!/usr/bin/env python3
"""Remove the generated red fringe attached to transparency in a Paprika atlas.

This is a conservative edge pass: it only clears strongly red pixels that are
connected through same-colored pixels to already transparent background. Fur,
ear interiors, and the dark silhouette outline are not recolored.
"""
from pathlib import Path
import sys

import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation, binary_propagation


def clean(source: Path, destination: Path) -> int:
    with Image.open(source) as opened:
        pixels = np.array(opened.convert("RGBA"))
    red, green, blue = (pixels[:, :, i].astype(np.int16) for i in range(3))
    alpha = pixels[:, :, 3]
    background = alpha == 0
    fringe_color = (
        (red >= 230)
        & ((red - green) >= 160)
        & (green <= 80)
        & (blue <= 50)
        & (alpha > 0)
    )
    neighborhood = np.ones((3, 3), dtype=bool)
    seeds = fringe_color & binary_dilation(background, structure=neighborhood)
    fringe = binary_propagation(seeds, structure=neighborhood, mask=fringe_color)
    pixels[fringe, 3] = 0
    pixels[0, :, 3] = 0
    pixels[-1, :, 3] = 0
    pixels[:, 0, 3] = 0
    pixels[:, -1, 3] = 0
    Image.fromarray(pixels, "RGBA").save(destination)
    return int(fringe.sum())


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Usage: clean-alpha-fringe.py input.png output.png")
    count = clean(Path(sys.argv[1]), Path(sys.argv[2]))
    print(f"Cleared {count} exterior red fringe pixels")
