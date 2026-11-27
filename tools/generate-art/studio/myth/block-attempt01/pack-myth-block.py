"""Reproducible pixel packing. Never draw new pose pixels or interpolate."""
import sys
from hashlib import sha256
from pathlib import Path
from PIL import Image
here=Path(__file__).resolve().parent
src=Image.open(here/'myth-block-source.png').convert('RGBA')
tiles=[(0,0,605,623,307),(605,0,1263,623,290),(0,623,605,1246,313),(605,623,1263,1246,298)]
out=Image.new('RGBA',(192,192))
for i,(x,y,r,b,hip) in enumerate(tiles):
    tile=src.crop((x,y,r,b))
    # Hard-alpha pixel edge: keep the source RGB of sufficiently opaque pixels.
    mask=tile.getchannel('A').point(lambda a:255 if a>=195 else 0)
    box=mask.getbbox()
    assert box and box[0]>0 and box[2]<tile.width and box[1]>0 and box[3]<tile.height
    tile.putalpha(mask)
    cropped=tile.crop(box)
    scaled=cropped.resize(tuple(round(x*.149) for x in cropped.size),Image.Resampling.NEAREST)
    dx=44-round((hip-box[0])*.149);dy=94-scaled.height
    assert dx>=2 and dx+scaled.width<=94 and dy>=2
    frame=Image.new('RGBA',(96,96));frame.alpha_composite(scaled,(dx,dy))
    out.alpha_composite(frame,((i%2)*96,(i//2)*96))
dst=Path(sys.argv[1]) if len(sys.argv)>1 else here/'myth-block-right.webp'
out.save(dst,format='WEBP',lossless=True,method=6,exact=True)
print(sha256(dst.read_bytes()).hexdigest(),dst)
