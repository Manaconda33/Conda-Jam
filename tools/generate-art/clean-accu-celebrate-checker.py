"""Remove the neutral checkerboard touching the edges of Accu celebration art."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label
ROOT=Path(__file__).resolve().parents[2]; src=ROOT/'tools/generate-art/sources/accu-celebrate-generated-raw.png'; out=ROOT/'tools/generate-art/sources/accu-celebrate-generated-clean.png'
a=np.asarray(Image.open(src).convert('RGB')); mask=((a.max(2)-a.min(2))<=20)&(a.mean(2)>110)
labs,_=label(mask); e=np.unique(np.concatenate((labs[0],labs[-1],labs[:,0],labs[:,-1]))); bg=np.isin(labs,e[e>0]); rgba=np.dstack((a,np.where(bg,0,255).astype(np.uint8))); padded=np.zeros((rgba.shape[0]+12,rgba.shape[1],4),dtype=np.uint8); padded[6:6+rgba.shape[0]]=rgba; Image.fromarray(padded,'RGBA').save(out); print(f'Removed {bg.mean():.1%} edge-connected neutral checkerboard and added 6px transparent safe margin')
