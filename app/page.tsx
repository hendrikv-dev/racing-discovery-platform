import Link from "next/link";
import { ArrowUpRight, MapPinned, Radar, ShieldCheck, Waves } from "lucide-react";
import { MetricCard, RaceCard, RacerCard, SectionHeading, TrackCard } from "@/components/ui";
import { championshipSummary, races, racers, tracks } from "@/data/site";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="glass-border overflow-hidden rounded-[28px] bg-slate-950 text-white shadow-panel">
          <div
            className="hero-image relative min-h-[520px] px-6 py-8 sm:px-10 sm:py-10"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(2,6,23,0.86), rgba(29,78,216,0.38)), url('https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80')"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="max-w-3xl">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-blue-200">
                  Precision Kineticism
                </p>
                <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
                  Discover races, racers, and tracks in one place.
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
                  A premium editorial hub built for motorsport fans who want live context, deep
                  profiles, and circuit intelligence without bouncing between tabs.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/races"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5"
                  >
                    Start Discovering
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-white/15"
                  >
                    Unified Search
                  </Link>
                </div>
              </div>
              <div className="grid gap-4 pt-10 md:grid-cols-3">
                <div className="rounded-[20px] border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                  <Radar className="h-5 w-5 text-blue-200" />
                  <p className="mt-4 text-lg font-semibold">Live Session Pulse</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Active race control, session state, and curated telemetry highlights.
                  </p>
                </div>
                <div className="rounded-[20px] border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                  <ShieldCheck className="h-5 w-5 text-blue-200" />
                  <p className="mt-4 text-lg font-semibold">Verified Data</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Contributor workflows with audit trails for dependable event records.
                  </p>
                </div>
                <div className="rounded-[20px] border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                  <Waves className="h-5 w-5 text-blue-200" />
                  <p className="mt-4 text-lg font-semibold">Editorial Motion</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Bold imagery and data cards tuned for fast scanning on any screen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          {championshipSummary.map((item) => (
            <MetricCard key={item.label} {...item} />
          ))}
        </div>
      </section>

      <section className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Quick Discovery"
          title="Current championship momentum"
          description="A concise launchpad into what is live, what is next, and where the paddock is heading."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {races.map((race) => (
            <RaceCard key={race.slug} race={race} />
          ))}
        </div>
      </section>

      <section className="glass-border overflow-hidden rounded-[28px] bg-white/85 shadow-panel">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[300px] bg-slate-950 p-6 text-white sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.28),_transparent_45%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(15,23,42,0.84))]" />
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                  Explore By Location
                </p>
                <h2 className="mt-4 max-w-lg text-3xl font-bold tracking-tight">
                  Geographic discovery is now part of the product, not a hidden extra.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                  Jump straight into race map view or browse circuits by their real-world venue
                  locations.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/races?view=map"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5"
                >
                  Race Map View
                  <MapPinned className="h-4 w-4" />
                </Link>
                <Link
                  href="/tracks?view=map"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-white/15"
                >
                  Track Map View
                </Link>
              </div>
            </div>
          </div>
          <div className="grid gap-4 p-6 sm:p-8">
            {[
              ["Global race map", "Map markers reflect filtered race discovery and fall back to track coordinates when needed."],
              ["Circuit venue map", "Track map view keeps physical venues visible even when some records are still list-only."],
              ["Detail-page location previews", "Race and track pages now carry their own location sections so place context stays visible."]
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[22px] bg-slate-50 p-5">
                <p className="text-lg font-semibold text-apex-slate">{title}</p>
                <p className="mt-2 text-sm leading-6 text-apex-muted">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Featured Racers"
          title="Portrait-led stories from the front of the grid"
          description="A curated set of drivers with verified stats, recent form, and machine context."
          href="/search"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {racers.map((racer) => (
            <RacerCard key={racer.slug} racer={racer} />
          ))}
        </div>
      </section>

      <section className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Legendary Circuits"
          title="Landscape profiles built around place and pace"
          description="Circuit details blend layout context, technical specifications, and event history."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {tracks.map((track) => (
            <TrackCard key={track.slug} track={track} />
          ))}
        </div>
      </section>
    </div>
  );
}
