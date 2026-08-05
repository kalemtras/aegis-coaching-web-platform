'use client'

import { useState } from 'react'
import { Activity, Check } from 'lucide-react'
import type { Workout } from '@/lib/mock-data'
import { Card, CardHeader } from '@/components/kit'
import { cn } from '@/lib/utils'

const feelings = [
  { key: 'great', label: 'Great', tone: 'var(--zone-2)' },
  { key: 'good', label: 'Good', tone: 'var(--zone-3)' },
  { key: 'ok', label: 'OK', tone: 'var(--zone-4)' },
  { key: 'tired', label: 'Tired', tone: 'var(--zone-5)' },
  { key: 'bad', label: 'Bad', tone: 'var(--zone-6)' },
] as const

type Feeling = (typeof feelings)[number]['key']

/** mock of the engine's feedback-adaptive response */
function adaptationFor(rpe: number, feeling: Feeling, plannedZone: number): string {
  const strain = rpe - plannedZone
  if (feeling === 'bad' || feeling === 'tired' || strain >= 3) {
    return 'High strain detected. The engine will insert an extra recovery block and shave ~12% intensity from the next 2 threshold sessions this week.'
  }
  if (feeling === 'great' && strain <= 0) {
    return 'Positive response with room to spare. The engine will nudge next week\u2019s build load +6% and add one VO2 interval to accelerate progress toward your target.'
  }
  return 'Response on track. The engine keeps this week\u2019s progression as planned and re-checks form (TSB) before the next key session.'
}

export function FeedbackPanel({ workout }: { workout: Workout }) {
  const already = workout.completed
  const [rpe, setRpe] = useState(already?.rpe ?? 6)
  const [feeling, setFeeling] = useState<Feeling>(already?.feeling ?? 'good')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const plannedZone = Math.max(1, workout.zoneMinutes.findIndex((m) => m === Math.max(...workout.zoneMinutes)) + 1)

  return (
    <Card>
      <CardHeader
        title="Feedback"
        hint="How did it go? Your feedback re-shapes the upcoming plan."
      />
      <div className="p-4">
        {submitted ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--tsb)]">
              <Check className="size-4" />
              Feedback recorded
            </div>
            <div className="rounded-lg border border-border bg-[color-mix(in_oklab,var(--primary)_6%,var(--card))] p-4">
              <div className="mb-1.5 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
                <Activity className="size-3.5" />
                Engine adaptation
              </div>
              <p className="text-sm text-pretty text-foreground/90">
                {adaptationFor(rpe, feeling, plannedZone)}
              </p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Edit feedback
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* RPE */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium">Perceived effort (RPE)</label>
                <span className="font-mono text-sm font-semibold tabular-nums">{rpe}/10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={rpe}
                onChange={(e) => setRpe(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
            </div>

            {/* feeling */}
            <div>
              <label className="mb-2 block text-sm font-medium">How did you feel?</label>
              <div className="flex flex-wrap gap-2">
                {feelings.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFeeling(f.key)}
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                      feeling === f.key
                        ? 'border-transparent text-background'
                        : 'border-border text-muted-foreground hover:text-foreground',
                    )}
                    style={feeling === f.key ? { backgroundColor: f.tone } : undefined}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* notes */}
            <div>
              <label className="mb-2 block text-sm font-medium">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Legs felt heavy on the third interval, cut it short…"
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </div>

            <button
              onClick={() => setSubmitted(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Submit feedback
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}
