#!/usr/bin/env python3
"""Uniformly center each cleaned source inside an 80px clear transparent margin."""
from pathlib import Path
import hashlib, json
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parent
LIMIT=80

def premul_resize(image,size):
    rgba=np.asarray(image.convert('RGBA'),dtype=np.float32)
    alpha=rgba[:,:,3]/255
    premul=rgba[:,:,:3]*alpha[:,:,None]
    resized_alpha=Image.fromarray(alpha,mode='F').resize(size,Image.Resampling.LANCZOS)
    a=np.clip(np.asarray(resized_alpha,dtype=np.float32),0,1)
    channels=[]
    for k in range(3):
        resized=Image.fromarray(premul[:,:,k],mode='F').resize(size,Image.Resampling.LANCZOS)
        channel=np.asarray(resized,dtype=np.float32)
        channels.append(np.divide(channel,a,out=np.zeros_like(channel),where=a>1/255))
    out=np.empty((size[1],size[0],4),dtype=np.uint8)
    out[:,:,:3]=np.rint(np.clip(np.stack(channels,axis=2),0,255)).astype(np.uint8)
    out[:,:,3]=np.rint(a*255).astype(np.uint8)
    out[out[:,:,3]==0,:3]=0
    return Image.fromarray(out,'RGBA')

for pose in range(5,10):
    source=ROOT/'cleaned'/f'pose-{pose:02d}-attempt1-main-alpha.png'
    image=Image.open(source).convert('RGBA')
    alpha=image.getchannel('A')
    bbox=alpha.point(lambda a:255 if a>16 else 0).getbbox()
    crop=image.crop(bbox)
    maxw=image.width-2*LIMIT-2; maxh=image.height-2*LIMIT-2
    scale=min(maxw/crop.width,maxh/crop.height)
    size=(max(1,round(crop.width*scale)),max(1,round(crop.height*scale)))
    figure=premul_resize(crop,size)
    out=Image.new('RGBA',image.size,(0,0,0,0))
    xy=((out.width-size[0])//2,(out.height-size[1])//2)
    out.alpha_composite(figure,xy)
    dest=ROOT/'layout-candidates'/f'pose-{pose:02d}-fit80.png'
    dest.parent.mkdir(parents=True,exist_ok=True)
    out.save(dest)
    ob=out.getchannel('A').point(lambda a:255 if a>16 else 0).getbbox()
    margins=[ob[0],ob[1],out.width-ob[2],out.height-ob[3]]
    if min(margins)<LIMIT: raise SystemExit(f'pose{pose} fit failed margin: {margins}')
    for name,bg in [('light',(245,244,239,255)),('dark',(23,24,38,255))]:
        proof=Image.new('RGBA',out.size,bg); proof.alpha_composite(out)
        proof.save(ROOT/'proofs'/f'pose-{pose:02d}-fit80-{name}.png')
    source_alpha=Image.open(source).getchannel('A').point(lambda a:255 if a>16 else 0).getbbox()
    record={
      'pose':pose,'source':str(source.relative_to(ROOT)),
      'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),
      'rawSource':f'sources/pose-{pose:02d}-attempt1-raw.png',
      'rawSha256':hashlib.sha256((ROOT/'sources'/f'pose-{pose:02d}-attempt1-raw.png').read_bytes()).hexdigest(),
      'canvasPx':list(image.size),'alpha16CropLTRB':list(bbox),
      'sourceAlpha16MarginsLTRBpx':[source_alpha[0],source_alpha[1],image.width-source_alpha[2],image.height-source_alpha[3]],
      'requiredMarginPx':LIMIT,'scale':round(scale,8),'figurePx':list(size),'placementXY':list(xy),
      'candidate':str(dest.relative_to(ROOT)),'candidateSha256':hashlib.sha256(dest.read_bytes()).hexdigest(),
      'candidateAlpha16MarginsLTRBpx':margins,'method':'Uniform premultiplied-alpha Lanczos downscale and center placement; no redraw or pose alteration.'
    }
    (ROOT/'layout-candidates'/f'pose-{pose:02d}-fit80.json').write_text(json.dumps(record,indent=2)+'\n')
    print(json.dumps({'pose':pose,'candidateSha256':record['candidateSha256'],'scale':record['scale'],'margins':margins}))
