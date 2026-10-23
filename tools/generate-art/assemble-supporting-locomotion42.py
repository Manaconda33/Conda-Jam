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
import sys
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


def strip_frames(path: Path, expected: int = 7, excluded: list[dict] | None = None):
    image, labels, rects = components(path)
    rects.sort(key=lambda r: r['x'])
    excluded = excluded or []
    good, dropped = [], []
    for rect in rects:
        match = next((rule for rule in excluded if all(rect.get(k) == v for k, v in rule.items())), None)
        (dropped if match else good).append(rect)
    if len(good) != expected:
        raise ValueError(f'{path}: expected {expected} isolated supplement poses; found {len(good)} after exclusions')
    return [alpha_crop(image, labels, r) for r in good], rects, dropped


def build(athlete: str, canonical: str, maps: list[dict], target_height: int = 142,
         prompt_doc: str | None = None):
    selected = [None] * 42
    pose_map = [None] * 42
    histories, source_records, discarded = [], [], []
    cache: dict[str, list[Image.Image]] = {}
    for record in maps:
        label_name, path = record['name'], SOURCES / record['path']
        if record.get('rows'):
            frames, rects, dropped = source_frames(path, record['rows'], record.get('exclude'))
            reason = record.get('excludedComponentReason', 'fused adjacent character drawings; excluded as a whole')
            discarded.extend({'source': str(path.relative_to(ROOT)), **{k: r[k] for k in ('x','y','w','h','component')}, 'reason': reason} for r in dropped)
        elif record.get('unselectedOnly'):
            frames, rects, dropped = strip_frames(path, record.get('expectedPoses', 7), record.get('exclude'))
        else:
            frames, rects, dropped = strip_frames(path, record.get('expectedPoses', 7), record.get('exclude'))
            reason = record.get('excludedComponentReason', 'fused adjacent character drawings; excluded as a whole')
            discarded.extend({'source': str(path.relative_to(ROOT)), **{k: r[k] for k in ('x','y','w','h','component')}, 'reason': reason} for r in dropped)
        for source_pose in record.get('excludePoseIndices', []):
            discarded.append({'source': str(path.relative_to(ROOT)), 'sourcePose': source_pose,
                              'reason': 'full figure touched the generated image edge; excluded as incomplete art'})
        cache[label_name] = frames
        source_records.append({'name': label_name, 'path': str(path.relative_to(ROOT)), 'sha256': sha(path),
                               'generatedAt': stamp(path), 'poseCount': len(frames),
                               'generatedImage': record.get('generatedImage'),
                               'rawComponentCount': len(rects), 'excludedComponents': [r['component'] for r in dropped],
                               'excludedPoseIndices': record.get('excludePoseIndices', []),
                               'rowCounts': record.get('rows') or [record.get('expectedPoses', 7)]})
        histories.append({'path': str(path.relative_to(ROOT)), 'generatedAt': stamp(path),
                          'generatedImage': record.get('generatedImage'),
                          'prompt': f'{prompt_doc or f"tools/generate-art/{athlete}-locomotion-prompts.md"}#{record.get("promptAnchor", label_name)}', 'sha256': sha(path)})
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
    prompts = (ROOT / prompt_doc).as_posix() if prompt_doc else (ART / f'{athlete}-locomotion-prompts.md').as_posix()
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
            'reason': record.get('unselectedReason', 'Original full-body candidate retained in its source sheet; not needed to fill the exact 42-pose action layout.')})
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


if __name__ == '__main__' and (len(sys.argv) == 1 or '--all' in sys.argv):
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


if __name__ == '__main__' and {'violet-lorne', 'cassian-quill'} & set(sys.argv[1:]):
    # J.15 source figures have been visually reviewed; source-cell exclusions are
    # explicit so a fused pair and a clipped Cassian figure never enter the atlases.
    build('violet-lorne', 'J.15', [
        {'name':'base','path':'violet-lorne-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-d466ebda-04fe-4555-baef-ee9a9e2efdf5.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'violet-lorne-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-7c9f0b98-0279-40e2-95e4-bd2683537f46.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'violet-lorne-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-1eb7903e-9610-4722-bc22-918ffcd554c8.png','expectedPoses':5,'exclude':[{'component':2}],
         'excludedComponentReason':'Fused adjacent ball-ready figures; the complete joined component is excluded as a whole.',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)


if __name__ == '__main__' and {'sol-meridian', 'mist-halo'} & set(sys.argv[1:]):
    build('sol-meridian', 'J.16', [
        {'name':'base','path':'sol-meridian-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-7bc084a3-15a6-4ada-937d-477145591908.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'sol-meridian-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-46308635-56f6-4b35-88b0-9af1e13b16f2.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'sol-meridian-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-b6c07701-dd55-487c-ad84-2193b2e04424.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)
    build('mist-halo', 'J.16', [
        {'name':'base','path':'mist-halo-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-a7bf8ed9-1478-4d0a-8ebd-d85e712d3d52.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'mist-halo-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-6980b792-33e5-4482-8199-0c91c00b5fc9.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'mist-halo-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-a815efd7-5b1a-4ddf-a334-fda2721baa38.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)


if __name__ == '__main__' and {'wren-bravado', 'eden-north'} & set(sys.argv[1:]):
    # J.17 sources were checked for exact component counts, alpha separation,
    # visible anatomy and clear row gutters before applying this 42-pose map.
    build('wren-bravado', 'J.17', [
        {'name':'base','path':'wren-bravado-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-01b841d4-bf7c-4619-bd19-04706a02d685.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'wren-bravado-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-e8011bac-7a82-4e5c-bd88-213882a3bc3a.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'wren-bravado-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-8d6fb439-a64f-4bd4-b192-0e1b141cd028.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)
    build('eden-north', 'J.17', [
        {'name':'base','path':'eden-north-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-c2e7fa27-bdfe-46a6-8a56-201329bcf9ee.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'eden-north-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-245f980c-f882-4dc3-bbea-f07125fe4caf.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'eden-north-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-1c11c400-ad39-498e-a39a-499186beb803.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)


if __name__ == '__main__' and {'raven-lux', 'thorn-sable'} & set(sys.argv[1:]):
    # J.18 uses canonical Darkspire Hellcats scarlet/black references. Raven's
    # top-edge-clipped first base pose is omitted as a whole; the remaining six
    # upright frames preserve the idle loop, with clean supplemental motion.
    build('raven-lux', 'J.18', [
        {'name':'base','path':'raven-lux-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-34f8e951-0d80-4dfa-b874-3b65a3ccd696.png','rows':[6,7,7,7,7],
         'exclude':[{'component':1}],'excludedComponentReason':'Top-edge-clipped ponytail/figure; excluded whole as incomplete art.',
         'map':{**{i:i for i in range(6)}, **{i:i+4 for i in range(6,16)},
                **{i:i+1 for i in range(19,27)}, **{i:i+4 for i in range(27,34)}}},
        {'name':'supplement-a-original','path':'raven-lux-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-892482d6-1c97-4467-b375-31785ff925cc.png','unselectedOnly':True,'expectedPoses':6,'map':{},
         'unselectedReason':'Seven intended motion drawings include a touching pair that formed one alpha component; retained for provenance but not packed.'},
        {'name':'supplement-a-retry','path':'raven-lux-locomotion-supplement-a-retry.png','generatedImage':'/workspace/generated_images/exec-ba4e3e79-606a-4ae0-9dad-2eb45ace03c8.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'raven-lux-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-d4c34f4d-5046-493e-91ff-03f4eb08be3e.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)
    build('thorn-sable', 'J.18', [
        {'name':'base','path':'thorn-sable-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-752845b8-5ea6-4bd7-98ea-101579a8b6b4.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'thorn-sable-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-dba96ca5-7ae1-4379-90d2-7233eff53950.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'thorn-sable-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-733ff178-777e-4bce-9237-5148e51fa371.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)


if __name__ == '__main__' and {'kai-suncrest', 'talia-kestrel'} & set(sys.argv[1:]):
    # J.19 sources follow the Solstice Coast Surf reference palette. Talia's
    # two touching supplement attempts remain archived but only the separated
    # third attempt is mapped into the authored motion clips.
    build('kai-suncrest', 'J.19', [
        {'name':'base','path':'kai-suncrest-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-e6262870-c14c-46f2-9869-40aeb0356781.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'kai-suncrest-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-22006322-2995-4f6d-a0c0-cc85930c7521.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'kai-suncrest-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-1f09b8dc-6280-436d-8efa-25732212666e.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)
    build('talia-kestrel', 'J.19', [
        {'name':'base','path':'talia-kestrel-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-4b55417c-211c-4863-ab09-2b4d6ecc65a8.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a-original','path':'talia-kestrel-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-96c9daec-aa9c-4e5c-a6a2-ffb94b0a85f4.png','unselectedOnly':True,'expectedPoses':6,'map':{},
         'unselectedReason':'A touching pair among seven intended motion figures formed one alpha component; the complete source is preserved, and a separated replacement was generated.'},
        {'name':'supplement-a-retry-one','path':'talia-kestrel-locomotion-supplement-a-retry.png','generatedImage':'/workspace/generated_images/exec-d599064a-6d51-45b8-93e2-5e25e0ddded2.png','unselectedOnly':True,'expectedPoses':5,'map':{},
         'unselectedReason':'Two touching pairs among seven intended motion figures merged into five alpha components; a wider, smaller-scale retry was generated.'},
        {'name':'supplement-a-retry-two','path':'talia-kestrel-locomotion-supplement-a-retry2.png','generatedImage':'/workspace/generated_images/exec-6f0d8d21-a921-4499-b11c-5178555ae786.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'talia-kestrel-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-34655659-7994-4723-93e8-40c7123764c2.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)


if __name__ == '__main__' and 'cassian-quill' in sys.argv[1:]:
        build('cassian-quill', 'J.15', [
            {'name':'base','path':'cassian-quill-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-b6ebcf27-c986-4efb-81c4-7909d41a5042.png','rows':[6,7,7,7],
             'exclude':[{'component':1}],'excludedComponentReason':'Top-edge-clipped full figure; excluded as incomplete art.',
             'map':{**{i:i for i in range(6)}, **{i:i+4 for i in range(6,13)},
                    **{i:i+7 for i in range(13,20)}, **{i:i+11 for i in range(20,27)}}},
            {'name':'supplement-a','path':'cassian-quill-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-76fbf98a-cafd-496f-b3d3-b1c96768e005.png',
             'map':{0:17,1:18,2:19,3:27,4:28,5:29,6:30}},
            {'name':'supplement-b','path':'cassian-quill-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-51fd32d9-e7b7-4231-8486-590c065b1fda.png',
             'map':{0:38,1:39,2:40,3:41}},
            {'name':'supplement-c','path':'cassian-quill-locomotion-supplement-c.png','generatedImage':'/workspace/generated_images/exec-96c0c52c-1882-444c-9fb1-5ae2d1453325.png',
             'map':{0:6,1:7,2:8,3:9}},
        ], target_height=142)

if __name__ == '__main__' and {'detective-halftone', 'trace-noire'} & set(sys.argv[1:]):
    # J.20 follows the Nocturne City black/steel identity. Both human source
    # sets use the same exact 35+7+7 category map and safe mirroring review.
    build('detective-halftone', 'J.20', [
        {'name':'base','path':'detective-halftone-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-c84fcb7a-c7ba-4b74-855b-2b87eefad35c.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'detective-halftone-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-f3bd6534-2929-47fd-b87f-68e372f637b8.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'detective-halftone-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-aa44b874-5b0c-41f2-a17d-6b2a13fb5ec9.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)
    build('trace-noire', 'J.20', [
        {'name':'base','path':'trace-noire-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-b4de20ba-41c1-4c21-b19b-3067ad2489d1.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'trace-noire-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-93a2ae52-10ac-4d53-84dd-8abc5fa57d55.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'trace-noire-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-28dd6cda-f866-4992-bd65-1be69cdddc35.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)

if __name__ == '__main__' and {'jett-byte', 'cass-pixel'} & set(sys.argv[1:]):
    # J.21 uses the Neon Circuit cyan/magenta palette. Preserve Jett's cyan
    # spikes and Cass's large pink ponytail in every mapped motion category.
    build('jett-byte', 'J.21', [
        {'name':'base','path':'jett-byte-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-a1b94122-6300-407b-bd40-79cc9658061f.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'jett-byte-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-11e6ca8e-35b6-4047-9d07-4b55e8921647.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'jett-byte-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-ce6fa901-f229-4c3e-86db-2b58fb9f07cb.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)
    build('cass-pixel', 'J.21', [
        {'name':'base','path':'cass-pixel-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-1e2837b7-057b-497d-86f5-41f31ede1a84.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'cass-pixel-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-adca96a3-5826-4d96-8d8f-1c0bdad1de23.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'cass-pixel-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-8d083a25-f5f2-4f3d-91c1-c64a6b0018d8.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)

if __name__ == '__main__' and {'riff-voltage', 'fret-nova'} & set(sys.argv[1:]):
    # J.22 follows Amp City's copper/electric-white identity. The first Fret
    # base and Riff ready strip are preserved as rejected, touching candidates.
    build('riff-voltage', 'J.22', [
        {'name':'base','path':'riff-voltage-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-8edeec5d-0182-4102-a8ed-846485bad531.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'riff-voltage-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-8fc73b48-4d53-4601-93c7-cf3408d32f2e.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b-original','path':'riff-voltage-locomotion-supplement-b-rejected-touching.png','generatedImage':'/workspace/generated_images/exec-a92b51c7-3d93-4095-863f-4172335fb3aa.png','unselectedOnly':True,'expectedPoses':6,'map':{},
         'unselectedReason':'Seven intended ball-ready figures produced only six separate alpha components because two stances touched; retained as rejected source history, not packed.'},
        {'name':'supplement-b-retry','path':'riff-voltage-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-d4a51439-0802-4cc4-af86-ae359a376367.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)
    build('fret-nova', 'J.22', [
        {'name':'base-original','path':'fret-nova-locomotion-base-rejected-touching.png','generatedImage':'/workspace/generated_images/exec-4ba9b861-556c-4dbc-aa80-45896e8dd045.png','unselectedOnly':True,'expectedPoses':33,'map':{},
         'unselectedReason':'Long ponytails touched across cells; alpha inspection found only33 separate figures. Preserved as rejected and never packed.'},
        {'name':'base','path':'fret-nova-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-5efe36fd-56f0-4d3e-b098-c1ec104a0ebc.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'fret-nova-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-eb1dd993-5329-4cfc-b593-b863b4fc276d.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'fret-nova-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-8ddd1097-b4a4-41fe-bee4-742b437f9f52.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)
if __name__ == '__main__' and {'thorn-script', 'nyx-steel'} & set(sys.argv[1:]):
    build('thorn-script', 'J.23', [
        {'name':'base','path':'thorn-script-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-a7f297b8-4eb9-4045-92cb-7dd6c8006814.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a-style-rejected','path':'thorn-script-locomotion-supplement-a-style-rejected.png','generatedImage':'/workspace/generated_images/exec-93fad9b6-cc2c-4d3b-b7e0-ac3d2f50aea2.png','unselectedOnly':True,'expectedPoses':7,'map':{},
         'unselectedReason':'The early strip drifted from the muscular base design in style/proportions; retained for history, not packed.'},
        {'name':'supplement-a-checker-rejected','path':'thorn-script-locomotion-supplement-a-checker-rejected.png','generatedImage':'/workspace/generated_images/exec-88620cd5-a52a-4bbb-aa15-cf3a3ff74439.png','unselectedOnly':True,'expectedPoses':1,'map':{},
         'unselectedReason':'Identity-matched poses had a flattened checkerboard and no true alpha; rejected before packing.'},
        {'name':'supplement-a-flat-rejected','path':'thorn-script-locomotion-supplement-a-flat-rejected.png','generatedImage':'/workspace/generated_images/exec-c75fb125-651f-4045-b230-38a61d76ae8f.png','unselectedOnly':True,'expectedPoses':1,'map':{},
         'unselectedReason':'Identity-matched poses had a flat opaque background and no true alpha; rejected before packing.'},
        {'name':'supplement-a','path':'thorn-script-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-86897230-3961-4316-9b07-908d23fa0ff6.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b-style-rejected','path':'thorn-script-locomotion-supplement-b-style-rejected.png','generatedImage':'/workspace/generated_images/exec-9905b8d7-8b87-4f8b-9ca4-c9d5cdc9477b.png','unselectedOnly':True,'expectedPoses':7,'map':{},
         'unselectedReason':'The early ball-ready strip drifted from the muscular base design in style/proportions; retained for history, not packed.'},
        {'name':'supplement-b-checker-rejected','path':'thorn-script-locomotion-supplement-b-checker-rejected.png','generatedImage':'/workspace/generated_images/exec-c0137c2a-4326-41a3-85ff-9443436e89ed.png','unselectedOnly':True,'expectedPoses':1,'map':{},
         'unselectedReason':'Identity-matched poses had a flattened checkerboard and no true alpha; rejected before packing.'},
        {'name':'supplement-b','path':'thorn-script-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-5c8eff23-6df4-42ec-9117-3e0d45ddc12f.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)
    build('nyx-steel', 'J.23', [
        {'name':'base-border-rejected','path':'nyx-steel-locomotion-base-border-rejected.png','generatedImage':'/workspace/generated_images/exec-cca979ee-9915-48ab-a998-ff6ae3866bd0.png','unselectedOnly':True,'expectedPoses':35,'map':{},
         'unselectedReason':'The source sheet has a full figure touching the image edge; retained for review only, never packed.'},
        {'name':'base','path':'nyx-steel-locomotion-base-retry.png','generatedImage':'/workspace/generated_images/exec-019ce342-ec1f-47cf-9c82-63ded85727f5.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-a','path':'nyx-steel-locomotion-supplement-a.png','generatedImage':'/workspace/generated_images/exec-f4f88bb6-c797-45f0-b58d-a48206551fb2.png',
         'map':{0:28,1:29,2:30,3:38,4:39,5:40,6:41}},
        {'name':'supplement-b','path':'nyx-steel-locomotion-supplement-b.png','generatedImage':'/workspace/generated_images/exec-ba73b9ee-3484-4b4e-aa79-3cdfbb656d6d.png',
         'map':{0:6,1:7,2:8,3:9}},
    ], target_height=142)

if __name__ == '__main__' and {'moss-quarry', 'digger-finch'} & set(sys.argv[1:]):
    # J.24's transparent identity sheets map only reviewed, complete poses.
    # Moss's first generator returned four rows/28 poses; the unused spare
    # stays documented while the missing action categories come from a 21-pose
    # mixed supplement. Digger's base returned the full 35-pose grid.
    build('moss-quarry', 'J.24', [
        {'name':'base','path':'moss-quarry-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-71453074-246e-4702-a7a2-39a7b70c8436.png','rows':[7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i+3 for i in range(17,28)}}},
        {'name':'supplement-21','path':'moss-quarry-locomotion-supplement-21.png','generatedImage':'/workspace/generated_images/exec-53d60214-d34e-4b5f-947c-a4bb9595410e.png','rows':[7,7,7],
         'map':{**{i:i+31 for i in range(7)}, **{i:i+31 for i in range(7,11)},
                14:6,15:7,16:8,17:9}},
    ], target_height=142)
    build('digger-finch', 'J.24', [
        {'name':'base','path':'digger-finch-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-cfdc60cd-9028-4ce9-8df5-52bb2ddf0799.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i for i in range(20,28)}, **{i:i+3 for i in range(28,31)}}},
        {'name':'supplement-21','path':'digger-finch-locomotion-supplement-21.png','generatedImage':'/workspace/generated_images/exec-96a8a650-a95e-4b8c-9f24-587148f6c198.png','rows':[7,7,7],
         'map':{**{i:i+28 for i in range(3)}, **{i:i+31 for i in range(3,7)},
                **{i:i+31 for i in range(7,11)}, **{i:i-8 for i in range(14,18)}}},
    ], target_height=142)

if __name__ == '__main__' and {'willow-root', 'rowan-bark'} & set(sys.argv[1:]):
    # J.25 reuses the same explicit pose map: six idle, four ball-ready,
    # ten stationary dribble, eleven run and eleven dribble-run poses.
    # Each 35-pose base leaves one idle candidate unselected; eight unique
    # poses from the 14-pose supplement complete the set.
    build('willow-root', 'J.25', [
        {'name':'base','path':'willow-root-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-3d3cc0f5-5d42-4383-93eb-db3fecb100be.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i+3 for i in range(17,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-14','path':'willow-root-locomotion-supplement-14.png','generatedImage':'/workspace/generated_images/exec-cddecd5e-7cb6-449e-ae6a-92c1732f47d9.png','rows':[7,7],
         'map':{0:6,1:7,2:8,3:9,7:38,8:39,9:40,10:41}},
    ], target_height=142)
    build('rowan-bark', 'J.25', [
        {'name':'base','path':'rowan-bark-locomotion-base.png','generatedImage':'/workspace/generated_images/exec-b9cb4d60-8582-41b9-942c-7d41e5c0f2c6.png','rows':[7,7,7,7,7],
         'map':{**{i:i for i in range(6)}, **{i:i+3 for i in range(7,17)},
                **{i:i+3 for i in range(17,28)}, **{i:i+3 for i in range(28,35)}}},
        {'name':'supplement-14','path':'rowan-bark-locomotion-supplement-14.png','generatedImage':'/workspace/generated_images/exec-6a607598-4c8e-43d1-baa2-ca6b8e3baa55.png','rows':[7,7],
         'map':{0:6,1:7,2:8,3:9,7:38,8:39,9:40,10:41}},
    ], target_height=142)

if __name__ == '__main__' and {'auric-scale', 'cinder-royal'} & set(sys.argv[1:]):
    # J.27's four-band 28-pose bases and mixed fourteen-pose supplements map
    # all42 reviewed drawings into the five production locomotion actions.
    for athlete in ('auric-scale', 'cinder-royal'):
        build(athlete, 'J.27', [
            {'name':'base','path':f'{athlete}-locomotion-base.png',
             'generatedImage':('/workspace/generated_images/exec-df54b4de-a01b-48b1-a9b7-f057796c2a3a.png' if athlete=='auric-scale' else '/workspace/generated_images/exec-b26cdea8-47f8-4cd2-90c2-6dd4ab78d1e4.png'),
             'rows':[7,7,7,7],
             'map':{**{i:i for i in range(6)}, 6:6, **{i:i+3 for i in range(7,14)},
                    **{i:i+6 for i in range(14,21)}, **{i:i+10 for i in range(21,28)}}},
            {'name':'supplement-14','path':f'{athlete}-locomotion-supplement-14.png',
             'generatedImage':('/workspace/generated_images/exec-13185796-e218-4909-8259-5811ea4dcb43.png' if athlete=='auric-scale' else '/workspace/generated_images/exec-5b4eb299-6ed1-4299-86e3-62dd58099f39.png'),
             'rows':[7,7],
             'map':{0:7,1:8,2:9,3:27,4:28,5:29,6:30,
                    7:17,8:18,9:19,10:38,11:39,12:40,13:41}},
        ], target_height=142)

if __name__ == '__main__' and {'nox-striker', 'viper-veil'} & set(sys.argv[1:]):
    # J.28's four-band bases and mixed supplements map42 original figures to
    # idle6, idle-ball4, dribble10, run11 and dribble-run11.
    for athlete in ('nox-striker', 'viper-veil'):
        build(athlete, 'J.28', [
            {'name':'base','path':f'{athlete}-locomotion-base.png',
             'generatedImage':('/workspace/generated_images/exec-7e71723a-e102-4a49-8685-760f2b1c449a.png' if athlete=='nox-striker' else '/workspace/generated_images/exec-a12428fe-b247-4ec7-a980-513e88774b22.png'),
             'rows':[7,7,7,7],
             'map':{**{i:i for i in range(6)}, 6:6, **{i:i+3 for i in range(7,14)},
                    **{i:i+6 for i in range(14,21)}, **{i:i+10 for i in range(21,28)}}},
            {'name':'supplement-14','path':f'{athlete}-locomotion-supplement-14.png',
             'generatedImage':('/workspace/generated_images/exec-43256946-8a05-4bd4-8c82-1d0e9ac88445.png' if athlete=='nox-striker' else '/workspace/generated_images/exec-516078a2-82ea-4847-b18e-4751f4703bc4.png'),
             'rows':[7,7],
             'map':{0:7,1:8,2:9,3:27,4:28,5:29,6:30,
                    7:17,8:18,9:19,10:38,11:39,12:40,13:41}},
        ], target_height=142)

if __name__ == '__main__' and {'moss-granite', 'thump-alder'} & set(sys.argv[1:]):
    # J.29's source bases map28 original figures; mixed14-pose supplements
    # are required to complete the five gameplay loops without synthesized
    # frames. Thump's first supplement is retained as rejected source history
    # after two outside poses were clipped; only the safe-margin retry packs.
    # Moss's candidate supplement is also rejected: its connected-alpha audit
    # finds only12 components, with a fused figure group. Run only requested
    # athletes so Thump's valid source can be checkpointed independently.
    for athlete in ('moss-granite', 'thump-alder'):
        if athlete not in sys.argv[1:]:
            continue
        build(athlete, 'J.29', [
            {'name':'base','path':f'{athlete}-locomotion-base.png',
             'generatedImage':('/workspace/generated_images/exec-fb70fa07-573c-436e-be17-818397be17c7.png' if athlete=='moss-granite' else '/workspace/generated_images/exec-bdcea393-c60b-4ff6-9e64-63a5ef1aa144.png'),
             'rows':[7,7,7,7],
             'map':{**{i:i for i in range(6)}, 6:6, **{i:i+3 for i in range(7,14)},
                    **{i:i+6 for i in range(14,21)}, **{i:i+10 for i in range(21,28)}}},
            *([{'name':'supplement-14-incomplete-fused','path':'moss-granite-locomotion-supplement-14-incomplete-fused.png',
                'generatedImage':'/workspace/generated_images/exec-b4169617-b316-49d7-977b-a2d9ce6a281e.png','unselectedOnly':True,'expectedPoses':12,'map':{},
                'unselectedReason':'The intended14-pose sheet yielded only12 isolated alpha components; multiple motion figures are fused into one component. Preserved as rejected source history, not packed.'}]
              if athlete=='moss-granite' else []),
            *([{'name':'supplement-14','path':'moss-granite-locomotion-supplement-14.png',
             'generatedImage':'/workspace/generated_images/exec-9ed4b36c-8aa8-4ba1-8ce5-a78bb8d79994.png','rows':[7,7],
             'map':{0:7,1:8,2:9,3:27,4:28,5:29,6:30,
                    7:17,8:18,9:19,10:38,11:39,12:40,13:41}}]
              if athlete=='moss-granite' else []),
            *([{'name':'supplement-14-edge-clipped-rejected','path':'thump-alder-locomotion-supplement-14-edge-clipped-rejected.png',
                'generatedImage':'/workspace/generated_images/exec-868b9ac4-9ff1-4ea0-9db0-4d7c8c9a0945.png','unselectedOnly':True,'expectedPoses':11,
                'exclude':[{'component':7},{'component':15}],'map':{},
                'unselectedReason':'The outside figures in components7 and15 are clipped, and one lower-row pair touches. Eleven isolated components remain in the rejected sheet; it is preserved as source history, not packed.'}]
              if athlete=='thump-alder' else []),
            *([{'name':'supplement-14','path':'thump-alder-locomotion-supplement-14.png',
             'generatedImage':'/workspace/generated_images/exec-1b0c5f3d-b2b7-4615-a54b-31348e6105b5.png',
             'rows':[7,7],
             'map':{0:7,1:8,2:9,3:27,4:28,5:29,6:30,
                    7:17,8:18,9:19,10:38,11:39,12:40,13:41}}]
              if athlete=='thump-alder' else []),
        ], target_height=142)


if __name__ == '__main__' and {'camden-union', 'poppy-stitch'} & set(sys.argv[1:]):
    # J.30 runtime cells58/59 were used for the correct references. Accepted
    # 28-pose bases and14-pose supplements map through the standard 42 poses.
    ids = {
        'camden-union': ('exec-37f87e22-f082-49bc-a360-0483d0bae9d4',
                         'exec-9302c029-44ea-4b75-a75f-8dc2c8ffcf10'),
        'poppy-stitch': ('exec-3a570a00-5aa0-4e1b-ae94-178c6ef479a5',
                         'exec-823f6efb-50b9-42bb-a022-d79fac11dc6c'),
    }
    for athlete in ('camden-union', 'poppy-stitch'):
        if athlete not in sys.argv[1:]:
            continue
        base_id, supplement_id = ids[athlete]
        build(athlete, 'J.30', [
            {'name':'base','path':f'{athlete}-locomotion-base.png',
             'generatedImage':f'/workspace/generated_images/{base_id}.png',
             'rows':[7,7,7,7],
             'map':{**{i:i for i in range(6)}, 6:6, **{i:i+3 for i in range(7,14)},
                    **{i:i+6 for i in range(14,21)}, **{i:i+10 for i in range(21,28)}}},
            {'name':'supplement-14','path':f'{athlete}-locomotion-supplement-14.png',
             'generatedImage':f'/workspace/generated_images/{supplement_id}.png',
             'rows':[7,7],
             'map':{0:7,1:8,2:9,3:27,4:28,5:29,6:30,
                    7:17,8:18,9:19,10:38,11:39,12:40,13:41}},
        ], target_height=142)


if __name__ == '__main__' and {'draya-staffwind', 'kael-rune'} & set(sys.argv[1:]):
    # J.31 uses the cell60/61 identities. Each four-row base contributes
    # idle, stationary dribble, run and dribble-run poses; the safe fourteen-
    # pose strip fills ball-ready gaps and the remaining action phases.
    ids = {
        'draya-staffwind': ('exec-ec41ee7e-271a-4ed2-a26e-dac1c8464815',
                            'exec-a58be28b-1597-4119-b4be-8c6b3195859f'),
        'kael-rune': ('exec-796741ae-88ca-42b3-9bed-e0abfaa1be81',
                      'exec-2d8a16f5-0097-4a40-98ae-f15755ce5331'),
    }
    for athlete in ('draya-staffwind', 'kael-rune'):
        if athlete not in sys.argv[1:]:
            continue
        base_id, supplement_id = ids[athlete]
        build(athlete, 'J.31', [
            {'name':'base','path':f'{athlete}-locomotion-base.png',
             'generatedImage':f'/workspace/generated_images/{base_id}.png',
             'rows':[7,7,7,7],
             'map':{**{i:i for i in range(6)}, 6:6,
                    **{i:i+3 for i in range(7,14)},
                    **{i:i+6 for i in range(14,21)},
                    **{i:i+10 for i in range(21,28)}}},
            *([{'name':'base-rejected-with-balls','path':'draya-staffwind-locomotion-base-rejected-with-balls.png',
                'generatedImage':'/workspace/generated_images/exec-47231036-5f56-4050-b2ca-53dad11cda24.png',
                'unselectedOnly':True,'expectedPoses':28,'map':{},
                'unselectedReason':'This initial base generation embedded basketballs in ball-ready and dribble figures despite the empty-hands requirement; preserved for source history but never packed.'}]
              if athlete=='draya-staffwind' else []),
            {'name':'supplement-14','path':f'{athlete}-locomotion-supplement-14.png',
             'generatedImage':f'/workspace/generated_images/{supplement_id}.png',
             'rows':[7,7],
             'map':{0:7,1:8,2:9,3:27,4:28,5:29,6:30,
                    7:17,8:18,9:19,10:38,11:39,12:40,13:41}},
        ], target_height=142)


if __name__ == '__main__' and {'lilt-smile', 'violet-wink'} & set(sys.argv[1:]):
    # J.32 uses exact runtime cells62/63. Rejected Lilt retries remain in the
    # provenance history; only the reviewed 28+14 figures map into production.
    ids = {
        'lilt-smile': {
            'base': 'exec-ae593f2b-503e-4d51-abc6-57e001861d52',
            'supplement': 'exec-2875ce1a-45b8-4331-8fe3-e2d25c986789',
            'rejected': 'exec-6ed2781d-a0d9-4386-9df7-1c38d42ef0d4',
        },
        'violet-wink': {
            'base': 'exec-09cf07f4-4dbc-4e95-afee-8f2b9e04e096',
            'supplement': 'exec-0879b4ad-9a20-4776-8224-0444b3f3d55a',
        },
    }
    for athlete in ('lilt-smile', 'violet-wink'):
        if athlete not in sys.argv[1:]:
            continue
        record = ids[athlete]
        base_map = {**{i:i for i in range(6)}, 6:6,
                    **{i:i+3 for i in range(7,14)},
                    **{i:i+6 for i in range(14,21)},
                    **{i:i+10 for i in range(21,28)}}
        if athlete == 'lilt-smile':
            # Lilt's sixth idle-row candidate is her distinct low, open-hand
            # ball-ready stance. Keep the six upright idle drawings together.
            base_map = {**{i:i for i in range(5)}, 6:5, 5:6,
                        **{i:i+3 for i in range(7,14)},
                        **{i:i+6 for i in range(14,21)},
                        **{i:i+10 for i in range(21,28)}}
        build(athlete, 'J.32', [
            {'name':'base','path':f'{athlete}-locomotion-base.png',
             'generatedImage':f'/workspace/generated_images/{record["base"]}.png',
             'promptAnchor':f'{athlete}-base',
             'rows':[7,7,7,7],
             'map':base_map},
            *([{'name':'supplement-14-rejected-margin','path':'lilt-smile-locomotion-supplement-14-rejected-margin.png',
                'generatedImage':f'/workspace/generated_images/{record["rejected"]}.png',
                'promptAnchor':'lilt-smile-supplement-rejected-margin',
                'unselectedOnly':True,'expectedPoses':14,'map':{},
                'unselectedReason':'A stricter retry had fourteen figures, but the row did not preserve the required ball-ready poses and an outside figure was clipped. It remains excluded; the earlier isolated, complete 14-pose sheet is selected.'}]
              if athlete=='lilt-smile' else []),
            {'name':'supplement-14','path':f'{athlete}-locomotion-supplement-14.png',
             'generatedImage':f'/workspace/generated_images/{record["supplement"]}.png',
             'promptAnchor':f'{athlete}-supplement',
             'rows':[7,7],
             'map':{0:7,1:8,2:9,3:27,4:28,5:29,6:30,
                    7:17,8:18,9:19,10:38,11:39,12:40,13:41}},
        ], target_height=142, prompt_doc='tools/generate-art/j32-locomotion-prompts.md')


if __name__ == '__main__' and {'fern-howl', 'koa-vale'} & set(sys.argv[1:]):
    # J.33, Emerald Den Wolves. Keep all seven base rows intact; the safe
    # supplements supply the other three ball-ready poses and the remaining
    # run/dribble/run-dribble poses. Rejected base candidates stay provenance
    # only and never enter the 42-frame atlas.
    records = {
        'fern-howl': {
            'base': 'exec-e4cc7078-9930-4a75-9514-9b4eab48b6b9',
            'supplement': 'exec-2f0dc865-1c36-4e7d-94b1-7f764e2775a7',
            'rejected-base': 'exec-fbb0f095-ed73-49de-a5ca-d198d349d492',
        },
        'koa-vale': {
            'base': 'exec-2b0c986b-175b-4163-ad04-be4a5c59eb8f',
            'supplement': 'exec-a5418451-327b-4ad5-95e7-9eb655f9c51e',
            'rejected-base-crouched': 'exec-50f210ef-fcd0-417e-ba0c-fa2f241a4c8e',
            'rejected-base-ready-hand': 'exec-95a68bc5-f092-47a0-83cf-8536258106bd',
        },
    }
    for athlete in ('fern-howl', 'koa-vale'):
        if athlete not in sys.argv[1:]:
            continue
        record = records[athlete]
        base_map = {**{i:i for i in range(6)}, 6:6,
                    **{i:i+3 for i in range(7,14)},
                    **{i:i+6 for i in range(14,21)},
                    **{i:i+10 for i in range(21,28)}}
        rejected = []
        if athlete == 'fern-howl':
            rejected = [
                {'name':'base-rejected-27-components','path':'fern-howl-locomotion-base-rejected-27-components.png',
                 'generatedImage':'/workspace/generated_images/exec-83475b09-f6aa-4f9f-b7f5-059fde379e4c.png',
                 'promptAnchor':'fern-howl-base-rejected-27-components','unselectedOnly':True,'expectedPoses':27,'map':{},
                 'unselectedReason':'Only27 isolated figures were found instead of28; this base is rejected whole and none of its poses are assembled.'},
                {'name':'base-rejected-ready-crouch','path':'fern-howl-locomotion-base-attempt2.png',
                 'generatedImage':f'/workspace/generated_images/{record["rejected-base"]}.png',
                 'promptAnchor':'fern-howl-base-rejected-ready-crouch','unselectedOnly':True,'expectedPoses':28,'map':{},
                 'unselectedReason':'All28 figures were separate, but the top-right ball-ready pose was crouched instead of upright; the corrected base is selected.'},
                {'name':'supplement-rejected-overlap','path':'fern-howl-locomotion-supplement-14-rejected-overlap.png',
                 'generatedImage':'/workspace/generated_images/exec-186f1621-b96f-47e5-b9a7-3bc894b61238.png',
                 'promptAnchor':'fern-howl-supplement-rejected-overlap','unselectedOnly':True,'expectedPoses':14,'map':{},
                 'unselectedReason':'All14 components were present, but neighboring figure bounds overlapped; this supplement is preserved whole and not assembled.'}
            ]
        else:
            rejected = [
                {'name':'base-rejected-fused-26-components','path':'koa-vale-locomotion-base-rejected-26-components.png',
                 'generatedImage':'/workspace/generated_images/exec-44f934b9-5489-40fa-bfa1-5160ac095c7c.png',
                 'promptAnchor':'koa-vale-base-rejected-fused-26-components','unselectedOnly':True,'expectedPoses':26,'map':{},
                 'unselectedReason':'Connected-alpha review found26 components where28 were required; fused figures make this base unsuitable for assembly.'},
                {'name':'base-rejected-crouched-ready', 'path':'koa-vale-locomotion-base-attempt1.png',
                 'generatedImage':f'/workspace/generated_images/{record["rejected-base-crouched"]}.png',
                 'promptAnchor':'koa-vale-base-rejected-crouched-ready', 'unselectedOnly':True, 'expectedPoses':28, 'map':{},
                 'unselectedReason':'All28 figures were separate, but the top-right ball-ready pose crouched; a later candidate with an upright open-hand stance is selected.'},
                {'name':'base-rejected-closed-ready-hand', 'path':'koa-vale-locomotion-base-attempt2.png',
                 'generatedImage':f'/workspace/generated_images/{record["rejected-base-ready-hand"]}.png',
                 'promptAnchor':'koa-vale-base-rejected-closed-ready-hand', 'unselectedOnly':True, 'expectedPoses':28, 'map':{},
                 'unselectedReason':'All28 figures were separate and upright, but the top-right pose did not clearly show an open ball-ready hand; the corrected source is selected.'},
            ]
        build(athlete, 'J.33', [
            {'name':'base','path':f'{athlete}-locomotion-base.png',
             'generatedImage':f'/workspace/generated_images/{record["base"]}.png',
             'promptAnchor':f'{athlete}-base', 'rows':[7,7,7,7], 'map':base_map},
            *rejected,
            {'name':'supplement-14','path':f'{athlete}-locomotion-supplement-14.png',
             'generatedImage':f'/workspace/generated_images/{record["supplement"]}.png',
             'promptAnchor':f'{athlete}-supplement', 'rows':[7,7],
             'map':{0:7,1:8,2:9,3:27,4:28,5:29,6:30,
                    7:17,8:18,9:19,10:38,11:39,12:40,13:41}},
        ], target_height=142, prompt_doc='tools/generate-art/j33-j35-locomotion-prompts.md')


if __name__ == '__main__' and {'scribble-turner', 'palette-spry'} & set(sys.argv[1:]):
    # J.34, Stripewood Longarms. Namesake franchise and kit do not change the
    # normal human rigs documented by the exact cell66/67 gameplay references.
    records = {
        'scribble-turner': {
            'base': 'exec-fbf184a1-4151-42f7-90ee-6814fe6b2e82',
            'supplement': 'exec-9b2311a6-e700-4e23-995d-2a25ddfedd0e',
            'rejected-base-ready-crouched': 'exec-8ae1d9ff-eba2-4050-b3fd-1c15dd282d5d',
        },
        'palette-spry': {
            'base': 'exec-29d7931a-66fc-49cf-8917-57b0af0d22f5',
            'supplement': 'exec-99716429-c4b2-4d1f-8218-6dd150dfbad2',
            'rejected-base-ready-crouched': 'exec-65497701-dea2-423f-8c2a-7db6110302ff',
        },
    }
    for athlete in ('scribble-turner', 'palette-spry'):
        if athlete not in sys.argv[1:]:
            continue
        record = records[athlete]
        base_map = {**{i: i for i in range(7)},
                    **{i: i + 3 for i in range(7, 14)},
                    **{i: i + 6 for i in range(14, 21)},
                    **{i: i + 10 for i in range(21, 28)}}
        build(athlete, 'J.34', [
            {'name': 'base', 'path': f'{athlete}-locomotion-base.png',
             'generatedImage': f'/workspace/generated_images/{record["base"]}.png',
             'promptAnchor': f'{athlete}-base-retry-upright-ready',
             'rows': [7, 7, 7, 7], 'map': base_map},
            {'name': 'base-rejected-ready-crouched',
             'path': f'{athlete}-locomotion-base-attempt1.png',
             'generatedImage': f'/workspace/generated_images/{record["rejected-base-ready-crouched"]}.png',
             'promptAnchor': f'{athlete}-base-rejected-ready-crouched',
             'unselectedOnly': True, 'expectedPoses': 28, 'map': {},
             'unselectedReason': 'All28 figures were separate and in bounds, but the top-right ball-ready stance was crouched rather than upright; preserved for source history and excluded from assembly.'},
            {'name': 'supplement-14', 'path': f'{athlete}-locomotion-supplement-14.png',
             'generatedImage': f'/workspace/generated_images/{record["supplement"]}.png',
             'promptAnchor': f'{athlete}-supplement', 'rows': [7, 7],
             'map': {0: 7, 1: 8, 2: 9, 3: 27, 4: 28, 5: 29, 6: 30,
                     7: 17, 8: 18, 9: 19, 10: 38, 11: 39, 12: 40, 13: 41}},
        ], target_height=142, prompt_doc='tools/generate-art/j33-j35-locomotion-prompts.md')
