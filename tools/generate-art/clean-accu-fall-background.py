"""Remove only border-connected near-white background from Accu fall source."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label
ROOT=Path(__file__).resolve().parents[2]; src=ROOT/'tools/generate-art/sources/accu-fall-generated-raw.png'; out=ROOT/'tools/generate-art/sources/accu-fall-generated-clean.png'
a=np.asarray(Image.open(src).convert('RGB')); bg0=(a.min(2)>240)&((a.max(2)-a.min(2))<10)
labels,_=label(bg0); edge=np.unique(np.concatenate((labels[0],labels[-1],labels[:,0],labels[:,-1]))); bg=np.isin(labels,edge[edge>0])
Image.fromarray(np.dstack((a,np.where(bg,0,255).astype(np.uint8))),'RGBA').save(out)
print(f'Removed {bg.mean():.1%} border-connected near-white background pixels')
