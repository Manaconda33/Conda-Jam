#!/usr/bin/env python3
"""Assemble six reviewed E. Indigo pose strips into one source atlas without inventing frames."""
from __future__ import annotations
import hashlib, importlib.util, json, sys
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("motion42", HERE / "package-motion42.py")
motion = importlib.util.module_from_spec(spec)
spec.loader.exec_module(motion)
records = json.loads((HERE / "e-indigo-locomotion-left-strips.json").read_text())
rows, cols, cell, cell_h, baseline, target_h, pad = 6, 7, 192, 192, 184, 174, 16
pose_data=[]
crop_hashes=[]
for row_index, row_record in enumerate(records["strips"]):
    original=Path(row_record["path"])
    if not original.is_file():
        raise FileNotFoundError(original)
    sha=hashlib.sha256(original.read_bytes()).hexdigest()
    if sha != row_record["sha256"]:
        raise ValueError(f"Strip {row_index+1} SHA-256 mismatch")
    with Image.open(original) as opened:
        if opened.mode != "RGBA" or opened.getchannel("A").getextrema()[0] != 0:
            raise ValueError(f"Strip {row_index+1} must have true RGBA transparency")
        padded=ImageOps.expand(opened.copy(), border=pad, fill=(0,0,0,0))
    temp=Path("/tmp") / f"e-indigo-left-row{row_index+1}-padded.png"
    padded.save(temp)
    rects=motion.inspect_source(temp,count=7,columns=7,isolate=True)
    crops=motion.isolated_crops(temp,rects)
    if len(crops)!=7:
        raise ValueError(f"Strip {row_index+1}: expected seven separate poses")
    for col,crop in enumerate(crops):
        crop_hashes.append(hashlib.sha256(crop.tobytes()).hexdigest())
        pose_data.append((row_index,col,row_record,temp,rects[col],crop))
if len(set(crop_hashes)) != 42:
    raise ValueError("A source strip contains duplicate authored poses")
max_h=max(crop.height for *_,crop in pose_data)
scale=target_h/max_h
canvas=Image.new("RGBA",(cols*cell,rows*cell_h),(0,0,0,0))
packed=[]
for row,col,row_record,padded_path,rect,crop in pose_data:
    nw=max(1,round(crop.width*scale)); nh=max(1,round(crop.height*scale))
    resized=crop.resize((nw,nh),Image.Resampling.LANCZOS)
    x=col*cell+(cell-nw)//2; y=row*cell_h+baseline-nh
    if x < 8 or y < row*cell_h+8 or x+nw > (col+1)*cell-8 or y+nh > (row+1)*cell_h-8:
        raise ValueError(f"Pose row{row+1}/col{col+1} lacks clear atlas-cell margin")
    canvas.alpha_composite(resized,dest=(x,y))
    packed.append({"row":row+1,"column":col+1,"sourceStrip":row_record["path"],"sourceRect":{k:rect[k] for k in ("x","y","w","h")},"atlasRect":{"x":x,"y":y,"w":nw,"h":nh},"sourceFrameSha256":hashlib.sha256(crop.tobytes()).hexdigest()})
source=Path("/workspace/generated_images/e-indigo-locomotion42-left-assembled.png")
canvas.save(source)
source_sha=hashlib.sha256(source.read_bytes()).hexdigest()
count=len(motion.inspect_source(source,count=42,columns=7))
if count!=42: raise ValueError("Assembled atlas does not have exactly42 bodies")
now="2026-10-21T22:44:02Z"
manifest={
 "athlete":"e-indigo","canonicalSection":"K.16","direction":"left","generatedAt":now,
 "prompt":"Six independently generated left-facing seven-pose strips. Their complete prompts and source hashes are in tools/generate-art/e-indigo-locomotion-left-strips.json.",
 "references":records["references"],"path":str(source),"eligibleForPacking":True,"mirrorSafe":False,
 "review":{"status":"pending","source":"The six source strips were visually reviewed; the assembled atlas passed exact42 body separation, margins, transparent RGBA and 7x6 reading-order checks. Pending final packed-atlas review."},
 "assembly":{"operation":"Each strip's seven existing alpha components were isolated by nearest-component ownership after transparent16px outer padding. Crops were uniformly scaled to a common maximum height174px and placed on a transparent192x192 grid at a shared baseline184. No poses were drawn, duplicated or mirrored.","targetCell":[192,192],"commonScale":scale,"poseCount":42,"sourceSha256":source_sha,"poses":packed,"sourceStrips":records["strips"]}
}
out=HERE/"e-indigo-locomotion42-left-provenance.json"
out.write_text(json.dumps(manifest,indent=2)+"\n")
print(json.dumps({"source":str(source),"sha256":source_sha,"poseCount":count,"sourceRows":len(records["strips"]),"componentIsolation":True,"scale":scale,"provenance":str(out)}))
