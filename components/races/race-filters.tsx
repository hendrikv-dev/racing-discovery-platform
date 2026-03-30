"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { Search } from "lucide-react";

type RaceFilterProps = {
  defaults: {
    q?: string;
    status?: string;
    championship?: string;
    series?: string;
    start?: string;
    end?: string;
    location?: string;
    track?: string;
    view?: string;
    sort?: string;
    lat?: string;
    lng?: string;
  };
  options: {
    championships: Array<{ slug: string; name: string }>;
    series: string[];
    tracks: Array<{ slug: string; name: string }>;
  };
};

export function RaceFilters({ defaults, options }: RaceFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [formValues, setFormValues] = useState({
    q: defaults.q ?? "",
    status: defaults.status ?? "",
    championship: defaults.championship ?? "",
    series: defaults.series ?? "",
    start: defaults.start ?? "",
    end: defaults.end ?? "",
    location: defaults.location ?? "",
    track: defaults.track ?? "",
    sort: defaults.sort ?? ""
  });

  function updateUrl(values: typeof formValues) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    if (values.sort !== "nearest") {
      params.delete("lat");
      params.delete("lng");
    }

    if (defaults.view) {
      params.set("view", defaults.view);
    }

    const next = params.toString();
    router.replace(next ? `/races?${next}` : "/races");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(() => {
      updateUrl(formValues);
    });
  }

  function handleReset() {
    startTransition(() => {
      const params = new URLSearchParams();

      if (defaults.view) {
        params.set("view", defaults.view);
      }

      router.replace(params.toString() ? `/races?${params}` : "/races");
      setFormValues({
        q: "",
        status: "",
        championship: "",
        series: "",
        start: "",
        end: "",
        location: "",
        track: "",
        sort: ""
      });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))]">
        <label className="glass-border flex items-center gap-3 rounded-[20px] bg-slate-50 px-4 py-3">
          <Search className="h-5 w-5 text-apex-muted" />
          <input
            aria-label="Search races"
            value={formValues.q}
            onChange={(event) => setFormValues((current) => ({ ...current, q: event.target.value }))}
            className="w-full bg-transparent text-sm outline-none placeholder:text-apex-muted"
            placeholder="Search races, championships, tracks"
          />
        </label>

        <select
          value={formValues.status}
          onChange={(event) => setFormValues((current) => ({ ...current, status: event.target.value }))}
          className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-apex-slate outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
        >
          <option value="">All statuses</option>
          <option value="LIVE">Live</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          value={formValues.championship}
          onChange={(event) => setFormValues((current) => ({ ...current, championship: event.target.value }))}
          className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-apex-slate outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
        >
          <option value="">All championships</option>
          {options.championships.map((championship) => (
            <option key={championship.slug} value={championship.slug}>
              {championship.name}
            </option>
          ))}
        </select>

        <select
          value={formValues.series}
          onChange={(event) => setFormValues((current) => ({ ...current, series: event.target.value }))}
          className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-apex-slate outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
        >
          <option value="">All series</option>
          {options.series.map((series) => (
            <option key={series} value={series}>
              {series}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <select
          value={formValues.sort}
          onChange={(event) => setFormValues((current) => ({ ...current, sort: event.target.value }))}
          className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-apex-slate outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
        >
          <option value="">Sort by upcoming</option>
          <option value="nearest">Sort by nearest</option>
        </select>
        <input
          type="date"
          value={formValues.start}
          onChange={(event) => setFormValues((current) => ({ ...current, start: event.target.value }))}
          className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-apex-slate outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
        />
        <input
          type="date"
          value={formValues.end}
          onChange={(event) => setFormValues((current) => ({ ...current, end: event.target.value }))}
          className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-apex-slate outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
        />
        <input
          value={formValues.location}
          onChange={(event) => setFormValues((current) => ({ ...current, location: event.target.value }))}
          className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-apex-slate outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
          placeholder="Filter by location"
        />
        <select
          value={formValues.track}
          onChange={(event) => setFormValues((current) => ({ ...current, track: event.target.value }))}
          className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-apex-slate outline-none transition duration-200 focus:border-apex-blue focus:bg-white"
        >
          <option value="">All tracks</option>
          {options.tracks.map((track) => (
            <option key={track.slug} value={track.slug}>
              {track.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Applying..." : "Apply Filters"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-apex-slate transition duration-200 hover:-translate-y-0.5"
        >
          Clear All Filters
        </button>
      </div>
    </form>
  );
}
