#!/usr/bin/env python3
"""Trim generated halo pixels away from the non-red character silhouette.

Every retained RGBA value is copied from the original image. The pass only
sets remote or vivid red/coral exterior pixels to alpha zero; a small outline
margin around every dark outline, white cloth, skin and kit-color core remains intact.
"""
from pathlib import Path
import sys

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, label


def clean(source: Path, destination: Path, margin: float = 4) -> tuple[int, int]:
    with Image.open(source) as opened:
        pixels = np.array(opened.convert("RGBA"))
    rgb = pixels[:, :, :3].astype(np.int16)
    alpha = pixels[:, :, 3]
    red, green, blue = (rgb[:, :, i] for i in range(3))
    vivid_red = (red >= 230) & ((red - green) >= 160) & (green <= 80) & (blue <= 50)
    components, count = label(alpha > 64)
    sizes = np.bincount(components.ravel(), minlength=count + 1)
    largest = int(sizes[1:].max()) if count else 0
    primary_ids = np.flatnonzero(sizes[1:] >= max(16, largest * .01)) + 1
    core = np.isin(components, primary_ids) & ~vivid_red
    if not np.any(core):
        raise ValueError("No non-red character pixels found")
    distance = distance_transform_edt(~core)
    exterior = (alpha > 0) & ((distance > margin) | vivid_red)
    removed_pixels = int(exterior.sum())
    removed_red = int(((alpha > 0) & vivid_red).sum())
    pixels[exterior, 3] = 0
    pixels[0, :, 3] = 0
    pixels[-1, :, 3] = 0
    pixels[:, 0, 3] = 0
    pixels[:, -1, 3] = 0
    Image.fromarray(pixels, "RGBA").save(destination)
    return removed_pixels, removed_red


if __name__ == "__main__":
    if len(sys.argv) not in (3, 4):
        raise SystemExit("Usage: clean-dunk-halo.py input.png output.png [outline-margin]")
    removed_pixels, removed_red = clean(
        Path(sys.argv[1]), Path(sys.argv[2]), float(sys.argv[3]) if len(sys.argv) == 4 else 4
    )
    print(f"Cleared {removed_pixels} exterior halo pixels, including {removed_red} vivid red/coral pixels")
