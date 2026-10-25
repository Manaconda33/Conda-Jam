#!/usr/bin/env python3
"""Build release-b review-only J.123 Piper alley-oop-power atlas candidates.

No source pixels are drawn, duplicated, interpolated, or mirrored. The two
layouts differ only in uniform cell-fit scale policy; neither is production
accepted until native-size sequence, anatomy, and separate-ball review.
"""
from __future__ import annotations
import hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'tools/generate-art/j123-piper-alley-oop-power-atlas-candidate'
CW,CH,COLS,ROWS=128,96,4,4
BASELINE=87
MAX_H,MAX_W,THRESH=80,112,16

# Selected isolated sources in authored row-major order. Preserve the exact
# prompt/provenance record for every pose, including margin-fit candidates.
SPECS=[]
for i in range(5):
    p=ROOT/f'tools/generate-art/j123-piper-alley-oop-power-poses-00-04/pose-{i:02d}-attempt1-provenance.json'
    r=json.loads(p.read_text())
    source=(r.get('cleanCandidate') if i==0 else r.get('candidateSource') if i in (3,4) else r['rawSource'])
    digest=(r.get('cleanCandidateSha256') if i==0 else r.get('candidateSha256') if i in (3,4) else r['rawSourceSha256'])
    SPECS.append((i,source,digest,str(p.relative_to(ROOT)),r['promptFile'],r['promptSha256']))
for i in range(5,10):
    p=ROOT/f'tools/generate-art/j123-piper-alley-oop-power-poses-05-09/provenance/pose-{i:02d}-attempt1.json'
    r=json.loads(p.read_text())
    SPECS.append((i,r['selectedSource'],r['selectedSourceSha256'],str(p.relative_to(ROOT)),r['promptFile'],r['promptSha256']))
for i,attempt in [(10,1),(11,1),(12,2),(13,1),(14,1)]:
    if i==10:
        p=ROOT/'tools/generate-art/j123-piper-alley-oop-power-poses-10-14/provenance/pose-10-attempt2-revision-b.json'
        r=json.loads(p.read_text())
        source=r['marginLayoutCandidate']['candidate']
        source_hash=r['marginLayoutCandidate']['candidateSha256']
    else:
        p=ROOT/f'tools/generate-art/j123-piper-alley-oop-power-poses-10-14/provenance/pose-{i}-attempt{attempt}.json'
        r=json.loads(p.read_text())
        source=r['cleanedSource']
        source_hash=r['cleanedSourceSha256']
    SPECS.append((i,source,source_hash,str(p.relative_to(ROOT)),r['promptFile'],r['promptSha256']))
assert [x[0] for x in SPECS]==list(range(15))

def sha(path:Path): return hashlib.sha256(path.read_bytes()).hexdigest()
def bbox(im):
    return im.getchannel('A').point(lambda a:255 if a>THRESH else 0).getbbox()
def resize_premultiplied(im,size):
    rgba=np.asarray(im.convert('RGBA'),dtype=np.float32)
    alpha=rgba[:,:,3]/255.0
    pm=rgba[:,:,:3]*alpha[:,:,None]
    ra=Image.fromarray(alpha,mode='F').resize(size,Image.Resampling.LANCZOS)
    ar=np.clip(np.asarray(ra,dtype=np.float32),0,1)
    cs=[]
    for c in range(3):
        pi=Image.fromarray(pm[:,:,c],mode='F').resize(size,Image.Resampling.LANCZOS)
        v=np.asarray(pi,dtype=np.float32)
        cs.append(np.divide(v,ar,out=np.zeros_like(v),where=ar>1/255))
    rgb=np.clip(np.stack(cs,axis=2),0,255)
    out=np.empty((size[1],size[0],4),dtype=np.uint8)
    out[:,:,:3]=np.rint(rgb).astype(np.uint8);out[:,:,3]=np.rint(ar*255).astype(np.uint8)
    out[out[:,:,3]==0,:3]=0
    return Image.fromarray(out,'RGBA')

def scale_for(mode,pose,crop):
    w,h=crop[2]-crop[0],crop[3]-crop[1]
    if mode=='bbox-height':
        return min(MAX_H/h,MAX_W/w)
    # Conservative lane scales keep each source-generation lane internally
    # consistent. Frame00 is a smaller horizontal-canvas rendering and needs
    # a one-pose fit to preserve the approach silhouette at sprite size.
    lane={'00-04':0.075,'05-09':0.081,'10-14':0.077}
    name='00-04' if pose<5 else '05-09' if pose<10 else '10-14'
    base=lane[name]
    if pose==0: base=0.0938
    return min(base,MAX_H/h,MAX_W/w)

def assemble(mode):
    atlas=Image.new('RGBA',(CW*COLS,CH*ROWS),(0,0,0,0)); records=[]
    for pose,src,src_hash,prov,prompt,prompt_hash in SPECS:
        path=ROOT/src
        if not path.is_file() or sha(path)!=src_hash: raise ValueError(f'source hash mismatch: {src}')
        prompt_path=ROOT/prompt
        if not prompt_path.is_file() or sha(prompt_path)!=prompt_hash: raise ValueError(f'prompt hash mismatch: {prompt}')
        im=Image.open(path).convert('RGBA'); box=bbox(im)
        if not box: raise ValueError(f'no visible alpha: {src}')
        left,top,right,bottom=box; crop=im.crop(box)
        s=scale_for(mode,pose,box); nw=max(1,round(crop.width*s));nh=max(1,round(crop.height*s))
        sprite=resize_premultiplied(crop,(nw,nh))
        x=(CW-nw)//2;y=BASELINE-nh
        if x<0 or y<0 or x+nw>CW or y+nh>CH: raise ValueError(f'cell overflow pose {pose}')
        cell=Image.new('RGBA',(CW,CH),(0,0,0,0));cell.alpha_composite(sprite,(x,y))
        cx=(pose%COLS)*CW;cy=(pose//COLS)*CH;atlas.alpha_composite(cell,(cx,cy))
        mb=cell.getchannel('A').point(lambda a:255 if a>THRESH else 0).getbbox()
        margins=[mb[0],mb[1],CW-mb[2],CH-mb[3]]
        records.append({'pose':pose,'source':src,'sourceSha256':src_hash,'provenanceFile':prov,
          'promptFile':prompt,'promptSha256':prompt_hash,'sourceCanvasPx':list(im.size),
          'alphaCropThreshold':THRESH,'alphaCropLTRB':list(box),'cropPx':[crop.width,crop.height],
          'scale':round(s,9),'outputFigurePx':[nw,nh],'cellXY':[x,y],'baselineY':BASELINE,
          'cellMarginsLTRBpx':margins,'cellPixelSha256':hashlib.sha256(cell.tobytes()).hexdigest()})
    if len({r['cellPixelSha256'] for r in records})!=15: raise ValueError('duplicate frame pixels')
    stem=f'atlas-{mode}-release-b';png=OUT/f'{stem}.png';webp=OUT/f'{stem}.webp'
    atlas.save(png);atlas.save(webp,'WEBP',lossless=True,method=6)
    layout={'athlete':'piper-quickstep','issue':'J.123','clip':'alley-oop-power',
      'status':'review-only candidate; not production accepted','mode':mode,
      'scalePolicy':('Per-frame alpha-bbox height-fit to 80px, width-capped at112px; retained as the normalization comparison.' if mode=='bbox-height' else 'Lane factors: poses00-04 .075, poses05-09 .081, poses10-14 .077; pose00 exception .0938 to account for its smaller 1536x1024 horizontal-canvas rendering. Caps at80px high/112px wide. Factors are visual estimates and require parent native-size review.'),
      'atlas':str(png.relative_to(ROOT)),'atlasSha256':sha(png),'webp':str(webp.relative_to(ROOT)),
      'webpSha256':sha(webp),'atlasPx':[CW*COLS,CH*ROWS],'grid':[COLS,ROWS],
      'cellPx':[CW,CH],'sequenceOrder':list(range(15)),'uniqueFramePixelHashes':[x['cellPixelSha256'] for x in records],
      'baselineY':BASELINE,'transparentUnusedCell':15,'ball':'separate Piper-specific runtime track; no ball pixels in atlas',
      'resize':'Uniform premultiplied-alpha Lanczos; no figure redraw, pose duplication, interpolation or mirroring.',
      'sourceRecords':records}
    (OUT/f'{stem}-layout.json').write_text(json.dumps(layout,indent=2)+'\n')
    write_proofs(atlas,stem)
    return layout

def write_proofs(atlas,stem):
    font=ImageFont.load_default()
    for label,bg in [('light',(245,244,239,255)),('dark',(24,25,40,255))]:
        out=Image.new('RGBA',atlas.size,bg);out.alpha_composite(atlas);d=ImageDraw.Draw(out)
        for i in range(15):
            x=(i%COLS)*CW;y=(i//COLS)*CH
            d.rectangle((x,y,x+CW-1,y+CH-1),outline=(130,130,135,180),width=1)
            d.text((x+2,y+2),f'{i:02d}',fill=(20,20,24,255) if label=='light' else (245,245,250,255),font=font)
        out.save(OUT/f'{stem}-proof-{label}.png')
    sheet=Image.new('RGBA',(CW*5*3,CH*3*3),(25,26,41,255));d=ImageDraw.Draw(sheet)
    for i in range(15):
        cell=atlas.crop(((i%COLS)*CW,(i//COLS)*CH,(i%COLS+1)*CW,(i//COLS+1)*CH))
        cell=cell.resize((CW*3,CH*3),Image.Resampling.NEAREST);x=(i%5)*CW*3;y=(i//5)*CH*3
        sheet.alpha_composite(cell,(x,y));d.rectangle((x,y,x+CW*3-1,y+CH*3-1),outline=(150,150,160,180),width=1)
        d.text((x+2,y+2),f'{i:02d}',fill='white',font=font)
    sheet.save(OUT/f'{stem}-native-cells-dark.png')
    pair=Image.new('RGBA',(CW*2,CH+24),(24,25,40,255));pair_draw=ImageDraw.Draw(pair)
    for idx,label in [(9,'09 closed fist'),(10,'10 open palm release-b')]:
        x=(idx%COLS)*CW;y=(idx//COLS)*CH
        cell=atlas.crop((x,y,x+CW,y+CH));dstx=0 if idx==9 else CW
        pair.alpha_composite(cell,(dstx,24));pair_draw.text((dstx+3,3),label,fill=(245,245,250,255),font=font)
    pair.save(OUT/f'{stem}-pose09-10-native-128x96.png')
    zoom=pair.resize((pair.width*3,pair.height*3),Image.Resampling.NEAREST)
    zoom.save(OUT/f'{stem}-pose09-10-zoom3x.png')

bbox_layout=assemble('bbox-height');lane_layout=assemble('lane-scale')
readme='''# J.123 Piper `alley-oop-power` atlas candidates\n\nThese two atlases are review-only; neither is registered or production accepted. Each uses 15 row-major unique frames in a transparent 4×4 grid of128×96 cells, a shared y=87 baseline, <=80px figure height and <=112px width, and one empty final cell. The ball is separate and absent from the source art. No poses were redrawn, duplicated, interpolated or mirrored.\n\n`atlas-bbox-height` independently fits each alpha crop to80px high (width capped at112px). `atlas-lane-scale` uses the explicitly provisional lane factors in its layout JSON; pose00 receives a .0938 fit because it was generated on a smaller horizontal canvas. This comparison needs parent review for cross-pose head/torso scale and for readability of closed-fist pose09 vs open-hand pose10 at runtime size.\n\nThe assembler verifies exact prompt/source hashes and records crop bounds, scale, frame hash and cell margins per source. It uses premultiplied-alpha Lanczos. Light/dark proofs and 3× native-cell sheets are included. Input prompts, raw images, and selected source provenance remain in the three pose-lane directories.\n'''
(OUT/'README-release-b.md').write_text(readme.replace('These two atlases','These release-b atlases'))
print('Wrote two release-b review-only 512x384 atlas candidates, 15 unique frames each.')
