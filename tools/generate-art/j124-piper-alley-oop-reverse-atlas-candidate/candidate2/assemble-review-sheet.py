#!/usr/bin/env python3
"""Assemble review-only J.124 cells into a transparent 4x4 proof sheet."""
from pathlib import Path
import hashlib, json
from PIL import Image
ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
W, H, COLS, ROWS = 128, 96, 4, 4
cells = []
for i in range(15):
    if i <= 4:
        rel = Path(f"tools/generate-art/j124-piper-alley-oop-reverse-poses-00-04/layout-candidates/pose-{i:02d}-attempt{[3,2,2,3,3][i]}-cell128x96.png")
    elif i <= 9:
        attempt = 2 if i in (8, 9) else 1
        suffix = f"pose-{i:02d}-attempt{attempt}-native-128x96.png" if i in (8, 9) else f"pose-{i:02d}-native-128x96.png"
        rel = Path("tools/generate-art/j124-piper-alley-oop-reverse-poses-05-09/native-review/cells") / suffix
    else:
        rel = Path(f"tools/generate-art/j124-piper-alley-oop-reverse-poses-10-14/native-cells/pose-{i}-128x96.png")
    p = ROOT / rel
    im = Image.open(p).convert("RGBA")
    if im.size != (W, H): raise ValueError(f"pose{i} unexpected cell size {im.size}: {p}")
    bbox = im.getchannel("A").point(lambda a: 255 if a > 16 else 0).getbbox()
    margins = [bbox[0], bbox[1], W-bbox[2], H-bbox[3]] if bbox else None
    if not margins or min(margins) < 7: raise ValueError(f"pose{i} unsafe alpha16 margins {margins}")
    cells.append((p, im, margins))
    print(f"pose{i:02d}: {p.relative_to(ROOT)} margins={margins}")

sheet = Image.new("RGBA", (W*COLS, H*ROWS), (0, 0, 0, 0))
records = []
for i, (p, im, margins) in enumerate(cells):
    x, y = (i % COLS)*W, (i // COLS)*H
    sheet.alpha_composite(im, (x, y))
    records.append({"pose": i, "cell": str(p.relative_to(ROOT)), "cellSha256": hashlib.sha256(p.read_bytes()).hexdigest(), "atlasXY": [x,y], "cellAlpha16MarginsLTRB": margins})
# The sixteenth cell remains fully transparent for future atlas invariants.
sheet.save(OUT / "atlas-review-only.png")
for name, bg in [("light", (245,244,239,255)), ("dark", (23,24,38,255))]:
    proof = Image.new("RGBA", sheet.size, bg); proof.alpha_composite(sheet)
    proof.save(OUT / f"atlas-review-only-{name}.png")
    strip = Image.new("RGBA", (W*COLS, H*4), bg)
    for i, (_, im, _) in enumerate(cells): strip.alpha_composite(im, ((i%COLS)*W, (i//COLS)*H))
    strip.resize((W*COLS*3, H*4*3), Image.Resampling.NEAREST).save(OUT / f"sequence-review-{name}-3x.png")
unused = sheet.crop((3*W, 3*H, 4*W, 4*H))
if max(unused.getchannel("A").getdata()) != 0: raise ValueError("unused atlas cell is not transparent")
record = {"status":"review-only; no production pack or registration", "sourceClip":"Piper Quickstep J.124 alley-oop-reverse", "cellPx":[W,H], "atlasPx":list(sheet.size), "columns":COLS,"rows":ROWS,"unusedCell":"row4/column4; fully transparent", "cells":records}
for f in ["atlas-review-only.png", "atlas-review-only-light.png", "atlas-review-only-dark.png", "sequence-review-light-3x.png", "sequence-review-dark-3x.png"]:
    record[f] = hashlib.sha256((OUT/f).read_bytes()).hexdigest()
(OUT/"layout-and-hashes.json").write_text(json.dumps(record, indent=2)+"\n")
print("review-only transparent atlas and proofs written")
