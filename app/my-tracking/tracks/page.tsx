import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
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
      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <MyTrackingNav pathname="/my-tracking/tracks" />
      </section>
      <section className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Tracked Tracks"
          title="Saved circuits"
          description="Your followed track list with direct links back into the discovery experience."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.tracks.map((track) => (
            <Link
              key={track.id}
              href={`/tracks/${track.slug}`}
              className="glass-border rounded-[22px] bg-white p-5 shadow-panel transition duration-200 hover:-translate-y-1"
            >
              <h2 className="text-xl font-bold text-apex-slate">{track.name}</h2>
              <p className="mt-2 text-sm text-apex-muted">{track.country}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
