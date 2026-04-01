import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { FollowButton } from "@/components/tracking/follow-button";
import { MetricCard, SectionHeading } from "@/components/ui";
import { getRacerBySlug } from "@/lib/discovery";

export default async function RacerProfilePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const racer = await getRacerBySlug(slug, session?.user?.id);

  if (!racer) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#11131C]/95 shadow-[0_18px_48px_rgba(0,0,0,0.3)]">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[420px]">
            <Image
              src={racer.image}
              alt={`${racer.name} portrait`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
          <div className="flex flex-col justify-between p-6 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
                Racer Profile
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-50 md:text-5xl">
                {racer.name}
              </h1>
              <p className="mt-3 text-lg text-zinc-300">
                {racer.team} • {racer.nationality} • Car #{racer.number}
              </p>
              <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-300">
                Follow this racer to keep their profile close on race weekend.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <FollowButton
                  entity="racers"
                  entityId={racer.id}
                  initialTracked={racer.isTracked}
                  activeLabel="Following"
                  inactiveLabel="Follow Racer"
                />
                {racer.championshipSlug ? (
                  <Link
                    href={`/championships/${racer.championshipSlug}`}
                    className="inline-flex items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm font-semibold text-zinc-100 transition duration-150 hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-800/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
                  >
                    View Championship
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <MetricCard
                label="Victories"
                value={String(racer.victories).padStart(2, "0")}
                detail="Career wins across premier series."
              />
              <MetricCard
                label="Podiums"
                value={String(racer.podiums).padStart(2, "0")}
                detail="Top-three finishes in verified events."
              />
              <MetricCard
                label="Titles"
                value={String(racer.championships).padStart(2, "0")}
                detail="Championships secured to date."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="app-panel rounded-[28px] p-6">
          <SectionHeading
            eyebrow="Machine Gallery"
            title={racer.vehicle}
            description="Get a quick read on the machine this racer brings into the weekend."
          />
          <div className="rounded-[24px] border border-white/10 bg-[#0F1118] p-6 text-white">
            <p className="text-sm uppercase tracking-[0.28em] text-teal-300">Championship Context</p>
            <p className="mt-5 text-lg font-semibold">
              {racer.championshipName ?? "Independent competitor context"}
            </p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Jump from a racer you follow straight into the championship story around them.
            </p>
          </div>
        </div>

        <div className="app-panel rounded-[28px] p-6">
          <SectionHeading
            eyebrow="Racer Snapshot"
            title="Current profile data"
            description="Scan the details that matter before you jump back into the calendar."
          />
          <div className="overflow-hidden rounded-[24px] border border-zinc-800 bg-zinc-950/80">
            <table className="min-w-full divide-y divide-zinc-800 text-left text-sm">
              <tbody className="divide-y divide-zinc-800 bg-zinc-950/70">
                <tr>
                  <td className="px-4 py-4 font-medium text-zinc-100">Team</td>
                  <td className="px-4 py-4 text-zinc-300">{racer.team}</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium text-zinc-100">Nationality</td>
                  <td className="px-4 py-4 text-zinc-300">{racer.nationality}</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium text-zinc-100">Championship</td>
                  <td className="px-4 py-4 text-zinc-300">
                    {racer.championshipName ?? "Not assigned"}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium text-zinc-100">Vehicle</td>
                  <td className="px-4 py-4 text-zinc-300">{racer.vehicle}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="app-panel rounded-[28px] p-6">
        <SectionHeading
          eyebrow="Recent Races"
          title="Recent race history"
          description="Use recent race weekends to understand where this racer has been active lately."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {racer.recentRaces.length > 0 ? (
            racer.recentRaces.map((race) => (
              <Link key={race.id} href={`/races/${race.slug}`} className="app-card rounded-[22px] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  {race.championshipName}
                </p>
                <h2 className="mt-2 text-xl font-bold text-zinc-50">{race.name}</h2>
                <p className="mt-3 text-sm font-semibold text-teal-300">{race.date}</p>
                <p className="mt-2 text-sm text-zinc-300">
                  {race.trackName} • {race.location}
                </p>
              </Link>
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <p className="text-sm text-zinc-300">Recent races will show up here as entries are added.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
