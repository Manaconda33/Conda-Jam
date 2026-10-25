"""Build a transparent review-only J.129 sheet from five reviewed Briar cutouts.

This candidate retains only the single alpha>=64 connected figure in each raw
image, then uniformly downsizes and places the original pixels in a 240x240
safe box. It does not draw, duplicate, mirror, or reorder poses, and it does not
register or pack production assets.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import find_objects, label

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "tools/generate-art/sources/j129-briar-foxglove-pickup-attempt13-normalized-sheet-candidate.png"
PROVENANCE = ROOT / "tools/generate-art/j129-briar-foxglove-pickup-attempt13-normalized-candidate.json"
FRAMES = [
    ("ready", "tools/generate-art/sources/j129-briar-foxglove-pickup-attempt13-pose0-retry-raw.png", "tools/generate-art/j129-briar-foxglove-pickup-attempt13-pose0-retry-prompt.md"),
    ("bend-reach", "tools/generate-art/sources/j129-briar-foxglove-pickup-attempt13-pose1-raw.png", "tools/generate-art/j129-briar-foxglove-pickup-attempt13-pose1-prompt.md"),
    ("low-reach", "tools/generate-art/sources/j129-briar-foxglove-pickup-attempt13-pose2-raw.png", "tools/generate-art/j129-briar-foxglove-pickup-attempt13-pose2-prompt.md"),
    ("grab", "tools/generate-art/sources/j129-briar-foxglove-pickup-attempt13-pose3-raw.png", "tools/generate-art/j129-briar-foxglove-pickup-attempt13-pose3-prompt.md"),
    ("recovery", "tools/generate-art/sources/j129-briar-foxglove-pickup-attempt13-pose4-retry-raw.png", "tools/generate-art/j129-briar-foxglove-pickup-attempt13-pose4-retry-prompt.md"),
]
CELL = 512
SAFE = 240
PAD = (CELL - SAFE) // 2
BASELINE = CELL - PAD


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def isolate(source_path: Path, name: str, pose: int) -> tuple[Image.Image, dict]:
    source = Image.open(source_path).convert("RGBA")
    pixels = np.asarray(source)
    alpha = pixels[:, :, 3]
    labels, count = label(alpha >= 64, structure=np.ones((3, 3), dtype=np.uint8))
    components = []
    for component, slices in enumerate(find_objects(labels), start=1):
        if slices is None:
            continue
        area = int(np.count_nonzero(labels[slices] == component))
        if area:
            components.append((area, component, slices))
    if count != 1 or len(components) != 1:
        raise ValueError(f"{name}: expected one figure component at alpha>=64; got {len(components)}")
    area, component, (ys, xs) = components[0]
    x0, y0, x1, y1 = int(xs.start), int(ys.start), int(xs.stop), int(ys.stop)
    crop = pixels[y0:y1, x0:x1].copy()
    crop[labels[y0:y1, x0:x1] != component, 3] = 0
    figure = Image.fromarray(crop, "RGBA")
    scale = SAFE / max(figure.width, figure.height)
    size = (max(1, round(figure.width * scale)), max(1, round(figure.height * scale)))
    figure = figure.resize(size, Image.Resampling.LANCZOS)
    x = pose % 3 * CELL + (CELL - figure.width) // 2
    row = pose // 3
    y = row * CELL + BASELINE - figure.height
    record = {
        "poseIndex": pose,
        "pose": name,
        "rawSource": str(source_path.relative_to(ROOT)),
        "rawSourceSha256": sha(source_path),
        "sourcePrompt": str((ROOT / next(p for n, _, p in FRAMES if n == name)).relative_to(ROOT)),
        "rawDimensions": list(source.size),
        "sourceComponent": component,
        "sourceComponentAlphaGte64Area": area,
        "sourceComponentBboxLTRB": [x0, y0, x1, y1],
        "componentIsolationThreshold": 64,
        "cleanup": "Keep the only 8-connected alpha>=64 figure component; remove all other alpha, including low-alpha exterior residue. No pose content is drawn, duplicated, mirrored, or reordered; the original component is uniformly resampled.",
        "uniformScale": scale,
        "normalizedFigureSize": list(size),
        "candidateCell": [pose % 3, row],
        "candidatePlacementXY": [x, y],
        "candidateMarginsLTRB": [x - pose % 3 * CELL, (pose % 3 + 1) * CELL - (x + figure.width), y - row * CELL, (row + 1) * CELL - (y + figure.height)],
    }
    return figure, record


def main() -> None:
    if OUTPUT.exists():
        raise FileExistsError(OUTPUT)
    sheet = Image.new("RGBA", (CELL * 3, CELL * 2), (0, 0, 0, 0))
    records = []
    for pose, (name, relative, _) in enumerate(FRAMES):
        path = ROOT / relative
        figure, record = isolate(path, name, pose)
        sheet.alpha_composite(figure, tuple(record["candidatePlacementXY"]))
        records.append(record)
    sheet.save(OUTPUT, "PNG", optimize=True)
    candidate_alpha = np.asarray(sheet)[:, :, 3]
    cell_counts = []
    for cell in range(6):
        row, column = divmod(cell, 3)
        a = candidate_alpha[row * CELL:(row + 1) * CELL, column * CELL:(column + 1) * CELL]
        ys, xs = np.where(a > 0)
        bbox = None if len(xs) == 0 else [int(xs.min()), int(ys.min()), int(xs.max() + 1), int(ys.max() + 1)]
        cell_counts.append({"cell": cell, "nonzeroAlpha": int((a > 0).sum()), "bboxLocal": bbox})
    if any(min(f["candidateMarginsLTRB"]) < PAD for f in records):
        raise AssertionError("A pose missed the 136px safe margin")
    if cell_counts[5]["nonzeroAlpha"] != 0:
        raise AssertionError("Unused cell5 is not fully transparent")
    provenance = {
        "issue": "J.129",
        "athlete": "briar-foxglove",
        "clip": "pickup",
        "status": "review-candidate-only; not accepted or packed",
        "layout": "3 columns x 2 rows, 512x512 cells; five unique original generated pose cutouts in row-major cells0-4; cell5 empty",
        "generationIds": ["exec-2d00ce2c-f477-4851-a2be-7f403e0fb180", "exec-84442fe6-99a8-48a1-9cc3-dd82d11f8c43", "exec-eda823be-4fc0-41b9-a64a-84f87803c501", "exec-1ea7125b-6705-46ff-99fc-624cd20f5cb0", "exec-e1c54d85-f133-4714-933b-6e6f02dd265f"],
        "candidateSource": str(OUTPUT.relative_to(ROOT)),
        "candidateSha256": sha(OUTPUT),
        "size": list(sheet.size),
        "cleanupPolicy": "Threshold-connected component isolation at alpha>=64, per-frame tight crop, uniform Lanczos downscale to <=240x240, center horizontally and align shoes to baseline y=376 in every 512px cell. All other source pixels are transparent in the candidate. No pose content was drawn, synthesized, duplicated, mirrored or reordered; each source figure is uniformly resampled.",
        "frames": records,
        "cellTransparency": cell_counts,
        "ball": "Absent from every sprite; separate athlete-specific runtime track remains required.",
        "review": {"status": "pending independent review", "packingAllowed": False},
    }
    PROVENANCE.write_text(json.dumps(provenance, indent=2) + "\n")
    print(f"Candidate sheet: {OUTPUT.relative_to(ROOT)} ({sheet.width}x{sheet.height}) SHA-256 {provenance['candidateSha256']}")
    print(f"Provenance: {PROVENANCE.relative_to(ROOT)}; cell5 alpha pixels {cell_counts[5]['nonzeroAlpha']}; minimum margins {min(min(f['candidateMarginsLTRB']) for f in records)}px")


if __name__ == "__main__":
    main()
