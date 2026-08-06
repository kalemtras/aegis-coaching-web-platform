import {
  athlete,
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


export function createProjection(goal:any): Projection {

 return projectRace(
  {
    ftp: athlete.ftp,
    swimCss: athlete.swimCss,
    runThresholdPaceSecPerKm:
      athlete.thresholdPaceSecPerKm,
    vo2max: athlete.vo2max
  },

  goal.distance ?? 'olympic',

  parseTime(goal.targetTime)
 )

}