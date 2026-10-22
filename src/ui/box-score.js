export const boxScoreHeader='PLAYER PTS FG 3PT DUNK AST REB STL BLK TO KDN STK';

export function formatBoxScoreRow(player){
 const name=player.name.length>10?`${player.name.slice(0,9)}…`:player.name;
 return `${name.padEnd(10)} ${String(player.points??0).padStart(2)} ${player.fgm??0}/${player.fga??0} ${player.threeMakes??0}/${player.threeAttempts??0}  ${player.dunks||0}   ${player.assists??0}   ${player.rebounds??0}  ${player.steals??0}  ${player.blocks??0}  ${player.turnovers||0}  ${player.knockdowns||0}  ${player.highestStreak||0}`;
}
