#!/usr/bin/env python3
"""Measure and optionally preview a J.130 Briar layup source without editing it.

The report covers file identity, alpha bounds, cell margins, occupancy, and
connected alpha components. It cannot judge identity, anatomy, pose, palette,
sequence consistency, or ball alignment; those still require visual review.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import label


ROOT = Path(__file__).resolve().parents[2]
STRUCTURE_8 = np.ones((3, 3), dtype=np.uint8)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def alpha_metrics(alpha: np.ndarray, threshold: int) -> dict:
    mask = alpha >= threshold
    ys, xs = np.nonzero(mask)
    height, width = alpha.shape
    if not len(xs):
        return {
            "threshold": threshold,
            "pixelCount": 0,
            "boundsLTRBExclusive": None,
            "marginsLTRBpx": None,
            "figureWidthFraction": 0.0,
            "figureHeightFraction": 0.0,
            "edgeTouch": False,
            "componentCount8Connected": 0,
            "largestComponentPixels": 0,
            "nonLargestComponentPixels": 0,
        }

    bounds = [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]
    margins = [bounds[0], bounds[1], width - bounds[2], height - bounds[3]]
    labels, count = label(mask, structure=STRUCTURE_8)
    sizes = np.bincount(labels.ravel(), minlength=count + 1)
    sizes[0] = 0
    largest = int(sizes.max())
    return {
        "threshold": threshold,
        "pixelCount": int(mask.sum()),
        "boundsLTRBExclusive": bounds,
        "marginsLTRBpx": margins,
        "figureWidthFraction": round((bounds[2] - bounds[0]) / width, 6),
        "figureHeightFraction": round((bounds[3] - bounds[1]) / height, 6),
        "edgeTouch": any(margin == 0 for margin in margins),
        "componentCount8Connected": int(count),
        "largestComponentPixels": largest,
        "nonLargestComponentPixels": int(mask.sum()) - largest,
    }


def write_preview(image: Image.Image, output: Path) -> None:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    header = 32
    page = Image.new("RGB", (width * 2, height + header), "#dddddd")
    draw = ImageDraw.Draw(page)
    font = ImageFont.load_default()
    for column, (label_text, color) in enumerate(
        (("LIGHT BACKGROUND", "#f5f3ed"), ("DARK BACKGROUND", "#151923"))
    ):
        x = column * width
        panel = Image.new("RGBA", (width, height), color)
        panel.alpha_composite(rgba)
        page.paste(panel.convert("RGB"), (x, header))
        draw.text((x + 8, 9), label_text, font=font, fill="#222222" if column == 0 else "#eeeeee")
    output.parent.mkdir(parents=True, exist_ok=True)
    page.save(output, optimize=False)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="Generated PNG to measure; source is never modified")
    parser.add_argument("--preview", type=Path, help="Optional side-by-side light/dark composite PNG")
    args = parser.parse_args()

    source = args.source.resolve()
    with Image.open(source) as opened:
        original_mode = opened.mode
        has_alpha = original_mode in ("RGBA", "LA") or "transparency" in opened.info
        image = opened.convert("RGBA")
    rgba = np.asarray(image)
    alpha = rgba[:, :, 3]
    width, height = image.size
    report = {
        "asset": "J.130 Briar Foxglove layup source diagnostics",
        "source": str(source.relative_to(ROOT)) if source.is_relative_to(ROOT) else str(source),
        "sha256": digest(source),
        "originalMode": original_mode,
        "hasTransparencyChannelOrPaletteEntry": has_alpha,
        "dimensionsPx": [width, height],
        "alphaZeroPixelCount": int(np.count_nonzero(alpha == 0)),
        "alphaPositivePixelCount": int(np.count_nonzero(alpha > 0)),
        "thresholds": [alpha_metrics(alpha, threshold) for threshold in (1, 16, 64, 128)],
        "visualAcceptance": False,
        "limitation": "Metrics do not establish correct identity, anatomy, pose, palette, sequence fit, or ball alignment. No pixels were changed.",
    }
    if args.preview:
        preview = args.preview.resolve()
        write_preview(image, preview)
        report["lightDarkPreview"] = str(preview.relative_to(ROOT)) if preview.is_relative_to(ROOT) else str(preview)
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
