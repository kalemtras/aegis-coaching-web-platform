export interface AdaptationInput {
  ctl: number
  atl: number
  recentCompliance: number
  recentRpe: number
}


export interface AdaptationResult {

  recommendation:
    | "increase"
    | "maintain"
    | "reduce"

  loadModifier:number

  reason:string
}


export function calculateAdaptation(
 input:AdaptationInput
):AdaptationResult {


 const form =
   input.ctl - input.atl


 // yüksek yorgunluk
 if(form < -20){

   return {

    recommendation:"reduce",

    loadModifier:0.75,

    reason:
    "High fatigue detected. Recovery prioritized."

   }

 }


 // iyi form + iyi uyum
 if(
   form > 5 &&
   input.recentCompliance > 90 &&
   input.recentRpe < 8
 ){

   return {

    recommendation:"increase",

    loadModifier:1.08,

    reason:
    "Athlete is absorbing load well. Progressive overload applied."

   }

 }


 return {

   recommendation:"maintain",

   loadModifier:1,

   reason:
   "Current training stress is appropriate."

 }

}