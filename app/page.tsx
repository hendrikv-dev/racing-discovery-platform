import Link from "next/link";
import { CalendarDays, Flag, MapPinned, Search, Timer, Trophy } from "lucide-react";
import { auth } from "@/auth";
import { FindNearYouButton } from "@/components/home/find-near-you-button";
import { InteractiveMap } from "@/components/maps/interactive-map";
import { SectionHeading, StatusBadge } from "@/components/ui";
import { getHomepageData } from "@/lib/discovery";

const whatYouCanDo = [
  {
    icon: MapPinned,
    title: "Find races near you",
    description:
      "Jump into the map and spot race weekends happening close to you."
  },
  {
    icon: Trophy,
    title: "Explore tracks and championships",
    description:
      "Follow the venues, series, and rivalries that make each weekend worth watching."
  },
  {
    icon: CalendarDays,
    title: "Plan your calendar",
    description:
      "Use calendar and timeline views to see what is coming up this month and beyond."
  },
  {
    icon: Search,
    title: "Follow what matters",
    description:
      "Track races, racers, tracks, and championships so the next event is always easy to find."
  }
];

function getCountdownLabel(startDate: string) {
  const now = new Date();
  const start = new Date(startDate);
  const diff = start.getTime() - now.getTime();

  if (diff <= 0) {
    return "happening now";
  }

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `in ${days} day${days === 1 ? "" : "s"}`;
}

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
                  Find races. Follow drivers. Never miss an event.
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                  Explore upcoming races, discover tracks, and follow the series you care about.
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
                    Explore Map
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
          {home.nextTrackedRace ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-apex-muted">
                Next race coming up
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-apex-slate">
                {home.nextTrackedRace.name}
              </h2>
              <p className="mt-3 text-sm leading-7 text-apex-muted">
                {home.nextTrackedRace.trackName} in {home.nextTrackedRace.location} {getCountdownLabel(home.nextTrackedRace.startDate)}.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/races/${home.nextTrackedRace.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-apex-blue"
                >
                  Open Next Race
                </Link>
                <Link
                  href="/my-tracking"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-apex-slate transition duration-200 hover:-translate-y-0.5"
                >
                  View My Tracking
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-apex-muted">
                Search races, drivers, tracks, and championships
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-apex-slate">
                Start exploring
              </h2>
              <p className="mt-3 text-sm leading-7 text-apex-muted">
                Jump straight into the schedule, open the map, or search the full platform in seconds.
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
            </>
          )}
        </div>
      </section>

      <section className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Quick Entry"
          title="Start exploring"
          description="Pick the fastest way in and get to useful results right away."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <FindNearYouButton className="glass-border rounded-[22px] bg-white p-5 text-left shadow-panel transition duration-200 hover:-translate-y-1">
            <p className="text-xl font-bold text-apex-slate">Find races near you</p>
            <p className="mt-2 text-sm leading-6 text-apex-muted">Open the map and see the closest race weekends first.</p>
          </FindNearYouButton>
          <Link
            href="/races?view=calendar"
            className="glass-border rounded-[22px] bg-white p-5 shadow-panel transition duration-200 hover:-translate-y-1"
          >
            <p className="text-xl font-bold text-apex-slate">See what&apos;s happening this month</p>
            <p className="mt-2 text-sm leading-6 text-apex-muted">Plan around the calendar and spot busy weekends at a glance.</p>
          </Link>
          <Link
            href="/search"
            className="glass-border rounded-[22px] bg-white p-5 shadow-panel transition duration-200 hover:-translate-y-1"
          >
            <p className="text-xl font-bold text-apex-slate">Search races, drivers, and tracks</p>
            <p className="mt-2 text-sm leading-6 text-apex-muted">Jump straight to the people, venues, and series you care about.</p>
          </Link>
        </div>
      </section>

      <section className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Capabilities"
          title="What you can do"
          description="Everything on the platform is built to help you decide what to watch next."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {whatYouCanDo.map((item) => (
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
          description="Start with the next race weekends on the calendar and dive deeper from there."
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
            <div className="mt-8 rounded-[20px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
                Search discovery
              </p>
              <Link href="/search" className="mt-3 inline-flex text-base font-semibold text-white transition duration-200 hover:text-blue-200">
                Search races, drivers, tracks, and championships
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
