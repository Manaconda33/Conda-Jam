"""Render a diagnostic ball-position overlay on the isolated Keeg pose cells.

This is a review aid, not artwork or a runtime atlas. The pixel projection is
provisional and must be confirmed in the native renderer before registration.
"""
import json
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
PROVENANCE = ROOT / "tools/generate-art/j105-keeg-dunk-scythe-provenance.json"
OUT = ROOT / "artifacts/native-render-preview/j105-keeg-dunk-scythe-ball-track-review.png"
TRACK = json.loads(PROVENANCE.read_text())["plannedBallTrack"]
HEIGHT = TRACK["height"]
FORWARD = TRACK["forward"]
RELEASE = TRACK["releasePoseIndex"]
CELL_W, CELL_H, LABEL_H, COLUMNS = 128, 96, 18, 5
PANEL_W = CELL_W * COLUMNS
ROWS = 3
sheet = Image.new("RGB", (PANEL_W * 2, ROWS * (CELL_H + LABEL_H)), (245, 245, 245))
labels = ImageDraw.Draw(sheet)
sources = ROOT / "tools/generate-art/sources"

for index in range(15):
    source = sources / f"j105-keeg-dunk-scythe-pose-{index:02d}-attempt-01.png"
    if not source.exists():
        source = sources / f"j105-keeg-dunk-scythe-pose-{index:02d}-attempt-02.png"
    if index == 9:
        source = sources / "j105-keeg-dunk-scythe-pose-09-attempt-03.png"

    original = Image.open(source).convert("RGBA")
    alpha = original.getchannel("A").point(lambda value: 255 if value > 16 else 0)
    figure = original.crop(alpha.getbbox())
    figure_w = round(figure.width * 90 / figure.height)
    figure = figure.resize((figure_w, 90), Image.Resampling.NEAREST)
    cell = Image.new("RGBA", (CELL_W, CELL_H), (0, 0, 0, 0))
    cell.alpha_composite(figure, ((CELL_W - figure_w) // 2, 5))

    if index < RELEASE:
        # Diagnostic projection only: world offsets are scaled back to the
        # 128x96 review-cell coordinates, with the feet on y=95.
        ball_x = round(CELL_W / 2 + FORWARD[index] * 2.2 / 0.804)
        ball_y = round(CELL_H - 1 - HEIGHT[index] * 28 / 0.804)
        draw = ImageDraw.Draw(cell)
        draw.ellipse((ball_x - 5, ball_y - 5, ball_x + 5, ball_y + 5), fill=(245, 112, 26, 255), outline=(30, 20, 15, 255), width=1)
        draw.ellipse((ball_x - 2, ball_y - 3, ball_x, ball_y - 1), fill=(255, 236, 180, 255))

    column, row = index % COLUMNS, index // COLUMNS
    x, y = column * CELL_W, row * (CELL_H + LABEL_H)
    sheet.paste(cell.convert("RGB"), (x, y), cell.getchannel("A"))
    labels.text((x + 4, y + CELL_H + 1), f"pose {index:02d}" + (" · release" if index == RELEASE else ""), fill=(30, 30, 30))

    dark = Image.new("RGB", (CELL_W, CELL_H), (18, 18, 24))
    dark.paste(cell.convert("RGB"), (0, 0), cell.getchannel("A"))
    dark_x = PANEL_W + x
    sheet.paste(dark, (dark_x, y))
    labels.text((dark_x + 4, y + CELL_H + 1), f"pose {index:02d}", fill=(240, 240, 240))

OUT.parent.mkdir(parents=True, exist_ok=True)
sheet.save(OUT)
print(f"Wrote {OUT.relative_to(ROOT)}; overlay ends at pose {RELEASE} release")
