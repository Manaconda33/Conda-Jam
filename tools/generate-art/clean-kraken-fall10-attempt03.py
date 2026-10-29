from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2]
OLD=ROOT/'tools/generate-art/previews/kraken-fall10-attempt02/kraken-fall10-attempt02-runtime-candidate.png'
RAW=ROOT/'tools/generate-art/sources/kraken-fall10-attempt03-pose09-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/kraken-fall10-attempt03/cleanup01';POSES=OUT/'poses'
ATLAS=OUT/'kraken-fall10-attempt03-cleanup01-atlas-candidate.png';LAYOUT=OUT/'layout.json';REPORT=OUT/'cleanup-layout-report.json'
CW,CH,BASELINE=80,96,94
OUT.mkdir(parents=True,exist_ok=True);POSES.mkdir(parents=True,exist_ok=True)
base=Image.open(OLD).convert('RGBA');atlas=Image.new('RGBA',(CW*5,CH*2),(0,0,0,0));frames=[]
for i in range(9):
 x,y=(i%5)*CW,(i//5)*CH;cell=base.crop((x,y,x+CW,y+CH));atlas.alpha_composite(cell,(x,y));b=cell.getchannel('A').getbbox();frames.append({'index':i,'slot':[i%5,i//5],'x':x,'y':y,'w':CW,'h':CH,'baselineY':BASELINE,'marginsLTRB':[b[0],b[1],CW-b[2],CH-b[3]],'lineage':'tools/generate-art/kraken-fall10-attempt02-provenance.json'})
im=Image.open(RAW).convert('RGBA');rgba=np.array(im);alpha=rgba[:,:,3]
labels,n=ndimage.label(alpha>=32,structure=np.ones((3,3),dtype=np.uint8));sizes=np.bincount(labels.ravel(),minlength=n+1);ids=[i for i in range(1,n+1) if sizes[i]>10000]
if len(ids)!=1:raise RuntimeError(f'Expected one replacement figure, got {len(ids)}')
main=labels==ids[0];yy,xx=np.where(main);bounds=[int(xx.min()),int(yy.min()),int(xx.max()+1),int(yy.max()+1)];x0,y0,x1,y1=bounds
# Preserve the opaque outline/core and at most one raw pixel of antialiasing around it.
core=alpha>=160;dist=ndimage.distance_transform_edt(~core);keep=(core)|((alpha>0)&(dist<=1.25))
removed=(alpha>0)&~keep
crop_arr=np.array(rgba[y0:y1,x0:x1],copy=True);crop_arr[:,:,3]=np.where(keep[y0:y1,x0:x1],crop_arr[:,:,3],0);crop=Image.fromarray(crop_arr,'RGBA')
# Match existing upright scale exactly (67 visible pixels), preserve aspect ratio and baseline.
target_h=67;scale=target_h/crop.height;w=round(crop.width*scale);h=target_h
if w>CW-8:raise RuntimeError(f'Pose09 too wide for cell {w}x{h}')
pose=crop.resize((w,h),Image.Resampling.NEAREST);POSES.mkdir(parents=True,exist_ok=True);pose.save(POSES/'pose-09-replacement-normalized.png')
ix=9;col,row=ix%5,ix//5;ox=(CW-w)//2;oy=BASELINE-h;x,y=col*CW,row*CH;atlas.alpha_composite(pose,(x+ox,y+oy));cell=atlas.crop((x,y,x+CW,y+CH));b=cell.getchannel('A').getbbox()
frames.append({'index':9,'slot':[col,row],'x':x,'y':y,'w':CW,'h':CH,'sourceRectLTRB':bounds,'uniformScale':scale,'scaledSize':[w,h],'offsetInCell':[ox,oy],'baselineY':BASELINE,'marginsLTRB':[b[0],b[1],CW-b[2],CH-b[3]],'lineage':'tools/generate-art/kraken-fall10-attempt03-pose09-provenance.json','alphaHash':hashlib.sha256(cell.getchannel('A').tobytes()).hexdigest(),'poseHash':hashlib.sha256((POSES/'pose-09-replacement-normalized.png').read_bytes()).hexdigest()})
atlas.save(ATLAS)
for name,bg in [('light',(238,240,245,255)),('dark',(28,24,40,255))]:
 board=Image.new('RGBA',(1200,576),bg)
 for i in range(10):
  x,y=(i%5)*CW,(i//5)*CH;board.alpha_composite(atlas.crop((x,y,x+CW,y+CH)).resize((240,288),Image.Resampling.NEAREST),((i%5)*240,(i//5)*288))
 board.convert('RGB').save(OUT/f'kraken-fall10-attempt03-{name}-preview.png')
layout={'status':'attempt02 frames0–8 plus independently generated frame9; composite/cleanup trial only','atlas':str(ATLAS.relative_to(ROOT)),'atlasSha256':hashlib.sha256(ATLAS.read_bytes()).hexdigest(),'sourceBaseAtlas':str(OLD.relative_to(ROOT)),'replacementRaw':str(RAW.relative_to(ROOT)),'replacementRawSha256':hashlib.sha256(RAW.read_bytes()).hexdigest(),'columns':5,'rows':2,'frameWidth':CW,'frameHeight':CH,'baselineY':BASELINE,'replacementBounds':bounds,'replacementVisibleSize':[w,h],'replacementScale':scale,'replacementCleanup':'Keep alpha>=160 core plus source-alpha pixels within1.25 source pixels of core; clear further low-alpha fringe. No RGB recolor or geometric distortion.','frames':frames}
LAYOUT.write_text(json.dumps(layout,indent=2)+'\n')
report={'status':'independent full-composite cleanup review pending; not registration ready','strongFigureComponents':1,'rawAlphaRange':list(im.getchannel('A').getextrema()),'replacementBounds':bounds,'replacementRawPixels':int((alpha>0).sum()),'removedLowAlphaPixels':int(removed.sum()),'replacementVisibleSize':[w,h],'baselineY':BASELINE,'frameCount':len(frames),'uniqueFrameHashes':len(set(f.get('poseHash') or hashlib.sha256(atlas.crop((f['x'],f['y'],f['x']+CW,f['y']+CH)).getchannel('A').tobytes()).hexdigest() for f in frames)),'minimumMarginsLTRB':[min(f['marginsLTRB'][j] for f in frames) for j in range(4)],'rawPreserved':True,'atlas':str(ATLAS.relative_to(ROOT)),'layout':str(LAYOUT.relative_to(ROOT))}
REPORT.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'replacementBounds':bounds,'size':[w,h],'removedLowAlphaPixels':int(removed.sum()),'frames':len(frames),'unique':report['uniqueFrameHashes'],'margins':report['minimumMarginsLTRB'],'output':str(ATLAS.relative_to(ROOT))},indent=2))
