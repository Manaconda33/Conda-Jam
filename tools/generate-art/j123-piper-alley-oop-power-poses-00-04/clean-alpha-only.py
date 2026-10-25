#!/usr/bin/env python3
"""Conservative alpha-only removal of detached glow around J.123 pose00."""
from pathlib import Path
import hashlib, json
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT=Path(__file__).resolve().parents[3]
BASE=ROOT/'tools/generate-art/j123-piper-alley-oop-power-poses-00-04'
RAW=BASE/'pose-00-attempt1-raw.png'
OUT=BASE/'pose-00-attempt1-alpha-clean-candidate.png'
raw=Image.open(RAW).convert('RGBA')
a=np.asarray(raw.getchannel('A'))
labels,n=ndimage.label(a>128)
areas=np.bincount(labels.ravel()); areas[0]=0
main=labels==int(np.argmax(areas))
# Keep exact original RGB and alpha only for the primary figure plus 2px antialias edge.
allowed=ndimage.binary_dilation(main,iterations=2)
out=np.asarray(raw).copy(); removed=int(((a>0)&~allowed).sum());out[:,:,3][~allowed]=0
Image.fromarray(out,'RGBA').save(OUT)
# Check RGB is unchanged and report transparent margins at alpha>16 and >128.
assert np.array_equal(out[:,:,:3],np.asarray(raw)[:,:,:3])
img=Image.open(OUT).convert('RGBA');alpha=np.asarray(img.getchannel('A'))
report={'raw':str(RAW.relative_to(ROOT)),'rawSha256':hashlib.sha256(RAW.read_bytes()).hexdigest(),'cleanCandidate':str(OUT.relative_to(ROOT)),'cleanSha256':hashlib.sha256(OUT.read_bytes()).hexdigest(),'cleanup':'Keep the largest connected alpha>128 figure, dilate mask by 2px to retain antialiased contours, clear alpha only outside that exterior mask. RGB unchanged byte-for-byte.','componentsAlpha128':n,'primaryComponentPixelsAlpha128':int(areas.max()),'removedExteriorAlphaPixels':removed,'sourcePx':list(img.size),'marginsLTRB':{}}
for t in (16,128):
 y,x=np.where(alpha>t)
 box=[int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)]
 report['marginsLTRB'][str(t)]={'bbox':box,'margins':[box[0],box[1],img.width-box[2],img.height-box[3]]}
(BASE/'pose-00-attempt1-cleanup-layout.json').write_text(json.dumps(report,indent=2)+'\n')
for name,color in [('light',(248,248,246,255)),('dark',(23,24,38,255))]:
 bg=Image.new('RGBA',img.size,color);bg.alpha_composite(img);bg.convert('RGB').save(BASE/f'pose-00-attempt1-clean-candidate-{name}.jpg',quality=94)
print(json.dumps({'rawSha256':report['rawSha256'],'cleanSha256':report['cleanSha256'],'removed':removed,'margins':report['marginsLTRB']},indent=2))
