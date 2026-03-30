"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "@/components/search/search-input";
import { SearchParams, SearchType } from "@/lib/search";

function useDebouncedValue(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

export function SearchFilters({
  defaults,
  championships
}: {
  defaults: SearchParams;
  championships: Array<{ slug: string; name: string }>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(defaults.q ?? "");
  const debouncedQuery = useDebouncedValue(query, 250);

  useEffect(() => {
    setQuery(defaults.q ?? "");
  }, [defaults.q]);

  const currentParams = useMemo(
    () => ({
      type: defaults.type ?? "all",
      championship: defaults.championship ?? "",
      status: defaults.status ?? "",
      start: defaults.start ?? "",
      end: defaults.end ?? ""
    }),
    [defaults.championship, defaults.end, defaults.start, defaults.status, defaults.type]
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = debouncedQuery.trim();

    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }

    const next = params.toString();
    const current = searchParams.toString();

    if (next === current) {
      return;
    }

    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [debouncedQuery, pathname, router, searchParams]);

  function updateParam(key: keyof SearchParams, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }

  return (
    <div className="grid gap-4">
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search races, racers, tracks, and championships"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <select
          value={currentParams.type}
          onChange={(event) => updateParam("type", event.target.value)}
          className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-apex-slate outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
        >
          <option value="all">All types</option>
          <option value="races">Races</option>
          <option value="racers">Racers</option>
          <option value="tracks">Tracks</option>
          <option value="championships">Championships</option>
        </select>

        <select
          value={currentParams.championship}
          onChange={(event) => updateParam("championship", event.target.value)}
          className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-apex-slate outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
        >
          <option value="">All championships</option>
          {championships.map((championship) => (
            <option key={championship.slug} value={championship.slug}>
              {championship.name}
            </option>
          ))}
        </select>

        <select
          value={currentParams.status}
          onChange={(event) => updateParam("status", event.target.value)}
          className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-apex-slate outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
        >
          <option value="">Any status</option>
          <option value="LIVE">Live</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <input
          type="date"
          value={currentParams.start}
          onChange={(event) => updateParam("start", event.target.value)}
          className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-apex-slate outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
        />

        <input
          type="date"
          value={currentParams.end}
          onChange={(event) => updateParam("end", event.target.value)}
          className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-apex-slate outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
        />
      </div>
    </div>
  );
}
