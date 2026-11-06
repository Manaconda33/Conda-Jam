"""Use only the accepted pose1 correction; restore other cells pixel-for-pixel."""
from pathlib import Path
from PIL import Image, ImageChops
import json
import hashlib

ROOT = Path(__file__).resolve().parents[2]
ORIGINAL = ROOT / "tools/generate-art/sources/krios-receive4-attempt01-generated-raw.png"
EDIT = ROOT / "tools/generate-art/sources/krios-receive4-attempt02-generated-raw.png"
OUTPUT = ROOT / "tools/generate-art/sources/krios-receive4-attempt02-composite-raw.png"
CELL = (690, 570)

base = Image.open(ORIGINAL).convert("RGBA")
edit = Image.open(EDIT).convert("RGBA")
if base.size != edit.size or base.size != (CELL[0] * 2, CELL[1] * 2):
    raise ValueError(f"Expected matching 1380x1140 two-by-two sheets, got {base.size}, {edit.size}")

boxes = [(0, 0, 690, 570), (690, 0, 1380, 570), (0, 570, 690, 1140), (690, 570, 1380, 1140)]
for index, box in enumerate(boxes):
    if index == 1:
        base.paste(edit.crop(box), box[:2])
    else:
        if ImageChops.difference(base.crop(box), Image.open(ORIGINAL).convert("RGBA").crop(box)).getbbox():
            raise AssertionError(f"Unexpected change outside corrected cell {index}")
base.save(OUTPUT)
report = {
    "original": ORIGINAL.relative_to(ROOT).as_posix(),
    "originalSha256": hashlib.sha256(ORIGINAL.read_bytes()).hexdigest(),
    "edit": EDIT.relative_to(ROOT).as_posix(),
    "editSha256": hashlib.sha256(EDIT.read_bytes()).hexdigest(),
    "output": OUTPUT.relative_to(ROOT).as_posix(),
    "outputSha256": hashlib.sha256(OUTPUT.read_bytes()).hexdigest(),
    "cellSize": list(CELL),
    "correctedCell": {"poseIndex": 1, "row": 0, "column": 1, "box": list(boxes[1]), "source": EDIT.relative_to(ROOT).as_posix()},
    "unchangedCellsCopiedFrom": ORIGINAL.relative_to(ROOT).as_posix(),
}
(ROOT / "tools/generate-art/krios-receive4-attempt02-composite-report.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report))
