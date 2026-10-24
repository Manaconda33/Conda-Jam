"""Remove border-connected neutral checkerboard pixels from Accu rebound source."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label
ROOT=Path(__file__).resolve().parents[2]
src=ROOT/'tools/generate-art/sources/accu-rebound-generated-raw.png'; out=ROOT/'tools/generate-art/sources/accu-rebound-generated-clean.png'
a=np.asarray(Image.open(src).convert('RGB')); neutral=(a.max(2)-a.min(2)<=20)&(a.mean(2)>110)
labels,_=label(neutral); edges=np.unique(np.concatenate((labels[0],labels[-1],labels[:,0],labels[:,-1]))); bg=np.isin(labels,edges[edges>0])
Image.fromarray(np.dstack((a,np.where(bg,0,255).astype(np.uint8))),'RGBA').save(out)
print(f'Removed {bg.mean():.1%} border-connected neutral pixels')
