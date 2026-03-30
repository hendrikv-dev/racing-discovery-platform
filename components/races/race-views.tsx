import Link from "next/link";
import { DiscoveryRace, RaceFilters } from "@/lib/discovery";
import { RaceMap } from "@/components/maps/race-map";
import { TrackRaceButton } from "@/components/tracking/track-race-button";

export type RaceViewMode = "list" | "calendar" | "timeline" | "map";

const viewLabels: Array<{ value: RaceViewMode; label: string; description: string }> = [
  { value: "list", label: "List", description: "Card-based discovery for scanning the full race slate." },
  { value: "calendar", label: "Calendar", description: "Month grid with event chips on the race dates." },
  { value: "timeline", label: "Timeline", description: "Chronological grouping with the next race highlighted." },
  { value: "map", label: "Map", description: "Marker-driven view of race locations and track destinations." }
];

function getViewHref(view: RaceViewMode, filters: RaceFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (!value || key === "view") {
      return;
    }

    params.set(key, value);
  });

  if (view !== "list") {
    params.set("view", view);
  }

  const query = params.toString();
  return query ? `/races?${query}` : "/races";
}

function formatDateRange(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });

  return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`;
}

export function RaceViewTabs({
  activeView,
  filters
}: {
  activeView: RaceViewMode;
  filters: RaceFilters;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {viewLabels.map((view) => (
        <Link
          key={view.value}
          href={getViewHref(view.value, filters)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
            activeView === view.value
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-apex-slate hover:-translate-y-0.5"
          }`}
        >
          {view.label}
        </Link>
      ))}
    </div>
  );
}

export function RaceViewDescription({ activeView }: { activeView: RaceViewMode }) {
  const view = viewLabels.find((entry) => entry.value === activeView);
  return view ? <p className="text-sm leading-6 text-apex-muted">{view.description}</p> : null;
}

export function RaceListView({ races }: { races: DiscoveryRace[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {races.map((race) => (
        <article
          key={race.id}
          className="glass-border group rounded-[20px] bg-white/85 p-5 shadow-panel transition duration-200 hover:-translate-y-1"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-apex-muted">
                {race.championshipName}
              </p>
              <h2 className="mt-2 text-xl font-bold text-apex-slate">{race.name}</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-apex-slate">
              {race.status}
            </span>
          </div>
          <p className="text-sm leading-6 text-apex-muted">{race.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm text-apex-slate">
            <span className="rounded-full bg-slate-100 px-3 py-2">{formatDateRange(race.startDate, race.endDate)}</span>
            <span className="rounded-full bg-slate-100 px-3 py-2">{race.trackName}</span>
            <span className="rounded-full bg-slate-100 px-3 py-2">{race.location}</span>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/races/${race.slug}`}
              className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-apex-blue"
            >
              View Race
            </Link>
            <TrackRaceButton raceId={race.id} initialTracked={race.isTracked} />
          </div>
        </article>
      ))}
    </section>
  );
}

export function RaceMapView({ races }: { races: DiscoveryRace[] }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <RaceMap races={races} />
      <div className="grid gap-4">
        {races.map((race) => (
          <article key={race.id} className="glass-border rounded-[24px] bg-white/85 p-5 shadow-panel">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-apex-muted">
                  {race.championshipName}
                </p>
                <h3 className="mt-2 text-xl font-bold text-apex-slate">{race.name}</h3>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-apex-slate">
                {race.status}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-apex-slate">
              <span className="rounded-full bg-slate-100 px-3 py-2">{race.trackName}</span>
              <span className="rounded-full bg-slate-100 px-3 py-2">
                {race.coordinates.lat.toFixed(2)}, {race.coordinates.lng.toFixed(2)}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <Link
                href={`/races/${race.slug}`}
                className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-apex-blue"
              >
                View Race
              </Link>
              <TrackRaceButton raceId={race.id} initialTracked={race.isTracked} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
