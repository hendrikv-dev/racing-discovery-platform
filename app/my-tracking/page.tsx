import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MyTrackingNav } from "@/components/tracking/my-tracking-nav";
import { MetricCard, SectionHeading } from "@/components/ui";
import { getMyTracking } from "@/lib/discovery";

export default async function MyTrackingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/my-tracking");
  }

  const data = await getMyTracking(session.user.id);

  if (!data) {
    redirect("/login?callbackUrl=/my-tracking");
  }

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
            Your tracked races, followed championships, saved racers, and favorite circuits all now
            live behind authenticated session state.
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
          value={data.races[0]?.name ?? "None"}
          detail="Your next tracked race at a glance."
        />
        <MetricCard
          label="Saved Total"
          value={String(
            data.races.length + data.championships.length + data.racers.length + data.tracks.length
          ).padStart(2, "0")}
          detail="Combined tracked entities across the platform."
        />
      </section>

      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Tracked Races"
          title="Upcoming races on your board"
          description="Saved race entries stay sorted by their upcoming schedule."
          href="/my-tracking/races"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.races.slice(0, 3).map((race) => (
            <Link
              key={race.id}
              href={`/races/${race.slug}`}
              className="glass-border rounded-[22px] bg-white p-5 shadow-panel transition duration-200 hover:-translate-y-1"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-apex-muted">
                {race.championshipName}
              </p>
              <h2 className="mt-2 text-xl font-bold text-apex-slate">{race.name}</h2>
              <p className="mt-3 text-sm text-apex-muted">{race.location}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
