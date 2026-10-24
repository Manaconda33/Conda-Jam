#!/usr/bin/env python3
"""Make margin-safe light/dark cells for isolated J.107 Keeg poses 08-14."""
import argparse, hashlib, json
from pathlib import Path
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parents[2]
p=argparse.ArgumentParser();p.add_argument('source');p.add_argument('output');a=p.parse_args()
src=ROOT/a.source; im=Image.open(src).convert('RGBA')
bounds=im.getchannel('A').point(lambda x:255 if x>16 else 0).getbbox()
if not bounds: raise SystemExit('Reject: no alpha over 16')
fig=im.crop(bounds); scale=min(86/fig.height,76/fig.width); w=round(fig.width*scale); h=round(fig.height*scale)
fig=fig.resize((w,h),Image.Resampling.NEAREST); left=(128-w)//2; top=(96-h)//2
cell=Image.new('RGBA',(128,96));cell.alpha_composite(fig,(left,top))
preview=Image.new('RGB',(256,120),'white');preview.paste((32,32,40),(128,0,256,120));preview.paste(cell.convert('RGB'),(0,12),cell.getchannel('A'));preview.paste(cell.convert('RGB'),(128,12),cell.getchannel('A'))
d=ImageDraw.Draw(preview);d.text((4,1),'white background',fill='black');d.text((132,1),'dark background',fill='white')
out=ROOT/a.output;out.parent.mkdir(parents=True,exist_ok=True);preview.save(out)
alpha=im.getchannel('A');print(json.dumps({'source':str(src.relative_to(ROOT)),'sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'dimensions':list(im.size),'alphaBoundsThreshold16':list(bounds),'cornerAlpha':[alpha.getpixel(q) for q in [(0,0),(im.width-1,0),(0,im.height-1),(im.width-1,im.height-1)]],'cellFigure':[w,h],'cellMargins':[left,128-w-left,top,96-h-top],'preview':str(out.relative_to(ROOT))},indent=2))
