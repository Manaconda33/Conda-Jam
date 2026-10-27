"""Remove detached warm background glow from Briar rebound attempt01."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import binary_dilation, find_objects, label


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "tools/generate-art/sources/j136-briar-foxglove-rebound-attempt-01-raw.png"
OUT = ROOT / "tools/generate-art/candidates/j136-briar-foxglove-rebound-attempt-01"
PREVIEW = ROOT / "tools/generate-art/previews/j136-briar-foxglove-rebound"
OUT.mkdir(parents=True, exist_ok=True)
PREVIEW.mkdir(parents=True, exist_ok=True)

source = Image.open(SOURCE).convert("RGBA")
pixels = np.asarray(source)
alpha = pixels[:, :, 3]
if source.size != (1536, 1024) or int(alpha.min()) != 0:
    raise SystemExit(f"Unexpected raw canvas/transparency: {source.size}, alpha={alpha.min()}..{alpha.max()}")

components, count = label(alpha >= 64, structure=np.ones((3, 3), dtype=np.uint8))
large = []
for component, slices in enumerate(find_objects(components), start=1):
    if slices is None:
        continue
    area = int(np.count_nonzero(components[slices] == component))
    if area >= 500:
        ys, xs = slices
        large.append({"component": component, "area": area, "bbox": [int(xs.start), int(ys.start), int(xs.stop), int(ys.stop)]})
if len(large) != 5:
    raise SystemExit(f"Expected five body components at alpha>=64, found {len(large)}")

cell_w, cell_h = source.width // 3, source.height // 2
frames = {}
for body in large:
    x0, y0, x1, y1 = body["bbox"]
    col = min(2, (x0 + x1) // 2 // cell_w)
    row = min(1, (y0 + y1) // 2 // cell_h)
    frame = row * 3 + col
    if frame in frames or frame >= 5:
        raise SystemExit(f"Duplicate/invalid source cell for component {body['component']}: frame {frame}")
    frames[frame] = body
if set(frames) != set(range(5)):
    raise SystemExit(f"Expected ordered source cells 0-4; found {sorted(frames)}")

keep = np.zeros_like(alpha, dtype=bool)
for body in large:
    keep |= binary_dilation(components == body["component"], structure=np.ones((3, 3), dtype=bool))
clean = pixels.copy()
clean[~keep, 3] = 0
cleaned = Image.fromarray(clean, "RGBA")
candidate = OUT / "briar-foxglove-rebound-attempt-01-clean-candidate.png"
cleaned.save(candidate)

gutter, label_h = 18, 28
panel_w = cleaned.width + 2 * gutter
panel_h = cleaned.height + 2 * gutter + label_h
proof = Image.new("RGB", (panel_w * 2, panel_h), "#d0d0d0")
draw = ImageDraw.Draw(proof)
for index, bg in enumerate(("#191919", "#f6f0df")):
    x = index * panel_w
    draw.rectangle((x, 0, x + panel_w - 1, panel_h - 1), fill=bg)
    draw.text((x + gutter, 6), "DARK BACKGROUND" if index == 0 else "LIGHT BACKGROUND", fill="#fff" if index == 0 else "#1b1b1b")
    proof.paste(cleaned, (x + gutter, label_h + gutter), cleaned)
proof_path = PREVIEW / "j136-briar-foxglove-rebound-attempt-01-clean-light-dark.png"
proof.save(proof_path)

report = {
    "source": str(SOURCE.relative_to(ROOT)),
    "sourceSha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    "sourceDimensions": list(source.size),
    "method": "Label alpha>=64 with 8-connectivity; retain five >=500px body components and their original alpha within a 1px dilation for antialiasing; set all other pixels transparent.",
    "noRedrawOrReorder": True,
    "componentsAtAlpha64": int(count),
    "retainedBodyComponents": [frames[i] for i in range(5)],
    "sourceGrid": {"columns": 3, "rows": 2, "emptyCell": 5, "rowMajorFrames": list(range(5))},
    "candidate": str(candidate.relative_to(ROOT)),
    "candidateSha256": hashlib.sha256(candidate.read_bytes()).hexdigest(),
    "lightDarkPreview": str(proof_path.relative_to(ROOT)),
    "lightDarkPreviewSha256": hashlib.sha256(proof_path.read_bytes()).hexdigest(),
    "status": "cleanup candidate; pending independent source review",
}
(OUT / "cleanup-report.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({"candidate": str(candidate.relative_to(ROOT)), "componentsAtAlpha64": count, "retainedBodies": len(large), "size": source.size}))
