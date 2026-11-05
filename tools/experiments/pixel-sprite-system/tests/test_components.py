import hashlib
import json
import sys
from pathlib import Path
import unittest
from PIL import Image,ImageChops
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from modular_sprite import MANACONDA,REED,edited,IDLE,Rig,render,render_parts,atlas
from modular_sprite.components import COMPONENTS

class ComponentPilotTests(unittest.TestCase):
    def test_01_six_unique_idle_frames(self):
        for cfg in [MANACONDA,REED]:
            hashes=[hashlib.sha256(render(cfg,p).tobytes()).hexdigest() for p in IDLE]
            self.assertEqual(len(set(hashes)),6)
            self.assertEqual(atlas(cfg).size,(384,384))

    def test_02_gutters_and_alpha_are_valid(self):
        for recipe in (MANACONDA,REED):
            for i,pose in enumerate(IDLE):
                im=render(recipe,pose)
                self.assertEqual(im.mode,'RGBA');self.assertEqual(im.size,(128,192))
                bounds=im.getchannel('A').getbbox()
                self.assertIsNotNone(bounds)
                left,top,right,bottom=bounds
                self.assertGreaterEqual(min(left,top,128-right,192-bottom),3,
                                         f'{recipe.id}, frame {i}, alpha bounds {bounds}')
                self.assertGreater(sum(1 for px in im.getchannel('A').tobytes() if px>0),2000)

    def test_03_character_signature_components(self):
        a=render_parts(MANACONDA);b=render_parts(REED)
        self.assertEqual(list(a),list(b));self.assertEqual(len(a),19)
        for name in ('glasses','crest_back','crest_front','scarf_back','scarf_knot'):
            self.assertIsNotNone(a[name].getchannel('A').getbbox())
            self.assertIsNone(b[name].getchannel('A').getbbox())
        self.assertIsNotNone(b['hair'].getchannel('A').getbbox())
        self.assertIsNotNone(b['beard'].getchannel('A').getbbox())

    def test_04_edit_locality(self):
        base=render_parts(MANACONDA)
        cases=[('glasses',edited(MANACONDA,glasses_thickness=1)),
               ('crest_front',edited(MANACONDA,blossom_count=11)),
               ('scarf_back',edited(MANACONDA,scarf_length=1.23)),
               ('beard',edited(MANACONDA,beard_fullness=.58))]
        for expected,cfg in cases:
            result=render_parts(cfg)
            changed=[k for k in base if base[k].tobytes()!=result[k].tobytes()]
            self.assertEqual(changed,[expected],f'Unexpected dependent edits for {expected}')
            self.assertNotEqual(render(MANACONDA).tobytes(),render(cfg).tobytes())

    def test_05_named_joints_and_meaningful_pose(self):
        required={'head','neck','scarf_root','temple_back','temple_front','shoulder_rear','shoulder_front',
                  'elbow_rear','elbow_front','wrist_rear','wrist_front','hip','hip_rear','hip_front',
                  'knee_rear','knee_front','ankle_rear','ankle_front'}
        s=Rig(MANACONDA,IDLE[0]);c=Rig(MANACONDA,IDLE[4]);self.assertTrue(required<=s.anchors().keys())
        self.assertEqual(s['ankle_rear'],c['ankle_rear']);self.assertEqual(s['ankle_front'],c['ankle_front'])
        self.assertGreater(c['knee_front'][0]-s['knee_front'][0],3)
        self.assertGreater(c['hip'][1]-s['hip'][1],5)
        self.assertGreater(c['wrist_front'][1]-s['wrist_front'][1],3)

    def test_06_deterministic_regeneration(self):
        for recipe in [MANACONDA,REED]:
            self.assertEqual(render(recipe).tobytes(),render(recipe).tobytes())
            self.assertEqual(atlas(recipe).tobytes(),atlas(recipe).tobytes())

    def test_07_atlas_pixels_are_exactly_composed_layers(self):
        for cfg in [MANACONDA,REED]:
            im=Image.open(ROOT/'outputs'/f'parts-{cfg.id}.png').convert('RGBA')
            self.assertEqual(im.size,(128*19,192*6))
            for i,pose in enumerate(IDLE):
                layers=render_parts(cfg,pose)
                rebuilt=Image.new('RGBA',(128,192),(0,0,0,0))
                for k,name in enumerate(layers):
                    expected=layers[name]
                    actual=im.crop((128*k,192*i,128*(k+1),192*(i+1)))
                    self.assertEqual(actual.tobytes(),expected.tobytes())
                    rebuilt=Image.alpha_composite(rebuilt,actual)
                self.assertEqual(rebuilt.tobytes(),render(cfg,pose).tobytes())

    def test_08_variant_layers_and_serialized_manifest(self):
        m=json.loads((ROOT/'outputs/workbench-manifest.json').read_text())
        self.assertEqual(m['cell'],[128,192]);self.assertEqual(len(m['parts']),19)
        self.assertEqual(len(m['poses']),6);self.assertEqual(len(m['characters']),2)
        self.assertEqual(len(m['characters']['manaconda']['variants']),4)
        sheet=Image.open(ROOT/'outputs/parts-manaconda-variants.png').convert('RGBA')
        self.assertEqual(sheet.size,(128*4,192*6))
        cases=[edited(MANACONDA,glasses_thickness=1),edited(MANACONDA,blossom_count=11),
               edited(MANACONDA,scarf_length=1.23),edited(MANACONDA,beard_fullness=.58)]
        parts=['glasses','crest_front','scarf_back','beard']
        for j,(cfg,key) in enumerate(zip(cases,parts)):
            for i,pose in enumerate(IDLE):
                baked=sheet.crop((128*j,192*i,128*(j+1),192*(i+1)))
                self.assertEqual(baked.tobytes(),render_parts(cfg,pose)[key].tobytes())

if __name__=='__main__':unittest.main()
