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
        title="Track map becomes available with coordinates"
        description="Track cards remain visible even without coordinates, but markers only appear when a track has a valid latitude and longitude."
      />
    );
  }

  return (
    <div className="glass-border rounded-[28px] bg-slate-950 p-6 text-white shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">Explore By Map</p>
      <h2 className="mt-3 text-2xl font-bold">Physical venues, clearly mapped</h2>
      <p className="mt-3 max-w-lg text-sm leading-7 text-slate-300">
        Every visible marker is a real circuit venue. Select a track from the list or map to focus
        its location and jump into the detail page.
      </p>
      {missingCount > 0 ? (
        <p className="mt-3 text-xs uppercase tracking-[0.24em] text-blue-200">
          {missingCount} track{missingCount === 1 ? "" : "s"} remain in the list only because they
          do not yet have valid map coordinates.
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
