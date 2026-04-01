"use client";

import { DiscoveryTrack } from "@/lib/discovery";
import { InteractiveMap } from "@/components/maps/interactive-map";
import { MapEmptyState } from "@/components/maps/map-empty-state";

export function TrackMap({
  tracks,
  selectedTrackId,
  onSelectTrack,
  className = "h-[420px]"
}: {
  tracks: DiscoveryTrack[];
  selectedTrackId?: string | null;
  onSelectTrack?: (id: string) => void;
  className?: string;
}) {
  const mappedTracks = tracks.filter((track) => track.coordinates);
  const missingCount = tracks.length - mappedTracks.length;

  if (mappedTracks.length === 0) {
    return (
      <MapEmptyState
        title="Track map coming soon for these venues"
        description="You can still browse every circuit below while location details are being added."
      />
    );
  }

  return (
    <div className="surface-card-strong rounded-[28px] p-6 text-white">
      <p className="app-kicker">Explore By Map</p>
      <h2 className="mt-3 text-2xl font-bold">Physical venues, clearly mapped</h2>
      <p className="mt-3 max-w-lg text-sm leading-7 text-zinc-300">
        Pick a circuit from the map or list to see where it sits and jump straight into track details.
      </p>
      {missingCount > 0 ? (
        <p className="mt-3 text-xs uppercase tracking-[0.24em] text-teal-300">
          {missingCount} track{missingCount === 1 ? "" : "s"} still show in the list while map
          locations are being added.
        </p>
      ) : null}
      <div className="mt-6">
        <InteractiveMap
          points={mappedTracks.map((track) => ({
            id: track.id,
            lat: track.coordinates!.lat,
            lng: track.coordinates!.lng,
            title: track.name,
            subtitle: `${track.country} • ${track.length}`,
            meta: `${track.raceCount} races`
          }))}
          selectedId={selectedTrackId}
          onSelect={onSelectTrack}
          className={className}
        />
      </div>
    </div>
  );
}
