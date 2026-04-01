import { auth } from "@/auth";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchEmptyState, SearchResults } from "@/components/search/search-results";
import { SectionHeading } from "@/components/ui";
import { getSearchFilterOptions, getSearchParams, searchDiscovery } from "@/lib/search";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const session = await auth();
  const params = getSearchParams(resolvedSearchParams);
  const [search, filterOptions] = await Promise.all([
    searchDiscovery(params, session?.user?.id),
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
      <section className="app-panel rounded-[28px] p-6">
        <SectionHeading
          eyebrow="Global Search"
          title="Find races, racers, tracks, and championships"
          description={
            hasQuery
              ? `${search.counts.total} result${search.counts.total === 1 ? "" : "s"} for "${search.query}".`
              : "Popular this week, trending races, and the fastest way back to what you already follow."
          }
        />
        <SearchFilters defaults={params} championships={filterOptions.championships} />
      </section>

      {!hasQuery ? (
        <div className="space-y-4">
          <SectionHeading
            eyebrow="Top Results"
            title="Top results"
            description="Start with the races and championships getting attention right now, with anything you track rising to the top."
          />
          <SearchResults search={search} activeType={search.filters.type} />
        </div>
      ) : search.counts.total === 0 ? (
        <SearchEmptyState query={search.query} hasFilters={hasFilters} />
      ) : (
        <SearchResults search={search} activeType={search.filters.type} />
      )}
    </div>
  );
}
