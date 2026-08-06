'use client'

import { useEffect, useState } from 'react'
import { getAthlete } from '@/lib/store'
import { athlete as defaultAthlete } from '@/lib/mock-data'

export function DashboardGreeting() {
  const [name, setName] = useState(defaultAthlete.name)

  useEffect(() => {
    const stored = getAthlete()

    if (stored?.name) {
      setName(stored.name)
    }
  }, [])

  return <>Good morning, {name.split(' ')[0]}</>
}