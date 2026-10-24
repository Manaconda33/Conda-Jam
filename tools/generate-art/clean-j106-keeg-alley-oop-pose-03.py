#!/usr/bin/env python3
"""Clear sub-threshold atmospheric alpha from the reviewed J.106 pose03 source."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'tools/generate-art/sources/j106-keeg-alley-oop-power-pose-03-attempt-03-raw.png'
OUTPUT = ROOT / 'tools/generate-art/sources/j106-keeg-alley-oop-power-pose-03-attempt-03.png'
image = Image.open(SOURCE).convert('RGBA')
r, g, b, alpha = image.split()
alpha = alpha.point(lambda value: value if value > 16 else 0)
Image.merge('RGBA', (r, g, b, alpha)).save(OUTPUT)
print(f'Cleared only alpha values <= 16; original preserved at {SOURCE.relative_to(ROOT)}; cleaned sprite at {OUTPUT.relative_to(ROOT)}')
