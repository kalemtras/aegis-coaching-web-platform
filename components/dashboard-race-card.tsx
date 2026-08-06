'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Flag, ArrowUpRight } from 'lucide-react'

import { Card, CardHeader } from '@/components/kit'
import { getGoals } from '@/lib/store'
import type { Goal } from '@/lib/mock-data'

function daysUntil(dateKey: string) {
  return Math.round(
    (new Date(dateKey).getTime() - Date.now()) / 86400000
  )
}

export function DashboardRaceCard() {
  const [race, setRace] = useState<Goal | null>(null)

  useEffect(() => {
    const goals = getGoals()

    const nextRace =
      goals.find((g) => g.priority === 'A') ??
      goals[0]

    if (nextRace) {
      setRace(nextRace)
    }
  }, [])

  if (!race) return null

  return (
    <Card className="overflow-hidden">
      <CardHeader title="Next A-race" />

      <div className="p-4">

        <div className="flex items-center gap-2 text-sm font-semibold">
          <Flag className="size-4 text-primary" />
          {race.title}
        </div>

        <div className="mt-3 flex items-end gap-2">
          <span className="font-mono text-4xl font-semibold tabular-nums text-primary">
            {daysUntil(race.date)}
          </span>

          <span className="mb-1 text-sm text-muted-foreground">
            days out
          </span>
        </div>


        <div className="mt-4">

          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Readiness
            </span>

            <span className="font-mono font-semibold">
              {race.progress}%
            </span>
          </div>


          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${race.progress}%`,
              }}
            />
          </div>

        </div>


        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">

          <div>
            <dt className="text-xs text-muted-foreground">
              Target
            </dt>

            <dd className="font-mono font-semibold">
              {race.targetTime}
            </dd>
          </div>


          <div>
            <dt className="text-xs text-muted-foreground">
              Type
            </dt>

            <dd className="font-medium">
              {race.raceType}
            </dd>
          </div>

        </dl>


        <Link
          href="/goals"
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View season plan
          <ArrowUpRight className="size-3.5" />
        </Link>

      </div>

    </Card>
  )
}