#!/usr/bin/env python3
"""Remove the smooth generated matte from Leo's fifteen-pose windmill sheet."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "tools/generate-art/sources/leo-windmill-edit-rejected.png"
OUTPUT = ROOT / "tools/generate-art/sources/j119-leo-dunk-windmill15.png"


def clean() -> None:
    with Image.open(SOURCE) as opened:
        image = opened.convert("RGB")
        pixels = np.asarray(image)
    # The edit candidate returned a visible light-gray checkerboard. Identify
    # its near-neutral pale pixels, then remove only those 8-connected regions
    # that reach the canvas edge; enclosed light shoe highlights remain intact.
    values = pixels.astype(np.int16)
    grayscale = (values.max(axis=2) - values.min(axis=2) <= 30) & (values.mean(axis=2) >= 150)
    components, _ = label(grayscale, structure=np.ones((3, 3), dtype=np.uint8))
    edge_labels = np.unique(np.concatenate((components[0], components[-1], components[:, 0], components[:, -1])))
    background = (components > 0) & np.isin(components, edge_labels)
    alpha = np.where(background, 0, 255).astype(np.uint8)
    rgba = np.dstack((pixels, alpha))
    Image.fromarray(rgba, "RGBA").save(OUTPUT, optimize=True)
    print(f"cleaned={OUTPUT.relative_to(ROOT)} size={image.size} alpha={Image.open(OUTPUT).getchannel('A').getextrema()} removed={int(background.sum())}")


if __name__ == "__main__":
    clean()
