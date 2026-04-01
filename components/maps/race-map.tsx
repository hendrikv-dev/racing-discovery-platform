"use client";

import { DiscoveryRace } from "@/lib/discovery";
import { InteractiveMap } from "@/components/maps/interactive-map";
import { MapEmptyState } from "@/components/maps/map-empty-state";

export function RaceMap({
  races,
  selectedRaceId,
  onSelectRace,
  className = "h-[440px]"
}: {
  races: DiscoveryRace[];
  selectedRaceId?: string | null;
  onSelectRace?: (id: string) => void;
  className?: string;
}) {
  const mappedRaces = races.filter((race) => race.mapCoordinates);
  const missingCount = races.length - mappedRaces.length;

  if (mappedRaces.length === 0) {
    return (
      <MapEmptyState
        title="Map view opens up as race locations are added"
        description="Clear filters or come back soon to explore these race weekends by location."
        note="No blank map here"
      />
    );
  }

  return (
    <div className="surface-card-strong rounded-[28px] p-6 text-white">
      <p className="app-kicker">Map View</p>
      <h2 className="mt-3 text-2xl font-bold">Explore races by location</h2>
      <p className="mt-3 max-w-lg text-sm leading-7 text-zinc-300">
        Click a marker to see where a weekend takes place and move straight into the race details.
      </p>
      {missingCount > 0 ? (
        <p className="mt-3 text-xs uppercase tracking-[0.24em] text-teal-300">
          {missingCount} filtered race{missingCount === 1 ? "" : "s"} still show in the list while
          location details are being filled in.
        </p>
      ) : null}
      <div className="mt-6">
        <InteractiveMap
          points={mappedRaces.map((race) => ({
            id: race.id,
            lat: race.mapCoordinates!.lat,
            lng: race.mapCoordinates!.lng,
            title: race.name,
            subtitle: `${race.location} • ${race.trackName}`,
            meta: race.mapSource === "track" ? "Located by venue" : race.championshipName
          }))}
          selectedId={selectedRaceId}
          onSelect={onSelectRace}
          className={className}
        />
      </div>
    </div>
  );
}
