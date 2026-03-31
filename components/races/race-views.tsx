"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useMemo, useState } from "react";
import { DiscoveryRace, RaceFilters } from "@/lib/discovery";
import { RaceMap } from "@/components/maps/race-map";
import { EmptyState } from "@/components/states";
import { TrackRaceButton } from "@/components/tracking/track-race-button";

export type RaceViewMode = "map" | "list" | "calendar" | "timeline";

const viewLabels: Array<{ value: RaceViewMode; label: string; description: string }> = [
  { value: "map", label: "Map", description: "Find race weekends by location and compare nearby events faster." },
  { value: "list", label: "List", description: "Scan the full slate, compare weekends fast, and keep tracked races in view." },
  { value: "calendar", label: "Calendar", description: "See what is happening on each date and open the exact day you want." },
  { value: "timeline", label: "Timeline", description: "Follow the season chronologically and spot the next key race quickly." }
];

type RaceListSort = "upcoming" | "championship" | "track" | "status";
type RaceLayout = "list" | "grid";

function sortRaceCards(races: DiscoveryRace[], sort: RaceListSort) {
  const sorted = [...races];

  switch (sort) {
    case "championship":
      return sorted.sort((left, right) =>
        left.championshipName.localeCompare(right.championshipName) ||
        new Date(left.startDate).getTime() - new Date(right.startDate).getTime()
      );
    case "track":
      return sorted.sort((left, right) =>
        left.trackName.localeCompare(right.trackName) ||
        new Date(left.startDate).getTime() - new Date(right.startDate).getTime()
      );
    case "status": {
      const statusOrder = { Live: 0, Upcoming: 1, Completed: 2 } as const;
      return sorted.sort(
        (left, right) =>
          statusOrder[left.status] - statusOrder[right.status] ||
          new Date(left.startDate).getTime() - new Date(right.startDate).getTime()
      );
    }
    case "upcoming":
    default:
      return sorted.sort(
        (left, right) => new Date(left.startDate).getTime() - new Date(right.startDate).getTime()
      );
  }
}

function RaceListSortControls({
  label,
  value,
  onChange,
  options,
  right
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  right?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <p className="text-sm font-medium text-apex-muted">{label}</p>
      <div className="flex items-center gap-2">
        {right}
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 pr-10 text-sm text-apex-slate outline-none transition duration-200 focus:border-apex-blue"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

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
  onSelect,
  layout = "list"
}: {
  race: DiscoveryRace;
  selected?: boolean;
  onSelect?: () => void;
  layout?: RaceLayout;
}) {
  const isGrid = layout === "grid";

  return (
    <article
      className={`glass-border rounded-[24px] bg-white/85 p-5 shadow-panel transition duration-200 ${
        selected ? "ring-2 ring-apex-blue shadow-2xl" : "hover:-translate-y-1 hover:shadow-2xl"
      }`}
    >
      <div className={`flex gap-4 ${isGrid ? "items-start" : "items-start md:items-center"}`}>
        <div className={`relative overflow-hidden rounded-2xl bg-slate-100 ${isGrid ? "h-16 w-16" : "h-20 w-24 shrink-0"}`}>
          <Image
            src={race.image}
            alt={`${race.name} race visual`}
            fill
            className="object-cover"
            sizes={isGrid ? "64px" : "96px"}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-apex-muted">
                {race.championshipName}
              </p>
              <h3 className={`mt-2 font-bold text-apex-slate ${isGrid ? "text-xl" : "text-2xl"}`}>{race.name}</h3>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-apex-slate">
              {race.status}
            </span>
          </div>
          <p className="mt-3 text-base font-semibold text-apex-blue">
            {formatDateRange(race.startDate, race.endDate)}
          </p>
          {!isGrid ? <p className="mt-2 text-sm leading-6 text-apex-muted">{race.summary}</p> : null}
          {!isGrid ? (
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-apex-slate">
              <span className="rounded-full bg-slate-100 px-3 py-2">{race.trackName}</span>
              <span className="rounded-full bg-slate-100 px-3 py-2">{race.location}</span>
              {race.isTracked ? (
                <span className="rounded-full bg-blue-50 px-3 py-2 font-semibold text-apex-blue">Tracked</span>
              ) : null}
              {typeof race.distanceKm === "number" ? (
                <span className="rounded-full bg-slate-100 px-3 py-2">{Math.round(race.distanceKm)} km away</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      {isGrid ? <p className="mt-3 text-sm leading-6 text-apex-muted">{race.summary}</p> : null}
      {isGrid ? (
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-apex-slate">
        <span className="rounded-full bg-slate-100 px-3 py-2">{race.trackName}</span>
        <span className="rounded-full bg-slate-100 px-3 py-2">{race.location}</span>
        {race.isTracked ? (
          <span className="rounded-full bg-blue-50 px-3 py-2 font-semibold text-apex-blue">Tracked</span>
        ) : null}
        {typeof race.distanceKm === "number" ? (
          <span className="rounded-full bg-slate-100 px-3 py-2">{Math.round(race.distanceKm)} km away</span>
        ) : null}
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-apex-muted">
        {race.mapCoordinates ? (
          <span>{race.mapSource === "track" ? "Located by venue" : "Shown on map"}</span>
        ) : (
          <span>Map preview coming soon</span>
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
  const [sort, setSort] = useState<RaceListSort>("upcoming");
  const [layout, setLayout] = useState<RaceLayout>("list");

  if (races.length === 0) {
    return <EmptyState title="No races found" description="Try clearing one or more filters to broaden the results." />;
  }

  const sortedRaces = useMemo(() => sortRaceCards(races, sort), [races, sort]);

  return (
    <section>
      <RaceListSortControls
        label="Sort the race list"
        value={sort}
        onChange={(value) => setSort(value as RaceListSort)}
        right={
          <div className="flex rounded-full bg-slate-100 p-1">
            {(["list", "grid"] as RaceLayout[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLayout(option)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition duration-150 ${
                  layout === option ? "bg-slate-900 text-white" : "text-apex-slate"
                }`}
              >
                {option === "list" ? "List" : "Grid"}
              </button>
            ))}
          </div>
        }
        options={[
          { value: "upcoming", label: "Upcoming first" },
          { value: "championship", label: "Championship" },
          { value: "track", label: "Track" },
          { value: "status", label: "Status" }
        ]}
      />
      <div className={layout === "list" ? "space-y-4" : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"}>
        {sortedRaces.map((race) => (
          <RaceListCard key={race.id} race={race} layout={layout} />
        ))}
      </div>
    </section>
  );
}

export function RaceMapView({ races }: { races: DiscoveryRace[] }) {
  const [sort, setSort] = useState<RaceListSort>("upcoming");
  const [selectedRaceId, setSelectedRaceId] = useState<string | null>(races.find((race) => race.mapCoordinates)?.id ?? races[0]?.id ?? null);
  const sortedRaces = useMemo(() => sortRaceCards(races, sort), [races, sort]);
  const orderedRaces = useMemo(() => {
    if (!selectedRaceId) {
      return sortedRaces;
    }

    return [...sortedRaces].sort((left, right) => {
      if (left.id === selectedRaceId) {
        return -1;
      }

      if (right.id === selectedRaceId) {
        return 1;
      }

      return 0;
    });
  }, [selectedRaceId, sortedRaces]);

  if (races.length === 0) {
    return <EmptyState title="No races found" description="Adjust filters to see races on the map and in the list." />;
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="order-2 grid gap-4 lg:order-1">
        <RaceListSortControls
          label="Sort the race list"
          value={sort}
          onChange={(value) => setSort(value as RaceListSort)}
          options={[
            { value: "upcoming", label: "Upcoming first" },
            { value: "championship", label: "Championship" },
            { value: "track", label: "Track" },
            { value: "status", label: "Status" }
          ]}
        />
        {orderedRaces.map((race) => (
          <RaceListCard
            key={race.id}
            race={race}
            selected={race.id === selectedRaceId}
            onSelect={race.mapCoordinates ? () => setSelectedRaceId(race.id) : undefined}
            layout="list"
          />
        ))}
      </div>
      <div className="order-1 lg:order-2">
        <RaceMap races={races} selectedRaceId={selectedRaceId} onSelectRace={setSelectedRaceId} className="h-[460px] lg:h-[720px]" />
      </div>
    </section>
  );
}
