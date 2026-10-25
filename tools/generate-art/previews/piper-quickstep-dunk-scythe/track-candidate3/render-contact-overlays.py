#!/usr/bin/env python3
"""Render review-only contact overlays from Piper J.122 track candidates."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json

ROOT = Path(__file__).resolve().parents[5]
ATLAS = ROOT / "tools/generate-art/j122-piper-dunk-scythe-atlas-candidate/atlas-lane-scale.png"
OUT = Path(__file__).resolve().parent
layout = Image.open(ATLAS).convert("RGBA")
points = [(55, 52), (56, 50), (46, 50), (40, 50), (38, 52), (41, 55), (48, 10), (70, 41), (88, 8), (86, 8), (86, 8), None, None, None, None]
font = ImageFont.load_default()

for facing in ("right", "left"):
    for zoom in (100, 120):
        scale = zoom / 100
        cell_w, cell_h = round(128*scale), round(96*scale)
        header_h = 24
        canvas = Image.new("RGBA", (cell_w*4, cell_h*4+header_h), (24,25,40,255))
        d = ImageDraw.Draw(canvas)
        title = f"Piper Quickstep / J.122 dunk-scythe / {facing.upper()} / {zoom}%"
        d.text((4,5), title, fill=(245,245,250,255), font=font)
        for pose in range(15):
            col, row = pose % 4, pose // 4
            cell = layout.crop((col*128,row*96,col*128+128,row*96+96))
            if facing == "left":
                cell = cell.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
            cell = cell.resize((cell_w,cell_h),Image.Resampling.NEAREST)
            ox, oy = col*cell_w, header_h+row*cell_h
            canvas.alpha_composite(cell,(ox,oy))
            d.rectangle((ox,oy,ox+cell_w-1,oy+cell_h-1),outline=(145,145,155,140),width=1)
            d.text((ox+2,oy+2),f"{pose:02d}",(245,245,250,255),font=font)
            point = points[pose]
            if point is None:
                continue
            x,y=point
            if facing == "left":
                x=127-x
            cx=ox+round(x*scale)
            cy=oy+round(y*scale)
            r=round(6.3*scale)
            d.ellipse((cx-r,cy-r,cx+r,cy+r),fill=(246,163,61,255),outline=(113,59,37,255),width=max(1,round(scale)))
            d.arc((cx-r*.72,cy-r*.72,cx+r*.72,cy+r*.72),-60,60,fill=(113,59,37,255),width=max(1,round(scale)))
            d.line((cx-r*.8,cy,cx+r*.8,cy),fill=(113,59,37,255),width=max(1,round(scale)))
        folder=OUT/f"native-{zoom}"
        folder.mkdir(parents=True,exist_ok=True)
        canvas.save(folder/f"contact-overlay-{facing}-{zoom}.png")
