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
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-400">
        <MapPinned className="h-5 w-5" />
      </div>
    );
  }

  const x = ((track.coordinates.lng + 180) / 360) * 100;
  const y = ((90 - track.coordinates.lat) / 180) * 100;

  return (
    <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.18),transparent_40%),linear-gradient(180deg,#161824_0%,#0f111a_100%)] shadow-sm">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:16px_16px]" />
      <div
        className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#14B8A6] shadow-sm"
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
      className={`surface-card overflow-hidden rounded-[24px] transition duration-150 ${
        selected
          ? "border-violet-400/40 bg-violet-500/10 ring-2 ring-violet-400/60"
          : "hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)]"
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
        <h2 className="text-xl font-bold text-zinc-50">{track.name}</h2>
        <p className="mt-2 text-sm text-zinc-300">{track.history}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-200">
          <span className="surface-chip rounded-full px-3 py-2">{track.country}</span>
          <span className="surface-chip rounded-full px-3 py-2">{track.length}</span>
          {track.coordinates ? (
            <span className="rounded-full border border-teal-400/30 bg-teal-500/10 px-3 py-2 text-teal-200">Map-ready</span>
          ) : (
            <span className="rounded-full border border-zinc-600 bg-zinc-800 px-3 py-2 text-zinc-300">List only</span>
          )}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/tracks/${track.slug}`}
              className="primary-action inline-flex rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
            >
              View Track
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
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
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
          className="surface-card rounded-[24px] p-5 transition duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)]"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <TrackLocationAvatar track={track} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-50">{track.name}</h2>
                  <p className="mt-1 text-sm text-zinc-300">
                    {track.location}, {track.country}
                  </p>
                </div>
                {track.isTracked ? (
                  <span className="rounded-full border border-violet-400/30 bg-violet-500/12 px-3 py-2 text-sm font-semibold text-violet-200">
                    Following
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{track.history}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-200">
                <span className="surface-chip rounded-full px-3 py-2">{track.trackType}</span>
                <span className="surface-chip rounded-full px-3 py-2">{track.length}</span>
                {track.coordinates ? (
                  <span className="rounded-full border border-teal-400/30 bg-teal-500/10 px-3 py-2 text-teal-200">Map-ready</span>
                ) : (
                  <span className="rounded-full border border-zinc-600 bg-zinc-800 px-3 py-2 text-zinc-300">List only</span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 md:w-auto md:flex-col">
              <Link
                href={`/tracks/${track.slug}`}
                className="primary-action inline-flex rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
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
