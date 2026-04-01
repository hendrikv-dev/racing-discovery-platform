import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EmptyState } from "@/components/states";
import { MyTrackingNav } from "@/components/tracking/my-tracking-nav";
import { SectionHeading } from "@/components/ui";
import { getMyTracking } from "@/lib/discovery";

export default async function MyTrackedRacersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/my-tracking/racers");
  }

  const data = await getMyTracking(session.user.id);

  if (!data) {
    redirect("/login?callbackUrl=/my-tracking/racers");
  }

  return (
    <div className="space-y-8">
      <section className="app-panel rounded-[28px] p-6">
        <MyTrackingNav pathname="/my-tracking/racers" />
      </section>
      <section className="app-panel rounded-[28px] p-6">
        <SectionHeading
          eyebrow="Followed Racers"
          title="Saved driver profiles"
          description="Keep your favorite racers in one place so they are easy to revisit before every weekend."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.racers.length > 0 ? (
            data.racers.map((racer) => (
              <Link
                key={racer.id}
                href={`/racers/${racer.slug}`}
                className="app-card rounded-[22px] p-5"
              >
                <h2 className="text-xl font-bold text-zinc-50">{racer.name}</h2>
                <p className="mt-2 text-sm text-zinc-300">{racer.team}</p>
              </Link>
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyState title="No followed racers yet" description="Follow racer profiles to see them collected here." />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
