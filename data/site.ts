export type Coordinates = {
  lat: number;
  lng: number;
};

export type RaceStatus = "Live" | "Upcoming" | "Completed";

export type Championship = {
  slug: string;
  name: string;
  category: string;
  region: string;
  season: string;
  description: string;
  image: string;
  accent: string;
  raceCount: number;
  trackCount: number;
  nextRace: string;
};

export type Race = {
  slug: string;
  name: string;
  series: string;
  championshipSlug: string;
  date: string;
  startDate: string;
  endDate: string;
  location: string;
  trackSlug: string;
  status: RaceStatus;
  summary: string;
  coordinates: Coordinates;
};

export type Racer = {
  slug: string;
  name: string;
  team: string;
  nationality: string;
  number: string;
  championships: number;
  victories: number;
  podiums: number;
  image: string;
  vehicle: string;
  verified: boolean;
  recentResults: Array<{ event: string; position: string; delta: string }>;
};

export type Track = {
  slug: string;
  name: string;
  country: string;
  length: string;
  turns: number;
  lapRecord: string;
  image: string;
  history: string;
  coordinates: Coordinates;
};

export type RaceViewMode = "list" | "calendar" | "timeline" | "map";

export const championshipSummary = [
  { label: "Active Championships", value: "12", detail: "Formula Alpha, GT Masters, Endurance" },
  { label: "Live Sessions", value: "03", detail: "Telemetry streaming from Europe and Asia" },
  { label: "Verified Contributors", value: "248", detail: "Trusted paddock and editorial members" }
];

export const championships: Championship[] = [
  {
    slug: "formula-alpha",
    name: "Formula Alpha",
    category: "Open Wheel",
    region: "Global",
    season: "2026 Season",
    description: "Flagship single-seater championship with city circuits, technical venues, and title pressure every weekend.",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1400&q=80",
    accent: "from-blue-500/30 to-cyan-300/15",
    raceCount: 16,
    trackCount: 11,
    nextRace: "Monte Corsa Grand Prix"
  },
  {
    slug: "gt-masters",
    name: "GT Masters",
    category: "Grand Touring",
    region: "Europe",
    season: "2026 Season",
    description: "Multi-class GT calendar built around packed grids, endurance strategy, and fan-favorite circuits.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    accent: "from-amber-400/25 to-orange-200/15",
    raceCount: 10,
    trackCount: 8,
    nextRace: "Silverstone 1000"
  },
  {
    slug: "hyper-prototype",
    name: "Hyper Prototype",
    category: "Prototype",
    region: "Asia Pacific",
    season: "2026 Season",
    description: "A technical prototype series where nighttime strategy, energy deployment, and precision pit work decide everything.",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80",
    accent: "from-fuchsia-400/25 to-pink-200/10",
    raceCount: 9,
    trackCount: 7,
    nextRace: "Fuji Night Run"
  }
];

export const races: Race[] = [
  {
    slug: "monte-corsa-grand-prix",
    name: "Monte Corsa Grand Prix",
    series: "Formula Alpha",
    championshipSlug: "formula-alpha",
    date: "April 14, 2026",
    startDate: "2026-04-14T14:00:00.000Z",
    endDate: "2026-04-14T16:00:00.000Z",
    location: "Monaco Coast, MC",
    trackSlug: "circuit-de-monaco",
    status: "Live",
    summary: "Street-circuit precision under late-afternoon light with strategy windows closing fast.",
    coordinates: { lat: 43.7347, lng: 7.4206 }
  },
  {
    slug: "silverstone-1000",
    name: "Silverstone 1000",
    series: "GT Masters",
    championshipSlug: "gt-masters",
    date: "May 02, 2026",
    startDate: "2026-05-02T10:30:00.000Z",
    endDate: "2026-05-02T19:00:00.000Z",
    location: "Silverstone, UK",
    trackSlug: "silverstone-circuit",
    status: "Upcoming",
    summary: "A long-form endurance sprint with mixed weather forecasts and dense traffic.",
    coordinates: { lat: 52.0786, lng: -1.0169 }
  },
  {
    slug: "fuji-night-run",
    name: "Fuji Night Run",
    series: "Hyper Prototype",
    championshipSlug: "hyper-prototype",
    date: "March 21, 2026",
    startDate: "2026-03-21T09:00:00.000Z",
    endDate: "2026-03-21T12:00:00.000Z",
    location: "Oyama, JP",
    trackSlug: "fuji-speedway",
    status: "Completed",
    summary: "A floodlit tactical race defined by tire temperatures and late safety-car drama.",
    coordinates: { lat: 35.3714, lng: 138.9276 }
  }
];

export const racers: Racer[] = [
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
    recentResults: [
      { event: "Monte Corsa Grand Prix", position: "P2", delta: "+2.144s" },
      { event: "Fuji Night Run", position: "P1", delta: "Winner" },
      { event: "Catalunya Sprint", position: "P3", delta: "+5.091s" }
    ]
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
    recentResults: [
      { event: "Silverstone 1000", position: "Grid 4", delta: "Qualifying" },
      { event: "Sebring Twelve", position: "P6", delta: "+24.220s" },
      { event: "Monza Enduro", position: "P2", delta: "+0.904s" }
    ]
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
    recentResults: [
      { event: "Fuji Night Run", position: "P4", delta: "+8.113s" },
      { event: "Bahrain Dusk Run", position: "P1", delta: "Winner" },
      { event: "Doha Technical Test", position: "P5", delta: "+0.711s" }
    ]
  }
];

export const tracks: Track[] = [
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
    coordinates: { lat: 43.7347, lng: 7.4206 }
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
    coordinates: { lat: 52.0786, lng: -1.0169 }
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
    history: "Volcanic backdrop, heavy braking zones, and long straights that amplify power deployment.",
    coordinates: { lat: 35.3714, lng: 138.9276 }
  }
];

export const trackedItems = {
  userName: "Hendrik",
  races: ["silverstone-1000", "monte-corsa-grand-prix"],
  racers: ["lena-volkov", "mateo-silva"],
  tracks: ["silverstone-circuit", "circuit-de-monaco"],
  championships: ["formula-alpha", "gt-masters"]
};

export const raceViewModes: Array<{ value: RaceViewMode; label: string; description: string }> = [
  { value: "list", label: "List", description: "Card-based race discovery." },
  { value: "calendar", label: "Calendar", description: "Calendar-style race planning." },
  { value: "timeline", label: "Timeline", description: "Chronological weekend flow." },
  { value: "map", label: "Map", description: "Geographic race coverage." }
];

export const submitFields = [
  { label: "Event Name", hint: "Official race title" },
  { label: "Series", hint: "Formula Alpha, GT Masters, etc." },
  { label: "Event Date", hint: "YYYY-MM-DD" },
  { label: "Circuit", hint: "Venue or street course" }
];

export const quickFilters = ["Upcoming", "Tracked Championships", "Historic Tracks"];
