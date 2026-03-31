import Link from "next/link";
import { CalendarDays, Flag, MapPinned, Search, Timer, Trophy } from "lucide-react";
import { auth } from "@/auth";
import { FindNearYouButton } from "@/components/home/find-near-you-button";
import { InteractiveMap } from "@/components/maps/interactive-map";
import { SectionHeading, StatusBadge } from "@/components/ui";
import { formatRelativeRaceTiming, getHomepageData } from "@/lib/discovery";

export default async function HomePage() {
  const session = await auth();
  const home = await getHomepageData(session?.user?.id);

  return (
    <div className="space-y-14 md:space-y-20">
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
                  Explore races, tracks, and championships — all in one place.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/races"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5"
                  >
                    Browse Races
                  </Link>
                </div>
                <p className="mt-5 text-sm font-medium text-blue-100">{home.statLine}</p>
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

        <div className="glass-border rounded-[28px] bg-zinc-900/80 p-6 shadow-panel">
          {home.nextTrackedRace ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-apex-muted">
                Your next tracked race
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">
                {home.nextTrackedRace.name}
              </h2>
              <p className="mt-3 text-base leading-7 text-zinc-300">
                {home.nextTrackedRace.trackName} in {home.nextTrackedRace.location} {formatRelativeRaceTiming(home.nextTrackedRace.startDate)}.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/races/${home.nextTrackedRace.slug}`}
                  className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition duration-150 hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                >
                  Open Next Race
                </Link>
                <Link
                  href="/my-tracking"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-100 transition duration-150 hover:bg-zinc-800 hover:border-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                >
                  View My Tracking
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-apex-muted">
                Find your next event
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">
                Start exploring
              </h2>
              <p className="mt-3 text-base leading-7 text-zinc-300">
                Jump straight into the schedule, open the map, or search the full platform in seconds.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition duration-150 hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                >
                  Open Search
                </Link>
                <Link
                  href="/championships"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-100 transition duration-150 hover:bg-zinc-800 hover:border-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
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
          eyebrow="Get Started"
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
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[24px] bg-slate-950 p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
              Track in one place
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              Track races, drivers, and tracks in one place
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Keep the series you follow close, spot the next weekend faster, and come back when the next race is near.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[22px] bg-slate-50 p-5">
              <CalendarDays className="h-6 w-6 text-apex-blue" />
              <h3 className="mt-4 text-xl font-bold text-apex-slate">Upcoming this week</h3>
              <p className="mt-2 text-3xl font-bold text-apex-slate">{String(home.upcomingThisWeek.length).padStart(2, "0")}</p>
              <p className="mt-2 text-sm leading-6 text-apex-muted">Race weekends starting in the next seven days.</p>
            </div>
            <div className="rounded-[22px] bg-slate-50 p-5">
              <MapPinned className="h-6 w-6 text-apex-blue" />
              <h3 className="mt-4 text-xl font-bold text-apex-slate">Mapped venues</h3>
              <p className="mt-2 text-3xl font-bold text-apex-slate">{home.metrics[2]?.value}</p>
              <p className="mt-2 text-sm leading-6 text-apex-muted">Tracks ready for fast geographic discovery.</p>
            </div>
            <div className="rounded-[22px] bg-slate-50 p-5">
              <Trophy className="h-6 w-6 text-apex-blue" />
              <h3 className="mt-4 text-xl font-bold text-apex-slate">Live series mix</h3>
              <p className="mt-2 text-3xl font-bold text-apex-slate">{home.metrics[0]?.value}</p>
              <p className="mt-2 text-sm leading-6 text-apex-muted">Championships available to browse and track.</p>
            </div>
          </div>
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

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
          <SectionHeading
          eyebrow="Follow Races"
          title="Upcoming this week"
          description="A fast way to see what is about to happen next."
          />
          <div className="space-y-3">
            {home.upcomingThisWeek.length > 0 ? (
              home.upcomingThisWeek.map((race) => (
                <Link
                  key={race.id}
                  href={`/races/${race.slug}`}
                  className="flex items-center justify-between gap-4 rounded-[20px] bg-slate-50 px-4 py-4 transition duration-200 hover:bg-slate-100"
                >
                  <div>
                    <p className="font-semibold text-apex-slate">{race.name}</p>
                    <p className="mt-1 text-sm text-apex-muted">
                      {race.trackName} • {race.championshipName}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-apex-blue">
                    {formatRelativeRaceTiming(race.startDate)}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-apex-muted">New race weekends will appear here as the calendar fills out.</p>
            )}
          </div>
        </div>

        <div className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
          <SectionHeading
          eyebrow="Explore Tracks"
          title="Popular tracks"
          description="A quick look at the venues appearing most often across the schedule."
          />
          <div className="space-y-3">
            {home.popularTracks.map((track) => (
              <Link
                key={track.id}
                href={`/tracks/${track.slug}`}
                className="flex items-center justify-between gap-4 rounded-[20px] bg-slate-50 px-4 py-4 transition duration-200 hover:bg-slate-100"
              >
                <div>
                  <p className="font-semibold text-apex-slate">{track.name}</p>
                  <p className="mt-1 text-sm text-apex-muted">
                    {track.location}, {track.country}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-apex-slate">
                  {track.raceCount} races
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Browse Events"
          title="Recently added races"
          description="Fresh additions from the latest calendar and admin updates."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {home.recentlyAdded.map((race) => (
            <Link
              key={race.id}
              href={`/races/${race.slug}`}
              className="glass-border rounded-[22px] bg-white p-5 shadow-panel transition duration-200 hover:-translate-y-1"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-apex-muted">
                {race.championshipName}
              </p>
              <h3 className="mt-2 text-xl font-bold text-apex-slate">{race.name}</h3>
              <p className="mt-3 text-sm text-apex-muted">
                {race.trackName} • {race.date}
              </p>
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
