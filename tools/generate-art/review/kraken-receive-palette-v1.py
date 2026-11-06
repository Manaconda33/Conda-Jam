#!/usr/bin/env python3
"""REVIEW ONLY: harmonize accepted Kraken receive frames 0/1/3, preserving frame 2.

Input is the original published PR6 kraken-receive-right.webp.
No production atlas or manifest is modified, and this is not final art acceptance.
Requires pillow, numpy and opencv-python-headless.
"""
from pathlib import Path
import argparse
import hashlib
import json
import numpy as np
import cv2
from PIL import Image

ORIGINAL_SHA256 = "e6676faa9e2deff7ddbb0d94f87d3d02e54538d8a9802ef2c3e98a8bd53cddbb"
PASS_SHA256 = "dd37b01fcd384ea061b71388e2b40b0fb455e581a769e7cf674ab5e25361f613"
FRAME_SIZE = (80, 96)
REVIEW_FRAMES = (0, 1, 3)

def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def cells(atlas, count):
    for i in range(count):
        x = (i % (atlas.width // 80)) * 80
        y = (i // (atlas.width // 80)) * 96
        yield np.array(atlas.crop((x,y,x+80,y+96)).convert("RGBA"))

def mean_hsv(pixels):
    rgba = np.asarray(pixels, dtype=np.uint8)
    rgb = (rgba[:,:,:3].astype("float32") / 255.0)
    mask = rgba[:,:,3] >= 32
    h = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    return float(np.mean(h[:,:,1][mask])),float(np.mean(h[:,:,2][mask]))

def build(original_path, pass_path, out_dir):
    original_path=Path(original_path)
    pass_path=Path(pass_path)
    out_dir=Path(out_dir)
    if sha256(original_path)!=ORIGINAL_SHA256: raise ValueError("Original Kraken receive SHA mismatch")
    if sha256(pass_path)!=PASS_SHA256: raise ValueError("Original Kraken pass SHA mismatch")
    source=Image.open(original_path).convert("RGBA")
    pass_atlas=Image.open(pass_path).convert("RGBA")
    if source.size!=(160,192) or pass_atlas.size!=(240,192):
        raise ValueError("Atlas geometry differs from reviewed 80x96 cells")
    base=np.array(source,dtype=np.uint8)
    output=base.copy()
    refs=list(cells(pass_atlas,6))
    refs.append(base[96:192,0:80,:].copy())
    visible=np.concatenate([a.reshape(-1,4) for a in refs])
    pixels=visible[visible[:,3]>=32,:3].astype("float32")/255.0
    hsvref=cv2.cvtColor(pixels.reshape((-1,1,3)),cv2.COLOR_RGB2HSV)[:,0,:]
    desired_s=float(np.mean(hsvref[:,1]))
    desired_v=float(np.mean(hsvref[:,2]))
    stats={}
    for i in REVIEW_FRAMES:
        x=(i%2)*80
        y=(i//2)*96
        tile=base[y:y+96,x:x+80,:].copy()
        mask=tile[:,:,3]>=32
        hsv=cv2.cvtColor(tile[:,:,:3].astype("float32")/255.0,cv2.COLOR_RGB2HSV)
        start_s,start_v=mean_hsv(tile)
        scale_s=1.
        for _ in range(35):
            if np.mean(np.minimum(1.,hsv[:,:,1][mask]*scale_s))>=desired_s:break
            scale_s+=.02
        scale_v=1.
        for _ in range(30):
            if np.mean(np.minimum(1.,hsv[:,:,2][mask]*scale_v))>=desired_v:break
            scale_v+=.01
        adjusted=hsv.copy()
        adjusted[:,:,1]=np.minimum(1.,hsv[:,:,1]*scale_s)
        lift=np.clip((hsv[:,:,2]-.16)/.25,0,1)
        adjusted[:,:,2]=np.minimum(1.,hsv[:,:,2]*(1+(scale_v-1)*lift))
        rgb=cv2.cvtColor(adjusted.astype("float32"),cv2.COLOR_HSV2RGB)
        converted=np.concatenate([np.clip(rgb*255,0,255).astype(np.uint8),tile[:,:,3:4]],axis=2)
        converted[tile[:,:,3]==0,:3]=0
        output[y:y+96,x:x+80,:]=converted
        end_s,end_v=mean_hsv(converted)
        stats[str(i)]={"originalSaturation":start_s,"candidateSaturation":end_s,
            "originalBrightness":start_v,"candidateBrightness":end_v,
            "saturationMultiplier":scale_s,"brightnessMultiplier":scale_v}
    if not np.array_equal(base[:,:,3],output[:,:,3]):raise ValueError("Transparency changed")
    if not np.array_equal(base[96:192,0:80,:],output[96:192,0:80,:]):
        raise ValueError("Accepted frame 2 was changed")
    out_dir.mkdir(parents=True,exist_ok=True)
    webp=out_dir/"kraken-receive-palette-v1.webp"
    png=out_dir/"kraken-receive-palette-v1.png"
    Image.fromarray(output,"RGBA").save(webp,lossless=True,quality=100,method=6)
    Image.fromarray(output,"RGBA").save(png)
    if not np.array_equal(np.array(Image.open(webp).convert("RGBA")),output):
        raise ValueError("WebP encode changed image pixels")
    report={"status":"REVIEW ONLY - not an accepted replacement",
      "originalPR6":"55a2ab104d6b108cc08132fddc01b32afb958e75",
      "originalReceiveSHA256":ORIGINAL_SHA256,"passReferenceSHA256":PASS_SHA256,
      "candidateSHA256":sha256(webp),"candidatePNG_SHA256":sha256(png),
      "frames":4,"cellSize":FRAME_SIZE,"modifiedFrames":REVIEW_FRAMES,
      "frame2BitwiseIdentical":True,"allAlphaMasksIdentical":True,
      "ballTrackAndTimingEdited":False,"results":stats,
      "limitation":"Palette only. Original art detail/silhouette differences remain. Gameplay screenshots and independent art signoff required."}
    (out_dir/"validation.json").write_text(json.dumps(report,indent=2)+"\n")
    print(json.dumps(report,indent=2))
    return report

if __name__=="__main__":
    p=argparse.ArgumentParser()
    p.add_argument("--receive",required=True)
    p.add_argument("--pass-atlas",required=True)
    p.add_argument("--out",required=True)
    a=p.parse_args()
    build(a.receive,a.pass_atlas,a.out)
