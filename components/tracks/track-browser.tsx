"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DiscoveryTrack } from "@/lib/discovery";
import { TrackMap } from "@/components/maps/track-map";
import { EmptyState } from "@/components/states";
import { FollowButton } from "@/components/tracking/follow-button";

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
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </section>
  );
}
