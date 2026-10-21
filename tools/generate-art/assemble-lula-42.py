#!/usr/bin/env python3
"""Assemble five reviewed Lula source rows and one generated seven-pose row without inventing frames."""
from __future__ import annotations
import hashlib, importlib.util, json
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('motion42', HERE / 'package-motion42.py')
motion = importlib.util.module_from_spec(spec)
spec.loader.exec_module(motion)
parts = json.loads((HERE / 'lula-locomotion42-parts.json').read_text())
rows, cols, cell, cell_h, baseline, target_h, pad = 6, 7, 192, 192, 184, 174, 8
pose_data = []
source_records = []
all_frame_hashes = []

for part_index, record in enumerate(parts['parts']):
    source = Path(record['path'])
    if not source.is_file():
        raise FileNotFoundError(source)
    source_sha = hashlib.sha256(source.read_bytes()).hexdigest()
    with Image.open(source) as opened:
        if opened.mode != 'RGBA' or opened.getchannel('A').getextrema()[0] != 0:
            raise ValueError(f'{source} must have true RGBA transparency')
    rects = motion.inspect_source(source, count=record['count'], columns=record['columns'], isolate=True)
    with Image.open(source) as opened:
        crops = motion.isolated_crops(source, rects)
    if len(crops) != record['count']:
        raise ValueError(f'{source}: expected {record["count"]} authored poses')
    part_hashes = []
    for crop in crops:
        digest = hashlib.sha256(crop.tobytes()).hexdigest()
        part_hashes.append(digest)
        all_frame_hashes.append(digest)
    if len(set(part_hashes)) != len(part_hashes):
        raise ValueError(f'{source}: duplicate authored poses')
    max_h = max(crop.height for crop in crops)
    scale = target_h / max_h
    for index, (rect, crop) in enumerate(zip(rects, crops)):
        pose_index = record['sourceIndices'][0] + index
        column, row = pose_index % cols, pose_index // cols
        pose_data.append({
            'poseIndex': pose_index, 'partIndex': part_index,
            'column': column, 'row': row, 'rect': rect, 'crop': crop,
            'cropSha256': part_hashes[index], 'partScale': scale,
        })
    source_records.append({
        **record,
        'sha256': source_sha,
        'componentRects': [{k: rect[k] for k in ('x','y','w','h')} for rect in rects],
        'frameSha256': part_hashes,
        'uniformScaleToTargetHeight': scale,
        'targetHeight': target_h, 'componentIsolation': True,
    })

if len(pose_data) != 42 or sorted(p['poseIndex'] for p in pose_data) != list(range(42)):
    raise ValueError('Source parts must cover exactly 42 ordered frame slots')
if len(set(all_frame_hashes)) != 42:
    raise ValueError('The 42 authored source frames must be pixel-distinct')

canvas = Image.new('RGBA', (cols * cell, rows * cell_h), (0, 0, 0, 0))
placed = []
for pose in pose_data:
    crop = pose['crop']
    scale = pose['partScale']
    nw, nh = max(1, round(crop.width * scale)), max(1, round(crop.height * scale))
    resized = crop.resize((nw, nh), Image.Resampling.LANCZOS)
    col, row = pose['column'], pose['row']
    x = col * cell + (cell - nw) // 2
    y = row * cell_h + baseline - nh
    if x < col * cell + pad or y < row * cell_h + pad or x + nw > (col + 1) * cell - pad or y + nh > (row + 1) * cell_h - pad:
        raise ValueError(f'Pose {pose["poseIndex"]} lacks transparent cell clearance')
    canvas.alpha_composite(resized, dest=(x, y))
    placed.append({
        'poseIndex': pose['poseIndex'], 'row': row + 1, 'column': col + 1,
        'sourcePath': source_records[pose['partIndex']]['path'],
        'sourceRect': {k: pose['rect'][k] for k in ('x','y','w','h')},
        'sourceFrameSha256': pose['cropSha256'],
        'atlasRect': {'x': x, 'y': y, 'w': nw, 'h': nh},
        'partScale': scale,
    })

source = Path('/workspace/generated_images/lula-locomotion42-composite.png')
canvas.save(source)
source_sha = hashlib.sha256(source.read_bytes()).hexdigest()
final_rects = motion.inspect_source(source, count=42, columns=7)
if len(final_rects) != 42:
    raise ValueError('Assembled source failed the strict 42-component check')
now = datetime.now(timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z')
provenance = {
    'athlete': parts['athlete'], 'canonicalSection': parts['canonicalSection'],
    'direction': 'right', 'generatedAt': now,
    'prompt': 'Assembled 42 distinct imagegen poses from a 35-pose six-row candidate plus a separately generated seven-pose final dribble-run strip. Full source prompts, dates and hashes are preserved in generationHistory and sourceParts.',
    'path': str(source), 'sourceSha256': source_sha,
    'references': parts['references'], 'eligibleForPacking': True,
    'mirrorSafe': True,
    'review': {'status': 'pending', 'source': 'Both source images were visually reviewed. The deterministic composite passes exact42-component RGBA transparency, 7x6 reading-order, uniqueness and transparent-cell-margin checks; pending packed-atlas review.'},
    'generationHistory': [
        {'path': p['path'], 'generatedAt': p['generatedAt'], 'prompt': p['prompt'], 'sha256': source_records[i]['sha256']}
        for i, p in enumerate(parts['parts'])
    ],
    'assembly': {
        'operation': 'Extract only the existing primary alpha figures from the source sheet and seven-pose strip; separate existing antialiased components by nearest-component ownership; uniformly resize each part to the shared 174px maximum pose height; place originals on a transparent 192x192 grid at baseline184. No poses were drawn, duplicated, held, mirrored or synthesized.',
        'targetCell': [cell, cell_h], 'baseline': baseline, 'targetPoseHeight': target_h,
        'sourceParts': source_records, 'placedPoses': placed, 'sourceSha256': source_sha,
        'poseCount': 42,
    },
}
out = HERE / 'lula-locomotion42-provenance.json'
out.write_text(json.dumps(provenance, indent=2) + '\n')
print(json.dumps({'source': str(source), 'sha256': source_sha, 'poseCount': len(final_rects), 'parts': len(source_records), 'provenance': str(out)}))
