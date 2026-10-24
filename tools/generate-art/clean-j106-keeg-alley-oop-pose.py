#!/usr/bin/env python3
"""Clear faint generated background alpha for a pose while preserving its raw source."""
import argparse
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser()
parser.add_argument('index', type=int)
parser.add_argument('--attempt', default='01')
args = parser.parse_args()
base = f'j106-keeg-alley-oop-power-pose-{args.index:02d}-attempt-{args.attempt}'
source = ROOT / 'tools/generate-art/sources' / f'{base}-raw.png'
output = ROOT / 'tools/generate-art/sources' / f'{base}.png'
image = Image.open(source).convert('RGBA')
r, g, b, alpha = image.split()
alpha = alpha.point(lambda value: value if value > 16 else 0)
Image.merge('RGBA', (r, g, b, alpha)).save(output)
print(f'Cleared alpha values <= 16; preserved raw {source.relative_to(ROOT)}; wrote {output.relative_to(ROOT)}')
