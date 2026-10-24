#!/usr/bin/env python3
"""Remove the connected neutral checkerboard from Sable's generated steal sheet."""
from __future__ import annotations

import hashlib
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import label

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "tools/generate-art/sources/sable-regent-steal-retry-generated-raw.png"
OUTPUT = ROOT / "tools/generate-art/sources/sable-regent-steal-retry.png"


def main() -> None:
    rgb = np.asarray(Image.open(RAW).convert("RGB"))
    high = rgb.max(axis=2).astype(np.int16)
    low = rgb.min(axis=2).astype(np.int16)
    value = rgb.mean(axis=2)
    # The edit model rendered a neutral gray checkerboard instead of alpha.
    # Remove only neutral, bright regions connected to the canvas boundary;
    # outlined figure pixels remain isolated from that exterior component.
    background_like = ((high - low) <= 30) & (value >= 125)
    labels, _ = label(background_like)
    boundary = np.concatenate((labels[0], labels[-1], labels[:, 0], labels[:, -1]))
    exterior_labels = np.unique(boundary)
    exterior_labels = exterior_labels[exterior_labels != 0]
    exterior = np.isin(labels, exterior_labels)

    rgba = np.zeros((*rgb.shape[:2], 4), dtype=np.uint8)
    rgba[:, :, :3] = rgb
    rgba[:, :, 3] = np.where(exterior, 0, 255)
    Image.fromarray(rgba, "RGBA").save(OUTPUT, optimize=True)
    print(f"source={OUTPUT.relative_to(ROOT)}")
    print(f"sha256={hashlib.sha256(OUTPUT.read_bytes()).hexdigest()}")
    print(f"exteriorPixelsRemoved={int(exterior.sum())}")


if __name__ == "__main__":
    main()
