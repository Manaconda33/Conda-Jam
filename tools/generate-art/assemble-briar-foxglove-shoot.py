#!/usr/bin/env python3
"""Pack Briar's ten reviewed source cells into a lossless shoot atlas."""
from datetime import datetime, timezone
from pathlib import Path
import hashlib
import json

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
PROV_PATH = ROOT / "tools/generate-art/j109-briar-foxglove-shoot-provenance.json"
LAYOUT_PATH = ROOT / "tools/generate-art/j109-briar-foxglove-shoot-layout.json"
ATLAS_PATH = ROOT / "public/assets/animation/briar-foxglove-shoot-right.webp"
PNG_PATH = ROOT / "tools/generate-art/sources/j109-briar-foxglove-shoot-atlas.png"
REVIEW_PATH = ROOT / "tools/generate-art/previews/j109-briar-foxglove-shoot/j109-briar-foxglove-shoot-atlas-review.png"
CELL_W, CELL_H, COLS, ROWS = 128, 96, 5, 2

prov = json.loads(PROV_PATH.read_text())
layout = json.loads(LAYOUT_PATH.read_text())
records = sorted(prov["cleanedSourceRecords"], key=lambda item: item["pose"])
if [item["pose"] for item in records] != list(range(10)):
    raise ValueError("Expected ten distinct, ordered authored poses")
if len({item["cellSha256"] for item in records}) != 10:
    raise ValueError("Duplicate or missing cell hashes")
atlas = Image.new("RGBA", (CELL_W * COLS, CELL_H * ROWS), (0, 0, 0, 0))
frames, manifest_records = [], []
for item in records:
    source_path = ROOT / item["source"]
    if hashlib.sha256(source_path.read_bytes()).hexdigest() != item["sha256"]:
        raise ValueError(f"Source changed for pose{item['pose']:02d}")
    cell = Image.open(source_path).convert("RGBA")
    if cell.size != (CELL_W, CELL_H):
        raise ValueError(f"Unexpected cell size for pose{item['pose']:02d}: {cell.size}")
    if hashlib.sha256(cell.tobytes()).hexdigest() != item["cellSha256"]:
        raise ValueError(f"Cell hash mismatch for pose{item['pose']:02d}")
    if any(cell.getpixel(p)[3] for p in [(0, 0), (127, 0), (0, 95), (127, 95)]):
        raise ValueError(f"Transparent corner check failed for pose{item['pose']:02d}")
    if item["marginsLTRB"][0] < 26 or item["marginsLTRB"][1] < 26 or item["marginsLTRB"][2] < 5 or item["marginsLTRB"][3] < 5:
        raise ValueError(f"Cell margin check failed for pose{item['pose']:02d}")
    x, y = (item["pose"] % COLS) * CELL_W, (item["pose"] // COLS) * CELL_H
    atlas.alpha_composite(cell, (x, y))
    frames.append({"x": x, "y": y, "w": CELL_W, "h": CELL_H})
    manifest_records.append({"poseIndex": item["pose"], "generationId": item["generationId"],
        "promptFile": item["prompt"], "source": item["source"], "sourceSha256": item["sha256"],
        "rawSource": item["rawSource"], "rawSourceSha256": item["rawSourceSha256"],
        "sourceBounds": item["sourceBounds"], "cellMargins": item["marginsLTRB"],
        "packedCellSha256": item["cellSha256"], "cell": [x, y, CELL_W, CELL_H]})

ATLAS_PATH.parent.mkdir(parents=True, exist_ok=True)
PNG_PATH.parent.mkdir(parents=True, exist_ok=True)
REVIEW_PATH.parent.mkdir(parents=True, exist_ok=True)
atlas.save(PNG_PATH)
atlas.save(ATLAS_PATH, "WEBP", lossless=True, method=6)
review = Image.new("RGB", (CELL_W * COLS, CELL_H * ROWS * 2), (248, 248, 248))
draw = ImageDraw.Draw(review)
for index in range(10):
    x, row = (index % COLS) * CELL_W, index // COLS
    cell = atlas.crop((x, row * CELL_H, x + CELL_W, (row + 1) * CELL_H))
    y = row * CELL_H * 2
    review.paste(cell.convert("RGB"), (x, y + 16), cell.getchannel("A"))
    draw.text((x + 3, y + 2), f"{index:02d}", fill="black")
    review.paste(cell.convert("RGB"), (x, y + CELL_H + 16), cell.getchannel("A"))
    draw.text((x + 3, y + CELL_H + 2), f"{index:02d}", fill="white")
review.save(REVIEW_PATH)

track = {"height": layout["runtimeTrackCandidate"]["height"],
    "forward": layout["runtimeTrackCandidate"]["forward"],
    "anchors": {"takeoff": 6, "release": 13, "peak": 13, "finish": 23},
    "releasePolicy": "Briar holds the separate ball through tick12; frame05 releases at tick13 into simulation-owned shot flight.",
    "handCentersInReviewCell": layout["runtimeTrackCandidate"]["handCenters"]}
prov["generatedAt"] = datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")
prov["reviewState"] = "packed candidate; native Canvas review pending"
prov["runtimeBallTrackCandidate"] = track
prov["atlas"] = {"path": ATLAS_PATH.relative_to(ROOT).as_posix(), "pngSource": PNG_PATH.relative_to(ROOT).as_posix(),
    "dimensions": [atlas.width, atlas.height], "sha256": hashlib.sha256(ATLAS_PATH.read_bytes()).hexdigest(),
    "pngSha256": hashlib.sha256(PNG_PATH.read_bytes()).hexdigest(), "bytes": ATLAS_PATH.stat().st_size,
    "cellSize": [CELL_W, CELL_H], "grid": [COLS, ROWS], "uniqueFrames": len(manifest_records),
    "frameSha256": [item["packedCellSha256"] for item in manifest_records], "sourceRecords": manifest_records,
    "review": REVIEW_PATH.relative_to(ROOT).as_posix()}
PROV_PATH.write_text(json.dumps(prov, indent=2) + "\n")
layout.update({"athlete": "briar-foxglove", "clip": "shoot", "direction": "right",
    "src": "./public/assets/animation/briar-foxglove-shoot-right.webp", "columns": COLS, "rows": ROWS,
    "frames": frames, "atlasSha256": prov["atlas"]["sha256"], "atlasReview": REVIEW_PATH.relative_to(ROOT).as_posix(),
    "runtimeBallTrackCandidate": track, "reviewState": "packed; native Canvas review pending"})
LAYOUT_PATH.write_text(json.dumps(layout, indent=2) + "\n")
print(json.dumps({"atlas": ATLAS_PATH.relative_to(ROOT).as_posix(), "dimensions": [atlas.width, atlas.height],
    "frames": len(frames), "sha256": prov["atlas"]["sha256"], "review": REVIEW_PATH.relative_to(ROOT).as_posix()}))
