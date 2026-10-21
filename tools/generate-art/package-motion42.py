"""Pack a reviewed 7x6 motion-reference redraw; never generate missing poses.

Usage: python tools/generate-art/package-motion42.py athlete source.png provenance.json [layout.json] [--isolate-components] [--direction right|left]
Only crops, uniformly downsamples, and pads existing imagegen drawings. Registration
and identity/mirroring approval are separate explicit operations.
"""
import hashlib
import json
import math
from pathlib import Path
import re
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image
from scipy.ndimage import find_objects, label, distance_transform_edt

ROOT = Path(__file__).resolve().parents[2]


def inspect_source(source, count=42, columns=7, isolate=False):
    if count < 1 or columns < 1 or count % columns:
        raise ValueError('The authored source must fill its rectangular grid')
    with Image.open(source) as opened:
        image = opened.copy()
    if image.mode != 'RGBA':
        raise ValueError('Expected an actual RGBA source')
    alpha = np.array(image.getchannel('A'))
    if alpha.min() != 0 or alpha.max() < 240:
        raise ValueError('Source lacks true transparency or opaque character pixels')
    components, _ = label(alpha > 64)
    rects = []
    # Threshold scales with canvas, rather than assuming a fixed generation size.
    minimum = image.width * image.height / count * .025
    for index, slices in enumerate(find_objects(components)):
        if slices is None or (components[slices] == index + 1).sum() < minimum:
            continue
        x, y = slices[1].start, slices[0].start
        right, bottom = slices[1].stop, slices[0].stop
        if x < 2 or y < 2 or right > image.width - 2 or bottom > image.height - 2:
            raise ValueError('A figure touches the image border')
        rects.append(dict(x=x-2, y=y-2, w=right-x+4, h=bottom-y+4, component=index+1))
    if len(rects) != count:
        raise ValueError(f'Expected exactly {count} separate figures; found {len(rects)}')
    # A correct total can still hide a ragged grid (8 figures in one row and6
    # in another). Grouping that source into7s silently shuffles clip boundaries.
    rows = count//columns
    # Imagegen rows need not have identical heights: a block jump can share
    # a baseline with a crouch. Split at the largest gaps between lower edges,
    # rather than imposing equal-height bands on legitimate mixed poses.
    by_bottom = sorted(rects, key=lambda r:r['y']+r['h'])
    breaks = sorted(sorted(range(1,count), key=lambda i:
        by_bottom[i]['y']+by_bottom[i]['h']-by_bottom[i-1]['y']-by_bottom[i-1]['h'],
        reverse=True)[:rows-1])
    edges = [0,*breaks,count]
    bands = [by_bottom[a:b] for a,b in zip(edges,edges[1:])]
    if any(len(band) != columns for band in bands):
        raise ValueError('Source does not have the expected rectangular reading-order grid')
    ordered = []
    for band in bands:
        figures = sorted(band, key=lambda r: r['x'])
        if not isolate and any(a['x'] + a['w'] > b['x'] for a, b in zip(figures, figures[1:])):
            raise ValueError('Neighboring figures overlap horizontally')
        ordered.extend(figures)
    return ordered


def isolated_crops(source, rects):
    """Extract existing disconnected figures without including neighboring pixels.

    No pose pixels are invented: primary alpha components own their nearest
    antialiased edge pixels. This is only for visually reviewed full figures
    whose bounding rectangles overlap. Connected/missing bodies still fail.
    """
    with Image.open(source) as image:
        pixels = np.array(image)
    components, _ = label(pixels[:, :, 3] > 64)
    primary = np.where(np.isin(components, [r['component'] for r in rects]), components, 0)
    nearest = distance_transform_edt(primary == 0, return_distances=False, return_indices=True)
    owners = primary[tuple(nearest)]
    crops = []
    for rect in rects:
        x, y, w, h = (rect[key] for key in ('x', 'y', 'w', 'h'))
        crop = pixels[y:y+h, x:x+w].copy()
        crop[owners[y:y+h, x:x+w] != rect['component']] = 0
        crops.append(Image.fromarray(crop))
    return crops


def package(athlete, source, provenance, layout=None, isolate=False, direction='right'):
    if direction not in ('right', 'left'):
        raise ValueError('Direction must be right or left')
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', athlete):
        raise ValueError('Unsafe athlete ID')
    if provenance.get('eligibleForPacking') is False or provenance.get('review', {}).get('status') == 'rejected':
        raise ValueError('Source was explicitly rejected during visual review')
    if not provenance.get('prompt') or not provenance.get('generatedAt'):
        raise ValueError('Actual imagegen prompt and generation date required')
    sequence = json.loads((Path(layout) if layout else ROOT/'tools/generate-art/references/locomotion42-layout.json').read_text())
    columns = max(p['column'] for p in sequence)+1
    if any(p['row'] != i//columns or p['column'] != i%columns for i, p in enumerate(sequence)):
        raise ValueError('Layout must be in complete rectangular reading order')
    for clip in dict.fromkeys(p['clip'] for p in sequence):
        if [p['frame'] for p in sequence if p['clip'] == clip] != list(range(sum(p['clip'] == clip for p in sequence))):
            raise ValueError('Each clip must have consecutive unique frame indices')
    rects = inspect_source(source, len(sequence), columns, isolate=isolate)
    separated = isolated_crops(source, rects) if isolate else None
    scale = 92/max(r['h'] for r in rects)
    # Widen cells for raised arms, tails, wings and scarves instead of shrinking
    # the whole athlete when switching actions. The renderer respects cell ratio.
    cell_width = max(64, math.ceil((max(r['w'] for r in rects)*scale+4)/16)*16)
    if cell_width > 192:
        raise ValueError('Source proportions require explicit anatomical review')
    # One scale for the entire source preserves relative body proportions and crouches.
    layouts = []
    with tempfile.TemporaryDirectory(prefix='motion42-') as folder:
        for clip in dict.fromkeys(p['clip'] for p in sequence):
            poses = [(i, r) for i, (p, r) in enumerate(zip(sequence, rects)) if p['clip'] == clip]
            cols = math.ceil(math.sqrt(len(poses)))
            rows = math.ceil(len(poses)/cols)
            target = ROOT/'public/assets/animation'/f'{athlete}-{clip}-{direction}.webp'
            if target.exists():
                raise FileExistsError(target)
            frames, crops, filenames = [], [], []
            for k, (source_index, rect) in enumerate(poses):
                crop = f"{rect['w']}x{rect['h']}+{rect['x']}+{rect['y']}"
                filename = str(Path(folder)/f'{clip}-{k}.png')
                if separated:
                    separated_path = Path(folder)/f'isolated-{source_index}.png'
                    separated[source_index].save(separated_path)
                    inputs = [str(separated_path)]
                else:
                    inputs = [str(source), '-gravity', 'NorthWest', '-crop', crop, '+repage']
                subprocess.run(['convert', *inputs,
                    '-filter', 'Lanczos', '-resize', f"{round(rect['w']*scale)}x{round(rect['h']*scale)}!",
                    '-background', 'none', '-gravity', 'South', '-extent', f'{cell_width}x94',
                    '-gravity', 'North', '-extent', f'{cell_width}x96', filename], check=True)
                filenames.append(filename)
                frames.append(dict(x=k%cols*cell_width, y=k//cols*96, w=cell_width, h=96))
                crops.append(dict(sourceIndex=source_index, **rect))
            atlas = str(Path(folder)/f'{clip}.png')
            subprocess.run(['montage', *filenames, '-tile', f'{cols}x{rows}', '-geometry', '+0+0', '-background', 'none', atlas], check=True)
            target.parent.mkdir(parents=True, exist_ok=True)
            subprocess.run(['convert', atlas, '-background', 'black', '-alpha', 'background', '-alpha', 'on',
                '-quality', '88', '-define', 'webp:alpha-quality=100', str(target)], check=True)
            layouts.append(dict(athlete=athlete, direction=direction, clip=clip,
                src='./'+str(target.relative_to(ROOT)), columns=cols, rows=rows, frames=frames,
                provenance={**provenance, 'sourceImage': str(source), 'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
                    'sourceRects': crops, 'uniformScale': scale, 'componentIsolation': isolate,
                    'packaging': f'package-motion42.py; {cell_width}x96 cells; baseline94; WebP88; no generated extra frames'}))
    label_name = 'locomotion' if layout is None else Path(layout).stem
    output = ROOT/'tools/generate-art'/f'{athlete}-{label_name}-layouts.json'
    output.write_text(json.dumps(layouts, indent=2)+'\n')
    return output


if __name__ == '__main__':
    args = sys.argv[1:]
    isolate = '--isolate-components' in args
    args = [arg for arg in args if arg != '--isolate-components']
    direction = 'right'
    if '--direction' in args:
        option = args.index('--direction')
        if option + 1 >= len(args):
            raise ValueError('--direction requires right or left')
        direction = args[option + 1]
        del args[option:option + 2]
    athlete, source_path, provenance_path, *layout = args
    print(package(athlete, Path(source_path).resolve(), json.loads(Path(provenance_path).read_text()), layout[0] if layout else None, isolate=isolate, direction=direction))
