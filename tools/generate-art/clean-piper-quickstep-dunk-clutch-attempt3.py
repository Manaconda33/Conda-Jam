#!/usr/bin/env python3
"""Isolate Piper J.121 clutch poses; retain original pixels, never redraw."""
from __future__ import annotations
import hashlib, importlib.util, json
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'tools/generate-art/sources/piper-quickstep-dunk-clutch-attempt3-generated-raw.png'
OUT=ROOT/'tools/generate-art/sources/piper-quickstep-dunk-clutch-attempt3-clean.png'
LAYOUT=ROOT/'tools/generate-art/piper-quickstep-dunk-clutch-attempt3-layouts.json'
PREVIEWS=ROOT/'tools/generate-art/previews/piper-quickstep-dunk-clutch/attempt3-source'
PACKER=ROOT/'tools/generate-art/package-motion42.py'
spec=importlib.util.spec_from_file_location('motion42',PACKER)
motion42=importlib.util.module_from_spec(spec);spec.loader.exec_module(motion42)
def sha(p:Path)->str:return hashlib.sha256(p.read_bytes()).hexdigest()

def main()->None:
    with Image.open(RAW) as im: source=im.convert('RGBA')
    rects=motion42.inspect_source(RAW,count=15,columns=5,isolate=True)
    crops=motion42.isolated_crops(RAW,rects)
    output=Image.new('RGBA',source.size,(0,0,0,0));records=[]
    for index,(rect,crop) in enumerate(zip(rects,crops)):
        row,col=divmod(index,5);x0=round(col*source.width/5);x1=round((col+1)*source.width/5)
        y0=round(row*source.height/3);y1=round((row+1)*source.height/3)
        bbox=crop.getchannel('A').point(lambda a:255 if a>8 else 0).getbbox()
        if bbox is None:raise ValueError(f'Pose {index} became empty')
        crop=crop.crop(bbox);w,h=crop.size;scale=min(251/w,285/h,1.0)
        size=(max(1,round(w*scale)),max(1,round(h*scale)))
        crop=crop.resize(size,Image.Resampling.LANCZOS)
        dx=x0+(x1-x0-size[0])//2;dy=y1-28-size[1]
        margins=[dx-x0,dy-y0,x1-dx-size[0],y1-dy-size[1]]
        if min(margins)<28:raise ValueError(f'Pose {index} violates 28px clearance: {margins}')
        output.alpha_composite(crop,(dx,dy))
        records.append({'sourceIndex':index,'component':rect['component'],'rawBounds':[rect['x'],rect['y'],rect['x']+rect['w'],rect['y']+rect['h']],'destination':[dx,dy,*size],'uniformScale':round(scale,6),'transparentMarginsLTRBpx':margins})
    output.save(OUT)
    LAYOUT.write_text(json.dumps({'athlete':'piper-quickstep','clip':'dunk-clutch','attempt':3,'rawSource':str(RAW.relative_to(ROOT)),'rawSourceSha256':sha(RAW),'cleanedSource':str(OUT.relative_to(ROOT)),'cleanedSourceSha256':sha(OUT),'size':[source.width,source.height],'layout':'5x3 row-major, fifteen original poses','cleanup':'Isolate alpha-connected character components at >64 with shared package-motion42.py; retain exactly fifteen complete figures, uniformly downsample each to <=251x285 and bottom-align with >=28px source-cell margins. No pose pixels are drawn, synthesized, duplicated or reordered. Detached components below the shared analyzer area floor and exterior alpha are not carried into the clean sheet.','frames':records},indent=2)+'\n')
    PREVIEWS.mkdir(parents=True,exist_ok=True)
    for name,color in [('dark',(22,24,35,255)),('light',(244,244,244,255))]:
        bg=Image.new('RGBA',output.size,color);bg.alpha_composite(output);bg.convert('RGB').save(PREVIEWS/f'clean-{name}.png')
    print(json.dumps({'rawSha256':sha(RAW),'cleanSha256':sha(OUT),'frames':len(records),'minimumMarginPx':min(min(r['transparentMarginsLTRBpx']) for r in records),'minimumAlpha':int(output.getchannel('A').getextrema()[0])}))

if __name__=='__main__':main()
