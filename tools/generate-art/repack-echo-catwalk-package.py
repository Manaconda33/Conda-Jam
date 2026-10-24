"""Repack Echo Catwalk's accepted source-only atlas package for integration.

The generated PNG pose sheets are never changed. Existing right-facing atlas
cells are preserved as archived sources, then uniformly reduced only as needed
to provide five transparent pixels around all four cell edges.
"""
from __future__ import annotations

import hashlib
import json
import math
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
ART = ROOT / "tools/generate-art"
ASSETS = ROOT / "public/assets/animation"
SOURCES = ART / "sources"
PREVIEW = ART / "previews/echo-catwalk-package-20261024"
ARCHIVE = ART / "layout-archives/echo-catwalk-integration-20261024"
BASE = {"idle", "idle-ball", "dribble", "run", "dribble-run", "shoot"}
MARGINS = ("left", "right", "top", "bottom")


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def fit(cell: Image.Image, width: int, height: int):
    bounds = cell.getchannel("A").getbbox()
    if not bounds:
        raise ValueError("blank atlas cell")
    body = cell.crop(bounds)
    scale = min((width - 10) / body.width, (height - 10) / body.height, 1.0)
    size = (max(1, round(body.width * scale)), max(1, round(body.height * scale)))
    body = body.resize(size, Image.Resampling.LANCZOS)
    x = (width - body.width) // 2
    y = height - 5 - body.height
    tile = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    tile.alpha_composite(body, (x, y))
    margins = {
        "left": x,
        "right": width - x - body.width,
        "top": y,
        "bottom": height - y - body.height,
    }
    return tile, margins


def main():
    character = json.loads((ASSETS / "manifest.json").read_text())["characters"]["echo-catwalk"]
    registered = character["directions"]["right"]
    targets = []
    for path in sorted(ART.glob("echo-catwalk-*-layouts.json")):
        value = json.loads(path.read_text())
        entries = value if isinstance(value, list) else [value]
        for index, entry in enumerate(entries):
            if (entry.get("athlete") == "echo-catwalk" and entry.get("direction") == "right"
                    and entry.get("clip") not in registered):
                targets.append((path, index, entry))

    clips = [entry[2]["clip"] for entry in targets]
    if len(clips) != 23 or len(set(clips)) != 23:
        raise ValueError(f"expected 23 unique Echo action clips, got {len(clips)}")

    PREVIEW.mkdir(parents=True, exist_ok=True)
    ARCHIVE.mkdir(parents=True, exist_ok=True)
    summaries = []
    registration = []

    for path, index, entry in targets:
        atlas = ROOT / entry["src"].removeprefix("./")
        original_hash = sha(atlas)
        archive = ARCHIVE / path.name
        if not archive.exists():
            shutil.copy2(path, archive)
        backup = SOURCES / f"{atlas.stem}-pre-echo-catwalk-integration.webp"
        if not backup.exists():
            shutil.copy2(atlas, backup)

        original = Image.open(atlas).convert("RGBA")
        cells = entry["frames"]
        cell_w, cell_h = cells[0]["w"], cells[0]["h"]
        columns = int(entry["columns"])
        rows = math.ceil(len(cells) / columns)
        rebuilt = Image.new("RGBA", (columns * cell_w, rows * cell_h), (0, 0, 0, 0))
        frames, margins, source_records = [], [], []
        for frame_number, frame in enumerate(cells):
            x, y, w, h = (frame[key] for key in ("x", "y", "w", "h"))
            if (w, h) != (cell_w, cell_h):
                raise ValueError(f"nonuniform cell shape for {entry['clip']}")
            packed_cell = original.crop((x, y, x + w, y + h))
            tile, clearance = fit(packed_cell, cell_w, cell_h)
            row, col = divmod(frame_number, columns)
            px, py = col * cell_w, row * cell_h
            rebuilt.alpha_composite(tile, (px, py))
            frames.append({"x": px, "y": py, "w": cell_w, "h": cell_h})
            margins.append(clearance)
            source_records.append({"frame": frame_number, "input": "pre-integration packed atlas cell",
                                  "originalBox": [x, y, w, h], "marginsPx": clearance})

        rebuilt.save(atlas, "WEBP", lossless=True, method=6)
        atlas_hash = sha(atlas)
        entry["frames"] = frames
        entry["rows"] = rows
        entry["sha256"] = atlas_hash
        provenance = entry.setdefault("provenance", {})
        provenance["repack"] = {
            "date": "2026-10-24",
            "script": "tools/generate-art/repack-echo-catwalk-package.py",
            "previousAtlasSha256": original_hash,
            "atlasSha256": atlas_hash,
            "fit": "uniform scale, never upscale; at least 5px transparent clearance on every cell edge",
            "minimumMarginsPx": {key: min(row[key] for row in margins) for key in MARGINS},
            "sourceRecords": source_records,
        }
        provenance.setdefault("review", {})["integrationReview"] = {
            "status": "pending-independent-source-and-native-review",
            "notes": "Accepted source package pending independent source-sheet review and native runtime ball-contact review.",
        }
        if isinstance(json.loads(path.read_text()), list):
            updated = json.loads(path.read_text())
            updated[index] = entry
            path.write_text(json.dumps(updated, indent=2) + "\n")
        else:
            path.write_text(json.dumps(entry, indent=2) + "\n")

        dark = Image.new("RGBA", rebuilt.size, (26, 34, 52, 255))
        light = Image.new("RGBA", rebuilt.size, (238, 242, 248, 255))
        dark.alpha_composite(rebuilt)
        light.alpha_composite(rebuilt)
        proof = Image.new("RGB", (rebuilt.width, rebuilt.height * 2), "white")
        proof.paste(dark.convert("RGB"), (0, 0))
        proof.paste(light.convert("RGB"), (0, rebuilt.height))
        proof.save(PREVIEW / f"{entry['clip']}-dark-light.png", optimize=True)
        registration.append(entry)
        summaries.append({"clip": entry["clip"], "frames": len(frames), "atlas": entry["src"],
                          "previousAtlasSha256": original_hash, "atlasSha256": atlas_hash,
                          "minimumMarginsPx": provenance["repack"]["minimumMarginsPx"]})

    (ART / "echo-catwalk-23-clip-registration-layouts.json").write_text(
        json.dumps(registration, indent=2) + "\n")
    summary = {"date": "2026-10-24", "athlete": "echo-catwalk", "clipsRepacked": len(summaries),
               "authoredFrames": sum(item["frames"] for item in summaries), "clips": summaries}
    (PREVIEW / "package-repack-summary.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(json.dumps({"clips": len(summaries), "frames": sum(x["frames"] for x in summaries),
                      "minimumMarginsPx": {key: min(x["minimumMarginsPx"][key] for x in summaries)
                                           for key in MARGINS}}))


if __name__ == "__main__":
    main()
