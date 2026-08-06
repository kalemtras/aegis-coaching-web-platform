import type { DashboardResponse } from './types'
import { getAthlete } from '@/lib/store'
import { currentMetric } from '@/lib/mock-data'

export async function getDashboard(): Promise<DashboardResponse> {
  const athlete = getAthlete()

  return {
    athlete: {
      name: athlete?.name ?? 'Athlete',
    },

    metrics: {
  current: {
    ctl: currentMetric.ctl,
    atl: currentMetric.atl,
    tsb: currentMetric.tsb,
    ramp: 0,
  },

  history: [],
},

    readiness: {
      score: 0,
      message: '',
    },

    race: {
      prediction: '',
      gap: '',
    },

    workouts: {
      today: [],
    },
  }
}