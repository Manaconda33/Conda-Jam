#!/usr/bin/env python3
"""Create reproducible cleanup candidates for Briar J.130 layup frames 0–1.

This operation preserves source pose pixels, removes disconnected faint residue,
performs uniform premultiplied-alpha scale normalization, and centers each
figure on a transparent square. It does not draw or alter anatomy.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
ART = ROOT / "tools/generate-art"
OUT = ART / "candidates/j130-briar-foxglove-layup-poses01-cleanup-retry1"
SIZE = 1254
TARGET_FRACTION = 0.65
DILATION_SIZE = 9  # 4 pixels around alpha>=64 core in each direction.


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def threshold_metrics(image: Image.Image) -> dict[str, dict]:
    alpha = image.getchannel("A")
    results = {}
    for threshold in (1, 8, 32, 64, 128, 250):
        binary = alpha.point(lambda value: 255 if value >= threshold else 0)
        box = binary.getbbox()
        if box is None:
            raise ValueError(f"No pixels at alpha threshold {threshold}")
        left, top, right, bottom = box
        results[str(threshold)] = {
            "bbox_xyxy_exclusive": list(box),
            "margins_ltrb": [left, top, SIZE - right, SIZE - bottom],
            "max_occupancy_fraction": round(
                max((right - left) / SIZE, (bottom - top) / SIZE), 6
            ),
        }
    return results


def clean_frame(frame: int) -> dict:
    source = ART / f"sources/j130-briar-foxglove-layup-attempt2-pose{frame}-retry1-raw.png"
    source_image = Image.open(source).convert("RGBA")
    core = source_image.getchannel("A").point(lambda value: 255 if value >= 64 else 0)
    keep = core.filter(ImageFilter.MaxFilter(DILATION_SIZE))
    rgba = source_image.copy()
    alpha = source_image.getchannel("A")
    alpha_data = alpha.load()
    keep_data = keep.load()
    rgba_data = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, a = rgba_data[x, y]
            if not keep_data[x, y]:
                rgba_data[x, y] = (0, 0, 0, 0)
            elif a == 0:
                rgba_data[x, y] = (0, 0, 0, 0)
    box = rgba.getchannel("A").getbbox()
    if box is None:
        raise ValueError(f"Frame {frame}: cleanup removed all pixels")
    crop = rgba.crop(box)
    scale = min(round(SIZE * TARGET_FRACTION) / crop.width,
                round(SIZE * TARGET_FRACTION) / crop.height)
    resized_size = (round(crop.width * scale), round(crop.height * scale))
    scaled = crop.convert("RGBa").resize(resized_size, Image.Resampling.LANCZOS).convert("RGBA")
    canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    offset = ((SIZE - resized_size[0]) // 2, (SIZE - resized_size[1]) // 2)
    canvas.alpha_composite(scaled, offset)

    output = OUT / f"j130-briar-foxglove-layup-pose{frame}-cleanup-candidate.png"
    canvas.save(output, optimize=True)
    return {
        "frame": frame,
        "source_path": str(source.relative_to(ROOT)),
        "source_sha256": sha256(source),
        "candidate_path": str(output.relative_to(ROOT)),
        "candidate_sha256": sha256(output),
        "candidate_dimensions": [SIZE, SIZE],
        "crop_bbox_xyxy_exclusive": list(box),
        "source_crop_size": [crop.width, crop.height],
        "uniform_scale_factor": round(scale, 8),
        "resized_size": list(resized_size),
        "canvas_offset_xy": list(offset),
        "cleanup": (
            "Keep original source RGBA pixels within square MaxFilter(9) dilation "
            "of source alpha>=64; outside that mask set alpha=0. No drawing or "
            "reconstruction. Uniform Lanczos resize in premultiplied RGBA, centered "
            "on a 1254-square transparent canvas."
        ),
        "threshold_metrics": threshold_metrics(canvas),
    }


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    frames = [clean_frame(frame) for frame in (0, 1)]
    proof = Image.new("RGBA", (2 * SIZE, 2 * SIZE), (245, 245, 245, 255))
    for index, frame in enumerate(frames):
        candidate = Image.open(ROOT / frame["candidate_path"]).convert("RGBA")
        light = Image.new("RGBA", (SIZE, SIZE), (248, 248, 248, 255))
        light.alpha_composite(candidate)
        dark = Image.new("RGBA", (SIZE, SIZE), (32, 32, 32, 255))
        dark.alpha_composite(candidate)
        proof.alpha_composite(light, (index * SIZE, 0))
        proof.alpha_composite(dark, (index * SIZE, SIZE))
    preview = OUT / "j130-briar-foxglove-layup-poses01-cleanup-candidate-light-dark-preview.jpg"
    proof.convert("RGB").resize((1000, 1000), Image.Resampling.LANCZOS).save(preview, quality=94)
    metadata = {
        "task": "J.130",
        "character": "briar-foxglove",
        "animation": "layup",
        "candidate_status": "unreviewed_cleanup_candidate_not_accepted",
        "source_prompts": [
            f"tools/generate-art/j130-briar-foxglove-layup-attempt2-pose{f}-retry1-prompt.md"
            for f in (0, 1)
        ],
        "source_provenance": [
            f"tools/generate-art/j130-briar-foxglove-layup-attempt2-pose{f}-retry1-provenance.json"
            for f in (0, 1)
        ],
        "reference_paths": [
            "public/assets/animation/briar-foxglove-shoot-right.webp",
            "public/assets/animation/briar-foxglove-receive-right.webp",
            "public/assets/animation/briar-foxglove-idle-right.webp",
        ],
        "preview_path": str(preview.relative_to(ROOT)),
        "frames": frames,
    }
    (OUT / "review-metadata.json").write_text(json.dumps(metadata, indent=2) + "\n")


if __name__ == "__main__":
    main()
