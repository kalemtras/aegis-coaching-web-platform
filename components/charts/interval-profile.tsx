'use client'

import { useState } from 'react'
import { zoneMeta, type Interval, type ZoneKey } from '@/lib/mock-data'

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return s === 0 ? `${m}min` : `${m}:${s.toString().padStart(2, '0')}`
}

export function IntervalProfile({ intervals }: { intervals: Interval[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const totalSec = intervals.reduce((s, i) => s + i.durationSec, 0) || 1
  const maxTarget = Math.max(...intervals.map((i) => i.targetHigh), 110)

  return (
    <div>
      <div className="relative flex items-end gap-[2px] rounded-lg bg-muted/40 p-2" style={{ height: 180 }}>
        {/* threshold reference line at 100% */}
        <div
          className="pointer-events-none absolute inset-x-2 border-t border-dashed border-foreground/25"
          style={{ bottom: `calc(${(100 / maxTarget) * 100}% * 0.92 + 8px)` }}
        >
          <span className="absolute -top-4 right-0 font-mono text-[10px] text-muted-foreground">100% FTP/Thr</span>
        </div>
        {intervals.map((iv, i) => {
          const widthPct = (iv.durationSec / totalSec) * 100
          const heightPct = (iv.targetHigh / maxTarget) * 92
          const lowPct = (iv.targetLow / maxTarget) * 92
          const active = hover === i
          return (
            <div
              key={i}
              className="relative flex h-full flex-col justify-end"
              style={{ width: `${widthPct}%` }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {active && (
                <div className="absolute -top-1 left-1/2 z-10 w-max max-w-[180px] -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-popover px-2.5 py-2 text-xs shadow-lg">
                  <div className="font-semibold">{iv.label}</div>
                  <div className="mt-0.5 font-mono text-muted-foreground">
                    {fmt(iv.durationSec)} · {zoneMeta[iv.zone].short} · {iv.targetLow}–{iv.targetHigh}%
                  </div>
                </div>
              )}
              {/* target band */}
              <div
                className="w-full rounded-t-[2px] transition-all"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: zoneMeta[iv.zone as ZoneKey].color,
                  opacity: hover === null || active ? 1 : 0.55,
                }}
              >
                <div
                  className="w-full"
                  style={{ height: `${(1 - lowPct / heightPct) * 100}%`, background: 'color-mix(in oklab, var(--card) 45%, transparent)' }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {intervals.map((iv, i) => (
          <span key={i} className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
            <span className="size-2 rounded-sm" style={{ backgroundColor: zoneMeta[iv.zone].color }} />
            {iv.label} <span className="text-foreground">{fmt(iv.durationSec)}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
