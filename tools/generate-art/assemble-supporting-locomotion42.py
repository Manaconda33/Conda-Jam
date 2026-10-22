#!/usr/bin/env python3
"""Compose human supporting-player locomotion sources.

Only isolated alpha components from the three documented raw generations are
selected, uniformly scaled and placed into the established 7x6 source grid.
Fused or clipped source figures are excluded whole; no missing pose is drawn,
duplicated, interpolated or mirrored.
"""
from __future__ import annotations
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image
import numpy as np
from scipy.ndimage import find_objects, label

ROOT = Path(__file__).resolve().parents[2]
ART = ROOT / 'tools/generate-art'
SOURCES = ART / 'sources'


def stamp(path: Path) -> str:
    return datetime.fromtimestamp(path.stat().st_mtime, timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z')


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def components(path: Path, minimum_factor=.025):
    image = Image.open(path).convert('RGBA')
    alpha = np.asarray(image.getchannel('A')) > 64
    labels, _ = label(alpha)
    rects = []
    minimum = image.width * image.height / 35 * minimum_factor
    for label_id, slc in enumerate(find_objects(labels), 1):
        if slc is None or int((labels[slc] == label_id).sum()) < minimum:
            continue
        y0, x0 = slc[0].start, slc[1].start
        y1, x1 = slc[0].stop, slc[1].stop
        clipped = min(x0, y0) < 2 or x1 > image.width - 2 or y1 > image.height - 2
        left, top = max(0, x0 - 2), max(0, y0 - 2)
        right, bottom = min(image.width, x1 + 2), min(image.height, y1 + 2)
        rects.append({'x': left, 'y': top, 'w': right - left, 'h': bottom - top,
                      'centerY': (y0 + y1) / 2, 'component': label_id,
                      'pixels': int((labels[slc] == label_id).sum()), 'clipped': clipped})
    # The generation grid is spacious; horizontal baselines form distinct bands.
    rects.sort(key=lambda r: (r['centerY'], r['x']))
    return image, labels, rects


def alpha_crop(image: Image.Image, labels: np.ndarray, rect: dict) -> Image.Image:
    x, y, w, h = (rect[k] for k in ('x', 'y', 'w', 'h'))
    crop = image.crop((x, y, x + w, y + h)).copy()
    a = np.asarray(crop).copy()
    comp = labels[y:y+h, x:x+w]
    # Clear RGB as well as alpha outside the selected alpha component. PNGs
    # can retain arbitrary RGB values under transparent pixels; those must not
    # inflate Pillow's RGBA getbbox() or distort uniform body scale.
    a[comp != rect['component']] = 0
    return Image.fromarray(a, 'RGBA')


def group_rows(rects: list[dict], counts: list[int], excluded: list[dict] | None = None):
    excluded = excluded or []
    good, dropped = [], []
    for rect in rects:
        match = next((rule for rule in excluded if all(rect.get(k) == v for k, v in rule.items())), None)
        (dropped if match else good).append(rect)
    if len(good) != sum(counts):
        raise ValueError(f'row layout requires {sum(counts)} usable figures; found {len(good)}')
    rows, pos = [], 0
    for count in counts:
        band = sorted(good[pos:pos+count], key=lambda r: r['x'])
        if len(band) != count:
            raise ValueError('source rows do not match expected row counts')
        rows.extend(band)
        pos += count
    if pos != len(good):
        raise ValueError('unassigned source figures remain')
    return rows, dropped


def source_frames(path: Path, row_counts: list[int], excluded: list[dict] | None = None):
    image, labels, rects = components(path)
    ordered, dropped = group_rows(rects, row_counts, excluded)
    frames = [alpha_crop(image, labels, r) for r in ordered]
    return frames, rects, dropped


def strip_frames(path: Path):
    image, labels, rects = components(path)
    rects.sort(key=lambda r: r['x'])
    if len(rects) != 7:
        raise ValueError(f'{path}: expected seven isolated supplement poses, found {len(rects)}')
    return [alpha_crop(image, labels, r) for r in rects], rects


def build(athlete: str, canonical: str, maps: list[dict], target_height: int = 142):
    selected = [None] * 42
    pose_map = [None] * 42
    histories, source_records, discarded = [], [], []
    cache: dict[str, list[Image.Image]] = {}
    for record in maps:
        label_name, path = record['name'], SOURCES / record['path']
        if record.get('rows'):
            frames, rects, dropped = source_frames(path, record['rows'], record.get('exclude'))
            discarded.extend({'source': str(path.relative_to(ROOT)), **{k: r[k] for k in ('x','y','w','h','component')}, 'reason': 'fused adjacent character drawings; excluded as a whole'} for r in dropped)
        else:
            frames, rects = strip_frames(path)
        for source_pose in record.get('excludePoseIndices', []):
            discarded.append({'source': str(path.relative_to(ROOT)), 'sourcePose': source_pose,
                              'reason': 'full figure touched the generated image edge; excluded as incomplete art'})
        cache[label_name] = frames
        source_records.append({'name': label_name, 'path': str(path.relative_to(ROOT)), 'sha256': sha(path),
                               'generatedAt': stamp(path), 'poseCount': len(frames),
                               'generatedImage': record.get('generatedImage'),
                               'rawComponentCount': len(rects), 'excludedComponents': [r['component'] for r in (dropped if label_name == 'base' else [])],
                               'excludedPoseIndices': record.get('excludePoseIndices', []),
                               'rowCounts': record.get('rows') or [7]})
        histories.append({'path': str(path.relative_to(ROOT)), 'generatedAt': stamp(path),
                          'generatedImage': record.get('generatedImage'),
                          'prompt': f'tools/generate-art/{athlete}-locomotion-prompts.md#{label_name}', 'sha256': sha(path)})
    for record in maps:
        name = record['name']
        frames = cache[name]
        for source_index, target in record['map'].items():
            source_index, target = int(source_index), int(target)
            if source_index >= len(frames) or source_index < 0 or target >= 42 or target < 0:
                raise ValueError(f'{athlete}: invalid pose mapping for {name}[{source_index}] -> {target}')
            if selected[target] is not None:
                raise ValueError(f'{athlete}: duplicate target pose {target}')
            selected[target] = frames[source_index]
            pose_map[target] = {'source': name, 'sourcePose': source_index}
    if any(frame is None for frame in selected):
        raise ValueError(f'{athlete}: mapping did not fill all 42 targets')

    # Every slot contains original imagegen pixels; this is uniform resize and
    # transparent alpha placement only, matching the neighboring reviewed sets.
    cell = 192
    baseline = 184
    scales = {}
    for name, frames in cache.items():
        selected_frames = [selected[i] for i, source in enumerate(pose_map) if source['source'] == name]
        if not selected_frames:
            continue
        source_max = max(frame.getchannel('A').getbbox()[3] - frame.getchannel('A').getbbox()[1] for frame in selected_frames)
        scales[name] = target_height / source_max
    atlas = Image.new('RGBA', (7 * cell, 6 * cell), (0, 0, 0, 0))
    frame_hashes = []
    bounds = []
    for index, frame in enumerate(selected):
        bbox = frame.getchannel('A').getbbox()
        if not bbox:
            raise ValueError(f'{athlete}: blank pose {index}')
        crop = frame.crop(bbox)
        scale = scales[pose_map[index]['source']]
        width = max(1, round(crop.width * scale))
        height = max(1, round(crop.height * scale))
        if width > cell - 16 or height > baseline - 8:
            raise ValueError(f'{athlete}: pose {index} does not fit with safe margin')
        resized = crop.resize((width, height), Image.Resampling.LANCZOS)
        x = index % 7 * cell + (cell - width) // 2
        y = index // 7 * cell + baseline - height
        atlas.alpha_composite(resized, (x, y))
        frame_hashes.append(hashlib.sha256(resized.tobytes()).hexdigest())
        bounds.append({'poseIndex': index, 'x': x, 'y': y, 'w': width, 'h': height,
                       'sourceScale': scale, 'sourceMaxHeight': round(target_height / scale)})
    if len(set(frame_hashes)) != 42:
        raise ValueError(f'{athlete}: normalized poses are not all distinct')

    source_path = SOURCES / f'{athlete}-locomotion42.png'
    provenance_path = ART / f'{athlete}-locomotion42-provenance.json'
    atlas.save(source_path)
    now = datetime.now(timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z')
    prompts = (ART / f'{athlete}-locomotion-prompts.md').as_posix()
    mapped_sources = {name: {i for i, source in enumerate(pose_map) if source['source'] == name for i in [source['sourcePose']]} for name in cache}
    unselected = []
    for record in maps:
        name, path = record['name'], SOURCES / record['path']
        excluded = set(record.get('excludePoseIndices', []))
        for source_pose in range(len(cache[name])):
            if source_pose in mapped_sources[name] or source_pose in excluded:
                continue
            unselected.append({'path': str(path.relative_to(ROOT)), 'sourcePose': source_pose,
                'generatedImage': record.get('generatedImage'), 'generatedAt': stamp(path), 'sha256': sha(path),
                'prompt': f'{prompts}#{name}',
                'reason': 'Original full-body candidate retained in its source sheet; not needed to fill the exact 42-pose action layout.'})
    provenance = {
        'athlete': athlete, 'canonicalSection': canonical, 'direction': 'right', 'generatedAt': now,
        'prompt': f'Assembled 42 distinct original imagegen drawings from {len(source_records)} source sheets; exact prompts, hashes, dates, pose mapping and exclusions are preserved in {prompts}.',
        'sourceImages': [r['path'] for r in source_records],
        'references': [f'tools/generate-art/references/{athlete}-portrait-reference.png', f'tools/generate-art/references/{athlete}-gameplay-reference.png'],
        'eligibleForPacking': True, 'mirrorSafe': True,
        'mirrorReview': {'status': 'reviewed', 'notes': ''},
        'coverage': '42 authored poses: idle6, idle-ball4, dribble10, run11 and dribble-run11.',
        'review': {'status': 'pending', 'source': '42 mapped source drawings; verify source and all packed atlases on dark and light backgrounds.'},
        'generationHistory': histories,
        'unselectedCandidates': unselected + ([
            {'path':'tools/generate-art/sources/sylvie-shutter-locomotion-base-alternate.png',
             'generatedImage':'/workspace/generated_images/exec-ab999519-c4bd-4b2b-a489-cf3a819bd523.png',
             'generatedAt':stamp(SOURCES/'sylvie-shutter-locomotion-base-alternate.png'),
             'sha256':sha(SOURCES/'sylvie-shutter-locomotion-base-alternate.png'),
             'prompt':'tools/generate-art/sylvie-shutter-locomotion-prompts.md#base',
             'reason':'An alternate 32-pose candidate retained for source history; the selected base sheet had clearer separation in the idle and ball-ready rows.'},
            {'path':'tools/generate-art/sources/sylvie-shutter-locomotion-supplement-b-retry-unselected.png',
             'generatedImage':'/workspace/generated_images/exec-a9a583d0-6df9-4cde-8086-55cb7820f0dd.png',
             'generatedAt':stamp(SOURCES/'sylvie-shutter-locomotion-supplement-b-retry-unselected.png'),
             'sha256':sha(SOURCES/'sylvie-shutter-locomotion-supplement-b-retry-unselected.png'),
             'prompt':'tools/generate-art/sylvie-shutter-locomotion-prompts.md#supplement-b-retry',
             'reason':'Not selected because its first figure touches the canvas edge; the primary strip provides four complete, smoother-looping low dribble-run poses.'}
        ] if athlete == 'sylvie-shutter' else []),
        'assembly': {
            'operation': f'Isolate alpha-connected figures from original imagegen sheets; uniformly scale each source part to a shared {target_height}px maximum pose height; place into a transparent 7x6, 192px cell source at baseline184. No pose is drawn, duplicated, interpolated, or mirrored.',
            'targetCell': [cell, cell], 'baseline': baseline, 'targetPoseHeight': target_height,
            'sourceParts': source_records, 'uniformScaleBySourcePart': scales, 'excludedDrawings': discarded,
            'poseMap': [{'poseIndex': i, 'clip': clip_for(i), **pose_map[i]} for i in range(42)],
            'placedPoses': bounds, 'normalizedPoseSha256': frame_hashes,
            'sourceSha256': sha(source_path), 'poseCount': 42
        }
    }
    provenance_path.write_text(json.dumps(provenance, indent=2) + '\n')
    print(json.dumps({'athlete': athlete, 'source': str(source_path), 'poses': len(set(frame_hashes)), 'excluded': discarded, 'provenance': str(provenance_path)}))


def clip_for(index: int) -> str:
    if index < 6: return 'idle'
    if index < 10: return 'idle-ball'
    if index < 20: return 'dribble'
    if index < 31: return 'run'
    return 'dribble-run'


if __name__ == '__main__':
    # Sources are row-major before mapping. These mappings select only complete
    # bodies and preserve exactly42 distinct drawings for each accepted athlete.
    build('sylvie-shutter', 'J.12', [
        {'name':'base','path':'sylvie-shutter-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-0d8f95ab-949c-438d-b93f-679064a3f69c.png','rows':[6,6,6,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i for i in range(6,9)}, **{i:i+1 for i in range(9,17)},
                **{i:i+3 for i in range(17,25)}, **{i:i+6 for i in range(25,32)}}},
        {'name':'supplement-a','path':'sylvie-shutter-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-64fcc0ce-4d46-48dc-8a98-0af6b622d0da.png',
         'map':{0:9,1:18,2:19,4:28,5:29,6:30}},
        {'name':'supplement-b','path':'sylvie-shutter-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-d90f0014-323e-41eb-b1f6-c3a0217d42f1.png',
         'excludePoseIndices':[6], 'map':{0:38,1:39,2:40,3:41}},
    ], target_height=142)
    build('noelle-pinstripe', 'J.12', [
        {'name':'base','path':'noelle-pinstripe-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-4f3835c4-7b2c-4b73-ba11-113c8ef55a50.png','rows':[7,4,6,7,7],
         'exclude':[{'w':436}],
         'map':{**{i:i for i in range(6)}, **{i:i for i in range(6,10)}, **{i:i for i in range(10,16)},
                **{i:i+4 for i in range(16,24)}, **{i:i+7 for i in range(24,31)}}},
        {'name':'supplement-a','path':'noelle-pinstripe-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-8b6fe975-40d4-4410-9a36-b7b1f80cc683.png',
         'map':{0:16,1:17,2:18,3:19,4:28,5:29,6:30}},
        {'name':'supplement-b','path':'noelle-pinstripe-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-80d7317e-b457-4dbd-8a96-7196781e40c6.png',
         'map':{0:38,1:39,2:40,3:41}},
    ], target_height=142)
    build('cade-brixton', 'J.13', [
        {'name':'base','path':'cade-brixton-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-cf66d4ac-8da1-44f2-bac2-a6481c98f8de.png','rows':[7,6,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i for i in range(6,10)}, **{i:i for i in range(10,19)},
                **{i:i+1 for i in range(19,27)}, **{i:i+4 for i in range(27,34)}}},
        {'name':'supplement-a','path':'cade-brixton-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-b71763de-78d9-4e05-990e-b1d5ad57ee0e.png',
         'map':{0:19,1:28,2:29,3:30,4:38,5:39,6:40}},
        {'name':'supplement-b','path':'cade-brixton-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-6d0ce100-a0bf-4f1d-87a5-8719fde31cdb.png',
         'map':{0:41}},
    ], target_height=142)
    build('fenn-static', 'J.13', [
        {'name':'base','path':'fenn-static-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-df77b998-cce9-4039-81af-c792594d79bb.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i for i in range(6,10)}, **{i:i for i in range(10,20)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'fenn-static-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-2e64e071-dc29-481f-81c6-4ef5cc18520e.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
    ], target_height=142)
    build('ember-rivet', 'J.14', [
        {'name':'base','path':'ember-rivet-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-cde2df8b-f33e-42f4-b43f-a1d90d8fb47f.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'ember-rivet-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-f9437a45-34f7-4fff-aaaf-d3ef2fcf331e.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'ember-rivet-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-0c7f628b-3d07-4035-ba2b-61b47dc074e2.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)
    build('bronze-calder', 'J.14', [
        {'name':'base','path':'bronze-calder-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-5e2750c4-f93f-4c04-a2cc-cdeb110ddc42.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'bronze-calder-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-7118db1f-3282-4f64-8692-e1023b25188a.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'bronze-calder-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-f2a17537-e654-448a-9845-a588ad7da959.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)
