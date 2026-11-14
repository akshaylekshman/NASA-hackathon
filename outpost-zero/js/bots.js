(function(root,factory){const api=factory(typeof require==='function'?require('./sim.js'):root.OZ_SIM,typeof require==='function'?require('./rng.js'):root.OZ_RNG);if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.OZ_BOTS=api;})(typeof window!=='undefined'?window:globalThis,function(SIM,RNG){
'use strict';
const strategies=['Do-Nothing','Random','Solar-Heavy','Battery-First','Shield-First','Greenhouse-First','Balanced','Bury Early','Bury Late'];
function actions(name,s){const turn=s.turn+1,plan=[];if(name==='Do-Nothing')return plan;
 if(name==='Balanced'||name==='Bury Early'||name==='Bury Late'){
   if(s.tier==='Rookie'){if(turn===1)plan.push({type:'bury'},{type:'panel'});if(turn===2)plan.push({type:'battery'},{type:'greenhouse'},{type:'panel'});if(turn===3)plan.push({type:'greenhouse'},{type:'battery'});if(turn===4||turn===5)plan.push({type:'battery'});if(s.scrubberMode!=='eco')plan.push({type:'scrubberMode',mode:'eco'});return plan;}
   if(name==='Balanced'||name==='Bury Early'||name==='Bury Late'){
     if(turn===1){const digs=(s.tier==='Commander'?2:3)-(name==='Bury Early'?1:0);for(let i=0;i<digs;i++)plan.push({type:'excavate'});plan.push({type:'battery'},{type:'panel'});if(name!=='Bury Early')plan.push({type:'panel'});if(name==='Bury Early')plan.push({type:'shield'});}
     if(turn===2){const digs=s.tier==='Commander'?2:3;for(let i=0;i<digs;i++)plan.push({type:'excavate'});plan.push({type:'battery'},{type:'panel'},{type:'panel'});}
     if(turn===3){if(s.tier==='Commander')plan.push({type:'excavate'});plan.push({type:'battery'},{type:'greenhouse'});}
     if(turn===4){if(s.tier==='Commander')plan.push({type:'excavate'});plan.push({type:'greenhouse'});}
     if(s.scrubberMode!=='eco')plan.push({type:'scrubberMode',mode:'eco'});
     const greenhouseMode=turn>=6&&turn<=12?'one':'all';if(s.greenhouseMode!==greenhouseMode)plan.push({type:'greenhouseMode',mode:greenhouseMode});
     plan.push({type:'priority',order:turn>=6&&turn<=12?['oxygen','habitat','scrubbers','recycler','greenhouse']:['oxygen','scrubbers','habitat','recycler','greenhouse']});
     for(const id of s.offline)if(s.reliability[id]!==undefined)plan.push({type:'repair',system:id});
   }
   if(name==='Bury Late'&&turn===8&&s.shield<1)plan.push({type:'shield'});
   return plan;
 }
 if(name==='Random'){
   const rng=RNG.create(RNG.seedNumber(s.seed+'|bot|'+turn));const choices=['battery','greenhouse','panel','shield','scrubber'];const type=choices[Math.floor(rng.next()*choices.length)];plan.push({type});if(turn>=6&&turn<=12)plan.push({type:'scrubberMode',mode:'eco'});return plan;
 }
 if(name==='Solar-Heavy'){if(turn<=5)plan.push({type:'panel'});else plan.push({type:'panel'});}
 if(name==='Battery-First'&&turn<=5)plan.push({type:'battery'});
 if(name==='Shield-First'&&turn<=8&&s.shield<3)plan.push({type:'shield'});
 if(name==='Greenhouse-First'&&turn<=5)plan.push({type:'greenhouse'});
 return plan;
}
function run(seed,tier,name){let s=SIM.create(seed,tier);while(!s.gameOver){let plan=actions(name,s);let out=SIM.step(s,plan);if(out.result.invalid)out=SIM.step(s,[]);s=out.state;}const avg=s.crew.reduce((a,b)=>a+b,0)/4;const goals=Number(s.goals['Night Owl'])+Number(s.goals['Safe Home'])+Number(s.goals.Farmer>=20);let stars=0;if(s.won){stars=s.crew.every(x=>x>0)&&avg>=70&&goals>=2&&s.blackouts===0?3:2;}else if(s.rescueUsed||s.crew.filter(x=>x>0).length>=1)stars=1;return {won:s.won,health:avg,stars,survival:s.crew.filter(x=>x>0).length>=2,s};}
function compare(seed,tier,player){const names=['Bury Early','Bury Late'],rows=names.map(name=>({name,...run(seed,tier,name)}));const p={health:player.crew.reduce((a,b)=>a+b,0)/4,dose:player.dose.reduce((a,b)=>a+b,0)/4,materials:player.materials,shield:player.shield,food:player.food,survival:player.crew.filter(x=>x>0).length>=2,stars:player.won?2:0};const lesson=rows.map(r=>`${r.name}: ${Math.round(r.health-p.health)} health difference, ${Math.round(r.s.food-p.food)} food difference.`).join(' ');return {player:p,rows,lesson};}
return {strategies,actions,run,compare};
});
