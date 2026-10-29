from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/kraken-push11-attempt01-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/kraken-push11-attempt01'; POSES=OUT/'poses'; CW,CH,BASELINE=80,96,94
OUT.mkdir(parents=True,exist_ok=True); POSES.mkdir(parents=True,exist_ok=True)
im=Image.open(SOURCE).convert('RGBA'); rgba=np.asarray(im).copy(); a=rgba[:,:,3]; rgb=rgba[:,:,:3].astype(np.int16)
# The source generator left bright red/green key-color contamination on silhouette edges.
red=(rgb[:,:,0]>200)&(rgb[:,:,1]<100)&(rgb[:,:,2]<130)&(rgb[:,:,0]>rgb[:,:,1]*1.8)
green=(rgb[:,:,1]>115)&(rgb[:,:,0]<130)&(rgb[:,:,2]<145)&(rgb[:,:,1]>rgb[:,:,0]*1.25)
contaminant=red|green; clean_a=a.copy(); clean_a[contaminant]=0
labels,n=ndimage.label(clean_a>=64,structure=np.ones((3,3),dtype=np.uint8)); sizes=np.bincount(labels.ravel(),minlength=n+1)
components=[]
for cid in range(1,n+1):
 if sizes[cid]<10000: continue
 y,x=np.where(labels==cid); components.append({'id':cid,'pixels':int(sizes[cid]),'bounds':[int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)],'center':[float(x.mean()),float(y.mean())]})
if len(components)!=11: raise RuntimeError(f'Expected 11 figures, found {len(components)}')
# Three row bands and four columns retain left-to-right, top-to-bottom sheet order.
for c in components:
 cx,cy=c['center']; c['slot']=[min(3,int(cx/(im.width/4))),min(2,int(cy/(im.height/3)))]
components.sort(key=lambda c:(c['slot'][1],c['slot'][0]))
if len({tuple(c['slot']) for c in components})!=11: raise RuntimeError(f'Overlapping/duplicate cell slots: {[c["slot"] for c in components]}')
atlas=Image.new('RGBA',(CW*4,CH*3),(0,0,0,0)); frames=[]
for ix,c in enumerate(components):
 x0,y0,x1,y1=c['bounds']; core=labels==c['id']; dist=ndimage.distance_transform_edt(~core); keep=(clean_a>=64)&(labels==c['id']); fringe=(dist<=2.0)&(clean_a>0)&~contaminant; mask=keep|fringe
 crop=rgba[y0:y1,x0:x1].copy(); local=mask[y0:y1,x0:x1]; crop[:,:,3]=np.where(local,clean_a[y0:y1,x0:x1],0)
 # Remove tiny disconnected antialias debris while preserving all connected figure pixels.
 ll,nn=ndimage.label(crop[:,:,3]>=32,structure=np.ones((3,3),dtype=np.uint8)); ss=np.bincount(ll.ravel(),minlength=nn+1); valid=np.zeros(ll.shape,bool)
 for j in range(1,nn+1):
  if ss[j]>=12: valid|=(ll==j)
 crop[:,:,3]=np.where(valid,crop[:,:,3],0)
 pose=Image.fromarray(crop,'RGBA'); bbox=pose.getchannel('A').getbbox()
 pose=pose.crop(bbox); scale=min(72/pose.width,73/pose.height); w,h=round(pose.width*scale),round(pose.height*scale)
 if w>CW-8 or h>73: raise RuntimeError(f'Pose {ix} exceeds safe cell bounds: {w}x{h}')
 pose=pose.resize((w,h),Image.Resampling.NEAREST); col,row=c['slot']; ox,oy=(CW-w)//2,BASELINE-h; ax,ay=col*CW,row*CH; atlas.alpha_composite(pose,(ax+ox,ay+oy))
 pp=POSES/f'pose-{ix:02d}-normalized.png'; pose.save(pp); cell=atlas.crop((ax,ay,ax+CW,ay+CH)); bb=cell.getchannel('A').getbbox()
 frames.append({'index':ix,'slot':c['slot'],'sourceBounds':c['bounds'],'sourceCorePixels':c['pixels'],'scale':scale,'scaledSize':[w,h],'offsetInCell':[ox,oy],'baselineY':BASELINE,'marginsLTRB':[bb[0],bb[1],CW-bb[2],CH-bb[3]],'poseHash':hashlib.sha256(pp.read_bytes()).hexdigest()})
atlas_path=OUT/'kraken-push11-attempt01-runtime-candidate.png'; atlas.save(atlas_path)
for name,bg in [('light',(238,240,245,255)),('dark',(28,24,40,255))]:
 board=Image.new('RGBA',(960,864),bg)
 for c in components:
  col,row=c['slot']; x,y=col*CW,row*CH; board.alpha_composite(atlas.crop((x,y,x+CW,y+CH)).resize((240,288),Image.Resampling.NEAREST),(col*240,row*288))
 board.convert('RGB').save(OUT/f'kraken-push11-attempt01-{name}-preview.png')
report={'status':'cleanup/layout candidate; independent review required before ball-track work or packing','source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'atlas':str(atlas_path.relative_to(ROOT)),'atlasSha256':hashlib.sha256(atlas_path.read_bytes()).hexdigest(),'sourceDimensions':list(im.size),'segmentation':'Global RGBA alpha>=64 after removing explicit high-saturation bright red/green edge-key contamination; retain connected figure cores and original-alpha pixels within 2px; discard disconnected cleaned components below12 pixels. No pixel recoloring.','removedColorFringePixels':int(contaminant.sum()),'removedDisconnectedPixels':int(((a>0)&~contaminant&(clean_a>0)&(ndimage.distance_transform_edt(~(clean_a>=64))>2)).sum()),'resampling':'nearest-neighbor; uniform scale to max72x73; baseline94','rawPreserved':True,'frames':frames,'uniqueFrames':len(set(f['poseHash'] for f in frames)),'minimumMarginsLTRB':[min(f['marginsLTRB'][j] for f in frames) for j in range(4)]}
(OUT/'cleanup-layout-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'atlas':str(atlas_path.relative_to(ROOT)),'unique':report['uniqueFrames'],'removedFringe':report['removedColorFringePixels'],'margins':report['minimumMarginsLTRB'],'slots':[c['slot'] for c in components]},indent=2))
