"""Remove low-alpha generated background glow while preserving Krios pose edges."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation, distance_transform_edt
ROOT=Path(__file__).resolve().parents[2]
src=ROOT/'tools/generate-art/sources/krios-pass-overhead6-generated-raw.png'
out=ROOT/'tools/generate-art/sources/krios-pass-overhead6.png'
im=Image.open(src).convert('RGBA'); pix=np.asarray(im).copy(); alpha=pix[:,:,3]
# Keep authored opaque/antialiased silhouette pixels; discard the low-opacity
# colored glow outside the body, except a two-pixel antialias edge around it.
core=alpha>=32
edge=binary_dilation(core,iterations=2)
keep=(alpha>=32)|((alpha>0)&edge)
pix[:,:,3]=np.where(keep,alpha,0).astype(np.uint8)
Image.fromarray(pix,'RGBA').save(out)
print(f'{out.relative_to(ROOT)} {im.size} kept={int(keep.sum())} cleared={int((~keep).sum())}')
