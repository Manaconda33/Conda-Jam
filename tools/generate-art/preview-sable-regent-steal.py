#!/usr/bin/env python3
"""Create source-only standard and 120% review previews for Sable's steal atlas."""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
LAYOUT = ROOT / "tools/generate-art/sable-regent-steal8-layouts.json"
STANDARD = ROOT / "tools/generate-art/sable-regent-steal-preview-standard.png"
ZOOM = ROOT / "tools/generate-art/sable-regent-steal-preview-zoom120.png"
# Hand contact points are checked against each authored crop; the separate
# game ball enters the low open hand on frame 3 and follows the gather.
HAND_POINTS = [(66, 57), (81, 65), (84, 70), (89, 78), (58, 56), (71, 62), (66, 57), (66, 59)]


def render(scale: float, path: Path) -> None:
    entry = json.loads(LAYOUT.read_text())[0]
    atlas_path = ROOT / entry["src"].removeprefix("./")
    atlas = Image.open(atlas_path).convert("RGBA")
    tile = round(112 * scale)
    inset = round(8 * scale)
    gutter = round(6 * scale)
    output = Image.new("RGB", (4 * tile + 5 * gutter, 2 * tile + 3 * gutter), (31, 34, 39))
    draw = ImageDraw.Draw(output)

    for index, frame in enumerate(entry["frames"]):
        row, col = divmod(index, 4)
        x = gutter + col * (tile + gutter)
        y = gutter + row * (tile + gutter)
        draw.rounded_rectangle((x, y, x + tile - 1, y + tile - 1), radius=4, fill=(57, 62, 68))
        crop = atlas.crop((frame["x"], frame["y"], frame["x"] + frame["w"], frame["y"] + frame["h"]))
        body_size = round(96 * scale)
        body = crop.resize((body_size, body_size), Image.Resampling.NEAREST)
        body_x = x + (tile - body_size) // 2
        body_y = y + tile - body_size - inset
        output.paste(body, (body_x, body_y), body)
        # Preview the independent orange game ball at Sable's authored low
        # forward hand path; the ball is never baked into the atlas.
        ball_r = max(3, round(4 * scale))
        hand_x, hand_y = HAND_POINTS[index]
        bx = body_x + round(hand_x * scale)
        by = body_y + round(hand_y * scale)
        draw.ellipse((bx - ball_r, by - ball_r, bx + ball_r, by + ball_r), fill=(236, 112, 32), outline=(30, 24, 21), width=max(1, round(scale)))
        draw.text((x + 4, y + 3), f"{index}", fill=(244, 244, 240))

    output.save(path, optimize=True)


if __name__ == "__main__":
    render(1.0, STANDARD)
    render(1.2, ZOOM)
    print(f"standard={STANDARD.relative_to(ROOT)}")
    print(f"zoom120={ZOOM.relative_to(ROOT)}")
