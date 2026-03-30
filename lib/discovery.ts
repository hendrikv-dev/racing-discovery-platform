import { Prisma, RaceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type DiscoveryRace = {
  id: string;
  slug: string;
  name: string;
  series: string;
  championshipId: string;
  championshipName: string;
  championshipSlug: string;
  date: string;
  startDate: string;
  endDate: string;
  location: string;
  trackId: string;
  trackName: string;
  trackSlug: string;
  status: "Live" | "Upcoming" | "Completed";
  summary: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  trackCoordinates: {
    lat: number;
    lng: number;
  } | null;
  mapCoordinates: {
    lat: number;
    lng: number;
  } | null;
  mapSource: "race" | "track" | null;
  distanceKm?: number | null;
  isTracked: boolean;
};

export type DiscoveryChampionship = {
  id: string;
  slug: string;
  name: string;
  category: string;
  region: string;
  season: string;
  description: string;
  image: string;
  accentColor: string;
  raceCount: number;
  racerCount: number;
  nextRaceName: string | null;
  isTracked: boolean;
};

export type DiscoveryTrack = {
  id: string;
  slug: string;
  name: string;
  location: string;
  country: string;
  trackType: string;
  length: string;
  turns: number;
  lapRecord: string;
  image: string;
  history: string;
  website: string | null;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  raceCount: number;
  isTracked: boolean;
};

export type DiscoveryRacer = {
  id: string;
  slug: string;
  name: string;
  team: string;
  nationality: string;
  number: string;
  championships: number;
  victories: number;
  podiums: number;
  bio: string | null;
  image: string;
  vehicle: string;
  verified: boolean;
  championshipId: string | null;
  championshipName: string | null;
  championshipSlug: string | null;
  isTracked: boolean;
};

export type RaceFilters = {
  q?: string;
  status?: string;
  championship?: string;
  series?: string;
  start?: string;
  end?: string;
  location?: string;
  track?: string;
  sort?: string;
  lat?: string;
  lng?: string;
  view?: string;
};

function formatRaceStatus(status: RaceStatus): DiscoveryRace["status"] {
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
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

export function formatRelativeRaceTiming(startDate: string | Date) {
  const now = new Date();
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const diff = start.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    return "today";
  }

  if (days === 1) {
    return "tomorrow";
  }

  return `in ${days} days`;
}

function hasValidCoordinates(
  coordinates:
    | {
        lat: number;
        lng: number;
      }
    | null
) {
  if (!coordinates) {
    return false;
  }

  return (
    Number.isFinite(coordinates.lat) &&
    Number.isFinite(coordinates.lng) &&
    !(coordinates.lat === 0 && coordinates.lng === 0)
  );
}

function resolveRaceMapCoordinates(
  raceCoordinates: { lat: number; lng: number },
  trackCoordinates: { lat: number; lng: number } | null
) {
  if (hasValidCoordinates(raceCoordinates)) {
    return {
      mapCoordinates: raceCoordinates,
      mapSource: "race" as const
    };
  }

  if (hasValidCoordinates(trackCoordinates)) {
    return {
      mapCoordinates: trackCoordinates,
      mapSource: "track" as const
    };
  }

  return {
    mapCoordinates: null,
    mapSource: null
  };
}

function getDistanceKm(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
) {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latDelta = toRadians(destination.lat - origin.lat);
  const lngDelta = toRadians(destination.lng - origin.lng);
  const startLat = toRadians(origin.lat);
  const endLat = toRadians(destination.lat);

  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getRaceFilters(searchParams: Record<string, string | string[] | undefined>): RaceFilters {
  const getValue = (key: keyof RaceFilters) => {
    const value = searchParams[key];
    return typeof value === "string" && value.length > 0 ? value : undefined;
  };

  return {
    q: getValue("q"),
    status: getValue("status"),
    championship: getValue("championship"),
    series: getValue("series"),
    start: getValue("start"),
    end: getValue("end"),
    location: getValue("location"),
    track: getValue("track"),
    sort: getValue("sort"),
    lat: getValue("lat"),
    lng: getValue("lng"),
    view: getValue("view")
  };
}

function getRaceWhere(filters: RaceFilters): Prisma.RaceWhereInput {
  const and: Prisma.RaceWhereInput[] = [];

  if (filters.q) {
    and.push({
      OR: [
        { name: { contains: filters.q } },
        { series: { contains: filters.q } },
        { location: { contains: filters.q } },
        { championship: { name: { contains: filters.q } } },
        { track: { name: { contains: filters.q } } }
      ]
    });
  }

  if (filters.status) {
    const status = filters.status.toUpperCase() as RaceStatus;

    if (Object.values(RaceStatus).includes(status)) {
      and.push({ status });
    }
  }

  if (filters.championship) {
    and.push({ championship: { slug: filters.championship } });
  }

  if (filters.series) {
    and.push({ series: filters.series });
  }

  if (filters.start) {
    and.push({ startDate: { gte: new Date(filters.start) } });
  }

  if (filters.end) {
    and.push({ endDate: { lte: new Date(`${filters.end}T23:59:59.999Z`) } });
  }

  if (filters.location) {
    and.push({ location: { contains: filters.location } });
  }

  if (filters.track) {
    and.push({ track: { slug: filters.track } });
  }

  return and.length > 0 ? { AND: and } : {};
}

export async function getRaceFilterOptions() {
  const [championships, races, tracks] = await Promise.all([
    prisma.championship.findMany({
      orderBy: { name: "asc" },
      select: { slug: true, name: true }
    }),
    prisma.race.findMany({
      orderBy: { series: "asc" },
      select: { series: true }
    }),
    prisma.track.findMany({
      orderBy: { name: "asc" },
      select: { slug: true, name: true }
    })
  ]);

  return {
    championships,
    series: Array.from(new Set(races.map((race) => race.series))),
    tracks
  };
}

export async function getRaces(filters: RaceFilters, userId?: string) {
  const hasOrigin =
    filters.sort === "nearest" &&
    typeof filters.lat === "string" &&
    typeof filters.lng === "string" &&
    Number.isFinite(Number(filters.lat)) &&
    Number.isFinite(Number(filters.lng));
  const origin = hasOrigin
    ? { lat: Number(filters.lat), lng: Number(filters.lng) }
    : null;
  const races = await prisma.race.findMany({
    where: getRaceWhere(filters),
    orderBy: [{ startDate: "asc" }],
    include: {
      championship: true,
      track: true,
      trackedBy: userId
        ? {
            where: {
              userId
            }
          }
        : false
    }
  });

  const mappedRaces = races.map((race) => {
    const raceCoordinates = {
      lat: race.latitude,
      lng: race.longitude
    };
    const trackCoordinates = hasValidCoordinates({
      lat: race.track.latitude,
      lng: race.track.longitude
    })
      ? {
          lat: race.track.latitude,
          lng: race.track.longitude
        }
      : null;
    const { mapCoordinates, mapSource } = resolveRaceMapCoordinates(raceCoordinates, trackCoordinates);
    const distanceKm = origin && mapCoordinates ? getDistanceKm(origin, mapCoordinates) : null;

    return {
      id: race.id,
      slug: race.slug,
      name: race.name,
      series: race.series,
      championshipId: race.championshipId,
      championshipName: race.championship.name,
      championshipSlug: race.championship.slug,
      date: formatRaceDate(race.startDate),
      startDate: race.startDate.toISOString(),
      endDate: race.endDate.toISOString(),
      location: race.location,
      trackId: race.trackId,
      trackName: race.track.name,
      trackSlug: race.track.slug,
      status: formatRaceStatus(race.status),
      summary: race.summary,
      coordinates: raceCoordinates,
      trackCoordinates,
      mapCoordinates,
      mapSource,
      distanceKm,
      isTracked: userId ? race.trackedBy.length > 0 : false
    };
  }) satisfies DiscoveryRace[];

  if (filters.sort === "nearest") {
    return [...mappedRaces].sort((left, right) => {
      if (left.distanceKm != null && right.distanceKm != null) {
        return left.distanceKm - right.distanceKm;
      }

      if (left.distanceKm != null) {
        return -1;
      }

      if (right.distanceKm != null) {
        return 1;
      }

      return new Date(left.startDate).getTime() - new Date(right.startDate).getTime();
    });
  }

  return mappedRaces;
}

export async function getRaceBySlug(slug: string, userId?: string) {
  const race = await prisma.race.findUnique({
    where: { slug },
    include: {
      championship: true,
      track: true,
      trackedBy: userId
        ? {
            where: {
              userId
            }
          }
        : false
    }
  });

  if (!race) {
    return null;
  }

  const raceCoordinates = {
    lat: race.latitude,
    lng: race.longitude
  };
  const trackCoordinates = hasValidCoordinates({
    lat: race.track.latitude,
    lng: race.track.longitude
  })
    ? {
        lat: race.track.latitude,
        lng: race.track.longitude
      }
    : null;
  const { mapCoordinates, mapSource } = resolveRaceMapCoordinates(raceCoordinates, trackCoordinates);

  return {
    id: race.id,
    slug: race.slug,
    name: race.name,
    series: race.series,
    championshipId: race.championshipId,
    championshipName: race.championship.name,
    championshipSlug: race.championship.slug,
    date: formatRaceDate(race.startDate),
    startDate: race.startDate.toISOString(),
    endDate: race.endDate.toISOString(),
    location: race.location,
    trackId: race.trackId,
    trackName: race.track.name,
    trackSlug: race.track.slug,
    status: formatRaceStatus(race.status),
    summary: race.summary,
    coordinates: raceCoordinates,
    trackCoordinates,
    mapCoordinates,
    mapSource,
    isTracked: userId ? race.trackedBy.length > 0 : false
  } satisfies DiscoveryRace;
}

export async function getChampionships(userId?: string) {
  const championships = await prisma.championship.findMany({
    orderBy: { name: "asc" },
    include: {
      races: {
        orderBy: { startDate: "asc" },
        select: { id: true, name: true, startDate: true }
      },
      racers: {
        select: { id: true }
      },
      trackedBy: userId
        ? {
            where: {
              userId
            }
          }
        : false
    }
  });

  return championships.map((championship) => ({
    id: championship.id,
    slug: championship.slug,
    name: championship.name,
    category: championship.category,
    region: championship.region,
    season: championship.season,
    description: championship.description,
    image: championship.image,
    accentColor: championship.accentColor,
    raceCount: championship.races.length,
    racerCount: championship.racers.length,
    nextRaceName: championship.races.find((race) => race.startDate >= new Date())?.name ?? championship.races[0]?.name ?? null,
    isTracked: userId ? championship.trackedBy.length > 0 : false
  })) satisfies DiscoveryChampionship[];
}

export async function getChampionshipBySlug(slug: string, userId?: string) {
  const championship = await prisma.championship.findUnique({
    where: { slug },
    include: {
      races: {
        orderBy: { startDate: "asc" },
        include: {
          championship: true,
          track: true,
          trackedBy: userId
            ? {
                where: {
                  userId
                }
              }
            : false
        }
      },
      racers: {
        orderBy: { name: "asc" },
        include: {
          trackedBy: userId
            ? {
                where: {
                  userId
                }
              }
            : false
        }
      },
      trackedBy: userId
        ? {
            where: {
              userId
            }
          }
        : false
    }
  });

  if (!championship) {
    return null;
  }

  return {
    championship: {
      id: championship.id,
      slug: championship.slug,
      name: championship.name,
      category: championship.category,
      region: championship.region,
      season: championship.season,
      description: championship.description,
      image: championship.image,
      accentColor: championship.accentColor,
      raceCount: championship.races.length,
      racerCount: championship.racers.length,
      nextRaceName:
        championship.races.find((race) => race.startDate >= new Date())?.name ??
        championship.races[0]?.name ??
        null,
      isTracked: userId ? championship.trackedBy.length > 0 : false
    } satisfies DiscoveryChampionship,
    races: championship.races.map((race) => {
      const raceCoordinates = {
        lat: race.latitude,
        lng: race.longitude
      };
      const trackCoordinates = hasValidCoordinates({
        lat: race.track.latitude,
        lng: race.track.longitude
      })
        ? {
            lat: race.track.latitude,
            lng: race.track.longitude
          }
        : null;
      const { mapCoordinates, mapSource } = resolveRaceMapCoordinates(raceCoordinates, trackCoordinates);

      return {
        id: race.id,
        slug: race.slug,
        name: race.name,
        series: race.series,
        championshipId: race.championshipId,
        championshipName: race.championship.name,
        championshipSlug: race.championship.slug,
        date: formatRaceDate(race.startDate),
        startDate: race.startDate.toISOString(),
        endDate: race.endDate.toISOString(),
        location: race.location,
        trackId: race.trackId,
        trackName: race.track.name,
        trackSlug: race.track.slug,
        status: formatRaceStatus(race.status),
        summary: race.summary,
        coordinates: raceCoordinates,
        trackCoordinates,
        mapCoordinates,
        mapSource,
        isTracked: userId ? race.trackedBy.length > 0 : false
      };
    }) satisfies DiscoveryRace[],
    racers: championship.racers.map((racer) => ({
      id: racer.id,
      slug: racer.slug,
      name: racer.name,
      team: racer.team,
      nationality: racer.nationality,
      number: racer.number,
      championships: racer.championships,
      victories: racer.victories,
      podiums: racer.podiums,
      bio: racer.bio,
      image: racer.image,
      vehicle: racer.vehicle,
      verified: racer.verified,
      championshipId: racer.championshipId,
      championshipName: championship.name,
      championshipSlug: championship.slug,
      isTracked: userId ? racer.trackedBy.length > 0 : false
    })) satisfies DiscoveryRacer[]
  };
}

export async function getTracks(userId?: string) {
  const tracks = await prisma.track.findMany({
    orderBy: { name: "asc" },
    include: {
      races: {
        select: { id: true }
      },
      trackedBy: userId
        ? {
            where: {
              userId
            }
          }
        : false
    }
  });

  return tracks.map((track) => ({
    id: track.id,
    slug: track.slug,
    name: track.name,
    location: track.location,
    country: track.country,
    trackType: track.trackType,
    length: track.length,
    turns: track.turns,
    lapRecord: track.lapRecord,
    image: track.image,
    history: track.history,
    website: track.website,
    coordinates: hasValidCoordinates({ lat: track.latitude, lng: track.longitude })
      ? {
          lat: track.latitude,
          lng: track.longitude
        }
      : null,
    raceCount: track.races.length,
    isTracked: userId ? track.trackedBy.length > 0 : false
  })) satisfies DiscoveryTrack[];
}

export async function getTrackBySlug(slug: string, userId?: string) {
  const track = await prisma.track.findUnique({
    where: { slug },
    include: {
      races: {
        orderBy: { startDate: "asc" },
        include: {
          championship: true,
          track: true,
          trackedBy: userId
            ? {
                where: {
                  userId
                }
              }
            : false
        }
      },
      trackedBy: userId
        ? {
            where: {
              userId
            }
          }
        : false
    }
  });

  if (!track) {
    return null;
  }

  return {
    track: {
      id: track.id,
      slug: track.slug,
      name: track.name,
      location: track.location,
      country: track.country,
      trackType: track.trackType,
      length: track.length,
      turns: track.turns,
      lapRecord: track.lapRecord,
      image: track.image,
      history: track.history,
      website: track.website,
      coordinates: hasValidCoordinates({ lat: track.latitude, lng: track.longitude })
        ? {
            lat: track.latitude,
            lng: track.longitude
          }
        : null,
      raceCount: track.races.length,
      isTracked: userId ? track.trackedBy.length > 0 : false
    } satisfies DiscoveryTrack,
    races: track.races.map((race) => {
      const raceCoordinates = {
        lat: race.latitude,
        lng: race.longitude
      };
      const fallbackTrackCoordinates = hasValidCoordinates({
        lat: race.track.latitude,
        lng: race.track.longitude
      })
        ? {
            lat: race.track.latitude,
            lng: race.track.longitude
          }
        : null;
      const { mapCoordinates, mapSource } = resolveRaceMapCoordinates(
        raceCoordinates,
        fallbackTrackCoordinates
      );

      return {
        id: race.id,
        slug: race.slug,
        name: race.name,
        series: race.series,
        championshipId: race.championshipId,
        championshipName: race.championship.name,
        championshipSlug: race.championship.slug,
        date: formatRaceDate(race.startDate),
        startDate: race.startDate.toISOString(),
        endDate: race.endDate.toISOString(),
        location: race.location,
        trackId: race.trackId,
        trackName: race.track.name,
        trackSlug: race.track.slug,
        status: formatRaceStatus(race.status),
        summary: race.summary,
        coordinates: raceCoordinates,
        trackCoordinates: fallbackTrackCoordinates,
        mapCoordinates,
        mapSource,
        isTracked: userId ? race.trackedBy.length > 0 : false
      };
    }) satisfies DiscoveryRace[]
  };
}

export async function getRacers(userId?: string) {
  const racers = await prisma.racer.findMany({
    orderBy: { name: "asc" },
    include: {
      championship: true,
      trackedBy: userId
        ? {
            where: {
              userId
            }
          }
        : false
    }
  });

  return racers.map((racer) => ({
    id: racer.id,
    slug: racer.slug,
    name: racer.name,
    team: racer.team,
    nationality: racer.nationality,
    number: racer.number,
    championships: racer.championships,
    victories: racer.victories,
    podiums: racer.podiums,
    bio: racer.bio,
    image: racer.image,
    vehicle: racer.vehicle,
    verified: racer.verified,
    championshipId: racer.championshipId,
    championshipName: racer.championship?.name ?? null,
    championshipSlug: racer.championship?.slug ?? null,
    isTracked: userId ? racer.trackedBy.length > 0 : false
  })) satisfies DiscoveryRacer[];
}

export async function getRacerBySlug(slug: string, userId?: string) {
  const racer = await prisma.racer.findUnique({
    where: { slug },
    include: {
      championship: true,
      trackedBy: userId
        ? {
            where: {
              userId
            }
          }
        : false
    }
  });

  if (!racer) {
    return null;
  }

  return {
    id: racer.id,
    slug: racer.slug,
    name: racer.name,
    team: racer.team,
    nationality: racer.nationality,
    number: racer.number,
    championships: racer.championships,
    victories: racer.victories,
    podiums: racer.podiums,
    bio: racer.bio,
    image: racer.image,
    vehicle: racer.vehicle,
    verified: racer.verified,
    championshipId: racer.championshipId,
    championshipName: racer.championship?.name ?? null,
    championshipSlug: racer.championship?.slug ?? null,
    isTracked: userId ? racer.trackedBy.length > 0 : false
  } satisfies DiscoveryRacer;
}

export async function getMyTracking(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      trackedRaces: {
        orderBy: { race: { startDate: "asc" } },
        include: {
          race: {
            include: {
              championship: true,
              track: true
            }
          }
        }
      },
      trackedChampionships: {
        orderBy: { championship: { name: "asc" } },
        include: {
          championship: {
            include: {
              races: {
                select: { id: true }
              },
              racers: {
                select: { id: true }
              }
            }
          }
        }
      },
      trackedRacers: {
        orderBy: { racer: { name: "asc" } },
        include: {
          racer: {
            include: {
              championship: true
            }
          }
        }
      },
      trackedTracks: {
        orderBy: { track: { name: "asc" } },
        include: {
          track: {
            include: {
              races: {
                select: { id: true }
              }
            }
          }
        }
      }
    }
  });

  if (!user) {
    return null;
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    races: user.trackedRaces.map(({ race }) => ({
      id: race.id,
      slug: race.slug,
      name: race.name,
      series: race.series,
      championshipId: race.championshipId,
      championshipName: race.championship.name,
      championshipSlug: race.championship.slug,
      date: formatRaceDate(race.startDate),
      startDate: race.startDate.toISOString(),
      endDate: race.endDate.toISOString(),
      location: race.location,
      trackId: race.trackId,
      trackName: race.track.name,
      trackSlug: race.track.slug,
      status: formatRaceStatus(race.status),
      summary: race.summary,
      coordinates: { lat: race.latitude, lng: race.longitude },
      trackCoordinates: hasValidCoordinates({
        lat: race.track.latitude,
        lng: race.track.longitude
      })
        ? { lat: race.track.latitude, lng: race.track.longitude }
        : null,
      mapCoordinates: resolveRaceMapCoordinates(
        { lat: race.latitude, lng: race.longitude },
        hasValidCoordinates({ lat: race.track.latitude, lng: race.track.longitude })
          ? { lat: race.track.latitude, lng: race.track.longitude }
          : null
      ).mapCoordinates,
      mapSource: resolveRaceMapCoordinates(
        { lat: race.latitude, lng: race.longitude },
        hasValidCoordinates({ lat: race.track.latitude, lng: race.track.longitude })
          ? { lat: race.track.latitude, lng: race.track.longitude }
          : null
      ).mapSource,
      isTracked: true
    })) satisfies DiscoveryRace[],
    championships: user.trackedChampionships.map(({ championship }) => ({
      id: championship.id,
      slug: championship.slug,
      name: championship.name,
      category: championship.category,
      region: championship.region,
      season: championship.season,
      description: championship.description,
      image: championship.image,
      accentColor: championship.accentColor,
      raceCount: championship.races.length,
      racerCount: championship.racers.length,
      nextRaceName: null,
      isTracked: true
    })) satisfies DiscoveryChampionship[],
    racers: user.trackedRacers.map(({ racer }) => ({
      id: racer.id,
      slug: racer.slug,
      name: racer.name,
      team: racer.team,
      nationality: racer.nationality,
      number: racer.number,
      championships: racer.championships,
      victories: racer.victories,
      podiums: racer.podiums,
      bio: racer.bio,
      image: racer.image,
      vehicle: racer.vehicle,
      verified: racer.verified,
      championshipId: racer.championshipId,
      championshipName: racer.championship?.name ?? null,
      championshipSlug: racer.championship?.slug ?? null,
      isTracked: true
    })) satisfies DiscoveryRacer[],
    tracks: user.trackedTracks.map(({ track }) => ({
      id: track.id,
      slug: track.slug,
      name: track.name,
      location: track.location,
      country: track.country,
      trackType: track.trackType,
      length: track.length,
      turns: track.turns,
      lapRecord: track.lapRecord,
      image: track.image,
      history: track.history,
      website: track.website,
      coordinates: hasValidCoordinates({ lat: track.latitude, lng: track.longitude })
        ? {
            lat: track.latitude,
            lng: track.longitude
          }
        : null,
      raceCount: track.races.length,
      isTracked: true
    })) satisfies DiscoveryTrack[]
  };
}

export async function getHomepageData(userId?: string) {
  const [championshipCount, raceCount, upcomingRaces, trackCount, upcomingMappedRaces, tracking, recentRaces, popularTracks] = await Promise.all([
    prisma.championship.count(),
    prisma.race.count(),
    getRaces({ status: "UPCOMING" }, userId),
    prisma.track.count(),
    getRaces({ status: "UPCOMING" }, userId),
    userId ? getMyTracking(userId) : Promise.resolve(null),
    prisma.race.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        championship: true,
        track: true,
        trackedBy: userId
          ? {
              where: {
                userId
              }
            }
          : false
      }
    }),
    prisma.track.findMany({
      take: 3,
      orderBy: [{ races: { _count: "desc" } }, { name: "asc" }],
      include: {
        races: {
          select: { id: true }
        },
        trackedBy: userId
          ? {
              where: {
                userId
              }
            }
          : false
      }
    })
  ]);

  const nextTrackedRace =
    tracking?.races.find((race) => race.status === "Upcoming" || race.status === "Live") ?? null;
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfToday);
  endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 7);
  const upcomingThisWeek = upcomingRaces.filter((race) => {
    const start = new Date(race.startDate);
    return start >= startOfToday && start < endOfWeek;
  });

  return {
    metrics: [
      {
        label: "Active Championships",
        value: String(championshipCount).padStart(2, "0"),
        detail: "Series to explore across sprint, GT, endurance, touring, and club racing."
      },
      {
        label: "Upcoming Races",
        value: String(upcomingRaces.length).padStart(2, "0"),
        detail: "Future race weekends already loaded across multiple months and regions."
      },
      {
        label: "Mapped Tracks",
        value: String(trackCount).padStart(2, "0"),
        detail: "Real venues with coordinates ready for map-based discovery."
      }
    ],
    statLine: `${raceCount}+ races • ${trackCount}+ tracks • ${championshipCount} championships`,
    upcomingRaces: upcomingRaces.slice(0, 6),
    upcomingThisWeek: upcomingThisWeek.slice(0, 3),
    recentlyAdded: recentRaces.map((race) => {
      const raceCoordinates = {
        lat: race.latitude,
        lng: race.longitude
      };
      const trackCoordinates = hasValidCoordinates({
        lat: race.track.latitude,
        lng: race.track.longitude
      })
        ? {
            lat: race.track.latitude,
            lng: race.track.longitude
          }
        : null;
      const { mapCoordinates, mapSource } = resolveRaceMapCoordinates(raceCoordinates, trackCoordinates);

      return {
        id: race.id,
        slug: race.slug,
        name: race.name,
        series: race.series,
        championshipId: race.championshipId,
        championshipName: race.championship.name,
        championshipSlug: race.championship.slug,
        date: formatRaceDate(race.startDate),
        startDate: race.startDate.toISOString(),
        endDate: race.endDate.toISOString(),
        location: race.location,
        trackId: race.trackId,
        trackName: race.track.name,
        trackSlug: race.track.slug,
        status: formatRaceStatus(race.status),
        summary: race.summary,
        coordinates: raceCoordinates,
        trackCoordinates,
        mapCoordinates,
        mapSource,
        isTracked: userId ? race.trackedBy.length > 0 : false
      };
    }) satisfies DiscoveryRace[],
    popularTracks: popularTracks.map((track) => ({
      id: track.id,
      slug: track.slug,
      name: track.name,
      location: track.location,
      country: track.country,
      trackType: track.trackType,
      length: track.length,
      turns: track.turns,
      lapRecord: track.lapRecord,
      image: track.image,
      history: track.history,
      website: track.website,
      coordinates: hasValidCoordinates({ lat: track.latitude, lng: track.longitude })
        ? {
            lat: track.latitude,
            lng: track.longitude
          }
        : null,
      raceCount: track.races.length,
      isTracked: userId ? track.trackedBy.length > 0 : false
    })) satisfies DiscoveryTrack[],
    mapPreviewRaces: upcomingMappedRaces.filter((race) => race.mapCoordinates).slice(0, 6),
    nextTrackedRace
  };
}
