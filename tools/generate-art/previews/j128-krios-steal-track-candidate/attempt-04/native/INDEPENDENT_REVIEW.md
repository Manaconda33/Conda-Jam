# Independent Jam Stage review — J.128 Krios `steal`, attempt04

**Disposition: clears candidate-injection gameplay and visual review for production registration trials. This is not registered-runtime acceptance.**

The report and all 36 captures were reviewed. It uses the current Jam Stage court geometry (Scoria Rams vs Blackthorn Court Kings), courtY=90, with both facings at 100% and 120%. All 32 pose-sequence captures select the candidate atlas; frame starts map to ticks `[1,3,4,5,7,9,11,13]` and frames 0–7, with matching flip flags in the mirrored runs. No browser errors were recorded.

Four additional successful-contact captures show a real defensive steal input at frame3/tick5. Krios's separate ball is then loose with no owner, Krios and Leo have both lost possession, and the game increments Krios's steal count. The ball appears at Krios's empty image-right hook in right-facing runs and at the mirrored image-left hook in left-facing runs, consistent at both zooms. The published track candidate is H `[1.0,0.9,0.75,0.5,0.6,0.9,1.05,1.0]`, F `[6,8,10,8,10,8,8,7]`.

The candidate atlas remains ball-free. Its Krios identity, red skin, curled dark horns, beard, charcoal/ember/gold uniform, and complete anatomy read clearly across the pose sequence. At contact Leo naturally overlaps part of Krios's head/upper torso because the players are contesting the ball. This does not materially obscure the frame3 hook hand or ball: the contact point remains visible in both facings, including the 120% crops. Neither screenshot shows an anatomy-breaking overlap or a ball baked into the sprite.

The showcase runs keep Leo outside stealing reach so all poses can be inspected; the separate successful-contact runs use a real in-range holder and deterministic seed with no per-tick ball teleporting. Since the atlas and track are still candidate-injected, final acceptance requires the same contact and selector review against the registered public manifest and core track.
