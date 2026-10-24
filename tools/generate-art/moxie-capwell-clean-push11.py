"""Remove the smooth generated backdrop while retaining Moxie's crisp sprite edges."""
from pathlib import Path
import sys
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

source = Path(sys.argv[1])
output = Path(sys.argv[2])
image = np.asarray(Image.open(source).convert("RGBA")).copy()
rgb = image[:, :, :3].astype(np.float32)
background = np.stack([gaussian_filter(rgb[:, :, channel], sigma=38, mode="nearest") for channel in range(3)], axis=2)
contrast = np.linalg.norm(rgb - background, axis=2)
# The source's painted backdrop is smooth and has low local contrast. Figure edges
# and interior details have stronger contrast; fade the transition to avoid halos.
keep = np.clip((contrast - 21.0) / 21.0, 0.0, 1.0)
image[:, :, 3] = np.rint(image[:, :, 3].astype(np.float32) * keep).astype(np.uint8)
output.parent.mkdir(parents=True, exist_ok=True)
Image.fromarray(image, mode="RGBA").save(output)
print(f"Cleaned backdrop: {output}")
