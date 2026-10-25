#!/usr/bin/env python3
"""Conservative alpha-only cleanup for isolated J.123 Piper pose sources."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent
for pose in range(5, 10):
    for source in sorted((ROOT / "sources").glob(f"pose-{pose:02d}-attempt*.png")):
        image = Image.open(source).convert("RGBA")
        array = np.asarray(image)
        alpha = array[:, :, 3]
        labels, _ = ndimage.label(alpha > 16)
        sizes = np.bincount(labels.ravel())
        sizes[0] = 0
        keep = labels == int(sizes.argmax())
        support = ndimage.binary_dilation(keep, iterations=1)
        output = array.copy()
        output[:, :, 3] = np.where(support, alpha, 0).astype(np.uint8)
        output[output[:, :, 3] == 0, :3] = 0
        target = ROOT / "cleaned" / f"{source.stem}-main-alpha.png"
        target.parent.mkdir(parents=True, exist_ok=True)
        Image.fromarray(output).save(target)
        for label, background in (("light", (245, 244, 239, 255)), ("dark", (23, 24, 38, 255))):
            preview = Image.new("RGBA", image.size, background)
            preview.alpha_composite(Image.fromarray(output))
            preview.save(ROOT / "proofs" / f"pose-{pose:02d}-{source.stem}-{label}.png")
        box = Image.fromarray(output[:, :, 3]).point(lambda a: 255 if a > 16 else 0).getbbox()
        print(json.dumps({"source": str(source), "cleaned": str(target), "alpha16Bounds": box}))
