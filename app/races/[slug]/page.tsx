import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { MapEmptyState } from "@/components/maps/map-empty-state";
import { MiniMap } from "@/components/maps/mini-map";
import { TrackRaceButton } from "@/components/tracking/track-race-button";
import { MetricCard } from "@/components/ui";
import { getRaceBySlug } from "@/lib/discovery";

function formatDateRange(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });

  return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`;
}

export default async function RaceDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const race = await getRaceBySlug(slug, session?.user?.id);

  if (!race) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="surface-card-strong rounded-[28px] p-6 text-white">
        <p className="app-kicker">
          Race Detail
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">{race.name}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">{race.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="app-pill px-4 py-2 text-sm">{race.championshipName}</span>
          <span className="app-pill px-4 py-2 text-sm">{race.trackName}</span>
          <span className="app-pill px-4 py-2 text-sm">{race.status}</span>
        </div>
        <div className="mt-6">
          <TrackRaceButton raceId={race.id} initialTracked={race.isTracked} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {race.ticketUrl ? (
            <a
              href={race.ticketUrl}
              target="_blank"
              rel="noreferrer"
              className="primary-action inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
            >
              Get Tickets
            </a>
          ) : race.officialUrl ? (
            <a
              href={race.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="secondary-action inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
            >
              Visit Official Site
            </a>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Date Window"
          value={formatDateRange(race.startDate, race.endDate)}
          detail="Know exactly when the weekend begins and ends."
        />
        <MetricCard label="Location" value={race.location} detail="See where to follow the action." />
        <MetricCard
          label="Coordinates"
          value={
            race.mapCoordinates
              ? `${race.mapCoordinates.lat.toFixed(2)}, ${race.mapCoordinates.lng.toFixed(2)}`
              : "Unavailable"
          }
          detail={
            race.mapSource === "track"
              ? "Located by the host circuit."
              : "Ready for map view."
          }
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        {race.mapCoordinates ? (
          <MiniMap
            point={{
              id: race.id,
              lat: race.mapCoordinates.lat,
              lng: race.mapCoordinates.lng,
              title: race.name,
              subtitle: `${race.location} • ${race.trackName}`,
              meta: race.mapSource === "track" ? "Located by venue" : "Shown on the race map"
            }}
            className="h-[320px] lg:h-[380px]"
          />
        ) : (
          <MapEmptyState
            title="Race location preview unavailable"
            description="A location preview will appear here as soon as the race or its venue is mapped."
          />
        )}

        <div className="app-panel rounded-[28px] p-6">
          <p className="app-kicker">
            Race Location
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50">Where this race happens</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            Keep the weekend grounded in a real venue so it is easier to plan what to watch and follow.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-200">
            <span className="app-pill px-3 py-2">{race.trackName}</span>
            <span className="app-pill px-3 py-2">{race.location}</span>
            {race.mapCoordinates ? (
              <span className="app-pill px-3 py-2">
                {race.mapCoordinates.lat.toFixed(4)}, {race.mapCoordinates.lng.toFixed(4)}
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
    </div>
  );
}
