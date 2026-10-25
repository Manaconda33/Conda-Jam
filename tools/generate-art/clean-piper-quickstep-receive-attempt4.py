#!/usr/bin/env python3
"""Isolate and center Piper's four original receive poses without redrawing."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, label
ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'tools/generate-art/sources/piper-quickstep-receive-attempt4-generated-raw.png'
OUT=ROOT/'tools/generate-art/sources/piper-quickstep-receive-attempt4-clean-candidate.png'
CELL_W,CELL_H=768,512
MAX_SIZE=(600,400)
def main():
 source=np.asarray(Image.open(RAW).convert('RGBA'))
 if source.shape[:2]!=(1024,1536): raise ValueError('Expected 1536x1024 2x2 receive source')
 sheet=np.zeros_like(source);frames=[]
 for i in range(4):
  row,col=divmod(i,2);x0,y0=col*CELL_W,row*CELL_H
  cell=source[y0:y0+CELL_H,x0:x0+CELL_W].copy();labels,count=label(cell[:,:,3]>=64)
  sizes=np.bincount(labels.ravel(),minlength=count+1);sizes[0]=0;component=int(sizes.argmax())
  if sizes[component]<3000: raise ValueError(f'pose {i} has no full-body component')
  core=labels==component;yy,xx=np.where(core);x1,y1,x2,y2=int(xx.min()),int(yy.min()),int(xx.max())+1,int(yy.max())+1
  mx0,my0,mx1,my1=x1,y1,x2,y2;crop=cell[y1:y2,x1:x2].copy();crop_core=core[y1:y2,x1:x2]
  keep=distance_transform_edt(~crop_core)<=2;crop[~keep,3]=0;crop[crop[:,:,3]<8,3]=0
  scale=min(MAX_SIZE[0]/crop.shape[1],MAX_SIZE[1]/crop.shape[0],1.0);w=max(1,round(crop.shape[1]*scale));h=max(1,round(crop.shape[0]*scale))
  resized=Image.fromarray(crop,'RGBA').resize((w,h),Image.Resampling.NEAREST);px,py=(CELL_W-w)//2,(CELL_H-h)//2
  sheet[y0+py:y0+py+h,x0+px:x0+px+w]=np.asarray(resized)
  frames.append({'frame':i,'component':component,'sourceBounds':[mx0,my0,mx1,my1],'sourceMargins':[mx0,CELL_W-mx1,my0,CELL_H-my1], 'scale':round(scale,6),'outputBounds':[px,py,px+w,py+h],'outputMargins':[px,CELL_W-px-w,py,CELL_H-py-h]})
 Image.fromarray(sheet,'RGBA').save(OUT)
 layout={'source':str(RAW.relative_to(ROOT)),'output':str(OUT.relative_to(ROOT)),'columns':2,'rows':2,'cellWidth':CELL_W,'cellHeight':CELL_H,'method':'per-cell largest alpha>=64 component; retain original antialias pixels within a2px dilation; remove alpha<8 and background glow; uniform nearest-neighbor scale to <=600x400 and center in transparent 768x512 cell; no redraw, synthesis or pose rearrangement','frames':frames}
 path=ROOT/'tools/generate-art/piper-quickstep-receive-attempt4-layouts.json';path.write_text(json.dumps(layout,indent=2)+'\n')
 print(f'Cleaned four receive poses -> {OUT.relative_to(ROOT)}')
if __name__=='__main__': main()
