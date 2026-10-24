#!/usr/bin/env python3
"""Isolate and align Keeg's fifteen original reverse-dunk poses."""
from __future__ import annotations
import hashlib
import importlib.util
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / 'tools/generate-art/sources/j100-keeg-dunk-reverse-generated-raw.png'
OUTPUT = ROOT / 'tools/generate-art/sources/j100-keeg-dunk-reverse15.png'
LAYOUT = ROOT / 'tools/generate-art/j100-keeg-dunk-reverse-cleanup-layout.json'
PACKER = ROOT / 'tools/generate-art/package-motion42.py'
spec = importlib.util.spec_from_file_location('motion42', PACKER)
motion42 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(motion42)


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    source = Image.open(RAW).convert('RGBA')
    rects = motion42.inspect_source(RAW, count=15, columns=5, isolate=True)
    crops = motion42.isolated_crops(RAW, rects)
    output = Image.new('RGBA', source.size, (0, 0, 0, 0))
    records = []
    for index, (rect, crop) in enumerate(zip(rects, crops)):
        row, column = divmod(index, 5)
        x0, x1 = round(column * source.width / 5), round((column + 1) * source.width / 5)
        y0, y1 = round(row * source.height / 3), round((row + 1) * source.height / 3)
        cell_width, cell_height = x1 - x0, y1 - y0
        bbox = crop.getchannel('A').point(lambda value: 255 if value > 8 else 0).getbbox()
        if bbox is None:
            raise ValueError(f'Pose {index} is empty after component isolation')
        crop = crop.crop(bbox)
        width, height = crop.size
        scale = min(cell_width * .84 / width, cell_height * .88 / height, 1.0)
        size = (max(1, round(width * scale)), max(1, round(height * scale)))
        crop = crop.resize(size, Image.Resampling.LANCZOS)
        dx = x0 + (cell_width - size[0]) // 2
        dy = y1 - 11 - size[1]
        output.alpha_composite(crop, (dx, dy))
        margins = [dx - x0, dy - y0, x1 - dx - size[0], y1 - dy - size[1]]
        if min(margins) < 10:
            raise ValueError(f'Pose {index} violates 10px sheet-cell clearance: {margins}')
        records.append({'sourceIndex': index, 'component': rect['component'],
                        'rawBounds': [rect['x'], rect['y'], rect['x'] + rect['w'], rect['y'] + rect['h']],
                        'destination': [dx, dy, size[0], size[1]], 'scale': round(scale, 6),
                        'marginsPx': margins})
    output.save(OUTPUT)
    layout = {'source': str(RAW.relative_to(ROOT)), 'sourceSha256': sha(RAW),
              'cleanedSource': str(OUTPUT.relative_to(ROOT)), 'cleanedSourceSha256': sha(OUTPUT),
              'method': 'detect 15 alpha-connected figures; assign only each figure component and its nearest antialiased pixels; crop transparent halos; uniformly scale while preserving aspect; center in a 5x3 grid and bottom align with at least10px cell clearance',
              'frames': records}
    LAYOUT.write_text(json.dumps(layout, indent=2) + '\n')
    print(json.dumps({'rawSha256': layout['sourceSha256'], 'cleanedSha256': layout['cleanedSourceSha256'],
                      'frames': len(records), 'minimumMarginPx': min(min(x['marginsPx']) for x in records)}))


if __name__ == '__main__':
    main()
