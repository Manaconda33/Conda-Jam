#!/usr/bin/env python3
"""Pack Leo's accepted ten-pose shoot, fall, or celebrate sheet."""
from __future__ import annotations
import importlib.util
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[2]
PACKER=ROOT/'tools/generate-art/package-action10.py'
spec=importlib.util.spec_from_file_location('action10',PACKER)
action10=importlib.util.module_from_spec(spec);spec.loader.exec_module(action10)
action10.ATHLETES=set(action10.ATHLETES)|{'leo'}
if __name__=='__main__':
    if len(sys.argv)!=3:raise SystemExit('Usage: package-leo-action10.py SOURCE.png PROVENANCE.json')
    action10.package('leo',Path(sys.argv[1]).resolve(),Path(sys.argv[2]).resolve())
