"""Component-aware, non-destructive cleanup of Kraken dunk-tomahawk attempt05.

The raw sheet has 15 distinct alpha-connected athletes that cross nominal
5x3 cell boundaries. This script extracts complete components and repacks them
in row-major order; it does not redraw or invent poses.
"""
from pathlib import Path
from PIL import Image
import hashlib
import json

ROOT=Path(__file__).resolve().parents[2]
RAW=ROOT/'tools/generate-art/sources/kraken-dunk-tomahawk-attempt05-generated-raw.png'
OUT=ROOT/'tools/generate-art/previews/kraken-dunk-tomahawk-attempt05/cleanup01'
OUT.mkdir(parents=True,exist_ok=True)
raw=Image.open(RAW).convert('RGBA')
w,h=raw.size
alpha=raw.getchannel('A')
threshold=64
binary=alpha.point(lambda a:255 if a>=threshold else 0)
mask=binary.load()
seen=bytearray(w*h)
components=[]
for y in range(h):
    for x in range(w):
        pos=y*w+x
        if not mask[x,y] or seen[pos]:
            continue
        stack=[(x,y)]
        seen[pos]=1
        area=0
        x0=x1=x; y0=y1=y
        while stack:
            xx,yy=stack.pop(); area+=1
            x0=min(x0,xx); x1=max(x1,xx); y0=min(y0,yy); y1=max(y1,yy)
            for ny in range(max(0,yy-1),min(h,yy+2)):
                off=ny*w
                for nx in range(max(0,xx-1),min(w,xx+2)):
                    ni=off+nx
                    if mask[nx,ny] and not seen[ni]:
                        seen[ni]=1
                        stack.append((nx,ny))
        components.append({'area':area,'bbox':[x0,y0,x1+1,y1+1],
                           'cx':(x0+x1+1)/2,'cy':(y0+y1+1)/2})
if len(components)!=15:
    raise SystemExit(f'Expected 15 separate alpha components at threshold {threshold}, found {len(components)}')
# Restore the authored 5x3 order using source-row bands, then x-centroid.
rows=[[],[],[]]
for component in components:
    row=min(2,int(component['cy']/(h/3)))
    rows[row].append(component)
if [len(row) for row in rows] != [5,5,5]:
    raise SystemExit(f'Expected five components per row, found {[len(row) for row in rows]}')
ordered=[]
for row in rows:
    ordered.extend(sorted(row,key=lambda c:c['cx']))

cell_w,cell_h=88,96
baseline=94
safe_margin=5
crops=[]
for component in ordered:
    x0,y0,x1,y1=component['bbox']
    color=raw.crop((x0,y0,x1,y1)).convert('RGB')
    cutmask=binary.crop((x0,y0,x1,y1))
    color.putalpha(cutmask)
    crops.append((color,component))
max_w=max(crop.width for crop,_ in crops)
max_h=max(crop.height for crop,_ in crops)
scale=min((cell_w-2*safe_margin)/max_w,(baseline-safe_margin)/max_h)
scaled=[]
removedByFrame=[]
def remove_small_alpha_components(alpha_image,min_pixels=8):
    ww,hh=alpha_image.size; p=alpha_image.load(); seen=bytearray(ww*hh); removed=[]
    for yy in range(hh):
        for xx in range(ww):
            i=yy*ww+xx
            if not p[xx,yy] or seen[i]: continue
            stack=[(xx,yy)]; seen[i]=1; points=[]
            while stack:
                ax,ay=stack.pop();points.append((ax,ay))
                for by in range(max(0,ay-1),min(hh,ay+2)):
                    off=by*ww
                    for bx in range(max(0,ax-1),min(ww,ax+2)):
                        bi=off+bx
                        if p[bx,by] and not seen[bi]:seen[bi]=1;stack.append((bx,by))
            if len(points)<min_pixels:
                for ax,ay in points:p[ax,ay]=0
                removed.append(len(points))
    return removed
for crop,component in crops:
    sw=max(1,round(crop.width*scale)); sh=max(1,round(crop.height*scale))
    rgb=crop.convert('RGB').resize((sw,sh),Image.Resampling.NEAREST)
    a=crop.getchannel('A').resize((sw,sh),Image.Resampling.NEAREST).point(lambda v:255 if v>=128 else 0)
    removed=remove_small_alpha_components(a,8)
    component['removedSmallComponents']=removed
    rgb.putalpha(a)
    scaled.append((rgb,component))
# Derive one shared 16-color palette from visible pixels across the complete clip.
visible=[]
for frame,_ in scaled:
    rgb=frame.convert('RGB').load(); a=frame.getchannel('A').load()
    for yy in range(frame.height):
        for xx in range(frame.width):
            if a[xx,yy]: visible.append(rgb[xx,yy])
contact=Image.new('RGB',(len(visible),1)); contact.putdata(visible)
palette=contact.quantize(colors=16,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE)
quantized=[]
for frame,component in scaled:
    q=frame.convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE).convert('RGB')
    q.putalpha(frame.getchannel('A'))
    quantized.append((q,component))

atlas=Image.new('RGBA',(cell_w*5,cell_h*3),(0,0,0,0))
frame_rows=[]
hashes=[]
for index,(frame,component) in enumerate(quantized):
    col,row=index%5,index//5
    x=col*cell_w+(cell_w-frame.width)//2
    y=row*cell_h+baseline-frame.height
    atlas.alpha_composite(frame,(x,y))
    cell=atlas.crop((col*cell_w,row*cell_h,(col+1)*cell_w,(row+1)*cell_h))
    bounds=cell.getchannel('A').getbbox()
    if not bounds: raise SystemExit(f'Frame {index} became empty')
    left,top,right,bottom=bounds
    margins=[left,top,cell_w-right,cell_h-bottom]
    if left<safe_margin or cell_w-right<safe_margin or top<safe_margin or bottom!=baseline:
        raise SystemExit(f'Unsafe fit/baseline at frame {index}: bounds {bounds}, margins {margins}')
    pixels=bytearray(cell.tobytes())
    for offset in range(0,len(pixels),4):
        if pixels[offset+3]==0: pixels[offset:offset+3]=b'\0\0\0'
    hashes.append(hashlib.sha256(pixels).hexdigest())
    frame_rows.append({'index':index,'cell':[col*cell_w,row*cell_h,cell_w,cell_h],
        'sourceComponentBBox':component['bbox'],'sourceComponentArea':component['area'],
        'sourceCentroid':[component['cx'],component['cy']],
        'removedDetachedOutputComponentSizes':component['removedSmallComponents'],
        'outputAlphaBounds':[left,top,right,bottom],
        'atlasAlphaBounds':[col*cell_w+left,row*cell_h+top,col*cell_w+right,row*cell_h+bottom],
        'marginsLTRB':margins,'visibleHeight':bottom-top,
        'baselineY':baseline,'baselineDelta':0,'normalizedSha256':hashes[-1]})
if len(set(hashes))!=15: raise SystemExit('Expected 15 unique output frames')
atlas_path=OUT/'kraken-dunk-tomahawk-attempt05-cleanup01-atlas.png'
atlas.save(atlas_path)
for label,bg in [('light',(236,232,220,255)),('dark',(25,26,38,255))]:
    board=Image.new('RGBA',atlas.size,bg); board.alpha_composite(atlas)
    board.resize((atlas.width*3,atlas.height*3),Image.Resampling.NEAREST).save(OUT/f'kraken-dunk-tomahawk-attempt05-cleanup01-{label}-preview.png')
raw_sha=hashlib.sha256(RAW.read_bytes()).hexdigest()
report={'athlete':'kraken','clip':'dunk-tomahawk','attempt':2,'cleanup':'component-aware repack cleanup01',
 'sourceRaw':'tools/generate-art/sources/kraken-dunk-tomahawk-attempt05-generated-raw.png','sourceSha256':raw_sha,
 'cleanupScript':'tools/generate-art/clean-kraken-dunk-tomahawk-attempt05-cleanup01.py',
 'cleanupMethod':'Threshold source alpha at 64; isolate all 15 separate 8-connected figures globally; sort components by source row-band centroid then x-centroid to preserve row-major action; common uniform scale; nearest-neighbor resize; binary alpha at 128; remove detached 8-connected output components smaller than 8 pixels; derive one shared 16-color palette from visible pixels; align visible feet to baselineY94. No fixed-cell source crops, repainting, pose edits, or invented poses.',
 'sourceGrid':'5x3 nominal rows; several figures cross cell edges; component extraction avoids clipping.',
 'threshold':threshold,'componentCount':len(components),'poseCount':len(quantized),'uniqueFrameCount':len(set(hashes)),
 'sourceDimensions':[w,h],'outputDimensions':list(atlas.size),'cellSize':[cell_w,cell_h],
 'baselineY':baseline,'safeSideTopMargin':safe_margin,'sharedUniformScale':scale,
 'normalizedPoseSha256':hashes,'frames':frame_rows,
 'atlas':'tools/generate-art/previews/kraken-dunk-tomahawk-attempt05/cleanup01/kraken-dunk-tomahawk-attempt05-cleanup01-atlas.png',
 'lightPreview':'tools/generate-art/previews/kraken-dunk-tomahawk-attempt05/cleanup01/kraken-dunk-tomahawk-attempt05-cleanup01-light-preview.png',
 'darkPreview':'tools/generate-art/previews/kraken-dunk-tomahawk-attempt05/cleanup01/kraken-dunk-tomahawk-attempt05-cleanup01-dark-preview.png',
 'reviewStatus':'candidate cleanup only; independent cleanup review pending; not registered'}
report['atlasSha256']=hashlib.sha256(atlas_path.read_bytes()).hexdigest()
(OUT/'cleanup-layout-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'components':len(components),'scale':scale,'dimensions':atlas.size,'atlasSha256':report['atlasSha256'],'unique':len(set(hashes)),'visibleHeights':[f['visibleHeight'] for f in frame_rows],'minMargins':[min(f['marginsLTRB'][i] for f in frame_rows) for i in range(4)]}))
