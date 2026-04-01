import type { ReactNode } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui";
import {
  SearchChampionshipResult,
  SearchRaceResult,
  SearchRacerResult,
  SearchResults as SearchResultsType,
  SearchTrackResult,
  SearchType
} from "@/lib/search";

function SearchResultCard({
  href,
  title,
  detail,
  meta
}: {
  href: string;
  title: string;
  detail: string;
  meta?: string;
}) {
  return (
    <Link
      href={href}
      className="surface-card block rounded-[20px] px-4 py-4 transition duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-zinc-50">{title}</p>
          <p className="mt-1 text-sm text-zinc-300">{detail}</p>
        </div>
        {meta ? <span className="surface-chip rounded-full px-3 py-1 text-xs font-medium text-zinc-100">{meta}</span> : null}
      </div>
    </Link>
  );
}

function RaceResultItem({ race }: { race: SearchRaceResult }) {
  return (
    <Link
      href={race.href}
      className="surface-card block rounded-[20px] p-4 transition duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-zinc-50">{race.name}</p>
          <p className="mt-1 text-sm text-zinc-300">
            {race.date} • {race.trackName}
          </p>
        </div>
        <StatusBadge status={race.status} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-200">
        <span className="surface-chip rounded-full px-3 py-2">{race.trackName}</span>
        <span className="surface-chip rounded-full px-3 py-2">{race.championshipName}</span>
      </div>
    </Link>
  );
}

function RacerResultItem({ racer }: { racer: SearchRacerResult }) {
  return (
    <SearchResultCard
      href={racer.href}
      title={racer.name}
      detail={racer.championshipName ? `${racer.team} • ${racer.championshipName}` : racer.team}
    />
  );
}

function TrackResultItem({ track }: { track: SearchTrackResult }) {
  return (
    <SearchResultCard
      href={track.href}
      title={track.name}
      detail={`${track.location} • ${track.trackType}`}
    />
  );
}

function ChampionshipResultItem({ championship }: { championship: SearchChampionshipResult }) {
  return (
    <SearchResultCard
      href={championship.href}
      title={championship.name}
      detail={championship.description}
      meta={championship.category}
    />
  );
}

export function SearchSection({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="surface-panel rounded-[24px] p-5">
      <h2 className="text-2xl font-bold text-zinc-50">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

export function SearchEmptyState({
  query,
  hasFilters
}: {
  query: string;
  hasFilters: boolean;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-zinc-700 bg-zinc-900/60 p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
      <h2 className="text-2xl font-bold text-zinc-50">No results found for &quot;{query}&quot;</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-300">
        No results. Try a different search{hasFilters ? " or clear a filter." : "."}
      </p>
    </div>
  );
}

export function SearchResults({
  search,
  activeType
}: {
  search: SearchResultsType;
  activeType: SearchType;
}) {
  const sections = [
    {
      key: "races" as const,
      title: "Races",
      items: search.results.races,
      render: (item: SearchRaceResult) => <RaceResultItem key={item.id} race={item} />
    },
    {
      key: "racers" as const,
      title: "Racers",
      items: search.results.racers,
      render: (item: SearchRacerResult) => <RacerResultItem key={item.id} racer={item} />
    },
    {
      key: "tracks" as const,
      title: "Tracks",
      items: search.results.tracks,
      render: (item: SearchTrackResult) => <TrackResultItem key={item.id} track={item} />
    },
    {
      key: "championships" as const,
      title: "Championships",
      items: search.results.championships,
      render: (item: SearchChampionshipResult) => (
        <ChampionshipResultItem key={item.id} championship={item} />
      )
    }
  ];

  const visibleSections = sections.filter(
    (section) => activeType === "all" || activeType === section.key
  );

  return (
    <div className="space-y-6">
      {visibleSections.map((section) =>
        section.items.length > 0 ? (
          <SearchSection key={section.key} title={section.title}>
            {section.items.map((item) => section.render(item as never))}
          </SearchSection>
        ) : null
      )}
    </div>
  );
}
