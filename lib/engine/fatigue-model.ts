export interface FatigueState {

  ctl:number

  atl:number

}


export function calculateForm(
 state:FatigueState
){

 return {
   tsb:
    state.ctl - state.atl,

   fatigueRatio:
    state.atl /
    Math.max(state.ctl,1)
 }

}