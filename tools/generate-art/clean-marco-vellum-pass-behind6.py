#!/usr/bin/env python3
"""Clear generated sheet backgrounds around Marco's six pass-behind poses."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, label

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "tools/generate-art/sources/marco-vellum-pass-behind-generated-raw.png"
OUT = ROOT / "tools/generate-art/sources/marco-vellum-pass-behind6.png"


def main():
    source = np.asarray(Image.open(RAW).convert("RGBA"))
    if source.shape[:2] != (1024, 1536):
        raise ValueError(f"Expected 1536x1024 sheet; got {source.shape[1]}x{source.shape[0]}")
    result = np.zeros_like(source)
    counts = []
    h, w = source.shape[:2]
    for index in range(6):
        row, col = divmod(index, 3)
        x0, x1 = round(col * w / 3), round((col + 1) * w / 3)
        y0, y1 = round(row * h / 2), round((row + 1) * h / 2)
        cell = source[y0:y1, x0:x1].copy()
        components, count = label(cell[:, :, 3] >= 64)
        sizes = np.bincount(components.ravel(), minlength=count + 1)
        sizes[0] = 0
        if not sizes.size or int(sizes.max()) < 3000:
            raise ValueError(f"Pose {index} has no complete athlete component")
        owner = int(sizes.argmax())
        core = components == owner
        distance = distance_transform_edt(~core)
        keep = core | ((cell[:, :, 3] > 0) & (distance <= 2))
        removed = int(np.count_nonzero((cell[:, :, 3] > 0) & ~keep))
        cell[~keep, 3] = 0
        result[y0:y1, x0:x1] = cell
        counts.append({"pose": index, "corePixels": int(core.sum()), "removedOutsidePixels": removed})
    Image.fromarray(result, "RGBA").save(OUT)
    print(f"Cleaned six Marco pass-behind cells -> {OUT.relative_to(ROOT)}")
    print(counts)


if __name__ == "__main__":
    main()
