import {
  predictRace,
  type RaceAthleteInput
} from "./race-predictor"

import type { RaceType } from "../mock-data"
import { weeksBetween } from "../legacy-engine"

export interface Projection {

  predicted:{
    swim:number
    bike:number
    run:number
    transitions:number
    total:number
    splits:{
      discipline:'swim'|'bike'|'run'
      seconds:number
    }[]
}

  targetSeconds:number

  gapSeconds:number

  achievable:boolean


  breakdown:{
    discipline:'swim'|'bike'|'run'
    seconds:number
    share:number
  }[]

  weeksToRace:number

  requiredWeeklyGainSec:number
}


export function projectRace(
 athlete:RaceAthleteInput,
 raceType:RaceType,
 targetSeconds:number
):Projection {


 const predicted =
   predictRace(
    athlete,
    raceType
   )


 const gapSeconds =
   predicted.total -
   targetSeconds


 return {

 predicted,

 targetSeconds,

 gapSeconds,

 achievable:
  gapSeconds <= 0,

 breakdown:[
  {
   discipline:"swim",
   seconds:Math.max(0,gapSeconds)*0.2,
   share:0.2
  },
  {
   discipline:"bike",
   seconds:Math.max(0,gapSeconds)*0.45,
   share:0.45
  },
  {
   discipline:"run",
   seconds:Math.max(0,gapSeconds)*0.35,
   share:0.35
  }
 ],

 weeksToRace:
  1,

 requiredWeeklyGainSec:
  Math.max(0,gapSeconds)

}

}