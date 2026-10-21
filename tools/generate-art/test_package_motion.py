"""Offline source-validation checks; run python -m unittest discover -s tools/generate-art -p 'test_package*.py'."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

from PIL import Image, ImageDraw

spec = importlib.util.spec_from_file_location('motion', Path(__file__).with_name('package-motion42.py'))
motion = importlib.util.module_from_spec(spec)
spec.loader.exec_module(motion)


class SourceValidation(unittest.TestCase):
    def source(self, count=42, mode='RGBA', border=False):
        image = Image.new(mode, (700, 600), (0, 0, 0, 0) if mode == 'RGBA' else (0, 0, 0))
        draw = ImageDraw.Draw(image)
        for index in range(count):
            x, y = index % 7 * 100 + 10, index // 7 * 100 + 10
            if border and index == 0:
                x = 0
            draw.rectangle((x, y, x+60, y+70), fill=(255, 150, 80, 255) if mode == 'RGBA' else (255, 150, 80))
        return image

    def inspect(self, image):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'source.png'
            image.save(path)
            return motion.inspect_source(path)

    def test_exact_grid_has_reading_order(self):
        rects = self.inspect(self.source())
        self.assertEqual(len(rects), 42)
        self.assertEqual((rects[0]['x'], rects[0]['y']), (8, 8))
        self.assertEqual((rects[7]['x'], rects[7]['y']), (8, 108))

    def test_missing_pose_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'found 41'):
            self.inspect(self.source(41))

    def test_clipped_figure_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'border'):
            self.inspect(self.source(border=True))

    def test_opaque_rgb_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'RGBA'):
            self.inspect(self.source(mode='RGB'))

    def test_alpha_without_transparency_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'transparency'):
            self.inspect(Image.new('RGBA', (700, 600), (20, 20, 20, 255)))

    def test_unsafe_identity_is_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Unsafe'):
            motion.package('../escape', Path('/unused.png'), {})


if __name__ == '__main__':
    unittest.main()
