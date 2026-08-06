// ---------------------------------------------------------------------------
// Apex — mock data layer
// Shapes here mirror what the coaching engine is expected to emit so that the
// real engine can later be plugged in with minimal UI changes.
// ---------------------------------------------------------------------------

export type Sport = "swim" | "bike" | "run" | "strength" | "rest";

export type Intensity =
  | "recovery"
  | "endurance"
  | "tempo"
  | "threshold"
  | "vo2"
  | "anaerobic";

export type WorkoutStatus = "planned" | "completed" | "missed";

export type ZoneKey = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Interval {
  label: string;
  durationSec: number;
  zone: ZoneKey;
  /** target range low/high as % of threshold (power or pace) */
  targetLow: number;
  targetHigh: number;
}

export interface CompletedData {
  durationMin: number;
  tss: number;
  distance: number; // meters
  avgHr?: number;
  maxHr?: number;
  avgPower?: number;
  normPower?: number;
  avgPaceSecPerKm?: number;
  avgSpeedKmh?: number;
  rpe: number; // 1-10
  feeling: "great" | "good" | "ok" | "tired" | "bad";
  compliance: number; // 0-100, how close to plan
}

export interface Workout {
  id: string;
  date: string; // yyyy-mm-dd
  sport: Sport;
  title: string;
  focus: string;
  description: string;
  intensity: Intensity;
  plannedDurationMin: number;
  plannedTss: number;
  plannedDistance: number; // meters
  status: WorkoutStatus;
  /** planned minutes spent in each zone Z1..Z7 */
  zoneMinutes: number[];
  intervals: Interval[];
  completed?: CompletedData;
  /** engine annotation — why this session exists */
  rationale: string;
}

export interface DayMetric {
  date: string;
  tss: number;
  ctl: number; // fitness (chronic)
  atl: number; // fatigue (acute)
  tsb: number; // form (ctl - atl, previous day)
}

export type PhaseKind =
  | "base"
  | "build"
  | "peak"
  | "taper"
  | "race"
  | "transition";

export interface SeasonBlock {
  id: string;
  name: string;
  kind: PhaseKind;
  startDate: string;
  endDate: string;
  weeklyHours: number;
  focus: string;
}

export interface Goal {
  id: string;
  title: string;
  raceType: string;
  /** engine distance family, when this goal is a triathlon */
  distance?: RaceType;
  date: string;
  location: string;
  priority: "A" | "B" | "C";
  targetTime: string;
  progress: number; // 0-100 readiness
  notes: string;
}

export interface Athlete {
  name: string;
  handle: string;
  location: string;
  age: number;
  weightKg: number;
  vo2max: number; // ml/kg/min
  ftp: number; // cycling FTP watts
  thresholdPaceSecPerKm: number; // running threshold pace
  thresholdHr: number;
  swimCss: number; // critical swim speed sec/100m
  restingHr: number;
  maxHr: number;
}

/** Race distance families the engine can plan for */
export type RaceType = "sprint" | "olympic" | "half" | "full";

export const raceMeta: Record<
  RaceType,
  { label: string; short: string; swim: number; bike: number; run: number }
> = {
  sprint: {
    label: "Sprint",
    short: "Sprint",
    swim: 750,
    bike: 20000,
    run: 5000,
  },
  olympic: {
    label: "Olympic",
    short: "Olympic",
    swim: 1500,
    bike: 40000,
    run: 10000,
  },
  half: {
    label: "Half Iron (70.3)",
    short: "70.3",
    swim: 1900,
    bike: 90000,
    run: 21100,
  },
  full: {
    label: "Full Iron",
    short: "IM",
    swim: 3800,
    bike: 180000,
    run: 42200,
  },
};

// --- static profile -------------------------------------------------------

export const athlete: Athlete = {
  name: "Mira Kovač",
  handle: "@mirakovac",
  location: "Split, HR",
  age: 31,
  weightKg: 61,
  vo2max: 58,
  ftp: 248,
  thresholdPaceSecPerKm: 258, // 4:18 /km
  thresholdHr: 172,
  swimCss: 92, // 1:32 /100m
  restingHr: 46,
  maxHr: 189,
};

// --- meta / display maps ---------------------------------------------------

export const sportMeta: Record<
  Sport,
  { label: string; icon: string; color: string; short: string }
> = {
  swim: { label: "Swim", icon: "waves", color: "var(--swim)", short: "SW" },
  bike: { label: "Bike", icon: "bike", color: "var(--bike)", short: "BK" },
  run: { label: "Run", icon: "footprints", color: "var(--run)", short: "RN" },
  strength: {
    label: "Strength",
    icon: "dumbbell",
    color: "var(--strength)",
    short: "ST",
  },
  rest: { label: "Rest", icon: "moon", color: "var(--rest)", short: "RE" },
};

export const intensityMeta: Record<
  Intensity,
  { label: string; zone: ZoneKey }
> = {
  recovery: { label: "Recovery", zone: 1 },
  endurance: { label: "Endurance", zone: 2 },
  tempo: { label: "Tempo", zone: 3 },
  threshold: { label: "Threshold", zone: 4 },
  vo2: { label: "VO2 Max", zone: 5 },
  anaerobic: { label: "Anaerobic", zone: 6 },
};

export const zoneMeta: Record<
  ZoneKey,
  { label: string; short: string; color: string; desc: string }
> = {
  1: {
    label: "Z1 Recovery",
    short: "Z1",
    color: "var(--zone-1)",
    desc: "Active recovery",
  },
  2: {
    label: "Z2 Endurance",
    short: "Z2",
    color: "var(--zone-2)",
    desc: "Aerobic base",
  },
  3: {
    label: "Z3 Tempo",
    short: "Z3",
    color: "var(--zone-3)",
    desc: "Steady tempo",
  },
  4: {
    label: "Z4 Threshold",
    short: "Z4",
    color: "var(--zone-4)",
    desc: "Lactate threshold",
  },
  5: { label: "Z5 VO2", short: "Z5", color: "var(--zone-5)", desc: "VO2 max" },
  6: {
    label: "Z6 Anaerobic",
    short: "Z6",
    color: "var(--zone-6)",
    desc: "Anaerobic capacity",
  },
  7: {
    label: "Z7 Neuro",
    short: "Z7",
    color: "var(--zone-7)",
    desc: "Neuromuscular",
  },
};

export const phaseMeta: Record<PhaseKind, { label: string; color: string }> = {
  base: { label: "Base", color: "var(--zone-2)" },
  build: { label: "Build", color: "var(--zone-4)" },
  peak: { label: "Peak", color: "var(--zone-5)" },
  taper: { label: "Taper", color: "var(--zone-3)" },
  race: { label: "Race", color: "var(--zone-6)" },
  transition: { label: "Transition", color: "var(--zone-1)" },
};

// --- date helpers -----------------------------------------------------------

function toKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

/** Monday-based start of week */
export function startOfWeek(d: Date): Date {
  const copy = new Date(d);
  const day = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

// anchor "today" — normalized to local midnight
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);
export const today = TODAY;
export const todayKey = toKey(TODAY);

// --- seeded RNG for stable "random" texture --------------------------------

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20240426);

// ---------------------------------------------------------------------------
// Season plan
// ---------------------------------------------------------------------------

const seasonStart = startOfWeek(addDays(TODAY, -7 * 9));

export const seasonBlocks: SeasonBlock[] = [
  {
    id: "b1",
    name: "Base 1 — Aerobic",
    kind: "base",
    startDate: toKey(seasonStart),
    endDate: toKey(addDays(seasonStart, 7 * 4 - 1)),
    weeklyHours: 11,
    focus: "Aerobic volume, technique, durability",
  },
  {
    id: "b2",
    name: "Base 2 — Strength",
    kind: "base",
    startDate: toKey(addDays(seasonStart, 7 * 4)),
    endDate: toKey(addDays(seasonStart, 7 * 7 - 1)),
    weeklyHours: 12,
    focus: "Muscular endurance, tempo, hills",
  },
  {
    id: "b3",
    name: "Build 1 — Threshold",
    kind: "build",
    startDate: toKey(addDays(seasonStart, 7 * 7)),
    endDate: toKey(addDays(seasonStart, 7 * 11 - 1)),
    weeklyHours: 13,
    focus: "Threshold power & race-pace specificity",
  },
  {
    id: "b4",
    name: "Build 2 — VO2",
    kind: "build",
    startDate: toKey(addDays(seasonStart, 7 * 11)),
    endDate: toKey(addDays(seasonStart, 7 * 14 - 1)),
    weeklyHours: 12,
    focus: "VO2 max, race simulations, brick runs",
  },
  {
    id: "b5",
    name: "Peak",
    kind: "peak",
    startDate: toKey(addDays(seasonStart, 7 * 14)),
    endDate: toKey(addDays(seasonStart, 7 * 16 - 1)),
    weeklyHours: 10,
    focus: "Sharpening, race pace, freshness",
  },
  {
    id: "b6",
    name: "Taper & Race",
    kind: "taper",
    startDate: toKey(addDays(seasonStart, 7 * 16)),
    endDate: toKey(addDays(seasonStart, 7 * 18 - 1)),
    weeklyHours: 6,
    focus: "Reduce fatigue, hold sharpness",
  },
];

export const goals: Goal[] = [
  {
    id: "g1",
    title: "Ironman 70.3 Istria",
    raceType: "Half Iron (70.3)",
    distance: "half",
    date: toKey(addDays(seasonStart, 7 * 17 + 6)),
    location: "Poreč, HR",
    priority: "A",
    targetTime: "4:25:00",
    progress: 68,
    notes:
      "Season A-race. Target 5:05/km run off the bike, 21.5 min/40k FTP hold.",
  },
  {
    id: "g2",
    title: "Split Olympic Tri",
    raceType: "Olympic",
    distance: "olympic",
    date: toKey(addDays(TODAY, 7 * 3 + 2)),
    location: "Split, HR",
    priority: "B",
    targetTime: "2:11:00",
    progress: 81,
    notes: "Tune-up race. Practice open-water starts and T1 flow.",
  },
  {
    id: "g3",
    title: "Marjan Trail 15k",
    raceType: "Run",
    date: toKey(addDays(TODAY, -7 * 2 + 1)),
    location: "Split, HR",
    priority: "C",
    targetTime: "1:04:00",
    progress: 100,
    notes: "Completed — threshold test in race conditions.",
  },
];

// ---------------------------------------------------------------------------
// Metric history (CTL / ATL / TSB) over ~12 weeks
// ---------------------------------------------------------------------------

function buildMetrics(): DayMetric[] {
  const days = 7 * 12 + 7; // 12 weeks history + current week
  const start = addDays(TODAY, -(days - 7));
  const metrics: DayMetric[] = [];
  let ctl = 42;
  let atl = 44;

  for (let i = 0; i < days; i++) {
    const date = addDays(start, i);
    const dow = (date.getDay() + 6) % 7;
    const weekIndex = Math.floor(i / 7);
    const isFuture = date > TODAY;

    // weekly ramp with a recovery week every 4th
    const recoveryWeek = weekIndex % 4 === 3;
    const base = recoveryWeek ? 40 : 78 + weekIndex * 3.5;

    let tss = 0;
    if (dow === 6)
      tss = 0; // rest day
    else if (dow === 2) tss = base * 0.55 * (0.9 + rand() * 0.2);
    else if (dow === 5)
      tss = base * 1.8 * (0.9 + rand() * 0.2); // long day
    else tss = base * (0.85 + rand() * 0.35);

    tss = Math.round(tss);

    const prevTsb = ctl - atl;
    ctl = ctl + (tss - ctl) * (1 / 42);
    atl = atl + (tss - atl) * (1 / 7);

    metrics.push({
      date: toKey(date),
      tss: isFuture ? tss : tss,
      ctl: Math.round(ctl * 10) / 10,
      atl: Math.round(atl * 10) / 10,
      tsb: Math.round(prevTsb * 10) / 10,
    });
  }
  return metrics;
}

export const metrics: DayMetric[] = buildMetrics();

export const currentMetric =
  metrics.find((m) => m.date === todayKey) ?? metrics[metrics.length - 8];

// weekly aggregated load for bar charts
export interface WeekLoad {
  weekStart: string;
  label: string;
  tss: number;
  hours: number;
  swim: number;
  bike: number;
  run: number;
  strength: number;
  planned: boolean;
}

export function buildWeeklyLoad(): WeekLoad[] {
  const weeks: WeekLoad[] = [];
  const firstWeek = startOfWeek(new Date(metrics[0].date));
  for (let w = 0; w < 13; w++) {
    const ws = addDays(firstWeek, w * 7);
    const wsKey = toKey(ws);
    const weKey = toKey(addDays(ws, 7));
    const inWeek = metrics.filter((m) => m.date >= wsKey && m.date < weKey);
    const tss = inWeek.reduce((s, m) => s + m.tss, 0);
    const swim = Math.round(tss * (0.18 + rand() * 0.05));
    const bike = Math.round(tss * (0.42 + rand() * 0.05));
    const run = Math.round(tss * (0.28 + rand() * 0.05));
    const strength = Math.max(0, tss - swim - bike - run);
    weeks.push({
      weekStart: wsKey,
      label: `${ws.getDate()}/${ws.getMonth() + 1}`,
      tss,
      hours: Math.round((tss / 62) * 10) / 10,
      swim,
      bike,
      run,
      strength,
      planned: ws > TODAY,
    });
  }
  return weeks;
}

export const weeklyLoad = buildWeeklyLoad();

// ---------------------------------------------------------------------------
// Workouts — current visible range (prev 2 weeks .. next 2 weeks)
// ---------------------------------------------------------------------------

function zoneSplit(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => Math.round((w / sum) * total));
}

type Template = {
  sport: Sport;
  title: string;
  focus: string;
  intensity: Intensity;
  dur: number;
  tss: number;
  dist: number;
  zoneWeights: number[];
  intervals: Interval[];
  description: string;
  rationale: string;
};

const templates: Record<string, Template> = {
  swimTechnique: {
    sport: "swim",
    title: "Technique + Aerobic",
    focus: "Form & feel",
    intensity: "endurance",
    dur: 60,
    tss: 42,
    dist: 2800,
    zoneWeights: [3, 6, 1, 0, 0, 0, 0],
    description: "400 WU • 8×50 drill • 6×200 @ CSS+5 • 200 CD",
    rationale: "Maintain stroke economy under low fatigue; protect shoulders.",
    intervals: [
      {
        label: "Warm-up",
        durationSec: 600,
        zone: 1,
        targetLow: 60,
        targetHigh: 70,
      },
      {
        label: "Drills 8×50",
        durationSec: 720,
        zone: 2,
        targetLow: 70,
        targetHigh: 80,
      },
      {
        label: "Main 6×200",
        durationSec: 1440,
        zone: 3,
        targetLow: 88,
        targetHigh: 95,
      },
      {
        label: "Cool-down",
        durationSec: 300,
        zone: 1,
        targetLow: 55,
        targetHigh: 65,
      },
    ],
  },
  swimThreshold: {
    sport: "swim",
    title: "CSS Intervals",
    focus: "Threshold speed",
    intensity: "threshold",
    dur: 70,
    tss: 62,
    dist: 3300,
    zoneWeights: [2, 3, 2, 5, 1, 0, 0],
    description: "600 WU • 10×100 @ CSS w/ 15s • 400 pull • CD",
    rationale: "Raise critical swim speed toward 70.3 pace demands.",
    intervals: [
      {
        label: "Warm-up",
        durationSec: 720,
        zone: 1,
        targetLow: 60,
        targetHigh: 70,
      },
      {
        label: "10×100 CSS",
        durationSec: 1500,
        zone: 4,
        targetLow: 98,
        targetHigh: 103,
      },
      {
        label: "Pull 400",
        durationSec: 600,
        zone: 2,
        targetLow: 75,
        targetHigh: 82,
      },
      {
        label: "Cool-down",
        durationSec: 360,
        zone: 1,
        targetLow: 55,
        targetHigh: 65,
      },
    ],
  },
  bikeEndurance: {
    sport: "bike",
    title: "Aerobic Endurance",
    focus: "Z2 base",
    intensity: "endurance",
    dur: 120,
    tss: 88,
    dist: 52000,
    zoneWeights: [2, 9, 2, 0, 0, 0, 0],
    description: "2h steady Z2, cadence 90-95, 3×5min tempo surges",
    rationale: "Build aerobic durability and fat oxidation for long course.",
    intervals: [
      {
        label: "Warm-up",
        durationSec: 600,
        zone: 1,
        targetLow: 50,
        targetHigh: 60,
      },
      {
        label: "Steady Z2",
        durationSec: 3600,
        zone: 2,
        targetLow: 65,
        targetHigh: 75,
      },
      {
        label: "Tempo surges 3×5",
        durationSec: 900,
        zone: 3,
        targetLow: 84,
        targetHigh: 90,
      },
      {
        label: "Steady Z2",
        durationSec: 1800,
        zone: 2,
        targetLow: 65,
        targetHigh: 74,
      },
      {
        label: "Cool-down",
        durationSec: 300,
        zone: 1,
        targetLow: 45,
        targetHigh: 55,
      },
    ],
  },
  bikeThreshold: {
    sport: "bike",
    title: "FTP Over-Unders",
    focus: "Threshold",
    intensity: "threshold",
    dur: 90,
    tss: 105,
    dist: 40000,
    zoneWeights: [2, 3, 2, 7, 1, 0, 0],
    description: "20 WU • 3×(2min@105% / 3min@95%) ×3 sets • CD",
    rationale: "Push FTP and lactate clearance; core race-pace power.",
    intervals: [
      {
        label: "Warm-up",
        durationSec: 1200,
        zone: 1,
        targetLow: 50,
        targetHigh: 65,
      },
      {
        label: "Set 1 O/U",
        durationSec: 900,
        zone: 4,
        targetLow: 95,
        targetHigh: 105,
      },
      {
        label: "Recover",
        durationSec: 300,
        zone: 1,
        targetLow: 50,
        targetHigh: 58,
      },
      {
        label: "Set 2 O/U",
        durationSec: 900,
        zone: 4,
        targetLow: 95,
        targetHigh: 105,
      },
      {
        label: "Recover",
        durationSec: 300,
        zone: 1,
        targetLow: 50,
        targetHigh: 58,
      },
      {
        label: "Set 3 O/U",
        durationSec: 900,
        zone: 4,
        targetLow: 95,
        targetHigh: 106,
      },
      {
        label: "Cool-down",
        durationSec: 600,
        zone: 1,
        targetLow: 45,
        targetHigh: 55,
      },
    ],
  },
  bikeVo2: {
    sport: "bike",
    title: "VO2 Max 5×4",
    focus: "VO2 max",
    intensity: "vo2",
    dur: 75,
    tss: 98,
    dist: 34000,
    zoneWeights: [2, 3, 1, 2, 6, 1, 0],
    description: "20 WU • 5×4min @ 118% / 4min easy • CD",
    rationale: "Lift aerobic ceiling during build; race-winning top-end.",
    intervals: [
      {
        label: "Warm-up",
        durationSec: 1200,
        zone: 1,
        targetLow: 50,
        targetHigh: 65,
      },
      {
        label: "5×4 VO2",
        durationSec: 2400,
        zone: 5,
        targetLow: 113,
        targetHigh: 122,
      },
      {
        label: "Recoveries",
        durationSec: 1200,
        zone: 1,
        targetLow: 50,
        targetHigh: 58,
      },
      {
        label: "Cool-down",
        durationSec: 480,
        zone: 1,
        targetLow: 45,
        targetHigh: 55,
      },
    ],
  },
  runEasy: {
    sport: "run",
    title: "Easy Aerobic Run",
    focus: "Recovery / base",
    intensity: "endurance",
    dur: 50,
    tss: 46,
    dist: 9500,
    zoneWeights: [3, 8, 1, 0, 0, 0, 0],
    description: "50min easy, nose-breathing, strides 4×20s at end",
    rationale: "Aerobic maintenance without adding fatigue load.",
    intervals: [
      {
        label: "Easy Z2",
        durationSec: 2700,
        zone: 2,
        targetLow: 70,
        targetHigh: 78,
      },
      {
        label: "Strides 4×20s",
        durationSec: 300,
        zone: 5,
        targetLow: 110,
        targetHigh: 125,
      },
    ],
  },
  runThreshold: {
    sport: "run",
    title: "Threshold Repeats",
    focus: "Lactate threshold",
    intensity: "threshold",
    dur: 65,
    tss: 84,
    dist: 13500,
    zoneWeights: [2, 3, 1, 6, 1, 0, 0],
    description: "15 WU • 4×6min @ threshold / 90s jog • 10 CD",
    rationale: "Sharpen run threshold to hold 70.3 pace off the bike.",
    intervals: [
      {
        label: "Warm-up",
        durationSec: 900,
        zone: 1,
        targetLow: 65,
        targetHigh: 75,
      },
      {
        label: "4×6 Threshold",
        durationSec: 1440,
        zone: 4,
        targetLow: 97,
        targetHigh: 103,
      },
      {
        label: "Jog recoveries",
        durationSec: 360,
        zone: 1,
        targetLow: 60,
        targetHigh: 68,
      },
      {
        label: "Cool-down",
        durationSec: 600,
        zone: 1,
        targetLow: 62,
        targetHigh: 70,
      },
    ],
  },
  brick: {
    sport: "bike",
    title: "Brick — Bike + Run",
    focus: "Race simulation",
    intensity: "tempo",
    dur: 150,
    tss: 135,
    dist: 62000,
    zoneWeights: [2, 6, 5, 3, 0, 0, 0],
    description: "2h bike w/ 3×15min race pace • T2 • 30min run off bike",
    rationale:
      "Rehearse race intensity and transitions; train run legs fatigued.",
    intervals: [
      {
        label: "Bike warm-up",
        durationSec: 900,
        zone: 1,
        targetLow: 50,
        targetHigh: 62,
      },
      {
        label: "Bike race pace 3×15",
        durationSec: 2700,
        zone: 3,
        targetLow: 82,
        targetHigh: 90,
      },
      {
        label: "Bike steady",
        durationSec: 2400,
        zone: 2,
        targetLow: 68,
        targetHigh: 76,
      },
      {
        label: "Run off bike",
        durationSec: 1800,
        zone: 3,
        targetLow: 85,
        targetHigh: 92,
      },
    ],
  },
  longRun: {
    sport: "run",
    title: "Long Run",
    focus: "Endurance",
    intensity: "endurance",
    dur: 100,
    tss: 96,
    dist: 21000,
    zoneWeights: [2, 9, 2, 0, 0, 0, 0],
    description: "1h40 steady, last 20min at marathon effort, fuel every 25min",
    rationale: "Build run durability and fueling for long-course demand.",
    intervals: [
      {
        label: "Steady Z2",
        durationSec: 4800,
        zone: 2,
        targetLow: 70,
        targetHigh: 78,
      },
      {
        label: "Finish MP",
        durationSec: 1200,
        zone: 3,
        targetLow: 84,
        targetHigh: 90,
      },
    ],
  },
  strength: {
    sport: "strength",
    title: "Strength — Max",
    focus: "Force",
    intensity: "tempo",
    dur: 45,
    tss: 30,
    dist: 0,
    zoneWeights: [4, 4, 2, 0, 0, 0, 0],
    description: "Squat 4×5, RDL 3×6, single-leg, core circuit",
    rationale: "Preserve force & injury resilience through the build.",
    intervals: [
      {
        label: "Mobility",
        durationSec: 600,
        zone: 1,
        targetLow: 40,
        targetHigh: 55,
      },
      {
        label: "Main lifts",
        durationSec: 1500,
        zone: 2,
        targetLow: 60,
        targetHigh: 75,
      },
      {
        label: "Core circuit",
        durationSec: 600,
        zone: 3,
        targetLow: 70,
        targetHigh: 85,
      },
    ],
  },
  rest: {
    sport: "rest",
    title: "Rest Day",
    focus: "Recovery",
    intensity: "recovery",
    dur: 0,
    tss: 0,
    dist: 0,
    zoneWeights: [1, 0, 0, 0, 0, 0, 0],
    description: "Full rest. Optional 15min mobility + 8h sleep target.",
    rationale: "Absorb training. Adaptation happens on rest days.",
    intervals: [],
  },
};

// weekly pattern (Mon..Sun) by template key
const weekPattern: string[][] = [
  // a typical build week
  ["swimTechnique", "runEasy"],
  ["bikeThreshold", "strength"],
  ["swimThreshold"],
  ["bikeVo2", "runEasy"],
  ["runThreshold"],
  ["brick"],
  ["rest"],
];

const altPattern: string[][] = [
  ["swimTechnique", "strength"],
  ["bikeEndurance"],
  ["swimThreshold", "runEasy"],
  ["bikeThreshold"],
  ["runThreshold", "swimTechnique"],
  ["longRun"],
  ["rest"],
];

function paceFromZone(base: number, zone: ZoneKey): number {
  // returns avg pace sec/km given threshold pace base
  const factor: Record<ZoneKey, number> = {
    1: 1.28,
    2: 1.16,
    3: 1.06,
    4: 1.0,
    5: 0.93,
    6: 0.88,
    7: 0.84,
  };
  return Math.round(base * factor[zone]);
}

function buildWorkouts(): Workout[] {
  const out: Workout[] = [];
  const rangeStart = startOfWeek(addDays(TODAY, -7 * 2));
  const totalDays = 7 * 5; // 5 weeks visible

  for (let i = 0; i < totalDays; i++) {
    const date = addDays(rangeStart, i);
    const dateKey = toKey(date);
    const dow = (date.getDay() + 6) % 7;
    const weekIdx = Math.floor(i / 7);
    const pattern = weekIdx % 2 === 0 ? weekPattern : altPattern;
    const keys = pattern[dow];
    const isPast = date < TODAY;
    const isToday = dateKey === todayKey;

    keys.forEach((key, idx) => {
      const t = templates[key];
      const zoneMinutes = zoneSplit(t.dur, t.zoneWeights);
      const id = `${dateKey}-${key}-${idx}`;

      let status: WorkoutStatus = "planned";
      let completed: CompletedData | undefined;

      if (t.sport === "rest") {
        status = isPast || isToday ? "completed" : "planned";
      } else if (isPast) {
        // most sessions done, a couple missed
        const roll = rand();
        if (roll > 0.9) {
          status = "missed";
        } else {
          status = "completed";
          const comp = 0.9 + rand() * 0.15;
          const durationMin = Math.round(t.dur * comp);
          const tss = Math.round(t.tss * comp);
          const mainZone =
            t.zoneWeights.indexOf(Math.max(...t.zoneWeights)) + 1;
          completed = {
            durationMin,
            tss,
            distance: Math.round(t.dist * comp),
            rpe: Math.min(
              10,
              Math.round(
                (intensityMeta[t.intensity].zone + 2) * (0.9 + rand() * 0.2),
              ),
            ),
            feeling: (["great", "good", "good", "ok", "tired"] as const)[
              Math.floor(rand() * 5)
            ],
            compliance: Math.round(comp * 100),
            avgHr:
              t.sport === "strength"
                ? undefined
                : Math.round(
                    athlete.thresholdHr *
                      (0.82 + intensityMeta[t.intensity].zone * 0.03),
                  ),
            maxHr:
              t.sport === "strength"
                ? undefined
                : Math.round(athlete.maxHr * (0.86 + rand() * 0.08)),
            avgPower:
              t.sport === "bike"
                ? Math.round(
                    athlete.ftp *
                      (0.62 + intensityMeta[t.intensity].zone * 0.06),
                  )
                : undefined,
            normPower:
              t.sport === "bike"
                ? Math.round(
                    athlete.ftp *
                      (0.68 + intensityMeta[t.intensity].zone * 0.06),
                  )
                : undefined,
            avgPaceSecPerKm:
              t.sport === "run"
                ? paceFromZone(
                    athlete.thresholdPaceSecPerKm,
                    mainZone as ZoneKey,
                  )
                : undefined,
            avgSpeedKmh:
              t.sport === "bike"
                ? Math.round((t.dist / 1000 / (durationMin / 60)) * 10) / 10
                : undefined,
          };
        }
      } else if (isToday && t.sport !== "rest") {
        status = "planned";
      }

      out.push({
        id,
        date: dateKey,
        sport: t.sport,
        title: t.title,
        focus: t.focus,
        description: t.description,
        intensity: t.intensity,
        plannedDurationMin: t.dur,
        plannedTss: t.tss,
        plannedDistance: t.dist,
        status,
        zoneMinutes,
        intervals: t.intervals,
        completed,
        rationale: t.rationale,
      });
    });
  }
  return out;
}

export const workouts: Workout[] = buildWorkouts();

export function getWorkout(id: string): Workout | undefined {
  return workouts.find((w) => w.id === id);
}

export function workoutsForDate(dateKey: string): Workout[] {
  return workouts.filter((w) => w.date === dateKey);
}

export function workoutsInRange(startKey: string, endKey: string): Workout[] {
  return workouts.filter((w) => w.date >= startKey && w.date <= endKey);
}

// --- small formatting helpers ----------------------------------------------

export function formatDuration(min: number): string {
  if (!min) return "—";
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h > 0 ? `${h}h ${m.toString().padStart(2, "0")}m` : `${m}m`;
}

export function formatPace(secPerKm?: number): string {
  if (!secPerKm) return "—";
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${s.toString().padStart(2, "0")}/km`;
}

export function formatDistance(meters: number): string {
  if (!meters) return "—";
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDateLabel(key: string): string {
  const d = new Date(key);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
