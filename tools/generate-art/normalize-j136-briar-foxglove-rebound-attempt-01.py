"""Build a non-production normalized review atlas for Briar rebound."""
from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import find_objects, label


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "tools/generate-art/candidates/j136-briar-foxglove-rebound-attempt-01/briar-foxglove-rebound-attempt-01-clean-candidate.png"
OUT = ROOT / "tools/generate-art/candidates/j136-briar-foxglove-rebound-attempt-01"
PREVIEW = ROOT / "tools/generate-art/previews/j136-briar-foxglove-rebound"

source = Image.open(SOURCE).convert("RGBA")
pixels = np.asarray(source)
alpha = pixels[:, :, 3]
components, _ = label(alpha >= 64, structure=np.ones((3, 3), dtype=np.uint8))
rectangles = []
minimum_area = source.width * source.height * 0.004
for component, slices in enumerate(find_objects(components), start=1):
    if slices is None:
        continue
    area = int(np.count_nonzero(components[slices] == component))
    if area < minimum_area:
        continue
    ys, xs = slices
    rect = {"component": component, "area": area, "x0": int(xs.start), "y0": int(ys.start), "x1": int(xs.stop), "y1": int(ys.stop)}
    rect["cx"] = (rect["x0"] + rect["x1"]) / 2
    rect["cy"] = (rect["y0"] + rect["y1"]) / 2
    rectangles.append(rect)
if len(rectangles) != 5:
    raise SystemExit(f"Expected five complete figures after cleanup; found {len(rectangles)}")

cell_w, cell_h = source.width / 3, source.height / 2
cells: dict[tuple[int, int], dict] = {}
for rect in rectangles:
    col = min(2, int(rect["cx"] // cell_w))
    row = min(1, int(rect["cy"] // cell_h))
    key = (row, col)
    if key in cells:
        raise SystemExit(f"Two bodies in source cell {key}")
    cells[key] = rect
ordered = []
for index in range(5):
    key = divmod(index, 3)
    if key not in cells:
        raise SystemExit(f"Missing row-major source pose in cell {index}")
    rect = cells[key]
    rect["sourceIndex"] = index
    rect["x"] = max(0, rect["x0"] - 2)
    rect["y"] = max(0, rect["y0"] - 2)
    rect["w"] = min(source.width, rect["x1"] + 2) - rect["x"]
    rect["h"] = min(source.height, rect["y1"] + 2) - rect["y"]
    ordered.append(rect)

crops = []
for rect in ordered:
    x, y, w, h = (rect[k] for k in ("x", "y", "w", "h"))
    crop = pixels[y:y+h, x:x+w].copy()
    crop[components[y:y+h, x:x+w] != rect["component"], 3] = 0
    crops.append(Image.fromarray(crop, "RGBA"))

scale = 92 / max(crop.height for crop in crops)
widest = max(crop.width * scale for crop in crops)
cell_width = max(64, math.ceil((widest + 4) / 16) * 16)
if cell_width > 192:
    raise SystemExit(f"Briar poses exceed supported action-atlas width: {cell_width}")
cell_height = 96
atlas = Image.new("RGBA", (cell_width * 3, cell_height * 2), (0, 0, 0, 0))
frames = []
for index, crop in enumerate(crops):
    resized = crop.resize((max(1, round(crop.width * scale)), max(1, round(crop.height * scale))), Image.Resampling.LANCZOS)
    if resized.width > cell_width or resized.height > 92:
        raise SystemExit(f"Frame {index} does not fit normalized review cell")
    row, col = divmod(index, 3)
    x = col * cell_width + (cell_width - resized.width) // 2
    y = row * cell_height + 94 - resized.height
    atlas.alpha_composite(resized, (x, y))
    bbox = resized.getchannel("A").point(lambda v: 255 if v >= 16 else 0).getbbox()
    margins = [x - col * cell_width + bbox[0], y - row * cell_height + bbox[1], cell_width - (x - col * cell_width + bbox[2]), cell_height - (y - row * cell_height + bbox[3])]
    source_rect = ordered[index]
    frames.append({"index": index, "x": col * cell_width, "y": row * cell_height, "w": cell_width, "h": cell_height, "sourceRect": {k: source_rect[k] for k in ("x", "y", "w", "h")}, "packedAlpha16Margins": margins, "uniqueRGBAHash": hashlib.sha256(resized.tobytes()).hexdigest()})

candidate = OUT / "briar-foxglove-rebound-attempt-01-review.png"
atlas.save(candidate)
PREVIEW.mkdir(parents=True, exist_ok=True)
proof = Image.new("RGB", (atlas.width * 2 + 36, atlas.height + 48), "#d0d0d0")
draw = ImageDraw.Draw(proof)
for index, bg in enumerate(("#191919", "#f6f0df")):
    x = 12 + index * (atlas.width + 12)
    draw.rectangle((x, 0, x + atlas.width - 1, proof.height - 1), fill=bg)
    draw.text((x + 4, 6), "DARK" if index == 0 else "LIGHT", fill="#fff" if index == 0 else "#1b1b1b")
    proof.paste(atlas, (x, 28), atlas)
proof_path = OUT / "briar-foxglove-rebound-attempt-01-review-light-dark.png"
proof.save(proof_path)
report = {
    "status": "normalized review candidate only; no acceptance or production registration",
    "source": str(SOURCE.relative_to(ROOT)),
    "sourceSha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    "sourceGrid": "3x2; row-major source cells0-4; cell5 empty",
    "uniformScale": scale,
    "cell": {"width": cell_width, "height": cell_height, "columns": 3, "rows": 2, "baselineY": 94},
    "resampling": "LANCZOS; uniformly scaled complete alpha-isolated bodies; no redraw/reorder",
    "candidate": str(candidate.relative_to(ROOT)),
    "candidateSha256": hashlib.sha256(candidate.read_bytes()).hexdigest(),
    "lightDarkPreview": str(proof_path.relative_to(ROOT)),
    "lightDarkPreviewSha256": hashlib.sha256(proof_path.read_bytes()).hexdigest(),
    "frames": frames,
}
(OUT / "normalization-report.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({"candidate": str(candidate.relative_to(ROOT)), "size": atlas.size, "uniformScale": scale, "cellWidth": cell_width, "frames": len(frames)}))
