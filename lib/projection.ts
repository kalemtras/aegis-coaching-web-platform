import { athlete, goals, todayKey, type Goal } from './mock-data'
import { project, type AthleteInput, type Projection } from './engine'

/** Build the engine input from the stored athlete + a triathlon goal */
export function inputFromGoal(goal: Goal): AthleteInput {
  return {
    name: athlete.name,
    age: athlete.age,
    weightKg: athlete.weightKg,
    restingHr: athlete.restingHr,
    vo2max: athlete.vo2max,
    ftp: athlete.ftp,
    swimCss: athlete.swimCss,
    runThresholdPaceSecPerKm: athlete.thresholdPaceSecPerKm,
    raceType: goal.distance ?? 'olympic',
    targetTime: goal.targetTime,
    raceDate: goal.date,
  }
}

/** Primary A-race with an engine distance family */
export const primaryGoal: Goal =
  goals.find((g) => g.priority === 'A' && g.distance) ?? goals[0]

export const primaryProjection: Projection = project(inputFromGoal(primaryGoal), todayKey)
