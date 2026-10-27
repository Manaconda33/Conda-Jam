#!/usr/bin/env python3
"""Normalize J.133 attempt02 into eight 72x95 cells; raw source stays unchanged."""
from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/j133-briar-foxglove-steal-attempt-02-raw.png'
OUT=ROOT/'tools/generate-art/candidates/j133-briar-foxglove-steal-attempt-02'
DEST=OUT/'briar-foxglove-steal-8x-candidate.png'; REPORT=OUT/'normalization-report.json'
CW,CH,SW,SH=72,95,386,509; SCALE=.18; BASELINE=89
raw=np.array(Image.open(SOURCE).convert('RGBA'))
if raw.shape[:2]!=(1018,1544): raise SystemExit(f'unexpected dimensions {raw.shape[1]}x{raw.shape[0]}')
out=Image.new('RGBA',(CW*4,CH*2),(0,0,0,0)); records=[]
for i in range(8):
 col,row=i%4,i//4; cell=raw[row*SH:(row+1)*SH,col*SW:(col+1)*SW].copy(); alpha=cell[:,:,3]
 labels,n=ndimage.label(alpha>=16,np.ones((3,3),dtype=np.uint8))
 if not n: raise SystemExit(f'pose {i+1} has no alpha>=16 subject')
 sizes=np.bincount(labels.ravel()); sizes[0]=0; mask=labels==int(sizes.argmax()); ys,xs=np.where(mask)
 x0,x1=int(xs.min()),int(xs.max()+1); y0,y1=int(ys.min()),int(ys.max()+1)
 halo=np.zeros_like(alpha,dtype=bool); halo[max(0,y0-4):min(SH,y1+4),max(0,x0-4):min(SW,x1+4)]=True
 fringe=(alpha>0)&(alpha<16)&~halo; removed=int(fringe.sum()); cell[fringe,3]=0
 cx0,cx1=max(0,x0-4),min(SW,x1+4); cy0,cy1=max(0,y0-4),min(SH,y1+4)
 crop=Image.fromarray(cell).crop((cx0,cy0,cx1,cy1)); size=(round(crop.width*SCALE),round(crop.height*SCALE)); sprite=crop.resize(size,Image.Resampling.NEAREST)
 if sprite.width>CW-12 or sprite.height>BASELINE-6: raise SystemExit(f'pose {i+1} does not fit: {sprite.size}')
 dx=col*CW+(CW-sprite.width)//2; dy=row*CH+BASELINE-sprite.height; out.alpha_composite(sprite,(dx,dy))
 local=out.crop((col*CW,row*CH,(col+1)*CW,(row+1)*CH)).getchannel('A').getbbox()
 records.append({'pose':i+1,'sourceAlpha16BBox':[x0,y0,x1,y1],'sourceCrop':[cx0,cy0,cx1,cy1],'uniformScale':SCALE,'normalizedSize':list(sprite.size),'atlasPlacement':[dx,dy],'bboxLocal':list(local) if local else None,'detachedLowAlphaPixelsRemoved':removed,'baselineY':BASELINE})
OUT.mkdir(parents=True,exist_ok=True); out.save(DEST,optimize=True)
REPORT.write_text(json.dumps({'source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'destination':str(DEST.relative_to(ROOT)),'layout':{'columns':4,'rows':2,'cellWidth':CW,'cellHeight':CH},'cleanup':'Only disconnected alpha1–15 pixels outside 4 source pixels around the largest alpha>=16 component were cleared. No subject pixels repainted. Shared uniform nearest-neighbor scale .18 and baseline y=89.','poses':records},indent=2)+'\n')
print(DEST);print(REPORT)
