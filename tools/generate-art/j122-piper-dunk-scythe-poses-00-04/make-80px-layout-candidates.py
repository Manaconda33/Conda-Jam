#!/usr/bin/env python3
"""Create transparent-canvas, uniform-scale J122 pose candidates; never edit input files."""
from pathlib import Path
from PIL import Image
import hashlib, json, math
import numpy as np

ROOT = Path(__file__).parent
SCALE = 0.90
OUT = ROOT / "layout-candidates-80px"
PROOFS = ROOT / "proofs" / "layout-candidates-80px"
OUT.mkdir(exist_ok=True)
PROOFS.mkdir(parents=True, exist_ok=True)

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def measure(im, threshold):
    alpha = np.array(im.getchannel("A"))
    ys, xs = np.where(alpha > threshold)
    if not len(xs):
        raise ValueError("Empty alpha image")
    bbox = [int(xs.min()), int(ys.min()), int(xs.max()+1), int(ys.max()+1)]
    margin = [bbox[0], bbox[1], im.width-bbox[2], im.height-bbox[3]]
    return bbox, margin

records=[]
for i in range(5):
    source = ROOT / "cleaned" / f"pose-{i:02d}-cleaned-v1.png"
    with Image.open(source) as opened:
        image = opened.convert("RGBA")
    src_w, src_h = image.size
    alpha = np.array(image.getchannel("A"))
    ys, xs = np.where(alpha > 0)
    crop_box = (int(xs.min()), int(ys.min()), int(xs.max()+1), int(ys.max()+1))
    crop = image.crop(crop_box).convert("RGBa")
    crop_w, crop_h = crop.size
    out_w, out_h = math.ceil(crop_w*SCALE), math.ceil(crop_h*SCALE)
    # One affine factor is used for both axes. Premultiplied RGBA resampling
    # avoids color bleed from transparent exterior RGB values.
    reduced = crop.transform(
        (out_w, out_h), Image.Transform.AFFINE,
        (1/SCALE, 0, 0, 0, 1/SCALE, 0),
        resample=Image.Resampling.BICUBIC, fillcolor=(0, 0, 0, 0)
    ).convert("RGBA")
    canvas = Image.new("RGBA", (src_w, src_h), (0,0,0,0))
    x0, y0 = (src_w-out_w)//2, (src_h-out_h)//2
    canvas.alpha_composite(reduced, (x0,y0))
    box16, margins16 = measure(canvas,16)
    box128, margins128 = measure(canvas,128)
    if min(margins16) < 80:
        raise ValueError(f"pose{i:02d} fails 80px margin: {margins16}")
    target = OUT / f"pose-{i:02d}-layout90-v1.png"
    canvas.save(target)
    proofs={}
    for name,color in (("light",(238,238,232,255)),("dark",(35,40,48,255))):
        bg=Image.new("RGBA",canvas.size,color); bg.alpha_composite(canvas)
        proof=PROOFS/f"pose-{i:02d}-{name}.png"; bg.convert("RGB").save(proof)
        proofs[name]=str(proof.relative_to(ROOT))
    records.append({
        "pose":i,"input":str(source.relative_to(ROOT)),"inputSha256":sha(source),
        "candidate":str(target.relative_to(ROOT)),"candidateSha256":sha(target),
        "originalCanvasPx":[src_w,src_h],"uniformScale":SCALE,
        "scaledNonzeroCropPx":[out_w,out_h],"sourceNonzeroCropBoxLTRB":[*crop_box],
        "candidatePlacementXY":[x0,y0],"alpha16BoundsLTRB":box16,"marginsLTRBAt16px":margins16,
        "alpha128BoundsLTRB":box128,"marginsLTRBAt128px":margins128,
        "proofs":proofs,"status":"layout candidate only; not accepted or packed"
    })
    print(f"pose{i:02d} scale={SCALE:.2f} bbox16={box16} margins={margins16} sha={sha(target)}")
(OUT/"layout-candidates.json").write_text(json.dumps({
    "athlete":"piper-quickstep","clip":"dunk-scythe","poses":"00-04",
    "purpose":"uniformly downscaled, centered layout candidates on original canvas, targeting >=80px alpha16 margins",
    "transform":"uniform 0.90 scale on both axes using premultiplied-alpha Lanczos affine resampling; alpha-nonzero source crop centered on original canvas",
    "sourcePixels":"accepted cleaned sources preserved unchanged under ../cleaned/",
    "status":"candidates only; not accepted or packed","poses":records
},indent=2)+"\n")
