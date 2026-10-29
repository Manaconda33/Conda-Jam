from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/kraken-layup8-attempt03-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/kraken-layup8-attempt03'; POSES=OUT/'poses'
ATLAS=OUT/'kraken-layup8-attempt03-runtime-candidate.png'; LAYOUT=OUT/'layout.json'; REPORT=OUT/'cleanup-layout-report.json'
CW,CH,BASELINE=80,96,94
OUT.mkdir(parents=True,exist_ok=True); POSES.mkdir(parents=True,exist_ok=True)
im=Image.open(SOURCE).convert('RGBA'); rgba=np.asarray(im); alpha=rgba[:,:,3]
labels,n=ndimage.label(alpha>=32,structure=np.ones((3,3),dtype=np.uint8)); sizes=np.bincount(labels.ravel(),minlength=n+1); ids=[i for i in range(1,n+1) if sizes[i]>30000]
if len(ids)!=8: raise RuntimeError(f'Expected eight full-sheet alpha>=32 figure components; found {len(ids)}')
components=[]
for i in ids:
 y,x=np.where(labels==i); components.append({'id':i,'pixels':int(sizes[i]),'bounds':[int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)],'center':[float(x.mean()),float(y.mean())]})
components.sort(key=lambda c:(int(c['center'][1]>=im.height/2),c['center'][0]))
maxw=max(c['bounds'][2]-c['bounds'][0] for c in components); maxh=max(c['bounds'][3]-c['bounds'][1] for c in components); scale=min(72/maxw,73/maxh)
atlas=Image.new('RGBA',(CW*4,CH*2),(0,0,0,0)); frames=[]
for ix,c in enumerate(components):
 col,row=ix%4,ix//4; x0,y0,x1,y1=c['bounds']; main=labels==c['id']; dist=ndimage.distance_transform_edt(~main); keep=(alpha>=32)|((alpha>0)&(dist<=2.0))
 crop_arr=np.array(rgba[y0:y1,x0:x1],copy=True); crop_arr[:,:,3]=np.where(keep[y0:y1,x0:x1],crop_arr[:,:,3],0); crop=Image.fromarray(crop_arr,'RGBA')
 w,h=round(crop.width*scale),round(crop.height*scale)
 if w>CW-8 or h>73: raise RuntimeError(f'Pose {ix} exceeds safe 80x96 cell: {w}x{h}')
 pose=crop.resize((w,h),Image.Resampling.NEAREST); ox,oy=(CW-w)//2,BASELINE-h; ax,ay=col*CW,row*CH; atlas.alpha_composite(pose,(ax+ox,ay+oy))
 pp=POSES/f'pose-{ix:02d}-normalized.png'; pose.save(pp); cell=atlas.crop((ax,ay,ax+CW,ay+CH)); b=cell.getchannel('A').getbbox()
 frames.append({'index':ix,'slot':[col,row],'x':ax,'y':ay,'w':CW,'h':CH,'sourceRectLTRB':c['bounds'],'sourceStrongComponentPixels':c['pixels'],'uniformScale':scale,'scaledSize':[w,h],'offsetInCell':[ox,oy],'baselineY':BASELINE,'marginsLTRB':[b[0],b[1],CW-b[2],CH-b[3]],'alphaHash':hashlib.sha256(cell.getchannel('A').tobytes()).hexdigest(),'poseHash':hashlib.sha256(pp.read_bytes()).hexdigest()})
atlas.save(ATLAS)
for name,bg in [('light',(238,240,245,255)),('dark',(28,24,40,255))]:
 board=Image.new('RGBA',(960,576),bg)
 for i in range(8):
  x,y=(i%4)*CW,(i//4)*CH; board.alpha_composite(atlas.crop((x,y,x+CW,y+CH)).resize((240,288),Image.Resampling.NEAREST),((i%4)*240,(i//4)*288))
 board.convert('RGB').save(OUT/f'kraken-layup8-attempt03-{name}-preview.png'); board.convert('RGB').save(OUT/f'contact-sheet-{name}.png')
layout={'status':'cleanup/layout trial only; independent source and cleanup reviews pending','source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'atlas':str(ATLAS.relative_to(ROOT)),'atlasSha256':hashlib.sha256(ATLAS.read_bytes()).hexdigest(),'columns':4,'rows':2,'frameWidth':CW,'frameHeight':CH,'uniformScale':scale,'baselineY':BASELINE,'segmentation':'Global full-sheet alpha>=32 components assigned by centroid to row-major cells; full global component bounds preserve any pixels crossing cell seams; retain original-alpha pixels within 2px of each figure.','resampling':'nearest-neighbor','frames':frames}
LAYOUT.write_text(json.dumps(layout,indent=2)+'\n')
# Compact but reproducible summary of discarded background alpha islands.
strong=np.zeros(alpha.shape,dtype=bool)
for i in ids: strong|=(labels==i)
keep_any=strong | ((alpha>0)&(ndimage.distance_transform_edt(~strong)<=2.0)); removed=(alpha>0)&~keep_any
rl,rn=ndimage.label(removed,structure=np.ones((3,3),dtype=np.uint8)); rs=np.bincount(rl.ravel(),minlength=rn+1); items=[]
for i in range(1,rn+1):
 if rs[i]<1: continue
 y,x=np.where(rl==i); items.append({'pixels':int(rs[i]),'boundsLTRB':[int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)]})
items.sort(key=lambda a:a['pixels'],reverse=True)
report={'status':'cleanup/layout trial only; full review required before track work','source':str(SOURCE.relative_to(ROOT)),'sourceAlphaRange':list(im.getchannel('A').getextrema()),'strongFigureComponents':len(ids),'componentBounds':[c['bounds'] for c in components],'removedAlphaIslandCount':len(items),'removedAlphaPixelCount':int(removed.sum()),'largestRemovedIslands':items[:40],'atlas':str(ATLAS.relative_to(ROOT)),'layout':str(LAYOUT.relative_to(ROOT)),'rawPreserved':True,'uniqueFrames':len(set(f['poseHash'] for f in frames)),'minimumMarginsLTRB':[min(f['marginsLTRB'][j] for f in frames) for j in range(4)],'pixelTreatment':'Keep source RGBA pixels; only set distant generated haze/island alpha to zero and scale nearest-neighbor. No keying, recolor, redraw, despill or interpolation.'}
REPORT.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'frames':len(frames),'unique':report['uniqueFrames'],'scale':scale,'margins':report['minimumMarginsLTRB'],'removedComponents':len(items),'removedPixels':int(removed.sum()),'atlas':str(ATLAS.relative_to(ROOT))},indent=2))
