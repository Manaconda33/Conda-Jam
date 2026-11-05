"""Declarative character recipes: reusable parts vs per-character identity."""
from dataclasses import dataclass,replace

@dataclass(frozen=True)
class Recipe:
    id: str
    name: str
    rig: str='humanoid-athletic'
    build: str='broad'
    skin: str='#ac704f'
    skin_light: str='#d9a177'
    skin_shadow: str='#79452f'
    hair: str='salt-curls'
    beard: str='full-salt'
    glasses: str='rectangle-blue'
    crest: str='temple-driftwood'
    scarf: str='trailing-indigo'
    jersey: str='standard-arcade'
    jersey_primary: str='#45338e'
    jersey_light: str='#7762bd'
    jersey_dark: str='#251748'
    jersey_trim: str='#d7a84b'
    white_sleeve: bool=True
    tights: str='white'
    shoe: str='purple-gold'
    glasses_thickness: int=2
    crest_length: float=1.0
    blossom_count: int=8
    scarf_length: float=1.0
    beard_fullness: float=1.0
    face_expression: str='focused'

MANACONDA=Recipe(id='manaconda',name='Manaconda')
REED=Recipe(
    id='reed-ashcroft',name='Reed Ashcroft',build='lean',skin='#8b563d',skin_light='#bf8260',skin_shadow='#58372c',
    hair='braids-topknot',beard='short-goatee',glasses='none',crest='none',scarf='none',white_sleeve=False,
    jersey_primary='#46308c',jersey_light='#7960ba',jersey_dark='#2b1b52',jersey_trim='#e4b24f',
    tights='dark',shoe='purple-gold'
)

def edited(recipe,**kwargs):return replace(recipe,**kwargs)
