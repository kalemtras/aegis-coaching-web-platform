import Link from 'next/link'
import { ArrowUpRight, Flag, Sparkles } from 'lucide-react'
import {
  athlete,
  currentMetric,
  formatDuration,
  goals,
  metrics,
  todayKey,
  weeklyLoad,
  workouts,
  workoutsForDate,
  startOfWeek,
  today,
  addDays,
  type Goal,
} from '@/lib/mock-data'
import { Card, CardHeader, PageHeader, StatTile } from '@/components/kit'
import { FormChart } from '@/components/charts/form-chart'
import { LoadBars } from '@/components/charts/load-bars'
import { WorkoutCard } from '@/components/workout-card'
import { ProjectionCard } from '@/components/projection-card'
import { primaryGoal, primaryProjection } from '@/lib/projection'

function engineAdvice(tsb: number) {
  if (tsb < -25)
    return {
      tone: 'Manage fatigue',
      text: 'Form is deeply negative. The engine reduced today’s intensity and inserted extra recovery to protect adaptation.',
    }
  if (tsb < -10)
    return {
      tone: 'Productive fatigue',
      text: 'You are absorbing a solid training load. Hold the plan, prioritise sleep and fueling around key sessions.',
    }
  if (tsb < 5)
    return {
      tone: 'Balanced',
      text: 'Form is neutral — a good window for quality work. The engine scheduled a threshold focus today.',
    }
  return {
    tone: 'Fresh',
    text: 'You are well rested. The engine added a sharpening session to convert freshness into race fitness.',
  }
}

function nextARace(): Goal | undefined {
  return goals
    .filter((g) => g.priority === 'A' && g.date >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date))[0]
}

function daysUntil(dateKey: string) {
  const d = new Date(dateKey)
  const t = new Date(todayKey)
  return Math.round((d.getTime() - t.getTime()) / 86400000)
}

export default function DashboardPage() {
  const todays = workoutsForDate(todayKey)
  const advice = engineAdvice(currentMetric.tsb)
  const aRace = nextARace()

  // this week planned vs completed
  const ws = startOfWeek(today)
  const weStart = ws.toISOString().slice(0, 10)
  const weEnd = addDays(ws, 6).toISOString().slice(0, 10)
  const weekWorkouts = workouts.filter(
    (w) => w.date >= weStart && w.date <= weEnd && w.sport !== 'rest',
  )
  const plannedTss = weekWorkouts.reduce((s, w) => s + w.plannedTss, 0)
  const doneTss = weekWorkouts.reduce((s, w) => s + (w.completed?.tss ?? 0), 0)
  const plannedMin = weekWorkouts.reduce((s, w) => s + w.plannedDurationMin, 0)

  // ramp: CTL change last 7 days
  const idxToday = metrics.findIndex((m) => m.date === todayKey)
  const ctl7ago = metrics[Math.max(0, idxToday - 7)]?.ctl ?? currentMetric.ctl
  const ramp = Math.round((currentMetric.ctl - ctl7ago) * 10) / 10

  const dateLong = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader
        eyebrow={dateLong}
        title={`Good morning, ${athlete.name.split(' ')[0]}`}
        subtitle="Here is where your fitness stands and what the engine has planned."
        actions={
          <Link
            href="/onboarding"
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Athlete & target
          </Link>
        }
      />

      {/* Adaptive engine banner */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                Engine · {advice.tone}
              </span>
            </div>
            <p className="mt-1 text-sm text-pretty text-foreground/90">{advice.text}</p>
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Form (TSB)"
          value={
            currentMetric.tsb > 0
              ? `+${Math.round(currentMetric.tsb)}`
              : Math.round(currentMetric.tsb)
          }
          accent="var(--tsb)"
          hint={
            currentMetric.tsb < -10
              ? 'Carrying fatigue'
              : currentMetric.tsb > 5
                ? 'Fresh & ready'
                : 'Balanced'
          }
        />
        <StatTile label="Fitness (CTL)" value={Math.round(currentMetric.ctl)} accent="var(--ctl)" hint="42-day load" />
        <StatTile label="Fatigue (ATL)" value={Math.round(currentMetric.atl)} accent="var(--atl)" hint="7-day load" />
        <StatTile
          label="Ramp rate"
          value={ramp > 0 ? `+${ramp}` : ramp}
          unit="CTL/wk"
          hint={ramp > 7 ? 'Aggressive — watch fatigue' : 'Sustainable'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: charts */}
        <div className="space-y-6 lg:col-span-2">
          <ProjectionCard goal={primaryGoal} projection={primaryProjection} />

          <Card>
            <CardHeader
              title="Fitness & Form trend"
              hint="Chronic vs acute load with resulting form (12 weeks)"
            />
            <div className="p-4">
              <FormChart
                data={metrics.slice(idxToday - 84 > 0 ? idxToday - 84 : 0, idxToday + 8)}
                todayKey={todayKey}
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Weekly training load" hint="TSS by discipline · dashed = planned" />
            <div className="p-4">
              <LoadBars data={weeklyLoad} />
            </div>
          </Card>
        </div>

        {/* Right: today + race */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Today"
              hint={`${weekWorkouts.length ? formatDuration(plannedMin) : '—'} planned this week`}
              action={
                <Link
                  href="/calendar"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Calendar <ArrowUpRight className="size-3.5" />
                </Link>
              }
            />
            <div className="space-y-2 p-3">
              {todays.length === 0 && (
                <p className="px-1 py-6 text-center text-sm text-muted-foreground">
                  No sessions scheduled.
                </p>
              )}
              {todays.map((w) => (
                <WorkoutCard key={w.id} workout={w} />
              ))}
            </div>
          </Card>

          {aRace && (
            <Card className="overflow-hidden">
              <CardHeader title="Next A-race" />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Flag className="size-4 text-primary" />
                  {aRace.title}
                </div>
                <div className="mt-3 flex items-end gap-2">
                  <span className="font-mono text-4xl font-semibold tabular-nums text-primary">
                    {daysUntil(aRace.date)}
                  </span>
                  <span className="mb-1 text-sm text-muted-foreground">days out</span>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Readiness</span>
                    <span className="font-mono font-semibold">{aRace.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${aRace.progress}%` }} />
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Target</dt>
                    <dd className="font-mono font-semibold">{aRace.targetTime}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Type</dt>
                    <dd className="font-medium">{aRace.raceType}</dd>
                  </div>
                </dl>
                <Link
                  href="/goals"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  View season plan <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </Card>
          )}

          <Card>
            <CardHeader title="This week" hint="Compliance vs plan" />
            <div className="p-4">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Completed load</span>
                <span className="font-mono font-semibold">
                  {doneTss} / {plannedTss} TSS
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-[var(--tsb)]"
                  style={{ width: `${plannedTss ? Math.min(100, (doneTss / plannedTss) * 100) : 0}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground text-pretty">
                {Math.round(plannedTss ? (doneTss / plannedTss) * 100 : 0)}% of planned load logged so far this week.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
