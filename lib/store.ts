import type { Athlete, Goal } from './mock-data'

const ATHLETE_KEY = 'apex-athlete'
const GOALS_KEY = 'apex-goals'

export function saveAthlete(athlete: Athlete) {
  if (typeof window === 'undefined') return

  localStorage.setItem(
    ATHLETE_KEY,
    JSON.stringify(athlete),
  )
}

export function getAthlete(): Athlete | null {
  if (typeof window === 'undefined') return null

  const value = localStorage.getItem(ATHLETE_KEY)

  if (!value) return null

  return JSON.parse(value) as Athlete
}


export function saveGoals(goals: Goal[]) {
  if (typeof window === 'undefined') return

  localStorage.setItem(
    GOALS_KEY,
    JSON.stringify(goals),
  )
}


export function getGoals(): Goal[] {
  if (typeof window === 'undefined') return []

  const value = localStorage.getItem(GOALS_KEY)

  if (!value) return []

  return JSON.parse(value) as Goal[]
}


export function clearStore() {
  if (typeof window === 'undefined') return

  localStorage.removeItem(ATHLETE_KEY)
  localStorage.removeItem(GOALS_KEY)
}