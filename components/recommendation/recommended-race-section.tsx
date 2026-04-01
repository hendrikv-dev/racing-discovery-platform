import Link from "next/link";
import { EmptyState } from "@/components/states";
import { StatusBadge } from "@/components/ui";
import { RecommendedRace } from "@/lib/recommendation/recommend";

export function RecommendedRaceSection({
  eyebrow,
  title,
  description,
  races,
  href,
  emptyTitle,
  emptyDescription
}: {
  eyebrow: string;
  title: string;
  description: string;
  races: RecommendedRace[];
  href?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  return (
    <section className="app-panel rounded-[28px] p-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-5xl">{title}</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">{description}</p>
        </div>
        {href ? (
          <Link
            href={href}
            className="secondary-action inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
          >
            Open full schedule
          </Link>
        ) : null}
      </div>

      {races.length === 0 ? (
        <EmptyState
          title={emptyTitle ?? "Nothing personalized yet"}
          description={
            emptyDescription ?? "Follow a racer, track, championship, or race to unlock recommendations here."
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {races.map((race) => (
            <Link key={race.id} href={`/races/${race.slug}`} className="app-card rounded-[22px] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                    {race.championshipName}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-zinc-50">{race.name}</h3>
                </div>
                <StatusBadge status={race.status} />
              </div>
              <p className="mt-3 text-sm font-semibold text-teal-300">{race.date}</p>
              <p className="mt-2 text-sm text-zinc-300">
                {race.trackName} • {race.location}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-2 font-medium text-violet-200">
                  {race.recommendationReason}
                </span>
                {race.isTracked ? (
                  <span className="rounded-full border border-teal-400/30 bg-teal-500/10 px-3 py-2 font-medium text-teal-200">
                    Tracked
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
