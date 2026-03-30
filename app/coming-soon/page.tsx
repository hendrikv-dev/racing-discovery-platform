import Image from "next/image";
import Link from "next/link";
import { CalendarRange, MapPinned, MoveRight, Timer, Users2 } from "lucide-react";
import { SectionContainer } from "@/components/coming-soon/form-primitives";
import { WaitlistForm } from "@/components/coming-soon/waitlist-form";

const heroHighlights = [
  {
    icon: CalendarRange,
    title: "Discover Races",
    description: "Browse live, upcoming, and completed events across major series."
  },
  {
    icon: Users2,
    title: "Follow Racers",
    description: "Track drivers, teams, and recent results from one hub."
  },
  {
    icon: MapPinned,
    title: "Explore Tracks",
    description: "Search venues, key specs, and race weekends by location."
  }
];

export default function ComingSoonPage() {
  return (
    <div className="space-y-8 pb-8">
      <section className="glass-border overflow-hidden rounded-[32px] bg-slate-950 text-white shadow-panel">
        <div className="relative min-h-[700px]">
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

          <div className="relative grid min-h-[700px] gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="flex max-w-3xl flex-col justify-between">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-blue-200">
                  Coming Soon
                </p>
                <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
                  Discover races, racers, and tracks in one place.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-slate-200">
                  A modern platform for motorsports fans and competitors. Launching soon.
                </p>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                  Never miss a race again with a single destination for event discovery, driver
                  follow-through, and track intelligence.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {heroHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[22px] border border-white/12 bg-white/10 p-4 backdrop-blur-sm"
                  >
                    <item.icon className="h-5 w-5 text-blue-200" />
                    <p className="mt-4 text-sm font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              id="waitlist"
              className="glass-border self-end rounded-[28px] bg-white/95 p-5 text-apex-slate shadow-panel"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-apex-muted">
                Get Early Access
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">
                Be first in line for launch.
              </h2>
              <p className="mt-3 text-sm leading-7 text-apex-muted">
                Join the waitlist for launch news, first access, and product updates as Racing
                Platform gets ready to go live.
              </p>
              <div className="mt-6">
                <WaitlistForm buttonLabel="Get Early Access" />
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-apex-muted">
                <Timer className="h-4 w-4 text-apex-blue" />
                Immediate clarity, one-field signup, and no account required.
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="glass-border rounded-[28px] bg-white/85 px-6 py-5 shadow-panel">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-bold text-apex-slate">Racing Platform</p>
            <p className="mt-1 text-sm text-apex-muted">
              Discover races, racers, and tracks in one place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-apex-muted">
            <a href="mailto:hello@racingplatform.app" className="transition hover:text-apex-blue">
              hello@racingplatform.app
            </a>
            <Link href="/" className="inline-flex items-center gap-2 transition hover:text-apex-blue">
              Main site
              <MoveRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
