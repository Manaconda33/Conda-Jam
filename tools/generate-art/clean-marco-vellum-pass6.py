#!/usr/bin/env python3
"""Isolate Marco's six chest-pass poses after localized ball-art removal."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt,label
ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'tools/generate-art/sources/marco-vellum-pass-ball-cleanup-generated.png'
OUT=ROOT/'tools/generate-art/sources/marco-vellum-pass6.png'
def main():
 p=np.array(Image.open(RAW).convert('RGBA'));o=np.zeros_like(p);h,w=p.shape[:2]
 for i in range(6):
  r,c=divmod(i,3);x0=round(c*w/3);x1=round((c+1)*w/3);y0=round(r*h/2);y1=round((r+1)*h/2);cell=p[y0:y1,x0:x1].copy();l,n=label(cell[:,:,3]>=32);s=np.bincount(l.ravel(),minlength=n+1)
  if n==0 or s[1:].max()<4000:raise ValueError(f'Pose {i} has no clear athlete')
  core=l==(int(np.argmax(s[1:]))+1);d=distance_transform_edt(~core);keep=core|((cell[:,:,3]>0)&(d<=2));cell[~keep,3]=0;o[y0:y1,x0:x1]=cell
 Image.fromarray(o,'RGBA').save(OUT);print(f'Isolated six Marco chest-pass poses -> {OUT.relative_to(ROOT)}')
if __name__=='__main__':main()
