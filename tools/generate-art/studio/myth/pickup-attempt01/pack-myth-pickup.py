"""Pack authored five-pose sprite source; nearest-neighbor, no new pose pixels."""
import sys
from hashlib import sha256
from pathlib import Path
from PIL import Image
here=Path(__file__).resolve().parent
src=Image.open(here/'myth-pickup-source.png').convert('RGBA')
assert src.size==(1536,1024)
out=Image.new('RGBA',(288,192))
for i,hip in enumerate((241,227,221,228,224)):
    x,y=(i%3)*512,(i//3)*512
    tile=src.crop((x,y,x+512,y+512))
    alpha=tile.getchannel('A').point(lambda a:255 if a>=195 else 0)
    box=alpha.getbbox()
    assert box and min(box[:2])>0 and max(box[2:])<512
    tile.putalpha(alpha)
    tile=tile.crop(box).resize(tuple(round(n*.162) for n in (box[2]-box[0],box[3]-box[1])),Image.Resampling.NEAREST)
    dx,dy=44-round((hip-box[0])*.162),94-tile.height
    assert dx>=2 and dx+tile.width<=94 and dy>=2
    cell=Image.new('RGBA',(96,96));cell.alpha_composite(tile,(dx,dy));out.alpha_composite(cell,((i%3)*96,(i//3)*96))
dst=Path(sys.argv[1]) if len(sys.argv)>1 else here/'myth-pickup-right.webp'
out.save(dst,format='WEBP',lossless=True,method=6,exact=True)
print(sha256(dst.read_bytes()).hexdigest())
