"""Remove only the connected neutral checkerboard background from Accu push source."""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label
ROOT = Path(__file__).resolve().parents[2]
src = ROOT / "tools/generate-art/sources/accu-push-generated-raw.png"
out = ROOT / "tools/generate-art/sources/accu-push-generated-clean.png"
a = np.asarray(Image.open(src).convert("RGB"))
lo, hi = a.min(axis=2), a.max(axis=2)
neutral = ((hi - lo) <= 20) & (a.mean(axis=2) > 110)
labels, _ = label(neutral)
edge_ids = np.unique(np.concatenate((labels[0], labels[-1], labels[:, 0], labels[:, -1])))
bg = np.isin(labels, edge_ids[edge_ids > 0])
rgba = np.dstack((a, np.where(bg, 0, 255).astype(np.uint8)))
Image.fromarray(rgba, "RGBA").save(out)
print(f"Removed border-connected neutral background: {bg.mean():.1%}; wrote {out.relative_to(ROOT)}")
