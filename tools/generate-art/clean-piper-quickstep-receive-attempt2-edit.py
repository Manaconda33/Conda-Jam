#!/usr/bin/env python3
"""Isolate Piper's four receive poses from their generated RGBA sheet."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, label

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "tools/generate-art/sources/piper-quickstep-receive-attempt2-edit-generated-raw.png"
OUT = ROOT / "tools/generate-art/sources/piper-quickstep-receive-attempt2-edit-clean-candidate.png"


def main():
    source = np.asarray(Image.open(RAW).convert("RGBA"))
    if source.shape[:2] != (1024, 1536):
        raise ValueError("Expected a 1536x1024 four-pose sheet")
    result = np.zeros_like(source)
    h, w = source.shape[:2]
    counts = []
    for index in range(4):
        row, col = divmod(index, 2)
        x0, x1 = round(col * w / 2), round((col + 1) * w / 2)
        y0, y1 = round(row * h / 2), round((row + 1) * h / 2)
        cell = source[y0:y1, x0:x1].copy()
        components, count = label(cell[:, :, 3] >= 64)
        sizes = np.bincount(components.ravel(), minlength=count + 1)
        sizes[0] = 0
        if int(sizes.max()) < 3000:
            raise ValueError(f"Pose {index} has no full-body component")
        owner = int(sizes.argmax())
        core = components == owner
        distance = distance_transform_edt(~core)
        keep = core | ((cell[:, :, 3] > 0) & (distance <= 2))
        removed = int(np.count_nonzero((cell[:, :, 3] > 0) & ~keep))
        cell[~keep, 3] = 0
        result[y0:y1, x0:x1] = cell
        counts.append({"pose": index, "corePixels": int(core.sum()), "removedOutsidePixels": removed})
    Image.fromarray(result, "RGBA").save(OUT)
    print(f"Cleaned four Piper receive cells -> {OUT.relative_to(ROOT)}")
    print(counts)


if __name__ == "__main__":
    main()
