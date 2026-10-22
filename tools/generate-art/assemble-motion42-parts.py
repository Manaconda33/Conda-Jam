#!/usr/bin/env python3
"""Assemble imagegen-authored pose parts into a reviewed 7x6 locomotion source.

Parts JSON lists each source's count, columns, starting pose index, prompt,
timestamp and path. The script only extracts connected figures, uniformly
scales each source part, and places the existing figures into cells.
"""
from __future__ import annotations
import hashlib
import importlib.util
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('motion42', HERE / 'package-motion42.py')
motion = importlib.util.module_from_spec(spec)
spec.loader.exec_module(motion)

if len(sys.argv) != 4:
    raise SystemExit('Usage: assemble-motion42-parts.py parts.json output.png provenance.json')
parts_path, output_path, provenance_path = map(Path, sys.argv[1:])
parts_spec = json.loads(parts_path.read_text())
cols, rows, cell_w, cell_h, baseline, target_h, pad = 7, 6, 192, 192, 184, 174, 8
poses, sources, all_hashes = [], [], []

for part_index, record in enumerate(parts_spec['parts']):
    source = Path(record['path'])
    if not source.is_file():
        raise FileNotFoundError(source)
    if 'poseIndices' in record:
        destination_indices = record['poseIndices']
        used_indices = [index for index in destination_indices if index is not None]
        if len(destination_indices) != record['count'] or len(set(used_indices)) != len(used_indices):
            raise ValueError(f'{source}: poseIndices must uniquely map every used source drawing')
        if any(not isinstance(index, int) or index < 0 or index >= cols * rows for index in used_indices):
            raise ValueError(f'{source}: poseIndices must be valid destination pose indices')
    else:
        source_indices = record.get('sourceIndices', [])
        if len(source_indices) != 2 or record['count'] != source_indices[1] - source_indices[0] + 1:
            raise ValueError(f'{source}: sourceIndices do not match count')
        destination_indices = list(range(source_indices[0], source_indices[1] + 1))
    source_sha = hashlib.sha256(source.read_bytes()).hexdigest()
    with Image.open(source) as image:
        if image.mode != 'RGBA' or image.getchannel('A').getextrema()[0] != 0:
            raise ValueError(f'{source} must have genuine transparent RGBA')
    rects = motion.inspect_source(source, count=record['count'], columns=record['columns'], isolate=True)
    crops = motion.isolated_crops(source, rects)
    if len(crops) != record['count']:
        raise ValueError(f'{source}: expected {record["count"]} connected figures')
    scale = target_h / max(crop.height for crop in crops)
    part_hashes = []
    for local_index, (rect, crop) in enumerate(zip(rects, crops)):
        index = destination_indices[local_index]
        if index is None:
            part_hashes.append(None)
            continue
        if index < 0 or index >= cols * rows:
            raise ValueError(f'Invalid destination pose index {index}')
        width = max(1, round(crop.width * scale))
        height = max(1, round(crop.height * scale))
        resized = crop.resize((width, height), Image.Resampling.LANCZOS)
        normalized = Image.new('RGBA', (cell_w, cell_h), (0, 0, 0, 0))
        x = (cell_w - width) // 2
        y = baseline - height
        if x < pad or y < pad or x + width > cell_w - pad or y + height > baseline:
            raise ValueError(f'{source}: pose {local_index} does not fit destination cell')
        normalized.alpha_composite(resized, (x, y))
        frame_hash = hashlib.sha256(normalized.tobytes()).hexdigest()
        part_hashes.append(frame_hash)
        all_hashes.append(frame_hash)
        poses.append({
            'index': index, 'column': index % cols, 'row': index // cols,
            'partIndex': part_index, 'sourceRect': rect, 'sourceFrameHash': frame_hash,
            'crop': crop, 'resized': resized, 'x': x, 'y': y, 'scale': scale,
        })
    sources.append({
        **record, 'sha256': source_sha,
        **({'rawSourceSha256': hashlib.sha256(Path(record['rawSourceImage']).read_bytes()).hexdigest()}
           if record.get('rawSourceImage') else {}),
        'componentRects': [{key: rect[key] for key in ('x', 'y', 'w', 'h')} for rect in rects],
        'normalizedFrameSha256': part_hashes,
        'uniformScaleToTargetHeight': scale, 'targetPoseHeight': target_h,
        'componentIsolation': True,
    })

indices = sorted(pose['index'] for pose in poses)
if indices != list(range(cols * rows)):
    raise ValueError(f'Source parts must cover exactly42 ordered slots; got {indices}')
if len(set(all_hashes)) != cols * rows:
    raise ValueError('The 42 normalized authored poses must be visually distinct')

canvas = Image.new('RGBA', (cols * cell_w, rows * cell_h), (0, 0, 0, 0))
placements = []
for pose in poses:
    col, row = pose['column'], pose['row']
    x, y = col * cell_w + pose['x'], row * cell_h + pose['y']
    canvas.alpha_composite(pose['resized'], (x, y))
    placements.append({
        'poseIndex': pose['index'], 'row': row + 1, 'column': col + 1,
        'sourcePath': sources[pose['partIndex']]['path'],
        'sourceRect': {key: pose['sourceRect'][key] for key in ('x', 'y', 'w', 'h')},
        'sourceFrameHash': pose['sourceFrameHash'],
        'atlasRect': {'x': x, 'y': y, 'w': pose['resized'].width, 'h': pose['resized'].height},
        'uniformScale': pose['scale'],
    })

output_path.parent.mkdir(parents=True, exist_ok=True)
canvas.save(output_path)
output_sha = hashlib.sha256(output_path.read_bytes()).hexdigest()
final_rects = motion.inspect_source(output_path, count=42, columns=7)
if len(final_rects) != 42:
    raise ValueError('Composed source failed exact42 disconnected-body validation')
now = datetime.now(timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z')
provenance = {
    'athlete': parts_spec['athlete'], 'canonicalSection': parts_spec['canonicalSection'],
    'direction': 'right', 'generatedAt': now,
    'prompt': 'Assembled 42 distinct imagegen poses from source parts. Exact prompts, hashes, dates and crop assignments are preserved in sourceParts and generationHistory.',
    'sourceImages': [record['path'] for record in sources],
    'references': parts_spec['references'], 'eligibleForPacking': True,
    'mirrorSafe': parts_spec['mirrorSafe'],
    'mirrorReview': {'status': 'pending', 'notes': ''},
    'coverage': '42 authored poses: idle6, idle-ball4, dribble10, run11 and dribble-run11.',
    'review': {'status': 'pending', 'source': 'The deterministic source assembly passes exact42-body, reading-order, uniqueness and cell-clearance checks. Packed-atlas and dark/light visual review pending.'},
    'generationHistory': [
        {'path': record['path'], 'generatedAt': record['generatedAt'], 'prompt': record['prompt'], 'sha256': sources[i]['sha256']}
        for i, record in enumerate(parts_spec['parts'])
    ],
    'assembly': {
        'operation': f"Isolate existing alpha bodies from each listed source part, resize each part uniformly to a shared maximum pose height of {target_h}px, and place originals into a transparent {cols}x{rows} grid of {cell_w}x{cell_h} cells at baseline {baseline}. No new, mirrored, held or repeated poses were created.",
        'targetCell': [cell_w, cell_h], 'baseline': baseline,
        'targetPoseHeight': target_h, 'sourceParts': sources,
        'placedPoses': placements, 'sourceSha256': output_sha, 'poseCount': 42,
    },
}
provenance_path.parent.mkdir(parents=True, exist_ok=True)
provenance_path.write_text(json.dumps(provenance, indent=2) + '\n')
print(json.dumps({'source': str(output_path), 'sha256': output_sha, 'poseCount': len(final_rects), 'parts': len(sources), 'provenance': str(provenance_path)}))
