#!/usr/bin/env python3
"""Normalize Piper layup attempt2 into an 8-cell sheet without redraw."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, label
ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'tools/generate-art/sources/piper-quickstep-layup-attempt2-generated-raw.png'
OUT=ROOT/'tools/generate-art/sources/piper-quickstep-layup-attempt2-clean-candidate.png'
CELL=512; MAX_SIZE=(344,380); SOURCE_SIZE=(2048,1024)
def main():
 source=Image.open(RAW).convert('RGBA').resize(SOURCE_SIZE,Image.Resampling.LANCZOS)
 source=np.asarray(source); sheet=np.zeros_like(source); frames=[]
 for i in range(8):
  row,col=divmod(i,4);x0,y0=col*CELL,row*CELL;cell=source[y0:y0+CELL,x0:x0+CELL].copy();labs,count=label(cell[:,:,3]>=224)
  sizes=np.bincount(labs.ravel(),minlength=count+1);sizes[0]=0
  component=int(sizes.argmax())
  if sizes[component]<3000:raise ValueError(f'pose {i} missing opaque body component')
  core=labs==component;yy,xx=np.where(core);x1,y1,x2,y2=int(xx.min()),int(yy.min()),int(xx.max())+1,int(yy.max())+1
  crop=cell[y1:y2,x1:x2].copy();crop_core=core[y1:y2,x1:x2];keep=distance_transform_edt(~crop_core)<=2
  crop[~keep,3]=0;crop[crop[:,:,3]<8,3]=0
  scale=min(MAX_SIZE[0]/crop.shape[1],MAX_SIZE[1]/crop.shape[0],1.0);w=max(1,round(crop.shape[1]*scale));h=max(1,round(crop.shape[0]*scale))
  resized=Image.fromarray(crop,'RGBA').resize((w,h),Image.Resampling.LANCZOS);px,py=(CELL-w)//2,(CELL-h)//2
  sheet[y0+py:y0+py+h,x0+px:x0+px+w]=np.asarray(resized)
  frames.append({'frame':i,'component':component,'sourceBounds':[x1,y1,x2,y2],'sourceMargins':[x1,CELL-x2,y1,CELL-y2],'uniformScale':round(scale,6),'outputBounds':[px,py,px+w,py+h],'outputMargins':[px,CELL-px-w,py,CELL-py-h]})
 Image.fromarray(sheet,'RGBA').save(OUT)
 layout={'source':str(RAW.relative_to(ROOT)),'output':str(OUT.relative_to(ROOT)),'columns':4,'rows':2,'cellWidth':CELL,'cellHeight':CELL,'method':'uniform whole-sheet LANCZOS resize from generated 1774x887 to 2048x1024; in each cell retain the largest alpha>=224 opaque figure component and original RGBA pixels within a 2px dilation, clear outside mask and alpha<8; uniformly scale to <=344x380 and center; no redraw/reorder','frames':frames}
 (ROOT/'tools/generate-art/piper-quickstep-layup-attempt2-layouts.json').write_text(json.dumps(layout,indent=2)+'\n')
 print(f'Cleaned eight layup poses -> {OUT.relative_to(ROOT)}')
if __name__=='__main__':main()
