"""Compose existing Pack Mama imagegen poses into a 7x6 source for the standard packer."""
import hashlib
import importlib.util
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
BASE = Path('/workspace/generated_images/exec-f0aa0fed-70ea-4379-b00e-17b749e6dcbe.png')
SUPPLEMENT = Path('/workspace/generated_images/exec-f090f611-d611-4375-985c-861c9bd795f3.png')
OUTPUT = Path('/workspace/generated_images/pack-mama-locomotion42-composite.png')
MAP = ROOT / 'tools/generate-art/pack-mama-locomotion-source-map.json'
PACKER = ROOT / 'tools/generate-art/package-motion42.py'
CELL = 300
BASELINE = 290

spec = importlib.util.spec_from_file_location('motion42', PACKER)
motion42 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(motion42)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def source_figures(path, count, columns, isolate):
    rectangles = motion42.inspect_source(path, count, columns, isolate=isolate)
    crops = motion42.isolated_crops(path, rectangles) if isolate else None
    if crops is None:
        from io import BytesIO
        with Image.open(path) as source:
            rgba = source.convert('RGBA')
            crops = [rgba.crop((r['x'], r['y'], r['x'] + r['w'], r['y'] + r['h'])) for r in rectangles]
    return crops, rectangles

base_crops, base_rects = source_figures(BASE, 35, 7, True)
extra_crops, extra_rects = source_figures(SUPPLEMENT, 8, 4, False)
# Complete source groups: idle(0..5), ready(7..10), dribble(11..20).
# Running groups combine seven main poses with four new, distinct strides.
entries = []
for clip, indices in [('idle', range(0, 6)), ('idle-ball', range(7, 11)), ('dribble', range(11, 21))]:
    entries.extend((clip, 'base', index) for index in indices)
entries.extend(('run', 'base', index) for index in range(21, 28))
entries.extend(('run', 'supplement', index) for index in range(0, 4))
entries.extend(('dribble-run', 'base', index) for index in range(28, 35))
entries.extend(('dribble-run', 'supplement', index) for index in range(4, 8))
if len(entries) != 42:
    raise ValueError(f'Expected42 unique poses, found{len(entries)}')
if len({(source, index) for _, source, index in entries}) != 42:
    raise ValueError('A source pose was duplicated')

# Downsample supplements to the largest matching main-source action height so
# all runs share a consistent character scale; do not enlarge any source art.
group_max = {
    'run': max(base_rects[i]['h'] for i in range(21, 28)),
    'dribble-run': max(base_rects[i]['h'] for i in range(28, 35)),
}
canvas = Image.new('RGBA', (7 * CELL, 6 * CELL), (0, 0, 0, 0))
records = []
for out_index, (clip, source_key, source_index) in enumerate(entries):
    crop = (base_crops if source_key == 'base' else extra_crops)[source_index].convert('RGBA')
    original_size = crop.size
    source_rect = (base_rects if source_key == 'base' else extra_rects)[source_index]
    scale = 1.0
    if source_key == 'supplement':
        scale = min(1.0, group_max[clip] / crop.height)
    if crop.width * scale > CELL - 60:
        scale = min(scale, (CELL - 60) / crop.width)
    size = (max(1, round(crop.width * scale)), max(1, round(crop.height * scale)))
    if size != crop.size:
        crop = crop.resize(size, Image.Resampling.LANCZOS)
    col, row = out_index % 7, out_index // 7
    x = col * CELL + (CELL - crop.width) // 2
    y = row * CELL + BASELINE - crop.height
    canvas.alpha_composite(crop, (x, y))
    records.append({
        'outputIndex': out_index,
        'clip': clip,
        'source': str(BASE if source_key == 'base' else SUPPLEMENT),
        'sourceSha256': digest(BASE if source_key == 'base' else SUPPLEMENT),
        'sourceIndex': source_index,
        'sourceRect': {key: source_rect[key] for key in ('x', 'y', 'w', 'h')},
        'sourceGrid': [7, 5] if source_key == 'base' else [4, 2],
        'componentIsolated': source_key == 'base',
        'originalCropSize': list(original_size),
        'compositeCropSize': list(crop.size),
        'uniformScale': scale,
        'compositeCell': [col, row, CELL, CELL],
        'compositeFigureRect': [x, y, crop.width, crop.height],
        'sourcePixelSha256': hashlib.sha256(crop.tobytes()).hexdigest(),
    })

alpha = np.asarray(canvas.getchannel('A'))
if alpha.min() != 0 or alpha.max() < 240:
    raise ValueError('Composite must retain transparent pixels and opaque character pixels')
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
canvas.save(OUTPUT, 'PNG', optimize=True)
MAP.write_text(json.dumps({
    'athlete': 'pack-mama', 'canonicalSection': 'K.33', 'generatedAt': '2026-10-22T03:00:00Z',
    'sourceImages': [{'path': str(BASE), 'sha256': digest(BASE)}, {'path': str(SUPPLEMENT), 'sha256': digest(SUPPLEMENT)}],
    'composite': str(OUTPUT), 'compositeSha256': digest(OUTPUT), 'canvas': list(canvas.size),
    'cell': [CELL, CELL], 'baseline': BASELINE, 'poses': records,
    'packing': 'Preserve selected imagegen pixels, nearest-component isolate the 35-pose sheet, uniformly downsample eight supplemental run poses to matching action heights, place complete bodies in transparent cells. No frame is drawn, mirrored, duplicated, or interpolated.'
}, indent=2) + '\n')
print(f'Composed42 imagegen poses: {OUTPUT}')
