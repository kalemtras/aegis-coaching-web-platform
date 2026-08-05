import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Clock, Gauge, Heart, Route, Zap } from 'lucide-react'
import {
  formatDateLabel,
  formatDistance,
  formatDuration,
  formatPace,
  getWorkout,
  intensityMeta,
  sportMeta,
} from '@/lib/mock-data'
import { Card, CardHeader, IntensityDot, SportTag, StatusPill, ZoneDistribution } from '@/components/kit'
import { IntervalProfile } from '@/components/charts/interval-profile'
import { SportIcon } from '@/components/sport-icon'
import { FeedbackPanel } from '@/components/feedback-panel'

export default async function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const workout = getWorkout(decodeURIComponent(id))
  if (!workout) notFound()

  const meta = sportMeta[workout.sport]
  const c = workout.completed

  const compareRows = c
    ? [
        { label: 'Duration', planned: formatDuration(workout.plannedDurationMin), actual: formatDuration(c.durationMin) },
        { label: 'Training load', planned: `${workout.plannedTss} TSS`, actual: `${c.tss} TSS` },
        { label: 'Distance', planned: formatDistance(workout.plannedDistance), actual: formatDistance(c.distance) },
      ]
    : []

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-8">
      <Link
        href="/calendar"
        className="mb-5 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Back to calendar
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className="flex size-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `color-mix(in oklab, ${meta.color} 16%, transparent)`, color: meta.color }}
          >
            <SportIcon sport={workout.sport} className="size-6" />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <SportTag sport={workout.sport} />
              <StatusPill status={workout.status} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance">{workout.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDateLabel(workout.date)} · {workout.focus}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <IntensityDot intensity={workout.intensity} />
        </div>
      </div>

      {/* engine rationale */}
      <div className="mt-6 rounded-xl border border-border bg-[color-mix(in_oklab,var(--primary)_5%,var(--card))] p-4">
        <div className="mb-1 font-mono text-xs uppercase tracking-widest text-primary">
          Why this session
        </div>
        <p className="text-sm text-pretty text-foreground/90">{workout.rationale}</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* main column */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Structure" hint={workout.description} />
            <div className="p-4">
              <IntervalProfile intervals={workout.intervals} />
            </div>
          </Card>

          {c && (
            <Card>
              <CardHeader title="Planned vs Completed" />
              <div className="divide-y divide-border">
                {compareRows.map((r) => (
                  <div key={r.label} className="grid grid-cols-3 items-center gap-2 px-4 py-3 text-sm">
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className="text-right font-mono tabular-nums text-muted-foreground">{r.planned}</span>
                    <span className="text-right font-mono font-semibold tabular-nums">{r.actual}</span>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-2 px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  <span />
                  <span className="text-right">Planned</span>
                  <span className="text-right">Actual</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* side column */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Zone distribution" />
            <div className="p-4">
              <ZoneDistribution zoneMinutes={workout.zoneMinutes} showLabels />
            </div>
          </Card>

          {c ? (
            <Card>
              <CardHeader title="Session metrics" />
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-b-xl bg-border">
                <Metric icon={<Clock className="size-4" />} label="Time" value={formatDuration(c.durationMin)} />
                <Metric icon={<Zap className="size-4" />} label="Load" value={`${c.tss}`} unit="TSS" />
                {c.avgHr && <Metric icon={<Heart className="size-4" />} label="Avg HR" value={`${c.avgHr}`} unit="bpm" />}
                {c.avgPower && <Metric icon={<Gauge className="size-4" />} label="Avg Power" value={`${c.avgPower}`} unit="w" />}
                {c.avgPaceSecPerKm && <Metric icon={<Route className="size-4" />} label="Avg Pace" value={formatPace(c.avgPaceSecPerKm)} />}
                {c.avgSpeedKmh && <Metric icon={<Route className="size-4" />} label="Avg Speed" value={`${c.avgSpeedKmh}`} unit="km/h" />}
              </div>
            </Card>
          ) : (
            <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              <span className="font-mono text-xs uppercase tracking-wider">Target</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span>Duration</span>
                <span className="font-mono font-semibold text-foreground">{formatDuration(workout.plannedDurationMin)}</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span>Load</span>
                <span className="font-mono font-semibold text-foreground">{workout.plannedTss} TSS</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span>Intensity</span>
                <span className="font-mono font-semibold text-foreground">{intensityMeta[workout.intensity].label}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* feedback loop */}
      <div className="mt-6">
        <FeedbackPanel workout={workout} />
      </div>
    </div>
  )
}

function Metric({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string; unit?: string }) {
  return (
    <div className="bg-card p-4">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="font-mono text-[11px] uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="font-mono text-lg font-semibold tabular-nums">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  )
}
