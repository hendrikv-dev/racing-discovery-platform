import Link from "next/link";
import { Search } from "lucide-react";
import { quickFilters, racers, races, tracks } from "@/data/site";

function SearchBlock({
  title,
  items
}: {
  title: string;
  items: Array<{ label: string; detail: string; href: string }>;
}) {
  return (
    <div className="glass-border rounded-[24px] bg-white/85 p-5 shadow-panel">
      <h2 className="text-xl font-bold text-apex-slate">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="block rounded-[18px] bg-slate-50 px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
          >
            <p className="font-semibold text-apex-slate">{item.label}</p>
            <p className="mt-1 text-sm text-apex-muted">{item.detail}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="space-y-8">
      <section className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-apex-muted">
          Global Search
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-apex-slate md:text-5xl">
          Unified discovery across races, racers, and tracks
        </h1>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
          <label className="glass-border flex items-center gap-3 rounded-[20px] bg-slate-50 px-4 py-3">
            <Search className="h-5 w-5 text-apex-muted" />
            <input
              aria-label="Search all content"
              defaultValue="silver"
              className="w-full bg-transparent text-sm outline-none placeholder:text-apex-muted"
              placeholder="Search across the platform"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter, index) => (
              <button
                key={filter}
                className={`rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                  index === 0
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-apex-slate hover:-translate-y-0.5"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <SearchBlock
          title="Races"
          items={races.map((race) => ({
            label: race.name,
            detail: `${race.series} • ${race.location} • ${race.status}`,
            href: "/races"
          }))}
        />
        <SearchBlock
          title="Racers"
          items={racers.map((racer) => ({
            label: racer.name,
            detail: `${racer.team} • ${racer.nationality}`,
            href: `/racers/${racer.slug}`
          }))}
        />
        <SearchBlock
          title="Tracks"
          items={tracks.map((track) => ({
            label: track.name,
            detail: `${track.country} • ${track.length} • ${track.turns} turns`,
            href: `/tracks/${track.slug}`
          }))}
        />
      </section>
    </div>
  );
}
