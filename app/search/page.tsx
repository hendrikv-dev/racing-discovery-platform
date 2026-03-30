import { SearchFilters } from "@/components/search/search-filters";
import { SearchEmptyState, SearchResults } from "@/components/search/search-results";
import { EmptyState } from "@/components/states";
import { SectionHeading } from "@/components/ui";
import { getSearchFilterOptions, getSearchParams, searchDiscovery } from "@/lib/search";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const params = getSearchParams(resolvedSearchParams);
  const [search, filterOptions] = await Promise.all([
    searchDiscovery(params),
    getSearchFilterOptions()
  ]);

  const hasQuery = search.query.length >= 2;
  const hasFilters = Boolean(
    search.filters.championship ||
      search.filters.status ||
      search.filters.start ||
      search.filters.end ||
      (search.filters.type && search.filters.type !== "all")
  );

  return (
    <div className="space-y-8">
      <section className="glass-border rounded-[28px] bg-white/80 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Global Search"
          title="Find races, racers, tracks, and championships"
          description={
            hasQuery
              ? `${search.counts.total} result${search.counts.total === 1 ? "" : "s"} for "${search.query}".`
              : "Search the full platform and narrow the results as you go."
          }
        />
        <SearchFilters defaults={params} championships={filterOptions.championships} />
      </section>

      {!hasQuery ? (
        <EmptyState
          title="Start with a race, racer, track, or championship"
          description="Type at least two characters to search across the platform."
        />
      ) : search.counts.total === 0 ? (
        <SearchEmptyState query={search.query} hasFilters={hasFilters} />
      ) : (
        <SearchResults search={search} activeType={search.filters.type} />
      )}
    </div>
  );
}
