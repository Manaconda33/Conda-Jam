"""Offline source-validation checks; run python -m unittest discover -s tools/generate-art -p 'test_package*.py'."""
import importlib.util
import json
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

    def test_correct_total_with_ragged_rows_is_rejected(self):
        image = Image.new('RGBA', (700, 600))
        draw = ImageDraw.Draw(image)
        for row, count in enumerate([8, 7, 7, 7, 7, 6]):
            for column in range(count):
                x, y = column*85+5, row*100+10
                draw.rectangle((x,y,x+50,y+70),fill=(255,150,80,255))
        with self.assertRaisesRegex(ValueError,'rectangular'):
            self.inspect(image)

    def test_different_row_heights_and_jump_crouch_pairs_keep_reading_order(self):
        image=Image.new('RGBA',(300,300));draw=ImageDraw.Draw(image)
        for row in range(3):
            for column in range(4):
                top,bottom=((10 if column%2 else 120),160) if row==0 else ((180,230) if row==1 else (250,290))
                x=column*75+10
                draw.rectangle((x,top,x+40,bottom),fill=(255,150,80,255))
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'source.png';image.save(path)
            rects=motion.inspect_source(path,12,4,True)
            self.assertEqual([r['x'] for r in rects[:4]],[8,83,158,233])

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


    def test_package_honors_requested_left_facing_direction(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root/'public/assets/animation').mkdir(parents=True)
            (root/'tools/generate-art').mkdir(parents=True)
            source = root/'source.png'
            self.source().save(source)
            sequence = json.loads((motion.ROOT/'tools/generate-art/references/locomotion42-layout.json').read_text())
            layout = root/'input-layout.json'
            layout.write_text(json.dumps(sequence))
            old_root = motion.ROOT
            motion.ROOT = root
            try:
                output = motion.package('test-athlete', source, {'prompt':'left-facing test source', 'generatedAt':'2026-10-21'}, layout=layout, direction='left')
            finally:
                motion.ROOT = old_root
            entries = json.loads(output.read_text())
            self.assertEqual(len(entries), 5)
            self.assertTrue(all(entry['direction'] == 'left' for entry in entries))
            self.assertTrue(all(entry['src'].endswith('-left.webp') for entry in entries))
            self.assertTrue(all((root/entry['src']).is_file() for entry in entries))


if __name__ == '__main__':
    unittest.main()
