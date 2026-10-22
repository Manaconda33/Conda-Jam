"""Pack Dragon Queen's five imagegen locomotion sources into transparent atlases.

The script crops authored cells, normalizes source-sheet scale, and packs existing
pixels only. It does not draw, hold, mirror, interpolate, or synthesize poses.
"""
import hashlib
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import label

ROOT = Path(__file__).resolve().parents[2]
SPEC = ROOT / 'tools/generate-art/dragon-queen-locomotion-sources.json'
OUTPUT = ROOT / 'tools/generate-art/dragon-queen-locomotion-layouts.json'
TARGET_HEIGHT = 80
CELL_HEIGHT = 96
BASELINE = 94
ALPHA_THRESHOLD = 8


def sha256(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def cell_crop(image, source, index):
    columns, rows = source['grid']
    count = source['indices'][1] - source['indices'][0]
    if index < 0 or index >= columns * rows:
        raise ValueError(f"{source['path']}: source cell {index} exceeds {columns}x{rows}")
    column, row = index % columns, index // columns
    x0, x1 = round(column * image.width / columns), round((column + 1) * image.width / columns)
    y0, y1 = round(row * image.height / rows), round((row + 1) * image.height / rows)
    cell = image.crop((x0, y0, x1, y1)).convert('RGBA')
    alpha = np.asarray(cell.getchannel('A'))
    if alpha.min() != 0 or alpha.max() < 240:
        raise ValueError(f"{source['path']} cell {index}: expected genuine RGBA transparency")

    # Retain one visually complete dragon per authored cell. Several tiny
    # disconnected edge pixels are antialiasing or details; every large body
    # component is checked below before the crop is accepted.
    labels, _ = label(alpha > 64)
    sizes = np.bincount(labels.ravel())
    minimum = cell.width * cell.height * 0.005
    large = [label_id for label_id, size in enumerate(sizes) if label_id and size >= minimum]
    if len(large) != 1:
        raise ValueError(f"{source['path']} cell {index}: expected one main dragon, found {len(large)}")

    # Remove only extremely faint pixels from the transparent matte. Preserve
    # all opaque art and normal antialiasing.
    pixels = np.asarray(cell).copy()
    pixels[pixels[:, :, 3] < ALPHA_THRESHOLD] = 0
    cell = Image.fromarray(pixels, 'RGBA')
    bounds = cell.getchannel('A').getbbox()
    if not bounds:
        raise ValueError(f"{source['path']} cell {index}: blank frame")
    x, y, right, bottom = bounds
    rect = {'x': x0 + x, 'y': y0 + y, 'w': right - x, 'h': bottom - y}
    crop = cell.crop(bounds)
    return crop, rect, (x0, y0, x1, y1)


def load_frames(spec, clip, definition):
    frames = []
    # Main source range (run uses only its first nine separated cells).
    source_key = 'run' if clip == 'run' else clip
    source = spec['clips'][source_key]
    path = Path(source['path'])
    image = Image.open(path).convert('RGBA')
    if image.getchannel('A').getextrema()[0] != 0:
        raise ValueError(f'{path}: image lacks transparent RGBA background')
    source_start, source_end = source['indices']
    for index in range(source_start, source_end):
        crop, rect, cell = cell_crop(image, source, index)
        frames.append({
            'image': crop,
            'sourcePath': source['path'],
            'sourceIndex': index,
            'sourceRect': rect,
            'cellRect': list(cell),
            'sourceSha256': sha256(path),
            'generatedAt': source['generatedAt'],
            'prompt': spec['basePrompt'] + '\n' + source['prompt'],
            'preScale': 1.0,
        })

    if clip == 'run':
        source = spec['clips']['run-supplement']
        path = Path(source['path'])
        image = Image.open(path).convert('RGBA')
        if image.getchannel('A').getextrema()[0] != 0:
            raise ValueError(f'{path}: image lacks transparent RGBA background')
        start, end = source['indices']
        # Match the supplement's height to the largest of the nine adjacent
        # run figures before applying the same final packing scale to all 11.
        reference_height = max(frame['image'].height for frame in frames)
        for index in range(start, end):
            crop, rect, cell = cell_crop(image, source, index)
            factor = reference_height / crop.height
            resized = crop.resize((round(crop.width * factor), reference_height), Image.Resampling.LANCZOS)
            frames.append({
                'image': resized,
                'sourcePath': source['path'],
                'sourceIndex': index,
                'sourceRect': rect,
                'cellRect': list(cell),
                'sourceSha256': sha256(path),
                'generatedAt': source['generatedAt'],
                'prompt': spec['basePrompt'] + '\n' + source['prompt'],
                'preScale': factor,
            })
    expected = {'idle': 6, 'idle-ball': 4, 'dribble': 10, 'run': 11, 'dribble-run': 11}[clip]
    if len(frames) != expected:
        raise ValueError(f'{clip}: expected {expected} poses, got {len(frames)}')
    hashes = [hashlib.sha256(frame['image'].tobytes()).hexdigest() for frame in frames]
    if len(set(hashes)) != len(hashes):
        raise ValueError(f'{clip}: duplicate source poses')
    return frames, hashes


def build_clip(athlete, clip, frames):
    max_height = max(frame['image'].height for frame in frames)
    scale = TARGET_HEIGHT / max_height
    widths = [round(frame['image'].width * scale) for frame in frames]
    cell_width = max(64, math.ceil((max(widths) + 12) / 16) * 16)
    if cell_width > 192:
        raise ValueError(f'{clip}: sprite width {cell_width}px exceeds the 192px atlas limit')
    columns = math.ceil(math.sqrt(len(frames)))
    rows = math.ceil(len(frames) / columns)
    atlas = Image.new('RGBA', (columns * cell_width, rows * CELL_HEIGHT), (0, 0, 0, 0))
    packed = []
    for index, frame in enumerate(frames):
        crop = frame['image']
        width, height = max(1, round(crop.width * scale)), max(1, round(crop.height * scale))
        resized = crop.resize((width, height), Image.Resampling.LANCZOS)
        cell_x, cell_y = (index % columns) * cell_width, (index // columns) * CELL_HEIGHT
        x, y = cell_x + (cell_width - width) // 2, cell_y + BASELINE - height
        atlas.alpha_composite(resized, (x, y))
        packed.append({
            'x': cell_x, 'y': cell_y, 'w': cell_width, 'h': CELL_HEIGHT,
            'sourcePath': frame['sourcePath'], 'sourceIndex': frame['sourceIndex'],
            'sourceRect': frame['sourceRect'], 'cellRect': frame['cellRect'],
            'preScale': frame['preScale'], 'uniformScale': scale,
            'sourceSha256': frame['sourceSha256'], 'generatedAt': frame['generatedAt'],
            'pixelSha256': hashlib.sha256(resized.tobytes()).hexdigest(),
        })
    path = ROOT / f'public/assets/animation/{athlete}-{clip}-right.webp'
    if path.exists():
        raise FileExistsError(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(path, 'WEBP', quality=88, method=6, exact=True)
    return {
        'athlete': athlete, 'direction': 'right', 'clip': clip,
        'src': './' + str(path.relative_to(ROOT)),
        'columns': columns, 'rows': rows,
        'frames': [{'x': frame['x'], 'y': frame['y'], 'w': frame['w'], 'h': frame['h']} for frame in packed],
        'provenance': {
            'athlete': athlete, 'canonicalSection': 'K.27', 'direction': 'right',
            'generatedAt': max(frame['generatedAt'] for frame in packed),
            'prompt': 'tools/generate-art/dragon-queen-locomotion-sources.json',
            'path': 'tools/generate-art/dragon-queen-locomotion-sources.json',
            'sourceParts': packed,
            'targetPoseHeight': TARGET_HEIGHT, 'cellHeight': CELL_HEIGHT,
            'baseline': BASELINE,
            'packing': 'Transparent grid-cell extraction; per-source body-size normalization; uniform resize per clip; no synthesized pixels or poses.',
            'sourceHashes': sorted({frame['sourceSha256'] for frame in packed}),
            'eligibleForPacking': True, 'mirrorSafe': True,
            'review': {'status': 'pending', 'source': 'Awaiting packed atlas visual review.'},
        },
    }


def main():
    spec = json.loads(SPEC.read_text())
    for source in [*spec['clips'].values(), *spec.get('rejectedAttempts', [])]:
        source['sha256'] = sha256(source['path'])
    SPEC.write_text(json.dumps(spec, indent=2) + '\n')
    athlete = spec['athlete']
    layouts = []
    total = 0
    for clip in ('idle', 'idle-ball', 'dribble', 'run', 'dribble-run'):
        frames, hashes = load_frames(spec, clip, spec['clips'][clip])
        total += len(frames)
        layouts.append(build_clip(athlete, clip, frames))
        print(f'{clip}: {len(frames)} distinct source poses; {len(hashes)} unique RGBA crops')
    if total != 42:
        raise ValueError(f'Expected 42 authored drawings across clips, got {total}')
    OUTPUT.write_text(json.dumps(layouts, indent=2) + '\n')
    print(f'Packed {total} distinct source poses into {OUTPUT}')


if __name__ == '__main__':
    main()
