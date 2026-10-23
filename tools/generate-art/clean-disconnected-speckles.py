#!/usr/bin/env python3
"""Clear remote disconnected pixels around complete imagegen pose figures.

The largest alpha-connected silhouettes are preserved byte-for-byte. Smaller
components within a narrow edge margin of a silhouette are kept as detached
pixel details; only remote components are made transparent.
"""
from pathlib import Path
import sys

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, label


def clean(source: Path, destination: Path, expected: int, margin: float = 2) -> tuple[int, int]:
    with Image.open(source) as opened:
        pixels = np.array(opened.convert("RGBA"))
    alpha = pixels[:, :, 3]
    labels, count = label(alpha > 0)
    sizes = np.bincount(labels.ravel())
    order = np.argsort(sizes[1:])[::-1] + 1
    if len(order) < expected:
        raise ValueError(f"Expected {expected} full figures, found {len(order)} alpha components")
    primary_ids = order[:expected]
    if sizes[primary_ids[-1]] < 1000:
        raise ValueError("A full figure is too small for safe component cleanup")
    next_size = sizes[order[expected]] if len(order) > expected else 0
    if next_size and sizes[primary_ids[-1]] < 10 * next_size:
        raise ValueError("Full-figure and stray-component sizes are not clearly separated")

    primary = np.isin(labels, primary_ids)
    distance = distance_transform_edt(~primary)
    nearest_distance = np.full(count + 1, np.inf)
    np.minimum.at(nearest_distance, labels.ravel(), distance.ravel())
    retained_ids = primary_ids.tolist()
    retained_ids.extend(
        component
        for component in range(1, count + 1)
        if nearest_distance[component] <= margin
    )
    keep = np.isin(labels, retained_ids)
    removed = (alpha > 0) & ~keep
    removed_pixels = int(removed.sum())
    removed_components = int(np.unique(labels[removed]).size)
    pixels[removed, 3] = 0
    pixels[0, :, 3] = 0
    pixels[-1, :, 3] = 0
    pixels[:, 0, 3] = 0
    pixels[:, -1, 3] = 0
    Image.fromarray(pixels, "RGBA").save(destination)
    return removed_pixels, removed_components


if __name__ == "__main__":
    if len(sys.argv) not in (4, 5):
        raise SystemExit("Usage: clean-disconnected-speckles.py input.png output.png expected-figures [edge-margin]")
    removed_pixels, removed_components = clean(
        Path(sys.argv[1]), Path(sys.argv[2]), int(sys.argv[3]), float(sys.argv[4]) if len(sys.argv) == 5 else 2
    )
    print(f"Cleared {removed_pixels} pixels in {removed_components} remote disconnected components")
