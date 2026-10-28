from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/kraken-pickup5-attempt02-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/kraken-pickup5-attempt02'; POSES=OUT/'poses'
ATLAS=OUT/'kraken-pickup5-attempt02-runtime-candidate.png'; LAYOUT=OUT/'layout.json'; REPORT=OUT/'cleanup-layout-report.json'
CW,CH,BASELINE=80,96,94
OUT.mkdir(parents=True,exist_ok=True); POSES.mkdir(parents=True,exist_ok=True)
im=Image.open(SOURCE).convert('RGBA'); rgba=np.asarray(im); alpha=rgba[:,:,3]
labels,n=ndimage.label(alpha>=32,structure=np.ones((3,3),dtype=np.uint8)); sizes=np.bincount(labels.ravel(),minlength=n+1); ids=[i for i in range(1,n+1) if sizes[i]>40000]
if len(ids)!=5: raise RuntimeError(f'Expected five global alpha>=32 figures, found {len(ids)}')
components=[]
for i in ids:
 y,x=np.where(labels==i); components.append({'id':i,'pixels':int(sizes[i]),'bounds':[int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)],'center':[float(x.mean()),float(y.mean())]})
components.sort(key=lambda c:c['center'][0]); maxw=max(c['bounds'][2]-c['bounds'][0] for c in components); maxh=max(c['bounds'][3]-c['bounds'][1] for c in components); scale=min(70/maxw,73/maxh)
atlas=Image.new('RGBA',(CW*5,CH),(0,0,0,0)); frames=[]; exclusions=[]
for ix,c in enumerate(components):
 x0,y0,x1,y1=c['bounds']; main=labels==c['id']; dist=ndimage.distance_transform_edt(~main); retained=(alpha>=32)|((alpha>0)&(dist<=2.0))
 ca=np.array(rgba[y0:y1,x0:x1],copy=True); ca[:,:,3]=np.where(retained[y0:y1,x0:x1],ca[:,:,3],0); crop=Image.fromarray(ca,'RGBA')
 w,h=round(crop.width*scale),round(crop.height*scale)
 if w>CW-10 or h>73: raise RuntimeError(f'Pose {ix} exceeds safe cell bounds {w}x{h}')
 pose=crop.resize((w,h),Image.Resampling.NEAREST); ox,oy=(CW-w)//2,BASELINE-h; ax=ix*CW; atlas.alpha_composite(pose,(ax+ox,oy))
 pp=POSES/f'pose-{ix:02d}-normalized.png'; pose.save(pp); cell=atlas.crop((ax,0,ax+CW,CH)); b=cell.getchannel('A').getbbox()
 frames.append({'index':ix,'slot':[ix,0],'x':ax,'y':0,'w':CW,'h':CH,'sourceRectLTRB':c['bounds'],'sourceStrongComponentPixels':c['pixels'],'uniformScale':scale,'scaledSize':[w,h],'offsetInCell':[ox,oy],'baselineY':BASELINE,'marginsLTRB':[b[0],b[1],CW-b[2],CH-b[3]],'alphaHash':hashlib.sha256(cell.getchannel('A').tobytes()).hexdigest(),'poseHash':hashlib.sha256(pp.read_bytes()).hexdigest()})
atlas.save(ATLAS)
for name,bg in [('light',(238,240,245,255)),('dark',(28,24,40,255))]:
 board=Image.new('RGBA',(1200,288),bg)
 for i in range(5): board.alpha_composite(atlas.crop((i*CW,0,(i+1)*CW,CH)).resize((240,288),Image.Resampling.NEAREST),(i*240,0))
 board.convert('RGB').save(OUT/f'kraken-pickup5-attempt02-{name}-preview.png'); board.convert('RGB').save(OUT/f'contact-sheet-{name}.png')
layout={'status':'cleanup/layout trial only; independent review pending','source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'atlas':str(ATLAS.relative_to(ROOT)),'atlasSha256':hashlib.sha256(ATLAS.read_bytes()).hexdigest(),'columns':5,'rows':1,'frameWidth':CW,'frameHeight':CH,'uniformScale':scale,'baselineY':BASELINE,'segmentation':'Global full-sheet alpha>=32, assign five main components by center x; retain full component bounds and original-alpha fringe within 2 source pixels; do not slice into fixed source cells.','resampling':'nearest-neighbor','frames':frames}
LAYOUT.write_text(json.dumps(layout,indent=2)+'\n')
removed=(alpha>0)&~np.isin(labels,ids); rl,rn=ndimage.label(removed,structure=np.ones((3,3),dtype=np.uint8)); rs=np.bincount(rl.ravel(),minlength=rn+1)
for i in range(1,rn+1):
 if rs[i]==0: continue
 y,x=np.where(rl==i); cx=float(x.mean()); nearest=min(range(5),key=lambda j:abs(components[j]['center'][0]-cx)); exclusions.append({'nearestPose':nearest,'pixels':int(rs[i]),'boundsLTRB':[int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)],'reason':'detached/background alpha beyond the 2-source-pixel retained figure fringe; original source unchanged'})
report={'status':'cleanup/layout trial only; independent review pending','source':str(SOURCE.relative_to(ROOT)),'sourceAlphaRange':list(im.getchannel('A').getextrema()),'threshold32FigureComponents':len(ids),'removedAlphaComponents':exclusions,'atlas':str(ATLAS.relative_to(ROOT)),'layout':str(LAYOUT.relative_to(ROOT)),'rawPreserved':True,'uniqueFrames':len(set(f['poseHash'] for f in frames)),'minimumMarginsLTRB':[min(f['marginsLTRB'][j] for f in frames) for j in range(4)],'pixelTreatment':'Original RGBA only; nearest-neighbor downscale; no color keying or redrawing.'}
REPORT.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'frames':len(frames),'unique':report['uniqueFrames'],'scale':scale,'margins':report['minimumMarginsLTRB'],'excluded':len(exclusions),'atlas':str(ATLAS.relative_to(ROOT))},indent=2))
