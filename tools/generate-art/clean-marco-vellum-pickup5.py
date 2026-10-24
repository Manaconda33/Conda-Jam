#!/usr/bin/env python3
"""Isolate Marco's five pickup poses from generated background haze."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, label

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "tools/generate-art/sources/marco-vellum-pickup-attempt3-rejected.png"
OUT = ROOT / "tools/generate-art/sources/marco-vellum-pickup5.png"


def main():
    source = np.asarray(Image.open(RAW).convert("RGBA"))
    if source.shape[:2] != (1024, 1536):
        raise ValueError(f"Expected 1536x1024 source; got {source.shape[1]}x{source.shape[0]}")
    result = np.zeros_like(source)
    h, w = source.shape[:2]
    records = []
    for index in range(6):
        row, col = divmod(index, 3)
        x0, x1 = round(col * w / 3), round((col + 1) * w / 3)
        y0, y1 = round(row * h / 2), round((row + 1) * h / 2)
        cell = source[y0:y1, x0:x1].copy()
        labels, count = label(cell[:, :, 3] >= 64)
        sizes = np.bincount(labels.ravel(), minlength=count + 1)
        sizes[0] = 0
        if index == 5:
            if sizes.max(initial=0) >= 3000:
                raise ValueError("The reserved sixth cell contains a large connected object")
            records.append({"pose": index, "blank": True, "removedPixels": int(np.count_nonzero(cell[:, :, 3]))})
            continue
        if not sizes.size or int(sizes.max()) < 3000:
            raise ValueError(f"Pose {index} has no complete athlete component")
        owner = int(sizes.argmax())
        core = labels == owner
        distance = distance_transform_edt(~core)
        keep = core | ((cell[:, :, 3] > 0) & (distance <= 2))
        removed = int(np.count_nonzero((cell[:, :, 3] > 0) & ~keep))
        cell[~keep, 3] = 0
        ys, xs = np.nonzero(keep)
        left, right = max(0, int(xs.min()) - 1), min(cell.shape[1], int(xs.max()) + 2)
        top, bottom = max(0, int(ys.min()) - 1), min(cell.shape[0], int(ys.max()) + 2)
        crop = Image.fromarray(cell[top:bottom, left:right], "RGBA")
        scale = min(1.0, 442 / crop.width, 442 / crop.height)
        size = (max(1, round(crop.width * scale)), max(1, round(crop.height * scale)))
        if size != crop.size:
            crop = crop.resize(size, Image.Resampling.LANCZOS)
        clean_cell = np.zeros_like(cell)
        px = (clean_cell.shape[1] - crop.width) // 2
        py = (clean_cell.shape[0] - crop.height) // 2
        clean_cell[py:py + crop.height, px:px + crop.width] = np.asarray(crop)
        margins = {"left": px, "right": clean_cell.shape[1] - px - crop.width,
                   "top": py, "bottom": clean_cell.shape[0] - py - crop.height}
        if min(margins.values()) < 35:
            raise ValueError(f"Pose {index} needs >=35px clear cell margin; got {margins}")
        result[y0:y1, x0:x1] = clean_cell
        records.append({"pose": index, "corePixels": int(core.sum()), "removedOutsidePixels": removed,
                        "uniformScale": scale, "marginsPx": margins})
    Image.fromarray(result, "RGBA").save(OUT)
    print(f"Isolated five Marco pickup poses -> {OUT.relative_to(ROOT)}")
    print(records)


if __name__ == "__main__":
    main()
