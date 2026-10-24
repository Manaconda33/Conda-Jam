#!/usr/bin/env python3
"""Isolate and fit Briar's reviewed single-pose generations for source review.

Only the largest alpha-connected authored figure is retained. The script
records deterministic crops and nearest-neighbor fits; it does not draw,
mirror, interpolate, or duplicate a pose.
"""
from pathlib import Path
import hashlib
import json

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
PROV_PATH = ROOT / "tools/generate-art/j109-briar-foxglove-shoot-provenance.json"
LAYOUT_PATH = ROOT / "tools/generate-art/j109-briar-foxglove-shoot-layout.json"
SOURCE_DIR = ROOT / "tools/generate-art/sources"
PREVIEW_DIR = ROOT / "tools/generate-art/previews/j109-briar-foxglove-shoot"
CELL_W, CELL_H, MAX_W, MAX_H = 128, 96, 76, 86

provenance = json.loads(PROV_PATH.read_text())
layout = json.loads(LAYOUT_PATH.read_text())
records = sorted(provenance["records"], key=lambda item: item["pose"])
frames = []
for record in records:
    index = record["pose"]
    raw_path = ROOT / record["raw"]
    raw_bytes = raw_path.read_bytes()
    if hashlib.sha256(raw_bytes).hexdigest() != record["sha256"]:
        raise ValueError(f"Raw source hash mismatch for pose{index:02d}")
    raw = Image.open(raw_path).convert("RGBA")
    arr = np.asarray(raw)
    labels, count = ndimage.label(arr[:, :, 3] > 16, structure=np.ones((3, 3), dtype=np.uint8))
    counts = np.bincount(labels.ravel())
    if count == 0 or len(counts) < 2:
        raise ValueError(f"No alpha-connected figure for pose{index:02d}")
    label = int(np.argmax(counts[1:]) + 1)
    if counts[label] < 1000:
        raise ValueError(f"Largest component too small for pose{index:02d}")
    ys, xs = np.where(labels == label)
    bounds = [int(xs.min()), int(ys.min()), int(xs.max() + 1), int(ys.max() + 1)]
    if bounds != record["alphaBoundsThreshold16"]:
        raise ValueError(f"Reviewed source bounds changed for pose{index:02d}: {bounds}")
    mask = Image.fromarray((labels[bounds[1]:bounds[3], bounds[0]:bounds[2]] == label).astype("uint8") * 255)
    crop = raw.crop(tuple(bounds))
    crop.putalpha(Image.fromarray(np.minimum(np.asarray(crop.getchannel("A")), np.asarray(mask))))
    alpha = crop.getchannel("A").point(lambda a: 255 if a > 16 else 0)
    crop_bounds = alpha.getbbox()
    if not crop_bounds:
        raise ValueError(f"Empty extracted figure for pose{index:02d}")
    crop = crop.crop(crop_bounds)
    scale = min(MAX_W / crop.width, MAX_H / crop.height)
    width, height = max(1, round(crop.width * scale)), max(1, round(crop.height * scale))
    if width > MAX_W or height > MAX_H:
        raise ValueError(f"Fit exceeds cell for pose{index:02d}")
    figure = crop.resize((width, height), Image.Resampling.NEAREST)
    cell = Image.new("RGBA", (CELL_W, CELL_H), (0, 0, 0, 0))
    left, top = (CELL_W - width) // 2, (CELL_H - height) // 2
    cell.alpha_composite(figure, (left, top))
    if any(cell.getpixel(p)[3] for p in [(0, 0), (127, 0), (0, 95), (127, 95)]):
        raise ValueError(f"Nontransparent corner for pose{index:02d}")
    source = SOURCE_DIR / f"j109-briar-foxglove-shoot-pose-{index:02d}-attempt-{2 if index == 1 else 1}.png"
    cell.save(source)
    frames.append({"pose": index, "source": source.relative_to(ROOT).as_posix(),
        "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "rawSource": record["raw"], "rawSourceSha256": record["sha256"],
        "generationId": record["generationId"], "prompt": f"tools/generate-art/j109-briar-foxglove-shoot-pose-{index:02d}-attempt-{2 if index == 1 else 1}-prompt.md",
        "sourceBounds": bounds, "sourceComponentPixels": int(counts[label]),
        "cellFigure": [width, height], "marginsLTRB": [left, CELL_W - width - left, top, CELL_H - height - top],
        "cellSha256": hashlib.sha256(cell.tobytes()).hexdigest(), "ballPaintedInPose": False})

# Deterministic pre-pack pose and separate-ball review previews.
contact = Image.new("RGB", (CELL_W * 5, CELL_H * 4), (248, 248, 248))
for item in frames:
    index = item["pose"]
    x, row = (index % 5) * CELL_W, index // 5
    cell = Image.open(ROOT / item["source"]).convert("RGBA")
    for bg_y, bg_color in [(row * CELL_H * 2, (248, 248, 248, 255)), (row * CELL_H * 2 + CELL_H, (32, 32, 40, 255))]:
        bg = Image.new("RGBA", (CELL_W, CELL_H), bg_color)
        bg.alpha_composite(cell)
        contact.paste(bg.convert("RGB"), (x, bg_y))
PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
contact_path = PREVIEW_DIR / "j109-briar-foxglove-shoot-source-cells-light-dark.png"
contact.save(contact_path)

# Hand centers are based on the reviewed source-cell silhouettes. The orange
# ball is a diagnostic overlay only, never added to the sprite source.
hands = [[84, 51], [75, 38], [85, 55], [80, 31], [81, 19],
         [83, 9], [85, 8], [85, 9], [82, 46], [88, 50]]
ball = Image.new("RGB", (CELL_W * 5, CELL_H * 4), (248, 248, 248))
for item, (hx, hy) in zip(frames, hands):
    index = item["pose"]
    x, row = (index % 5) * CELL_W, index // 5
    cell = Image.open(ROOT / item["source"]).convert("RGBA")
    track_height = (70.22 - hy * .804) / 28
    track_forward = (hx - 64) * .804 / 2.2
    cx = round(64 + track_forward * 2.2 / .804)
    cy = round(91 - track_height * 28 / .804)
    bg = Image.new("RGBA", (CELL_W, CELL_H), (248, 248, 248, 255))
    bg.alpha_composite(cell)
    d = ImageDraw.Draw(bg)
    d.ellipse((cx - 5, cy - 5, cx + 5, cy + 5), fill=(246, 163, 61, 255), outline=(23, 14, 24, 255), width=1)
    d.arc((cx - 4, cy - 4, cx + 4, cy + 4), -50, 50, fill=(113, 59, 37, 255), width=1)
    d.line((cx - 4, cy, cx + 4, cy), fill=(113, 59, 37, 255), width=1)
    ball.paste(bg.convert("RGB"), (x, row * CELL_H * 2))
ball_path = PREVIEW_DIR / "j109-briar-foxglove-shoot-ball-overlay-diagnostic.png"
ball.save(ball_path)

layout["method"] = "Largest alpha>16 connected component; tight alpha crop; nearest-neighbor fit to max76x86; center in transparent128x96 cell. No poses drawn, mirrored, duplicated, or interpolated."
for item in layout["frames"]:
    source = frames[item["pose"]]
    item.update({"source": source["source"], "sourceSha256": source["sha256"],
        "rawSource": source["rawSource"], "rawSourceSha256": source["rawSourceSha256"],
        "generationId": source["generationId"], "promptFile": source["prompt"],
        "sourceBounds": source["sourceBounds"], "cellFigure": source["cellFigure"],
        "marginsLTRB": source["marginsLTRB"], "cellSha256": source["cellSha256"]})
layout["sourceContactSheet"] = contact_path.relative_to(ROOT).as_posix()
layout["ballOverlayDiagnostic"] = ball_path.relative_to(ROOT).as_posix()
layout["runtimeTrackCandidate"] = {"handCenters": hands,
    "height": [round((70.22 - y * .804) / 28, 3) for _, y in hands],
    "forward": [round((x - 64) * .804 / 2.2, 3) for x, _ in hands],
    "releaseFrame": 5, "releaseTick": 13,
    "status": "diagnostic source-cell estimate; native Canvas alignment must pass before packing"}
LAYOUT_PATH.write_text(json.dumps(layout, indent=2) + "\n")
provenance["cleaningScript"] = "tools/generate-art/clean-j109-briar-foxglove-shoot.py"
provenance["cleanedSourceRecords"] = frames
provenance["reviewState"] = "source cells extracted and reviewed; ball overlay review pending before packing"
PROV_PATH.write_text(json.dumps(provenance, indent=2) + "\n")
print(json.dumps({"frames": len(frames), "uniqueSourceHashes": len({x['sha256'] for x in frames}),
    "minMargins": [min(min(x['marginsLTRB'][:2]), min(x['marginsLTRB'][2:])) for x in frames],
    "prePackBallOverlay": ball_path.relative_to(ROOT).as_posix()}))
