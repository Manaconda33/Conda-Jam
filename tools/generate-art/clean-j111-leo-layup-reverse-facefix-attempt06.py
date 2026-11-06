from PIL import Image

SOURCE = 'tools/generate-art/sources/j111-leo-layup-reverse-attempt06-facefix-atlas.png'
OUTPUT = 'tools/generate-art/sources/j111-leo-layup-reverse-attempt06-facefix-cleanup01-atlas.png'
# These are the only two isolated low-alpha, off-palette pixels independently
# identified in the light/dark and zoom4 proof; do not alter the athlete pixels.
REMOVED = [(87, 152), (135, 109)]  # atlas coordinates for cell-local (7,56) and (55,13)
im = Image.open(SOURCE).convert('RGBA')
for x, y in REMOVED:
    before = im.getpixel((x, y))
    assert before[3] < 16, (x, y, before)
    im.putpixel((x, y), (0, 0, 0, 0))
im.save(OUTPUT)
