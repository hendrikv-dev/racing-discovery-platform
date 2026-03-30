import { Prisma, RaceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type SearchType = "all" | "races" | "racers" | "tracks" | "championships";

export type SearchParams = {
  q?: string;
  type?: string;
  championship?: string;
  status?: string;
  start?: string;
  end?: string;
  limit?: string;
};

export type SearchRaceResult = {
  id: string;
  slug: string;
  name: string;
  date: string;
  startDate: string;
  endDate: string;
  status: "Live" | "Upcoming" | "Completed";
  trackName: string;
  championshipName: string;
  championshipSlug: string;
  href: string;
};

export type SearchRacerResult = {
  id: string;
  slug: string;
  name: string;
  team: string;
  championshipName: string | null;
  href: string;
};

export type SearchTrackResult = {
  id: string;
  slug: string;
  name: string;
  location: string;
  trackType: string;
  href: string;
};

export type SearchChampionshipResult = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  href: string;
};

export type SearchResults = {
  query: string;
  filters: {
    type: SearchType;
    championship?: string;
    status?: string;
    start?: string;
    end?: string;
  };
  counts: {
    races: number;
    racers: number;
    tracks: number;
    championships: number;
    total: number;
  };
  results: {
    races: SearchRaceResult[];
    racers: SearchRacerResult[];
    tracks: SearchTrackResult[];
    championships: SearchChampionshipResult[];
  };
};

export type SearchFilterOptions = {
  championships: Array<{ slug: string; name: string }>;
};

const validTypes: SearchType[] = ["all", "races", "racers", "tracks", "championships"];

function normalizeType(type?: string): SearchType {
  return validTypes.includes(type as SearchType) ? (type as SearchType) : "all";
}

function normalizeQuery(query?: string) {
  return (query ?? "").trim();
}

function normalizeLimit(limit?: string, fallback = 12) {
  const parsed = Number(limit);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.min(parsed, 24);
}

function formatRaceStatus(status: RaceStatus): SearchRaceResult["status"] {
  switch (status) {
    case RaceStatus.LIVE:
      return "Live";
    case RaceStatus.UPCOMING:
      return "Upcoming";
    case RaceStatus.COMPLETED:
      return "Completed";
  }
}

function formatRaceDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function createTextScore(value: string, query: string) {
  const haystack = value.toLowerCase();
  const needle = query.toLowerCase();

  if (haystack === needle) {
    return 0;
  }

  if (haystack.startsWith(needle)) {
    return 1;
  }

  if (haystack.includes(needle)) {
    return 2;
  }

  return 3;
}

function raceScore(
  race: {
    name: string;
    summary: string;
    track: { name: string };
    championship: { name: string };
  },
  query: string
) {
  return Math.min(
    createTextScore(race.name, query),
    createTextScore(race.track.name, query),
    createTextScore(race.championship.name, query),
    createTextScore(race.summary, query)
  );
}

function racerScore(
  racer: {
    name: string;
    team: string;
    championship: { name: string } | null;
  },
  query: string
) {
  return Math.min(
    createTextScore(racer.name, query),
    createTextScore(racer.team, query),
    racer.championship ? createTextScore(racer.championship.name, query) : 3
  );
}

function trackScore(track: { name: string; country: string; history: string }, query: string) {
  return Math.min(
    createTextScore(track.name, query),
    createTextScore(track.country, query),
    createTextScore(track.history, query)
  );
}

function championshipScore(
  championship: { name: string; category: string; description: string },
  query: string
) {
  return Math.min(
    createTextScore(championship.name, query),
    createTextScore(championship.category, query),
    createTextScore(championship.description, query)
  );
}

function buildRaceWhere(query: string, params: SearchParams): Prisma.RaceWhereInput {
  const and: Prisma.RaceWhereInput[] = [
    {
      OR: [
        { name: { contains: query } },
        { summary: { contains: query } },
        { series: { contains: query } },
        { location: { contains: query } },
        { track: { name: { contains: query } } },
        { championship: { name: { contains: query } } }
      ]
    }
  ];

  if (params.championship) {
    and.push({
      OR: [
        { championshipId: params.championship },
        { championship: { slug: params.championship } }
      ]
    });
  }

  if (params.status) {
    const status = params.status.toUpperCase() as RaceStatus;
    if (Object.values(RaceStatus).includes(status)) {
      and.push({ status });
    }
  }

  if (params.start) {
    and.push({ startDate: { gte: new Date(params.start) } });
  }

  if (params.end) {
    and.push({ endDate: { lte: new Date(`${params.end}T23:59:59.999Z`) } });
  }

  return { AND: and };
}

function buildChampionshipScopedRacerWhere(
  query: string,
  params: SearchParams
): Prisma.RacerWhereInput {
  const and: Prisma.RacerWhereInput[] = [
    {
      OR: [
        { name: { contains: query } },
        { team: { contains: query } },
        { nationality: { contains: query } },
        { vehicle: { contains: query } },
        { championship: { name: { contains: query } } }
      ]
    }
  ];

  if (params.championship) {
    and.push({
      OR: [{ championshipId: params.championship }, { championship: { slug: params.championship } }]
    });
  }

  return { AND: and };
}

function buildTrackWhere(query: string): Prisma.TrackWhereInput {
  return {
    OR: [
      { name: { contains: query } },
      { country: { contains: query } },
      { history: { contains: query } },
      { length: { contains: query } }
    ]
  };
}

function buildChampionshipWhere(query: string): Prisma.ChampionshipWhereInput {
  return {
    OR: [
      { name: { contains: query } },
      { category: { contains: query } },
      { region: { contains: query } },
      { description: { contains: query } }
    ]
  };
}

export function getSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): SearchParams {
  const getValue = (key: keyof SearchParams) => {
    const value = searchParams[key];
    return typeof value === "string" && value.length > 0 ? value : undefined;
  };

  return {
    q: getValue("q"),
    type: getValue("type"),
    championship: getValue("championship"),
    status: getValue("status"),
    start: getValue("start"),
    end: getValue("end"),
    limit: getValue("limit")
  };
}

export async function getSearchFilterOptions(): Promise<SearchFilterOptions> {
  const championships = await prisma.championship.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true }
  });

  return { championships };
}

export async function searchDiscovery(params: SearchParams): Promise<SearchResults> {
  const query = normalizeQuery(params.q);
  const type = normalizeType(params.type);
  const limit = normalizeLimit(params.limit, type === "all" ? 12 : 24);

  if (query.length < 2) {
    return {
      query,
      filters: {
        type,
        championship: params.championship,
        status: params.status,
        start: params.start,
        end: params.end
      },
      counts: {
        races: 0,
        racers: 0,
        tracks: 0,
        championships: 0,
        total: 0
      },
      results: {
        races: [],
        racers: [],
        tracks: [],
        championships: []
      }
    };
  }

  const shouldSearch = (candidate: SearchType) => type === "all" || type === candidate;

  const [raceRows, racerRows, trackRows, championshipRows] = await Promise.all([
    shouldSearch("races")
      ? prisma.race.findMany({
          where: buildRaceWhere(query, params),
          include: {
            track: { select: { name: true, slug: true } },
            championship: { select: { name: true, slug: true } }
          },
          orderBy: { startDate: "asc" },
          take: limit * 3
        })
      : Promise.resolve([]),
    shouldSearch("racers")
      ? prisma.racer.findMany({
          where: buildChampionshipScopedRacerWhere(query, params),
          include: {
            championship: { select: { name: true, slug: true } }
          },
          orderBy: { name: "asc" },
          take: limit * 3
        })
      : Promise.resolve([]),
    shouldSearch("tracks")
      ? prisma.track.findMany({
          where: buildTrackWhere(query),
          orderBy: { name: "asc" },
          take: limit * 3
        })
      : Promise.resolve([]),
    shouldSearch("championships")
      ? prisma.championship.findMany({
          where: buildChampionshipWhere(query),
          orderBy: { name: "asc" },
          take: limit * 3
        })
      : Promise.resolve([])
  ]);

  const races = raceRows
    .sort((left, right) => raceScore(left, query) - raceScore(right, query))
    .slice(0, limit)
    .map((race) => ({
      id: race.id,
      slug: race.slug,
      name: race.name,
      date: formatRaceDate(race.startDate),
      startDate: race.startDate.toISOString(),
      endDate: race.endDate.toISOString(),
      status: formatRaceStatus(race.status),
      trackName: race.track.name,
      championshipName: race.championship.name,
      championshipSlug: race.championship.slug,
      href: `/races/${race.slug}`
    })) satisfies SearchRaceResult[];

  const racers = racerRows
    .sort((left, right) => racerScore(left, query) - racerScore(right, query))
    .slice(0, limit)
    .map((racer) => ({
      id: racer.id,
      slug: racer.slug,
      name: racer.name,
      team: racer.team,
      championshipName: racer.championship?.name ?? null,
      href: `/racers/${racer.slug}`
    })) satisfies SearchRacerResult[];

  const tracks = trackRows
    .sort((left, right) => trackScore(left, query) - trackScore(right, query))
    .slice(0, limit)
    .map((track) => ({
      id: track.id,
      slug: track.slug,
      name: track.name,
      location: track.country,
      trackType: `${track.length} • ${track.turns} turns`,
      href: `/tracks/${track.slug}`
    })) satisfies SearchTrackResult[];

  const championships = championshipRows
    .sort(
      (left, right) => championshipScore(left, query) - championshipScore(right, query)
    )
    .slice(0, limit)
    .map((championship) => ({
      id: championship.id,
      slug: championship.slug,
      name: championship.name,
      category: championship.category,
      description: championship.description,
      href: `/championships/${championship.slug}`
    })) satisfies SearchChampionshipResult[];

  const counts = {
    races: races.length,
    racers: racers.length,
    tracks: tracks.length,
    championships: championships.length,
    total: races.length + racers.length + tracks.length + championships.length
  };

  return {
    query,
    filters: {
      type,
      championship: params.championship,
      status: params.status,
      start: params.start,
      end: params.end
    },
    counts,
    results: {
      races,
      racers,
      tracks,
      championships
    }
  };
}
