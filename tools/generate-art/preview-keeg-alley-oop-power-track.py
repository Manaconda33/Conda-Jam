"""Preview the separate Keeg alley-oop ball over reviewed source cells.

The orange ball is diagnostic only and is never written into pose or atlas art.
"""
import json
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
LEDGER = json.loads((ROOT / "tools/generate-art/j106-keeg-alley-oop-power-provenance.json").read_text())
TRACK = LEDGER["plannedBallTrack"]
OUT = ROOT / TRACK["overlayPreviewPath"]
CELL_W, CELL_H, LABEL_H, COLUMNS = 128, 96, 18, 5
PANEL_W, ROWS = CELL_W * COLUMNS, 3
sheet = Image.new("RGB", (PANEL_W * 2, ROWS * (CELL_H + LABEL_H)), (245, 245, 245))
labels = ImageDraw.Draw(sheet)
poses = {pose["index"]: pose for pose in LEDGER["poses"]}

for index in range(15):
    pose = poses[index]
    original = Image.open(ROOT / pose["source"]).convert("RGBA")
    alpha = original.getchannel("A").point(lambda value: 255 if value > 16 else 0)
    figure = original.crop(alpha.getbbox())
    figure_w = round(figure.width * 90 / figure.height)
    figure = figure.resize((figure_w, 90), Image.Resampling.NEAREST)
    cell = Image.new("RGBA", (CELL_W, CELL_H), (0, 0, 0, 0))
    cell.alpha_composite(figure, ((CELL_W - figure_w) // 2, 5))

    if index < TRACK["releasePoseIndex"]:
        ball_x = round(CELL_W / 2 + TRACK["forward"][index] * 2.2 / 0.804)
        ball_y = round(CELL_H - 1 - TRACK["height"][index] * 28 / 0.804)
        draw = ImageDraw.Draw(cell)
        draw.ellipse((ball_x - 5, ball_y - 5, ball_x + 5, ball_y + 5), fill=(245, 112, 26, 255), outline=(30, 20, 15, 255), width=1)
        draw.ellipse((ball_x - 2, ball_y - 3, ball_x, ball_y - 1), fill=(255, 236, 180, 255))

    col, row = index % COLUMNS, index // COLUMNS
    x, y = col * CELL_W, row * (CELL_H + LABEL_H)
    sheet.paste(cell.convert("RGB"), (x, y), cell.getchannel("A"))
    tag = f"pose {index:02d}" + (" · release" if index == TRACK["releasePoseIndex"] else " · held" if index < TRACK["releasePoseIndex"] else " · free")
    labels.text((x + 4, y + CELL_H + 1), tag, fill=(30, 30, 30))

    dark = Image.new("RGB", (CELL_W, CELL_H), (18, 18, 24))
    dark.paste(cell.convert("RGB"), (0, 0), cell.getchannel("A"))
    dark_x = PANEL_W + x
    sheet.paste(dark, (dark_x, y))
    labels.text((dark_x + 4, y + CELL_H + 1), tag, fill=(240, 240, 240))

OUT.parent.mkdir(parents=True, exist_ok=True)
sheet.save(OUT)
print(f"Wrote {OUT.relative_to(ROOT)}; preview ball ends before pose{TRACK['releasePoseIndex']:02d} release.")
