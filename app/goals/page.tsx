import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { goals, phaseMeta, seasonBlocks, todayKey } from '@/lib/mock-data'
import { primaryGoal, primaryProjection } from '@/lib/projection'
import { Card, CardHeader, PageHeader } from '@/components/kit'
import { ProjectionCard } from '@/components/projection-card'

function daysUntil(dateKey: string): number {
  return Math.round((new Date(dateKey).getTime() - new Date(todayKey).getTime()) / 86400000)
}

const priorityStyle: Record<string, string> = {
  A: 'bg-[color-mix(in_oklab,var(--zone-6)_16%,transparent)] text-[var(--zone-6)]',
  B: 'bg-[color-mix(in_oklab,var(--zone-4)_16%,transparent)] text-[var(--zone-4)]',
  C: 'bg-muted text-muted-foreground',
}

export default function GoalsPage() {
  const sorted = [...goals].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Goals & Season Plan"
        title="Target-driven roadmap"
        subtitle="The engine works backward from your A-race target, then periodizes the season to close the gap."
        actions={
          <Link
            href="/onboarding"
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Edit athlete & target
          </Link>
        }
      />

      <ProjectionCard goal={primaryGoal} projection={primaryProjection} />

      {/* season periodization */}
      <Card>
        <CardHeader
          title="Season periodization"
          hint={`${seasonBlocks.length} blocks · builds toward ${primaryGoal.title}`}
        />
        <div className="space-y-3 p-4">
          {seasonBlocks.map((b) => {
            const meta = phaseMeta[b.kind]
            const start = new Date(b.startDate)
            const end = new Date(b.endDate)
            const active = todayKey >= b.startDate && todayKey <= b.endDate
            return (
              <div
                key={b.id}
                className="flex items-center gap-4 rounded-lg border border-border p-3"
                style={active ? { borderColor: meta.color } : undefined}
              >
                <div
                  className="flex w-1 shrink-0 self-stretch rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{b.name}</span>
                    {active && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                        style={{ backgroundColor: `color-mix(in oklab, ${meta.color} 18%, transparent)`, color: meta.color }}
                      >
                        Current
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{b.focus}</p>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <div className="font-mono text-xs text-muted-foreground">
                    {start.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} –{' '}
                    {end.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                  </div>
                  <div className="font-mono text-sm font-semibold tabular-nums">{b.weeklyHours}h/wk</div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* race calendar */}
      <div>
        <h2 className="mb-3 text-sm font-semibold">Race calendar</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {sorted.map((g) => {
            const d = daysUntil(g.date)
            const past = d < 0
            return (
              <Card key={g.id} className="p-4">
                <div className="flex items-center justify-between">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${priorityStyle[g.priority]}`}>
                    {g.priority}-Race
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {past ? `${Math.abs(d)}d ago` : `in ${d}d`}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-balance">{g.title}</h3>
                <p className="text-sm text-muted-foreground">{g.raceType}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" />
                  {g.location}
                </div>
                <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">Target</span>
                  <span className="font-mono text-lg font-semibold tabular-nums">{g.targetTime}</span>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Readiness</span>
                    <span className="font-mono font-semibold tabular-nums">{g.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${g.progress}%` }} />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
