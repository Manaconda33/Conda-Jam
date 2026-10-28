from pathlib import Path
import hashlib, json
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'tools/generate-art/sources/kraken-pass-overhead6-attempt02-generated-raw.png'
OUT = ROOT / 'tools/generate-art/previews/kraken-pass-overhead6-attempt02'
POSES = OUT / 'poses'
ATLAS = OUT / 'kraken-pass-overhead6-attempt02-runtime-candidate.png'
LAYOUT = OUT / 'layout.json'
REPORT = OUT / 'cleanup-layout-report.json'
SCALE = 73 / 493
CELL = (80, 96)
BASELINE = 94

OUT.mkdir(parents=True, exist_ok=True)
POSES.mkdir(parents=True, exist_ok=True)
raw_img = Image.open(SOURCE).convert('RGBA')
if raw_img.size != (1536, 1024):
    raise RuntimeError(f'Unexpected raw image dimensions {raw_img.size}')
raw = np.asarray(raw_img)
alpha = raw[:, :, 3]
atlas = Image.new('RGBA', (CELL[0] * 3, CELL[1] * 2), (0, 0, 0, 0))
frames, removed = [], []

for i in range(6):
    cx, cy = (i % 3) * 512, (i // 3) * 512
    cell = np.array(raw[cy:cy+512, cx:cx+512], copy=True)
    strong = cell[:, :, 3] >= 32
    labels, count = ndimage.label(strong, structure=np.ones((3, 3), dtype=np.uint8))
    sizes = np.bincount(labels.ravel(), minlength=count + 1)
    main_id = int(np.argmax(sizes[1:]) + 1)
    main_mask = labels == main_id
    if sizes[main_id] < 40000:
        raise RuntimeError(f'Pose {i}: largest alpha>=32 component is only {sizes[main_id]} pixels')
    yy, xx = np.where(main_mask)
    bx0, by0, bx1, by1 = int(xx.min()), int(yy.min()), int(xx.max()+1), int(yy.max()+1)
    distance = ndimage.distance_transform_edt(~main_mask)
    retained = (cell[:, :, 3] >= 32) | ((cell[:, :, 3] > 0) & (distance <= 2.0))
    # Strong mask should be only the figure itself. Keep the original alpha/color of the
    # two-pixel antialias fringe around that figure; clear every other generated haze pixel.
    cleaned = cell.copy()
    cleaned[:, :, 3] = np.where(retained, cleaned[:, :, 3], 0)
    removed_mask = (cell[:, :, 3] > 0) & ~retained
    rlabels, rcount = ndimage.label(removed_mask, structure=np.ones((3, 3), dtype=np.uint8))
    rsizes = np.bincount(rlabels.ravel(), minlength=rcount+1)
    for rid in range(1, rcount+1):
        if rsizes[rid] == 0: continue
        ry, rx = np.where(rlabels == rid)
        removed.append({'pose':i,'pixels':int(rsizes[rid]),'sourceBoundsLTRB':[cx+int(rx.min()),cy+int(ry.min()),cx+int(rx.max()+1),cy+int(ry.max()+1)],'reason':'generated background or detached component outside the 2-source-pixel silhouette fringe'})
    crop = Image.fromarray(cleaned, 'RGBA').crop((bx0, by0, bx1, by1))
    w, h = round(crop.width * SCALE), round(crop.height * SCALE)
    if h > BASELINE or w > CELL[0] - 8:
        raise RuntimeError(f'Pose {i} exceeds safe cell bounds: {w}x{h}')
    pose = crop.resize((w, h), Image.Resampling.NEAREST)
    ox, oy = (CELL[0]-w)//2, BASELINE-h
    ax, ay = (i % 3)*CELL[0], (i//3)*CELL[1]
    atlas.alpha_composite(pose,(ax+ox,ay+oy))
    pose_path = POSES / f'pose-{i:02d}-normalized.png'
    pose.save(pose_path)
    cell_img = atlas.crop((ax,ay,ax+CELL[0],ay+CELL[1]))
    b = cell_img.getchannel('A').getbbox()
    frames.append({'index':i,'x':ax,'y':ay,'w':CELL[0],'h':CELL[1],'sourceCellLTRB':[cx,cy,cx+512,cy+512],
      'sourceRectLTRB':[cx+bx0,cy+by0,cx+bx1,cy+by1],'sourceStrongComponentPixels':int(sizes[main_id]),
      'scale':SCALE,'scaledSize':[w,h],'offsetInCell':[ox,oy],'baselineY':BASELINE,
      'marginsLTRB':[b[0],b[1],CELL[0]-b[2],CELL[1]-b[3]],
      'alphaHash':hashlib.sha256(cell_img.getchannel('A').tobytes()).hexdigest(),
      'poseHash':hashlib.sha256(pose_path.read_bytes()).hexdigest()})

atlas.save(ATLAS)
for name,bg in [('light',(238,240,245,255)),('dark',(28,24,40,255))]:
    board=Image.new('RGBA',(3*240,2*288),bg)
    for i in range(6):
        x,y=(i%3)*80,(i//3)*96
        board.alpha_composite(atlas.crop((x,y,x+80,y+96)).resize((240,288),Image.Resampling.NEAREST),((i%3)*240,(i//3)*288))
    board.convert('RGB').save(OUT/f'kraken-pass-overhead6-attempt02-{name}-preview.png')
    board.convert('RGB').save(OUT/f'contact-sheet-{name}.png')

layout={'status':'cleanup/layout trial only; not registered or accepted','source':str(SOURCE.relative_to(ROOT)),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
 'atlas':str(ATLAS.relative_to(ROOT)),'atlasSha256':hashlib.sha256(ATLAS.read_bytes()).hexdigest(),'columns':3,'rows':2,'frameWidth':80,'frameHeight':96,
 'scale':SCALE,'baselineY':BASELINE,'resampling':'nearest-neighbor','sourceSegmentation':'Within each 512x512 grid cell, select largest 8-connected alpha>=32 component; retain original-alpha pixels only within two source pixels of that figure; all raw source remains untouched.','frames':frames}
LAYOUT.write_text(json.dumps(layout,indent=2)+'\n')
report={'status':'cleanup/layout trial only; needs independent light/dark pose review','source':str(SOURCE.relative_to(ROOT)),'sourceAlphaRange':list(raw_img.getchannel('A').getextrema()),
 'grid':'3x2 regular cells 512x512, row major','threshold32ComponentsPerCell':6,'keptPixels':int(sum(f['sourceStrongComponentPixels'] for f in frames)),
 'excludedAlphaComponents':removed,'alphaTreatment':'Keep source RGBA values for alpha>=32 main silhouette plus any nonzero alpha pixel within two source pixels; set all other alpha to zero. No color keying, redraw or despill.','atlas':str(ATLAS.relative_to(ROOT)),
 'layout':str(LAYOUT.relative_to(ROOT)),'rawPreserved':True,'uniqueAlphaFrames':len(set(f['alphaHash'] for f in frames)),'uniqueNormalizedPoses':len(set(f['poseHash'] for f in frames)),
 'minimumMarginsLTRB':[min(f['marginsLTRB'][0] for f in frames),min(f['marginsLTRB'][1] for f in frames),min(f['marginsLTRB'][2] for f in frames),min(f['marginsLTRB'][3] for f in frames)],'pixelScaling':'nearest-neighbor from alpha-isolated original RGBA'}
REPORT.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'frames':len(frames),'unique':report['uniqueNormalizedPoses'],'removedComponents':len(removed),'marginsLTRB':report['minimumMarginsLTRB'],'atlas':str(ATLAS.relative_to(ROOT))},indent=2))
