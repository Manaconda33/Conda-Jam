# Krios rebound attempt03 cleanup trial 02 — rejected and preserved

The green-edge correction used uint8 addition in its mask threshold. It overflowed when red or blue values approached 255 and falsely classified valid red skin as green spill; source pixel (214,222), RGB [251,97,68], was changed to [251,159,68]. The independent cleanup reviewer rejected this output. Preserve its previews and gameplay captures for provenance; cleanup trial03 casts comparisons to int16 before thresholding.
