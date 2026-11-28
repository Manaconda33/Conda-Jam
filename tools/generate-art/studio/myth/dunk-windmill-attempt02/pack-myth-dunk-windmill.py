"""Pack ImageGen poses without interpolation or drawing new pixels."""
import sys
from hashlib import sha256
from pathlib import Path
from PIL import Image

here=Path(__file__).resolve().parent
parent=Image.open(here/'myth-dunk-windmill-source.png').convert('RGBA')
edit=Image.open(here/'myth-dunk-windmill-edit.png').convert('RGBA')
out=Image.new('RGBA',(480,288))
hips=(171,154,158,156,154,168,152,145,148,154,166,150,152,144,141)
scale=.264
for i,hip in enumerate(hips):
    source=edit if i in (6,10) else parent
    c,r=i%5,i//5
    box=(round(c*source.width/5),round(r*source.height/3),round((c+1)*source.width/5),round((r+1)*source.height/3))
    pose=source.crop(box)
    mask=pose.getchannel('A').point(lambda a:255 if a>=220 else 0)
    b=mask.getbbox()
    assert b and b[0]>0 and b[2]<pose.width and b[1]>0 and b[3]<pose.height,(i,b)
    pose.putalpha(mask)
    pose=pose.crop(b)
    pose=pose.resize(tuple(round(v*scale) for v in pose.size),Image.Resampling.NEAREST)
    x,y=44-round((hip-b[0])*scale),94-pose.height
    x+=9 if i==9 else 6 if i==10 else 0
    assert x>=2 and x+pose.width<=96 and y>=2,(i,x,y,pose.size)
    out.alpha_composite(pose,(c*96+x,r*96+y))
dst=Path(sys.argv[1]) if len(sys.argv)>1 else here/'myth-dunk-windmill-right.webp'
out.save(dst,format='WEBP',lossless=True,method=6,exact=True)
print(sha256(dst.read_bytes()).hexdigest(),dst)
