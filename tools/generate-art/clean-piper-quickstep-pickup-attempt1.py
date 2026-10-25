#!/usr/bin/env python3
"""Isolate and center Piper's five original pickup poses without redrawing."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, label
ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'tools/generate-art/sources/piper-quickstep-pickup-attempt1-generated-raw.png'
OUT=ROOT/'tools/generate-art/sources/piper-quickstep-pickup-attempt1-clean-candidate.png'
CELL=512;MAX_SIZE=(360,400)
def main():
 source=np.asarray(Image.open(RAW).convert('RGBA'))
 if source.shape[:2]!=(1024,1536):raise ValueError('Expected 1536x1024 3x2 pickup source')
 sheet=np.zeros_like(source);frames=[]
 for i in range(6):
  row,col=divmod(i,3);x0,y0=col*CELL,row*CELL;cell=source[y0:y0+CELL,x0:x0+CELL].copy();labs,count=label(cell[:,:,3]>=64)
  sizes=np.bincount(labs.ravel(),minlength=count+1);sizes[0]=0
  if i==5:
   if sizes.max()>500:raise ValueError('Unused cell5 should be empty')
   frames.append({'frame':i,'empty':True,'margins':[CELL]*4});continue
  component=int(sizes.argmax())
  if sizes[component]<3000:raise ValueError(f'pose {i} missing body component')
  core=labs==component;yy,xx=np.where(core);x1,y1,x2,y2=int(xx.min()),int(yy.min()),int(xx.max())+1,int(yy.max())+1
  crop=cell[y1:y2,x1:x2].copy();crop_core=core[y1:y2,x1:x2];keep=distance_transform_edt(~crop_core)<=2;crop[~keep,3]=0;crop[crop[:,:,3]<8,3]=0
  scale=min(MAX_SIZE[0]/crop.shape[1],MAX_SIZE[1]/crop.shape[0],1.0);w=max(1,round(crop.shape[1]*scale));h=max(1,round(crop.shape[0]*scale));resized=Image.fromarray(crop,'RGBA').resize((w,h),Image.Resampling.NEAREST);px,py=(CELL-w)//2,(CELL-h)//2
  sheet[y0+py:y0+py+h,x0+px:x0+px+w]=np.asarray(resized)
  frames.append({'frame':i,'component':component,'sourceBounds':[x1,y1,x2,y2],'sourceMargins':[x1,CELL-x2,y1,CELL-y2],'scale':round(scale,6),'outputBounds':[px,py,px+w,py+h],'outputMargins':[px,CELL-px-w,py,CELL-py-h]})
 Image.fromarray(sheet,'RGBA').save(OUT)
 layout={'source':str(RAW.relative_to(ROOT)),'output':str(OUT.relative_to(ROOT)),'columns':3,'rows':2,'cellWidth':CELL,'cellHeight':CELL,'method':'per-cell largest alpha>=64 component for poses0–4; require cell5 empty; preserve original antialias within2px dilation; remove alpha<8/glow; uniform nearest-neighbor scale to <=360x400 and center in transparent512x512 cell; no redraw or pose rearrangement','frames':frames}
 path=ROOT/'tools/generate-art/piper-quickstep-pickup-attempt1-layouts.json';path.write_text(json.dumps(layout,indent=2)+'\n');print(f'Cleaned five pickup poses and preserved empty sixth cell -> {OUT.relative_to(ROOT)}')
if __name__=='__main__':main()
