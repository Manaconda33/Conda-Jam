#!/usr/bin/env python3
"""Make a light/dark 128x96 review cell and report J.107 source bounds."""
import argparse,hashlib,json
from pathlib import Path
from PIL import Image,ImageDraw
p=argparse.ArgumentParser();p.add_argument('source');p.add_argument('output');a=p.parse_args();root=Path(__file__).resolve().parents[2]
src=root/a.source;im=Image.open(src).convert('RGBA');alpha=im.getchannel('A');mask=alpha.point(lambda v:255 if v>16 else 0);bounds=mask.getbbox()
if not bounds:raise SystemExit('Reject: no alpha above 16')
fig=im.crop(bounds);w=round(fig.width*90/fig.height)
if w>76:raise SystemExit(f'Reject: minimum 26px sides at 90px height requires width<=76, got {w}')
fig=fig.resize((w,90),Image.Resampling.NEAREST);cell=Image.new('RGBA',(128,96),(0,0,0,0));cell.alpha_composite(fig,((128-w)//2,5))
out=root/a.output;out.parent.mkdir(parents=True,exist_ok=True);preview=Image.new('RGB',(256,120),'white');preview.paste((32,32,40),(128,0,256,120));preview.paste(cell.convert('RGB'),(0,12),cell.getchannel('A'));preview.paste(cell.convert('RGB'),(128,12),cell.getchannel('A'));d=ImageDraw.Draw(preview);d.text((4,1),'white background',fill='black');d.text((132,1),'dark background',fill='white');preview.save(out)
print(json.dumps({'source':str(src.relative_to(root)),'sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'dimensions':im.size,'alphaBoundsThreshold16':bounds,'cellFigure':[w,90],'cellMargins':[ (128-w)//2,128-w-(128-w)//2,5,1],'cornerAlpha':[alpha.getpixel(q) for q in [(0,0),(im.width-1,0),(0,im.height-1),(im.width-1,im.height-1)]],'preview':str(out.relative_to(root))},indent=2))
