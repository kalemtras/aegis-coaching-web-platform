import Link from 'next/link'
import {
  formatDateLabel,
  formatDuration,
  metrics,
  sportMeta,
  todayKey,
  weeklyLoad,
  workouts,
  zoneMeta,
  type Sport,
  type ZoneKey,
} from '@/lib/mock-data'
import { Card, CardHeader, PageHeader, SportTag, StatTile, ZoneDistribution } from '@/components/kit'
import { FormChart } from '@/components/charts/form-chart'
import { LoadBars } from '@/components/charts/load-bars'

export default function AnalysisPage() {
  const completed = workouts
    .filter((w) => w.status === 'completed' && w.completed)
    .sort((a, b) => b.date.localeCompare(a.date))

  // aggregate zone minutes across all completed sessions
  const zoneTotals = [0, 0, 0, 0, 0, 0, 0]
  completed.forEach((w) => w.zoneMinutes.forEach((m, i) => (zoneTotals[i] += m)))

  // per-sport totals (last visible range)
  const sportOrder: Sport[] = ['swim', 'bike', 'run', 'strength']
  const sportTotals = sportOrder.map((s) => {
    const items = completed.filter((w) => w.sport === s)
    const min = items.reduce((sum, w) => sum + (w.completed?.durationMin ?? 0), 0)
    const tss = items.reduce((sum, w) => sum + (w.completed?.tss ?? 0), 0)
    return { sport: s, sessions: items.length, min, tss }
  })

  const totalTss = sportTotals.reduce((s, x) => s + x.tss, 0)
  const totalMin = sportTotals.reduce((s, x) => s + x.min, 0)
  const totalZoneMin = zoneTotals.reduce((a, b) => a + b, 0) || 1
  const peakCtl = Math.max(...metrics.map((m) => m.ctl))

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Analysis"
        title="Training history & trends"
        subtitle="How fitness, load and intensity have evolved across the season."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Sessions" value={completed.length} hint="completed" />
        <StatTile label="Total time" value={formatDuration(totalMin)} hint="logged" />
        <StatTile label="Total load" value={totalTss} unit="TSS" />
        <StatTile label="Peak fitness" value={Math.round(peakCtl)} unit="CTL" accent="var(--ctl)" />
      </div>

      <Card>
        <CardHeader title="Fitness, fatigue & form" hint="CTL / ATL / TSB — full season" />
        <div className="p-4">
          <FormChart data={metrics} todayKey={todayKey} />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Weekly training load" hint="by sport" />
          <div className="p-4">
            <LoadBars data={weeklyLoad} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Intensity distribution" hint="minutes in each zone" />
          <div className="p-4">
            <ZoneDistribution zoneMinutes={zoneTotals} showLabels />
            <div className="mt-4 space-y-2">
              {zoneTotals.map((m, i) => {
                if (m <= 0) return null
                const zone = (i + 1) as ZoneKey
                return (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="size-3 shrink-0 rounded-sm" style={{ backgroundColor: zoneMeta[zone].color }} />
                    <span className="w-28 shrink-0 text-muted-foreground">{zoneMeta[zone].label}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(m / totalZoneMin) * 100}%`, backgroundColor: zoneMeta[zone].color }}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right font-mono tabular-nums">
                      {Math.round((m / totalZoneMin) * 100)}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* sport breakdown */}
      <Card>
        <CardHeader title="Volume by sport" />
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-b-xl bg-border md:grid-cols-4">
          {sportTotals.map((s) => (
            <div key={s.sport} className="bg-card p-4">
              <SportTag sport={s.sport} />
              <div className="mt-3 font-mono text-2xl font-semibold tabular-nums">{s.sessions}</div>
              <div className="text-xs text-muted-foreground">sessions</div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{formatDuration(s.min)}</span>
                <span className="font-mono tabular-nums">
                  {totalTss ? Math.round((s.tss / totalTss) * 100) : 0}% load
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* recent sessions table */}
      <Card>
        <CardHeader title="Recent sessions" hint="last completed workouts" />
        <div className="divide-y divide-border">
          {completed.slice(0, 10).map((w) => (
            <Link
              key={w.id}
              href={`/workouts/${encodeURIComponent(w.id)}`}
              className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-accent"
            >
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">
                {formatDateLabel(w.date)}
              </span>
              <SportTag sport={w.sport} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{w.title}</span>
              <span className="hidden shrink-0 font-mono text-sm tabular-nums text-muted-foreground sm:block">
                {formatDuration(w.completed!.durationMin)}
              </span>
              <span className="w-16 shrink-0 text-right font-mono text-sm font-semibold tabular-nums">
                {w.completed!.tss} <span className="text-xs font-normal text-muted-foreground">TSS</span>
              </span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
