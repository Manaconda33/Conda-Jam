"""Remove neutral checkerboard touching the source canvas from the Accu dunk sheet."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label
ROOT=Path(__file__).resolve().parents[2]; src=ROOT/'tools/generate-art/sources/accu-dunk-power-generated-raw.png'; out=ROOT/'tools/generate-art/sources/accu-dunk-power-generated-clean.png'
a=np.asarray(Image.open(src).convert('RGB')); mask=((a.max(2)-a.min(2))<=20)&(a.mean(2)>110); labs,_=label(mask); edges=np.unique(np.concatenate((labs[0],labs[-1],labs[:,0],labs[:,-1]))); bg=np.isin(labs,edges[edges>0]); Image.fromarray(np.dstack((a,np.where(bg,0,255).astype(np.uint8))),'RGBA').save(out); print(f'Removed {bg.mean():.1%} edge-connected neutral background')
