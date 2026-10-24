#!/usr/bin/env python3
"""Isolate eight corrected Keeg layup poses and place them with transparent cell margins."""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, find_objects, label

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "tools/generate-art/sources/j96-keeg-layup-correction-raw.png"
OUTPUT = ROOT / "tools/generate-art/sources/j96-keeg-layup8.png"
LAYOUT = ROOT / "tools/generate-art/j96-keeg-layup-cleanup-layout.json"


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    with Image.open(RAW) as opened:
        source = opened.convert("RGBA")
    pixels = np.asarray(source)
    labels, _ = label(pixels[:, :, 3] >= 64, structure=np.ones((3, 3), dtype=np.uint8))
    bodies = []
    for component, slices in enumerate(find_objects(labels), start=1):
        if slices is None:
            continue
        area = int(np.count_nonzero(labels[slices] == component))
        if area < source.width * source.height * 0.004:
            continue
        ys, xs = slices
        bodies.append({"component": component, "area": area, "x0": int(xs.start), "y0": int(ys.start),
                       "x1": int(xs.stop), "y1": int(ys.stop), "cx": (xs.start+xs.stop)/2,
                       "cy": (ys.start+ys.stop)/2})
    if len(bodies) != 8:
        raise ValueError(f"Expected eight isolated complete bodies; found {len(bodies)}")
    rows = [sorted((b for b in bodies if b["cy"] < source.height/2), key=lambda b:b["cx"]),
            sorted((b for b in bodies if b["cy"] >= source.height/2), key=lambda b:b["cx"])]
    if any(len(row) != 4 for row in rows):
        raise ValueError("Expected two rows of four poses")
    bodies = rows[0] + rows[1]
    seeds = np.where(np.isin(labels, [b["component"] for b in bodies]), labels, 0)
    owners = seeds[tuple(distance_transform_edt(seeds == 0, return_distances=False, return_indices=True))]
    output = Image.new("RGBA", source.size, (0,0,0,0))
    records = []
    for index, body in enumerate(bodies):
        col,row=index%4,index//4; cell_x,cell_y=col*384,row*512
        x0,y0=max(0,body["x0"]-3),max(0,body["y0"]-3)
        x1,y1=min(source.width,body["x1"]+3),min(source.height,body["y1"]+3)
        crop=pixels[y0:y1,x0:x1].copy(); crop[owners[y0:y1,x0:x1] != body["component"],3]=0
        pose=Image.fromarray(crop,"RGBA"); bbox=pose.getchannel("A").point(lambda v:255 if v>8 else 0).getbbox()
        if bbox is None: raise ValueError(f"Pose {index} is empty after component isolation")
        pose=pose.crop(bbox); w,h=pose.size; scale=min(316/w,444/h,1.0)
        size=(max(1,round(w*scale)),max(1,round(h*scale))); pose=pose.resize(size,Image.Resampling.LANCZOS)
        dx=cell_x+(384-size[0])//2;dy=cell_y+478-size[1];output.alpha_composite(pose,(dx,dy))
        margins=[dx-cell_x,dy-cell_y,cell_x+384-dx-size[0],cell_y+512-dy-size[1]]
        if min(margins)<34: raise ValueError(f"Pose {index} violates 34px margin: {margins}")
        records.append({"sourceIndex":index,"component":body["component"],"areaPx":body["area"],
                        "rawBounds":[body["x0"],body["y0"],body["x1"],body["y1"]],"scale":round(scale,6),
                        "destination":[dx,dy,size[0],size[1]],"marginsPx":margins})
    output.save(OUTPUT)
    layout={"source":str(RAW.relative_to(ROOT)),"sourceSha256":sha(RAW),
            "cleanedSource":str(OUTPUT.relative_to(ROOT)),"cleanedSourceSha256":sha(OUTPUT),
            "method":"threshold alpha at64; isolate eight row-major Keeg bodies; mask non-owner pixels in 3px padded component crops; uniformly scale with preserved aspect ratio; center and bottom-align in384x512 cells with at least34px margins",
            "frames":records}
    LAYOUT.write_text(json.dumps(layout,indent=2)+"\n")
    print(json.dumps({"sourceSha256":layout["sourceSha256"],"cleanedSourceSha256":layout["cleanedSourceSha256"],"frames":len(records),"minimumMarginPx":min(min(f["marginsPx"]) for f in records),"layout":str(LAYOUT.relative_to(ROOT))}))

if __name__=="__main__": main()
