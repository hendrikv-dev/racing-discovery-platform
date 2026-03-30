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
        title="Map view needs race or track coordinates"
        description="No visible race markers are available right now. Add race coordinates or rely on track coordinates to bring these events onto the map."
        note="No blank map here"
      />
    );
  }

  return (
    <div className="glass-border rounded-[28px] bg-slate-950 p-6 text-white shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">Map View</p>
      <h2 className="mt-3 text-2xl font-bold">Explore races by location</h2>
      <p className="mt-3 max-w-lg text-sm leading-7 text-slate-300">
        Click a marker to inspect a race. Race coordinates are used first, and track coordinates
        are used as a fallback when the race itself does not have a direct map position.
      </p>
      {missingCount > 0 ? (
        <p className="mt-3 text-xs uppercase tracking-[0.24em] text-blue-200">
          {missingCount} filtered race{missingCount === 1 ? "" : "s"} hidden from map because no
          usable coordinates were found.
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
            meta: race.mapSource === "track" ? "Track coordinates" : race.championshipName
          }))}
          selectedId={selectedRaceId}
          onSelect={onSelectRace}
          className={className}
        />
      </div>
    </div>
  );
}
