import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EmptyState } from "@/components/states";
import { MyTrackingNav } from "@/components/tracking/my-tracking-nav";
import { MetricCard, SectionHeading } from "@/components/ui";
import { formatRelativeRaceTiming, getMyTracking } from "@/lib/discovery";

export default async function MyTrackingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/my-tracking");
  }

  const data = await getMyTracking(session.user.id);

  if (!data) {
    redirect("/login?callbackUrl=/my-tracking");
  }

  const nextRace = data.races.find((race) => race.status === "Upcoming" || race.status === "Live") ?? null;
  const upcomingRaces = data.races.filter((race) => race.status === "Upcoming" || race.status === "Live");
  const pastRaces = data.races.filter((race) => race.status === "Completed");

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-border rounded-[28px] bg-slate-950 p-6 text-white shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
            Tracking Center
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            {data.user.name ?? data.user.email}&apos;s dashboard
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Keep upcoming races, followed series, saved racers, and favorite circuits together in
            one place.
          </p>
          <div className="mt-6">
            <MyTrackingNav pathname="/my-tracking" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <MetricCard
            label="Tracked Races"
            value={String(data.races.length).padStart(2, "0")}
            detail="Upcoming and saved events on your watchlist."
          />
          <MetricCard
            label="Followed Series"
            value={String(data.championships.length).padStart(2, "0")}
            detail="Championships you are actively following."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Followed Racers"
          value={String(data.racers.length).padStart(2, "0")}
          detail="Driver profiles saved to your account."
        />
        <MetricCard
          label="Tracked Tracks"
          value={String(data.tracks.length).padStart(2, "0")}
          detail="Circuits pinned for fast return visits."
        />
        <MetricCard
          label="First Upcoming Race"
          value={nextRace?.name ?? "None"}
          detail="The next event waiting on your board."
        />
        <MetricCard
          label="Saved Total"
          value={String(
            data.races.length + data.championships.length + data.racers.length + data.tracks.length
          ).padStart(2, "0")}
          detail="Everything you want to come back to quickly."
        />
      </section>

      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Next Race"
          title="Your next tracked race"
          description="Come back here to pick up the next event you already care about."
          href="/my-tracking/races"
        />
        {nextRace ? (
          <Link
            href={`/races/${nextRace.slug}`}
            className="glass-border block rounded-[24px] bg-white p-6 shadow-panel transition duration-200 hover:-translate-y-1"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-apex-muted">
                  {nextRace.championshipName}
                </p>
                <h2 className="mt-2 text-3xl font-bold text-apex-slate">{nextRace.name}</h2>
                <p className="mt-3 text-sm text-apex-muted">
                  {nextRace.trackName} • {nextRace.location}
                </p>
              </div>
              <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-apex-blue">
                {formatRelativeRaceTiming(nextRace.startDate)}
              </div>
            </div>
          </Link>
        ) : (
          <EmptyState title="No upcoming tracked races yet" description="Track a race to keep the next weekend you care about front and center." />
        )}
      </section>

      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Upcoming"
          title="Upcoming tracked races"
          description="Everything on your board that is still ahead."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {upcomingRaces.length > 0 ? (
            upcomingRaces.map((race) => (
              <Link
                key={race.id}
                href={`/races/${race.slug}`}
                className="glass-border rounded-[22px] bg-white p-5 shadow-panel transition duration-200 hover:-translate-y-1"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-apex-muted">
                  {race.championshipName}
                </p>
                <h2 className="mt-2 text-xl font-bold text-apex-slate">{race.name}</h2>
                <p className="mt-3 text-sm text-apex-muted">{race.trackName} • {race.location}</p>
              </Link>
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyState title="No upcoming tracked races" description="Track a race from discovery pages and it will show up here." />
            </div>
          )}
        </div>
      </section>

      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Past"
          title="Past tracked races"
          description="Quick access to weekends you may want to revisit."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pastRaces.length > 0 ? (
            pastRaces.map((race) => (
              <Link
                key={race.id}
                href={`/races/${race.slug}`}
                className="glass-border rounded-[22px] bg-white p-5 shadow-panel transition duration-200 hover:-translate-y-1"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-apex-muted">
                  {race.championshipName}
                </p>
                <h2 className="mt-2 text-xl font-bold text-apex-slate">{race.name}</h2>
                <p className="mt-3 text-sm text-apex-muted">{race.trackName} • {race.location}</p>
              </Link>
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyState title="No past tracked races yet" description="Once tracked races finish, they will stay here for easy return visits." />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
