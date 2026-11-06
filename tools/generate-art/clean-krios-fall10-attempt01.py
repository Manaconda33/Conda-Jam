from pathlib import Path
import json, hashlib
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/krios-fall10-attempt01-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/krios-fall10-attempt01'
OUT.mkdir(parents=True,exist_ok=True)
raw=np.asarray(Image.open(SOURCE).convert('RGB'))
# The white cell rules are not part of the athlete; exclude them from the
# chroma-key segmentation so they cannot join neighboring pose components.
white=(raw.min(axis=2)>218)&((raw.max(axis=2)-raw.min(axis=2))<35)
green=(raw[:,:,1]>raw[:,:,0]+70)&(raw[:,:,1]>raw[:,:,2]+70)&(raw[:,:,1]>100)
mask=~(green|white)
labels,count=ndimage.label(mask,structure=np.ones((3,3),dtype=np.uint8))
objects=ndimage.find_objects(labels)
regions=[]
for label_id,sl in enumerate(objects,1):
    if sl is None: continue
    area=int(np.count_nonzero(labels[sl]==label_id))
    if area<3000: continue
    y0,y1=sl[0].start,sl[0].stop; x0,x1=sl[1].start,sl[1].stop
    regions.append({'id':label_id,'area':area,'bbox':[x0,y0,x1,y1],'cx':(x0+x1)/2,'cy':(y0+y1)/2})
if len(regions)!=10: raise SystemExit(f'expected 10 full-body components, found {len(regions)}: {regions}')
# Two orderly rows: order by vertical centroid into five each, then x.
regions.sort(key=lambda r:(r['cy'],r['cx']))
regions=regions[:5]+sorted(regions[5:],key=lambda r:r['cx'])
max_w=max(r['bbox'][2]-r['bbox'][0] for r in regions); max_h=max(r['bbox'][3]-r['bbox'][1] for r in regions)
scale=min(118/max_w,86/max_h)
frames=[]; details=[]
for idx,r in enumerate(regions):
    x0,y0,x1,y1=r['bbox']; owned=labels[y0:y1,x0:x1]==r['id']; rgb=raw[y0:y1,x0:x1].copy()
    # Correct only green-dominant edge spill belonging to this figure. Widen
    # channel arithmetic before thresholding to avoid uint8 overflow.
    wide=rgb.astype(np.int16)
    spill=owned&(wide[:,:,1]>wide[:,:,0]+20)&(wide[:,:,1]>wide[:,:,2]+15)&(wide[:,:,1]>60)
    rgb[spill,1]=((rgb[spill,0].astype(np.uint16)+rgb[spill,2].astype(np.uint16))//2).astype(np.uint8)
    rgba=np.dstack([rgb,np.where(owned,255,0).astype(np.uint8)])
    pose=Image.fromarray(rgba,'RGBA')
    size=(max(1,round(pose.width*scale)),max(1,round(pose.height*scale)))
    pose=pose.resize(size,Image.Resampling.NEAREST)
    cell=Image.new('RGBA',(128,96),(0,0,0,0)); px=(128-pose.width)//2; py=94-pose.height
    cell.alpha_composite(pose,(px,py)); frames.append(cell)
    bounds=cell.getchannel('A').getbbox()
    cell.save(OUT/f'pose-{idx:02d}-isolated.png')
    details.append({'index':idx,'componentArea':r['area'],'sourceBounds':r['bbox'],'outputBounds':bounds,'outputSize':size,'scale':scale,'despilledPixels':int(spill.sum()),'sourceCentroid':[r['cx'],r['cy']]})
atlas=Image.new('RGBA',(1280,96),(0,0,0,0))
for i,frame in enumerate(frames): atlas.alpha_composite(frame,(i*128,0))
atlas_path=OUT/'krios-fall10-attempt01-runtime-candidate.png';atlas.save(atlas_path)
# Review sheets at native size against contrasting backdrops.
light=Image.new('RGBA',atlas.size,(226,226,219,255));light.alpha_composite(atlas);light.convert('RGB').save(OUT/'krios-fall10-attempt01-light-preview.png')
dark=Image.new('RGBA',atlas.size,(28,30,38,255));dark.alpha_composite(atlas);dark.convert('RGB').save(OUT/'krios-fall10-attempt01-dark-preview.png')
report={'source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'sourceDimensions':[raw.shape[1],raw.shape[0]],'candidateAtlas':str(atlas_path.relative_to(ROOT)),'candidateAtlasSha256':hashlib.sha256(atlas_path.read_bytes()).hexdigest(),'algorithm':'green-dominance segmentation with white grid-line exclusion; 8-connected components; exact ten full-figure components; row-major; uniform nearest-neighbor scale across poses to fit 118x86; transparent margins; baseline y94; int16 green-despill; no redraw','cell':[128,96],'grid':[10,1],'uniformScale':scale,'componentCount':count,'poseCount':len(frames),'uniquePoseHashes':len({hashlib.sha256(f.tobytes()).hexdigest() for f in frames}),'sourceRegions':details}
(OUT/'cleanup-layout-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'candidate':str(atlas_path),'sha256':report['candidateAtlasSha256'],'components':count,'scale':scale,'details':[{'i':x['index'],'bbox':x['sourceBounds'],'size':x['outputSize'],'spill':x['despilledPixels']} for x in details]},indent=2))
