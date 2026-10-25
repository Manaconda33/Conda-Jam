#!/usr/bin/env python3
"""Isolate and center Piper's six original pass poses without redrawing them."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, label

ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'tools/generate-art/sources/piper-quickstep-pass-attempt1-generated-raw.png'
OUT=ROOT/'tools/generate-art/sources/piper-quickstep-pass-attempt1-clean-candidate.png'
CELL_W,CELL_H=512,512
MAX_SIZE=(330,330)

def main():
    source=np.asarray(Image.open(RAW).convert('RGBA'))
    if source.shape[:2]!=(1024,1536): raise ValueError('Expected 1536x1024 RGBA 3x2 source')
    sheet=np.zeros_like(source); layouts=[]
    for index in range(6):
        row,col=divmod(index,3);x0,y0=col*CELL_W,row*CELL_H
        cell=source[y0:y0+CELL_H,x0:x0+CELL_W].copy()
        components,count=label(cell[:,:,3]>=64)
        if not count: raise ValueError(f'Pose {index}: no alpha>=64 component')
        sizes=np.bincount(components.ravel(),minlength=count+1);sizes[0]=0
        component=int(sizes.argmax());core=components==component
        yy,xx=np.where(core)
        bounds=(int(xx.min()),int(yy.min()),int(xx.max())+1,int(yy.max())+1)
        x1,y1,x2,y2=bounds;margin=2
        x1,y1=max(0,x1-margin),max(0,y1-margin);x2,y2=min(CELL_W,x2+margin),min(CELL_H,y2+margin)
        crop=cell[y1:y2,x1:x2].copy();crop_core=core[y1:y2,x1:x2]
        keep=distance_transform_edt(~crop_core)<=margin
        crop[~keep,3]=0;crop[crop[:,:,3]<8,3]=0
        scale=min(MAX_SIZE[0]/crop.shape[1],MAX_SIZE[1]/crop.shape[0],1.0)
        width=max(1,round(crop.shape[1]*scale));height=max(1,round(crop.shape[0]*scale))
        resized=Image.fromarray(crop,'RGBA').resize((width,height),Image.Resampling.NEAREST)
        px,py=(CELL_W-width)//2,(CELL_H-height)//2
        sheet[y0+py:y0+py+height,x0+px:x0+px+width]=np.asarray(resized)
        layouts.append({'frame':index,'sourceBounds':[int(xx.min()),int(yy.min()),int(xx.max()),int(yy.max())],
          'sourceMargins':[int(xx.min()),CELL_W-1-int(xx.max()),int(yy.min()),CELL_H-1-int(yy.max())],
          'isolatedSourceCrop':[x1,y1,x2,y2],'scale':round(scale,6),
          'outputBounds':[px,py,px+width-1,py+height-1],
          'outputMargins':[px,CELL_W-px-width,py,CELL_H-py-height]})
    Image.fromarray(sheet,'RGBA').save(OUT)
    layout=ROOT/'tools/generate-art/piper-quickstep-pass-attempt1-layouts.json'
    layout.write_text(json.dumps({'source':str(RAW.relative_to(ROOT)),'output':str(OUT.relative_to(ROOT)),
      'method':'per-cell largest alpha>=64 component; retain original antialias pixels within a 2px dilation; remove alpha<8 and low-alpha generated glow; uniform nearest-neighbor scale to <=330x330 and center in transparent 512x512 cell; no redraw, synthesis or pose rearrangement',
      'frames':layouts},indent=2)+'\n')
    print(f'Cleaned six poses -> {OUT.relative_to(ROOT)}')
if __name__=='__main__': main()
