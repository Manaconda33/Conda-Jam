#!/usr/bin/env python3
"""Keep each Echo power-dunk pose and its two-pixel antialias fringe."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, label
ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'tools/generate-art/sources/echo-catwalk-dunk-scythe-generated-raw.png'
OUT=ROOT/'tools/generate-art/sources/echo-catwalk-dunk-scythe15.png'
def main():
 p=np.array(Image.open(RAW).convert('RGBA')); out=np.zeros_like(p)
 h,w=p.shape[:2]
 for i in range(15):
  row,col=divmod(i,5); x0=round(col*w/5);x1=round((col+1)*w/5);y0=round(row*h/3);y1=round((row+1)*h/3)
  cell=p[y0:y1,x0:x1].copy(); labs,n=label(cell[:,:,3]>=32)
  sizes=np.bincount(labs.ravel(),minlength=n+1)
  if n==0 or sizes[1:].max()<4000: raise ValueError(f'Pose {i} missing a clear athlete component')
  core=labs==(int(np.argmax(sizes[1:]))+1); dist=distance_transform_edt(~core)
  keep=core|((cell[:,:,3]>0)&(dist<=2)); cell[~keep,3]=0
  out[y0:y1,x0:x1]=cell
 Image.fromarray(out,'RGBA').save(OUT)
 print(f'Cleaned 15 Echo dunk-scythe poses -> {OUT.relative_to(ROOT)}')
if __name__=='__main__': main()
