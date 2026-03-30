import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { TrackMap } from "@/components/maps/track-map";
import { FollowButton } from "@/components/tracking/follow-button";
import { SectionHeading } from "@/components/ui";
import { getTracks } from "@/lib/discovery";

export default async function TracksPage({
  searchParams
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const session = await auth();
  const { view } = await searchParams;
  const activeView = view === "map" ? "map" : "list";
  const tracks = await getTracks(session?.user?.id);

  return (
    <div className="space-y-8">
      <section className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Track Discovery"
            title="Explore circuits in list or map view"
            description="Track cards and map markers both read from the same coordinate-backed Prisma records."
          />
          <div className="flex flex-wrap gap-2">
            <Link
              href="/tracks"
              className={`rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                activeView === "list"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-apex-slate hover:-translate-y-0.5"
              }`}
            >
              List
            </Link>
            <Link
              href="/tracks?view=map"
              className={`rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                activeView === "map"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-apex-slate hover:-translate-y-0.5"
              }`}
            >
              Map
            </Link>
          </div>
        </div>
      </section>

      {activeView === "map" ? (
        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <TrackMap tracks={tracks} />
          <div className="grid gap-4">
            {tracks.map((track) => (
              <article key={track.id} className="glass-border rounded-[24px] bg-white/85 p-5 shadow-panel">
                <h2 className="text-xl font-bold text-apex-slate">{track.name}</h2>
                <p className="mt-2 text-sm text-apex-muted">{track.country}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-apex-slate">
                  <span className="rounded-full bg-slate-100 px-3 py-2">{track.length}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-2">{track.raceCount} races</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tracks.map((track) => (
            <article
              key={track.id}
              className="glass-border overflow-hidden rounded-[24px] bg-white/90 shadow-panel"
            >
              <div className="relative h-56">
                <Image
                  src={track.image}
                  alt={`${track.name} circuit view`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold text-apex-slate">{track.name}</h2>
                <p className="mt-2 text-sm text-apex-muted">{track.history}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-apex-slate">
                  <span className="rounded-full bg-slate-100 px-3 py-2">{track.country}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-2">{track.length}</span>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={`/tracks/${track.slug}`}
                    className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-apex-blue"
                  >
                    View Track
                  </Link>
                  <FollowButton
                    entity="tracks"
                    entityId={track.id}
                    initialTracked={track.isTracked}
                    activeLabel="Following"
                    inactiveLabel="Follow Track"
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
