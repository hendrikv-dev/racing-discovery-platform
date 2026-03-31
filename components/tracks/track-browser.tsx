"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPinned } from "lucide-react";
import { useState } from "react";
import { DiscoveryTrack } from "@/lib/discovery";
import { TrackMap } from "@/components/maps/track-map";
import { EmptyState } from "@/components/states";
import { FollowButton } from "@/components/tracking/follow-button";

function TrackLocationAvatar({ track }: { track: DiscoveryTrack }) {
  if (!track.coordinates) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-apex-muted">
        <MapPinned className="h-5 w-5" />
      </div>
    );
  }

  const x = ((track.coordinates.lng + 180) / 360) * 100;
  const y = ((90 - track.coordinates.lat) / 180) * 100;

  return (
    <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(225,6,0,0.14),transparent_40%),linear-gradient(180deg,#f8fafc_0%,#e5e7eb_100%)] shadow-sm">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(100,116,139,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.18)_1px,transparent_1px)] [background-size:16px_16px]" />
      <div
        className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#E10600] shadow-sm"
        style={{ left: `${x}%`, top: `${y}%` }}
      />
    </div>
  );
}

function TrackCard({
  track,
  selected = false,
  onSelect
}: {
  track: DiscoveryTrack;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <article
      className={`glass-border overflow-hidden rounded-[24px] bg-white/90 shadow-panel transition duration-200 ${
        selected ? "ring-2 ring-apex-blue" : "hover:-translate-y-1"
      }`}
    >
      <div className="relative h-56">
        <Image
          src={track.image}
          alt={`${track.name} circuit view`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold text-apex-slate">{track.name}</h2>
        <p className="mt-2 text-sm text-apex-muted">{track.history}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-apex-slate">
          <span className="rounded-full bg-slate-100 px-3 py-2">{track.country}</span>
          <span className="rounded-full bg-slate-100 px-3 py-2">{track.length}</span>
          {track.coordinates ? (
            <span className="rounded-full bg-slate-100 px-3 py-2">Map-ready</span>
          ) : (
            <span className="rounded-full bg-amber-50 px-3 py-2 text-amber-800">List only</span>
          )}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/tracks/${track.slug}`}
              className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-apex-blue"
            >
              View Track
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
          <FollowButton
            entity="tracks"
            entityId={track.id}
            initialTracked={track.isTracked}
            activeLabel="Following"
            inactiveLabel="Follow Track"
          />
        </div>
      </div>
    </article>
  );
}

export function TrackBrowser({
  tracks,
  activeView
}: {
  tracks: DiscoveryTrack[];
  activeView: "map" | "list";
}) {
  const [selectedTrackId, setSelectedTrackId] = useState(tracks.find((track) => track.coordinates)?.id ?? tracks[0]?.id ?? null);

  if (tracks.length === 0) {
    return <EmptyState title="No tracks available" description="Track discovery will appear here once track records are available." />;
  }

  if (activeView === "map") {
    const sortedTracks = [...tracks].sort((left, right) => {
      if (left.id === selectedTrackId) {
        return -1;
      }

      if (right.id === selectedTrackId) {
        return 1;
      }

      return 0;
    });

    return (
      <section className="grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="order-2 grid gap-4 lg:order-1">
          {sortedTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              selected={track.id === selectedTrackId}
              onSelect={track.coordinates ? () => setSelectedTrackId(track.id) : undefined}
            />
          ))}
        </div>
        <div className="order-1 lg:order-2">
          <TrackMap tracks={tracks} selectedTrackId={selectedTrackId} onSelectTrack={setSelectedTrackId} className="h-[460px] lg:h-[720px]" />
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {tracks.map((track) => (
        <article
          key={track.id}
          className="glass-border rounded-[24px] bg-white/90 p-5 shadow-panel transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <TrackLocationAvatar track={track} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-apex-slate">{track.name}</h2>
                  <p className="mt-1 text-sm text-apex-muted">
                    {track.location}, {track.country}
                  </p>
                </div>
                {track.isTracked ? (
                  <span className="rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-apex-blue">
                    Following
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-6 text-apex-muted">{track.history}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-apex-slate">
                <span className="rounded-full bg-slate-100 px-3 py-2">{track.trackType}</span>
                <span className="rounded-full bg-slate-100 px-3 py-2">{track.length}</span>
                {track.coordinates ? (
                  <span className="rounded-full bg-slate-100 px-3 py-2">Map-ready</span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-3 py-2 text-amber-800">List only</span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 md:w-auto md:flex-col">
              <Link
                href={`/tracks/${track.slug}`}
                className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-apex-blue"
              >
                View Track
              </Link>
              <FollowButton
                entity="tracks"
                entityId={track.id}
                initialTracked={track.isTracked}
                activeLabel="Following"
                inactiveLabel="Follow Track"
              />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
