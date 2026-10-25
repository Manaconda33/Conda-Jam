#!/usr/bin/env python3
"""Review-only 128x96 native cell previews for J.124 opening poses."""
from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parent
W,H=128,96; LIMIT_X=8; LIMIT_TOP=8; BASELINE=87; MAX_H=80; MAX_W=112

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def premul_resize(image,size):
 rgba=np.asarray(image.convert('RGBA'),dtype=np.float32);a=rgba[:,:,3]/255; premul=rgba[:,:,:3]*a[:,:,None]
 ra=np.asarray(Image.fromarray(a,mode='F').resize(size,Image.Resampling.LANCZOS),dtype=np.float32).clip(0,1)
 cs=[]
 for k in range(3):
  c=np.asarray(Image.fromarray(premul[:,:,k],mode='F').resize(size,Image.Resampling.LANCZOS),dtype=np.float32)
  cs.append(np.divide(c,ra,out=np.zeros_like(c),where=ra>1/255))
 o=np.empty((size[1],size[0],4),dtype=np.uint8);o[:,:,:3]=np.rint(np.clip(np.stack(cs,axis=2),0,255)).astype(np.uint8);o[:,:,3]=np.rint(ra*255).astype(np.uint8);o[o[:,:,3]==0,:3]=0
 return Image.fromarray(o,'RGBA')
def margins(img):
 b=img.getchannel('A').point(lambda a:255 if a>16 else 0).getbbox();return [b[0],b[1],img.width-b[2],img.height-b[3]] if b else None
for pose in range(5):
 src=ROOT/'cleaned'/f'pose-{pose:02d}-attempt1-main-alpha.png';im=Image.open(src).convert('RGBA')
 bbox=im.getchannel('A').point(lambda a:255 if a>16 else 0).getbbox();fig=im.crop(bbox)
 scale=min(MAX_H/fig.height,MAX_W/fig.width); size=(max(1,round(fig.width*scale)),max(1,round(fig.height*scale)));fig=premul_resize(fig,size)
 xy=((W-size[0])//2,BASELINE-size[1]);out=Image.new('RGBA',(W,H),(0,0,0,0));out.alpha_composite(fig,xy)
 p=ROOT/'layout-candidates'/f'pose-{pose:02d}-cell128x96.png';out.save(p)
 pr=ROOT/'layout-candidates'/f'pose-{pose:02d}-cell128x96.json';rec={'pose':pose,'source':str(src.relative_to(ROOT)),'sourceSha256':sha(src),'canvasPx':[W,H],'cropAlpha16LTRB':list(bbox),'scale':round(scale,8),'figurePx':list(size),'placementXY':list(xy),'baselineY':BASELINE,'output':str(p.relative_to(ROOT)),'outputSha256':sha(p),'alpha16MarginsLTRBpx':margins(out),'policy':'Review-only cell candidate: uniform scale, center x, baseline y=87, cap80px high/112px wide; no redraw or mirroring.'};pr.write_text(json.dumps(rec,indent=2)+'\n')
 for color,bg in [('light',(245,244,239,255)),('dark',(23,24,38,255))]:
  proof=Image.new('RGBA',(W,H),bg);proof.alpha_composite(out);proof.save(ROOT/'proofs'/f'pose-{pose:02d}-cell128x96-{color}.png')
 print(f'pose{pose:02}: size={size} margins={margins(out)}')
# Side-by-side proof with each cell enlarged nearest-neighbour to retain original pixel positions.
for color,bg in [('light',(245,244,239,255)),('dark',(23,24,38,255))]:
 proof=Image.new('RGBA',(5*128,96),bg)
 for pose in range(5): proof.alpha_composite(Image.open(ROOT/'layout-candidates'/f'pose-{pose:02d}-cell128x96.png').convert('RGBA'),(pose*128,0))
 proof.save(ROOT/'proofs'/f'poses-00-04-cells-{color}.png')
