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

  const standings = [...data.racers]
    .sort(
      (left, right) =>
        right.victories - left.victories ||
        right.podiums - left.podiums ||
        left.name.localeCompare(right.name)
    )
    .slice(0, 5);
  const upcomingRaces = data.races.filter((race) => race.status === "Upcoming" || race.status === "Live");

  return (
    <div className="space-y-8">
      <section className="surface-card-strong overflow-hidden rounded-[28px]">
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
            <p className="app-kicker">
              Championship Detail
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              {data.championship.name}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-200">
              {data.championship.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-200">
              <span className="app-pill px-3 py-2">{data.championship.season}</span>
              <span className="app-pill px-3 py-2">{data.championship.region}</span>
            </div>
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
                className="secondary-action rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
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
          detail="See how much action this title fight still has ahead."
        />
        <MetricCard
          label="Related Racers"
          value={String(data.championship.racerCount).padStart(2, "0")}
          detail="See who to watch across the season."
        />
      </section>

      <section className="app-panel rounded-[28px] p-6">
        <SectionHeading
          eyebrow="Standings Snapshot"
          title="Who is shaping this title fight"
          description="A quick form guide based on wins and podium momentum across this championship roster."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {standings.map((racer, index) => (
            <Link key={racer.id} href={`/racers/${racer.slug}`} className="app-card rounded-[22px] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                Position {index + 1}
              </p>
              <h2 className="mt-2 text-xl font-bold text-zinc-50">{racer.name}</h2>
              <p className="mt-2 text-sm text-zinc-300">{racer.team}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-200">
                <span className="app-pill px-3 py-2">{racer.victories} wins</span>
                <span className="app-pill px-3 py-2">{racer.podiums} podiums</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="app-panel rounded-[28px] p-6">
        <SectionHeading
          eyebrow="Upcoming Races"
          title="Upcoming races in this championship"
          description="See the next weekends that still shape the championship battle."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(upcomingRaces.length > 0 ? upcomingRaces : data.races).map((race) => (
            <article key={race.id} className="app-card rounded-[22px] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                {race.series}
              </p>
              <h2 className="mt-2 text-xl font-bold text-zinc-50">{race.name}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{race.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-200">
                <span className="app-pill px-3 py-2">
                  {formatDateRange(race.startDate, race.endDate)}
                </span>
                <span className="app-pill px-3 py-2">{race.trackName}</span>
              </div>
              <Link
                href={`/races/${race.slug}`}
                className="primary-action mt-5 inline-flex rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
              >
                Open Race
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="app-panel rounded-[28px] p-6">
        <SectionHeading
          eyebrow="Related Racers"
          title="Competitors in this championship"
          description="See the drivers shaping this season and open the profiles that matter to you."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.racers.map((racer) => (
            <article key={racer.id} className="app-card rounded-[22px] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-zinc-50">{racer.name}</h2>
                  <p className="mt-1 text-sm text-zinc-300">
                    {racer.team} • {racer.nationality}
                  </p>
                </div>
                <span className="app-pill px-3 py-2 text-sm font-medium">
                  #{racer.number}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-200">
                <span className="app-pill px-3 py-2">
                  {racer.victories} wins
                </span>
                <span className="app-pill px-3 py-2">
                  {racer.podiums} podiums
                </span>
              </div>
              <Link
                href={`/racers/${racer.slug}`}
                className="primary-action mt-5 inline-flex rounded-xl px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
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
