// ---------------------------------------------------------------------------
// Apex — coaching engine adapter (mock)
//
// This module mirrors the shape of the real goal-driven, feedback-adaptive
// engine. The UI only depends on these types + `predictRace` / `buildPlan`,
// so the real JS engine can later be dropped in behind the same interface.
// ---------------------------------------------------------------------------

import { raceMeta, type RaceType } from './mock-data'

export interface AthleteInput {
  name: string
  age: number
  weightKg: number
  restingHr: number
  vo2max: number
  ftp: number // watts
  swimCss: number // sec / 100m
  runThresholdPaceSecPerKm: number
  raceType: RaceType
  targetTime: string // hh:mm:ss
  raceDate: string // yyyy-mm-dd
}

export type Discipline = 'swim' | 'bike' | 'run'

export interface SplitPrediction {
  discipline: Discipline
  seconds: number
}

export interface RacePrediction {
  swim: number
  bike: number
  run: number
  transitions: number
  total: number
  splits: SplitPrediction[]
}

export interface GapBreakdown {
  discipline: Discipline
  /** seconds that must be found in this discipline to hit target */
  seconds: number
  /** share of total gap 0..1 */
  share: number
}

export interface Projection {
  predicted: RacePrediction
  targetSeconds: number
  gapSeconds: number // predicted - target (positive => work to do)
  achievable: boolean
  breakdown: GapBreakdown[]
  weeksToRace: number
  requiredWeeklyGainSec: number
}

// --- time helpers -----------------------------------------------------------

export function parseTime(hhmmss: string): number {
  const parts = hhmmss.split(':').map((p) => parseInt(p, 10) || 0)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return parts[0]
}

export function formatTime(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export function formatGap(sec: number): string {
  const sign = sec > 0 ? '+' : sec < 0 ? '−' : ''
  return `${sign}${formatTime(Math.abs(sec))}`
}

// --- physiological sub-models (simplified placeholders) --------------------

/** sustainable intensity factor of threshold by race duration family */
const intensityFactor: Record<RaceType, { swim: number; bike: number; run: number }> = {
  sprint: { swim: 1.03, bike: 0.96, run: 0.99 },
  olympic: { swim: 1.06, bike: 0.9, run: 1.04 },
  half: { swim: 1.12, bike: 0.81, run: 1.12 },
  full: { swim: 1.2, bike: 0.7, run: 1.26 },
}

const transitionSec: Record<RaceType, number> = {
  sprint: 150,
  olympic: 210,
  half: 360,
  full: 600,
}

function predictSwim(css: number, meters: number, race: RaceType): number {
  // css is sec/100m at threshold; races run slightly slower than css
  return (meters / 100) * css * intensityFactor[race].swim
}

function predictBike(ftp: number, meters: number, race: RaceType): number {
  const power = ftp * intensityFactor[race].bike
  // empirical flat-course mapping: P ≈ k · v³  (v in m/s), tuned so
  // 248W @ olympic → ~40 km/h. Includes rolling + drivetrain losses.
  const k = 0.16
  const v = Math.cbrt(power / k) // m/s
  return meters / v
}

function predictRun(paceSecPerKm: number, meters: number, race: RaceType, vo2max: number): number {
  // higher VO2max lightly improves endurance durability
  const vo2Adj = 1 - Math.max(-0.03, Math.min(0.03, (vo2max - 55) * 0.0025))
  const pace = paceSecPerKm * intensityFactor[race].run * vo2Adj
  return (meters / 1000) * pace
}

// --- public API -------------------------------------------------------------

export function predictRace(a: AthleteInput): RacePrediction {
  const dist = raceMeta[a.raceType]
  const swim = predictSwim(a.swimCss, dist.swim, a.raceType)
  const bike = predictBike(a.ftp, dist.bike, a.raceType)
  const run = predictRun(a.runThresholdPaceSecPerKm, dist.run, a.raceType, a.vo2max)
  const transitions = transitionSec[a.raceType]
  const total = swim + bike + run + transitions
  return {
    swim,
    bike,
    run,
    transitions,
    total,
    splits: [
      { discipline: 'swim', seconds: swim },
      { discipline: 'bike', seconds: bike },
      { discipline: 'run', seconds: run },
    ],
  }
}

/** how "trainable" each discipline is — where the engine prefers to find time */
const trainability: Record<Discipline, number> = { swim: 0.22, bike: 0.42, run: 0.36 }

export function weeksBetween(fromKey: string, toKey: string): number {
  const from = new Date(fromKey).getTime()
  const to = new Date(toKey).getTime()
  return Math.max(0, Math.round((to - from) / (1000 * 60 * 60 * 24 * 7)))
}

export function project(a: AthleteInput, todayKey: string): Projection {
  const predicted = predictRace(a)
  const targetSeconds = parseTime(a.targetTime)
  const gapSeconds = predicted.total - targetSeconds
  const weeksToRace = Math.max(1, weeksBetween(todayKey, a.raceDate))

  // distribute the gap by trainability weighted by each split's headroom
  const swimShare = trainability.swim * predicted.swim
  const bikeShare = trainability.bike * predicted.bike
  const runShare = trainability.run * predicted.run
  const shareSum = swimShare + bikeShare + runShare
  const raw: Record<Discipline, number> = {
    swim: swimShare / shareSum,
    bike: bikeShare / shareSum,
    run: runShare / shareSum,
  }

  const gapToClose = Math.max(0, gapSeconds)
  const breakdown: GapBreakdown[] = (['swim', 'bike', 'run'] as Discipline[]).map((d) => ({
    discipline: d,
    seconds: gapToClose * raw[d],
    share: raw[d],
  }))

  return {
    predicted,
    targetSeconds,
    gapSeconds,
    achievable: gapSeconds <= 0,
    breakdown,
    weeksToRace,
    requiredWeeklyGainSec: gapToClose / weeksToRace,
  }
}

export const disciplineLabel: Record<Discipline, string> = {
  swim: 'Swim',
  bike: 'Bike',
  run: 'Run',
}
