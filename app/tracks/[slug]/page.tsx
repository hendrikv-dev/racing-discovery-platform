import Image from "next/image";
import { notFound } from "next/navigation";
import { MetricCard, RaceCard, SectionHeading } from "@/components/ui";
import { races, tracks } from "@/data/site";

export default async function TrackDetailsPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const track = tracks.find((entry) => entry.slug === slug);

  if (!track) {
    notFound();
  }

  const relatedRaces = races.filter((race) => race.trackSlug === track.slug);

  return (
    <div className="space-y-8">
      <section className="glass-border overflow-hidden rounded-[28px] bg-white/80 shadow-panel">
        <div className="relative min-h-[420px]">
          <Image
            src={track.image}
            alt={`${track.name} aerial circuit profile`}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
          <div className="relative flex min-h-[420px] flex-col justify-end p-6 text-white sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
              Track Details
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">{track.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">{track.history}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Track Length" value={track.length} detail="Measured race layout distance." />
        <MetricCard label="Total Turns" value={String(track.turns)} detail="Combined technical corner count." />
        <MetricCard label="Lap Record" value={track.lapRecord} detail="Fastest verified reference lap." />
      </section>

      <section className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Event Timeline"
          title="Races at this circuit"
          description="Integrated schedule context for what has happened here and what is still ahead."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {relatedRaces.map((race) => (
            <RaceCard key={race.slug} race={race} />
          ))}
        </div>
      </section>
    </div>
  );
}
