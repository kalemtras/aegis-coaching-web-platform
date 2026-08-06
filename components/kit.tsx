import { cn } from '@/lib/utils'
import {
  intensityMeta,
  sportMeta,
  zoneMeta,
  type Intensity,
  type Sport,
  type WorkoutStatus,
  type ZoneKey,
} from '@/lib/mock-data'
import { SportIcon } from '@/components/sport-icon'

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground text-pretty">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Card({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card text-card-foreground shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  hint,
  action,
}: {
  title: string
  hint?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {action}
    </div>
  )
}

export function SportTag({ sport }: { sport: Sport }) {
  const meta = sportMeta[sport]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: `color-mix(in oklab, ${meta.color} 16%, transparent)`,
        color: meta.color,
      }}
    >
      <SportIcon sport={sport} className="size-3.5" />
      {meta.label}
    </span>
  )
}

export function IntensityDot({ intensity }: { intensity: Intensity }) {
  const zone = intensityMeta[intensity].zone
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span
        className="size-2 rounded-full"
        style={{ backgroundColor: zoneMeta[zone].color }}
      />
      {intensityMeta[intensity].label}
    </span>
  )
}

const statusStyles: Record<WorkoutStatus, string> = {
  planned: 'bg-muted text-muted-foreground',
  completed: 'bg-[color-mix(in_oklab,var(--tsb)_18%,transparent)] text-[var(--tsb)]',
  missed: 'bg-[color-mix(in_oklab,var(--destructive)_16%,transparent)] text-destructive',
}

export function StatusPill({ status }: { status: WorkoutStatus }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize',
        statusStyles[status],
      )}
    >
      {label}
    </span>
  )
}

/** Horizontal segmented bar of minutes per zone */
export function ZoneDistribution({
  zoneMinutes,
  className,
  showLabels = false,
}: {
  zoneMinutes: number[]
  className?: string
  showLabels?: boolean
}) {
  const total = zoneMinutes.reduce((a, b) => a + b, 0) || 1
  return (
    <div className={className}>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
        {zoneMinutes.map((m, i) => {
          if (m <= 0) return null
          const zone = (i + 1) as ZoneKey
          return (
            <div
              key={i}
              style={{ width: `${(m / total) * 100}%`, backgroundColor: zoneMeta[zone].color }}
              title={`${zoneMeta[zone].label}: ${m}min`}
            />
          )
        })}
      </div>
      {showLabels && (
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {zoneMinutes.map((m, i) => {
            if (m <= 0) return null
            const zone = (i + 1) as ZoneKey
            return (
              <span key={i} className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                <span className="size-2 rounded-sm" style={{ backgroundColor: zoneMeta[zone].color }} />
                {zoneMeta[zone].short}
                <span className="text-foreground">{m}′</span>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function StatTile({
  label,
  value,
  unit,
  hint,
  accent,
}: {
  label: string
  value: string | number
  unit?: string
  hint?: React.ReactNode
  accent?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span
          className="font-mono text-2xl font-semibold tabular-nums"
          style={accent ? { color: accent } : undefined}
        >
          {value}
        </span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  )
}
