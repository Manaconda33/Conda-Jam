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
action_spec = importlib.util.spec_from_file_location('action4', Path(__file__).with_name('package-action4.py'))
action4 = importlib.util.module_from_spec(action_spec)
action_spec.loader.exec_module(action4)
pickup_spec = importlib.util.spec_from_file_location('action5', Path(__file__).with_name('package-action5.py'))
action5 = importlib.util.module_from_spec(pickup_spec)
pickup_spec.loader.exec_module(action5)
steal_spec = importlib.util.spec_from_file_location('action8', Path(__file__).with_name('package-action8.py'))
action8 = importlib.util.module_from_spec(steal_spec)
steal_spec.loader.exec_module(action8)
push_spec = importlib.util.spec_from_file_location('action11', Path(__file__).with_name('package-action11.py'))
action11 = importlib.util.module_from_spec(push_spec)
push_spec.loader.exec_module(action11)
fall_spec = importlib.util.spec_from_file_location('action10', Path(__file__).with_name('package-action10.py'))
action10 = importlib.util.module_from_spec(fall_spec)
fall_spec.loader.exec_module(action10)
lob_spec = importlib.util.spec_from_file_location('action6', Path(__file__).with_name('package-action6.py'))
action6 = importlib.util.module_from_spec(lob_spec)
lob_spec.loader.exec_module(action6)


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


class FourPoseActionPackaging(unittest.TestCase):
    def source(self):
        image=Image.new('RGBA',(800,800),(0,0,0,0));draw=ImageDraw.Draw(image)
        # These diagonal L-shaped figures have intersecting bounding boxes but
        # remain separate alpha components, as happens in Juniper's source.
        draw.rectangle((100,50,120,650),fill=(220,50,80,255))
        draw.rectangle((100,50,500,70),fill=(220,50,80,255))
        draw.rectangle((450,80,650,290),fill=(40,170,220,255))
        draw.rectangle((50,470,90,700),fill=(50,190,100,255))
        draw.rectangle((630,300,650,750),fill=(240,180,40,255))
        draw.rectangle((300,730,650,750),fill=(240,180,40,255))
        image.putpixel((780,780),(255,255,255,255))  # non-body speck is excluded
        return image

    def test_four_original_frames_pack_with_overlapping_bounds_and_drop_tiny_noise(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);source=root/'source.png';self.source().save(source)
            assets=root/'public/assets/animation';assets.mkdir(parents=True)
            layouts=root/'tools/generate-art';layouts.mkdir(parents=True)
            provenance={
                'athlete':'reed-ashcroft','clip':'receive','direction':'right',
                'eligibleForPacking':True,'generatedAt':'2026-10-23T00:00:00Z',
                'prompt':'four separated receive poses','sourceSha256':action4.sha256(source),
                'review':{'status':'accepted'}
            }
            provenance_path=root/'provenance.json';provenance_path.write_text(json.dumps(provenance))
            old_root,old_output=action4.ROOT,action4.OUTPUT_DIR
            action4.ROOT,action4.OUTPUT_DIR=root,assets
            try:
                layout_path=action4.package('reed-ashcroft',source,provenance_path)
            finally:
                action4.ROOT,action4.OUTPUT_DIR=old_root,old_output
            layout=json.loads(layout_path.read_text())[0]
            cell_width=layout['frames'][0]['w']
            self.assertEqual([frame['x'] for frame in layout['frames']],[0,cell_width,0,cell_width])
            self.assertEqual([rect['sourceIndex'] for rect in layout['provenance']['sourceRects']],[0,1,2,3])
            self.assertEqual(len(layout['provenance']['sourceRects']),4)
            atlas=Image.open(assets/'reed-ashcroft-receive-right.webp').convert('RGBA')
            frame_pixels=[atlas.crop((frame['x'],frame['y'],frame['x']+frame['w'],frame['y']+frame['h'])).tobytes() for frame in layout['frames']]
            self.assertEqual(len(set(frame_pixels)),4)
            self.assertEqual(layout['provenance']['componentIsolation'],True)

    def test_block_clip_uses_the_same_four_pose_component_isolator(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);source=root/'source.png';self.source().save(source)
            assets=root/'public/assets/animation';assets.mkdir(parents=True)
            layouts=root/'tools/generate-art';layouts.mkdir(parents=True)
            provenance={
                'athlete':'juniper-vale','clip':'block','direction':'right',
                'eligibleForPacking':True,'generatedAt':'2026-10-23T00:00:00Z',
                'prompt':'four separate human block poses','sourceSha256':action4.sha256(source),
                'review':{'status':'accepted'}
            }
            provenance_path=root/'provenance.json';provenance_path.write_text(json.dumps(provenance))
            old_root,old_output=action4.ROOT,action4.OUTPUT_DIR
            action4.ROOT,action4.OUTPUT_DIR=root,assets
            try:
                layout_path=action4.package('juniper-vale',source,provenance_path)
            finally:
                action4.ROOT,action4.OUTPUT_DIR=old_root,old_output
            layout=json.loads(layout_path.read_text())[0]
            self.assertEqual(layout['clip'],'block')
            self.assertEqual(layout['src'],'./public/assets/animation/juniper-vale-block-right.webp')
            self.assertTrue((assets/'juniper-vale-block-right.webp').is_file())
            self.assertEqual(len(layout['frames']),4)
            self.assertEqual(layout['provenance']['componentIsolation'],True)

    def test_paprika_block_accepts_four_original_fox_frames(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);source=root/'source.png';self.source().save(source)
            assets=root/'public/assets/animation';assets.mkdir(parents=True)
            layouts=root/'tools/generate-art';layouts.mkdir(parents=True)
            provenance={
                'athlete':'paprika','clip':'block','direction':'right',
                'eligibleForPacking':True,'generatedAt':'2026-10-23T06:08:01.686Z',
                'prompt':'four original quadruped fox block poses','promptVerbatim':True,
                'sourceSha256':action4.sha256(source),'review':{'status':'accepted'}
            }
            provenance_path=root/'provenance.json';provenance_path.write_text(json.dumps(provenance))
            old_root,old_output=action4.ROOT,action4.OUTPUT_DIR
            action4.ROOT,action4.OUTPUT_DIR=root,assets
            try:
                layout_path=action4.package('paprika',source,provenance_path)
            finally:
                action4.ROOT,action4.OUTPUT_DIR=old_root,old_output
            layout=json.loads(layout_path.read_text())[0]
            self.assertEqual((layout['athlete'],layout['clip']),('paprika','block'))
            self.assertEqual((layout['columns'],layout['rows'],len(layout['frames'])),(2,2,4))
            self.assertEqual([rect['sourceIndex'] for rect in layout['provenance']['sourceRects']],list(range(4)))
            self.assertTrue(layout['provenance']['componentIsolation'])
            self.assertTrue((assets/'paprika-block-right.webp').is_file())


class FivePoseActionPackaging(unittest.TestCase):
    def test_five_original_pickup_frames_pack_in_three_by_two_order(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);source=root/'source.png'
            image=Image.new('RGBA',(800,800),(0,0,0,0));draw=ImageDraw.Draw(image)
            figures=[
                ((50,30,200,300),(220,50,80,255)),
                ((300,40,450,310),(40,170,220,255)),
                ((550,50,700,320),(50,190,100,255)),
                ((100,470,260,730),(240,180,40,255)),
                ((330,480,500,740),(190,70,210,255)),
            ]
            for rect,color in figures:draw.rectangle(rect,fill=color)
            image.putpixel((780,780),(255,255,255,255))
            image.save(source)
            assets=root/'public/assets/animation';assets.mkdir(parents=True)
            layouts=root/'tools/generate-art';layouts.mkdir(parents=True)
            provenance={
                'athlete':'reed-ashcroft','clip':'pickup','direction':'right',
                'eligibleForPacking':True,'generatedAt':'2026-10-23T00:00:00Z',
                'prompt':'five separated pickup poses','sourceSha256':action5.sha256(source),
                'review':{'status':'accepted'}
            }
            provenance_path=root/'provenance.json';provenance_path.write_text(json.dumps(provenance))
            old_root,old_output=action5.ROOT,action5.OUTPUT_DIR
            action5.ROOT,action5.OUTPUT_DIR=root,assets
            try:
                layout_path=action5.package('reed-ashcroft',source,provenance_path)
            finally:
                action5.ROOT,action5.OUTPUT_DIR=old_root,old_output
            layout=json.loads(layout_path.read_text())[0]
            self.assertEqual((layout['columns'],layout['rows']),(3,2))
            self.assertEqual(len(layout['frames']),5)
            cell_width=layout['frames'][0]['w']
            self.assertEqual([frame['x'] for frame in layout['frames']],[0,cell_width,2*cell_width,0,cell_width])
            self.assertEqual([frame['y'] for frame in layout['frames']],[0,0,0,96,96])
            atlas=Image.open(assets/'reed-ashcroft-pickup-right.webp').convert('RGBA')
            frame_pixels=[atlas.crop((frame['x'],frame['y'],frame['x']+frame['w'],frame['y']+frame['h'])).tobytes() for frame in layout['frames']]
            self.assertEqual(len(set(frame_pixels)),5)

    def test_five_original_rebound_frames_pack_with_the_shared_five_pose_layout(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);source=root/'source.png'
            image=Image.new('RGBA',(800,800),(0,0,0,0));draw=ImageDraw.Draw(image)
            figures=[((50,30,200,300),(220,50,80,255)),((300,40,450,310),(40,170,220,255)),((550,50,700,320),(50,190,100,255)),((100,470,260,730),(240,180,40,255)),((330,480,500,740),(190,70,210,255))]
            for rect,color in figures:draw.rectangle(rect,fill=color)
            image.save(source)
            assets=root/'public/assets/animation';assets.mkdir(parents=True)
            layouts=root/'tools/generate-art';layouts.mkdir(parents=True)
            provenance={
                'athlete':'juniper-vale','clip':'rebound','direction':'right',
                'eligibleForPacking':True,'generatedAt':'2026-10-23T00:00:00Z',
                'prompt':'five separate rebound poses','sourceSha256':action5.sha256(source),
                'review':{'status':'accepted'}
            }
            provenance_path=root/'provenance.json';provenance_path.write_text(json.dumps(provenance))
            old_root,old_output=action5.ROOT,action5.OUTPUT_DIR
            action5.ROOT,action5.OUTPUT_DIR=root,assets
            try:
                layout_path=action5.package('juniper-vale',source,provenance_path)
            finally:
                action5.ROOT,action5.OUTPUT_DIR=old_root,old_output
            layout=json.loads(layout_path.read_text())[0]
            self.assertEqual(layout['clip'],'rebound')
            self.assertEqual(layout['src'],'./public/assets/animation/juniper-vale-rebound-right.webp')
            self.assertEqual((layout['columns'],layout['rows'],len(layout['frames'])),(3,2,5))
            self.assertTrue((assets/'juniper-vale-rebound-right.webp').is_file())
            self.assertTrue(layout['provenance']['componentIsolation'])

    def test_paprika_rebound_accepts_five_original_fox_frames(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);source=root/'source.png'
            image=Image.new('RGBA',(800,800),(0,0,0,0));draw=ImageDraw.Draw(image)
            figures=[((50,30,200,300),(220,50,80,255)),((300,40,450,310),(40,170,220,255)),((550,50,700,320),(50,190,100,255)),((100,470,260,730),(240,180,40,255)),((330,480,500,740),(190,70,210,255))]
            for rect,color in figures:draw.rectangle(rect,fill=color)
            image.save(source);assets=root/'public/assets/animation';assets.mkdir(parents=True)
            (root/'tools/generate-art').mkdir(parents=True)
            provenance={'athlete':'paprika','clip':'rebound','direction':'right','eligibleForPacking':True,'generatedAt':'2026-10-23T06:35:00Z','prompt':'five distinct quadruped fox rebound poses','sourceSha256':action5.sha256(source),'review':{'status':'accepted'}}
            provenance_path=root/'provenance.json';provenance_path.write_text(json.dumps(provenance))
            old_root,old_output=action5.ROOT,action5.OUTPUT_DIR;action5.ROOT,action5.OUTPUT_DIR=root,assets
            try:
                layout_path=action5.package('paprika',source,provenance_path)
            finally:
                action5.ROOT,action5.OUTPUT_DIR=old_root,old_output
            layout=json.loads(layout_path.read_text())[0]
            self.assertEqual((layout['athlete'],layout['clip']),('paprika','rebound'))
            self.assertEqual((layout['columns'],layout['rows'],len(layout['frames'])),(3,2,5))
            self.assertTrue(layout['provenance']['componentIsolation'])
            self.assertTrue((assets/'paprika-rebound-right.webp').is_file())


class ElevenPoseActionPackaging(unittest.TestCase):
    def source(self):
        image=Image.new('RGBA',(1200,900),(0,0,0,0));draw=ImageDraw.Draw(image)
        for index in range(11):
            row,column=divmod(index,4)
            x,y=column*300+45,row*300+35
            draw.rectangle((x,y,x+115,y+245),fill=(40+index*12,80+index*7,190-index*9,255))
        image.putpixel((1190,890),(255,255,255,255))  # ignore noise in the empty twelfth cell
        return image

    def test_eleven_original_push_frames_pack_in_four_by_three_order(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);source=root/'source.png';self.source().save(source)
            assets=root/'public/assets/animation';assets.mkdir(parents=True)
            layouts=root/'tools/generate-art';layouts.mkdir(parents=True)
            provenance={
                'athlete':'reed-ashcroft','clip':'push','direction':'right',
                'eligibleForPacking':True,'generatedAt':'2026-10-23T00:00:00Z',
                'prompt':'eleven separate press and push poses','sourceSha256':action11.sha256(source),
                'review':{'status':'accepted'}
            }
            provenance_path=root/'provenance.json';provenance_path.write_text(json.dumps(provenance))
            old_root,old_output=action11.ROOT,action11.OUTPUT_DIR
            action11.ROOT,action11.OUTPUT_DIR=root,assets
            try:
                layout_path=action11.package('reed-ashcroft',source,provenance_path)
            finally:
                action11.ROOT,action11.OUTPUT_DIR=old_root,old_output
            layout=json.loads(layout_path.read_text())[0]
            self.assertEqual((layout['columns'],layout['rows']),(4,3))
            self.assertEqual(len(layout['frames']),11)
            cell_width=layout['frames'][0]['w']
            self.assertEqual([frame['x'] for frame in layout['frames']],[0,cell_width,2*cell_width,3*cell_width,0,cell_width,2*cell_width,3*cell_width,0,cell_width,2*cell_width])
            self.assertEqual([rect['sourceIndex'] for rect in layout['provenance']['sourceRects']],list(range(11)))
            atlas=Image.open(assets/'reed-ashcroft-push-right.webp').convert('RGBA')
            frame_pixels=[atlas.crop((frame['x'],frame['y'],frame['x']+frame['w'],frame['y']+frame['h'])).tobytes() for frame in layout['frames']]
            self.assertEqual(len(set(frame_pixels)),11)

    def test_eleven_quadruped_paprika_push_frames_are_supported(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);source=root/'source.png';self.source().save(source)
            assets=root/'public/assets/animation';assets.mkdir(parents=True)
            layouts=root/'tools/generate-art';layouts.mkdir(parents=True)
            provenance={
                'athlete':'paprika','clip':'push','direction':'right',
                'eligibleForPacking':True,'generatedAt':'2026-10-23T06:30:00Z',
                'prompt':'eleven distinct quadruped fox push poses','sourceSha256':action11.sha256(source),
                'review':{'status':'accepted'}
            }
            provenance_path=root/'provenance.json';provenance_path.write_text(json.dumps(provenance))
            old_root,old_output=action11.ROOT,action11.OUTPUT_DIR
            action11.ROOT,action11.OUTPUT_DIR=root,assets
            try:
                layout_path=action11.package('paprika',source,provenance_path)
            finally:
                action11.ROOT,action11.OUTPUT_DIR=old_root,old_output
            layout=json.loads(layout_path.read_text())[0]
            self.assertEqual((layout['athlete'],layout['clip']),('paprika','push'))
            self.assertEqual((layout['columns'],layout['rows'],len(layout['frames'])),(4,3,11))
            self.assertTrue(layout['provenance']['componentIsolation'])
            self.assertTrue((assets/'paprika-push-right.webp').is_file())
            self.assertTrue(layout['provenance']['componentIsolation'])

    def test_empty_or_misordered_push_cells_are_rejected(self):
        image=self.source()
        # Move the last body into the otherwise empty twelfth cell.
        pixels=np.asarray(image).copy()
        pixels[600:900,900:1200]=0
        pixels[600:900,600:900]=0
        pixels[640:880,940:1055]=(40,80,190,255)
        with self.assertRaisesRegex(ValueError,'first eleven cells'):
            action11.pose_rectangles(Image.fromarray(pixels,'RGBA'))


class EightPoseActionPackaging(unittest.TestCase):
    def source(self, edge=False):
        image=Image.new('RGBA',(1200,600),(0,0,0,0));draw=ImageDraw.Draw(image)
        for index in range(8):
            column,row=index%4,index//4
            x,y=column*300+80,row*300+60
            draw.rectangle((x,y,x+80+index,y+150),fill=(30+index*25,100+index*10,180-index*12,255))
        if edge:
            draw.rectangle((0,100,100,110),fill=(30,100,180,255))
        return image

    def test_eight_original_action_frames_pack_in_four_by_two_order(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);source=root/'source.png';self.source().save(source)
            assets=root/'public/assets/animation';assets.mkdir(parents=True)
            layouts=root/'tools/generate-art';layouts.mkdir(parents=True)
            provenance={
                'athlete':'reed-ashcroft','clip':'layup','direction':'right',
                'eligibleForPacking':True,'generatedAt':'2026-10-23T00:00:00Z',
                'prompt':'eight separated layup poses','promptVerbatim':False,'sourceSha256':action8.sha256(source),
                'review':{'status':'accepted'}
            }
            provenance_path=root/'provenance.json';provenance_path.write_text(json.dumps(provenance))
            old_root,old_output=action8.ROOT,action8.OUTPUT_DIR
            action8.ROOT,action8.OUTPUT_DIR=root,assets
            try:
                layout_path=action8.package('reed-ashcroft','layup',source,provenance_path)
            finally:
                action8.ROOT,action8.OUTPUT_DIR=old_root,old_output
            layout=json.loads(layout_path.read_text())[0]
            self.assertEqual(layout['clip'],'layup')
            self.assertEqual((layout['columns'],layout['rows']),(4,2))
            self.assertEqual(len(layout['frames']),8)
            cell_width=layout['frames'][0]['w']
            self.assertEqual([frame['x'] for frame in layout['frames']],[0,cell_width,2*cell_width,3*cell_width]*2)
            self.assertEqual([frame['y'] for frame in layout['frames']],[0]*4+[96]*4)
            self.assertEqual([rect['sourceIndex'] for rect in layout['provenance']['sourceRects']],list(range(8)))
            self.assertTrue(layout['provenance']['componentIsolation'])
            atlas=Image.open(assets/'reed-ashcroft-layup-right.webp').convert('RGBA')
            frame_pixels=[atlas.crop((frame['x'],frame['y'],frame['x']+frame['w'],frame['y']+frame['h'])).tobytes() for frame in layout['frames']]
            self.assertEqual(len(set(frame_pixels)),8)

    def test_paprika_layup_accepts_eight_original_fox_frames(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);source=root/'source.png';self.source().save(source)
            assets=root/'public/assets/animation';assets.mkdir(parents=True)
            layouts=root/'tools/generate-art';layouts.mkdir(parents=True)
            provenance={
                'athlete':'paprika','clip':'layup','direction':'right',
                'eligibleForPacking':True,'generatedAt':'2026-10-23T05:50:32.325Z',
                'prompt':'eight distinct four-footed fox layup poses','promptVerbatim':True,
                'sourceSha256':action8.sha256(source),'review':{'status':'accepted'}
            }
            provenance_path=root/'provenance.json';provenance_path.write_text(json.dumps(provenance))
            old_root,old_output=action8.ROOT,action8.OUTPUT_DIR
            action8.ROOT,action8.OUTPUT_DIR=root,assets
            try:
                layout_path=action8.package('paprika','layup',source,provenance_path)
            finally:
                action8.ROOT,action8.OUTPUT_DIR=old_root,old_output
            layout=json.loads(layout_path.read_text())[0]
            self.assertEqual(layout['athlete'],'paprika')
            self.assertEqual(layout['clip'],'layup')
            self.assertEqual((layout['columns'],layout['rows'],len(layout['frames'])),(4,2,8))
            self.assertEqual([rect['sourceIndex'] for rect in layout['provenance']['sourceRects']],list(range(8)))
            self.assertTrue(layout['provenance']['componentIsolation'])
            self.assertTrue((assets/'paprika-layup-right.webp').is_file())

    def test_sheet_edge_touch_is_rejected(self):
        with self.assertRaisesRegex(ValueError,'border'):
            action8.pose_rectangles(self.source(edge=True))

    def test_rejected_eight_pose_source_cannot_be_packed(self):
        provenance={'eligibleForPacking':False,'review':{'status':'rejected'}}
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'rejected.json';path.write_text(json.dumps(provenance))
            with self.assertRaisesRegex(ValueError,'accepted eight-pose sources'):
                action8.package('juniper-vale','steal',Path('/unused.png'),path)


class TenPoseFallPackaging(unittest.TestCase):
    def source(self, edge=False):
        image=Image.new('RGBA',(1600,800),(0,0,0,0));draw=ImageDraw.Draw(image)
        for index in range(10):
            row,column=divmod(index,5)
            x,y=column*320+75,row*400+35
            draw.rectangle((x,y,x+125,y+300),fill=(35+index*17,80+index*7,185-index*11,255))
        for x,y in [(20,20),(1570,770),(650,387),(1300,400)]:
            image.putpixel((x,y),(255,30,20,255))  # detached one-pixel noise is ignored
        if edge:
            draw.rectangle((0,150,80,220),fill=(220,40,70,255))
        return image

    def test_ten_original_fall_frames_pack_in_five_by_two_order(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);source=root/'source.png';self.source().save(source)
            assets=root/'public/assets/animation';assets.mkdir(parents=True)
            layouts=root/'tools/generate-art';layouts.mkdir(parents=True)
            provenance={
                'athlete':'juniper-vale','clip':'fall','direction':'right',
                'eligibleForPacking':True,'generatedAt':'2026-10-23T00:00:00Z',
                'prompt':'ten separate fall and get-up poses','promptVerbatim':False,
                'sourcePromptStatus':'reconstructed','sourceSha256':action10.sha256(source),
                'review':{'status':'accepted'}
            }
            provenance_path=root/'provenance.json';provenance_path.write_text(json.dumps(provenance))
            old_root,old_output=action10.ROOT,action10.OUTPUT_DIR
            action10.ROOT,action10.OUTPUT_DIR=root,assets
            try:
                layout_path=action10.package('juniper-vale',source,provenance_path)
            finally:
                action10.ROOT,action10.OUTPUT_DIR=old_root,old_output
            layout=json.loads(layout_path.read_text())[0]
            self.assertEqual(layout['clip'],'fall')
            self.assertEqual((layout['columns'],layout['rows'],len(layout['frames'])),(5,2,10))
            cell_width=layout['frames'][0]['w']
            self.assertEqual([frame['x'] for frame in layout['frames']],[i*cell_width for i in range(5)]*2)
            self.assertEqual([frame['y'] for frame in layout['frames']],[0]*5+[96]*5)
            self.assertEqual([rect['sourceIndex'] for rect in layout['provenance']['sourceRects']],list(range(10)))
            self.assertTrue(layout['provenance']['componentIsolation'])
            atlas=Image.open(assets/'juniper-vale-fall-right.webp').convert('RGBA')
            frame_pixels=[atlas.crop((frame['x'],frame['y'],frame['x']+frame['w'],frame['y']+frame['h'])).tobytes() for frame in layout['frames']]
            self.assertEqual(len(set(frame_pixels)),10)

    def test_incomplete_or_clipped_ten_pose_sheet_is_rejected(self):
        missing=self.source()
        pixels=np.asarray(missing).copy();pixels[0:400,0:320]=0
        with self.assertRaisesRegex(ValueError,'found 9'):
            action10.pose_rectangles(Image.fromarray(pixels,'RGBA'))
        with self.assertRaisesRegex(ValueError,'border'):
            action10.pose_rectangles(self.source(edge=True))

    def test_ten_original_celebration_frames_keep_clip_identity_and_noise_isolation(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);source=root/'source.png';self.source().save(source)
            assets=root/'public/assets/animation';assets.mkdir(parents=True)
            layouts=root/'tools/generate-art';layouts.mkdir(parents=True)
            provenance={
                'athlete':'reed-ashcroft','clip':'celebrate','direction':'right',
                'eligibleForPacking':True,'generatedAt':'2026-10-23T00:00:00Z',
                'prompt':'ten separate celebration poses','promptVerbatim':True,
                'sourcePromptStatus':'verbatim','sourceSha256':action10.sha256(source),
                'review':{'status':'accepted'}
            }
            provenance_path=root/'provenance.json';provenance_path.write_text(json.dumps(provenance))
            old_root,old_output=action10.ROOT,action10.OUTPUT_DIR
            action10.ROOT,action10.OUTPUT_DIR=root,assets
            try:
                layout_path=action10.package('reed-ashcroft',source,provenance_path)
            finally:
                action10.ROOT,action10.OUTPUT_DIR=old_root,old_output
            layout=json.loads(layout_path.read_text())[0]
            self.assertEqual(layout['clip'],'celebrate')
            self.assertEqual(layout['src'],'./public/assets/animation/reed-ashcroft-celebrate-right.webp')
            self.assertEqual(len(layout['frames']),10)
            self.assertTrue((assets/'reed-ashcroft-celebrate-right.webp').is_file())


class SixPoseLobPackaging(unittest.TestCase):
    def source(self, missing=False, edge=False):
        image=Image.new('RGBA',(900,600),(0,0,0,0));draw=ImageDraw.Draw(image)
        for index in range(6):
            if missing and index==5:
                continue
            row,column=divmod(index,3)
            x,y=column*300+20,row*300+20
            if edge and index==0:
                x=0
            color=(30+index*30,80+index*20,190-index*20,255)
            draw.rectangle((x,y,x+100,y+130),fill=color)
            draw.rectangle((x+40,y+30,x+120,y+50),fill=color)
        return image

    def test_six_original_fox_pass_frames_pack_in_three_by_two_order(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);source=root/'source.png';self.source().save(source)
            assets=root/'public/assets/animation';assets.mkdir(parents=True)
            layouts=root/'tools/generate-art';layouts.mkdir(parents=True)
            provenance={
                'athlete':'paprika','clip':'pass-overhead','direction':'right',
                'eligibleForPacking':True,'generatedAt':'2026-10-23T00:00:00Z',
                'prompt':'six separated quadruped fox lob poses','promptVerbatim':True,
                'sourceSha256':action6.sha256(source),'review':{'status':'accepted'}
            }
            provenance_path=root/'provenance.json';provenance_path.write_text(json.dumps(provenance))
            old_root,old_output=action6.ROOT,action6.OUTPUT_DIR
            action6.ROOT,action6.OUTPUT_DIR=root,assets
            try:
                layout_path=action6.package('paprika',source,provenance_path)
            finally:
                action6.ROOT,action6.OUTPUT_DIR=old_root,old_output
            layout=json.loads(layout_path.read_text())[0]
            self.assertEqual(layout['clip'],'pass-overhead')
            self.assertEqual((layout['columns'],layout['rows'],len(layout['frames'])),(3,2,6))
            cell_width=layout['frames'][0]['w']
            self.assertEqual([frame['x'] for frame in layout['frames']],[0,cell_width,2*cell_width]*2)
            self.assertEqual([frame['y'] for frame in layout['frames']],[0]*3+[96]*3)
            self.assertEqual([rect['sourceIndex'] for rect in layout['provenance']['sourceRects']],list(range(6)))
            self.assertTrue(layout['provenance']['componentIsolation'])
            atlas=Image.open(assets/'paprika-pass-overhead-right.webp').convert('RGBA')
            frame_pixels=[atlas.crop((frame['x'],frame['y'],frame['x']+frame['w'],frame['y']+frame['h'])).tobytes() for frame in layout['frames']]
            self.assertEqual(len(set(frame_pixels)),6)

    def test_six_pose_packer_rejects_missing_or_clipped_foxes(self):
        with self.assertRaisesRegex(ValueError,'found 5'):
            action6.pose_rectangles(self.source(missing=True))
        with self.assertRaisesRegex(ValueError,'border'):
            action6.pose_rectangles(self.source(edge=True))

    def test_rejected_or_wrong_identity_six_pose_sources_cannot_be_packed(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);source=root/'source.png';self.source().save(source)
            provenance_path=root/'rejected.json'
            provenance_path.write_text(json.dumps({
                'athlete':'paprika','clip':'pass-overhead','direction':'right',
                'eligibleForPacking':False,'generatedAt':'2026-10-23T00:00:00Z',
                'prompt':'rejected source','sourceSha256':action6.sha256(source),
                'review':{'status':'rejected'}
            }))
            with self.assertRaisesRegex(ValueError,'accepted'):
                action6.package('paprika',source,provenance_path)
            with self.assertRaisesRegex(ValueError,'only accepts Paprika'):
                action6.package('reed-ashcroft',source,provenance_path)


if __name__ == '__main__':
    unittest.main()
