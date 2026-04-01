import Link from "next/link";
import { CalendarDays, Flag, MapPinned, Search, Timer, Trophy } from "lucide-react";
import { auth } from "@/auth";
import { FindNearYouButton } from "@/components/home/find-near-you-button";
import { InteractiveMap } from "@/components/maps/interactive-map";
import { NearYouSection } from "@/components/recommendation/near-you-section";
import { RecommendedRaceSection } from "@/components/recommendation/recommended-race-section";
import { SectionHeading, StatusBadge } from "@/components/ui";
import { formatRelativeRaceTiming, getHomepageData } from "@/lib/discovery";
import { getPersonalizedRaceRecommendations } from "@/lib/recommendation/recommend";

export default async function HomePage() {
  const session = await auth();
  const [home, recommendations] = await Promise.all([
    getHomepageData(session?.user?.id),
    getPersonalizedRaceRecommendations(session?.user?.id)
  ]);

  return (
    <div className="space-y-16 md:space-y-24">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="surface-panel overflow-hidden rounded-[28px] text-white">
          <div
            className="hero-image relative min-h-[560px] px-6 py-8 sm:px-10 sm:py-10"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(9,9,15,0.72), rgba(9,9,15,0.95)), url('https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80')"
            }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(124,58,237,0.18),transparent_42%),linear-gradient(225deg,rgba(20,184,166,0.12),transparent_38%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090F] via-[#09090F]/55 to-[#09090F]/25 backdrop-blur-[2px]" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="max-w-3xl">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-violet-200">
                  Motorsports Discovery
                </p>
                <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
                  Find races. Follow drivers. Never miss an event.
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-200 sm:text-base">
                  Explore races, tracks, and championships — all in one place.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/races"
                    className="primary-action inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-[0_12px_24px_rgba(124,58,237,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
                  >
                    Browse Races
                  </Link>
                  <Link
                    href="/races?view=map"
                    className="secondary-action inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
                  >
                    Explore Map
                  </Link>
                </div>
                <p className="mt-5 text-sm font-medium text-zinc-200">{home.statLine}</p>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {home.metrics.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[20px] border border-white/10 bg-black/25 p-4 backdrop-blur-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-300">
                      {item.label}
                    </p>
                    <p className="mt-4 text-4xl font-bold">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="surface-panel rounded-[28px] p-6">
          {home.nextTrackedRace ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">
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
                  className="primary-action inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
                >
                  Open Next Race
                </Link>
                <Link
                  href="/my-tracking"
                  className="secondary-action inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
                >
                  View My Tracking
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">
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
                  className="primary-action inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
                >
                  Open Search
                </Link>
                <Link
                  href="/championships"
                  className="secondary-action inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
                >
                  Browse Championships
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="surface-panel rounded-[28px] p-6">
        <SectionHeading
          eyebrow="Get Started"
          title="Start exploring"
          description="Pick the fastest way in and get to useful results right away."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <FindNearYouButton className="surface-card rounded-[22px] p-5 text-left transition duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)]">
            <p className="text-xl font-bold text-zinc-50">Find races near you</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">Open the map and see the closest race weekends first.</p>
          </FindNearYouButton>
          <Link
            href="/races?view=calendar"
            className="surface-card rounded-[22px] p-5 transition duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)]"
          >
            <p className="text-xl font-bold text-zinc-50">See what&apos;s happening this month</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">Plan around the calendar and spot busy weekends at a glance.</p>
          </Link>
          <Link
            href="/search"
            className="surface-card rounded-[22px] p-5 transition duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)]"
          >
            <p className="text-xl font-bold text-zinc-50">Search races, drivers, and tracks</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">Jump straight to the people, venues, and series you care about.</p>
          </Link>
        </div>
      </section>

      {session?.user?.id ? (
        <RecommendedRaceSection
          eyebrow="Recommended For You"
          title="Recommended for you"
          description="A smarter starting point based on what you track and what is coming up soon."
          races={recommendations.recommended.slice(0, 3)}
          href="/my-tracking"
          emptyTitle="Start tracking to unlock recommendations"
          emptyDescription="Follow a race, track, racer, or championship and the next relevant weekends will show up here."
        />
      ) : null}

      <NearYouSection />

      <RecommendedRaceSection
        eyebrow="Races This Weekend"
        title="Races this weekend"
        description="The fastest habit-forming view in the product: check what is happening over the next seven days and jump straight in."
        races={recommendations.thisWeekend.slice(0, 3)}
        href="/races"
        emptyTitle="No race weekends in the next seven days"
        emptyDescription="Browse the full calendar to see what is coming up next across the season."
      />

      <section className="surface-panel rounded-[28px] p-6">
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-card-strong rounded-[24px] p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">
              What you can do
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              Find races, explore venues, and stay close to the series you follow
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-300">
              Use the schedule, maps, and tracking tools together so the next race weekend is always easy to find.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="surface-card rounded-[22px] p-5">
              <CalendarDays className="h-6 w-6 text-teal-300" />
              <h3 className="mt-4 text-xl font-bold text-zinc-50">Browse upcoming events</h3>
              <p className="mt-2 text-3xl font-bold text-zinc-50">{String(home.upcomingThisWeek.length).padStart(2, "0")}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">See what is happening this week and open the next race fast.</p>
            </div>
            <div className="surface-card rounded-[22px] p-5">
              <MapPinned className="h-6 w-6 text-teal-300" />
              <h3 className="mt-4 text-xl font-bold text-zinc-50">Explore by location</h3>
              <p className="mt-2 text-3xl font-bold text-zinc-50">{home.metrics[2]?.value}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">Find race weekends and tracks on the map instead of hunting through lists.</p>
            </div>
            <div className="surface-card rounded-[22px] p-5">
              <Trophy className="h-6 w-6 text-teal-300" />
              <h3 className="mt-4 text-xl font-bold text-zinc-50">Follow championships</h3>
              <p className="mt-2 text-3xl font-bold text-zinc-50">{home.metrics[0]?.value}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">Keep the drivers, venues, and championships you care about in one place.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-panel rounded-[28px] p-6">
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
              className="surface-card overflow-hidden rounded-[22px] transition duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)]"
            >
              <div
                className="h-28 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(9,9,15,0.18), rgba(9,9,15,0.72)), url('${race.image}')`
                }}
              />
              <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                    {race.championshipName}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-zinc-50">{race.name}</h3>
                </div>
                <StatusBadge status={race.status} />
              </div>
              <div className="mt-4 space-y-2 text-sm text-zinc-300">
                <p className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-teal-300" />
                  {race.date}
                </p>
                <p className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-teal-300" />
                  {race.trackName}
                </p>
                <p className="flex items-center gap-2">
                  <MapPinned className="h-4 w-4 text-teal-300" />
                  {race.location}
                </p>
              </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="surface-panel rounded-[28px] p-6">
          <SectionHeading
          eyebrow="Races This Weekend"
          title="Races this weekend"
          description="The next seven days of race weekends, sorted so you can decide what to watch first."
          />
          <div className="space-y-3">
            {home.upcomingThisWeek.length > 0 ? (
              home.upcomingThisWeek.map((race) => (
                <Link
                  key={race.id}
                  href={`/races/${race.slug}`}
                  className="surface-card flex items-center justify-between gap-4 rounded-[20px] px-4 py-4 transition duration-150 hover:-translate-y-0.5 hover:border-white/20"
                >
                  <div>
                    <p className="font-semibold text-zinc-50">{race.name}</p>
                    <p className="mt-1 text-sm text-zinc-300">
                      {race.trackName} • {race.championshipName}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-teal-300">
                    {formatRelativeRaceTiming(race.startDate)}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-zinc-300">New race weekends will appear here as the calendar fills out.</p>
            )}
          </div>
        </div>

        <div className="surface-panel rounded-[28px] p-6">
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
                className="surface-card flex items-center justify-between gap-4 rounded-[20px] px-4 py-4 transition duration-150 hover:-translate-y-0.5 hover:border-white/20"
              >
                <div>
                  <p className="font-semibold text-zinc-50">{track.name}</p>
                  <p className="mt-1 text-sm text-zinc-300">
                    {track.location}, {track.country}
                  </p>
                </div>
                <span className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm font-semibold text-zinc-100">
                  {track.raceCount} races
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-panel rounded-[28px] p-6">
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
              className="surface-card rounded-[22px] p-5 transition duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                {race.championshipName}
              </p>
              <h3 className="mt-2 text-xl font-bold text-zinc-50">{race.name}</h3>
              <p className="mt-3 text-sm text-zinc-300">
                {race.trackName} • {race.date}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="surface-panel overflow-hidden rounded-[28px]">
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative p-6 text-white sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.2),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.16),transparent_30%)]" />
            <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-200">
              Explore by location
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              Explore by location
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-300">
              See where races are happening and explore tracks geographically.
            </p>
            <div className="mt-6">
              <Link
                href="/races?view=map"
                className="primary-action inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]"
              >
                Open Map View
              </Link>
            </div>
            <div className="mt-8 rounded-[20px] border border-zinc-800 bg-zinc-900/80 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">
                Search discovery
              </p>
              <Link href="/search" className="mt-3 inline-flex text-base font-semibold text-white underline-offset-4 transition duration-150 hover:text-violet-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
                Search races, drivers, tracks, and championships
              </Link>
            </div>
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
              <div className="surface-card flex h-[320px] items-center justify-center rounded-[24px] p-6 text-center text-sm text-zinc-300">
                Map previews appear here when race locations are available.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
