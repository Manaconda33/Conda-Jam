"""Deterministically isolate and pixel-normalize Kraken alley-oop-power attempt09.

Only authored foreground pixels are retained. The 15 cells are kept in row-major
order; each is alpha-isolated, nearest-neighbor scaled with one shared scale,
quantized through one shared 16-color palette, and aligned to baselineY=92.
The generated raw image remains unchanged and is never packed directly.
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import hashlib, json

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / 'tools/generate-art/sources/kraken-alley-oop-power-attempt09-generated-raw.png'
OUT = ROOT / 'tools/generate-art/previews/kraken-alley-oop-power-attempt09/cleanup04'
OUT.mkdir(parents=True, exist_ok=True)
raw = Image.open(RAW).convert('RGBA')
w, h = raw.size
cols, rows = 5, 3
bounds = [round(i*w/cols) for i in range(cols+1)]
row_bounds = [round(i*h/rows) for i in range(rows+1)]
cell_w, cell_h = 80, 96
baseline = 92
threshold = 64
cells=[]; reports=[]
for i in range(15):
    col, row = i%cols, i//cols
    crop = raw.crop((bounds[col], row_bounds[row], bounds[col+1], row_bounds[row+1]))
    alpha = crop.getchannel('A').point(lambda v: 255 if v >= threshold else 0)
    bbox = alpha.getbbox()
    if not bbox: raise SystemExit(f'empty source pose {i}')
    subject = crop.crop(bbox)
    mask = alpha.crop(bbox)
    cells.append((subject, mask, bbox))
    reports.append({'poseIndex':i,'sourceCell':[bounds[col],row_bounds[row],bounds[col+1],row_bounds[row+1]],'sourceBounds':list(bbox),'sourceSize':list(subject.size)})
# One scale for all poses avoids frame-to-frame size pulsing.
max_h=max(subject.height for subject,_,_ in cells)
max_w=max(subject.width for subject,_,_ in cells)
scale=min((cell_h-14)/max_h,(cell_w-16)/max_w)
tw=max(1,round(max_w*scale)); th=max(1,round(max_h*scale))
# Resize all to the same scale with nearest-neighbor pixel clusters.
scaled=[]
for subject,mask,bbox in cells:
    sw=max(1,round(subject.width*scale)); sh=max(1,round(subject.height*scale))
    rgb=subject.convert('RGB').resize((sw,sh),Image.Resampling.NEAREST)
    a=mask.resize((sw,sh),Image.Resampling.NEAREST)
    # Make edge treatment binary for clean pixel-art silhouette; retain interior alpha.
    a=a.point(lambda v: 255 if v>=128 else 0)
    rgb.putalpha(a)
    scaled.append(rgb)
# Build one shared 16-color palette from visible pixels only.
pixels=[]
for im in scaled:
    rgb=im.convert('RGB').load(); alpha=im.getchannel('A').load()
    for yy in range(im.height):
        for xx in range(im.width):
            if alpha[xx,yy]: pixels.append(rgb[xx,yy])
contact=Image.new('RGB',(len(pixels),1)); contact.putdata(pixels)
palette=contact.quantize(colors=16,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE)
paletted=[]
for im in scaled:
    q=im.convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE).convert('RGB')
    mask=im.getchannel('A')
    px=mask.load(); seen=set(); small=[]
    for sy in range(mask.height):
        for sx in range(mask.width):
            if not px[sx,sy] or (sx,sy) in seen: continue
            stack=[(sx,sy)]; seen.add((sx,sy)); component=[]
            while stack:
                cx,cy=stack.pop();component.append((cx,cy))
                for ny in range(max(0,cy-1),min(mask.height,cy+2)):
                    for nx in range(max(0,cx-1),min(mask.width,cx+2)):
                        if px[nx,ny] and (nx,ny) not in seen: seen.add((nx,ny));stack.append((nx,ny))
            if len(component)<64: small.extend(component)
    for sx,sy in small:px[sx,sy]=0
    q.putalpha(mask)
    paletted.append(q)
atlas=Image.new('RGBA',(cols*cell_w,rows*cell_h),(0,0,0,0))
frame_report=[]
for i,im in enumerate(paletted):
    col,row=i%cols,i//cols
    x=bounds_x=col*cell_w+(cell_w-im.width)//2
    retained_box=im.getchannel('A').getbbox()
    y= row*cell_h + baseline - retained_box[3]
    atlas.alpha_composite(im,(x,y))
    a=atlas.crop((col*cell_w,row*cell_h,(col+1)*cell_w,(row+1)*cell_h)).getchannel('A')
    b=a.getbbox(); left,top,right,bottom=b
    margins=[left,top,cell_w-right,cell_h-bottom]
    frame_report.append({'index':i,'x':col*cell_w,'y':row*cell_h,'w':cell_w,'h':cell_h,'baselineY':baseline,'marginsLTRB':margins,'uniqueRGB':len(set(atlas.crop((col*cell_w,row*cell_h,(col+1)*cell_w,(row+1)*cell_h)).convert('RGB').getdata()))})
    reports[i].update({'scaledSize':list(im.size),'outputBounds':[x,y,x+im.width,y+im.height],'marginsLTRB':margins})

atlas_path=OUT/'kraken-alley-oop-power-attempt09-cleanup04-atlas.png'; atlas.save(atlas_path)
# Light/dark review boards, nearest-neighbor display.
for name,bg in [('light',(236,232,220,255)),('dark',(25,26,38,255))]:
    board=Image.new('RGBA',(cols*cell_w,rows*cell_h),bg);board.alpha_composite(atlas)
    board.resize((cols*cell_w*3,rows*cell_h*3),Image.Resampling.NEAREST).save(OUT/f'kraken-alley-oop-power-attempt09-cleanup04-{name}-preview.png')
# Decoded frame hashes and final layout report.
normalized_hashes=[]
for i in range(15):
    frame=atlas.crop(((i%cols)*cell_w,(i//cols)*cell_h,(i%cols+1)*cell_w,(i//cols+1)*cell_h))
    raw_pixels=bytearray(frame.tobytes())
    for off in range(0,len(raw_pixels),4):
        if raw_pixels[off+3]==0: raw_pixels[off:off+3]=b'\0\0\0'
    normalized_hashes.append(hashlib.sha256(bytes(raw_pixels)).hexdigest())
if len(set(normalized_hashes))!=15: raise SystemExit('Expected 15 visually unique normalized frames')
report={'athlete':'kraken','clip':'alley-oop-power','attempt':9,'sourceRaw':'tools/generate-art/sources/kraken-alley-oop-power-attempt09-generated-raw.png','sourceSha256':hashlib.sha256(RAW.read_bytes()).hexdigest(),'cleanupScript':str(Path(__file__).relative_to(ROOT)),'cleanupMethod':'15 nominal row-major grid cells; threshold source alpha at 64; isolate bbox; same max-height/width scale; nearest-neighbor resize; binary alpha edge at 128; one shared 16-color palette sampled only from visible pixels; remove isolated 8-connected components smaller than 64 output pixels; align retained alpha bounds to baselineY92. No repaint, no generated poses.','threshold':threshold,'sharedScale':scale,'outputDimensions':list(atlas.size),'cellSize':[cell_w,cell_h],'baselineY':baseline,'poseCount':15,'uniqueFrameCount':len(set(normalized_hashes)),'normalizedPoseSha256':normalized_hashes,'frames':frame_report,'sourceFrames':reports,'atlas':'tools/generate-art/previews/kraken-alley-oop-power-attempt09/cleanup04/kraken-alley-oop-power-attempt09-cleanup04-atlas.png','reviewStatus':'independent art review passes for candidate gameplay only; track/runtime review pending'}
(OUT/'cleanup-layout-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'scale':scale,'uniqueFrames':len(set(normalized_hashes)),'margins':[x['marginsLTRB'] for x in frame_report],'outputBytes':atlas_path.stat().st_size}))
