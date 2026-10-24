#!/usr/bin/env python3
"""Pack Moxie Capwell's ten reviewed right-facing jump-shot poses."""
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PACKER = ROOT / 'tools/generate-art/package-action10.py'
spec = importlib.util.spec_from_file_location('package_action10', PACKER)
package_action10 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(package_action10)
package_action10.ATHLETES.add('moxie-capwell')

if __name__ == '__main__':
    source = ROOT / 'tools/generate-art/sources/moxie-capwell-shoot10-generated-raw.png'
    provenance = ROOT / 'tools/generate-art/moxie-capwell-shoot10-provenance.json'
    package_action10.package('moxie-capwell', source, provenance)
