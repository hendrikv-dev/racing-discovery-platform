"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DiscoveryRace, RaceFilters } from "@/lib/discovery";
import { RaceMap } from "@/components/maps/race-map";
import { EmptyState } from "@/components/states";
import { TrackRaceButton } from "@/components/tracking/track-race-button";

export type RaceViewMode = "map" | "list" | "calendar" | "timeline";

const viewLabels: Array<{ value: RaceViewMode; label: string; description: string }> = [
  { value: "map", label: "Map", description: "See races as real places first, then inspect the filtered list alongside the map." },
  { value: "list", label: "List", description: "Card-based discovery for scanning the full race slate." },
  { value: "calendar", label: "Calendar", description: "Month grid with event chips on the race dates." },
  { value: "timeline", label: "Timeline", description: "Chronological grouping with the next race highlighted." }
];

function getViewHref(view: RaceViewMode, filters: RaceFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (!value || key === "view") {
      return;
    }

    params.set(key, value);
  });

  if (view !== "map") {
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

function RaceListCard({
  race,
  selected = false,
  onSelect
}: {
  race: DiscoveryRace;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <article
      className={`glass-border rounded-[24px] bg-white/85 p-5 shadow-panel transition duration-200 ${
        selected ? "ring-2 ring-apex-blue" : "hover:-translate-y-1"
      }`}
    >
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
      <p className="mt-3 text-sm leading-6 text-apex-muted">{race.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-apex-slate">
        <span className="rounded-full bg-slate-100 px-3 py-2">{formatDateRange(race.startDate, race.endDate)}</span>
        <span className="rounded-full bg-slate-100 px-3 py-2">{race.trackName}</span>
        <span className="rounded-full bg-slate-100 px-3 py-2">{race.location}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-apex-muted">
        {race.mapCoordinates ? (
          <span>{race.mapSource === "track" ? "Map uses track coordinates" : "Map uses race coordinates"}</span>
        ) : (
          <span>No map coordinates available</span>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/races/${race.slug}`}
            className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-apex-blue"
          >
            View Race
          </Link>
          {onSelect ? (
            <button
              type="button"
              onClick={onSelect}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-apex-slate transition duration-200 hover:-translate-y-0.5"
            >
              Focus On Map
            </button>
          ) : null}
        </div>
        <TrackRaceButton raceId={race.id} initialTracked={race.isTracked} />
      </div>
    </article>
  );
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
  if (races.length === 0) {
    return <EmptyState title="No races found" description="Try clearing one or more filters to broaden the results." />;
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {races.map((race) => (
        <RaceListCard key={race.id} race={race} />
      ))}
    </section>
  );
}

export function RaceMapView({ races }: { races: DiscoveryRace[] }) {
  const [selectedRaceId, setSelectedRaceId] = useState<string | null>(races.find((race) => race.mapCoordinates)?.id ?? races[0]?.id ?? null);
  const sortedRaces = useMemo(() => {
    if (!selectedRaceId) {
      return races;
    }

    return [...races].sort((left, right) => {
      if (left.id === selectedRaceId) {
        return -1;
      }

      if (right.id === selectedRaceId) {
        return 1;
      }

      return 0;
    });
  }, [races, selectedRaceId]);

  if (races.length === 0) {
    return <EmptyState title="No races found" description="Adjust filters to see races on the map and in the list." />;
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="order-2 grid gap-4 lg:order-1">
        {sortedRaces.map((race) => (
          <RaceListCard
            key={race.id}
            race={race}
            selected={race.id === selectedRaceId}
            onSelect={race.mapCoordinates ? () => setSelectedRaceId(race.id) : undefined}
          />
        ))}
      </div>
      <div className="order-1 lg:order-2">
        <RaceMap races={races} selectedRaceId={selectedRaceId} onSelectRace={setSelectedRaceId} className="h-[460px] lg:h-[720px]" />
      </div>
    </section>
  );
}
