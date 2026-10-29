from PIL import Image
import numpy as np,hashlib,json
from scipy.ndimage import label,find_objects
from pathlib import Path
root=Path('tools/generate-art');src=root/'sources/kraken-steal-candidate2-raw.png';im=Image.open(src).convert('RGBA');rgba=np.asarray(im)
labels,count=label(rgba[:,:,3]>0,structure=np.ones((3,3),dtype=int));components=[]
for idx,s in enumerate(find_objects(labels),1):
 if s is None:continue
 area=int((labels[s]==idx).sum())
 if area<1000:continue
 y,x=s;components.append({'idx':idx,'area':area,'bbox':[x.start,y.start,x.stop,y.stop],'center':[(x.start+x.stop)/2,(y.start+y.stop)/2]})
if len(components)!=8:raise SystemExit(f'Expected exactly 8 major figure components; found {len(components)}')
row1=sorted((c for c in components if c['center'][1]<543),key=lambda c:c['center'][0]);row2=sorted((c for c in components if c['center'][1]>=543),key=lambda c:c['center'][0]);poses=row1+row2
if len(row1)!=4 or len(row2)!=4:raise SystemExit(f'Expected 4 figures per row, got {len(row1)}/{len(row2)}')
out=Image.new('RGBA',(320,192),(0,0,0,0));records=[]
for i,c in enumerate(poses):
 x0,y0,x1,y1=c['bbox'];crop=im.crop((x0,y0,x1,y1));mask=labels[y0:y1,x0:x1]==c['idx'];crop.putalpha(Image.fromarray(mask.astype('uint8')*255));crop.thumbnail((62,80),Image.Resampling.NEAREST)
 x=(i%4)*80+(80-crop.width)//2;y=(i//4)*96+93-crop.height;out.alpha_composite(crop,(x,y))
 records.append({'poseIndex':i,'duration':[2,2,1,1,2,2,3,3][i],'anchor':'grab' if i==3 else None,'sourceBounds':c['bbox'],'sourceComponentPixels':c['area'],'targetBounds':[x,y,x+crop.width,y+crop.height],'targetBaselineY':y+crop.height-1,'resize':'nearest neighbor into 62x80 maximum; binary 8-connected component alpha'})
path=root/'sources/kraken-steal-candidate2-atlas.png';out.save(path)
layout={'status':'pending independent source review','source':str(src),'atlas':str(path),'width':320,'height':192,'columns':4,'rows':2,'cellWidth':80,'cellHeight':96,'poses':records,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()};(root/'sources/kraken-steal-candidate2-atlas-layout.json').write_text(json.dumps(layout,indent=2)+'\n')
for name,color in [('light',(242,242,235)),('dark',(31,34,42))]:
 bg=Image.new('RGBA',out.size,color+(255,));bg.alpha_composite(out);bg.convert('RGB').save(root/f'previews/kraken-steal-candidate2-atlas-{name}.png')
out.resize((1280,768),Image.Resampling.NEAREST).save(root/'previews/kraken-steal-candidate2-atlas-zoom4.png')
print(layout['sha256']);[print(r) for r in records]
