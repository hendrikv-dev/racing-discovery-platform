import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { MetricCard, SectionHeading } from "@/components/ui";
import { FollowButton } from "@/components/tracking/follow-button";
import { getChampionships } from "@/lib/discovery";

export default async function ChampionshipsPage() {
  const session = await auth();
  const championships = await getChampionships(session?.user?.id);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-border rounded-[28px] bg-slate-950 p-6 text-white shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
            Championship Hub
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Follow every title fight from one place</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Explore the series on the platform, track the next decisive race, and move directly
            into championship-specific race discovery.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <MetricCard
            label="Championships"
            value={String(championships.length).padStart(2, "0")}
            detail="Active series now available in the platform."
          />
          <MetricCard
            label="Tracked Series"
            value={String(championships.filter((championship) => championship.isTracked).length).padStart(2, "0")}
            detail="Series already saved by the current session."
          />
        </div>
      </section>

      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Series Directory"
          title="Championship overview"
          description="Each championship page now links together description, race schedule, and related racers."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {championships.map((championship) => (
            <article
              key={championship.id}
              className="glass-border overflow-hidden rounded-[24px] bg-white shadow-panel"
            >
              <div className="relative h-56">
                <Image
                  src={championship.image}
                  alt={`${championship.name} championship art`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, rgba(2, 6, 23, 0.82), ${championship.accentColor}66)`
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                    {championship.category}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">{championship.name}</h2>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-6 text-apex-muted">{championship.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-apex-slate">
                  <span className="rounded-full bg-slate-100 px-3 py-2">{championship.season}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-2">{championship.region}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-2">
                    {championship.raceCount} races
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={`/championships/${championship.slug}`}
                    className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-apex-blue"
                  >
                    View Championship
                  </Link>
                  <FollowButton
                    entity="championships"
                    entityId={championship.id}
                    initialTracked={championship.isTracked}
                    activeLabel="Following"
                    inactiveLabel="Follow Championship"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
