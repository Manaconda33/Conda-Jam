#!/usr/bin/env python3
"""Pack a reviewed 5x3, fifteen-pose dunk sheet into a 4x4 atlas.

This only crops, uniformly downsamples, and pads existing poses. It does not
generate, interpolate, mirror, or otherwise invent animation frames.
"""
import hashlib
import importlib.util
import json
import math
from pathlib import Path
import re
import sys

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
MOTION_PACKER = ROOT / "tools/generate-art/package-motion42.py"
spec = importlib.util.spec_from_file_location("motion42", MOTION_PACKER)
motion42 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(motion42)


def package(athlete: str, clip: str, source: Path, provenance_path: Path, isolate: bool = False) -> Path:
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", athlete):
        raise ValueError("Unsafe athlete ID")
    if not re.fullmatch(r"(?:dunk|alley-oop)-[a-z0-9]+(?:-[a-z0-9]+)*", clip):
        raise ValueError("Expected a dunk or alley-oop clip ID")
    source = source.resolve()
    provenance_path = provenance_path.resolve()
    rects = motion42.inspect_source(source, count=15, columns=5, isolate=isolate)
    separated = motion42.isolated_crops(source, rects) if isolate else None
    scale = 92 / max(rect["h"] for rect in rects)
    columns, rows, cell_width, cell_height = 4, 4, 128, 96
    atlas = Image.new("RGBA", (columns * cell_width, rows * cell_height), (0, 0, 0, 0))
    frames = []
    for index, rect in enumerate(rects):
        crop = separated[index] if separated else Image.open(source).convert("RGBA").crop((
            rect["x"], rect["y"], rect["x"] + rect["w"], rect["y"] + rect["h"]
        ))
        width = round(rect["w"] * scale)
        height = round(rect["h"] * scale)
        crop = crop.resize((width, height), Image.Resampling.LANCZOS)
        x = (index % columns) * cell_width + (cell_width - width) // 2
        y = (index // columns) * cell_height + 94 - height
        atlas.alpha_composite(crop, (x, y))
        frames.append({
            "x": (index % columns) * cell_width,
            "y": (index // columns) * cell_height,
            "w": cell_width,
            "h": cell_height,
        })

    source_rel = source.relative_to(ROOT)
    image_rel = Path("public/assets/animation") / f"{athlete}-{clip}-right.webp"
    image_path = ROOT / image_rel
    image_path.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(image_path, "WEBP", quality=88, method=6)
    provenance = json.loads(provenance_path.read_text())
    provenance.update({
        "sourceImage": source_rel.as_posix(),
        "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "sourceRects": [{"sourceIndex": i, **rect} for i, rect in enumerate(rects)],
        "uniformScale": scale,
        "componentIsolation": isolate,
        "packaging": "package-dunk15.py" + (" --isolate-components" if isolate else "") + "; 128x96 cells; baseline94; WebP88; no generated extra frames",
    })
    layout = [{
        "athlete": athlete,
        "direction": "right",
        "clip": clip,
        "src": "./" + image_rel.as_posix(),
        "columns": columns,
        "rows": rows,
        "frames": frames,
        "provenance": provenance,
    }]
    layout_path = ROOT / "tools/generate-art" / f"{athlete}-{clip}15-layouts.json"
    layout_path.write_text(json.dumps(layout, indent=2) + "\n")
    print(json.dumps({
        "atlas": image_rel.as_posix(),
        "layout": layout_path.relative_to(ROOT).as_posix(),
        "frames": len(frames),
        "scale": scale,
        "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
    }))
    return layout_path


if __name__ == "__main__":
    args = sys.argv[1:]
    isolate = "--isolate-components" in args
    args = [arg for arg in args if arg != "--isolate-components"]
    if len(args) != 4:
        raise SystemExit("Usage: package-dunk15.py athlete clip source.png provenance.json [--isolate-components]")
    package(args[0], args[1], Path(args[2]), Path(args[3]), isolate=isolate)
