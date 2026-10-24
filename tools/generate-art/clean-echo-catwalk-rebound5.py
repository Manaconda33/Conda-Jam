#!/usr/bin/env python3
"""Isolate Echo's five rebound poses from alpha-connected background haze."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, label

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/echo-catwalk-rebound-repair2-generated-raw.png'
OUTPUT=ROOT/'tools/generate-art/sources/echo-catwalk-rebound5.png'

def main():
    pixels=np.array(Image.open(SOURCE).convert('RGBA'))
    output=np.zeros_like(pixels)
    for index in range(5):
        row,column=divmod(index,3)
        y0,y1=row*512,(row+1)*512
        x0,x1=column*512,(column+1)*512
        cell=pixels[y0:y1,x0:x1].copy()
        labels,count=label(cell[:,:,3]>=64,structure=np.ones((3,3),dtype=np.uint8))
        sizes=np.bincount(labels.ravel(),minlength=count+1)
        if count==0 or int(sizes[1:].max())<5000:
            raise ValueError(f'Pose {index} lacks a large connected figure component')
        main_id=int(np.argmax(sizes[1:])+1)
        core=labels==main_id
        nearest=distance_transform_edt(~core)
        keep=core|((cell[:,:,3]>0)&(nearest<=2))
        cell[~keep,3]=0
        bbox=Image.fromarray(cell,'RGBA').getchannel('A').getbbox()
        if bbox is None: raise ValueError(f'Pose {index} is empty')
        crop=Image.fromarray(cell,'RGBA').crop(bbox)
        scale=min(1.0,490/max(crop.size))
        size=(max(1,round(crop.width*scale)),max(1,round(crop.height*scale)))
        crop=crop.resize(size,Image.Resampling.LANCZOS)
        dx=(512-size[0])//2;dy=512-11-size[1]
        if min(dx,dy,512-dx-size[0],512-dy-size[1])<10:
            raise ValueError(f'Pose {index} cannot fit within a 10px margin')
        output[y0+dy:y0+dy+size[1],x0+dx:x0+dx+size[0]]=np.array(crop)
    Image.fromarray(output,'RGBA').save(OUTPUT)
    print(f'Isolated five Echo poses into {OUTPUT.relative_to(ROOT)}; empty cell stays transparent')

if __name__=='__main__': main()
