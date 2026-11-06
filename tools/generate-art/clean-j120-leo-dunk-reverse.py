#!/usr/bin/env python3
"""Remove only edge-connected neutral checkerboard from J120 attempt02."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'tools/generate-art/sources/j120-leo-dunk-reverse-attempt02-generated-raw.png'
OUTPUT=ROOT/'tools/generate-art/sources/j120-leo-dunk-reverse-attempt02-cleaned.png'
with Image.open(SOURCE) as opened:
    image=opened.convert('RGB'); pixels=np.asarray(image)
values=pixels.astype(np.int16)
neutral=(values.max(axis=2)-values.min(axis=2)<=30)&(values.mean(axis=2)>=150)
components,_=label(neutral,structure=np.ones((3,3),dtype=np.uint8))
edge=np.unique(np.concatenate((components[0],components[-1],components[:,0],components[:,-1])))
background=(components>0)&np.isin(components,edge)
alpha=np.where(background,0,255).astype(np.uint8)
Image.fromarray(np.dstack((pixels,alpha)),'RGBA').save(OUTPUT,optimize=True)
print({'output':str(OUTPUT.relative_to(ROOT)),'size':image.size,'alpha':Image.open(OUTPUT).getchannel('A').getextrema(),'removedPixels':int(background.sum())})
