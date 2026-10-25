#!/usr/bin/env python3
"""Conservatively isolate Briar J.130 layup frames 5–7 retry1 candidates.

Keeps the largest 8-connected component of original nonzero-alpha pixels in
each generated pose. The original RGBA samples in that component are retained
unchanged, except frame 5 is uniformly reduced by the minimum amount needed to
place the complete nonzero-alpha figure inside 20% transparent margins. No
pose content is drawn, synthesized, mirrored, duplicated, or reordered.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import label

ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = ROOT / "tools/generate-art/sources"
PREVIEW_DIR = ROOT / "tools/generate-art/previews/j130-briar-foxglove-layup"
FRAMES = (5, 6, 7)
SIZE = (1254, 1254)
MARGIN_FRACTION = 0.20


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def bounds(mask: np.ndarray) -> list[int] | None:
    y, x = np.nonzero(mask)
    if not len(x):
        return None
    return [int(x.min()), int(y.min()), int(x.max()) + 1, int(y.max()) + 1]


def margins(box: list[int], width: int, height: int) -> list[int]:
    left, top, right, bottom = box
    return [left, top, width - right, height - bottom]


def clean(frame: int) -> tuple[Image.Image, dict]:
    stem = f"j130-briar-foxglove-layup-attempt2-pose{frame}-retry1"
    source = SOURCE_DIR / f"{stem}-raw.png"
    target = SOURCE_DIR / f"{stem}-clean-candidate.png"
    rgba = Image.open(source).convert("RGBA")
    if rgba.size != SIZE:
        raise ValueError(f"Unexpected dimensions for frame {frame}: {rgba.size}")
    source_pixels = np.asarray(rgba)
    alpha = source_pixels[:, :, 3]
    labels, count = label(alpha > 0, structure=np.ones((3, 3), dtype=np.uint8))
    sizes = np.bincount(labels.ravel(), minlength=count + 1)
    sizes[0] = 0
    main_label = int(np.argmax(sizes))
    main_mask = labels == main_label
    source_box = bounds(main_mask)
    assert source_box is not None
    crop = rgba.crop((source_box[0], source_box[1], source_box[2], source_box[3]))

    # Keep accepted scale when possible. For frame 5, shrink by the smallest
    # uniform factor that puts every surviving nonzero-alpha pixel >=20% from
    # all four cell edges. Center placement makes both opposing margins equal.
    max_w = int(np.floor(SIZE[0] * (1 - 2 * MARGIN_FRACTION)))
    max_h = int(np.floor(SIZE[1] * (1 - 2 * MARGIN_FRACTION)))
    scale = min(1.0, max_w / crop.width, max_h / crop.height)
    if scale < 1.0:
        new_size = (max(1, int(np.floor(crop.width * scale))),
                    max(1, int(np.floor(crop.height * scale))))
        crop = crop.resize(new_size, Image.Resampling.LANCZOS)
    else:
        new_size = crop.size

    output = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    x = (SIZE[0] - crop.width) // 2
    y = (SIZE[1] - crop.height) // 2
    output.alpha_composite(crop, (x, y))
    output.save(target, optimize=False)
    out_a = np.asarray(output)[:, :, 3]
    out_box = bounds(out_a > 0)
    assert out_box is not None

    unique, counts = np.unique(labels, return_counts=True)
    discarded = [(int(lab), int(n)) for lab, n in zip(unique, counts)
                 if lab != 0 and lab != main_label]
    high = label(alpha >= 64, structure=np.ones((3, 3), dtype=np.uint8))[0]
    high_main = int(np.bincount(high.ravel())[1:].argmax() + 1)
    record = {
        "frame": frame,
        "source": str(source.relative_to(ROOT)),
        "sourceSha256": sha256(source),
        "candidate": str(target.relative_to(ROOT)),
        "candidateSha256": sha256(target),
        "dimensions": list(SIZE),
        "componentRule": "8-connected components over alpha > 0; preserve every original RGBA pixel in the largest component and clear alpha outside it",
        "sourceMainComponentPixels": int(sizes[main_label]),
        "sourceOtherNonzeroComponents": len(discarded),
        "discardedNonzeroComponentPixels": sum(n for _, n in discarded),
        "sourceAlphaGte64Components": int(high.max()),
        "sourceAlphaGte64LargestComponentPixels": int(np.bincount(high.ravel())[high_main]),
        "sourceMainBoundsLTRBExclusive": source_box,
        "uniformScale": float(scale),
        "resizedFigureCrop": list(new_size),
        "candidateBoundsLTRBExclusive": out_box,
        "candidateMarginsLTRB": margins(out_box, *SIZE),
        "requiredMinimumMarginPixels": int(np.ceil(SIZE[0] * MARGIN_FRACTION)),
        "visualAcceptance": False,
        "status": "cleanup candidate only; full sequence/native review required",
    }
    if min(record["candidateMarginsLTRB"]) < record["requiredMinimumMarginPixels"]:
        raise ValueError(f"Frame {frame} did not achieve required margins: {record}")
    return output, record


def make_preview(images: list[tuple[int, Image.Image]]) -> Path:
    gap = 24
    label_h = 32
    width = len(images) * SIZE[0] * 2 + (len(images) - 1) * gap
    height = SIZE[1] + label_h
    page = Image.new("RGB", (width, height), "#f5f3ed")
    draw = ImageDraw.Draw(page)
    font = ImageFont.load_default()
    x = 0
    for frame, image in images:
        light = Image.new("RGBA", SIZE, "#f5f3ed")
        light.alpha_composite(image)
        dark = Image.new("RGBA", SIZE, "#151923")
        dark.alpha_composite(image)
        page.paste(light.convert("RGB"), (x, label_h))
        draw.text((x + 8, 8), f"Frame {frame} light", fill="#222222", font=font)
        x += SIZE[0]
        page.paste(dark.convert("RGB"), (x, label_h))
        draw.text((x + 8, 8), f"Frame {frame} dark", fill="#222222", font=font)
        x += SIZE[0] + gap
    target = PREVIEW_DIR / "attempt2-poses5-7-retry1-clean-candidate-light-dark.png"
    target.parent.mkdir(parents=True, exist_ok=True)
    page.save(target, optimize=False)
    return target


def main() -> None:
    outputs = []
    records = []
    for frame in FRAMES:
        image, record = clean(frame)
        outputs.append((frame, image))
        records.append(record)
    preview = make_preview(outputs)
    provenance = {
        "issue": "J.130",
        "athlete": "briar-foxglove",
        "clip": "layup",
        "attempt": 2,
        "retry": 1,
        "operation": "non-destructive component isolation and uniform scale/placement",
        "script": str(Path(__file__).relative_to(ROOT)),
        "preview": str(preview.relative_to(ROOT)),
        "frames": records,
        "limitations": "These are cleanup candidates, not accepted production poses or a packed sheet. Review anatomy, identity, margins and pose separation in full-sequence context before any registration.",
    }
    dest = ROOT / "tools/generate-art/j130-briar-foxglove-layup-attempt2-poses5-7-retry1-clean-candidate.json"
    dest.write_text(json.dumps(provenance, indent=2) + "\n")
    print(f"Wrote cleanup candidates and {dest.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
