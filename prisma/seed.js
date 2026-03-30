const { PrismaClient, RaceStatus, RaceSubmissionStatus } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

const championships = [
  {
    slug: "formula-alpha",
    name: "Formula Alpha",
    category: "Open Wheel",
    region: "Global",
    season: "2026 Season",
    description:
      "Flagship single-seater championship with city circuits, technical venues, and title pressure every weekend.",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#3b82f6"
  },
  {
    slug: "gt-masters",
    name: "GT Masters",
    category: "Grand Touring",
    region: "Europe",
    season: "2026 Season",
    description:
      "Multi-class GT calendar built around packed grids, endurance strategy, and fan-favorite circuits.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#f59e0b"
  },
  {
    slug: "hyper-prototype",
    name: "Hyper Prototype",
    category: "Prototype",
    region: "Asia Pacific",
    season: "2026 Season",
    description:
      "A technical prototype series where nighttime strategy, energy deployment, and precision pit work decide everything.",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#ec4899"
  }
];

const tracks = [
  {
    slug: "circuit-de-monaco",
    name: "Circuit de Monaco",
    country: "Monaco",
    length: "3.337 km",
    turns: 19,
    lapRecord: "1:12.909",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80",
    history: "A legendary urban ribbon where barriers erase mistakes and reward commitment.",
    latitude: 43.7347,
    longitude: 7.4206
  },
  {
    slug: "silverstone-circuit",
    name: "Silverstone Circuit",
    country: "United Kingdom",
    length: "5.891 km",
    turns: 18,
    lapRecord: "1:27.097",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    history: "High-speed aerodynamic testing ground with iconic sequences and sweeping runoff.",
    latitude: 52.0786,
    longitude: -1.0169
  },
  {
    slug: "fuji-speedway",
    name: "Fuji Speedway",
    country: "Japan",
    length: "4.563 km",
    turns: 16,
    lapRecord: "1:27.749",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80",
    history:
      "Volcanic backdrop, heavy braking zones, and long straights that amplify power deployment.",
    latitude: 35.3714,
    longitude: 138.9276
  }
];

const racers = [
  {
    slug: "lena-volkov",
    name: "Lena Volkov",
    team: "Northstar Dynamics",
    nationality: "Finland",
    number: "07",
    championships: 2,
    victories: 19,
    podiums: 41,
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    vehicle: "VX-26 Hybrid Prototype",
    verified: true,
    championshipSlug: "formula-alpha"
  },
  {
    slug: "mateo-silva",
    name: "Mateo Silva",
    team: "Apex Nova Racing",
    nationality: "Brazil",
    number: "21",
    championships: 1,
    victories: 11,
    podiums: 29,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
    vehicle: "ANR GT3 Evo",
    verified: true,
    championshipSlug: "gt-masters"
  },
  {
    slug: "sora-tanaka",
    name: "Sora Tanaka",
    team: "Kinetic Motorsport Lab",
    nationality: "Japan",
    number: "88",
    championships: 0,
    victories: 4,
    podiums: 12,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
    vehicle: "KML LMH-4",
    verified: false,
    championshipSlug: "hyper-prototype"
  }
];

const races = [
  {
    slug: "monte-corsa-grand-prix",
    name: "Monte Corsa Grand Prix",
    series: "Formula Alpha",
    location: "Monaco Coast, MC",
    status: RaceStatus.LIVE,
    summary:
      "Street-circuit precision under late-afternoon light with strategy windows closing fast.",
    startDate: new Date("2026-04-14T14:00:00.000Z"),
    endDate: new Date("2026-04-14T16:00:00.000Z"),
    latitude: 43.7347,
    longitude: 7.4206,
    championshipSlug: "formula-alpha",
    trackSlug: "circuit-de-monaco"
  },
  {
    slug: "silverstone-1000",
    name: "Silverstone 1000",
    series: "GT Masters",
    location: "Silverstone, UK",
    status: RaceStatus.UPCOMING,
    summary: "A long-form endurance sprint with mixed weather forecasts and dense traffic.",
    startDate: new Date("2026-05-02T10:30:00.000Z"),
    endDate: new Date("2026-05-02T19:00:00.000Z"),
    latitude: 52.0786,
    longitude: -1.0169,
    championshipSlug: "gt-masters",
    trackSlug: "silverstone-circuit"
  },
  {
    slug: "fuji-night-run",
    name: "Fuji Night Run",
    series: "Hyper Prototype",
    location: "Oyama, JP",
    status: RaceStatus.COMPLETED,
    summary: "A floodlit tactical race defined by tire temperatures and late safety-car drama.",
    startDate: new Date("2026-03-21T09:00:00.000Z"),
    endDate: new Date("2026-03-21T12:00:00.000Z"),
    latitude: 35.3714,
    longitude: 138.9276,
    championshipSlug: "hyper-prototype",
    trackSlug: "fuji-speedway"
  }
];

const submissions = [
  {
    eventName: "Catalunya Sprint",
    series: "Formula Alpha",
    eventDate: new Date("2026-06-10T13:00:00.000Z"),
    circuit: "Circuit de Barcelona-Catalunya",
    description: "Official sprint weekend added for midsummer calendar compression.",
    sourceNotes: "Submitted from series bulletin and paddock release notes.",
    contactEmail: "contributor@example.com",
    status: RaceSubmissionStatus.APPROVED,
    latitude: 41.57,
    longitude: 2.2611
  },
  {
    eventName: "Spa Twilight 500",
    series: "GT Masters",
    eventDate: new Date("2026-07-18T17:30:00.000Z"),
    circuit: "Spa-Francorchamps",
    description: "Endurance-style twilight event proposed for the updated GT Masters calendar.",
    sourceNotes: "Community submission pending official confirmation.",
    contactEmail: "trackwatch@example.com",
    status: RaceSubmissionStatus.PENDING,
    latitude: 50.4372,
    longitude: 5.9714
  }
];

async function main() {
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.trackedRace.deleteMany();
  await prisma.trackedRacer.deleteMany();
  await prisma.trackedTrack.deleteMany();
  await prisma.trackedChampionship.deleteMany();
  await prisma.raceSubmission.deleteMany();
  await prisma.race.deleteMany();
  await prisma.racer.deleteMany();
  await prisma.track.deleteMany();
  await prisma.championship.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("password123", 10);

  const demoUser = await prisma.user.create({
    data: {
      name: "Hendrik",
      email: "hendrik@example.com",
      passwordHash
    }
  });

  for (const championship of championships) {
    await prisma.championship.create({ data: championship });
  }

  for (const track of tracks) {
    await prisma.track.create({ data: track });
  }

  for (const racer of racers) {
    await prisma.racer.create({
      data: {
        slug: racer.slug,
        name: racer.name,
        team: racer.team,
        nationality: racer.nationality,
        number: racer.number,
        championships: racer.championships,
        victories: racer.victories,
        podiums: racer.podiums,
        image: racer.image,
        vehicle: racer.vehicle,
        verified: racer.verified,
        championship: {
          connect: {
            slug: racer.championshipSlug
          }
        }
      }
    });
  }

  for (const race of races) {
    await prisma.race.create({
      data: {
        slug: race.slug,
        name: race.name,
        series: race.series,
        location: race.location,
        status: race.status,
        summary: race.summary,
        startDate: race.startDate,
        endDate: race.endDate,
        latitude: race.latitude,
        longitude: race.longitude,
        championship: {
          connect: { slug: race.championshipSlug }
        },
        track: {
          connect: { slug: race.trackSlug }
        }
      }
    });
  }

  await prisma.trackedRace.createMany({
    data: [
      { userId: demoUser.id, raceId: (await prisma.race.findUniqueOrThrow({ where: { slug: "silverstone-1000" } })).id },
      { userId: demoUser.id, raceId: (await prisma.race.findUniqueOrThrow({ where: { slug: "monte-corsa-grand-prix" } })).id }
    ]
  });

  await prisma.trackedRacer.createMany({
    data: [
      { userId: demoUser.id, racerId: (await prisma.racer.findUniqueOrThrow({ where: { slug: "lena-volkov" } })).id },
      { userId: demoUser.id, racerId: (await prisma.racer.findUniqueOrThrow({ where: { slug: "mateo-silva" } })).id }
    ]
  });

  await prisma.trackedTrack.createMany({
    data: [
      { userId: demoUser.id, trackId: (await prisma.track.findUniqueOrThrow({ where: { slug: "silverstone-circuit" } })).id },
      { userId: demoUser.id, trackId: (await prisma.track.findUniqueOrThrow({ where: { slug: "circuit-de-monaco" } })).id }
    ]
  });

  await prisma.trackedChampionship.createMany({
    data: [
      {
        userId: demoUser.id,
        championshipId: (
          await prisma.championship.findUniqueOrThrow({ where: { slug: "formula-alpha" } })
        ).id
      },
      {
        userId: demoUser.id,
        championshipId: (
          await prisma.championship.findUniqueOrThrow({ where: { slug: "gt-masters" } })
        ).id
      }
    ]
  });

  await prisma.raceSubmission.createMany({
    data: submissions
  });

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
