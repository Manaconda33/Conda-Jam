from PIL import Image
import hashlib,json
from pathlib import Path
root=Path('tools/generate-art')
source=root/'sources/kraken-block-candidate3-atlas-nearest.png'
out=root/'sources/kraken-block-candidate3-cleanup02-atlas.png'
im=Image.open(source).convert('RGBA')
# Independent zoom review isolated these four foreign-color pixels. Remove only
# those pixels from this derived sheet; the raw generation and first derivation stay intact.
spots=[(100,58),(17,74),(31,144),(44,72)]
records=[]
for x,y in spots:
 pixel=im.getpixel((x,y));records.append({'x':x,'y':y,'rgbaBefore':list(pixel),'reason':'single isolated saturated fringe pixel identified in independent zoom4 review'})
 im.putpixel((x,y),(0,0,0,0))
im.save(out)
layout={'status':'pending-independent-re-review','source':str(source),'atlas':str(out),'width':160,'height':192,'cellSize':[80,96],'cleanupScript':'tools/generate-art/remove-kraken-block-fringe-specks.py','method':'Nearest-neighbor resize and binary component mask, followed by four-pixel targeted cleanup; no source art was repainted.','removedPixels':records,'sha256':hashlib.sha256(out.read_bytes()).hexdigest()}
(root/'sources/kraken-block-candidate3-cleanup02-layout.json').write_text(json.dumps(layout,indent=2)+'\n')
for name,color in [('light',(242,242,235)),('dark',(31,34,42))]:
 bg=Image.new('RGBA',im.size,color+(255,));bg.alpha_composite(im);bg.convert('RGB').save(root/f'previews/kraken-block-candidate3-cleanup02-{name}.png')
im.resize((640,768),Image.Resampling.NEAREST).save(root/'previews/kraken-block-candidate3-cleanup02-zoom4.png')
print(layout['sha256'],records)
