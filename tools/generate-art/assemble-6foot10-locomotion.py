"""Pack individually reviewed imagegen poses into 6foot10 locomotion atlases.

This script extracts existing source pixels and packs them at runtime size. It
does not create, interpolate, or mirror poses.
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
SPEC = ROOT / 'tools/generate-art/6foot10-locomotion-sources.json'
OUTPUT = ROOT / 'tools/generate-art/6foot10-locomotion-layouts.json'
TARGET_HEIGHT = 72
MAX_SPRITE_WIDTH = 224
CELL_HEIGHT = 96
BASELINE = 94
ALPHA_THRESHOLD = 8
BODY_THRESHOLD = 64
MIN_BODY_FRACTION = 0.08
MAX_CELL_WIDTH = 224
POSE_COUNTS = {'idle': 6, 'idle-ball': 4, 'dribble': 10, 'run': 11, 'dribble-run': 11}


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
    image = Image.open(path).convert('RGBA')
    alpha = np.asarray(image.getchannel('A'))
    if alpha.min() != 0 or alpha.max() < 240:
        raise ValueError(str(path) + ': expected genuine transparent RGBA')

    columns, rows = part['grid']
    index = part['index']
    if index < 0 or index >= columns * rows:
        raise ValueError(str(path) + ': source cell is outside declared grid')
    x0 = round(index % columns * image.width / columns)
    x1 = round((index % columns + 1) * image.width / columns)
    y0 = round(index // columns * image.height / rows)
    y1 = round((index // columns + 1) * image.height / rows)
    cell = image.crop((x0, y0, x1, y1))

    pixels = np.asarray(cell).copy()
    cell_alpha = pixels[:, :, 3]
    labels, _ = label(cell_alpha > BODY_THRESHOLD)
    sizes = np.bincount(labels.ravel())
    major = [label_id for label_id, size in enumerate(sizes) if label_id and size >= cell.width * cell.height * MIN_BODY_FRACTION]
    if len(major) != 1:
        raise ValueError(f'{path} cell {index}: expected one visually reviewed full body, found {len(major)} large components')

    body_mask = labels == major[0]
    ys, xs = np.where(body_mask)
    left, top, right, bottom = int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1
    margins = (left, top, cell.width - right, cell.height - bottom)
    if min(margins) < 3:
        raise ValueError(f'{path} cell {index}: body silhouette touches its cell edge: {margins}')

    pixels[~body_mask] = 0
    pixels[pixels[:, :, 3] < ALPHA_THRESHOLD] = 0
    isolated = Image.fromarray(pixels, 'RGBA').crop((left, top, right, bottom))
    metadata = {
        'sourcePath': str(path),
        'sourceIndex': index,
        'sourceRect': {'x': x0 + left, 'y': y0 + top, 'w': right - left, 'h': bottom - top},
        'cellRect': [x0, y0, x1, y1],
        'sourceSha256': sha256(path),
        'generatedAt': part.get('generatedAt') or modified_at(path),
        'prompt': part['prompt'],
        'isolatedMajorComponentPixels': int(body_mask.sum()),
        'detachedPixelsRemoved': int(np.count_nonzero((labels != major[0]) & (cell_alpha > BODY_THRESHOLD))),
        'transparentMargins': {'left': margins[0], 'top': margins[1], 'right': margins[2], 'bottom': margins[3]},
    }
    return isolated, metadata


def build_clip(athlete, clip_name, parts):
    if len(parts) != POSE_COUNTS[clip_name]:
        raise ValueError(f'{clip_name}: expected {POSE_COUNTS[clip_name]} authored frames, found {len(parts)}')
    frames = []
    for part in parts:
        image, source = authored_cell(part)
        frames.append({'image': image, 'source': source})

    hashes = [hashlib.sha256(frame['image'].tobytes()).hexdigest() for frame in frames]
    if len(set(hashes)) != len(hashes):
        raise ValueError(clip_name + ': duplicate decoded source poses')

    scales = [min(TARGET_HEIGHT / frame['image'].height, MAX_SPRITE_WIDTH / frame['image'].width) for frame in frames]
    widths = [round(frame['image'].width * scale) for frame, scale in zip(frames, scales)]
    cell_width = max(64, math.ceil((max(widths) + 12) / 16) * 16)
    if cell_width > MAX_CELL_WIDTH:
        raise ValueError(f'{clip_name}: atlas cell width exceeds {MAX_CELL_WIDTH}px')
    columns = math.ceil(math.sqrt(len(frames)))
    rows = math.ceil(len(frames) / columns)
    atlas = Image.new('RGBA', (columns * cell_width, rows * CELL_HEIGHT), (0, 0, 0, 0))
    packed = []
    for index, (frame, scale) in enumerate(zip(frames, scales)):
        crop = frame['image']
        width = max(1, round(crop.width * scale))
        height = max(1, round(crop.height * scale))
        resized = crop.resize((width, height), Image.Resampling.LANCZOS)
        cell_x, cell_y = index % columns * cell_width, index // columns * CELL_HEIGHT
        x, y = cell_x + (cell_width - width) // 2, cell_y + BASELINE - height
        atlas.alpha_composite(resized, (x, y))
        packed.append({
            'x': cell_x, 'y': cell_y, 'w': cell_width, 'h': CELL_HEIGHT,
            **frame['source'],
            'frameScale': scale,
            'pixelSha256': hashlib.sha256(resized.tobytes()).hexdigest(),
        })

    path = ROOT / f'public/assets/animation/{athlete}-{clip_name}-right.webp'
    if path.exists():
        raise FileExistsError(str(path))
    path.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(path, 'WEBP', quality=92, method=6, exact=True)
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
            'canonicalSection': 'K.29',
            'direction': 'right',
            'generatedAt': max(part['generatedAt'] for part in packed),
            'prompt': 'tools/generate-art/6foot10-prompts.md',
            'path': 'tools/generate-art/6foot10-locomotion-sources.json',
            'sourceParts': packed,
            'targetPoseHeight': TARGET_HEIGHT,
            'maxSpriteWidth': MAX_SPRITE_WIDTH,
            'cellHeight': CELL_HEIGHT,
            'baseline': BASELINE,
            'packing': 'Isolate one visually reviewed complete orc silhouette per source cell; uniform per-pose fit within 72px height and 224px width; retain transparent margins; no synthesized or mirrored poses.',
            'sourceHashes': sorted({part['sourceSha256'] for part in packed}),
            'eligibleForPacking': True,
            'mirrorSafe': True,
            'review': {'status': 'pending', 'source': 'Awaiting final atlas and native gameplay review.'},
        },
    }


def main():
    spec = json.loads(SPEC.read_text())
    layouts = []
    for clip_name in POSE_COUNTS:
        frames = build_clip(spec['athlete'], clip_name, spec['clips'][clip_name])
        layouts.append(frames)
        print(f"{clip_name}: {len(frames['frames'])} isolated, distinct imagegen poses")
    if sum(len(entry['frames']) for entry in layouts) != 42:
        raise ValueError('Expected 42 individually sourced drawings')
    OUTPUT.write_text(json.dumps(layouts, indent=2) + '\n')
    print('Packed 42 authored poses into ' + str(OUTPUT))


if __name__ == '__main__':
    main()
