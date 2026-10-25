#!/usr/bin/env python3
"""Keep each source's largest alpha>16 component and one-pixel antialias halo."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent
for pose in range(5, 10):
    for source in sorted((ROOT / "sources").glob(f"pose-{pose:02d}-attempt*-raw.png")):
        image = Image.open(source).convert("RGBA")
        array = np.asarray(image)
        alpha = array[:, :, 3]
        labels, count = ndimage.label(alpha > 16)
        sizes = np.bincount(labels.ravel())
        sizes[0] = 0
        largest = int(sizes.argmax())
        keep = labels == largest
        support = ndimage.binary_dilation(keep, iterations=1)
        output = array.copy()
        output[:, :, 3] = np.where(support, alpha, 0).astype(np.uint8)
        output[output[:, :, 3] == 0, :3] = 0
        target = ROOT / "cleaned" / f"pose-{pose:02d}-attempt1-main-alpha.png"
        target.parent.mkdir(parents=True, exist_ok=True)
        Image.fromarray(output).save(target)
        for name, background in (("light", (245, 244, 239, 255)), ("dark", (23, 24, 38, 255))):
            preview = Image.new("RGBA", image.size, background)
            preview.alpha_composite(Image.fromarray(output))
            preview.save(ROOT / "proofs" / f"pose-{pose:02d}-{name}.png")
        bbox16 = Image.fromarray(output[:, :, 3]).point(lambda value: 255 if value > 16 else 0).getbbox()
        bbox128 = Image.fromarray(output[:, :, 3]).point(lambda value: 255 if value > 128 else 0).getbbox()
        if bbox16 is None or bbox128 is None:
            raise RuntimeError(f"empty cleaned pose {pose}")
        def margins(bbox):
            return [bbox[0], bbox[1], image.width - bbox[2], image.height - bbox[3]]
        record = {
            "pose": pose,
            "source": str(source.relative_to(ROOT)),
            "sourceSha256": __import__("hashlib").sha256(source.read_bytes()).hexdigest(),
            "rawCanvasPx": list(image.size),
            "alphaComponentCount": count,
            "largestAlpha16ComponentPixels": int(sizes[largest]),
            "cleanupMethod": "Keep largest 8-connected alpha>16 component plus one-pixel dilation halo; alpha only; no redraw.",
            "cleanedSource": str(target.relative_to(ROOT)),
            "cleanedSha256": __import__("hashlib").sha256(target.read_bytes()).hexdigest(),
            "alpha16MarginsLTRBpx": margins(bbox16),
            "alpha128MarginsLTRBpx": margins(bbox128),
        }
        (ROOT / "provenance" / f"pose-{pose:02d}-attempt1-cleanup.json").write_text(json.dumps(record, indent=2) + "\n")
        print(json.dumps(record))
