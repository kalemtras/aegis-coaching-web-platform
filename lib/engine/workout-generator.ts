import type {
 Workout,
 Sport,
 Intensity
} from "../mock-data"


export interface WorkoutRequest {

 sport:Sport

 intensity:Intensity

 duration:number

}


export function generateWorkout(
 request:WorkoutRequest
):Partial<Workout>{


 return {

  id:
   crypto.randomUUID(),

  date:
   new Date()
   .toISOString()
   .slice(0,10),

  sport:
   request.sport,


  title:
   `${request.intensity} ${request.sport} session`,


  focus:
   "Adaptive engine generated workout",


  description:
   "Generated from athlete state and current phase.",


  intensity:
   request.intensity,


  plannedDurationMin:
   request.duration,


  plannedTss:
   Math.round(
    request.duration *
    0.8
   ),


  plannedDistance:0,


  status:"planned",


  zoneMinutes:
   [],


  intervals:
   [],


  rationale:
   "Workout selected according to current adaptation state."

 }

}