import Link from "next/link";
import { Compass, Flag, MapPinned, Search, Timer, Trophy } from "lucide-react";
import { auth } from "@/auth";
import { InteractiveMap } from "@/components/maps/interactive-map";
import { SectionHeading, StatusBadge } from "@/components/ui";
import { getHomepageData } from "@/lib/discovery";

const howItWorks = [
  {
    icon: Search,
    title: "Discover",
    description:
      "Search races, racers, tracks, and championships across upcoming and past events."
  },
  {
    icon: Compass,
    title: "Explore",
    description:
      "Use filters, calendar views, timeline views, and maps to find the races that matter."
  },
  {
    icon: Trophy,
    title: "Track",
    description:
      "Create an account to follow races, racers, tracks, and championships in one place."
  }
];

export default async function HomePage() {
  const session = await auth();
  const home = await getHomepageData(session?.user?.id);

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="glass-border overflow-hidden rounded-[28px] bg-slate-950 text-white shadow-panel">
          <div
            className="hero-image relative min-h-[560px] px-6 py-8 sm:px-10 sm:py-10"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(2,6,23,0.88), rgba(29,78,216,0.28)), url('https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80')"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="max-w-3xl">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-blue-200">
                  Motorsports Discovery
                </p>
                <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
                  Find your next race.
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                  Browse races, racers, tracks, and championships in one place — with search,
                  maps, calendar views, and personalized tracking.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/races"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5"
                  >
                    Browse Races
                  </Link>
                  <Link
                    href="/races?view=map"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-white/15"
                  >
                    Explore Map View
                  </Link>
                </div>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {home.metrics.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[20px] border border-white/12 bg-white/10 p-4 backdrop-blur-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
                      {item.label}
                    </p>
                    <p className="mt-4 text-4xl font-bold">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-border rounded-[28px] bg-white/85 p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-apex-muted">
            Search races, drivers, tracks, and championships
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-apex-slate">
            Jump straight into discovery
          </h2>
          <p className="mt-3 text-sm leading-7 text-apex-muted">
            Use global search when you already know what you want, or start with the race calendar
            if you are exploring what is next.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-apex-blue"
            >
              Open Search
            </Link>
            <Link
              href="/championships"
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-apex-slate transition duration-200 hover:-translate-y-0.5"
            >
              Browse Championships
            </Link>
          </div>
        </div>
      </section>

      <section className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
        <SectionHeading
          eyebrow="How It Works"
          title="How it works"
          description="Start broad, narrow the schedule fast, and keep the series that matter close."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {howItWorks.map((item) => (
            <div key={item.title} className="rounded-[22px] bg-slate-50 p-5">
              <item.icon className="h-6 w-6 text-apex-blue" />
              <h3 className="mt-4 text-xl font-bold text-apex-slate">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-apex-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Upcoming Races"
          title="Upcoming races"
          description="Real race weekends from the seeded calendar, already linked into maps, search, and tracking."
          href="/races"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {home.upcomingRaces.slice(0, 6).map((race) => (
            <Link
              key={race.id}
              href={`/races/${race.slug}`}
              className="glass-border rounded-[22px] bg-white p-5 shadow-panel transition duration-200 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-apex-muted">
                    {race.championshipName}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-apex-slate">{race.name}</h3>
                </div>
                <StatusBadge status={race.status} />
              </div>
              <div className="mt-4 space-y-2 text-sm text-apex-muted">
                <p className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-apex-blue" />
                  {race.date}
                </p>
                <p className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-apex-blue" />
                  {race.trackName}
                </p>
                <p className="flex items-center gap-2">
                  <MapPinned className="h-4 w-4 text-apex-blue" />
                  {race.location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="glass-border overflow-hidden rounded-[28px] bg-white/85 shadow-panel">
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-slate-950 p-6 text-white sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
              Explore by location
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              Explore by location
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
              See where races are happening and explore tracks geographically.
            </p>
            <div className="mt-6">
              <Link
                href="/races?view=map"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5"
              >
                Open Map View
              </Link>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {home.mapPreviewRaces.length > 0 ? (
              <InteractiveMap
                points={home.mapPreviewRaces.map((race) => ({
                  id: race.id,
                  lat: race.mapCoordinates!.lat,
                  lng: race.mapCoordinates!.lng,
                  title: race.name,
                  subtitle: `${race.trackName} • ${race.championshipName}`,
                  meta: race.date
                }))}
                className="h-[320px] lg:h-[360px]"
              />
            ) : (
              <div className="glass-border flex h-[320px] items-center justify-center rounded-[24px] bg-slate-50 p-6 text-center text-sm text-apex-muted">
                Map previews appear here when race locations are available.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
