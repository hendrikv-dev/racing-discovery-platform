"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DiscoveryRace } from "@/lib/discovery";
import { EmptyState } from "@/components/states";

function getMonthLabel(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(date));
}

function getDateLabel(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  }).format(new Date(date));
}

type TimelineSort = "month-asc" | "month-desc" | "championship";

export function TimelineView({ races }: { races: DiscoveryRace[] }) {
  const [sort, setSort] = useState<TimelineSort>("month-asc");

  if (races.length === 0) {
    return <EmptyState title="No races in the timeline" description="The timeline will fill in once races match the active filters." />;
  }

  const sortedRaces = useMemo(() => {
    const timelineRaces = [...races];

    if (sort === "month-desc") {
      return timelineRaces.sort(
        (left, right) => new Date(right.startDate).getTime() - new Date(left.startDate).getTime()
      );
    }

    if (sort === "championship") {
      return timelineRaces.sort((left, right) =>
        left.championshipName.localeCompare(right.championshipName) ||
        new Date(left.startDate).getTime() - new Date(right.startDate).getTime()
      );
    }

    return timelineRaces.sort(
      (left, right) => new Date(left.startDate).getTime() - new Date(right.startDate).getTime()
    );
  }, [races, sort]);

  const nextUpcomingRace =
    sortedRaces.find((race) => race.status === "Upcoming" || race.status === "Live")?.id ?? null;
  const groups = sortedRaces.reduce<Record<string, DiscoveryRace[]>>((accumulator, race) => {
    const key =
      sort === "championship"
        ? `${race.championshipName} · ${getMonthLabel(race.startDate)}`
        : getMonthLabel(race.startDate);
    accumulator[key] ??= [];
    accumulator[key].push(race);
    return accumulator;
  }, {});

  return (
    <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-apex-muted">Sort the timeline</p>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as TimelineSort)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 pr-10 text-sm text-apex-slate outline-none transition duration-200 focus:border-apex-blue"
        >
          <option value="month-asc">Earliest month first</option>
          <option value="month-desc">Latest month first</option>
          <option value="championship">Group by championship</option>
        </select>
      </div>
      <div className="space-y-8">
        {Object.entries(groups).map(([month, monthRaces]) => (
          <div key={month}>
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-apex-muted">
                {month}
              </p>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="space-y-4">
              {monthRaces.map((race) => (
                <div key={race.id} className="grid gap-4 md:grid-cols-[140px_1fr]">
                  <div
                    className="relative overflow-hidden rounded-[18px] bg-slate-100 px-4 py-4 text-sm font-semibold text-white"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(15, 15, 15, 0.28), rgba(15, 15, 15, 0.82)), url('${race.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  >
                    <div className="relative flex min-h-[116px] flex-col justify-end">
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-red-200">
                        Race Date
                      </span>
                      <span className="mt-2 text-2xl font-bold">{getDateLabel(race.startDate)}</span>
                    </div>
                  </div>
                  <div
                    className={`rounded-[22px] border p-5 ${
                      nextUpcomingRace === race.id
                        ? "border-blue-200 bg-blue-50/70"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-apex-slate">{race.name}</h2>
                        <p className="mt-1 text-sm text-apex-muted">
                          {race.championshipName} • {race.trackName}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-apex-slate">
                        {race.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-apex-muted">{race.location}</p>
                    {race.isTracked ? (
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-apex-blue">
                        Tracked race
                      </p>
                    ) : null}
                    <Link
                      href={`/races/${race.slug}`}
                      className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-apex-blue"
                    >
                      Open Race
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
