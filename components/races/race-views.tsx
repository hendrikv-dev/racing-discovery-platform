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
      <p className="text-sm font-medium text-zinc-300">{label}</p>
      <div className="flex items-center gap-2">
        {right}
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 pr-12 text-sm text-zinc-100 outline-none transition duration-150 focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
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
      className={`surface-card rounded-[24px] p-5 transition duration-150 ${
        selected
          ? "border-violet-400/40 bg-violet-500/10 ring-2 ring-violet-400/60 shadow-[0_14px_40px_rgba(0,0,0,0.38)]"
          : "hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)]"
      }`}
    >
      <div className={`flex gap-4 ${isGrid ? "items-start" : "items-start md:items-center"}`}>
        <div className={`relative overflow-hidden rounded-2xl bg-zinc-900 ${isGrid ? "h-16 w-16" : "h-20 w-24 shrink-0"}`}>
          <Image
            src={race.image}
            alt={`${race.name} race visual`}
            fill
            className="object-cover"
            sizes={isGrid ? "64px" : "96px"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090F] via-[#09090F]/10 to-transparent" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                {race.championshipName}
              </p>
              <h3 className={`mt-2 font-bold text-zinc-50 ${isGrid ? "text-xl" : "text-2xl"}`}>{race.name}</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-200">
              {race.status}
            </span>
          </div>
          <p className="mt-3 text-base font-semibold text-teal-300">
            {formatDateRange(race.startDate, race.endDate)}
          </p>
          {!isGrid ? <p className="mt-2 text-sm leading-6 text-zinc-300">{race.summary}</p> : null}
          {!isGrid ? (
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-200">
              <span className="surface-chip rounded-full px-3 py-2">{race.trackName}</span>
              <span className="surface-chip rounded-full px-3 py-2">{race.location}</span>
              {race.isTracked ? (
                <span className="rounded-full border border-violet-400/30 bg-violet-500/12 px-3 py-2 font-semibold text-violet-200">Tracked</span>
              ) : null}
              {typeof race.distanceKm === "number" ? (
                <span className="surface-chip rounded-full px-3 py-2">{Math.round(race.distanceKm)} km away</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      {isGrid ? <p className="mt-3 text-sm leading-6 text-zinc-300">{race.summary}</p> : null}
      {isGrid ? (
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-200">
        <span className="surface-chip rounded-full px-3 py-2">{race.trackName}</span>
        <span className="surface-chip rounded-full px-3 py-2">{race.location}</span>
        {race.isTracked ? (
          <span className="rounded-full border border-violet-400/30 bg-violet-500/12 px-3 py-2 font-semibold text-violet-200">Tracked</span>
        ) : null}
        {typeof race.distanceKm === "number" ? (
          <span className="surface-chip rounded-full px-3 py-2">{Math.round(race.distanceKm)} km away</span>
        ) : null}
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
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
            className="primary-action inline-flex rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
          >
            View Race
          </Link>
          {onSelect ? (
            <button
              type="button"
              onClick={onSelect}
              className="secondary-action rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
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
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F] ${
            activeView === view.value
              ? "border-violet-500 bg-violet-600 text-white"
              : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
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
  return view ? <p className="text-sm leading-6 text-zinc-300">{view.description}</p> : null;
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
          <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
            {(["list", "grid"] as RaceLayout[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLayout(option)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F] ${
                  layout === option ? "bg-violet-600 text-white" : "text-zinc-300"
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
    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
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
