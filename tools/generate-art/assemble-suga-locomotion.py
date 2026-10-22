"""Pack individually reviewed imagegen poses into Suga's locomotion atlases.

Only imagegen source pixels are used. The script extracts authored cells,
isolates the single complete snake silhouette in accepted cells, and packs
those pixels into runtime atlases; it does not synthesize or mirror poses.
"""
import hashlib
import json
import math
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import label

ROOT = Path(__file__).resolve().parents[2]
SPEC = ROOT / 'tools/generate-art/suga-locomotion-sources.json'
OUTPUT = ROOT / 'tools/generate-art/suga-locomotion-layouts.json'
TARGET_HEIGHT = 72
MAX_SPRITE_WIDTH = 224
CELL_HEIGHT = 96
BASELINE = 94
ALPHA_THRESHOLD = 8
BODY_THRESHOLD = 64
MIN_MAJOR_FRACTION = 0.01
MAX_CELL_WIDTH = 256


def sha256(path):
    digest = hashlib.sha256()
    with Path(path).open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def modified_at(path):
    return datetime.fromtimestamp(Path(path).stat().st_mtime, timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z')


def authored_cell(part):
    path = Path(part['path'])
    source_image = Image.open(path).convert('RGBA')
    alpha = np.asarray(source_image.getchannel('A'))
    if alpha.min() != 0 or alpha.max() < 240:
        raise ValueError(str(path) + ': expected genuine transparent RGBA')

    columns, rows = part['grid']
    index = part['index']
    if index < 0 or index >= columns * rows:
        raise ValueError(str(path) + ': source cell is outside declared grid')
    column, row = index % columns, index // columns
    x0 = round(column * source_image.width / columns)
    x1 = round((column + 1) * source_image.width / columns)
    y0 = round(row * source_image.height / rows)
    y1 = round((row + 1) * source_image.height / rows)
    cell = source_image.crop((x0, y0, x1, y1)).convert('RGBA')

    pixels = np.asarray(cell).copy()
    cell_alpha = pixels[:, :, 3]
    labels, _ = label(cell_alpha > BODY_THRESHOLD)
    sizes = np.bincount(labels.ravel())
    minimum = cell.width * cell.height * MIN_MAJOR_FRACTION
    major = [label_id for label_id, size in enumerate(sizes) if label_id and size >= minimum]
    if len(major) != 1:
        raise ValueError(str(path) + ' cell ' + str(index) + ': expected one main snake silhouette, found ' + str(len(major)))

    body_mask = labels == major[0]
    ys, xs = np.where(body_mask)
    left, top, right, bottom = int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1
    margins = (left, top, cell.width - right, cell.height - bottom)
    if min(margins) < 3:
        raise ValueError(str(path) + ' cell ' + str(index) + ': main snake touches the cell edge; crop rejected')

    # Source sheets sometimes have a few disconnected neighbor pixels. Keep
    # the one visually reviewed complete snake and remove only those fragments.
    pixels[~body_mask] = 0
    pixels[pixels[:, :, 3] < ALPHA_THRESHOLD] = 0
    isolated = Image.fromarray(pixels, 'RGBA').crop((left, top, right, bottom))
    metadata = {
        'sourcePath': part['path'],
        'sourceIndex': index,
        'sourceRect': {'x': x0 + left, 'y': y0 + top, 'w': right - left, 'h': bottom - top},
        'cellRect': [x0, y0, x1, y1],
        'sourceSha256': sha256(path),
        'generatedAt': part.get('generatedAt') or modified_at(path),
        'prompt': part.get('prompt', ''),
        'isolatedMajorComponentPixels': int(body_mask.sum()),
        'detachedPixelsRemoved': int(np.count_nonzero((labels != major[0]) & (cell_alpha > BODY_THRESHOLD))),
    }
    return isolated, metadata


def build_clip(athlete, clip_name, frames):
    if len(frames) not in {'idle': {6}, 'idle-ball': {4}, 'dribble': {10}, 'run': {11}, 'dribble-run': {11}}[clip_name]:
        raise ValueError(clip_name + ': incorrect authored pose count ' + str(len(frames)))
    hashes = [hashlib.sha256(frame['image'].tobytes()).hexdigest() for frame in frames]
    if len(set(hashes)) != len(hashes):
        raise ValueError(clip_name + ': duplicate decoded source poses')

    scales = [min(TARGET_HEIGHT / frame['image'].height, MAX_SPRITE_WIDTH / frame['image'].width) for frame in frames]
    widths = [round(frame['image'].width * scale) for frame, scale in zip(frames, scales)]
    cell_width = max(64, math.ceil((max(widths) + 12) / 16) * 16)
    if cell_width > MAX_CELL_WIDTH:
        raise ValueError(clip_name + ': atlas cell width exceeds ' + str(MAX_CELL_WIDTH) + 'px')
    columns = math.ceil(math.sqrt(len(frames)))
    rows = math.ceil(len(frames) / columns)
    atlas = Image.new('RGBA', (columns * cell_width, rows * CELL_HEIGHT), (0, 0, 0, 0))
    packed = []
    for index, (frame, scale) in enumerate(zip(frames, scales)):
        crop = frame['image']
        width = max(1, round(crop.width * scale))
        height = max(1, round(crop.height * scale))
        resized = crop.resize((width, height), Image.Resampling.LANCZOS)
        cell_x = index % columns * cell_width
        cell_y = index // columns * CELL_HEIGHT
        x = cell_x + (cell_width - width) // 2
        y = cell_y + BASELINE - height
        atlas.alpha_composite(resized, (x, y))
        packed.append({
            'x': cell_x, 'y': cell_y, 'w': cell_width, 'h': CELL_HEIGHT,
            **frame['source'],
            'frameScale': scale,
            'pixelSha256': hashlib.sha256(resized.tobytes()).hexdigest(),
        })

    path = ROOT / ('public/assets/animation/' + athlete + '-' + clip_name + '-right.webp')
    if path.exists():
        raise FileExistsError(str(path))
    path.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(path, 'WEBP', quality=90, method=6, exact=True)
    return {
        'athlete': athlete,
        'direction': 'right',
        'clip': clip_name,
        'src': './' + str(path.relative_to(ROOT)),
        'columns': columns,
        'rows': rows,
        'frames': [{'x': part['x'], 'y': part['y'], 'w': part['w'], 'h': part['h']} for part in packed],
        'provenance': {
            'athlete': athlete,
            'canonicalSection': 'K.28',
            'direction': 'right',
            'generatedAt': max(part['generatedAt'] for part in packed),
            'prompt': 'tools/generate-art/suga-locomotion-sources.json',
            'path': 'tools/generate-art/suga-locomotion-sources.json',
            'sourceParts': packed,
            'targetPoseHeight': TARGET_HEIGHT,
            'maxSpriteWidth': MAX_SPRITE_WIDTH,
            'cellHeight': CELL_HEIGHT,
            'baseline': BASELINE,
            'packing': 'Transparent RGBA source-cell extraction; isolate the visually reviewed whole snake; uniform per-pose fit within 72px height and 224px width; no synthesized or mirrored poses.',
            'sourceHashes': sorted({part['sourceSha256'] for part in packed}),
            'eligibleForPacking': True,
            'mirrorSafe': True,
            'review': {'status': 'pending', 'source': 'Awaiting final atlas visual review.'},
        },
    }


def main():
    spec = json.loads(SPEC.read_text())
    for source in [part for clip in spec['clips'].values() for part in clip['parts']]:
        source['sha256'] = sha256(source['path'])
        source['generatedAt'] = source.get('generatedAt') or modified_at(source['path'])

    layouts = []
    for clip_name in ('idle', 'idle-ball', 'dribble', 'run', 'dribble-run'):
        frames = []
        for part in spec['clips'][clip_name]['parts']:
            image, metadata = authored_cell(part)
            frames.append({'image': image, 'source': metadata})
        layouts.append(build_clip(spec['athlete'], clip_name, frames))
        print(clip_name + ': ' + str(len(frames)) + ' isolated, distinct imagegen poses')

    if sum(len(entry['frames']) for entry in layouts) != 42:
        raise ValueError('Expected 42 individually sourced drawings')
    SPEC.write_text(json.dumps(spec, indent=2) + '\n')
    OUTPUT.write_text(json.dumps(layouts, indent=2) + '\n')
    print('Packed 42 authored poses into ' + str(OUTPUT))


if __name__ == '__main__':
    main()
