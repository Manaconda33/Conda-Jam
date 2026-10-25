#!/usr/bin/env python3
"""Find J.130 raw PNGs with identical decoded RGBA pixels.

This catches duplicated poses even when files were re-encoded and their
byte-level SHA-256 hashes differ. It never edits source images.
"""
from __future__ import annotations

import hashlib
import json
from collections import defaultdict
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = ROOT / "tools/generate-art/sources"
REPORT = ROOT / "tools/generate-art/j130-briar-foxglove-layup-duplicate-source-audit.json"


def main() -> None:
    groups: dict[tuple[int, int, str], list[dict[str, str]]] = defaultdict(list)
    for path in sorted(SOURCE_DIR.glob("j130-briar-foxglove-layup-*-raw.png")):
        with Image.open(path) as image:
            rgba = image.convert("RGBA")
            pixel_hash = hashlib.sha256(rgba.tobytes()).hexdigest()
            key = (rgba.width, rgba.height, pixel_hash)
            groups[key].append({
                "path": str(path.relative_to(ROOT)),
                "fileSha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            })

    duplicates = [
        {"dimensions": [width, height], "decodedRgbaSha256": digest, "files": files}
        for (width, height, digest), files in groups.items()
        if len(files) > 1
    ]
    report = {
        "asset": "J.130 Briar Foxglove layup",
        "method": "SHA-256 of decoded RGBA pixel bytes; file encoding metadata is ignored",
        "rawSourceCount": sum(len(files) for files in groups.values()),
        "duplicateGroupCount": len(duplicates),
        "duplicateGroups": duplicates,
        "decision": "Every duplicate source remains a rejected provenance record and cannot count as a distinct authored pose.",
    }
    REPORT.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps({"report": str(REPORT.relative_to(ROOT)), **{k: report[k] for k in ("rawSourceCount", "duplicateGroupCount", "duplicateGroups")}}, indent=2))


if __name__ == "__main__":
    main()
