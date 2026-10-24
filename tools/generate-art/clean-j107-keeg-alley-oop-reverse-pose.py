#!/usr/bin/env python3
"""Clear only very low alpha on a J.107 isolated source, preserving its raw image."""
import argparse
from pathlib import Path
from PIL import Image
p=argparse.ArgumentParser();p.add_argument('source');p.add_argument('output');args=p.parse_args()
root=Path(__file__).resolve().parents[2]; source=root/args.source; output=root/args.output
im=Image.open(source).convert('RGBA'); r,g,b,a=im.split(); a=a.point(lambda v:v if v>16 else 0)
output.parent.mkdir(parents=True,exist_ok=True);Image.merge('RGBA',(r,g,b,a)).save(output)
print(f'Preserved raw {source.relative_to(root)}; set alpha<=16 to zero in {output.relative_to(root)}')
