#!/usr/bin/env python3
"""Replace only rejected J.121 frame9 with its generated carry-grip correction."""
from __future__ import annotations
import hashlib, importlib.util, json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import find_objects, label

ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/'tools/generate-art'
PRIOR=BASE/'sources/piper-quickstep-dunk-clutch-attempt4-clean.png'
PATCH=BASE/'sources/piper-quickstep-dunk-clutch-attempt5-frame09-generated-raw.png'
OUT=BASE/'sources/piper-quickstep-dunk-clutch-attempt5-clean.png'
LAYOUT=BASE/'piper-quickstep-dunk-clutch-attempt5-layouts.json'
PREVIEWS=BASE/'previews/piper-quickstep-dunk-clutch/attempt5-source'
def sha(p:Path)->str:return hashlib.sha256(p.read_bytes()).hexdigest()

def main()->None:
    with Image.open(PRIOR) as im: output=im.convert('RGBA')
    with Image.open(PATCH) as im: patch=im.convert('RGBA')
    alpha=np.asarray(patch.getchannel('A'));components,n=label(alpha>64)
    sizes=np.bincount(components.ravel())[1:]
    if not len(sizes):raise ValueError('Frame9 edit has no opaque figure')
    largest=int(sizes.argmax())+1
    if sizes[largest-1] < 10000:raise ValueError('Frame9 edit foreground is unexpectedly small')
    ys,xs=find_objects(components)[largest-1]
    crop=patch.crop((xs.start,ys.start,xs.stop,ys.stop))
    cw,ch=crop.size;scale=min(251/cw,285/ch,1.0)
    size=(round(cw*scale),round(ch*scale));crop=crop.resize(size,Image.Resampling.LANCZOS)
    cell=(4,1);x0=round(cell[0]*output.width/5);x1=round((cell[0]+1)*output.width/5)
    y0=round(cell[1]*output.height/3);y1=round((cell[1]+1)*output.height/3)
    output.paste((0,0,0,0),(x0,y0,x1,y1))
    dx=x0+(x1-x0-size[0])//2;dy=y1-28-size[1]
    margins=[dx-x0,dy-y0,x1-dx-size[0],y1-dy-size[1]]
    if min(margins)<28:raise ValueError(f'Frame9 correction violates cell margin: {margins}')
    output.alpha_composite(crop,(dx,dy));output.save(OUT)
    prior_layout=json.loads((BASE/'piper-quickstep-dunk-clutch-attempt4-layouts.json').read_text())
    prior_layout.update({'attempt':5,'rawSource':str(PATCH.relative_to(ROOT)),'rawSourceSha256':sha(PATCH),'cleanedSource':str(OUT.relative_to(ROOT)),'cleanedSourceSha256':sha(OUT),'cleanup':'Start from rejected attempt4 clean 5x3 sheet; replace only canonical frame9 with the separately generated transparent frame09 edit, isolate its largest alpha-connected character component, uniformly fit to <=251x285, bottom-align with >=28px cell margins. No other frame changed or pose duplicated/reordered.','frame9Replacement':{'generationId':'exec-e362fcf6-8ba5-48d8-946f-1ca3c5e0fb6f','generatedPatchSha256':sha(PATCH),'rawPatchBounds':[xs.start,ys.start,xs.stop,ys.stop],'destination':[dx,dy,*size],'uniformScale':round(scale,6),'transparentMarginsLTRBpx':margins}})
    prior_layout['frames'][9].update({'source':'attempt5 generated frame9 correction','component':int(largest),'rawBounds':[xs.start,ys.start,xs.stop,ys.stop],'destination':[dx,dy,*size],'uniformScale':round(scale,6),'transparentMarginsLTRBpx':margins})
    LAYOUT.write_text(json.dumps(prior_layout,indent=2)+'\n')
    PREVIEWS.mkdir(parents=True,exist_ok=True)
    for name,color in [('dark',(22,24,35,255)),('light',(244,244,244,255))]:
        bg=Image.new('RGBA',output.size,color);bg.alpha_composite(output);bg.convert('RGB').save(PREVIEWS/f'clean-{name}.png')
    print(json.dumps({'componentCount':int(n),'selectedAreaPx':int(sizes[largest-1]),'frame9PatchBounds':[xs.start,ys.start,xs.stop,ys.stop],'destination':[dx,dy,*size],'margins':margins,'rawSha256':sha(PATCH),'cleanSha256':sha(OUT)}))
if __name__=='__main__':main()
