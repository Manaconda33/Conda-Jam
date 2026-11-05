"""Shared humanoid anatomy with articulated named joints and six idle keyframes."""
from dataclasses import dataclass
from math import sin,pi

@dataclass(frozen=True)
class Pose:
    name: str
    breathe: int=0
    crouch: int=0
    head: int=0
    shoulder: int=0
    rear_hand: int=0
    front_hand: int=0
    scarf_wave: int=0

IDLE=(
  Pose('idle-alert',0,0,0,0,0,0,0),
  Pose('idle-inhale',-3,-1,-2,-2,-3,-2,1),
  Pose('idle-peak',-4,-2,-2,-3,-4,-3,2),
  Pose('idle-exhale',2,3,1,2,2,2,1),
  Pose('idle-crouch',2,7,2,3,5,4,-2),
  Pose('idle-recover',0,2,0,0,1,0,-1),
)

class Rig:
    def __init__(self,recipe,pose=IDLE[0]):
        self.recipe=recipe;self.pose=pose
        p=pose
        lean=recipe.build=='lean'
        shoulder_half=16 if lean else 21
        x=78
        head_y=41+p.head+p.breathe+p.crouch*.36
        chest_y=84+p.breathe+p.crouch*.70
        hip_y=119+p.crouch*.95
        self.joints={
          'head':(x+2,head_y), 'jaw':(x+7,head_y+16),'neck':(x,head_y+25),
          'temple_back':(x-10,head_y-5),'temple_front':(x+9,head_y-4),
          'scarf_root':(x-1,head_y+26),
          'shoulder_rear':(x-shoulder_half,chest_y-9+p.shoulder),
          'shoulder_front':(x+shoulder_half-4,chest_y-8+p.shoulder),
          'elbow_rear':(x-shoulder_half-9,105+p.crouch*.55),
          'elbow_front':(x+shoulder_half+4,103+p.crouch*.40),
          'wrist_rear':(x-shoulder_half-3,124+p.rear_hand+p.crouch*.35),
          'wrist_front':(x+shoulder_half+3,121+p.front_hand+p.crouch*.45),
          'chest':(x,chest_y),'hip':(x,hip_y),
          'hip_rear':(x-11-p.crouch*.20,hip_y),'hip_front':(x+10+p.crouch*.10,hip_y),
          'knee_rear':(x-17-p.crouch*.65,151+p.crouch*.45),'knee_front':(x+14+p.crouch*.60,150+p.crouch*.45),
          'ankle_rear':(x-19,174),'ankle_front':(x+15,174),
          'heel_rear':(x-27,184),'toe_rear':(x-8,184),
          'heel_front':(x+1,184),'toe_front':(x+29,184),
        }
        self.depth=['scarf_back','crest_back','rear_leg','rear_shoe','front_leg','front_shoe','shorts','rear_arm','torso','front_arm','neck','head','hair','beard','crest_front','glasses','facial_highlights','scarf_knot','uniform_emblem']
    def __getitem__(self,key):return self.joints[key]
    def anchors(self):return dict(self.joints)
