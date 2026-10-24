"""Remove a smooth generated background while preserving crisp Moxie sprite edges."""
from pathlib import Path
import sys
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

source, output = map(Path, sys.argv[1:3])
image = np.asarray(Image.open(source).convert("RGBA")).copy()
rgb = image[:, :, :3].astype(np.float32)
background = np.stack([gaussian_filter(rgb[:, :, c], sigma=38, mode="nearest") for c in range(3)], axis=2)
contrast = np.linalg.norm(rgb - background, axis=2)
keep = np.clip((contrast - 21.0) / 21.0, 0.0, 1.0)
image[:, :, 3] = np.rint(image[:, :, 3].astype(np.float32) * keep).astype(np.uint8)
output.parent.mkdir(parents=True, exist_ok=True)
Image.fromarray(image, mode="RGBA").save(output)
print(f"Cleaned background: {output}")
