#!/usr/bin/env python3
"""Pack Moxie's six reviewed right-facing chest-pass drawings."""
import importlib.util
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('package_action6',ROOT/'tools/generate-art/package-action6.py')
packer=importlib.util.module_from_spec(spec);spec.loader.exec_module(packer)
packer.ATHLETES.add('moxie-capwell')
if __name__=='__main__':
 packer.package('moxie-capwell',ROOT/'tools/generate-art/sources/moxie-capwell-pass6-generated-raw.png',ROOT/'tools/generate-art/moxie-capwell-pass6-provenance.json')
