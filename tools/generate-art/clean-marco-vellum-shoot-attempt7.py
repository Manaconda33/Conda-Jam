#!/usr/bin/env python3
"""Extract and uniformly fit the ten existing attempt7 poses; never redraw them."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "sources/marco-vellum-shoot-attempt7-generated-rejected.png"
OUTPUT = ROOT / "sources/marco-vellum-shoot-attempt7-clean-candidate-v2.png"
PREVIEW_DARK = ROOT / "previews/marco-vellum-shoot/attempt7-clean-v2-dark.png"
PREVIEW_LIGHT = ROOT / "previews/marco-vellum-shoot/attempt7-clean-v2-light.png"
RECORD = ROOT / "marco-vellum-shoot-attempt7-cleanup-v2.json"

CANVAS_W, CANVAS_H = 1536, 1024
COLS, ROWS = 5, 2
CELL_H = CANVAS_H // ROWS
SCALE = 0.65
CORE_ALPHA = 64
ANTIALIAS_FRINGE = 2
SAFE_X, SAFE_Y = 41, 106


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def cell_bounds(col: int, row: int) -> tuple[int, int, int, int]:
    left = round(col * CANVAS_W / COLS)
    right = round((col + 1) * CANVAS_W / COLS)
    top = row * CELL_H
    return left, top, right, top + CELL_H


def cut_pose(source: Image.Image, bounds: tuple[int, int, int, int]):
    x0, y0, x1, y1 = bounds
    rgba = np.asarray(source.crop(bounds).convert("RGBA"))
    core = rgba[:, :, 3] >= CORE_ALPHA
    labels, count = ndimage.label(core)
    sizes = np.bincount(labels.ravel())
    if len(sizes) <= 1 or not sizes[1:].any():
        raise ValueError(f"No athlete pixels found in cell {bounds}")
    sizes[0] = 0
    largest = int(sizes.argmax())
    if count != 1:
        raise ValueError(f"Expected one connected athlete per cell; found {count} in {bounds}")
    component = labels == largest
    ys, xs = np.where(component)
    left, right = int(xs.min()), int(xs.max()) + 1
    top, bottom = int(ys.min()), int(ys.max()) + 1
    dilated = ndimage.binary_dilation(component, iterations=ANTIALIAS_FRINGE)
    selected = rgba.copy()
    selected[~dilated] = 0
    crop = Image.fromarray(selected[top - ANTIALIAS_FRINGE:bottom + ANTIALIAS_FRINGE,
                                    left - ANTIALIAS_FRINGE:right + ANTIALIAS_FRINGE])
    w, h = crop.size
    out_w, out_h = round(w * SCALE), round(h * SCALE)
    if out_w > CANVAS_W / COLS - SAFE_X * 2 or out_h > CELL_H - SAFE_Y * 2:
        raise ValueError(f"Pose exceeds safe bounds after scaling: {out_w}x{out_h}")
    crop = crop.resize((out_w, out_h), Image.Resampling.LANCZOS)
    return crop, (x0 + left, y0 + top, x0 + right, y0 + bottom), int(component.sum())


def make_preview(source: Image.Image, destination: Path, background: tuple[int, int, int]):
    bg = Image.new("RGB", source.size, background)
    bg.paste(source, mask=source.getchannel("A"))
    grid = ImageDraw.Draw(bg)
    for col in range(COLS + 1):
        x = round(col * CANVAS_W / COLS)
        grid.line((x, 0, x, CANVAS_H), fill=(180, 0, 180), width=1)
    for row in range(ROWS + 1):
        y = row * CELL_H
        grid.line((0, y, CANVAS_W, y), fill=(180, 0, 180), width=1)
    destination.parent.mkdir(parents=True, exist_ok=True)
    bg.save(destination)


def main():
    source = Image.open(SOURCE).convert("RGBA")
    if source.size != (CANVAS_W, CANVAS_H):
        raise ValueError(f"Expected {CANVAS_W}x{CANVAS_H}; got {source.size}")
    output = Image.new("RGBA", source.size, (0, 0, 0, 0))
    rows = []
    for row in range(ROWS):
        for col in range(COLS):
            index = row * COLS + col
            bounds = cell_bounds(col, row)
            pose, source_bounds, core_pixels = cut_pose(source, bounds)
            cell_w = bounds[2] - bounds[0]
            target_x = bounds[0] + (cell_w - pose.width) // 2
            target_y = bounds[1] + (CELL_H - pose.height) // 2
            output.alpha_composite(pose, (target_x, target_y))
            cell_alpha = np.asarray(output.crop(bounds).getchannel("A"))
            alpha = cell_alpha
            py, px = np.where(alpha > 0)
            margins = [int(px.min()), int(cell_w - 1 - px.max()),
                       int(py.min()), int(CELL_H - 1 - py.max())]
            if min(margins[:2]) < SAFE_X or min(margins[2:]) < SAFE_Y:
                raise ValueError(f"Unsafe packed cleanup margins in pose {index}: {margins}")
            rows.append({
                "index": index,
                "sourceCell": list(bounds),
                "sourceBoundsAlphaGte64": list(source_bounds),
                "sourceCorePixels": core_pixels,
                "uniformScale": SCALE,
                "outputSize": [pose.width, pose.height],
                "outputMarginsLeftRightTopBottom": margins,
                "connectedComponentsAtAlpha64": 1,
            })
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    output.save(OUTPUT)
    make_preview(output, PREVIEW_DARK, (30, 32, 42))
    make_preview(output, PREVIEW_LIGHT, (238, 236, 228))
    RECORD.write_text(json.dumps({
        "source": str(SOURCE.relative_to(ROOT)),
        "sourceSha256": sha256(SOURCE),
        "output": str(OUTPUT.relative_to(ROOT)),
        "outputSha256": sha256(OUTPUT),
        "method": f"Within each original cell isolate its sole 4-connected alpha>={CORE_ALPHA} component; retain original RGBA only within a {ANTIALIAS_FRINGE}px dilation of that component; uniformly resize all ten complete poses by {SCALE:.2f} and center. No pose pixels are drawn, synthesized, or rearranged.",
        "thresholdAlpha": CORE_ALPHA,
        "antialiasFringePixels": ANTIALIAS_FRINGE,
        "uniformScale": SCALE,
        "requiredMinimumMarginsLeftRightTopBottom": [SAFE_X, SAFE_X, SAFE_Y, SAFE_Y],
        "poses": rows,
        "previews": [str(PREVIEW_DARK.relative_to(ROOT)), str(PREVIEW_LIGHT.relative_to(ROOT))],
    }, indent=2) + "\n")
    print(f"Wrote {OUTPUT.relative_to(ROOT)}; sha256={sha256(OUTPUT)}")


if __name__ == "__main__":
    main()
