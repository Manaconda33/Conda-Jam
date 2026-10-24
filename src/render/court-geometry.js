/** Abstract flight height is compressed above the rim so the ball stays readable. */
export function ballElevation(z){const height=Math.max(0,Number(z)||0);return height<=3?height*28:84+(height-3)*3;}
export function ballHeightPixels(ball,owner){const attached=owner&&(ball.mode==='carried'||ball.mode==='pass'&&ball.aerialTargetId===owner.id);return attached?owner.z*7+ballElevation(ball.z-owner.z):ballElevation(ball.z);}

/** Regulation court markings mapped from a 94x50 ft floor to the 200x100 world. */
export function courtMarkings(court={}){
  const minX=court.minX??0,maxX=court.maxX??200,minY=court.minY??0,maxY=court.maxY??100;
  const width=maxX-minX,length=maxY-minY,centerX=(minX+maxX)/2,centerY=(minY+maxY)/2;
  const hoopOffset=court.hoopOffset??(5.25*width/94),boardOffset=court.boardOffset??(4*width/94);
  const keyLength=court.keyLength??(19*width/94),keyHalfWidth=court.keyHalfWidth??(8*length/50);
  const arcX=court.arcX??court.arc??(23.75*width/94),arcY=court.arcY??(23.75*length/50);
  const cornerY=court.cornerY??(3*length/50),freeThrowX=court.freeThrowRadiusX??(6*width/94),freeThrowY=court.freeThrowRadiusY??(6*length/50);
  const centerXRadius=court.centerRadiusX??(6*width/94),centerYRadius=court.centerRadiusY??(6*length/50);
  const hoops=court.hoops??[minX+hoopOffset,maxX-hoopOffset];
  const ends=hoops.map(hoop=>{
    const left=hoop<centerX,direction=left?1:-1,baseline=left?minX:maxX,keyEnd=baseline+direction*keyLength;
    const dy=centerY-cornerY,angle=Math.asin(Math.min(1,dy/arcY));
    const cornerOffset=arcX*Math.sqrt(Math.max(0,1-(dy/arcY)**2));
    const cornerX=hoop+direction*cornerOffset;
    return {hoop:[hoop,centerY],baseline,direction,board:[hoop-direction*(hoopOffset-boardOffset),centerY],rimHeight:ballElevation(2.6),
      key:[[baseline,centerY-keyHalfWidth],[keyEnd,centerY-keyHalfWidth],[keyEnd,centerY+keyHalfWidth],[baseline,centerY+keyHalfWidth]],
      freeThrow:{center:[keyEnd,centerY],radiusX:freeThrowX,radiusY:freeThrowY,start:left?-Math.PI/2:Math.PI/2,end:left?Math.PI/2:Math.PI*1.5},
      threePoint:{center:[hoop,centerY],radiusX:arcX,radiusY:arcY,start:left?-angle:Math.PI-angle,end:left?angle:Math.PI+angle,
        corners:[[[baseline,cornerY],[cornerX,cornerY]],[[baseline,maxY-cornerY],[cornerX,maxY-cornerY]]]}};
  });
  return {center:{position:[centerX,centerY],radiusX:centerXRadius,radiusY:centerYRadius},ends};
}
