import Link from "next/link";
import { MapPinned } from "lucide-react";
import { auth } from "@/auth";
import { TrackBrowser } from "@/components/tracks/track-browser";
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
            description="Browse iconic venues by name or jump straight into their place on the map."
          />
          <div className="flex flex-wrap gap-2">
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
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-[22px] bg-slate-50 px-4 py-4">
          <MapPinned className="h-5 w-5 text-apex-blue" />
          <p className="text-sm text-apex-muted">
            Use map view to spot circuits by location, then open the venue you want to explore.
          </p>
        </div>
      </section>
      <TrackBrowser tracks={tracks} activeView={activeView} />
    </div>
  );
}
