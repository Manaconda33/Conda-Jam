"""Offline source-validation checks; run python -m unittest discover -s tools/generate-art -p 'test_package*.py'."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
import numpy as np

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

    def test_explicitly_rejected_source_cannot_be_repacked(self):
        for review in [{'eligibleForPacking': False}, {'review': {'status': 'rejected'}}]:
            with self.assertRaisesRegex(ValueError, 'rejected'):
                motion.package('manaconda', Path('/unused.png'), {'prompt': 'existing prompt', 'generatedAt': '2026-10-21', **review})

    def test_separate_overlapping_bounds_can_be_isolated_without_neighbor_fragments(self):
        image = Image.new('RGBA', (200, 100))
        draw = ImageDraw.Draw(image)
        draw.rectangle((10, 10, 90, 20), fill=(255, 0, 0, 255))
        draw.rectangle((10, 10, 20, 80), fill=(255, 0, 0, 255))
        draw.rectangle((50, 50, 140, 60), fill=(0, 0, 255, 255))
        draw.rectangle((130, 50, 140, 90), fill=(0, 0, 255, 255))
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'source.png';image.save(path)
            with self.assertRaisesRegex(ValueError, 'overlap'):
                motion.inspect_source(path, 2, 2)
            rects = motion.inspect_source(path, 2, 2, isolate=True)
            crops = motion.isolated_crops(path, rects)
            self.assertEqual(len(crops), 2)
            for index, crop in enumerate(crops):
                pixels = np.array(crop);visible = pixels[:, :, 3] > 0
                expected = (255, 0, 0, 255) if index == 0 else (0, 0, 255, 255)
                self.assertTrue(np.all(pixels[visible] == expected))
            self.assertEqual(sum(np.count_nonzero(np.array(crop)[:, :, 3]) for crop in crops), np.count_nonzero(np.array(image)[:, :, 3]))

    def test_isolation_preserves_low_alpha_edge_color_and_opacity(self):
        image = Image.new('RGBA', (200, 100));draw = ImageDraw.Draw(image)
        draw.rectangle((10, 10, 90, 20), fill=(240, 10, 0, 255))
        draw.rectangle((10, 10, 20, 80), fill=(240, 10, 0, 255))
        draw.rectangle((50, 50, 140, 60), fill=(0, 10, 240, 255))
        draw.rectangle((130, 50, 140, 90), fill=(0, 10, 240, 255))
        image.putpixel((91, 15), (240, 10, 0, 32))
        image.putpixel((49, 55), (0, 10, 240, 16))
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'source.png';image.save(path)
            rects = motion.inspect_source(path, 2, 2, isolate=True)
            crops = motion.isolated_crops(path, rects)
            for index, (x, y, pixel) in enumerate([(91, 15, (240, 10, 0, 32)), (49, 55, (0, 10, 240, 16))]):
                rect = rects[index]
                self.assertEqual(crops[index].getpixel((x-rect['x'], y-rect['y'])), pixel)


if __name__ == '__main__':
    unittest.main()
