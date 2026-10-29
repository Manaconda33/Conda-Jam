"""Remove low-alpha background haze after the localized Krios receive correction."""
from pathlib import Path
from PIL import Image
import hashlib
import json

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "tools/generate-art/sources/krios-receive4-attempt02-composite-raw.png"
OUTPUT = ROOT / "tools/generate-art/sources/krios-receive4-attempt02-cleanup01.png"
THRESHOLD = 96
image = Image.open(SOURCE).convert("RGBA")
pixels = image.load()
removed = made_opaque = 0
for y in range(image.height):
    for x in range(image.width):
        red, green, blue, alpha = pixels[x, y]
        if alpha < THRESHOLD:
            removed += bool(alpha)
            pixels[x, y] = (red, green, blue, 0)
        elif alpha < 255:
            pixels[x, y] = (red, green, blue, 255)
            made_opaque += 1
image.save(OUTPUT)
report = {
    "source": SOURCE.relative_to(ROOT).as_posix(),
    "sourceSha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    "output": OUTPUT.relative_to(ROOT).as_posix(),
    "outputSha256": hashlib.sha256(OUTPUT.read_bytes()).hexdigest(),
    "threshold": THRESHOLD,
    "removedNonzeroAlphaPixels": int(removed),
    "madeOpaquePixels": made_opaque,
    "rgbPreserved": True,
}
(ROOT / "tools/generate-art/krios-receive4-attempt02-cleanup01-report.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report))
