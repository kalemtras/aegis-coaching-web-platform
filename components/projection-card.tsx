import { formatGap, formatTime, type Projection } from '@/lib/engine'
import { sportMeta, type Goal } from '@/lib/mock-data'
import { SportIcon } from '@/components/sport-icon'
import { cn } from '@/lib/utils'

const sportKey = { swim: 'swim', bike: 'bike', run: 'run' } as const

export function ProjectionCard({
  goal,
  projection,
  className,
}: {
  goal: Goal
  projection: Projection
  className?: string
}) {
  const { predicted, targetSeconds, gapSeconds, achievable, breakdown } = projection
  const maxGap = Math.max(...breakdown.map((b) => b.seconds), 1)

  return (
    <div className={cn('rounded-xl border border-border bg-card', className)}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Engine projection
          </div>
          <h2 className="mt-1 text-lg font-semibold">{goal.title}</h2>
          <p className="text-sm text-muted-foreground">
            {goal.raceType} · {new Date(goal.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div
          className={cn(
            'rounded-lg px-3 py-2 text-right',
            achievable
              ? 'bg-[color-mix(in_oklab,var(--tsb)_14%,transparent)]'
              : 'bg-[color-mix(in_oklab,var(--zone-5)_14%,transparent)]',
          )}
        >
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Gap to target</div>
          <div
            className="font-mono text-xl font-semibold tabular-nums"
            style={{ color: achievable ? 'var(--tsb)' : 'var(--zone-5)' }}
          >
            {formatGap(gapSeconds)}
          </div>
        </div>
      </div>

      {/* predicted vs target */}
      <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
        <div className="p-4">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Predicted now</div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums">{formatTime(predicted.total)}</div>
        </div>
        <div className="p-4">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Your target</div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-primary">{formatTime(targetSeconds)}</div>
        </div>
      </div>

      {/* discipline split predictions */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border text-center">
        {predicted.splits.map((s) => {
          const meta = sportMeta[sportKey[s.discipline]]
          return (
            <div key={s.discipline} className="p-3">
              <div className="flex items-center justify-center gap-1.5" style={{ color: meta.color }}>
                <SportIcon sport={sportKey[s.discipline]} className="size-4" />
                <span className="text-xs font-medium">{meta.label}</span>
              </div>
              <div className="mt-1 font-mono text-sm font-semibold tabular-nums">{formatTime(s.seconds)}</div>
            </div>
          )
        })}
      </div>

      {/* gap distribution */}
      <div className="p-4">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {achievable ? 'Time buffer by discipline' : 'Where to find the time'}
        </div>
        <div className="space-y-3">
          {breakdown.map((b) => {
            const meta = sportMeta[sportKey[b.discipline]]
            return (
              <div key={b.discipline} className="flex items-center gap-3">
                <div className="flex w-16 shrink-0 items-center gap-1.5 text-sm" style={{ color: meta.color }}>
                  <SportIcon sport={sportKey[b.discipline]} className="size-4" />
                  {meta.label}
                </div>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(b.seconds / maxGap) * 100}%`, backgroundColor: meta.color }}
                  />
                </div>
                <div className="w-16 shrink-0 text-right font-mono text-sm font-semibold tabular-nums">
                  {achievable ? '—' : `−${formatTime(b.seconds)}`}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
