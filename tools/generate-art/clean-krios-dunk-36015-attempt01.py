from pathlib import Path
import json,hashlib
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2];SOURCE=ROOT/'tools/generate-art/sources/krios-dunk-36015-attempt01-generated-raw.png';OUT=ROOT/'tools/generate-art/previews/krios-dunk-36015-attempt01';OUT.mkdir(parents=True,exist_ok=True)
raw=np.asarray(Image.open(SOURCE).convert('RGB'))
green=(raw[:,:,1]>raw[:,:,0]+70)&(raw[:,:,1]>raw[:,:,2]+70)&(raw[:,:,1]>100)
labels,count=ndimage.label(~green,structure=np.ones((3,3),dtype=np.uint8));objects=ndimage.find_objects(labels);regions=[]
for label_id,sl in enumerate(objects,1):
 if sl is None:continue
 area=int(np.count_nonzero(labels[sl]==label_id))
 if area<5000:continue
 y0,y1=sl[0].start,sl[0].stop;x0,x1=sl[1].start,sl[1].stop
 regions.append({'id':label_id,'area':area,'bbox':[x0,y0,x1,y1],'cx':(x0+x1)/2,'cy':(y0+y1)/2})
if len(regions)!=15:raise SystemExit(f'expected 15 full-body components, found {len(regions)}')
regions.sort(key=lambda r:r['cy']);rows=[regions[i*5:(i+1)*5] for i in range(3)]
for row in rows:row.sort(key=lambda r:r['cx'])
regions=[r for row in rows for r in row]
if any(len(row)!=5 for row in rows):raise SystemExit('Expected five figures per row')
scale=min(118/max(r['bbox'][2]-r['bbox'][0] for r in regions),86/max(r['bbox'][3]-r['bbox'][1] for r in regions));frames=[];poses=[]
for idx,r in enumerate(regions):
 x0,y0,x1,y1=r['bbox'];owned=labels[y0:y1,x0:x1]==r['id'];rgb=raw[y0:y1,x0:x1].copy();wide=rgb.astype(np.int16)
 spill=owned&(wide[:,:,1]>wide[:,:,0]+20)&(wide[:,:,1]>wide[:,:,2]+15)&(wide[:,:,1]>60)
 rgb[spill,1]=((rgb[spill,0].astype(np.uint16)+rgb[spill,2].astype(np.uint16))//2).astype(np.uint8)
 size=(max(1,round((x1-x0)*scale)),max(1,round((y1-y0)*scale)))
 pose=Image.fromarray(np.dstack([rgb,np.where(owned,255,0).astype(np.uint8)]),'RGBA').resize(size,Image.Resampling.NEAREST)
 cell=Image.new('RGBA',(128,96),(0,0,0,0));cell.alpha_composite(pose,((128-pose.width)//2,94-pose.height));cell.save(OUT/f'pose-{idx:02d}-isolated.png');frames.append(cell)
 poses.append({'index':idx,'componentArea':r['area'],'sourceBounds':r['bbox'],'outputSize':size,'outputBounds':cell.getchannel('A').getbbox(),'despilledPixels':int(spill.sum()),'sourceCentroid':[r['cx'],r['cy']]})
atlas=Image.new('RGBA',(1920,96),(0,0,0,0))
for i,frame in enumerate(frames):atlas.alpha_composite(frame,(i*128,0))
out=OUT/'krios-dunk-36015-attempt01-runtime-candidate.png';atlas.save(out)
for kind,color in [('light',(226,226,219,255)),('dark',(28,30,38,255))]:
 bg=Image.new('RGBA',atlas.size,color);bg.alpha_composite(atlas);bg.convert('RGB').save(OUT/f'krios-dunk-36015-attempt01-{kind}-preview.png')
report={'source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'sourceDimensions':[raw.shape[1],raw.shape[0]],'candidateAtlas':str(out.relative_to(ROOT)),'candidateAtlasSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'algorithm':'green-dominance 8-connected components; 15 full figures grouped by source row and left-to-right; uniform nearest-neighbor scale to fit 118x86; transparent backgrounds; shared baseline y94; int16 green despill; no redraw','cell':[128,96],'grid':[15,1],'componentCount':count,'poseCount':len(frames),'uniquePoseHashes':len({hashlib.sha256(f.tobytes()).hexdigest() for f in frames}),'uniformScale':scale,'poses':poses}
(OUT/'cleanup-layout-report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'sha256':report['candidateAtlasSha256'],'components':count,'scale':scale,'poses':[{'i':p['index'],'sourceBounds':p['sourceBounds'],'outputSize':p['outputSize'],'spill':p['despilledPixels']} for p in poses]},indent=2))
