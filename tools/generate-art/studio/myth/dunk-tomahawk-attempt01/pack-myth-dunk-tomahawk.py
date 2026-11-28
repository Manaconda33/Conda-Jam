"""Isolate and pack the fifteen generated poses without redrawing pixels."""
from hashlib import sha256
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops
import sys

here=Path(__file__).resolve().parent
raw=Image.open(here/'myth-dunk-tomahawk-source.png').convert('RGB')
out=Image.new('RGBA',(480,288))
hips=(152,154,135,142,147,137,150,164,144,137,154,145,137,145,156)
scales=(.28,.28,.28,.27,.27,.26,.26,.26,.255,.255,.24,.27,.28,.28,.28)
x_shift=(0,0,0,0,0,0,0,0,0,7,15,6,2,0,0)
for i,hip in enumerate(hips):
    c,r=i%5,i//5
    bounds=(round(c*raw.width/5),round(r*raw.height/3),round((c+1)*raw.width/5),round((r+1)*raw.height/3))
    rgb=raw.crop(bounds)
    red,green,blue=rgb.split()
    max_channel=ImageChops.lighter(ImageChops.lighter(red,green),blue)
    alpha=max_channel.point(lambda px:255 if px>=20 else 0)
    b=alpha.getbbox()
    assert b and b[0]>0 and b[2]<rgb.width and b[1]>0 and b[3]<rgb.height,(i,b)
    ImageDraw.floodfill(alpha,(0,0),128)
    alpha=alpha.point(lambda px:0 if px==128 else 255)
    pose=rgb.convert('RGBA')
    pose.putalpha(alpha)
    pose=pose.crop(b)
    scale=scales[i]
    pose=pose.resize(tuple(round(v*scale) for v in pose.size),Image.Resampling.NEAREST)
    x,y=44-round((hip-b[0])*scale)+x_shift[i],94-pose.height
    assert x>=2 and x+pose.width<=96 and y>=2,(i,x,y,pose.size)
    out.alpha_composite(pose,(c*96+x,r*96+y))
dst=Path(sys.argv[1]) if len(sys.argv)>1 else here/'myth-dunk-tomahawk-right.webp'
out.save(dst,format='WEBP',lossless=True,method=6,exact=True)
print(sha256(dst.read_bytes()).hexdigest(),dst)
