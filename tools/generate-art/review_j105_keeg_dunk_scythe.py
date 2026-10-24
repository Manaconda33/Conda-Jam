from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = ROOT / 'tools' / 'generate-art' / 'sources'
PREVIEW_DIR = ROOT / 'artifacts' / 'native-render-preview'
PREVIEW_DIR.mkdir(parents=True, exist_ok=True)

for attempt in range(1, 7):
    source = SOURCE_DIR / f'j105-keeg-dunk-scythe-attempt-{attempt:02d}-rejected.png'
    if attempt >= 3:
        source = SOURCE_DIR / f'j105-keeg-dunk-scythe-attempt-{attempt:02d}-review.png'
    sheet = Image.open(source).convert('RGBA')
    width, height = sheet.size
    preview = Image.new('RGB', (width * 2, height), 'white')
    for panel, background in enumerate(((255, 255, 255), (8, 8, 12))):
        matte = Image.new('RGBA', sheet.size, (*background, 255))
        matte.alpha_composite(sheet)
        panel_image = matte.convert('RGB')
        draw = ImageDraw.Draw(panel_image)
        for col in range(1, 5):
            x = round(width * col / 5)
            draw.line((x, 0, x, height - 1), fill=(255, 55, 55), width=2)
        for row in range(1, 3):
            y = round(height * row / 3)
            draw.line((0, y, width - 1, y), fill=(255, 55, 55), width=2)
        preview.paste(panel_image, (panel * width, 0))
    preview.save(PREVIEW_DIR / f'j105-keeg-dunk-scythe-attempt-{attempt:02d}-review.png')
