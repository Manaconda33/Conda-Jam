#!/usr/bin/env python3
"""Remove detached background and uniformly normalize the ten original poses."""
from pathlib import Path
import json
import hashlib
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, find_objects, label

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'tools/generate-art/sources/marco-vellum-shoot-attempt4-rejected.png'
OUTPUT = ROOT / 'tools/generate-art/sources/marco-vellum-shoot-attempt4-clean.png'
SCALE = 0.78
CELL_W, CELL_H = 307, 512
SAFE_W, SAFE_H = 247, 372


def main():
    image = Image.open(SOURCE).convert('RGBA')
    if image.size != (1536, 1024):
        raise ValueError(f'Unexpected sheet size: {image.size}')
    source = np.asarray(image)
    output = Image.new('RGBA', (CELL_W * 5, CELL_H * 2), (0, 0, 0, 0))
    records = []
    for index in range(10):
        row, column = divmod(index, 5)
        x0, y0 = column * CELL_W, row * CELL_H
        cell = source[y0:y0 + CELL_H, x0:x0 + CELL_W].copy()
        components, count = label(cell[:, :, 3] >= 64, structure=np.ones((3, 3), dtype=np.uint8))
        objects = find_objects(components)
        sizes = [int(np.count_nonzero(components[obj] == i)) if obj else 0 for i, obj in enumerate(objects, 1)]
        if not sizes or max(sizes) < 10000:
            raise ValueError(f'Cell {index} has no complete athlete component')
        component = int(np.argmax(sizes)) + 1
        core = components == component
        ys, xs = np.where(core)
        x1, x2 = int(xs.min()), int(xs.max()) + 1
        y1, y2 = int(ys.min()), int(ys.max()) + 1
        body = cell[y1:y2, x1:x2].copy()
        local_core = core[y1:y2, x1:x2]
        fringe_distance = distance_transform_edt(~local_core)
        body[~(local_core | ((body[:, :, 3] > 0) & (fringe_distance <= 2))), 3] = 0
        body_image = Image.fromarray(body, mode='RGBA')
        resized = body_image.resize((max(1, round(body_image.width * SCALE)), max(1, round(body_image.height * SCALE))), Image.Resampling.LANCZOS)
        if resized.width > SAFE_W or resized.height > SAFE_H:
            raise ValueError(f'Uniform scale leaves pose {index} outside the safe area')
        px = x0 + (CELL_W - resized.width) // 2
        py = y0 + (CELL_H - resized.height) // 2
        output.alpha_composite(resized, (px, py))
        records.append({
            'index': index,
            'sourceBounds': [x1, y1, x2, y2],
            'sourceCorePixels': int(local_core.sum()),
            'uniformScale': SCALE,
            'outputBounds': [px - x0, py - y0, px - x0 + resized.width, py - y0 + resized.height],
            'margins': [px - x0, CELL_W - (px - x0 + resized.width), py - y0, CELL_H - (py - y0 + resized.height)],
            'removedDetachedComponents': max(0, count - 1),
        })
    output.save(OUTPUT)
    report = {
        'source': str(SOURCE.relative_to(ROOT)),
        'sourceSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
        'output': str(OUTPUT.relative_to(ROOT)),
        'outputSha256': hashlib.sha256(OUTPUT.read_bytes()).hexdigest(),
        'method': 'Per-cell largest alpha>=64 athlete component plus2px antialias fringe; uniform 0.78 scale for all ten figures; center within each original cell. No pose pixels are redrawn or invented.',
        'poses': records,
    }
    report_path = ROOT / 'tools/generate-art/marco-vellum-shoot-attempt4-cleanup.json'
    report_path.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({'output': report['output'], 'sha256': report['outputSha256'], 'poses': len(records), 'minimumMargins': [min(r['margins'][i] for r in records) for i in range(4)]}))


if __name__ == '__main__':
    main()
