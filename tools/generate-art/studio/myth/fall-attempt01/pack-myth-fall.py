"""Pack ImageGen poses without interpolation or drawing new pixels."""
import sys
from hashlib import sha256
from pathlib import Path
from PIL import Image

here=Path(__file__).resolve().parent
source=Image.open(here/'myth-fall-source.png').convert('RGBA')
out=Image.new('RGBA',(480,192))
hips=(166,159,163,162,182,217,189,154,156,156)
scale=.203
for i,hip in enumerate(hips):
    c,r=i%5,i//5
    edges=([0,380,752,1142,1528,1983] if r==0 else [round(x*source.width/5) for x in range(6)])
    box=(edges[c],round(r*source.height/2),edges[c+1],round((r+1)*source.height/2))
    pose=source.crop(box)
    mask=pose.getchannel('A').point(lambda a:255 if a>=220 else 0)
    b=mask.getbbox()
    assert b and b[0]>0 and b[2]<pose.width and b[1]>0 and b[3]<pose.height,(i,b)
    pose.putalpha(mask)
    pose=pose.crop(b)
    pose=pose.resize(tuple(round(v*scale) for v in pose.size),Image.Resampling.NEAREST)
    x,y=44-round((hip-b[0])*scale),94-pose.height
    assert x>=2 and x+pose.width<=96 and y>=2,(i,x,y,pose.size)
    out.alpha_composite(pose,(c*96+x,r*96+y))
dst=Path(sys.argv[1]) if len(sys.argv)>1 else here/'myth-fall-right.webp'
out.save(dst,format='WEBP',lossless=True,method=6,exact=True)
print(sha256(dst.read_bytes()).hexdigest(),dst)
