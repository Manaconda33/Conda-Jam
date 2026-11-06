from pathlib import Path
import hashlib, json
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/kraken-pass-overhead6-attempt02-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/kraken-pass-overhead6-attempt02'
POSES=OUT/'poses-v2'
ATLAS=OUT/'kraken-pass-overhead6-attempt02-runtime-candidate-v2.png'
LAYOUT=OUT/'layout-v2.json'
REPORT=OUT/'cleanup-layout-report-v2.json'
CELL_W,CELL_H,BASELINE=80,96,94
TARGET_H=73
OUT.mkdir(parents=True,exist_ok=True); POSES.mkdir(parents=True,exist_ok=True)
im=Image.open(SOURCE).convert('RGBA'); arr=np.asarray(im); alpha=arr[:,:,3]
strong=alpha>=32
labels,n=ndimage.label(strong,structure=np.ones((3,3),dtype=np.uint8))
sizes=np.bincount(labels.ravel(),minlength=n+1)
large=[i for i in range(1,n+1) if sizes[i]>40000]
if len(large)!=6: raise RuntimeError(f'Expected exactly six strong figure components; found {len(large)}')
components=[]
for i in large:
 yy,xx=np.where(labels==i); x0,x1=int(xx.min()),int(xx.max()+1); y0,y1=int(yy.min()),int(yy.max()+1)
 components.append({'label':i,'pixels':int(sizes[i]),'bbox':[x0,y0,x1,y1],'cx':float(xx.mean()),'cy':float(yy.mean())})
# Assign each full cross-cell component to the 3x2 grid from its centroid. Bounding
# boxes remain global, so raised hands extending across a nominal row boundary survive.
components.sort(key=lambda c:(int(c['cy']>=512),c['cx']))
slots=set()
for c in components:
 slot=(int(c['cy']//512),int(c['cx']//512))
 if slot in slots: raise RuntimeError(f'Duplicate grid slot {slot}')
 slots.add(slot); c['slot']=[slot[1],slot[0]]
if slots!={(y,x) for y in range(2) for x in range(3)}: raise RuntimeError(f'Unexpected figure slots: {slots}')
atlas=Image.new('RGBA',(CELL_W*3,CELL_H*2),(0,0,0,0)); frames=[]; excluded=[]
for idx,c in enumerate(components):
 i=c['label']; x0,y0,x1,y1=c['bbox']; main=(labels==i)
 dist=ndimage.distance_transform_edt(~main)
 retained=(alpha>=32)|((alpha>0)&(dist<=2.0))
 # Keep only this figure and its original two-pixel antialias fringe.
 mask=np.zeros(alpha.shape,dtype=bool); mask[y0:y1,x0:x1]=retained[y0:y1,x0:x1]
 crop_arr=np.array(arr[y0:y1,x0:x1],copy=True)
 crop_arr[:,:,3]=np.where(mask[y0:y1,x0:x1],crop_arr[:,:,3],0)
 crop=Image.fromarray(crop_arr,'RGBA')
 scale=min(TARGET_H/crop.height,(CELL_W-8)/crop.width)
 w,h=round(crop.width*scale),round(crop.height*scale)
 if h>TARGET_H or w>CELL_W-8: raise RuntimeError(f'Pose {idx} exceeds bounds {w}x{h}')
 pose=crop.resize((w,h),Image.Resampling.NEAREST)
 ox,oy=(CELL_W-w)//2,BASELINE-h
 ax,ay=(idx%3)*CELL_W,(idx//3)*CELL_H
 atlas.alpha_composite(pose,(ax+ox,ay+oy))
 pp=POSES/f'pose-{idx:02d}-normalized.png'; pose.save(pp)
 cell=atlas.crop((ax,ay,ax+CELL_W,ay+CELL_H)); b=cell.getchannel('A').getbbox()
 frames.append({'index':idx,'slot':c['slot'],'x':ax,'y':ay,'w':CELL_W,'h':CELL_H,'sourceRectLTRB':c['bbox'],'sourceComponentPixels':c['pixels'],'scale':scale,'scaledSize':[w,h],'offsetInCell':[ox,oy],'baselineY':BASELINE,'marginsLTRB':[b[0],b[1],CELL_W-b[2],CELL_H-b[3]],'alphaHash':hashlib.sha256(cell.getchannel('A').tobytes()).hexdigest(),'poseHash':hashlib.sha256(pp.read_bytes()).hexdigest()})
 # Record any strong components or low-alpha islands removed from this source crop region.
 near=np.zeros(alpha.shape,dtype=bool); near[y0:y1,x0:x1]=dist[y0:y1,x0:x1]<=2
 removed=(alpha>0)&~near
 rl,rn=ndimage.label(removed,structure=np.ones((3,3),dtype=np.uint8)); rs=np.bincount(rl.ravel(),minlength=rn+1)
 for ri in range(1,rn+1):
  if rs[ri]==0: continue
  ry,rx=np.where(rl==ri)
  if rx.max()<x0-20 or rx.min()>x1+20 or ry.max()<y0-20 or ry.min()>y1+20: continue
  excluded.append({'pose':idx,'pixels':int(rs[ri]),'sourceBoundsLTRB':[int(rx.min()),int(ry.min()),int(rx.max()+1),int(ry.max()+1)],'reason':'generated haze or detached component outside the reviewed silhouette and two-pixel antialias fringe'})
atlas.save(ATLAS)
for name,bg in [('light',(238,240,245,255)),('dark',(28,24,40,255))]:
 board=Image.new('RGBA',(720,576),bg)
 for i in range(6):
  x,y=(i%3)*80,(i//3)*96
  board.alpha_composite(atlas.crop((x,y,x+80,y+96)).resize((240,288),Image.Resampling.NEAREST),((i%3)*240,(i//3)*288))
 board.convert('RGB').save(OUT/f'kraken-pass-overhead6-attempt02-{name}-preview-v2.png')
 board.convert('RGB').save(OUT/f'contact-sheet-{name}-v2.png')
layout={'status':'corrected cleanup/layout trial after v1 rejection; not registered or accepted','source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'atlas':str(ATLAS.relative_to(ROOT)),'atlasSha256':hashlib.sha256(ATLAS.read_bytes()).hexdigest(),'columns':3,'rows':2,'frameWidth':CELL_W,'frameHeight':CELL_H,'baselineY':BASELINE,'resampling':'nearest-neighbor','segmentation':'Label the full raw image globally at alpha>=32, assign each of exactly six strong silhouette components by centroid to its row-major grid cell, crop full global component bounds (including any pixels crossing nominal cell seams), retain original alpha only within a 2-source-pixel silhouette fringe; raw remains unchanged.','frames':frames}
LAYOUT.write_text(json.dumps(layout,indent=2)+'\n')
report={'status':'v2 corrected cleanup; independent review required before ball-track trials','source':str(SOURCE.relative_to(ROOT)),'sourceAlphaRange':list(im.getchannel('A').getextrema()),'threshold32StrongComponents':len(large),'componentBounds':[c['bbox'] for c in components],'seamCrossings':{str(f['index']):f['sourceRectLTRB'] for f in frames if f['sourceRectLTRB'][1]<512*(f['index']//3) or f['sourceRectLTRB'][3]>512*(f['index']//3+1)},'removedAlphaFragmentsNearComponentBounds':excluded,'atlas':str(ATLAS.relative_to(ROOT)),'layout':str(LAYOUT.relative_to(ROOT)),'rawPreserved':True,'uniqueAlphaFrames':len(set(f['alphaHash'] for f in frames)),'uniqueNormalizedPoses':len(set(f['poseHash'] for f in frames)),'minimumMarginsLTRB':[min(f['marginsLTRB'][i] for f in frames) for i in range(4)],'pixelTreatment':'Original source RGBA pixels; no keying, redraw, color replacement, despill, or interpolation. Nearest-neighbor scaling only.'}
REPORT.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'frameCount':len(frames),'unique':report['uniqueNormalizedPoses'],'seamCrossings':report['seamCrossings'],'margins':report['minimumMarginsLTRB'],'atlas':str(ATLAS.relative_to(ROOT))},indent=2))
