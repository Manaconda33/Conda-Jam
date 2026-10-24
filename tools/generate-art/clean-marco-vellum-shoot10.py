#!/usr/bin/env python3
"""Isolate Marco's ten shot poses and remove non-athlete generated components."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt,label
ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'tools/generate-art/sources/marco-vellum-shoot-attempt2-generated-raw.png'
OUT=ROOT/'tools/generate-art/sources/marco-vellum-shoot10.png'
def main():
 p=np.array(Image.open(RAW).convert('RGBA'));o=np.zeros_like(p);h,w=p.shape[:2]
 for i in range(10):
  r,c=divmod(i,5);x0=round(c*w/5);x1=round((c+1)*w/5);y0=round(r*h/2);y1=round((r+1)*h/2)
  cell=p[y0:y1,x0:x1].copy();labels,n=label(cell[:,:,3]>=32);sizes=np.bincount(labels.ravel(),minlength=n+1)
  if n==0 or sizes[1:].max()<5000: raise ValueError(f'Pose {i} has no connected athlete')
  core=labels==(int(np.argmax(sizes[1:]))+1);dist=distance_transform_edt(~core);keep=core|((cell[:,:,3]>0)&(dist<=2));cell[~keep,3]=0;o[y0:y1,x0:x1]=cell
 Image.fromarray(o,'RGBA').save(OUT)
 print(f'Isolated ten Marco shot poses, removing detached non-athlete components -> {OUT.relative_to(ROOT)}')
if __name__=='__main__':main()
