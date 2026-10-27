from PIL import Image
import hashlib,json
from pathlib import Path
root=Path('tools/generate-art');source=root/'sources/kraken-steal-candidate2-atlas.png';out=root/'sources/kraken-steal-candidate2-cleanup01-atlas.png';im=Image.open(source).convert('RGBA')
# Targeted, single-pixel saturated cyan/green/yellow fringe marks identified in
# the independent zoom review. Original generation and first normalized atlas stay intact.
spots=[(261,89),(19,187),(22,187),(217,51),(23,187),(21,51),(60,89),(261,132),(258,140),(216,143),(216,144)]
records=[]
for x,y in spots:
 old=im.getpixel((x,y));records.append({'x':x,'y':y,'rgbaBefore':list(old),'reason':'isolated saturated palette fringe from independent zoom4 review'});im.putpixel((x,y),(0,0,0,0))
im.save(out)
layout={'status':'pending independent re-review','source':str(source),'atlas':str(out),'cellSize':[80,96],'width':320,'height':192,'cleanupScript':'tools/generate-art/clean-kraken-steal-candidate2-fringes.py','method':'Targeted removal of listed isolated saturated color pixels only; no body or uniform pixels repainted.','removedPixels':records,'sha256':hashlib.sha256(out.read_bytes()).hexdigest()};(root/'sources/kraken-steal-candidate2-cleanup01-layout.json').write_text(json.dumps(layout,indent=2)+'\n')
for name,color in [('light',(242,242,235)),('dark',(31,34,42))]:
 bg=Image.new('RGBA',im.size,color+(255,));bg.alpha_composite(im);bg.convert('RGB').save(root/f'previews/kraken-steal-candidate2-cleanup01-{name}.png')
im.resize((1280,768),Image.Resampling.NEAREST).save(root/'previews/kraken-steal-candidate2-cleanup01-zoom4.png')
print(layout['sha256'],records)
