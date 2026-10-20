import { teams, validateLeague } from '../src/content/teams.js';
const result=validateLeague(teams);
if(result.errors.length){console.error(result);process.exitCode=1;}else console.log(`PASS ${result.teams} franchises, ${result.athletes} unique athletes, ${result.captains} canonical captains`);
