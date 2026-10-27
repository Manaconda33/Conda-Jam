"""Build an unaccepted normalized review atlas from J.135 source attempt 03."""
from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import find_objects, label


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "tools/generate-art/sources/j135-briar-foxglove-fall-attempt-03-raw.png"
OUT = ROOT / "tools/generate-art/candidates/j135-briar-foxglove-fall-attempt-03"
OUT.mkdir(parents=True, exist_ok=True)

source = Image.open(SOURCE).convert("RGBA")
pixels = np.asarray(source)
alpha = pixels[:, :, 3]
if source.size != (1983, 793) or alpha.min() != 0 or alpha.max() < 240:
    raise SystemExit(f"Unexpected source image/transparency: {source.size}")

components, count = label(alpha >= 64, structure=np.ones((3, 3), dtype=np.uint8))
minimum_area = source.width * source.height * 0.004
rectangles = []
discarded = []
for component, slices in enumerate(find_objects(components), start=1):
    if slices is None:
        continue
    area = int(np.count_nonzero(components[slices] == component))
    ys, xs = slices
    rect = {"component": component, "area": area, "x0": int(xs.start), "y0": int(ys.start), "x1": int(xs.stop), "y1": int(ys.stop)}
    if area < minimum_area:
        discarded.append(rect)
    else:
        if rect["x0"] < 2 or rect["y0"] < 2 or rect["x1"] > source.width - 2 or rect["y1"] > source.height - 2:
            raise SystemExit(f"Complete pose touches outside source-sheet edge: {rect}")
        rect["cx"] = (rect["x0"] + rect["x1"]) / 2
        rect["cy"] = (rect["y0"] + rect["y1"]) / 2
        rectangles.append(rect)

if len(rectangles) != 10:
    raise SystemExit(f"Expected ten isolated complete bodies; found {len(rectangles)}")

cell_w, cell_h = source.width / 5, source.height / 2
cells: dict[tuple[int, int], dict] = {}
for rect in rectangles:
    col = min(4, int(rect["cx"] // cell_w))
    row = min(1, int(rect["cy"] // cell_h))
    key = (row, col)
    if key in cells:
        raise SystemExit(f"More than one body in source cell {key}")
    cells[key] = rect
ordered = []
for index in range(10):
    key = divmod(index, 5)
    if key not in cells:
        raise SystemExit(f"Missing pose in source cell {index}")
    rect = cells[key]
    rect["sourceIndex"] = index
    rect["x"] = max(0, rect["x0"] - 2)
    rect["y"] = max(0, rect["y0"] - 2)
    rect["w"] = min(source.width - rect["x"], rect["x1"] - rect["x"] + 2)
    rect["h"] = min(source.height - rect["y"], rect["y1"] - rect["y"] + 2)
    ordered.append(rect)

crops = []
for rect in ordered:
    x, y, w, h = (rect[k] for k in ("x", "y", "w", "h"))
    crop = pixels[y:y+h, x:x+w].copy()
    owners = components[y:y+h, x:x+w]
    crop[owners != rect["component"], 3] = 0
    crops.append(Image.fromarray(crop, mode="RGBA"))

scale = 92 / max(crop.height for crop in crops)
widest = max(crop.width * scale for crop in crops)
cell_width = max(64, math.ceil((widest + 4) / 16) * 16)
if cell_width > 160:
    raise SystemExit(f"Candidate exceeds supported normalized width: {cell_width}")
cell_height = 96
atlas = Image.new("RGBA", (cell_width * 5, cell_height * 2), (0, 0, 0, 0))
frames = []
for index, crop in enumerate(crops):
    size = (max(1, round(crop.width * scale)), max(1, round(crop.height * scale)))
    resized = crop.resize(size, Image.Resampling.LANCZOS)
    if resized.width > cell_width or resized.height > 92:
        raise SystemExit(f"Pose {index} does not fit the review cell")
    row, col = divmod(index, 5)
    x = col * cell_width + (cell_width - resized.width) // 2
    y = row * cell_height + 94 - resized.height
    atlas.alpha_composite(resized, (x, y))
    cell = (col * cell_width, row * cell_height, cell_width, cell_height)
    bbox = atlas.crop((cell[0], cell[1], cell[0] + cell_width, cell[1] + cell_height)).getchannel("A").point(lambda v: 255 if v >= 16 else 0).getbbox()
    margins = [bbox[0], bbox[1], cell_width - bbox[2], cell_height - bbox[3]]
    source_rect = ordered[index]
    frames.append({"index": index, "x": cell[0], "y": cell[1], "w": cell_width, "h": cell_height, "sourceRect": {k: source_rect[k] for k in ("x", "y", "w", "h")}, "packedAlpha16Margins": margins, "uniqueRGBAHash": hashlib.sha256(resized.tobytes()).hexdigest()})

candidate = OUT / "briar-foxglove-fall-attempt-03-review.png"
atlas.save(candidate)
proof = Image.new("RGB", (atlas.width * 2 + 36, atlas.height + 48), "#d0d0d0")
from PIL import ImageDraw

draw = ImageDraw.Draw(proof)
for index, background in enumerate(("#191919", "#f6f0df")):
    x = 12 + index * (atlas.width + 12)
    draw.rectangle((x, 0, x + atlas.width - 1, proof.height - 1), fill=background)
    draw.text((x + 4, 6), "DARK" if index == 0 else "LIGHT", fill="#ffffff" if index == 0 else "#1b1b1b")
    proof.paste(atlas, (x, 28), atlas)
proof_path = OUT / "briar-foxglove-fall-attempt-03-review-light-dark.png"
proof.save(proof_path)
report = {
    "status": "review candidate only; not accepted, registered, or used in gameplay",
    "athlete": "briar-foxglove",
    "clip": "fall",
    "source": str(SOURCE.relative_to(ROOT)),
    "sourceSha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    "sourceGrid": "5x2 row-major; 10 occupied cells",
    "sourceConnectedComponentsAtAlpha64": int(count),
    "bodyComponents": len(ordered),
    "smallDiscardedComponents": discarded,
    "cleanup": "Component isolation at alpha>=64 retained the ten largest cell-mapped bodies; all other alpha components are listed as discarded noise. No pose was redrawn, reordered, or invented.",
    "targetFit": {"uniformScale": scale, "cellWidth": cell_width, "cellHeight": cell_height, "columns": 5, "rows": 2, "baselineY": 94, "resampling": "LANCZOS"},
    "candidate": str(candidate.relative_to(ROOT)),
    "candidateSha256": hashlib.sha256(candidate.read_bytes()).hexdigest(),
    "lightDarkPreview": str(proof_path.relative_to(ROOT)),
    "lightDarkPreviewSha256": hashlib.sha256(proof_path.read_bytes()).hexdigest(),
    "frames": frames,
}
(OUT / "normalization-report.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({"candidate": str(candidate.relative_to(ROOT)), "size": atlas.size, "uniformScale": scale, "cell": [cell_width, cell_height], "components": int(count), "discarded": len(discarded), "frames": len(frames)}))
