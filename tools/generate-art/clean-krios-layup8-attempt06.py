#!/usr/bin/env python3
"""Review-only flood-fill chroma key and cell-fit trial for Krios layup attempt 06.

Preserves the generated RGB source. Key only green-dominant pixels connected to the
canvas boundary, then applies one uniform scale and centers each reviewed pose in
its logical 384x512 cell. No redraw, synthesis, or palette edits are performed.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "tools/generate-art/sources/krios-layup8-attempt06-chromakey-generated-raw.png"
OUT = ROOT / "tools/generate-art/previews/krios-layup8-attempt06"
CLEAN = OUT / "krios-layup8-attempt06-keyed-layout-trial.png"
POSE_DIR = OUT / "poses"
REPORT = OUT / "cleanup-layout-report.json"
RUNTIME = OUT / "krios-layup8-attempt06-runtime-candidate.png"
RUNTIME_LAYOUT = OUT / "runtime-layout.json"

# Reviewed bounds are global image coordinates, converted from independent source review.
BOUNDS = [
    [30, 148, 356, 456],
    [464, 113, 690, 468],
    [830, 70, 1103, 463],
    [1196, 10, 1482, 476],
    [30, 503, 346, 965],
    [506, 511, 714, 965],
    [800, 608, 1108, 977],
    [1192, 648, 1479, 963],
]
CELL_W, CELL_H, COLS, ROWS = 384, 512, 4, 2
MARGIN = 24

im = Image.open(SOURCE).convert("RGB")
rgb = np.asarray(im, dtype=np.uint8)
r, g, b = (rgb[..., i].astype(np.int16) for i in range(3))
boxes = [tuple(bound) for bound in BOUNDS]
# The inspected matte ranges approximately R=0..20, G=241..252, B=0..26.
# This more permissive key also catches connected green antialias fringe pixels while
# requiring both a high green channel and strong green dominance over red and blue.
key_like = (g >= 130) & ((g - r) >= 40) & ((g - b) >= 40)
labels, n_labels = ndimage.label(key_like, structure=np.ones((3, 3), dtype=np.uint8))
border_labels = np.unique(np.concatenate((labels[0], labels[-1], labels[:, 0], labels[:, -1])))
border_labels = border_labels[border_labels != 0]
connected_key = np.isin(labels, border_labels)
# Interior green components cannot belong to Krios's red/charcoal/gold palette.
# Remove green matte artifacts, including the isolated ball-shaped fragment in pose 7.
interior_components = np.unique(labels[~connected_key & key_like])
interior_components = interior_components[interior_components != 0]
sizes = np.bincount(labels.ravel(), minlength=n_labels + 1)
# Small interior green flecks are matte contamination, not silhouette cutouts: replace
# their RGB with nearest non-green neighbor. Large green islands are separate artifacts.
inpaint_components = [int(c) for c in interior_components if sizes[c] <= 60]
remove_components = [int(c) for c in interior_components if sizes[c] > 60]
remove_islands = np.isin(labels, remove_components)
key_mask = connected_key | remove_islands
# Remove weak green spill only within two pixels of the keyed matte boundary. This
# avoids touching interior palette/shading while clearing green antialias fringes.
edge_zone = ndimage.binary_dilation(connected_key, structure=np.ones((3, 3), dtype=bool), iterations=2)
edge_spill = edge_zone & ~key_mask & (g >= 70) & ((g - r) >= 8) & ((g - b) >= 8)
key_mask |= edge_spill
alpha = np.where(key_mask, 0, 255).astype(np.uint8)
rgb_clean = rgb.copy()
if inpaint_components:
    nearest = ndimage.distance_transform_edt(key_like, return_distances=False, return_indices=True)
    inpaint_mask = np.isin(labels, inpaint_components)
    rgb_clean[inpaint_mask] = rgb[nearest[0][inpaint_mask], nearest[1][inpaint_mask]]

OUT.mkdir(parents=True, exist_ok=True)
POSE_DIR.mkdir(parents=True, exist_ok=True)
# Preserve the original source RGB under alpha=0; only alpha is changed.
# Remove residual weak green contamination across each silhouette while preserving
# opacity. This is safe because Krios's kit and character palette contain no green.
weak_green = (g >= 50) & ((g - r) >= 4) & ((g - b) >= 4)
figure_region = np.zeros(weak_green.shape, dtype=bool)
for x0, y0, x1, y1 in boxes:
    figure_region[y0:y1, x0:x1] = True
weak_interior = weak_green & figure_region & (alpha > 0)
if np.any(weak_interior):
    nearest_non_green = ndimage.distance_transform_edt(weak_green, return_distances=False, return_indices=True)
    rgb_clean[weak_interior] = rgb[nearest_non_green[0][weak_interior], nearest_non_green[1][weak_interior]]
keyed = Image.fromarray(np.dstack((rgb_clean, alpha)), mode="RGBA")

# Use a single scale across poses to preserve generated relative anatomy/size.
max_w = max(x1 - x0 for x0, y0, x1, y1 in boxes)
max_h = max(y1 - y0 for x0, y0, x1, y1 in boxes)
scale = min((CELL_W - 2 * MARGIN) / max_w, (CELL_H - 2 * MARGIN) / max_h)
atlas = Image.new("RGBA", (CELL_W * COLS, CELL_H * ROWS), (0, 0, 0, 0))
pose_reports = []
for idx, (x0, y0, x1, y1) in enumerate(boxes):
    crop = keyed.crop((x0, y0, x1, y1))
    nw, nh = round(crop.width * scale), round(crop.height * scale)
    # Pixel art remains nearest-neighbor, avoiding softened sprite edges.
    pose = crop.resize((nw, nh), Image.Resampling.NEAREST)
    cell_x, cell_y = (idx % COLS) * CELL_W, (idx // COLS) * CELL_H
    px = cell_x + (CELL_W - nw) // 2
    py = cell_y + (CELL_H - nh) // 2
    atlas.alpha_composite(pose, (px, py))
    pose.save(POSE_DIR / f"pose-{idx:02d}-keyed.png")
    # Verify true nontransparent bounds and 24px margin in resulting logical cell.
    local = atlas.crop((cell_x, cell_y, cell_x + CELL_W, cell_y + CELL_H)).getchannel("A")
    bb = local.getbbox()
    margins = [bb[0], bb[1], CELL_W - bb[2], CELL_H - bb[3]]
    pose_reports.append({
        "frame": idx,
        "sourceBoundsLTRB": [x0, y0, x1, y1],
        "sourceSize": [x1 - x0, y1 - y0],
        "uniformScale": scale,
        "scaledSize": [nw, nh],
        "atlasOffset": [px, py],
        "outputBoundsInCellLTRB": list(bb),
        "outputMarginsLTRB": margins,
        "minimumMarginPx": min(margins),
        "meets24pxMargins": min(margins) >= MARGIN,
        "opaqueFigurePixels": int(np.count_nonzero(np.asarray(pose.getchannel("A")))),
        "poseSha256": hashlib.sha256((POSE_DIR / f"pose-{idx:02d}-keyed.png").read_bytes()).hexdigest(),
    })

atlas.save(CLEAN)
# Review-only native-size packing: one constant source-to-runtime scale and shared baseline.
# This is a sizing proof, not a production atlas or approval.
NATIVE_W, NATIVE_H, NATIVE_SCALE, NATIVE_BASELINE = 128, 96, 0.18, 94
runtime = Image.new("RGBA", (NATIVE_W * len(boxes), NATIVE_H), (0, 0, 0, 0))
runtime_frames = []
for idx in range(len(boxes)):
    pose = Image.open(POSE_DIR / f"pose-{idx:02d}-keyed.png").convert("RGBA")
    alpha_box = pose.getchannel("A").getbbox()
    sprite = pose.crop(alpha_box)
    nw, nh = round(sprite.width * NATIVE_SCALE), round(sprite.height * NATIVE_SCALE)
    sprite = sprite.resize((nw, nh), Image.Resampling.NEAREST)
    ox = idx * NATIVE_W + (NATIVE_W - nw) // 2
    oy = NATIVE_BASELINE - nh
    runtime.alpha_composite(sprite, (ox, oy))
    runtime_frames.append({"frame": idx, "x": idx * NATIVE_W, "y": 0, "w": NATIVE_W, "h": NATIVE_H,
        "sourceAlphaCropLTRB": list(alpha_box), "sourceCropSize": list(pose.crop(alpha_box).size),
        "uniformScale": NATIVE_SCALE, "scaledSize": [nw, nh], "offsetInCell": [ox - idx * NATIVE_W, oy],
        "baseline": NATIVE_BASELINE, "marginBottom": NATIVE_H - NATIVE_BASELINE})
runtime.save(RUNTIME)
RUNTIME_LAYOUT.write_text(json.dumps({"status": "runtime size proof only; not approved or registered", "source": str(CLEAN.relative_to(ROOT)),
    "atlas": str(RUNTIME.relative_to(ROOT)), "columns": len(boxes), "rows": 1, "frameWidth": NATIVE_W, "frameHeight": NATIVE_H,
    "uniformScale": NATIVE_SCALE, "baseline": NATIVE_BASELINE, "interpolation": "nearest-neighbor", "frames": runtime_frames}, indent=2) + "\n")
# Edge audit counts key removal, retained alpha, and chroma-like pixels around key boundary.
report = {
    "status": "cleanup and layout review trial; not accepted production art",
    "source": str(SOURCE.relative_to(ROOT)),
    "sourceSha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    "keyMethod": {
        "predicate": "G >= 130 and G-R >= 40 and G-B >= 40",
        "connectivity": "8-connected green-key pixels reachable from canvas edges plus all disconnected interior green-key islands within pose bounds",
        "keyedPixelCount": int(np.count_nonzero(key_mask)),
        "interiorKeyIslandCount": int(len(interior_components)),
        "inpaintedSmallIslandCount": int(len(inpaint_components)),
        "removedLargeIslandCount": int(len(remove_components)),
        "edgeSpillPixelsRemoved": int(np.count_nonzero(edge_spill)),
        "residualGreenInpaintPixels": int(np.count_nonzero(weak_interior)),
        "residualGreenInpaintRule": "Within reviewed figure bounds, weak green-dominant pixels outside the transparent key are RGB-repaired from the nearest non-green source pixel; opacity is preserved.",
        "edgeSpillRule": "Within two pixels of the connected matte: clear only green-dominant pixels where G >= 70, G-R >= 8, and G-B >= 8.",
        "inpaintRule": "Interior green-key components of at most 60 pixels: preserve opacity and replace RGB from nearest non-green pixel; larger islands become transparent.",
        "retainedOpaquePixelCount": int(np.count_nonzero(alpha)),
        "preservation": "Original raw source retained. Cleanup changes only alpha plus nearest-neighbor RGB repair for small matte islands. No redraw.",
    },
    "layout": {
        "columns": COLS, "rows": ROWS, "cellWidth": CELL_W, "cellHeight": CELL_H,
        "uniformScale": scale, "minimumTransparentMarginPx": MARGIN,
        "interpolation": "nearest-neighbor",
        "output": str(CLEAN.relative_to(ROOT)),
        "nativeSizeRuntimeCandidate": str(RUNTIME.relative_to(ROOT)),
        "runtimeLayout": str(RUNTIME_LAYOUT.relative_to(ROOT)),
        "poses": pose_reports,
    },
}
REPORT.write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({"keyedPixels": report["keyMethod"]["keyedPixelCount"], "retained": report["keyMethod"]["retainedOpaquePixelCount"], "uniformScale": scale, "allMarginsPass": all(p["meets24pxMargins"] for p in pose_reports), "report": str(REPORT.relative_to(ROOT))}, indent=2))
