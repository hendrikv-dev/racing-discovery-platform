import { auth } from "@/auth";
import { CalendarView } from "@/components/races/calendar-view";
import { RaceFilters } from "@/components/races/race-filters";
import {
  RaceListView,
  RaceMapView,
  RaceViewDescription,
  RaceViewMode,
  RaceViewTabs
} from "@/components/races/race-views";
import { TimelineView } from "@/components/races/timeline-view";
import { SectionHeading } from "@/components/ui";
import { getRaceFilterOptions, getRaceFilters, getRaces } from "@/lib/discovery";

const validViews: RaceViewMode[] = ["map", "list", "calendar", "timeline"];

function getActiveView(view?: string): RaceViewMode {
  return validViews.includes(view as RaceViewMode) ? (view as RaceViewMode) : "map";
}

export default async function RacesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  const resolvedSearchParams = await searchParams;
  const filters = getRaceFilters(resolvedSearchParams);
  const activeView = getActiveView(filters.view);
  const [races, filterOptions] = await Promise.all([
    getRaces(filters, session?.user?.id),
    getRaceFilterOptions()
  ]);

  return (
    <div className="space-y-8">
      <section className="app-panel rounded-[28px] p-6">
        <SectionHeading
          eyebrow="Race Discovery"
          title="Search, filter, and track the race calendar"
          description="Find upcoming weekends fast, switch views instantly, and sort by what is closest when you want nearby races first."
        />
        <RaceFilters defaults={filters} options={filterOptions} />
      </section>

      <section className="app-panel rounded-[28px] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="app-kicker">
              View Modes
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50">
              Explore the race schedule your way
            </h2>
            <div className="mt-3">
              <RaceViewDescription activeView={activeView} />
            </div>
            {filters.sort === "nearest" && filters.lat && filters.lng ? (
              <p className="mt-3 text-sm font-medium text-teal-300">Nearest races</p>
            ) : null}
          </div>
          <RaceViewTabs activeView={activeView} filters={filters} />
        </div>
      </section>

      {activeView === "calendar" ? <CalendarView races={races} /> : null}
      {activeView === "timeline" ? <TimelineView races={races} /> : null}
      {activeView === "map" ? <RaceMapView races={races} /> : null}
      {activeView === "list" ? <RaceListView races={races} /> : null}
    </div>
  );
}
