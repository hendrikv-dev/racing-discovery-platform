import { Search } from "lucide-react";
import { RaceCard, SectionHeading } from "@/components/ui";
import { races } from "@/data/site";

const seriesFilters = ["All Series", "Formula Alpha", "GT Masters", "Hyper Prototype"];

export default function RacesPage() {
  return (
    <div className="space-y-8">
      <section className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Race Discovery"
          title="Search, filter, and track the race calendar"
          description="Real-time discovery flow for upcoming, live, and completed sessions across elite motorsport series."
        />
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <label className="glass-border flex items-center gap-3 rounded-[20px] bg-slate-50 px-4 py-3">
            <Search className="h-5 w-5 text-apex-muted" />
            <input
              aria-label="Search races"
              defaultValue="Monte"
              className="w-full bg-transparent text-sm outline-none placeholder:text-apex-muted"
              placeholder="Search races, circuits, or series"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {seriesFilters.map((filter, index) => (
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {races.map((race) => (
          <RaceCard key={race.slug} race={race} />
        ))}
      </section>
    </div>
  );
}
