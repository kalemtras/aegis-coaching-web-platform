import type { DashboardResponse } from './types'

import { getAthlete } from '@/lib/store'

import {
  currentMetric,
  metrics,
  workouts,
  workoutsForDate,
  todayKey,
  weeklyLoad,
  startOfWeek,
  today,
  addDays,
} from '@/lib/mock-data'

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

    history: metrics.map((m) => ({
      date: m.date,
      ctl: m.ctl,
      atl: m.atl,
      tsb: m.tsb,
      tss: m.tss,
    })),
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
    today: workoutsForDate(todayKey),

    week: workouts.filter((w) => {
      const ws = startOfWeek(today)
      const start = ws.toISOString().slice(0, 10)
      const end = addDays(ws, 6).toISOString().slice(0, 10)

      return (
        w.date >= start &&
        w.date <= end &&
        w.sport !== 'rest'
      )
    }),
  },

  weeklyLoad,
}

}