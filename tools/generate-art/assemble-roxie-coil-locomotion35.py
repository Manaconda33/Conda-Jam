#!/usr/bin/env python3
"""Clean and arrange 35 selected Roxie Coil imagegen poses for 42-pose assembly."""
from __future__ import annotations
import hashlib, json
from datetime import datetime, timezone
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, find_objects, label

ROOT = Path(__file__).resolve().parents[2]
raw_path = ROOT / 'tools/generate-art/sources/roxie-coil-locomotion35-raw.png'
out_path = ROOT / 'tools/generate-art/sources/roxie-coil-locomotion35.png'
meta_path = ROOT / 'tools/generate-art/roxie-coil-locomotion35-assembly.json'
with Image.open(raw_path) as image:
    image = image.convert('RGBA')
pixels = np.asarray(image)
alpha = pixels[:, :, 3]
labels, _ = label(alpha > 64)
minimum = image.width * image.height / 35 * .025
figures = []
for component, slices in enumerate(find_objects(labels), start=1):
    if slices is None:
        continue
    area = int((labels[slices] == component).sum())
    if area < minimum:
        continue
    y, x = slices[0].start, slices[1].start
    h, w = slices[0].stop - y, slices[1].stop - x
    if min(x, y) < 2 or x + w > image.width - 2 or y + h > image.height - 2:
        raise ValueError('An imagegen figure touches the raw canvas edge')
    category = 'idle' if y < 255 else 'ready' if y < 460 else 'dribble' if y < 650 else 'run' if y < 870 else 'dribble-run'
    figures.append({'component': component, 'x': x, 'y': y, 'w': w, 'h': h, 'area': area, 'category': category})
if len(figures) != 36:
    raise ValueError(f'Expected 36 complete authored imagegen figures before selecting the base 35; found {len(figures)}')
for category, count in [('idle', 6), ('ready', 4), ('dribble', 10), ('run', 9), ('dribble-run', 7)]:
    if sum(f['category'] == category for f in figures) != count:
        raise ValueError(f'Unexpected {category} pose count in generated source')
by_category = {name: sorted((f for f in figures if f['category'] == name), key=lambda f: f['x'])
               for name in ('idle', 'ready', 'dribble', 'run', 'dribble-run')}
# The source supplied nine upright strides; retain the first eight, in visual reading order.
selected = by_category['idle'] + by_category['ready'] + by_category['dribble'] + by_category['run'][:8] + by_category['dribble-run']
if len(selected) != 35:
    raise AssertionError('Selected base must contain exactly35 poses')
selected_ids = [f['component'] for f in selected]
primary = np.where(np.isin(labels, selected_ids), labels, 0)
nearest = distance_transform_edt(primary == 0, return_distances=False, return_indices=True)
owners = primary[tuple(nearest)]
selected_pixel = np.isin(labels, selected_ids)
soft_fringe = (alpha > 0) & (alpha <= 64) & (owners != 0)
clean = pixels.copy()
clean[~(selected_pixel | soft_fringe)] = 0
clean_image = Image.fromarray(clean)
# Group seven sprites per source row so the verified reader can recover exact reading order.
ready = by_category['ready']
dribbles = by_category['dribble']
runs = by_category['run'][:8]
dribble_runs = by_category['dribble-run']
rows = [by_category['idle'] + ready[:1], ready[1:] + dribbles[:4], dribbles[4:] + runs[:1], runs[1:], dribble_runs]
if [len(row) for row in rows] != [7, 7, 7, 7, 7]:
    raise AssertionError('Rows must each contain seven full bodies')
cell_w, cell_h, baseline = 240, 270, 250
canvas = Image.new('RGBA', (cell_w * 7, cell_h * 5), (0, 0, 0, 0))
placements = []
for row_index, row in enumerate(rows):
    for col_index, figure in enumerate(row):
        x, y, w, h, comp = figure['x'], figure['y'], figure['w'], figure['h'], figure['component']
        crop = np.array(clean_image.crop((x, y, x + w, y + h)))
        crop[owners[y:y+h, x:x+w] != comp] = 0
        body = Image.fromarray(crop)
        dx = col_index * cell_w + (cell_w - w) // 2
        dy = row_index * cell_h + baseline - h
        if dx < col_index * cell_w or dx + w > (col_index + 1) * cell_w or dy < row_index * cell_h + 2 or dy + h > row_index * cell_h + baseline:
            raise ValueError(f'Figure does not fit normalized source cell: {figure}')
        canvas.alpha_composite(body, (dx, dy))
        placements.append({'sourceComponent': comp, 'category': figure['category'], 'sourceRect': {k: figure[k] for k in ('x', 'y', 'w', 'h')},
                           'row': row_index + 1, 'column': col_index + 1, 'atlasRect': {'x': dx, 'y': dy, 'w': w, 'h': h}})
canvas.save(out_path)
# Validate the exact normalized 7x5 source before creating the composite parts manifest.
import importlib.util
spec = importlib.util.spec_from_file_location('motion', ROOT/'tools/generate-art/package-motion42.py')
motion = importlib.util.module_from_spec(spec); spec.loader.exec_module(motion)
rects = motion.inspect_source(out_path, count=35, columns=7)
if len(rects) != 35:
    raise AssertionError('Normalized source did not pass exact35 figure audit')
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
meta = {'athlete':'roxie-coil','canonicalSection':'J.11','sourceRaw':str(raw_path.relative_to(ROOT)),
        'sourceRawSha256':sha(raw_path),'acceptedSource':str(out_path.relative_to(ROOT)),'acceptedSourceSha256':sha(out_path),
        'generatedAt':datetime.now(timezone.utc).isoformat(timespec='seconds').replace('+00:00','Z'),
        'sourceFigureCount':36,'retainedFigureCount':35,'excludedFigures':[{'category':'run','reason':'Raw imagegen atlas contained nine upright run drawings; the base set uses eight and this last rightmost stride is retained in raw provenance but omitted from the accepted 35-pose assembly.','sourceRect':{k:by_category['run'][8][k] for k in ('x','y','w','h')}}],
        'cleanup':'Retained exactly35 selected alpha-connected full bodies and assigned only the two-pixel antialias fringe to them; removed the unselected ninth upright stride and isolated source artifacts.',
        'assembly':'Selected six idle, four ready, ten dribble, eight upright run and seven dribble-run drawings. Packed existing drawings into a transparent 7x5 source with 240x270 cells and a shared baseline. No poses were synthesized or duplicated.',
        'placements':placements,'poseIndices':[0,1,2,3,4,5,None,None,None,None,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,31,32,33,34,35,36,37]}
meta_path.write_text(json.dumps(meta,indent=2)+'\n')
print(json.dumps({'source':str(out_path),'sourceSha256':sha(out_path),'figureCount':len(rects),'rawComponents':len(figures),'metadata':str(meta_path)}))
