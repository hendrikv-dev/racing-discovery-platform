"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { SearchInput } from "@/components/search/search-input";
import { SearchResults } from "@/lib/search";

function useDebouncedValue(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

function DropdownSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-apex-muted">
        {title}
      </p>
      <div className="space-y-1 px-2 pb-2">{children}</div>
    </div>
  );
}

function DropdownLink({
  href,
  title,
  detail,
  onNavigate
}: {
  href: string;
  title: string;
  detail: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="block rounded-[16px] px-3 py-3 transition duration-200 hover:bg-slate-50"
    >
      <p className="font-medium text-apex-slate">{title}</p>
      <p className="mt-1 text-sm text-apex-muted">{detail}</p>
    </Link>
  );
}

export function SearchTypeahead() {
  const pathname = usePathname();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    setQuery("");
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const activeQuery = debouncedQuery.trim();

    if (activeQuery.length < 2) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(activeQuery)}&limit=4`)
      .then((response) => response.json())
      .then((payload: SearchResults) => {
        if (!cancelled) {
          setResults(payload);
          setIsOpen(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResults(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const summaryCount = useMemo(() => results?.counts.total ?? 0, [results]);

  function navigateToSearch() {
    const trimmed = query.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full md:max-w-[360px]">
      <SearchInput
        value={query}
        onChange={(value) => {
          setQuery(value);
          setIsOpen(value.trim().length >= 2);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            navigateToSearch();
          }
        }}
        placeholder="Search everything"
        className="bg-white"
      />

      {isOpen ? (
        <div className="glass-border absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-[22px] bg-white/95 shadow-panel backdrop-blur-xl">
          {isLoading ? (
            <p className="px-4 py-4 text-sm text-apex-muted">Searching...</p>
          ) : results && summaryCount > 0 ? (
            <>
              {results.results.races.length > 0 ? (
                <DropdownSection title="Races">
                  {results.results.races.map((race) => (
                    <DropdownLink
                      key={race.id}
                      href={race.href}
                      title={race.name}
                      detail={`${race.date} • ${race.trackName} • ${race.championshipName}`}
                      onNavigate={() => setIsOpen(false)}
                    />
                  ))}
                </DropdownSection>
              ) : null}
              {results.results.racers.length > 0 ? (
                <DropdownSection title="Racers">
                  {results.results.racers.map((racer) => (
                    <DropdownLink
                      key={racer.id}
                      href={racer.href}
                      title={racer.name}
                      detail={
                        racer.championshipName
                          ? `${racer.team} • ${racer.championshipName}`
                          : racer.team
                      }
                      onNavigate={() => setIsOpen(false)}
                    />
                  ))}
                </DropdownSection>
              ) : null}
              {results.results.tracks.length > 0 ? (
                <DropdownSection title="Tracks">
                  {results.results.tracks.map((track) => (
                    <DropdownLink
                      key={track.id}
                      href={track.href}
                      title={track.name}
                      detail={track.location}
                      onNavigate={() => setIsOpen(false)}
                    />
                  ))}
                </DropdownSection>
              ) : null}
              {results.results.championships.length > 0 ? (
                <DropdownSection title="Championships">
                  {results.results.championships.map((championship) => (
                    <DropdownLink
                      key={championship.id}
                      href={championship.href}
                      title={championship.name}
                      detail={championship.category}
                      onNavigate={() => setIsOpen(false)}
                    />
                  ))}
                </DropdownSection>
              ) : null}
              <div className="border-t border-slate-200 px-4 py-3">
                <Link
                  href={query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search"}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold text-apex-blue transition duration-200 hover:opacity-80"
                >
                  View all results
                </Link>
              </div>
            </>
          ) : (
            <div className="px-4 py-4">
              <p className="text-sm text-apex-muted">
                No matches yet. Try a different search term.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
