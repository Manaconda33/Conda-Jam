"""Deterministic candidate cleanup for Kraken alley-oop-reverse attempt03.

Retains the immutable raw source and its cell choreography, removes transparent
fringe, applies a single shared palette/scale, and aligns every pose to a common
baseline. No poses, pixels, props, or anatomy are generated or repainted.
"""
from pathlib import Path
from PIL import Image
import hashlib, json
ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'tools/generate-art/sources/kraken-alley-oop-reverse-attempt03-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/kraken-alley-oop-reverse-attempt03/cleanup01';OUT.mkdir(parents=True,exist_ok=True)
raw=Image.open(RAW).convert('RGBA');w,h=raw.size;cols,rows=5,3; cw,ch=80,96;baseline=92;threshold=64
xb=[round(i*w/cols) for i in range(cols+1)];yb=[round(i*h/rows) for i in range(rows+1)]
poses=[];source=[]
for i in range(15):
 c,r=i%cols,i//cols; cell=raw.crop((xb[c],yb[r],xb[c+1],yb[r+1])); mask=cell.getchannel('A').point(lambda a:255 if a>=threshold else 0); box=mask.getbbox()
 if not box: raise SystemExit(f'empty cell {i}')
 crop=cell.crop(box); m=mask.crop(box); poses.append((crop,m));source.append({'index':i,'sourceBounds':list(box),'sourceCropSize':list(crop.size)})
maxw=max(im.width for im,_ in poses);maxh=max(im.height for im,_ in poses);scale=min((cw-16)/maxw,(ch-14)/maxh)
scaled=[]
for im,m in poses:
 size=(max(1,round(im.width*scale)),max(1,round(im.height*scale))); rgb=im.convert('RGB').resize(size,Image.Resampling.NEAREST); a=m.resize(size,Image.Resampling.NEAREST).point(lambda v:255 if v>=128 else 0);rgb.putalpha(a);scaled.append(rgb)
pix=[]
for im in scaled:
 a=im.getchannel('A').load();p=im.convert('RGB').load()
 for y in range(im.height):
  for x in range(im.width):
   if a[x,y]:pix.append(p[x,y])
contact=Image.new('RGB',(len(pix),1));contact.putdata(pix);palette=contact.quantize(colors=16,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE)
clean=[]
for im in scaled:
 q=im.convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE).convert('RGB');m=im.getchannel('A');mp=m.load();seen=set()
 for y in range(m.height):
  for x in range(m.width):
   if not mp[x,y] or (x,y) in seen:continue
   stack=[(x,y)];seen.add((x,y));comp=[]
   while stack:
    xx,yy=stack.pop();comp.append((xx,yy))
    for ny in range(max(0,yy-1),min(m.height,yy+2)):
     for nx in range(max(0,xx-1),min(m.width,xx+2)):
      if mp[nx,ny] and (nx,ny) not in seen:seen.add((nx,ny));stack.append((nx,ny))
   if len(comp)<24:
    for xx,yy in comp:mp[xx,yy]=0
 q.putalpha(m);clean.append(q)
atlas=Image.new('RGBA',(cols*cw,rows*ch),(0,0,0,0));frames=[];hashes=[]
for i,im in enumerate(clean):
 c,r=i%cols,i//cols; box=im.getchannel('A').getbbox(); x=c*cw+(cw-im.width)//2; y=r*ch+baseline-box[3];atlas.alpha_composite(im,(x,y)); cell=atlas.crop((c*cw,r*ch,(c+1)*cw,(r+1)*ch));b=cell.getchannel('A').getbbox();m=[b[0],b[1],cw-b[2],ch-b[3]];rawpx=bytearray(cell.tobytes())
 for off in range(0,len(rawpx),4):
  if rawpx[off+3]==0:rawpx[off:off+3]=b'\0\0\0'
 hashes.append(hashlib.sha256(rawpx).hexdigest());frames.append({'index':i,'marginsLTRB':m,'imagePlacementRectInAtlas':[x,y,x+im.width,y+im.height],'alphaBoundsInAtlas':[c*cw+b[0],r*ch+b[1],c*cw+b[2],r*ch+b[3]],'alphaBottomWithinCell':b[3],'baselineY':baseline,'baselineDelta':b[3]-baseline})
if len(set(hashes))!=15:raise SystemExit('expected 15 unique frames')
path=OUT/'kraken-alley-oop-reverse-attempt03-cleanup01-atlas.png';atlas.save(path)
for name,bg in [('light',(236,232,220,255)),('dark',(25,26,38,255))]:
 board=Image.new('RGBA',atlas.size,bg);board.alpha_composite(atlas);board.resize((atlas.width*3,atlas.height*3),Image.Resampling.NEAREST).save(OUT/f'kraken-alley-oop-reverse-attempt03-cleanup01-{name}-preview.png')
report={'athlete':'kraken','clip':'alley-oop-reverse','attempt':3,'cleanupAttempt':1,'sourceRaw':str(RAW.relative_to(ROOT)),'sourceSha256':hashlib.sha256(RAW.read_bytes()).hexdigest(),'cleanupScript':str(Path(__file__).relative_to(ROOT)),'method':'15 nominal 5x3 row-major cells; threshold source alpha at 64; isolate each cell foreground bbox; common nearest-neighbor scale; binary alpha at 128; one shared 16-color palette sampled from visible pixels; remove detached 8-connected components under 24 output pixels; baselineY=92; no repaint or pose creation','threshold':threshold,'scale':scale,'outputDimensions':list(atlas.size),'cellSize':[cw,ch],'baselineY':baseline,'poseCount':15,'uniqueFrameCount':len(set(hashes)),'frameHashes':hashes,'frames':frames,'sourceFrames':source,'atlas':str(path.relative_to(ROOT)),'reviewStatus':'candidate only; independent art and gameplay review pending'}
(OUT/'cleanup-layout-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'scale':scale,'uniqueFrames':len(set(hashes)),'minMargins':[min(f['marginsLTRB'][i] for f in frames) for i in range(4)],'atlas':str(path.relative_to(ROOT))}))
