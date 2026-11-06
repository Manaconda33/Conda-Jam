from PIL import Image
import numpy as np, hashlib, json
from scipy.ndimage import label, find_objects
from pathlib import Path
root=Path(__file__).parent
src=root/'sources/kraken-block-candidate2/edited-candidate3.png'
out=root/'sources/kraken-block-candidate3-atlas.png'
image=Image.open(src).convert('RGBA')
a=np.asarray(image)[:,:,3]>0
labels,count=label(a,structure=np.ones((3,3),dtype=int)); candidates=[]
for idx,slices in enumerate(find_objects(labels),1):
 if slices is None: continue
 area=int((labels[slices]==idx).sum())
 if area>1000:
  y,x=slices;candidates.append((area,x.start,y.start,x.stop,y.stop,idx))
# Top-left stance, top-right takeoff, bottom-left apex, bottom-right landing.
centers=[(300,450),(850,400),(300,1000),(850,1100)]
chosen=[]
for cx,cy in centers:
 choices=[c for c in candidates if c[5] not in [v[5] for v in chosen]]
 c=min(choices,key=lambda c:(c[1]+c[3])/2-cx if abs((c[1]+c[3])/2-cx)>100 else 0) if False else min(choices,key=lambda c:((c[1]+c[3])/2-cx)**2+((c[2]+c[4])/2-cy)**2)
 chosen.append(c)
canvas=Image.new('RGBA',(160,192),(0,0,0,0)); records=[]
for i,c in enumerate(chosen):
 area,x0,y0,x1,y1,idx=c
 mask=labels[y0:y1,x0:x1]==idx
 crop=image.crop((x0,y0,x1,y1));crop.putalpha(Image.fromarray((mask*255).astype('uint8')))
 crop.thumbnail((62,80),Image.Resampling.LANCZOS)
 x=(i%2)*80+(80-crop.width)//2;y=(i//2)*96+93-crop.height
 canvas.alpha_composite(crop,(x,y))
 records.append({'poseIndex':i,'sourceBounds':[x0,y0,x1,y1],'sourceComponentPixels':area,'targetCell':[i%2,i//2],'targetBounds':[x,y,x+crop.width,y+crop.height],'targetBaselineY':93,'cleanup':'largest 8-connected alpha component; detached components under 1000 source pixels omitted','resize':'fit within 62x80 using Lanczos, bottom-aligned at baseline y93'})
canvas.save(out)
layout={'status':'candidate-pending-visual-review','source':str(src.relative_to(root.parent)),'atlas':str(out.relative_to(root.parent)),'width':160,'height':192,'columns':2,'rows':2,'cellWidth':80,'cellHeight':96,'poses':records,'sha256':hashlib.sha256(out.read_bytes()).hexdigest()}
(root/'sources/kraken-block-candidate3-layout.json').write_text(json.dumps(layout,indent=2)+'\n')
for name,color in [('light',(242,242,235)),('dark',(31,34,42))]:
 bg=Image.new('RGBA',canvas.size,color+(255,));bg.alpha_composite(canvas);bg.convert('RGB').save(root/f'previews/kraken-block-candidate3-{name}.png')
print(out,layout['sha256'])
for r in records:print(r)
