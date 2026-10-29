"""Remove only low-alpha generated backdrop haze from Krios pass-behind attempt03."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "tools/generate-art/sources/krios-pass-behind6-attempt03-generated-raw.png"
OUTPUT = ROOT / "tools/generate-art/sources/krios-pass-behind6-attempt03-cleanup01.png"
THRESHOLD = 96

image = Image.open(SOURCE).convert("RGBA")
pixels = image.load()
removed = 0
made_opaque = 0
for y in range(image.height):
    for x in range(image.width):
        red, green, blue, alpha = pixels[x, y]
        if alpha < THRESHOLD:
            if alpha:
                removed += 1
            pixels[x, y] = (red, green, blue, 0)
        elif alpha < 255:
            pixels[x, y] = (red, green, blue, 255)
            made_opaque += 1
image.save(OUTPUT)
print({"source": SOURCE.relative_to(ROOT).as_posix(), "output": OUTPUT.relative_to(ROOT).as_posix(),
       "alphaThreshold": THRESHOLD, "removedNonzeroAlphaPixels": removed,
       "madeOpaquePixels": made_opaque})
