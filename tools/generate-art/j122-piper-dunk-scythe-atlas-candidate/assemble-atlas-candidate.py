#!/usr/bin/env python3
"""Rebuild Piper J.122 dunk-scythe atlas and its rejected comparison.

Lane-scale is the reviewed production layout; bbox-height is retained as a
rejected comparison because it enlarges the naturally tucked pose07. All pose
art is alpha-cropped and uniformly resized; no pose is drawn, mirrored,
duplicated, or synthesized.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / "tools/generate-art/j122-piper-dunk-scythe-atlas-candidate"
CELL_W, CELL_H, COLS, ROWS = 128, 96, 4, 4
BASELINE_Y = 87
MAX_W, MAX_H = 112, 80
THRESHOLD = 16

P00 = ROOT / "tools/generate-art/j122-piper-dunk-scythe-poses-00-04"
P05 = ROOT / "tools/generate-art/j122-piper-dunk-scythe-poses-05-09"
P10 = ROOT / "tools/generate-art/j122-piper-dunk-scythe-poses-10-14"

SOURCES = [
    P00 / f"layout-candidates-80px/pose-{i:02d}-layout90-v1.png" for i in range(5)
] + [
    P05 / "cleaned/pose05-attempt3-scaled.png",
    P05 / "cleaned/pose06-pose06-attempt2-scaled.png",
    P05 / "cleaned/pose07-attempt5-scaled.png",
    P05 / "cleaned/pose08-pose08-attempt2-scaled.png",
    P05 / "sources/pose09-attempt6-components-clean-scaled90.png",
] + [
    P10 / f"sources/pose-{i:02d}-attempt{'2' if i == 13 else '1'}-components-clean.png"
    for i in range(10, 15)
]

RAW_AND_PROMPT = []
for i in range(5):
    record = json.loads((P00 / f"pose-{i:02d}-provenance.json").read_text())
    RAW_AND_PROMPT.append((record["rawSource"], record["rawSha256"], record["promptFile"], record["promptSha256"]))
for i, attempt in [(5, 3), (6, 2), (7, 5), (8, 2), (9, 6)]:
    name = f"pose{i if i == 9 else f'{i:02d}'}-attempt{attempt}-provenance.json"
    record = json.loads((P05 / name).read_text())
    prompt_file = record["promptFile"]
    prompt_hash = record.get("promptSha256") or hashlib.sha256((ROOT / prompt_file).read_bytes()).hexdigest()
    RAW_AND_PROMPT.append((record["rawSource"], record.get("rawSourceSha256", record.get("rawSha256")), prompt_file, prompt_hash))
for i in range(10, 15):
    attempt = 2 if i == 13 else 1
    record = json.loads((P10 / f"pose-{i:02d}-attempt{attempt}-layout.json").read_text())
    cleanup = record["cleanupRecord"]
    prompt_file = f"tools/generate-art/j122-piper-dunk-scythe-poses-10-14/pose-{i:02d}-prompt{'-attempt2' if i == 13 else ''}.md"
    prompt_sha = hashlib.sha256((ROOT / prompt_file).read_bytes()).hexdigest()
    RAW_AND_PROMPT.append((cleanup["rawSource"], cleanup["rawSourceSha256"], prompt_file, prompt_sha))

assert len(SOURCES) == 15 and len(RAW_AND_PROMPT) == 15


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def alpha_bbox(image: Image.Image, threshold: int = THRESHOLD):
    mask = image.getchannel("A").point(lambda value: 255 if value > threshold else 0)
    return mask.getbbox()


def resize_premultiplied_rgba(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    """Lanczos-resize unassociated RGBA without transparent-RGB color bleed."""
    rgba = np.asarray(image.convert("RGBA"), dtype=np.float32)
    alpha = rgba[:, :, 3] / 255.0
    premultiplied = rgba[:, :, :3] * alpha[:, :, None]
    alpha_image = Image.fromarray(alpha, mode="F").resize(size, Image.Resampling.LANCZOS)
    resized_alpha = np.clip(np.asarray(alpha_image, dtype=np.float32), 0.0, 1.0)
    channels = []
    for channel in range(3):
        channel_image = Image.fromarray(premultiplied[:, :, channel], mode="F")
        resized_premultiplied = np.asarray(channel_image.resize(size, Image.Resampling.LANCZOS), dtype=np.float32)
        channels.append(np.divide(resized_premultiplied, resized_alpha, out=np.zeros_like(resized_alpha), where=resized_alpha > (1 / 255)))
    rgb = np.stack(channels, axis=2)
    rgb = np.clip(rgb, 0.0, 255.0)
    out = np.empty((size[1], size[0], 4), dtype=np.uint8)
    out[:, :, :3] = np.rint(rgb).astype(np.uint8)
    out[:, :, 3] = np.rint(resized_alpha * 255.0).astype(np.uint8)
    out[out[:, :, 3] == 0, :3] = 0
    return Image.fromarray(out, mode="RGBA")


def source_records():
    records = []
    for pose, (path, provenance) in enumerate(zip(SOURCES, RAW_AND_PROMPT)):
        if not path.is_file():
            raise FileNotFoundError(path)
        raw, raw_hash, prompt, prompt_hash = provenance
        if not raw_hash or not (ROOT / raw).is_file():
            raise FileNotFoundError(f"Missing source/provenance raw image for pose {pose}: {raw}")
        if sha(ROOT / raw) != raw_hash:
            raise ValueError(f"Raw image hash mismatch for pose {pose}: {raw}")
        if not (ROOT / prompt).is_file() or sha(ROOT / prompt) != prompt_hash:
            raise ValueError(f"Prompt hash mismatch for pose {pose}: {prompt}")
        image = Image.open(path).convert("RGBA")
        box = alpha_bbox(image)
        if box is None:
            raise ValueError(f"Pose {pose} has no visible alpha: {path}")
        records.append({
            "pose": pose,
            "source": str(path.relative_to(ROOT)),
            "sourceSha256": sha(path),
            "sourceCanvasPx": list(image.size),
            "alphaCropThreshold": THRESHOLD,
            "alphaCropLTRB": list(box),
            "alphaCropPx": [box[2] - box[0], box[3] - box[1]],
            "rawSource": raw,
            "rawSourceSha256": raw_hash,
            "promptFile": prompt,
            "promptSha256": prompt_hash,
        })
    return records


def make_layout(records, mode: str, lane_scales: dict[int, float] | None = None):
    atlas = Image.new("RGBA", (CELL_W * COLS, CELL_H * ROWS), (0, 0, 0, 0))
    packed = []
    for rec in records:
        pose = rec["pose"]
        source = Image.open(ROOT / rec["source"]).convert("RGBA")
        crop = source.crop(tuple(rec["alphaCropLTRB"]))
        if mode == "bbox-height":
            desired = min(MAX_H / crop.height, MAX_W / crop.width)
        elif mode == "lane-scale":
            assert lane_scales is not None
            desired = lane_scales[pose]
            desired = min(desired, MAX_H / crop.height, MAX_W / crop.width)
        else:
            raise ValueError(mode)

        w = max(1, round(crop.width * desired))
        h = max(1, round(crop.height * desired))
        # Correct rounding so a figure never violates the transparent cell bounds.
        if w > MAX_W or h > MAX_H:
            desired = min(MAX_W / crop.width, MAX_H / crop.height)
            w, h = max(1, round(crop.width * desired)), max(1, round(crop.height * desired))
        figure = resize_premultiplied_rgba(crop, (w, h))
        col, row = pose % COLS, pose // COLS
        cell_x, cell_y = col * CELL_W, row * CELL_H
        x = (CELL_W - w) // 2
        y = BASELINE_Y - h
        if y < 3 or x < 5 or x + w > CELL_W - 5:
            raise ValueError(f"Pose {pose} does not fit safely in its cell: {w}x{h}")
        cell = Image.new("RGBA", (CELL_W, CELL_H), (0, 0, 0, 0))
        cell.alpha_composite(figure, (x, y))
        atlas.alpha_composite(cell, (cell_x, cell_y))
        packed.append({
            **rec,
            "uniformScale": round(w / crop.width, 8),
            "outputFigurePx": [w, h],
            "destinationCellXYWH": [cell_x, cell_y, CELL_W, CELL_H],
            "figurePlacementInCellXY": [x, y],
            "baselineYInCell": BASELINE_Y,
            "cellMarginsLTRBpx": [x, y, CELL_W - x - w, CELL_H - y - h],
            "cellPixelSha256": hashlib.sha256(cell.tobytes()).hexdigest(),
        })

    frame_hashes = [item["cellPixelSha256"] for item in packed]
    if len(set(frame_hashes)) != 15:
        raise ValueError("Candidate atlas contains duplicate rendered cell pixels")

    stem = f"atlas-{mode}"
    png = OUT / f"{stem}.png"
    webp = OUT / f"{stem}.webp"
    atlas.save(png)
    atlas.save(webp, "WEBP", lossless=True, method=6)
    layout = {
        "athlete": "piper-quickstep",
        "issue": "J.122",
        "clip": "dunk-scythe",
        "status": ("accepted-production-layout" if mode == "lane-scale" else "rejected-comparison-only"),
        "reviewers": (["independent full-sequence reviewer", "Codex parent"] if mode == "lane-scale" else []),
        "reviewDisposition": ("Native-size anatomy and complete-sequence review accepted the visual lane scales at standard runtime size. Pose07 remains naturally compact; fixed alpha-bbox height normalization enlarged its head and torso and was rejected." if mode == "lane-scale" else "Rejected in visual comparison: fixed alpha-bbox height normalization enlarged tucked pose07 by about 29%, swelling its head and torso relative to poses06 and08."),
        "mode": mode,
        "scaleMethodDetails": (
            "Reviewed production layout. Lane-scale applies one shared scale within poses00-04, one within poses05-08, a fit-capped scale to pose09, and one within poses10-14. Native runtime-size and sequence review accepted these visual factors. Pose07 remains naturally compact; bbox-height normalization was rejected because it enlarged its head and torso."
            if mode == "lane-scale" else
            "Common crop-height fit for comparison only. This visibly enlarges compact pose07 and is not the preferred anatomy-scale candidate."
        ),
        "acceptedVisualLaneScales": ({"poses00-04": 0.095, "poses05-08": 0.105, "pose09": 0.074, "poses10-14": 0.085} if mode == "lane-scale" else None),
        "atlas": str(png.relative_to(ROOT)),
        "atlasSha256": sha(png),
        "webp": str(webp.relative_to(ROOT)),
        "webpSha256": sha(webp),
        "atlasPx": list(atlas.size),
        "grid": [COLS, ROWS],
        "cellPx": [CELL_W, CELL_H],
        "sequenceOrder": list(range(15)),
        "uniqueFramePixelHashes": frame_hashes,
        "alphaCropThreshold": THRESHOLD,
        "resize": "Uniform Lanczos downscale after alpha crop, using premultiplied-alpha RGB to prevent transparent exterior RGB bleed; no pose is drawn, duplicated, mirrored, interpolated, or synthetically reconstructed.",
        "baseline": f"Every cell uses feet baseline y={BASELINE_Y}; transparent top/bottom and side padding remain in each cell.",
        "sourceRecords": packed,
    }
    layout_path = OUT / f"{stem}-layout.json"
    layout_path.write_text(json.dumps(layout, indent=2) + "\n")
    write_proofs(atlas, stem)
    return layout


def write_proofs(atlas: Image.Image, stem: str):
    font = ImageFont.load_default()
    for suffix, bg in [("light", (245, 244, 239, 255)), ("dark", (23, 24, 38, 255))]:
        proof = Image.new("RGBA", atlas.size, bg)
        proof.alpha_composite(atlas)
        draw = ImageDraw.Draw(proof)
        for pose in range(15):
            x, y = pose % COLS * CELL_W, pose // COLS * CELL_H
            draw.rectangle((x, y, x + CELL_W - 1, y + CELL_H - 1), outline=(150, 150, 155, 120), width=1)
            draw.text((x + 2, y + CELL_H - 10), f"{pose:02d}", fill=(20, 20, 22, 255) if suffix == "light" else (240, 240, 244, 255), font=font)
        proof.save(OUT / f"{stem}-proof-{suffix}.png")

        # 3x nearest-neighbor upscale of transparent sprite cells for native cell inspection.
        native = Image.new("RGBA", (CELL_W * COLS * 3, CELL_H * ROWS * 3), bg)
        enlarged = atlas.resize((atlas.width * 3, atlas.height * 3), Image.Resampling.NEAREST)
        native.alpha_composite(enlarged)
        d = ImageDraw.Draw(native)
        for pose in range(15):
            x, y = pose % COLS * CELL_W * 3, pose // COLS * CELL_H * 3
            d.rectangle((x, y, x + CELL_W * 3 - 1, y + CELL_H * 3 - 1), outline=(150, 150, 155, 160), width=2)
            d.text((x + 6, y + CELL_H * 3 - 32), f"pose {pose:02d}", fill=(20, 20, 22, 255) if suffix == "light" else (240, 240, 244, 255), font=font)
        native.save(OUT / f"{stem}-native-cells-{suffix}.png")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    records = source_records()
    # Candidate A reproduces common packer behavior. Candidate B keeps the same
    # figure scale within generation lanes. The tuck in pose07 stays compact.
    lane_scales = {}
    for pose in range(0, 5):
        lane_scales[pose] = 0.095
    for pose in range(5, 9):
        lane_scales[pose] = 0.105
    lane_scales[9] = 0.074
    for pose in range(10, 15):
        lane_scales[pose] = 0.085
    make_layout(records, "bbox-height")
    make_layout(records, "lane-scale", lane_scales)
    (OUT / "README.md").write_text("""# J.122 Piper dunk-scythe atlas candidates\n\nThese are review-only layout candidates assembled from the currently selected individual pose sources. `atlas-bbox-height` demonstrates the standard common-alpha-height packer behavior; it enlarges tucked pose07 and is retained only for comparison. `atlas-lane-scale` preserves each source lane's within-lane scale, keeping pose07's compact tuck. Its inter-lane factors are provisional visual estimates, not final anatomical calibration.\n\nBoth scripts use the same transparent 4x4 grid of 128x96 cells, alpha crop threshold 16, 80px height and 112px width caps, x-centered figures, and y=87 baseline. The resulting cell silhouettes have at least 8px side margins, 7px top margin, and 9px bottom margin before the unused sixteenth cell. The complete source, raw-image, prompt, and output byte hashes plus per-pose crop/scale/cell metadata are in the JSON layout files. No ball is included. No pose was redrawn, duplicated, mirrored, or synthesized.\n\nNeither atlas is production accepted. The PNG/WebP and light/dark, 3x native-cell proofs exist only to support visual review and further scale adjustment.\n""")
    print(f"Wrote two review-only atlas layouts for {len(records)} unique poses to {OUT}")


if __name__ == "__main__":
    main()
