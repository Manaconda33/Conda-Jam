"""Remove a generated neutral checkerboard while preserving figure pixels.
Usage: python clean-accu-motion-background.py CLIP
"""
from pathlib import Path
import re,sys
import numpy as np
from PIL import Image
from scipy.ndimage import label
ROOT=Path(__file__).resolve().parents[2]
if len(sys.argv)!=2 or not re.fullmatch(r'(?:dunk-[a-z0-9-]+|alley-oop-[a-z0-9-]+)',sys.argv[1]): raise SystemExit('Usage: clean-accu-motion-background.py CLIP')
clip=sys.argv[1]; src=ROOT/f'tools/generate-art/sources/accu-{clip}-generated-raw.png'; out=ROOT/f'tools/generate-art/sources/accu-{clip}-generated-clean.png'
a=np.asarray(Image.open(src).convert('RGB')); mask=((a.max(2)-a.min(2))<=20)&(a.mean(2)>110); labs,_=label(mask); edges=np.unique(np.concatenate((labs[0],labs[-1],labs[:,0],labs[:,-1]))); bg=np.isin(labs,edges[edges>0]); Image.fromarray(np.dstack((a,np.where(bg,0,255).astype(np.uint8))),'RGBA').save(out); print(f'Removed {bg.mean():.1%} border-connected neutral pixels from {clip}')
