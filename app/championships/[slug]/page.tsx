import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { FollowButton } from "@/components/tracking/follow-button";
import { MetricCard, SectionHeading } from "@/components/ui";
import { getChampionshipBySlug } from "@/lib/discovery";

function formatDateRange(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });

  return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`;
}

export default async function ChampionshipDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const data = await getChampionshipBySlug(slug, session?.user?.id);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="glass-border overflow-hidden rounded-[28px] bg-white/85 shadow-panel">
        <div className="relative min-h-[420px]">
          <Image
            src={data.championship.image}
            alt={`${data.championship.name} championship banner`}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, rgba(2, 6, 23, 0.9), ${data.championship.accentColor}55)`
            }}
          />
          <div className="relative flex min-h-[420px] flex-col justify-end p-6 text-white sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-100">
              Championship Detail
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              {data.championship.name}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
              {data.championship.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <FollowButton
                entity="championships"
                entityId={data.championship.id}
                initialTracked={data.championship.isTracked}
                activeLabel="Following"
                inactiveLabel="Follow Championship"
              />
              <Link
                href={`/races?championship=${data.championship.slug}`}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-white/15"
              >
                View Championship Races
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Season"
          value={data.championship.season}
          detail="Current active championship season."
        />
        <MetricCard
          label="Race Count"
          value={String(data.championship.raceCount).padStart(2, "0")}
          detail="Races currently linked to this championship."
        />
        <MetricCard
          label="Related Racers"
          value={String(data.championship.racerCount).padStart(2, "0")}
          detail="Racers currently associated to this title fight."
        />
      </section>

      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Race Schedule"
          title="Races in this championship"
          description="Calendar-linked championship races sourced from the existing Prisma records."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.races.map((race) => (
            <article key={race.id} className="glass-border rounded-[22px] bg-white p-5 shadow-panel">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-apex-muted">
                {race.series}
              </p>
              <h2 className="mt-2 text-xl font-bold text-apex-slate">{race.name}</h2>
              <p className="mt-3 text-sm leading-6 text-apex-muted">{race.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-apex-slate">
                <span className="rounded-full bg-slate-100 px-3 py-2">
                  {formatDateRange(race.startDate, race.endDate)}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-2">{race.trackName}</span>
              </div>
              <Link
                href={`/races/${race.slug}`}
                className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-apex-blue"
              >
                Open Race
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Related Racers"
          title="Competitors in this championship"
          description="Racer cards tied to the championship relation in Prisma."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.racers.map((racer) => (
            <article key={racer.id} className="glass-border rounded-[22px] bg-white p-5 shadow-panel">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-apex-slate">{racer.name}</h2>
                  <p className="mt-1 text-sm text-apex-muted">
                    {racer.team} • {racer.nationality}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-apex-slate">
                  #{racer.number}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-apex-slate">
                <span className="rounded-full bg-slate-100 px-3 py-2">
                  {racer.victories} wins
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-2">
                  {racer.podiums} podiums
                </span>
              </div>
              <Link
                href={`/racers/${racer.slug}`}
                className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-apex-blue"
              >
                View Racer
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
