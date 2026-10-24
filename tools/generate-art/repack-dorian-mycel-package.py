"""Repack Dorian's source-only atlases and add five reviewed locomotion frames.

Generated raw sources remain unchanged. Each output cell uniformly fits its
original authored pose to a 96px cell with at least 5px clearance.
"""
from __future__ import annotations

import hashlib
import json
import math
import shutil
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import label

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "public/assets/animation"
SOURCES = ROOT / "tools/generate-art/sources"
PREVIEW = ROOT / "tools/generate-art/previews/dorian-mycel-package-20261024"
ARCHIVE = ROOT / "tools/generate-art/layout-archives/dorian-mycel-integration-20261024"
PROVENANCE = ROOT / "tools/generate-art/dorian-mycel-locomotion-extension-provenance.json"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def body_crop(image: Image.Image, *, source_pose: bool = False) -> Image.Image:
    rgba = image.convert("RGBA")
    alpha = np.asarray(rgba.getchannel("A"))
    if alpha.max() < 240 or alpha.min() > 8:
        raise ValueError("Expected an RGBA image with transparent background")
    mask = alpha >= 64
    components, count = label(mask, structure=np.ones((3, 3), dtype=np.uint8))
    objects = []
    for index in range(1, count + 1):
        ys, xs = np.where(components == index)
        if len(xs) < max(24, image.width * image.height * 0.00002):
            continue
        objects.append((len(xs), int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1, index))
    if not objects:
        raise ValueError("No authored pose component found")
    objects.sort(reverse=True)
    if source_pose and len(objects) > 1 and objects[1][0] > objects[0][0] * 0.04:
        raise ValueError("Single-pose source has a second substantial component")
    _, x0, y0, x1, y1, component = objects[0]
    # Isolate the authored figure and remove edge-only low-alpha generator fringe.
    selected = Image.fromarray(np.where(components == component, alpha, 0).astype(np.uint8))
    rgba.putalpha(selected)
    return rgba.crop((x0, y0, x1, y1))


def fit_pose(pose: Image.Image, *, source_pose: bool = False, cell_w: int = 96, cell_h: int = 96) -> tuple[Image.Image, tuple[int, int, int, int]]:
    pose = body_crop(pose, source_pose=source_pose)
    scale = min(86 / pose.height, (cell_w - 10) / pose.width, 1.0)
    size = (max(1, round(pose.width * scale)), max(1, round(pose.height * scale)))
    pose = pose.resize(size, Image.Resampling.LANCZOS)
    x = (cell_w - pose.width) // 2
    y = cell_h - 5 - pose.height
    return pose, (x, y, cell_w - x - pose.width, cell_h - y - pose.height)


def make_entry(entry: dict, extra_sources: list[Path] | None = None, *, columns: int | None = None) -> tuple[dict, dict]:
    atlas_path = ROOT / entry["src"].removeprefix("./")
    layout_frames = entry["frames"]
    old_hash = digest(atlas_path)
    old = Image.open(atlas_path).convert("RGBA")
    columns = columns or int(entry["columns"])
    sources: list[tuple[Image.Image, str, bool]] = []
    for frame in layout_frames:
        x, y, w, h = (frame[key] for key in ("x", "y", "w", "h"))
        sources.append((old.crop((x, y, x + w, y + h)), "existing-atlas-cell", False))
    for source in extra_sources or []:
        image = Image.open(source).convert("RGBA")
        sources.append((image, source.relative_to(ROOT).as_posix(), True))

    rows = math.ceil(len(sources) / columns)
    rebuilt = Image.new("RGBA", (columns * 96, rows * 96), (0, 0, 0, 0))
    frames, margins, source_records = [], [], []
    for index, (raw_pose, source, is_source_pose) in enumerate(sources):
        pose, margin = fit_pose(raw_pose, source_pose=is_source_pose)
        row, col = divmod(index, columns)
        x, y = col * 96 + margin[0], row * 96 + 96 - 5 - pose.height
        rebuilt.alpha_composite(pose, (x, y))
        frames.append({"x": col * 96, "y": row * 96, "w": 96, "h": 96})
        margins.append({"left": margin[0], "right": margin[2], "top": y - row * 96, "bottom": 96 - (y - row * 96 + pose.height)})
        source_records.append({"frame": index, "input": source, "bbox": list(pose.getchannel("A").getbbox() or ()), "marginsPx": margins[-1]})

    backup = SOURCES / f"{atlas_path.stem}-pre-dorian-integration.webp"
    if not backup.exists():
        shutil.copy2(atlas_path, backup)
    rebuilt.save(atlas_path, "WEBP", lossless=True, method=6)
    new_hash = digest(atlas_path)
    entry.update({"columns": columns, "rows": rows, "frames": frames})
    entry.pop("sha256", None)
    prov = entry.setdefault("provenance", {})
    prov["repack"] = {
        "date": "2026-10-24",
        "script": "tools/generate-art/repack-dorian-mycel-package.py",
        "previousAtlasSha256": old_hash,
        "atlasSha256": new_hash,
        "fit": "uniform scale, never upscale, max 86px high, cell width minus 10px; horizontally centered with baseline aligned to 5px bottom clearance",
        "minimumMarginsPx": {key: min(m[key] for m in margins) for key in ("left", "right", "top", "bottom")},
        "sourceRecords": source_records,
    }
    entry["sha256"] = new_hash

    dark = Image.new("RGBA", rebuilt.size, (26, 34, 52, 255)); dark.alpha_composite(rebuilt)
    light = Image.new("RGBA", rebuilt.size, (234, 240, 246, 255)); light.alpha_composite(rebuilt)
    review = Image.new("RGB", (rebuilt.width, rebuilt.height * 2), "white")
    review.paste(dark.convert("RGB"), (0, 0)); review.paste(light.convert("RGB"), (0, rebuilt.height))
    preview_path = PREVIEW / f"{entry['clip']}-dark-light.png"
    preview_path.parent.mkdir(parents=True, exist_ok=True)
    review.save(preview_path, optimize=True)
    result = {
        "clip": entry["clip"], "frames": len(frames), "atlas": atlas_path.relative_to(ROOT).as_posix(),
        "previousAtlasSha256": old_hash, "atlasSha256": new_hash,
        "minimumMarginsPx": {key: min(m[key] for m in margins) for key in ("left", "right", "top", "bottom")},
        "preview": preview_path.relative_to(ROOT).as_posix(),
    }
    return entry, result


def main() -> None:
    ext = json.loads(PROVENANCE.read_text())
    extra_by_clip = {clip: [ROOT / record["source"] for record in ext["acceptedSources"] if record["clip"] == clip] for clip in ("dribble", "dribble-run")}
    layout_paths = sorted((ROOT / "tools/generate-art").glob("dorian-mycel-*-layouts.json"))
    layouts: dict[tuple[str, str], tuple[Path, dict]] = {}
    for path in layout_paths:
        try:
            values = json.loads(path.read_text())
        except (json.JSONDecodeError, UnicodeDecodeError):
            continue
        for index, entry in enumerate(values):
            if entry.get("athlete") == "dorian-mycel" and entry.get("direction") == "right":
                layouts[(entry["clip"], path.name)] = (path, entry)

    ARCHIVE.mkdir(parents=True, exist_ok=True)
    updated, seen = [], set()
    for (_, filename), (path, entry) in sorted(layouts.items()):
        clip = entry["clip"]
        if filename == "dorian-luca-reviewed-locomotion-layouts.json":
            # Shared file is archived/updated once per Dorian entry after the canonical layout.
            continue
        if clip in seen:
            continue
        seen.add(clip)
        archived = ARCHIVE / path.name
        if not archived.exists(): shutil.copy2(path, archived)
        extras = extra_by_clip.get(clip, [])
        columns = 5 if extras else None
        updated_entry, result = make_entry(entry, extras, columns=columns)
        values = json.loads(path.read_text())
        for idx, candidate in enumerate(values):
            if candidate.get("athlete") == "dorian-mycel" and candidate.get("clip") == clip and candidate.get("direction") == "right":
                values[idx] = updated_entry
        path.write_text(json.dumps(values, indent=2) + "\n")
        updated.append(result)

    # Keep both historical locomotion layout files consistent for these four clips.
    canonical = json.loads((ROOT / "tools/generate-art/dorian-mycel-locomotion35-short-layout-layouts.json").read_text())
    shared_path = ROOT / "tools/generate-art/dorian-luca-reviewed-locomotion-layouts.json"
    shared = json.loads(shared_path.read_text())
    shutil.copy2(shared_path, ARCHIVE / shared_path.name) if not (ARCHIVE / shared_path.name).exists() else None
    for clip in ("idle", "dribble", "run", "dribble-run"):
        current = next(x for x in canonical if x.get("athlete") == "dorian-mycel" and x.get("clip") == clip)
        for idx, candidate in enumerate(shared):
            if candidate.get("athlete") == "dorian-mycel" and candidate.get("clip") == clip:
                shared[idx] = current
    shared_path.write_text(json.dumps(shared, indent=2) + "\n")

    summary = {"date": "2026-10-24", "athlete": "dorian-mycel", "registeredClipTarget": 29, "clipsRepacked": len(updated), "authoredLocomotionFramesAdded": len(ext["acceptedSources"]), "clips": updated}
    (PREVIEW / "package-repack-summary.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(json.dumps({"clips": len(updated), "frames": sum(x["frames"] for x in updated), "addedAuthoredFrames": len(ext["acceptedSources"]), "minMarginsPx": {key: min(x["minimumMarginsPx"][key] for x in updated) for key in ("left", "right", "top", "bottom")}, "previewDir": PREVIEW.relative_to(ROOT).as_posix()}))


if __name__ == "__main__":
    main()
