"""Isolate and losslessly pack Avek imagegen locomotion poses."""
import hashlib, json, math
from datetime import datetime, timezone
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label

ROOT=Path(__file__).resolve().parents[2]
DIRECTION='right'
SPEC=ROOT/'tools/generate-art/avek-locomotion-sources.json'
OUTPUT=ROOT/'tools/generate-art/avek-locomotion-layouts.json'
TARGET_HEIGHT=72; MAX_WIDTH=224; CELL_HEIGHT=96; BASELINE=94
ALPHA_THRESHOLD=8; BODY_THRESHOLD=64; MIN_FRACTION=.01; MAX_CELL_WIDTH=256

def sha256(path):
 h=hashlib.sha256()
 with Path(path).open('rb') as f:
  for chunk in iter(lambda:f.read(1048576),b''):h.update(chunk)
 return h.hexdigest()
def mtime(path):
 return datetime.fromtimestamp(Path(path).stat().st_mtime,timezone.utc).isoformat(timespec='seconds').replace('+00:00','Z')
def extract(part):
 path=Path(part['path']); sheet=Image.open(path).convert('RGBA'); alpha=np.asarray(sheet.getchannel('A'))
 if alpha.min()!=0 or alpha.max()<240: raise ValueError(f'{path}: source must be transparent RGBA')
 cols,rows=part['grid']; idx=part['index']; col,row=idx%cols,idx//cols
 if idx<0 or idx>=cols*rows:raise ValueError(f'{path}: source cell outside grid')
 x0=round(col*sheet.width/cols);x1=round((col+1)*sheet.width/cols);y0=round(row*sheet.height/rows);y1=round((row+1)*sheet.height/rows)
 cell=sheet.crop((x0,y0,x1,y1)); pixels=np.asarray(cell).copy(); a=pixels[:,:,3]
 labels,_=label(a>BODY_THRESHOLD);sizes=np.bincount(labels.ravel());minimum=cell.width*cell.height*MIN_FRACTION
 major=[i for i,n in enumerate(sizes) if i and n>=minimum]
 if len(major)!=1:raise ValueError(f'{path} cell {idx}: expected one body component, found {len(major)}')
 mask=labels==major[0];ys,xs=np.where(mask);left,top,right,bottom=map(int,(xs.min(),ys.min(),xs.max()+1,ys.max()+1))
 margins=(left,top,cell.width-right,cell.height-bottom)
 if min(margins)<3:raise ValueError(f'{path} cell {idx}: body too close to cell edge {margins}')
 pixels[~mask]=0;pixels[pixels[:,:,3]<ALPHA_THRESHOLD]=0
 image=Image.fromarray(pixels,'RGBA').crop((left,top,right,bottom))
 metadata={'sourcePath':part['path'],'sourceIndex':idx,'sourceRect':{'x':x0+left,'y':y0+top,'w':right-left,'h':bottom-top},'cellRect':[x0,y0,x1,y1],'sourceSha256':sha256(path),'generatedAt':part.get('generatedAt') or mtime(path),'prompt':part['prompt'],'isolatedMajorComponentPixels':int(mask.sum()),'detachedPixelsRemoved':int(np.count_nonzero((labels!=major[0])&(a>BODY_THRESHOLD)))}
 return image,metadata

def pack(clip,frames):
 required={'idle':6,'idle-ball':4,'dribble':10,'run':11,'dribble-run':11}[clip]
 if len(frames)!=required:raise ValueError(f'{clip}: expected {required} poses, got {len(frames)}')
 hashes=[hashlib.sha256(f['image'].tobytes()).hexdigest() for f in frames]
 if len(set(hashes))!=required:raise ValueError(f'{clip}: duplicate poses')
 scales=[min(TARGET_HEIGHT/f['image'].height,MAX_WIDTH/f['image'].width) for f in frames]
 widths=[round(f['image'].width*s) for f,s in zip(frames,scales)];cw=max(64,math.ceil((max(widths)+12)/16)*16)
 if cw>MAX_CELL_WIDTH:raise ValueError(f'{clip}: width {cw} too large')
 columns=math.ceil(math.sqrt(required));rows=math.ceil(required/columns);atlas=Image.new('RGBA',(columns*cw,rows*CELL_HEIGHT),(0,0,0,0));packed=[]
 for i,(frame,scale) in enumerate(zip(frames,scales)):
  im=frame['image'];w=max(1,round(im.width*scale));h=max(1,round(im.height*scale));im=im.resize((w,h),Image.Resampling.LANCZOS)
  x=i%columns*cw+(cw-w)//2;y=i//columns*CELL_HEIGHT+BASELINE-h;atlas.alpha_composite(im,(x,y))
  packed.append({'x':i%columns*cw,'y':i//columns*CELL_HEIGHT,'w':cw,'h':CELL_HEIGHT,**frame['source'],'frameScale':scale,'pixelSha256':hashlib.sha256(im.tobytes()).hexdigest()})
 rel=f'public/assets/animation/avek-{clip}-{DIRECTION}.webp';out=ROOT/rel;out.parent.mkdir(parents=True,exist_ok=True)
 atlas.save(out,'WEBP',quality=100,method=6,lossless=True,exact=True)
 return {'athlete':'avek','direction':DIRECTION,'clip':clip,'src':'./'+rel,'columns':columns,'rows':rows,'frames':[{'x':p['x'],'y':p['y'],'w':p['w'],'h':p['h']} for p in packed],'provenance':{'athlete':'avek','canonicalSection':'K.22','direction':DIRECTION,'generatedAt':max(p['generatedAt'] for p in packed),'prompt':'tools/generate-art/avek-locomotion-prompts.md','path':str(SPEC.relative_to(ROOT)),'sourceParts':packed,'targetPoseHeight':TARGET_HEIGHT,'maxSpriteWidth':MAX_WIDTH,'cellHeight':CELL_HEIGHT,'baseline':BASELINE,'packing':'Extract one reviewed alpha-connected Avek silhouette per source cell; fit uniformly to 72px pose height and 224px width, retain transparent margins, losslessly pack. Right-facing noir clothing and blank screen are approved for renderer mirroring.','sourceHashes':sorted({p['sourceSha256'] for p in packed}),'eligibleForPacking':True,'mirrorSafe':True,'review':{'status':'pending','source':'Awaiting final atlas and gameplay rendering review.'}}}

def main():
 spec=json.loads(SPEC.read_text());layouts=[]
 for clip in ('idle','idle-ball','dribble','run','dribble-run'):
  frames=[]
  for part in spec['clips'][clip]['frames']:
   image,meta=extract(part);frames.append({'image':image,'source':meta})
  layouts.append(pack(clip,frames));print(clip,len(frames),'distinct imagegen poses')
 if sum(len(x['frames']) for x in layouts)!=42:raise ValueError('Expected 42 drawings')
 OUTPUT.write_text(json.dumps(layouts,indent=2)+'\n')
 print('Wrote',OUTPUT)
if __name__=='__main__':main()
