"use client";

import Link from "next/link";
import { useState } from "react";
import { DiscoveryRace } from "@/lib/discovery";

export function NearYouSection() {
  const [races, setRaces] = useState<DiscoveryRace[]>([]);
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);

  async function handleEnable() {
    if (!navigator.geolocation || loading) {
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `/api/races/nearby?lat=${latitude}&lng=${longitude}&limit=3`
        );
        const payload = (await response.json()) as { races: DiscoveryRace[] };
        setRaces(payload.races);
        setEnabled(true);
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 4000, maximumAge: 300000 }
    );
  }

  if (!enabled) {
    return (
      <section className="surface-panel rounded-[28px] p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
          Near You
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-5xl">
          See races near you
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
          Use your location to surface the closest upcoming race weekends without changing your broader discovery flow.
        </p>
        <button
          type="button"
          onClick={handleEnable}
          className="primary-action mt-6 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
        >
          {loading ? "Finding nearby races..." : "Use my location"}
        </button>
      </section>
    );
  }

  if (races.length === 0) {
    return null;
  }

  return (
    <section className="surface-panel rounded-[28px] p-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
            Near You
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-5xl">
            Near you
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
            The closest upcoming race weekends based on your current location.
          </p>
        </div>
        <Link
          href="/races?view=map&sort=nearest"
          className="secondary-action inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
        >
          Open map view
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {races.map((race) => (
          <Link key={race.id} href={`/races/${race.slug}`} className="surface-card rounded-[22px] p-5 transition duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
              {race.championshipName}
            </p>
            <h3 className="mt-2 text-xl font-bold text-zinc-50">{race.name}</h3>
            <p className="mt-3 text-sm text-zinc-300">
              {race.trackName} • {race.location}
            </p>
            {typeof race.distanceKm === "number" ? (
              <p className="mt-3 text-sm font-semibold text-teal-300">
                {Math.round(race.distanceKm)} km away
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
