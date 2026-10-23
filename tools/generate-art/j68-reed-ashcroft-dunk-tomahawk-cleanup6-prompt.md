# J.68 source cleanup retry — match Reed's accepted contour treatment

Image 1 is the J.68 tomahawk pose sheet to edit. Image 2 is an accepted Reed animation atlas used only as a reference for the clean dark contour and transparent edge treatment. Do not copy image 2's poses or layout.

On image 1, carefully erase the thin vivid fringe outside each figure's near-black/deep-purple outline, making only those exterior pixels fully transparent alpha zero. Match the clean contour treatment visible on image 2: dark outline as the final visible edge, with transparency immediately outside it. Do not change any pixels inside the dark contour.

Preserve all fifteen J.68 figures exactly: Reed's face, goatee, scalp-attached purple-black braids, natural human anatomy, tomahawk poses, deep-purple/gold uniform, white lower-leg wear, shoes, positions, scale and five-column by three-row order. Change no pose, color, outline, shading or antialiasing inside the silhouettes. Do not redraw, crop, shift or resize; keep image 1's original 1619×971 dimensions and alpha-zero gutters. Return the same transparent RGBA sprite sheet with no bright fringe or glow outside any figure.

Image 1: `tools/generate-art/sources/j68-reed-ashcroft-dunk-tomahawk-attempt1-rejected-red-halo.png`.
Image 2, contour reference only: `tools/generate-art/sources/j67-reed-ashcroft-dunk-36015.png`.
