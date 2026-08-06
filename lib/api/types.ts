export interface DashboardResponse {
  athlete: {
    name: string
  }

  metrics: {
    current: {
      ctl: number
      atl: number
      tsb: number
      ramp: number
    }

    history: {
      date: string
      ctl: number
      atl: number
      tsb: number
    }[]
  }

  readiness: {
    score: number
    message: string
  }

  race: {
    prediction: string
    gap: string
  }

  workouts: {
  today: typeof import('@/lib/mock-data').workouts
  week: typeof import('@/lib/mock-data').workouts
}
weeklyLoad: typeof import('@/lib/mock-data').weeklyLoad

}