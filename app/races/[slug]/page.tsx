import { notFound } from "next/navigation";
import { auth } from "@/auth";
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
          detail="Race start and end dates from Prisma."
        />
        <MetricCard label="Location" value={race.location} detail="Mapped race location for discovery views." />
        <MetricCard
          label="Coordinates"
          value={`${race.coordinates.lat.toFixed(2)}, ${race.coordinates.lng.toFixed(2)}`}
          detail="Used by the map experience."
        />
      </section>
    </div>
  );
}
