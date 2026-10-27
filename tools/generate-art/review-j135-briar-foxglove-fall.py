#!/usr/bin/env python3
"""Make side-by-side light/dark transparency proofs for raw J.135 sheets."""

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = ROOT / "tools/generate-art/sources"
OUTPUT_DIR = ROOT / "tools/generate-art/previews/j135-briar-foxglove-fall"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

for attempt in ("00", "01", "02"):
    source = SOURCE_DIR / f"j135-briar-foxglove-fall-attempt-{attempt}-raw.png"
    if not source.exists():
        continue
    rgba = Image.open(source).convert("RGBA")
    margin = 18
    label_h = 28
    panel_w, panel_h = rgba.width + margin * 2, rgba.height + margin * 2 + label_h
    proof = Image.new("RGB", (panel_w * 2, panel_h), "#d0d0d0")
    draw = ImageDraw.Draw(proof)
    for index, background in enumerate(("#191919", "#f6f0df")):
        x = index * panel_w
        draw.rectangle((x, 0, x + panel_w - 1, panel_h - 1), fill=background)
        draw.text((x + margin, 6), f"{'DARK' if index == 0 else 'LIGHT'} BACKGROUND", fill="#ffffff" if index == 0 else "#1b1b1b")
        proof.paste(rgba, (x + margin, label_h + margin), rgba)
    proof.save(OUTPUT_DIR / f"j135-briar-foxglove-fall-attempt-{attempt}-light-dark.png")
