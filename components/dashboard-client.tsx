'use client'

import { useEffect, useState } from 'react'
import { athlete as defaultAthlete, type Athlete } from '@/lib/mock-data'
import { getAthlete } from '@/lib/store'

export function DashboardClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [athlete, setAthlete] = useState<Athlete>(defaultAthlete)

  useEffect(() => {
    const stored = getAthlete()

    if (stored) {
      setAthlete(stored)
    }
  }, [])

  return (
    <>
      {children}
    </>
  )
}