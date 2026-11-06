from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/kraken-pass-behind6-attempt01-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/kraken-pass-behind6-attempt01'
POSES=OUT/'poses'; ATLAS=OUT/'kraken-pass-behind6-attempt01-runtime-candidate.png'; LAYOUT=OUT/'layout.json'; REPORT=OUT/'cleanup-layout-report.json'
CW,CH,BASELINE,TARGET_H=80,96,94,73
OUT.mkdir(parents=True,exist_ok=True); POSES.mkdir(parents=True,exist_ok=True)
im=Image.open(SOURCE).convert('RGBA'); rgba=np.asarray(im); alpha=rgba[:,:,3]
labels,n=ndimage.label(alpha>=32,structure=np.ones((3,3),dtype=np.uint8)); sizes=np.bincount(labels.ravel(),minlength=n+1)
ids=[i for i in range(1,n+1) if sizes[i]>40000]
if len(ids)!=6: raise RuntimeError(f'Expected six alpha>=32 figures, found {len(ids)}')
components=[]
for i in ids:
 y,x=np.where(labels==i); components.append({'id':i,'pixels':int(sizes[i]),'bounds':[int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)],'center':[float(x.mean()),float(y.mean())]})
components.sort(key=lambda c:(int(c['center'][1]>=512),c['center'][0]))
slots=set(); atlas=Image.new('RGBA',(CW*3,CH*2),(0,0,0,0)); frames=[]; excluded=[]
for ix,c in enumerate(components):
 col,row=ix%3,ix//3; slot=(row,col)
 if slot in slots: raise RuntimeError('Duplicate pose slot')
 slots.add(slot); x0,y0,x1,y1=c['bounds']; main=labels==c['id']; distance=ndimage.distance_transform_edt(~main)
 retained=(alpha>=32)|((alpha>0)&(distance<=2.0))
 crop_arr=np.array(rgba[y0:y1,x0:x1],copy=True); crop_arr[:,:,3]=np.where(retained[y0:y1,x0:x1],crop_arr[:,:,3],0)
 crop=Image.fromarray(crop_arr,'RGBA'); scale=min(TARGET_H/crop.height,(CW-8)/crop.width); w,h=round(crop.width*scale),round(crop.height*scale)
 if w>CW-8 or h>TARGET_H: raise RuntimeError(f'Pose {ix} too big {w}x{h}')
 pose=crop.resize((w,h),Image.Resampling.NEAREST); ox,oy=(CW-w)//2,BASELINE-h; ax,ay=col*CW,row*CH; atlas.alpha_composite(pose,(ax+ox,ay+oy))
 pp=POSES/f'pose-{ix:02d}-normalized.png'; pose.save(pp); cell=atlas.crop((ax,ay,ax+CW,ay+CH)); b=cell.getchannel('A').getbbox()
 frames.append({'index':ix,'slot':[col,row],'x':ax,'y':ay,'w':CW,'h':CH,'sourceRectLTRB':c['bounds'],'sourceStrongComponentPixels':c['pixels'],'scale':scale,'scaledSize':[w,h],'offsetInCell':[ox,oy],'baselineY':BASELINE,'marginsLTRB':[b[0],b[1],CW-b[2],CH-b[3]],'alphaHash':hashlib.sha256(cell.getchannel('A').tobytes()).hexdigest(),'poseHash':hashlib.sha256(pp.read_bytes()).hexdigest()})
# Document low-alpha islands removed from the output. Raw source is never changed.
removed=(alpha>0)&~np.isin(labels,ids)
rlabels,rn=ndimage.label(removed,structure=np.ones((3,3),dtype=np.uint8)); rs=np.bincount(rlabels.ravel(),minlength=rn+1)
boxes=[c['bounds'] for c in components]
for ri in range(1,rn+1):
 if rs[ri]==0: continue
 yy,xx=np.where(rlabels==ri); cx=float(xx.mean()); cy=float(yy.mean())
 def bbox_distance(j):
  bx0,by0,bx1,by1=boxes[j]; dx=max(bx0-cx,0,cx-bx1); dy=max(by0-cy,0,cy-by1); return (dx*dx+dy*dy,j)
 near=min(range(6),key=bbox_distance); dist=round(bbox_distance(near)[0]**.5,2)
 excluded.append({'nearestPose':near,'pixels':int(rs[ri]),'boundsLTRB':[int(xx.min()),int(yy.min()),int(xx.max()+1),int(yy.max()+1)],'nearestBoundsDistancePx':dist,'reason':'alpha island outside the retained main silhouette and two-pixel fringe; original pixels remain in the raw source'})
atlas.save(ATLAS)
for name,bg in [('light',(238,240,245,255)),('dark',(28,24,40,255))]:
 board=Image.new('RGBA',(720,576),bg)
 for i in range(6):
  x,y=(i%3)*CW,(i//3)*CH; board.alpha_composite(atlas.crop((x,y,x+CW,y+CH)).resize((240,288),Image.Resampling.NEAREST),((i%3)*240,(i//3)*288))
 board.convert('RGB').save(OUT/f'kraken-pass-behind6-attempt01-{name}-preview.png'); board.convert('RGB').save(OUT/f'contact-sheet-{name}.png')
layout={'status':'cleanup/layout trial only; independent visual review pending','source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'atlas':str(ATLAS.relative_to(ROOT)),'atlasSha256':hashlib.sha256(ATLAS.read_bytes()).hexdigest(),'columns':3,'rows':2,'frameWidth':CW,'frameHeight':CH,'baselineY':BASELINE,'resampling':'nearest-neighbor','segmentation':'Global full-sheet alpha>=32 connected components, assigned by centroid to six row-major poses. Keep each full component bounding box and original-alpha pixels within 2 source pixels; remove farther haze/islands. No blind cell slicing; this preserves behind-back hand and avoids neighbor-row residue. Raw source is unchanged.','frames':frames}
LAYOUT.write_text(json.dumps(layout,indent=2)+'\n')
report={'status':'cleanup/layout trial only; independent visual review pending','source':str(SOURCE.relative_to(ROOT)),'sourceAlphaRange':list(im.getchannel('A').getextrema()),'strongComponents':len(ids),'componentBounds':[c['bounds'] for c in components],'removedLowAlphaComponents':excluded,'atlas':str(ATLAS.relative_to(ROOT)),'layout':str(LAYOUT.relative_to(ROOT)),'rawPreserved':True,'uniqueAlphaFrames':len(set(f['alphaHash'] for f in frames)),'uniqueNormalizedPoses':len(set(f['poseHash'] for f in frames)),'minimumMarginsLTRB':[min(f['marginsLTRB'][i] for f in frames) for i in range(4)],'pixelTreatment':'Original RGBA only; nearest-neighbor scaling, no keying/redraw/despill.'}
REPORT.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'frames':len(frames),'unique':report['uniqueNormalizedPoses'],'removed':len(excluded),'margins':report['minimumMarginsLTRB'],'atlas':str(ATLAS.relative_to(ROOT))},indent=2))
