import {
  raceMeta,
  type RaceType,
} from "../mock-data"


export interface RaceAthleteInput {

  ftp:number

  swimCss:number

  runThresholdPaceSecPerKm:number

  vo2max:number

}


export interface RacePrediction {

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



const intensityFactor = {

 sprint:{
  swim:1.03,
  bike:0.96,
  run:0.99
 },

 olympic:{
  swim:1.06,
  bike:0.90,
  run:1.04
 },

 half:{
  swim:1.12,
  bike:0.81,
  run:1.12
 },

 full:{
  swim:1.20,
  bike:0.70,
  run:1.26
 }

}



const transitionTime = {

 sprint:150,

 olympic:210,

 half:360,

 full:600

}



function predictSwim(
 css:number,
 meters:number,
 race:RaceType
){

 return (
   meters / 100
 ) *
 css *
 intensityFactor[race].swim

}



function predictBike(
 ftp:number,
 meters:number,
 race:RaceType
){

 const power =
  ftp *
  intensityFactor[race].bike


 const k=0.16


 const velocity =
  Math.cbrt(
    power/k
  )


 return meters / velocity

}



function predictRun(
 pace:number,
 meters:number,
 race:RaceType,
 vo2:number
){

 const adjustment =
  1 -
  Math.max(
   -0.03,
   Math.min(
    0.03,
    (vo2-55)*0.0025
   )
  )


 return (
  meters/1000
 ) *
 pace *
 intensityFactor[race].run *
 adjustment

}



export function predictRace(
 athlete:RaceAthleteInput,
 race:RaceType
):RacePrediction{


 const distance =
  raceMeta[race]


 const swim =
  predictSwim(
   athlete.swimCss,
   distance.swim,
   race
  )


 const bike =
  predictBike(
   athlete.ftp,
   distance.bike,
   race
  )


 const run =
  predictRun(
   athlete.runThresholdPaceSecPerKm,
   distance.run,
   race,
   athlete.vo2max
  )


 const transitions =
  transitionTime[race]


 return {

  swim,

  bike,

  run,

  transitions,

  total:
   swim+
   bike+
   run+
   transitions,

   splits:[
    {
      discipline:'swim',
      seconds:swim
    },
    {
      discipline:'bike',
      seconds:bike
    },
    {
      discipline:'run',
      seconds:run
    }
  ]

 }

}