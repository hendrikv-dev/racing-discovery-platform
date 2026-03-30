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
      <section className="glass-border rounded-[28px] bg-slate-950 p-6 text-white shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
          Race Detail
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">{race.name}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{race.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm">{race.championshipName}</span>
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm">{race.trackName}</span>
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm">{race.status}</span>
        </div>
        <div className="mt-6">
          <TrackRaceButton raceId={race.id} initialTracked={race.isTracked} />
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

        <div className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-apex-muted">
            Race Location
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-apex-slate">Where this race happens</h2>
          <p className="mt-3 text-sm leading-7 text-apex-muted">
            Keep the weekend grounded in a real venue so it is easier to plan what to watch and follow.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-apex-slate">
            <span className="rounded-full bg-slate-100 px-3 py-2">{race.trackName}</span>
            <span className="rounded-full bg-slate-100 px-3 py-2">{race.location}</span>
            {race.mapCoordinates ? (
              <span className="rounded-full bg-slate-100 px-3 py-2">
                {race.mapCoordinates.lat.toFixed(4)}, {race.mapCoordinates.lng.toFixed(4)}
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-3 py-2 text-amber-800">
                Coordinates pending
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
