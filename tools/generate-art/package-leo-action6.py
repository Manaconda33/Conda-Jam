#!/usr/bin/env python3
"""Pack Leo's reviewed six-pose pass sheets through the shared component isolator."""
from __future__ import annotations
import importlib.util
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
PACKER=ROOT/'tools/generate-art/package-action6.py'
spec=importlib.util.spec_from_file_location('action6',PACKER)
action6=importlib.util.module_from_spec(spec);spec.loader.exec_module(action6)
action6.ATHLETES=set(action6.ATHLETES)|{'leo'}
if __name__=='__main__':
    import sys
    if len(sys.argv)!=4:raise SystemExit('Usage: package-leo-action6.py CLIP SOURCE.png PROVENANCE.json')
    clip,source,provenance=sys.argv[1:]

    import json
    if json.loads(Path(provenance).read_text()).get('clip') != clip:raise SystemExit('Clip ID does not match provenance')
    action6.package('leo',Path(source).resolve(),Path(provenance).resolve())
