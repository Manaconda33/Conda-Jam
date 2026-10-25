#!/usr/bin/env python3
"""Isolate and align Piper's fifteen original dunk-power poses."""
from __future__ import annotations

import hashlib
import importlib.util
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / 'tools/generate-art/sources/piper-quickstep-dunk-power-attempt1-generated-raw.png'
OUTPUT = ROOT / 'tools/generate-art/sources/piper-quickstep-dunk-power-attempt1-clean-candidate.png'
LAYOUT = ROOT / 'tools/generate-art/piper-quickstep-dunk-power-attempt1-layouts.json'
PREVIEWS = ROOT / 'tools/generate-art/previews/piper-quickstep-dunk-power/attempt1-clean'
PACKER = ROOT / 'tools/generate-art/package-motion42.py'
spec = importlib.util.spec_from_file_location('motion42', PACKER)
motion42 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(motion42)


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    with Image.open(RAW) as opened:
        source = opened.convert('RGBA')
    rects = motion42.inspect_source(RAW, count=15, columns=5, isolate=True)
    crops = motion42.isolated_crops(RAW, rects)
    output = Image.new('RGBA', source.size, (0, 0, 0, 0))
    records = []
    for index, (rect, crop) in enumerate(zip(rects, crops)):
        row, column = divmod(index, 5)
        x0 = round(column * source.width / 5)
        x1 = round((column + 1) * source.width / 5)
        y0 = round(row * source.height / 3)
        y1 = round((row + 1) * source.height / 3)
        cell_width, cell_height = x1 - x0, y1 - y0
        bbox = crop.getchannel('A').point(lambda value: 255 if value > 8 else 0).getbbox()
        if bbox is None:
            raise ValueError(f'Pose {index} is empty after component isolation')
        crop = crop.crop(bbox)
        width, height = crop.size
        scale = min(255 / width, 290 / height, 1.0)
        size = (max(1, round(width * scale)), max(1, round(height * scale)))
        crop = crop.resize(size, Image.Resampling.LANCZOS)
        dx = x0 + (cell_width - size[0]) // 2
        dy = y1 - 24 - size[1]
        margins = [dx - x0, dy - y0, x1 - dx - size[0], y1 - dy - size[1]]
        if min(margins) < 22:
            raise ValueError(f'Pose {index} violates 22px cell clearance: {margins}')
        output.alpha_composite(crop, (dx, dy))
        records.append({
            'sourceIndex': index,
            'component': rect['component'],
            'rawBounds': [rect['x'], rect['y'], rect['x'] + rect['w'], rect['y'] + rect['h']],
            'destination': [dx, dy, size[0], size[1]],
            'uniformScale': round(scale, 6),
            'transparentMarginsLTRBpx': margins,
        })
    output.save(OUTPUT)
    layout = {
        'athlete': 'piper-quickstep',
        'clip': 'dunk-power',
        'attempt': 1,
        'rawSource': str(RAW.relative_to(ROOT)),
        'rawSourceSha256': sha(RAW),
        'cleanedSource': str(OUTPUT.relative_to(ROOT)),
        'cleanedSourceSha256': sha(OUTPUT),
        'size': [source.width, source.height],
        'layout': '5x3 row-major, fifteen complete original poses',
        'cleanup': 'Use alpha-connected component isolation at threshold >64 with the shared motion42 isolator to retain only each complete original Piper figure and its nearest antialiasing. Crop transparent halos, uniformly scale down to <=255x290, and bottom-align in the existing 5x3 source cells with a 24px baseline gutter. No pose pixels are drawn, synthesized, duplicated or reordered.',
        'frames': records,
    }
    LAYOUT.write_text(json.dumps(layout, indent=2) + '\n')
    PREVIEWS.mkdir(parents=True, exist_ok=True)
    for name, color in [('dark', (22, 24, 35, 255)), ('light', (244, 244, 244, 255))]:
        background = Image.new('RGBA', output.size, color)
        background.alpha_composite(output)
        background.convert('RGB').save(PREVIEWS / f'source-{name}.png')
    print(json.dumps({'rawSha256': layout['rawSourceSha256'], 'cleanedSha256': layout['cleanedSourceSha256'], 'frames': len(records), 'minimumMarginPx': min(min(x['transparentMarginsLTRBpx']) for x in records)}))


if __name__ == '__main__':
    main()
