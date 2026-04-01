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
      <section className="app-panel rounded-[28px] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Track Discovery"
            title="Explore circuits in list or map view"
            description="Browse iconic venues by name or jump straight into their place on the map."
          />
          <div className="flex flex-wrap gap-2">
            <Link
              href="/tracks?view=map"
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition duration-150 ${
                  activeView === "map"
                  ? "border-violet-500 bg-violet-600 text-white"
                  : "border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/90"
              }`}
            >
              Map
            </Link>
            <Link
              href="/tracks"
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition duration-150 ${
                  activeView === "list"
                  ? "border-violet-500 bg-violet-600 text-white"
                  : "border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/90"
              }`}
            >
              List
            </Link>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-[22px] border border-zinc-800 bg-zinc-900/80 px-4 py-4">
          <MapPinned className="h-5 w-5 text-teal-300" />
          <p className="text-sm text-zinc-300">
            Use map view to spot circuits by location, then open the venue you want to explore.
          </p>
        </div>
      </section>
      <TrackBrowser tracks={tracks} activeView={activeView} />
    </div>
  );
}
