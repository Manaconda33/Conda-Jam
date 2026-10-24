"""Deterministically assemble Keeg's reviewed dunk-scythe pose components.

The cell images are nearest-neighbor reductions of original alpha crops; no
poses are drawn, duplicated, mirrored, or interpolated. The atlas and track
have passed individual cell and native-render review.
"""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCES = ROOT / "tools/generate-art/sources"
PNG = SOURCES / "j105-keeg-dunk-scythe-atlas.png"
WEBP = ROOT / "public/assets/animation/keeg-dunk-scythe-right.webp"
LAYOUT = ROOT / "tools/generate-art/j105-keeg-dunk-scythe-layout.json"
CELL_W, CELL_H, COLS, ROWS = 128, 96, 5, 3
atlas = Image.new("RGBA", (CELL_W * COLS, CELL_H * ROWS), (0, 0, 0, 0))
frames = []
source_records = []

for index in range(COLS * ROWS):
    source = SOURCES / f"j105-keeg-dunk-scythe-pose-{index:02d}-attempt-01.png"
    if not source.exists():
        source = SOURCES / f"j105-keeg-dunk-scythe-pose-{index:02d}-attempt-02.png"
    if index == 9:
        source = SOURCES / "j105-keeg-dunk-scythe-pose-09-attempt-03.png"
    if not source.is_file():
        raise FileNotFoundError(source)

    original = Image.open(source).convert("RGBA")
    mask = original.getchannel("A").point(lambda value: 255 if value > 16 else 0)
    crop_box = mask.getbbox()
    if crop_box is None:
        raise ValueError(f"No visible figure in {source}")
    figure = original.crop(crop_box)
    width = round(figure.width * 90 / figure.height)
    figure = figure.resize((width, 90), Image.Resampling.NEAREST)
    cell = Image.new("RGBA", (CELL_W, CELL_H), (0, 0, 0, 0))
    cell.alpha_composite(figure, ((CELL_W - width) // 2, 5))

    col, row = index % COLS, index // COLS
    x, y = col * CELL_W, row * CELL_H
    atlas.alpha_composite(cell, (x, y))
    frames.append({"x": x, "y": y, "w": CELL_W, "h": CELL_H})
    source_records.append({"poseIndex": index, "source": str(source.relative_to(ROOT)), "cropThreshold": 16, "cropBox": crop_box, "figureSize": [width, 90], "cell": [x, y, CELL_W, CELL_H]})

PNG.parent.mkdir(parents=True, exist_ok=True)
atlas.save(PNG)
atlas.save(WEBP, "WEBP", lossless=True, method=6)
layout = {
    "athlete": "keeg",
    "direction": "right",
    "clip": "dunk-scythe",
    "src": "./public/assets/animation/keeg-dunk-scythe-right.webp",
    "columns": COLS,
    "rows": ROWS,
    "frames": frames,
    "provenance": {
        "status": "accepted source; native-render ball-track review passed",
        "promptAndSourceManifest": "tools/generate-art/j105-keeg-dunk-scythe-provenance.json",
        "assemblyScript": "tools/generate-art/assemble-keeg-dunk-scythe.py",
        "cellSize": [CELL_W, CELL_H],
        "figureHeight": 90,
        "sequenceOrder": list(range(15)),
        "operation": "Tight alpha crop at threshold16; uniformly nearest-neighbor resize to 90px figure height; center in transparent 128x96 cell with baseline y95; pack row-major. No pose was drawn, duplicated, mirrored or interpolated.",
        "sourceRecords": source_records,
        "cleanup": "No source pixels altered apart from tight alpha cropping and nearest-neighbor uniform resize. Cell backgrounds and gutters remain transparent.",
        "ballTrack": "The Keeg-specific separate track is in the provenance JSON and src/core/animation.js. Native previews confirm contact through tick20 and rim resolution at pose10/tick21 in both facings."
    }
}
LAYOUT.write_text(json.dumps(layout, indent=2, ensure_ascii=False) + "\n")
print(f"Accepted atlas {atlas.width}x{atlas.height}; 15 reviewed alpha-cropped poses; wrote PNG, lossless WebP, and layout.")
