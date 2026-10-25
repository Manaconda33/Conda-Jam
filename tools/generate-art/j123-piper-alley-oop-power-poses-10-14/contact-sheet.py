#!/usr/bin/env python3
"""Render a review-only 5-pose Piper J.123 contact sheet."""
from pathlib import Path
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parent
ATTEMPTS={10:1,11:1,12:2,13:1,14:1}
for name,bg in [('light',(245,244,239,255)),('dark',(24,25,40,255))]:
    w=h=250
    sheet=Image.new('RGBA',(w*5,h+22),(25,26,40,255))
    draw=ImageDraw.Draw(sheet)
    for index,pose in enumerate(range(10,15)):
        attempt=ATTEMPTS[pose]
        source=ROOT/f'cleaned/pose-{pose}-attempt{attempt}-components-clean.png'
        image=Image.open(source).convert('RGBA');image.thumbnail((w,h),Image.Resampling.LANCZOS)
        tile=Image.new('RGBA',(w,h),bg)
        tile.alpha_composite(image,((w-image.width)//2,(h-image.height)//2))
        sheet.alpha_composite(tile,(index*w,22))
        draw.text((index*w+4,4),f'pose {pose}',fill='white')
    sheet.convert('RGB').save(ROOT/f'previews/poses-10-14-{name}.png')
