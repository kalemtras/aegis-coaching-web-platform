'use client'

import { useEffect, useState } from 'react'
import { getDashboard } from '@/lib/api/dashboard'
import type { Athlete } from '@/lib/mock-data'
import { athlete as defaultAthlete } from '@/lib/mock-data'

export function DashboardClient({
  children,
}: {
  children: (data: {
  athlete: Athlete
  metrics: {
    ctl: number
    atl: number
    tsb: number
    ramp: number
  }
}) => React.ReactNode
}) {
  const [athlete, setAthlete] = useState<Athlete>(defaultAthlete)
  const [metrics, setMetrics] = useState({
  ctl: 0,
  atl: 0,
  tsb: 0,
  ramp: 0,
})

  useEffect(() => {
    async function load() {
      const dashboard = await getDashboard()

      setAthlete({
        ...defaultAthlete,
        name: dashboard.athlete.name,
      })

      setMetrics(dashboard.metrics.current)
    }

    load()
  }, [])

  return (
  <>
    {children({
      athlete,
      metrics,
    })}
  </>
)
}