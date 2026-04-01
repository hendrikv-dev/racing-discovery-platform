const {
  PrismaClient,
  NotificationType,
  RaceStatus,
  RaceSubmissionStatus
} = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

const championships = [
  {
    slug: "gt-world-challenge",
    name: "GT World Challenge",
    category: "Grand Touring",
    region: "Global",
    season: "2026 Season",
    description:
      "A global GT calendar built around factory-backed squads, iconic circuits, and title swings that run deep into the year.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#f97316"
  },
  {
    slug: "formula-sprint-series",
    name: "Formula Sprint Series",
    category: "Open Wheel",
    region: "Global",
    season: "2026 Season",
    description:
      "Short-format single-seater weekends where qualifying precision and race starts can decide the full championship picture.",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#2563eb"
  },
  {
    slug: "endurance-cup",
    name: "Endurance Cup",
    category: "Endurance",
    region: "Global",
    season: "2026 Season",
    description:
      "Long-form prototype and GT races shaped by traffic management, tire longevity, and late-race strategy calls.",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#0f766e"
  },
  {
    slug: "touring-masters",
    name: "Touring Masters",
    category: "Touring Cars",
    region: "Europe",
    season: "2026 Season",
    description:
      "Close-quarters touring car racing with heavy braking battles, reverse-grid drama, and relentless points pressure.",
    image:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#dc2626"
  },
  {
    slug: "prototype-series",
    name: "Prototype Series",
    category: "Prototype",
    region: "Asia Pacific",
    season: "2026 Season",
    description:
      "A technical prototype championship where downforce efficiency, energy deployment, and clean execution separate contenders.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#8b5cf6"
  },
  {
    slug: "club-racing-championship",
    name: "Club Racing Championship",
    category: "Club Racing",
    region: "North America",
    season: "2026 Season",
    description:
      "A broad grassroots championship mixing sprint and endurance weekends across beloved regional circuits.",
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80",
    accentColor: "#0891b2"
  }
];

const tracks = [
  {
    slug: "weathertech-raceway-laguna-seca",
    name: "WeatherTech Raceway Laguna Seca",
    location: "Monterey, California",
    country: "United States",
    trackType: "Permanent Road Course",
    length: "3.602 km",
    turns: 11,
    lapRecord: "1:10.221",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80",
    history:
      "A hillside California circuit famous for blind crests, the Corkscrew, and decisive late-braking moves.",
    website: "https://www.co.monterey.ca.us/government/government-links/weathertech-raceway",
    latitude: 36.5843,
    longitude: -121.7537
  },
  {
    slug: "long-beach-street-circuit",
    name: "Long Beach Street Circuit",
    location: "Long Beach, California",
    country: "United States",
    trackType: "Street Circuit",
    length: "3.167 km",
    turns: 11,
    lapRecord: "1:07.089",
    image:
      "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=1400&q=80",
    history:
      "Concrete-lined downtown racing with quick direction changes and no room to recover from mistakes.",
    website: "https://www.gplb.com",
    latitude: 33.7651,
    longitude: -118.1892
  },
  {
    slug: "road-america",
    name: "Road America",
    location: "Elkhart Lake, Wisconsin",
    country: "United States",
    trackType: "Permanent Road Course",
    length: "6.515 km",
    turns: 14,
    lapRecord: "1:44.521",
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=80",
    history:
      "Fast, flowing, and old-school, with long straights, heavy brake zones, and huge drafting opportunities.",
    website: "https://www.roadamerica.com",
    latitude: 43.7984,
    longitude: -87.9899
  },
  {
    slug: "daytona-international-speedway-road-course",
    name: "Daytona Road Course",
    location: "Daytona Beach, Florida",
    country: "United States",
    trackType: "Road Course",
    length: "5.729 km",
    turns: 12,
    lapRecord: "1:33.724",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
    history:
      "An infield and banking hybrid where speed, traffic, and nighttime rhythm all matter.",
    website: "https://www.daytonainternationalspeedway.com",
    latitude: 29.1852,
    longitude: -81.0705
  },
  {
    slug: "watkins-glen-international",
    name: "Watkins Glen International",
    location: "Watkins Glen, New York",
    country: "United States",
    trackType: "Permanent Road Course",
    length: "5.430 km",
    turns: 11,
    lapRecord: "1:29.468",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    history:
      "A classic East Coast circuit with commitment corners, elevation changes, and momentum-driven laps.",
    website: "https://www.theglen.com",
    latitude: 42.3369,
    longitude: -76.9279
  },
  {
    slug: "road-atlanta",
    name: "Michelin Raceway Road Atlanta",
    location: "Braselton, Georgia",
    country: "United States",
    trackType: "Permanent Road Course",
    length: "4.088 km",
    turns: 12,
    lapRecord: "1:09.853",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
    history:
      "A technical American classic where elevation and late-race traffic create constant pressure.",
    website: "https://www.roadatlanta.com",
    latitude: 34.1526,
    longitude: -83.8153
  },
  {
    slug: "silverstone-circuit",
    name: "Silverstone Circuit",
    location: "Silverstone, England",
    country: "United Kingdom",
    trackType: "Permanent Road Course",
    length: "5.891 km",
    turns: 18,
    lapRecord: "1:27.097",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    history:
      "A benchmark high-speed circuit where aero confidence and rhythm through the fast sequence define the best laps.",
    website: "https://www.silverstone.co.uk",
    latitude: 52.0786,
    longitude: -1.0169
  },
  {
    slug: "spa-francorchamps",
    name: "Circuit de Spa-Francorchamps",
    location: "Stavelot, Belgium",
    country: "Belgium",
    trackType: "Permanent Road Course",
    length: "7.004 km",
    turns: 19,
    lapRecord: "1:46.286",
    image:
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1400&q=80",
    history:
      "A sweeping Ardennes circuit where weather swings, elevation, and bravery all shape the result.",
    website: "https://www.spa-francorchamps.be",
    latitude: 50.4372,
    longitude: 5.9714
  },
  {
    slug: "autodromo-nazionale-monza",
    name: "Autodromo Nazionale Monza",
    location: "Monza, Italy",
    country: "Italy",
    trackType: "Permanent Road Course",
    length: "5.793 km",
    turns: 11,
    lapRecord: "1:21.046",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
    history:
      "Slipstream-heavy racing at one of the sport's true temples of speed.",
    website: "https://www.monzanet.it",
    latitude: 45.6156,
    longitude: 9.2811
  },
  {
    slug: "red-bull-ring",
    name: "Red Bull Ring",
    location: "Spielberg, Austria",
    country: "Austria",
    trackType: "Permanent Road Course",
    length: "4.318 km",
    turns: 10,
    lapRecord: "1:05.619",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    history:
      "A short lap with huge braking events and hillside views that make every tenth count.",
    website: "https://www.redbullring.com",
    latitude: 47.2197,
    longitude: 14.7647
  },
  {
    slug: "fuji-speedway",
    name: "Fuji Speedway",
    location: "Oyama, Shizuoka",
    country: "Japan",
    trackType: "Permanent Road Course",
    length: "4.563 km",
    turns: 16,
    lapRecord: "1:27.749",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80",
    history:
      "A volcanic backdrop and a huge front straight that reward power, patience, and perfect exits.",
    website: "https://www.fsw.tv",
    latitude: 35.3714,
    longitude: 138.9276
  },
  {
    slug: "mount-panorama-circuit",
    name: "Mount Panorama Circuit",
    location: "Bathurst, New South Wales",
    country: "Australia",
    trackType: "Permanent Road Course",
    length: "6.213 km",
    turns: 23,
    lapRecord: "1:59.291",
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80",
    history:
      "A mountain circuit where bravery over the top and precision through the descent define the field.",
    website: "https://www.mount-panorama.com.au",
    latitude: -33.4393,
    longitude: 149.5579
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
    bio: "A composed front-runner known for qualifying precision and calm tire management under pressure.",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    vehicle: "NSD FS-26",
    verified: true,
    championshipSlug: "formula-sprint-series"
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
    bio: "A relentless attacker who thrives in side-by-side braking fights and late restarts.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
    vehicle: "ANR Sprint One",
    verified: true,
    championshipSlug: "formula-sprint-series"
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
    bio: "A technically sharp racer who is strongest when the setup window is narrow and the lap is on the edge.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
    vehicle: "KML Sprint S3",
    verified: false,
    championshipSlug: "formula-sprint-series"
  },
  {
    slug: "amelia-hart",
    name: "Amelia Hart",
    team: "Velocity GT",
    nationality: "United Kingdom",
    number: "14",
    championships: 1,
    victories: 9,
    podiums: 22,
    bio: "A polished GT specialist with a reputation for clean racecraft in heavy traffic.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    vehicle: "VGT GT3 R",
    verified: true,
    championshipSlug: "gt-world-challenge"
  },
  {
    slug: "dario-fonseca",
    name: "Dario Fonseca",
    team: "Maranello Crest",
    nationality: "Portugal",
    number: "55",
    championships: 0,
    victories: 6,
    podiums: 18,
    bio: "A consistent GT campaigner who shines when strategy turns races into endurance sprints.",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1200&q=80",
    vehicle: "MC GT Evo",
    verified: true,
    championshipSlug: "gt-world-challenge"
  },
  {
    slug: "maya-kobayashi",
    name: "Maya Kobayashi",
    team: "Phoenix Sport",
    nationality: "Japan",
    number: "31",
    championships: 0,
    victories: 3,
    podiums: 10,
    bio: "A rising GT talent with excellent wet-weather pace and disciplined stint execution.",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=80",
    vehicle: "PS GT3 RS",
    verified: false,
    championshipSlug: "gt-world-challenge"
  },
  {
    slug: "nico-alvarez",
    name: "Nico Alvarez",
    team: "Atlas Endurance",
    nationality: "Spain",
    number: "6",
    championships: 1,
    victories: 8,
    podiums: 20,
    bio: "An endurance anchor whose traffic management and double-stint pace make him hard to beat.",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1200&q=80",
    vehicle: "AE Hyper LMH",
    verified: true,
    championshipSlug: "endurance-cup"
  },
  {
    slug: "claire-dubois",
    name: "Claire Dubois",
    team: "Helix Racing",
    nationality: "France",
    number: "27",
    championships: 1,
    victories: 7,
    podiums: 16,
    bio: "A measured endurance racer who rarely overdrives and almost always brings points home.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1200&q=80",
    vehicle: "Helix LMDh 01",
    verified: true,
    championshipSlug: "endurance-cup"
  },
  {
    slug: "owen-park",
    name: "Owen Park",
    team: "Summit Performance",
    nationality: "Australia",
    number: "63",
    championships: 0,
    victories: 4,
    podiums: 11,
    bio: "A quick closer who thrives in fading light, late cautions, and final-hour decisions.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
    vehicle: "Summit Hybrid Proto",
    verified: false,
    championshipSlug: "endurance-cup"
  },
  {
    slug: "hugo-lambert",
    name: "Hugo Lambert",
    team: "Tourline Motorsport",
    nationality: "Belgium",
    number: "18",
    championships: 1,
    victories: 13,
    podiums: 31,
    bio: "A touring car leader who builds championships with consistency rather than chaos.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
    vehicle: "TM TCR One",
    verified: true,
    championshipSlug: "touring-masters"
  },
  {
    slug: "isabella-rossi",
    name: "Isabella Rossi",
    team: "Milano Touring",
    nationality: "Italy",
    number: "42",
    championships: 0,
    victories: 5,
    podiums: 14,
    bio: "A fearless touring racer who is never shy about committing to the inside line.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
    vehicle: "MTC TCR-R",
    verified: true,
    championshipSlug: "touring-masters"
  },
  {
    slug: "tobias-berg",
    name: "Tobias Berg",
    team: "Nordic Sportline",
    nationality: "Sweden",
    number: "91",
    championships: 0,
    victories: 2,
    podiums: 8,
    bio: "A patient race-day improver who is strongest once tire degradation starts to matter.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
    vehicle: "NSL Touring Evo",
    verified: false,
    championshipSlug: "touring-masters"
  },
  {
    slug: "akira-matsuo",
    name: "Akira Matsuo",
    team: "Shinrai Prototype",
    nationality: "Japan",
    number: "12",
    championships: 1,
    victories: 10,
    podiums: 24,
    bio: "A prototype ace who blends clean aero-sensitive driving with ruthless pace on fresh tires.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
    vehicle: "SPS P-26",
    verified: true,
    championshipSlug: "prototype-series"
  },
  {
    slug: "erin-calloway",
    name: "Erin Calloway",
    team: "Pacific Apex",
    nationality: "United States",
    number: "24",
    championships: 0,
    victories: 6,
    podiums: 15,
    bio: "A smooth prototype racer with a habit of peaking in the middle phase of the race.",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=80",
    vehicle: "PA Prototype X",
    verified: true,
    championshipSlug: "prototype-series"
  },
  {
    slug: "lucas-meyer",
    name: "Lucas Meyer",
    team: "Vector Dynamics",
    nationality: "Germany",
    number: "70",
    championships: 0,
    victories: 3,
    podiums: 9,
    bio: "A data-driven racer who often unlocks pace late in the weekend once the setup is dialed in.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
    vehicle: "VD P2R",
    verified: false,
    championshipSlug: "prototype-series"
  },
  {
    slug: "zoe-bennett",
    name: "Zoe Bennett",
    team: "Westline Club Racing",
    nationality: "United States",
    number: "5",
    championships: 2,
    victories: 15,
    podiums: 37,
    bio: "A grassroots star who combines veteran racecraft with real pace at regional circuits.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    vehicle: "WCR Cup Spec",
    verified: true,
    championshipSlug: "club-racing-championship"
  },
  {
    slug: "caleb-ward",
    name: "Caleb Ward",
    team: "Atlantic Club Sport",
    nationality: "United States",
    number: "39",
    championships: 1,
    victories: 9,
    podiums: 21,
    bio: "A dependable points collector who turns disciplined weekends into strong championship runs.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
    vehicle: "ACS Club GT",
    verified: true,
    championshipSlug: "club-racing-championship"
  },
  {
    slug: "riley-chen",
    name: "Riley Chen",
    team: "North Coast Autosport",
    nationality: "Canada",
    number: "83",
    championships: 0,
    victories: 4,
    podiums: 13,
    bio: "An adaptable racer who makes the most of mixed-surface conditions and changing grip.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
    vehicle: "NCA Club Sprint",
    verified: false,
    championshipSlug: "club-racing-championship"
  }
];

const raceCalendar = [
  {
    championshipSlug: "formula-sprint-series",
    series: "Formula Sprint Series",
    racerSlugs: ["lena-volkov", "mateo-silva", "sora-tanaka"],
    events: [
      ["long-beach-sprint-opener", "Long Beach Sprint Opener", "long-beach-street-circuit", "2026-01-18T20:00:00.000Z", "2026-01-18T21:30:00.000Z", RaceStatus.COMPLETED, "Season-opening street race where restart execution and tire warm-up shaped the result."],
      ["laguna-seca-spring-sprint", "Laguna Seca Spring Sprint", "weathertech-raceway-laguna-seca", "2026-03-01T19:00:00.000Z", "2026-03-01T20:30:00.000Z", RaceStatus.COMPLETED, "A windy California sprint weekend defined by bravery through the fast downhill sequence."],
      ["silverstone-sprint-classic", "Silverstone Sprint Classic", "silverstone-circuit", "2026-04-20T13:00:00.000Z", "2026-04-20T14:30:00.000Z", RaceStatus.UPCOMING, "A fast spring weekend where qualifying pace matters just as much as tire life."],
      ["red-bull-ring-sprint-cup", "Red Bull Ring Sprint Cup", "red-bull-ring", "2026-06-07T12:00:00.000Z", "2026-06-07T13:30:00.000Z", RaceStatus.UPCOMING, "A short-lap fight where starts, traction zones, and defending into the hairpins are everything."],
      ["monza-season-finale-sprint", "Monza Season Finale Sprint", "autodromo-nazionale-monza", "2026-09-13T14:00:00.000Z", "2026-09-13T15:30:00.000Z", RaceStatus.UPCOMING, "A slipstream-heavy finale with the title likely to go down to the last braking zone."]
    ]
  },
  {
    championshipSlug: "gt-world-challenge",
    series: "GT World Challenge",
    racerSlugs: ["amelia-hart", "dario-fonseca", "maya-kobayashi"],
    events: [
      ["daytona-gt-trophy", "Daytona GT Trophy", "daytona-international-speedway-road-course", "2026-01-25T18:00:00.000Z", "2026-01-25T21:00:00.000Z", RaceStatus.COMPLETED, "A twilight GT opener where traffic and banking exits punished every small mistake."],
      ["watkins-glen-gt-showcase", "Watkins Glen GT Showcase", "watkins-glen-international", "2026-03-14T16:00:00.000Z", "2026-03-14T18:30:00.000Z", RaceStatus.COMPLETED, "A drafting-heavy race where the podium order stayed open right to the final lap."],
      ["spa-gt-enduro", "Spa GT Enduro", "spa-francorchamps", "2026-05-16T15:30:00.000Z", "2026-05-16T18:30:00.000Z", RaceStatus.UPCOMING, "A long GT race where weather windows and traffic management will decide the contenders."],
      ["monza-gt-night-run", "Monza GT Night Run", "autodromo-nazionale-monza", "2026-07-11T17:00:00.000Z", "2026-07-11T20:00:00.000Z", RaceStatus.UPCOMING, "A high-speed night event built around draft packs, pit timing, and nerve under braking."],
      ["bathurst-1000-gt", "Bathurst 1000 GT", "mount-panorama-circuit", "2026-09-27T02:00:00.000Z", "2026-09-27T08:00:00.000Z", RaceStatus.UPCOMING, "A mountain marathon where clean execution over the top is worth more than raw speed."]
    ]
  },
  {
    championshipSlug: "endurance-cup",
    series: "Endurance Cup",
    racerSlugs: ["nico-alvarez", "claire-dubois", "owen-park"],
    events: [
      ["daytona-6-hour", "Daytona 6 Hour", "daytona-international-speedway-road-course", "2026-01-10T17:00:00.000Z", "2026-01-10T23:00:00.000Z", RaceStatus.COMPLETED, "A season-opening endurance run shaped by traffic discipline and nighttime restarts."],
      ["road-atlanta-six-hour", "Road Atlanta Six Hour", "road-atlanta", "2026-03-07T16:00:00.000Z", "2026-03-07T22:00:00.000Z", RaceStatus.COMPLETED, "A Georgia endurance battle where strategy turned the final hour into a sprint."],
      ["spa-eight-hour", "Spa Eight Hour", "spa-francorchamps", "2026-04-25T14:00:00.000Z", "2026-04-25T22:00:00.000Z", RaceStatus.UPCOMING, "A classic endurance test where weather changes can reset the whole race in minutes."],
      ["fuji-six-hour", "Fuji Six Hour", "fuji-speedway", "2026-07-04T05:00:00.000Z", "2026-07-04T11:00:00.000Z", RaceStatus.UPCOMING, "A power-sensitive race where clean exits onto the front straight matter all day long."],
      ["silverstone-nine-hour", "Silverstone Nine Hour", "silverstone-circuit", "2026-09-05T11:00:00.000Z", "2026-09-05T20:00:00.000Z", RaceStatus.UPCOMING, "A decisive endurance round where setup balance and adaptability will define the title fight."]
    ]
  },
  {
    championshipSlug: "touring-masters",
    series: "Touring Masters",
    racerSlugs: ["hugo-lambert", "isabella-rossi", "tobias-berg"],
    events: [
      ["monza-touring-opener", "Monza Touring Opener", "autodromo-nazionale-monza", "2026-02-01T12:30:00.000Z", "2026-02-01T13:30:00.000Z", RaceStatus.COMPLETED, "A tight touring opener where braking duels and race-one aggression decided early momentum."],
      ["red-bull-ring-touring-round", "Red Bull Ring Touring Round", "red-bull-ring", "2026-03-22T11:30:00.000Z", "2026-03-22T12:30:00.000Z", RaceStatus.COMPLETED, "A short-lap sprint where overtakes came in bunches and every safety-car restart mattered."],
      ["silverstone-touring-weekend", "Silverstone Touring Weekend", "silverstone-circuit", "2026-05-30T12:00:00.000Z", "2026-05-30T13:00:00.000Z", RaceStatus.UPCOMING, "A fast touring sprint where tire wear and track position will stay in constant tension."],
      ["spa-touring-challenge", "Spa Touring Challenge", "spa-francorchamps", "2026-07-26T10:30:00.000Z", "2026-07-26T11:30:00.000Z", RaceStatus.UPCOMING, "A draft-heavy race where courage through the fast section could break the weekend open."],
      ["watkins-glen-touring-finale", "Watkins Glen Touring Finale", "watkins-glen-international", "2026-09-20T16:00:00.000Z", "2026-09-20T17:00:00.000Z", RaceStatus.UPCOMING, "A finale built for close-quarter fights and a likely championship showdown."]
    ]
  },
  {
    championshipSlug: "prototype-series",
    series: "Prototype Series",
    racerSlugs: ["akira-matsuo", "erin-calloway", "lucas-meyer"],
    events: [
      ["fuji-prototype-opener", "Fuji Prototype Opener", "fuji-speedway", "2026-01-31T05:30:00.000Z", "2026-01-31T08:00:00.000Z", RaceStatus.COMPLETED, "A downforce-sensitive opener where clean exits and late-race pressure separated the top three."],
      ["mount-panorama-prototype-round", "Mount Panorama Prototype Round", "mount-panorama-circuit", "2026-03-28T03:00:00.000Z", "2026-03-28T05:30:00.000Z", RaceStatus.COMPLETED, "A mountain challenge where bravery over the top carried as much weight as straight-line speed."],
      ["laguna-seca-prototype-showdown", "Laguna Seca Prototype Showdown", "weathertech-raceway-laguna-seca", "2026-05-09T19:30:00.000Z", "2026-05-09T22:00:00.000Z", RaceStatus.UPCOMING, "A technical fight where traffic timing and the Corkscrew will be central to the result."],
      ["silverstone-prototype-grand-prix", "Silverstone Prototype Grand Prix", "silverstone-circuit", "2026-08-02T12:00:00.000Z", "2026-08-02T14:30:00.000Z", RaceStatus.UPCOMING, "A high-speed prototype round where aero confidence and clean qualifying laps are everything."],
      ["bathurst-prototype-finale", "Bathurst Prototype Finale", "mount-panorama-circuit", "2026-09-12T03:00:00.000Z", "2026-09-12T05:30:00.000Z", RaceStatus.UPCOMING, "A dramatic finale where one brave lap over the mountain could settle the whole season."]
    ]
  },
  {
    championshipSlug: "club-racing-championship",
    series: "Club Racing Championship",
    racerSlugs: ["zoe-bennett", "caleb-ward", "riley-chen"],
    events: [
      ["road-america-club-opener", "Road America Club Opener", "road-america", "2026-02-14T18:30:00.000Z", "2026-02-14T20:00:00.000Z", RaceStatus.COMPLETED, "A grassroots opener where drafting packs and disciplined late braking defined the podium."],
      ["road-atlanta-club-sprint", "Road Atlanta Club Sprint", "road-atlanta", "2026-03-15T17:00:00.000Z", "2026-03-15T18:30:00.000Z", RaceStatus.COMPLETED, "A club sprint where traffic and exit speed through the final sector decided the race."],
      ["laguna-seca-club-cup", "Laguna Seca Club Cup", "weathertech-raceway-laguna-seca", "2026-04-12T18:00:00.000Z", "2026-04-12T19:30:00.000Z", RaceStatus.UPCOMING, "A West Coast round built around momentum, bravery, and smart race-long tire usage."],
      ["watkins-glen-club-classic", "Watkins Glen Club Classic", "watkins-glen-international", "2026-06-21T15:00:00.000Z", "2026-06-21T16:30:00.000Z", RaceStatus.UPCOMING, "A flowing club race where momentum through the fast section will shape every pass attempt."],
      ["daytona-club-finale", "Daytona Club Finale", "daytona-international-speedway-road-course", "2026-08-29T19:00:00.000Z", "2026-08-29T20:30:00.000Z", RaceStatus.UPCOMING, "A finale under the lights where banking exits and clean restarts could define the title."]
    ]
  }
];

const submissions = [
  {
    eventName: "Portland Late Summer Sprint",
    series: "Formula Sprint Series",
    eventDate: new Date("2026-08-16T20:00:00.000Z"),
    circuit: "Portland International Raceway",
    description: "A submitted sprint round intended to expand the late-summer West Coast swing.",
    sourceNotes: "Shared from regional organizer bulletin.",
    contactEmail: "serieswatch@example.com",
    status: RaceSubmissionStatus.PENDING,
    latitude: 45.5957,
    longitude: -122.6943
  },
  {
    eventName: "Sebring GT Showcase",
    series: "GT World Challenge",
    eventDate: new Date("2026-10-03T17:00:00.000Z"),
    circuit: "Sebring International Raceway",
    description: "A proposed GT event built around a fall endurance-style format.",
    sourceNotes: "Awaiting official event confirmation.",
    contactEmail: "gtupdates@example.com",
    status: RaceSubmissionStatus.PENDING,
    latitude: 27.4547,
    longitude: -81.3483
  },
  {
    eventName: "Suzuka Prototype Test Race",
    series: "Prototype Series",
    eventDate: new Date("2026-10-18T04:00:00.000Z"),
    circuit: "Suzuka Circuit",
    description: "A submitted Asia round intended to extend the prototype calendar.",
    sourceNotes: "Community paddock submission.",
    contactEmail: "prototypewatch@example.com",
    status: RaceSubmissionStatus.PENDING,
    latitude: 34.8431,
    longitude: 136.5419
  },
  {
    eventName: "Virginia Club Racing Doubleheader",
    series: "Club Racing Championship",
    eventDate: new Date("2026-09-05T15:00:00.000Z"),
    circuit: "Virginia International Raceway",
    description: "A two-race club weekend proposal submitted by regional organizers.",
    sourceNotes: "Regional series calendar request.",
    contactEmail: "clubseries@example.com",
    status: RaceSubmissionStatus.PENDING,
    latitude: 36.5622,
    longitude: -79.2061
  },
  {
    eventName: "Barcelona Touring Weekend",
    series: "Touring Masters",
    eventDate: new Date("2026-10-10T11:00:00.000Z"),
    circuit: "Circuit de Barcelona-Catalunya",
    description: "An approved touring weekend submission pending conversion into a full race record.",
    sourceNotes: "Approved from official circuit release.",
    contactEmail: "touringdesk@example.com",
    status: RaceSubmissionStatus.APPROVED,
    latitude: 41.5702,
    longitude: 2.2611
  },
  {
    eventName: "Silverstone Winter GT Final",
    series: "GT World Challenge",
    eventDate: new Date("2026-11-08T13:00:00.000Z"),
    circuit: "Silverstone Circuit",
    description: "An approved GT end-of-year round submitted for calendar expansion.",
    sourceNotes: "Approved by editorial review.",
    contactEmail: "gtcalendar@example.com",
    status: RaceSubmissionStatus.APPROVED,
    latitude: 52.0786,
    longitude: -1.0169
  },
  {
    eventName: "Desert Prototype Invitational",
    series: "Prototype Series",
    eventDate: new Date("2026-10-24T18:00:00.000Z"),
    circuit: "Unknown street course",
    description: "A rejected submission lacking venue confirmation and sufficient official sourcing.",
    sourceNotes: "Insufficient verification.",
    contactEmail: "rumorwatch@example.com",
    status: RaceSubmissionStatus.REJECTED,
    latitude: 0,
    longitude: 0
  }
];

async function main() {
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.trackedRace.deleteMany();
  await prisma.trackedRacer.deleteMany();
  await prisma.trackedTrack.deleteMany();
  await prisma.trackedChampionship.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.raceEntry.deleteMany();
  await prisma.raceSubmission.deleteMany();
  await prisma.race.deleteMany();
  await prisma.racer.deleteMany();
  await prisma.track.deleteMany();
  await prisma.championship.deleteMany();
  await prisma.user.deleteMany();

  const demoPasswordHash = await hash("password123", 10);

  const [demoUser, fanUser] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Hendrik",
        email: "hendrik@example.com",
        passwordHash: demoPasswordHash
      }
    }),
    prisma.user.create({
      data: {
        name: "Alex Rivera",
        email: "alex@example.com",
        passwordHash: demoPasswordHash
      }
    })
  ]);

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
        bio: racer.bio,
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

  const trackBySlug = Object.fromEntries(tracks.map((track) => [track.slug, track]));

  for (const championshipSchedule of raceCalendar) {
    for (const [index, event] of championshipSchedule.events.entries()) {
      const [slug, name, trackSlug, startDateRaw, endDateRaw, status, summary] = event;
      const track = trackBySlug[trackSlug];
      const startDate = new Date(startDateRaw);
      const endDate = new Date(endDateRaw);

      const race = await prisma.race.create({
        data: {
          slug,
          name,
          series: championshipSchedule.series,
          location: `${track.location}, ${track.country}`,
          ticketUrl:
            status === RaceStatus.UPCOMING && index % 2 === 0
              ? `${track.website?.replace(/\/$/, "") ?? ""}/tickets`
              : null,
          status,
          summary,
          startDate,
          endDate,
          latitude: track.latitude,
          longitude: track.longitude,
          championship: {
            connect: { slug: championshipSchedule.championshipSlug }
          },
          track: {
            connect: { slug: trackSlug }
          }
        }
      });
    }
  }

  const racerIdsBySlug = Object.fromEntries(
    (
      await prisma.racer.findMany({
        select: { id: true, slug: true }
      })
    ).map((racer) => [racer.slug, racer.id])
  );

  const raceIdsBySlug = Object.fromEntries(
    (
      await prisma.race.findMany({
        select: { id: true, slug: true, status: true }
      })
    ).map((race) => [race.slug, race])
  );

  for (const championshipSchedule of raceCalendar) {
    for (const [index, event] of championshipSchedule.events.entries()) {
      const [slug] = event;
      const race = raceIdsBySlug[slug];
      const entries = championshipSchedule.racerSlugs.map((racerSlug, racerIndex) => ({
        raceId: race.id,
        racerId: racerIdsBySlug[racerSlug],
        finishPosition:
          race.status === RaceStatus.COMPLETED
            ? ((racerIndex + index) % championshipSchedule.racerSlugs.length) + 1
            : null
      }));

      await prisma.raceEntry.createMany({ data: entries });
    }
  }

  await prisma.raceSubmission.createMany({ data: submissions });

  const trackedRaceSlugs = [
    "silverstone-sprint-classic",
    "spa-gt-enduro",
    "fuji-six-hour",
    "laguna-seca-club-cup"
  ];

  await prisma.trackedRace.createMany({
    data: [
      ...trackedRaceSlugs.slice(0, 2).map((slug) => ({
        userId: demoUser.id,
        raceId: raceIdsBySlug[slug].id
      })),
      ...trackedRaceSlugs.slice(2).map((slug) => ({
        userId: fanUser.id,
        raceId: raceIdsBySlug[slug].id
      }))
    ]
  });

  await prisma.trackedRacer.createMany({
    data: [
      { userId: demoUser.id, racerId: racerIdsBySlug["lena-volkov"] },
      { userId: demoUser.id, racerId: racerIdsBySlug["amelia-hart"] },
      { userId: fanUser.id, racerId: racerIdsBySlug["akira-matsuo"] },
      { userId: fanUser.id, racerId: racerIdsBySlug["zoe-bennett"] }
    ]
  });

  const trackIdsBySlug = Object.fromEntries(
    (
      await prisma.track.findMany({
        select: { id: true, slug: true }
      })
    ).map((track) => [track.slug, track.id])
  );

  await prisma.trackedTrack.createMany({
    data: [
      { userId: demoUser.id, trackId: trackIdsBySlug["silverstone-circuit"] },
      { userId: demoUser.id, trackId: trackIdsBySlug["weathertech-raceway-laguna-seca"] },
      { userId: fanUser.id, trackId: trackIdsBySlug["fuji-speedway"] },
      { userId: fanUser.id, trackId: trackIdsBySlug["spa-francorchamps"] }
    ]
  });

  const championshipIdsBySlug = Object.fromEntries(
    (
      await prisma.championship.findMany({
        select: { id: true, slug: true }
      })
    ).map((championship) => [championship.slug, championship.id])
  );

  await prisma.trackedChampionship.createMany({
    data: [
      { userId: demoUser.id, championshipId: championshipIdsBySlug["formula-sprint-series"] },
      { userId: demoUser.id, championshipId: championshipIdsBySlug["gt-world-challenge"] },
      { userId: fanUser.id, championshipId: championshipIdsBySlug["prototype-series"] },
      { userId: fanUser.id, championshipId: championshipIdsBySlug["endurance-cup"] }
    ]
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: demoUser.id,
        type: NotificationType.RACE_STARTING_SOON,
        entityId: raceIdsBySlug["silverstone-sprint-classic"].id,
        read: false
      },
      {
        userId: demoUser.id,
        type: NotificationType.NEW_RACE_IN_FOLLOWED_CHAMPIONSHIP,
        entityId: championshipIdsBySlug["gt-world-challenge"],
        read: true
      },
      {
        userId: fanUser.id,
        type: NotificationType.RESULT_AVAILABLE,
        entityId: raceIdsBySlug["fuji-six-hour"].id,
        read: false
      }
    ]
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
