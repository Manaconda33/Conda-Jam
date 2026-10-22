# J.32–J.35 supporting-athlete reference cells

Prepared 2026-10-22 from the current runtime roster and supporting-player atlases. J.31 (cells60–61) remains the next pair to generate and integrate; these eight references prepare the following four pairs without changing production registration.

The portrait and gameplay atlases are 10 columns by7 rows, with150×150 cells. Portrait files are exact cell crops. Gameplay files preserve only the largest in-cell alpha component on the original150×150 transparent canvas; the other source components were excluded whole to avoid nearby-cell artifacts. Every resulting pair was reviewed together in `/tmp/j32-j35-reference-review.png`.

Source atlas SHA-256: portrait `f0954287d784a508d5bacf6d6c1440b6f73909a56756867cdf8c502331260a42`; gameplay `56fcec1639d48a84c38af314e0a31ce416b765cdc949af4c0a29fc08a6b79291`.

| Cell | Athlete / runtime ID | Franchise / palette | Rig and size | Visual identity retained by the references | Gameplay cell components / primary pixels |
|---:|---|---|---|---|---:|
| 62 | Lilt Smile (`lilt-smile`) | Cheshire Hollow Grinners · `#be4bbb / #e5bfd5 / #29a4b4` | human · tall | Warm light skin, dark eyes, abundant bright-magenta curls gathered high with a small warm-colored tie; purple kit with gold edging. | 5 / 10,006 |
| 63 | Violet Wink (`violet-wink`) | Cheshire Hollow Grinners · `#be4bbb / #e5bfd5 / #29a4b4` | athletic-variant · compact | Light warm skin, short dense lavender curls, sharp brows and a compact human silhouette; purple and pink kit with gold accents. | 4 / 7,761 |
| 64 | Fern Howl (`fern-howl`) | Emerald Den Wolves · `#18804e / #39a9a0 / #e2b64e` | human · tall | Fair warm skin, dark eyes, long voluminous teal curls in a high ponytail with a warm tie; emerald/teal kit with gold accents. | 3 / 10,161 |
| 65 | Koa Vale (`koa-vale`) | Emerald Den Wolves · `#18804e / #39a9a0 / #e2b64e` | human · compact | Deep brown skin, dark eyes, close-cropped blue-black curls and the face details shown in the portrait; emerald/teal kit with gold accents. | 6 / 8,159 |
| 66 | Scribble Turner (`scribble-turner`) | Stripewood Longarms · `#252528 / #e27136 / #7767b0` | human · tall | Warm tan skin, dark eyes, very full dark-brown curls, and the portrait's exact mouth/brow details; charcoal kit with orange and purple accents. | 4 / 8,847 |
| 67 | Palette Spry (`palette-spry`) | Stripewood Longarms · `#252528 / #e27136 / #7767b0` | athletic-variant · compact | Fair warm skin, dark eyes, blonde curls in a high ponytail with a warm tie; charcoal/orange kit with purple accents. | 8 / 9,399 |
| 68 | Sage Fletch (`sage-fletch`) | Verdant Reach Archers · `#538b45 / #dfa94c / #58ad76` | human · tall | Warm tan skin, dark eyes, short dense olive-green curls; forest-green kit with gold accents. | 3 / 8,668 |
| 69 | Hazel Bloom (`hazel-bloom`) | Verdant Reach Archers · `#538b45 / #dfa94c / #58ad76` | athletic-variant · compact | Light warm skin, dark eyes, abundant blonde curls gathered high with green/gold headwear; green kit with gold accents. | 5 / 9,304 |

Names and franchise themes do not authorize unreferenced anatomy or props. Keep every athlete human as shown by the runtime `rig`, including the compact `athletic-variant` entries; do not add wolves, elongated arms, bows, arrows or other mascot/fantasy features. Treat the attached portrait and gameplay crop as the final authority for each face, hair, uniform and proportions.

## Extracted references and hashes

| Athlete | Portrait reference SHA-256 | Gameplay reference SHA-256 |
|---|---|---|
| Lilt Smile | `cb151c523f5764dd9ea532bab40837d09c635b1d53734601dd6a507656b511d4` | `296e2d262380e517d478ccc1da27b454dbc764ad5ec6cfe5544eeed398f7c5bb` |
| Violet Wink | `dff69bc3466904b636bd157040d5203b6d03bfcfd07c05fabbe682c5d6162cc8` | `c0b9f8e3813f05bcdeb58c2f5a1009f1901e9ab4e5ba9c4f4b0eded2fdd81977` |
| Fern Howl | `2efe46f1b99481e33802ba72c169e57ee94dd945ecde760d14350bda867c7fd2` | `e28573920cfa3f9b427b84e65f1c616812f057ac03015b43c5369c08c61596c3` |
| Koa Vale | `8e419647680d517731c1389dcdfc5f1fe354997c50dcdcbb911042c31173cfab` | `f35288959f475073baab8e6dcb16bb222904ac87da43fc6fec757fa7e32ff7ae` |
| Scribble Turner | `67b1f4e56be2e823637b5b759b223634e1b5d498c6b77191142cfb68a2446b60` | `2a566a0bdcd653aebae11ab5960b8b70b3416384c2f2cfc99c668fa2e91748de` |
| Palette Spry | `a2e88f301596433419e6f315c44b771693d4e467d4dfe7cf154d7b4cb2d3ad8e` | `2af91978a431dc0f407c6326dc3f4078b3c09ef1254bd17eab20af61f100576e` |
| Sage Fletch | `79761db18ebe4c94486ed9d864a8905ba9acee91eab2a7841ef5ac7bb6f98062` | `446804096728c60925cc5c944e456f97e21870313ab8867adfd49515fb1e78cd` |
| Hazel Bloom | `c4449e81dd081b0bbc20349d7e92c4e316080343281e21bd516885cecf10607b` | `dba3a60da03d2792bb1dbd3bdf8ced210648ee2b6f0075be52b5d90f4df84589` |

All PNG references are in `tools/generate-art/references/` with names `<runtime-id>-portrait-reference.png` and `<runtime-id>-gameplay-reference.png`. No generated locomotion art, atlases or production registrations exist for these eight athletes yet.
