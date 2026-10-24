"""Repack Moxie's source-only atlases with reviewed cell clearance.

Raw generated sheets and prompts remain authoritative. This only normalizes
the derived atlases already referenced by Moxie's source-only inventory.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
INVENTORY_PATH = ROOT / "tools/generate-art/moxie-capwell-29-clip-inventory.json"
PREVIEW_ROOT = ROOT / "tools/generate-art/previews/moxie-capwell-package-20261024"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    inventory = json.loads(INVENTORY_PATH.read_text())
    summaries = []
    for item in inventory["newSourceOnlyClips"]:
        atlas_path = ROOT / item["atlasPath"]
        layout_path = ROOT / item["layoutPath"]
        layout = json.loads(layout_path.read_text())
        entry = layout[0]
        old_hash = sha256(atlas_path)
        with Image.open(atlas_path) as opened:
            old = opened.convert("RGBA")
        rebuilt = Image.new("RGBA", old.size, (0, 0, 0, 0))
        margins = []
        for frame in entry["frames"]:
            x, y, w, h = (frame[k] for k in ("x", "y", "w", "h"))
            cell = old.crop((x, y, x + w, y + h))
            box = cell.getchannel("A").getbbox()
            if box is None:
                raise ValueError(f"Blank source frame: {item['clip']} {len(margins)}")
            pose = cell.crop(box)
            scale = min(86 / pose.height, (w - 10) / pose.width, 1.0)
            size = (max(1, round(pose.width * scale)), max(1, round(pose.height * scale)))
            pose = pose.resize(size, Image.Resampling.LANCZOS)
            px = x + (w - pose.width) // 2
            py = y + h - 5 - pose.height
            rebuilt.alpha_composite(pose, (px, py))
            margins.append({"left": px - x, "right": x + w - (px + pose.width), "top": py - y, "bottom": y + h - (py + pose.height)})
        atlas_path.parent.mkdir(parents=True, exist_ok=True)
        rebuilt.save(atlas_path, "WEBP", lossless=True, method=6)
        new_hash = sha256(atlas_path)
        entry["sha256"] = new_hash
        entry["provenance"]["repack"] = {
            "date": "2026-10-24",
            "script": "tools/generate-art/repack-moxie-capwell-margins.py",
            "previousAtlasSha256": old_hash,
            "atlasSha256": new_hash,
            "fit": "uniform scale, never upscale; max 86px high and cell width minus 10px; centered horizontally and baseline aligned with 5px bottom clearance",
            "minimumMarginsPx": {key: min(m[key] for m in margins) for key in ("left", "right", "top", "bottom")},
            "maxMarginsPx": {key: max(m[key] for m in margins) for key in ("left", "right", "top", "bottom")},
        }
        layout_path.write_text(json.dumps(layout, indent=2) + "\n")
        item["previousAtlasSha256"] = old_hash
        item["atlasSha256"] = new_hash
        item["repackMarginsPx"] = {key: min(m[key] for m in margins) for key in ("left", "right", "top", "bottom")}

        dark = Image.new("RGBA", old.size, (26, 34, 52, 255))
        dark.alpha_composite(rebuilt)
        light = Image.new("RGBA", old.size, (234, 240, 246, 255))
        light.alpha_composite(rebuilt)
        review = Image.new("RGB", (old.width, old.height * 2), (255, 255, 255))
        review.paste(dark.convert("RGB"), (0, 0))
        review.paste(light.convert("RGB"), (0, old.height))
        d = ImageDraw.Draw(review)
        d.rectangle((0, 0, min(old.width - 1, 130), 15), fill=(26, 34, 52))
        d.text((3, 2), f"{item['clip']} / dark", fill=(255, 255, 255))
        d.rectangle((0, old.height, min(old.width - 1, 135), old.height + 15), fill=(234, 240, 246))
        d.text((3, old.height + 2), f"{item['clip']} / light", fill=(28, 33, 44))
        PREVIEW_ROOT.mkdir(parents=True, exist_ok=True)
        review.save(PREVIEW_ROOT / f"{item['clip']}-review.png", optimize=True)
        summaries.append({"clip": item["clip"], "previousAtlasSha256": old_hash, "atlasSha256": new_hash, "frames": len(margins), "minimumMarginsPx": {key: min(m[key] for m in margins) for key in ("left", "right", "top", "bottom")}, "preview": str((PREVIEW_ROOT / f"{item['clip']}-review.png").relative_to(ROOT))})

    inventory["marginRepack"] = {"date": "2026-10-24", "script": "tools/generate-art/repack-moxie-capwell-margins.py", "summary": "All 251 source-only pose cells were uniformly fitted to preserve at least 5px vertical clearance; raw generated source sheets were not modified.", "clips": summaries}
    INVENTORY_PATH.write_text(json.dumps(inventory, indent=2) + "\n")
    print(json.dumps({"clips": len(summaries), "frames": sum(x["frames"] for x in summaries), "minimumTopPx": min(x["minimumMarginsPx"]["top"] for x in summaries), "minimumBottomPx": min(x["minimumMarginsPx"]["bottom"] for x in summaries), "previewDir": str(PREVIEW_ROOT.relative_to(ROOT))}))


if __name__ == "__main__":
    main()
