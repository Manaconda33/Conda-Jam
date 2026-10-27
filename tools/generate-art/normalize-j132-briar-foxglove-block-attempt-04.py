#!/usr/bin/env python3
"""Normalize reviewed J.132 attempt04 into 4 separate 72x95 atlas cells.
Raw generation remains immutable. Only disconnected low-alpha fringe outside
an allowance around each largest alpha>=16 component is cleared. No athlete
pixels are repainted or reconstructed; nearest-neighbor scaling preserves the
source pixel clusters.
"""
from pathlib import Path
import hashlib, json
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/j132-briar-foxglove-block-attempt-04-raw.png'
OUTDIR=ROOT/'tools/generate-art/candidates/j132-briar-foxglove-block-attempt-04'
DEST=OUTDIR/'briar-foxglove-block-4x-candidate.png'
REPORT=OUTDIR/'normalization-report.json'
CELL_W,CELL_H=72,95
SRC_W,SRC_H=627,627
SCALE=.15
BASELINE=89
raw=np.array(Image.open(SOURCE).convert('RGBA'))
if raw.shape[:2] != (1254,1254): raise SystemExit(f'unexpected source dimensions {raw.shape[1]}x{raw.shape[0]}')
out=Image.new('RGBA',(CELL_W*2,CELL_H*2),(0,0,0,0)); records=[]
for i in range(4):
 col,row=i%2,i//2
 cell=raw[row*SRC_H:(row+1)*SRC_H,col*SRC_W:(col+1)*SRC_W].copy()
 alpha=cell[:,:,3]
 labels,n=ndimage.label(alpha>=16,np.ones((3,3),dtype=np.uint8))
 if not n: raise SystemExit(f'pose {i+1} has no alpha>=16 subject')
 sizes=np.bincount(labels.ravel()); sizes[0]=0; mask=labels==int(sizes.argmax())
 ys,xs=np.where(mask); x0,x1=int(xs.min()),int(xs.max()+1); y0,y1=int(ys.min()),int(ys.max()+1)
 halo=np.zeros_like(alpha,dtype=bool); halo[max(0,y0-4):min(SRC_H,y1+4),max(0,x0-4):min(SRC_W,x1+4)]=True
 fringe=(alpha>0)&(alpha<16)&~halo; removed=int(fringe.sum()); cell[fringe,3]=0
 cx0,cx1=max(0,x0-4),min(SRC_W,x1+4); cy0,cy1=max(0,y0-4),min(SRC_H,y1+4)
 crop=Image.fromarray(cell).crop((cx0,cy0,cx1,cy1)); size=(round(crop.width*SCALE),round(crop.height*SCALE)); sprite=crop.resize(size,Image.Resampling.NEAREST)
 if sprite.width>CELL_W-12 or sprite.height>BASELINE-6: raise SystemExit(f'pose {i+1} too large: {sprite.size}')
 dx=col*CELL_W+(CELL_W-sprite.width)//2; dy=row*CELL_H+BASELINE-sprite.height
 out.alpha_composite(sprite,(dx,dy)); local=out.crop((col*CELL_W,row*CELL_H,(col+1)*CELL_W,(row+1)*CELL_H)).getchannel('A').getbbox()
 records.append({'pose':i+1,'sourceAlpha16BBox':[x0,y0,x1,y1],'sourceCrop':[cx0,cy0,cx1,cy1],'uniformScale':SCALE,'normalizedSize':list(sprite.size),'atlasPlacement':[dx,dy],'bboxLocal':list(local) if local else None,'detachedLowAlphaPixelsRemoved':removed,'baselineY':BASELINE})
OUTDIR.mkdir(parents=True,exist_ok=True); out.save(DEST,optimize=True)
REPORT.write_text(json.dumps({'source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'destination':str(DEST.relative_to(ROOT)),'layout':{'columns':2,'rows':2,'cellWidth':CELL_W,'cellHeight':CELL_H},'cleanup':'Only disconnected alpha 1–15 pixels outside 4 source pixels around the largest alpha>=16 component per cell were cleared. No subject pixels repainted. Uniform nearest-neighbor scale 0.15; baseline y=89.','poses':records},indent=2)+'\n')
print(DEST); print(REPORT)
