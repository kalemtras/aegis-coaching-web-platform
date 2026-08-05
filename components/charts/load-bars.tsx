'use client'

import { useState } from 'react'
import { sportMeta, type WeekLoad } from '@/lib/mock-data'

const segments: { key: keyof Pick<WeekLoad, 'swim' | 'bike' | 'run' | 'strength'>; sport: 'swim' | 'bike' | 'run' | 'strength' }[] = [
  { key: 'swim', sport: 'swim' },
  { key: 'bike', sport: 'bike' },
  { key: 'run', sport: 'run' },
  { key: 'strength', sport: 'strength' },
]

export function LoadBars({ data }: { data: WeekLoad[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(...data.map((d) => d.tss)) * 1.05 || 1

  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height: 200 }}>
        {data.map((w, i) => {
          const active = hover === i
          return (
            <div
              key={w.weekStart}
              className="group relative flex h-full flex-1 flex-col justify-end"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {active && (
                <div className="absolute -top-1 left-1/2 z-10 w-max -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-popover px-2.5 py-2 text-xs shadow-lg">
                  <div className="mb-1 font-mono font-semibold">{w.label} · {w.hours}h</div>
                  {segments.map((s) => (
                    <div key={s.key} className="flex items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <span className="size-2 rounded-sm" style={{ backgroundColor: sportMeta[s.sport].color }} />
                        {sportMeta[s.sport].label}
                      </span>
                      <span className="font-mono tabular-nums">{w[s.key]}</span>
                    </div>
                  ))}
                  <div className="mt-1 flex items-center justify-between gap-4 border-t border-border pt-1 font-mono">
                    <span className="text-muted-foreground">Total TSS</span>
                    <span className="font-semibold tabular-nums">{w.tss}</span>
                  </div>
                </div>
              )}
              <div
                className="flex w-full flex-col-reverse overflow-hidden rounded-t-[3px] transition-opacity"
                style={{
                  height: `${(w.tss / max) * 100}%`,
                  opacity: hover === null || active ? 1 : 0.5,
                  outline: w.planned ? '1px dashed var(--border)' : 'none',
                  outlineOffset: '-1px',
                }}
              >
                {segments.map((s) => (
                  <div
                    key={s.key}
                    style={{
                      height: `${(w[s.key] / w.tss) * 100}%`,
                      backgroundColor: sportMeta[s.sport].color,
                      opacity: w.planned ? 0.55 : 1,
                    }}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex gap-1.5">
        {data.map((w) => (
          <div key={w.weekStart} className="flex-1 text-center font-mono text-[10px] text-muted-foreground">
            {w.label}
          </div>
        ))}
      </div>
    </div>
  )
}
