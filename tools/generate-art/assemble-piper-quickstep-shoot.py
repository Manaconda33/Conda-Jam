#!/usr/bin/env python3
"""Pack Piper's reviewed source poses after pre-pack ball-overlay review.

This script crops alpha bounds, nearest-neighbor fits, and packs already
authored poses. It never draws, interpolates, mirrors, or duplicates a pose.
"""
from datetime import datetime, timezone
from pathlib import Path
import hashlib
import json

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
LAYOUT_PATH = ROOT / "tools/generate-art/j108-piper-quickstep-shoot-layout.json"
PROVENANCE_PATH = ROOT / "tools/generate-art/j108-piper-quickstep-shoot-provenance.json"
NOTES_PATH = ROOT / "tools/generate-art/j108-piper-quickstep-shoot-source-notes.md"
ATLAS_PATH = ROOT / "public/assets/animation/piper-quickstep-shoot-right.webp"
PNG_PATH = ROOT / "tools/generate-art/sources/j108-piper-quickstep-shoot-atlas.png"
PREVIEW_DIR = ROOT / "tools/generate-art/previews/j108-piper-quickstep-shoot"
REVIEW_PATH = PREVIEW_DIR / "j108-piper-shoot-atlas-review.png"

CELL_W, CELL_H, COLS, ROWS = 128, 96, 5, 2
MAX_W, MAX_H = 76, 86
layout = json.loads(LAYOUT_PATH.read_text())
provenance = json.loads(PROVENANCE_PATH.read_text())
base_prompt_path = ROOT / "tools/generate-art/j108-piper-quickstep-shoot-attempt-02-edit-prompt.md"
prompt_doc = base_prompt_path.read_text()
prompt_marker = "Verbatim edit prompt:\n\n> "
if prompt_marker not in prompt_doc:
    raise ValueError("Could not extract the exact attempt02 edit prompt")
base_prompt = prompt_doc.split(prompt_marker, 1)[1].split("\n\n", 1)[0]
poses = sorted(layout["sources"], key=lambda p: p["index"])
if [p["index"] for p in poses] != list(range(10)):
    raise ValueError("Expected ten unique, ordered Piper shoot poses")
if len({p["packedCellSha256"] for p in poses}) != 10:
    raise ValueError("Source review cells are not all unique")

atlas = Image.new("RGBA", (CELL_W * COLS, CELL_H * ROWS), (0, 0, 0, 0))
frames, records, cell_hashes = [], [], []
for pose in poses:
    source_path = ROOT / pose["source"]
    raw = source_path.read_bytes()
    if hashlib.sha256(raw).hexdigest() != pose["sha256"]:
        raise ValueError(f"Source hash changed for pose {pose['index']:02d}")
    source = Image.open(source_path).convert("RGBA")
    alpha = source.getchannel("A").point(lambda a: 255 if a > 16 else 0)
    bounds = alpha.getbbox()
    if list(bounds) != pose["alphaBoundsThreshold16"]:
        raise ValueError(f"Alpha bounds changed for pose {pose['index']:02d}")
    if any(source.getpixel(point)[3] for point in [(0, 0), (source.width - 1, 0), (0, source.height - 1), (source.width - 1, source.height - 1)]):
        raise ValueError(f"Source corner alpha is not zero for pose {pose['index']:02d}")
    crop = source.crop(bounds)
    scale = min(MAX_W / crop.width, MAX_H / crop.height)
    width, height = max(1, round(crop.width * scale)), max(1, round(crop.height * scale))
    if width > MAX_W or height > MAX_H:
        raise ValueError(f"Figure fit overflow for pose {pose['index']:02d}: {width}x{height}")
    margins = [(CELL_W - width) // 2, CELL_W - width - (CELL_W - width) // 2,
               (CELL_H - height) // 2, CELL_H - height - (CELL_H - height) // 2]
    if margins != pose["cellMargins"]:
        raise ValueError(f"Recorded margins changed for pose {pose['index']:02d}")
    figure = crop.resize((width, height), Image.Resampling.NEAREST)
    cell = Image.new("RGBA", (CELL_W, CELL_H), (0, 0, 0, 0))
    cell.alpha_composite(figure, (margins[0], margins[2]))
    cell_hash = hashlib.sha256(cell.tobytes()).hexdigest()
    if cell_hash != pose["packedCellSha256"] or cell_hash in cell_hashes:
        raise ValueError(f"Review cell mismatch or duplicate for pose {pose['index']:02d}")
    cell_hashes.append(cell_hash)
    x, y = (pose["index"] % COLS) * CELL_W, (pose["index"] // COLS) * CELL_H
    atlas.alpha_composite(cell, (x, y))
    frames.append({"x": x, "y": y, "w": CELL_W, "h": CELL_H})
    prompt_file = ("tools/generate-art/j108-piper-quickstep-shoot-attempt-03-replacements-prompt.md"
                   if pose["generationId"] == "exec-429e12df-7cb5-4811-a5d1-e7e0cd0d8db1"
                   else "tools/generate-art/j108-piper-quickstep-shoot-attempt-02-edit-prompt.md")
    records.append({"poseIndex": pose["index"], "pose": pose["pose"],
        "generationId": pose["generationId"], "source": pose["source"],
        "promptFile": prompt_file,
        "sourceSha256": pose["sha256"], "rawSource": pose["generationSource"],
        "rawSourceSha256": pose["generationSourceSha256"], "cropThreshold": 16,
        "cropBox": list(bounds), "figureSize": [width, height], "cellMargins": margins,
        "packedCellSha256": cell_hash, "cell": [x, y, CELL_W, CELL_H]})

PNG_PATH.parent.mkdir(parents=True, exist_ok=True)
ATLAS_PATH.parent.mkdir(parents=True, exist_ok=True)
PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
atlas.save(PNG_PATH)
atlas.save(ATLAS_PATH, "WEBP", lossless=True, method=6)

# Review the exact packed cells on light/dark backgrounds.
review = Image.new("RGB", (CELL_W * COLS, CELL_H * ROWS * 2), (248, 248, 248))
draw = ImageDraw.Draw(review)
for index in range(10):
    x, row = (index % COLS) * CELL_W, index // COLS
    source_y = row * CELL_H
    cell = atlas.crop((x, source_y, x + CELL_W, source_y + CELL_H))
    y = row * CELL_H * 2
    review.paste(cell.convert("RGB"), (x, y + 16), cell.getchannel("A"))
    draw.text((x + 3, y + 2), f"{index:02d}", fill="black")
    review.paste(cell.convert("RGB"), (x, y + CELL_H + 16), cell.getchannel("A"))
    draw.text((x + 3, y + CELL_H + 2), f"{index:02d}", fill="white")
review.save(REVIEW_PATH)

# Coordinates were visually checked on the pre-pack overlay. These map the
# separate game ball to Piper's authored leading hand in the 128x96 cells.
hand_pixels = [[86, 48], [90, 51], [74, 35], [77, 35], [85, 16],
               [80, 8], [83, 8], [84, 8], [91, 19], [87, 46]]
runtime_track = {
    "height": [round((70.22 - y * .804) / 28, 3) for _, y in hand_pixels],
    "forward": [round((x - 64) * .804 / 2.2, 3) for x, _ in hand_pixels],
    "anchors": {"takeoff": 6, "release": 13, "peak": 13, "finish": 23},
    "releasePolicy": "Piper holds the separate ball through tick12; the tick13 release transfers it to simulation-owned shot flight.",
    "prePackOverlayReview": "tools/generate-art/previews/j108-piper-quickstep-shoot/j108-piper-shoot-ball-overlay-diagnostic.png",
    "handCentersInReviewCell": hand_pixels,
}
provenance["generatedAt"] = datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")
provenance["status"] = "atlas packed; native renderer and both-facing review pending"
provenance["runtimeBallTrack"] = runtime_track
provenance["atlas"] = {
    "path": ATLAS_PATH.relative_to(ROOT).as_posix(),
    "pngSource": PNG_PATH.relative_to(ROOT).as_posix(),
    "dimensions": [atlas.width, atlas.height],
    "sha256": hashlib.sha256(ATLAS_PATH.read_bytes()).hexdigest(),
    "pngSha256": hashlib.sha256(PNG_PATH.read_bytes()).hexdigest(),
    "bytes": ATLAS_PATH.stat().st_size,
    "uniqueFrames": len(cell_hashes),
    "frameSha256": cell_hashes,
    "cellSize": [CELL_W, CELL_H], "grid": [COLS, ROWS],
    "fit": [MAX_W, MAX_H], "sourceRecords": records,
    "review": REVIEW_PATH.relative_to(ROOT).as_posix(),
    "lightDarkPreview": "Each packed pose has 32px left/right and 5px top/bottom clear margins; transparent corners and distinct-cell hashes were checked before pack.",
}
PROVENANCE_PATH.write_text(json.dumps(provenance, indent=2, ensure_ascii=False) + "\n")

layout.update({"src": "./public/assets/animation/piper-quickstep-shoot-right.webp",
    "columns": COLS, "rows": ROWS, "frames": frames,
    "atlasSha256": provenance["atlas"]["sha256"],
    "atlasReview": REVIEW_PATH.relative_to(ROOT).as_posix(),
    "provenance": {"prompt": base_prompt, "promptVerbatim": True,
        "sourcePromptStatus": "Verbatim attempt02 edit prompt; each replacement frame links the verbatim attempt03 prompt in sourceRecords.",
        "promptScope": "The exact accepted source and replacement prompts are preserved per frame in sourceRecords.",
        "generatedAt": provenance["generatedAt"], "generationId": "exec-57e8bead-39f1-47bc-9f68-77e961d8041b",
        "promptAndSourceManifest": "tools/generate-art/j108-piper-quickstep-shoot-provenance.json",
        "sourceRecords": records, "runtimeBallTrack": runtime_track},
    "runtimeBallTrack": runtime_track,
    "reviewStatus": "packed candidate; native renderer review pending"})
LAYOUT_PATH.write_text(json.dumps(layout, indent=2, ensure_ascii=False) + "\n")
print(json.dumps({"atlas": ATLAS_PATH.relative_to(ROOT).as_posix(),
    "dimensions": [atlas.width, atlas.height], "frames": len(frames),
    "uniqueFrames": len(cell_hashes), "sha256": provenance["atlas"]["sha256"],
    "review": REVIEW_PATH.relative_to(ROOT).as_posix()}))
