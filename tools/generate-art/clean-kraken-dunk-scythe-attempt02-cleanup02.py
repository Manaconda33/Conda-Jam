"""Component-aware repack of Kraken dunk-scythe attempt02.

The generated sprites cross nominal grid boundaries but remain 15 separate
alpha-connected figures. This script isolates all 15 complete components and
reorders them by centroid into three rows, then normalizes them without adding
or redrawing poses. Raw generation remains preserved unchanged.
"""
from pathlib import Path
from PIL import Image
import hashlib, json
ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'tools/generate-art/sources/kraken-dunk-scythe-attempt02-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/kraken-dunk-scythe-attempt02/cleanup02-component-repack'
OUT.mkdir(parents=True,exist_ok=True)
im=Image.open(RAW).convert('RGBA');w,h=im.size
mask=im.getchannel('A').point(lambda v:255 if v>=64 else 0); mp=mask.load(); seen=set(); components=[]
for y in range(h):
 for x in range(w):
  if not mp[x,y] or (x,y) in seen: continue
  stack=[(x,y)];seen.add((x,y));pts=[];x0=x1=x;y0=y1=y
  while stack:
   xx,yy=stack.pop();pts.append((xx,yy));x0=min(x0,xx);x1=max(x1,xx);y0=min(y0,yy);y1=max(y1,yy)
   for ny in range(max(0,yy-1),min(h,yy+2)):
    for nx in range(max(0,xx-1),min(w,xx+2)):
     if mp[nx,ny] and (nx,ny) not in seen:seen.add((nx,ny));stack.append((nx,ny))
  components.append({'area':len(pts),'bbox':[x0,y0,x1+1,y1+1],'cx':(x0+x1+1)/2,'cy':(y0+y1+1)/2})
if len(components)!=15: raise SystemExit(f'expected exactly 15 connected figures, found {len(components)}')
components.sort(key=lambda c:c['cy'])
rows=[sorted(components[i:i+5],key=lambda c:c['cx']) for i in range(0,15,5)]
ordered=sum(rows,[])
cell_w,cell_h=80,96; baseline=94; cell_margin=6
crops=[]
for i,c in enumerate(ordered):
 box=c['bbox']; crop=im.crop(box); alpha=mask.crop(box)
 crop.putalpha(alpha)
 crops.append((crop,alpha,c))
max_w=max(crop.width for crop,_,_ in crops);max_h=max(crop.height for crop,_,_ in crops)
scale=min((cell_w-2*cell_margin)/max_w,(baseline-cell_margin)/max_h)
scaled=[]
for crop,alpha,c in crops:
 sw=max(1,round(crop.width*scale));sh=max(1,round(crop.height*scale))
 color=crop.convert('RGB').resize((sw,sh),Image.Resampling.NEAREST)
 a=alpha.resize((sw,sh),Image.Resampling.NEAREST).point(lambda v:255 if v>=128 else 0)
 color.putalpha(a);scaled.append(color)
pixels=[]
for frame in scaled:
 rgb=frame.convert('RGB').load();a=frame.getchannel('A').load()
 for y in range(frame.height):
  for x in range(frame.width):
   if a[x,y]:pixels.append(rgb[x,y])
contact=Image.new('RGB',(len(pixels),1));contact.putdata(pixels)
palette=contact.quantize(colors=16,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE)
frames=[]
for frame in scaled:
 q=frame.convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE).convert('RGB');q.putalpha(frame.getchannel('A'));frames.append(q)
atlas=Image.new('RGBA',(cell_w*5,cell_h*3),(0,0,0,0));report=[]; hashes=[]
for i,frame in enumerate(frames):
 col,row=i%5,i//5;x=col*cell_w+(cell_w-frame.width)//2;y=row*cell_h+baseline-frame.height
 atlas.alpha_composite(frame,(x,y));cell=atlas.crop((col*cell_w,row*cell_h,(col+1)*cell_w,(row+1)*cell_h)); b=cell.getchannel('A').getbbox();
 if not b:raise SystemExit(f'empty output frame {i}')
 l,t,r,bt=b
 if l<cell_margin or r>cell_w-cell_margin or t<cell_margin or bt>baseline:raise SystemExit(f'cell margin violation {i}: {b}')
 raw=bytearray(cell.tobytes())
 for off in range(0,len(raw),4):
  if raw[off+3]==0:raw[off:off+3]=b'\0\0\0'
 hashes.append(hashlib.sha256(raw).hexdigest())
 c=ordered[i];report.append({'index':i,'sourceComponentBBox':c['bbox'],'sourceComponentPixels':c['area'],'sourceCentroid':[c['cx'],c['cy']],'outputBounds':[col*cell_w+l,row*cell_h+t,col*cell_w+r,row*cell_h+bt],'marginsLTRB':[l,t,cell_w-r,cell_h-bt],'sourceOrder':'centroid row-major component order'})
if len(set(hashes))!=15:raise SystemExit('output frames not unique')
atlas_path=OUT/'kraken-dunk-scythe-attempt02-cleanup02-atlas.png';atlas.save(atlas_path)
for name,bg in [('light',(236,232,220,255)),('dark',(25,26,38,255))]:
 board=Image.new('RGBA',atlas.size,bg);board.alpha_composite(atlas);board.resize((atlas.width*3,atlas.height*3),Image.Resampling.NEAREST).save(OUT/f'kraken-dunk-scythe-attempt02-cleanup02-{name}-preview.png')
report={'athlete':'kraken','clip':'dunk-scythe','attempt':2,'cleanup':'component-aware repack cleanup02','sourceRaw':'tools/generate-art/sources/kraken-dunk-scythe-attempt02-generated-raw.png','sourceSha256':hashlib.sha256(RAW.read_bytes()).hexdigest(),'cleanupScript':'tools/generate-art/clean-kraken-dunk-scythe-attempt02-cleanup02.py','sourceGridProblems':'Some source sprites cross nominal 5x3 grid boundaries. Cleanup01 was rejected because cell slicing clipped/misassigned a component.','cleanupMethod':'Threshold source alpha at 64; isolate all 15 separate 8-connected components; sort complete figures by y centroid into three rows and x centroid in row; uniform nearest-neighbor scale to fit 80x96 while maintaining 6px horizontal/top safety, then align feet to baselineY94; binary alpha; quantize with one shared 16-visible-color palette. No pose added, repainted, removed, or redrawn.','componentCount':len(components),'poseCount':len(frames),'uniqueFrameCount':len(set(hashes)),'frameDimensions':[cell_w,cell_h],'baselineY':baseline,'sharedScale':scale,'componentBoxesAndMargins':report,'normalizedPoseSha256':hashes,'atlas':str(atlas_path.relative_to(ROOT)),'reviewStatus':'pending independent review; candidate only, do not register'}
(OUT/'cleanup-layout-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'components':len(components),'unique':len(set(hashes)),'scale':scale,'outputBytes':atlas_path.stat().st_size,'margins':[x['marginsLTRB'] for x in report['componentBoxesAndMargins']]}))
