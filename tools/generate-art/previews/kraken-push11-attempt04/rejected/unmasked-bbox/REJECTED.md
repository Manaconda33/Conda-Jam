# Rejected cleanup candidate: unmasked bounding boxes

The first cleanup candidate preserved every pixel inside each component's rectangular bounds. Visual review showed detached hand/arm fragments from adjacent translucent source regions in the gutters. Do not use this atlas. The next cleanup isolates each connected figure with a one-pixel antialias fringe and remaps fringe RGB from the nearest core pixel; raw generation remains unchanged.
