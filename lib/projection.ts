import {
 athlete,
 goals,
 todayKey,
 type Goal
} from './mock-data'

import {
  projectRace,
  type Projection
} from './engine/projection-model'


function parseTime(value:string){

 const [
  h,
  m,
  s
 ] = value.split(':').map(Number)

 return (
  (h || 0) * 3600 +
  (m || 0) * 60 +
  (s || 0)
 )

}


/** Convert application athlete into engine format */
function athleteInput(){

 return {

  ftp: athlete.ftp,

  swimCss: athlete.swimCss,

  runThresholdPaceSecPerKm:
   athlete.thresholdPaceSecPerKm,

  vo2max:
   athlete.vo2max

 }

}


/** Primary A-race */
export const primaryGoal:Goal =
 goals.find(
  g =>
   g.priority === 'A'
   &&
   g.distance
 )
 ??
 goals[0]



export const primaryProjection:Projection =
 projectRace(
  athleteInput(),
  primaryGoal.distance ?? 'olympic',
  parseTime(primaryGoal.targetTime)
 )