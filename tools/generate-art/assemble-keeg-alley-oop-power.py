"""Assemble Keeg's independently generated, reviewed alley-oop pose sources.

This script only alpha-crops, nearest-neighbor scales, and packs accepted
drawings. It never draws, duplicates, mirrors, or interpolates a pose.
"""
import hashlib
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
PROVENANCE = ROOT / "tools/generate-art/j106-keeg-alley-oop-power-provenance.json"
SOURCE_ROOT = ROOT / "tools/generate-art/sources"
PNG = SOURCE_ROOT / "j106-keeg-alley-oop-power-atlas.png"
WEBP = ROOT / "public/assets/animation/keeg-alley-oop-power-right.webp"
LAYOUT = ROOT / "tools/generate-art/j106-keeg-alley-oop-power-layout.json"
CELL_W, CELL_H, COLS, ROWS = 128, 96, 5, 3

ledger = json.loads(PROVENANCE.read_text())
poses = sorted(ledger["poses"], key=lambda pose: pose["index"])
if [pose["index"] for pose in poses] != list(range(15)):
    raise ValueError("Expected exactly the fifteen reviewed source poses in order")

atlas = Image.new("RGBA", (CELL_W * COLS, CELL_H * ROWS), (0, 0, 0, 0))
frames, source_records, cell_hashes = [], [], []
for pose in poses:
    source = ROOT / pose["source"]
    if hashlib.sha256(source.read_bytes()).hexdigest() != pose["sourceSha256"]:
        raise ValueError(f"Source hash mismatch for pose {pose['index']}")
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A").point(lambda value: 255 if value > 16 else 0)
    bounds = alpha.getbbox()
    if list(bounds) != pose["alphaBoundsThreshold16"]:
        raise ValueError(f"Reviewed alpha bounds changed for pose {pose['index']}")
    crop = image.crop(bounds)
    figure_w = round(crop.width * 90 / crop.height)
    if figure_w != pose["cellFigure"][0] or min(pose["cellMargins"][:2]) < 8:
        raise ValueError(f"Reviewed cell fit changed for pose {pose['index']}")
    figure = crop.resize((figure_w, 90), Image.Resampling.NEAREST)
    cell = Image.new("RGBA", (CELL_W, CELL_H), (0, 0, 0, 0))
    cell.alpha_composite(figure, ((CELL_W - figure_w) // 2, 5))
    cell_hash = hashlib.sha256(cell.tobytes()).hexdigest()
    if cell_hash in cell_hashes:
        raise ValueError(f"Duplicate packed drawing at pose {pose['index']}")
    cell_hashes.append(cell_hash)
    x, y = (pose["index"] % COLS) * CELL_W, (pose["index"] // COLS) * CELL_H
    atlas.alpha_composite(cell, (x, y))
    frames.append({"x": x, "y": y, "w": CELL_W, "h": CELL_H})
    source_records.append({
        "poseIndex": pose["index"],
        "generationId": pose["generationId"],
        "promptFile": pose["promptFile"],
        "source": pose["source"],
        "sourceSha256": pose["sourceSha256"],
        "rawSource": pose.get("rawSource"),
        "rawSourceSha256": pose.get("rawSourceSha256"),
        "cropThreshold": 16,
        "cropBox": list(bounds),
        "figureSize": [figure_w, 90],
        "cellMargins": pose["cellMargins"],
        "packedCellSha256": cell_hash,
        "cell": [x, y, CELL_W, CELL_H],
    })

PNG.parent.mkdir(parents=True, exist_ok=True)
WEBP.parent.mkdir(parents=True, exist_ok=True)
atlas.save(PNG)
atlas.save(WEBP, "WEBP", lossless=True, method=6)
layout = {
    "athlete": "keeg",
    "direction": "right",
    "clip": "alley-oop-power",
    "src": "./public/assets/animation/keeg-alley-oop-power-right.webp",
    "columns": COLS,
    "rows": ROWS,
    "frames": frames,
    "provenance": {
        "status": "source atlas assembled; separate ball-track and native renderer review pending",
        "promptAndSourceManifest": "tools/generate-art/j106-keeg-alley-oop-power-provenance.json",
        "assemblyScript": "tools/generate-art/assemble-keeg-alley-oop-power.py",
        "cellSize": [CELL_W, CELL_H],
        "figureHeight": 90,
        "sequenceOrder": list(range(15)),
        "operation": "Tight alpha crop at threshold16; uniform nearest-neighbor resize to 90px figure height; center in transparent 128x96 cell with baseline y95; pack row-major. No pose was drawn, duplicated, mirrored, or interpolated.",
        "sourceRecords": source_records,
        "cleanup": "Raw generator PNGs remain preserved. Accepted cleaned images preserve RGB and clear alpha<=16. Atlas adds no background pixels.",
        "ballTrack": "Keeg-specific separate track is recorded in the provenance JSON and src/core/animation.js. Native contact/release review is pending.",
    },
}
LAYOUT.write_text(json.dumps(layout, indent=2, ensure_ascii=False) + "\n")
print(f"Assembled {atlas.width}x{atlas.height} lossless atlas from {len(frames)} unique reviewed sources.")
