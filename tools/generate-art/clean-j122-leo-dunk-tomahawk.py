#!/usr/bin/env python3
"""Remove only detached six-pixel-or-smaller alpha specks from the J122 derived source."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy.ndimage import label
ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'tools/generate-art/sources/j122-leo-dunk-tomahawk-attempt01-generated-raw.png'
OUT=ROOT/'tools/generate-art/sources/j122-leo-dunk-tomahawk-attempt01-cleaned.png'
REPORT=ROOT/'tools/generate-art/j122-leo-dunk-tomahawk-cleanup-report.json'
im=Image.open(RAW).convert('RGBA');pixels=np.array(im);alpha=pixels[:,:,3]
labels,count=label(alpha>0,structure=np.ones((3,3),dtype=np.uint8));sizes=np.bincount(labels.ravel())
removed=[]
for idx in range(1,count+1):
    if sizes[idx]<=6:
        ys,xs=np.where(labels==idx)
        pixels[ys,xs,3]=0
        removed.append({'component':idx,'visiblePixels':int(sizes[idx]),'bbox':[int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)]})
Image.fromarray(pixels,'RGBA').save(OUT)
REPORT.write_text(json.dumps({'source':str(RAW.relative_to(ROOT)),'cleanedSource':str(OUT.relative_to(ROOT)),'method':'8-connected alpha components at any nonzero alpha; remove only detached components of <=6 pixels','sourceComponents':int(count),'removedComponents':removed,'removedPixelCount':sum(x['visiblePixels'] for x in removed)},indent=2)+'\n')
print(json.dumps({'cleaned':str(OUT.relative_to(ROOT)),'sourceComponents':count,'removedComponents':len(removed),'removedPixels':sum(x['visiblePixels'] for x in removed)}))
