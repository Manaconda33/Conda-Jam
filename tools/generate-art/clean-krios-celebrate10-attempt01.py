from pathlib import Path
import json,hashlib
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2];SOURCE=ROOT/'tools/generate-art/sources/krios-celebrate10-attempt01-generated-raw.png';OUT=ROOT/'tools/generate-art/previews/krios-celebrate10-attempt01';OUT.mkdir(parents=True,exist_ok=True)
raw=np.asarray(Image.open(SOURCE).convert('RGB'))
green=(raw[:,:,1]>raw[:,:,0]+70)&(raw[:,:,1]>raw[:,:,2]+70)&(raw[:,:,1]>100)
labels,count=ndimage.label(~green,structure=np.ones((3,3),dtype=np.uint8));regions=[]
for i,sl in enumerate(ndimage.find_objects(labels),1):
 if sl is None:continue
 area=int(np.count_nonzero(labels[sl]==i))
 if area<3000:continue
 y0,y1=sl[0].start,sl[0].stop;x0,x1=sl[1].start,sl[1].stop;regions.append({'id':i,'area':area,'bbox':[x0,y0,x1,y1],'cx':(x0+x1)/2,'cy':(y0+y1)/2})
if len(regions)!=10:raise SystemExit(f'expected 10 figures, found {len(regions)}: {regions}')
top=sorted((r for r in regions if r['cy']<560),key=lambda r:r['cx']);bottom=sorted((r for r in regions if r['cy']>=560),key=lambda r:r['cx']);regions=top+bottom
if len(top)!=5 or len(bottom)!=5:raise SystemExit(f'expected five components per row, got {len(top)} and {len(bottom)}')
scale=min(118/max(r['bbox'][2]-r['bbox'][0] for r in regions),86/max(r['bbox'][3]-r['bbox'][1] for r in regions));frames=[];details=[]
for idx,r in enumerate(regions):
 x0,y0,x1,y1=r['bbox'];owned=labels[y0:y1,x0:x1]==r['id'];rgb=raw[y0:y1,x0:x1].copy();wide=rgb.astype(np.int16)
 spill=owned&(wide[:,:,1]>wide[:,:,0]+20)&(wide[:,:,1]>wide[:,:,2]+15)&(wide[:,:,1]>60)
 rgb[spill,1]=((rgb[spill,0].astype(np.uint16)+rgb[spill,2].astype(np.uint16))//2).astype(np.uint8)
 pose=Image.fromarray(np.dstack([rgb,np.where(owned,255,0).astype(np.uint8)]),'RGBA').resize((max(1,round((x1-x0)*scale)),max(1,round((y1-y0)*scale))),Image.Resampling.NEAREST)
 cell=Image.new('RGBA',(128,96),(0,0,0,0));cell.alpha_composite(pose,((128-pose.width)//2,94-pose.height));frames.append(cell);cell.save(OUT/f'pose-{idx:02d}-isolated.png')
 details.append({'index':idx,'area':r['area'],'sourceBounds':r['bbox'],'outputSize':pose.size,'outputBounds':cell.getchannel('A').getbbox(),'despilledPixels':int(spill.sum()),'centroid':[r['cx'],r['cy']]})
atlas=Image.new('RGBA',(1280,96),(0,0,0,0))
for i,f in enumerate(frames):atlas.alpha_composite(f,(128*i,0))
out=OUT/'krios-celebrate10-attempt01-runtime-candidate.png';atlas.save(out)
light=Image.new('RGBA',atlas.size,(226,226,219,255));light.alpha_composite(atlas);light.convert('RGB').save(OUT/'krios-celebrate10-attempt01-light-preview.png')
dark=Image.new('RGBA',atlas.size,(28,30,38,255));dark.alpha_composite(atlas);dark.convert('RGB').save(OUT/'krios-celebrate10-attempt01-dark-preview.png')
report={'source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'sourceDimensions':[raw.shape[1],raw.shape[0]],'candidateAtlas':str(out.relative_to(ROOT)),'candidateAtlasSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'algorithm':'green-dominance 8-connected components; ten full figures row-major; uniform nearest-neighbor scaling to fit 118x86; transparent backgrounds; baseline y94; int16 edge despill; no redraw','cell':[128,96],'grid':[10,1],'componentCount':count,'poseCount':len(frames),'uniquePoseHashes':len({hashlib.sha256(f.tobytes()).hexdigest() for f in frames}),'uniformScale':scale,'poses':details}
(OUT/'cleanup-layout-report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'sha256':report['candidateAtlasSha256'],'components':count,'scale':scale,'poses':details},indent=2))
