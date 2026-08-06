'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Waypoints } from 'lucide-react'
import { athlete, raceMeta, todayKey, type Goal, type RaceType } from '@/lib/mock-data'
import { project, type AthleteInput } from '@/lib/engine'
import { PageHeader } from '@/components/kit'
import { saveAthlete, saveGoals } from '@/lib/store'
import { ProjectionCard } from '@/components/projection-card'


function parseClock(v: string): number {
  const p = v.split(':').map((n) => parseInt(n, 10) || 0)
  if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2]
  if (p.length === 2) return p[0] * 60 + p[1]
  return p[0]
}

const defaults = {
  name: athlete.name,
  age: String(athlete.age),
  weightKg: String(athlete.weightKg),
  restingHr: String(athlete.restingHr),
  vo2max: String(athlete.vo2max),
  ftp: String(athlete.ftp),
  swimCss: '1:32', // per 100m
  runPace: '4:18', // per km threshold
  raceType: 'half' as RaceType,
  targetTime: '4:25:00',
  raceDate: '',
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="font-mono text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary'

export default function OnboardingPage() {
  const [f, setF] = useState(defaults)
  const [created, setCreated] = useState(false)

  const set = (k: keyof typeof defaults) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }))

  const defaultRaceDate = useMemo(() => {
    const d = new Date(todayKey)
    d.setDate(d.getDate() + 7 * 18)
    return d.toISOString().slice(0, 10)
  }, [])

  const input: AthleteInput = useMemo(
    () => ({
      name: f.name,
      age: Number(f.age) || 0,
      weightKg: Number(f.weightKg) || 0,
      restingHr: Number(f.restingHr) || 0,
      vo2max: Number(f.vo2max) || 0,
      ftp: Number(f.ftp) || 0,
      swimCss: parseClock(f.swimCss),
      runThresholdPaceSecPerKm: parseClock(f.runPace),
      raceType: f.raceType,
      targetTime: f.targetTime,
      raceDate: f.raceDate || defaultRaceDate,
    }),
    [f, defaultRaceDate],
  )

  const projection = useMemo(() => project(input, todayKey), [input])

  const previewGoal: Goal = {
    id: 'preview',
    title: `${raceMeta[f.raceType].label} target`,
    raceType: raceMeta[f.raceType].label,
    distance: f.raceType,
    date: input.raceDate,
    location: '—',
    priority: 'A',
    targetTime: f.targetTime,
    progress: 0,
    notes: '',
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Athlete Setup"
        title="Create your athlete"
        subtitle="Enter your physiology and race target. The engine instantly projects your current finish time and the gap to close."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* form */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold">Profile & thresholds</h2>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <Field label="Name">
                <input className={inputCls} value={f.name} onChange={set('name')} />
              </Field>
              <Field label="Age" hint="years">
                <input className={inputCls} inputMode="numeric" value={f.age} onChange={set('age')} />
              </Field>
              <Field label="Resting HR" hint="bpm">
                <input className={inputCls} inputMode="numeric" value={f.restingHr} onChange={set('restingHr')} />
              </Field>
              <Field label="VO2 max" hint="ml/kg/min">
                <input className={inputCls} inputMode="numeric" value={f.vo2max} onChange={set('vo2max')} />
              </Field>
              <Field label="Bike FTP" hint="watts">
                <input className={inputCls} inputMode="numeric" value={f.ftp} onChange={set('ftp')} />
              </Field>
              <Field label="Weight" hint="kg">
                <input className={inputCls} inputMode="numeric" value={f.weightKg} onChange={set('weightKg')} />
              </Field>
              <Field label="Swim CSS" hint="mm:ss / 100m">
                <input className={inputCls} value={f.swimCss} onChange={set('swimCss')} />
              </Field>
              <Field label="Run threshold" hint="mm:ss / km">
                <input className={inputCls} value={f.runPace} onChange={set('runPace')} />
              </Field>
            </div>

            <div className="border-t border-border px-4 py-3">
              <h2 className="text-sm font-semibold">Race target</h2>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <Field label="Race type">
                <select className={inputCls} value={f.raceType} onChange={set('raceType')}>
                  {(Object.keys(raceMeta) as RaceType[]).map((rt) => (
                    <option key={rt} value={rt}>
                      {raceMeta[rt].label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Target time" hint="hh:mm:ss">
                <input className={inputCls} value={f.targetTime} onChange={set('targetTime')} />
              </Field>
              <Field label="Race date">
                <input
                  type="date"
                  className={inputCls}
                  value={f.raceDate || defaultRaceDate}
                  onChange={set('raceDate')}
                />
              </Field>
              <div className="flex items-end">
                <div className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                  {raceMeta[f.raceType].swim} m swim · {raceMeta[f.raceType].bike / 1000} km bike ·{' '}
                  {(raceMeta[f.raceType].run / 1000).toFixed(1)} km run
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border p-4">
              <p className="text-xs text-muted-foreground">
                {projection.weeksToRace} weeks to race · engine seeds the plan on creation
              </p>
              <button
                onClick={() => {
  const newAthlete = {
    name: f.name,
    handle: '',
    location: '',
    age: Number(f.age),
    weightKg: Number(f.weightKg),
    vo2max: Number(f.vo2max),
    ftp: Number(f.ftp),
    thresholdPaceSecPerKm: parseClock(f.runPace),
    thresholdHr: Number(f.restingHr),
    swimCss: parseClock(f.swimCss),
    restingHr: Number(f.restingHr),
    maxHr: 190,
  }

  saveAthlete(newAthlete)
  saveGoals([previewGoal])

  setCreated(true)
}}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {created ? <Check className="size-4" /> : <Waypoints className="size-4" />}
                {created ? 'Plan generated' : 'Create & generate plan'}
              </button>
            </div>
          </div>

          {created && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-[color-mix(in_oklab,var(--tsb)_40%,var(--border))] bg-[color-mix(in_oklab,var(--tsb)_8%,var(--card))] p-4">
              <div className="text-sm">
                <span className="font-semibold text-foreground">{f.name}</span>{' '}
                <span className="text-muted-foreground">
                  created. The engine distributed the {projection.achievable ? 'buffer' : 'gap'} across 3 sports and
                  drafted {projection.weeksToRace} weekly blocks.
                </span>
              </div>
              <Link
                href="/"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Open dashboard <ArrowRight className="size-4" />
              </Link>
            </div>
          )}
        </div>

        {/* live projection */}
        <div className="lg:col-span-2">
          <div className="sticky top-6">
            <ProjectionCard goal={previewGoal} projection={projection} />
            <p className="mt-3 px-1 text-xs text-muted-foreground text-pretty">
              This projection updates live as you edit. When you connect the real engine, this same panel renders its
              output — no UI changes needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
