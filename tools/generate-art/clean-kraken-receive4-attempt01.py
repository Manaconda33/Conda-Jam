from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/kraken-receive4-attempt01-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/kraken-receive4-attempt01'; POSES=OUT/'poses'
ATLAS=OUT/'kraken-receive4-attempt01-runtime-candidate.png'; LAYOUT=OUT/'layout.json'; REPORT=OUT/'cleanup-layout-report.json'
CW,CH,BASELINE=80,96,94
OUT.mkdir(parents=True,exist_ok=True); POSES.mkdir(parents=True,exist_ok=True)
im=Image.open(SOURCE).convert('RGBA'); rgba=np.asarray(im); alpha=rgba[:,:,3]
labels,n=ndimage.label(alpha>=24,structure=np.ones((3,3),dtype=np.uint8)); sizes=np.bincount(labels.ravel(),minlength=n+1); ids=[i for i in range(1,n+1) if sizes[i]>30000]
if len(ids)!=4: raise RuntimeError(f'Expected four strong figures; found {len(ids)}')
components=[]
for i in ids:
 y,x=np.where(labels==i); components.append({'id':i,'pixels':int(sizes[i]),'bounds':[int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)],'center':[float(x.mean()),float(y.mean())]})
components.sort(key=lambda c:(int(c['center'][1]>=599.5),c['center'][0]))
max_h=max(c['bounds'][3]-c['bounds'][1] for c in components); max_w=max(c['bounds'][2]-c['bounds'][0] for c in components); scale=min(73/max_h,70/max_w)
atlas=Image.new('RGBA',(CW*2,CH*2),(0,0,0,0)); frames=[]
for ix,c in enumerate(components):
 col,row=ix%2,ix//2; x0,y0,x1,y1=c['bounds']; main=labels==c['id']; distance=ndimage.distance_transform_edt(~main)
 retained=(alpha>=48)|((alpha>0)&(distance<=1.25))
 ca=np.array(rgba[y0:y1,x0:x1],copy=True); ca[:,:,3]=np.where(retained[y0:y1,x0:x1],ca[:,:,3],0)
 crop=Image.fromarray(ca,'RGBA'); w,h=round(crop.width*scale),round(crop.height*scale)
 if w>CW-8 or h>73: raise RuntimeError(f'Pose {ix} exceeds cell at uniform scale: {w}x{h}')
 pose=crop.resize((w,h),Image.Resampling.NEAREST); ox,oy=(CW-w)//2,BASELINE-h; ax,ay=col*CW,row*CH; atlas.alpha_composite(pose,(ax+ox,ay+oy))
 pp=POSES/f'pose-{ix:02d}-normalized.png'; pose.save(pp); cell=atlas.crop((ax,ay,ax+CW,ay+CH)); b=cell.getchannel('A').getbbox()
 frames.append({'index':ix,'slot':[col,row],'x':ax,'y':ay,'w':CW,'h':CH,'sourceRectLTRB':c['bounds'],'sourceStrongComponentPixels':c['pixels'],'scale':scale,'scaledSize':[w,h],'offsetInCell':[ox,oy],'baselineY':BASELINE,'marginsLTRB':[b[0],b[1],CW-b[2],CH-b[3]],'alphaHash':hashlib.sha256(cell.getchannel('A').tobytes()).hexdigest(),'poseHash':hashlib.sha256(pp.read_bytes()).hexdigest()})
atlas.save(ATLAS)
for name,bg in [('light',(238,240,245,255)),('dark',(28,24,40,255))]:
 board=Image.new('RGBA',(480,576),bg)
 for i in range(4):
  x,y=(i%2)*CW,(i//2)*CH; board.alpha_composite(atlas.crop((x,y,x+CW,y+CH)).resize((240,288),Image.Resampling.NEAREST),((i%2)*240,(i//2)*288))
 board.convert('RGB').save(OUT/f'kraken-receive4-attempt01-{name}-preview.png'); board.convert('RGB').save(OUT/f'contact-sheet-{name}.png')
layout={'status':'cleanup/layout trial only; independent visual review pending','source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'atlas':str(ATLAS.relative_to(ROOT)),'atlasSha256':hashlib.sha256(ATLAS.read_bytes()).hexdigest(),'columns':2,'rows':2,'frameWidth':CW,'frameHeight':CH,'uniformScale':scale,'baselineY':BASELINE,'segmentation':'Global full-sheet alpha>=24; assign four strong components by centroid to row-major poses; retain original-alpha fringe within 1.25 source pixels.','resampling':'nearest-neighbor','frames':frames}
LAYOUT.write_text(json.dumps(layout,indent=2)+'\n')
removed=(alpha>0)&~np.isin(labels,ids); rl,rn=ndimage.label(removed,structure=np.ones((3,3),dtype=np.uint8)); rs=np.bincount(rl.ravel(),minlength=rn+1); exclusions=[]
for i in range(1,rn+1):
 if not rs[i]: continue
 y,x=np.where(rl==i); exclusions.append({'pixels':int(rs[i]),'boundsLTRB':[int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)]})
report={'status':'cleanup/layout trial only; source/track acceptance pending','source':str(SOURCE.relative_to(ROOT)),'sourceAlphaRange':list(im.getchannel('A').getextrema()),'threshold24FigureComponents':len(ids),'removedAlphaIslands':exclusions,'atlas':str(ATLAS.relative_to(ROOT)),'layout':str(LAYOUT.relative_to(ROOT)),'rawPreserved':True,'uniqueFrames':len(set(f['poseHash'] for f in frames)),'minimumMarginsLTRB':[min(f['marginsLTRB'][j] for f in frames) for j in range(4)],'pixelTreatment':'Original RGBA only. Alpha under threshold retained only within a 1.25-source-pixel figure fringe; nearest-neighbor downscale, no chroma recolor/despill.'}
REPORT.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'frames':len(frames),'unique':report['uniqueFrames'],'scale':scale,'margins':report['minimumMarginsLTRB'],'excluded':len(exclusions),'atlas':str(ATLAS.relative_to(ROOT))},indent=2))
