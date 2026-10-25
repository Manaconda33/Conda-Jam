#!/usr/bin/env python3
"""Uniformly fit selected isolated J.123 Piper poses to transparent margins."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parent
LIMIT=128

def premul_resize(image,size):
    rgba=np.asarray(image.convert('RGBA'),dtype=np.float32)
    alpha=rgba[:,:,3]/255
    pm=rgba[:,:,:3]*alpha[:,:,None]
    alpha_im=Image.fromarray(alpha,mode='F').resize(size,Image.Resampling.LANCZOS)
    a=np.clip(np.asarray(alpha_im,dtype=np.float32),0,1)
    channels=[]
    for k in range(3):
        ch=Image.fromarray(pm[:,:,k],mode='F').resize(size,Image.Resampling.LANCZOS)
        v=np.asarray(ch,dtype=np.float32)
        channels.append(np.divide(v,a,out=np.zeros_like(v),where=a>1/255))
    out=np.empty((size[1],size[0],4),dtype=np.uint8)
    out[:,:,:3]=np.rint(np.clip(np.stack(channels,axis=2),0,255)).astype(np.uint8)
    out[:,:,3]=np.rint(a*255).astype(np.uint8)
    out[out[:,:,3]==0,:3]=0
    return Image.fromarray(out,'RGBA')

for pose in (6,9):
    src=ROOT/'cleaned'/f'pose-{pose:02d}-attempt1-main-alpha.png'
    image=Image.open(src).convert('RGBA')
    bbox=image.getchannel('A').getbbox()
    crop=image.crop(bbox)
    cw,ch=crop.size
    maxw=image.width-2*LIMIT;maxh=image.height-2*LIMIT
    scale=min(maxw/cw,maxh/ch)
    nw,nh=max(1,round(cw*scale)),max(1,round(ch*scale))
    figure=premul_resize(crop,(nw,nh))
    out=Image.new('RGBA',image.size,(0,0,0,0))
    x=(image.width-nw)//2;y=(image.height-nh)//2
    out.alpha_composite(figure,(x,y))
    target=ROOT/'layout-candidates'/f'pose-{pose:02d}-fit128.png'
    out.save(target)
    bounds=out.getchannel('A').getbbox();margins=[bounds[0],bounds[1],out.width-bounds[2],out.height-bounds[3]]
    for label,bg in [('light',(245,244,239,255)),('dark',(23,24,38,255))]:
        proof=Image.new('RGBA',out.size,bg);proof.alpha_composite(out)
        proof.save(ROOT/'proofs/fit128'/f'pose-{pose:02d}-{label}.png')
    record={'pose':pose,'source':str(src.relative_to(ROOT)),'sourceCanvasPx':list(image.size),'sourceAlphaBBox':list(bbox),'alphaNonzeroMarginsBeforeFit':[bbox[0],bbox[1],image.width-bbox[2],image.height-bbox[3]],'requiredTransparentMarginPx':LIMIT,'uniformScale':round(scale,8),'figureSizePx':[nw,nh],'placementXY':[x,y],'candidate':str(target.relative_to(ROOT)),'candidateAlphaBBox':list(bounds),'candidateAlphaNonzeroMarginsLTRB':[bounds[0],bounds[1],out.width-bounds[2],out.height-bounds[3]],'disposition':'uniform layout candidate; no pixels redrawn'}
    (ROOT/'layout-candidates'/f'pose-{pose:02d}-fit128.json').write_text(json.dumps(record,indent=2)+'\n')
    print(json.dumps(record))
