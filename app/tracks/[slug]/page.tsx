import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { TrackMap } from "@/components/maps/track-map";
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

  return (
    <div className="space-y-8">
      <section className="glass-border overflow-hidden rounded-[28px] bg-white/80 shadow-panel">
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
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
              Track Details
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">{data.track.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">{data.track.history}</p>
            <div className="mt-6">
              <FollowButton
                entity="tracks"
                entityId={data.track.id}
                initialTracked={data.track.isTracked}
                activeLabel="Following"
                inactiveLabel="Follow Track"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Track Length" value={data.track.length} detail="Measured race layout distance." />
        <MetricCard label="Total Turns" value={String(data.track.turns)} detail="Combined technical corner count." />
        <MetricCard label="Lap Record" value={data.track.lapRecord} detail="Fastest verified reference lap." />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <TrackMap tracks={[data.track]} compact />
        <div className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-apex-muted">
            Coordinates
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-apex-slate">Mini-map position</h2>
          <p className="mt-3 text-sm leading-7 text-apex-muted">
            This track now carries latitude and longitude values in Prisma for map rendering and
            geographic discovery.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-apex-slate">
            <span className="rounded-full bg-slate-100 px-3 py-2">
              {data.track.coordinates.lat.toFixed(4)}, {data.track.coordinates.lng.toFixed(4)}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-2">{data.track.country}</span>
          </div>
        </div>
      </section>

      <section className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Event Timeline"
          title="Races at this circuit"
          description="Integrated schedule context for what has happened here and what is still ahead."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.races.map((race) => (
            <article key={race.id} className="glass-border rounded-[22px] bg-white p-5 shadow-panel">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-apex-muted">
                {race.championshipName}
              </p>
              <h2 className="mt-2 text-xl font-bold text-apex-slate">{race.name}</h2>
              <p className="mt-3 text-sm leading-6 text-apex-muted">{race.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
