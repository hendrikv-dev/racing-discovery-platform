import { RaceStatus } from "@prisma/client";
import { getRaces, type DiscoveryRace } from "@/lib/discovery";
import { prisma } from "@/lib/prisma";

export type RecommendedRace = DiscoveryRace & {
  recommendationReason: string;
  popularityScore: number;
  recommendationScore: number;
};

function getDaysUntil(startDate: string) {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  return Math.ceil((start - now) / (1000 * 60 * 60 * 24));
}

function uniqueById(races: RecommendedRace[]) {
  return Array.from(new Map(races.map((race) => [race.id, race])).values());
}

export async function getPersonalizedRaceRecommendations(
  userId?: string,
  options?: {
    limit?: number;
    lat?: number;
    lng?: number;
  }
) {
  const limit = options?.limit ?? 6;
  const filters =
    options?.lat != null && options?.lng != null
      ? {
          status: RaceStatus.UPCOMING,
          sort: "nearest",
          lat: String(options.lat),
          lng: String(options.lng)
        }
      : { status: RaceStatus.UPCOMING };

  const [upcomingRaces, signals] = await Promise.all([
    getRaces(filters, userId),
    userId
      ? prisma.user.findUnique({
          where: { id: userId },
          select: {
            trackedRaces: { select: { raceId: true } },
            trackedTracks: { select: { trackId: true } },
            trackedChampionships: { select: { championshipId: true } },
            trackedRacers: {
              select: {
                racerId: true,
                racer: {
                  select: {
                    championshipId: true,
                    raceEntries: {
                      where: { race: { status: RaceStatus.UPCOMING } },
                      select: { raceId: true }
                    }
                  }
                }
              }
            }
          }
        })
      : Promise.resolve(null)
  ]);

  const trackedRaceIds = new Set(signals?.trackedRaces.map((item) => item.raceId) ?? []);
  const trackedTrackIds = new Set(signals?.trackedTracks.map((item) => item.trackId) ?? []);
  const trackedChampionshipIds = new Set(
    signals?.trackedChampionships.map((item) => item.championshipId) ?? []
  );
  const racerLinkedRaceIds = new Set(
    signals?.trackedRacers.flatMap((item) => item.racer.raceEntries.map((entry) => entry.raceId)) ?? []
  );
  const racerLinkedChampionshipIds = new Set(
    signals?.trackedRacers
      .map((item) => item.racer.championshipId)
      .filter((value): value is string => Boolean(value)) ?? []
  );

  const scored = upcomingRaces.map((race) => {
    const daysUntil = getDaysUntil(race.startDate);
    const isDirectlyTracked = trackedRaceIds.has(race.id);
    const matchesTrack = trackedTrackIds.has(race.trackId);
    const matchesChampionship =
      trackedChampionshipIds.has(race.championshipId) || racerLinkedChampionshipIds.has(race.championshipId);
    const matchesFollowedRacer = racerLinkedRaceIds.has(race.id);
    const popularityScore = race.popularityScore ?? 0;
    const proximityScore =
      typeof race.distanceKm === "number"
        ? Math.max(0, 24 - Math.min(24, Math.round(race.distanceKm / 50)))
        : 0;
    const recencyScore = Math.max(0, 35 - Math.max(daysUntil, 0));

    let reason = "Because this race is picking up attention";
    let score = recencyScore + popularityScore + proximityScore;

    if (isDirectlyTracked) {
      score += 120;
      reason = "Because you already track this race";
    } else if (matchesFollowedRacer) {
      score += 90;
      reason = "Because you follow a racer in this event";
    } else if (matchesChampionship) {
      score += 70;
      reason = "Because you follow this championship";
    } else if (matchesTrack) {
      score += 55;
      reason = "Because you follow this track";
    } else if (daysUntil <= 7) {
      score += 24;
      reason = "Because it is happening soon";
    }

    return {
      ...race,
      popularityScore,
      recommendationReason: reason,
      recommendationScore: score
    } satisfies RecommendedRace;
  });

  const directMatches = scored
    .filter(
      (race) =>
        trackedRaceIds.has(race.id) ||
        trackedTrackIds.has(race.trackId) ||
        trackedChampionshipIds.has(race.championshipId) ||
        racerLinkedRaceIds.has(race.id) ||
        racerLinkedChampionshipIds.has(race.championshipId)
    )
    .sort((left, right) => right.recommendationScore - left.recommendationScore);

  const thisWeekend = scored
    .filter((race) => {
      const daysUntil = getDaysUntil(race.startDate);
      return daysUntil >= 0 && daysUntil <= 7;
    })
    .sort((left, right) => new Date(left.startDate).getTime() - new Date(right.startDate).getTime());

  const recommended = scored
    .sort((left, right) => right.recommendationScore - left.recommendationScore || new Date(left.startDate).getTime() - new Date(right.startDate).getTime());

  return {
    recommended: uniqueById(recommended).slice(0, limit),
    upcomingForYou: uniqueById(directMatches).slice(0, limit),
    becauseYouFollow: uniqueById(
      directMatches.filter((race) => race.recommendationReason !== "Because you already track this race")
    ).slice(0, limit),
    thisWeekend: uniqueById(thisWeekend).slice(0, limit)
  };
}
