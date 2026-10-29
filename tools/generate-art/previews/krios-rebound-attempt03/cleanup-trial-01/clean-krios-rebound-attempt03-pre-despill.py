#!/usr/bin/env python3
"""Isolate and normalize Krios J.128 rebound attempt03 without redrawing."""
from __future__ import annotations
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / 'tools/generate-art/sources/krios-rebound-attempt03-generated-raw.png'
OUT = ROOT / 'tools/generate-art/previews/krios-rebound-attempt03'
OUT.mkdir(parents=True, exist_ok=True)
raw = Image.open(RAW).convert('RGB')
pixels = np.asarray(raw)
r, g, b = pixels.transpose(2, 0, 1)
background = (g > r + 70) & (g > b + 70) & (g > 100)
labels, count = ndimage.label(~background, structure=np.ones((3, 3), dtype=np.uint8))
sizes = np.bincount(labels.ravel())
sizes[0] = 0
largest = np.argsort(sizes)[-5:][::-1]
if len(largest) != 5 or min(sizes[largest]) < 10000:
    raise SystemExit(f'Expected five full athlete components; got {sizes[largest].tolist()}')

figures = []
for label in largest:
    ys, xs = np.where(labels == label)
    figures.append({
        'label': int(label), 'area': int(sizes[label]),
        'sourceRect': [int(xs.min()), int(ys.min()), int(xs.max() + 1), int(ys.max() + 1)],
        'centerX': float(xs.mean()),
    })
figures.sort(key=lambda figure: figure['centerX'])
frames = []
for index, figure in enumerate(figures):
    x0, y0, x1, y1 = figure['sourceRect']
    owned = labels[y0:y1, x0:x1] == figure['label']
    rgba = np.zeros((y1 - y0, x1 - x0, 4), dtype=np.uint8)
    rgba[owned, :3] = pixels[y0:y1, x0:x1][owned]
    rgba[owned, 3] = 255
    frame = Image.fromarray(rgba, 'RGBA')
    path = OUT / f'pose-{index:02d}-isolated.png'
    frame.save(path)
    figure['poseIndex'] = index
    figure['isolatedFile'] = path.relative_to(ROOT).as_posix()
    figure['isolatedSha256'] = hashlib.sha256(path.read_bytes()).hexdigest()
    figure['size'] = list(frame.size)
    frames.append(frame)

if len({hashlib.sha256(frame.tobytes()).hexdigest() for frame in frames}) != 5:
    raise SystemExit('Duplicate isolated poses detected')

# One uniform nearest-neighbour scale preserves the generated stepped pixel art.
# All source feet share a common floor line near y=717; retaining that world-space
# reference keeps the two airborne poses visibly above the ground baseline.
scale = min(112 / max(frame.width for frame in frames), 82 / max(frame.height for frame in frames))
source_floor = 717
cell_w, cell_h, baseline = 128, 96, 94
atlas = Image.new('RGBA', (cell_w * 5, cell_h), (0, 0, 0, 0))
packed = []
for index, (frame, figure) in enumerate(zip(frames, figures)):
    size = (max(1, round(frame.width * scale)), max(1, round(frame.height * scale)))
    resized = frame.resize(size, Image.Resampling.NEAREST)
    source_top = figure['sourceRect'][1]
    x = index * cell_w + (cell_w - size[0]) // 2
    y = round(baseline - (source_floor - source_top) * scale)
    if x < index * cell_w or x + size[0] > (index + 1) * cell_w or y < 0 or y + size[1] > cell_h:
        raise SystemExit(f'Pose {index} exceeds its 128x96 cell: {(x, y, *size)}')
    atlas.alpha_composite(resized, (x, y))
    packed.append({
        'index': index, 'x': index * cell_w, 'y': 0, 'w': cell_w, 'h': cell_h,
        'visibleRect': [x - index * cell_w, y, *size], 'sourceRect': figure['sourceRect'],
        'sha256': hashlib.sha256(atlas.crop((index * cell_w, 0, (index + 1) * cell_w, cell_h)).tobytes()).hexdigest(),
    })

atlas_path = OUT / 'krios-rebound-attempt03-runtime-candidate.png'
atlas.save(atlas_path)
logical = Image.new('RGBA', (3 * 384, 2 * 288), (0, 0, 0, 0))
for index, item in enumerate(packed):
    x0 = item['x'] + item['visibleRect'][0]
    y0 = item['visibleRect'][1]
    w, h = item['visibleRect'][2:]
    cell = atlas.crop((x0, y0, x0 + w, y0 + h))
    col, row = index % 3, index // 3
    logical.alpha_composite(cell.resize((w * 3, h * 3), Image.Resampling.NEAREST), (col * 384 + (384 - w * 3) // 2, row * 288 + 264 - h * 3))
logical.save(OUT / 'krios-rebound-attempt03-logical-layout.png')
for name, color in [('light', (240, 243, 248, 255)), ('dark', (24, 29, 39, 255))]:
    preview = Image.new('RGBA', atlas.size, color)
    preview.alpha_composite(atlas)
    preview.convert('RGB').save(OUT / f'krios-rebound-attempt03-{name}-preview.png')

report = {
    'source': RAW.relative_to(ROOT).as_posix(),
    'sourceSha256': hashlib.sha256(RAW.read_bytes()).hexdigest(),
    'sourceDimensions': list(raw.size),
    'algorithm': 'green dominance mask g>r+70 and g>b+70 and g>100; 8-connected components; five largest full-figure components; row-major order; no redraw or despill edits; uniform nearest-neighbour scaling',
    'backgroundPixelShare': float(background.mean()),
    'foregroundConnectedComponentCount': int(count),
    'poseCount': len(frames),
    'uniquePoseHashes': len({hashlib.sha256(frame.tobytes()).hexdigest() for frame in frames}),
    'uniformScale': scale,
    'sourceFloorY': source_floor,
    'nativeCell': [cell_w, cell_h],
    'baseline': baseline,
    'despilledNativePixels': 0,
    'frames': figures,
    'packedFrames': packed,
    'rejectedComponents': [int(label) for label in range(1, count + 1) if label not in largest and sizes[label] > 0],
    'candidateAtlas': atlas_path.relative_to(ROOT).as_posix(),
    'candidateAtlasSha256': hashlib.sha256(atlas_path.read_bytes()).hexdigest(),
}
(OUT / 'cleanup-layout-report.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({key: report[key] for key in ('poseCount', 'uniquePoseHashes', 'uniformScale', 'sourceFloorY', 'nativeCell', 'baseline', 'backgroundPixelShare', 'foregroundConnectedComponentCount', 'candidateAtlasSha256')}, indent=2))
