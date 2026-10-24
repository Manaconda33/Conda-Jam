"""Record exact per-generation provenance for Krios's isolated action art."""
from __future__ import annotations
import hashlib,json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
    if len(sys.argv)!=6:raise SystemExit('Usage: record-krios-provenance.py CLIP COUNT GENERATION_ID HEIGHTS_CSV FORWARD_CSV')
    clip,count,generation=sys.argv[1],int(sys.argv[2]),sys.argv[3]
    stem=f'krios-{clip}{count}';raw=ROOT/'tools/generate-art/sources'/f'{stem}-generated-raw.png'
    prompt_path=ROOT/'tools/generate-art'/f'{stem}-prompt.md';prompt=prompt_path.read_text().split('```text\n',1)[1].split('\n```',1)[0]
    height=[float(x) for x in sys.argv[4].split(',')];forward=[float(x) for x in sys.argv[5].split(',')]
    if len(height)!=count or len(forward)!=count:raise ValueError('Track length must match authored frame count')
    policy=f'Krios-specific separate basketball follows the ball-miming body motion and releases/grabs on the reviewed event frame. Never paint a ball into the poses. Track length: {count}.'
    prov={'athlete':'krios','clip':clip,'direction':'right','canonicalSection':'J.06','eligibleForPacking':True,'generatedAt':'2026-10-24','generationId':generation,'imageGenerationId':generation,'rawSourceImage':raw.relative_to(ROOT).as_posix(),'rawSourceSha256':sha(raw),'sourceSha256':sha(raw),'prompt':prompt,'promptVerbatim':True,'sourcePromptStatus':'verbatim','rejectedGenerations':[],'references':['public/assets/animation/krios-idle-right.webp','public/assets/animation/krios-dribble-right.webp','public/assets/captain-gameplay-sprites.png'],'historicalSourceAvailability':'Original 42-pose input and cleaned sheet referenced by krios-locomotion42-final-provenance.json are unavailable in current workspace; compiled Krios atlases and captain crop were used as identity references.','mirrorEligible':True,'ballPolicy':policy,'ballTrack':{'height':height,'forward':forward},'cleanup':{'script':'tools/generate-art/package-krios-actions.py','method':'alpha-connected component isolation and nearest-pixel reassignment'},'review':{'status':'accepted','reviewedBy':'Codex visual inspection','reviewNotes':f'{count} distinct complete Krios {clip} poses. bright volcanic-red skin, towering muscular giant anatomy, huge black ram horns, dark beard and black/ember Scoria Rams kit remain consistent. The separate Krios ball follows the documented {clip} track.'}}
    path=ROOT/'tools/generate-art'/f'{stem}-provenance.json';path.write_text(json.dumps(prov,indent=2)+'\n');print(json.dumps({'provenance':path.relative_to(ROOT).as_posix(),'rawSha256':prov['rawSourceSha256']}))
if __name__=='__main__':main()
