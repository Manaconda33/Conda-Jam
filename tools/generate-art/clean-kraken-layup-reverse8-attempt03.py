from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/kraken-layup-reverse8-attempt03-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/kraken-layup-reverse8-attempt03';POSES=OUT/'poses';CW,CH,BASELINE=80,96,94
OUT.mkdir(parents=True,exist_ok=True);POSES.mkdir(parents=True,exist_ok=True)
im=Image.open(SOURCE).convert('RGBA');rgba=np.asarray(im).copy();a=rgba[:,:,3];rgb=rgba[:,:,:3].astype(np.int16)
red=(rgb[:,:,0]>200)&(rgb[:,:,1]<100)&(rgb[:,:,2]<130)&(rgb[:,:,0]>rgb[:,:,1]*1.8)
green=(rgb[:,:,1]>115)&(rgb[:,:,0]<130)&(rgb[:,:,2]<145)&(rgb[:,:,1]>rgb[:,:,0]*1.25);fringe=red|green
clean_a=a.copy();clean_a[fringe]=0;labels,n=ndimage.label(clean_a>=64,structure=np.ones((3,3),dtype=np.uint8));sizes=np.bincount(labels.ravel(),minlength=n+1);components=[]
for cid in range(1,n+1):
 if sizes[cid]<10000:continue
 y,x=np.where(labels==cid);components.append({'id':cid,'pixels':int(sizes[cid]),'bounds':[int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)],'center':[float(x.mean()),float(y.mean())]})
if len(components)!=8:raise RuntimeError(f'Expected8 figures; found{len(components)}')
for c in components:
 cx,cy=c['center'];c['slot']=[min(3,int(cx/(im.width/4))),min(1,int(cy/(im.height/2)))]
components.sort(key=lambda c:(c['slot'][1],c['slot'][0]))
if len({tuple(c['slot']) for c in components})!=8:raise RuntimeError(f'Duplicate/wrong grid slots: {[c["slot"] for c in components]}')
atlas=Image.new('RGBA',(CW*4,CH*2),(0,0,0,0));frames=[]
for ix,c in enumerate(components):
 x0,y0,x1,y1=c['bounds'];core=labels==c['id'];dist=ndimage.distance_transform_edt(~core);keep=(clean_a>=64)&(labels==c['id']);mask=keep|((dist<=2.0)&(clean_a>0)&~fringe)
 crop=rgba[y0:y1,x0:x1].copy();crop[:,:,3]=np.where(mask[y0:y1,x0:x1],clean_a[y0:y1,x0:x1],0);ll,nn=ndimage.label(crop[:,:,3]>=32,structure=np.ones((3,3),dtype=np.uint8));ss=np.bincount(ll.ravel(),minlength=nn+1);valid=np.zeros(ll.shape,bool)
 for cid in range(1,nn+1):
  if ss[cid]>=12:valid|=(ll==cid)
 crop[:,:,3]=np.where(valid,crop[:,:,3],0);pose=Image.fromarray(crop,'RGBA').crop(Image.fromarray(crop,'RGBA').getchannel('A').getbbox())
 scale=min(72/pose.width,73/pose.height);w,h=round(pose.width*scale),round(pose.height*scale)
 if w>CW-8 or h>73:raise RuntimeError(f'pose{ix} exceeds safe cell: {w}x{h}')
 pose=pose.resize((w,h),Image.Resampling.NEAREST);col,row=c['slot'];ox,oy=(CW-w)//2,BASELINE-h;ax,ay=col*CW,row*CH;atlas.alpha_composite(pose,(ax+ox,ay+oy))
 pp=POSES/f'pose-{ix:02d}-normalized.png';pose.save(pp);bb=atlas.crop((ax,ay,ax+CW,ay+CH)).getchannel('A').getbbox()
 frames.append({'index':ix,'slot':c['slot'],'sourceBounds':c['bounds'],'sourceCorePixels':c['pixels'],'scale':scale,'scaledSize':[w,h],'offsetInCell':[ox,oy],'baselineY':BASELINE,'marginsLTRB':[bb[0],bb[1],CW-bb[2],CH-bb[3]],'poseHash':hashlib.sha256(pp.read_bytes()).hexdigest()})
atlas_path=OUT/'kraken-layup-reverse8-attempt03-runtime-candidate.png';atlas.save(atlas_path)
for name,bg in [('light',(238,240,245,255)),('dark',(28,24,40,255))]:
 board=Image.new('RGBA',(960,576),bg)
 for c in components:
  col,row=c['slot'];x,y=col*CW,row*CH;board.alpha_composite(atlas.crop((x,y,x+CW,y+CH)).resize((240,288),Image.Resampling.NEAREST),(col*240,row*288))
 board.convert('RGB').save(OUT/f'kraken-layup-reverse8-attempt03-{name}-preview.png')
report={'status':'cleanup trial only; independent visual review required before any track work or packing','source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'atlas':str(atlas_path.relative_to(ROOT)),'atlasSha256':hashlib.sha256(atlas_path.read_bytes()).hexdigest(),'sourceDimensions':list(im.size),'segmentation':'Retain alpha>=64 figure cores after removal of high-saturation bright red/green edge contamination; retain original-alpha pixels within 2px of the core; discard disconnected components below12 pixels; no RGB edits; nearest-neighbor scale to80x96 and baseline94.','removedRedGreenFringePixels':int(fringe.sum()),'rawPreserved':True,'frames':frames,'uniqueFrames':len(set(f['poseHash'] for f in frames)),'minimumMarginsLTRB':[min(f['marginsLTRB'][i] for f in frames) for i in range(4)]}
(OUT/'cleanup-layout-report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'atlas':str(atlas_path.relative_to(ROOT)),'unique':report['uniqueFrames'],'fringeRemoved':report['removedRedGreenFringePixels'],'margins':report['minimumMarginsLTRB'],'slots':[c['slot'] for c in components]},indent=2))
