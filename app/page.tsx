import { DashboardContent } from "@/components/dashboard-content";
import { getDashboard } from "@/lib/api/dashboard";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import {
  formatDuration,
  todayKey,
  today,
} from "@/lib/mock-data";
import { Card, CardHeader, PageHeader, StatTile } from "@/components/kit";
import { FormChart } from "@/components/charts/form-chart";
import { LoadBars } from "@/components/charts/load-bars";
import { WorkoutCard } from "@/components/workout-card";
import { ProjectionCard } from "@/components/projection-card";
import { DashboardRaceCard } from "@/components/dashboard-race-card";
import { getGoals } from "@/lib/store";
import { createProjection } from "@/lib/projection";


function engineAdvice(tsb: number) {
  if (tsb < -25)
    return {
      tone: "Manage fatigue",
      text: "Form is deeply negative. The engine reduced today’s intensity and inserted extra recovery to protect adaptation.",
    };
  if (tsb < -10)
    return {
      tone: "Productive fatigue",
      text: "You are absorbing a solid training load. Hold the plan, prioritise sleep and fueling around key sessions.",
    };
  if (tsb < 5)
    return {
      tone: "Balanced",
      text: "Form is neutral — a good window for quality work. The engine scheduled a threshold focus today.",
    };
  return {
    tone: "Fresh",
    text: "You are well rested. The engine added a sharpening session to convert freshness into race fitness.",
  };
}

function daysUntil(dateKey: string) {
  const d = new Date(dateKey);
  const t = new Date(todayKey);
  return Math.round((d.getTime() - t.getTime()) / 86400000);
}

export default async function DashboardPage() {
  const dashboard = await getDashboard();
  const todays = dashboard.workouts.today;
  const advice = engineAdvice(dashboard.metrics.current.tsb);

  
  const storedGoals = getGoals();

  const primaryGoal = storedGoals[0];

  const primaryProjection = primaryGoal ? createProjection(primaryGoal) : null;

  // this week planned vs completed
  const weekWorkouts = dashboard.workouts.week;
  const plannedTss = weekWorkouts.reduce((s, w) => s + w.plannedTss, 0);
  const doneTss = weekWorkouts.reduce((s, w) => s + (w.completed?.tss ?? 0), 0);
  const plannedMin = weekWorkouts.reduce((s, w) => s + w.plannedDurationMin, 0);

  // ramp: CTL change last 7 days
  const ramp = dashboard.metrics.current.ramp;

  const dateLong = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    
        <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
          <PageHeader
            eyebrow={dateLong}
            title={`Good morning, ${dashboard.athlete.name.split(' ')[0]}`}
            subtitle="Here is where your fitness stands and what the engine has planned."
            actions={
              <Link
                href="/onboarding"
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                Athlete & target
              </Link>
            }
          />

          {/* Adaptive engine banner */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-4 md:p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-primary">
                    Engine · {advice.tone}
                  </span>
                </div>
                <p className="mt-1 text-sm text-pretty text-foreground/90">
                  {advice.text}
                </p>
              </div>
            </div>
          </div>

          <DashboardContent />

          {/* Stat tiles */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile
              label="Form (TSB)"
              value={
                dashboard.metrics.current.tsb > 0
                  ? `+${Math.round(dashboard.metrics.current.tsb)}`
                  : Math.round(dashboard.metrics.current.tsb)
              }
              accent="var(--tsb)"
              hint={
                dashboard.metrics.current.tsb < -10
                  ? "Carrying fatigue"
                  : dashboard.metrics.current.tsb > 5
                    ? "Fresh & ready"
                    : "Balanced"
              }
            />
            <StatTile
              label="Fitness (CTL)"
              value={Math.round(dashboard.metrics.current.ctl)}
              accent="var(--ctl)"
              hint="42-day load"
            />
            <StatTile
              label="Fatigue (ATL)"
              value={Math.round(dashboard.metrics.current.atl)}
              accent="var(--atl)"
              hint="7-day load"
            />
            <StatTile
              label="Ramp rate"
              value={ramp > 0 ? `+${ramp}` : ramp}
              unit="CTL/wk"
              hint={ramp > 7 ? "Aggressive — watch fatigue" : "Sustainable"}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: charts */}
            <div className="space-y-6 lg:col-span-2">
              {primaryGoal && primaryProjection && (
                <ProjectionCard
                  goal={primaryGoal}
                  projection={primaryProjection}
                />
              )}

              <Card>
                <CardHeader
                  title="Fitness & Form trend"
                  hint="Chronic vs acute load with resulting form (12 weeks)"
                />
                <div className="p-4">
                  <FormChart
  data={dashboard.metrics.history.map((m) => ({
    ...m,
    tss: 0,
  }))}
  todayKey={todayKey}
/>
                </div>
              </Card>

              <Card>
                <CardHeader
                  title="Weekly training load"
                  hint="TSS by discipline · dashed = planned"
                />
                <div className="p-4">
                  <LoadBars data={dashboard.weeklyLoad} />
                </div>
              </Card>
            </div>

            {/* Right: today + race */}
            <div className="space-y-6">
              <Card>
                <CardHeader
                  title="Today"
                  hint={`${weekWorkouts.length ? formatDuration(plannedMin) : "—"} planned this week`}
                  action={
                    <Link
                      href="/calendar"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      Calendar <ArrowUpRight className="size-3.5" />
                    </Link>
                  }
                />
                <div className="space-y-2 p-3">
                  {todays.length === 0 && (
                    <p className="px-1 py-6 text-center text-sm text-muted-foreground">
                      No sessions scheduled.
                    </p>
                  )}
                  {todays.map((w) => (
                    <WorkoutCard key={w.id} workout={w} />
                  ))}
                </div>
              </Card>

              <DashboardRaceCard />

              <Card>
                <CardHeader title="This week" hint="Compliance vs plan" />
                <div className="p-4">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Completed load
                    </span>
                    <span className="font-mono font-semibold">
                      {doneTss} / {plannedTss} TSS
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-[var(--tsb)]"
                      style={{
                        width: `${plannedTss ? Math.min(100, (doneTss / plannedTss) * 100) : 0}%`,
                      }}
                    />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground text-pretty">
                    {Math.round(plannedTss ? (doneTss / plannedTss) * 100 : 0)}%
                    of planned load logged so far this week.
                  </p>
                </div>
              </Card>
            </div>
          </div>
                </div>
      
  );
}
