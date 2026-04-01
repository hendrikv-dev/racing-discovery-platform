import Image from "next/image";
import { CalendarRange, MapPinned, Users2 } from "lucide-react";
import { WaitlistForm } from "@/components/coming-soon/waitlist-form";

const heroHighlights = [
  {
    icon: CalendarRange,
    title: "Find The Next Race Faster",
    description: "See live, upcoming, and completed events across the series you actually follow."
  },
  {
    icon: Users2,
    title: "Track Drivers That Matter",
    description: "Follow racers, teams, and recent results without bouncing between scattered sites."
  },
  {
    icon: MapPinned,
    title: "Know Every Circuit",
    description: "Explore venues, race weekends, and track details from one motorsports hub."
  }
];

export default function ComingSoonPage() {
  return (
    <div className="space-y-8 pb-8">
      <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0F1118] text-white shadow-[0_18px_48px_rgba(0,0,0,0.34)]">
        <div className="relative min-h-[820px]">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80"
            alt="Racing cars in motion on track"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/78 to-slate-950/22" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />

          <div className="relative grid min-h-[820px] gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-12 lg:py-16">
            <div className="flex max-w-3xl flex-col justify-between">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-teal-300">
                  Coming Soon
                </p>
                <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  The fastest way to discover races, follow drivers, and explore tracks.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-200">
                  Racing Platform brings race schedules, competitor profiles, and track intel
                  together in one clean destination for fans, racers, and teams.
                </p>
                <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
                  Instead of piecing together updates across league sites, news feeds, and social
                  posts, you get one place to see what is happening, who is competing, and where it
                  all unfolds.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {heroHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[22px] border border-white/10 bg-zinc-900/70 p-5 backdrop-blur-sm"
                  >
                    <item.icon className="h-5 w-5 text-teal-300" />
                    <p className="mt-4 text-sm font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              id="waitlist"
              className="self-end rounded-[28px] border border-white/10 bg-[#11131C]/96 p-5 text-zinc-100 shadow-[0_18px_48px_rgba(0,0,0,0.3)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
                Get Early Access
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">
                Join the waitlist for launch.
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                Get first access when Racing Platform launches, plus updates on new races, driver
                tracking, and track discovery as they go live.
              </p>
              <div className="mt-6">
                <WaitlistForm buttonLabel="Get Early Access" />
              </div>
              <div className="mt-6 text-sm leading-6 text-zinc-300">
                No account setup required. Just add your email and we will let you know when the
                platform is ready.
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="rounded-[28px] border border-white/10 bg-[#11131C]/95 px-6 py-5 shadow-[0_18px_48px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-bold text-zinc-50">Racing Platform</p>
            <p className="mt-1 text-sm text-zinc-300">
              One place to find races, follow drivers, and explore the circuits behind the action.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-300">
            <a href="mailto:hello@racingplatform.app" className="transition hover:text-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090F]">
              hello@racingplatform.app
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
