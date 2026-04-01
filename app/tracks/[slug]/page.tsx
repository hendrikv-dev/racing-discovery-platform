import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { MapEmptyState } from "@/components/maps/map-empty-state";
import { MiniMap } from "@/components/maps/mini-map";
import { FollowButton } from "@/components/tracking/follow-button";
import { MetricCard, SectionHeading } from "@/components/ui";
import { getTrackBySlug } from "@/lib/discovery";

export default async function TrackDetailsPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const data = await getTrackBySlug(slug, session?.user?.id);

  if (!data) {
    notFound();
  }

  const upcomingRaces = data.races.filter((race) => race.status === "Upcoming" || race.status === "Live");
  const trackDescription =
    data.track.history?.trim() ||
    `${data.track.name} is a ${data.track.trackType.toLowerCase()} in ${data.track.city ?? data.track.location}, ${data.track.country} with ${data.track.turns} turns over ${data.track.length}.`;

  return (
    <div className="space-y-8">
      <section className="surface-card-strong overflow-hidden rounded-[28px]">
        <div className="relative min-h-[420px]">
          <Image
            src={data.track.image}
            alt={`${data.track.name} aerial circuit profile`}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
          <div className="relative flex min-h-[420px] flex-col justify-end p-6 text-white sm:p-8">
            <p className="app-kicker">
              Track Details
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">{data.track.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-200">{trackDescription}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <FollowButton
                entity="tracks"
                entityId={data.track.id}
                initialTracked={data.track.isTracked}
                activeLabel="Following"
                inactiveLabel="Follow Track"
              />
              {data.track.website ? (
                <a
                  href={data.track.website}
                  target="_blank"
                  rel="noreferrer"
                  className="secondary-action inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
                >
                  Visit Official Site
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Track Length" value={data.track.length} detail="Measured race layout distance." />
        <MetricCard label="Total Turns" value={String(data.track.turns)} detail="Combined technical corner count." />
        <MetricCard label="Lap Record" value={data.track.lapRecord} detail="Fastest verified reference lap." />
        <MetricCard label="Race Count" value={String(data.track.raceCount).padStart(2, "0")} detail="Race weekends currently mapped to this venue." />
        <MetricCard label="City" value={data.track.city ?? data.track.location} detail="The city anchoring this venue." />
        <MetricCard label="Upcoming Races" value={String(upcomingRaces.length).padStart(2, "0")} detail="Upcoming weekends currently scheduled here." />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        {data.track.coordinates ? (
          <MiniMap
            point={{
              id: data.track.id,
              lat: data.track.coordinates.lat,
              lng: data.track.coordinates.lng,
              title: data.track.name,
              subtitle: `${data.track.country} • ${data.track.length}`,
              meta: "Track location"
            }}
            className="h-[320px] lg:h-[380px]"
          />
        ) : (
          <MapEmptyState
            title="Location preview coming soon"
            description="This venue will show up here as soon as its map location is available."
          />
        )}
        <div className="app-panel rounded-[28px] p-6">
          <p className="app-kicker">
            Location
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50">Physical venue context</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            See where the circuit sits before you dive into race weekends hosted there.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-200">
            <span className="app-pill px-3 py-2">{data.track.city ?? data.track.location}</span>
            <span className="app-pill px-3 py-2">{data.track.country}</span>
            {data.track.coordinates ? (
              <span className="app-pill px-3 py-2">
                {data.track.coordinates.lat.toFixed(4)}, {data.track.coordinates.lng.toFixed(4)}
              </span>
            ) : (
              <span className="rounded-full border border-zinc-600 bg-zinc-800 px-3 py-2 text-zinc-300">
                Coordinates pending
              </span>
            )}
          </div>
          <div className="mt-6">
            <a
              href="mailto:hello@racingplatform.app?subject=Organize%20events%20here"
              className="text-sm font-medium text-violet-200 underline-offset-4 transition duration-150 hover:text-violet-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              Organize events here? Contact us
            </a>
          </div>
        </div>
      </section>

      <section className="app-panel rounded-[28px] p-6">
        <SectionHeading
          eyebrow="Upcoming Races"
          title="Upcoming races at this circuit"
          description="See the next race weekends scheduled at this venue before you dive deeper into the full circuit history."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(upcomingRaces.length > 0 ? upcomingRaces : data.races).map((race) => (
            <article key={race.id} className="app-card rounded-[22px] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                {race.championshipName}
              </p>
              <h2 className="mt-2 text-xl font-bold text-zinc-50">{race.name}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{race.summary}</p>
              <div className="mt-4">
                <Link
                  href={`/races/${race.slug}`}
                  className="primary-action inline-flex rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
                >
                  Open Race
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
