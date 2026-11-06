"""Pack Krios-only action sheets by preserving and isolating authored poses."""
from __future__ import annotations
import hashlib, json, math, re, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, find_objects, label

ROOT=Path(__file__).resolve().parents[2]
ASSETS=ROOT/'public/assets/animation'

def digest(path:Path)->str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def pack(clip:str,count:int,columns:int,source:Path,provenance:Path)->Path:
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',clip):raise ValueError('Unsafe clip ID')
    if count<1 or columns<1 or columns>count:raise ValueError('Bad frame/grid count')
    meta=json.loads(provenance.read_text());raw=source.resolve()
    if meta.get('athlete')!='krios' or meta.get('clip')!=clip or meta.get('direction')!='right':raise ValueError('Provenance mismatch')
    allowed_reviews={'accepted','pose-approved-for-cleanup-and-pack-trials'}
    if meta.get('eligibleForPacking') is not True or meta.get('review',{}).get('status') not in allowed_reviews:raise ValueError('Source is not accepted or explicitly approved for pack trials')
    if not meta.get('promptVerbatim') or meta.get('sourceSha256')!=digest(raw):raise ValueError('Prompt/source hash mismatch')
    image=Image.open(raw).convert('RGBA');pixels=np.asarray(image);alpha=pixels[:,:,3]
    if alpha.min()!=0 or alpha.max()<240:raise ValueError('Source requires true transparent RGBA')
    components,_=label(alpha>=64,structure=np.ones((3,3),dtype=np.uint8));rectangles=[]
    minimum=image.width*image.height/count*.006
    for component,slices in enumerate(find_objects(components),1):
        if slices is None:continue
        ys,xs=slices;area=int(np.count_nonzero(components[slices]==component))
        if area<minimum:continue
        x0,y0,x1,y1=int(xs.start),int(ys.start),int(xs.stop),int(ys.stop)
        if x0<2 or y0<2 or x1>image.width-2 or y1>image.height-2:raise ValueError('Figure touches source edge')
        cx=(x0+x1)/2;cy=(y0+y1)/2
        col=min(columns-1,int(cx/(image.width/columns)));row=int(cy/(image.height/math.ceil(count/columns)))
        rectangles.append({'component':component,'area':area,'x':x0,'y':y0,'w':x1-x0,'h':y1-y0,'row':row,'column':col})
    if len(rectangles)!=count:raise ValueError(f'Expected {count} figures; found {len(rectangles)}')
    rectangles.sort(key=lambda r:(r['row'],r['column']))
    cells=[(r['row'],r['column']) for r in rectangles]
    expected=[(i//columns,i%columns) for i in range(count)]
    if cells!=expected:raise ValueError(f'Figure centers do not match row-major grid: {cells}')
    seeds=np.where(np.isin(components,[r['component'] for r in rectangles]),components,0)
    nearest=distance_transform_edt(seeds==0,return_distances=False,return_indices=True);owners=seeds[tuple(nearest)]
    crops=[];records=[]
    for index,rect in enumerate(rectangles):
        x=max(0,rect['x']-2);y=max(0,rect['y']-2);right=min(image.width,rect['x']+rect['w']+2);bottom=min(image.height,rect['y']+rect['h']+2)
        crop=pixels[y:bottom,x:right].copy();crop[owners[y:bottom,x:right]!=rect['component'],3]=0
        body=Image.fromarray(crop).crop(Image.fromarray(crop).getchannel('A').point(lambda v:255 if v>8 else 0).getbbox())
        crops.append(body);records.append({'sourceIndex':index,'sourceRect':rect,'cropBox':[x,y,right,bottom]})
    scale=90/max(c.height for c in crops);width=max(c.width*scale for c in crops)
    cellW=max(80,math.ceil((width+10)/8)*8)
    if cellW>160:raise ValueError(f'Pose too wide for normalized Krios atlas: {cellW}')
    atlas=Image.new('RGBA',(cellW*5,96*math.ceil(count/5)),(0,0,0,0));frames=[]
    for i,crop in enumerate(crops):
        size=(round(crop.width*scale),round(crop.height*scale));resized=crop.resize(size,Image.Resampling.LANCZOS)
        row,col=divmod(i,5);x=col*cellW+(cellW-size[0])//2;y=row*96+94-size[1]
        if x<col*cellW or x+size[0]>(col+1)*cellW or size[1]>92:raise ValueError(f'Pose {i} exceeds normalized atlas cell')
        atlas.alpha_composite(resized,(x,y));frames.append({'x':col*cellW,'y':row*96,'w':cellW,'h':96})
    ASSETS.mkdir(parents=True,exist_ok=True);out=ASSETS/f'krios-{clip}-right.webp'
    if out.exists():raise FileExistsError(out)
    atlas.save(out,'WEBP',lossless=True,quality=88,method=6)
    meta.update({'sourceImage':raw.relative_to(ROOT).as_posix(),'sourceSha256':digest(raw),'sourceRects':records,'uniformScale':scale,'componentIsolation':True,'packaging':f'package-krios-actions.py; {cellW}x96 cells; baseline94; lossless WebP; {count} original poses'})
    layout=[{'athlete':'krios','direction':'right','clip':clip,'src':'./'+out.relative_to(ROOT).as_posix(),'columns':5,'rows':math.ceil(count/5),'frames':frames,'provenance':meta}]
    target=ROOT/'tools/generate-art'/f'krios-{clip}{count}-layouts.json';target.write_text(json.dumps(layout,indent=2)+'\n')
    print(json.dumps({'clip':clip,'frames':count,'atlas':out.relative_to(ROOT).as_posix(),'size':atlas.size,'sha256':digest(out)}))
    return target

if __name__=='__main__':
    if len(sys.argv)!=6:raise SystemExit('Usage: package-krios-actions.py CLIP FRAME_COUNT COLUMNS source.png provenance.json')
    pack(sys.argv[1],int(sys.argv[2]),int(sys.argv[3]),Path(sys.argv[4]),Path(sys.argv[5]))
