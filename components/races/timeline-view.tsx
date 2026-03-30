import Link from "next/link";
import { DiscoveryRace } from "@/lib/discovery";

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

export function TimelineView({ races }: { races: DiscoveryRace[] }) {
  const nextUpcomingRace =
    races.find((race) => race.status === "Upcoming" || race.status === "Live")?.id ?? null;
  const groups = races.reduce<Record<string, DiscoveryRace[]>>((accumulator, race) => {
    const key = getMonthLabel(race.startDate);
    accumulator[key] ??= [];
    accumulator[key].push(race);
    return accumulator;
  }, {});

  return (
    <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
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
                  <div className="rounded-[18px] bg-slate-100 px-4 py-4 text-sm font-semibold text-apex-slate">
                    {getDateLabel(race.startDate)}
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
