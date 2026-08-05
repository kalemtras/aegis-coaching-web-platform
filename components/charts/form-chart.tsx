'use client'

import { useMemo, useState } from 'react'
import type { DayMetric } from '@/lib/mock-data'

const W = 1000
const H = 260
const PAD_T = 16
const PAD_B = 28

type Props = {
  data: DayMetric[]
  todayKey: string
}

export function FormChart({ data, todayKey }: Props) {
  const [hover, setHover] = useState<number | null>(null)

  const geo = useMemo(() => {
    const loads = data.map((d) => d.ctl)
    const atls = data.map((d) => d.atl)
    const maxLoad = Math.max(...loads, ...atls) * 1.1
    const tsbVals = data.map((d) => d.tsb)
    const maxTsb = Math.max(...tsbVals.map(Math.abs), 20) * 1.15

    const x = (i: number) => (i / (data.length - 1)) * W
    const yLoad = (v: number) => PAD_T + (1 - v / maxLoad) * (H - PAD_T - PAD_B)
    // TSB uses same vertical space but centered on its own zero
    const zeroY = PAD_T + (H - PAD_T - PAD_B) / 2
    const yTsb = (v: number) => zeroY - (v / maxTsb) * ((H - PAD_T - PAD_B) / 2)

    const line = (key: 'ctl' | 'atl') =>
      data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${yLoad(d[key]).toFixed(1)}`).join(' ')

    const tsbLine = data
      .map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${yTsb(d.tsb).toFixed(1)}`)
      .join(' ')
    const tsbArea = `${tsbLine} L${W},${zeroY} L0,${zeroY} Z`

    const todayIdx = data.findIndex((d) => d.date === todayKey)

    return { x, yLoad, yTsb, zeroY, ctl: line('ctl'), atl: line('atl'), tsbLine, tsbArea, maxLoad, todayIdx }
  }, [data, todayKey])

  const active = hover ?? (geo.todayIdx >= 0 ? geo.todayIdx : null)
  const point = active != null && active >= 0 ? data[active] : null

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-4 text-xs">
        <Legend color="var(--ctl)" label="Fitness (CTL)" value={point ? Math.round(point.ctl) : undefined} />
        <Legend color="var(--atl)" label="Fatigue (ATL)" value={point ? Math.round(point.atl) : undefined} />
        <Legend color="var(--tsb)" label="Form (TSB)" value={point ? Math.round(point.tsb) : undefined} filled />
        {point && (
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      <div
        className="relative w-full"
        style={{ aspectRatio: `${W} / ${H}` }}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const frac = (e.clientX - rect.left) / rect.width
          const idx = Math.round(frac * (data.length - 1))
          setHover(Math.max(0, Math.min(data.length - 1, idx)))
        }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="tsbFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--tsb)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--tsb)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* zero line for TSB */}
          <line x1="0" y1={geo.zeroY} x2={W} y2={geo.zeroY} stroke="var(--border)" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />

          <path d={geo.tsbArea} fill="url(#tsbFill)" />
          <path d={geo.tsbLine} fill="none" stroke="var(--tsb)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" opacity="0.7" />

          <path d={geo.atl} fill="none" stroke="var(--atl)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <path d={geo.ctl} fill="none" stroke="var(--ctl)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />

          {geo.todayIdx >= 0 && (
            <line
              x1={geo.x(geo.todayIdx)}
              y1={PAD_T}
              x2={geo.x(geo.todayIdx)}
              y2={H - PAD_B}
              stroke="var(--foreground)"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.35"
              vectorEffect="non-scaling-stroke"
            />
          )}

          {active != null && active >= 0 && (
            <line
              x1={geo.x(active)}
              y1={PAD_T}
              x2={geo.x(active)}
              y2={H - PAD_B}
              stroke="var(--foreground)"
              strokeWidth="1"
              opacity="0.5"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {/* hover dots via HTML for crisp rendering */}
        {active != null && active >= 0 && point && (
          <>
            <Dot xFrac={active / (data.length - 1)} yFrac={geo.yLoad(point.ctl) / H} color="var(--ctl)" />
            <Dot xFrac={active / (data.length - 1)} yFrac={geo.yLoad(point.atl) / H} color="var(--atl)" />
          </>
        )}
      </div>
    </div>
  )
}

function Dot({ xFrac, yFrac, color }: { xFrac: number; yFrac: number; color: string }) {
  return (
    <span
      className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card"
      style={{ left: `${xFrac * 100}%`, top: `${yFrac * 100}%`, backgroundColor: color }}
    />
  )
}

function Legend({
  color,
  label,
  value,
  filled,
}: {
  color: string
  label: string
  value?: number
  filled?: boolean
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-2.5 w-3.5 rounded-sm"
        style={filled ? { backgroundColor: `color-mix(in oklab, ${color} 45%, transparent)`, border: `1px solid ${color}` } : { backgroundColor: color }}
      />
      <span className="text-muted-foreground">{label}</span>
      {value !== undefined && <span className="font-mono font-semibold tabular-nums text-foreground">{value}</span>}
    </span>
  )
}
