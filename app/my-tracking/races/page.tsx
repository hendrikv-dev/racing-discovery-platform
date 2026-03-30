import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EmptyState } from "@/components/states";
import { MyTrackingNav } from "@/components/tracking/my-tracking-nav";
import { SectionHeading } from "@/components/ui";
import { getMyTracking } from "@/lib/discovery";

export default async function MyTrackedRacesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/my-tracking/races");
  }

  const data = await getMyTracking(session.user.id);

  if (!data) {
    redirect("/login?callbackUrl=/my-tracking/races");
  }

  return (
    <div className="space-y-8">
      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <MyTrackingNav pathname="/my-tracking/races" />
      </section>
      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Tracked Races"
          title="Saved race list"
          description="All tracked races sorted by schedule."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.races.length > 0 ? (
            data.races.map((race) => (
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
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyState title="No tracked races yet" description="Use the Track Race button on a race to build this list." />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
