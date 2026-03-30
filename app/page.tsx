import Link from "next/link";
import { ArrowUpRight, Radar, ShieldCheck, Waves } from "lucide-react";
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
