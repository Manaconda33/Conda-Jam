from pathlib import Path
import json, hashlib
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/krios-dunk-clutch15-attempt06-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/krios-dunk-clutch15-attempt06'
OUT.mkdir(parents=True,exist_ok=True)
raw=np.asarray(Image.open(SOURCE).convert('RGB'))
h,w=raw.shape[:2]
regions=[]
# Use the prompt's exact 5x3 cell order. Connected-component grouping across
# the entire sheet is unsafe here because an isolated shoe crosses row gutter.
# Detected black separators are at x=311, 616, 923–924, 1228–1229
# and y=335–336, 655. Exclude separator pixels with 3px inner margins;
# this keeps the cell text and ruled borders out of the figure masks.
xleft=[0,314,619,927,1232]
xright=[309,613,920,1226,w]
ytop=[0,339,659]
ybottom=[333,653,h]
for row in range(3):
 for col in range(5):
  x0,x1=xleft[col],xright[col]
  y0,y1=ytop[row],ybottom[row]
  crop=raw[y0:y1,x0:x1]
  wide=crop.astype(np.int16)
  bg=(wide[:,:,1]>wide[:,:,0]+70)&(wide[:,:,1]>wide[:,:,2]+70)&(wide[:,:,1]>100)
  fg=~bg
  labels,count=ndimage.label(fg,structure=np.ones((3,3),dtype=np.uint8))
  areas=np.bincount(labels.ravel());areas[0]=0
  main=int(np.argmax(areas))
  if areas[main]<5000: raise SystemExit(f'cell {row},{col} main component too small: {areas[main]}')
  discarded=[int(a) for i,a in enumerate(areas) if i not in (0,main) and a>0]
  fg=labels==main
  ys,xs=np.where(fg)
  if len(xs)<5000: raise SystemExit(f'cell {row},{col} has insufficient foreground')
  regions.append({'index':row*5+col,'cell':[x0,y0,x1,y1],'bbox':[x0+int(xs.min()),y0+int(ys.min()),x0+int(xs.max())+1,y0+int(ys.max())+1], 'foreground':fg,'rgb':crop,'discardedComponents':discarded})
scale=min(118/max(r['bbox'][2]-r['bbox'][0] for r in regions),86/max(r['bbox'][3]-r['bbox'][1] for r in regions))
frames=[];poses=[]
for r in regions:
 x0,y0,x1,y1=r['bbox'];cx0,cy0,cx1,cy1=r['cell']
 lx0=x0-cx0;ly0=y0-cy0;lx1=x1-cx0;ly1=y1-cy0
 owned=r['foreground'][ly0:ly1,lx0:lx1]
 rgb=r['rgb'][ly0:ly1,lx0:lx1].copy();wide=rgb.astype(np.int16)
 spill=owned&(wide[:,:,1]>wide[:,:,0]+20)&(wide[:,:,1]>wide[:,:,2]+15)&(wide[:,:,1]>60)
 rgb[spill,1]=((rgb[spill,0].astype(np.uint16)+rgb[spill,2].astype(np.uint16))//2).astype(np.uint8)
 size=(max(1,round((x1-x0)*scale)),max(1,round((y1-y0)*scale)))
 pose=Image.fromarray(np.dstack([rgb,np.where(owned,255,0).astype(np.uint8)]),'RGBA').resize(size,Image.Resampling.NEAREST)
 cell=Image.new('RGBA',(128,96),(0,0,0,0));cell.alpha_composite(pose,((128-pose.width)//2,94-pose.height))
 cell.save(OUT/f'pose-{r["index"]:02d}-isolated.png');frames.append(cell)
 poses.append({'index':r['index'],'sourceCell':r['cell'],'sourceBounds':r['bbox'],'outputSize':size,'outputBounds':cell.getchannel('A').getbbox(),'despilledPixels':int(spill.sum()),'foregroundPixels':int(owned.sum()),'discardedComponents':r['discardedComponents']})
atlas=Image.new('RGBA',(1920,96),(0,0,0,0))
for i,frame in enumerate(frames):atlas.alpha_composite(frame,(i*128,0))
out=OUT/'krios-dunk-clutch15-attempt06-runtime-candidate.png';atlas.save(out)
for kind,color in [('light',(226,226,219,255)),('dark',(28,30,38,255))]:
 bg=Image.new('RGBA',atlas.size,color);bg.alpha_composite(atlas);bg.convert('RGB').save(OUT/f'krios-dunk-clutch15-attempt06-{kind}-preview.png')
report={'source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'sourceDimensions':[w,h],'candidateAtlas':str(out.relative_to(ROOT)),'candidateAtlasSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'algorithm':'Prompt-grid 5x3 cell isolation; per-cell largest 8-connected foreground component retained (small disconnected fragments are excluded and recorded); green-dominance alpha key; uniform nearest-neighbor scale to fit 118x86; transparent 128x96 target cells; shared baseline y94; int16 green despill; no redraw.','cell':[128,96],'sourceGrid':[5,3],'targetGrid':[15,1],'poseCount':len(frames),'uniquePoseHashes':len({hashlib.sha256(f.tobytes()).hexdigest() for f in frames}),'uniformScale':scale,'poses':poses}
(OUT/'cleanup-layout-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'sha256':report['candidateAtlasSha256'],'poses':len(frames),'unique':report['uniquePoseHashes'],'scale':scale},indent=2))
