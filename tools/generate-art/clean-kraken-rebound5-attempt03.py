"""Isolate and normalize Kraken rebound attempt03 as an unregistered trial."""
from pathlib import Path
import hashlib, json
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/kraken-rebound5-attempt03-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/kraken-rebound5-attempt03'
OUT.mkdir(parents=True,exist_ok=True)
POSES=OUT/'poses';POSES.mkdir(parents=True,exist_ok=True)
CW,CH,BASELINE=80,96,94
im=Image.open(SOURCE).convert('RGBA');src=np.asarray(im);alpha=src[:,:,3]
labels,n=ndimage.label(alpha>=64,structure=np.ones((3,3),dtype=np.uint8))
sizes=np.bincount(labels.ravel(),minlength=n+1)
columns=[]
for i in range(5):
    left=round(i*im.width/5);right=round((i+1)*im.width/5)
    local=np.zeros(labels.shape,bool);local[:,left:right]=True
    candidates=[cid for cid in range(1,n+1) if sizes[cid]>=1000 and np.any((labels[:,left:right]==cid))]
    candidates.sort(key=lambda cid:int(np.sum((labels[:,left:right]==cid))))
    if not candidates:raise RuntimeError(f'No figure core in horizontal pose slot {i}')
    cid=candidates[-1]
    y,x=np.where((labels==cid)&local)
    columns.append({'index':i,'label':cid,'sourceBounds':[int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)],'corePixels':int(sizes[cid])})
if len(columns)!=5:raise RuntimeError('Expected exactly five pose slots')
atlas=Image.new('RGBA',(CW*4,CH*2),(0,0,0,0));frames=[]
for c in columns:
    i=c['index'];x0,y0,x1,y1=c['sourceBounds'];core=labels==c['label']
    # Keep original-alpha antialias pixels up to two pixels around the connected figure core.
    dist=ndimage.distance_transform_edt(~core);keep=(dist<=2.0)&(alpha>0)
    crop=src[y0:y1,x0:x1].copy();crop[:,:,3]=np.where(keep[y0:y1,x0:x1],alpha[y0:y1,x0:x1],0)
    ll,nn=ndimage.label(crop[:,:,3]>=32,structure=np.ones((3,3),dtype=np.uint8));ss=np.bincount(ll.ravel(),minlength=nn+1);valid=np.zeros(ll.shape,bool)
    for cid in range(1,nn+1):
        if ss[cid]>=12:valid|=ll==cid
    crop[:,:,3]=np.where(valid,crop[:,:,3],0);pose=Image.fromarray(crop,'RGBA');bbox=pose.getchannel('A').getbbox()
    if not bbox:raise RuntimeError(f'Empty pose {i}')
    pose=pose.crop(bbox);scale=min(72/pose.width,72/pose.height);w,h=round(pose.width*scale),round(pose.height*scale)
    pose=pose.resize((w,h),Image.Resampling.NEAREST)
    cell=i if i<4 else 4;col,row=cell%4,cell//4;ox,oy=(CW-w)//2,BASELINE-h
    atlas.alpha_composite(pose,(col*CW+ox,row*CH+oy))
    frame=atlas.crop((col*CW,row*CH,(col+1)*CW,(row+1)*CH)).getchannel('A').getbbox()
    pp=POSES/f'pose-{i:02d}-normalized.png';pose.save(pp)
    frames.append({**c,'slot':[col,row],'scaledSize':[w,h],'scale':scale,'baselineY':BASELINE,'marginsLTRB':[frame[0],frame[1],CW-frame[2],CH-frame[3]],'poseHash':hashlib.sha256(pp.read_bytes()).hexdigest()})
atlas_path=OUT/'kraken-rebound5-attempt03-runtime-candidate.png';atlas.save(atlas_path)
for name,bg in [('light',(238,240,245,255)),('dark',(28,24,40,255))]:
    board=Image.new('RGBA',(960,576),bg)
    for i in range(5):
        col,row=i%4,i//4;board.alpha_composite(atlas.crop((col*CW,row*CH,(col+1)*CW,(row+1)*CH)).resize((240,288),Image.Resampling.NEAREST),(col*240,row*288))
    board.convert('RGB').save(OUT/f'kraken-rebound5-attempt03-{name}-preview.png')
report={'status':'cleanup trial only; independent packed-art review required','source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'atlas':str(atlas_path.relative_to(ROOT)),'atlasSha256':hashlib.sha256(atlas_path.read_bytes()).hexdigest(),'sourceDimensions':list(im.size),'layout':'five row-major pose slots in 4x2 atlas; cells 6-8 empty','cleanup':'Per horizontal source pose slot, retain alpha>=64 connected figure core; preserve original alpha within 2px of core, remove detached components under 12px, no RGB edits; nearest-neighbor normalize to 80x96 with shared baseline y94.','rawPreserved':True,'frames':frames,'uniqueFrames':len(set(f['poseHash'] for f in frames)),'minimumMarginsLTRB':[min(f['marginsLTRB'][i] for f in frames) for i in range(4)],'emptyCells':[5,6,7]}
(OUT/'cleanup-layout-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'atlas':str(atlas_path.relative_to(ROOT)),'unique':report['uniqueFrames'],'margins':report['minimumMarginsLTRB'],'slots':[f['slot'] for f in frames]},indent=2))
