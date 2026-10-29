"""Create a component-extracted candidate atlas for Kraken dunk-double attempt04.

The raw sheet's figures cross nominal cell boundaries. This cleanup extracts
the 15 connected figures, keeps their row-major pose order, applies one shared
palette and uniform nearest-neighbor scale, and packs them into transparent
80x96 cells. It does not redraw or invent poses.
"""
from pathlib import Path
from PIL import Image
import hashlib
import json

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / 'tools/generate-art/sources/kraken-dunk-double-attempt04-generated-raw.png'
OUT = ROOT / 'tools/generate-art/previews/kraken-dunk-double-attempt04/cleanup01'
OUT.mkdir(parents=True, exist_ok=True)

SOURCE_SHA256 = '8a582d128de208c2dc6fb5b10063e463dd978e6baef9f99d5e04b08cb49a17a4'
raw_bytes = RAW.read_bytes()
raw_sha = hashlib.sha256(raw_bytes).hexdigest()
if raw_sha != SOURCE_SHA256:
    raise SystemExit(f'Raw source hash mismatch: expected {SOURCE_SHA256}, got {raw_sha}')

raw = Image.open(RAW).convert('RGBA')
width, height = raw.size
alpha = raw.getchannel('A')
alpha_threshold = 64
binary = alpha.point(lambda a: 255 if a >= alpha_threshold else 0)
mask = binary.load()
visited = bytearray(width * height)
components = []

# Extract 8-connected alpha silhouettes. Transparent RGB is never considered.
for y in range(height):
    for x in range(width):
        offset = y * width + x
        if not mask[x, y] or visited[offset]:
            continue
        stack = [(x, y)]
        visited[offset] = 1
        x0 = x1 = x
        y0 = y1 = y
        area = 0
        while stack:
            xx, yy = stack.pop()
            area += 1
            x0, x1 = min(x0, xx), max(x1, xx)
            y0, y1 = min(y0, yy), max(y1, yy)
            for ny in range(max(0, yy - 1), min(height, yy + 2)):
                for nx in range(max(0, xx - 1), min(width, xx + 2)):
                    neighbor = ny * width + nx
                    if mask[nx, ny] and not visited[neighbor]:
                        visited[neighbor] = 1
                        stack.append((nx, ny))
        bbox = [x0, y0, x1 + 1, y1 + 1]
        components.append({
            'area': area,
            'bbox': bbox,
            'centroid': [(x0 + x1 + 1) / 2, (y0 + y1 + 1) / 2],
        })

if len(components) != 15:
    raise SystemExit(f'Expected 15 athlete components at alpha threshold {alpha_threshold}; found {len(components)}')

# Source rows are separated by figure centroids, not source cell crops; some
# silhouettes intentionally overlap nominal row boundaries.
rows = [[], [], []]
for component in components:
    row = min(2, int(component['centroid'][1] / (height / 3)))
    rows[row].append(component)
row_counts = [len(row) for row in rows]
if row_counts != [5, 5, 5]:
    raise SystemExit(f'Expected five figures per pose row, found {row_counts}')
ordered = [component for row in rows for component in sorted(row, key=lambda c: c['centroid'][0])]

cell_width, cell_height = 80, 96
baseline_y = 94
safe_side_margin = 4
safe_top_margin = 5
palette_colors = 24
crops = []
for component in ordered:
    x0, y0, x1, y1 = component['bbox']
    crop = raw.crop((x0, y0, x1, y1)).convert('RGB')
    crop.putalpha(binary.crop((x0, y0, x1, y1)))
    crops.append((crop, component))

max_source_width = max(crop.width for crop, _ in crops)
max_source_height = max(crop.height for crop, _ in crops)
uniform_scale = min(
    (cell_width - 2 * safe_side_margin) / max_source_width,
    (baseline_y - safe_top_margin) / max_source_height,
)

scaled = []
for crop, component in crops:
    scaled_width = max(1, round(crop.width * uniform_scale))
    scaled_height = max(1, round(crop.height * uniform_scale))
    color = crop.convert('RGB').resize((scaled_width, scaled_height), Image.Resampling.NEAREST)
    mask = crop.getchannel('A').resize((scaled_width, scaled_height), Image.Resampling.NEAREST)
    scaled.append((Image.merge('RGBA', (*color.split(), mask)), component))

# Derive one palette from visible pixels across all poses, then apply it to
# every pose without dithering so that the uniform colors remain consistent.
visible_pixels = []
for frame, _ in scaled:
    rgb = frame.convert('RGB').load()
    frame_alpha = frame.getchannel('A').load()
    for yy in range(frame.height):
        for xx in range(frame.width):
            if frame_alpha[xx, yy]:
                visible_pixels.append(rgb[xx, yy])
palette_source = Image.new('RGB', (len(visible_pixels), 1))
palette_source.putdata(visible_pixels)
shared_palette = palette_source.quantize(
    colors=palette_colors,
    method=Image.Quantize.MEDIANCUT,
    dither=Image.Dither.NONE,
)

frames = []
for frame, component in scaled:
    quantized = frame.convert('RGB').quantize(
        palette=shared_palette,
        dither=Image.Dither.NONE,
    ).convert('RGB')
    quantized.putalpha(frame.getchannel('A'))
    frames.append((quantized, component))

atlas = Image.new('RGBA', (cell_width * 5, cell_height * 3), (0, 0, 0, 0))
frame_reports = []
normalized_hashes = []
for index, (frame, component) in enumerate(frames):
    column, row = index % 5, index // 5
    x = column * cell_width + (cell_width - frame.width) // 2
    y = row * cell_height + baseline_y - frame.height
    atlas.alpha_composite(frame, (x, y))

    cell = atlas.crop((column * cell_width, row * cell_height,
                       (column + 1) * cell_width, (row + 1) * cell_height))
    bounds = cell.getchannel('A').getbbox()
    if not bounds:
        raise SystemExit(f'Pose {index} became transparent')
    left, top, right, bottom = bounds
    margins = [left, top, cell_width - right, cell_height - bottom]
    if left < safe_side_margin or cell_width - right < safe_side_margin:
        raise SystemExit(f'Pose {index} violates safe horizontal margins: {margins}')
    if top < safe_top_margin or bottom != baseline_y:
        raise SystemExit(f'Pose {index} violates top/baseline margins: bounds={bounds}, margins={margins}')

    # Clear hidden RGB under transparent pixels in normalized frame hashes.
    pixels = bytearray(cell.tobytes())
    for offset in range(0, len(pixels), 4):
        if pixels[offset + 3] == 0:
            pixels[offset:offset + 3] = b'\0\0\0'
    normalized_sha = hashlib.sha256(pixels).hexdigest()
    normalized_hashes.append(normalized_sha)
    frame_reports.append({
        'index': index,
        'sourceRowMajorIndex': index,
        'cell': [column * cell_width, row * cell_height, cell_width, cell_height],
        'sourceComponentBBox': component['bbox'],
        'sourceComponentAreaAtThreshold': component['area'],
        'sourceCentroid': component['centroid'],
        'outputAlphaBounds': list(bounds),
        'marginsLTRB': margins,
        'visibleHeight': bottom - top,
        'baselineY': baseline_y,
        'baselineDelta': 0,
        'normalizedSha256': normalized_sha,
    })

if len(set(normalized_hashes)) != 15:
    raise SystemExit('Expected 15 distinct cleanup frames')

atlas_path = OUT / 'kraken-dunk-double-attempt04-cleanup01-atlas.png'
atlas.save(atlas_path)
for label, background in [('light', (238, 234, 222, 255)), ('dark', (24, 25, 37, 255))]:
    proof = Image.new('RGBA', atlas.size, background)
    proof.alpha_composite(atlas)
    proof.resize((atlas.width * 3, atlas.height * 3), Image.Resampling.NEAREST).save(
        OUT / f'kraken-dunk-double-attempt04-cleanup01-{label}-preview.png'
    )

report = {
    'athlete': 'kraken',
    'clip': 'dunk-double',
    'attempt': 4,
    'cleanup': 'component-extracted cleanup01 candidate',
    'sourceRaw': 'tools/generate-art/sources/kraken-dunk-double-attempt04-generated-raw.png',
    'sourceSha256': raw_sha,
    'generationId': 'exec-082755a3-2ba2-4385-b10c-5cd7664f98f7',
    'promptFile': 'tools/generate-art/kraken-dunk-double-attempt04-imagegen-prompt.txt',
    'cleanupScript': 'tools/generate-art/clean-kraken-dunk-double-attempt04-cleanup01.py',
    'cleanupMethod': (
        'Threshold source alpha at 64; extract all 15 8-connected athlete components; '
        'sort by source centroid into three rows and then by x-centroid; crop each complete '
        'component; apply one 24-color palette derived from all visible poses; resize all '
        'poses with a shared uniform scale and nearest-neighbor sampling; preserve binary '
        'transparent background; center horizontally in transparent cells and align visible '
        'feet to baselineY94. No fixed-cell source cropping, repainting, recoloring, pose edits, '
        'or invented poses.'
    ),
    'sourceGrid': 'Nominal 5x3 source layout; figures cross nominal cell boundaries; component extraction prevents clipping.',
    'threshold': alpha_threshold,
    'componentCount': len(components),
    'discardedComponents': 0,
    'poseCount': len(frames),
    'uniqueFrameCount': len(set(normalized_hashes)),
    'sharedPaletteColors': palette_colors,
    'sourceDimensions': [width, height],
    'outputDimensions': list(atlas.size),
    'cellSize': [cell_width, cell_height],
    'baselineY': baseline_y,
    'safeSideMargin': safe_side_margin,
    'safeTopMargin': safe_top_margin,
    'sharedUniformScale': uniform_scale,
    'sourceAlpha': {
        'min': raw.getchannel('A').getextrema()[0],
        'max': raw.getchannel('A').getextrema()[1],
        'pixelsBelowThreshold': sum(1 for value in raw.getchannel('A').getdata() if value < alpha_threshold),
        'pixelsAtOrAboveThreshold': sum(1 for value in raw.getchannel('A').getdata() if value >= alpha_threshold),
    },
    'normalizedPoseSha256': normalized_hashes,
    'frames': frame_reports,
    'atlas': 'tools/generate-art/previews/kraken-dunk-double-attempt04/cleanup01/kraken-dunk-double-attempt04-cleanup01-atlas.png',
    'lightPreview': 'tools/generate-art/previews/kraken-dunk-double-attempt04/cleanup01/kraken-dunk-double-attempt04-cleanup01-light-preview.png',
    'darkPreview': 'tools/generate-art/previews/kraken-dunk-double-attempt04/cleanup01/kraken-dunk-double-attempt04-cleanup01-dark-preview.png',
    'reviewStatus': 'candidate cleanup only; independent final review pending; no gameplay track or production registration',
}
report['atlasSha256'] = hashlib.sha256(atlas_path.read_bytes()).hexdigest()
(OUT / 'cleanup-layout-report.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({
    'components': len(components),
    'rowCounts': row_counts,
    'scale': uniform_scale,
    'dimensions': atlas.size,
    'paletteColors': palette_colors,
    'uniqueFrames': len(set(normalized_hashes)),
    'atlasSha256': report['atlasSha256'],
    'visibleHeights': [item['visibleHeight'] for item in frame_reports],
    'minimumMargins': [min(item['marginsLTRB'][i] for item in frame_reports) for i in range(4)],
}))
