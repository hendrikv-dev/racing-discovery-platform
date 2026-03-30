"use client";

import { useState } from "react";
import { DiscoveryTrack } from "@/lib/discovery";
import { MapMarkerCard } from "@/components/maps/map-marker-card";

export function TrackMap({
  tracks,
  compact = false
}: {
  tracks: DiscoveryTrack[];
  compact?: boolean;
}) {
  const [selectedId, setSelectedId] = useState(tracks[0]?.id ?? null);
  const selectedTrack = tracks.find((track) => track.id === selectedId) ?? tracks[0] ?? null;
  const latitudes = tracks.map((track) => track.coordinates.lat);
  const longitudes = tracks.map((track) => track.coordinates.lng);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  if (tracks.length === 0) {
    return null;
  }

  return (
    <div
      className={`glass-border relative overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-panel ${
        compact ? "min-h-[280px]" : "min-h-[420px]"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.26),_transparent_45%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(15,23,42,0.8))]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="relative h-full">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">
          {compact ? "Mini Map" : "Track Map"}
        </p>
        <h2 className="mt-3 text-2xl font-bold">
          {compact ? "Circuit position" : "Explore circuits geographically"}
        </h2>
        <div className={`relative mt-6 rounded-[24px] border border-white/10 bg-white/5 ${compact ? "h-[160px]" : "h-[250px]"}`}>
          {tracks.map((track) => {
            const topRatio = maxLat === minLat ? 0.5 : (track.coordinates.lat - minLat) / (maxLat - minLat);
            const leftRatio =
              maxLng === minLng ? 0.5 : (track.coordinates.lng - minLng) / (maxLng - minLng);
            const top = `${78 - topRatio * 56}%`;
            const left = `${12 + leftRatio * 72}%`;
            const selected = selectedTrack?.id === track.id;

            return (
              <button
                key={track.id}
                type="button"
                onClick={() => setSelectedId(track.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left, top }}
              >
                <div
                  className={`h-4 w-4 rounded-full ${selected ? "bg-blue-400 ring-4 ring-blue-400/20" : "bg-slate-500"}`}
                />
              </button>
            );
          })}
        </div>
        {selectedTrack ? (
          <div className="mt-4">
            <MapMarkerCard
              title={selectedTrack.name}
              subtitle={`${selectedTrack.country} • ${selectedTrack.length}`}
              meta={`${selectedTrack.coordinates.lat.toFixed(2)}, ${selectedTrack.coordinates.lng.toFixed(2)}`}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
