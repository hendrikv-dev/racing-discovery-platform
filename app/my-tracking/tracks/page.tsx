import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EmptyState } from "@/components/states";
import { MyTrackingNav } from "@/components/tracking/my-tracking-nav";
import { SectionHeading } from "@/components/ui";
import { getMyTracking } from "@/lib/discovery";

export default async function MyTrackedTracksPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/my-tracking/tracks");
  }

  const data = await getMyTracking(session.user.id);

  if (!data) {
    redirect("/login?callbackUrl=/my-tracking/tracks");
  }

  return (
    <div className="space-y-8">
      <section className="app-panel rounded-[28px] p-6">
        <MyTrackingNav pathname="/my-tracking/tracks" />
      </section>
      <section className="app-panel rounded-[28px] p-6">
        <SectionHeading
          eyebrow="Tracked Tracks"
          title="Saved circuits"
          description="Your followed track list with direct links back into the discovery experience."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.tracks.length > 0 ? (
            data.tracks.map((track) => (
              <Link
                key={track.id}
                href={`/tracks/${track.slug}`}
                className="app-card rounded-[22px] p-5"
              >
                <h2 className="text-xl font-bold text-zinc-50">{track.name}</h2>
                <p className="mt-2 text-sm text-zinc-300">{track.country}</p>
              </Link>
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyState title="No tracked tracks yet" description="Follow tracks to create a reusable circuit list." />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
