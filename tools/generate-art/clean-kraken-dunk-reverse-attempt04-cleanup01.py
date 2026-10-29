"""Make a conservative 16-color cleanup candidate from Kraken dunk-reverse attempt04.

This isolates existing grid-cell drawings only. It creates no new poses, does not
retouch anatomy, and is candidate art only until independent inspection passes.
"""
from pathlib import Path
from PIL import Image
import hashlib, json
ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'tools/generate-art/sources/kraken-dunk-reverse-attempt04-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/kraken-dunk-reverse-attempt04/cleanup01'
OUT.mkdir(parents=True,exist_ok=True)
raw=Image.open(RAW).convert('RGBA'); width,height=raw.size
cols,rows=5,3; source_x=[round(i*width/cols) for i in range(cols+1)]; source_y=[round(i*height/rows) for i in range(rows+1)]
cell_w,cell_h=80,96; baseline=92; threshold=64
poses=[]; source_reports=[]
for i in range(15):
 col,row=i%cols,i//cols
 crop=raw.crop((source_x[col],source_y[row],source_x[col+1],source_y[row+1]))
 alpha=crop.getchannel('A').point(lambda v:255 if v>=threshold else 0)
 box=alpha.getbbox()
 if not box: raise SystemExit(f'empty cell {i}')
 subject=crop.crop(box); mask=alpha.crop(box)
 poses.append((subject,mask))
 source_reports.append({'poseIndex':i,'sourceCell':[source_x[col],source_y[row],source_x[col+1],source_y[row+1]],'sourceBounds':list(box),'sourceSize':list(subject.size)})
max_w=max(im.width for im,_ in poses);max_h=max(im.height for im,_ in poses)
scale=min((cell_w-12)/max_w,(cell_h-14)/max_h)
scaled=[]
for subject,mask in poses:
 size=(max(1,round(subject.width*scale)),max(1,round(subject.height*scale)))
 rgb=subject.convert('RGB').resize(size,Image.Resampling.NEAREST)
 alpha=mask.resize(size,Image.Resampling.NEAREST).point(lambda v:255 if v>=128 else 0)
 rgb.putalpha(alpha);scaled.append(rgb)
# Shared palette from visible pixels only.
visible=[]
for im in scaled:
 rgba=im.load()
 for y in range(im.height):
  for x in range(im.width):
   r,g,b,a=rgba[x,y]
   if a:visible.append((r,g,b))
pal=Image.new('RGB',(len(visible),1));pal.putdata(visible);palette=pal.quantize(colors=16,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE)
processed=[]
for im in scaled:
 q=im.convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE).convert('RGB');mask=im.getchannel('A'); px=mask.load();seen=set();small=[]
 for y in range(mask.height):
  for x in range(mask.width):
   if not px[x,y] or (x,y) in seen:continue
   stack=[(x,y)];seen.add((x,y));component=[]
   while stack:
    cx,cy=stack.pop();component.append((cx,cy))
    for ny in range(max(0,cy-1),min(mask.height,cy+2)):
     for nx in range(max(0,cx-1),min(mask.width,cx+2)):
      if px[nx,ny] and (nx,ny) not in seen:seen.add((nx,ny));stack.append((nx,ny))
   if len(component)<8:small.extend(component)
 for x,y in small:px[x,y]=0
 q.putalpha(mask);processed.append(q)
atlas=Image.new('RGBA',(cols*cell_w,rows*cell_h),(0,0,0,0)); frames=[]; hashes=[]
for i,im in enumerate(processed):
 col,row=i%cols,i//cols; box=im.getchannel('A').getbbox()
 if not box:raise SystemExit(f'blank processed pose {i}')
 x=col*cell_w+(cell_w-im.width)//2;y=row*cell_h+baseline-box[3]
 atlas.alpha_composite(im,(x,y)); frame=atlas.crop((col*cell_w,row*cell_h,(col+1)*cell_w,(row+1)*cell_h));b=frame.getchannel('A').getbbox()
 if not b:raise SystemExit(f'blank atlas pose {i}')
 l,t,r,bot=b;margins=[l,t,cell_w-r,cell_h-bot]
 frames.append({'index':i,'x':col*cell_w,'y':row*cell_h,'w':cell_w,'h':cell_h,'baselineY':baseline,'marginsLTRB':margins,'uniqueRGB':len({px[:3] for px in frame.getdata() if px[3]})})
 source_reports[i].update({'scaledSize':list(im.size),'outputBounds':[x+box[0],y+box[1],x+box[2],y+box[3]],'marginsLTRB':margins})
 pix=bytearray(frame.tobytes())
 for off in range(0,len(pix),4):
  if pix[off+3]==0:pix[off:off+3]=b'\0\0\0'
 hashes.append(hashlib.sha256(pix).hexdigest())
if len(set(hashes))!=15:raise SystemExit('expected 15 unique cleaned frames')
atlas_file=OUT/'kraken-dunk-reverse-attempt04-cleanup01-atlas.png';atlas.save(atlas_file)
for name,bg in [('light',(238,234,220,255)),('dark',(25,26,38,255))]:
 board=Image.new('RGBA',atlas.size,bg);board.alpha_composite(atlas);board.resize((atlas.width*3,atlas.height*3),Image.Resampling.NEAREST).save(OUT/f'kraken-dunk-reverse-attempt04-cleanup01-{name}-preview.png')
report={'athlete':'kraken','clip':'dunk-reverse','attempt':4,'cleanupAttempt':1,'sourceRaw':str(RAW.relative_to(ROOT)),'sourceSha256':hashlib.sha256(RAW.read_bytes()).hexdigest(),'cleanupScript':str(Path(__file__).relative_to(ROOT)),'cleanupMethod':'Extract 15 existing row-major cells; alpha threshold 64; fit each full-cell crop by one shared scale inside 68x82; nearest-neighbor resampling; binary alpha at 128; shared 16-color visible-pixel palette; remove 8-connected components below 8 output pixels; align retained pose bounds to baselineY92. No redraw or invented poses.','alphaThreshold':threshold,'sharedScale':scale,'outputDimensions':list(atlas.size),'cellSize':[cell_w,cell_h],'baselineY':baseline,'poseCount':15,'uniqueFrameCount':len(set(hashes)),'normalizedPoseSha256':hashes,'frames':frames,'sourceFrames':source_reports,'atlas':str(atlas_file.relative_to(ROOT)),'reviewStatus':'candidate only; independent cleanup/art review pending'}
(OUT/'cleanup-layout-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'scale':scale,'uniqueFrames':len(set(hashes)),'margins':[f['marginsLTRB'] for f in frames],'bytes':atlas_file.stat().st_size}))
