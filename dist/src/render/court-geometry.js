/** Abstract flight height is compressed above the rim so the ball stays readable. */
export function ballElevation(z){const height=Math.max(0,Number(z)||0);return height<=3?height*28:84+(height-3)*3;}
export function ballHeightPixels(ball,owner){const attached=owner&&(ball.mode==='carried'||ball.mode==='pass'&&ball.aerialTargetId===owner.id);return attached?owner.z*7+ballElevation(ball.z-owner.z):ballElevation(ball.z);}

/** Court plan and ball share the same hoop scoring plane. World court is 200x100. */
export function courtMarkings(court){
  const radius=court.arc??50.5,cornerY=court.cornerY??6.4,dy=50-cornerY,angle=Math.asin(dy/radius),cornerOffset=Math.sqrt(radius*radius-dy*dy);
  const ends=(court.hoops??[8,192]).map(hoop=>{
    const left=hoop<100,direction=left?1:-1,baseline=left?0:200,keyEnd=left?40:160,cornerX=hoop+direction*cornerOffset;
    return {hoop:[hoop,50],baseline,direction,board:[left?4:196,50],rimHeight:ballElevation(2.6),key:[[baseline,33],[keyEnd,33],[keyEnd,67],[baseline,67]],
      freeThrow:{center:[keyEnd,50],radius:12.77,start:left?-Math.PI/2:Math.PI/2,end:left?Math.PI/2:Math.PI*1.5},
      threePoint:{center:[hoop,50],radius,start:left?-angle:Math.PI-angle,end:left?angle:Math.PI+angle,corners:[[[baseline,cornerY],[cornerX,cornerY]],[[baseline,100-cornerY],[cornerX,100-cornerY]]]}};
  });
  return {center:{position:[100,50],radius:12.77},ends};
}
