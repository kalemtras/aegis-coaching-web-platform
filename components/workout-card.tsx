import Link from 'next/link'
import { CircleCheckBig, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  formatDistance,
  formatDuration,
  sportMeta,
  type Workout,
} from '@/lib/mock-data'
import { SportIcon } from '@/components/sport-icon'
import { IntensityDot, StatusPill } from '@/components/kit'

export function WorkoutCard({ workout }: { workout: Workout }) {
  const meta = sportMeta[workout.sport]
  const done = workout.status === 'completed' && workout.completed
  const isRest = workout.sport === 'rest'

  return (
    <Link
      href={`/workouts/${workout.id}`}
      className="group flex items-stretch gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-ring/60 hover:bg-accent/40"
    >
      <div
        className="w-1 shrink-0 rounded-full"
        style={{ backgroundColor: meta.color }}
        aria-hidden
      />
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: `color-mix(in oklab, ${meta.color} 16%, transparent)`,
          color: meta.color,
        }}
      >
        <SportIcon sport={workout.sport} className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold">{workout.title}</span>
          <StatusPill status={workout.status} />
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
          {!isRest && <IntensityDot intensity={workout.intensity} />}
          <span className="truncate">{workout.focus}</span>
        </div>
      </div>

      {!isRest && (
        <div className="flex shrink-0 flex-col items-end justify-center gap-1 text-right">
          <div className="flex items-center gap-1 font-mono text-sm font-semibold tabular-nums">
            <Clock className="size-3.5 text-muted-foreground" />
            {formatDuration(done ? workout.completed!.durationMin : workout.plannedDurationMin)}
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Zap className="size-3" />
              {done ? workout.completed!.tss : workout.plannedTss} TSS
            </span>
            {workout.plannedDistance > 0 && (
              <span>{formatDistance(done ? workout.completed!.distance : workout.plannedDistance)}</span>
            )}
          </div>
        </div>
      )}

      {done && (
        <CircleCheckBig
          className={cn('size-4 shrink-0 self-center text-[var(--tsb)]')}
          aria-label="Completed"
        />
      )}
    </Link>
  )
}
