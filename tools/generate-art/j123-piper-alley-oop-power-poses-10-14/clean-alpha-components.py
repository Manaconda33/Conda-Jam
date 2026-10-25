#!/usr/bin/env python3
"""Alpha-only largest-component cleanup for J.123 isolated Piper poses."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent
attempts = {10: 1, 11: 1, 12: 2, 13: 1, 14: 1}
for pose, attempt in attempts.items():
    raw = ROOT / f"sources/pose-{pose}-attempt{attempt}-raw.png"
    output = ROOT / f"cleaned/pose-{pose}-attempt{attempt}-components-clean.png"
    rgba = np.asarray(Image.open(raw).convert("RGBA"))
    alpha = rgba[:, :, 3]
    labels, count = ndimage.label(alpha > 0, structure=np.ones((3, 3), dtype=np.uint8))
    sizes = np.bincount(labels.ravel())
    keep = 1 + int(np.argmax(sizes[1:]))
    cleaned = rgba.copy()
    cleaned[:, :, 3] = np.where(labels == keep, alpha, 0).astype(np.uint8)
    output.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(cleaned, "RGBA").save(output)
