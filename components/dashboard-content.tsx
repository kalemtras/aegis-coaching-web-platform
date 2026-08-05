'use client'

import { useEffect, useState } from 'react'
import { athlete as defaultAthlete, type Athlete } from '@/lib/mock-data'
import { getAthlete } from '@/lib/store'

export function DashboardContent() {
  const [athlete, setAthlete] = useState<Athlete>(defaultAthlete)

  useEffect(() => {
    const stored = getAthlete()

    if (stored) {
      setAthlete(stored)
    }
  }, [])

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-sm text-muted-foreground">
        Active athlete
      </div>

      <div className="mt-1 text-lg font-semibold">
        {athlete.name}
      </div>

      <div className="mt-2 text-sm">
        FTP: {athlete.ftp} W
      </div>

      <div className="text-sm">
        VO₂ max: {athlete.vo2max}
      </div>
    </div>
  )
}