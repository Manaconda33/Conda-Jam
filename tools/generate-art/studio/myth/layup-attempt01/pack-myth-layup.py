"""Pack ImageGen poses without interpolation or drawing new pixels."""
import sys
from hashlib import sha256
from pathlib import Path
from PIL import Image

here=Path(__file__).resolve().parent
source=Image.open(here/'myth-layup-source.png').convert('RGBA')
out=Image.new('RGBA',(384,192))
hips=(216,223,227,211,216,230,225,220)
scale=.202
for i,hip in enumerate(hips):
    c,r=i%4,i//4
    box=(round(c*source.width/4),round(r*source.height/2),round((c+1)*source.width/4),round((r+1)*source.height/2))
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
dst=Path(sys.argv[1]) if len(sys.argv)>1 else here/'myth-layup-right.webp'
out.save(dst,format='WEBP',lossless=True,method=6,exact=True)
print(sha256(dst.read_bytes()).hexdigest(),dst)
