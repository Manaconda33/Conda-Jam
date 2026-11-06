"""Create a conservative 80x96 layout trial for Kraken rebound attempt02.

Preserves the source PNG. Alpha below 128 is cleared to remove semitransparent
fringe; retained RGB is nearest-neighbour scaled without painting over pixels.
This is cleanup only; it does not establish source or runtime acceptance.
"""
from pathlib import Path
import json, hashlib
import numpy as np
from PIL import Image
from scipy.ndimage import label

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/kraken-rebound5-attempt02-edited-raw.png'
OUT=ROOT/'tools/generate-art/previews/kraken-rebound5-attempt02/cleanup01'
POSES=OUT/'poses';POSES.mkdir(parents=True,exist_ok=False)
raw=Image.open(SOURCE).convert('RGBA'); arr=np.array(raw); alpha=arr[:,:,3]
labels,count=label(alpha>=128)
components=[]
for i in range(1,count+1):
 ys,xs=np.where(labels==i)
 if len(xs)>30000:
  components.append((int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1),i,int(len(xs))))
components.sort(key=lambda b:b[0])
if len(components)!=5: raise SystemExit(f'Expected 5 large poses, got {len(components)}')
max_h=max(b[3]-b[1] for b in components);scale=70/max_h
atlas=Image.new('RGBA',(400,96),(0,0,0,0));frames=[];pose_meta=[];visible_hashes=[]
for idx,(x0,y0,x1,y1,lab,pixels) in enumerate(components):
 crop=arr[y0:y1,x0:x1].copy();mask=(labels[y0:y1,x0:x1]==lab)&(crop[:,:,3]>=128)
 crop[:,:,3]=np.where(mask,255,0).astype(np.uint8)
 sprite=Image.fromarray(crop,'RGBA')
 size=(max(1,round(sprite.width*scale)),max(1,round(sprite.height*scale)))
 sprite=sprite.resize(size,Image.Resampling.NEAREST)
 cell_x=idx*80;cell_y=0;left=cell_x+(80-size[0])//2;top=94-size[1]
 atlas.alpha_composite(sprite,(left,top));pose_path=POSES/f'pose-{idx:02d}.png';sprite.save(pose_path)
 visible_hashes.append(hashlib.sha256(sprite.tobytes()).hexdigest())
 frames.append({'index':idx,'x':cell_x,'y':0,'w':80,'h':96,'baselineY':94,'marginsLTRB':[left-cell_x,top,cell_x+80-(left+size[0]),96-(top+size[1])]})
 pose_meta.append({'index':idx,'sourceBoundsLTRB':[x0,y0,x1,y1],'sourceOpaquePixels':pixels,'scaledSize':size,'offsetInCell':[left-cell_x,top],'frame':frames[-1],'poseSha256':visible_hashes[-1]})
light=Image.new('RGBA',atlas.size,(235,235,235,255));light.alpha_composite(atlas)
dark=Image.new('RGBA',atlas.size,(23,20,31,255));dark.alpha_composite(atlas)
preview=OUT/'kraken-rebound5-attempt02-cleanup01-atlas-candidate.png';atlas.save(preview)
light.convert('RGB').resize((1200,288),Image.Resampling.NEAREST).save(OUT/'kraken-rebound5-attempt02-cleanup01-light-preview.png')
dark.convert('RGB').resize((1200,288),Image.Resampling.NEAREST).save(OUT/'kraken-rebound5-attempt02-cleanup01-dark-preview.png')
report={'status':'cleanup/layout candidate only; independent visual review pending','source':'tools/generate-art/sources/kraken-rebound5-attempt02-edited-raw.png','sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'atlas':str(preview.relative_to(ROOT)),'atlasSha256':hashlib.sha256(preview.read_bytes()).hexdigest(),'dimensions':[400,96],'grid':[5,1],'baselineY':94,'alphaThreshold':128,'cleanup':'clear alpha<128; preserve opaque RGB; shared uniform nearest-neighbor scale; no repaint or recolor','uniformScale':scale,'componentsAboveThreshold':len(components),'frames':frames,'poseHashes':visible_hashes,'uniquePoseCount':len(set(visible_hashes)),'poses':pose_meta,'transparentOutside':'true; each empty pixel alpha=0'}
(OUT/'cleanup-layout-report.json').write_text(json.dumps(report,indent=2)+'\n')
(OUT/'layout.json').write_text(json.dumps({'columns':5,'rows':1,'frameWidth':80,'frameHeight':96,'baselineY':94,'frames':frames,'atlas':str(preview.relative_to(ROOT))},indent=2)+'\n')
print(json.dumps({'poses':len(frames),'unique':report['uniquePoseCount'],'scale':scale,'margins':[f['marginsLTRB'] for f in frames],'out':str(OUT)}))
