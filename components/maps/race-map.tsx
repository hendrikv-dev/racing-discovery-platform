"use client";

import { useMemo, useState } from "react";
import { DiscoveryRace } from "@/lib/discovery";
import { MapMarkerCard } from "@/components/maps/map-marker-card";

type MarkerCluster = {
  key: string;
  races: DiscoveryRace[];
  lat: number;
  lng: number;
};

function createRaceClusters(races: DiscoveryRace[]) {
  const buckets = new Map<string, MarkerCluster>();

  races.forEach((race) => {
    const latBucket = Math.round(race.coordinates.lat / 8);
    const lngBucket = Math.round(race.coordinates.lng / 8);
    const key = `${latBucket}:${lngBucket}`;
    const existing = buckets.get(key);

    if (existing) {
      existing.races.push(race);
      existing.lat = (existing.lat + race.coordinates.lat) / 2;
      existing.lng = (existing.lng + race.coordinates.lng) / 2;
      return;
    }

    buckets.set(key, {
      key,
      races: [race],
      lat: race.coordinates.lat,
      lng: race.coordinates.lng
    });
  });

  return Array.from(buckets.values());
}

export function RaceMap({ races }: { races: DiscoveryRace[] }) {
  const clusters = useMemo(() => createRaceClusters(races), [races]);
  const [selectedKey, setSelectedKey] = useState(clusters[0]?.key ?? null);

  const selectedCluster = clusters.find((cluster) => cluster.key === selectedKey) ?? clusters[0] ?? null;
  const latitudes = clusters.map((cluster) => cluster.lat);
  const longitudes = clusters.map((cluster) => cluster.lng);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  if (clusters.length === 0) {
    return (
      <div className="glass-border rounded-[28px] bg-slate-950 p-6 text-white shadow-panel">
        <p className="text-sm text-slate-300">No races match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="glass-border relative min-h-[440px] overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-panel">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.26),_transparent_45%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(15,23,42,0.8))]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="relative h-full">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">
          Race Map
        </p>
        <h2 className="mt-3 text-2xl font-bold">Geographic race coverage</h2>
        <p className="mt-3 max-w-lg text-sm leading-7 text-slate-300">
          Marker visibility responds to the active race filters. Nearby events are grouped into map
          clusters to keep the view readable.
        </p>

        <div className="relative mt-8 h-[280px] rounded-[24px] border border-white/10 bg-white/5">
          {clusters.map((cluster) => {
            const topRatio = maxLat === minLat ? 0.5 : (cluster.lat - minLat) / (maxLat - minLat);
            const leftRatio =
              maxLng === minLng ? 0.5 : (cluster.lng - minLng) / (maxLng - minLng);
            const top = `${78 - topRatio * 56}%`;
            const left = `${12 + leftRatio * 72}%`;
            const selected = selectedCluster?.key === cluster.key;

            return (
              <button
                key={cluster.key}
                type="button"
                onClick={() => setSelectedKey(cluster.key)}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
                style={{ left, top }}
              >
                <div
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold text-white ${
                    selected ? "bg-blue-400 ring-4 ring-blue-400/20" : "bg-slate-700"
                  }`}
                >
                  {cluster.races.length}
                </div>
              </button>
            );
          })}
        </div>

        {selectedCluster ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {selectedCluster.races.map((race) => (
              <MapMarkerCard
                key={race.id}
                title={race.name}
                subtitle={`${race.location} • ${race.trackName}`}
                meta={race.championshipName}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
